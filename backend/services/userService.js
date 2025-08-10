const fs = require('fs').promises;
const path = require('path');
const { hashPassword, comparePassword, validatePassword, generate2FASecret, verify2FAToken, generateToken } = require('../utils/auth');
const { sendPasswordResetEmail, sendPasswordChangedEmail, send2FAEnabledEmail, send2FADisabledEmail } = require('../utils/email');
const config = require('../config/auth');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const PASSWORD_RESET_TOKENS = new Map(); // In production, use Redis or database

// Load users from JSON file
const loadUsers = async () => {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create default admin user
    if (error.code === 'ENOENT') {
      const defaultPassword = await hashPassword(config.admin.password);
      const defaultUsers = {
        admin: {
          username: config.admin.username,
          passwordHash: defaultPassword,
          email: config.admin.email,
          role: 'admin',
          twoFactorEnabled: false,
          twoFactorSecret: null,
          createdAt: new Date().toISOString(),
          lastLogin: null
        }
      };
      await saveUsers(defaultUsers);
      return defaultUsers;
    }
    throw error;
  }
};

// Save users to JSON file
const saveUsers = async (users) => {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

// Get user by username
const getUserByUsername = async (username) => {
  const users = await loadUsers();
  return users[username.toLowerCase()] || null;
};

// Get user by email
const getUserByEmail = async (email) => {
  const users = await loadUsers();
  return Object.values(users).find(user => user.email === email) || null;
};

// Create or update user
const saveUser = async (username, userData) => {
  const users = await loadUsers();
  users[username.toLowerCase()] = {
    ...users[username.toLowerCase()],
    ...userData,
    username: username.toLowerCase()
  };
  await saveUsers(users);
  return users[username.toLowerCase()];
};

// Authentication functions
const authenticateUser = async (username, password) => {
  const user = await getUserByUsername(username);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Update last login
  await saveUser(username, { lastLogin: new Date().toISOString() });

  return user;
};

const generateAuthToken = (user) => {
  return generateToken({
    username: user.username,
    role: user.role,
    email: user.email
  });
};

// Password management
const changePassword = async (username, currentPassword, newPassword) => {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isValidCurrentPassword = await comparePassword(currentPassword, user.passwordHash);
  if (!isValidCurrentPassword) {
    throw new Error('Current password is incorrect');
  }

  // Validate new password
  const validation = validatePassword(newPassword);
  if (!validation.isValid) {
    throw new Error(`Password validation failed: ${validation.errors.join(', ')}`);
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);
  
  // Update user
  await saveUser(username, { passwordHash: newPasswordHash });

  // Send email notification
  if (user.email) {
    await sendPasswordChangedEmail(user.email, user.username);
  }

  return { success: true, message: 'Password changed successfully' };
};

// Password reset
const requestPasswordReset = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    // Don't reveal if email exists or not
    return { success: true, message: 'If the email exists, a reset link has been sent' };
  }

  // Generate reset token
  const resetToken = require('crypto').randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  PASSWORD_RESET_TOKENS.set(resetToken, {
    username: user.username,
    expiresAt
  });

  // Generate reset link
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  // Send email
  await sendPasswordResetEmail(user.email, user.username, resetLink);

  return { success: true, message: 'If the email exists, a reset link has been sent' };
};

const resetPassword = async (resetToken, newPassword) => {
  const resetData = PASSWORD_RESET_TOKENS.get(resetToken);
  
  if (!resetData) {
    throw new Error('Invalid or expired reset token');
  }

  if (new Date() > resetData.expiresAt) {
    PASSWORD_RESET_TOKENS.delete(resetToken);
    throw new Error('Reset token has expired');
  }

  // Validate new password
  const validation = validatePassword(newPassword);
  if (!validation.isValid) {
    throw new Error(`Password validation failed: ${validation.errors.join(', ')}`);
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);
  
  // Update user
  await saveUser(resetData.username, { passwordHash: newPasswordHash });

  // Clean up token
  PASSWORD_RESET_TOKENS.delete(resetToken);

  return { success: true, message: 'Password reset successfully' };
};

// 2FA management
const setup2FA = async (username) => {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.twoFactorEnabled) {
    throw new Error('2FA is already enabled');
  }

  const secret = generate2FASecret();
  
  // Save secret temporarily (not enabled yet)
  await saveUser(username, { twoFactorSecret: secret.base32 });

  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url
  };
};

const enable2FA = async (username, token) => {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.twoFactorSecret) {
    throw new Error('2FA setup not initiated');
  }

  // Verify token
  const isValid = verify2FAToken(token, user.twoFactorSecret);
  if (!isValid) {
    throw new Error('Invalid 2FA token');
  }

  // Enable 2FA
  await saveUser(username, { twoFactorEnabled: true });

  // Send email notification
  if (user.email) {
    await send2FAEnabledEmail(user.email, user.username);
  }

  return { success: true, message: '2FA enabled successfully' };
};

const disable2FA = async (username, token) => {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.twoFactorEnabled) {
    throw new Error('2FA is not enabled');
  }

  // Verify token
  const isValid = verify2FAToken(token, user.twoFactorSecret);
  if (!isValid) {
    throw new Error('Invalid 2FA token');
  }

  // Disable 2FA
  await saveUser(username, { 
    twoFactorEnabled: false, 
    twoFactorSecret: null 
  });

  // Send email notification
  if (user.email) {
    await send2FADisabledEmail(user.email, user.username);
  }

  return { success: true, message: '2FA disabled successfully' };
};

const verify2FA = async (username, token) => {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    throw new Error('2FA is not enabled for this user');
  }

  const isValid = verify2FAToken(token, user.twoFactorSecret);
  if (!isValid) {
    throw new Error('Invalid 2FA token');
  }

  return { success: true };
};

// Update user profile
const updateUserProfile = async (username, updates) => {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }

  // Only allow certain fields to be updated
  const allowedUpdates = ['email'];
  const filteredUpdates = {};
  
  for (const [key, value] of Object.entries(updates)) {
    if (allowedUpdates.includes(key)) {
      filteredUpdates[key] = value;
    }
  }

  await saveUser(username, filteredUpdates);
  return { success: true, message: 'Profile updated successfully' };
};

module.exports = {
  getUserByUsername,
  getUserByEmail,
  authenticateUser,
  generateAuthToken,
  changePassword,
  requestPasswordReset,
  resetPassword,
  setup2FA,
  enable2FA,
  disable2FA,
  verify2FA,
  updateUserProfile,
};

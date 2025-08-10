const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const config = require('../config/auth');

// JWT Functions
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Password Functions
const hashPassword = async (password) => {
  return await bcrypt.hash(password, config.password.bcryptRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < config.password.minLength) {
    errors.push(`Password must be at least ${config.password.minLength} characters long`);
  }
  
  if (config.password.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (config.password.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (config.password.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (config.password.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 2FA Functions
const generate2FASecret = () => {
  return speakeasy.generateSecret({
    name: config.totp.issuer,
    issuer: config.totp.issuer,
    algorithm: config.totp.algorithm,
    digits: config.totp.digits,
    period: config.totp.period,
  });
};

const generate2FAQRCode = async (secret, label) => {
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: label,
    issuer: config.totp.issuer,
    algorithm: config.totp.algorithm,
    digits: config.totp.digits,
    period: config.totp.period,
  });
  
  return await qrcode.toDataURL(otpauthUrl);
};

const verify2FAToken = (token, secret) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: config.totp.window,
    algorithm: config.totp.algorithm,
    digits: config.totp.digits,
    period: config.totp.period,
  });
};

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  validatePassword,
  generate2FASecret,
  generate2FAQRCode,
  verify2FAToken,
  authenticateToken,
  requireRole,
};

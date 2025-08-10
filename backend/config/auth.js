require('dotenv').config();

module.exports = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  // Password Configuration
  password: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },

  // 2FA Configuration
  totp: {
    issuer: process.env.TOTP_ISSUER || 'Eruptible PM',
    algorithm: process.env.TOTP_ALGORITHM || 'SHA1',
    digits: parseInt(process.env.TOTP_DIGITS) || 6,
    period: parseInt(process.env.TOTP_PERIOD) || 30,
    window: 1, // Allow 1 period before/after for clock skew
  },

  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'noreply@eruptible.co.uk',
    secure: false, // true for 465, false for other ports
  },

  // Password Reset Configuration
  passwordReset: {
    expiresIn: process.env.PASSWORD_RESET_EXPIRES_IN || '1h',
  },

  // Admin Configuration
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'password',
    email: process.env.ADMIN_EMAIL || 'admin@eruptible.co.uk',
  },
};

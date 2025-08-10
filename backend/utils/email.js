const nodemailer = require('nodemailer');
const config = require('../config/auth');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
};

// Email templates
const emailTemplates = {
  passwordReset: (username, resetLink) => ({
    subject: 'Password Reset Request - Eruptible PM',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${username},</p>
        <p>We received a request to reset your password for your Eruptible PM account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetLink}">${resetLink}</a>
        </p>
      </div>
    `,
    text: `
      Password Reset Request - Eruptible PM
      
      Hello ${username},
      
      We received a request to reset your password for your Eruptible PM account.
      
      Click the link below to reset your password:
      ${resetLink}
      
      If you didn't request this password reset, please ignore this email.
      This link will expire in 1 hour for security reasons.
    `
  }),

  passwordChanged: (username) => ({
    subject: 'Password Changed - Eruptible PM',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Changed Successfully</h2>
        <p>Hello ${username},</p>
        <p>Your password for your Eruptible PM account has been successfully changed.</p>
        <p>If you did not make this change, please contact support immediately.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message from Eruptible PM.
        </p>
      </div>
    `,
    text: `
      Password Changed - Eruptible PM
      
      Hello ${username},
      
      Your password for your Eruptible PM account has been successfully changed.
      
      If you did not make this change, please contact support immediately.
    `
  }),

  twoFactorEnabled: (username) => ({
    subject: 'Two-Factor Authentication Enabled - Eruptible PM',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Two-Factor Authentication Enabled</h2>
        <p>Hello ${username},</p>
        <p>Two-factor authentication has been successfully enabled for your Eruptible PM account.</p>
        <p>Your account is now more secure. You will need to enter a 6-digit code from your authenticator app when logging in.</p>
        <p>If you did not enable this feature, please contact support immediately.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message from Eruptible PM.
        </p>
      </div>
    `,
    text: `
      Two-Factor Authentication Enabled - Eruptible PM
      
      Hello ${username},
      
      Two-factor authentication has been successfully enabled for your Eruptible PM account.
      
      Your account is now more secure. You will need to enter a 6-digit code from your authenticator app when logging in.
      
      If you did not enable this feature, please contact support immediately.
    `
  }),

  twoFactorDisabled: (username) => ({
    subject: 'Two-Factor Authentication Disabled - Eruptible PM',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Two-Factor Authentication Disabled</h2>
        <p>Hello ${username},</p>
        <p>Two-factor authentication has been disabled for your Eruptible PM account.</p>
        <p>Your account is now less secure. Consider re-enabling 2FA for better protection.</p>
        <p>If you did not disable this feature, please contact support immediately.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message from Eruptible PM.
        </p>
      </div>
    `,
    text: `
      Two-Factor Authentication Disabled - Eruptible PM
      
      Hello ${username},
      
      Two-factor authentication has been disabled for your Eruptible PM account.
      
      Your account is now less secure. Consider re-enabling 2FA for better protection.
      
      If you did not disable this feature, please contact support immediately.
    `
  }),
};

// Send email function
const sendEmail = async (to, template, data = {}) => {
  if (!config.email.user || !config.email.pass) {
    console.warn('Email configuration not set up. Skipping email send.');
    return { success: false, message: 'Email not configured' };
  }

  try {
    const transporter = createTransporter();
    const emailContent = emailTemplates[template](...Object.values(data));
    
    const mailOptions = {
      from: config.email.from,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

// Specific email functions
const sendPasswordResetEmail = async (email, username, resetLink) => {
  return await sendEmail(email, 'passwordReset', [username, resetLink]);
};

const sendPasswordChangedEmail = async (email, username) => {
  return await sendEmail(email, 'passwordChanged', [username]);
};

const send2FAEnabledEmail = async (email, username) => {
  return await sendEmail(email, 'twoFactorEnabled', [username]);
};

const send2FADisabledEmail = async (email, username) => {
  return await sendEmail(email, 'twoFactorDisabled', [username]);
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  send2FAEnabledEmail,
  send2FADisabledEmail,
};

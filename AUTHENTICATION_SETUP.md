# Authentication System Setup Guide

This guide will help you set up the new secure authentication system for your Eruptible PM Dashboard.

## 🚀 Features Implemented

- **Secure JWT Authentication** with proper token management
- **Two-Factor Authentication (2FA)** using TOTP (Time-based One-Time Password)
- **Password Management** with secure hashing and validation
- **Email Recovery System** for password resets
- **Role-based Access Control** (Admin/Client)
- **Secure Password Requirements** (8+ chars, uppercase, lowercase, numbers, special chars)

## 📋 Prerequisites

1. **Email Service Account** (Gmail, SendGrid, or similar)
2. **Domain for your application** (for email links)
3. **Access to your VPS** where the application is deployed

## 🔧 Environment Configuration

### 1. Update your `.env` file

Add these new environment variables to your `backend/.env` file:

```bash
# Existing Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
PROJECTS_TABLE=your_projects_table_name
CLIENTS_TABLE=your_clients_table_name

# Admin Authentication (Update these!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
ADMIN_EMAIL=admin@eruptible.co.uk

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters
JWT_EXPIRES_IN=24h

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@eruptible.co.uk

# 2FA Configuration
TOTP_ISSUER=Eruptible PM
TOTP_ALGORITHM=SHA1
TOTP_DIGITS=6
TOTP_PERIOD=30

# Security Settings
BCRYPT_ROUNDS=12
PASSWORD_RESET_EXPIRES_IN=1h

# Frontend URL (for password reset links)
FRONTEND_URL=https://app.chateruptible.co.uk
```

### 2. Email Service Setup

#### Option A: Gmail (Recommended for testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASS`

#### Option B: SendGrid (Recommended for production)

1. **Create a SendGrid account**
2. **Create an API Key** with "Mail Send" permissions
3. **Update email configuration**:
   ```bash
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=your_sendgrid_api_key
   ```

#### Option C: Other SMTP Providers

Most SMTP providers will work. Update the configuration accordingly:
```bash
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_username
EMAIL_PASS=your_password
```

## 🔐 Security Configuration

### 1. Generate a Secure JWT Secret

Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

### 2. Set a Strong Admin Password

Choose a strong password that meets the requirements:
- At least 8 characters
- Contains uppercase and lowercase letters
- Contains numbers
- Contains special characters

Example: `MySecurePass123!`

## 🚀 Deployment Steps

### 1. Install New Dependencies

On your VPS, navigate to your project directory and install the new dependencies:

```bash
cd /root/eruptible-pm-stack/backend
npm install
```

### 2. Update Environment Variables

Edit your `.env` file with the new configuration:
```bash
nano backend/.env
```

### 3. Rebuild and Deploy

```bash
# Stop current containers
docker-compose down

# Rebuild with new dependencies
docker-compose up -d --build

# Check logs for any errors
docker logs eruptible-pm-backend --tail 50
```

### 4. Test the Setup

1. **Test Login**: Try logging in with admin credentials
2. **Test 2FA Setup**: Go to Settings → Admin Security → Enable 2FA
3. **Test Password Reset**: Use the "Forgot Password" link

## 🔧 Testing the Authentication System

### 1. Test Admin Login

1. Go to your application: `https://app.chateruptible.co.uk`
2. Login with admin credentials
3. Verify you can access the dashboard

### 2. Test 2FA Setup

1. Go to **Settings** → **Admin Security**
2. Toggle **Two-Factor Authentication** to ON
3. Scan the QR code with Google Authenticator or Authy
4. Enter the 6-digit code to verify
5. Save the settings

### 3. Test 2FA Login

1. Logout and login again
2. You should be prompted for a 2FA code
3. Enter the code from your authenticator app

### 4. Test Password Reset

1. Click "Forgot your password?" on the login page
2. Enter your admin email
3. Check your email for the reset link
4. Click the link and set a new password

### 5. Test Password Change

1. Go to **Settings** → **Admin Security**
2. Enter current password and new password
3. Verify the change works

## 🛠️ Troubleshooting

### Common Issues

#### 1. Email Not Sending

**Symptoms**: Password reset emails not received

**Solutions**:
- Check email configuration in `.env`
- Verify SMTP credentials
- Check firewall settings (port 587)
- Test with a different email provider

#### 2. 2FA Not Working

**Symptoms**: Can't scan QR code or verify codes

**Solutions**:
- Check TOTP configuration in `.env`
- Ensure system time is correct on VPS
- Try a different authenticator app

#### 3. JWT Token Issues

**Symptoms**: Login works but subsequent requests fail

**Solutions**:
- Verify JWT_SECRET is set correctly
- Check JWT_EXPIRES_IN format
- Ensure frontend is sending Authorization header

#### 4. Password Validation Errors

**Symptoms**: Password change fails with validation errors

**Solutions**:
- Ensure password meets all requirements
- Check BCRYPT_ROUNDS setting
- Verify password validation logic

### Debug Commands

```bash
# Check backend logs
docker logs eruptible-pm-backend --tail 100

# Check if email is configured
docker exec eruptible-pm-backend node -e "
const config = require('./config/auth');
console.log('Email configured:', !!config.email.user);
"

# Test JWT token generation
docker exec eruptible-pm-backend node -e "
const { generateToken } = require('./utils/auth');
console.log('JWT test:', generateToken({test: 'data'}));
"
```

## 🔒 Security Best Practices

1. **Use HTTPS**: Always use HTTPS in production
2. **Strong Passwords**: Enforce strong password policies
3. **Regular Updates**: Keep dependencies updated
4. **Monitor Logs**: Regularly check application logs
5. **Backup Data**: Regularly backup user data
6. **Rate Limiting**: Consider implementing rate limiting
7. **Session Management**: Implement proper session cleanup

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the application logs
3. Verify all environment variables are set correctly
4. Test with a fresh deployment

## 🎉 Next Steps

Once authentication is working:

1. **Test with real users**
2. **Set up monitoring**
3. **Configure backup strategies**
4. **Consider additional security measures** (rate limiting, IP whitelisting, etc.)

Your authentication system is now production-ready! 🚀

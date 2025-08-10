
const express = require('express');
const router = express.Router();
const airtableService = require('../services/airtableService');
const userService = require('../services/userService');
const { authenticateToken, requireRole } = require('../utils/auth');

// --- Health Check ---
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Authentication Routes ---

// Login (supports both admin and client users)
router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // First try to authenticate as admin user
        try {
            const user = await userService.authenticateUser(username, password);
            const token = userService.generateAuthToken(user);
            
            res.json({
                token,
                user: {
                    username: user.username,
                    role: user.role,
                    email: user.email,
                    twoFactorEnabled: user.twoFactorEnabled
                },
                requires2FA: user.twoFactorEnabled
            });
        } catch (adminError) {
            // If admin auth fails, try client authentication
            const result = await airtableService.loginUser(username, password);
            res.json({
                token: result.token,
                user: result.user,
                requires2FA: false // Clients don't have 2FA for now
            });
        }
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

// 2FA Verification
router.post('/auth/verify-2fa', async (req, res) => {
    const { username, token } = req.body;
    
    if (!username || !token) {
        return res.status(400).json({ message: 'Username and 2FA token are required' });
    }

    try {
        await userService.verify2FA(username, token);
        const user = await userService.getUserByUsername(username);
        const authToken = userService.generateAuthToken(user);
        
        res.json({
            token: authToken,
            user: {
                username: user.username,
                role: user.role,
                email: user.email,
                twoFactorEnabled: user.twoFactorEnabled
            }
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

// Setup 2FA
router.post('/auth/setup-2fa', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { username } = req.user;
        const result = await userService.setup2FA(username);
        
        res.json({
            secret: result.secret,
            qrCode: result.qrCode
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Enable 2FA
router.post('/auth/enable-2fa', authenticateToken, requireRole(['admin']), async (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        return res.status(400).json({ message: '2FA token is required' });
    }

    try {
        const { username } = req.user;
        const result = await userService.enable2FA(username, token);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Disable 2FA
router.post('/auth/disable-2fa', authenticateToken, requireRole(['admin']), async (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        return res.status(400).json({ message: '2FA token is required' });
    }

    try {
        const { username } = req.user;
        const result = await userService.disable2FA(username, token);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Change Password
router.post('/auth/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
    }

    try {
        const { username } = req.user;
        const result = await userService.changePassword(username, currentPassword, newPassword);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Request Password Reset
router.post('/auth/request-password-reset', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const result = await userService.requestPasswordReset(email);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Reset Password
router.post('/auth/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Reset token and new password are required' });
    }

    try {
        const result = await userService.resetPassword(token, newPassword);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update User Profile
router.put('/auth/profile', authenticateToken, async (req, res) => {
    const { email } = req.body;
    
    try {
        const { username } = req.user;
        const result = await userService.updateUserProfile(username, { email });
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get User Profile
router.get('/auth/profile', authenticateToken, async (req, res) => {
    try {
        const { username } = req.user;
        const user = await userService.getUserByUsername(username);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Don't send sensitive information
        res.json({
            username: user.username,
            email: user.email,
            role: user.role,
            twoFactorEnabled: user.twoFactorEnabled,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// --- Airtable Integration Routes (existing functionality) ---

router.get('/projects', async (req, res) => {
    try {
        const projects = await airtableService.fetchAllRecords(process.env.PROJECTS_TABLE);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/clients', async (req, res) => {
    try {
        const clients = await airtableService.fetchAllRecords(process.env.CLIENTS_TABLE);
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Protected Routes ---

// Example protected route
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ 
        message: 'This is a protected route', 
        user: req.user 
    });
});

// Admin-only route
router.get('/admin-only', authenticateToken, requireRole(['admin']), (req, res) => {
    res.json({ 
        message: 'This is an admin-only route', 
        user: req.user 
    });
});

module.exports = router;

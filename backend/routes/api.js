
const express = require('express');
const router = express.Router();
const { getProjectsAndClients, updateRecord, loginUser } = require('../services/airtableService');
const { getAdminCredentials, saveAdminCredentials } = require('../services/adminService');
const Airtable = require('airtable');

// --- Health Check Route ---

router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Airtable connectivity check
router.get('/airtable/health', async (req, res) => {
    try {
        const apiKey = process.env.AIRTABLE_API_KEY;
        const baseId = process.env.AIRTABLE_BASE_ID;
        if (!apiKey || !baseId) {
            return res.json({ connected: false, reason: 'Missing API key or base id' });
        }
        const base = new Airtable({ apiKey }).base(baseId);
        // Try a lightweight read with 1 record from any provided table
        const tableName = process.env.PROJECTS_TABLE || process.env.CLIENTS_TABLE || process.env.DELIVERABLES_TABLE;
        if (!tableName) {
            return res.json({ connected: false, reason: 'No table configured' });
        }
        await base(tableName).select({ maxRecords: 1 }).firstPage();
        return res.json({ connected: true });
    } catch (err) {
        return res.json({ connected: false, reason: err.message });
    }
});

// --- Data Fetching Routes ---

// Endpoint to get all initial data (projects, clients, deliverables)
router.get('/data', async (req, res) => {
    try {
        const { projects, clients } = await getProjectsAndClients();
        res.json({ projects, clients });
    } catch (error) {
        console.error('Error fetching data from Airtable:', error);
        res.status(500).json({ message: 'Failed to fetch data from Airtable.', details: error.message });
    }
});

// --- Data Mutation Routes ---

router.patch('/deliverables/:recordId', async (req, res) => {
    try {
        const { recordId } = req.params;
        const { fields } = req.body; // e.g., { Status: 'Done' }
        await updateRecord(process.env.DELIVERABLES_TABLE, recordId, fields);
        res.status(200).json({ message: 'Deliverable updated successfully' });
    } catch (error) {
        console.error('Error updating deliverable:', error);
        res.status(500).json({ message: 'Failed to update deliverable.', details: error.message });
    }
});

router.patch('/clients/:recordId', async (req, res) => {
    try {
        const { recordId } = req.params;
        const { fields } = req.body;
        await updateRecord(process.env.CLIENTS_TABLE, recordId, fields);
        res.status(200).json({ message: 'Client updated successfully' });
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ message: 'Failed to update client.', details: error.message });
    }
});

// --- Auth Routes ---

router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check for locally saved admin override first
        const savedAdmin = await getAdminCredentials();
        if (savedAdmin && username.toLowerCase() === (savedAdmin.username || '').toLowerCase() && password === savedAdmin.password) {
            return res.json({ token: `fake-jwt-for-${username}-${Date.now()}`, user: { username: savedAdmin.username, role: 'admin' } });
        }

        const result = await loginUser(username, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

// Password reset request stub (always respond 200 to avoid account enumeration)
router.post('/auth/request-password-reset', async (req, res) => {
    // const { identifier } = req.body; // email or username
    // TODO: Implement email sending via configured provider
    res.json({ message: 'If an account exists, a reset link has been sent.' });
});

// Save admin credentials (username, password, recoveryEmail) locally
router.put('/auth/admin', async (req, res) => {
    try {
        const { username, password, recoveryEmail } = req.body || {};
        if (!username) return res.status(400).json({ message: 'username is required' });
        const current = (await getAdminCredentials()) || {};
        const updated = { ...current, username, recoveryEmail };
        if (password) updated.password = password;
        await saveAdminCredentials(updated);
        res.json({ message: 'Admin credentials updated' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


module.exports = router;

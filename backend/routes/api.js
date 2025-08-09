
const express = require('express');
const router = express.Router();
const { getProjectsAndClients, updateRecord, loginUser } = require('../services/airtableService');

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

// --- Auth Route ---

router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await loginUser(username, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});


module.exports = router;

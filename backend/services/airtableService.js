
const Airtable = require('airtable');

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

const fetchAllRecords = async (tableName) => {
    const records = await base(tableName).select().all();
    return records.map(record => ({ id: record.id, ...record.fields }));
};

const getProjectsAndClients = async () => {
    const [rawProjects, rawClients, rawDeliverables] = await Promise.all([
        fetchAllRecords(process.env.PROJECTS_TABLE),
        fetchAllRecords(process.env.CLIENTS_TABLE),
        fetchAllRecords(process.env.DELIVERABLES_TABLE),
    ]);

    // Map raw Airtable data to the structure the frontend expects
    const clients = rawClients.map(c => ({
        recordId: c.id,
        id: c.id,
        name: c.Name,
        website: c['Company Website'],
        logoUrl: c.Logo?.[0]?.url,
        dashboardTitle: c['Dashboard Title'],
        colorScheme: c['Color Scheme'],
        clientUsername: c['Client Username'],
    }));

    const deliverables = rawDeliverables.map(d => ({
        recordId: d.id,
        id: d.id,
        name: d.Deliverable,
        description: d.Description,
        status: d.Status,
        phase: d.Phase,
        project_id: d.Project,
    }));

    const clientsById = new Map(clients.map(c => [c.recordId, c]));
    const deliverablesByProjectId = deliverables.reduce((acc, d) => {
        const projectId = d.project_id?.[0];
        if (projectId) {
            if (!acc[projectId]) acc[projectId] = [];
            acc[projectId].push(d);
        }
        return acc;
    }, {});

    const projects = rawProjects.map(p => ({
        recordId: p.id,
        id: p.id,
        name: p.Project,
        projectGoal: p['Project Goal'],
        status: p.Status,
        client_id: p.Company,
        client: clientsById.get(p.Company?.[0]) || { id: 'unknown', name: 'Unknown Client' },
        deliverables: deliverablesByProjectId[p.id] || [],
    }));

    return { projects, clients };
};

const updateRecord = async (tableName, recordId, fields) => {
    await base(tableName).update([{ id: recordId, fields }]);
};

const loginUser = async (username, password) => {
    // Client login check (admin login handled separately in routes)
    const clients = await fetchAllRecords(process.env.CLIENTS_TABLE);
    const clientUser = clients.find(c => c['Client Username']?.toLowerCase() === username.toLowerCase());

    if (clientUser && password === 'password') { // Generic password for all clients
        return {
            token: `fake-jwt-for-${clientUser['Client Username']}-${Date.now()}`,
            user: { username: clientUser['Client Username'], role: 'client' },
        };
    }

    throw new Error('Invalid credentials');
};


module.exports = {
    getProjectsAndClients,
    updateRecord,
    loginUser,
};


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // In production, you'd want to restrict this to your frontend's domain
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Basic health check endpoint
app.get('/', (req, res) => {
    res.send('Eruptible PM Backend is running.');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

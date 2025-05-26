// s4-api/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const apiRoutes = require('./routes/api');

// Middleware
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Middleware Error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: err.message
    });
});

// Default route for unmatched endpoints
app.use((req, res) => {
    console.log('Unmatched route:', req.url);
    res.status(404).json({
        message: 'Not Found',
        url: req.url
    });
});

const PORT = 3001; // Default port
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is in use, trying port ${PORT + 1}...`);
        // Try the next port
        const newPort = PORT + 1;
        app.listen(newPort, () => {
            console.log(`Server running on port ${newPort}`);
            console.log(`API endpoints available at http://localhost:${newPort}/api`);
        });
    } else {
        console.error('Server error:', err);
    }
});
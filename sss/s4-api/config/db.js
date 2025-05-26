// s4-api/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// OpenEMR database connection
const openemrConfig = {
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'openemr_dev',
    port: parseInt(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    debug: true,
    multipleStatements: true,
    ssl: {
        rejectUnauthorized: false
    }
};

// PMS database connection
const pmsConfig = {
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'pms_sss',
    port: parseInt(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    debug: true,
    multipleStatements: true,
    ssl: {
        rejectUnauthorized: false
    }
};

// Create pools with error handling
let openemrPool, pmsPool;

try {
    openemrPool = mysql.createPool(openemrConfig);
    console.log('Successfully created OpenEMR pool');
} catch (error) {
    console.error('Error creating OpenEMR pool:', error);
}

try {
    pmsPool = mysql.createPool(pmsConfig);
    console.log('Successfully created PMS pool');
} catch (error) {
    console.error('Error creating PMS pool:', error);
}

// Test connections when pools are created
openemrPool.getConnection()
    .then(conn => {
        console.log('Successfully connected to OpenEMR database');
        conn.release();
    })
    .catch(err => {
        console.error('Error connecting to OpenEMR database:', err);
    });

pmsPool.getConnection()
    .then(conn => {
        console.log('Successfully connected to PMS database');
        conn.release();
    })
    .catch(err => {
        console.error('Error connecting to PMS database:', err);
    });

module.exports = {
    openemrPool,
    pmsPool,
    getOpenEMRConnection: () => openemrPool.getConnection(),
    getPMSConnection: () => pmsPool.getConnection()
};
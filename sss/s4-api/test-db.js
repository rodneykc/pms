const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database successfully!');
        
        // Test a simple query
        const [rows] = await connection.execute('SELECT VERSION() as version');
        console.log('Database Version:', rows[0].version);
        
        connection.release();
        console.log('Connection released');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

testConnection();
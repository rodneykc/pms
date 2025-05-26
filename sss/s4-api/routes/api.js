// s4-api/routes/api.js
const express = require('express');
const router = express.Router();
const { openemrPool, pmsPool } = require('../config/db');

// Root endpoint
router.get('/', (req, res) => {
    res.json({
        status: 'API is running',
        endpoints: {
            '/openemr/version': 'OpenEMR version',
            '/pms/version': 'PMS version',
            '/health': 'Health check',
            '/test-connections': 'Test database connections'
        }
    });
});

// OpenEMR endpoints
router.get('/openemr/version', async (req, res) => {
    try {
        console.log('Attempting to get OpenEMR version');
        
        // Test connection first
        const connection = await openemrPool.getConnection();
        console.log('Successfully got OpenEMR connection');
        
        // Test a simple query
        const [rows] = await connection.execute('SELECT VERSION() as version');
        console.log('OpenEMR version query results:', JSON.stringify(rows));
        
        connection.release();
        console.log('Released OpenEMR connection');
        
        res.json({ version: rows[0].version });
    } catch (error) {
        console.error('Detailed OpenEMR Error:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            sql: error.sql,
            sqlState: error.sqlState
        });
        res.status(500).json({
            error: 'OpenEMR database error',
            details: {
                message: error.message,
                code: error.code,
                sqlState: error.sqlState
            }
        });
    }
});

// PMS endpoints
router.get('/pms/version', async (req, res) => {
    try {
        console.log('Attempting to get PMS version');
        
        // Test connection first
        const connection = await pmsPool.getConnection();
        console.log('Successfully got PMS connection');
        
        // Test a simple query
        const [rows] = await connection.execute('SELECT VERSION() as version');
        console.log('PMS version query results:', JSON.stringify(rows));
        
        connection.release();
        console.log('Released PMS connection');
        
        res.json({ version: rows[0].version });
    } catch (error) {
        console.error('Detailed PMS Error:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            sql: error.sql,
            sqlState: error.sqlState
        });
        res.status(500).json({
            error: 'PMS database error',
            details: {
                message: error.message,
                code: error.code,
                sqlState: error.sqlState
            }
        });
    }
});

// Get table structure
router.get('/table-structure/:table', async (req, res) => {
    const { table } = req.params;
    try {
        const connection = await pmsPool.getConnection();
        
        // Get table structure
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_COMMENT 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'pms_sss' 
            AND TABLE_NAME = ?
            ORDER BY ORDINAL_POSITION
        `, [table]);
        
        // Get foreign key relationships
        const [relationships] = await connection.execute(`
            SELECT 
                COLUMN_NAME, 
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
            FROM 
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE 
                TABLE_SCHEMA = 'pms_sss' AND
                TABLE_NAME = ? AND
                REFERENCED_TABLE_NAME IS NOT NULL
        `, [table]);
        
        // Get sample data (first 5 rows)
        let sampleData = [];
        try {
            const [data] = await connection.query(`SELECT * FROM ?? LIMIT 5`, [table]);
            sampleData = data;
        } catch (sampleError) {
            console.error('Error getting sample data:', sampleError);
            // Continue without sample data if there's an error
        }
        
        connection.release();
        
        // Return simplified structure
        res.json({
            tableName: table,
            columns: columns.map(col => ({
                name: col.COLUMN_NAME,
                type: col.DATA_TYPE,
                nullable: col.IS_NULLABLE === 'YES',
                key: col.COLUMN_KEY,
                comment: col.COLUMN_COMMENT
            })),
            relationships: relationships.map(rel => ({
                column: rel.COLUMN_NAME,
                references: `${rel.REFERENCED_TABLE_NAME}.${rel.REFERENCED_COLUMN_NAME}`
            })),
            sampleData: sampleData
        });
    } catch (error) {
        console.error('Error getting table structure:', error);
        res.status(500).json({ 
            error: 'Failed to get table structure', 
            details: error.message,
            sql: error.sql,
            code: error.code,
            sqlState: error.sqlState
        });
    }
});

// Get pending surgery requests
router.get('/surgery-requests/pending', async (req, res) => {
    try {
        const connection = await pmsPool.getConnection();
        
        // Query to get pending surgery requests
        const [requests] = await connection.execute(`
            SELECT 
                r.SURGReqID,
                r.pid,
                r.S3PatientName AS patientName,
                r.S3ProcedureDescription AS procedureDescription,
                r.S3Surgeon AS surgeon,
                r.SurgeryDate AS requestedDate,
                r.S3OR AS location,
                r.S3PatientStatus AS patientStatus,
                r.S3Anesthesia AS anesthesiaType,
                r.S3procduration AS procedureDuration,
                r.S3Diagnosis AS diagnosis,
                r.SURGStatus AS status,
                r.S3Clear2Schedule AS clearedToSchedule,
                r.S3PreOpOrders AS preOpOrders,
                r.S3OtherNeeds AS specialNeeds
            FROM 
                tblSS r
            WHERE 
                r.SURGReqRecordStatus = 'Active'
                AND (r.SURGStatus IS NULL OR r.SURGStatus NOT IN ('Cancelled', 'Completed'))
            ORDER BY 
                CASE 
                    WHEN r.SurgeryDate IS NOT NULL AND r.SurgeryDate != '' THEN r.SurgeryDate 
                    ELSE '9999-12-31'
                END ASC,
                r.S3PatientName
        `);
        
        connection.release();
        
        // Format dates and clean up data
        const formattedRequests = requests.map(request => ({
            ...request,
            requestedDate: request.requestedDate ? new Date(request.requestedDate).toLocaleDateString() : 'Not Scheduled',
            procedureDuration: request.procedureDuration || 'Not specified',
            status: request.status || 'New Request'
        }));
        
        res.json({
            success: true,
            count: formattedRequests.length,
            data: formattedRequests
        });
        
    } catch (error) {
        console.error('Error fetching pending surgery requests:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch pending surgery requests',
            details: error.message
        });
    }
});

// Test connections endpoint
router.get('/test-connections', async (req, res) => {
    try {
        console.log('Testing database connections');
        
        // Test OpenEMR
        const openemrConnection = await openemrPool.getConnection();
        console.log('OpenEMR connection successful');
        const [openemrRows] = await openemrConnection.execute('SELECT VERSION() as version');
        openemrConnection.release();
        
        // Test PMS
        const pmsConnection = await pmsPool.getConnection();
        console.log('PMS connection successful');
        const [pmsRows] = await pmsConnection.execute('SELECT VERSION() as version');
        pmsConnection.release();
        
        res.json({
            success: true,
            openemr: {
                version: openemrRows[0].version,
                message: 'OpenEMR connection successful'
            },
            pms: {
                version: pmsRows[0].version,
                message: 'PMS connection successful'
            }
        });
        
    } catch (error) {
        console.error('Connection Test Error:', error);
        res.status(500).json({
            error: 'Database connection test failed',
            details: {
                message: error.message,
                code: error.code,
                sqlState: error.sqlState,
                stack: error.stack
            }
        });
    }
});

module.exports = router;
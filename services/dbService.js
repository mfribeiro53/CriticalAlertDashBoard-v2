/**
 * File: dbService.js
 * Created: 2026-01-17
 * 
 * Database Service
 * Handles SQL Server connections and queries
 */

require('dotenv').config();
const sql = require('mssql');

// Validate required environment variables
const requiredEnvVars = ['DB_SERVER', 'DB_DATABASE', 'DB_USER', 'DB_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
    'Please create a .env file with the required database configuration.'
  );
}

// SQL Server configuration
const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Connection pool
let pool = null;

/**
 * Get or create database connection pool
 * @returns {Promise<sql.ConnectionPool>}
 */
const getPool = async () => {
  if (pool && pool.connected) {
    return pool;
  }

  try {
    pool = await sql.connect(dbConfig);
    console.log('✓ Database connection established');
    return pool;
  } catch (error) {
    console.error('✗ Database connection error:', error.message);
    throw error;
  }
};

/**
 * Test database connection
 * @returns {Promise<Object>} Test result
 */
const testConnection = async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT @@VERSION AS Version, DB_NAME() AS DatabaseName, SUSER_NAME() AS UserName');
    
    return {
      success: true,
      message: 'Database connection successful',
      data: result.recordset[0]
    };
  } catch (error) {
    return {
      success: false,
      message: 'Database connection failed',
      error: error.message
    };
  }
};

/**
 * Execute a query
 * @param {string} queryString - SQL query to execute
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
const executeQuery = async (queryString, params = {}) => {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Add parameters to request
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });

    const result = await request.query(queryString);
    return {
      success: true,
      data: result.recordset,
      rowsAffected: result.rowsAffected[0]
    };
  } catch (error) {
    console.error('Query execution error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Close the database connection pool
 * @returns {Promise<void>}
 */
const closePool = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('✓ Database connection closed');
    }
  } catch (error) {
    console.error('Error closing database connection:', error.message);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});

module.exports = {
  getPool,
  testConnection,
  executeQuery,
  closePool,
  sql // Export sql object for data types
};

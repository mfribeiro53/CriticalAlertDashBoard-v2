/**
 * File: cetAppsService.js
 * Created: 2025-12-20 18:03:53
 * Last Modified: 2025-12-20 18:14:44
 * 
 * CET Apps Data Service
 * 
 * Abstraction layer for CET Apps data operations.
 * This service can be backed by mock data, a database, or an external API.
 * 
 * To switch from mock data to a real database:
 * 1. Replace the mock data imports with database connection
 * 2. Update the function implementations to use SQL queries or ORM
 * 3. Routes in app.js remain unchanged
 */

// Database service for SQL Server operations
const dbService = require('./dbService');

// Mock data (commented out - now using database)
// const fs = require('fs');
// const path = require('path');
// let mockDataSource = null;
// let dataSourceAvailable = false;
// const mockDataPath = path.join(__dirname, '../mockdata/mockDataCETApps.js');
// if (fs.existsSync(mockDataPath)) {
//   try {
//     mockDataSource = require('../mockdata/mockDataCETApps');
//     dataSourceAvailable = true;
//     console.log('✓ CET Apps data source loaded successfully');
//   } catch (error) {
//     console.warn('⚠ CET Apps data source error:', error.message);
//     console.warn('  Pages will render with empty data');
//   }
// } else {
//   console.warn('⚠ CET Apps data file not found:', mockDataPath);
//   console.warn('  Pages will render with empty data');
// }

/**
 * Get all CET applications
 * @returns {Promise<Array>} Array of CET application objects
 */
const getAllApps = async () => {
  try {
    const result = await dbService.executeQuery('EXEC dbo.usp_GetAllCETApps');
    return result.data || [];
  } catch (error) {
    console.error('Error fetching all apps:', error);
    return [];
  }
}

/**
 * Get a single CET application by ID
 * @param {number} id - Application ID
 * @returns {Promise<Object|null>} Application object or null if not found
 */
const getAppById = async (id) => {
  try {
    const result = await dbService.executeQuery('EXEC dbo.usp_GetCETAppById @AppID', { AppID: id });
    return result.data && result.data.length > 0 ? result.data[0] : null;
  } catch (error) {
    console.error('Error fetching app by ID:', error);
    return null;
  }
}

/**
 * Create a new CET application
 * @param {Object} appData - Application data
 * @returns {Promise<Object>} Created application object
 */
const createApp = async (appData) => {
  // Validation
  if (!appData.iGateApp || !appData.cetApp || !appData.sqlServer || !appData.database_name) {
    throw new Error('Missing required fields');
  }
  
  try {
    const params = {
      iGateApp: appData.iGateApp,
      cetApp: appData.cetApp,
      sqlServer: appData.sqlServer,
      database_name: appData.database_name,
      description: appData.description || null,
      supportLink: appData.supportLink || null,
      status: appData.status || 'active',
      environment: appData.environment || 'production'
    };
    
    const result = await dbService.executeQuery(
      'EXEC dbo.usp_CreateCETApp @iGateApp, @cetApp, @sqlServer, @database_name, @description, @supportLink, @status, @environment',
      params
    );
    
    // Return the newly created app using its ID
    const newAppId = result.data[0].id;
    return await getAppById(newAppId);
  } catch (error) {
    console.error('Error creating app:', error);
    throw error;
  }
}

/**
 * Update an existing CET application
 * @param {number} id - Application ID
 * @param {Object} appData - Updated application data
 * @returns {Promise<Object|null>} Updated application object or null if not found
 */
const updateApp = async (id, appData) => {
  // Validation
  if (!appData.iGateApp || !appData.cetApp || !appData.sqlServer || !appData.database_name) {
    throw new Error('Missing required fields');
  }
  
  try {
    const params = {
      AppID: id,
      iGateApp: appData.iGateApp,
      cetApp: appData.cetApp,
      sqlServer: appData.sqlServer,
      database_name: appData.database_name,
      description: appData.description || null,
      supportLink: appData.supportLink || null,
      status: appData.status || 'active',
      environment: appData.environment || 'production'
    };
    
    await dbService.executeQuery(
      'EXEC dbo.usp_UpdateCETApp @AppID, @iGateApp, @cetApp, @sqlServer, @database_name, @description, @supportLink, @status, @environment',
      params
    );
    
    return await getAppById(id);
  } catch (error) {
    console.error('Error updating app:', error);
    throw error;
  }
}

/**
 * Delete a CET application
 * @param {number} id - Application ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
const deleteApp = async (id) => {
  try {
    const result = await dbService.executeQuery(
      'EXEC dbo.usp_DeleteCETApp @AppID',
      { AppID: id }
    );
    
    // Check if any rows were affected (stored procedure will throw error if not found)
    return true;
  } catch (error) {
    console.error('Error deleting app:', error);
    if (error.message && error.message.includes('not found')) {
      return false;
    }
    throw error;
  }
}

/**
 * Get unique iGate applications
 * @returns {Promise<Array<string>>} Array of unique iGate app names
 */
const getUniqueIGateApps = async () => {
  try {
    const result = await dbService.executeQuery('EXEC dbo.usp_GetUniqueIGateApps');
    return result.data.map(row => row.iGateApp) || [];
  } catch (error) {
    console.error('Error fetching unique iGate apps:', error);
    return [];
  }
}

module.exports = {
  getAllApps,
  getAppById,
  createApp,
  updateApp,
  deleteApp,
  getUniqueIGateApps
};

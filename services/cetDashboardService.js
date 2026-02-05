/**
 * File: cetDashboardService.js
 * Created: 2025-12-21 12:53:44
 * Last Modified: 2025-12-21 12:54:20
 * 
 * CET Dashboard Service
 * Business logic for CET Dashboard view
 */

// Database service for SQL Server operations
const dbService = require('./dbService');
const { loadConfig } = require('./configService');

// Mock data (commented out - now using database)
// const fs = require('fs');
// const path = require('path');
// let mockCETData = [];
// const mockDataPath = path.join(__dirname, '../mockdata/mockDataCET.js');
// if (fs.existsSync(mockDataPath)) {
//   try {
//     mockCETData = require('../mockdata/mockDataCET');
//     console.log('✓ CET Dashboard data source loaded successfully');
//   } catch (error) {
//     console.warn('⚠ CET Dashboard data source error:', error.message);
//   }
// } else {
//   console.warn('⚠ CET Dashboard data file not found:', mockDataPath);
// }

/**
 * Get all data needed for CET Dashboard view
 * @returns {Promise<Object>} Dashboard data and configurations
 */
const getDashboardData = async () => {
  // Get data from database using stored procedure
  const result = await dbService.executeQuery('EXEC dbo.usp_GetCETDashboard');
  const cetData = result.data || [];
  
  return {
    cetData: cetData,
    columns: loadConfig('cet-dashboard-columns', 'cet', []),
    cardsConfig: loadConfig('cet-dashboard-cards'),
    filterConfig: loadConfig('cet-dashboard-filters'),
    footerConfig: loadConfig('cet-dashboard-footer'),
    ariaConfig: loadConfig('cet-dashboard-aria'),
    keyboardConfig: loadConfig('cet-dashboard-keyboard'),
    currentView: 'cet-dashboard'
  };
}

module.exports = {
  getDashboardData
};

/**
 * File: cetReportsService.js
 * Created: 2025-12-21 12:53:44
 * Last Modified: 2025-12-21 12:54:20
 * 
 * CET Reports Service
 * Business logic for CET Reports view
 */

// Database service for SQL Server operations
const dbService = require('./dbService');
const { loadConfig } = require('./configService');

// Mock data (commented out - now using database)
// const fs = require('fs');
// const path = require('path');
// let cetReportsSummary = [];
// let cetReportsDetail = [];
// const mockDataPath = path.join(__dirname, '../mockdata/mockDataCETReports.js');
// if (fs.existsSync(mockDataPath)) {
//   try {
//     const reportsData = require('../mockdata/mockDataCETReports');
//     cetReportsSummary = reportsData.cetReportsSummary || [];
//     cetReportsDetail = reportsData.cetReportsDetail || [];
//     console.log('✓ CET Reports data source loaded successfully');
//   } catch (error) {
//     console.warn('⚠ CET Reports data source error:', error.message);
//   }
// } else {
//   console.warn('⚠ CET Reports data file not found:', mockDataPath);
// }

/**
 * Get all data needed for CET Reports view
 * @returns {Promise<Object>} Reports data and configurations
 */
const getReportsData = async () => {
  // Fetch data from database using stored procedures
  const [summaryResult, detailResult] = await Promise.all([
    dbService.executeQuery('EXEC dbo.usp_GetCETReportsSummary'),
    dbService.executeQuery('EXEC dbo.usp_GetCETReportsDetail')
  ]);
  
  return {
    pageTitle: 'CET Reports',
    currentView: 'cet-reports',
    
    // Reports Summary data and config
    cetReportsSummary: summaryResult.data || [],
    columnsSummary: loadConfig('cet-reports-columns', 'reportsSummary', []),
    
    // Reports Detail data and config
    cetReportsDetail: detailResult.data || [],
    columnsDetail: loadConfig('cet-reports-columns', 'reportsDetail', []),
    
    // Shared configs
    filterConfig: loadConfig('cet-reports-filters'),
    footerConfig: loadConfig('cet-reports-footer'),
    ariaConfig: loadConfig('cet-reports-aria'),
    keyboardConfig: loadConfig('cet-reports-keyboard')
  };
}

module.exports = {
  getReportsData
};

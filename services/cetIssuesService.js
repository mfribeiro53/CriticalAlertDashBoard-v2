/**
 * File: cetIssuesService.js
 * Created: 2025-12-21 12:53:44
 * Last Modified: 2025-12-21 12:54:20
 * 
 * CET Issues Service
 * Business logic for CET Issues view
 */

// Database service for SQL Server operations
const dbService = require('./dbService');
const { loadConfig } = require('./configService');

// Mock data (commented out - now using database)
// const fs = require('fs');
// const path = require('path');
// let cetIssuesSummary = [];
// let cetAlertDetails = [];
// let cetDisabledQueueDetails = [];
// let cetBehindDetails = [];
// let cetSlowDetails = [];
// const mockDataPath = path.join(__dirname, '../mockdata/mockDataCETIssues.js');
// if (fs.existsSync(mockDataPath)) {
//   try {
//     const issuesData = require('../mockdata/mockDataCETIssues');
//     cetIssuesSummary = issuesData.cetIssuesSummary || [];
//     cetAlertDetails = issuesData.cetAlertDetails || [];
//     cetDisabledQueueDetails = issuesData.cetDisabledQueueDetails || [];
//     cetBehindDetails = issuesData.cetBehindDetails || [];
//     cetSlowDetails = issuesData.cetSlowDetails || [];
//     console.log('✓ CET Issues data source loaded successfully');
//   } catch (error) {
//     console.warn('⚠ CET Issues data source error:', error.message);
//   }
// } else {
//   console.warn('⚠ CET Issues data file not found:', mockDataPath);
// }

/**
 * Get all data needed for CET Issues view
 * @returns {Promise<Object>} Issues data and configurations
 */
const getIssuesData = async () => {
  // Fetch data from database using stored procedures
  const [summaryResult, alertResult, disabledResult, behindResult, slowResult] = await Promise.all([
    dbService.executeQuery('EXEC dbo.usp_GetCETIssuesSummary'),
    dbService.executeQuery('EXEC dbo.usp_GetCETAlertDetails'),
    dbService.executeQuery('EXEC dbo.usp_GetCETDisabledQueueDetails'),
    dbService.executeQuery('EXEC dbo.usp_GetCETBehindDetails'),
    dbService.executeQuery('EXEC dbo.usp_GetCETSlowDetails')
  ]);
  
  return {
    cetIssuesSummary: summaryResult.data || [],
    cetAlertDetails: alertResult.data || [],
    cetDisabledQueueDetails: disabledResult.data || [],
    cetBehindDetails: behindResult.data || [],
    cetSlowDetails: slowResult.data || [],
    columnsSummary: loadConfig('cet-issues-columns', 'cetIssuesSummary', []),
    columnsAlertDetails: loadConfig('cet-issues-columns', 'cetAlertDetails', []),
    columnsDisabledQueueDetails: loadConfig('cet-issues-columns', 'cetDisabledQueueDetails', []),
    columnsBehindDetails: loadConfig('cet-issues-columns', 'cetBehindDetails', []),
    columnsSlowDetails: loadConfig('cet-issues-columns', 'cetSlowDetails', []),
    filterConfig: loadConfig('cet-issues-filters'),
    ariaConfig: loadConfig('cet-issues-aria'),
    keyboardConfig: loadConfig('cet-issues-keyboard'),
    currentView: 'cet-issues'
  };
}

module.exports = {
  getIssuesData
};

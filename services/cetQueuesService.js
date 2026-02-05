/**
 * File: cetQueuesService.js
 * Created: 2025-12-21 12:53:44
 * Last Modified: 2025-12-21 12:54:20
 * 
 * CET Queues Service
 * Business logic for CET Queues view
 */

// Database service for SQL Server operations
const dbService = require('./dbService');
const { loadConfig } = require('./configService');

// Mock data (commented out - now using database)
// const fs = require('fs');
// const path = require('path');
// let cetQueuesSummary = [];
// let cetMessageDetails = [];
// let mockCETAppsData = [];
// const queuesDataPath = path.join(__dirname, '../mockdata/mockDataCETQueues.js');
// if (fs.existsSync(queuesDataPath)) {
//   try {
//     const queuesData = require('../mockdata/mockDataCETQueues');
//     cetQueuesSummary = queuesData.cetQueuesSummary || [];
//     cetMessageDetails = queuesData.cetMessageDetails || [];
//     console.log('✓ CET Queues data source loaded successfully');
//   } catch (error) {
//     console.warn('⚠ CET Queues data source error:', error.message);
//   }
// } else {
//   console.warn('⚠ CET Queues data file not found:', queuesDataPath);
// }
// const appsDataPath = path.join(__dirname, '../mockdata/mockDataCETApps.js');
// if (fs.existsSync(appsDataPath)) {
//   try {
//     const appsData = require('../mockdata/mockDataCETApps');
//     mockCETAppsData = appsData.mockCETAppsData || [];
//   } catch (error) {
//     console.warn('⚠ CET Apps data source error:', error.message);
//   }
// } else {
//   console.warn('⚠ CET Apps data file not found:', appsDataPath);
// }

/**
 * Get all data needed for CET Queues view
 * @returns {Promise<Object>} Queues data and configurations
 */
const getQueuesData = async () => {
  // Fetch data from database using stored procedures
  const [queuesSummaryResult, messageDetailsResult, appsResult] = await Promise.all([
    dbService.executeQuery('EXEC dbo.usp_GetCETQueuesSummary'),
    dbService.executeQuery('EXEC dbo.usp_GetCETMessageDetails'),
    dbService.executeQuery('EXEC dbo.usp_GetAllCETApps')
  ]);
  
  const cetQueuesSummary = queuesSummaryResult.data || [];
  const cetMessageDetails = messageDetailsResult.data || [];
  const mockCETAppsData = appsResult.data || [];
  
  // Load request form config
  const requestFormConfig = loadConfig('cet-request-form', null, {});
  requestFormConfig.appDataSource = mockCETAppsData;
  
  return {
    pageTitle: 'CET Queues - Dashboard',
    currentView: 'cet-queues',
    
    // Queue Summary data and config
    cetQueuesSummary: cetQueuesSummary,
    cetQueuesSummaryColumns: loadConfig('cet-queues-columns', 'cetQueuesSummary', []),
    cetQueuesSummaryFooter: loadConfig('cet-queues-footer', 'cetQueuesSummary'),
    cetQueuesSummaryFilters: loadConfig('cet-queues-filters', 'cetQueuesSummary'),
    
    // Message Details data and config
    cetMessageDetails: cetMessageDetails,
    cetMessageDetailsColumns: loadConfig('cet-queues-columns', 'cetMessageDetails', []),
    cetMessageDetailsFooter: loadConfig('cet-queues-footer', 'cetMessageDetails'),
    cetMessageDetailsFilters: loadConfig('cet-queues-filters', 'cetMessageDetails'),
    
    // Request form config
    requestFormConfig: requestFormConfig,
    
    // Apps data for request form (deprecated - now in formConfig)
    cetAppsData: mockCETAppsData,
    
    // Accessibility configs
    ariaConfig: loadConfig('cet-queues-aria'),
    keyboardConfig: loadConfig('cet-queues-keyboard'),
    cardsConfig: loadConfig('cet-queues-cards')
  };
}

module.exports = {
  getQueuesData
};

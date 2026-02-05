/**
 * File: apiService.js
 * Created: 2025-12-21 12:57:38
 * Last Modified: 2025-12-21 12:58:05
 * 
 * API Service
 * Business logic for API endpoints
 */

const fs = require('fs');
const path = require('path');
const cetAppsService = require('./cetAppsService');

let mockCETAppsData = [];
const mockDataPath = path.join(__dirname, '../mockdata/mockDataCETApps.js');
if (fs.existsSync(mockDataPath)) {
  try {
    const appsData = require('../mockdata/mockDataCETApps');
    mockCETAppsData = appsData.mockCETAppsData || [];
  } catch (error) {
    console.warn('⚠ API Service: CET Apps data source error:', error.message);
  }
} else {
  console.warn('⚠ API Service: CET Apps data file not found:', mockDataPath);
}

/**
 * Process a data request for a specific application and time range
 * @param {number} appId - Application ID
 * @param {string} startDateTime - Start datetime string
 * @param {string} endDateTime - End datetime string
 * @returns {Object} Result object with success status and data/error
 */
const processDataRequest = (appId, startDateTime, endDateTime) => {
  // Validate required fields
  if (!appId || !startDateTime || !endDateTime) {
    return {
      success: false,
      status: 400,
      message: 'Missing required fields: appId, startDateTime, and endDateTime are required.'
    };
  }
  
  // Validate app exists
  const app = mockCETAppsData.find(a => a.id === parseInt(appId));
  if (!app) {
    return {
      success: false,
      status: 404,
      message: `Application with ID ${appId} not found.`
    };
  }
  
  // Validate datetime range
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      success: false,
      status: 400,
      message: 'Invalid datetime format.'
    };
  }
  
  if (end <= start) {
    return {
      success: false,
      status: 400,
      message: 'End datetime must be after start datetime.'
    };
  }
  
  // Log the request (in production, this would trigger actual data retrieval)
  console.log('Data request received:', {
    appId: appId,
    appName: `${app.iGateApp} - ${app.cetApp}`,
    startDateTime: startDateTime,
    endDateTime: endDateTime,
    requestTime: new Date().toISOString()
  });
  
  // Simulate successful response
  // In production, this would return actual data or a job ID for async processing
  return {
    success: true,
    status: 200,
    data: {
      success: true,
      message: 'Data request received successfully.',
      requestId: 'REQ_' + Date.now(),
      app: {
        id: app.id,
        name: `${app.iGateApp} - ${app.cetApp}`
      },
      timeRange: {
        start: startDateTime,
        end: endDateTime
      },
      estimatedRecords: Math.floor(Math.random() * 10000) + 100 // Mock estimated count
    }
  };
}

/**
 * Get all applications (legacy endpoint wrapper)
 * @returns {Promise<Array>} List of applications
 */
const getAllApplications = async () => {
  return await cetAppsService.getAllApps();
}

module.exports = {
  processDataRequest,
  getAllApplications
};

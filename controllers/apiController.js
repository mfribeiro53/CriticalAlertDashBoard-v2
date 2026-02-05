/**
 * API Controller
 * Handles API endpoint requests
 */

/**
 * File: apiController.js
 * Created: 2025-12-21 12:57:47
 * Last Modified: 2025-12-22 21:15:23
 */

const apiService = require('../services/apiService');
const { loadConfig } = require('../services/configService');

/**
 * POST /api/request-data
 * Handles POST requests for data within a specific datetime range for an application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const requestData = (req, res) => {
  try {
    const { appId, startDateTime, endDateTime } = req.body;
    
    const result = apiService.processDataRequest(appId, startDateTime, endDateTime);
    
    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message
      });
    }
    
    res.json(result.data);
    
  } catch (error) {
    console.error('Error processing data request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing the request.'
    });
  }
}

/**
 * GET /api/apps
 * Returns list of all CET applications for dynamic loading
 * Legacy endpoint - also available at /cet-apps/api
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getApplications = async (req, res) => {
  try {
    const apps = await apiService.getAllApplications();
    res.json(apps);
  } catch (error) {
    console.error('Error fetching apps:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching applications.'
    });
  }
}

/**
 * GET /api/config/:configName
 * Returns configuration file as JSON (supports YAML and JSON sources)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getConfig = (req, res) => {
  try {
    const { configName } = req.params;
    const config = loadConfig(configName);
    
    if (config === null) {
      return res.status(404).json({
        success: false,
        message: `Config file not found: ${configName}`
      });
    }
    
    res.json(config);
  } catch (error) {
    console.error('Error loading config:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while loading configuration.'
    });
  }
}

module.exports = {
  requestData,
  getApplications,
  getConfig
};

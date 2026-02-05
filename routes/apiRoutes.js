/**
 * File: apiRoutes.js
 * Created: 2025-12-21 12:57:56
 * Last Modified: 2025-12-22 21:15:23
 * 
 * API Routes
 * Defines routes for API endpoints
 */

const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

/**
 * POST /api/request-data
 * Handles POST requests for data within a specific datetime range for an application
 */
router.post('/request-data', apiController.requestData);

/**
 * GET /api/apps
 * Returns list of all CET applications for dynamic loading
 * Legacy endpoint - also available at /cet-apps/api
 */
router.get('/apps', apiController.getApplications);

/**
 * GET /api/config/:configName
 * Returns configuration file as JSON (supports YAML and JSON sources)
 * Example: /api/config/cet-dashboard-cards
 */
router.get('/config/:configName', apiController.getConfig);

/**
 * Redirect legacy /api/cet-apps* routes to new endpoints
 * New endpoints: /cet-apps/api/*
 */
router.all('/cet-apps*', (req, res, next) => {
  const newPath = req.path.replace('/cet-apps', '/cet-apps/api');
  req.url = newPath;
  next();
});

module.exports = router;

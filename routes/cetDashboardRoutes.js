/**
 * CET Dashboard Routes
 * Defines routes for CET Dashboard view
 */

/**
 * File: cetDashboardRoutes.js
 * Created: 2025-12-21 12:54:06
 * Last Modified: 2025-12-22 21:15:23
 */

const express = require('express');
const router = express.Router();
const cetDashboardController = require('../controllers/cetDashboardController');

/**
 * GET /cet-dashboard
 * Render CET application health monitoring dashboard
 */
router.get('/', cetDashboardController.showDashboard);

module.exports = router;

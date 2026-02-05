/**
 * CET Reports Routes
 * Defines routes for CET Reports view
 */

/**
 * File: cetReportsRoutes.js
 * Created: 2025-12-21 12:54:06
 * Last Modified: 2025-12-22 21:15:23
 */

const express = require('express');
const router = express.Router();
const cetReportsController = require('../controllers/cetReportsController');

/**
 * GET /cet-reports
 * Display segment execution data for critical sections
 */
router.get('/', cetReportsController.showReports);

module.exports = router;

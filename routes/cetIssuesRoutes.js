/**
 * CET Issues Routes
 * Defines routes for CET Issues view
 */

/**
 * File: cetIssuesRoutes.js
 * Created: 2025-12-21 12:54:06
 * Last Modified: 2025-12-22 21:15:23
 */

const express = require('express');
const router = express.Router();
const cetIssuesController = require('../controllers/cetIssuesController');

/**
 * GET /cet-issues
 * Render CET issues view with summary and detail tables
 */
router.get('/', cetIssuesController.showIssues);

module.exports = router;

/**
 * CET Queues Routes
 * Defines routes for CET Queues view
 */

/**
 * File: cetQueuesRoutes.js
 * Created: 2025-12-21 12:54:06
 * Last Modified: 2025-12-22 21:15:23
 */

const express = require('express');
const router = express.Router();
const cetQueuesController = require('../controllers/cetQueuesController');

/**
 * GET /cet-queues
 * Display CET queue monitoring with message details
 */
router.get('/', cetQueuesController.showQueues);

module.exports = router;

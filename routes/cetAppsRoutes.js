/**
 * CET Apps Routes
 * 
 * Route definitions for CET Apps pages and API endpoints.
 */

/**
 * File: cetAppsRoutes.js
 * Created: 2025-12-20 18:36:18
 * Last Modified: 2025-12-22 21:15:23
 */

const express = require('express');
const router = express.Router();
const cetAppsController = require('../controllers/cetAppsController');

// ===================================
// Page Routes (render HTML views)
// ===================================

/**
 * GET /cet-apps
 * CET Applications Registry view page
 */
router.get('/', cetAppsController.viewCETApps);

/**
 * GET /cet-apps/admin
 * CET Applications Administration page
 */
router.get('/admin', cetAppsController.adminCETApps);

// ===================================
// API Routes (JSON endpoints)
// ===================================

/**
 * GET /cet-apps/api
 * Get all CET applications (alternative endpoint)
 */
router.get('/api', cetAppsController.getAllApps);

/**
 * GET /cet-apps/api/:id
 * Get a single CET application by ID
 */
router.get('/api/:id', cetAppsController.getAppById);

/**
 * POST /cet-apps/api
 * Create a new CET application
 */
router.post('/api', cetAppsController.createApp);

/**
 * PUT /cet-apps/api/:id
 * Update an existing CET application
 */
router.put('/api/:id', cetAppsController.updateApp);

/**
 * DELETE /cet-apps/api/:id
 * Delete a CET application
 */
router.delete('/api/:id', cetAppsController.deleteApp);

module.exports = router;

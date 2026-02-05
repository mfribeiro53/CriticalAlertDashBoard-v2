/**
 * CET Dashboard Controller
 * Handles requests for CET Dashboard view
 */

/**
 * File: cetDashboardController.js
 * Created: 2025-12-21 12:53:55
 * Last Modified: 2025-12-22 21:15:23
 */

const cetDashboardService = require('../services/cetDashboardService');

/**
 * Render CET Dashboard view
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const showDashboard = async (req, res) => {
  try {
    const data = await cetDashboardService.getDashboardData();
    res.render('cet-dashboard', data);
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('Error loading dashboard');
  }
}

module.exports = {
  showDashboard
};

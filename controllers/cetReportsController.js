/**
 * CET Reports Controller
 * Handles requests for CET Reports view
 */

/**
 * File: cetReportsController.js
 * Created: 2025-12-21 12:53:55
 * Last Modified: 2025-12-22 21:15:23
 */

const cetReportsService = require('../services/cetReportsService');

/**
 * Render CET Reports view
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const showReports = async (req, res) => {
  try {
    const data = await cetReportsService.getReportsData();
    res.render('cet-reports-view', data);
  } catch (error) {
    console.error('Error loading reports:', error);
    res.status(500).send('Error loading reports');
  }
}

module.exports = {
  showReports
};

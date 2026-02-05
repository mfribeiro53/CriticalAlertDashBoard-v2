/**
 * CET Issues Controller
 * Handles requests for CET Issues view
 */

/**
 * File: cetIssuesController.js
 * Created: 2025-12-21 12:53:55
 * Last Modified: 2025-12-22 21:15:23
 */

const cetIssuesService = require('../services/cetIssuesService');

/**
 * Render CET Issues view
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const showIssues = async (req, res) => {
  try {
    const data = await cetIssuesService.getIssuesData();
    res.render('cet-issues-view', data);
  } catch (error) {
    console.error('Error loading issues:', error);
    res.status(500).send('Error loading issues');
  }
}

module.exports = {
  showIssues
};

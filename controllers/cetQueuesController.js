/**
 * CET Queues Controller
 * Handles requests for CET Queues view
 */

/**
 * File: cetQueuesController.js
 * Created: 2025-12-21 12:53:55
 * Last Modified: 2025-12-22 21:15:23
 */

const cetQueuesService = require('../services/cetQueuesService');

/**
 * Render CET Queues view
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const showQueues = async (req, res) => {
  try {
    const data = await cetQueuesService.getQueuesData();
    res.render('cet-queues-view', data);
  } catch (error) {
    console.error('Error loading queues:', error);
    res.status(500).send('Error loading queues');
  }
}

module.exports = {
  showQueues
};

/**
 * CET Apps Controller
 * 
 * Handles HTTP requests and responses for CET Apps endpoints.
 * Contains business logic and validation.
 */

/**
 * File: cetAppsController.js
 * Created: 2025-12-20 18:36:18
 * Last Modified: 2025-12-22 21:15:23
 */

const cetAppsService = require('../services/cetAppsService');
const { loadConfig } = require('../services/configService');

/**
 * Render CET Apps view page
 */
const viewCETApps = async (req, res) => {
  try {
    const cetAppsData = await cetAppsService.getAllApps();
    res.render('cet-apps-view', {
      cetAppsData: cetAppsData,
      columns: loadConfig('cet-apps-columns', 'cetApps', []),
      cardsConfig: loadConfig('cet-apps-cards'),
      filterConfig: loadConfig('cet-apps-filters'),
      footerConfig: loadConfig('cet-apps-footer'),
      ariaConfig: loadConfig('cet-apps-aria'),
      keyboardConfig: loadConfig('cet-apps-keyboard'),
      currentView: 'cet-apps'
    });
  } catch (error) {
    console.error('Error loading CET apps page:', error);
    res.status(500).send('Error loading CET applications page');
  }
}

/**
 * Render CET Apps admin page
 */
const adminCETApps = async (req, res) => {
  try {
    const cetAppsData = await cetAppsService.getAllApps();
    
    // Build columns configuration including action column
    const columns = [
      ...loadConfig('cet-apps-columns', 'cetApps', []),
      {
        data: null,
        title: 'Actions',
        orderable: false,
        className: 'text-center',
        width: '120px'
      }
    ];
    
    res.render('cet-apps-admin', {
      cetAppsData: cetAppsData,
      columns: columns,
      formConfig: loadConfig('cet-apps-admin-form'),
      footerConfig: loadConfig('cet-apps-footer'),
      ariaConfig: loadConfig('cet-apps-aria'),
      keyboardConfig: loadConfig('cet-apps-keyboard'),
      currentView: 'cet-apps-admin'
    });
  } catch (error) {
    console.error('Error loading CET apps admin page:', error);
    res.status(500).send('Error loading administration page');
  }
}

/**
 * Get all CET applications (API endpoint)
 */
const getAllApps = async (req, res) => {
  try {
    const apps = await cetAppsService.getAllApps();
    res.json(apps);
  } catch (error) {
    console.error('Error fetching all apps:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while fetching applications.'
    });
  }
}

/**
 * Get a single CET application by ID (API endpoint)
 */
const getAppById = async (req, res) => {
  try {
    const app = await cetAppsService.getAppById(req.params.id);
    
    if (!app) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found.'
      });
    }
    
    res.json(app);
  } catch (error) {
    console.error('Error fetching app:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while fetching the application.'
    });
  }
}

/**
 * Create a new CET application (API endpoint)
 */
const createApp = async (req, res) => {
  try {
    const newApp = await cetAppsService.createApp(req.body);
    
    console.log('Created new CET app:', newApp);
    
    res.status(201).json({
      success: true,
      message: 'Application created successfully.',
      data: newApp
    });
  } catch (error) {
    console.error('Error creating app:', error);
    
    const statusCode = error.message === 'Missing required fields' ? 400 : 500;
    res.status(statusCode).json({ 
      success: false,
      message: error.message || 'An error occurred while creating the application.'
    });
  }
}

/**
 * Update an existing CET application (API endpoint)
 */
const updateApp = async (req, res) => {
  try {
    const updatedApp = await cetAppsService.updateApp(req.params.id, req.body);
    
    if (!updatedApp) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found.'
      });
    }
    
    console.log('Updated CET app:', updatedApp);
    
    res.json({
      success: true,
      message: 'Application updated successfully.',
      data: updatedApp
    });
  } catch (error) {
    console.error('Error updating app:', error);
    
    const statusCode = error.message === 'Missing required fields' ? 400 : 500;
    res.status(statusCode).json({ 
      success: false,
      message: error.message || 'An error occurred while updating the application.'
    });
  }
}

/**
 * Delete a CET application (API endpoint)
 */
const deleteApp = async (req, res) => {
  try {
    const deleted = await cetAppsService.deleteApp(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found.'
      });
    }
    
    console.log('Deleted CET app with ID:', req.params.id);
    
    res.json({
      success: true,
      message: 'Application deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting app:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while deleting the application.'
    });
  }
}

module.exports = {
  viewCETApps,
  adminCETApps,
  getAllApps,
  getAppById,
  createApp,
  updateApp,
  deleteApp
};

/**
 * File: cet-apps-page.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-17 10:41:48
 * 
 * CET Apps View Page Initialization
 * 
 * Page-specific initialization for the CET Apps view.
 * Handles summary card updates based on table data.
 */

'use strict';

import { updateDashboardCard } from '../card-custom-handlers.js';

/**
 * Get card configuration from DOM data-* attributes
 * @param {string} cardId - The ID of the card element
 * @returns {Object} Card configuration object
 */
const getCardConfigFromDOM = (cardId) => {
  const card = document.getElementById(cardId);
  if (!card) return null;
  
  return {
    cardId: cardId,
    icon: card.dataset.icon || '',
    label: card.dataset.label || '',
    description: card.dataset.description || '',
    thresholds: {
      warning: card.dataset.thresholdWarning ? parseInt(card.dataset.thresholdWarning) : Infinity,
      danger: card.dataset.thresholdDanger ? parseInt(card.dataset.thresholdDanger) : Infinity
    }
  };
};

/**
 * Get all card configs for this page from DOM
 * @returns {Object} Object with card configs keyed by card name
 */
const getAllCardConfigs = () => {
  return {
    totalApps: getCardConfigFromDOM('totalApps'),
    sqlServers: getCardConfigFromDOM('sqlServers'),
    iGateApps: getCardConfigFromDOM('iGateApps')
  };
};

/**
 * Initialize CET Apps cards
 * Uses DOM data-* attributes for configuration (no global variables needed)
 */
const initializeCETAppsCards = (cardConfig) => {
  // Wait for table initialization
  setTimeout(() => {
    const table = $('#cetAppsTable').DataTable();
    
    // Function to update all summary cards
    const updateSummaryCards = () => {
      // Total applications
      const totalCount = table.rows({search:'applied'}).count();
      if (cardConfig.totalApps) {
        updateDashboardCard(
          cardConfig.totalApps.cardId,
          totalCount,
          cardConfig.totalApps.icon,
          cardConfig.totalApps.label,
          cardConfig.totalApps.description,
          cardConfig.totalApps.thresholds
        );
      }
      
      // Unique SQL Servers
      const sqlServers = new Set();
      table.column(2, {search:'applied'}).data().each((val) => {
        sqlServers.add(val);
      });
      if (cardConfig.sqlServers) {
        updateDashboardCard(
          cardConfig.sqlServers.cardId,
          sqlServers.size,
          cardConfig.sqlServers.icon,
          cardConfig.sqlServers.label,
          cardConfig.sqlServers.description,
          cardConfig.sqlServers.thresholds
        );
      }
      
      // Unique iGate Applications
      const iGateApps = new Set();
      table.column(0, {search:'applied'}).data().each((val) => {
        iGateApps.add(val);
      });
      if (cardConfig.iGateApps) {
        updateDashboardCard(
          cardConfig.iGateApps.cardId,
          iGateApps.size,
          cardConfig.iGateApps.icon,
          cardConfig.iGateApps.label,
          cardConfig.iGateApps.description,
          cardConfig.iGateApps.thresholds
        );
      }
    };
    
    // Initial update
    updateSummaryCards();
    
    // Update cards when table is filtered or searched
    table.on('search.dt draw.dt', () => {
      updateSummaryCards();
    });
  }, 500);
};

// Initialize using DOM data-* attributes (no global variables needed)
document.addEventListener('DOMContentLoaded', () => {
  const cardConfig = getAllCardConfigs();
  
  if (Object.keys(cardConfig).length > 0 && Object.values(cardConfig).some(c => c !== null)) {
    initializeCETAppsCards(cardConfig);
  } else {
    console.error('Card configuration not found in DOM data-* attributes');
  }
});

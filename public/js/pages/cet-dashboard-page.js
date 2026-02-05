/**
 * File: cet-dashboard-page.js
 * Created: 2025-12-15 12:43:56
  * Last Modified: 2026-01-01 15:35:21
 * 
 * CET Dashboard Page - Page-Specific Logic
 * 
 * Orchestrates the CET Dashboard view by connecting DataTables with interactive cards.
 * Cards display real-time aggregated metrics that update as users filter the table.
 * 
 * ARCHITECTURE PATTERN:
 * This file follows the page-specific architecture where:
 * - Generic card utilities: card-custom-handlers.js (reusable)
 * - Card initialization logic: card-init.js (framework)
 * - Page-specific data binding: THIS FILE (CET Dashboard specifics)
 * 
 * RESPONSIBILITIES:
 * 1. Render initial dashboard cards with configuration from JSON
 * 2. Bind cards to DataTable for automatic updates
 * 3. Calculate aggregated metrics from filtered table data
 * 4. Update card values and styling based on thresholds
 * 5. Handle card click navigation to detail pages
 * 
 * DATA FLOW:
 * Table Data → Filter/Search → bindCETTableData() → Calculate Metrics → updateDashboardCard() → UI Update
 * 
 * CARD-TABLE BINDING:
 * When the table is filtered or searched, the bindCETTableData function:
 * - Reads only visible/filtered rows using rows({search:'applied'})
 * - Calculates metrics (counts, sums, etc.)
 * - Updates each card with new values
 * - Cards automatically apply color coding based on thresholds
 * 
 * This creates a responsive dashboard where metrics reflect current table state.
 */

'use strict';

import { updateDashboardCard } from '../card-custom-handlers.js';

/**
 * Read card configuration from data-* attributes on DOM element
 * @param {String} cardId - The card element ID
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
    clickAction: card.dataset.clickAction || null,
    thresholds: {
      warning: card.dataset.thresholdWarning ? parseInt(card.dataset.thresholdWarning) : Infinity,
      danger: card.dataset.thresholdDanger ? parseInt(card.dataset.thresholdDanger) : Infinity
    }
  };
};

/**
 * Get all dashboard card configs from DOM
 * @returns {Object} Card configurations keyed by card name
 */
const getAllCardConfigs = () => {
  return {
    applications: getCardConfigFromDOM('applicationCard'),
    issues: getCardConfigFromDOM('issueCard'),
    processesBehind: getCardConfigFromDOM('processesBehindCard'),
    slowProcesses: getCardConfigFromDOM('slowProcessesCard')
  };
};

/**
 * Setup click handlers for CET Dashboard cards
 * Handles navigation when cards are clicked
 * 
 * @param {Object} cardConfig - Card configuration object
 */
const setupCETCardClickHandlers = (cardConfig) => {
  // Setup click handlers dynamically from config
  Object.values(cardConfig).forEach(config => {
    if (!config) return;
    const card = document.getElementById(config.cardId);
    if (card && config.clickAction) {
      card.addEventListener('click', () => {
        console.log(`${config.label} card clicked - navigating to ${config.clickAction}`);
        window.location.href = config.clickAction;
      });
      // Add hover effect to indicate card is clickable
      card.style.cursor = 'pointer';
    }
  });
};

/**
 * Render CET Dashboard cards with initial state
 * Displays cards with descriptions and placeholder values
 * 
 * @param {Object} cardConfig - Card configuration object
 */
const renderCETCards = (cardConfig) => {
  // Render each card with initial state (count = 0) using config
  Object.values(cardConfig).forEach(config => {
    if (!config) return;
    updateDashboardCard(
      config.cardId,
      0, // Initial count
      config.icon,
      config.label,
      config.description,
      config.thresholds
    );
  });
  
  // Setup card click handlers
  setupCETCardClickHandlers(cardConfig);
};

/**
 * Bind CET Dashboard cards to DataTable for dynamic updates
 * 
 * Creates a live connection between the DataTable and dashboard cards.
 * Whenever the table data changes (filter, search, pagination), this function
 * recalculates metrics and updates all cards automatically.
 * 
 * METRIC CALCULATIONS:
 * - Card 1 (Applications): Counts unique iGateApp values
 * - Card 2 (Messages/Queues): Sums numeric values from specific column
 * - Card 3 (Issues): Counts rows or sums issue-related columns
 * - Card 4 (Status): Calculates percentage or ratio based on conditions
 * 
 * HOW IT WORKS:
 * 1. Gets filtered/searched rows using table.rows({search:'applied'})
 * 2. Iterates through visible rows to calculate metrics
 * 3. Calls updateDashboardCard() for each card with new values
 * 4. Card styling (colors, icons) updates based on threshold config
 * 
 * This function is called:
 * - Once on page load (initial values)
 * - Automatically by DataTables on search/filter events
 * - After any table state change
 * 
 * @param {String} tableId - DataTable element ID to monitor
 * @param {Object} cardConfig - Card configuration object from JSON containing
 *                              card IDs, labels, thresholds, and metric definitions
 * @exports bindCETTableData - Exported for use by card-init.js
 */
export const bindCETTableData = (tableId, cardConfig) => {
  const table = $(`#${tableId}`).DataTable();
  
  const updateCards = () => {
    const filteredData = table.rows({search:'applied'}).data();
    
    // Card 1: Count unique applications
    const applications = new Set();
    filteredData.each((row) => {
      if (row.iGateApp) applications.add(row.iGateApp);
    });
    updateDashboardCard(
      cardConfig.applications.cardId,
      applications.size,
      cardConfig.applications.icon,
      cardConfig.applications.label,
      cardConfig.applications.description,
      cardConfig.applications.thresholds
    );
    
    
    
    // Card 2: Count total issues (sum of issues column)
    let totalIssues = 0;
    filteredData.each((row) => {
      totalIssues += parseInt(row.issues) || 0;
    });
    updateDashboardCard(
      cardConfig.issues.cardId, 
      totalIssues, 
      cardConfig.issues.icon,
      cardConfig.issues.label,
      cardConfig.issues.description,
      cardConfig.issues.thresholds
    );
    
    // Card 3 & 4: Sum metrics from table
  
    let processesBehind = 0;
    let slowProcesses = 0;
    
    filteredData.each((row) => {
      processesBehind += parseInt(row.processesBehind) || 0;
      slowProcesses += parseInt(row.slow) || 0;
    });
    
    updateDashboardCard(
      cardConfig.processesBehind.cardId, 
      processesBehind, 
      cardConfig.processesBehind.icon,
      cardConfig.processesBehind.label,
      cardConfig.processesBehind.description,
      cardConfig.processesBehind.thresholds
    );
    updateDashboardCard(
      cardConfig.slowProcesses.cardId, 
      slowProcesses, 
      cardConfig.slowProcesses.icon,
      cardConfig.slowProcesses.label,
      cardConfig.slowProcesses.description,
      cardConfig.slowProcesses.thresholds
    );
  };
  
  // Initial update
  updateCards();
  
  // Update when table is filtered or searched
  table.on('search.dt draw.dt', () => {
    updateCards();
  });
};

/**
 * Initialize CET Dashboard cards and bind to table
 * Uses the generic initializeCards function with dashboard-specific logic
 */
const initializeDashboard = (cardConfig) => {
  // Step 1: Render cards with initial state
  renderCETCards(cardConfig);
  
  // Step 2: Bind cards to table data (with delay for table initialization)
  setTimeout(() => {
    bindCETTableData('cetTable', cardConfig);
  }, 500);
};

// Initialize CET Dashboard cards with table integration
document.addEventListener('DOMContentLoaded', function() {
  // Get card config from DOM data-* attributes (no global variables needed)
  const cardConfig = getAllCardConfigs();
  
  if (Object.keys(cardConfig).length > 0) {
    initializeDashboard(cardConfig);
  } else {
    console.error('Card configuration not found in DOM data-* attributes');
  }
});

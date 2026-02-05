/**
 * File: cet-queues-page.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-18 12:27:09
 * 
 * CET Queues View Page Initialization
 * 
 * Page-specific initialization for the CET Queues view.
 * Handles summary cards and table filtering between queues and messages.
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
    totalQueues: getCardConfigFromDOM('totalQueuesCard'),
    enabledQueues: getCardConfigFromDOM('enabledQueuesCard'),
    disabledQueues: getCardConfigFromDOM('disabledQueuesCard'),
    totalMessages: getCardConfigFromDOM('totalMessagesCard')
  };
};

/**
 * Initialize CET Queues cards
 * Uses DOM data-* attributes for configuration (no global variables needed)
 */
const initializeCETQueuesCards = (cardConfig) => {
  // Wait for table initialization
  setTimeout(() => {
    const summaryTable = $('#cetQueuesSummary').DataTable();
    const detailsTable = $('#cetMessageDetails').DataTable();
    let currentQueueId = null;

    // Update summary cards with threshold styling
    function updateSummaryCards() {
      const data = summaryTable.rows({ search: 'applied' }).data().toArray();
      
      // Total Queues
      if (cardConfig.totalQueues) {
        const totalCount = data.length;
        updateDashboardCard(
          cardConfig.totalQueues.cardId,
          totalCount,
          cardConfig.totalQueues.icon,
          cardConfig.totalQueues.label,
          cardConfig.totalQueues.description,
          cardConfig.totalQueues.thresholds
        );
      }
      
      // Enabled Queues
      if (cardConfig.enabledQueues) {
        const enabledCount = data.filter(row => row.status === 'Enabled').length;
        updateDashboardCard(
          cardConfig.enabledQueues.cardId,
          enabledCount,
          cardConfig.enabledQueues.icon,
          cardConfig.enabledQueues.label,
          cardConfig.enabledQueues.description,
          cardConfig.enabledQueues.thresholds
        );
      }
      
      // Disabled Queues
      if (cardConfig.disabledQueues) {
        const disabledCount = data.filter(row => row.status === 'Disabled').length;
        updateDashboardCard(
          cardConfig.disabledQueues.cardId,
          disabledCount,
          cardConfig.disabledQueues.icon,
          cardConfig.disabledQueues.label,
          cardConfig.disabledQueues.description,
          cardConfig.disabledQueues.thresholds
        );
      }
      
      // Total Messages
      if (cardConfig.totalMessages) {
        const totalMessages = data.reduce((sum, row) => sum + (row.messages || 0), 0);
        updateDashboardCard(
          cardConfig.totalMessages.cardId,
          totalMessages,
          cardConfig.totalMessages.icon,
          cardConfig.totalMessages.label,
          cardConfig.totalMessages.description,
          cardConfig.totalMessages.thresholds
        );
      }
    }

    // Initialize summary cards
    updateSummaryCards();

    // Update cards on search/filter
    summaryTable.on('search.dt draw.dt', function() {
      updateSummaryCards();
    });

    // Row click handler for filtering message details
    $('#cetQueuesSummary tbody').on('click', 'tr', function() {
      const data = summaryTable.row(this).data();
      
      // Toggle selection
      if ($(this).hasClass('selected')) {
        // Deselect and clear filter
        $(this).removeClass('selected');
        currentQueueId = null;
        detailsTable.column(0).search('').draw();
        $('#filterBadge').hide();
      } else {
        // Remove previous selection
        $('#cetQueuesSummary tbody tr').removeClass('selected');
        // Add selection to clicked row
        $(this).addClass('selected');
        // Filter message details table
        currentQueueId = data.queueId;
        detailsTable.column(0).search('^' + data.queueId + '$', true, false).draw();
        // Show filter badge
        $('#filterBadge').html(`
          <i class="bi bi-funnel-fill"></i> Filtered by Queue: <strong>${data.queueName}</strong>
        `).show();
      }
    });

    // Add keyboard support
    $('#cetQueuesSummary tbody').on('keypress', 'tr', function(e) {
      if (e.which === 13) { // Enter key
        $(this).click();
      }
    });

    // Make rows focusable
    $('#cetQueuesSummary tbody tr').attr('tabindex', '0');

    // Clear filters
    function clearFilters() {
      $('#cetQueuesSummary tbody tr').removeClass('selected');
      currentQueueId = null;
      detailsTable.column(0).search('').draw();
      $('#filterBadge').hide();
    }

    // Clear filter button handler
    $('#clearFilter').on('click', clearFilters);
  }, 500);
};

// Initialize using DOM data-* attributes (no global variables needed)
document.addEventListener('DOMContentLoaded', () => {
  const cardConfig = getAllCardConfigs();
  
  if (Object.keys(cardConfig).length > 0 && Object.values(cardConfig).some(c => c !== null)) {
    initializeCETQueuesCards(cardConfig);
  } else {
    console.error('Card configuration not found in DOM data-* attributes');
  }
});

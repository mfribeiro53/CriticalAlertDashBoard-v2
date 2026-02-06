/**
 * Card Init Bridge
 * 
 * This file bridges the card-kit library with CET-specific customizations.
 * The core functionality comes from the library, while CET-specific handlers
 * are registered from the local helpers.
 * 
 * ARCHITECTURE:
 * - card-kit (library in /js/lib/card-kit/) provides: core init, helpers, state management
 * - This project provides: CET-specific card handlers, page-specific logic
 */

'use strict';

// Import everything from the library
import {
  initializeCards,
  initializeCard,
  refreshCard,
  closeCard,
  toggleCollapse,
  toggleFullscreen,
  showLoading,
  hideLoading,
  saveCardState,
  restoreCardState,
  getCard,
  registerCardHandler,
  cardStates,
  customHandlers,
  sanitizeHTML,
  escapeHTML,
  updateCardContent,
  updateStatCard,
  updateMetricCard,
  showToast,
  loadCardConfig,
  initializeCardsFromConfig,
  setup,
  createMetricCard,
  VERSION
} from './lib/card-kit/index.js';

// Import CET-specific card handlers (project-specific customizations)
import { updateDashboardCard } from './card-custom-handlers.js';

// Re-export everything for use by other modules in this app
export {
  // Core functions
  initializeCards,
  initializeCard,
  refreshCard,
  closeCard,
  toggleCollapse,
  toggleFullscreen,
  showLoading,
  hideLoading,
  saveCardState,
  restoreCardState,
  getCard,
  registerCardHandler,
  cardStates,
  customHandlers,
  
  // Helper functions
  sanitizeHTML,
  escapeHTML,
  updateCardContent,
  updateStatCard,
  updateMetricCard,
  showToast,
  loadCardConfig,
  initializeCardsFromConfig,
  
  // Convenience functions
  setup,
  createMetricCard,
  VERSION,
  
  // CET-specific 
  updateDashboardCard
};

// Auto-initialize cards on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Card Init Bridge: Auto-initializing cards...');
  initializeCards();
});

console.log('✅ Card Init Bridge loaded - using card-kit library v' + VERSION);

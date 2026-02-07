/**
 * Card Kit - Main Entry Point
 * 
 * A configuration-driven Bootstrap card enhancement library providing:
 * - Metric/Stat Cards with threshold-based styling
 * - Card Actions (collapse, refresh, close, fullscreen)
 * - State Management (localStorage persistence)
 * - Loading States with spinners
 * - Toast Notifications
 * - Event System for card lifecycle
 * 
 * @module card-kit
 */

'use strict';

// ============================================================================
// CORE EXPORTS
// ============================================================================

export {
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
  customHandlers
} from './core/card-init.js';

// ============================================================================
// HELPER EXPORTS
// ============================================================================

export {
  sanitizeHTML,
  escapeHTML,
  updateCardContent,
  updateStatCard,
  updateMetricCard,
  showToast,
  loadCardConfig,
  initializeCardsFromConfig
} from './core/card-helpers.js';

// ============================================================================
// VERSION INFO
// ============================================================================

export const VERSION = '1.0.0';

// ============================================================================
// CONVENIENCE INITIALIZATION
// ============================================================================

/**
 * Quick setup function for simple use cases
 * Initializes all cards on the page and optionally loads configuration
 * 
 * @param {Object} options - Configuration options
 * @param {String} options.configPath - Optional path to card configuration JSON
 * @param {Function} options.onReady - Callback when cards are initialized
 * @returns {Promise<void>}
 * 
 * @example
 * import { setup } from '@mfribeiro/card-kit';
 * 
 * setup({
 *   onReady: () => console.log('Cards initialized!')
 * });
 */
export async function setup(options = {}) {
  const { initializeCards } = await import('./core/card-init.js');
  
  // Initialize when DOM is ready
  const init = async () => {
    initializeCards();
    
    if (options.configPath) {
      const { loadCardConfig } = await import('./core/card-helpers.js');
      const config = await loadCardConfig(options.configPath);
      if (config && options.onConfig) {
        options.onConfig(config);
      }
    }
    
    if (options.onReady) {
      options.onReady();
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    await init();
  }
}

/**
 * Create a metric card programmatically
 * 
 * @param {Object} config - Card configuration
 * @param {String} config.id - Card element ID
 * @param {String} config.containerId - Container to append card to
 * @param {Number} config.value - Initial value
 * @param {String} config.label - Card label
 * @param {String} config.icon - Bootstrap icon name
 * @param {String} config.description - Optional description
 * @param {Object} config.thresholds - {warning, danger} thresholds
 * @returns {HTMLElement} The created card element
 */
export function createMetricCard(config) {
  const {
    id,
    containerId,
    value = 0,
    label = '',
    icon = 'graph-up',
    description = '',
    thresholds = { warning: 10, danger: 50 }
  } = config;
  
  const card = document.createElement('div');
  card.id = id;
  card.className = 'card shadow-sm';
  card.dataset.cardType = 'metric';
  
  card.innerHTML = `
    <div class="card-body">
      <h5 class="card-subtitle mb-1 text-muted">
        <i class="bi bi-${icon}"></i> ${label}
      </h5>
      ${description ? `<small class="text-muted d-block mb-2 card-description">${description}</small>` : ''}
      <h3 class="card-title mb-0">${value}</h3>
    </div>
  `;
  
  if (containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.appendChild(card);
    }
  }
  
  // Apply initial threshold styling
  import('./core/card-helpers.js').then(({ updateMetricCard }) => {
    updateMetricCard(id, { value, label, icon, description, thresholds });
  });
  
  return card;
}

console.log('✅ Card Kit loaded - v' + VERSION);

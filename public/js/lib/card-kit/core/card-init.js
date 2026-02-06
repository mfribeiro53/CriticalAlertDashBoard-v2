/**
 * Card Kit - Core Card Initialization
 * 
 * Provides card initialization, action handling, and state management.
 * 
 * @module card-kit/core
 */

'use strict';

import { showToast } from './card-helpers.js';

// State management
const cardStates = {};

// Custom handlers registry
const customHandlers = {
  cards: {}
};

/**
 * Register custom handlers for a specific card
 * @param {String} cardId - Card ID
 * @param {Object} handlers - Handler functions {refresh, close, etc.}
 */
export const registerCardHandler = (cardId, handlers) => {
  customHandlers.cards[cardId] = handlers;
};

/**
 * Initialize all cards on the page
 */
export const initializeCards = () => {
  const cards = document.querySelectorAll('[data-card-type]');
  cards.forEach(card => {
    initializeCard(card);
  });
};

/**
 * Initialize a single card
 * @param {HTMLElement} card - Card element
 */
export const initializeCard = (card) => {
  const cardId = card.id;
  const cardType = card.dataset.cardType;

  // Setup action button handlers
  setupCardActions(card);

  // Store card state
  cardStates[cardId] = {
    type: cardType,
    collapsed: card.classList.contains('card-collapsed'),
    loading: card.querySelector('.card-loading-overlay') !== null
  };

  // Restore saved state from localStorage
  restoreCardState(cardId);

  // Trigger custom initialization event
  const event = new CustomEvent('card:initialized', {
    detail: { cardId, cardType }
  });
  card.dispatchEvent(event);
};

/**
 * Setup card action button handlers
 * @param {HTMLElement} card - Card element
 */
const setupCardActions = (card) => {
  const actionButtons = card.querySelectorAll('[data-card-action]');
  
  actionButtons.forEach(button => {
    const action = button.dataset.cardAction;
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      handleCardAction(card, action, button);
    });
  });
};

/**
 * Handle card actions (collapse, refresh, close, fullscreen)
 * @param {HTMLElement} card - Card element
 * @param {String} action - Action type
 * @param {HTMLElement} button - Action button
 */
const handleCardAction = (card, action, button) => {
  const cardId = card.id;

  switch (action) {
    case 'collapse':
      toggleCollapse(card, button);
      break;
    case 'refresh':
      refreshCard(card);
      break;
    case 'close':
      closeCard(card);
      break;
    case 'fullscreen':
      toggleFullscreen(card, button);
      break;
    default:
      console.warn('Unknown card action:', action);
  }

  // Trigger custom action event
  const event = new CustomEvent('card:action', {
    detail: { cardId, action }
  });
  card.dispatchEvent(event);
};

/**
 * Toggle card collapse/expand
 * @param {HTMLElement} card - Card element
 * @param {HTMLElement} button - Collapse button
 */
export const toggleCollapse = (card, button) => {
  const wrapper = card.querySelector('.card-body-wrapper');
  const icon = button?.querySelector('i');
  
  if (!wrapper) return;

  const isCollapsed = wrapper.classList.contains('d-none');
  
  if (isCollapsed) {
    // Expand
    wrapper.classList.remove('d-none');
    card.classList.remove('card-collapsed');
    if (icon) icon.className = 'bi bi-chevron-up';
    if (button) button.title = 'Collapse';
  } else {
    // Collapse
    wrapper.classList.add('d-none');
    card.classList.add('card-collapsed');
    if (icon) icon.className = 'bi bi-chevron-down';
    if (button) button.title = 'Expand';
  }

  // Save state
  saveCardState(card.id, { collapsed: !isCollapsed });

  // Trigger event
  const event = new CustomEvent('card:collapse', {
    detail: { cardId: card.id, collapsed: !isCollapsed }
  });
  card.dispatchEvent(event);
};

/**
 * Refresh card content
 * @param {HTMLElement} card - Card element
 */
export const refreshCard = (card) => {
  const cardId = card.id;
  
  // Show loading state
  showLoading(card);

  // Check for custom refresh handler
  if (customHandlers.cards[cardId]?.refresh) {
    // Call custom refresh handler
    const result = customHandlers.cards[cardId].refresh(card);
    
    // If handler returns a promise, wait for it
    if (result && typeof result.then === 'function') {
      result
        .then(() => hideLoading(card))
        .catch((error) => {
          console.error('Card refresh error:', error);
          hideLoading(card);
          showToast('Error refreshing card', 'danger');
        });
    } else {
      hideLoading(card);
    }
  } else {
    // Default refresh behavior
    setTimeout(() => {
      hideLoading(card);
      showToast('Card refreshed', 'success');
    }, 1000);
  }

  // Trigger event
  const event = new CustomEvent('card:refresh', {
    detail: { cardId }
  });
  card.dispatchEvent(event);
};

/**
 * Close/remove card
 * @param {HTMLElement} card - Card element
 */
export const closeCard = (card) => {
  const cardId = card.id;

  // Check for custom close handler
  if (customHandlers.cards[cardId]?.close) {
    const result = customHandlers.cards[cardId].close(card);
    if (result === false) return; // Cancel close
  }

  // Animate and remove
  card.style.transition = 'opacity 0.3s, transform 0.3s';
  card.style.opacity = '0';
  card.style.transform = 'scale(0.9)';

  setTimeout(() => {
    card.remove();
    
    // Clean up state
    if (cardStates[cardId]) {
      delete cardStates[cardId];
    }
    
    // Trigger event
    const event = new CustomEvent('card:closed', {
      detail: { cardId }
    });
    document.dispatchEvent(event);
  }, 300);
};

/**
 * Toggle card fullscreen mode
 * @param {HTMLElement} card - Card element
 * @param {HTMLElement} button - Fullscreen button
 */
export const toggleFullscreen = (card, button) => {
  const icon = button?.querySelector('i');
  const isFullscreen = card.classList.contains('card-fullscreen');

  if (isFullscreen) {
    // Exit fullscreen
    card.classList.remove('card-fullscreen');
    if (icon) icon.className = 'bi bi-arrows-fullscreen';
    if (button) button.title = 'Fullscreen';
    document.body.classList.remove('card-fullscreen-active');
  } else {
    // Enter fullscreen
    card.classList.add('card-fullscreen');
    if (icon) icon.className = 'bi bi-fullscreen-exit';
    if (button) button.title = 'Exit Fullscreen';
    document.body.classList.add('card-fullscreen-active');
  }

  // Trigger event
  const event = new CustomEvent('card:fullscreen', {
    detail: { cardId: card.id, fullscreen: !isFullscreen }
  });
  card.dispatchEvent(event);
};

/**
 * Show loading overlay on card
 * @param {HTMLElement} card - Card element
 */
export const showLoading = (card) => {
  let overlay = card.querySelector('.card-loading-overlay');
  
  if (!overlay) {
    const wrapper = card.querySelector('.card-body-wrapper') || card.querySelector('.card-body');
    if (!wrapper) return;

    overlay = document.createElement('div');
    overlay.className = 'card-loading-overlay';
    overlay.innerHTML = `
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    `;
    wrapper.style.position = 'relative';
    wrapper.appendChild(overlay);
  } else {
    overlay.style.display = 'flex';
  }

  // Update state
  if (cardStates[card.id]) {
    cardStates[card.id].loading = true;
  }
};

/**
 * Hide loading overlay on card
 * @param {HTMLElement} card - Card element
 */
export const hideLoading = (card) => {
  const overlay = card.querySelector('.card-loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }

  // Update state
  if (cardStates[card.id]) {
    cardStates[card.id].loading = false;
  }
};

/**
 * Save card state to localStorage
 * @param {String} cardId - Card ID
 * @param {Object} state - State object
 */
export const saveCardState = (cardId, state) => {
  const key = 'cardState_' + cardId;
  const currentState = JSON.parse(localStorage.getItem(key) || '{}');
  const newState = { ...currentState, ...state };
  localStorage.setItem(key, JSON.stringify(newState));
};

/**
 * Restore card state from localStorage
 * @param {String} cardId - Card ID
 */
export const restoreCardState = (cardId) => {
  const key = 'cardState_' + cardId;
  const state = JSON.parse(localStorage.getItem(key) || '{}');
  
  const card = document.getElementById(cardId);
  if (!card) return;

  // Restore collapsed state
  if (state.collapsed !== undefined) {
    const wrapper = card.querySelector('.card-body-wrapper');
    const collapseBtn = card.querySelector('[data-card-action="collapse"]');
    
    if (state.collapsed) {
      if (wrapper) wrapper.classList.add('d-none');
      card.classList.add('card-collapsed');
      if (collapseBtn) {
        const icon = collapseBtn.querySelector('i');
        if (icon) icon.className = 'bi bi-chevron-down';
        collapseBtn.title = 'Expand';
      }
    }
  }
};

/**
 * Get card instance
 * @param {String} cardId - Card ID
 * @returns {Object} Card instance with helper methods
 */
export const getCard = (cardId) => {
  const card = document.getElementById(cardId);
  if (!card) {
    console.warn('Card not found:', cardId);
    return null;
  }

  return {
    element: card,
    id: cardId,
    type: card.dataset.cardType,
    refresh: () => refreshCard(card),
    close: () => closeCard(card),
    showLoading: () => showLoading(card),
    hideLoading: () => hideLoading(card),
    getState: () => cardStates[cardId] || null
  };
};

// Export state and handlers
export { cardStates, customHandlers };

console.log('✅ Card Kit Core loaded');

/**
 * File: card-helpers.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-18 12:24:02
 * 
 * Bootstrap Card Wrapper - Helper Functions
 * Provides utilities for card initialization, refresh, and interactions
 */

'use strict';

// State management
const cardStates = {};

/**
 * Sanitize HTML string to prevent XSS attacks
 * @param {String} html - HTML string to sanitize
 * @returns {String} Sanitized HTML
 */
const sanitizeHTML = (html) => {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

/**
 * Escape HTML entities in a string
 * @param {String} text - Text to escape
 * @returns {String} Escaped text
 */
const escapeHTML = (text) => {
  if (typeof text !== 'string') return text;
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Initialize all cards on the page
 */
const initializeCards = () => {
    const cards = document.querySelectorAll('[data-card-type]');
    cards.forEach(card => {
      initializeCard(card);
    });
  }

  /**
   * Initialize a single card
   * @param {HTMLElement} card - Card element
   */
  const initializeCard = (card) => {
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
  }

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
  }

  /**
   * Handle card actions (collapse, refresh, close, fullscreen)
   * @param {HTMLElement} card - Card element
   * @param {String} action - Action type
   * @param {HTMLElement} button - Action button
   */
  const handleCardAction = (card, action, button) => {
    const cardId = card.id;

    switch(action) {
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
  }

  /**
   * Toggle card collapse/expand
   * @param {HTMLElement} card - Card element
   * @param {HTMLElement} button - Collapse button
   */
  const toggleCollapse = (card, button) => {
    const wrapper = card.querySelector('.card-body-wrapper');
    const icon = button.querySelector('i');
    
    if (!wrapper) return;

    const isCollapsed = wrapper.classList.contains('d-none');
    
    if (isCollapsed) {
      // Expand
      wrapper.classList.remove('d-none');
      card.classList.remove('card-collapsed');
      icon.className = 'bi bi-chevron-up';
      button.title = 'Collapse';
    } else {
      // Collapse
      wrapper.classList.add('d-none');
      card.classList.add('card-collapsed');
      icon.className = 'bi bi-chevron-down';
      button.title = 'Expand';
    }

    // Save state
    saveCardState(card.id, { collapsed: !isCollapsed });

    // Trigger event
    const event = new CustomEvent('card:collapse', {
      detail: { cardId: card.id, collapsed: !isCollapsed }
    });
    card.dispatchEvent(event);
  }

  /**
   * Refresh card content
   * @param {HTMLElement} card - Card element
   */
  const refreshCard = (card) => {
    const cardId = card.id;
    
    // Show loading state
    showLoading(card);

    // Check for custom refresh handler
    const customHandlers = window.customHandlers || {};
    if (customHandlers.cards && 
        customHandlers.cards[cardId] && 
        customHandlers.cards[cardId].refresh) {
      
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
      // Default refresh behavior - reload the page section
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
  }

  /**
   * Close/remove card
   * @param {HTMLElement} card - Card element
   */
  const closeCard = (card) => {
    const cardId = card.id;

    // Check for custom close handler
    const customHandlers = window.customHandlers || {};
    if (customHandlers.cards && 
        customHandlers.cards[cardId] && 
        customHandlers.cards[cardId].close) {
      
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
  }

  /**
   * Toggle card fullscreen mode
   * @param {HTMLElement} card - Card element
   * @param {HTMLElement} button - Fullscreen button
   */
  const toggleFullscreen = (card, button) => {
    const icon = button.querySelector('i');
    const isFullscreen = card.classList.contains('card-fullscreen');

    if (isFullscreen) {
      // Exit fullscreen
      card.classList.remove('card-fullscreen');
      icon.className = 'bi bi-arrows-fullscreen';
      button.title = 'Fullscreen';
      document.body.classList.remove('card-fullscreen-active');
    } else {
      // Enter fullscreen
      card.classList.add('card-fullscreen');
      icon.className = 'bi bi-fullscreen-exit';
      button.title = 'Exit Fullscreen';
      document.body.classList.add('card-fullscreen-active');
    }

    // Trigger event
    const event = new CustomEvent('card:fullscreen', {
      detail: { cardId: card.id, fullscreen: !isFullscreen }
    });
    card.dispatchEvent(event);
  }

  /**
   * Show loading overlay on card
   * @param {HTMLElement} card - Card element
   */
  const showLoading = (card) => {
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
  }

  /**
   * Hide loading overlay on card
   * @param {HTMLElement} card - Card element
   */
  const hideLoading = (card) => {
    const overlay = card.querySelector('.card-loading-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }

    // Update state
    if (cardStates[card.id]) {
      cardStates[card.id].loading = false;
    }
  }

  /**
   * Update card content
   * @param {String} cardId - Card ID
   * @param {String|HTMLElement} content - New content
   * @param {Boolean} sanitize - Whether to sanitize HTML content (default: true)
   */
  const updateCardContent = (cardId, content, sanitize = true) => {
    const card = document.getElementById(cardId);
    if (!card) {
      console.warn('Card not found:', cardId);
      return;
    }

    const body = card.querySelector('.card-body');
    if (!body) return;

    if (typeof content === 'string') {
      // Sanitize HTML to prevent XSS attacks unless explicitly disabled
      body.innerHTML = sanitize ? sanitizeHTML(content) : content;
    } else if (content instanceof HTMLElement) {
      body.innerHTML = '';
      body.appendChild(content);
    }

    // Trigger event
    const event = new CustomEvent('card:updated', {
      detail: { cardId }
    });
    card.dispatchEvent(event);
  }

  /**
   * Update stat card value
   * @param {String} cardId - Card ID
   * @param {Object} stats - Stats object {value, label, change}
   */
  const updateStatCard = (cardId, stats) => {
    const card = document.getElementById(cardId);
    if (!card || card.dataset.cardType !== 'stat') {
      console.warn('Stat card not found:', cardId);
      return;
    }

    if (stats.value !== undefined) {
      const valueEl = card.querySelector('.stat-value');
      if (valueEl) valueEl.textContent = stats.value;
    }

    if (stats.label !== undefined) {
      const labelEl = card.querySelector('.stat-label');
      if (labelEl) labelEl.textContent = stats.label;
    }

    if (stats.change !== undefined) {
      let changeEl = card.querySelector('.stat-change');
      if (!changeEl) {
        changeEl = document.createElement('div');
        changeEl.className = 'stat-change';
        card.querySelector('.stat-card').appendChild(changeEl);
      }
      
      const isPositive = stats.change > 0;
      changeEl.className = 'stat-change ' + (isPositive ? 'text-success' : 'text-danger');
      changeEl.innerHTML = `
        <i class="bi bi-${isPositive ? 'arrow-up' : 'arrow-down'}"></i>
        ${Math.abs(stats.change)}%
        <span class="text-muted small">vs last period</span>
      `;
    }

    // Trigger event
    const event = new CustomEvent('card:stat-updated', {
      detail: { cardId, stats }
    });
    card.dispatchEvent(event);
  }

  /**
   * Save card state to localStorage
   * @param {String} cardId - Card ID
   * @param {Object} state - State object
   */
  const saveCardState = (cardId, state) => {
    const key = 'cardState_' + cardId;
    const currentState = JSON.parse(localStorage.getItem(key) || '{}');
    const newState = { ...currentState, ...state };
    localStorage.setItem(key, JSON.stringify(newState));
  }

  /**
   * Restore card state from localStorage
   * @param {String} cardId - Card ID
   */
  const restoreCardState = (cardId) => {
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
  }

  /**
   * Show toast notification
   * @param {String} message - Toast message
   * @param {String} type - Toast type (success, danger, warning, info)
   */
  const showToast = (message, type = 'info') => {
    // Check if Bootstrap toast container exists
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(container);
    }

    // Create toast
    const toastId = 'toast-' + Date.now();
    // Escape message to prevent XSS attacks
    const safeMessage = escapeHTML(message);
    const toastHtml = `
      <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-${type} text-white">
          <strong class="me-auto">
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'danger' ? 'x-circle' : 'info-circle'}"></i>
            Notification
          </strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
          ${safeMessage}
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);

    // Show toast
    const toastElement = document.getElementById(toastId);
    const toast = new window.bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();

    // Remove after hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }

  /**
   * Get card instance
   * @param {String} cardId - Card ID
   * @returns {Object} Card instance with helper methods
   */
  const getCard = (cardId) => {
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
      updateContent: (content) => updateCardContent(cardId, content),
      updateStats: (stats) => updateStatCard(cardId, stats),
      getState: () => cardStates[cardId] || null
    };
  }

// Export public API
export {
  initializeCards,
  initializeCard,
  refreshCard,
  closeCard,
  showLoading,
  hideLoading,
  updateCardContent,
  updateStatCard,
  saveCardState,
  restoreCardState,
  showToast,
  getCard,
  cardStates,
  sanitizeHTML,
  escapeHTML
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCards);
} else {
  initializeCards();
}

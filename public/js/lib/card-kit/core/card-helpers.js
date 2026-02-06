/**
 * Card Kit - Helper Functions
 * 
 * Utility functions for card content updates, sanitization, and notifications.
 * 
 * @module card-kit/helpers
 */

'use strict';

/**
 * Sanitize HTML string to prevent XSS attacks
 * @param {String} html - HTML string to sanitize
 * @returns {String} Sanitized HTML
 */
export const sanitizeHTML = (html) => {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};

/**
 * Escape HTML entities in a string
 * @param {String} text - Text to escape
 * @returns {String} Escaped text
 */
export const escapeHTML = (text) => {
  if (typeof text !== 'string') return text;
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

/**
 * Update card content
 * @param {String} cardId - Card ID
 * @param {String|HTMLElement} content - New content
 * @param {Boolean} sanitize - Whether to sanitize HTML content (default: true)
 */
export const updateCardContent = (cardId, content, sanitize = true) => {
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
};

/**
 * Update stat card value
 * @param {String} cardId - Card ID
 * @param {Object} stats - Stats object {value, label, change}
 */
export const updateStatCard = (cardId, stats) => {
  const card = document.getElementById(cardId);
  if (!card) {
    console.warn('Card not found:', cardId);
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
      const statCard = card.querySelector('.stat-card') || card.querySelector('.card-body');
      if (statCard) statCard.appendChild(changeEl);
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
};

/**
 * Update dashboard metric card with dynamic styling based on thresholds
 * 
 * @param {String} cardId - Card element ID
 * @param {Object} config - Card configuration
 * @param {Number} config.value - Metric value
 * @param {String} config.icon - Bootstrap icon class name (without 'bi-' prefix)
 * @param {String} config.label - Card label text
 * @param {String} config.description - Small helper text describing the metric
 * @param {Object} config.thresholds - Object with warning and danger thresholds
 */
export const updateMetricCard = (cardId, config) => {
  const { value, icon, label, description, thresholds } = config;
  
  let variant, textColor, iconColor;
  
  if (value < thresholds.warning) {
    variant = 'success';
    textColor = 'text-success';
    iconColor = 'text-success';
  } else if (value < thresholds.danger) {
    variant = 'warning';
    textColor = 'text-warning';
    iconColor = 'text-warning';
  } else {
    variant = 'danger';
    textColor = 'text-danger';
    iconColor = 'text-danger';
  }
  
  // Update the card border
  const card = document.getElementById(cardId);
  if (!card) return;
  
  card.className = `card shadow-sm border-${variant}`;
  
  // Update the content with appropriate colors
  const cardBody = card.querySelector('.card-body');
  if (cardBody) {
    // Escape dynamic content to prevent XSS
    const safeLabel = escapeHTML(label);
    const safeDescription = escapeHTML(description || '');
    const safeValue = escapeHTML(typeof value === 'number' ? value.toLocaleString() : String(value));
    
    cardBody.innerHTML = `
      <h5 class="card-subtitle mb-1 text-muted">
        <i class="bi bi-${icon} ${iconColor}"></i> ${safeLabel}
      </h5>
      ${safeDescription ? `<small class="text-muted d-block mb-2 card-description">${safeDescription}</small>` : ''}
      <h3 class="card-title ${textColor} mb-0">${safeValue}</h3>
    `;
  }

  // Trigger event
  const event = new CustomEvent('card:metric-updated', {
    detail: { cardId, config }
  });
  card.dispatchEvent(event);
};

/**
 * Show toast notification
 * @param {String} message - Toast message
 * @param {String} type - Toast type (success, danger, warning, info)
 */
export const showToast = (message, type = 'info') => {
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

  // Show toast (requires Bootstrap 5)
  const toastElement = document.getElementById(toastId);
  if (window.bootstrap?.Toast) {
    const toast = new window.bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();

    // Remove after hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  } else {
    // Fallback: auto-remove after 3 seconds
    setTimeout(() => {
      toastElement.remove();
    }, 3000);
  }
};

/**
 * Load card configuration from JSON file
 * @param {String} configPath - Path to JSON configuration file
 * @returns {Promise<Object>} Card configuration
 */
export const loadCardConfig = async (configPath) => {
  try {
    const response = await fetch(configPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to load card configuration:', error.message);
    console.error(`Configuration path: ${configPath}`);
    return null;
  }
};

/**
 * Initialize cards from configuration with custom update function
 * 
 * @param {String} configPath - Path to card configuration JSON file
 * @param {Function} updateFunction - Custom function to call with the config
 * @param {Object} options - Additional options for initialization
 */
export const initializeCardsFromConfig = async (configPath, updateFunction, options = {}) => {
  const config = await loadCardConfig(configPath);
  
  if (config && typeof updateFunction === 'function') {
    updateFunction(config, options);
  } else if (!updateFunction || typeof updateFunction !== 'function') {
    console.error('Invalid update function provided to initializeCardsFromConfig');
  }
};

console.log('✅ Card Kit Helpers loaded');

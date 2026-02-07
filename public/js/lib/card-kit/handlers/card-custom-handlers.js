/**
 * File: card-custom-handlers.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-23 (Security update)
 * 
 * Card Custom Handlers - Generic Card Utilities
 * 
 * This file contains only truly generic, reusable card functions that can be
 * used across any dashboard without modification. Page-specific logic should
 * be placed in page-specific files under /pages/ directory.
 * 
 * SCOPE:
 * - Generic card update function (updateDashboardCard)
 * 
 * ARCHITECTURE:
 * - Generic utilities live here (no hardcoded card IDs or navigation)
 * - Page-specific logic lives in /pages/*-page.js files
 * - Orchestration happens in card-init.js
 * 
 * NAMING CONVENTION:
 * All functions are exported as named exports
 */

'use strict';

/**
 * Escape HTML entities to prevent XSS attacks
 * @param {String} text - Text to escape
 * @returns {String} Escaped text
 */
function escapeHTML(text) {
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
 * Update dashboard metric card with dynamic styling based on thresholds
 * This is a generic utility that works with any card - no hardcoded assumptions
 * 
 * @param {String} cardId - Card element ID
 * @param {Number} count - Metric value
 * @param {String} iconClass - Bootstrap icon class name
 * @param {String} label - Card label text
 * @param {String} description - Small helper text describing the metric
 * @param {Object} thresholds - Object with warning and danger thresholds
 */
export const updateDashboardCard = (cardId, count, iconClass, label, description, thresholds) => {
    let variant, textColor, iconColor;
    
    if (count < thresholds.warning) {
      variant = 'success';
      textColor = 'text-success';
      iconColor = 'text-success';
    } else if (count < thresholds.danger) {
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
      const safeDescription = escapeHTML(description);
      const safeCount = escapeHTML(typeof count === 'number' ? count.toLocaleString() : String(count));
      
      cardBody.innerHTML = `
        <h5 class="card-subtitle mb-1 text-muted">
          <i class="bi bi-${iconClass} ${iconColor}"></i> ${safeLabel}
        </h5>
        <small class="text-muted d-block mb-2 card-description">${safeDescription}</small>
        <h3 class="card-title ${textColor} mb-0">${safeCount}</h3>
      `;
    }
  }


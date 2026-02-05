/**
 * File: cet-render-helpers.js
 * Created: 2026-01-08
 * 
 * CET-Specific DataTable Render Helper Functions
 * 
 * This module provides render functions specifically for CET (Central Engine Technology)
 * dashboard tables. These functions handle CET-specific data formatting, color coding,
 * and interactive elements.
 * 
 * ARCHITECTURE:
 * - Domain-specific helpers are separated from generic table-helpers.js
 * - Only used by CET-related pages and tables
 * - Follows same render function patterns as generic helpers
 * 
 * RENDER FUNCTION SIGNATURE:
 * All functions follow DataTables render signature:
 * @param {any} data - Cell data value
 * @param {string} type - Render context: 'display', 'filter', 'sort', 'type'
 * @param {object} row - Full row data object
 * @param {*} meta - Additional metadata or configuration
 * @returns {string|any} Formatted HTML for 'display', raw data for other types
 * 
 * COLOR CODING STANDARDS:
 * - Green (bg-success): No issues (0 count)
 * - Blue (bg-info): Low severity (1-2 or 1-4 depending on metric)
 * - Yellow (bg-warning): Medium severity (3-4 or 5-8)
 * - Red (bg-danger): High severity (5+ or 9+)
 * 
 * USAGE:
 * Import in CET page files:
 * import * as CETRenders from '../helpers/cet-render-helpers.js';
 * 
 * Reference in column config:
 * { data: 'issues', render: 'renderCETThresholdAlerts' }
 */

'use strict';

/**
 * Render CET threshold alerts as clickable badge with color coding
 * 
 * Combines clickable link functionality with threshold badge styling.
 * Creates color-coded badges that become clickable links when a URL template is provided.
 * 
 * COLOR CODING:
 * - 0 issues → green (success)
 * - 1-4 issues → blue (info)
 * - 5-8 issues → yellow (warning)
 * - 9+ issues → red (danger)
 * 
 * BEHAVIOR:
 * - Returns non-clickable badge if no URL template provided
 * - Returns non-clickable badge if data is 0
 * - Returns non-clickable badge if URL template placeholder cannot be resolved
 * - Returns clickable badge wrapped in anchor tag for valid scenarios
 * 
 * @param {number} data - Issues count
 * @param {string} type - DataTables render type ('display', 'filter', 'sort', 'type')
 * @param {object} row - Full row data object for URL template placeholder substitution
 * @param {string} urlTemplate - URL template with {placeholder} syntax (e.g., '/cet-issues?app={iGateApp}')
 * @returns {string} HTML string for clickable badge (display) or raw data (other types)
 * 
 * @example
 * Input: data=5, urlTemplate='/cet-issues?app={iGateApp}', row={iGateApp: 'MyApp'}
 * Output: '<a href="/cet-issues?app=MyApp" class="dt-clickable"><span class="badge bg-warning">5</span></a>'
 */
export function renderClickableCETThresholdAlerts(data, type, row, urlTemplate) {
  if (type === 'display') {
    // Determine badge class based on count
    let badgeClass = 'bg-success';
    if (data > 8) badgeClass = 'bg-danger';
    else if (data > 4) badgeClass = 'bg-warning';
    else if (data > 0) badgeClass = 'bg-info';
    
    // If no URL template or no data, return non-clickable badge
    if (!urlTemplate || data === 0) {
      return `<span class="badge ${badgeClass}">${data}</span>`;
    }
    
    // Process URL template
    try {
      let url = urlTemplate;
      const placeholderRegex = /\{([^}]+)\}/g;
      let match;
      
      while ((match = placeholderRegex.exec(urlTemplate)) !== null) {
        const placeholder = match[1];
        const keys = placeholder.split('.');
        let value = row;
        
        for (const key of keys) {
          if (value && typeof value === 'object' && key in value) {
            value = value[key];
          } else {
            console.warn(`Property path "${placeholder}" not found in row data`);
            value = null;
            break;
          }
        }
        
        if (value !== null && value !== undefined) {
          url = url.replace(`{${placeholder}}`, encodeURIComponent(value));
        } else {
          // Return non-clickable badge if placeholder cannot be resolved
          return `<span class="badge ${badgeClass}">${data}</span>`;
        }
      }
      
      // Return clickable badge
      return `<a href="${url}" class="dt-clickable"><span class="badge ${badgeClass}">${data}</span></a>`;
    } catch (e) {
      console.warn('Error processing URL template:', e);
      return `<span class="badge ${badgeClass}">${data}</span>`;
    }
  }
  return data;
}

/**
 * Render CET threshold alerts badge with color coding (non-clickable version)
 * 
 * Simple badge display without click functionality.
 * Use this for summary displays or when navigation is not needed.
 * 
 * COLOR CODING:
 * - 0 issues → green (success)
 * - 1-4 issues → blue (info)
 * - 5-8 issues → yellow (warning)
 * - 9+ issues → red (danger)
 * 
 * @param {number} data - Issues count
 * @param {string} type - DataTables render type
 * @returns {string} HTML string for badge
 */
export function renderCETThresholdAlerts(data, type) {
  if (type === 'display') {
    if (data === 0) return '<span class="badge bg-success">0</span>';
    const badgeClass = data > 8 ? 'bg-danger' : data > 4 ? 'bg-warning' : 'bg-info';
    return `<span class="badge ${badgeClass}">${data}</span>`;
  }
  return data;
}

/**
 * Render CET alerts badge with color coding
 * 
 * Displays general CET alerts with different threshold levels than threshold alerts.
 * 
 * COLOR CODING:
 * - 0 alerts → green (success)
 * - 1-2 alerts → blue (info)
 * - 3-4 alerts → yellow (warning)
 * - 5+ alerts → red (danger)
 * 
 * @param {number} data - Alerts count
 * @param {string} type - DataTables render type
 * @returns {string} HTML string for badge
 */
export function renderCETAlerts(data, type) {
  if (type === 'display') {
    if (data === 0) return '<span class="badge bg-success">0</span>';
    const badgeClass = data > 4 ? 'bg-danger' : data > 2 ? 'bg-warning' : 'bg-info';
    return `<span class="badge ${badgeClass} text-white">${data}</span>`;
  }
  return data;
}

/**
 * Render CET disabled queues badge with color coding
 * 
 * Any disabled queue is considered critical, so only success/danger states exist.
 * 
 * COLOR CODING:
 * - 0 disabled → green (success)
 * - 1+ disabled → red (danger)
 * 
 * @param {number} data - Disabled queues count
 * @param {string} type - DataTables render type
 * @returns {string} HTML string for badge
 */
export function renderCETDisabledQueues(data, type) {
  if (type === 'display') {
    if (data === 0) return '<span class="badge bg-success">0</span>';
    return `<span class="badge bg-danger text-white">${data}</span>`;
  }
  return data;
}

/**
 * Render CET processes behind badge with color coding
 * 
 * Indicates how many processes are falling behind schedule.
 * 
 * COLOR CODING:
 * - 0 behind → green (success)
 * - 1-2 behind → blue (info)
 * - 3-5 behind → yellow (warning)
 * - 6+ behind → red (danger)
 * 
 * @param {number} data - Processes behind count
 * @param {string} type - DataTables render type
 * @returns {string} HTML string for badge
 */
export function renderCETProcessesBehind(data, type) {
  if (type === 'display') {
    if (data === 0) return '<span class="badge bg-success">0</span>';
    const badgeClass = data > 5 ? 'bg-danger' : data > 2 ? 'bg-warning' : 'bg-info';
    return `<span class="badge ${badgeClass}">${data}</span>`;
  }
  return data;
}

/**
 * Render CET slow processes badge with color coding
 * 
 * Indicates processes running slower than expected thresholds.
 * 
 * COLOR CODING:
 * - 0 slow → green (success)
 * - 1 slow → blue (info)
 * - 2-3 slow → yellow (warning)
 * - 4+ slow → red (danger)
 * 
 * @param {number} data - Slow processes count
 * @param {string} type - DataTables render type
 * @returns {string} HTML string for badge
 */
export function renderCETSlow(data, type) {
  if (type === 'display') {
    if (data === 0) return '<span class="badge bg-success">0</span>';
    const badgeClass = data > 3 ? 'bg-danger' : data > 1 ? 'bg-warning' : 'bg-info';
    return `<span class="badge ${badgeClass}">${data}</span>`;
  }
  return data;
}

/**
 * Render CET issue count with color coding
 * 
 * General issue counter with standard severity thresholds.
 * 
 * COLOR CODING:
 * - 0 issues → green (success)
 * - 1-2 issues → blue (info)
 * - 3-4 issues → yellow (warning)
 * - 5+ issues → red (danger)
 * 
 * @param {number} data - Issue count
 * @param {string} type - DataTables render type
 * @returns {string} HTML string for badge
 */
export function renderCETIssueCount(data, type) {
  if (type === 'display') {
    if (data === 0) return '<span class="badge bg-success">0</span>';
    const badgeClass = data >= 5 ? 'bg-danger' : data >= 3 ? 'bg-warning' : 'bg-info';
    return `<span class="badge ${badgeClass}">${data}</span>`;
  }
  return data;
}

/**
 * Render queue status badge
 * 
 * Displays whether a CET queue is enabled or disabled.
 * 
 * STATUS INDICATORS:
 * - Enabled → green badge with check icon
 * - Disabled → red badge with X icon
 * 
 * @param {string} data - Status ('Enabled', 'Disabled')
 * @param {string} type - DataTables render type
 * @returns {string} HTML string for badge
 */
export function renderQueueStatus(data, type) {
  if (type === 'display') {
    const statusMap = {
      'Enabled': '<span class="badge bg-success"><i class="bi bi-check-circle-fill"></i> Enabled</span>',
      'Disabled': '<span class="badge bg-danger"><i class="bi bi-x-circle-fill"></i> Disabled</span>'
    };
    return statusMap[data] || `<span class="badge bg-secondary">${data}</span>`;
  }
  return data;
}

/**
 * Render message count with color coding
 * 
 * Displays the count of messages in a queue with color-coded severity.
 * 
 * COLOR CODING:
 * - 0 messages → green (success)
 * - 1-9 messages → blue (info)
 * - 10-29 messages → yellow (warning)
 * - 30+ messages → red (danger)
 * 
 * @param {number} data - Message count
 * @param {string} type - DataTables render type
 * @returns {string} HTML string for badge
 */
export function renderMessageCount(data, type) {
  if (type === 'display') {
    if (data === 0) return '<span class="badge bg-success">0</span>';
    if (data >= 30) return `<span class="badge bg-danger">${data}</span>`;
    if (data >= 10) return `<span class="badge bg-warning">${data}</span>`;
    return `<span class="badge bg-info">${data}</span>`;
  }
  return data;
}

/**
 * Render support link as clickable button
 * 
 * Creates a button that links to CET documentation or wiki pages.
 * Currently uses placeholder link - update linkUrl in production.
 * 
 * @param {string} data - Link text
 * @param {string} type - DataTables render type
 * @param {object} row - Full row data
 * @returns {string} HTML string for link button
 */
export function renderSupportLink(data, type, row) {
  if (type === 'display') {
    // For demo purposes, using a placeholder link
    // In production, this would be the actual Wiki URL
    const linkUrl = '#';
    return `<a href="${linkUrl}" class="btn btn-sm btn-outline-primary" target="_blank" title="${data}">
      <i class="bi bi-box-arrow-up-right"></i> Wiki
    </a>`;
  }
  return data;
}

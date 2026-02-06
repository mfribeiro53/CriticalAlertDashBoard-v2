/**
 * File: table-helpers.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-24 12:30:00
 * 
 * DataTable Render Helper Functions
 * 
 * This module provides reusable render functions for DataTables columns.
 * These functions transform raw data into formatted, styled HTML for display.
 * 
 * KEY CONCEPTS:
 * - Render functions are called by DataTables for each cell during table rendering
 * - The 'type' parameter determines the context: 'display', 'filter', 'sort', or 'type'
 * - Always check type === 'display' before applying HTML formatting
 * - Return raw data for non-display types to enable proper sorting and filtering
 * 
 * FUNCTION CATEGORIES:
 * 1. Badge Renderers: Format status/severity values as Bootstrap badges
 * 2. Date/Time Renderers: Format timestamps and durations
 * 3. Numeric Renderers: Format numbers, percentages, and metrics
 * 4. Interactive Renderers: Create clickable links and action buttons
 * 5. CET-Specific Renderers: Domain-specific formatters for CET application data
 * 
 * USAGE IN COLUMN CONFIG:
 * columns: [
 *   { data: 'status', render: 'renderStatusBadge' }, // String reference (converted at runtime)
 *   { data: 'status', render: renderStatusBadge }    // Direct function reference
 * ]
 */

'use strict';

/**
 * Render severity badge with appropriate Bootstrap theme color
 * 
 * Transforms severity levels into color-coded badges with icons.
 * Used for displaying alert/issue severity in a visually intuitive way.
 * 
 * COLOR MAPPING:
 * - critical → red (danger) with octagon icon
 * - high → yellow (warning) with triangle icon
 * - medium → blue (info) with circle icon
 * 
 * @param {string} data - Severity level ('critical', 'high', 'medium')
 * @param {string} type - DataTables render type ('display', 'filter', 'sort', 'type')
 * @param {object} row - Full row data object (unused but required by DataTables)
 * @returns {string} HTML badge string for display, raw data for other types
 * 
 * @example
 * Input: 'critical'
 * Output: '<span class="badge bg-danger"><i class="bi-exclamation-octagon-fill"></i> Critical</span>'
 */
export function renderSeverityBadge(data, type, row) {
  if (type === 'display') {
    const themeMap = {
      'critical': 'danger',
      'high': 'warning',
      'medium': 'info'
    };
    const theme = themeMap[data] || 'secondary';
    const iconMap = {
      'critical': 'bi-exclamation-octagon-fill',
      'high': 'bi-exclamation-triangle-fill',
      'medium': 'bi-info-circle-fill'
    };
    const icon = iconMap[data] || 'bi-question-circle-fill';
    
    return `<span class="badge bg-${theme}"><i class="${icon}"></i> ${data.charAt(0).toUpperCase() + data.slice(1)}</span>`;
  }
  return data;
}

/**
 * Render status badge with appropriate Bootstrap theme color
 * @param {string} data - Status ('open', 'resolved')
 * @param {string} type - DataTables render type
 * @param {object} row - Full row data object
 * @returns {string} HTML string for badge
 */
export function renderStatusBadge(data, type, row) {
  if (type === 'display') {
    const theme = data === 'open' ? 'success' : 'secondary';
    const icon = data === 'open' ? 'bi-check-circle-fill' : 'bi-check-all';
    
    return `<span class="badge bg-${theme}"><i class="${icon}"></i> ${data.charAt(0).toUpperCase() + data.slice(1)}</span>`;
  }
  return data;
}

/**
 * Render timestamp in human-readable format
 * @param {string} data - ISO 8601 timestamp string
 * @param {string} type - DataTables render type
 * @param {object} row - Full row data object
 * @returns {string} Formatted timestamp
 */
export function renderTimestamp(data, type, row) {
  if (type === 'display' && data) {
    try {
      const date = new Date(data);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.warn('Invalid timestamp format:', data);
      return data;
    }
  }
  return data;
}

/**
 * Render truncated text with ellipsis
 * @param {string} data - Text to truncate
 * @param {string} type - DataTables render type
 * @param {object} row - Full row data object
 * @param {number} maxLength - Maximum character length (default: 50)
 * @returns {string} Truncated text
 */
export function renderTruncatedText(data, type, row, maxLength = 50) {
  if (type === 'display' && data && data.length > maxLength) {
    return `<span title="${data.replace(/"/g, '&quot;')}">${data.substring(0, maxLength)}...</span>`;
  }
  return data || '';
}

/**
 * Render clickable cell with URL template processing
 * 
 * Converts cell data into a clickable link by processing a URL template.
 * Supports nested property access and handles missing data gracefully.
 * 
 * URL TEMPLATE SYNTAX:
 * - Use {propertyName} for top-level row properties
 * - Use {nested.property} for nested object access (e.g., {source.service})
 * - Placeholders are replaced with actual row data values
 * - Values are automatically URL-encoded for safety
 * 
 * BEHAVIOR:
 * - If any placeholder cannot be resolved, returns plain text (no link)
 * - If template processing fails, returns plain text with console warning
 * - Only creates links for 'display' type (returns raw data for sorting/filtering)
 * 
 * @param {string} data - Cell data to display as link text
 * @param {string} type - DataTables render type
 * @param {object} row - Full row data object for placeholder substitution
 * @param {string} urlTemplate - URL template with {placeholder} syntax
 * @returns {string} HTML anchor tag for display, raw data otherwise
 * 
 * @example
 * Template: '/service/{source.service}/details'
 * Row: { source: { service: 'auth-api' } }
 * Output: '<a href="/service/auth-api/details" class="dt-clickable">View</a>'
 */
export function renderClickableCell(data, type, row, urlTemplate) {
  if (type === 'display' && urlTemplate && data) {
    try {
      // Process URL template with nested property support
      let url = urlTemplate;
      const placeholderRegex = /\{([^}]+)\}/g;
      let match;
      
      while ((match = placeholderRegex.exec(urlTemplate)) !== null) {
        const placeholder = match[1];
        const keys = placeholder.split('.');
        let value = row;
        
        // Navigate nested properties safely
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
          // Skip link creation if placeholder cannot be resolved
          return data;
        }
      }
      
      return `<a href="${url}" class="dt-clickable">${data}</a>`;
    } catch (e) {
      console.warn('Error processing URL template:', e);
      return data;
    }
  }
  return data || '';
}

/**
 * Format child row content for stack trace display
 * @param {object} row - Full row data object
 * @param {string} childRowField - Dot-notation path to child row data (e.g., 'error.stack')
 * @returns {string} HTML string for child row content
 */
export function formatStackTraceRow(row, childRowField) {
  try {
    // Navigate to nested field
    const keys = childRowField.split('.');
    let value = row;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return '<div class="p-3 text-muted">No details available</div>';
      }
    }
    
    if (!value) {
      return '<div class="p-3 text-muted">No details available</div>';
    }
    
    return `
      <div class="child-row-content">
        <strong>Stack Trace:</strong>
        <div class="stack-trace">${value}</div>
      </div>
    `;
  } catch (e) {
    console.warn('Error formatting child row:', e);
    return '<div class="p-3 text-muted">Error loading details</div>';
  }
}

/**
 * Get nested property value from object using dot notation
 * 
 * Safely traverses nested object properties without throwing errors
 * if intermediate properties don't exist. This is essential for working
 * with API data that may have optional or missing fields.
 * 
 * SAFE NAVIGATION:
 * - Checks each property exists before accessing
 * - Returns null if any property in the chain is missing
 * - Handles undefined, null, and non-object values gracefully
 * - Logs warnings for debugging when paths can't be resolved
 * 
 * @param {object} obj - Object to extract value from
 * @param {string} path - Dot-notation path (e.g., 'source.service', 'user.address.city')
 * @returns {*} Value at path, or null if path doesn't exist
 * 
 * @example
 * obj = { user: { profile: { name: 'John' } } }
 * getNestedValue(obj, 'user.profile.name') → 'John'
 * getNestedValue(obj, 'user.settings.theme') → null (path doesn't exist)
 */
export function getNestedValue(obj, path) {
  try {
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return null;
      }
    }
    
    return value;
  } catch (e) {
    console.warn('Error getting nested value:', e);
    return null;
  }
}

/**
 * Render role badge with appropriate Bootstrap theme color
 * @param {string} data - Role ('admin', 'developer', 'manager', 'viewer')
 * @param {string} type - DataTables render type
 * @param {object} row - Full row data object
 * @returns {string} HTML string for badge
 */
export function renderRoleBadge(data, type, row) {
  if (type === 'display') {
    const themeMap = {
      'admin': 'danger',
      'manager': 'warning',
      'developer': 'primary',
      'viewer': 'secondary'
    };
    const theme = themeMap[data] || 'secondary';
    
    return `<span class="badge bg-${theme}">${data ? data.charAt(0).toUpperCase() + data.slice(1) : 'Unknown'}</span>`;
  }
  return data;
}

/**
 * Render user status badge with appropriate Bootstrap theme color
 * @param {string} data - Status ('active', 'inactive', 'suspended')
 * @param {string} type - DataTables render type
 * @param {object} row - Full row data object
 * @returns {string} HTML string for badge
 */
export function renderUserStatusBadge(data, type, row) {
  if (type === 'display') {
    const themeMap = {
      'active': 'success',
      'inactive': 'secondary',
      'suspended': 'danger'
    };
    const iconMap = {
      'active': 'bi-check-circle-fill',
      'inactive': 'bi-dash-circle',
      'suspended': 'bi-x-circle-fill'
    };
    const theme = themeMap[data] || 'secondary';
    const icon = iconMap[data] || 'bi-question-circle';
    
    return `<span class="badge bg-${theme}"><i class="${icon}"></i> ${data ? data.charAt(0).toUpperCase() + data.slice(1) : 'Unknown'}</span>`;
  }
  return data;
}

/**
 * Render service status badge with appropriate Bootstrap theme color
 * @param {string} data - Status ('healthy', 'degraded', 'down', 'maintenance')
 * @param {string} type - DataTables render type
 * @param {object} row - Full row data object
 * @returns {string} HTML string for badge
 */
export function renderServiceStatusBadge(data, type, row) {
  if (type === 'display') {
    const themeMap = {
      'healthy': 'success',
      'degraded': 'warning',
      'down': 'danger',
      'maintenance': 'info'
    };
    const iconMap = {
      'healthy': 'bi-check-circle-fill',
      'degraded': 'bi-exclamation-triangle-fill',
      'down': 'bi-x-circle-fill',
      'maintenance': 'bi-tools'
    };
    const theme = themeMap[data] || 'secondary';
    const icon = iconMap[data] || 'bi-question-circle';
    
    return `<span class="badge bg-${theme}"><i class="${icon}"></i> ${data ? data.charAt(0).toUpperCase() + data.slice(1) : 'Unknown'}</span>`;
  }
  return data;
}

/**
 * Render uptime percentage with color coding
 * @param {number} data - Uptime percentage (0-100)
 * @param {string} type - DataTables render type
 * @param {object} row - Full row data object
 * @returns {string} Formatted uptime
 */
export function renderUptime(data, type, row) {
  if (type === 'display' && data !== null && data !== undefined) {
    let colorClass = 'text-success';
    if (data < 95) colorClass = 'text-danger';
    else if (data < 99) colorClass = 'text-warning';
    
    return `<span class="${colorClass} fw-bold">${data.toFixed(2)}%</span>`;
  }
  return data;
}

/**
 * Render action buttons for row operations (Bootstrap-first approach)
 * @param {any} data - Cell data (typically null for action column)
 * @param {string} type - DataTables render type
 * @param {object} row - Full row data object
 * @returns {string} HTML string for action buttons
 */
export function renderActionButtons(data, type, row) {
  if (type === 'display') {
    // Get the row ID (supports different ID field names)
    const rowId = row.id || row._id || row.alertId || row.userId || row.serviceId;
    
    // Using Bootstrap classes: btn-group, btn-group-sm, btn, btn-outline-*
    return `
      <div class="btn-group btn-group-sm action-buttons" role="group" aria-label="Row actions">
        <button type="button" 
                class="btn btn-outline-primary btn-action-view" 
                data-id="${rowId}" 
                data-bs-toggle="tooltip" 
                data-bs-placement="top"
                title="View Details"
                aria-label="View details">
          <i class="bi bi-eye"></i>
        </button>
        <button type="button" 
                class="btn btn-outline-secondary btn-action-edit" 
                data-id="${rowId}" 
                data-bs-toggle="tooltip" 
                data-bs-placement="top"
                title="Edit"
                aria-label="Edit record">
          <i class="bi bi-pencil"></i>
        </button>
        <button type="button" 
                class="btn btn-outline-danger btn-action-delete" 
                data-id="${rowId}" 
                data-bs-toggle="tooltip" 
                data-bs-placement="top"
                title="Delete"
                aria-label="Delete record">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
  }
  return '';
}

/**
 * Render population with comma formatting
 * @param {number} data - Population number
 * @param {string} type - DataTables render type
 * @returns {string} Formatted population number
 */
export function renderPopulation(data, type) {
  if (type === 'display' && data) {
    return data.toLocaleString('en-US');
  }
  return data;
}

/**
 * Render percentage with decimal places
 * @param {number} data - Percentage value
 * @param {string} type - DataTables render type
 * @returns {string} Formatted percentage
 */
export function renderPercentage(data, type) {
  if (type === 'display' && data !== null && data !== undefined) {
    return data.toFixed(1) + '%';
  }
  return data;
}

/**
 * Render growth rate with color coding
 * @param {number} data - Growth rate percentage
 * @param {string} type - DataTables render type
 * @returns {string} HTML with color-coded growth rate
 */
export function renderGrowthRate(data, type) {
  if (type === 'display' && data !== null && data !== undefined) {
    const color = data > 0 ? 'text-success' : data < 0 ? 'text-danger' : 'text-secondary';
    const icon = data > 0 ? 'bi-arrow-up' : data < 0 ? 'bi-arrow-down' : 'bi-dash';
    const sign = data > 0 ? '+' : '';
    return `<span class="${color}"><i class="bi ${icon}"></i> ${sign}${data.toFixed(1)}%</span>`;
  }
  return data;
}

/**
 * Render trend badge
 * @param {string} data - Trend value ('growing', 'stable', 'declining')
 * @param {string} type - DataTables render type
 * @returns {string} HTML badge for trend
 */
export function renderTrendBadge(data, type) {
  if (type === 'display') {
    const themeMap = {
      'growing': 'success',
      'stable': 'info',
      'declining': 'warning'
    };
    const iconMap = {
      'growing': 'bi-graph-up-arrow',
      'stable': 'bi-graph-up',
      'declining': 'bi-graph-down-arrow'
    };
    const theme = themeMap[data] || 'secondary';
    const icon = iconMap[data] || 'bi-question-circle';
    return `<span class="badge bg-${theme}"><i class="${icon}"></i> ${data.charAt(0).toUpperCase() + data.slice(1)}</span>`;
  }
  return data;
}

/**
 * INLINE EDITING HELPER FUNCTIONS
 * These functions wrap cell content for inline editing support
 */

/**
 * Wrap cell content with editable structure
 * Used with inline editing feature (MP5)
 * @param {function} renderFn - Original render function
 * @param {object} columnConfig - Column configuration with editable flag
 * @returns {function} Wrapped render function
 */
export function makeEditable(renderFn, columnConfig) {
  return function(data, type, row, meta) {
    if (type === 'display' && columnConfig.editable === true) {
      // Get rendered display content
      const displayContent = renderFn ? renderFn(data, type, row, meta) : (data || '');
      
      // Wrap with editable structure
      return `
        <div class="cell-display">${displayContent}</div>
        <div class="cell-edit"></div>
      `;
    }
    
    // For non-display types or non-editable columns, use original render
    return renderFn ? renderFn(data, type, row, meta) : data;
  };
}

/**
 * Create render function with editable support
 * Convenience function that combines render and editable wrapping
 * @param {function} renderFn - Display render function
 * @param {object} columnConfig - Column configuration
 * @returns {function} Render function with editable support if enabled
 */
export function createRenderFunction(renderFn, columnConfig) {
  if (columnConfig.editable === true) {
    return makeEditable(renderFn, columnConfig);
  }
  return renderFn;
}

/**
 * FOOTER AGGREGATION HELPER FUNCTIONS
 * These are custom aggregation functions for use with the footer system
 */

/**
 * Calculate weighted average for uptime percentages
 * Used in services table footer
 * @param {array} data - Array of uptime values
 * @returns {number} Weighted average
 */
export function footerWeightedAverage(data) {
  const validData = data.filter(val => !isNaN(parseFloat(val)));
  if (validData.length === 0) return 0;
  const sum = validData.reduce((sum, val) => sum + parseFloat(val), 0);
  return sum / validData.length;
}

/**
 * Format currency values for footer
 * @param {number} value - Numeric value
 * @returns {string} Formatted currency string
 */
export function footerFormatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return '$0.00';
  return '$' + value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Format large numbers with abbreviations (K, M, B)
 * @param {number} value - Numeric value
 * @returns {string} Abbreviated number string
 */
export function footerFormatLargeNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  
  const absValue = Math.abs(value);
  if (absValue >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B';
  } else if (absValue >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (absValue >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toFixed(0);
}

/**
 * Format percentage for footer
 * @param {number} value - Percentage value (0-100)
 * @returns {string} Formatted percentage
 */
export function footerFormatPercentage(value) {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return value.toFixed(1) + '%';
}

/**
 * Format duration in milliseconds to human-readable format
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted duration
 */
export function footerFormatDuration(ms) {
  if (ms === null || ms === undefined || isNaN(ms)) return '0ms';
  
  if (ms < 1000) {
    return ms.toFixed(0) + 'ms';
  } else if (ms < 60000) {
    return (ms / 1000).toFixed(1) + 's';
  } else if (ms < 3600000) {
    return (ms / 60000).toFixed(1) + 'm';
  }
  return (ms / 3600000).toFixed(1) + 'h';
}

/**
 * Custom aggregation: Calculate percentage of total
 * @param {array} data - Column data
 * @param {object} config - Footer configuration
 * @param {object} table - DataTable instance
 * @param {number} columnIndex - Column index
 * @returns {number} Percentage value
 */
export function footerPercentageOfTotal(data, config, table, columnIndex) {
  // Get value from current column
  const currentValue = data.reduce((sum, val) => {
    const num = parseFloat(val);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  
  // Get total from specified reference column
  const refColumnIndex = config.referenceColumn || 0;
  const refData = table.column(refColumnIndex, { search: 'applied' }).data().toArray();
  const totalValue = refData.reduce((sum, val) => {
    const num = parseFloat(val);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  
  return totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
}

/**
 * ========================================
 * COLUMN REORDERING HELPER FUNCTIONS
 * ========================================
 */

/**
 * Enable column reordering for a DataTable
 * @param {string} tableId - Table element ID
 * @param {object} options - Reordering configuration
 * @returns {boolean} Success status
 */
export function enableColumnReordering(tableId, options = {}) {
  const defaults = {
    enabled: true,
    persistOrder: true,
    showResetButton: true,
    excludeColumns: []
  };
  
  const config = { ...defaults, ...options };
  
  if (typeof window.initColumnReordering === 'function') {
    const tableElement = document.getElementById(tableId);
    if (tableElement) {
      const table = $(tableElement).DataTable();
      window.initColumnReordering(tableId, config, table);
      return true;
    }
  }
  
  console.error('Column reordering not available or table not found:', tableId);
  return false;
}

/**
 * Get the current column order for a table
 * @param {string} tableId - Table element ID
 * @returns {array|null} Array of column indices in current order
 */
export function getTableColumnOrder(tableId) {
  if (typeof window.getColumnOrder === 'function') {
    return window.getColumnOrder(tableId);
  }
  return null;
}

/**
 * Set the column order for a table programmatically
 * @param {string} tableId - Table element ID
 * @param {array} order - Array of column indices defining the new order
 * @returns {boolean} Success status
 */
export function setTableColumnOrder(tableId, order) {
  if (typeof window.setColumnOrder === 'function') {
    return window.setColumnOrder(tableId, order);
  }
  return false;
}

/**
 * Reset table columns to default order
 * @param {string} tableId - Table element ID
 * @returns {boolean} Success status
 */
export function resetTableColumnOrder(tableId) {
  const tableElement = document.getElementById(tableId);
  if (!tableElement) {
    console.error('Table not found:', tableId);
    return false;
  }
  
  const table = $(tableElement).DataTable();
  const columnCount = table.columns().count();
  const defaultOrder = Array.from({length: columnCount}, (_, i) => i);
  
  return setTableColumnOrder(tableId, defaultOrder);
}

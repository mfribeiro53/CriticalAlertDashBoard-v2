/**
 * File: table-feature-footer.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-24 13:05:00
 * 
 * Table Footer Aggregation System
 * 
 * Provides dynamic summary statistics in table footers that update automatically
 * when the table data changes (through filters, search, or sorting).
 * 
 * SUPPORTED AGGREGATIONS:
 * - sum: Add all numeric values
 * - average: Mean of numeric values
 * - min/max: Minimum/maximum values
 * - count: Count non-empty values
 * - countUnique: Count distinct values
 * - static: Display fixed text (e.g., "Total:")
 * - custom: Call user-defined function from customHandlers.footer.*
 * 
 * DYNAMIC UPDATES:
 * Footer values automatically recalculate when:
 * - User applies column filters
 * - User searches the table
 * - User changes page length
 * - Server returns new data (in server-side mode)
 * 
 * CONFIGURATION:
 * Configured via footerConfig parameter in datatable.ejs:
 * footerConfig: {
 *   enabled: true,
 *   columns: [
 *     { columnIndex: 0, content: 'Total:', className: 'fw-bold' },
 *     { columnIndex: 2, aggregation: 'sum', format: 'number' }
 *   ]
 * }
 * 
 * FORMATTING:
 * Results can be formatted using:
 * - format: 'number' (1,234.56)
 * - format: 'currency' ($1,234.56)
 * - format: 'percent' (12.34%)
 * - format: 'decimal2' (12.34)
 * 
 * NAMESPACE:
 * Custom footer handlers registered via customHandlers.footer.*
 */

'use strict';

import { customHandlers } from '../core/table-custom-handlers.js';

// Store footer configurations per table
const footerConfigs = {};
  
  // Built-in aggregation functions
  const aggregationFunctions = {
    /**
     * Sum all numeric values in column
     * Non-numeric values are treated as 0
     * @param {Array} data - Array of cell values from visible rows
     * @returns {number} Sum of all numeric values
     */
    sum: function(data) {
      return data.reduce((sum, val) => {
        const num = parseFloat(val);
        return sum + (isNaN(num) ? 0 : num);
      }, 0);
    },

    /**
     * Calculate average of numeric values
     */
    average: function(data) {
      const validData = data.filter(val => !isNaN(parseFloat(val)));
      if (validData.length === 0) return 0;
      
      const sum = validData.reduce((sum, val) => sum + parseFloat(val), 0);
      return sum / validData.length;
    },

    /**
     * Find minimum numeric value
     */
    min: function(data) {
      const validData = data.filter(val => !isNaN(parseFloat(val)))
        .map(val => parseFloat(val));
      return validData.length > 0 ? Math.min(...validData) : 0;
    },

    /**
     * Find maximum numeric value
     */
    max: function(data) {
      const validData = data.filter(val => !isNaN(parseFloat(val)))
        .map(val => parseFloat(val));
      return validData.length > 0 ? Math.max(...validData) : 0;
    },

    /**
     * Count non-empty values
     */
    count: function(data) {
      return data.filter(val => val !== null && val !== undefined && val !== '').length;
    },

    /**
     * Count unique values
     */
    countUnique: function(data) {
      const unique = new Set(data.filter(val => val !== null && val !== undefined && val !== ''));
      return unique.size;
    },

    /**
     * Static text (no calculation)
     */
    static: function(data, config) {
      return config.staticText || '';
    },

    /**
     * Custom function - calls user-defined handler
     */
    custom: function(data, config, table, columnIndex) {
      if (config.customFunction && 
          customHandlers.footer[config.customFunction]) {
        return customHandlers.footer[config.customFunction](data, config, table, columnIndex);
      }
      return '';
    }
  };

  /**
   * Initialize footer aggregations for a table
   */
  function initializeFooter(tableId, table, config) {
    if (!config || !config.enabled) return;
    
    footerConfigs[tableId] = config;
    
    // Update footer on initial load and after every draw
    updateFooter(tableId, table);
    
    table.on('draw', function() {
      updateFooter(tableId, table);
    });
  }

  /**
   * Update footer values based on current table state (filtered/searched data)
   */
  function updateFooter(tableId, table) {
    const config = footerConfigs[tableId];
    if (!config || !config.columns) return;

    const $footer = $('#' + tableId + ' tfoot tr');
    if ($footer.length === 0) return;

    config.columns.forEach(columnConfig => {
      const columnIndex = columnConfig.columnIndex;
      const aggregationType = columnConfig.aggregation;
      
      // Validate column index exists in the table
      try {
        // Check if column exists by getting column settings
        const columnSettings = table.settings()[0].aoColumns[columnIndex];
        if (!columnSettings) {
          console.warn(`[Footer] Column index ${columnIndex} does not exist in table ${tableId}. Skipping footer update for this column.`);
          return;
        }
      } catch (error) {
        console.warn(`[Footer] Error validating column ${columnIndex} in table ${tableId}:`, error.message);
        return;
      }
      
      // Get filtered data for this column
      const columnData = table
        .column(columnIndex, { search: 'applied' })
        .data()
        .toArray();

      // Calculate aggregation
      let value = '';
      if (aggregationFunctions[aggregationType]) {
        value = aggregationFunctions[aggregationType](columnData, columnConfig, table, columnIndex);
      }

      // Format the value
      const formattedValue = formatFooterValue(value, columnConfig);

      // Update the footer cell
      const $cell = $footer.find('td, th').eq(columnIndex);
      $cell.html(formattedValue);
      
      // Add CSS classes if specified
      if (columnConfig.className) {
        $cell.addClass(columnConfig.className);
      }
    });
  }

  /**
   * Format footer value based on configuration
   */
  function formatFooterValue(value, config) {
    if (value === null || value === undefined || value === '') {
      return config.emptyText || '-';
    }

    // Apply prefix/suffix
    let formatted = value;
    
    // Format numbers
    if (typeof value === 'number') {
      // Apply decimal places
      if (config.decimals !== undefined) {
        formatted = value.toFixed(config.decimals);
      }
      
      // Format with thousands separator
      if (config.thousandsSeparator !== false) {
        formatted = parseFloat(formatted).toLocaleString('en-US', {
          minimumFractionDigits: config.decimals || 0,
          maximumFractionDigits: config.decimals || 2
        });
      }
    }

    // Apply prefix and suffix
    if (config.prefix) {
      formatted = config.prefix + formatted;
    }
    if (config.suffix) {
      formatted = formatted + config.suffix;
    }

    // Apply label
    if (config.label) {
      formatted = '<span class="footer-label">' + config.label + ':</span> ' + 
                  '<span class="footer-value">' + formatted + '</span>';
    }

    return formatted;
  }

  /**
   * Get footer configuration for a table
   */
  function getFooterConfig(tableId) {
    return footerConfigs[tableId];
  }

  /**
   * Manually update footer for a specific table
   */
  function refreshFooter(tableId) {
    const table = $('#' + tableId).DataTable();
    if (table) {
      updateFooter(tableId, table);
    }
  }

  /**
   * Register a custom aggregation function
   */
  function registerAggregation(name, func) {
    aggregationFunctions[name] = func;
  }

// Export public API
export {
  initializeFooter,
  updateFooter,
  refreshFooter,
  getFooterConfig,
  registerAggregation,
  formatFooterValue
};

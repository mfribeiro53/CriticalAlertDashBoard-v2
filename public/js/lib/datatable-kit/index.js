/**
 * DataTable Kit - Main Entry Point
 * 
 * A configuration-driven DataTables enhancement library providing:
 * - Advanced filtering (text, select, multi-select, date range)
 * - Inline cell editing
 * - Row selection with checkboxes
 * - Footer aggregations (sum, avg, count)
 * - ARIA accessibility enhancements
 * - Keyboard navigation
 * - Custom render function registry
 * 
 * @module datatable-kit
 */

'use strict';

// ============================================================================
// CORE EXPORTS
// ============================================================================

// Main initialization - re-export everything from table-init
export { 
    initDataTable,
    registerRenderFunction,
    initAllDataTables 
} from './core/table-init.js';

// Custom handlers registry
export { customHandlers } from './core/table-custom-handlers.js';

// ============================================================================
// FEATURE EXPORTS
// ============================================================================

export { DataTableFilters } from './features/table-feature-filters.js';
export { DataTableAria } from './features/table-feature-aria.js';
export { DataTableKeyboard } from './features/table-feature-keyboard.js';
export { DataTableSelection } from './features/table-feature-selection.js';
export { initializeFooter } from './features/table-feature-footer.js';
export { initializeEditing } from './features/table-feature-editing.js';
export { initializeSearch } from './features/table-feature-search.js';

// ============================================================================
// HELPER EXPORTS
// ============================================================================

// Export all render helpers as a namespace for easy access
export * as renderHelpers from './helpers/table-helpers.js';

// Also export individual helpers for tree-shaking
export {
    renderSeverityBadge,
    renderStatusBadge,
    renderTimestamp,
    renderTruncatedText,
    renderClickableCell,
    renderNumericCell,
    renderPercentage,
    renderBoolean,
    renderList,
    renderLink
} from './helpers/table-helpers.js';

// ============================================================================
// VERSION INFO
// ============================================================================

export const VERSION = '1.0.0';

// ============================================================================
// CONVENIENCE INITIALIZATION
// ============================================================================

/**
 * Quick setup function for simple use cases
 * 
 * @param {string} selector - CSS selector for table(s)
 * @param {Object} options - Configuration options
 * @returns {Array} Array of DataTable instances
 * 
 * @example
 * import { setup } from '@mfribeiro/datatable-kit';
 * 
 * setup('#myTable', {
 *   columns: [
 *     { data: 'name', title: 'Name' },
 *     { data: 'status', title: 'Status', render: 'renderStatusBadge' }
 *   ],
 *   data: myDataArray
 * });
 */
export function setup(selector, options = {}) {
    const tables = document.querySelectorAll(selector);
    const instances = [];
    
    tables.forEach((table, index) => {
        const config = {
            id: table.id || `dt-kit-${index}`,
            ...options
        };
        
        if (!table.id) {
            table.id = config.id;
        }
        
        // Dynamic import to avoid issues if initDataTable needs async loading
        import('./core/table-init.js').then(({ initDataTable }) => {
            const instance = initDataTable(config);
            instances.push(instance);
        });
    });
    
    return instances;
}

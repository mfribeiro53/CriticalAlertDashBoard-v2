/**
 * Table Init Bridge
 * 
 * This file bridges the datatable-kit library with CET-specific customizations.
 * The core functionality comes from the library, while CET-specific render
 * functions are registered from the local helpers.
 * 
 * ARCHITECTURE:
 * - datatable-kit (library in /js/lib/) provides: core init, features, base helpers
 * - This project provides: CET-specific render functions, custom handlers
 */

'use strict';

// Import everything from the library
import { 
    initDataTable,
    initAllDataTables,
    registerRenderFunction,
    customHandlers,
    DataTableFilters,
    DataTableAria,
    DataTableKeyboard,
    DataTableSelection,
    initializeFooter,
    initializeEditing,
    initializeSearch
} from './lib/index.js';

import * as renderHelpers from './lib/helpers/table-helpers.js';

// Import CET-specific render helpers (project-specific customizations)
import * as cetRenderHelpers from './helpers/cet-render-helpers.js';

// Register all CET-specific render functions with the library
Object.entries(cetRenderHelpers).forEach(([name, func]) => {
    if (typeof func === 'function') {
        registerRenderFunction(name, func);
        console.log(`Registered CET render function: ${name}`);
    }
});

// Re-export everything for use by other modules in this app
export {
    initDataTable,
    initAllDataTables,
    registerRenderFunction,
    customHandlers,
    DataTableFilters,
    DataTableAria,
    DataTableKeyboard,
    DataTableSelection,
    initializeFooter,
    initializeEditing,
    initializeSearch,
    renderHelpers
};

// Auto-initialize tables on DOM ready (same behavior as original)
document.addEventListener('DOMContentLoaded', () => {
    console.log('Table Init Bridge: Auto-initializing DataTables...');
    initAllDataTables();
});

console.log('✅ Table Init Bridge loaded - using datatable-kit library');

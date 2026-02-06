/**
 * File: table-init.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-24 12:45:00
 * 
 * DataTable Initialization Handler
 * 
 * OVERVIEW:
 * This module provides the core initialization logic for all DataTables in the application.
 * It reads configuration from data attributes on table elements and dynamically builds
 * DataTables with all necessary features including filtering, sorting, editing, ARIA
 * support, keyboard navigation, and custom rendering.
 * 
 * KEY FEATURES:
 * - Automatic initialization from data attributes
 * - ES6 module-based architecture (no global namespace pollution)
 * - Dynamic render function registry
 * - Support for inline editing, custom filters, and aggregations
 * - Accessibility enhancements (ARIA, keyboard navigation)
 * - Responsive design with mobile-friendly layouts
 * 
 * ARCHITECTURE:
 * The module uses a registry pattern for render functions rather than polluting the
 * global window object. This provides better encapsulation, prevents naming conflicts,
 * and follows modern JavaScript best practices.
 */

'use strict';

// ============================================================================
// MODULE IMPORTS
// ============================================================================

/**
 * Import all helper functions as a namespace
 * 
 * WHY USE NAMESPACE IMPORT (* as)?
 * The table-helpers.js module exports 40+ individual render functions.
 * Using named imports would require listing all 40 functions twice:
 * 1. Once in the import statement
 * 2. Once when building the renderFunctionRegistry object
 * 
 * Example of the verbose alternative:
 * ```javascript
 * import { 
 *   renderSeverityBadge, renderStatusBadge, renderTimestamp,
 *   renderTruncatedText, renderClickableCell, formatStackTraceRow,
 *   // ... 34 more functions
 * } from '../helpers/table-helpers.js';
 * 
 * const renderFunctionRegistry = {
 *   renderSeverityBadge, renderStatusBadge, renderTimestamp,
 *   // ... repeat all 34 again
 * };
 * ```
 * 
 * BENEFITS OF NAMESPACE IMPORT:
 * ✓ Concise: 3 lines instead of 80+
 * ✓ Maintainable: Adding new functions doesn't require updating two lists
 * ✓ Automatic: New exports from table-helpers.js are automatically available
 * ✓ Clear intent: Explicitly shows we want all helper functions
 * ✓ Type-safe: The spread operator creates a shallow copy, not a reference
 * 
 * The namespace import groups all 40+ functions under one object, then we
 * use the spread operator to copy them into our renderFunctionRegistry.
 */
import * as tableHelpers from '../helpers/table-helpers.js';

// Feature module imports - these provide optional enhancements to DataTables
import { DataTableFilters } from '../features/table-feature-filters.js';
import { DataTableAria } from '../features/table-feature-aria.js';
import { DataTableKeyboard } from '../features/table-feature-keyboard.js';
import { DataTableSelection } from '../features/table-feature-selection.js';
import { initializeFooter } from '../features/table-feature-footer.js';
import { initializeEditing } from '../features/table-feature-editing.js';
import { initializeSearch } from '../features/table-feature-search.js';

// ============================================================================
// RENDER FUNCTION REGISTRY
// ============================================================================

/**
 * Local registry for render functions
 * 
 * This object maps function names (as strings) to actual function references.
 * It replaces the old approach of assigning functions to the global window object.
 * 
 * WHY A REGISTRY?
 * DataTables column configurations often specify render functions by name (string)
 * rather than by direct reference. For example, in JSON config:
 * 
 * ```json
 * {
 *   "columns": [
 *     { "data": "status", "render": "renderStatusBadge" }
 *   ]
 * }
 * ```
 * 
 * The render value "renderStatusBadge" is a string. At runtime, we need to:
 * 1. Look up the string name in a registry
 * 2. Find the corresponding function
 * 3. Assign it to the column definition
 * 
 * OLD APPROACH (PROBLEMATIC):
 * ```javascript
 * window.renderStatusBadge = renderStatusBadge;  // Pollutes global namespace
 * if (typeof window[renderFnName] === 'function') { ... }
 * ```
 * 
 * NEW APPROACH (CLEAN):
 * ```javascript
 * const renderFunctionRegistry = { renderStatusBadge };  // Module-scoped
 * if (typeof renderFunctionRegistry[renderFnName] === 'function') { ... }
 * ```
 * 
 * ADVANTAGES:
 * - No global namespace pollution
 * - Better encapsulation and testability
 * - Prevents naming conflicts with other libraries
 * - Easy to inspect available functions (Object.keys(renderFunctionRegistry))
 * - Follows ES6 module best practices
 */
const renderFunctionRegistry = {
    ...tableHelpers,
    ...cetRenderHelpers
};

/**
 * Register a custom render function dynamically
 * 
 * Allows page-specific JavaScript to add their own render functions to the registry
 * at runtime. This is useful for pages that need custom rendering logic not available
 * in the standard table-helpers.js module.
 * 
 * @param {string} name - The name to register the function under (used in column configs)
 * @param {Function} func - The render function to register
 * 
 * @example
 * // In a page-specific JS file
 * import { registerRenderFunction } from './table-init.js';
 * 
 * registerRenderFunction('customOrderStatus', function(data, type, row) {
 *   if (type === 'display') {
 *     return `<span class="order-${data}">${data}</span>`;
 *   }
 *   return data;
 * });
 * 
 * // Now the column config can use it
 * { "data": "orderStatus", "render": "customOrderStatus" }
 * 
 * @returns {void}
 */
export function registerRenderFunction(name, func) {
    renderFunctionRegistry[name] = func;
}

// ============================================================================
// DATATABLE INITIALIZATION
// ============================================================================

/**
 * Initialize a single DataTable with full configuration
 * 
 * This is the core initialization function that transforms a plain HTML table
 * into a fully-featured DataTable with sorting, filtering, pagination, and
 * custom rendering capabilities.
 * 
 * PROCESS FLOW:
 * 1. Validate table element exists in DOM
 * 2. Build column definitions from config (including render functions)
 * 3. Construct DataTables options object
 * 4. Configure data source (client-side or server-side)
 * 5. Initialize DataTable with jQuery plugin
 * 6. Set up post-initialization callbacks (filters, editing, ARIA, etc.)
 * 7. Register child row handlers (for expandable details)
 * 8. Store global reference for external access
 * 
 * COLUMN CONFIGURATION:
 * Each column can specify:
 * - data: Property name in the data object
 * - title: Column header text
 * - render: Name of render function (string) or function reference
 * - editable: Whether the cell supports inline editing
 * - urlTemplate: URL pattern for clickable cells (e.g., "/details/{id}")
 * - width: Fixed column width
 * - orderable: Whether the column can be sorted
 * - searchable: Whether the column is included in search
 * - responsivePriority: Priority for responsive column hiding
 * 
 * RENDER FUNCTION RESOLUTION:
 * When a column specifies render: "renderStatusBadge", this function:
 * 1. Looks up "renderStatusBadge" in renderFunctionRegistry
 * 2. If found, wraps it to handle editable cells
 * 3. If not found, logs a warning and uses default rendering
 * 
 * EDITABLE CELLS:
 * Columns marked as editable get special treatment:
 * - Wrapped in <div class="cell-display">content</div><div class="cell-edit"></div>
 * - The cell-display shows the rendered value
 * - The cell-edit div is populated by table-feature-editing.js when clicked
 * 
 * POST-INITIALIZATION ENHANCEMENTS:
 * After DataTable is created, various feature modules are initialized:
 * - DataTableFilters: Advanced filtering UI and logic
 * - DataTableSelection: Row selection with checkboxes
 * - initializeFooter: Aggregate calculations (sum, avg, count)
 * - initializeEditing: Inline cell editing handlers
 * - initializeSearch: Enhanced search with field-specific filters
 * - DataTableAria: Accessibility enhancements (roles, labels, descriptions)
 * - DataTableKeyboard: Keyboard navigation shortcuts
 * 
 * @param {Object} config - Complete DataTable configuration object
 * @param {string} config.id - DOM ID of the table element
 * @param {Array<Object>} config.columns - Column definitions
 * @param {Array<string>} config.buttons - Export/action button names
 * @param {Array<number>} config.defaultOrder - Default sort order [[colIndex, 'asc']]
 * @param {boolean} config.serverSide - Use server-side processing
 * @param {string} config.ajaxUrl - URL for server-side data fetching
 * @param {Array<Object>} config.dataSource - Client-side data array
 * @param {boolean} config.stateSave - Remember table state in localStorage
 * @param {Object} config.filterConfig - Advanced filter configuration
 * @param {Object} config.selectionConfig - Row selection configuration
 * @param {Object} config.footerConfig - Footer aggregation configuration
 * @param {Object} config.searchConfig - Search enhancement configuration
 * @param {Object} config.ariaConfig - ARIA accessibility configuration
 * @param {Object} config.keyboardConfig - Keyboard navigation configuration
 * @param {string} config.childField - Data property for expandable child rows
 * @param {Object} config.dtOptions - Additional DataTables options to merge
 * 
 * @returns {Object|null} DataTable API instance or null if initialization fails
 * 
 * @example
 * // Typical usage via data attribute (automatic)
 * <table id="myTable" data-dt-config='{"id":"myTable","columns":[...]}'></table>
 * 
 * // Manual initialization
 * import { initDataTable } from './table-init.js';
 * const dt = initDataTable({
 *   id: 'myTable',
 *   columns: [
 *     { data: 'name', title: 'Name', orderable: true },
 *     { data: 'status', title: 'Status', render: 'renderStatusBadge' }
 *   ],
 *   dataSource: myDataArray,
 *   buttons: ['copy', 'csv', 'excel']
 * });
 */
const initDataTable = (config) => {
        try {
            const table = document.getElementById(config.id);
            if (!table) {
                console.error('DataTable element not found:', config.id);
                return null;
            }
            
            // ================================================================
            // BUILD COLUMN DEFINITIONS
            // ================================================================
            
            /**
             * Transform configuration columns into DataTables column definitions
             * 
             * For each column in the config, we create a colDef object that DataTables
             * understands. This includes:
             * - Basic properties (data, title, orderable, searchable)
             * - Styling (className, width)
             * - Responsive behavior (responsivePriority)
             * - Render functions (with registry lookup and editable wrapping)
             */
            const columns = config.columns.map((col, index) => {
                const colDef = {
                    data: col.data,
                    title: col.title || col.data,
                    orderable: typeof col.orderable !== 'undefined' ? col.orderable : true,
                    searchable: typeof col.searchable !== 'undefined' ? col.searchable : true,
                    className: col.className || ''
                };
                
                // Add editable-cell class if column is editable
                if (col.editable === true) {
                    colDef.className = (colDef.className + ' editable-cell').trim();
                }
                
                // Add width if specified
                if (col.width) {
                    colDef.width = col.width;
                }
                
                // Add responsive priority if specified
                if (col.responsivePriority) {
                    colDef.responsivePriority = col.responsivePriority;
                }
                
                // --------------------------------------------------------
                // RENDER FUNCTION ASSIGNMENT
                // --------------------------------------------------------
                
                /**
                 * Resolve and assign the render function for this column
                 * 
                 * LOOKUP PROCESS:
                 * 1. Check if col.render is specified (string or function)
                 * 2. Look up the string name in renderFunctionRegistry
                 * 3. Wrap the render function to handle editable cells
                 * 4. Pass urlTemplate if provided (for clickable links)
                 * 
                 * EDITABLE CELL WRAPPING:
                 * If the column is editable, we wrap the rendered content in:
                 * <div class="cell-display">original content</div>
                 * <div class="cell-edit"></div>
                 * 
                 * The cell-edit div is populated by table-feature-editing.js when the
                 * user clicks on the cell to edit it.
                 * 
                 * URL TEMPLATE HANDLING:
                 * Some render functions (like renderClickableCell) need a URL
                 * pattern to generate links. The urlTemplate can contain
                 * placeholders like {id} that get replaced with row data:
                 * "/issues/{id}/details" becomes "/issues/123/details"
                 */
                if (col.render) {
                    const renderFnName = col.render;
                    if (typeof renderFunctionRegistry[renderFnName] === 'function') {
                        if (col.urlTemplate) {
                            // Special handling for clickable cells with URL templates
                            colDef.render = function(data, type, row, meta) {
                                const rendered = renderFunctionRegistry[renderFnName](data, type, row, col.urlTemplate);
                                // Wrap with editable structure if column is editable
                                if (type === 'display' && col.editable === true) {
                                    return `<div class="cell-display">${rendered}</div><div class="cell-edit"></div>`;
                                }
                                return rendered;
                            };
                        } else {
                            colDef.render = function(data, type, row, meta) {
                                const rendered = renderFunctionRegistry[renderFnName](data, type, row, meta);
                                // Wrap with editable structure if column is editable
                                if (type === 'display' && col.editable === true) {
                                    return `<div class="cell-display">${rendered}</div><div class="cell-edit"></div>`;
                                }
                                return rendered;
                            };
                        }
                    } else {
                        console.warn('Render function not found:', renderFnName);
                    }
                } else if (col.editable === true) {
                    // No custom render but editable - add wrapper
                    colDef.render = function(data, type, row, meta) {
                        if (type === 'display') {
                            return `<div class="cell-display">${data || ''}</div><div class="cell-edit"></div>`;
                        }
                        return data;
                    };
                }
                
                return colDef;
            });
            
            // ================================================================
            // BUILD DATATABLES OPTIONS
            // ================================================================
            
            /**
             * Construct the complete DataTables configuration object
             * 
             * This object contains all the settings that control how DataTables
             * renders and behaves. Key sections:
             * 
             * - responsive: Automatically hide columns on small screens
             * - processing: Show loading indicator for server-side requests
             * - stateSave: Remember pagination/sorting in localStorage
             * - order: Default sort order [[columnIndex, 'asc'|'desc']]
             * - columns: Column definitions created above
             * - pageLength: Initial number of rows per page
             * - lengthMenu: Options for rows per page dropdown
             * - dom: Layout template for DataTables elements
             * - buttons: Export buttons (copy, CSV, Excel, PDF)
             * - language: Customized text for UI elements
             * 
             * DOM LAYOUT EXPLAINED:
             * The 'dom' option controls the positioning of DataTables elements:
             * 
             * <'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>
             *   ↑ Creates a row with buttons (B) on left and search (f) on right
             * 
             * <'row mt-2'<'col-sm-12'tr>>
             *   ↑ Table (t) and processing indicator (r) in full-width row
             * 
             * <'row py-2'<'col-sm-12 col-md-4'i><'col-sm-12 col-md-8'lp>>
             *   ↑ Info text (i) on left, length menu (l) and pagination (p) on right
             * 
             * This creates a responsive layout that adapts to screen size.
             */
            const dtConfig = {
                responsive: true,
                processing: config.serverSide ? true : false,
                stateSave: config.stateSave,
                order: config.defaultOrder || [[0, 'asc']],
                columns: columns,
                pageLength: 25,
                lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
                     "<'row mt-2'<'col-sm-12'tr>>" +
                     "<'row py-2'<'col-sm-12 col-md-4'i><'col-sm-12 col-md-8 d-flex justify-content-start align-items-center gap-5'lp>>",
                buttons: {
                    buttons: config.buttons,
                    dom: {
                        button: {
                            className: 'btn btn-sm btn-outline-secondary'
                        }
                    }
                },
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search ...",
                    lengthMenu: "_MENU_ records per page",
                    info: "Showing _START_ to _END_ of _TOTAL_ entries",
                    infoEmpty: "No entries available",
                    infoFiltered: "(filtered from _TOTAL_ total entries)",
                    zeroRecords: "No matching records found",
                    emptyTable: "No data available in table",
                    paginate: {
                        first: "First",
                        last: "Last",
                        next: "Next",
                        previous: "Previous"
                    }
                }
            };
            
            // ----------------------------------------------------------------
            // CONFIGURE DATA SOURCE
            // ----------------------------------------------------------------
            
            /**
             * Determine where the table data comes from
             * 
             * DataTables supports two data modes:
             * 
             * 1. SERVER-SIDE PROCESSING (config.serverSide = true):
             *    - Data is fetched from config.ajaxUrl on demand
             *    - Server handles sorting, filtering, pagination
             *    - Best for large datasets (1000+ rows)
             *    - Reduces initial page load time
             *    - Requires backend API that follows DataTables protocol
             * 
             * 2. CLIENT-SIDE PROCESSING (default):
             *    - All data is loaded at once via config.dataSource
             *    - JavaScript handles sorting, filtering, pagination
             *    - Best for smaller datasets (< 1000 rows)
             *    - Faster user interactions (no network requests)
             *    - Data can be embedded in page or fetched once
             */
            if (config.serverSide && config.ajaxUrl) {
                dtConfig.serverSide = true;
                dtConfig.ajax = config.ajaxUrl;
            } else if (config.dataSource) {
                dtConfig.data = config.dataSource;
            }
            
            // Merge any custom options provided in config
            // This allows page-specific overrides of default settings
            Object.assign(dtConfig, config.dtOptions);
            
            // ----------------------------------------------------------------
            // POST-INITIALIZATION CALLBACK
            // ----------------------------------------------------------------
            
            /**
             * Configure the initComplete callback
             * 
             * This callback runs AFTER DataTables has fully initialized the DOM
             * but BEFORE the first draw. It's the perfect time to initialize
             * enhancement modules that need to interact with the DataTable.
             * 
             * WHY NOT INITIALIZE ENHANCEMENTS IMMEDIATELY?
             * DataTables initialization is asynchronous and modifies the DOM
             * extensively. If we try to add filters, editing, or ARIA attributes
             * before DataTables finishes, we'll be working with incomplete DOM
             * or our changes will be overwritten.
             * 
             * ENHANCEMENT MODULE INITIALIZATION ORDER:
             * 1. Filters - Must be first so they can register with DataTables events
             * 2. Selection - Checkboxes need to be added before other features
             * 3. Footer - Needs access to table data for calculations
             * 4. Editing - Attaches click handlers to cells
             * 5. Search - Adds advanced search UI elements
             * 6. ARIA - Enhances accessibility after DOM is stable
             * 7. Keyboard - Adds keyboard shortcuts last
             * 
             * Each module receives:
             * - tableId: DOM ID for element selection
             * - api: DataTable API instance for data access
             * - config: Module-specific configuration object
             */
            dtConfig.initComplete = function(settings, json) {
                // Get the DataTable API instance from the settings object
                const api = new jQuery.fn.dataTable.Api(settings);
                
                // DataTables DOM is now fully ready - initialize all enhancements
                
                // Initialize advanced filters if configured
                if (config.filterConfig && DataTableFilters) {
                    DataTableFilters.init(config.id, api, config.filterConfig);
                }
                
                // Initialize row selection if configured
                if (config.selectionConfig && DataTableSelection) {
                    DataTableSelection.init(config.id, api, config.selectionConfig);
                }
                
                // Initialize footer aggregations if configured
                if (config.footerConfig) {
                    initializeFooter(config.id, api, config.footerConfig);
                }
                
                // Initialize inline editing if any columns are editable
                const hasEditableColumns = config.columns.some(col => col.editable === true);
                if (hasEditableColumns) {
                    initializeEditing(config.id, api, config.columns);
                }
                
                // Initialize advanced search if configured
                if (config.searchConfig) {
                    initializeSearch(config.id, api, config.searchConfig);
                }
                
                // Initialize ARIA enhancements if configured
                if (config.ariaConfig && DataTableAria) {
                    DataTableAria.initialize(config.id, config.ariaConfig, api);
                }
                
                // Initialize keyboard navigation if configured
                if (config.keyboardConfig && DataTableKeyboard) {
                    DataTableKeyboard.initialize(config.id, config.keyboardConfig, api);
                }
            };
            
            // ================================================================
            // INITIALIZE DATATABLE
            // ================================================================
            
            /**
             * Create the DataTable instance
             * 
             * At this point, all configuration is complete. Calling DataTable()
             * will:
             * 1. Process the table HTML structure
             * 2. Clone the header for fixed positioning
             * 3. Add sorting, filtering, pagination UI
             * 4. Initialize responsive column hiding
             * 5. Fetch data (if server-side) or load from config.dataSource
             * 6. Render all cells using the configured render functions
             * 7. Fire the initComplete callback we defined above
             * 
             * The return value is a DataTable API instance that provides methods
             * for interacting with the table programmatically.
             */
            const dataTable = jQuery('#' + config.id).DataTable(dtConfig);
            
            // ----------------------------------------------------------------
            // CHILD ROW FUNCTIONALITY
            // ----------------------------------------------------------------
            
            /**
             * Set up expandable child rows for detailed content
             * 
             * Some tables need to show additional details in an expandable row
             * beneath the main row. This is commonly used for:
             * - Stack traces (click error row to see full trace)
             * - Additional metadata (expand to see all properties)
             * - Nested tables (show related records)
             * 
             * RESPONSIVE CONTROL BUTTON:
             * DataTables adds a td.dtr-control button to responsive tables.
             * Clicking it toggles the child row visibility.
             * 
             * CHILD CONTENT RENDERING:
             * The config.childField specifies which property contains the
             * detailed content (e.g., 'stackTrace', 'metadata').
             * 
             * We use formatStackTraceRow from renderFunctionRegistry to
             * format the content into readable HTML.
             * 
             * SHOWN STATE:
             * The 'shown' class is added to the parent row when expanded,
             * allowing CSS to style the expanded state (e.g., highlight).
             */
            if (config.childField) {
                jQuery('#' + config.id + ' tbody').on('click', 'td.dtr-control', function() {
                    const tr = jQuery(this).closest('tr');
                    const row = dataTable.row(tr);
                    
                    if (row.child.isShown()) {
                        row.child.hide();
                        tr.removeClass('shown');
                    } else {
                        if (renderFunctionRegistry.formatStackTraceRow) {
                            const childContent = renderFunctionRegistry.formatStackTraceRow(row.data(), config.childField);
                            row.child(childContent).show();
                            tr.addClass('shown');
                        } else {
                            console.error('formatStackTraceRow function not found in registry');
                        }
                    }
                });
            }
            
            // ----------------------------------------------------------------
            // GLOBAL REFERENCE STORAGE
            // ----------------------------------------------------------------
            
            /**
             * Store a global reference to the DataTable instance
             * 
             * Some pages need to access the DataTable API from external scripts
             * (e.g., custom buttons, external filters, refresh functions).
             * 
             * By storing window['dt_' + config.id], we make the API accessible:
             * 
             * @example
             * // In page-specific JS
             * const myTable = window['dt_myTableId'];
             * myTable.ajax.reload();  // Refresh data
             * myTable.rows().data();  // Get all row data
             * myTable.search('keyword').draw();  // Filter table
             * 
             * Note: This is one of the few intentional uses of the global window
             * object. The DataTable itself needs to persist across modules.
             */
            window['dt_' + config.id] = dataTable;
            
            return dataTable;
            
        } catch (error) {
            console.error('Error initializing DataTable:', error);
            console.warn('Falling back to basic HTML table rendering');
            return null;
        }
    }
    
    // ============================================================================
    // AUTOMATIC INITIALIZATION
    // ============================================================================
    
    /**
     * Auto-initialize all DataTables on the page
     * 
     * This function provides automatic, declarative DataTable initialization
     * for pages that embed configuration directly in HTML data attributes.
     * 
     * PROCESS FLOW:
     * 1. Scan DOM for all <table> elements with data-dt-config attribute
     * 2. Parse the JSON configuration from the attribute
     * 3. Check if autoInit is enabled (default: true)
     * 4. Call initDataTable() with the parsed configuration
     * 5. Expose a manual init function on window for special cases
     * 
     * DECLARATIVE vs IMPERATIVE INITIALIZATION:
     * 
     * Declarative (automatic) - Most common, used by Dashboard, Issues, Reports:
     * ```html
     * <table id="issuesTable" data-dt-config='{
     *   "id": "issuesTable",
     *   "columns": [...],
     *   "autoInit": true
     * }'>
     * ```
     * 
     * Imperative (manual) - Used by Admin page with custom rendering:
     * ```html
     * <table id="adminTable" data-dt-config='{
     *   "id": "adminTable",
     *   "columns": [...],
     *   "autoInit": false
     * }'>
     * ```
     * ```javascript
     * // In page-specific JS
     * import { initDataTable } from './table-init.js';
     * const config = JSON.parse(document.getElementById('adminTable').dataset.dtConfig);
     * config.columns[0].render = myCustomFunction;
     * initDataTable(config);
     * ```
     * 
     * MANUAL INIT FUNCTION:
     * Even when autoInit is false, we expose window['init_<tableId>']() as
     * a convenience function for pages that want to initialize later without
     * re-parsing the configuration.
     * 
     * WHEN TO USE AUTOINIT: FALSE?
     * - Need to modify configuration before initialization
     * - Need to wait for other data to load first
     * - Need to add custom render functions dynamically
     * - Need to compute column definitions at runtime
     * 
     * @returns {void}
     * 
     * @example
     * // This function is called automatically on page load
     * // No need to call it manually unless you're dynamically adding tables
     */
    function autoInitDataTables() {
        // Find all tables with data-dt-config attribute
        const tables = document.querySelectorAll('table[data-dt-config]');
        
        console.log('Found', tables.length, 'DataTables to initialize');
        
        tables.forEach(table => {
            try {
                // Parse the embedded JSON configuration
                const config = JSON.parse(table.getAttribute('data-dt-config'));
                
                // Respect the autoInit flag (defaults to true if not specified)
                if (config.autoInit !== false) {
                    initDataTable(config);
                }
                
                /**
                 * Expose manual initialization function
                 * 
                 * Creates a globally accessible function: window['init_' + tableId]
                 * This allows pages to initialize tables manually even when
                 * autoInit is false, without needing to re-parse config.
                 * 
                 * @example
                 * // In page-specific JS
                 * window['init_issuesTable']();  // Initialize when ready
                 */
                // Expose manual init function
                window['init_' + config.id] = function() {
                    initDataTable(config);
                };
                
            } catch (error) {
                console.error('Error parsing DataTable config:', error);
            }
        });
    }
    
    // ============================================================================
    // DEPENDENCY LOADING & STARTUP
    // ============================================================================
    
    /**
     * Wait for required libraries to load, then initialize tables
     * 
     * DataTables is a jQuery plugin and requires jQuery to be fully loaded
     * before it can be used. This function implements a polling strategy to
     * ensure dependencies are ready before initialization.
     * 
     * WHY POLLING INSTEAD OF SCRIPT ONLOAD?
     * 
     * Modern applications load scripts in various ways:
     * - Traditional <script> tags in <head> (synchronous)
     * - <script defer> tags (load after parse, execute in order)
     * - <script async> tags (load and execute whenever ready)
     * - ES6 module imports (load order not guaranteed)
     * - Dynamic script injection (runtime loading)
     * 
     * A simple polling loop handles ALL these scenarios reliably.
     * We check every 50ms (imperceptible to users) until ready.
     * 
     * WHAT WE CHECK FOR:
     * 1. typeof jQuery !== 'undefined' - jQuery object exists
     * 2. typeof jQuery.fn.DataTable !== 'undefined' - DataTables plugin loaded
     * 
     * Note: We don't check for our ES6 modules (DataTableFilters, etc.)
     * because they're imported at the top of this file and guaranteed
     * to be available when this code runs.
     * 
     * INITIALIZATION TIMING:
     * Once dependencies are ready, we still need to wait for the DOM:
     * - If document.readyState === 'loading': Wait for DOMContentLoaded
     * - Otherwise: DOM is already ready, initialize immediately
     * 
     * This ensures tables exist in the DOM before we try to initialize them.
     * 
     * PERFORMANCE IMPACT:
     * Polling 50ms intervals has negligible performance impact:
     * - Usually resolves in 1-3 checks (50-150ms)
     * - Only runs during initial page load
     * - Stops as soon as dependencies are detected
     * 
     * @returns {void}
     * 
     * @example
     * // This function is called automatically at module load time
     * // It starts the dependency check/initialization process
     */
    function tryInit() {
        // Check if required external libraries are loaded
        const allReady = typeof jQuery !== 'undefined' && typeof jQuery.fn.DataTable !== 'undefined';
        
        if (allReady) {
            // Dependencies are ready - check DOM state
            if (document.readyState === 'loading') {
                // DOM still parsing - wait for DOMContentLoaded event
                document.addEventListener('DOMContentLoaded', autoInitDataTables);
            } else {
                // DOM already ready - initialize immediately
                autoInitDataTables();
            }
        } else {
            // Dependencies not ready yet - retry in 50ms
            setTimeout(tryInit, 50);
        }
    }
    
    // ============================================================================
    // MODULE INITIALIZATION
    // ============================================================================
    
    /**
     * Start the initialization process
     * 
     * This code runs immediately when the module is imported. It kicks off
     * the dependency checking process that will eventually initialize all
     * DataTables on the page.
     * 
     * The typeof window check ensures we're running in a browser environment
     * (not in a Node.js test environment or during server-side rendering).
     */
    if (typeof window !== 'undefined') {
        tryInit();
    }
    
    // ============================================================================
    // PUBLIC API EXPORTS
    // ============================================================================
    
    /**
     * Export public functions for use by other modules
     * 
     * - initDataTable: Core initialization function for programmatic use
     * - autoInitDataTables: Scan and initialize all tables with data-dt-config
     * - registerRenderFunction: Add custom render functions to registry
     * 
     * These exports allow page-specific JavaScript to:
     * 1. Initialize tables manually with custom configuration
     * 2. Re-initialize tables after dynamic content changes
     * 3. Add custom render functions for domain-specific formatting
     * 
     * @example
     * import { initDataTable, registerRenderFunction } from './table-init.js';
     * 
     * // Add custom render function
     * registerRenderFunction('myCustomFormat', (data, type) => {
     *   return type === 'display' ? `<strong>${data}</strong>` : data;
     * });
     * 
     * // Initialize table with custom config
     * initDataTable({
     *   id: 'myTable',
     *   columns: [{ data: 'field', render: 'myCustomFormat' }],
     *   dataSource: myData
     * });
     */
    export { initDataTable, autoInitDataTables };



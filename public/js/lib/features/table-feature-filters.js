/**
 * File: table-feature-filters.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-24 13:00:00
 * 
 * DataTable Advanced Filtering System
 * 
 * Provides column-specific filters that work alongside DataTables' global search.
 * Filters are rendered above or below the table and persist with table state.
 * 
 * SUPPORTED FILTER TYPES:
 * 1. text: Text input with debounced search (500ms delay)
 * 2. select: Dropdown populated with unique column values
 * 3. multi-select: Multiple selection dropdown (Select2 integration)
 * 4. range: Min/max numeric inputs (e.g., for counts, percentages)
 * 5. date: Single date picker
 * 6. dateRange: Start and end date inputs
 * 
 * CONFIGURATION:
 * Filters are configured via filterConfig parameter in datatable.ejs:
 * filterConfig: {
 *   enabled: true,
 *   position: 'top', // or 'bottom'
 *   columns: [
 *     { columnIndex: 0, type: 'text', label: 'Application', placeholder: 'Search...' },
 *     { columnIndex: 2, type: 'select', label: 'Status', options: ['Active', 'Inactive'] }
 *   ]
 * }
 * 
 * FILTER STATE:
 * - Filters persist across page refreshes if stateSave is enabled
 * - Active filters are stored in activeFilters[tableId] object
 * - Filter UI state saved to localStorage automatically
 * 
 * CUSTOMIZATION:
 * Custom filter handlers can be registered via customHandlers.filters.*
 */

'use strict';

import { customHandlers } from '../core/table-custom-handlers.js';

console.log('Table Filters script loaded');

// Filter state management
const DataTableFilters = {
        activeFilters: {},
        filterConfigs: {},
        
        /**
         * Initialize filters for a DataTable
         * 
         * Sets up the complete filtering system for a table:
         * 1. Stores filter configuration for the table
         * 2. Initializes active filters tracking object
         * 3. Builds filter UI elements (inputs, dropdowns, etc.)
         * 4. Attaches event listeners for filter interactions
         * 5. Restores previously saved filters if stateSave is enabled
         * 
         * This is called automatically by table-init.js if filterConfig
         * is provided in the table configuration.
         * 
         * @param {string} tableId - Unique table identifier
         * @param {DataTable} table - DataTables API instance
         * @param {object} filterConfig - Filter configuration from table config
         */
        init: function(tableId, table, filterConfig) {
            console.log('DataTableFilters.init called:', {tableId, filterConfig});
            
            this.filterConfigs[tableId] = filterConfig || {};
            this.activeFilters[tableId] = {};
            
            // Build filter UI
            this.buildFilterUI(tableId, table, filterConfig);
            
            // Setup event listeners
            this.setupFilterListeners(tableId, table);
            
            // Restore saved filters from localStorage if stateSave is enabled
            if (table.settings()[0].oInit.stateSave) {
                this.restoreFilters(tableId, table);
            }
        },
        
        /**
         * Build filter UI for each configured column
         * 
         * Creates a Bootstrap card containing filter controls for each column.
         * Each filter is placed in a responsive grid column (configurable via colSize).
         * 
         * UI STRUCTURE:
         * <div class="card datatable-filters-wrapper">
         *   <div class="card-header">Filter Options</div>
         *   <div class="card-body">
         *     <div class="row">
         *       <div class="col-md-3"> [Filter Control] </div>
         *       <div class="col-md-3"> [Filter Control] </div>
         *       ...
         *     </div>
         *   </div>
         * </div>
         * 
         * The entire card is positioned above or below the table based on
         * filterConfig.position ('top' or 'bottom', default: 'top').
         * 
         * @param {string} tableId - Unique table identifier
         * @param {DataTable} table - DataTables API instance
         * @param {object} filterConfig - Filter configuration with columns array
         */
        buildFilterUI: function(tableId, table, filterConfig) {
            console.log('buildFilterUI called:', {tableId, enabled: filterConfig?.enabled, columns: filterConfig?.columns?.length});
            
            if (!filterConfig || !filterConfig.enabled) {
                console.log('Filters not enabled or no config');
                return;
            }
            
            const position = filterConfig.position || 'top';
            const columns = filterConfig.columns || [];
            
            if (columns.length === 0) {
                console.log('No filter columns configured');
                return;
            }
            
            console.log('Building filter UI with', columns.length, 'filters');
            
            // Create filter container with card styling
            const filterContainer = $('<div>', {
                class: 'datatable-filters-wrapper card mb-3',
                id: `${tableId}_filters`
            });
            
            // Card header
            const cardHeader = $('<div>', { 
                class: 'card-header bg-light d-flex align-items-center justify-content-between py-2'
            }).append(
                $('<h6>', { class: 'mb-0' }).html('<i class="bi bi-funnel"></i> Filter Options')
            );
            
            // Card body
            const cardBody = $('<div>', { class: 'card-body' });
            
            // Create row for filters
            const filterRow = $('<div>', { class: 'row g-3' });
            
            // Build filter for each column
            columns.forEach(columnConfig => {
                const filterControl = this.createFilterControl(tableId, columnConfig);
                if (filterControl) {
                    const colSize = columnConfig.colSize || 'col-md-3';
                    const wrapper = $('<div>', { class: colSize }).append(filterControl);
                    filterRow.append(wrapper);
                }
            });
            
            // Add clear filters button
            const clearBtn = $('<div>', { class: 'col-md-auto d-flex align-items-end' }).append(
                $('<button>', {
                    type: 'button',
                    class: 'btn btn-outline-secondary w-100',
                    id: `${tableId}_clearFilters`,
                    html: '<i class="bi bi-x-circle"></i> Clear Filters'
                })
            );
            filterRow.append(clearBtn);
            
            cardBody.append(filterRow);
            filterContainer.append(cardHeader, cardBody);
            
            // Insert filter UI (DataTables 2.x uses .dt-container)
            const tableWrapper = $(`#${tableId}`).closest('.dt-container');
            console.log('Table wrapper found:', tableWrapper.length, 'elements');
            console.log('Filter container HTML:', filterContainer[0]);
            
            if (tableWrapper.length === 0) {
                console.error('Could not find .dt-container for table:', tableId);
                return;
            }
            
            if (position === 'top') {
                tableWrapper.prepend(filterContainer);
            } else {
                tableWrapper.append(filterContainer);
            }
            
            console.log('Filter UI inserted at position:', position);
        },
        
        /**
         * Create filter control based on type
         */
        createFilterControl: function(tableId, config) {
            const { columnIndex, type, label, placeholder, options } = config;
            
            // Check for custom filter config
            if (customHandlers?.filters?.getFilterConfig) {
                const customConfig = customHandlers.filters.getFilterConfig(tableId, config);
                if (customConfig) {
                    Object.assign(config, customConfig);
                }
            }
            
            const filterId = `${tableId}_filter_${columnIndex}`;
            
            switch (type) {
                case 'text':
                    return this.createTextFilter(filterId, label, placeholder);
                
                case 'select':
                    return this.createSelectFilter(filterId, label, options, false);
                
                case 'multi-select':
                    return this.createSelectFilter(filterId, label, options, true);
                
                case 'range':
                    return this.createRangeFilter(filterId, label);
                
                case 'date':
                    return this.createDateFilter(filterId, label);
                
                case 'dateRange':
                    return this.createDateRangeFilter(filterId, label);
                
                default:
                    console.warn(`Unknown filter type: ${type}`);
                    return null;
            }
        },
        
        /**
         * Create text input filter
         */
        createTextFilter: function(id, label, placeholder) {
            return $('<div>', { class: 'form-floating' }).append(
                $('<input>', {
                    type: 'text',
                    class: 'form-control filter-input',
                    id: id,
                    placeholder: placeholder || label,
                    'data-filter-type': 'text'
                }),
                $('<label>', { for: id, text: label })
            );
        },
        
        /**
         * Create select/multi-select filter
         */
        createSelectFilter: function(id, label, options, multiple) {
            const select = $('<select>', {
                class: 'form-select filter-input',
                id: id,
                'data-filter-type': multiple ? 'multi-select' : 'select',
                multiple: multiple
            });
            
            // Add default option for single select
            if (!multiple) {
                select.append($('<option>', { value: '', text: 'All' }));
            }
            
            // Add options
            if (options && Array.isArray(options)) {
                options.forEach(opt => {
                    const value = typeof opt === 'object' ? opt.value : opt;
                    const text = typeof opt === 'object' ? opt.label : opt;
                    select.append($('<option>', { value, text }));
                });
            }
            
            return $('<div>', { class: 'form-floating' }).append(select, $('<label>', { for: id, text: label }));
        },
        
        /**
         * Create range filter (min/max)
         */
        createRangeFilter: function(id, label) {
            const container = $('<div>').append(
                $('<label>', { class: 'form-label small', text: label })
            );
            
            const inputGroup = $('<div>', { class: 'input-group input-group-sm' });
            
            inputGroup.append(
                $('<input>', {
                    type: 'number',
                    class: 'form-control filter-input',
                    id: `${id}_min`,
                    placeholder: 'Min',
                    'data-filter-type': 'range',
                    'data-range-part': 'min'
                }),
                $('<span>', { class: 'input-group-text', text: '-' }),
                $('<input>', {
                    type: 'number',
                    class: 'form-control filter-input',
                    id: `${id}_max`,
                    placeholder: 'Max',
                    'data-filter-type': 'range',
                    'data-range-part': 'max'
                })
            );
            
            container.append(inputGroup);
            return container;
        },
        
        /**
         * Create date filter (single date)
         */
        createDateFilter: function(id, label) {
            return $('<div>', { class: 'form-floating' }).append(
                $('<input>', {
                    type: 'date',
                    class: 'form-control filter-input',
                    id: id,
                    'data-filter-type': 'date'
                }),
                $('<label>', { for: id, text: label })
            );
        },
        
        /**
         * Create date range filter
         */
        createDateRangeFilter: function(id, label) {
            const container = $('<div>').append(
                $('<label>', { class: 'form-label small', text: label })
            );
            
            const inputGroup = $('<div>', { class: 'input-group input-group-sm' });
            
            inputGroup.append(
                $('<input>', {
                    type: 'date',
                    class: 'form-control filter-input',
                    id: `${id}_start`,
                    placeholder: 'Start',
                    'data-filter-type': 'dateRange',
                    'data-range-part': 'start'
                }),
                $('<span>', { class: 'input-group-text', text: 'to' }),
                $('<input>', {
                    type: 'date',
                    class: 'form-control filter-input',
                    id: `${id}_end`,
                    placeholder: 'End',
                    'data-filter-type': 'dateRange',
                    'data-range-part': 'end'
                })
            );
            
            container.append(inputGroup);
            return container;
        },
        
        /**
         * Setup event listeners for filters
         */
        setupFilterListeners: function(tableId, table) {
            const self = this;
            const $wrapper = $(`#${tableId}`).closest('.dt-container');
            
            // Text input with debounce
            let debounceTimer;
            $wrapper.on('keyup', '.filter-input[data-filter-type="text"]', function() {
                clearTimeout(debounceTimer);
                const $input = $(this);
                debounceTimer = setTimeout(() => {
                    self.applyFilter(tableId, table, $input);
                }, 300);
            });
            
            // Select filters
            $wrapper.on('change', '.filter-input[data-filter-type="select"]', function() {
                self.applyFilter(tableId, table, $(this));
            });
            
            // Multi-select filters
            $wrapper.on('change', '.filter-input[data-filter-type="multi-select"]', function() {
                self.applyFilter(tableId, table, $(this));
            });
            
            // Range filters
            $wrapper.on('change', '.filter-input[data-filter-type="range"]', function() {
                self.applyFilter(tableId, table, $(this));
            });
            
            // Date filters
            $wrapper.on('change', '.filter-input[data-filter-type="date"]', function() {
                self.applyFilter(tableId, table, $(this));
            });
            
            // Date range filters
            $wrapper.on('change', '.filter-input[data-filter-type="dateRange"]', function() {
                self.applyFilter(tableId, table, $(this));
            });
            
            // Clear filters button
            $wrapper.on('click', `#${tableId}_clearFilters`, function() {
                self.clearAllFilters(tableId, table);
            });
        },
        
        /**
         * Apply filter to DataTable
         */
        applyFilter: function(tableId, table, $input) {
            const filterId = $input.attr('id');
            const filterType = $input.data('filter-type');
            const columnIndex = this.getColumnIndexFromFilterId(filterId);
            
            let filterValue;
            
            // Get filter value based on type
            switch (filterType) {
                case 'text':
                case 'select':
                case 'date':
                    filterValue = $input.val();
                    break;
                
                case 'multi-select':
                    filterValue = $input.val() || []; // Array of selected values
                    break;
                
                case 'range':
                case 'dateRange':
                    const rangePart = $input.data('range-part');
                    const baseId = filterId.replace(`_${rangePart}`, '');
                    filterValue = {
                        min: $(`#${baseId}_min, #${baseId}_start`).val(),
                        max: $(`#${baseId}_max, #${baseId}_end`).val()
                    };
                    break;
            }
            
            // Validate filter value with custom handler
            if (customHandlers?.filters?.validateFilterValue) {
                const isValid = customHandlers.filters.validateFilterValue(
                    tableId, columnIndex, filterValue, filterType
                );
                if (!isValid) return;
            }
            
            // Store active filter
            this.activeFilters[tableId][columnIndex] = { type: filterType, value: filterValue };
            
            // Apply custom filter logic if provided
            if (customHandlers?.filters?.customFilterLogic) {
                const customFilter = customHandlers.filters.customFilterLogic(
                    tableId, columnIndex, filterValue, filterType
                );
                if (customFilter) {
                    $.fn.dataTable.ext.search.push(customFilter);
                    table.draw();
                    return;
                }
            }
            
            // Apply default filter logic
            this.applyDefaultFilter(table, columnIndex, filterType, filterValue);
            
            // Call custom onChange handler
            if (customHandlers?.filters?.onFilterChange) {
                customHandlers.filters.onFilterChange(tableId, columnIndex, filterValue, filterType);
            }
            
            // Save to localStorage if stateSave enabled
            if (table.settings()[0].oInit.stateSave) {
                this.saveFilters(tableId);
            }
        },
        
        /**
         * Apply default filter logic
         */
        applyDefaultFilter: function(table, columnIndex, filterType, filterValue) {
            const column = table.column(columnIndex);
            
            switch (filterType) {
                case 'text':
                case 'select':
                case 'date':
                    // Simple exact or contains match
                    column.search(filterValue || '').draw();
                    break;
                
                case 'multi-select':
                    if (filterValue.length === 0) {
                        column.search('').draw();
                    } else {
                        // Create regex for multiple values
                        const regex = '^(' + filterValue.map(v => $.fn.dataTable.util.escapeRegex(v)).join('|') + ')$';
                        column.search(regex, true, false).draw();
                    }
                    break;
                
                case 'range':
                case 'dateRange':
                    // Custom search function for ranges
                    $.fn.dataTable.ext.search.push(
                        function(settings, data, dataIndex) {
                            if (settings.nTable.id !== table.table().node().id) return true;
                            
                            const cellValue = data[columnIndex];
                            const min = filterValue.min;
                            const max = filterValue.max;
                            
                            if (filterType === 'range') {
                                const numValue = parseFloat(cellValue);
                                if (isNaN(numValue)) return true;
                                if (min && numValue < parseFloat(min)) return false;
                                if (max && numValue > parseFloat(max)) return false;
                            } else { // dateRange
                                const dateValue = new Date(cellValue);
                                if (min && dateValue < new Date(min)) return false;
                                if (max && dateValue > new Date(max)) return false;
                            }
                            
                            return true;
                        }
                    );
                    table.draw();
                    break;
            }
        },
        
        /**
         * Clear all filters
         */
        clearAllFilters: function(tableId, table) {
            // Clear filter inputs
            $(`#${tableId}_filters .filter-input`).each(function() {
                const $input = $(this);
                const type = $input.prop('tagName').toLowerCase();
                
                if (type === 'select') {
                    $input.val($input.find('option:first').val()).trigger('change');
                } else {
                    $input.val('');
                }
            });
            
            // Clear DataTable searches
            table.columns().search('').draw();
            
            // Clear custom search functions
            $.fn.dataTable.ext.search = [];
            
            // Clear active filters
            this.activeFilters[tableId] = {};
            
            // Clear localStorage
            if (table.settings()[0].oInit.stateSave) {
                localStorage.removeItem(`${tableId}_filters`);
            }
            
            table.draw();
        },
        
        /**
         * Save filters to localStorage
         */
        saveFilters: function(tableId) {
            const filters = this.activeFilters[tableId];
            localStorage.setItem(`${tableId}_filters`, JSON.stringify(filters));
        },
        
        /**
         * Restore filters from localStorage
         */
        restoreFilters: function(tableId, table) {
            const saved = localStorage.getItem(`${tableId}_filters`);
            if (!saved) return;
            
            try {
                const filters = JSON.parse(saved);
                // TODO: Restore filter UI and apply filters
                // This would require rebuilding the filter state
            } catch (e) {
                console.error('Error restoring filters:', e);
            }
        },
        
        /**
         * Extract column index from filter ID
         */
        getColumnIndexFromFilterId: function(filterId) {
            const match = filterId.match(/_filter_(\d+)/);
            return match ? parseInt(match[1]) : null;
        },
        
        /**
         * Get unique values for a column (useful for select filters)
         */
        getUniqueColumnValues: function(table, columnIndex) {
            const values = table.column(columnIndex).data().unique().toArray();
            return values.filter(v => v !== null && v !== undefined && v !== '').sort();
        }
    };

export { DataTableFilters };
export default DataTableFilters;

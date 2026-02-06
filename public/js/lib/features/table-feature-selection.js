/**
 * File: table-feature-selection.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-15 12:45:02
 * 
 * DataTable Row Selection Handler
 * 
 * Provides row selection capabilities with checkboxes, bulk operations,
 * and keyboard shortcuts for efficient multi-row operations.
 */

'use strict';

import { customHandlers } from '../core/table-custom-handlers.js';

// Store selection state for each table
const tableSelections = {};

const DataTableSelection = {
    /**
     * Initialize row selection for a DataTable
     * @param {string} tableId - Table element ID
     * @param {Object} table - DataTable API instance
     * @param {Object} config - Selection configuration
     */
    init: function(tableId, table, config = {}) {
            // Default configuration
            const defaults = {
                enabled: true,
                selectAll: true,
                bulkActions: ['delete', 'export'],
                persistSelection: false,
                checkboxColumn: 0 // Column index for checkbox
            };
            
            const settings = Object.assign({}, defaults, config);
            
            if (!settings.enabled) return;
            
            // Initialize selection state
            tableSelections[tableId] = {
                selectedRows: new Set(),
                lastSelectedIndex: null,
                settings: settings
            };
            
            // Add checkbox column if not already present
            this.addCheckboxColumn(tableId, table, settings);
            
            // Setup event listeners
            this.setupSelectionListeners(tableId, table);
            
            // Build bulk actions toolbar
            this.buildBulkActionsToolbar(tableId, table, settings);
            
            // Restore selection if persistence enabled
            if (settings.persistSelection) {
                this.restoreSelection(tableId, table);
            }
        },
        
        /**
         * Add checkbox column to table
         */
        addCheckboxColumn: function(tableId, table, settings) {
            // Check if checkbox column already exists
            const firstColumnHeader = $(`#${tableId} thead th:first-child`);
            if (firstColumnHeader.find('.select-checkbox').length > 0) {
                return; // Already has checkbox column
            }
            
            // Add select-all checkbox to header
            const selectAllCheckbox = $('<input>', {
                type: 'checkbox',
                class: 'form-check-input select-all-checkbox',
                id: `${tableId}_selectAll`
            });
            
            const headerCheckbox = $('<div>', { class: 'form-check' }).append(selectAllCheckbox);
            
            // Insert checkbox in first column header or prepend new header
            if (settings.checkboxColumn === 0) {
                // Prepend checkbox to existing first column
                firstColumnHeader.prepend(headerCheckbox);
            }
            
            // Add checkboxes to each row
            const rows = $(`#${tableId} tbody tr`);
            rows.each(function() {
                const $row = $(this);
                const rowData = table.row($row).data();
                
                if (!rowData) return;
                
                const rowId = rowData.id || $row.index();
                const checkbox = $('<input>', {
                    type: 'checkbox',
                    class: 'form-check-input row-checkbox',
                    'data-row-id': rowId
                });
                
                const checkboxCell = $('<div>', { class: 'form-check' }).append(checkbox);
                
                // Insert in first cell
                const firstCell = $row.find('td:first-child');
                firstCell.prepend(checkboxCell);
            });
        },
        
        /**
         * Setup selection event listeners
         */
        setupSelectionListeners: function(tableId, table) {
            const self = this;
            const $table = $(`#${tableId}`);
            
            // Select all checkbox
            $table.on('change', '.select-all-checkbox', function() {
                const checked = $(this).prop('checked');
                self.toggleSelectAll(tableId, table, checked);
            });
            
            // Individual row checkboxes
            $table.on('change', '.row-checkbox', function(e) {
                const $checkbox = $(this);
                const rowId = $checkbox.data('row-id');
                const $row = $checkbox.closest('tr');
                const rowIndex = $row.index();
                
                // Handle Shift+Click for range selection
                if (e.shiftKey && tableSelections[tableId].lastSelectedIndex !== null) {
                    self.selectRange(tableId, table, tableSelections[tableId].lastSelectedIndex, rowIndex);
                } else {
                    self.toggleRowSelection(tableId, table, rowId, $checkbox.prop('checked'));
                }
                
                tableSelections[tableId].lastSelectedIndex = rowIndex;
                self.updateBulkActionsToolbar(tableId);
            });
            
            // Row click disabled to avoid conflict with DataTables responsive controls
            // Users can click the checkbox directly to select rows
        },
        
        /**
         * Toggle select all rows
         */
        toggleSelectAll: function(tableId, table, checked) {
            const $table = $(`#${tableId}`);
            const selection = tableSelections[tableId];
            
            $table.find('.row-checkbox').each(function() {
                const $checkbox = $(this);
                const rowId = $checkbox.data('row-id');
                
                $checkbox.prop('checked', checked);
                
                if (checked) {
                    selection.selectedRows.add(rowId);
                } else {
                    selection.selectedRows.delete(rowId);
                }
            });
            
            this.updateBulkActionsToolbar(tableId);
            
            if (selection.settings.persistSelection) {
                this.saveSelection(tableId);
            }
        },
        
        /**
         * Toggle individual row selection
         */
        toggleRowSelection: function(tableId, table, rowId, selected) {
            const selection = tableSelections[tableId];
            
            if (selected) {
                selection.selectedRows.add(rowId);
            } else {
                selection.selectedRows.delete(rowId);
            }
            
            // Update select-all checkbox state
            const totalRows = $(`#${tableId} .row-checkbox`).length;
            const selectedCount = selection.selectedRows.size;
            const $selectAll = $(`#${tableId}_selectAll`);
            
            if (selectedCount === 0) {
                $selectAll.prop('checked', false).prop('indeterminate', false);
            } else if (selectedCount === totalRows) {
                $selectAll.prop('checked', true).prop('indeterminate', false);
            } else {
                $selectAll.prop('checked', false).prop('indeterminate', true);
            }
            
            if (selection.settings.persistSelection) {
                this.saveSelection(tableId);
            }
        },
        
        /**
         * Select range of rows (Shift+Click)
         */
        selectRange: function(tableId, table, startIndex, endIndex) {
            const $table = $(`#${tableId}`);
            const selection = tableSelections[tableId];
            
            const minIndex = Math.min(startIndex, endIndex);
            const maxIndex = Math.max(startIndex, endIndex);
            
            $table.find('tbody tr').each(function(index) {
                if (index >= minIndex && index <= maxIndex) {
                    const $checkbox = $(this).find('.row-checkbox');
                    const rowId = $checkbox.data('row-id');
                    
                    $checkbox.prop('checked', true);
                    selection.selectedRows.add(rowId);
                }
            });
            
            this.updateBulkActionsToolbar(tableId);
            
            if (selection.settings.persistSelection) {
                this.saveSelection(tableId);
            }
        },
        
        /**
         * Build bulk actions toolbar
         */
        buildBulkActionsToolbar: function(tableId, table, settings) {
            const $container = $(`#${tableId}`).closest('.dt-container');
            
            // Create toolbar
            const $toolbar = $('<div>', {
                id: `${tableId}_bulkActions`,
                class: 'bulk-actions-toolbar alert alert-info d-none',
                role: 'alert'
            });
            
            // Selection count
            const $count = $('<span>', {
                class: 'selection-count me-3'
            }).html('<strong>0</strong> rows selected');
            
            $toolbar.append($count);
            
            // Add bulk action buttons based on config
            if (settings.bulkActions.includes('delete')) {
                const $deleteBtn = $('<button>', {
                    class: 'btn btn-sm btn-danger me-2',
                    type: 'button'
                }).html('<i class="bi bi-trash"></i> Delete Selected');
                
                $deleteBtn.on('click', () => this.bulkDelete(tableId, table));
                $toolbar.append($deleteBtn);
            }
            
            if (settings.bulkActions.includes('export')) {
                const $exportBtn = $('<button>', {
                    class: 'btn btn-sm btn-primary me-2',
                    type: 'button'
                }).html('<i class="bi bi-download"></i> Export Selected');
                
                $exportBtn.on('click', () => this.bulkExport(tableId, table));
                $toolbar.append($exportBtn);
            }
            
            if (settings.bulkActions.includes('update')) {
                const $updateBtn = $('<button>', {
                    class: 'btn btn-sm btn-secondary me-2',
                    type: 'button'
                }).html('<i class="bi bi-pencil"></i> Update Selected');
                
                $updateBtn.on('click', () => this.bulkUpdate(tableId, table));
                $toolbar.append($updateBtn);
            }
            
            // Clear selection button
            const $clearBtn = $('<button>', {
                class: 'btn btn-sm btn-outline-secondary',
                type: 'button'
            }).html('<i class="bi bi-x-circle"></i> Clear Selection');
            
            $clearBtn.on('click', () => this.clearSelection(tableId, table));
            $toolbar.append($clearBtn);
            
            // Insert toolbar above table
            $container.prepend($toolbar);
        },
        
        /**
         * Update bulk actions toolbar visibility and count
         */
        updateBulkActionsToolbar: function(tableId) {
            const selection = tableSelections[tableId];
            const $toolbar = $(`#${tableId}_bulkActions`);
            const selectedCount = selection.selectedRows.size;
            
            if (selectedCount > 0) {
                $toolbar.removeClass('d-none');
                $toolbar.find('.selection-count strong').text(selectedCount);
            } else {
                $toolbar.addClass('d-none');
            }
        },
        
        /**
         * Bulk delete operation
         */
        bulkDelete: function(tableId, table) {
            const selection = tableSelections[tableId];
            const selectedIds = Array.from(selection.selectedRows);
            
            if (selectedIds.length === 0) return;
            
            // Confirmation dialog
            if (!confirm(`Are you sure you want to delete ${selectedIds.length} row(s)?`)) {
                return;
            }
            
            // Call custom handler if provided
            if (customHandlers?.selection?.bulkDelete) {
                customHandlers.selection.bulkDelete(tableId, selectedIds, table);
            } else {
                // Default: Remove rows from DataTable
                selectedIds.forEach(id => {
                    const row = table.row(function(idx, data) {
                        return data.id === id;
                    });
                    row.remove();
                });
                
                table.draw();
                this.clearSelection(tableId, table);
                
                // Show toast notification
                if (window.showToast) {
                    window.showToast('success', `Deleted ${selectedIds.length} row(s)`);
                }
            }
        },
        
        /**
         * Bulk export operation
         */
        bulkExport: function(tableId, table) {
            const selection = tableSelections[tableId];
            const selectedIds = Array.from(selection.selectedRows);
            
            if (selectedIds.length === 0) return;
            
            // Call custom handler if provided
            if (customHandlers?.selection?.bulkExport) {
                customHandlers.selection.bulkExport(tableId, selectedIds, table);
            } else {
                // Default: Export selected rows as CSV
                const selectedData = [];
                selectedIds.forEach(id => {
                    const row = table.row(function(idx, data) {
                        return data.id === id;
                    });
                    const data = row.data();
                    if (data) selectedData.push(data);
                });
                
                // Simple CSV export
                const csv = this.convertToCSV(selectedData);
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${tableId}_export_${new Date().getTime()}.csv`;
                link.click();
                URL.revokeObjectURL(url);
                
                if (window.showToast) {
                    window.showToast('success', `Exported ${selectedIds.length} row(s)`);
                }
            }
        },
        
        /**
         * Bulk update operation
         */
        bulkUpdate: function(tableId, table) {
            const selection = tableSelections[tableId];
            const selectedIds = Array.from(selection.selectedRows);
            
            if (selectedIds.length === 0) return;
            
            // Call custom handler (bulk update requires custom implementation)
            if (customHandlers?.selection?.bulkUpdate) {
                customHandlers.selection.bulkUpdate(tableId, selectedIds, table);
            } else {
                alert('Bulk update requires custom implementation. See customHandlers.selection.bulkUpdate');
            }
        },
        
        /**
         * Clear all selections
         */
        clearSelection: function(tableId, table) {
            const selection = tableSelections[tableId];
            
            selection.selectedRows.clear();
            $(`#${tableId} .row-checkbox`).prop('checked', false);
            $(`#${tableId}_selectAll`).prop('checked', false).prop('indeterminate', false);
            
            this.updateBulkActionsToolbar(tableId);
            
            if (selection.settings.persistSelection) {
                localStorage.removeItem(`${tableId}_selection`);
            }
        },
        
        /**
         * Save selection to localStorage
         */
        saveSelection: function(tableId) {
            const selection = tableSelections[tableId];
            const selectedIds = Array.from(selection.selectedRows);
            localStorage.setItem(`${tableId}_selection`, JSON.stringify(selectedIds));
        },
        
        /**
         * Restore selection from localStorage
         */
        restoreSelection: function(tableId, table) {
            const saved = localStorage.getItem(`${tableId}_selection`);
            if (!saved) return;
            
            try {
                const selectedIds = JSON.parse(saved);
                const selection = tableSelections[tableId];
                
                selectedIds.forEach(id => {
                    selection.selectedRows.add(id);
                    $(`#${tableId} .row-checkbox[data-row-id="${id}"]`).prop('checked', true);
                });
                
                this.updateBulkActionsToolbar(tableId);
            } catch (e) {
                console.error('Error restoring selection:', e);
            }
        },
        
        /**
         * Get selected row IDs
         */
        getSelectedIds: function(tableId) {
            const selection = tableSelections[tableId];
            return selection ? Array.from(selection.selectedRows) : [];
        },
        
        /**
         * Get selected row data
         */
        getSelectedData: function(tableId, table) {
            const selectedIds = this.getSelectedIds(tableId);
            const selectedData = [];
            
            selectedIds.forEach(id => {
                const row = table.row(function(idx, data) {
                    return data.id === id;
                });
                const data = row.data();
                if (data) selectedData.push(data);
            });
            
            return selectedData;
        },
        
        /**
         * Convert array of objects to CSV
         */
        convertToCSV: function(data) {
            if (data.length === 0) return '';
            
            // Get headers
            const headers = Object.keys(data[0]);
            const csv = [headers.join(',')];
            
            // Add rows
            data.forEach(row => {
                const values = headers.map(header => {
                    const value = row[header];
                    // Handle nested objects
                    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                    // Escape quotes and wrap in quotes if contains comma
                    return stringValue.includes(',') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
                });
                csv.push(values.join(','));
            });
            
            return csv.join('\n');
        }
    };

export { DataTableSelection };
export default DataTableSelection;

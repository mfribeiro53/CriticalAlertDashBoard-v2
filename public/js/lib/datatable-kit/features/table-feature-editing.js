/**
 * File: table-feature-editing.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-18 12:24:02
 * 
 * Table Inline Editing System
 * 
 * Provides cell-level inline editing for DataTables with validation and save/cancel.
 * Cells are NOT editable by default - must be explicitly enabled via column config.
 * 
 * Usage:
 *   Include in view after table-init.js
 *   Set editable: true in column configuration
 * 
 * Namespace: customHandlers.editing.*
 */

'use strict';

import { customHandlers } from '../core/table-custom-handlers.js';

// Store editable column configs per table
const editableConfigs = {};
  
  // Store original values for cancel operation
  const originalValues = {};

  /**
   * Initialize inline editing for a table
   */
  function initializeEditing(tableId, table, columns) {
    // Find editable columns
    const editableColumns = columns.filter(col => col.editable === true);
    
    if (editableColumns.length === 0) {
      return; // No editable columns, skip initialization
    }

    editingState[tableId] = {
      table: table,
      columns: columns,
      editableColumns: editableColumns,
      currentlyEditing: null
    };

    // Attach event handlers
    attachEventHandlers(tableId);
  }

  /**
   * Attach event handlers for inline editing
   */
  function attachEventHandlers(tableId) {
    const $table = jQuery('#' + tableId);
    
    // Double-click to enter edit mode
    $table.on('dblclick', 'td.editable-cell', function(e) {
      e.preventDefault();
      e.stopPropagation();
      enterEditMode(tableId, jQuery(this));
    });

    // Click pencil icon to enter edit mode
    $table.on('click', '.edit-cell-trigger', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const $cell = jQuery(this).closest('td.editable-cell');
      enterEditMode(tableId, $cell);
    });

    // Save button click
    $table.on('click', '.save-cell-btn', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const $cell = jQuery(this).closest('td.editable-cell');
      saveCellEdit(tableId, $cell);
    });

    // Cancel button click
    $table.on('click', '.cancel-cell-btn', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const $cell = jQuery(this).closest('td.editable-cell');
      cancelCellEdit(tableId, $cell);
    });

    // Enter key to save
    $table.on('keydown', '.cell-edit-input', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const $cell = jQuery(this).closest('td.editable-cell');
        saveCellEdit(tableId, $cell);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        const $cell = jQuery(this).closest('td.editable-cell');
        cancelCellEdit(tableId, $cell);
      }
    });

    // Click outside to cancel (optional)
    jQuery(document).on('click', function(e) {
      if (editingState[tableId] && editingState[tableId].currentlyEditing) {
        const $target = jQuery(e.target);
        if (!$target.closest('.editable-cell').length && 
            !$target.closest('.save-cell-btn').length &&
            !$target.closest('.cancel-cell-btn').length) {
          const $editingCell = editingState[tableId].currentlyEditing;
          if ($editingCell && $editingCell.length) {
            cancelCellEdit(tableId, $editingCell);
          }
        }
      }
    });
  }

  /**
   * Enter edit mode for a cell
   */
  function enterEditMode(tableId, $cell) {
    const state = editingState[tableId];
    if (!state) return;

    // If already editing another cell, cancel it first
    if (state.currentlyEditing && state.currentlyEditing[0] !== $cell[0]) {
      cancelCellEdit(tableId, state.currentlyEditing);
    }

    // Get cell info
    const table = state.table;
    const rowData = table.row($cell.closest('tr')).data();
    const columnIndex = table.cell($cell).index().column;
    const columnConfig = state.columns[columnIndex];

    if (!columnConfig || !columnConfig.editable) {
      return; // Not editable
    }

    // Get current value
    const fieldPath = columnConfig.data;
    const currentValue = getNestedValue(rowData, fieldPath);
    
    // Store original value
    const cellKey = tableId + '_' + $cell.closest('tr').index() + '_' + columnIndex;
    originalValues[cellKey] = currentValue;

    // Hide display content
    $cell.find('.cell-display').hide();
    
    // Show edit controls
    const editType = columnConfig.editType || 'text';
    const editOptions = columnConfig.editOptions || [];
    const placeholder = columnConfig.editPlaceholder || 'Enter value...';
    
    let editHtml = '';
    
    switch(editType) {
      case 'select':
        editHtml = '<select class="cell-edit-input form-select form-select-sm">';
        if (columnConfig.editAllowEmpty !== false) {
          editHtml += '<option value="">-- Select --</option>';
        }
        editOptions.forEach(opt => {
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          const selected = optValue == currentValue ? 'selected' : '';
          editHtml += `<option value="${optValue}" ${selected}>${optLabel}</option>`;
        });
        editHtml += '</select>';
        break;
        
      case 'number':
        editHtml = `<input type="number" class="cell-edit-input form-control form-control-sm" value="${currentValue || ''}" placeholder="${placeholder}"`;
        if (columnConfig.editMin !== undefined) editHtml += ` min="${columnConfig.editMin}"`;
        if (columnConfig.editMax !== undefined) editHtml += ` max="${columnConfig.editMax}"`;
        if (columnConfig.editStep !== undefined) editHtml += ` step="${columnConfig.editStep}"`;
        editHtml += '>';
        break;
        
      case 'date':
        const dateValue = currentValue ? new Date(currentValue).toISOString().split('T')[0] : '';
        editHtml = `<input type="date" class="cell-edit-input form-control form-control-sm" value="${dateValue}">`;
        break;
        
      case 'textarea':
        editHtml = `<textarea class="cell-edit-input form-control form-control-sm" rows="2" placeholder="${placeholder}">${currentValue || ''}</textarea>`;
        break;
        
      case 'text':
      default:
        editHtml = `<input type="text" class="cell-edit-input form-control form-control-sm" value="${currentValue || ''}" placeholder="${placeholder}">`;
        break;
    }
    
    editHtml += '<div class="cell-edit-buttons mt-1">' +
                '<button class="save-cell-btn btn btn-success btn-sm me-1"><i class="bi bi-check"></i></button>' +
                '<button class="cancel-cell-btn btn btn-secondary btn-sm"><i class="bi bi-x"></i></button>' +
                '</div>';
    
    $cell.find('.cell-edit').html(editHtml).show();
    $cell.addClass('editing-active');
    
    // Focus input
    $cell.find('.cell-edit-input').focus().select();
    
    // Track currently editing cell
    state.currentlyEditing = $cell;
  }

  /**
   * Save cell edit
   */
  function saveCellEdit(tableId, $cell) {
    const state = editingState[tableId];
    if (!state) return;

    const table = state.table;
    const $row = $cell.closest('tr');
    const rowData = table.row($row).data();
    const columnIndex = table.cell($cell).index().column;
    const columnConfig = state.columns[columnIndex];
    
    // Get new value
    const $input = $cell.find('.cell-edit-input');
    let newValue = $input.val();
    
    // Type conversion
    const editType = columnConfig.editType || 'text';
    if (editType === 'number') {
      newValue = newValue ? parseFloat(newValue) : null;
    }
    
    // Validation
    const validationResult = validateCellValue(tableId, newValue, columnConfig, rowData);
    if (!validationResult.valid) {
      showValidationError($cell, validationResult.message);
      return;
    }
    
    // Custom validation handler
    if (customHandlers.editing.validateCell) {
      const customResult = customHandlers.editing.validateCell(
        tableId, rowData, columnConfig.data, newValue, columnConfig
      );
      if (customResult && !customResult.valid) {
        showValidationError($cell, customResult.message);
        return;
      }
    }
    
    // Get cell key for original value
    const cellKey = tableId + '_' + $row.index() + '_' + columnIndex;
    const originalValue = originalValues[cellKey];
    
    // Check if value actually changed
    if (newValue === originalValue) {
      cancelCellEdit(tableId, $cell);
      return;
    }
    
    // Update data
    setNestedValue(rowData, columnConfig.data, newValue);
    
    // Custom save handler
    if (customHandlers.editing.onCellSave) {
      customHandlers.editing.onCellSave(
        tableId, rowData, columnConfig.data, newValue, originalValue, table
      );
    }
    
    // Redraw the row to show updated value
    table.row($row).invalidate().draw(false);
    
    // Clear original value
    delete originalValues[cellKey];
    
    // Show success toast
    showToast('Success', 'Cell updated successfully', 'success');
    
    // Exit edit mode
    exitEditMode(tableId, $cell);
  }

  /**
   * Cancel cell edit
   */
  function cancelCellEdit(tableId, $cell) {
    const state = editingState[tableId];
    if (!state) return;

    // Get cell key
    const $row = $cell.closest('tr');
    const columnIndex = state.table.cell($cell).index().column;
    const cellKey = tableId + '_' + $row.index() + '_' + columnIndex;
    
    // Clear original value
    delete originalValues[cellKey];
    
    // Exit edit mode
    exitEditMode(tableId, $cell);
  }

  /**
   * Exit edit mode
   */
  function exitEditMode(tableId, $cell) {
    const state = editingState[tableId];
    if (!state) return;

    $cell.removeClass('editing-active');
    $cell.find('.cell-edit').hide().empty();
    $cell.find('.cell-display').show();
    $cell.find('.validation-error').remove();
    
    state.currentlyEditing = null;
  }

  /**
   * Validate cell value
   */
  function validateCellValue(tableId, value, columnConfig, rowData) {
    // Required validation
    if (columnConfig.editRequired && (value === null || value === undefined || value === '')) {
      return { valid: false, message: 'This field is required' };
    }
    
    // Min/max for numbers
    if (columnConfig.editType === 'number' && value !== null && value !== '') {
      if (columnConfig.editMin !== undefined && value < columnConfig.editMin) {
        return { valid: false, message: `Value must be at least ${columnConfig.editMin}` };
      }
      if (columnConfig.editMax !== undefined && value > columnConfig.editMax) {
        return { valid: false, message: `Value must be at most ${columnConfig.editMax}` };
      }
    }
    
    // Pattern validation
    if (columnConfig.editPattern && value) {
      const pattern = new RegExp(columnConfig.editPattern);
      if (!pattern.test(value)) {
        return { valid: false, message: columnConfig.editPatternMessage || 'Invalid format' };
      }
    }
    
    return { valid: true };
  }

  /**
   * Show validation error
   */
  function showValidationError($cell, message) {
    $cell.find('.validation-error').remove();
    const $error = jQuery('<div class="validation-error text-danger small mt-1">' + message + '</div>');
    $cell.find('.cell-edit-buttons').before($error);
  }

  /**
   * Show toast notification
   */
  function showToast(title, message, type) {
    // Use Bootstrap toast if available, otherwise console log
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
      // Create toast element
      const toastHtml = `
        <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0" role="alert">
          <div class="d-flex">
            <div class="toast-body">
              <strong>${title}:</strong> ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      `;
      
      let $container = jQuery('.toast-container');
      if ($container.length === 0) {
        $container = jQuery('<div class="toast-container position-fixed top-0 end-0 p-3"></div>');
        jQuery('body').append($container);
      }
      
      const $toast = jQuery(toastHtml);
      $container.append($toast);
      const toast = new window.bootstrap.Toast($toast[0]);
      toast.show();
      
      $toast.on('hidden.bs.toast', function() {
        $toast.remove();
      });
    } else {
      console.log(title + ': ' + message);
    }
  }

  /**
   * Get nested object value using dot notation
   */
  function getNestedValue(obj, path) {
    if (!path || !obj) return obj;
    const keys = path.split('.');
    let value = obj;
    for (let i = 0; i < keys.length; i++) {
      if (value === null || value === undefined) return value;
      value = value[keys[i]];
    }
    return value;
  }

  /**
   * Set nested object value using dot notation
   */
  function setNestedValue(obj, path, value) {
    if (!path || !obj) return;
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

// Export public API
export {
  initializeEditing,
  enterEditMode,
  saveCellEdit,
  cancelCellEdit,
  exitEditMode,
  validateCellValue
};

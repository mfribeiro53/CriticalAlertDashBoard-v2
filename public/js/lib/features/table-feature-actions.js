/**
 * File: table-feature-actions.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-18 12:24:02
 * 
 * DataTable Row Actions Handler
 * 
 * Manages click events for action buttons in DataTables
 * Provides view, edit, and delete functionality
 * 
 * ARCHITECTURE:
 * This file provides DEFAULT implementations for row actions.
 * 
 * To customize actions for your application:
 * 1. Edit public/js/custom-actions.js
 * 2. Implement the custom*Action() functions with your business logic
 * 3. This file will automatically call your custom functions
 * 
 * Custom functions in custom-handlers.js:
 * - customHandlers.actions.view() - Handle view button clicks
 * - customHandlers.actions.edit() - Handle edit button clicks  
 * - customHandlers.actions.delete() - Handle delete button clicks (with API calls)
 * - customHandlers.actions.validate() - Validate before actions execute
 * - customHandlers.actions.shouldShowButton() - Control button visibility per row
 * - customHandlers.actions.getCustomActions() - Add additional action buttons
 * 
 * If custom functions are not defined or return null,
 * the default modal-based behavior will be used.
 * 
 * Future features will use similar namespaces:
 * - customHandlers.filters.*
 * - customHandlers.exports.*
 * - customHandlers.editing.*
 * - customHandlers.bulk.*
 */

'use strict';

import { customHandlers } from '../core/table-custom-handlers.js';

/**
 * Initialize action button event handlers
 * Uses event delegation to handle dynamically generated buttons
 */
const initializeActionHandlers = () => {
    // View action handler
    $(document).on('click', '.btn-action-view', function(e) {
      e.preventDefault();
      const id = $(this).data('id');
      const row = $(this).closest('tr');
      const table = $(this).closest('table').DataTable();
      const rowData = table.row(row).data();
      
      // Validate action before proceeding
      if (customHandlers?.actions?.validate && typeof customHandlers.actions.validate === 'function') {
        if (!customHandlers.actions.validate('view', id, rowData)) {
          return; // Validation failed, abort action
        }
      }
      
      handleViewAction(id, rowData);
    });

    // Edit action handler
    $(document).on('click', '.btn-action-edit', function(e) {
      e.preventDefault();
      const id = $(this).data('id');
      const row = $(this).closest('tr');
      const table = $(this).closest('table').DataTable();
      const rowData = table.row(row).data();
      
      // Validate action before proceeding
      if (customHandlers?.actions?.validate && typeof customHandlers.actions.validate === 'function') {
        if (!customHandlers.actions.validate('edit', id, rowData)) {
          return; // Validation failed, abort action
        }
      }
      
      handleEditAction(id, rowData);
    });

    // Delete action handler
    $(document).on('click', '.btn-action-delete', function(e) {
      e.preventDefault();
      const id = $(this).data('id');
      const row = $(this).closest('tr');
      const table = $(this).closest('table').DataTable();
      const rowData = table.row(row).data();
      
      // Validate action before proceeding
      if (customHandlers?.actions?.validate && typeof customHandlers.actions.validate === 'function') {
        if (!customHandlers.actions.validate('delete', id, rowData)) {
          return; // Validation failed, abort action
        }
      }
      
      handleDeleteAction(id, rowData, row, table);
    });

    // Initialize Bootstrap tooltips for action buttons
    initializeTooltips();
  }

  /**
   * Handle view action - display row details in a modal
   * @param {string|number} id - Row identifier
   * @param {object} rowData - Full row data object
   */
  const handleViewAction = (id, rowData) => {
    console.log('View action triggered for ID:', id);
    console.log('Row data:', rowData);
    
    // Check if custom view action is defined
    if (customHandlers?.actions?.view && typeof customHandlers.actions.view === 'function') {
      const result = customHandlers.actions.view(id, rowData, { table: null, row: null });
      if (result !== null) {
        return; // Custom action handled it
      }
    }
    
    // Default behavior: Create modal with row details
    const modalHtml = `
      <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="viewModalLabel">
                <i class="bi bi-eye"></i> View Details - ID: ${id}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <pre class="bg-light p-3 rounded">${JSON.stringify(rowData, null, 2)}</pre>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Remove existing modal if present
    $('#viewModal').remove();
    
    // Add modal to page and show it
    $('body').append(modalHtml);
    const modal = new window.bootstrap.Modal(document.getElementById('viewModal'));
    modal.show();
    
    // Clean up modal after it's hidden
    $('#viewModal').on('hidden.bs.modal', function() {
      $(this).remove();
    });
  }

  /**
   * Handle edit action - show edit form in a modal
   * @param {string|number} id - Row identifier
   * @param {object} rowData - Full row data object
   */
  const handleEditAction = (id, rowData) => {
    console.log('Edit action triggered for ID:', id);
    console.log('Row data:', rowData);
    
    // Check if custom edit action is defined
    if (customHandlers?.actions?.edit && typeof customHandlers.actions.edit === 'function') {
      const result = customHandlers.actions.edit(id, rowData, { table: null, row: null });
      if (result !== null) {
        return; // Custom action handled it
      }
    }
    
    // Default behavior: Create edit modal
    const modalHtml = `
      <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editModalLabel">
                <i class="bi bi-pencil"></i> Edit Record - ID: ${id}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="alert alert-info">
                <i class="bi bi-info-circle"></i> 
                Edit functionality is a placeholder. In a real application, this would display an edit form.
              </div>
              <pre class="bg-light p-3 rounded">${JSON.stringify(rowData, null, 2)}</pre>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" onclick="alert('Save functionality not implemented')">
                <i class="bi bi-save"></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Remove existing modal if present
    $('#editModal').remove();
    
    // Add modal to page and show it
    $('body').append(modalHtml);
    const modal = new window.bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
    
    // Clean up modal after it's hidden
    $('#editModal').on('hidden.bs.modal', function() {
      $(this).remove();
    });
  }

  /**
   * Handle delete action - show confirmation and delete row
   * @param {string|number} id - Row identifier
   * @param {object} rowData - Full row data object
   * @param {jQuery} row - jQuery row element
   * @param {DataTable} table - DataTable instance
   */
  const handleDeleteAction = (id, rowData, row, table) => {
    console.log('Delete action triggered for ID:', id);
    console.log('Row data:', rowData);
    
    // Create confirmation modal
    const modalHtml = `
      <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title" id="deleteModalLabel">
                <i class="bi bi-exclamation-triangle"></i> Confirm Delete
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete this record?</p>
              <p><strong>ID:</strong> ${id}</p>
              <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i> 
                This action cannot be undone.
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" id="confirmDelete">
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Remove existing modal if present
    $('#deleteModal').remove();
    
    // Add modal to page and show it
    $('body').append(modalHtml);
    const modal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
    
    // Handle confirmation
    $('#confirmDelete').on('click', function() {
      const deleteButton = $(this);
      deleteButton.prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> Deleting...');
      
      // Check if custom delete action is defined
      let deletePromise;
      if (customHandlers?.actions?.delete && typeof customHandlers.actions.delete === 'function') {
        deletePromise = customHandlers.actions.delete(id, rowData, { table: table, row: row });
      } else {
        // Default behavior: just remove from table (no API call)
        table.row(row).remove().draw();
        deletePromise = Promise.resolve({ success: true });
      }
      
      // Handle the result
      deletePromise
        .then(result => {
          // Show success message
          showToast('success', 'Record deleted successfully', `Record with ID ${id} has been removed.`);
          
          // Close modal
          modal.hide();
        })
        .catch(error => {
          console.error('Delete failed:', error);
          showToast('danger', 'Delete failed', error.message || 'An error occurred while deleting the record.');
          deleteButton.prop('disabled', false).html('<i class="bi bi-trash"></i> Delete');
        });
    });
    
    // Clean up modal after it's hidden
    $('#deleteModal').on('hidden.bs.modal', function() {
      $(this).remove();
    });
  }

  /**
   * Initialize Bootstrap tooltips for action buttons
   */
  const initializeTooltips = () => {
    // Re-initialize tooltips when table is redrawn
    $(document).on('draw.dt', function() {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach(function(tooltipTriggerEl) {
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    });
  }

  /**
   * Show a Bootstrap toast notification
   * @param {string} type - Toast type ('success', 'danger', 'warning', 'info')
   * @param {string} title - Toast title
   * @param {string} message - Toast message
   */
  const showToast = (type, title, message) => {
    const toastHtml = `
      <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
        <div class="d-flex">
          <div class="toast-body">
            <strong>${title}</strong><br>${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    
    $('body').append(toastHtml);
    const toastElement = $('.toast').last()[0];
    const toast = new window.bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
    toast.show();
    
    // Remove toast after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
      $(this).remove();
    });
}

// Initialize when DOM is ready
$(document).ready(function() {
  initializeActionHandlers();
  console.log('Table action handlers initialized');
});

// Export functions
export {
  initializeActionHandlers,
  handleViewAction,
  handleEditAction,
  handleDeleteAction,
  initializeTooltips,
  showToast
};

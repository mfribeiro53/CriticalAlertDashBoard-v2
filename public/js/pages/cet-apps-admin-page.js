/**
 * File: cet-apps-admin-page.js
 * Created: 2025-12-20 17:26:31
 * Last Modified: 2025-12-24 12:00:00
 * 
 * CET Apps Admin Page Initialization
 * 
 * This file uses MANUAL DataTable initialization (autoInit: false) instead of the standard
 * auto-initialization used by other pages. This is necessary because:
 * 
 * 1. We need to inject a custom "Actions" column with Edit/Delete buttons for each row
 * 2. The buttons require event handlers tied to specific row data (app IDs)
 * 3. Function references (render functions) can't be serialized in JSON config, so we
 *    must resolve them from strings to actual functions at runtime
 * 
 * The standard auto-init approach works for display-only tables, but admin functionality
 * requires programmatic control over column rendering and dynamic button generation.
 * 
 * Handles CRUD operations for CET applications including:
 * - DataTable initialization with custom action column
 * - Add/Edit form modal management
 * - Delete confirmation and execution
 * - iGate App filtering
 */

'use strict';

import { showToast } from '../lib/form-kit/helpers/form-helpers.js';
import { initializeDynamicForm, resetForm, getFormData } from '../lib/form-kit/core/form-dynamic.js';
import { renderSupportLink } from '../helpers/cet-render-helpers.js';

let cetAppsTable;
let currentEditId = null;

/**
 * Initialize the CET Apps Admin DataTable with action columns
 * 
 * Unlike other pages that use auto-initialization, this manually initializes the DataTable
 * because we need to:
 * 
 * 1. Add a custom "Actions" column (last column) that renders Edit/Delete buttons per row
 * 2. Convert render function names (strings from JSON) to actual JavaScript functions
 * 3. Configure export buttons with outline styling (btn-outline-secondary)
 * 4. Attach event handlers to the dynamically-generated action buttons
 * 
 * The table data is still embedded from the server (config.dataSource), but we need
 * programmatic control over the DataTable API to add custom functionality.
 */
const initializeAdminTable = () => {
  // Get the config from the table element
  const tableElement = $('#cetAppsAdminTable');
  const config = tableElement.data('dt-config');
  
  // Process columns to convert render function names to actual functions
  const processedColumns = config.columns.map(col => {
    if (col.render === 'renderSupportLink') {
      return { ...col, render: renderSupportLink };
    } 
    return col;
  });
  
  // Initialize DataTable with embedded data and custom action column
  cetAppsTable = tableElement.DataTable({
    data: config.dataSource,
    columns: processedColumns,
    pageLength: 25,
    order: config.defaultOrder || [[0, 'asc'], [1, 'asc']],
    columnDefs: [
      {
        // Add actions column with render function
        targets: -1,
        data: null,
        orderable: false,
        className: 'text-center',
        render: function(data, type, row) {
          return `
            <button class="btn btn-sm btn-primary edit-app-btn" data-id="${row.id}" title="Edit">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger delete-app-btn ms-1" data-id="${row.id}" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          `;
        }
      }
    ],
    buttons: {
      buttons: config.buttons,
      dom: {
        button: {
          className: 'btn btn-sm btn-outline-secondary'
        }
      }
    },
    dom: '<"row"<"col-sm-12 col-md-6"B><"col-sm-12 col-md-6"f>>rtip',
    language: {
      search: '_INPUT_',
      searchPlaceholder: 'Search applications...'
    }
  });

  // Attach event handlers to action buttons
  $('#cetAppsAdminTable').on('click', '.edit-app-btn', handleEditClick);
  $('#cetAppsAdminTable').on('click', '.delete-app-btn', handleDeleteClick);
};

/**
 * Populate the iGate App filter dropdown with unique application names
 * 
 * Extracts all unique iGate App values from the first column of the table,
 * sorts them alphabetically, and populates the filter dropdown.
 * This allows users to quickly filter the table to show only applications
 * from a specific iGate App (e.g., "ESR", "Billing", "Lab").
 */
const populateIGateAppFilter = () => {
  const table = cetAppsTable;
  const iGateApps = new Set();

  // Collect unique iGate Apps from the table
  table.column(0).data().each(function(value) {
    if (value) {
      iGateApps.add(value);
    }
  });

  // Populate the dropdown
  const select = $('#iGateAppFilter');
  const sortedApps = Array.from(iGateApps).sort();
  
  sortedApps.forEach(app => {
    select.append(`<option value="${app}">${app}</option>`);
  });
};

/**
 * Handle iGate App filter change events
 * 
 * When the user selects an iGate App from the dropdown, filters the DataTable
 * to show only rows matching that exact value in column 0 (iGate App column).
 * Uses regex anchors (^ and $) to ensure exact match, not partial matches.
 * Selecting "All" clears the filter and shows all rows.
 */
const setupIGateAppFilter = () => {
  $('#iGateAppFilter').on('change', function() {
    const filterValue = $(this).val();
    
    if (filterValue) {
      // Filter table by iGate App (column 0)
      cetAppsTable.column(0).search('^' + filterValue + '$', true, false).draw();
    } else {
      // Clear filter
      cetAppsTable.column(0).search('').draw();
    }
  });
};

/**
 * Handle "Add New Application" button click
 * 
 * Prepares the form modal for creating a new CET application by:
 * 1. Clearing any existing form data (reset to defaults)
 * 2. Setting modal title and button text for "Add" operation
 * 3. Configuring the form to POST to /cet-apps/api (create endpoint)
 * 4. Displaying the modal to the user
 * 
 * The same form is reused for both Add and Edit operations, but with
 * different titles, button text, and HTTP methods (POST vs PUT).
 */
const handleAddNewClick = () => {
  currentEditId = null;
  resetForm('appForm');
  
  // Update modal title and button text
  $('#appFormModalLabel').html('<i class="bi bi-plus-circle"></i> Add New CET Application');
  $('#appForm button[type="submit"]').html('<i class="bi bi-check-circle"></i> Save Application');
  
  // Reset form action to POST
  $('#appForm').attr('action', '/cet-apps/api');
  $('#appForm').data('method', 'POST');
  
  // Disable submit button initially for Add mode (fields are empty)
  $('#appForm button[type="submit"]').prop('disabled', true);
  
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('appFormModal'));
  modal.show();
};

/**
 * Handle edit button click on a table row
 * 
 * When the user clicks an Edit button, this function:
 * 1. Extracts the application ID from the button's data-id attribute
 * 2. Fetches the full application data from the API (GET /cet-apps/api/:id)
 * 3. Populates the form modal with the existing application data
 * 4. Configures the form to PUT to the update endpoint
 * 5. Updates modal text to indicate "Edit" operation
 * 6. Displays the modal
 * 
 * Uses async/await to fetch data from the server before opening the modal,
 * ensuring the form is pre-populated with current values.
 */
const handleEditClick = async (e) => {
  const button = $(e.currentTarget);
  const appId = button.data('id');
  
  try {
    // Fetch the application data
    const response = await fetch(`/cet-apps/api/${appId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch application data');
    }
    
    const appData = await response.json();
    currentEditId = appId;
    
    // Populate form with existing data
    populateForm(appData);
    
    // Update modal title and button text
    $('#appFormModalLabel').html('<i class="bi bi-pencil-square"></i> Edit CET Application');
    $('#appForm button[type="submit"]').html('<i class="bi bi-check-circle"></i> Update Application');
    
    // Update form action to PUT
    $('#appForm').attr('action', `/cet-apps/api/${appId}`);
    $('#appForm').data('method', 'PUT');
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('appFormModal'));
    modal.show();
  } catch (error) {
    console.error('Error loading application data:', error);
    showToast('Failed to load application data', 'danger');
  }
};

/**
 * Populate form fields with existing application data
 * 
 * Takes the application data object from the API and populates each
 * form field with its corresponding value. Handles different input types:
 * - Text inputs: iGateApp, cetApp, sqlServer, database_name, supportLink
 * - Textarea: description
 * - Select dropdowns: status (active/inactive), environment (production/staging/development)
 * 
 * Uses jQuery's .val() for inputs and selects.
 * Empty values are handled gracefully with the || '' fallback.
 * After populating, enables the submit button since all required fields will have values.
 */
const populateForm = (data) => {
  console.log('Populating form with data:', data);
  
  // Text inputs
  $('#appForm input[name="iGateApp"]').val(data.iGateApp || '');
  $('#appForm input[name="cetApp"]').val(data.cetApp || '');
  $('#appForm input[name="sqlServer"]').val(data.sqlServer || '');
  $('#appForm input[name="database_name"]').val(data.database_name || '');
  $('#appForm input[name="supportLink"]').val(data.supportLink || '');
  
  // Textarea
  $('#appForm textarea[name="description"]').val(data.description || '');
  
  // Select dropdowns
  if (data.status) {
    $('#appForm select[name="status"]').val(data.status);
  }
  
  if (data.environment) {
    $('#appForm select[name="environment"]').val(data.environment);
  }
  
  // Enable submit button since form now has valid data
  const submitBtn = $('#appForm button[type="submit"]');
  console.log('Submit button before enabling:', submitBtn.prop('disabled'));
  submitBtn.prop('disabled', false);
  console.log('Submit button after enabling:', submitBtn.prop('disabled'));
};

/**
 * Handle delete button click on a table row
 * 
 * When the user clicks a Delete button, this function:
 * 1. Extracts the application ID from the button's data-id attribute
 * 2. Retrieves the full row data from the DataTable (to show app details)
 * 3. Populates the confirmation modal with the app name (for user verification)
 * 4. Stores the app ID on the confirm button for later use
 * 5. Displays the confirmation modal
 * 
 * This is a two-step delete process for safety - the actual deletion
 * only happens when the user confirms in handleDeleteConfirm().
 */
const handleDeleteClick = (e) => {
  const button = $(e.currentTarget);
  const appId = button.data('id');
  
  // Find the row data
  const rowData = cetAppsTable.row(button.closest('tr')).data();
  
  // Populate delete confirmation modal
  $('#deleteAppIGate').text(rowData.iGateApp);
  $('#deleteAppCET').text(rowData.cetApp);
  $('#confirmDeleteBtn').data('id', appId);
  
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
  modal.show();
};

/**
 * Handle delete confirmation after user confirms in the modal
 * 
 * Executes the actual delete operation by:
 * 1. Retrieving the stored app ID from the confirm button
 * 2. Showing loading spinner on the button (prevents double-clicks)
 * 3. Sending DELETE request to /cet-apps/api/:id
 * 4. Handling success: show toast message and reload page to refresh table
 * 5. Handling errors: show error toast and restore button state
 * 
 * Uses async/await for API interaction and provides user feedback
 * throughout the process. Page reload is necessary because the data
 * is embedded at render time, not dynamically loaded via AJAX.
 */
const handleDeleteConfirm = async () => {
  const appId = $('#confirmDeleteBtn').data('id');
  const deleteBtn = $('#confirmDeleteBtn');
  
  // Set loading state
  const originalHtml = deleteBtn.html();
  deleteBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Deleting...');
  
  try {
    const response = await fetch(`/cet-apps/api/${appId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete application');
    }
    
    const result = await response.json();
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
    
    // Show success message
    showToast(result.message || 'Application deleted successfully', 'success');
    
    // Reload the page to refresh the table
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error('Error deleting application:', error);
    showToast(error.message || 'Failed to delete application', 'danger');
    
    // Reset button state
    deleteBtn.prop('disabled', false).html(originalHtml);
  }
};

/**
 * Setup form submission handler for Add and Edit operations
 * 
 * Attaches a submit handler to the application form that:
 * 1. Prevents default form submission (no page reload)
 * 2. Shows loading spinner on submit button
 * 3. Gathers form data using the getFormData helper
 * 4. Determines HTTP method (POST for new, PUT for edit) from form's data-method
 * 5. Sends data to appropriate endpoint as JSON
 * 6. Handles success: closes modal, shows toast, reloads page
 * 7. Handles errors: shows error toast, restores button state
 * 
 * The same form and handler work for both Add and Edit because the
 * HTTP method and endpoint URL are set dynamically by handleAddNewClick()
 * or handleEditClick() before the modal opens.
 */
const setupFormSubmission = () => {
  $('#appForm').on('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHtml = submitBtn.innerHTML;
    
    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
    
    try {
      const formData = getFormData('appForm');
      const method = $(form).data('method') || 'POST';
      const action = $(form).attr('action');
      
      const response = await fetch(action, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save application');
      }
      
      const result = await response.json();
      
      // Close modal
      bootstrap.Modal.getInstance(document.getElementById('appFormModal')).hide();
      
      // Show success message
      showToast(result.message || 'Application saved successfully', 'success');
      
      // Reload the page to refresh the table
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error saving application:', error);
      showToast(error.message || 'Failed to save application', 'danger');
      
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
    }
  });
};

/**
 * Setup form field validation to enable/disable submit button
 * 
 * Adds input event listeners to all required fields in the form.
 * When any field changes, validates all required fields and enables
 * the submit button only if all required fields have values.
 */
const setupFormValidation = () => {
  const form = document.getElementById('appForm');
  if (!form) return;
  
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Function to check if all required fields are filled
  const validateRequiredFields = () => {
    const requiredFields = form.querySelectorAll('[required]');
    let allFilled = true;
    
    requiredFields.forEach(field => {
      if (!field.value || field.value.trim() === '') {
        allFilled = false;
      }
    });
    
    if (submitBtn) {
      submitBtn.disabled = !allFilled;
      console.log('Validation check - all filled:', allFilled, 'button disabled:', submitBtn.disabled);
    }
  };
  
  // Add event listeners to all form inputs
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', validateRequiredFields);
    input.addEventListener('change', validateRequiredFields);
  });
  
  console.log('Form validation setup complete');
};

/**
 * Initialize page on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing CET Apps Admin page...');
  
  // Initialize DataTable
  initializeAdminTable();
  
  // Populate iGate App filter
  populateIGateAppFilter();
  
  // Setup filter handler
  setupIGateAppFilter();
  
  // Setup button handlers
  $('#addNewAppBtn').on('click', handleAddNewClick);
  $('#confirmDeleteBtn').on('click', handleDeleteConfirm);
  
  // Setup form submission
  setupFormSubmission();
  
  // Setup form validation for enabling/disabling submit button
  setupFormValidation();
  
  // Initialize dynamic form (if using the dynamic form system)
  // The form will handle its own validation
  
  console.log('CET Apps Admin page initialized successfully');
});

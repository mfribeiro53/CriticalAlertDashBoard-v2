/**
 * File: cet-issues-page.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-24 13:10:00
 * 
 * CET Issues View Page Initialization
 * 
 * Coordinates interaction between multiple related tables on the Issues page.
 * Implements master-detail pattern where clicking a row in the summary table
 * filters all detail tables to show only issues for that application.
 * 
 * PAGE STRUCTURE:
 * - 1 Summary Table: Shows all applications with issue counts
 * - 4 Detail Tables: Show specific issue types (Alerts, Disabled Queues, Behind, Slow)
 * 
 * INTERACTION PATTERN:
 * 1. User clicks a row in the summary table
 * 2. All detail tables filter to show only that application's issues
 * 3. Filter badges appear on detail table headers showing active filter
 * 4. User can clear filter by clicking X button on badges
 * 5. Clearing filter restores all data in detail tables
 * 
 * TECHNICAL APPROACH:
 * - Uses setTimeout to wait for auto-initialization of tables
 * - Uses DataTables API column().search() with regex for exact matching
 * - Stores current filter state in currentAppFilter variable
 * - Updates UI with filter badges dynamically
 * 
 * This page demonstrates coordinated table filtering for drill-down analysis.
 */

'use strict';

$(document).ready(function() {
  let currentAppFilter = null;
  
  // Wait for all tables to initialize
  setTimeout(function() {
    const summaryTable = $('#cetIssuesSummaryTable').DataTable();
    const alertTable = $('#cetAlertDetailsTable').DataTable();
    const disabledQueueTable = $('#cetDisabledQueueDetailsTable').DataTable();
    const behindTable = $('#cetBehindDetailsTable').DataTable();
    const slowTable = $('#cetSlowDetailsTable').DataTable();
    
    // Function to filter all detail tables by application ID
    // 
    // When a user clicks an application in the summary table, this function:
    // 1. Stores the selected app ID and name in currentAppFilter
    // 2. Applies an exact-match filter to column 0 (CET APP ID) of each detail table
    // 3. Triggers table redraw to show only matching rows
    // 4. Adds visual filter badges to detail table headers
    // 
    // Uses regex with anchors (^ and $) to ensure exact matching, not partial matches.
    // For example, searching for '1097' won't match '21097'.
    function filterDetailTables(appId, cetAppName) {
      if (appId) {
        currentAppFilter = { id: appId, name: cetAppName };
        
        // Apply filter to all detail tables
        alertTable.column(0).search('^' + appId + '$', true, false).draw();
        disabledQueueTable.column(0).search('^' + appId + '$', true, false).draw();
        behindTable.column(0).search('^' + appId + '$', true, false).draw();
        slowTable.column(0).search('^' + appId + '$', true, false).draw();
        
        // Add filter badge to each detail table header
        addFilterBadge(cetAppName);
      } else {
        clearFilters();
      }
    }
    
    // Function to add filter badge to headers
    function addFilterBadge(cetAppName) {
      $('.card-header').each(function() {
        const headerTitle = $(this).find('h5');
        // Remove existing badge if any
        headerTitle.find('.filter-badge').remove();
        // Add new badge (except to summary table)
        if (!$(this).closest('.card').find('#cetIssuesSummaryTable').length) {
          headerTitle.append(
            `<span class="filter-badge">
              Filtered by: ${cetAppName} 
              <button type="button" class="btn-close btn-close-white" aria-label="Clear filter"></button>
            </span>`
          );
        }
      });
      
      // Handle clear filter button
      $('.filter-badge .btn-close').off('click').on('click', function(e) {
        e.stopPropagation();
        clearFilters();
      });
    }
    
    // Update filter display
    function updateFilterDisplay(appName) {
      const filterBadge = $('#activeFilterBadge');
      if (appName) {
        filterBadge.html(`
          <i class="bi bi-funnel-fill me-1"></i>
          Filtered by: <strong>${appName}</strong>
          <button type="button" class="btn-close btn-close-white ms-2" aria-label="Clear filter" id="clearFilterBtn"></button>
        `).show();
      } else {
        filterBadge.hide();
      }
    }
    
    // Clear all filters
    function clearFilters() {
      currentAppFilter = null;
      
      // Clear search on all detail tables
      alertTable.column(0).search('').draw();
      disabledQueueTable.column(0).search('').draw();
      behindTable.column(0).search('').draw();
      slowTable.column(0).search('').draw();
      
      // Remove filter badges
      $('.filter-badge').remove();
      
      // Remove selected class from summary table
      $('#cetIssuesSummaryTable tbody tr').removeClass('selected');
      
      // Hide filter display if using badge element
      const filterBadge = $('#activeFilterBadge');
      if (filterBadge.length) {
        filterBadge.hide();
      }
    }
    
    // Row click handler for summary table
    $('#cetIssuesSummaryTable tbody').on('click', 'tr', function() {
      // If clicking the same row, clear filter
      if ($(this).hasClass('selected')) {
        clearFilters();
      } else {
        const data = summaryTable.row(this).data();
        if (data && data.appId) {
          // Remove previous selection
          $('#cetIssuesSummaryTable tbody tr').removeClass('selected');
          // Add selection to clicked row
          $(this).addClass('selected');
          // Filter detail tables
          filterDetailTables(data.appId, data.cetApp);
        }
      }
    });
    
    // Add keyboard support (Enter key)
    $('#cetIssuesSummaryTable tbody').on('keypress', 'tr', function(e) {
      if (e.which === 13) { // Enter key
        $(this).click();
      }
    });
    
    // Make rows focusable
    $('#cetIssuesSummaryTable tbody tr').attr('tabindex', '0');
    
    // Clear filter button handler (delegated for dynamically added button)
    $(document).on('click', '#clearFilterBtn', clearFilters);
    
  }, 800);
});

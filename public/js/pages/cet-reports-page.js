/**
 * File: cet-reports-page.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-15 12:43:56
 * 
 * CET Reports View Page Initialization
 * 
 * Page-specific initialization for the CET Reports view.
 * Handles the two tables: Latest Run Summary and All Runs Detail.
 */

'use strict';

$(document).ready(function() {
  
  // Wait for tables to initialize
  setTimeout(function() {
    const summaryTable = $('#cetReportsSummaryTable').DataTable();
    const detailTable = $('#cetReportsDetailTable').DataTable();
    
    // Custom rendering for numeric values with thousand separators
    function formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Add hover effect enhancement
    $('#cetReportsSummaryTable tbody, #cetReportsDetailTable tbody').on('mouseenter', 'tr', function() {
      $(this).addClass('table-hover-highlight');
    }).on('mouseleave', 'tr', function() {
      $(this).removeClass('table-hover-highlight');
    });
    
    // Optional: Add row click handler for summary table to filter detail table
    let currentFilter = null;
    
    $('#cetReportsSummaryTable tbody').on('click', 'tr', function() {
      const data = summaryTable.row(this).data();
      
      if (!data) return;
      
      // Toggle selection
      if ($(this).hasClass('selected')) {
        // Deselect and clear filter
        $(this).removeClass('selected');
        currentFilter = null;
        detailTable.search('').columns().search('').draw();
        clearFilterBadge();
      } else {
        // Remove previous selection
        $('#cetReportsSummaryTable tbody tr').removeClass('selected');
        // Add selection to clicked row
        $(this).addClass('selected');
        
        // Filter detail table by the same critical section, step, and substep
        currentFilter = {
          step: data.step,
          subStep: data.subStep,
          criticalSection: data.criticalSection
        };
        
        // Build filter for detail table
        $.fn.dataTable.ext.search.push(
          function(settings, searchData, index, rowData, counter) {
            if (settings.nTable.id !== 'cetReportsDetailTable') {
              return true;
            }
            
            if (!currentFilter) {
              return true;
            }
            
            return rowData.step === currentFilter.step &&
                   rowData.subStep === currentFilter.subStep &&
                   rowData.criticalSection === currentFilter.criticalSection;
          }
        );
        
        detailTable.draw();
        
        // Show filter badge
        showFilterBadge(data.step, data.subStep, data.criticalSection);
      }
    });
    
    // Add keyboard support for summary table
    $('#cetReportsSummaryTable tbody').on('keypress', 'tr', function(e) {
      if (e.which === 13) { // Enter key
        $(this).click();
      }
    });
    
    // Make rows focusable
    $('#cetReportsSummaryTable tbody tr').attr('tabindex', '0');
    
    // Function to show filter badge
    function showFilterBadge(step, subStep, criticalSection) {
      const badge = $(`
        <div id="reportsFilterBadge" class="alert alert-info alert-dismissible fade show mt-3" role="alert">
          <i class="bi bi-funnel-fill me-2"></i>
          <strong>Filtered:</strong> Showing all runs for Step ${step}, SubStep ${subStep}, Critical Section ${criticalSection}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Clear filter"></button>
        </div>
      `);
      
      $('#reportsFilterBadge').remove();
      $('#cetReportsDetailTable').closest('.card-body').prepend(badge);
      
      // Handle clear button
      badge.find('.btn-close').on('click', function() {
        clearAllFilters();
      });
    }
    
    // Function to clear filter badge
    function clearFilterBadge() {
      $('#reportsFilterBadge').remove();
    }
    
    // Function to clear all filters
    function clearAllFilters() {
      currentFilter = null;
      $('#cetReportsSummaryTable tbody tr').removeClass('selected');
      
      // Remove custom search function
      $.fn.dataTable.ext.search.pop();
      
      detailTable.draw();
      clearFilterBadge();
    }
    
    // Log table initialization
    console.log('CET Reports tables initialized');
    console.log('Summary table rows:', summaryTable.rows().count());
    console.log('Detail table rows:', detailTable.rows().count());
    
    // Optional: Calculate and display statistics
    function updateStatistics() {
      const detailData = detailTable.rows({ search: 'applied' }).data().toArray();
      
      if (detailData.length === 0) return;
      
      // Calculate average duration
      const avgDuration = detailData.reduce((sum, row) => sum + (row.duration || 0), 0) / detailData.length;
      
      // Calculate total operations
      const totalInserts = detailData.reduce((sum, row) => sum + (row.inserts || 0), 0);
      const totalUpdates = detailData.reduce((sum, row) => sum + (row.updates || 0), 0);
      const totalDeletes = detailData.reduce((sum, row) => sum + (row.deletes || 0), 0);
      
      console.log('Statistics for displayed records:');
      console.log('- Average Duration:', avgDuration.toFixed(2), 'seconds');
      console.log('- Total Inserts:', formatNumber(totalInserts));
      console.log('- Total Updates:', formatNumber(totalUpdates));
      console.log('- Total Deletes:', formatNumber(totalDeletes));
    }
    
    // Update statistics on table draw
    detailTable.on('draw', function() {
      updateStatistics();
    });
    
    // Initial statistics
    updateStatistics();
    
  }, 500);
  
});

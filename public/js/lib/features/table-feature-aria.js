/**
 * File: table-feature-aria.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-15 12:43:56
 * 
 * DataTable ARIA Enhancement Module
 * Provides comprehensive accessibility support for screen readers and assistive technologies
 * 
 * Features:
 * - Descriptive ARIA labels for all interactive elements
 * - Row and column position announcements
 * - Sort state announcements
 * - Live region updates for dynamic content
 * - Screen reader-friendly navigation
 * - Status and role announcements
 * 
 * @namespace window.customHandlers.aria
 */

'use strict';

// Store ARIA configurations and live regions per table
const ariaConfigs = new Map();
const liveRegions = new Map();

  /**
   * Initialize ARIA enhancements for a DataTable
   * @param {string} tableId - The table identifier
   * @param {Object} config - ARIA configuration
   * @param {DataTable} table - DataTables API instance
   */
  const initializeAria = (tableId, config, table) => {
    if (!config || !config.enabled) {
      return;
    }

    ariaConfigs.set(tableId, config);

    // Create live region for announcements
    createLiveRegion(tableId, config);

    // Enhance table with ARIA attributes
    enhanceTableAria(tableId, table, config);

    // Add ARIA to search
    enhanceSearchAria(tableId, table, config);

    // Add ARIA to pagination
    enhancePaginationAria(tableId, table, config);

    // Add ARIA to column headers
    enhanceHeaderAria(tableId, table, config);

    // Add ARIA to table cells
    enhanceCellAria(tableId, table, config);

    // Setup event listeners for announcements
    setupAriaEventListeners(tableId, table, config);

    // Announce initialization
    announce(tableId, config.messages?.initialized || 'Data table loaded and ready', 'polite');

    console.log(`[ARIA] Initialized for table: ${tableId}`);
  }

  /**
   * Create live region for screen reader announcements
   */
  const createLiveRegion = (tableId, config) => {
    const existingRegion = document.getElementById(`${tableId}-aria-live`);
    if (existingRegion) {
      liveRegions.set(tableId, existingRegion);
      return;
    }

    // Create polite live region
    const politeRegion = document.createElement('div');
    politeRegion.id = `${tableId}-aria-live`;
    politeRegion.className = 'sr-only';
    politeRegion.setAttribute('aria-live', 'polite');
    politeRegion.setAttribute('aria-atomic', 'true');
    politeRegion.setAttribute('role', 'status');

    // Create assertive live region for important updates
    const assertiveRegion = document.createElement('div');
    assertiveRegion.id = `${tableId}-aria-live-assertive`;
    assertiveRegion.className = 'sr-only';
    assertiveRegion.setAttribute('aria-live', 'assertive');
    assertiveRegion.setAttribute('aria-atomic', 'true');
    assertiveRegion.setAttribute('role', 'alert');

    // Add to DOM
    const wrapper = document.getElementById(`${tableId}_wrapper`);
    if (wrapper) {
      wrapper.insertBefore(politeRegion, wrapper.firstChild);
      wrapper.insertBefore(assertiveRegion, wrapper.firstChild);
    } else {
      document.body.appendChild(politeRegion);
      document.body.appendChild(assertiveRegion);
    }

    liveRegions.set(tableId, { polite: politeRegion, assertive: assertiveRegion });
  }

  /**
   * Enhance main table element with ARIA attributes
   */
  const enhanceTableAria = (tableId, table, config) => {
    const tableNode = table.table().node();
    
    // Set table role and label
    tableNode.setAttribute('role', 'table');
    
    if (config.tableLabel) {
      tableNode.setAttribute('aria-label', config.tableLabel);
    } else {
      const caption = tableNode.querySelector('caption');
      if (!caption) {
        tableNode.setAttribute('aria-label', 'Data table');
      }
    }

    // Set description if provided
    if (config.tableDescription) {
      const descId = `${tableId}-description`;
      let descElement = document.getElementById(descId);
      
      if (!descElement) {
        descElement = document.createElement('div');
        descElement.id = descId;
        descElement.className = 'sr-only';
        descElement.textContent = config.tableDescription;
        tableNode.parentElement.insertBefore(descElement, tableNode);
      }
      
      tableNode.setAttribute('aria-describedby', descId);
    }

    // Add row and column counts
    updateTableCounts(tableId, table);
  }

  /**
   * Update table row and column count announcements
   */
  const updateTableCounts = (tableId, table) => {
    const info = table.page.info();
    const tableNode = table.table().node();
    const config = ariaConfigs.get(tableId);
    
    if (config?.announceRowCount) {
      const totalRows = info.recordsDisplay;
      const countText = `Table with ${totalRows} ${totalRows === 1 ? 'row' : 'rows'}`;
      tableNode.setAttribute('aria-rowcount', totalRows);
      
      // Update live region with filtered results
      if (info.recordsTotal !== info.recordsDisplay) {
        announce(tableId, `Showing ${totalRows} of ${info.recordsTotal} rows`, 'polite');
      }
    }
  }

  /**
   * Enhance search input with ARIA attributes
   */
  const enhanceSearchAria = (tableId, table, config) => {
    const wrapper = document.getElementById(`${tableId}_wrapper`);
    if (!wrapper) return;

    const searchInput = wrapper.querySelector('.dataTables_filter input');
    if (searchInput && config.enhanceSearch !== false) {
      searchInput.setAttribute('aria-label', config.messages?.searchLabel || 'Search table');
      searchInput.setAttribute('aria-controls', tableId);
      searchInput.setAttribute('role', 'searchbox');
      
      // Add description
      const searchDesc = `${tableId}-search-description`;
      let descElement = document.getElementById(searchDesc);
      
      if (!descElement) {
        descElement = document.createElement('span');
        descElement.id = searchDesc;
        descElement.className = 'sr-only';
        descElement.textContent = config.messages?.searchDescription || 'Enter search terms to filter table data';
        searchInput.parentElement.appendChild(descElement);
      }
      
      searchInput.setAttribute('aria-describedby', searchDesc);
    }
  }

  /**
   * Enhance pagination with ARIA attributes
   */
  const enhancePaginationAria = (tableId, table, config) => {
    const wrapper = document.getElementById(`${tableId}_wrapper`);
    if (!wrapper) return;

    const paginateContainer = wrapper.querySelector('.dataTables_paginate');
    if (paginateContainer && config.enhancePagination !== false) {
      paginateContainer.setAttribute('role', 'navigation');
      paginateContainer.setAttribute('aria-label', config.messages?.paginationLabel || 'Table pagination');

      // Enhance pagination buttons
      const buttons = paginateContainer.querySelectorAll('a.paginate_button');
      buttons.forEach(button => {
        const text = button.textContent.trim();
        
        if (button.classList.contains('current')) {
          button.setAttribute('aria-current', 'page');
          button.setAttribute('aria-label', `Page ${text}, current page`);
        } else if (button.classList.contains('previous')) {
          button.setAttribute('aria-label', 'Previous page');
        } else if (button.classList.contains('next')) {
          button.setAttribute('aria-label', 'Next page');
        } else {
          button.setAttribute('aria-label', `Page ${text}`);
        }
      });
    }

    // Enhance page length selector
    const lengthSelect = wrapper.querySelector('.dataTables_length select');
    if (lengthSelect && config.enhancePageLength !== false) {
      lengthSelect.setAttribute('aria-label', config.messages?.pageLengthLabel || 'Number of rows per page');
    }
  }

  /**
   * Enhance column headers with ARIA attributes
   */
  const enhanceHeaderAria = (tableId, table, config) => {
    const headers = table.columns().header();
    
    headers.each(function(header, index) {
      header.setAttribute('role', 'columnheader');
      header.setAttribute('scope', 'col');
      
      // Add sort state
      if (header.classList.contains('sorting') || 
          header.classList.contains('sorting_asc') || 
          header.classList.contains('sorting_desc')) {
        
        header.setAttribute('aria-sort', 'none');
        
        if (header.classList.contains('sorting_asc')) {
          header.setAttribute('aria-sort', 'ascending');
        } else if (header.classList.contains('sorting_desc')) {
          header.setAttribute('aria-sort', 'descending');
        }
        
        // Add sortable description
        const columnName = header.textContent.trim();
        header.setAttribute('aria-label', `${columnName}, sortable column`);
      }
    });
  }

  /**
   * Enhance table cells with ARIA attributes
   */
  const enhanceCellAria = (tableId, table, config) => {
    if (config.enhanceCells === false) return;

    const rows = table.rows({ page: 'current' }).nodes();
    
    rows.each(function(row, rowIndex) {
      row.setAttribute('role', 'row');
      
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        cell.setAttribute('role', 'cell');
        
        // Add row and column position for screen readers
        if (config.announcePosition) {
          const rowPos = rowIndex + 1;
          const colPos = cellIndex + 1;
          cell.setAttribute('aria-rowindex', rowPos);
          cell.setAttribute('aria-colindex', colPos);
        }
      });
    });
  }

  /**
   * Setup event listeners for ARIA announcements
   */
  const setupAriaEventListeners = (tableId, table, config) => {
    const tableNode = table.table().node();

    // Draw event - update counts and cells
    table.on('draw', function() {
      updateTableCounts(tableId, table);
      enhanceCellAria(tableId, table, config);
      
      if (config.announceUpdate !== false) {
        const info = table.page.info();
        announce(tableId, `Table updated. Showing ${info.recordsDisplay} rows`, 'polite');
      }
    });

    // Order event - announce sort changes
    table.on('order', function() {
      const order = table.order();
      if (order.length > 0 && config.announceSort !== false) {
        const columnIndex = order[0][0];
        const direction = order[0][1];
        const columnName = table.column(columnIndex).header().textContent.trim();
        
        const sortText = `Table sorted by ${columnName}, ${direction === 'asc' ? 'ascending' : 'descending'}`;
        announce(tableId, sortText, 'polite');
        
        // Update header aria-sort attributes
        enhanceHeaderAria(tableId, table, config);
      }
    });

    // Search event - announce search results
    table.on('search', function() {
      if (config.announceSearch !== false) {
        const searchTerm = table.search();
        const info = table.page.info();
        
        if (searchTerm) {
          announce(tableId, `Search results: ${info.recordsDisplay} rows found for "${searchTerm}"`, 'polite');
        }
      }
    });

    // Page event - announce page changes
    table.on('page', function() {
      if (config.announcePage !== false) {
        const info = table.page.info();
        const currentPage = info.page + 1;
        const totalPages = info.pages;
        
        announce(tableId, `Page ${currentPage} of ${totalPages}`, 'polite');
      }
    });

    // Length event - announce page length changes
    table.on('length', function(e, settings, len) {
      if (config.announceLength !== false) {
        announce(tableId, `Showing ${len} rows per page`, 'polite');
      }
    });

    // Cell click - announce cell position and content
    if (config.announceCellClick) {
      $(tableNode).on('click', 'td', function() {
        const cell = table.cell(this);
        const rowData = cell.data();
        const columnName = table.column(cell.index().column).header().textContent.trim();
        const rowIndex = cell.index().row + 1;
        
        announce(tableId, `${columnName}, row ${rowIndex}: ${rowData}`, 'polite');
      });
    }
  }

  /**
   * Announce message to screen readers
   * @param {string} tableId - Table identifier
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  const announce = (tableId, message, priority = 'polite') => {
    const regions = liveRegions.get(tableId);
    if (!regions) return;

    const region = priority === 'assertive' ? regions.assertive : regions.polite;
    
    // Clear previous message
    region.textContent = '';
    
    // Set new message after brief delay to ensure screen reader picks it up
    setTimeout(() => {
      region.textContent = message;
      
      // Clear after announcement to avoid repetition
      setTimeout(() => {
        region.textContent = '';
      }, 2000);
    }, 100);
  }

  /**
   * Announce row selection changes
   */
  const announceRowSelection = (tableId, selectedCount, totalCount) => {
    const config = ariaConfigs.get(tableId);
    if (!config || config.announceSelection === false) return;

    const message = selectedCount === 0 
      ? 'All rows deselected'
      : `${selectedCount} of ${totalCount} rows selected`;
    
    announce(tableId, message, 'polite');
  }

  /**
   * Announce filter changes
   */
  const announceFilter = (tableId, filterName, filterValue) => {
    const config = ariaConfigs.get(tableId);
    if (!config || config.announceFilter === false) return;

    const message = filterValue 
      ? `Filter applied: ${filterName} equals ${filterValue}`
      : `Filter cleared: ${filterName}`;
    
    announce(tableId, message, 'polite');
  }

  /**
   * Announce data changes (edit, delete, add)
   */
  const announceDataChange = (tableId, action, details) => {
    const config = ariaConfigs.get(tableId);
    if (!config || config.announceDataChange === false) return;

    let message = '';
    switch(action) {
      case 'edit':
        message = `Row updated: ${details}`;
        break;
      case 'delete':
        message = `Row deleted: ${details}`;
        break;
      case 'add':
        message = `Row added: ${details}`;
        break;
      default:
        message = `Table data updated`;
    }
    
    announce(tableId, message, 'polite');
  }

  /**
   * Get ARIA configuration for a table
   */
  const getConfig = (tableId) => {
    return ariaConfigs.get(tableId);
  }

  /**
   * Update ARIA configuration
   */
  const updateConfig = (tableId, newConfig) => {
    const currentConfig = ariaConfigs.get(tableId) || {};
    ariaConfigs.set(tableId, { ...currentConfig, ...newConfig });
  }

  /**
   * Destroy ARIA enhancements
   */
  const destroy = (tableId) => {
    const regions = liveRegions.get(tableId);
    if (regions) {
      regions.polite?.remove();
      regions.assertive?.remove();
      liveRegions.delete(tableId);
    }
    
    ariaConfigs.delete(tableId);
    console.log(`[ARIA] Destroyed for table: ${tableId}`);
  }

// Public API
const DataTableAria = {
  initialize: initializeAria,
  announce: announce,
  announceRowSelection: announceRowSelection,
  announceFilter: announceFilter,
  announceDataChange: announceDataChange,
  getConfig: getConfig,
  updateConfig: updateConfig,
  destroy: destroy
};

export { DataTableAria };
export default DataTableAria;

console.log('[ARIA] Module loaded');

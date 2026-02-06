/**
 * File: table-feature-search.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-18 12:24:02
 * 
 * Advanced Table Search System
 * 
 * Provides enhanced search capabilities including regex, operators, column-specific search,
 * search history, and result highlighting.
 * 
 * Usage:
 *   Include in view after table-init.js
 *   Configure via searchConfig parameter
 * 
 * Namespace: customHandlers.search.*
 */

'use strict';

import { customHandlers } from '../core/table-custom-handlers.js';

// Store search configurations per table
const searchConfigs = {};
  
  // Search history (max 20 items)
  const MAX_HISTORY = 20;
  let searchHistory = [];

  /**
   * Initialize advanced search for a table
   */
  function initializeSearch(tableId, table, config) {
    searchState[tableId] = {
      table: table,
      config: config || {},
      mode: 'simple', // simple, regex, advanced
      currentQuery: '',
      columnSearches: {},
      highlightEnabled: config.highlightResults !== false
    };

    // Load search history from localStorage
    loadSearchHistory();

    // Create advanced search UI
    createSearchUI(tableId);

    // Attach event handlers
    attachEventHandlers(tableId);

    // Override default search if regex mode enabled
    if (config.enableRegex) {
      enableRegexSearch(tableId);
    }
  }

  /**
   * Create advanced search UI
   */
  function createSearchUI(tableId) {
    const state = searchState[tableId];
    const $table = jQuery('#' + tableId);
    const $wrapper = $table.closest('.dataTables_wrapper');
    
    // Find the default search input
    const $defaultSearch = $wrapper.find('.dataTables_filter input');
    
    if ($defaultSearch.length === 0) return;

    // Add advanced search button next to search input
    const $searchContainer = $defaultSearch.parent();
    
    const advancedSearchBtn = `
      <button type="button" class="btn btn-sm btn-outline-primary ms-2 advanced-search-toggle" 
              data-table-id="${tableId}" title="Advanced Search">
        <i class="bi bi-search"></i> Advanced
      </button>
    `;
    
    $searchContainer.append(advancedSearchBtn);

    // Create advanced search modal
    createAdvancedSearchModal(tableId);
  }

  /**
   * Create advanced search modal
   */
  function createAdvancedSearchModal(tableId) {
    const state = searchState[tableId];
    const table = state.table;
    const columns = table.settings()[0].aoColumns;
    
    // Build column options for column-specific search
    let columnOptions = '';
    columns.forEach((col, index) => {
      if (col.bSearchable && col.sTitle && col.sTitle !== 'Actions') {
        columnOptions += `<option value="${index}">${col.sTitle}</option>`;
      }
    });

    const modalHtml = `
      <div class="modal fade" id="advancedSearchModal-${tableId}" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Advanced Search</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              
              <!-- Search Mode Tabs -->
              <ul class="nav nav-tabs mb-3" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#simpleSearch-${tableId}" 
                          type="button" role="tab">Simple</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" data-bs-toggle="tab" data-bs-target="#regexSearch-${tableId}" 
                          type="button" role="tab">Regular Expression</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" data-bs-toggle="tab" data-bs-target="#operatorSearch-${tableId}" 
                          type="button" role="tab">Operators (AND/OR/NOT)</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" data-bs-toggle="tab" data-bs-target="#columnSearch-${tableId}" 
                          type="button" role="tab">Column-Specific</button>
                </li>
              </ul>

              <!-- Tab Contents -->
              <div class="tab-content">
                
                <!-- Simple Search -->
                <div class="tab-pane fade show active" id="simpleSearch-${tableId}" role="tabpanel">
                  <div class="mb-3">
                    <label class="form-label">Search Term</label>
                    <input type="text" class="form-control search-input-simple" 
                           placeholder="Enter search term..." data-table-id="${tableId}">
                    <small class="form-text text-muted">Case-insensitive search across all columns</small>
                  </div>
                </div>

                <!-- Regex Search -->
                <div class="tab-pane fade" id="regexSearch-${tableId}" role="tabpanel">
                  <div class="mb-3">
                    <label class="form-label">Regular Expression</label>
                    <input type="text" class="form-control search-input-regex font-monospace" 
                           placeholder="^[A-Z].*error.*$" data-table-id="${tableId}">
                    <small class="form-text text-muted">JavaScript regex syntax. Examples: ^start, end$, \\d+, (option1|option2)</small>
                  </div>
                  <div class="form-check mb-2">
                    <input class="form-check-input regex-case-sensitive" type="checkbox" id="regexCase-${tableId}">
                    <label class="form-check-label" for="regexCase-${tableId}">Case sensitive</label>
                  </div>
                  <div class="regex-error text-danger small d-none"></div>
                </div>

                <!-- Operator Search -->
                <div class="tab-pane fade" id="operatorSearch-${tableId}" role="tabpanel">
                  <div class="mb-3">
                    <label class="form-label">Search Expression</label>
                    <input type="text" class="form-control search-input-operator" 
                           placeholder="error AND (production OR staging) NOT resolved" data-table-id="${tableId}">
                    <small class="form-text text-muted">
                      Use <strong>AND</strong>, <strong>OR</strong>, <strong>NOT</strong> operators with parentheses for grouping
                    </small>
                  </div>
                  <div class="mb-2">
                    <strong>Examples:</strong>
                    <ul class="small mb-0">
                      <li><code>error AND critical</code> - Both terms must be present</li>
                      <li><code>error OR warning</code> - Either term present</li>
                      <li><code>error NOT resolved</code> - Has "error" but not "resolved"</li>
                      <li><code>(error OR warning) AND production</code> - Complex logic</li>
                    </ul>
                  </div>
                </div>

                <!-- Column-Specific Search -->
                <div class="tab-pane fade" id="columnSearch-${tableId}" role="tabpanel">
                  <div id="columnSearchContainer-${tableId}">
                    <div class="column-search-row mb-2">
                      <div class="row g-2">
                        <div class="col-md-4">
                          <select class="form-select column-select">
                            <option value="">All Columns</option>
                            ${columnOptions}
                          </select>
                        </div>
                        <div class="col-md-6">
                          <input type="text" class="form-control column-search-input" 
                                 placeholder="Search term...">
                        </div>
                        <div class="col-md-2">
                          <button type="button" class="btn btn-outline-danger btn-sm remove-column-search" disabled>
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline-secondary add-column-search" data-table-id="${tableId}">
                    <i class="bi bi-plus-circle"></i> Add Column Search
                  </button>
                </div>

              </div>

              <!-- Search History -->
              <div class="mt-4">
                <h6>Recent Searches</h6>
                <div class="search-history-container" data-table-id="${tableId}">
                  <small class="text-muted">No recent searches</small>
                </div>
              </div>

              <!-- Highlight Option -->
              <div class="mt-3">
                <div class="form-check">
                  <input class="form-check-input highlight-results-check" type="checkbox" 
                         id="highlightResults-${tableId}" ${state.highlightEnabled ? 'checked' : ''}>
                  <label class="form-check-label" for="highlightResults-${tableId}">
                    Highlight search results in table
                  </label>
                </div>
              </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-outline-warning clear-search-btn" data-table-id="${tableId}">
                Clear Search
              </button>
              <button type="button" class="btn btn-primary apply-search-btn" data-table-id="${tableId}">
                Apply Search
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    jQuery('body').append(modalHtml);
    
    // Render search history
    renderSearchHistory(tableId);
  }

  /**
   * Attach event handlers
   */
  function attachEventHandlers(tableId) {
    // Advanced search button
    jQuery(document).on('click', `.advanced-search-toggle[data-table-id="${tableId}"]`, function() {
      const modal = new window.bootstrap.Modal(document.getElementById(`advancedSearchModal-${tableId}`));
      modal.show();
    });

    // Apply search button
    jQuery(document).on('click', `.apply-search-btn[data-table-id="${tableId}"]`, function() {
      applySearch(tableId);
    });

    // Clear search button
    jQuery(document).on('click', `.clear-search-btn[data-table-id="${tableId}"]`, function() {
      clearSearch(tableId);
    });

    // Enter key in search inputs
    jQuery(document).on('keypress', `#advancedSearchModal-${tableId} input`, function(e) {
      if (e.which === 13) {
        e.preventDefault();
        applySearch(tableId);
      }
    });

    // Add column search row
    jQuery(document).on('click', `.add-column-search[data-table-id="${tableId}"]`, function() {
      addColumnSearchRow(tableId);
    });

    // Remove column search row
    jQuery(document).on('click', `#columnSearchContainer-${tableId} .remove-column-search`, function() {
      jQuery(this).closest('.column-search-row').remove();
    });

    // Enable remove button when row is not empty
    jQuery(document).on('input', `#columnSearchContainer-${tableId} .column-search-input`, function() {
      const $row = jQuery(this).closest('.column-search-row');
      const hasValue = jQuery(this).val().trim() !== '';
      $row.find('.remove-column-search').prop('disabled', !hasValue);
    });

    // Highlight toggle
    jQuery(document).on('change', `.highlight-results-check`, function() {
      const state = searchState[tableId];
      state.highlightEnabled = jQuery(this).is(':checked');
      
      if (state.currentQuery) {
        highlightResults(tableId, state.currentQuery);
      }
    });

    // Search history click
    jQuery(document).on('click', `.search-history-item[data-table-id="${tableId}"]`, function() {
      const query = jQuery(this).data('query');
      const mode = jQuery(this).data('mode');
      
      // Set active tab and populate input
      jQuery(`#advancedSearchModal-${tableId} .nav-link`).removeClass('active');
      jQuery(`#advancedSearchModal-${tableId} .tab-pane`).removeClass('show active');
      
      if (mode === 'regex') {
        jQuery(`button[data-bs-target="#regexSearch-${tableId}"]`).addClass('active');
        jQuery(`#regexSearch-${tableId}`).addClass('show active');
        jQuery(`#regexSearch-${tableId} .search-input-regex`).val(query);
      } else if (mode === 'operator') {
        jQuery(`button[data-bs-target="#operatorSearch-${tableId}"]`).addClass('active');
        jQuery(`#operatorSearch-${tableId}`).addClass('show active');
        jQuery(`#operatorSearch-${tableId} .search-input-operator`).val(query);
      } else {
        jQuery(`button[data-bs-target="#simpleSearch-${tableId}"]`).addClass('active');
        jQuery(`#simpleSearch-${tableId}`).addClass('show active');
        jQuery(`#simpleSearch-${tableId} .search-input-simple`).val(query);
      }
    });
  }

  /**
   * Apply search based on active tab
   */
  function applySearch(tableId) {
    const state = searchState[tableId];
    const $modal = jQuery(`#advancedSearchModal-${tableId}`);
    const $activeTab = $modal.find('.tab-pane.active');
    const tabId = $activeTab.attr('id');

    let searchQuery = '';
    let searchMode = 'simple';

    if (tabId === `simpleSearch-${tableId}`) {
      searchQuery = $activeTab.find('.search-input-simple').val().trim();
      searchMode = 'simple';
      performSimpleSearch(tableId, searchQuery);
    } else if (tabId === `regexSearch-${tableId}`) {
      searchQuery = $activeTab.find('.search-input-regex').val().trim();
      const caseSensitive = $activeTab.find('.regex-case-sensitive').is(':checked');
      searchMode = 'regex';
      performRegexSearch(tableId, searchQuery, caseSensitive);
    } else if (tabId === `operatorSearch-${tableId}`) {
      searchQuery = $activeTab.find('.search-input-operator').val().trim();
      searchMode = 'operator';
      performOperatorSearch(tableId, searchQuery);
    } else if (tabId === `columnSearch-${tableId}`) {
      performColumnSearch(tableId);
      searchQuery = 'column-specific';
      searchMode = 'column';
    }

    if (searchQuery) {
      addToSearchHistory(searchQuery, searchMode);
      renderSearchHistory(tableId);
    }

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById(`advancedSearchModal-${tableId}`)).hide();
  }

  /**
   * Perform simple search
   */
  function performSimpleSearch(tableId, query) {
    const state = searchState[tableId];
    state.table.search(query).draw();
    state.currentQuery = query;
    state.mode = 'simple';
    
    if (state.highlightEnabled && query) {
      setTimeout(() => highlightResults(tableId, query), 100);
    }
  }

  /**
   * Perform regex search
   */
  function performRegexSearch(tableId, pattern, caseSensitive) {
    const state = searchState[tableId];
    const $errorDiv = jQuery(`#regexSearch-${tableId} .regex-error`);
    
    try {
      // Validate regex
      const flags = caseSensitive ? 'g' : 'gi';
      new RegExp(pattern, flags);
      
      // Apply regex search
      state.table.search(pattern, true, false, !caseSensitive).draw();
      state.currentQuery = pattern;
      state.mode = 'regex';
      
      $errorDiv.addClass('d-none');
      
      if (state.highlightEnabled && pattern) {
        setTimeout(() => highlightResults(tableId, pattern, true), 100);
      }
    } catch (e) {
      $errorDiv.text('Invalid regular expression: ' + e.message).removeClass('d-none');
    }
  }

  /**
   * Perform operator search (AND/OR/NOT)
   */
  function performOperatorSearch(tableId, expression) {
    const state = searchState[tableId];
    
    // Parse expression into custom search function
    jQuery.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData, counter) {
      if (settings.nTable.id !== tableId) return true;
      
      const rowText = searchData.join(' ').toLowerCase();
      return evaluateSearchExpression(expression.toLowerCase(), rowText);
    });
    
    state.table.draw();
    state.currentQuery = expression;
    state.mode = 'operator';
    
    if (state.highlightEnabled && expression) {
      setTimeout(() => highlightOperatorResults(tableId, expression), 100);
    }
  }

  /**
   * Evaluate search expression with operators
   */
  function evaluateSearchExpression(expression, rowText) {
    // Handle parentheses first
    while (expression.includes('(')) {
      const start = expression.lastIndexOf('(');
      const end = expression.indexOf(')', start);
      if (end === -1) return true; // Invalid expression
      
      const inner = expression.substring(start + 1, end);
      const result = evaluateSearchExpression(inner, rowText);
      expression = expression.substring(0, start) + (result ? 'TRUE' : 'FALSE') + expression.substring(end + 1);
    }
    
    // Handle NOT operator
    if (expression.includes(' not ')) {
      const parts = expression.split(' not ');
      const leftResult = evaluateSearchExpression(parts[0].trim(), rowText);
      const rightContained = rowText.includes(parts[1].trim());
      return leftResult && !rightContained;
    }
    
    // Handle OR operator
    if (expression.includes(' or ')) {
      return expression.split(' or ').some(part => evaluateSearchExpression(part.trim(), rowText));
    }
    
    // Handle AND operator
    if (expression.includes(' and ')) {
      return expression.split(' and ').every(part => evaluateSearchExpression(part.trim(), rowText));
    }
    
    // Base case: simple term or TRUE/FALSE
    if (expression === 'true') return true;
    if (expression === 'false') return false;
    return rowText.includes(expression.trim());
  }

  /**
   * Perform column-specific search
   */
  function performColumnSearch(tableId) {
    const state = searchState[tableId];
    const $container = jQuery(`#columnSearchContainer-${tableId}`);
    
    // Clear existing column searches
    state.columnSearches = {};
    state.table.columns().search('');
    
    // Apply each column search
    $container.find('.column-search-row').each(function() {
      const columnIndex = jQuery(this).find('.column-select').val();
      const searchTerm = jQuery(this).find('.column-search-input').val().trim();
      
      if (columnIndex && searchTerm) {
        state.table.column(columnIndex).search(searchTerm);
        state.columnSearches[columnIndex] = searchTerm;
      }
    });
    
    state.table.draw();
    state.mode = 'column';
    
    if (state.highlightEnabled) {
      setTimeout(() => highlightColumnResults(tableId), 100);
    }
  }

  /**
   * Add column search row
   */
  function addColumnSearchRow(tableId) {
    const state = searchState[tableId];
    const table = state.table;
    const columns = table.settings()[0].aoColumns;
    
    let columnOptions = '';
    columns.forEach((col, index) => {
      if (col.bSearchable && col.sTitle && col.sTitle !== 'Actions') {
        columnOptions += `<option value="${index}">${col.sTitle}</option>`;
      }
    });
    
    const rowHtml = `
      <div class="column-search-row mb-2">
        <div class="row g-2">
          <div class="col-md-4">
            <select class="form-select column-select">
              <option value="">Select Column</option>
              ${columnOptions}
            </select>
          </div>
          <div class="col-md-6">
            <input type="text" class="form-control column-search-input" 
                   placeholder="Search term...">
          </div>
          <div class="col-md-2">
            <button type="button" class="btn btn-outline-danger btn-sm remove-column-search" disabled>
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    jQuery(`#columnSearchContainer-${tableId}`).append(rowHtml);
  }

  /**
   * Clear search
   */
  function clearSearch(tableId) {
    const state = searchState[tableId];
    
    // Clear DataTables search
    state.table.search('').columns().search('').draw();
    
    // Clear custom search functions
    jQuery.fn.dataTable.ext.search = jQuery.fn.dataTable.ext.search.filter(function(fn) {
      return fn.toString().indexOf(tableId) === -1;
    });
    
    // Clear state
    state.currentQuery = '';
    state.mode = 'simple';
    state.columnSearches = {};
    
    // Clear highlights
    clearHighlights(tableId);
    
    // Clear modal inputs
    jQuery(`#advancedSearchModal-${tableId} input[type="text"]`).val('');
    jQuery(`#advancedSearchModal-${tableId} .regex-case-sensitive`).prop('checked', false);
    
    // Reset to simple tab
    jQuery(`#advancedSearchModal-${tableId} .nav-link`).removeClass('active').first().addClass('active');
    jQuery(`#advancedSearchModal-${tableId} .tab-pane`).removeClass('show active').first().addClass('show active');
    
    // Close modal
    const modalElement = document.getElementById(`advancedSearchModal-${tableId}`);
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  /**
   * Highlight search results
   */
  function highlightResults(tableId, query, isRegex = false) {
    if (!query) return;
    
    clearHighlights(tableId);
    
    const $table = jQuery('#' + tableId);
    const $cells = $table.find('tbody td');
    
    if (isRegex) {
      try {
        const regex = new RegExp('(' + query + ')', 'gi');
        $cells.each(function() {
          const $cell = jQuery(this);
          const text = $cell.text();
          if (regex.test(text)) {
            const highlighted = text.replace(regex, '<mark class="search-highlight">$1</mark>');
            $cell.html(highlighted);
          }
        });
      } catch (e) {
        console.warn('Cannot highlight regex:', e);
      }
    } else {
      // Simple text highlighting
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp('(' + escapedQuery + ')', 'gi');
      
      $cells.each(function() {
        const $cell = jQuery(this);
        const text = $cell.text();
        if (regex.test(text)) {
          const highlighted = text.replace(regex, '<mark class="search-highlight">$1</mark>');
          $cell.html(highlighted);
        }
      });
    }
  }

  /**
   * Highlight operator search results
   */
  function highlightOperatorResults(tableId, expression) {
    // Extract individual terms from expression
    const terms = expression.toLowerCase()
      .replace(/\(|\)/g, '')
      .split(/\s+(?:and|or|not)\s+/)
      .filter(t => t.trim() && t !== 'and' && t !== 'or' && t !== 'not');
    
    clearHighlights(tableId);
    
    const $table = jQuery('#' + tableId);
    const $cells = $table.find('tbody td');
    
    terms.forEach(term => {
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp('(' + escapedTerm + ')', 'gi');
      
      $cells.each(function() {
        const $cell = jQuery(this);
        let html = $cell.html();
        if (regex.test($cell.text())) {
          html = html.replace(regex, '<mark class="search-highlight">$1</mark>');
          $cell.html(html);
        }
      });
    });
  }

  /**
   * Highlight column-specific results
   */
  function highlightColumnResults(tableId) {
    const state = searchState[tableId];
    clearHighlights(tableId);
    
    const $table = jQuery('#' + tableId);
    
    Object.entries(state.columnSearches).forEach(([columnIndex, query]) => {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp('(' + escapedQuery + ')', 'gi');
      
      $table.find('tbody tr').each(function() {
        const $cell = jQuery(this).find('td').eq(columnIndex);
        const text = $cell.text();
        if (regex.test(text)) {
          const highlighted = text.replace(regex, '<mark class="search-highlight">$1</mark>');
          $cell.html(highlighted);
        }
      });
    });
  }

  /**
   * Clear highlights
   */
  function clearHighlights(tableId) {
    const $table = jQuery('#' + tableId);
    $table.find('.search-highlight').each(function() {
      const $mark = jQuery(this);
      $mark.replaceWith($mark.text());
    });
  }

  /**
   * Load search history from localStorage
   */
  function loadSearchHistory() {
    try {
      const stored = localStorage.getItem('datatableSearchHistory');
      if (stored) {
        searchHistory = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load search history:', e);
    }
  }

  /**
   * Save search history to localStorage
   */
  function saveSearchHistory() {
    try {
      localStorage.setItem('datatableSearchHistory', JSON.stringify(searchHistory));
    } catch (e) {
      console.warn('Failed to save search history:', e);
    }
  }

  /**
   * Add to search history
   */
  function addToSearchHistory(query, mode) {
    // Remove duplicates
    searchHistory = searchHistory.filter(item => !(item.query === query && item.mode === mode));
    
    // Add to beginning
    searchHistory.unshift({
      query: query,
      mode: mode,
      timestamp: new Date().toISOString()
    });
    
    // Limit to MAX_HISTORY
    if (searchHistory.length > MAX_HISTORY) {
      searchHistory = searchHistory.slice(0, MAX_HISTORY);
    }
    
    saveSearchHistory();
  }

  /**
   * Render search history
   */
  function renderSearchHistory(tableId) {
    const $container = jQuery(`.search-history-container[data-table-id="${tableId}"]`);
    
    if (searchHistory.length === 0) {
      $container.html('<small class="text-muted">No recent searches</small>');
      return;
    }
    
    let html = '<div class="list-group list-group-flush">';
    searchHistory.slice(0, 10).forEach(item => {
      const modeLabel = item.mode === 'regex' ? 'Regex' : 
                       item.mode === 'operator' ? 'Operator' : 
                       item.mode === 'column' ? 'Column' : 'Simple';
      
      html += `
        <a href="#" class="list-group-item list-group-item-action small search-history-item" 
           data-table-id="${tableId}" data-query="${item.query}" data-mode="${item.mode}">
          <div class="d-flex w-100 justify-content-between">
            <span class="text-truncate" style="max-width: 400px;">${item.query}</span>
            <small class="text-muted">${modeLabel}</small>
          </div>
        </a>
      `;
    });
    html += '</div>';
    
    $container.html(html);
  }

  /**
   * Enable regex search for default search box
   */
  function enableRegexSearch(tableId) {
    const state = searchState[tableId];
    const $table = jQuery('#' + tableId);
    const $wrapper = $table.closest('.dataTables_wrapper');
    const $defaultSearch = $wrapper.find('.dataTables_filter input');
    
    // Add regex toggle checkbox
    const $filterDiv = $wrapper.find('.dataTables_filter');
    $filterDiv.append(`
      <div class="form-check form-check-inline ms-2">
        <input class="form-check-input" type="checkbox" id="regexToggle-${tableId}">
        <label class="form-check-label small" for="regexToggle-${tableId}">Regex</label>
      </div>
    `);
    
    // Override search behavior
    $defaultSearch.off('keyup.DT search.DT input.DT paste.DT cut.DT');
    
    $defaultSearch.on('keyup', function() {
      const query = jQuery(this).val();
      const isRegex = jQuery(`#regexToggle-${tableId}`).is(':checked');
      
      if (isRegex) {
        try {
          state.table.search(query, true, false).draw();
        } catch (e) {
          console.warn('Invalid regex:', e);
        }
      } else {
        state.table.search(query).draw();
      }
    });
  }

// Export public API
export {
  initializeSearch,
  clearSearch,
  highlightResults,
  clearHighlights,
  applySearch,
  performSimpleSearch
};

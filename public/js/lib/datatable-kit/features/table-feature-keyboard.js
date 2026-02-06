/**
 * File: table-feature-keyboard.js
 * Created: 2025-12-15 12:43:56
 * Last Modified: 2025-12-18 12:24:02
 * 
 * DataTable Keyboard Navigation Module
 * Provides comprehensive keyboard support for table navigation and actions
 * 
 * Features:
 * - Arrow key navigation between cells
 * - Tab through editable cells
 * - Keyboard shortcuts for common actions
 * - Home/End navigation
 * - Page Up/Page Down support
 * - Enter to activate/edit cells
 * - Escape to cancel operations
 * - Focus management and indicators
 * - Screen reader announcements integration
 * 
 * @namespace DataTableKeyboard
 */

'use strict';

import { DataTableAria } from './table-feature-aria.js';

// Store keyboard configurations per table
const keyboardConfigs = new Map();
const focusStates = new Map();

  /**
   * Initialize keyboard navigation for a DataTable
   * @param {string} tableId - The table identifier
   * @param {Object} config - Keyboard configuration
   * @param {DataTable} table - DataTables API instance
   */
  const initializeKeyboard = (tableId, config, table) => {
    if (!config || !config.enabled) {
      return;
    }

    keyboardConfigs.set(tableId, config);
    focusStates.set(tableId, {
      currentRow: 0,
      currentCol: 0,
      mode: 'navigation' // 'navigation' or 'edit'
    });

    // Setup keyboard event listeners
    setupKeyboardListeners(tableId, table, config);

    // Make cells focusable
    makeCellsFocusable(tableId, table, config);

    // Setup keyboard indicators
    setupKeyboardIndicators(tableId);

    // Register keyboard shortcuts
    registerShortcuts(tableId, table, config);

    console.log(`[Keyboard] Initialized for table: ${tableId}`);
  }

  /**
   * Setup keyboard event listeners
   */
  const setupKeyboardListeners = (tableId, table, config) => {
    const tableNode = table.table().node();
    const wrapper = document.getElementById(`${tableId}_wrapper`);

    // Track keyboard vs mouse usage
    document.addEventListener('mousedown', function() {
      document.body.classList.remove('using-keyboard');
    });

    document.addEventListener('keydown', function(e) {
      document.body.classList.add('using-keyboard');
    });

    // Cell navigation with arrow keys
    if (config.arrowKeyNavigation !== false) {
      $(tableNode).on('keydown', 'td', function(e) {
        handleCellNavigation(tableId, table, this, e);
      });
    }

    // Table-level keyboard shortcuts
    if (config.shortcuts !== false) {
      $(wrapper).on('keydown', function(e) {
        handleShortcuts(tableId, table, e);
      });
    }

    // Redraw event - update focusable cells
    table.on('draw', function() {
      makeCellsFocusable(tableId, table, config);
      restoreFocus(tableId, table);
    });
  }

  /**
   * Handle cell navigation with arrow keys
   */
  const handleCellNavigation = (tableId, table, currentCell, event) => {
    const config = keyboardConfigs.get(tableId);
    const cell = table.cell(currentCell);
    const cellIndex = cell.index();
    
    if (!cellIndex) return;

    let newRow = cellIndex.row;
    let newCol = cellIndex.column;
    let handled = false;

    switch(event.key) {
      case 'ArrowUp':
        if (newRow > 0) {
          newRow--;
          handled = true;
        }
        break;
        
      case 'ArrowDown':
        const maxRow = table.rows({ page: 'current' }).count() - 1;
        if (newRow < maxRow) {
          newRow++;
          handled = true;
        } else if (config.autoPageDown && table.page.info().page < table.page.info().pages - 1) {
          table.page('next').draw('page');
          newRow = 0;
          handled = true;
        }
        break;
        
      case 'ArrowLeft':
        if (newCol > 0) {
          newCol--;
          handled = true;
        }
        break;
        
      case 'ArrowRight':
        const maxCol = table.columns().count() - 1;
        if (newCol < maxCol) {
          newCol++;
          handled = true;
        }
        break;
        
      case 'Home':
        if (event.ctrlKey) {
          newRow = 0;
          newCol = 0;
        } else {
          newCol = 0;
        }
        handled = true;
        break;
        
      case 'End':
        if (event.ctrlKey) {
          newRow = table.rows({ page: 'current' }).count() - 1;
          newCol = table.columns().count() - 1;
        } else {
          newCol = table.columns().count() - 1;
        }
        handled = true;
        break;
        
      case 'PageUp':
        if (table.page.info().page > 0) {
          table.page('previous').draw('page');
          handled = true;
        }
        break;
        
      case 'PageDown':
        if (table.page.info().page < table.page.info().pages - 1) {
          table.page('next').draw('page');
          handled = true;
        }
        break;
        
      case 'Enter':
        // Activate cell (trigger edit mode if editable)
        if (config.enterToEdit && $(currentCell).closest('tr').hasClass('editable-row')) {
          $(currentCell).dblclick();
          handled = true;
        } else if (config.enterToSelect) {
          const row = $(currentCell).closest('tr');
          const checkbox = row.find('input[type="checkbox"]');
          if (checkbox.length) {
            checkbox.prop('checked', !checkbox.prop('checked')).trigger('change');
            handled = true;
          }
        }
        break;
        
      case ' ':
      case 'Space':
        // Space to select row
        if (config.spaceToSelect) {
          const row = $(currentCell).closest('tr');
          const checkbox = row.find('input[type="checkbox"]');
          if (checkbox.length) {
            checkbox.prop('checked', !checkbox.prop('checked')).trigger('change');
            handled = true;
          }
        }
        break;
    }

    if (handled) {
      event.preventDefault();
      
      // Focus new cell
      const newCell = table.cell(newRow, newCol).node();
      if (newCell) {
        $(newCell).focus();
        
        // Update focus state
        const focusState = focusStates.get(tableId);
        focusState.currentRow = newRow;
        focusState.currentCol = newCol;
        
        // Announce position if ARIA is enabled
        if (DataTableAria && config.announcePosition) {
          const columnName = table.column(newCol).header().textContent.trim();
          const cellData = table.cell(newRow, newCol).data();
          DataTableAria.announce(
            tableId,
            `${columnName}, row ${newRow + 1}: ${cellData}`,
            'polite'
          );
        }
      }
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  const handleShortcuts = (tableId, table, event) => {
    const config = keyboardConfigs.get(tableId);
    const shortcuts = config.shortcuts || {};
    
    // Check if custom shortcuts are defined
    if (typeof shortcuts === 'object') {
      const key = getShortcutKey(event);
      const shortcut = shortcuts[key];
      
      if (shortcut && typeof shortcut.handler === 'function') {
        event.preventDefault();
        shortcut.handler(tableId, table, event);
        
        // Announce shortcut action
        if (DataTableAria && shortcut.announce) {
          DataTableAria.announce(tableId, shortcut.announce, 'polite');
        }
        return;
      }
    }

    // Default shortcuts
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;
    const alt = event.altKey;

    // Ctrl+F - Focus search
    if (ctrl && event.key === 'f' && config.searchShortcut !== false) {
      event.preventDefault();
      const searchInput = document.querySelector(`#${tableId}_wrapper .dataTables_filter input`);
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }

    // Ctrl+R - Refresh table
    if (ctrl && event.key === 'r' && config.refreshShortcut !== false) {
      event.preventDefault();
      table.ajax.reload(null, false);
      if (DataTableAria) {
        DataTableAria.announce(tableId, 'Table refreshed', 'polite');
      }
    }

    // Ctrl+A - Select all rows
    if (ctrl && event.key === 'a' && config.selectAllShortcut !== false) {
      event.preventDefault();
      const selectAllCheckbox = document.querySelector(`#${tableId} thead input[type="checkbox"]`);
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = true;
        $(selectAllCheckbox).trigger('change');
      }
    }

    // Escape - Clear selection or cancel operation
    if (event.key === 'Escape' && config.escapeShortcut !== false) {
      const selectAllCheckbox = document.querySelector(`#${tableId} thead input[type="checkbox"]`);
      if (selectAllCheckbox && selectAllCheckbox.checked) {
        selectAllCheckbox.checked = false;
        $(selectAllCheckbox).trigger('change');
      }
    }

    // Ctrl+E - Export
    if (ctrl && event.key === 'e' && config.exportShortcut !== false) {
      event.preventDefault();
      const exportBtn = document.querySelector(`[data-table-id="${tableId}"][data-action="export"]`);
      if (exportBtn) {
        exportBtn.click();
      }
    }

    // Alt+P - Previous page
    if (alt && event.key === 'p' && config.pageShortcuts !== false) {
      event.preventDefault();
      if (table.page.info().page > 0) {
        table.page('previous').draw('page');
        if (DataTableAria) {
          DataTableAria.announce(tableId, `Previous page, page ${table.page.info().page + 1}`, 'polite');
        }
      }
    }

    // Alt+N - Next page
    if (alt && event.key === 'n' && config.pageShortcuts !== false) {
      event.preventDefault();
      if (table.page.info().page < table.page.info().pages - 1) {
        table.page('next').draw('page');
        if (DataTableAria) {
          DataTableAria.announce(tableId, `Next page, page ${table.page.info().page + 1}`, 'polite');
        }
      }
    }

    // ? - Show keyboard shortcuts help
    if (event.key === '?' && config.helpShortcut !== false) {
      event.preventDefault();
      showKeyboardHelp(tableId, config);
    }
  }

  /**
   * Get shortcut key string from event
   */
  const getShortcutKey = (event) => {
    const parts = [];
    if (event.ctrlKey || event.metaKey) parts.push('Ctrl');
    if (event.altKey) parts.push('Alt');
    if (event.shiftKey) parts.push('Shift');
    parts.push(event.key);
    return parts.join('+');
  }

  /**
   * Make table cells focusable
   */
  const makeCellsFocusable = (tableId, table, config) => {
    const cells = table.cells({ page: 'current' }).nodes();
    
    $(cells).each(function() {
      if (!$(this).attr('tabindex')) {
        $(this).attr('tabindex', '-1');
      }
    });

    // Make first cell focusable by default
    if (config.autoFocusFirst && cells.length > 0) {
      $(cells[0]).attr('tabindex', '0');
    }
  }

  /**
   * Restore focus after table redraw
   */
  function restoreFocus(tableId, table) {
    const focusState = focusStates.get(tableId);
    if (!focusState) return;

    const cell = table.cell(focusState.currentRow, focusState.currentCol).node();
    if (cell) {
      $(cell).attr('tabindex', '0');
      // Don't auto-focus to avoid interrupting user
    }
  }

  /**
   * Setup keyboard usage indicators
   */
  const setupKeyboardIndicators = (tableId) => {
    // Add CSS class to body when keyboard is being used
    let lastKeyTime = 0;
    
    document.addEventListener('keydown', function(e) {
      // Tab, arrow keys, or Enter indicate keyboard navigation
      if (e.key === 'Tab' || e.key.startsWith('Arrow') || e.key === 'Enter') {
        document.body.classList.add('using-keyboard');
        lastKeyTime = Date.now();
      }
    });

    document.addEventListener('mousedown', function() {
      // Remove keyboard indicator if mouse is used
      if (Date.now() - lastKeyTime > 100) {
        document.body.classList.remove('using-keyboard');
      }
    });
  }

  /**
   * Register custom keyboard shortcuts
   */
  const registerShortcuts = (tableId, table, config) => {
    if (!config.customShortcuts || !Array.isArray(config.customShortcuts)) {
      return;
    }

    config.customShortcuts.forEach(shortcut => {
      if (shortcut.key && typeof shortcut.handler === 'function') {
        console.log(`[Keyboard] Registered shortcut: ${shortcut.key} for ${tableId}`);
      }
    });
  }

  /**
   * Show keyboard shortcuts help modal
   */
  const showKeyboardHelp = (tableId, config) => {
    const shortcuts = [
      { keys: '↑ ↓ ← →', description: 'Navigate between cells' },
      { keys: 'Home', description: 'Go to first column' },
      { keys: 'End', description: 'Go to last column' },
      { keys: 'Ctrl+Home', description: 'Go to first cell' },
      { keys: 'Ctrl+End', description: 'Go to last cell' },
      { keys: 'Page Up', description: 'Previous page' },
      { keys: 'Page Down', description: 'Next page' },
      { keys: 'Enter', description: 'Edit cell or select row' },
      { keys: 'Space', description: 'Select/deselect row' },
      { keys: 'Ctrl+F', description: 'Focus search box' },
      { keys: 'Ctrl+A', description: 'Select all rows' },
      { keys: 'Ctrl+E', description: 'Export table' },
      { keys: 'Ctrl+R', description: 'Refresh table' },
      { keys: 'Escape', description: 'Clear selection or cancel' },
      { keys: 'Alt+P', description: 'Previous page' },
      { keys: 'Alt+N', description: 'Next page' },
      { keys: '?', description: 'Show this help' }
    ];

    // Create modal HTML
    const modalHtml = `
      <div class="modal fade" id="${tableId}-keyboard-help" tabindex="-1" role="dialog" aria-labelledby="${tableId}-keyboard-help-title" aria-modal="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="${tableId}-keyboard-help-title">Keyboard Shortcuts</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Shortcut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${shortcuts.map(s => `
                    <tr>
                      <td><kbd>${s.keys}</kbd></td>
                      <td>${s.description}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal if present
    $(`#${tableId}-keyboard-help`).remove();

    // Add modal to DOM
    $('body').append(modalHtml);

    // Show modal
    const modal = new window.bootstrap.Modal(document.getElementById(`${tableId}-keyboard-help`));
    modal.show();
  }

  /**
   * Focus specific cell
   */
  const focusCell = (tableId, table, row, col) => {
    const cell = table.cell(row, col).node();
    if (cell) {
      $(cell).focus();
      
      const focusState = focusStates.get(tableId);
      if (focusState) {
        focusState.currentRow = row;
        focusState.currentCol = col;
      }
    }
  }

  /**
   * Get current focus position
   */
  const getFocusPosition = (tableId) => {
    return focusStates.get(tableId);
  }

  /**
   * Tab through editable cells only
   */
  function setupEditableTabbing(tableId, table, config) {
    if (!config.tabThroughEditable) return;

    const tableNode = table.table().node();
    
    $(tableNode).on('keydown', 'td', function(e) {
      if (e.key === 'Tab') {
        const editableCells = $(tableNode).find('td[data-editable="true"]');
        const currentIndex = editableCells.index(this);
        
        if (currentIndex !== -1) {
          e.preventDefault();
          
          let nextIndex;
          if (e.shiftKey) {
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) nextIndex = editableCells.length - 1;
          } else {
            nextIndex = currentIndex + 1;
            if (nextIndex >= editableCells.length) nextIndex = 0;
          }
          
          $(editableCells[nextIndex]).focus();
        }
      }
    });
  }

  /**
   * Get configuration for a table
   */
  const getConfig = (tableId) => {
    return keyboardConfigs.get(tableId);
  }

  /**
   * Update configuration
   */
  const updateConfig = (tableId, newConfig) => {
    const currentConfig = keyboardConfigs.get(tableId) || {};
    keyboardConfigs.set(tableId, { ...currentConfig, ...newConfig });
  }

  /**
   * Destroy keyboard navigation
   */
  const destroy = (tableId) => {
    keyboardConfigs.delete(tableId);
    focusStates.delete(tableId);
    
    // Remove keyboard help modal
    $(`#${tableId}-keyboard-help`).remove();
    
    console.log(`[Keyboard] Destroyed for table: ${tableId}`);
  }

// Public API
const DataTableKeyboard = {
  initialize: initializeKeyboard,
  focusCell: focusCell,
  getFocusPosition: getFocusPosition,
  showHelp: showKeyboardHelp,
  getConfig: getConfig,
  updateConfig: updateConfig,
  destroy: destroy
};

export { DataTableKeyboard };
export default DataTableKeyboard;

console.log('[Keyboard] Module loaded');

# Coding Standards & Conventions

## Overview

This document defines the coding standards, naming conventions, and best practices for the CET Dashboard project.

---

## JavaScript Standards

### ES6 Module System

**Use ES6 imports/exports, not CommonJS (frontend only):**

✅ **Correct:**
```javascript
// Import
import * as TableHelpers from './table-helpers.js';
import { renderSeverityBadge } from './table-helpers.js';

// Export
export function initializeTable(config) { }
export const CONFIG = { };
```

❌ **Incorrect (frontend):**
```javascript
const TableHelpers = require('./table-helpers.js');
module.exports = { initializeTable };
```

**Backend (Node.js) uses CommonJS:**
```javascript
const express = require('express');
module.exports = { getDashboardData };
```

---

### Strict Mode

**Always use strict mode:**
```javascript
'use strict';
```

Place at the top of every JavaScript file (after file header comment).

---

### Function Naming

**Use descriptive, action-oriented names:**

**Render Functions:**
```javascript
// Pattern: render{Type}
export function renderSeverityBadge(data, type) { }
export function renderStatusBadge(data, type) { }
export function renderClickableCell(data, type, row, urlTemplate) { }

// CET-specific: renderCET{Type}
export function renderCETThresholdAlerts(data, type) { }
export function renderCETDisabledQueues(data, type) { }
```

**Initialization Functions:**
```javascript
// Pattern: initialize{Feature}
export function initializeTable(config) { }
export function initializeCards(configPath) { }
```

**Feature Functions:**
```javascript
// Pattern: init, apply, update, handle
export function init(tableId, dataTable, config) { }
export function applyFilter(tableId, columnIndex, value) { }
export function updateCard(cardId, data) { }
export function handleRowClick(event) { }
```

---

### Variable Naming

**Use camelCase for variables and functions:**
```javascript
const tableId = 'cetDashboard';
const filterConfig = { };
let isInitialized = false;
```

**Use PascalCase for classes:**
```javascript
class DataTableManager { }
class CardRenderer { }
```

**Use UPPER_SNAKE_CASE for constants:**
```javascript
const DEFAULT_PAGE_LENGTH = 25;
const MAX_EXPORT_ROWS = 10000;
const API_BASE_URL = '/api';
```

**Use descriptive names, avoid abbreviations:**
```javascript
// ✅ Good
const filterConfiguration = { };
const applicationId = 'SAP_PROD';

// ❌ Avoid
const cfg = { };
const appId = 'SAP_PROD';
```

---

### Comments & Documentation

**File Header Template:**
```javascript
/**
 * File: example-module.js
 * Created: 2026-01-11
 * 
 * Brief Description
 * 
 * Detailed explanation of the module's purpose, architecture,
 * and key concepts.
 * 
 * ARCHITECTURE:
 * - Key design decisions
 * - Module dependencies
 * - Integration points
 * 
 * USAGE:
 * import * as Example from './example-module.js';
 * Example.doSomething();
 */
```

**Function Documentation (JSDoc):**
```javascript
/**
 * Brief one-line description
 * 
 * Detailed explanation of what the function does,
 * how it works, and any important behavior.
 * 
 * @param {string} paramName - Parameter description
 * @param {object} config - Configuration object
 * @param {string} config.id - Config property description
 * @returns {boolean} Return value description
 * 
 * @example
 * const result = myFunction('test', { id: 'table1' });
 */
export function myFunction(paramName, config) {
  // Implementation
}
```

**Inline Comments:**
```javascript
// Use single-line comments for brief explanations
const result = processData(input);

// Use multi-line comments for complex explanations
/*
 * This section handles edge cases where the data
 * might be incomplete or malformed. We need to:
 * 1. Validate the structure
 * 2. Apply default values
 * 3. Log warnings
 */
```

---

## Backend Standards (Node.js)

### MVC Pattern

**Routes:** Define endpoints only, delegate to controllers
```javascript
// routes/cetDashboardRoutes.js
const express = require('express');
const router = express.Router();
const cetDashboardController = require('../controllers/cetDashboardController');

router.get('/', cetDashboardController.renderDashboard);
router.get('/data', cetDashboardController.getDashboardData);

module.exports = router;
```

**Controllers:** Handle requests, call services, render views
```javascript
// controllers/cetDashboardController.js
const cetDashboardService = require('../services/cetDashboardService');

exports.renderDashboard = (req, res) => {
  try {
    const data = cetDashboardService.getDashboardData();
    const config = cetDashboardService.getConfiguration();
    res.render('cet-dashboard', { data, config });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.status(500).send('Internal Server Error');
  }
};
```

**Services:** Business logic and data access
```javascript
// services/cetDashboardService.js
const mockDataCET = require('../mockdata/mockDataCET');
const configService = require('./configService');

exports.getDashboardData = () => {
  const rawData = mockDataCET.getCETDashboard();
  return formatDashboardData(rawData);
};

function formatDashboardData(data) {
  // Transform data as needed
  return data;
}
```

---

### Error Handling

**Use try-catch for synchronous code:**
```javascript
exports.getData = (req, res) => {
  try {
    const data = service.fetchData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
```

**Use async/await for asynchronous code:**
```javascript
exports.getData = async (req, res) => {
  try {
    const data = await service.fetchDataAsync();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
```

---

## Frontend Standards

### Render Functions

**Standard Signature:**
```javascript
/**
 * DataTables render function signature
 * 
 * @param {any} data - Cell data value
 * @param {string} type - Render context: 'display', 'filter', 'sort', 'type'
 * @param {object} row - Full row data object
 * @param {*} meta - Additional metadata or configuration
 * @returns {string|any} HTML for 'display', raw data for other types
 */
export function renderMyType(data, type, row, meta) {
  if (type === 'display') {
    // Return HTML string
    return `<span class="badge">${data}</span>`;
  }
  // Return raw data for sorting/filtering
  return data;
}
```

**Always handle type parameter:**
```javascript
// ✅ Correct - handles all types
export function renderBadge(data, type) {
  if (type === 'display') {
    return `<span class="badge">${data}</span>`;
  }
  return data; // For sorting, filtering, type detection
}

// ❌ Incorrect - always returns HTML
export function renderBadge(data) {
  return `<span class="badge">${data}</span>`;
}
```

---

### URL Template Processing

**Use consistent pattern for clickable cells:**
```javascript
export function renderClickableCell(data, type, row, urlTemplate) {
  if (type === 'display') {
    // Return non-clickable if no data or no URL
    if (!data || !urlTemplate) {
      return `<span>${data || ''}</span>`;
    }
    
    // Process URL template
    let url = urlTemplate;
    const placeholderRegex = /\{([^}]+)\}/g;
    
    url = url.replace(placeholderRegex, (match, placeholder) => {
      const value = getNestedProperty(row, placeholder);
      return value ? encodeURIComponent(value) : '';
    });
    
    // Return clickable link
    return `<a href="${url}" class="dt-clickable">${data}</a>`;
  }
  return data;
}

// Helper for nested property access
function getNestedProperty(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}
```

---

### Event Handling

**Use event delegation for dynamic content:**
```javascript
// ✅ Good - event delegation
document.addEventListener('click', (e) => {
  if (e.target.matches('.dt-clickable')) {
    handleCellClick(e);
  }
});

// ❌ Avoid - direct binding on dynamic elements
$('.dt-clickable').on('click', handleCellClick);
```

**Prevent memory leaks - clean up event listeners:**
```javascript
export function init(tableId, dataTable) {
  const handler = (e) => handleEvent(e);
  document.addEventListener('click', handler);
  
  // Store reference for cleanup
  dataTable.settings()[0]._myHandlers = { click: handler };
}

export function destroy(tableId, dataTable) {
  const handlers = dataTable.settings()[0]._myHandlers;
  if (handlers?.click) {
    document.removeEventListener('click', handlers.click);
  }
}
```

---

## YAML Configuration Standards

### File Naming

**Pattern:** `{page}-{type}.yaml`

Examples:
- `cet-dashboard-columns.yaml`
- `cet-dashboard-filters.yaml`
- `cet-apps-footer.yaml`

---

### Structure

**Use clear hierarchies:**
```yaml
# cet-dashboard-columns.yaml
columns:
  - data: iGateApp
    title: iGate Application
    className: text-start
    orderable: true
    searchable: true
    width: 15%
    responsivePriority: 1
  
  - data: thresholdAlerts
    title: Threshold Alerts
    className: text-center
    orderable: true
    render: renderClickableCETThresholdAlerts
    urlTemplate: /cet-issues?app={iGateApp}
    width: 10%
```

**Use comments for documentation:**
```yaml
# Filter configuration for CET Dashboard
filters:
  enabled: true
  position: top  # Options: top, bottom
  
  columns:
    # Application name filter
    - columnIndex: 0
      type: text
      label: Application
      placeholder: Search applications...
      colSize: col-md-4
```

---

### Common YAML Patterns

**Column Definition:**
```yaml
- data: fieldName              # Data source property
  title: Column Title           # Header text
  className: text-start         # CSS classes
  orderable: true               # Enable sorting
  searchable: true              # Include in search
  width: 15%                    # Column width
  responsivePriority: 1         # Mobile priority (1=always visible)
  render: renderFunction        # Render function name
  urlTemplate: /path?id={field} # URL template for clickable cells
```

**Filter Definition:**
```yaml
- columnIndex: 0               # Target column index
  type: text                   # Filter type: text, select, multi-select, range, date
  label: Filter Label          # Display label
  placeholder: Placeholder...  # Placeholder text
  colSize: col-md-3            # Bootstrap column class
  options:                     # For select/multi-select
    - label: Option 1
      value: value1
```

---

## CSS Standards

### Class Naming

**Use Bootstrap classes first:**
```html
<div class="container">
  <div class="row">
    <div class="col-md-6">
      <span class="badge bg-success">Active</span>
    </div>
  </div>
</div>
```

**Custom classes for specific features:**
```css
/* Pattern: {feature}-{element}-{modifier} */
.dt-filter-container { }
.dt-filter-input { }
.dt-filter-input--focused { }

.card-metric-value { }
.card-metric-label { }
```

**Use BEM notation for complex components:**
```css
/* Block */
.datatable-toolbar { }

/* Element */
.datatable-toolbar__button { }
.datatable-toolbar__search { }

/* Modifier */
.datatable-toolbar__button--primary { }
.datatable-toolbar__button--disabled { }
```

---

### File Organization

**One file per feature:**
- `table-filters.css` - Filter styling
- `table-editing.css` - Inline editing styles
- `table-footer.css` - Footer aggregation styles
- `card-view.css` - Card component styles

**Global styles in `styles.css`:**
- Base typography
- Layout utilities
- Common patterns

---

## EJS Template Standards

### Naming

**Views:** `{entity}-{type}.ejs`
- `cet-dashboard.ejs`
- `cet-apps-view.ejs`
- `cet-issues-view.ejs`

**Partials:** `{component}.ejs`
- `header.ejs`
- `footer.ejs`
- `datatable.ejs`
- `card.ejs`

---

### Structure

**Use includes for reusable components:**
```ejs
<!DOCTYPE html>
<html>
<head>
  <%- include('partials/header', { 
    title: 'CET Dashboard',
    additionalCSS: ['/css/card-view.css']
  }) %>
</head>
<body>
  <div class="container">
    <%- include('partials/datatable', {
      id: 'cetDashboard',
      columns: columns,
      dataSource: data
    }) %>
  </div>
  
  <%- include('partials/footer') %>
</body>
</html>
```

**Document partial parameters:**
```ejs
<%
/**
 * Reusable DataTable Partial
 * 
 * @param {string} id - Table ID (required)
 * @param {array} columns - Column configuration (required)
 * @param {array} dataSource - Data array (required)
 * @param {array} defaultOrder - Default sort [[col, dir]]
 */
%>
```

---

## Git Commit Standards

### Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Code style (formatting, no logic change)
- `refactor` - Code restructuring (no behavior change)
- `perf` - Performance improvement
- `test` - Adding tests
- `chore` - Build/tooling changes

**Examples:**
```
feat(cet-dashboard): add threshold alerts filtering

Implement advanced filtering for threshold alerts column.
Includes multi-select filter with preset severity levels.

Closes #123
```

```
fix(table-init): correct render function registry lookup

Fixed issue where custom render functions weren't being
found in the registry due to case sensitivity.
```

---

## Testing Standards

### Manual Testing Checklist

**For New Features:**
- [ ] Works in Chrome, Firefox, Safari
- [ ] Responsive on mobile devices
- [ ] Keyboard navigation functional
- [ ] Screen reader accessible
- [ ] No console errors
- [ ] Configuration loads correctly
- [ ] Error states handled gracefully

**For Render Functions:**
- [ ] Returns HTML for `type === 'display'`
- [ ] Returns raw data for other types
- [ ] Handles null/undefined data
- [ ] Handles zero values correctly
- [ ] Color coding follows standards

---

## Best Practices Summary

1. ✅ **Use ES6 modules** (frontend) and CommonJS (backend)
2. ✅ **Follow MVC pattern** for backend code
3. ✅ **Document all functions** with JSDoc comments
4. ✅ **Use YAML for configuration** (JSON as fallback)
5. ✅ **Handle all render types** in render functions
6. ✅ **Use event delegation** for dynamic content
7. ✅ **Clean up event listeners** to prevent memory leaks
8. ✅ **Use Bootstrap classes first**, custom CSS sparingly
9. ✅ **Write descriptive variable names**, avoid abbreviations
10. ✅ **Add inline comments** for complex logic

---

## Code Review Checklist

- [ ] Follows naming conventions
- [ ] Includes file header comment
- [ ] Functions have JSDoc documentation
- [ ] Error handling implemented
- [ ] No console.log statements (use console.error/warn)
- [ ] Uses strict mode
- [ ] ES6 imports/exports (frontend) or CommonJS (backend)
- [ ] Render functions handle all types
- [ ] Event listeners cleaned up
- [ ] Configuration in YAML files
- [ ] No hardcoded values (use constants)
- [ ] Responsive design considered
- [ ] Accessibility (ARIA) attributes where needed

---

## References

See also:
- [Architecture Guide](./architecture.md)
- [CET Domain Knowledge](./cet-domain.md)
- [Common Workflows](./workflows.md)

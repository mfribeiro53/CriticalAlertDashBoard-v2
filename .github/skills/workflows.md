# Common Workflows & How-To Guides

## Overview

This guide provides step-by-step instructions for common development tasks in the CET Dashboard project.

---

## Table of Contents

1. [Adding a New Page](#adding-a-new-page)
2. [Adding a New Render Function](#adding-a-new-render-function)
3. [Adding a New Table Column](#adding-a-new-table-column)
4. [Adding a New Table Feature](#adding-a-new-table-feature)
5. [Adding a New Card](#adding-a-new-card)
6. [Adding a New Filter](#adding-a-new-filter)
7. [Modifying Color Thresholds](#modifying-color-thresholds)
8. [Adding Export Buttons](#adding-export-buttons)
9. [Troubleshooting Common Issues](#troubleshooting-common-issues)

---

## Adding a New Page

**Goal:** Create a new CET view page (e.g., "CET Logs")

### Step 1: Create Backend Files

**1.1 Create Route File** (`routes/cetLogsRoutes.js`):
```javascript
const express = require('express');
const router = express.Router();
const cetLogsController = require('../controllers/cetLogsController');

router.get('/', cetLogsController.renderLogs);
router.get('/data', cetLogsController.getLogsData);

module.exports = router;
```

**1.2 Create Controller** (`controllers/cetLogsController.js`):
```javascript
const cetLogsService = require('../services/cetLogsService');

exports.renderLogs = (req, res) => {
  try {
    const data = cetLogsService.getLogsData();
    res.render('cet-logs-view', { data });
  } catch (error) {
    console.error('Error rendering logs:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getLogsData = (req, res) => {
  try {
    const data = cetLogsService.getLogsData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching logs data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
```

**1.3 Create Service** (`services/cetLogsService.js`):
```javascript
const mockDataCETLogs = require('../mockdata/mockDataCETLogs');

exports.getLogsData = () => {
  return mockDataCETLogs.getCETLogs();
};
```

**1.4 Create Mock Data** (`mockdata/mockDataCETLogs.js`):
```javascript
exports.getCETLogs = () => {
  return [
    {
      timestamp: '2026-01-11T10:30:00Z',
      iGateApp: 'SAP_PROD',
      logLevel: 'ERROR',
      message: 'Connection timeout',
      source: 'DatabaseService'
    },
    // ... more log entries
  ];
};
```

**1.5 Register Route** in `app.js`:
```javascript
// Add with other CET routes
app.use('/cet-logs', require('./routes/cetLogsRoutes'));
```

---

### Step 2: Create Configuration Files

**2.1 Create Column Config** (`public/yaml-config/cet-logs-columns.yaml`):
```yaml
columns:
  - data: timestamp
    title: Timestamp
    className: text-start
    orderable: true
    render: renderTimestamp
    width: 15%
  
  - data: iGateApp
    title: Application
    className: text-start
    orderable: true
    width: 15%
  
  - data: logLevel
    title: Level
    className: text-center
    orderable: true
    render: renderLogLevel
    width: 10%
  
  - data: message
    title: Message
    className: text-start
    orderable: false
    render: renderTruncatedText
    width: 50%
  
  - data: source
    title: Source
    className: text-start
    orderable: true
    width: 10%
```

**2.2 Create Filter Config** (`public/yaml-config/cet-logs-filters.yaml`):
```yaml
filters:
  enabled: true
  position: top
  
  columns:
    - columnIndex: 1  # Application
      type: select
      label: Application
      placeholder: All Applications
      colSize: col-md-3
    
    - columnIndex: 2  # Log Level
      type: multi-select
      label: Log Level
      placeholder: All Levels
      colSize: col-md-3
      options:
        - label: ERROR
          value: ERROR
        - label: WARN
          value: WARN
        - label: INFO
          value: INFO
```

**2.3 Create ARIA Config** (`public/yaml-config/cet-logs-aria.yaml`):
```yaml
aria:
  tableLabel: CET Application Logs
  tableSummary: Displays error and warning logs from CET applications
```

---

### Step 3: Create View File

**Create EJS View** (`views/cet-logs-view.ejs`):
```ejs
<!DOCTYPE html>
<html lang="en">
<head>
  <%- include('partials/header', { 
    title: 'CET Logs',
    additionalCSS: []
  }) %>
</head>
<body>
  <div class="container-fluid mt-4">
    <h1>CET Application Logs</h1>
    
    <%- include('partials/datatable', {
      id: 'cetLogs',
      columns: [],  // Will load from config
      dataSource: data,
      defaultOrder: [[0, 'desc']],  // Latest logs first
      exportButtons: ['copy', 'csv', 'excel'],
      stateSave: true
    }) %>
  </div>
  
  <%- include('partials/footer') %>
  
  <script type="module">
    import { initializeTable } from '/js/table-init.js';
    
    document.addEventListener('DOMContentLoaded', async () => {
      await initializeTable({
        id: 'cetLogs',
        configPath: '/api/config/cet-logs'
      });
    });
  </script>
</body>
</html>
```

---

### Step 4: Add API Endpoints

**Add config endpoints** to `routes/apiRoutes.js`:
```javascript
// Add to existing routes
router.get('/config/cet-logs-columns', apiController.getCETLogsColumns);
router.get('/config/cet-logs-filters', apiController.getCETLogsFilters);
router.get('/config/cet-logs-aria', apiController.getCETLogsAria);
```

**Add controller methods** to `controllers/apiController.js`:
```javascript
exports.getCETLogsColumns = (req, res) => {
  const config = configService.loadConfig('cet-logs-columns', 'columns');
  res.json(config || []);
};

exports.getCETLogsFilters = (req, res) => {
  const config = configService.loadConfig('cet-logs-filters', 'filters');
  res.json(config || {});
};

exports.getCETLogsAria = (req, res) => {
  const config = configService.loadConfig('cet-logs-aria', 'aria');
  res.json(config || {});
};
```

---

### Step 5: Add Navigation

**Add to navigation menu** (in header partial):
```html
<li class="nav-item">
  <a class="nav-link" href="/cet-logs">Logs</a>
</li>
```

---

## Adding a New Render Function

**Goal:** Create a custom render function for displaying data

### For Generic Render Functions

**Add to** `public/js/helpers/table-helpers.js`:

```javascript
/**
 * Render log level badge with color coding
 * 
 * @param {string} data - Log level (ERROR, WARN, INFO, DEBUG)
 * @param {string} type - DataTables render type
 * @returns {string} HTML string for badge
 */
export function renderLogLevel(data, type) {
  if (type === 'display') {
    const levelMap = {
      'ERROR': '<span class="badge bg-danger">ERROR</span>',
      'WARN': '<span class="badge bg-warning text-dark">WARN</span>',
      'INFO': '<span class="badge bg-info">INFO</span>',
      'DEBUG': '<span class="badge bg-secondary">DEBUG</span>'
    };
    return levelMap[data] || `<span class="badge bg-light text-dark">${data}</span>`;
  }
  return data;
}
```

---

### For CET-Specific Render Functions

**Add to** `public/js/helpers/cet-render-helpers.js`:

```javascript
/**
 * Render CET log count badge with color coding
 * 
 * @param {number} data - Log count
 * @param {string} type - DataTables render type
 * @returns {string} HTML string for badge
 */
export function renderCETLogCount(data, type) {
  if (type === 'display') {
    if (data === 0) return '<span class="badge bg-success">0</span>';
    const badgeClass = data > 50 ? 'bg-danger' : data > 10 ? 'bg-warning' : 'bg-info';
    return `<span class="badge ${badgeClass}">${data}</span>`;
  }
  return data;
}
```

---

### Register the Function

**Add to registry** in `public/js/table-init.js`:

The function will be automatically included if you import the module:
```javascript
import * as TableHelpers from './helpers/table-helpers.js';
import * as CETRenders from './helpers/cet-render-helpers.js';

const renderFunctionRegistry = {
  ...getAllExportsFromModule(TableHelpers),
  ...getAllExportsFromModule(CETRenders),
};
```

---

### Use in Column Configuration

```yaml
columns:
  - data: logLevel
    title: Level
    render: renderLogLevel  # Reference by function name
```

---

## Adding a New Table Column

**Goal:** Add a new column to an existing table

### Step 1: Update Data Model

**Add field to mock data** (`mockdata/mockDataCET.js`):
```javascript
{
  iGateApp: 'SAP_PROD',
  thresholdAlerts: 5,
  // ... existing fields
  lastUpdated: '2026-01-11T10:30:00Z'  // New field
}
```

---

### Step 2: Update Column Configuration

**Add to YAML config** (`public/yaml-config/cet-dashboard-columns.yaml`):
```yaml
columns:
  # ... existing columns
  
  - data: lastUpdated
    title: Last Updated
    className: text-center
    orderable: true
    render: renderTimestamp
    width: 12%
```

---

### Step 3: Add Render Function (if needed)

If `renderTimestamp` doesn't exist, add it to `table-helpers.js`:
```javascript
export function renderTimestamp(data, type) {
  if (type === 'display') {
    const date = new Date(data);
    return date.toLocaleString();
  }
  return data;
}
```

---

### Step 4: Verify

1. Restart server: `npm start`
2. Clear browser cache
3. Reload page
4. Verify column appears with correct data

---

## Adding a New Table Feature

**Goal:** Create a new reusable table feature (e.g., row highlighting)

### Step 1: Create Feature Module

**Create** `public/js/table-feature-highlight.js`:

```javascript
/**
 * File: table-feature-highlight.js
 * Created: 2026-01-11
 * 
 * Row Highlighting Feature for DataTables
 * 
 * Highlights rows based on configurable criteria
 */

'use strict';

/**
 * Initialize row highlighting
 * 
 * @param {string} tableId - DataTable ID
 * @param {object} dataTable - DataTable instance
 * @param {object} config - Highlight configuration
 * @param {string} config.field - Field name to evaluate
 * @param {array} config.rules - Highlighting rules
 */
export function init(tableId, dataTable, config) {
  if (!config?.enabled) return;
  
  const { field, rules } = config;
  
  dataTable.on('draw', () => {
    dataTable.rows().every(function() {
      const rowData = this.data();
      const value = rowData[field];
      const rowNode = this.node();
      
      // Apply rules
      rules.forEach(rule => {
        if (matchesRule(value, rule)) {
          rowNode.classList.add(rule.className);
        }
      });
    });
  });
}

/**
 * Check if value matches rule
 */
function matchesRule(value, rule) {
  switch (rule.operator) {
    case 'gt': return value > rule.value;
    case 'lt': return value < rule.value;
    case 'eq': return value === rule.value;
    case 'gte': return value >= rule.value;
    case 'lte': return value <= rule.value;
    default: return false;
  }
}
```

---

### Step 2: Create Configuration

**Create** `public/yaml-config/cet-dashboard-highlight.yaml`:
```yaml
highlight:
  enabled: true
  field: thresholdAlerts
  rules:
    - operator: gte
      value: 9
      className: table-danger
    
    - operator: gte
      value: 5
      className: table-warning
```

---

### Step 3: Register Feature

**Add to** `table-init.js`:

```javascript
import * as TableHighlight from './table-feature-highlight.js';

// In initComplete callback
dtConfig.initComplete = function(settings, json) {
  // ... other features
  
  if (config.highlightConfig) {
    TableHighlight.init(config.id, dataTable, config.highlightConfig);
  }
};
```

---

### Step 4: Add Script to Footer

**Add to** `views/partials/footer.ejs`:
```html
<script type="module" src="/js/table-feature-highlight.js"></script>
```

---

### Step 5: Add API Endpoint

**Add to** `routes/apiRoutes.js`:
```javascript
router.get('/config/cet-dashboard-highlight', apiController.getCETDashboardHighlight);
```

**Add to** `controllers/apiController.js`:
```javascript
exports.getCETDashboardHighlight = (req, res) => {
  const config = configService.loadConfig('cet-dashboard-highlight', 'highlight');
  res.json(config || {});
};
```

---

## Adding a New Card

**Goal:** Add a new summary card to the dashboard

### Step 1: Add Data

**Update service** (`services/cetDashboardService.js`):
```javascript
exports.getCardData = () => {
  const rawData = mockDataCET.getCETDashboard();
  
  return {
    totalApps: rawData.length,
    totalAlerts: rawData.reduce((sum, app) => sum + app.thresholdAlerts, 0),
    criticalApps: rawData.filter(app => app.thresholdAlerts >= 9).length,
    // New card data
    avgResponseTime: calculateAverageResponseTime(rawData)
  };
};
```

---

### Step 2: Update Card Configuration

**Add to** `public/yaml-config/cet-dashboard-cards.yaml`:
```yaml
cards:
  # ... existing cards
  
  - id: avgResponseCard
    title: Avg Response Time
    icon: speedometer2
    valueField: avgResponseTime
    valueFormat: '{value}ms'
    badgeClass: bg-primary
    tooltip: Average application response time
```

---

### Step 3: Add to View

**Update** `views/cet-dashboard.ejs`:
```ejs
<div class="row mb-4">
  <!-- Existing cards -->
  
  <div class="col-md-3">
    <%- include('partials/card', {
      cardId: 'avgResponseCard',
      title: 'Avg Response Time',
      icon: 'speedometer2',
      value: cardData.avgResponseTime + 'ms',
      badgeClass: 'bg-primary'
    }) %>
  </div>
</div>
```

---

## Adding a New Filter

**Goal:** Add an advanced filter to a table

### Step 1: Update Filter Configuration

**Add to** `public/yaml-config/cet-dashboard-filters.yaml`:
```yaml
filters:
  enabled: true
  position: top
  
  columns:
    # ... existing filters
    
    - columnIndex: 5  # Slow processes column
      type: range
      label: Slow Processes
      placeholder: Min - Max
      colSize: col-md-3
```

---

### Step 2: Verify Feature is Enabled

Ensure `table-feature-filters.js` is loaded in footer partial and initialized in `table-init.js`.

---

### Step 3: Test Filter

1. Reload page
2. Verify filter appears in filter row
3. Test filtering functionality
4. Verify table updates correctly

---

## Modifying Color Thresholds

**Goal:** Change severity thresholds for CET badges

### Option 1: Modify Render Function

**Edit** `public/js/helpers/cet-render-helpers.js`:

```javascript
export function renderCETThresholdAlerts(data, type) {
  if (type === 'display') {
    if (data === 0) return '<span class="badge bg-success">0</span>';
    
    // Change thresholds here
    const badgeClass = data > 10 ? 'bg-danger'    // Was: > 8
                     : data > 6  ? 'bg-warning'   // Was: > 4
                     : 'bg-info';
    
    return `<span class="badge ${badgeClass}">${data}</span>`;
  }
  return data;
}
```

---

### Option 2: Configuration-Based Thresholds (Future Enhancement)

**Create** `public/yaml-config/cet-thresholds.yaml`:
```yaml
thresholds:
  alerts:
    info: 0
    warning: 5
    danger: 9
  
  queues:
    info: 0
    warning: 10
    danger: 30
```

**Modify render function to use config:**
```javascript
import thresholdsConfig from './thresholds-config.js';

export function renderCETThresholdAlerts(data, type) {
  if (type === 'display') {
    const thresholds = thresholdsConfig.alerts;
    
    if (data === 0) return '<span class="badge bg-success">0</span>';
    
    const badgeClass = data >= thresholds.danger  ? 'bg-danger'
                     : data >= thresholds.warning ? 'bg-warning'
                     : 'bg-info';
    
    return `<span class="badge ${badgeClass}">${data}</span>`;
  }
  return data;
}
```

---

## Adding Export Buttons

**Goal:** Enable/customize export buttons on a table

### Built-in Export Types

Available export types:
- `copy` - Copy to clipboard
- `csv` - Export as CSV
- `excel` - Export as Excel (.xlsx)
- `pdf` - Export as PDF

---

### Step 1: Update View Configuration

**In EJS view**, specify export buttons:
```ejs
<%- include('partials/datatable', {
  id: 'cetDashboard',
  columns: columns,
  dataSource: data,
  exportButtons: ['copy', 'csv', 'excel', 'pdf'],  // Add desired buttons
  colVisButton: true  // Optional: add column visibility toggle
}) %>
```

---

### Step 2: Verify Dependencies

Ensure these libraries are loaded in `views/partials/footer.ejs`:
```html
<script src="/node_modules/jszip/dist/jszip.min.js"></script>
<script src="/node_modules/pdfmake/build/pdfmake.min.js"></script>
<script src="/node_modules/pdfmake/build/vfs_fonts.js"></script>
<script src="/node_modules/datatables.net-buttons/js/dataTables.buttons.min.js"></script>
<script src="/node_modules/datatables.net-buttons-bs5/js/buttons.bootstrap5.min.js"></script>
<script src="/node_modules/datatables.net-buttons/js/buttons.html5.min.js"></script>
<script src="/node_modules/datatables.net-buttons/js/buttons.print.min.js"></script>
```

---

### Step 3: Customize Export Options

**In** `public/js/table-init.js`, customize export behavior:

```javascript
buttons: [
  {
    extend: 'excel',
    title: 'CET Dashboard Export',
    filename: 'cet-dashboard-' + new Date().toISOString(),
    exportOptions: {
      columns: ':visible:not(.no-export)'  // Exclude columns with class 'no-export'
    }
  },
  {
    extend: 'pdf',
    orientation: 'landscape',
    pageSize: 'A4',
    title: 'CET Dashboard',
    exportOptions: {
      columns: ':visible:not(.no-export)'
    }
  }
]
```

---

## Troubleshooting Common Issues

### Issue: Table Not Initializing

**Symptoms:** Empty table, "Loading..." never completes

**Solutions:**
1. Check browser console for errors
2. Verify configuration API endpoint returns data
3. Check column config has valid `data` properties
4. Verify data source matches column definitions

**Debug:**
```javascript
console.log('Config:', config);
console.log('Data source:', dataSource);
```

---

### Issue: Render Function Not Found

**Symptoms:** Console error: "Render function 'renderX' not found"

**Solutions:**
1. Verify function is exported from helper module
2. Check function name matches exactly (case-sensitive)
3. Ensure module is imported in `table-init.js`
4. Verify function is added to registry

**Debug:**
```javascript
console.log('Available renders:', Object.keys(renderFunctionRegistry));
```

---

### Issue: Filter Not Appearing

**Symptoms:** Filter controls don't show

**Solutions:**
1. Verify `filters.enabled: true` in YAML config
2. Check `columnIndex` matches actual column position
3. Ensure `table-feature-filters.js` is loaded
4. Verify `DataTableFilters.init()` is called in `initComplete`

**Debug:**
```javascript
console.log('Filter config:', filterConfig);
```

---

### Issue: Export Buttons Missing

**Symptoms:** Export buttons don't appear in toolbar

**Solutions:**
1. Verify JSZip and PDFMake libraries are loaded
2. Check `exportButtons` array in view configuration
3. Ensure DataTables Buttons extension is loaded
4. Check for JavaScript errors in console

**Debug:**
```javascript
// In browser console
console.log($.fn.dataTable.Buttons);  // Should be defined
```

---

### Issue: Colors Not Showing Correctly

**Symptoms:** Badges have wrong colors or no colors

**Solutions:**
1. Verify Bootstrap CSS is loaded
2. Check render function returns correct badge classes
3. Verify `type === 'display'` check in render function
4. Check for CSS conflicts

**Debug:**
```javascript
// Add to render function
console.log('Rendering:', data, type, badgeClass);
```

---

### Issue: Configuration Not Loading

**Symptoms:** "Failed to load configuration" error

**Solutions:**
1. Verify YAML file exists in `/public/yaml-config/`
2. Check YAML syntax is valid
3. Verify API endpoint is registered
4. Check server logs for errors

**Test:**
```bash
# Test YAML syntax
npm install -g js-yaml
js-yaml public/yaml-config/cet-dashboard-columns.yaml

# Test API endpoint
curl http://localhost:3000/api/config/cet-dashboard-columns
```

---

### Issue: Memory Leak / Performance Degradation

**Symptoms:** Page slows down over time

**Solutions:**
1. Ensure event listeners are cleaned up
2. Destroy DataTable before re-initializing
3. Use event delegation instead of direct binding
4. Clear interval timers when done

**Cleanup Pattern:**
```javascript
// Store references
dataTable.settings()[0]._myCleanup = () => {
  // Remove event listeners
  // Clear timers
  // Destroy objects
};

// On page unload
window.addEventListener('beforeunload', () => {
  const settings = dataTable.settings()[0];
  if (settings._myCleanup) {
    settings._myCleanup();
  }
});
```

---

## Quick Reference

### File Locations

**Backend:**
- Routes: `routes/*.js`
- Controllers: `controllers/*.js`
- Services: `services/*.js`
- Mock Data: `mockdata/*.js`

**Frontend:**
- Views: `views/*.ejs`
- Partials: `views/partials/*.ejs`
- JavaScript: `public/js/*.js`
- Helpers: `public/js/helpers/*.js`
- CSS: `public/css/*.css`

**Configuration:**
- YAML: `public/yaml-config/*.yaml`
- JSON (fallback): `public/config/*.json`

---

### Common Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Install dependencies
npm install

# Test YAML syntax
js-yaml public/yaml-config/example.yaml

# Check for errors
npm run lint  # If configured
```

---

## References

See also:
- [Architecture Guide](./architecture.md)
- [Coding Standards](./coding-standards.md)
- [CET Domain Knowledge](./cet-domain.md)
- [DataTable Features Docs](../../docs/DATATABLE_FEATURES.md)
- [Card Configuration Docs](../../docs/CARD_CONFIGURATION.md)

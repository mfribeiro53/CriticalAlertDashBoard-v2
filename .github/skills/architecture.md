# CET Dashboard - Architecture & Patterns

## Project Overview

**CET Dashboard (Critical Alert Dashboard - SB)** is a Node.js/Express web application for monitoring CET (Central Engine Technology) application health, alerts, queues, and issues. It uses a component-based architecture with reusable DataTables and card views, configured via YAML files.

**Tech Stack:**
- Backend: Node.js + Express + EJS templating
- Frontend: Bootstrap 5 + jQuery + DataTables
- Data Format: Mock data (ready for API integration)
- Configuration: YAML (preferred) with JSON fallback

---

## Core Architecture Principles

### 1. MVC Pattern (Backend)

**Separation of Concerns:**
```
Request → Routes → Controller → Service → Mock Data
```

- **Routes** (`routes/*.js`): Define endpoints, delegate to controllers
- **Controllers** (`controllers/*.js`): Handle requests, call services, render views
- **Services** (`services/*.js`): Business logic, data access, transformations
- **Mock Data** (`mockdata/*.js`): Simulated data sources (replaceable with APIs)

**Example Flow:**
```javascript
// Route: routes/cetDashboardRoutes.js
router.get('/', cetDashboardController.renderDashboard);

// Controller: controllers/cetDashboardController.js
exports.renderDashboard = (req, res) => {
  const data = cetDashboardService.getDashboardData();
  res.render('cet-dashboard', { data });
};

// Service: services/cetDashboardService.js
exports.getDashboardData = () => {
  return mockDataCET.getCETDashboard();
};
```

---

### 2. Configuration-Driven Frontend

**YAML Configuration System:**
All table and card configurations live in `/public/yaml-config/` as YAML files for readability and maintainability.

**Configuration Types:**
- `*-columns.yaml` - DataTable column definitions
- `*-filters.yaml` - Advanced filter configurations
- `*-footer.yaml` - Footer aggregation settings
- `*-aria.yaml` - Accessibility configurations
- `*-keyboard.yaml` - Keyboard navigation shortcuts
- `*-cards.yaml` - Card view configurations

**Example Column Configuration:**
```yaml
# public/yaml-config/cet-dashboard-columns.yaml
columns:
  - data: iGateApp
    title: iGate Application
    className: text-start
    orderable: true
    width: 15%
  
  - data: thresholdAlerts
    title: Threshold Alerts
    className: text-center
    render: renderClickableCETThresholdAlerts
    urlTemplate: /cet-issues?app={iGateApp}
    width: 10%
```

**Loading Configuration:**
```javascript
// Backend: services/configService.js
const loadConfig = (configFileName, propertyPath = null, defaultValue = null) => {
  // Tries YAML first, falls back to JSON
  // Supports property path extraction: 'cet.dashboard.columns'
};

// Frontend: Data attributes on table elements
<table id="cetDashboard" 
       data-config-path="/api/config/cet-dashboard">
```

---

### 3. ES6 Module System (Frontend)

**Modern JavaScript Architecture:**
- All frontend JS uses ES6 modules (`type="module"`)
- No global namespace pollution
- Import/export for clean dependencies
- Registry pattern for extensibility

**Module Structure:**
```javascript
// Import dependencies
import * as TableHelpers from './table-helpers.js';
import * as CETRenders from '../helpers/cet-render-helpers.js';

// Export functions
export function initializeTable(config) { }
export function updateCard(cardId, data) { }
```

**Render Function Registry:**
```javascript
// table-init.js builds registry from imports
const renderFunctionRegistry = {
  // Generic helpers
  renderSeverityBadge: TableHelpers.renderSeverityBadge,
  renderStatusBadge: TableHelpers.renderStatusBadge,
  
  // CET-specific helpers
  renderCETThresholdAlerts: CETRenders.renderCETThresholdAlerts,
  renderClickableCETThresholdAlerts: CETRenders.renderClickableCETThresholdAlerts,
};

// Usage in column config
{ render: 'renderCETThresholdAlerts' }
```

---

### 4. Reusable Components

**EJS Partials:**
Two main reusable components with extensive configuration options:

**A. DataTable Partial** (`views/partials/datatable.ejs`):
```ejs
<%- include('partials/datatable', {
  id: 'cetDashboard',
  columns: columns,
  dataSource: data,
  defaultOrder: [[0, 'asc']],
  exportButtons: ['copy', 'csv', 'excel'],
  filterConfig: filters,
  footerConfig: footerAgg
}) %>
```

**B. Card Partial** (`views/partials/card.ejs`):
```ejs
<%- include('partials/card', {
  cardId: 'alertsSummary',
  title: 'Active Alerts',
  icon: 'exclamation-triangle',
  value: '42',
  badgeClass: 'bg-danger'
}) %>
```

---

### 5. Feature Initialization Pattern

**Event-Driven Initialization:**
Uses DataTables' `initComplete` callback instead of polling/timeouts.

```javascript
// ❌ Old approach - unreliable timing
setTimeout(() => {
  DataTableFilters.init(config.id, dataTable, config.filterConfig);
}, 300);

// ✅ New approach - event-driven
dtConfig.initComplete = function(settings, json) {
  // DOM is ready, initialize all features
  if (config.filterConfig) {
    DataTableFilters.init(config.id, dataTable, config.filterConfig);
  }
  if (config.selectionConfig) {
    DataTableSelection.init(config.id, dataTable, config.selectionConfig);
  }
  // ... other features
};
```

**Benefits:**
- No race conditions
- Zero overhead (no polling)
- Guaranteed timing
- All features initialize together

---

## File Organization

### Directory Structure

```
CriticalAlertDashBoard-SB/
├── app.js                     # Express server setup
├── package.json               # Dependencies
├── routes/                    # Express routes
│   ├── cetDashboardRoutes.js
│   ├── cetAppsRoutes.js
│   ├── cetIssuesRoutes.js
│   ├── cetQueuesRoutes.js
│   ├── cetReportsRoutes.js
│   └── apiRoutes.js
├── controllers/               # Request handlers
│   └── cetDashboardController.js (etc.)
├── services/                  # Business logic
│   ├── configService.js      # YAML/JSON config loader
│   └── cetDashboardService.js (etc.)
├── mockdata/                  # Mock data sources
│   └── mockDataCET.js (etc.)
├── public/
│   ├── yaml-config/          # ⭐ YAML configurations (preferred)
│   │   ├── cet-dashboard-columns.yaml
│   │   ├── cet-dashboard-filters.yaml
│   │   ├── cet-dashboard-footer.yaml
│   │   └── cet-dashboard-cards.yaml
│   ├── config/               # JSON fallback configs
│   ├── css/                  # Stylesheets
│   │   ├── styles.css       # Global styles
│   │   ├── table-*.css      # Feature-specific styles
│   │   └── card-view.css
│   └── js/                   # Frontend JavaScript (ES6 modules)
│       ├── helpers/         # Domain-specific helpers
│       │   ├── cet-render-helpers.js  # CET badge renders
│       │   └── table-helpers.js       # Generic renders
│       ├── table-init.js            # DataTable initialization
│       ├── table-feature-*.js       # Feature modules
│       ├── card-init.js             # Card initialization
│       ├── card-helpers.js          # Card utilities
│       └── pages/                   # Page-specific JS
│           └── cet-dashboard-page.js
├── views/
│   ├── cet-dashboard.ejs    # Main views
│   ├── cet-apps-view.ejs
│   └── partials/            # Reusable components
│       ├── header.ejs
│       ├── footer.ejs       # ⭐ Script loading hub
│       ├── datatable.ejs    # DataTable wrapper
│       └── card.ejs         # Card wrapper
└── docs/                     # Documentation
    ├── FILE_ORGANIZATION.md
    ├── DEVELOPER_NOTES.md
    └── DATATABLE_FEATURES.md
```

---

## Naming Conventions

### Files

**Routes:** `{entity}Routes.js` (e.g., `cetDashboardRoutes.js`)
**Controllers:** `{entity}Controller.js` (e.g., `cetDashboardController.js`)
**Services:** `{entity}Service.js` (e.g., `cetDashboardService.js`)
**Mock Data:** `mockData{Entity}.js` (e.g., `mockDataCET.js`)

**YAML Configs:** `{page}-{type}.yaml` (e.g., `cet-dashboard-columns.yaml`)
**Frontend JS:** `{type}-{feature}.js` (e.g., `table-feature-filters.js`)
**Views:** `{entity}-{type}.ejs` (e.g., `cet-issues-view.ejs`)

### Functions

**Render Functions:**
- Generic: `render{Type}` (e.g., `renderSeverityBadge`)
- CET-specific: `renderCET{Type}` (e.g., `renderCETThresholdAlerts`)
- Clickable: `renderClickable{Type}` (e.g., `renderClickableCETThresholdAlerts`)

**Service Functions:**
- `get{Entity}Data()` - Retrieve data
- `format{Entity}()` - Transform data
- `load{Type}Config()` - Load configuration

---

## Key Design Patterns

### 1. Separation of Concerns

**Domain-specific logic is isolated:**
- Generic table helpers → `table-helpers.js`
- CET-specific renders → `helpers/cet-render-helpers.js`
- Generic card utilities → `card-helpers.js`
- Page-specific logic → `pages/*-page.js`

### 2. Registry Pattern

**Extensible render function registry:**
```javascript
const renderFunctionRegistry = {
  ...getAllExportsFromModule(TableHelpers),
  ...getAllExportsFromModule(CETRenders),
};

// Lookup by string name from config
const renderFunc = renderFunctionRegistry[column.render];
```

### 3. DRY Scripts

**Single source of truth for script loading:**
All pages include: `<%- include('partials/footer') %>`

Footer partial contains ALL scripts in correct order:
1. jQuery & Bootstrap
2. DataTables core
3. Export dependencies (JSZip, PDFMake)
4. Custom modules
5. Initialization (must be last)

**Benefits:**
- No duplicate script tags
- Consistent load order
- Easy to add new features
- Prevents "library not loaded" bugs

### 4. Progressive Enhancement

**Graceful degradation:**
- Tables work without JavaScript (basic HTML table)
- Filters degrade to searchable columns
- Cards show static data without updates
- Export buttons hidden when libraries unavailable

---

## Data Flow

### Page Load Sequence

```
1. User navigates to /cet-dashboard
   ↓
2. Router → Controller → Service → Mock Data
   ↓
3. Controller renders EJS template with data
   ↓
4. Browser loads view with embedded data
   ↓
5. Footer partial loads all scripts
   ↓
6. table-init.js reads data attributes from <table>
   ↓
7. Fetches configuration via API (/api/config/*)
   ↓
8. Initializes DataTable with:
   - Column definitions (from YAML)
   - Render functions (from registry)
   - Filters, footer, ARIA (from configs)
   ↓
9. initComplete callback fires
   ↓
10. All features initialize (filters, selection, etc.)
    ↓
11. Page fully interactive
```

### Configuration Loading Flow

```
Frontend Request
   ↓
GET /api/config/cet-dashboard-columns
   ↓
apiRoutes.js → apiController.js → configService.js
   ↓
loadConfig('cet-dashboard-columns')
   ↓
Tries: /public/yaml-config/cet-dashboard-columns.yaml
   ↓ (if not found)
Tries: /public/config/cet-dashboard-columns.json
   ↓
Parse YAML/JSON → Extract property path → Return config
   ↓
Frontend receives columns array
   ↓
Build DataTable columns with render functions
```

---

## Extension Points

### Adding New Pages

1. **Create route file:** `routes/cetNewRoutes.js`
2. **Create controller:** `controllers/cetNewController.js`
3. **Create service:** `services/cetNewService.js`
4. **Create mock data:** `mockdata/mockDataCETNew.js`
5. **Create YAML configs:** `public/yaml-config/cet-new-*.yaml`
6. **Create view:** `views/cet-new-view.ejs`
7. **Register route:** Add `app.use('/cet-new', ...)` in `app.js`

### Adding New Render Functions

**For generic renders:**
Add to `public/js/helpers/table-helpers.js`

**For CET-specific renders:**
Add to `public/js/helpers/cet-render-helpers.js`

**Pattern:**
```javascript
export function renderMyCustomType(data, type, row, meta) {
  if (type === 'display') {
    // Return HTML for display
    return `<span class="badge">${data}</span>`;
  }
  // Return raw data for sorting/filtering
  return data;
}
```

### Adding New Table Features

1. **Create feature module:** `public/js/table-feature-myfeature.js`
2. **Export init function:** `export function init(tableId, dataTable, config) {}`
3. **Add to initComplete:** Call `MyFeature.init()` in `table-init.js`
4. **Create YAML config:** Define feature settings in `*-myfeature.yaml`
5. **Update footer:** Add script import to `views/partials/footer.ejs`

---

## Best Practices

1. **Always use YAML for new configs** - More readable than JSON
2. **Follow MVC separation** - Keep routes, controllers, services distinct
3. **Use ES6 modules** - Import/export instead of global variables
4. **Event-driven initialization** - Use `initComplete`, not timeouts
5. **Configuration over code** - Define behavior in YAML, not hardcoded
6. **Reusable components** - Use partials for tables and cards
7. **Domain separation** - Generic vs. CET-specific helpers
8. **Document patterns** - Add JSDoc comments with examples

---

## References

See also:
- [File Organization](../../docs/FILE_ORGANIZATION.md)
- [Developer Notes](../../docs/DEVELOPER_NOTES.md)
- [DataTable Features](../../docs/DATATABLE_FEATURES.md)
- [Card Configuration](../../docs/CARD_CONFIGURATION.md)

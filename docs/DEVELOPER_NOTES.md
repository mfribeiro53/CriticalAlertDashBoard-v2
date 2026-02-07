# Developer Notes

A collection of insights, tips, and lessons learned during development of the Error Alert Dashboard application.

---

## Table of Contents
- [DataTables](#datatables)
- [Cards](#cards)
- [Styling](#styling)

---

## DataTables

### Sort Indicator Positioning

**Issue:** Sort indicators (arrows) appearing inconsistently - some on the left, others on the right of column headers.

**Cause:** DataTables places sort indicators based on the column's text alignment class:
- `text-start` (left-aligned) → Sort indicator appears on the **right**
- `text-center` (center-aligned) → Sort indicator appears on the **right**
- `text-end` (right-aligned) → Sort indicator appears on the **left**

**Solution:** Use consistent text alignment across all sortable columns, typically `text-start` for headers:

```json
{
  "data": "columnName",
  "title": "Column Title",
  "className": "text-start",  // Consistent alignment
  "orderable": true
}
```

**Location:** Column configuration files in `/public/config/*-columns.json`

**Related Files:**
- `/public/config/cet-dashboard-columns.json`
- Any other `*-columns.json` configuration files

---

### Feature Initialization Timing

**Issue:** Originally used polling (`setInterval`) and arbitrary timeouts (`setTimeout`) to wait for DataTables DOM elements to be ready before initializing features like filters, selection, editing, etc.

**Problems with Old Approach:**
- **Polling Overhead**: Checking every 100ms for wrapper existence was inefficient
- **Race Conditions**: Multiple `setTimeout` calls with staggered delays (300ms, 350ms, 400ms, etc.)
- **Timing Assumptions**: Features might initialize too early or unnecessarily late
- **Error-Prone**: Hard to maintain and debug timing issues

**Solution:** Use DataTables' built-in `initComplete` callback for event-driven initialization:

```javascript
// Old approach - polling and timeouts
setTimeout(() => {
  DataTableFilters.init(config.id, dataTable, config.filterConfig);
}, 300);

// New approach - event-driven
dtConfig.initComplete = function(settings, json) {
  // DataTables DOM is now fully ready
  if (config.filterConfig && DataTableFilters) {
    DataTableFilters.init(config.id, dataTable, config.filterConfig);
  }
};
```

**Benefits:**
- ✅ Zero overhead - no repeated checks
- ✅ Guaranteed timing - fires exactly when table is ready
- ✅ All features initialize together in one callback
- ✅ No race conditions or timing assumptions
- ✅ More maintainable and reliable code

**Location:** `/public/js/lib/datatable-kit/core/table-init.js`

**Related Features:** Filters, row selection, footer aggregations, inline editing, advanced search, ARIA enhancements, keyboard navigation

---

## Cards

### Architecture Pattern

**Three-Layer Architecture:**

1. **Generic Utilities** (`lib/card-kit/handlers/card-custom-handlers.js`):
   - Reusable functions like `updateDashboardCard()`
   - Generic rendering functions
   - No page-specific business logic or hard-coded card IDs

2. **Orchestration Layer** (`lib/card-kit/core/card-init.js`):
   - Loads card configurations from JSON
   - Coordinates between generic utilities and page-specific logic
   - Handles errors and async loading
   - Example: `initializeCards(configPath, updateFunction, options)`

3. **Page-Specific Logic** (`pages/*-page.js`):
   - Page-specific data binding (e.g., `bindCETTableData()`)
   - Custom aggregation logic
   - Table-to-card data flow
   - Page initialization
   - All card IDs read from configuration

**Configuration-Driven Design:**
- Card DOM element IDs are defined in config JSON files via `cardId` property
- Click actions/navigation defined in config via `clickAction` property
- No hard-coded card IDs or navigation URLs in JavaScript
- Single source of truth for all card properties

**Example: CET Dashboard Cards**

```javascript
// Generic utility (lib/card-kit/handlers/card-custom-handlers.js)
export const updateDashboardCard = (cardId, count, icon, label, description, thresholds) => { ... };

// Configuration file (config/cet-dashboard-cards.json)
{
  "applications": {
    "cardId": "applicationCard",      // DOM element ID
    "clickAction": "/cet-apps",        // Navigation URL
    "icon": "app-indicator",
    "label": "Applications",
    "description": "...",
    "thresholds": { "warning": 999, "danger": 9999 }
  }
}

// Page-specific logic (pages/cet-dashboard-page.js)
export const bindCETTableData = (tableId, cardConfig) => {
  const table = $(`#${tableId}`).DataTable();
  // Use cardId from config - no hard-coded IDs
  updateDashboardCard(
    cardConfig.applications.cardId,  // ✅ From config
    applications.size,
    cardConfig.applications.icon,
    cardConfig.applications.label,
    cardConfig.applications.description,
    cardConfig.applications.thresholds
  );
};

// Orchestration (card-init.js)
export const initializeCards = async (configPath, updateFunction, options = {}) => {
  const cardConfig = await fetch(configPath).then(r => r.json());
  renderCETCards(cardConfig);  // Step 1: Render using config.cardId
  if (bindFunction) bindFunction(tableId, cardConfig);  // Step 2: Bind data
};
```

**Why This Pattern?**
- ✅ Clear separation of concerns
- ✅ Reusable generic utilities
- ✅ Easy to add new pages without modifying core files
- ✅ Page-specific logic stays in page files
- ✅ Testable components
- ✅ Configuration-driven: card IDs and actions in JSON, not code
- ✅ Single source of truth for all card properties

---

## Styling

### Bootstrap-First Approach

**Philosophy:** This project uses Bootstrap 5 as the primary CSS framework. Custom CSS should only be added when Bootstrap doesn't provide the needed functionality.

**Best Practices:**

1. **No Inline Styles:** All `style=` attributes have been removed from EJS templates. Use Bootstrap utility classes instead:
   - `style="display: none;"` → `.d-none`
   - `style="margin-top: 1rem;"` → `.mt-3`
   - `style="color: red;"` → `.text-danger`

2. **Bootstrap CSS Variables:** Custom CSS files use Bootstrap CSS variables for consistency:
   ```css
   /* ✅ Good - Uses Bootstrap variable */
   color: var(--bs-primary, #0d6efd);
   
   /* ❌ Avoid - Hardcoded color */
   color: #0d6efd;
   ```

3. **Removed Redundant Classes:**
   - `.badge-status` removed (Bootstrap's `.badge` is sufficient)
   - Text alignment classes removed (Bootstrap has `.text-start`, `.text-center`, `.text-end`)
   - Spacing utilities removed (Bootstrap has `.m-*`, `.p-*`, `.mt-*`, etc.)

4. **Custom CSS Locations:**
   - `styles.css` - Core DataTable customizations
   - `card-view.css` - Card-specific styles
   - `cet-*.css` - Page-specific styles
   - `table-*.css` - Feature-specific table styles

5. **When to Add Custom CSS:**
   - Only when Bootstrap doesn't provide the functionality
   - For application-specific visual requirements
   - For complex interactions beyond Bootstrap's scope
   - Always use Bootstrap variables when referencing colors/spacing

**Files Recently Refactored:**
- All CSS files updated to use Bootstrap CSS variables
- Hover states simplified using `var(--bs-table-hover-bg)`
- Color references use `var(--bs-primary)`, `var(--bs-danger)`, etc.
- Dark mode support removed in favor of Bootstrap's color mode system

---

## Architecture Notes

### MVC Pattern Implementation

**Overview:**  
The application follows the Model-View-Controller (MVC) pattern across all routes for improved maintainability and separation of concerns.

**Architecture Layers:**

1. **Routes** (`routes/` directory)
   - Define URL patterns and HTTP methods
   - Map requests to controller functions
   - Keep route definitions clean and declarative
   - Files:
     - `cetDashboardRoutes.js`
     - `cetAppsRoutes.js`
     - `cetIssuesRoutes.js`
     - `cetQueuesRoutes.js`
     - `cetReportsRoutes.js`
     - `apiRoutes.js`

2. **Controllers** (`controllers/` directory)
   - Handle HTTP request/response cycle
   - Process and validate request data
   - Call service layer for data operations
   - Return appropriate HTTP status codes
   - Files:
     - `cetDashboardController.js`
     - `cetAppsController.js`
     - `cetIssuesController.js`
     - `cetQueuesController.js`
     - `cetReportsController.js`
     - `apiController.js`

3. **Services** (`services/` directory)
   - Data access abstraction layer
   - Business logic and data transformation
   - Configuration file loading
   - Encapsulate all data operations
   - Provide consistent interface
   - Easy to swap mock data for database
   - Graceful error handling
   - Files:
     - `configService.js` - Config loading utility
     - `cetDashboardService.js`
     - `cetAppsService.js`
     - `cetIssuesService.js`
     - `cetQueuesService.js`
     - `cetReportsService.js`
     - `apiService.js`

**Request Flow:**
```
Browser Request
    ↓
Express Router (routes/*.js)
    ↓
Controller (controllers/*.js)
    ↓
Service (services/*.js)
    ↓
Data Source (mockdata/*.js or database)
```

**Benefits:**
- ✅ **Separation of Concerns** - Each layer has a single responsibility
- ✅ **Testability** - Easy to unit test individual layers
- ✅ **Maintainability** - Changes isolated to specific layers
- ✅ **Scalability** - Easy to add new features following same pattern
- ✅ **Database Agnostic** - Service layer abstracts data source
- ✅ **Reduced Coupling** - No tight coupling to mock data files

**Example: CET Dashboard**

```javascript
// routes/cetDashboardRoutes.js - Route definitions only
router.get('/', cetDashboardController.showDashboard);

// controllers/cetDashboardController.js - Request handling
function showDashboard(req, res) {
  const data = cetDashboardService.getDashboardData();
  res.render('cet-dashboard', data);
}

// services/cetDashboardService.js - Data access & configuration
function getDashboardData() {
  return {
    cetData: mockCETData,
    columns: loadConfig('cet-dashboard-columns.json', 'cet', []),
    filterConfig: loadConfig('cet-dashboard-filters.json'),
    // ... more configs
  };
}
```

**Migration from Monolithic app.js:**
- Old: All routes defined inline in `app.js` (313 lines)
- New: Clean `app.js` with route delegation (58 lines - 81% reduction)
- All routes follow consistent MVC pattern:
  - `app.use('/cet-dashboard', require('./routes/cetDashboardRoutes'))`
  - `app.use('/cet-apps', require('./routes/cetAppsRoutes'))`
  - `app.use('/cet-issues', require('./routes/cetIssuesRoutes'))`
  - `app.use('/cet-queues', require('./routes/cetQueuesRoutes'))`
  - `app.use('/cet-reports', require('./routes/cetReportsRoutes'))`
  - `app.use('/api', require('./routes/apiRoutes'))`
- Routes, controllers, and services now in separate files
- Configuration loading abstracted to `configService.js`
- Easy to swap mock data for SQL Server by updating service layer only

---

### API Routes Organization

**API Endpoint Pattern:**  
API endpoints follow RESTful conventions with consistent MVC routing.

**CET Apps API Endpoints:**
```
GET    /cet-apps           - View CET applications page
GET    /cet-apps/admin     - Admin page for CRUD operations
GET    /cet-apps/api       - Get all CET applications
GET    /cet-apps/api/:id   - Get single application by ID
POST   /cet-apps/api       - Create new application
PUT    /cet-apps/api/:id   - Update existing application
DELETE /cet-apps/api/:id   - Delete application
```

**General API Endpoints:**
```
POST   /api/request-data   - Request data for application & time range
GET    /api/apps           - Get all applications (legacy, uses cetAppsService)
```

**Legacy Support:**
- `/api/apps` - Still available for backward compatibility
- `/api/cet-apps/*` - Automatically redirected to `/cet-apps/api/*`

**All API Routes:**
- Handled by `routes/apiRoutes.js`
- Controllers in `controllers/apiController.js`
- Business logic in `services/apiService.js`

**Why This Pattern?**
- ✅ Feature-based routing (all CET Apps endpoints under `/cet-apps`)
- ✅ RESTful conventions (HTTP verbs indicate action)
- ✅ Logical grouping (page routes and API routes together)
- ✅ Easy to implement authentication middleware per feature
- ✅ Scalable for adding more features

---

### Admin Page Implementation

**Purpose:**  
Provides CRUD (Create, Read, Update, Delete) interface for managing CET applications.

**Location:** `/cet-apps/admin`

**Components:**
1. **View Template:** `views/cet-apps-admin.ejs`
   - DataTable with action buttons (Edit, Delete)
   - Bootstrap modal for Add/Edit form
   - Delete confirmation modal
   - iGate App filter dropdown

2. **Form Configuration:** `public/config/cet-apps-admin-form.json`
   - JSON-driven dynamic form
   - Field definitions with validation
   - Reusable across Add/Edit operations

3. **Page JavaScript:** `public/js/pages/cet-apps-admin-page.js`
   - Initialize DataTable with action columns
   - Handle Add/Edit/Delete operations
   - Form population and submission
   - Real-time table filtering

4. **API Integration:**
   - Uses fetch API for CRUD operations
   - Proper error handling and user feedback
   - Toast notifications for success/error

**Key Features:**
- Filter by iGate App
- Add new CET application
- Edit existing application (modal form)
- Delete with confirmation
- Real-time table updates
- Validation and error handling

---

**Last Updated:** December 21, 2025

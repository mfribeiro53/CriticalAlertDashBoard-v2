# CET (Central Engine Technology) Views Documentation

## Overview

The application includes six specialized views for CET (Central Engine Technology) monitoring and management. These views provide comprehensive dashboards for tracking application health, configuration, issues, queue monitoring, and administrative management across CET systems.

## CET Views

### 1. CET Dashboard (`/cet-dashboard`)

**File:** `views/cet-dashboard.ejs`

**Purpose:**  
Real-time monitoring of CET application health across all systems.

**Features:**
- Status summary cards (Healthy, Warning, Critical, Total Systems)
- DataTable with application health status
- System-wide metrics and monitoring
- Visual indicators for system health

**Configuration Files:**
- `public/config/cet-dashboard-columns.json` - Column definitions
- `public/config/cet-dashboard-filters.json` - Filter configuration
- `public/config/cet-dashboard-footer.json` - Footer aggregations
- `public/config/cet-dashboard-aria.json` - ARIA accessibility
- `public/config/cet-dashboard-keyboard.json` - Keyboard navigation

**Data Source:**
- `mockdata/mockDataCET.js` - Mock CET dashboard data

**Key Metrics:**
- Healthy Systems count
- Warning status count
- Critical issues count
- Total systems count
- Application status per system

---

### 2. CET Applications (`/cet-apps`)

**File:** `views/cet-apps-view.ejs`

**Purpose:**  
Configuration registry for all CET applications including ports, databases, and support links.

**Features:**
- Application configuration details
- Summary cards (Total Apps, Active Apps, SQL Servers, Monitored Apps)
- DataTable with application registry
- Port and database configuration
- Support and documentation links

**Configuration Files:**
- `public/config/cet-apps-columns.json` - Column definitions
- `public/config/cet-apps-filters.json` - Filter configuration
- `public/config/cet-apps-footer.json` - Footer aggregations
- `public/config/cet-apps-aria.json` - ARIA accessibility
- `public/config/cet-apps-keyboard.json` - Keyboard navigation

**Data Source:**
- `mockdata/mockDataCETApps.js` - Mock CET applications data

**Key Information:**
- Application names and IDs
- Server configurations
- Port assignments
- Database connections
- Support contact information
- Documentation links

---

### 3. CET Applications Admin (`/cet-apps/admin`)

**File:** `views/cet-apps-admin.ejs`

**Purpose:**  
Administrative interface for managing CET applications with full CRUD (Create, Read, Update, Delete) operations.

**Features:**
- DataTable with action buttons (Edit, Delete)
- Add new CET application
- Edit existing applications via modal form
- Delete applications with confirmation
- Filter by iGate App
- Real-time form validation
- Toast notifications for user feedback

**Configuration Files:**
- `public/config/cet-apps-columns.json` - Column definitions
- `public/config/cet-apps-admin-form.json` - Dynamic form configuration
- `public/config/cet-apps-aria.json` - ARIA accessibility
- `public/config/cet-apps-keyboard.json` - Keyboard navigation

**JavaScript:**
- `public/js/pages/cet-apps-admin-page.js` - Admin page initialization and CRUD handlers

**API Endpoints:**
- `GET /cet-apps/api` - Fetch all applications
- `GET /cet-apps/api/:id` - Fetch single application
- `POST /cet-apps/api` - Create new application
- `PUT /cet-apps/api/:id` - Update existing application
- `DELETE /cet-apps/api/:id` - Delete application

**Data Source:**
- `services/cetAppsService.js` - Data access abstraction layer
- `mockdata/mockDataCETApps.js` - Mock CET applications data

**Key Operations:**
- Add new application with form validation
- Edit application (pre-populated modal form)
- Delete with confirmation modal
- Filter table by iGate App selection
- Export functionality (Copy, CSV, Excel, PDF)
- Real-time table updates after operations

**Form Fields:**
- iGate App (text)
- CET App (text)
- SQL Server (text)
- Database (text)
- Support Link (URL)
- Description (textarea)
- Status (radio: Active/Inactive/Maintenance)
- Environment (dropdown: Production/Staging/Development)

---

### 4. CET Issues (`/cet-issues`)

**File:** `views/cet-issues-view.ejs`

**Purpose:**  
Comprehensive issue tracking and detailed analysis across all CET applications.

**Features:**
- Issues summary table (sortable by any column)
- Alert detail modal with comprehensive information
- Detailed issues table with full issue tracking
- Issue categorization and severity levels
- Resolution status tracking

**Configuration Files:**
- `public/config/cet-issues-columns.json` - Column definitions
- `public/config/cet-issues-filters.json` - Filter configuration
- `public/config/cet-issues-aria.json` - ARIA accessibility
- `public/config/cet-issues-keyboard.json` - Keyboard navigation

**Data Source:**
- `mockdata/mockDataCETIssues.js` - Mock CET issues data

**Key Features:**
- Two-table view:
  1. Summary table by application
  2. Detailed issues table
- Modal popup for alert details
- Issue severity classification
- Resolution tracking
- Assignment and ownership

---

### 5. CET Queues (`/cet-queues`)

**File:** `views/cet-queues-view.ejs`

**Purpose:**  
Monitor CET queue status and message processing across all systems.

**Features:**
- Queue summary cards (Total, Enabled, Disabled, Total Messages)
- DataTable with queue monitoring
- Message count tracking
- Queue status indicators
- Enable/disable status tracking

**Configuration Files:**
- `public/config/cet-queues-columns.json` - Column definitions
- `public/config/cet-queues-filters.json` - Filter configuration
- `public/config/cet-queues-footer.json` - Footer aggregations
- `public/config/cet-queues-aria.json` - ARIA accessibility
- `public/config/cet-queues-keyboard.json` - Keyboard navigation

**Data Source:**
- `mockdata/mockDataCETQueues.js` - Mock CET queues data

**Key Metrics:**
- Total queues count
- Enabled queues count
- Disabled queues count
- Total messages in queues
- Queue-specific message counts
- Queue status and health

---

## Common Features Across CET Views

### DataTable Integration
All CET views use the reusable DataTable wrapper with:
- Column sorting
- Advanced filtering
- Search capabilities
- Export functionality (Copy, CSV, Excel)
- ARIA support for accessibility
- Keyboard navigation
- Responsive design
- Footer aggregations (where applicable)

### Summary Cards
Each view includes Bootstrap cards displaying key metrics:
- Color-coded status indicators (success, warning, danger, info)
- Bootstrap Icons for visual clarity
- Real-time metric updates
- Responsive grid layout

### Accessibility
All CET views implement:
- Full ARIA support with screen reader announcements
- Keyboard navigation with shortcuts
- Semantic HTML structure
- Focus management
- Proper heading hierarchy

### Mock Data
All CET views use mock data for demonstration purposes:
- Located in `mockdata/` directory
- Realistic data structures
- Easy to replace with live API calls

---

## Navigation

CET views are accessible from the main navigation menu under "CET" dropdown:
- CET Dashboard
- CET Applications
- CET Applications Admin (CRUD operations)
- CET Issues
- CET Queues
- CET Reports

The navigation is defined in `views/partials/header.ejs`

---

## Architecture

### MVC Pattern (CET Apps)

The CET Applications feature follows the Model-View-Controller pattern:

**Routes** (`routes/cetAppsRoutes.js`)
- Defines URL patterns and HTTP methods
- Maps requests to controller functions
- Example: `GET /admin` → `cetAppsController.adminCETApps`

**Controllers** (`controllers/cetAppsController.js`)
- Handles HTTP request/response cycle
- Processes request data
- Calls service layer for data operations
- Returns responses with appropriate status codes

**Services** (`services/cetAppsService.js`)
- Data access abstraction layer
- Encapsulates CRUD operations
- Easy to swap mock data for database
- Provides consistent async/await interface

**Benefits:**
- Clean separation of concerns
- Easy to test individual components
- Database-agnostic design
- Maintainable and scalable

---

## Customization

### Updating Data Sources (CET Apps Example)

**For CET Apps with MVC pattern:**

1. **Update Service Layer** (`services/cetAppsService.js`)
   - Replace mock data calls with database queries
   - Maintain the same async function signatures
   - Example:
   ```javascript
   // Replace this:
   const mockDataCETApps = require('../mockdata/mockDataCETApps');
   exports.getAllApps = async () => {
     return mockDataCETApps.getAllApps();
   };
   
   // With this:
   const sql = require('mssql');
   exports.getAllApps = async () => {
     const pool = await sql.connect(config);
     const result = await pool.request().query('SELECT * FROM CETApps');
     return result.recordset;
   };
   ```

2. **No changes needed** in controllers, routes, or views
3. Data structure should remain compatible

**For other views (legacy pattern):**

1. Update the route in `app.js`
2. Replace mock data import with API call
3. Maintain the same data structure for compatibility

Example:
```javascript
// Replace this:
const cetData = require('./mockdata/mockDataCET');

// With this:
app.get('/cet-dashboard', async (req, res) => {
  const cetData = await fetch('https://your-api.com/cet/dashboard');
  res.render('cet-dashboard', { data: cetData });
});
```

### Customizing Columns
Edit the corresponding JSON file in `public/config/`:
- Modify column definitions
- Add/remove columns
- Change render functions
- Update sorting and filtering options

### Customizing Filters
Edit the `*-filters.json` files to:
- Add new filter types
- Modify filter options
- Change filter positions
- Update filter logic

---

## File Structure

```
views/
├── cet-dashboard.ejs          # CET main dashboard
├── cet-apps-view.ejs          # CET applications registry
├── cet-issues-view.ejs        # CET issues tracking
└── cet-queues-view.ejs        # CET queue monitoring

mockdata/
├── mockDataCET.js             # CET dashboard data
├── mockDataCETApps.js         # CET applications data
├── mockDataCETIssues.js       # CET issues data
└── mockDataCETQueues.js       # CET queues data

public/config/
├── cet-dashboard-*.json       # Dashboard configurations
├── cet-apps-*.json            # Applications configurations
├── cet-issues-*.json          # Issues configurations
└── cet-queues-*.json          # Queues configurations
```

---

## Future Enhancements

Potential improvements for CET views:
1. Real-time data updates via WebSockets
2. Alert notifications for critical issues
3. Historical trend analysis and charts
4. Custom dashboards per user
5. Advanced filtering and search
6. Export to PDF reports
7. Integration with ticketing systems
8. Automated issue assignment
9. SLA tracking and monitoring
10. Queue performance analytics

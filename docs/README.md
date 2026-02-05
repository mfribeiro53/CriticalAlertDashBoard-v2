# Error Alert Dashboard - Documentation

## Overview

The Error Alert Dashboard is a Node.js/Express application with comprehensive data table and card components built using a configuration-driven architecture. The application includes specialized CET (Central Engine Technology) views for monitoring system health and managing issues.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Application**
   ```bash
   npm start
   ```

3. **Access the Application**
   - Navigate to `http://localhost:3000`

## Core Components

### 1. DataTable Wrapper
A powerful, configuration-driven DataTable component with extensive features.

**Key Features:**
- Advanced filtering (6 filter types)
- Row selection & bulk operations
- Inline cell editing
- Advanced search with regex support
- Column grouping (nested headers)
- Data aggregation footer
- Row actions (view/edit/delete)
- Full accessibility (ARIA + keyboard navigation)

**Documentation:**
- [DATATABLE_QUICK_START.md](partials/DATATABLE_QUICK_START.md) - Quick start guide
- [DATATABLE_CONFIGURATION.md](DATATABLE_CONFIGURATION.md) - Configuration reference
- [DATATABLE_FEATURES.md](DATATABLE_FEATURES.md) - Complete feature reference
- [CUSTOMIZING_TABLES.md](CUSTOMIZING_TABLES.md) - JavaScript customization guide

### 2. Card Wrapper
Reusable, configuration-driven Bootstrap card component with multiple card types.

**Card Types:**
- Stat cards (metrics & KPIs)
- Chart cards (data visualization)
- List cards (ordered/unordered lists)
- Table cards (embedded tables)
- Info cards (notifications/alerts)
- Custom cards (flexible content)

**Configuration-Driven Design:**
- Card IDs and click actions defined in JSON config files
- No hard-coded card IDs in JavaScript
- Single source of truth for all card properties

**Documentation:**
- [CARD_QUICK_START.md](CARD_QUICK_START.md) - Getting started
- [CARD_CONFIGURATION.md](CARD_CONFIGURATION.md) - Configuration reference
- [CARD_FEATURES.md](CARD_FEATURES.md) - Complete features guide

### 3. CET Views
Specialized views for CET (Central Engine Technology) system monitoring.

**Views:**
- **CET Dashboard** (`/cet-dashboard`) - System health monitoring with application status cards
- **CET Applications** (`/cet-apps`) - Application registry & configuration management
- **CET Issues** (`/cet-issues`) - Issue tracking & analysis with multiple detail views
- **CET Queues** (`/cet-queues`) - Queue monitoring & message management
- **CET Reports** (`/cet-reports`) - Segment execution reporting & analytics

**Documentation:** [CET_VIEWS.md](CET_VIEWS.md)

## Architecture

### MVC Pattern
The application follows the Model-View-Controller pattern for all routes:

```
app.js (58 lines)
    ↓
Routes (routes/*.js) - URL patterns & HTTP methods
    ↓
Controllers (controllers/*.js) - Request handling
    ↓
Services (services/*.js) - Business logic & data access
    ↓
Data Sources (mockdata/*.js or database)
```

**Benefits:**
- ✅ Separation of concerns
- ✅ Easy to test individual layers
- ✅ Database agnostic (swap mock data for SQL Server in services only)
- ✅ Consistent patterns across all features
- ✅ Clean, maintainable codebase

**Implemented Routes:**
- `/cet-dashboard` - Dashboard view
- `/cet-apps` - Applications management (view + admin + API)
- `/cet-issues` - Issues tracking
- `/cet-queues` - Queue monitoring
- `/cet-reports` - Reporting & analytics
- `/api` - API endpoints

### Configuration-Driven Design
Both DataTable and Card components use JSON configuration files for:
- Column definitions
- Filter configurations
- ARIA labels
- Keyboard shortcuts
- Footer aggregations
- Custom behaviors

**Benefits:**
- 80-90% faster implementation
- Consistent user experience
- Easy maintenance
- DRY principles

### File Organization

```
docs/                           # Documentation
app.js                          # Express server (58 lines, route delegation only)
routes/                         # Route definitions (MVC)
  ├── cetDashboardRoutes.js
  ├── cetAppsRoutes.js
  ├── cetIssuesRoutes.js
  ├── cetQueuesRoutes.js
  ├── cetReportsRoutes.js
  └── apiRoutes.js
controllers/                    # Request handlers (MVC)
  ├── cetDashboardController.js
  ├── cetAppsController.js
  ├── cetIssuesController.js
  ├── cetQueuesController.js
  ├── cetReportsController.js
  └── apiController.js
services/                       # Business logic & data access (MVC)
  ├── configService.js       # Config loading utility
  ├── cetDashboardService.js
  ├── cetAppsService.js
  ├── cetIssuesService.js
  ├── cetQueuesService.js
  ├── cetReportsService.js
  └── apiService.js
mockdata/                       # Mock data sources
  ├── mockDataCET.js
  ├── mockDataCETApps.js
  ├── mockDataCETIssues.js
  ├── mockDataCETQueues.js
  └── mockDataCETReports.js
public/
  ├── config/                   # JSON configurations
  │   ├── *-columns.json       # Column definitions
  │   ├── *-filters.json       # Filter configs
  │   ├── *-aria.json          # Accessibility
  │   └── cards/               # Card templates
  ├── css/                      # Stylesheets (Bootstrap-first)
  └── js/                       # JavaScript modules
      ├── datatable-*.js       # DataTable modules
      ├── card-*.js            # Card modules
      ├── table-custom-handlers.js  # DataTable customizations
      ├── card-custom-handlers.js       # Card generic utilities
      └── pages/               # Page-specific logic
          └── *-page.js        # Page initialization & binding
views/
  ├── cet-*.ejs                # CET view pages
  └── partials/                # Reusable components
      ├── datatable.ejs        # DataTable partial
      └── card.ejs             # Card partial
```

**Detailed Organization:** [FILE_ORGANIZATION.md](FILE_ORGANIZATION.md)

## Accessibility

The application includes comprehensive accessibility features:

### Screen Reader Support
- Live region announcements
- Descriptive ARIA labels
- Row/column position announcements
- Action and state changes

### Keyboard Navigation
- Arrow key navigation
- Keyboard shortcuts
- Focus management
- No mouse required

**User Guide:** [ACCESSIBILITY_GUIDE.md](ACCESSIBILITY_GUIDE.md)

## Customization

### DataTable Custom Handlers
DataTable-specific logic uses a namespace pattern in `table-custom-handlers.js`:

```javascript
export const customHandlers = {
  actions: { view, edit, delete, ... },
  filters: { getFilterConfig, validateFilter, ... },
  search: { customSearch, ... },
  footer: { customCalculation, ... }
}
```

### Card Architecture
Card components follow a three-layer **configuration-driven** architecture:

1. **Generic Utilities** (`card-custom-handlers.js`):
   - Reusable functions like `updateDashboardCard()`
   - Generic rendering and setup functions
   - No page-specific business logic or hard-coded IDs

2. **Orchestration** (`card-init.js`):
   - Loads configurations from JSON
   - Coordinates initialization
   - Handles errors

3. **Page-Specific Logic** (`pages/*-page.js`):
   - Page-specific data binding
   - Custom aggregation logic
   - Table-to-card data flow
   - Reads card IDs from config (no hard-coding)

**Configuration Files:**
- All card properties defined in JSON under `public/config/`
- Includes `cardId` (DOM element ID) and `clickAction` (navigation URL)
- Single source of truth for card behavior

### Styling Guidelines
This project follows a **Bootstrap-first approach**:
- ✅ Use Bootstrap utility classes (`.d-none`, `.text-danger`, `.mt-3`)
- ✅ Custom CSS uses Bootstrap variables (`var(--bs-primary)`)
- ❌ No inline `style=` attributes
- ❌ No hardcoded colors/spacing in custom CSS

### Adding Custom Features
1. For DataTables: Define behavior in `table-custom-handlers.js`
2. For Cards: Add generic utilities to `card-custom-handlers.js`, page logic to `pages/*-page.js`
3. Create configuration JSON file
4. Include in view template
5. Feature auto-initializes on page load

## Development

### Key Patterns

**DRY Script Loading:**
All views include scripts via `views/partials/footer.ejs` - single source of truth for script loading order.

**Auto-Initialization:**
Components auto-initialize on page load via `data-dt-config` and `data-card-config` attributes.

**Configuration Files:**
Store all table/card settings in JSON files under `public/config/` for easy maintenance.

### Developer Notes
Tips, gotchas, and lessons learned: [DEVELOPER_NOTES.md](DEVELOPER_NOTES.md)

## Implemented Features

### DataTable Features (9 total)
✅ Row Actions (View/Edit/Delete)  
✅ Advanced Filtering (6 filter types)  
✅ Row Selection & Bulk Operations  
✅ Data Aggregation Footer  
✅ Inline Editing  
✅ Advanced Search  
✅ Column Grouping  
✅ ARIA Support  
✅ Keyboard Navigation  

### Card Features
✅ 6 card types (stat, chart, list, table, info, custom)  
✅ Interactive features (collapse, refresh, close, fullscreen)  
✅ State persistence  
✅ Event system  
✅ Dark mode support  
✅ Responsive design  

### CET Views (5 views)
✅ Dashboard (system health monitoring)  
✅ Applications (registry & admin panel)  
✅ Issues (tracking with detail modals)  
✅ Queues (monitoring with message details)  
✅ Reports (segment execution analytics)  

## Technology Stack

- **Backend:** Node.js, Express
- **Template Engine:** EJS
- **Frontend:** Bootstrap 5, jQuery
- **DataTables:** 1.13.x with extensions
- **Export:** JSZip, pdfMake
- **Mock Data:** Custom mock data generators

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

When adding new features:
1. Follow existing patterns (configuration-driven)
2. Add JSON configuration files
3. Update relevant documentation
4. Include accessibility features
5. Add to `DEVELOPER_NOTES.md` if needed

## Documentation Files

### Essential Reference
- **README.md** (this file) - Main entry point
- **DATATABLE_FEATURES.md** - Complete DataTable feature reference
- **CARD_FEATURES.md** - Complete Card feature reference
- **CET_VIEWS.md** - CET views documentation
- **CUSTOMIZING_TABLES.md** - Developer customization guide
- **ACCESSIBILITY_GUIDE.md** - User accessibility guide
- **FILE_ORGANIZATION.md** - Architecture and file structure
- **DEVELOPER_NOTES.md** - Tips and insights

### Quick Reference
- **CARD_QUICK_START.md** - Fast start guide for cards
- **DATATABLE_ENHANCEMENTS.md** - Potential future enhancements

## License

[Add your license information here]

## Support

For questions or issues, refer to the documentation files above or contact the development team.

---

**Last Updated:** December 21, 2025

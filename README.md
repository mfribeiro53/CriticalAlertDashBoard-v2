# Error Alert Dashboard

A Node.js/Express application with comprehensive data table and card components built using a configuration-driven architecture.

## Features

- **DataTable Wrapper** - Configuration-driven data tables with 9 advanced features
- **Card Wrapper** - Reusable Bootstrap cards with 6 card types
- **CET Views** - Common Error Tracking system monitoring (5 specialized views)
- **Full Accessibility** - ARIA support and keyboard navigation
- **Mock Data** - Development-ready with comprehensive mock data

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

3. **Access the application:**
   - Open your browser to `http://localhost:3000`

## Documentation

All documentation is located in the [`docs/`](docs/) directory:

- **[README.md](docs/README.md)** - Main documentation entry point ⭐ START HERE
- **[DATATABLE_FEATURES.md](docs/DATATABLE_FEATURES.md)** - Complete DataTable feature reference
- **[CARD_FEATURES.md](docs/CARD_FEATURES.md)** - Complete Card feature reference
- **[CET_VIEWS.md](docs/CET_VIEWS.md)** - CET views documentation
- **[CUSTOMIZING_TABLES.md](docs/CUSTOMIZING_TABLES.md)** - Developer customization guide
- **[ACCESSIBILITY_GUIDE.md](docs/ACCESSIBILITY_GUIDE.md)** - User accessibility guide
- **[FILE_ORGANIZATION.md](docs/FILE_ORGANIZATION.md)** - Architecture and file structure
- **[DEVELOPER_NOTES.md](docs/DEVELOPER_NOTES.md)** - Tips and insights

## Technology Stack

- **Backend:** Node.js, Express
- **Template Engine:** EJS
- **Frontend:** Bootstrap 5, jQuery
- **DataTables:** 1.13.x with extensions
- **Export:** JSZip, pdfMake

## Project Structure

```
JS_Application_ErrorAlert_Dashboard/
├── app.js                    # Express server (main entry point)
├── package.json              # Dependencies
├── routes/                   # Route definitions (MVC)
│   └── cetAppsRoutes.js     # CET Apps routes
├── controllers/              # Request handlers (MVC)
│   └── cetAppsController.js # CET Apps controller
├── services/                 # Data access layer (MVC)
│   └── cetAppsService.js    # CET Apps service
├── docs/                     # Documentation
├── mockdata/                 # Mock data for development
├── public/                   # Static assets
│   ├── config/              # JSON configurations
│   ├── css/                 # Stylesheets
│   └── js/                  # JavaScript modules
│       └── pages/           # Page-specific JavaScript
└── views/                   # EJS templates
    ├── cet-*.ejs           # CET views
    └── partials/           # Reusable components
```

## Key Components

### DataTable Wrapper
9 implemented features including row actions, advanced filtering, row selection, inline editing, search, and full accessibility.

### Card Wrapper
6 card types (stat, chart, list, table, info, custom) with interactive features like collapse, refresh, and fullscreen.

### CET Views
6 specialized monitoring and management views:
- Dashboard - System health
- Applications - Registry & config
- Applications Admin - CRUD management for CET apps
- Issues - Issue tracking
- Queues - Queue monitoring
- Reports - Analytics

## Architecture

### MVC Pattern

The application follows the Model-View-Controller (MVC) pattern for maintainability and separation of concerns:

**Routes** (`routes/`) - Define URL endpoints and HTTP methods
- Map requests to controller functions
- Example: `GET /cet-apps/admin` → `cetAppsController.adminCETApps`

**Controllers** (`controllers/`) - Handle HTTP requests and responses
- Process request data
- Call service layer for data operations
- Return responses with proper status codes
- Example: `cetAppsController.js` handles all CET Apps endpoints

**Services** (`services/`) - Data access abstraction layer
- Encapsulate data operations (CRUD)
- Provide consistent interface for data access
- Easy to swap mock data for database connections
- Example: `cetAppsService.js` abstracts CET Apps data access

**Benefits:**
- Clean separation of concerns
- Easy to test individual components
- Database-agnostic (swap mock data for SQL Server easily)
- Maintainable and scalable codebase

## Development

### DataTable Customization

DataTable customization code goes in `public/js/table-custom-handlers.js` using the namespace pattern:

```javascript
export const customHandlers = {
  actions: { view, edit, delete, ... },
  filters: { ... },
  // ... other namespaces
}
```

### Card Customization

Card components follow a three-layer architecture:
- **Generic utilities**: `public/js/card-custom-handlers.js`
- **Orchestration**: `public/js/card-init.js`
- **Page-specific logic**: `public/js/pages/*-page.js`

### Styling

This project follows a **Bootstrap-first approach**:
- No inline `style=` attributes in templates
- Use Bootstrap utility classes (`.d-none`, `.text-danger`, `.mt-3`, etc.)
- Custom CSS uses Bootstrap CSS variables (`var(--bs-primary)`, etc.)
- Custom CSS only when Bootstrap doesn't provide the functionality

See [CUSTOMIZING_TABLES.md](docs/CUSTOMIZING_TABLES.md) and [DEVELOPER_NOTES.md](docs/DEVELOPER_NOTES.md) for detailed instructions.

## License

[Add your license information here]

---

**For complete documentation, see [docs/README.md](docs/README.md)**

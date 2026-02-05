# CET Dashboard - Copilot Instructions

## Architecture Overview

This is a **configuration-driven** Node.js/Express dashboard for CET (Central Engine Technology) monitoring. The key design principle: **behavior is defined in config files, not code**.

### Layer Pattern (Routes → Controllers → Services → Database)
```
routes/cetAppsRoutes.js     → URL endpoints, HTTP verbs
controllers/cetAppsController.js → Request/response handling, config loading
services/cetAppsService.js  → Business logic, calls dbService
services/dbService.js       → SQL Server connection, stored procedure execution
database/sprocs/*.sql       → All data access via stored procedures
```

When adding a new feature, follow this pattern exactly. All database operations MUST use stored procedures via `dbService.executeQuery('EXEC dbo.usp_ProcName @Param', { Param: value })`.

## Configuration-Driven Components

### DataTables & Forms
Configuration files in `public/yaml-config/` (preferred) or `public/config/` (JSON fallback):
- `*-columns.yaml` - Column definitions with render functions
- `*-filters.yaml` - Advanced filter configurations  
- `*-footer.yaml` - Aggregation/footer rows
- `*-aria.yaml` - Accessibility labels
- `*-form.yaml` - Dynamic form field definitions

The `configService.loadConfig(name, propertyPath, default)` loads YAML first, falls back to JSON.

### Render Functions
Column render functions are defined by **string name** in config, resolved via registry in [public/js/table-init.js](public/js/table-init.js):
```yaml
# In cet-apps-columns.yaml
- data: status
  render: renderStatusBadge  # Maps to function in table-helpers.js
```

Add new render functions to [public/js/table-helpers.js](public/js/table-helpers.js) or [public/js/helpers/cet-render-helpers.js](public/js/helpers/cet-render-helpers.js).

## Key Patterns

### Views Use Partials
All EJS views follow this structure:
```ejs
<%- include('partials/head', { pageTitle: 'Title', includeDataTables: true }) %>
<%- include('partials/header') %>
<!-- Page content using partials/datatable.ejs, partials/card.ejs -->
<%- include('partials/footer') %>
```

The `footer.ejs` partial loads ALL JavaScript in correct order—never add scripts directly to views.

### Adding a New CET View
1. Create stored procedures in `database/sprocs/` (numbered for deploy order)
2. Create config files in `public/yaml-config/` (columns, filters, etc.)
3. Add service in `services/cet{Feature}Service.js`
4. Add controller in `controllers/cet{Feature}Controller.js`
5. Add routes in `routes/cet{Feature}Routes.js`
6. Register routes in `app.js`: `app.use('/cet-{feature}', require('./routes/cet{Feature}Routes'))`
7. Create view in `views/cet-{feature}-view.ejs`

### DataTable Partial Parameters
Key params for [views/partials/datatable.ejs](views/partials/datatable.ejs):
- `columns` - Column config array (required)
- `dataSource` - Data array or null for AJAX
- `filterConfig`, `footerConfig`, `ariaConfig` - Feature configs
- `autoInit: false` - For manual initialization (admin pages)

## Commands

```bash
npm start          # Start server (port 3000)
npm run dev        # Start with nodemon (auto-reload)
node deployAllSprocs.js    # Deploy stored procedures to database
node testDbConnection.js   # Test database connectivity
```

## Database Requirements

Requires `.env` file with:
```
DB_SERVER=your_server
DB_DATABASE=your_database
DB_USER=your_user
DB_PASSWORD=your_password
```

Stored procedures are numbered (01_, 02_, etc.) in `database/sprocs/` for execution order during deployment.

## Frontend Module Pattern

JavaScript uses ES6 modules with registry pattern (no global namespace pollution):
- Feature modules: `table-feature-*.js` (filters, selection, editing, etc.)
- Helpers imported as namespace: `import * as tableHelpers from './table-helpers.js'`
- Custom handlers: `table-custom-handlers.js`, `card-custom-handlers.js`

## Documentation

Comprehensive docs in `docs/` directory:
- [FILE_ORGANIZATION.md](docs/FILE_ORGANIZATION.md) - Architecture details
- [DATATABLE_FEATURES.md](docs/DATATABLE_FEATURES.md) - DataTable feature reference
- [CARD_FEATURES.md](docs/CARD_FEATURES.md) - Card component reference
- [DEVELOPER_NOTES.md](docs/DEVELOPER_NOTES.md) - Tips and lessons learned

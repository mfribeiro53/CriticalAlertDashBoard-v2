# DataTable System - File Organization

## Overview
This project uses a scalable, namespace-based architecture for customizing DataTable functionality. All custom logic lives in ONE file for simplicity, while feature implementations are separated into their own files.

## Key Architecture Principle: DRY Scripts 🎯

**All view pages (*.ejs) include scripts via a single footer partial:**
```ejs
<%- include('partials/footer') %>
```

**Benefits:**
- ✅ Single source of truth for script loading
- ✅ Prevents "waiting for libraries" bugs
- ✅ Consistent script load order across all pages
- ✅ Easy to add new features (update one file)
- ✅ Eliminates duplicate script maintenance

**The footer partial (`views/partials/footer.ejs`) contains ALL required scripts in the correct order:**
1. jQuery & Bootstrap
2. DataTables core & extensions
3. Export dependencies (JSZip, PDFMake)
4. Custom handlers namespace
5. All feature modules (filters, selection, editing, search, reorder, etc.)
6. DataTable initialization (must be last)

## File Naming Conventions

### Core Files (Don't Modify)
- `table-helpers.js` - Render functions and utilities
- `table-*.js` - Default implementations for features
  - `table-actions.js` - Row actions (view, edit, delete)
  - `table-filters.js` - Advanced filtering (future)
  - `table-exports.js` - Export customization (future)
  - `table-editing.js` - Inline editing (future)
  - `table-bulk.js` - Bulk operations (future)

### Customization File (Customize Here)
- `custom-handlers.js` ⭐ - ALL application-specific custom logic
  - Organized by feature namespace
  - One file for all customizations
  - Easy to locate and maintain

## Directory Structure

```
JS_Application_ErrorAlert_Dashboard/
├── app.js                     # Express server setup & route delegation
├── routes/                    # Route definitions (MVC pattern)
│   ├── cetDashboardRoutes.js # CET Dashboard routes
│   ├── cetAppsRoutes.js      # CET Apps routes
│   ├── cetIssuesRoutes.js    # CET Issues routes
│   ├── cetQueuesRoutes.js    # CET Queues routes
│   ├── cetReportsRoutes.js   # CET Reports routes
│   └── apiRoutes.js          # API routes
├── controllers/               # Request handlers (MVC pattern)
│   ├── cetDashboardController.js
│   ├── cetAppsController.js
│   ├── cetIssuesController.js
│   ├── cetQueuesController.js
│   ├── cetReportsController.js
│   └── apiController.js
├── services/                  # Data access & business logic (MVC pattern)
│   ├── configService.js      # Configuration file loading
│   ├── cetDashboardService.js
│   ├── cetAppsService.js
│   ├── cetIssuesService.js
│   ├── cetQueuesService.js
│   ├── cetReportsService.js
│   └── apiService.js
├── mockdata/                  # Mock data sources
│   ├── mockDataCET.js
│   ├── mockDataCETApps.js
│   ├── mockDataCETIssues.js
│   ├── mockDataCETQueues.js
│   └── mockDataCETReports.js
├── public/
│   ├── config/               # JSON configurations
│   │   ├── *-columns.json   # Column definitions
│   │   ├── *-filters.json   # Filter configs
│   │   ├── *-aria.json      # Accessibility
│   │   └── cards/           # Card templates
│   ├── css/                  # Stylesheets (Bootstrap-first)
│   └── js/                   # JavaScript modules
│       ├── lib/              # Modular kit libraries
│       │   ├── datatable-kit/   # DataTable enhancements
│       │   │   ├── core/        # table-init.js, table-custom-handlers.js
│       │   │   ├── features/    # table-feature-*.js modules
│       │   │   ├── helpers/     # table-helpers.js render functions
│       │   │   ├── css/         # Feature-specific styles
│       │   │   └── index.js     # Main entry point
│       │   ├── card-kit/        # Card enhancements
│       │   │   ├── core/        # card-init.js, card-helpers.js
│       │   │   ├── handlers/    # card-custom-handlers.js
│       │   │   ├── css/         # Card styles
│       │   │   └── index.js     # Main entry point
│       │   └── form-kit/        # Form enhancements
│       │       ├── core/        # form-init.js, form-dynamic.js
│       │       ├── helpers/     # form-helpers.js
│       │       ├── features/    # form-feature-validators.js
│       │       └── index.js     # Main entry point
│       ├── table-init-bridge.js     # Bridge for datatable-kit
│       ├── card-init-bridge.js      # Bridge for card-kit
│       └── pages/               # Page-specific logic
│           └── *-page.js        # Page initialization & binding
├── views/
│   ├── cet-*.ejs            # CET view pages
│   └── partials/            # Reusable components
│       ├── datatable.ejs    # DataTable partial
│       └── card.ejs         # Card partial
└── docs/                     # Documentation
```

## Namespace Organization

All custom handlers are accessed via `window.customHandlers.*`:

```javascript
window.customHandlers = {
  // HP1: Row Actions ✅
  actions: {
    view: customViewAction,
    edit: customEditAction,
    delete: customDeleteAction,
    validate: validateAction,
    shouldShowButton: shouldShowButton,
    getCustomActions: getCustomActions,
    getToastMessage: getToastMessage
  },
  
  // HP2: Advanced Filtering ✅
  filters: {
    getFilterConfig: customFilterConfig,
    validateFilterValue: validateFilter,
    customFilterLogic: customFilterLogic,
    onFilterChange: onFilterChangeHandler,
    getFilterOptions: getCustomFilterOptions
  },
  
  // Future features (add as needed)
  exports: { /* ... */ },
  editing: { /* ... */ },
  bulk: { /* ... */ }
}
```

## Why This Architecture?

### Single Customization File
✅ **Easy to find** - All custom code in one place  
✅ **Easy to maintain** - No hunting through multiple files  
✅ **Easy to backup** - One file to version control carefully  
✅ **Easy to share** - Copy one file between projects  
✅ **Clear separation** - Custom vs default code

### Feature-Specific Implementation Files
✅ **Organized** - Each feature has its own file  
✅ **Modular** - Load only what you need  
✅ **Maintainable** - Update core features independently  
✅ **Testable** - Test features in isolation

### Namespace Organization
✅ **Scalable** - Add features without conflicts  
✅ **Discoverable** - Clear what's available  
✅ **Type-safe** - Easy to document and autocomplete  
✅ **Consistent** - Same pattern for all features

## Adding New Features

When implementing new table features:

### 1. Create Feature Implementation File
`public/js/table-newfeature.js`
```javascript
/**
 * New Feature - Default Implementation
 * Checks for custom handlers before using defaults
 */
(function() {
  'use strict';
  
  function initializeFeature() {
    // Check for custom handler
    if (window.customHandlers?.newfeature?.handler) {
      window.customHandlers.newfeature.handler();
    } else {
      // Default behavior
      defaultImplementation();
    }
  }
  
  // ... more code
})();
```

### 2. Add Namespace to Custom Handlers
`public/js/custom-handlers.js`
```javascript
window.customHandlers = {
  actions: { /* ... */ },
  
  // New feature namespace
  newfeature: {
    handler: function() {
      // Custom implementation
    }
  }
};
```

### 3. Update Documentation
- Add to `DATATABLE_FEATURES.md` (current features)
- Update `CUSTOMIZING_TABLES.md` (how to customize)
- Update this file (FILE_ORGANIZATION.md)

### 4. Include in Views
```html
<!-- Feature implementation -->
<script src="/js/table-newfeature.js"></script>
```

## Loading Order

Scripts must load in this order:

```html
<!-- 1. Core helpers -->
<script src="/js/table-helpers.js"></script>

<!-- 2. Custom handlers (BEFORE features) -->
<script src="/js/custom-handlers.js"></script>

<!-- 3. Feature implementations -->
<script src="/js/table-feature-actions.js"></script>
<script src="/js/table-feature-filters.js"></script>
<!-- ... other features ... -->
```

## File Naming Rules

### Pattern: `table-feature-{name}.js`
Examples:
- `table-feature-actions.js` - Row actions
- `table-feature-filters.js` - Advanced filtering
- `table-feature-exports.js` - Export customization
- `table-feature-editing.js` - Inline editing
- `table-feature-bulk.js` - Bulk operations
- `table-feature-selection.js` - Row selection
- `table-feature-search.js` - Advanced search

### Custom Handlers: `custom-handlers.js`
- Single file for ALL customizations
- Namespace matches feature name
- `window.customHandlers.{feature}.*`

### Helpers: `table-helpers.js`
- Render functions
- Utility functions
- No feature-specific logic

## Documentation Files

- `DATATABLE_FEATURES.md` - Current implemented features
- `DATATABLE_ENHANCEMENTS.md` - Planned future features
- `CUSTOMIZING_TABLES.md` - How to customize (developer guide)
- `FILE_ORGANIZATION.md` - This file (architecture overview)

## Benefits Summary

### For Developers
- **One file to customize** - `custom-handlers.js`
- **Clear structure** - Know where everything goes
- **Easy debugging** - Namespace makes it obvious what's custom
- **Portable** - Copy custom-handlers.js to new projects

### For Maintainers
- **Organized** - Features separated logically
- **Extensible** - Add features without refactoring
- **Consistent** - Same pattern everywhere
- **Documented** - Clear architecture and conventions

### For Teams
- **Collaboration-friendly** - Less merge conflicts
- **Onboarding** - Easy to understand structure
- **Review-friendly** - Changes are localized
- **Testable** - Features can be tested independently

## Migration Guide

If you have existing custom code:

1. **Move all custom logic** to `custom-handlers.js`
2. **Organize by namespace** (actions, filters, etc.)
3. **Update references** from `customActions` to `customHandlers.actions`
4. **Test thoroughly** - Ensure fallbacks work

## Questions?

- Check `CUSTOMIZING_TABLES.md` for how to customize
- Check `DATATABLE_FEATURES.md` for available features
- Look at existing `table-*.js` files for patterns
- All your code goes in `custom-handlers.js`

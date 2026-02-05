# Head Partial - Centralized Stylesheet Management

## Overview

The `head.ejs` partial consolidates all `<link>` stylesheet references into a single, maintainable file. This prevents duplication across view files and makes it easy to add, remove, or update stylesheets.

## Usage

Include the partial in your view files like this:

```ejs
<!DOCTYPE html>
<html lang="en">
<%- include('partials/head', { 
  pageTitle: 'Your Page Title',
  includeDataTables: true,
  includeCardView: false,
  includeFilters: true,
  includeSelection: true,
  includeFooter: true,
  includeEditing: true,
  includeSearch: true,
  includeReorder: true,
  includeColumnGroups: false
}) %>
<body>
  <!-- Your content here -->
</body>
</html>
```

## Parameters

### Required Parameters

- **`pageTitle`** (string) - The page title shown in the browser tab

### Optional Parameters (all default to `false`)

#### Core Features
- **`includeDataTables`** (boolean) - Include DataTables core CSS libraries
  - Adds: `dataTables.bootstrap5.min.css`, `responsive.bootstrap5.min.css`, `buttons.bootstrap5.min.css`

- **`includeCardView`** (boolean) - Include card view styling
  - Adds: `card-view.css`

#### DataTable Feature Styles
These only apply when `includeDataTables: true`

- **`includeColumnGroups`** (boolean) - Column grouping styles
  - Adds: `table-column-groups.css`

- **`includeFilters`** (boolean) - Column filter styles
  - Adds: `table-filters.css`

- **`includeSelection`** (boolean) - Row selection checkbox styles
  - Adds: `row-selection.css`

- **`includeFooter`** (boolean) - Footer aggregate calculation styles
  - Adds: `table-footer.css`

- **`includeEditing`** (boolean) - Inline editing styles
  - Adds: `table-editing.css`

- **`includeSearch`** (boolean) - Search enhancement styles
  - Adds: `table-search.css`

- **`includeReorder`** (boolean) - Column reordering styles
  - Adds: `table-reorder.css`

## Always Included

These stylesheets are included on every page automatically:

- **Bootstrap 5 CSS** - `/node_modules/bootstrap/dist/css/bootstrap.min.css`
- **Bootstrap Icons** - `/node_modules/bootstrap-icons/font/bootstrap-icons.css`
- **Base Custom Styles** - `/css/styles.css`

## Examples

### Simple Alert List (No DataTables)
```ejs
<%- include('partials/head', { 
  pageTitle: 'Error Alert Dashboard',
  includeDataTables: false,
  includeCardView: false
}) %>
```

### Card View
```ejs
<%- include('partials/head', { 
  pageTitle: 'Error Alert Dashboard - Card View',
  includeDataTables: false,
  includeCardView: true
}) %>
```

### Basic DataTable
```ejs
<%- include('partials/head', { 
  pageTitle: 'User Management',
  includeDataTables: true
}) %>
```

### Full-Featured DataTable
```ejs
<%- include('partials/head', { 
  pageTitle: 'Error Alert Dashboard - Table View',
  includeDataTables: true,
  includeFilters: true,
  includeSelection: true,
  includeFooter: true,
  includeEditing: true,
  includeSearch: true,
  includeReorder: true
}) %>
```

### DataTable with Column Groups
```ejs
<%- include('partials/head', { 
  pageTitle: 'Demographics - Column Grouping Demo',
  includeDataTables: true,
  includeColumnGroups: true,
  includeFilters: true,
  includeSelection: true,
  includeFooter: true,
  includeEditing: true,
  includeSearch: true,
  includeReorder: true
}) %>
```

## Adding New Stylesheets

To add a new stylesheet:

1. **Edit `views/partials/head.ejs`**
2. **Add a new parameter** with descriptive name (e.g., `includeMyFeature`)
3. **Add conditional block**:
   ```ejs
   <% if (includeMyFeature) { %>
   <link href="/css/my-feature.css" rel="stylesheet">
   <% } %>
   ```
4. **Update this README** with the new parameter

## Modifying Existing Stylesheets

To change the path or add/remove stylesheets:

1. **Edit only `views/partials/head.ejs`**
2. All views using that feature will automatically get the updated stylesheet

## Benefits

✅ **Single source of truth** - All stylesheet references in one file  
✅ **Easy maintenance** - Update once, applies everywhere  
✅ **Reduced duplication** - No copy-paste of `<link>` tags  
✅ **Clear dependencies** - Parameters show what features each view uses  
✅ **Performance** - Only load stylesheets you actually need  
✅ **Consistency** - All views use the same versions/paths  

## Best Practices

1. **Only include what you need** - Don't set all parameters to `true`
2. **Be explicit** - Set parameters even if `false` to document intent
3. **Use meaningful page titles** - Help users identify browser tabs
4. **Test after changes** - Verify stylesheets load correctly
5. **Keep parameters alphabetical** - Makes them easier to scan

## Related Files

- **`views/partials/head.ejs`** - The actual partial template
- **`views/partials/header.ejs`** - Navigation bar component
- **`views/partials/footer.ejs`** - Page footer with scripts
- **`views/partials/datatable.ejs`** - DataTable wrapper component

# DataTable Configuration Reference

> **📚 Documentation Navigation:**
> - [DATATABLE_QUICK_START.md](partials/DATATABLE_QUICK_START.md) - Quick start guide and basic usage
> - [DATATABLE_FEATURES.md](DATATABLE_FEATURES.md) - Complete feature reference (21+ implemented features)
> - **This document** - Configuration file structure and reference
> - [DATATABLE_ENHANCEMENTS.md](DATATABLE_ENHANCEMENTS.md) - Planned enhancements and roadmap
> - [DATATABLE_ORGANIZATION.md](DATATABLE_ORGANIZATION.md) - Architecture and module organization
> - [CUSTOMIZING_TABLES.md](CUSTOMIZING_TABLES.md) - JavaScript customization guide

## Overview

DataTables in this application follow a **configuration-driven architecture** where table behavior, columns, filters, accessibility features, and more are defined in JSON configuration files rather than hard-coded in JavaScript or EJS templates.

## Configuration File Structure

Each table/view typically has up to 7 configuration files:

```
public/config/
├── {view-name}-columns.json     # Column definitions (required)
├── {view-name}-filters.json     # Filter configuration (optional)
├── {view-name}-footer.json      # Footer aggregations (optional)
├── {view-name}-aria.json        # Accessibility labels (optional)
├── {view-name}-keyboard.json    # Keyboard shortcuts (optional)
├── {view-name}-cards.json       # Associated card configs (optional)
└── {view-name}-form.json        # Form definitions (optional)
```

### Example: CET Dashboard Table

```
cet-dashboard-columns.json
cet-dashboard-filters.json
cet-dashboard-footer.json
cet-dashboard-aria.json
cet-dashboard-keyboard.json
cet-dashboard-cards.json
```

---

## Column Configuration (`*-columns.json`)

### Purpose
Defines table structure, data mapping, rendering, and behavior for each column.

### File Structure

```json
{
  "groupName": [
    {
      "data": "fieldName",
      "title": "Column Header",
      "width": "10%",
      "orderable": true,
      "searchable": true,
      "className": "text-center",
      "render": "renderFunctionName",
      "responsivePriority": 1
    }
  ]
}
```

### Property Reference

#### data (Required)
- **Type:** String
- **Purpose:** Property path in the data object
- **Supports:** Dot notation for nested objects (e.g., `"user.profile.email"`)
- **Example:** `"iGateApp"`, `"user.name"`, `"stats.count"`

#### title (Required)
- **Type:** String
- **Purpose:** Display text for column header
- **Example:** `"Application Name"`, `"Status"`, `"Last Updated"`

#### width (Optional)
- **Type:** String
- **Purpose:** Column width (fixed or percentage)
- **Example:** `"100px"`, `"15%"`, `"auto"`
- **Default:** Auto-sized by DataTables

#### orderable (Optional)
- **Type:** Boolean
- **Purpose:** Enable/disable sorting for this column
- **Example:** `true`, `false`
- **Default:** `true`

#### searchable (Optional)
- **Type:** Boolean
- **Purpose:** Include column in global search
- **Example:** `true`, `false`
- **Default:** `true`

#### className (Optional)
- **Type:** String
- **Purpose:** CSS classes for column cells
- **Example:** `"text-center fw-bold"`, `"text-end"`, `"text-start"`
- **Common Values:**
  - `"text-start"` - Left align
  - `"text-center"` - Center align
  - `"text-end"` - Right align
  - `"fw-bold"` - Bold text
  - `"text-muted"` - Muted color

#### render (Optional)
- **Type:** String
- **Purpose:** Name of custom render function from `table-helpers.js`
- **Example:** `"renderSeverityBadge"`, `"renderTimestamp"`, `"renderActionButtons"`
- **Built-in Renders:**
  - `renderSeverityBadge` - Color-coded severity levels
  - `renderStatusBadge` - Status indicators
  - `renderTimestamp` - Relative time formatting
  - `renderCETMessages` - CET message count badges
  - `renderCETThresholdAlerts` - CET issue count badges
  - `renderCETAlerts` - CET alert badges
  - `renderCETDisabledQueues` - Disabled queue badges
  - `renderCETProcessesBehind` - Process delay badges
  - `renderActionButtons` - View/edit/delete buttons

#### responsivePriority (Optional)
- **Type:** Number
- **Purpose:** Control column visibility on mobile devices
- **Example:** `1`, `2`, `3`, `10000`
- **Values:**
  - `1` - Always visible (highest priority)
  - `2-9999` - Hide in order on smaller screens
  - `10000` - Hide first (lowest priority)

#### defaultContent (Optional)
- **Type:** String
- **Purpose:** Content to display when data is null/undefined
- **Example:** `"-"`, `"N/A"`, `""`
- **Default:** Empty string

#### visible (Optional)
- **Type:** Boolean
- **Purpose:** Initial visibility of column
- **Example:** `true`, `false`
- **Default:** `true`

### Complete Example

```json
{
  "cet": [
    {
      "data": "iGateApp",
      "title": "iGate App",
      "width": "10%",
      "orderable": true,
      "searchable": true,
      "className": "text-start fw-bold",
      "responsivePriority": 1
    },
    {
      "data": "messages",
      "title": "Messages",
      "width": "10%",
      "orderable": true,
      "className": "text-center",
      "render": "renderCETMessages",
      "responsivePriority": 5
    },
    {
      "data": "issues",
      "title": "Issues",
      "width": "10%",
      "orderable": true,
      "className": "text-center",
      "render": "renderCETThresholdAlerts",
      "responsivePriority": 3
    }
  ]
}
```

---

## Filter Configuration (`*-filters.json`)

### Purpose
Defines column-specific filters with various input types.

### File Structure

```json
{
  "filters": [
    {
      "column": "columnName",
      "type": "filterType",
      "label": "Filter Label",
      "placeholder": "Placeholder text",
      "options": []
    }
  ]
}
```

### Property Reference

#### column (Required)
- **Type:** String
- **Purpose:** Column data property to filter
- **Example:** `"status"`, `"severity"`, `"iGateApp"`

#### type (Required)
- **Type:** String
- **Purpose:** Filter input type
- **Values:**
  - `"text"` - Text input with debounce
  - `"select"` - Single-select dropdown
  - `"multi-select"` - Multi-select dropdown
  - `"date"` - Single date picker
  - `"dateRange"` - Date range picker
  - `"range"` - Numeric range (min/max)

#### label (Required)
- **Type:** String
- **Purpose:** Display label for filter
- **Example:** `"Status"`, `"Severity Level"`, `"Date Range"`

#### placeholder (Optional)
- **Type:** String
- **Purpose:** Placeholder text for input
- **Example:** `"Filter by status"`, `"Select severity"`

#### options (Required for select/multi-select)
- **Type:** Array of objects
- **Purpose:** Available options for dropdowns
- **Structure:** `[{ "value": "key", "label": "Display" }]`
- **Example:**
  ```json
  "options": [
    { "value": "open", "label": "Open" },
    { "value": "closed", "label": "Closed" },
    { "value": "pending", "label": "Pending" }
  ]
  ```

### Filter Type Examples

#### Text Filter
```json
{
  "column": "name",
  "type": "text",
  "label": "Name",
  "placeholder": "Search by name"
}
```

#### Select Filter
```json
{
  "column": "status",
  "type": "select",
  "label": "Status",
  "placeholder": "Filter by Status",
  "options": [
    { "value": "active", "label": "Active" },
    { "value": "inactive", "label": "Inactive" }
  ]
}
```

#### Date Range Filter
```json
{
  "column": "createdAt",
  "type": "dateRange",
  "label": "Created Date",
  "placeholder": "Select date range"
}
```

#### Numeric Range Filter
```json
{
  "column": "count",
  "type": "range",
  "label": "Count",
  "placeholder": "Min - Max"
}
```

### Complete Example

```json
{
  "filters": [
    {
      "column": "iGateApp",
      "type": "select",
      "label": "iGate App",
      "placeholder": "Filter by iGate App"
    },
    {
      "column": "status",
      "type": "multi-select",
      "label": "Status",
      "placeholder": "Filter by Status",
      "options": [
        { "value": "active", "label": "Active" },
        { "value": "inactive", "label": "Inactive" },
        { "value": "pending", "label": "Pending" }
      ]
    },
    {
      "column": "createdDate",
      "type": "dateRange",
      "label": "Created",
      "placeholder": "Select date range"
    }
  ]
}
```

---

## Footer Configuration (`*-footer.json`)

### Purpose
Defines footer row with aggregated calculations (sum, average, count, etc.).

### File Structure

```json
{
  "enabled": true,
  "columns": [
    {
      "columnIndex": 0,
      "content": "Total:",
      "className": "fw-bold text-end"
    },
    {
      "columnIndex": 2,
      "aggregation": "sum",
      "className": "text-center fw-bold"
    }
  ]
}
```

### Property Reference

#### enabled (Required)
- **Type:** Boolean
- **Purpose:** Enable/disable footer
- **Example:** `true`, `false`

#### columns (Required if enabled)
- **Type:** Array of objects
- **Purpose:** Define footer cells

#### columnIndex (Required)
- **Type:** Number
- **Purpose:** Zero-based column index
- **Example:** `0`, `1`, `2`

#### content (Optional)
- **Type:** String
- **Purpose:** Static content to display (use this OR aggregation, not both)
- **Example:** `"Total:"`, `"Summary"`, `""`
- **Note:** Can be HTML string for formatted content

#### aggregation (Optional)
- **Type:** String
- **Purpose:** Aggregation type for calculated values (use this OR content, not both)
- **Values:**
  - `"sum"` - Sum of numeric values
  - `"average"` - Average of numeric values
  - `"count"` - Count of non-empty values
  - `"min"` - Minimum value
  - `"max"` - Maximum value
- **Note:** Calculated automatically by DataTable footer callback

#### className (Optional)
- **Type:** String
- **Purpose:** CSS classes for footer cell
- **Example:** `"fw-bold text-end"`, `"text-center"`, `"text-danger"`
- **Common Values:**
  - `"text-center"` - Center align
  - `"text-end"` - Right align
  - `"fw-bold"` - Bold text
  - `"text-danger"` - Red text
  - `"text-success"` - Green text

### Complete Example

```json
{
  "enabled": true,
  "columns": [
    {
      "columnIndex": 0,
      "content": "Total Systems:",
      "className": "fw-bold text-end"
    },
    {
      "columnIndex": 1,
      "content": "",
      "className": ""
    },
    {
      "columnIndex": 2,
      "aggregation": "sum",
      "className": "text-center fw-bold"
    },
    {
      "columnIndex": 3,
      "aggregation": "sum",
      "className": "text-center fw-bold text-danger"
    },
    {
      "columnIndex": 4,
      "aggregation": "sum",
      "className": "text-center fw-bold text-danger"
    }
  ]
}
```

---

## ARIA Configuration (`*-aria.json`)

### Purpose
Defines accessibility labels and descriptions for screen readers.

### File Structure

```json
{
  "enabled": true,
  "tableLabel": "Table description",
  "tableDescription": "Detailed description of table purpose"
}
```

### Property Reference

#### enabled (Required)
- **Type:** Boolean
- **Purpose:** Enable/disable ARIA features
- **Example:** `true`, `false`
- **Default:** `true`

#### tableLabel (Optional)
- **Type:** String
- **Purpose:** Short label for screen readers (aria-label)
- **Example:** `"CET Dashboard - Application Health Monitoring"`
- **Usage:** Read by screen readers when table receives focus

#### tableDescription (Optional)
- **Type:** String
- **Purpose:** Detailed description of table (aria-describedby)
- **Example:** `"Real-time monitoring of CET application health including messages, issues, and alerts"`
- **Usage:** Provides context about table content and purpose

### Complete Example

```json
{
  "enabled": true,
  "tableLabel": "CET Issues Table - Error and Exception Tracking",
  "tableDescription": "Comprehensive listing of system errors, exceptions, and issues across all CET applications with severity levels, timestamps, and resolution status"
}
```

---

## Keyboard Configuration (`*-keyboard.json`)

### Purpose
Enable/disable keyboard navigation features.

### File Structure

```json
{
  "enabled": true,
  "navigation": true,
  "search": true,
  "announcements": true
}
```

### Property Reference

#### enabled (Required)
- **Type:** Boolean
- **Purpose:** Master toggle for keyboard features
- **Example:** `true`, `false`

#### navigation (Optional)
- **Type:** Boolean
- **Purpose:** Enable arrow key navigation between cells
- **Example:** `true`, `false`
- **Default:** `true`
- **Keys:** Arrow keys, Home, End, Page Up, Page Down

#### search (Optional)
- **Type:** Boolean
- **Purpose:** Enable Ctrl+F quick search
- **Example:** `true`, `false`
- **Default:** `true`

#### announcements (Optional)
- **Type:** Boolean
- **Purpose:** Enable screen reader announcements for actions
- **Example:** `true`, `false`
- **Default:** `true`

### Complete Example

```json
{
  "enabled": true,
  "navigation": true,
  "search": true,
  "announcements": true
}
```

---

## Best Practices

### ✅ DO

1. **Use descriptive file names**
   ```
   cet-dashboard-columns.json
   user-management-filters.json
   ```

2. **Keep configurations focused**
   - One configuration type per file
   - Don't mix columns and filters in same file

3. **Use consistent property names**
   - Match `column` in filters to `data` in columns
   - Use same naming convention across all configs

4. **Provide meaningful labels**
   ```json
   {
     "title": "Error Count",
     "label": "Filter by Error Count"
   }
   ```

5. **Set appropriate responsive priorities**
   ```json
   {
     "data": "id",
     "responsivePriority": 1  // Always visible
   },
   {
     "data": "description",
     "responsivePriority": 10000  // Hide first on mobile
   }
   ```

6. **Use render functions for formatting**
   ```json
   {
     "data": "severity",
     "render": "renderSeverityBadge"
   }
   ```

### ❌ DON'T

1. **Don't hard-code values in JavaScript**
   ```javascript
   // ❌ Bad
   columns: [{ data: 'name', title: 'Name' }]
   
   // ✅ Good - Use config file
   const columns = await fetch('/config/table-columns.json')
   ```

2. **Don't duplicate configurations**
   - Keep one source of truth per table
   - Use shared configs for common patterns

3. **Don't forget responsivePriority**
   ```json
   // ❌ Bad - All columns same priority
   { "data": "id", "title": "ID" }
   
   // ✅ Good - Set priorities
   { "data": "id", "title": "ID", "responsivePriority": 1 }
   ```

4. **Don't mix presentation with data**
   ```json
   // ❌ Bad
   { "data": "status", "title": "<strong>Status</strong>" }
   
   // ✅ Good - Use className or render
   { "data": "status", "title": "Status", "className": "fw-bold" }
   ```

---

## Configuration Loading

### In Express Routes

```javascript
const fs = require('fs');

app.get('/dashboard', (req, res) => {
  // Load configurations
  const columns = JSON.parse(
    fs.readFileSync('public/config/dashboard-columns.json', 'utf8')
  );
  const filters = JSON.parse(
    fs.readFileSync('public/config/dashboard-filters.json', 'utf8')
  );
  
  res.render('dashboard', { columns, filters });
});
```

### In EJS Templates

```ejs
<%- include('partials/datatable', {
  tableId: 'dashboardTable',
  dataSource: data,
  columns: columns.cet,  // From JSON config
  filterConfig: filters,  // From JSON config
  exportButtons: ['copy', 'csv', 'excel'],
  pageLength: 25
}) %>
```

### Client-Side Loading

```javascript
// Load configuration dynamically
async function initTable() {
  const columns = await fetch('/config/table-columns.json')
    .then(r => r.json());
  
  const filters = await fetch('/config/table-filters.json')
    .then(r => r.json());
  
  // Initialize table with configs
  $('#myTable').DataTable({
    columns: columns.main,
    // ... other options
  });
}
```

---

## Migration Guide

### Converting Hard-Coded Columns to Configuration

**Before:**
```javascript
// In route handler
const columns = [
  { data: 'id', title: 'ID', width: '80px' },
  { data: 'name', title: 'Name' },
  { data: 'status', title: 'Status', render: 'renderStatus' }
];

res.render('page', { columns });
```

**After:**

1. Create `public/config/page-columns.json`:
   ```json
   {
     "main": [
       { "data": "id", "title": "ID", "width": "80px" },
       { "data": "name", "title": "Name" },
       { "data": "status", "title": "Status", "render": "renderStatus" }
     ]
   }
   ```

2. Update route handler:
   ```javascript
   const columns = JSON.parse(
     fs.readFileSync('public/config/page-columns.json', 'utf8')
   );
   
   res.render('page', { columns: columns.main });
   ```

---

## Benefits

✅ **Single Source of Truth** - All table configuration in one place  
✅ **Easy Maintenance** - Update table without touching code  
✅ **No Code Duplication** - DRY principle applied  
✅ **Flexible** - Add/remove/modify columns via config  
✅ **Testable** - Configuration can be validated independently  
✅ **Scalable** - New tables require only config files  
✅ **Version Control** - Track configuration changes easily  
✅ **Environment-Specific** - Different configs per environment  

---

## Related Documentation

- [DATATABLE_QUICK_START.md](partials/DATATABLE_QUICK_START.md) - Getting started guide
- [DATATABLE_FEATURES.md](DATATABLE_FEATURES.md) - Complete feature reference
- [CUSTOMIZING_TABLES.md](CUSTOMIZING_TABLES.md) - JavaScript customization
- [DATATABLE_ORGANIZATION.md](DATATABLE_ORGANIZATION.md) - Architecture guide

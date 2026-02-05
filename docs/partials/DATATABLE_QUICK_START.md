# DataTable Quick Start Guide

> **📚 Documentation Navigation:**
> - **This guide** - Quick start and basic usage examples
> - [DATATABLE_FEATURES.md](../DATATABLE_FEATURES.md) - Complete feature reference (21+ features)
> - [DATATABLE_ENHANCEMENTS.md](../DATATABLE_ENHANCEMENTS.md) - Planned enhancements and roadmap
> - [DATATABLE_ORGANIZATION.md](../DATATABLE_ORGANIZATION.md) - Architecture and module organization

## Overview
The `datatable.ejs` partial is a powerful, feature-rich wrapper for DataTables that provides advanced table functionality with minimal configuration. This guide covers the essentials to get you started quickly.

**For complete feature documentation, see [DATATABLE_FEATURES.md](../DATATABLE_FEATURES.md)**

## File Location
```
views/partials/datatable.ejs
```

## Features
- 📊 **Advanced Tables**: Full DataTables.net integration
- 🏗️ **Column Groups**: Multi-level header support
- 🔍 **Advanced Filtering**: Multiple filter types per column
- ✅ **Row Selection**: Single/multiple row selection
- ✏️ **Inline Editing**: Edit cells directly in table
- 📤 **Export**: Copy, CSV, Excel, PDF, Print
- 📱 **Responsive**: Mobile-optimized display
- ⌨️ **Keyboard Nav**: Full keyboard accessibility
- 🎨 **Highly Customizable**: Extensive configuration options
- 💾 **State Persistence**: Save table state in localStorage
- 🔄 **AJAX Support**: Server-side processing
- 👁️ **Child Rows**: Expandable row details

---

## Quick Start

### 1. Required Dependencies

#### CSS Files (in `<head>`):
```ejs
<%- include('partials/head', { 
  includeDataTables: true,      // Core DataTables CSS
  includeFilters: true,          // If using filters
  includeSelection: true,        // If using row selection
  includeFooter: true,           // If using footers
  includeEditing: true,          // If using inline editing
  includeSearch: true,           // If using search
  includeColumnGroups: true      // If using column groups
}) %>
```

#### JavaScript Files (before `</body>`):
```ejs
<%- include('partials/footer') %>
```

The footer partial includes:
- `table-init.js` - Main initialization
- `table-helpers.js` - Helper functions
- `table-custom-handlers.js` - Custom handlers
- `table-feature-filters.js` - Filter functionality
- `table-row-selection.js` - Selection functionality
- `table-feature-editing.js` - Editing functionality
- `table-feature-footer.js` - Footer calculations
- `table-feature-search.js` - Search functionality
- `table-feature-keyboard.js` - Keyboard navigation
- `table-feature-aria.js` - Accessibility

#### NPM Packages:
```json
{
  "jquery": "^3.x",
  "bootstrap": "^5.x",
  "datatables.net": "^1.13.x",
  "datatables.net-bs5": "^1.13.x",
  "datatables.net-responsive": "^2.x",
  "datatables.net-responsive-bs5": "^2.x",
  "datatables.net-buttons": "^2.x",
  "datatables.net-buttons-bs5": "^2.x",
  "jszip": "^3.x",
  "pdfmake": "^0.2.x"
}
```

---

### 2. Basic Usage

#### In Your EJS View:
```ejs
<!DOCTYPE html>
<html>
<%- include('partials/head', { 
  pageTitle: 'Users Table',
  includeDataTables: true 
}) %>
<body>
  <%- include('partials/header', { currentView: 'users' }) %>
  
  <div class="container-fluid mt-4">
    <%- include('partials/datatable', {
      id: 'usersTable',
      columns: columns,
      dataSource: users
    }) %>
  </div>
  
  <%- include('partials/footer') %>
</body>
</html>
```

#### In Your Express Route:
```javascript
app.get('/users', (req, res) => {
  const columns = [
    { data: 'id', title: 'ID', width: '80px' },
    { data: 'name', title: 'Name' },
    { data: 'email', title: 'Email' },
    { data: 'role', title: 'Role' },
    { data: 'status', title: 'Status', render: 'renderStatus' }
  ];
  
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' }
  ];
  
  res.render('users', { columns, users });
});
```

---

## Column Configuration

### Basic Column Structure
```javascript
{
  data: 'fieldName',           // Data source property (required)
  title: 'Column Header',      // Display title (required)
  orderable: true,             // Enable sorting (default: true)
  searchable: true,            // Include in search (default: true)
  className: 'text-center',    // CSS classes
  width: '100px',              // Fixed width
  responsivePriority: 1        // Mobile priority (1=always visible)
}
```

### Advanced Column Properties
```javascript
{
  // Data & Display
  data: 'user.name',           // Supports dot notation for nested data
  title: 'User Name',
  defaultContent: '-',         // Content if data is null
  
  // Rendering
  render: 'renderUserName',    // Custom render function name
  urlTemplate: '/users/{id}',  // Make cell clickable with URL pattern
  
  // Behavior
  orderable: true,             // Can sort by this column
  searchable: true,            // Can search this column
  visible: true,               // Column visibility
  
  // Styling
  className: 'text-end fw-bold',  // CSS classes
  width: '150px',              // Fixed width
  
  // Responsive
  responsivePriority: 1        // 1=always visible on mobile
}
```

### Custom Render Functions

Create render functions in `table-helpers.js`:

```javascript
// In table-helpers.js
export const customRenders = {
  renderStatus: function(data, type, row) {
    if (type === 'display') {
      const variant = data === 'active' ? 'success' : 'secondary';
      return `<span class="badge bg-${variant}">${data}</span>`;
    }
    return data;
  },
  
  renderEmail: function(data, type, row) {
    if (type === 'display') {
      return `<a href="mailto:${data}">${data}</a>`;
    }
    return data;
  },
  
  renderDate: function(data, type, row) {
    if (type === 'display' && data) {
      return new Date(data).toLocaleDateString();
    }
    return data;
  },
  
  renderActions: function(data, type, row) {
    if (type === 'display') {
      return `
        <button class="btn btn-sm btn-primary" onclick="editRow(${row.id})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteRow(${row.id})">
          <i class="bi bi-trash"></i>
        </button>
      `;
    }
    return data;
  }
};
```

Usage in column config:
```javascript
{
  data: 'status',
  title: 'Status',
  render: 'renderStatus'  // References customRenders.renderStatus
}
```

---

## Column Groups

Create multi-level table headers:

```javascript
const columns = [
  // Non-grouped column (spans both rows)
  { 
    data: 'id', 
    title: 'ID' 
  },
  
  // Grouped columns
  {
    groupTitle: 'Personal Information',
    columns: [
      { data: 'firstName', title: 'First Name' },
      { data: 'lastName', title: 'Last Name' },
      { data: 'age', title: 'Age' }
    ]
  },
  
  // Another group
  {
    groupTitle: 'Contact Details',
    columns: [
      { data: 'email', title: 'Email' },
      { data: 'phone', title: 'Phone' }
    ]
  },
  
  // Non-grouped column
  { 
    data: 'status', 
    title: 'Status' 
  }
];
```

**Visual Output:**
```
┌────┬─────────────────────────┬─────────────────────┬────────┐
│    │  Personal Information   │  Contact Details    │        │
│ ID ├──────────┬─────────┬────┼──────────┬──────────┤ Status │
│    │First Name│Last Name│Age │Email     │Phone     │        │
├────┼──────────┼─────────┼────┼──────────┼──────────┼────────┤
│ 1  │John      │Doe      │30  │john@...  │555-1234  │Active  │
└────┴──────────┴─────────┴────┴──────────┴──────────┴────────┘
```

---

## Advanced Filtering

### Filter Configuration
```javascript
const filterConfig = {
  enabled: true,
  position: 'top',  // 'top' or 'bottom'
  columns: [
    {
      columnIndex: 0,
      type: 'text',
      label: 'Search ID',
      placeholder: 'Enter ID...',
      colSize: 'col-md-2'
    },
    {
      columnIndex: 3,
      type: 'select',
      label: 'Role',
      options: [
        { value: '', label: 'All Roles' },
        { value: 'Admin', label: 'Admin' },
        { value: 'User', label: 'User' },
        { value: 'Manager', label: 'Manager' }
      ],
      colSize: 'col-md-3'
    },
    {
      columnIndex: 4,
      type: 'multi-select',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' }
      ],
      colSize: 'col-md-3'
    },
    {
      columnIndex: 5,
      type: 'dateRange',
      label: 'Created Date',
      colSize: 'col-md-4'
    }
  ]
};
```

### Filter Types

1. **Text Filter**: Free-form text search
2. **Select**: Single option dropdown
3. **Multi-Select**: Multiple selections with checkboxes
4. **Range**: Min/max numeric range
5. **Date**: Single date picker
6. **DateRange**: Start and end date

### Using Filters in View
```ejs
<%- include('partials/datatable', {
  id: 'usersTable',
  columns: columns,
  dataSource: users,
  filterConfig: filterConfig
}) %>
```

---

## Row Selection

Enable single or multiple row selection:

```javascript
const selectionConfig = {
  enabled: true,
  mode: 'multiple',  // 'single' or 'multiple'
  selectAllButton: true,
  deselectAllButton: true,
  deleteButton: true,
  customButtons: [
    {
      text: 'Export Selected',
      icon: 'bi-download',
      variant: 'primary',
      action: 'export-selected'
    }
  ]
};
```

### Usage in View
```ejs
<%- include('partials/datatable', {
  id: 'usersTable',
  columns: columns,
  dataSource: users,
  selectionConfig: selectionConfig
}) %>
```

### Handling Selection Events
```javascript
// Listen for selection changes
document.addEventListener('rowSelectionChanged', function(e) {
  const { tableId, selectedRows, selectedData } = e.detail;
  console.log(`${selectedRows.length} rows selected`);
  console.log('Selected data:', selectedData);
});

// Get selected rows programmatically
const table = $('#usersTable').DataTable();
const selectedData = table.rows('.selected').data().toArray();

// Handle custom button clicks
document.addEventListener('click', function(e) {
  if (e.target.closest('[data-action="export-selected"]')) {
    const selectedData = table.rows('.selected').data().toArray();
    exportData(selectedData);
  }
});
```

---

## Inline Editing

Enable cell editing:

```javascript
const editConfig = {
  enabled: true,
  editableColumns: [1, 2, 3],  // Column indices
  saveUrl: '/api/users/update',
  saveMethod: 'PUT'
};
```

### Usage
```ejs
<%- include('partials/datatable', {
  id: 'usersTable',
  columns: columns,
  dataSource: users,
  editConfig: editConfig
}) %>
```

### Server-Side Handler
```javascript
app.put('/api/users/update', (req, res) => {
  const { id, field, value } = req.body;
  
  // Update database
  await updateUser(id, field, value);
  
  res.json({ success: true, message: 'Updated successfully' });
});
```

---

## Table Footer

Add calculation footer (sum, average, count):

```javascript
const footerConfig = {
  enabled: true,
  calculations: {
    2: 'count',      // Column index: calculation type
    3: 'sum',
    4: 'average'
  }
};
```

### Usage
```ejs
<%- include('partials/datatable', {
  id: 'salesTable',
  columns: columns,
  dataSource: sales,
  footerConfig: footerConfig
}) %>
```

---

## Export Buttons

Configure export options:

```javascript
<%- include('partials/datatable', {
  id: 'usersTable',
  columns: columns,
  dataSource: users,
  exportButtons: ['copy', 'csv', 'excel', 'pdf', 'print'],
  colVisButton: true  // Add column visibility toggle
}) %>
```

---

## Server-Side Processing

For large datasets, enable server-side processing:

```javascript
<%- include('partials/datatable', {
  id: 'usersTable',
  columns: columns,
  dataSource: null,  // Important: null for server-side
  serverSide: true,
  ajaxUrl: '/api/users/datatable'
}) %>
```

### Server-Side Implementation
```javascript
app.get('/api/users/datatable', async (req, res) => {
  const { start, length, search, order } = req.query;
  
  // Build query based on DataTables parameters
  const query = {
    skip: parseInt(start),
    limit: parseInt(length),
    search: search?.value,
    orderBy: order?.[0]?.column,
    orderDir: order?.[0]?.dir
  };
  
  const [data, recordsTotal, recordsFiltered] = await Promise.all([
    getUsers(query),
    getTotalUsers(),
    getFilteredUsers(query.search)
  ]);
  
  res.json({
    draw: parseInt(req.query.draw),
    recordsTotal,
    recordsFiltered,
    data
  });
});
```

---

## Child Rows (Expandable Details)

Show additional details in expandable rows:

```javascript
<%- include('partials/datatable', {
  id: 'ordersTable',
  columns: columns,
  dataSource: orders,
  childRowField: 'details',  // Field containing child data
  // OR
  childRowRender: 'renderOrderDetails'  // Custom render function
}) %>
```

### Custom Child Row Renderer
```javascript
// In table-helpers.js
export const childRowRenders = {
  renderOrderDetails: function(row) {
    return `
      <div class="p-3">
        <h6>Order Details</h6>
        <dl class="row">
          <dt class="col-sm-3">Items:</dt>
          <dd class="col-sm-9">${row.items.join(', ')}</dd>
          <dt class="col-sm-3">Total:</dt>
          <dd class="col-sm-9">$${row.total}</dd>
          <dt class="col-sm-3">Notes:</dt>
          <dd class="col-sm-9">${row.notes || 'None'}</dd>
        </dl>
      </div>
    `;
  }
};
```

---

## State Persistence

Save table state (sorting, pagination, search) in localStorage:

```javascript
<%- include('partials/datatable', {
  id: 'usersTable',
  columns: columns,
  dataSource: users,
  stateSave: true
}) %>
```

---

## Complete Example

### Express Route
```javascript
app.get('/users', (req, res) => {
  const columns = [
    { 
      data: 'id', 
      title: 'ID',
      width: '60px',
      className: 'text-center'
    },
    { 
      data: 'name', 
      title: 'Name',
      urlTemplate: '/users/{id}'
    },
    { 
      data: 'email', 
      title: 'Email',
      render: 'renderEmail'
    },
    { 
      data: 'role', 
      title: 'Role',
      className: 'text-center'
    },
    { 
      data: 'status', 
      title: 'Status',
      render: 'renderStatus',
      className: 'text-center'
    },
    { 
      data: 'createdAt', 
      title: 'Created',
      render: 'renderDate'
    },
    { 
      data: null, 
      title: 'Actions',
      orderable: false,
      searchable: false,
      render: 'renderActions',
      width: '120px',
      className: 'text-center'
    }
  ];
  
  const filterConfig = {
    enabled: true,
    position: 'top',
    columns: [
      {
        columnIndex: 3,
        type: 'select',
        label: 'Role',
        options: [
          { value: '', label: 'All Roles' },
          { value: 'Admin', label: 'Admin' },
          { value: 'User', label: 'User' }
        ]
      },
      {
        columnIndex: 4,
        type: 'multi-select',
        label: 'Status',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ]
      }
    ]
  };
  
  const selectionConfig = {
    enabled: true,
    mode: 'multiple',
    selectAllButton: true,
    deleteButton: true,
    customButtons: [
      {
        text: 'Send Email',
        icon: 'bi-envelope',
        variant: 'primary',
        action: 'send-email'
      }
    ]
  };
  
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', createdAt: '2024-02-20' }
  ];
  
  res.render('users', { 
    columns, 
    users, 
    filterConfig, 
    selectionConfig 
  });
});
```

### View File
```ejs
<!DOCTYPE html>
<html lang="en">
<%- include('partials/head', { 
  pageTitle: 'Users Management',
  includeDataTables: true,
  includeFilters: true,
  includeSelection: true
}) %>
<body>
  <%- include('partials/header', { currentView: 'users' }) %>
  
  <div class="container-fluid mt-4">
    <div class="card">
      <div class="card-header">
        <h4 class="mb-0">
          <i class="bi bi-people"></i> Users
        </h4>
      </div>
      <div class="card-body">
        <%- include('partials/datatable', {
          id: 'usersTable',
          columns: columns,
          dataSource: users,
          filterConfig: filterConfig,
          selectionConfig: selectionConfig,
          exportButtons: ['copy', 'csv', 'excel'],
          stateSave: true,
          defaultOrder: [[0, 'asc']]
        }) %>
      </div>
    </div>
  </div>
  
  <%- include('partials/footer') %>
  
  <script>
    // Handle custom button clicks
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('[data-action="send-email"]');
      if (btn) {
        const table = $('#usersTable').DataTable();
        const selected = table.rows('.selected').data().toArray();
        const emails = selected.map(row => row.email);
        console.log('Send email to:', emails);
        // Implement email functionality
      }
    });
  </script>
</body>
</html>
```

---

## Extending & Customizing

### 1. Add Custom Column Render Function

In `table-helpers.js`:
```javascript
export const customRenders = {
  // Add your custom renderer
  renderPriority: function(data, type, row) {
    if (type === 'display') {
      const colors = {
        high: 'danger',
        medium: 'warning',
        low: 'success'
      };
      return `<span class="badge bg-${colors[data]}">${data.toUpperCase()}</span>`;
    }
    return data;
  }
};
```

### 2. Custom Table Actions

```javascript
// Add custom toolbar buttons
function addCustomToolbar(tableId) {
  $(`#${tableId}_wrapper .dt-buttons`).append(`
    <button class="btn btn-sm btn-info" id="customAction">
      <i class="bi bi-gear"></i> Custom Action
    </button>
  `);
  
  $('#customAction').on('click', function() {
    // Your custom action
    alert('Custom action triggered!');
  });
}

// Call after table initialization
document.addEventListener('datatableInitialized', function(e) {
  if (e.detail.tableId === 'myTable') {
    addCustomToolbar('myTable');
  }
});
```

---

## Integration with Other Projects

### Step 1: Copy Required Files

```bash
# Partial file
cp views/partials/datatable.ejs /your-project/views/partials/

# CSS files
cp public/css/datatable-*.css /your-project/public/css/
cp public/css/table-*.css /your-project/public/css/

# JavaScript files
cp public/js/datatable-*.js /your-project/public/js/
cp public/js/table-*.js /your-project/public/js/
```

### Step 2: Install Dependencies

```bash
npm install jquery bootstrap datatables.net datatables.net-bs5 \
  datatables.net-responsive datatables.net-responsive-bs5 \
  datatables.net-buttons datatables.net-buttons-bs5 \
  jszip pdfmake
```

### Step 3: Include in Layout

```ejs
<!-- In head -->
<link href="/node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="/node_modules/datatables.net-bs5/css/dataTables.bootstrap5.min.css" rel="stylesheet">
<link href="/node_modules/datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css" rel="stylesheet">
<link href="/node_modules/datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css" rel="stylesheet">

<!-- Before closing body -->
<script src="/node_modules/jquery/dist/jquery.min.js"></script>
<script src="/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
<script src="/node_modules/datatables.net/js/dataTables.min.js"></script>
<script src="/node_modules/datatables.net-bs5/js/dataTables.bootstrap5.min.js"></script>
<script type="module" src="/js/table-init.js"></script>
```

---

## Troubleshooting

### Table Not Initializing
- ✅ Check jQuery is loaded before DataTables
- ✅ Verify all DataTables dependencies are installed
- ✅ Check browser console for errors
- ✅ Ensure `id` parameter is provided and unique

### Columns Not Displaying Correctly
- ✅ Verify column `data` matches object properties
- ✅ Check for typos in column configuration
- ✅ Ensure nested data uses dot notation correctly

### Filters Not Working
- ✅ Include filter CSS and JS files
- ✅ Verify `filterConfig` is properly structured
- ✅ Check column indices match table columns

### Export Buttons Not Showing
- ✅ Install jszip and pdfmake packages
- ✅ Load button extension CSS and JS
- ✅ Verify button configuration

---

## API Reference

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String | Yes | Unique table identifier |
| `columns` | Array | Yes | Column configuration array |
| `dataSource` | Array | No | Data array (null for server-side) |
| `defaultOrder` | Array | No | Default sort [[columnIndex, 'asc']] |
| `dtOptions` | Object | No | Additional DataTables options |
| `exportButtons` | Array | No | Export button types |
| `colVisButton` | Boolean | No | Show column visibility toggle |
| `stateSave` | Boolean | No | Persist table state |
| `serverSide` | Boolean | No | Enable server-side processing |
| `ajaxUrl` | String | No | AJAX data source URL |
| `autoInit` | Boolean | No | Auto-initialize (default: true) |
| `childRowField` | String | No | Field for child row content |
| `childRowRender` | String | No | Custom child row renderer |
| `filterConfig` | Object | No | Filter configuration |
| `selectionConfig` | Object | No | Row selection configuration |
| `footerConfig` | Object | No | Footer configuration |
| `searchConfig` | Object | No | Search configuration |
| `ariaConfig` | Object | No | Accessibility configuration |
| `keyboardConfig` | Object | No | Keyboard navigation config |

---

## Best Practices

1. **Always provide unique table IDs** for multiple tables on same page
2. **Use responsivePriority** for important columns on mobile
3. **Enable stateSave** for better user experience
4. **Use server-side processing** for large datasets (>10,000 rows)
5. **Provide render functions** for complex data formatting
6. **Add appropriate filters** to help users find data quickly
7. **Use column groups** to organize related columns
8. **Limit export buttons** to needed formats
9. **Test accessibility** with keyboard navigation
10. **Handle errors gracefully** in custom handlers

---

## Support & Contribution

The DataTable partial is highly extensible. Modify the partial and associated JavaScript files to add custom features as needed.

### Key Files:
- `views/partials/datatable.ejs` - Main template
- `public/js/table-init.js` - Initialization
- `public/js/table-helpers.js` - Helper functions
- `public/js/table-feature-filters.js` - Filtering
- `public/js/table-feature-selection.js` - Selection
- `public/js/table-feature-editing.js` - Editing
- `public/js/table-feature-footer.js` - Footer calculations
- `public/js/table-feature-search.js` - Search functionality
- `public/js/table-feature-keyboard.js` - Keyboard navigation
- `public/js/table-feature-aria.js` - Accessibility

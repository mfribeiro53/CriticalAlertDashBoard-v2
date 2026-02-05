# Customizing DataTable Functionality

> **📚 Documentation Navigation:**
> - [DATATABLE_QUICK_START.md](partials/DATATABLE_QUICK_START.md) - Quick start guide and basic usage
> - [DATATABLE_FEATURES.md](DATATABLE_FEATURES.md) - Complete feature reference (21+ implemented features)
> - [DATATABLE_CONFIGURATION.md](DATATABLE_CONFIGURATION.md) - Configuration file structure and reference
> - [DATATABLE_ENHANCEMENTS.md](DATATABLE_ENHANCEMENTS.md) - Planned enhancements and roadmap
> - [DATATABLE_ORGANIZATION.md](DATATABLE_ORGANIZATION.md) - Architecture and module organization
> - **This document** - JavaScript customization guide

## Overview
The DataTable wrapper provides default implementations for various features, but you should customize these for your application's specific needs. This system is designed to be extensible for current and future features.

## Quick Start

All custom logic should be placed in:
```
public/js/custom-handlers.js
```

This file contains placeholder functions organized by feature namespace. Implement the functions you need with your actual business logic.

## File Structure

```
public/js/
├── table-helpers.js    # Render functions (includes renderActionButtons)
├── custom-handlers.js      # ⭐ CUSTOMIZE THIS - Your custom logic for ALL features
├── table-actions.js        # Row actions default implementations (don't modify)
└── table-filters.js        # Filter defaults (future)
└── table-exports.js        # Export defaults (future)
└── table-editing.js        # Inline editing defaults (future)
```

## Architecture

1. **custom-handlers.js** - Your custom implementations (API calls, validation, etc.)
   - Organized by feature namespace (actions, filters, exports, etc.)
2. **table-*.js** - Default behavior for each feature (modals, UI handling)
3. **Fallback Pattern** - If custom functions return `null`, defaults are used

## Namespace Structure

```javascript
window.customHandlers = {
  actions: {      // Row action handlers (CURRENT)
    view, edit, delete, validate, shouldShowButton, getCustomActions, getToastMessage
  },
  filters: {      // Custom filter handlers (FUTURE)
    // ...
  },
  exports: {      // Custom export handlers (FUTURE)
    // ...
  },
  editing: {      // Inline editing handlers (FUTURE)
    // ...
  },
  bulk: {         // Bulk operation handlers (FUTURE)
    // ...
  }
}
```

## Current Feature: Row Actions

All row action handlers are under `window.customHandlers.actions.*`

### 1. View Action

**Default behavior:** Shows modal with JSON data

**Customize for:**
```javascript
function customViewAction(id, rowData, context) {
  // Option A: Navigate to detail page
  window.location.href = `/details/${id}`;
  return true; // Prevent default modal
  
  // Option B: Fetch and display additional data
  fetch(`/api/details/${id}`)
    .then(response => response.json())
    .then(data => {
      // Show custom modal with formatted data
      showCustomDetailModal(data);
    });
  return true; // Prevent default modal
  
  // Option C: Use default modal
  return null;
}
```

### 2. Edit Action

**Default behavior:** Shows placeholder edit modal

**Customize for:**
```javascript
function customEditAction(id, rowData, context) {
  // Option A: Navigate to edit page
  window.location.href = `/edit/${id}`;
  return true;
  
  // Option B: Show custom edit form
  showEditForm(id, rowData, (updatedData) => {
    // Save via API
    fetch(`/api/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(result => {
      // Update table row
      const table = context.table;
      const row = table.row(context.row);
      row.data(result).draw();
    });
  });
  return true;
  
  // Option C: Use default modal
  return null;
}
```

### 3. Delete Action

**Default behavior:** Removes row from table (no API call)

**Customize for:**
```javascript
function customDeleteAction(id, rowData, context) {
  // Make DELETE API call
  return fetch(`/api/delete/${id}`, { 
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Delete failed: ' + response.statusText);
    }
    return response.json();
  })
  .then(result => {
    // Remove row from table after successful API call
    context.table.row(context.row).remove().draw();
    return result;
  })
  .catch(error => {
    console.error('Delete error:', error);
    throw error; // Will show error toast
  });
}
```

### 4. Validation

**Control when actions can be executed:**

```javascript
function validateAction(actionType, id, rowData) {
  // Prevent editing resolved items
  if (actionType === 'edit' && rowData.status === 'resolved') {
    alert('Cannot edit resolved items');
    return false;
  }
  
  // Prevent deleting critical alerts
  if (actionType === 'delete' && rowData.severity === 'critical') {
    alert('Cannot delete critical alerts. Please archive instead.');
    return false;
  }
  
  // Check user permissions
  if (!window.currentUser || !window.currentUser.permissions.includes(actionType)) {
    alert('You do not have permission to ' + actionType + ' this record');
    return false;
  }
  
  return true; // Allow action
}
```

### 5. Button Visibility

**Control which buttons show for each row:**

```javascript
function shouldShowButton(buttonType, rowData) {
  // Hide edit button for resolved items
  if (buttonType === 'edit' && rowData.status === 'resolved') {
    return false;
  }
  
  // Only admins can delete
  if (buttonType === 'delete' && !window.currentUser?.isAdmin) {
    return false;
  }
  
  // Hide view button for deleted items
  if (buttonType === 'view' && rowData.isDeleted) {
    return false;
  }
  
  return true; // Show button by default
}
```

### 6. Custom Actions

**Add additional action buttons:**

```javascript
function getCustomActions(rowData) {
  const actions = [];
  
  // Add archive button for resolved items
  if (rowData.status === 'resolved') {
    actions.push({
      label: 'Archive',
      icon: 'bi-archive',
      class: 'btn-outline-warning',
      tooltip: 'Archive this record',
      handler: (id, data) => {
        fetch(`/api/archive/${id}`, { method: 'POST' })
          .then(response => response.json())
          .then(result => {
            // Update table or show notification
            console.log('Archived:', result);
          });
      }
    });
  }
  
  // Add duplicate button
  actions.push({
    label: 'Duplicate',
    icon: 'bi-files',
    class: 'btn-outline-info',
    tooltip: 'Create a copy',
    handler: (id, data) => {
      // Implementation
    }
  });
  
  return actions;
}
```

### 7. Toast Messages

**Customize success/error notifications:**

```javascript
function getToastMessage(actionType, success, data) {
  if (actionType === 'delete' && success) {
    return {
      type: 'success',
      title: 'Deleted Successfully',
      message: `Record #${data.id} has been permanently removed.`
    };
  }
  
  if (actionType === 'edit' && success) {
    return {
      type: 'success',
      title: 'Changes Saved',
      message: 'Your changes have been saved successfully.'
    };
  }
  
  // Return null to use default messages
  return null;
}
```

## Common Patterns

### Pattern 1: API Integration with Error Handling

```javascript
function customDeleteAction(id, rowData, context) {
  return fetch(`/api/items/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(err.message || 'Delete failed');
      });
    }
    return response.json();
  })
  .then(result => {
    // Success - remove from table
    context.table.row(context.row).remove().draw();
    return result;
  })
  .catch(error => {
    console.error('Delete failed:', error);
    throw error; // This will show error toast
  });
}
```

### Pattern 2: Soft Delete

```javascript
function customDeleteAction(id, rowData, context) {
  // Mark as deleted instead of removing
  return fetch(`/api/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isDeleted: true })
  })
  .then(response => response.json())
  .then(result => {
    // Update row data to show as deleted
    rowData.isDeleted = true;
    rowData.status = 'deleted';
    context.table.row(context.row).data(rowData).draw();
    return result;
  });
}
```

### Pattern 3: Inline Editing

```javascript
function customEditAction(id, rowData, context) {
  const row = $(context.row);
  
  // Make cells editable
  row.find('td').each(function(index) {
    if (index === 0) return; // Skip ID column
    const cell = $(this);
    const originalValue = cell.text();
    
    cell.html(`<input type="text" class="form-control form-control-sm" value="${originalValue}">`);
  });
  
  // Add save/cancel buttons
  row.find('td:last').html(`
    <button class="btn btn-sm btn-success save-row">Save</button>
    <button class="btn btn-sm btn-secondary cancel-edit">Cancel</button>
  `);
  
  return true; // Prevent default modal
}
```

### Pattern 4: Permission-based Actions

```javascript
// Set up user context (do this on page load)
window.currentUser = {
  id: 123,
  role: 'admin',
  permissions: ['view', 'edit', 'delete']
};

function validateAction(actionType, id, rowData) {
  // Check if user has permission
  if (!window.currentUser.permissions.includes(actionType)) {
    showPermissionError(actionType);
    return false;
  }
  
  // Additional business rules
  if (actionType === 'delete') {
    // Only owner or admin can delete
    if (rowData.ownerId !== window.currentUser.id && 
        window.currentUser.role !== 'admin') {
      alert('Only the owner or admin can delete this record');
      return false;
    }
  }
  
  return true;
}
```

## Testing Your Customizations

1. **View Action**: Click view button and verify your custom behavior
2. **Edit Action**: Click edit button and test form submission/API calls
3. **Delete Action**: Click delete, confirm, and verify API call succeeds
4. **Validation**: Test with data that should fail validation
5. **Error Handling**: Test with network failures or API errors

## Best Practices

1. ✅ **Always return Promises** for async operations (especially delete)
2. ✅ **Handle errors gracefully** - throw errors to show error toasts
3. ✅ **Validate on server-side** - client validation is not secure
4. ✅ **Update table data** after successful API calls
5. ✅ **Show loading states** during API calls
6. ✅ **Add confirmation** for destructive actions
7. ✅ **Test permissions** server-side, not just client-side
8. ✅ **Log errors** for debugging
9. ✅ **Use Bootstrap classes** for consistent styling
10. ✅ **Add accessibility** attributes (ARIA labels)

## Future Features

As new features are added, they will follow the same pattern:

### Custom Filters (Planned)
```javascript
window.customHandlers.filters = {
  applyCustomFilter: (column, value) => { /* ... */ },
  validateFilter: (filterData) => { /* ... */ }
};
```

### Custom Exports (Planned)
```javascript
window.customHandlers.exports = {
  beforeExport: (data, format) => { /* ... */ },
  formatExportData: (data, format) => { /* ... */ }
};
```

### Inline Editing (Planned)
```javascript
window.customHandlers.editing = {
  onCellEdit: (rowId, column, newValue) => { /* ... */ },
  validateEdit: (rowId, column, newValue) => { /* ... */ }
};
```

### Bulk Operations (Planned)
```javascript
window.customHandlers.bulk = {
  bulkDelete: (selectedIds) => { /* ... */ },
  bulkUpdate: (selectedIds, updates) => { /* ... */ }
};
```

## Debugging

To see when custom functions are called:
```javascript
// The console.log statements in custom-handlers.js will show:
// "CUSTOMIZE: Implement your [action] logic here"

// Check if functions are registered:
console.log(window.customHandlers);
console.log(window.customHandlers.actions); // Row actions
```

## Adding New Feature Namespaces

When implementing new features:

1. Add namespace to `custom-handlers.js`:
```javascript
window.customHandlers.newFeature = {
  handler1: function() { /* ... */ },
  handler2: function() { /* ... */ }
};
```

2. Create feature-specific file (e.g., `table-newfeature.js`)
3. Check for custom handlers before using defaults
4. Document in this file and `DATATABLE_FEATURES.md`

## Need Help?

- Check `table-feature-actions.js` for default implementations
- Review `DATATABLE_FEATURES.md` for full feature documentation
- See `DATATABLE_ENHANCEMENTS.md` for future feature ideas
- All customizations go in `custom-handlers.js` only

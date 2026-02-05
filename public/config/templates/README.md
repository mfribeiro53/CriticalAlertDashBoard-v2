# DataTable Configuration Templates

Welcome! This folder contains template files to help you quickly configure DataTable features for your views.

## Quick Start

### Creating a New Table Configuration

1. **Decide on a name** for your view (e.g., `products`, `customers`, `orders`)
2. **Copy the templates** you need from this folder
3. **Rename** them to match your view name: `[viewname]-[feature].json`
4. **Edit** the configuration to match your data structure
5. **Remove** all `_comment`, `_options`, and documentation fields

### Example Workflow

Let's say you're creating a "products" table:

```bash
# Copy templates you need
cp templates/TEMPLATE-columns.json products-columns.json
cp templates/TEMPLATE-filters.json products-filters.json
cp templates/TEMPLATE-footer.json products-footer.json
cp templates/TEMPLATE-aria.json products-aria.json

# Edit each file to customize for your products data
# Remove all fields starting with underscore (_comment, _options, etc.)
```

## Available Configuration Files

### Required Files

#### 1. **[viewname]-columns.json** ⭐ REQUIRED
Defines the columns in your table - which data fields to display, how to format them, and whether they're editable.

**When to use:** Always - every table needs column definitions

**Example:**
```json
{
  "yourDataKey": [
    {
      "data": "id",
      "title": "Product ID",
      "orderable": true,
      "searchable": true
    },
    {
      "data": "name",
      "title": "Product Name",
      "orderable": true,
      "searchable": true,
      "editable": true,
      "editType": "text"
    }
  ]
}
```

### Optional Feature Files

#### 2. **[viewname]-filters.json**
Add dropdown filters, text search, and date range filters above your table.

**When to use:** When users need to filter data before searching (status filters, category filters, date ranges)

**Skip if:** Your table is small (< 50 rows) or search is sufficient

---

#### 3. **[viewname]-footer.json**
Display aggregate calculations in a footer row (totals, counts, averages).

**When to use:** Financial data, inventory counts, analytics tables where summaries are helpful

**Skip if:** Aggregations aren't meaningful for your data

---

#### 4. **[viewname]-aria.json**
Configure accessibility features and screen reader announcements.

**When to use:** Always recommended for WCAG compliance and accessibility

**Skip if:** Internal tool with no accessibility requirements (not recommended)

---

#### 5. **[viewname]-keyboard.json**
Enable keyboard shortcuts and arrow key navigation.

**When to use:** Power user tools, data entry applications, accessibility requirements

**Skip if:** Simple read-only tables with minimal interaction

---

#### 6. **[viewname]-reorder.json**
Allow users to drag-and-drop columns to reorder them.

**When to use:** Tables with many columns (8+) where users have different priorities

**Skip if:** Few columns or column order is important

---

#### 7. **[viewname]-search.json**
Configure global search with highlighting and regex support.

**When to use:** Tables with 50+ rows or text-heavy content

**Skip if:** Very small tables or filter-only approach preferred

---

#### 8. **[viewname]-selection.json**
Enable row selection checkboxes and bulk actions (delete, export, etc.).

**When to use:** When users need to act on multiple rows at once

**Skip if:** Read-only table or single-row actions only

## File Naming Convention

**Pattern:** `[viewname]-[feature].json`

- `viewname` = The key used in your data/API (e.g., "alerts", "users", "products")
- `feature` = One of: columns, filters, footer, aria, keyboard, reorder, search, selection

**Examples:**
- `alerts-columns.json` ✅
- `users-filters.json` ✅
- `products-footer.json` ✅
- `orders-selection.json` ✅

**Important:** The `viewname` must match the key in your EJS template when initializing the DataTable.

## Minimal Configuration

For a basic table, you only need **one file**:

```
products-columns.json  (defines your columns)
```

Everything else is optional and can be added as needed.

## Common Configuration Sets

### 📊 Simple Read-Only Table
```
✅ [viewname]-columns.json
✅ [viewname]-aria.json (recommended)
```

### 🔍 Searchable Data Table
```
✅ [viewname]-columns.json
✅ [viewname]-search.json
✅ [viewname]-aria.json
✅ [viewname]-keyboard.json
```

### 🎯 Interactive Data Management
```
✅ [viewname]-columns.json
✅ [viewname]-filters.json
✅ [viewname]-selection.json (for bulk actions)
✅ [viewname]-aria.json
✅ [viewname]-keyboard.json
```

### 📈 Analytics/Reporting Table
```
✅ [viewname]-columns.json
✅ [viewname]-footer.json (for totals/averages)
✅ [viewname]-filters.json
✅ [viewname]-search.json
✅ [viewname]-aria.json
```

### 💪 Power User Table (All Features)
```
✅ [viewname]-columns.json
✅ [viewname]-filters.json
✅ [viewname]-footer.json
✅ [viewname]-selection.json
✅ [viewname]-reorder.json
✅ [viewname]-search.json
✅ [viewname]-keyboard.json
✅ [viewname]-aria.json
```

## Step-by-Step Tutorial

### Example: Creating a "Products" Table

#### Step 1: Copy the column template
```bash
cp templates/TEMPLATE-columns.json products-columns.json
```

#### Step 2: Edit products-columns.json
Remove all documentation fields and customize:

```json
{
  "products": [
    {
      "data": "id",
      "title": "ID",
      "orderable": true,
      "searchable": false,
      "width": "60px"
    },
    {
      "data": "name",
      "title": "Product Name",
      "orderable": true,
      "searchable": true,
      "editable": true,
      "editType": "text"
    },
    {
      "data": "category",
      "title": "Category",
      "orderable": true,
      "searchable": true
    },
    {
      "data": "price",
      "title": "Price",
      "orderable": true,
      "searchable": false,
      "render": "renderCurrency"
    },
    {
      "data": "stock",
      "title": "Stock",
      "orderable": true,
      "searchable": false
    }
  ]
}
```

#### Step 3: Add optional features as needed

For filters:
```bash
cp templates/TEMPLATE-filters.json products-filters.json
# Edit to add category filter, price range, etc.
```

For footer totals:
```bash
cp templates/TEMPLATE-footer.json products-footer.json
# Edit to show total products, sum of stock, etc.
```

#### Step 4: Use in your view
In your EJS template (`products-view.ejs`):
```html
<%- include('partials/datatable', { 
    tableId: 'productsTable',
    dataKey: 'products'
}) %>
```

The DataTable wrapper will automatically look for:
- `products-columns.json` (required)
- `products-filters.json` (if exists)
- `products-footer.json` (if exists)
- ... and so on

## Important Notes

### Cleaning Up Templates

When you copy a template, **remove all fields starting with underscore**:
- `_comment`
- `_options`
- `_description`
- `_usage`
- `_bestPractices`
- etc.

These are documentation fields and should not be in your production config files.

### Data Key Matching

The top-level key in `columns.json` must match:
1. The `dataKey` parameter in your EJS template
2. The property name in your data object/API response

**Example:**
```javascript
// Your route sends data as:
res.render('products-view', { 
    products: [...] 
});

// Your columns.json should have:
{
  "products": [...]  // ← Must match
}

// Your EJS include should use:
dataKey: 'products'  // ← Must match
```

### Testing Your Configuration

1. Start your server
2. Navigate to your view
3. Open browser console for errors
4. Test each feature:
   - ✓ Columns display correctly
   - ✓ Filters work
   - ✓ Search finds results
   - ✓ Footer shows correct calculations
   - ✓ Keyboard navigation works
   - ✓ Selection and bulk actions work

## Common Mistakes

### ❌ Wrong file name
```
product-columns.json  (singular - doesn't match data key)
```
```javascript
{ products: [...] }  // data key is plural
```

### ✅ Correct file name
```
products-columns.json  (matches data key)
```

---

### ❌ Forgot to remove documentation fields
```json
{
  "_comment": "This is still here",
  "_options": {...},
  "products": [...]
}
```

### ✅ Clean production config
```json
{
  "products": [...]
}
```

---

### ❌ Wrong column data path
```json
{
  "data": "productName"  // but your data has product.name
}
```

### ✅ Use dot notation for nested data
```json
{
  "data": "product.name"  // accesses nested property
}
```

## Need Help?

### Template Documentation
Each template file contains extensive inline documentation:
- Explanation of every option
- Examples for common scenarios
- Best practices
- When to enable/disable features

Just open a template file and read the `_comment` and `_options` fields!

### Existing Examples
Look at the existing config files in the parent `config/` folder:
- `table-columns.json` - Alerts table
- `users-columns.json` - Users table
- `demographics-columns.json` - Demographics table
- `services-columns.json` - Services table

These show real working configurations you can learn from.

## Advanced Topics

### Custom Render Functions
Define in `/public/js/custom-handlers.js`:
```javascript
function renderCurrency(data, type, row) {
  return type === 'display' ? '$' + parseFloat(data).toFixed(2) : data;
}
```

Then use in columns config:
```json
{
  "data": "price",
  "render": "renderCurrency"
}
```

### Custom Bulk Actions
Define in `/public/js/custom-handlers.js`:
```javascript
function handleBulkArchive(selectedRows) {
  // Your bulk action logic
}
```

Then reference in selection config:
```json
{
  "bulkActions": ["archive"]
}
```

### Custom Keyboard Shortcuts
Add to keyboard config:
```json
{
  "customShortcuts": [
    {
      "key": "Q",
      "ctrl": true,
      "action": "quickAction",
      "description": "Quick action"
    }
  ]
}
```

Define function in `/public/js/custom-handlers.js`:
```javascript
function quickAction() {
  // Your shortcut logic
}
```

## File Structure Reference

```
public/config/
├── templates/               ← Template files (copy from here)
│   ├── README.md           ← This file
│   ├── TEMPLATE-columns.json
│   ├── TEMPLATE-filters.json
│   ├── TEMPLATE-footer.json
│   ├── TEMPLATE-aria.json
│   ├── TEMPLATE-keyboard.json
│   ├── TEMPLATE-reorder.json
│   ├── TEMPLATE-search.json
│   └── TEMPLATE-selection.json
│
├── table-columns.json       ← Actual config files (alerts view)
├── table-filters.json
├── users-columns.json       ← Users view config files
├── users-filters.json
└── ...                      ← Your new config files go here
```

## Best Practices Summary

1. ✅ **Start minimal** - Only `columns.json` is required
2. ✅ **Add features incrementally** - Don't configure everything at once
3. ✅ **Test as you go** - Verify each feature works before adding the next
4. ✅ **Remove documentation fields** - Clean up `_comment` and `_options` from templates
5. ✅ **Match naming conventions** - `[viewname]-[feature].json`
6. ✅ **Use dot notation** - Access nested data with `parent.child`
7. ✅ **Enable accessibility** - Always include `aria.json` configuration
8. ✅ **Learn from examples** - Check existing config files in parent folder

---

**Happy configuring!** 🎉

If you run into issues, check the browser console for error messages and verify your file names match your data keys.

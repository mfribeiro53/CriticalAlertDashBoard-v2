# Layout Partials Documentation

## Overview
The layout partials (`head.ejs`, `header.ejs`, `footer.ejs`) provide the foundational structure for your application's pages. They handle dependency loading, navigation, and script initialization in a modular, reusable way.

---

## Head Partial

### File Location
```
views/partials/head.ejs
```

### Purpose
Manages all CSS dependencies, meta tags, and conditional asset loading based on page requirements.

### Usage

```ejs
<%- include('partials/head', { 
  pageTitle: 'My Page',
  includeDataTables: true,
  includeCardView: true,
  includeFlatpickr: true,
  includeFilters: true,
  includeSelection: true,
  includeFooter: true,
  includeEditing: true,
  includeSearch: true,
  includeColumnGroups: true
}) %>
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pageTitle` | String | 'Error Alert Dashboard' | Browser tab title |
| `includeDataTables` | Boolean | false | Load DataTables CSS |
| `includeCardView` | Boolean | false | Load card view styles |
| `includeColumnGroups` | Boolean | false | Load column group styles |
| `includeFilters` | Boolean | false | Load filter styles |
| `includeSelection` | Boolean | false | Load row selection styles |
| `includeFooter` | Boolean | false | Load footer styles |
| `includeEditing` | Boolean | false | Load editing styles |
| `includeSearch` | Boolean | false | Load search styles |
| `includeFlatpickr` | Boolean | false | Load Flatpickr date picker CSS |

### What It Includes

**Always Loaded:**
- Bootstrap 5 CSS
- Bootstrap Icons
- Custom base styles (`styles.css`)

**Conditionally Loaded Based on Parameters:**
- DataTables core and extensions
- Flatpickr date picker
- Card view styles
- Table feature styles (filters, selection, editing, etc.)

### Example Use Cases

#### Simple Page (No Special Features)
```ejs
<%- include('partials/head', { 
  pageTitle: 'About Us'
}) %>
```

#### DataTable Page
```ejs
<%- include('partials/head', { 
  pageTitle: 'Users Table',
  includeDataTables: true,
  includeFilters: true,
  includeSelection: true
}) %>
```

#### Dashboard with Cards
```ejs
<%- include('partials/head', { 
  pageTitle: 'Dashboard',
  includeCardView: true
}) %>
```

#### Form Page with Date Picker
```ejs
<%- include('partials/head', { 
  pageTitle: 'Create Entry',
  includeFlatpickr: true
}) %>
```

---

## Header Partial

### File Location
```
views/partials/header.ejs
```

### Purpose
Provides the top navigation bar with branding and navigation links.

### Usage

```ejs
<%- include('partials/header', { 
  currentView: 'users'
}) %>
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `currentView` | String | '' | Current active page (highlights nav link) |

### Current View Values
- `'cet-dashboard'` - CET Dashboard page
- `'cet-apps'` - CET Apps page
- `'cet-issues'` - CET Issues page
- `'cet-queues'` - CET Queues page
- `'cet-reports'` - CET Reports page

### Customizing Navigation

To add new navigation items, modify the partial:

```ejs
<!-- In header.ejs, add new nav item -->
<li class="nav-item">
  <a href="/users" class="nav-link <%= currentView === 'users' ? 'active' : '' %>">
    <i class="bi bi-people"></i> Users
  </a>
</li>
```

### Customizing Branding

```ejs
<!-- Change the logo/branding -->
<a href="/" class="navbar-brand mb-0 h1">
  <i class="bi bi-your-icon"></i> Your App Name
</a>
```

### Styling

The header uses Bootstrap navbar classes:
- `navbar-dark bg-dark` - Dark theme (default)
- Can be changed to `navbar-light bg-light` for light theme
- `navbar-expand-lg` - Responsive breakpoint

**Example: Light Theme Header**
```ejs
<nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
  <!-- ... rest of header ... -->
</nav>
```

---

## Footer Partial

### File Location
```
views/partials/footer.ejs
```

### Purpose
Loads all JavaScript dependencies and initialization scripts. Placed before closing `</body>` tag.

### Usage

```ejs
<%- include('partials/footer') %>
```

### What It Includes

**Always Loaded:**
- jQuery
- Bootstrap Bundle (includes Popper)
- DataTables core and all extensions
- Flatpickr date picker
- All custom initialization scripts:
  - `table-init.js` (ES6 module)
  - `card-init.js` (ES6 module)
  - `form-init.js` (ES6 module)

### Script Loading Order

1. **Third-Party Libraries** (in order):
   - jQuery
   - Bootstrap
   - DataTables + Extensions
   - Export Dependencies (JSZip, PDFMake)
   - Flatpickr

2. **Custom Scripts** (ES6 modules):
   - `table-init.js` - Handles all table initialization
   - `card-init.js` - Handles card actions and dashboard logic
   - `form-init.js` - Handles form initialization and Flatpickr

### No Configuration Needed

Unlike the head partial, the footer doesn't require configuration. It loads all scripts that might be needed, but they only activate when relevant elements are present on the page.

---

## Complete Page Template

Here's a complete page using all layout partials:

```ejs
<!DOCTYPE html>
<html lang="en">
<%- include('partials/head', { 
  pageTitle: 'My Page',
  includeDataTables: true,
  includeCardView: true,
  includeFlatpickr: true
}) %>
<body>
  <!-- Navigation -->
  <%- include('partials/header', { 
    currentView: 'my-page' 
  }) %>
  
  <!-- Main Content -->
  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col-12">
        <h1>My Page Content</h1>
        
        <!-- Your content here -->
        <%- include('partials/card', { ... }) %>
        <%- include('partials/datatable', { ... }) %>
        <%- include('partials/cet-dynamic-form', { ... }) %>
      </div>
    </div>
  </div>
  
  <!-- Scripts -->
  <%- include('partials/footer') %>
  
  <!-- Optional: Page-specific scripts -->
  <script type="module">
    // Your page-specific JavaScript
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Page loaded');
    });
  </script>
</body>
</html>
```

---

## Integration with Other Projects

### Step 1: Copy Layout Partials

```bash
# Copy the layout partials
cp views/partials/head.ejs /your-project/views/partials/
cp views/partials/header.ejs /your-project/views/partials/
cp views/partials/footer.ejs /your-project/views/partials/
```

### Step 2: Copy CSS Files

```bash
# Copy CSS files
cp public/css/styles.css /your-project/public/css/
cp public/css/card-view.css /your-project/public/css/
cp public/css/datatable-*.css /your-project/public/css/
cp public/css/table-*.css /your-project/public/css/
```

### Step 3: Copy JavaScript Files

```bash
# Copy JavaScript files
cp public/js/*-init.js /your-project/public/js/
cp public/js/*-helpers.js /your-project/public/js/
cp public/js/table-*.js /your-project/public/js/
cp public/js/card-*.js /your-project/public/js/
cp public/js/form-*.js /your-project/public/js/
```

### Step 4: Install Dependencies

```bash
npm install jquery bootstrap bootstrap-icons \
  datatables.net datatables.net-bs5 \
  datatables.net-responsive datatables.net-responsive-bs5 \
  datatables.net-buttons datatables.net-buttons-bs5 \
  jszip pdfmake flatpickr
```

### Step 5: Update Paths (if needed)

If your project structure differs, update paths in the partials:

**In head.ejs:**
```ejs
<!-- Update node_modules path if needed -->
<link href="/node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
```

**In footer.ejs:**
```ejs
<!-- Update script paths if needed -->
<script src="/node_modules/jquery/dist/jquery.min.js"></script>
```

---

## Customization Guide

### 1. Customize Color Scheme

Create a custom CSS file and include it after styles.css:

```css
/* custom-theme.css */
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}

.navbar-dark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}
```

Include in head.ejs:
```ejs
<!-- After styles.css -->
<link href="/css/custom-theme.css" rel="stylesheet">
```

### 2. Add Global JavaScript

Create a global JavaScript file:

```javascript
// global.js
window.myApp = {
  baseUrl: '/api',
  
  showNotification(message, type = 'success') {
    // Your notification logic
    alert(message);
  },
  
  handleError(error) {
    console.error('Error:', error);
    this.showNotification(error.message, 'error');
  }
};
```

Include in footer.ejs:
```ejs
<!-- After other scripts -->
<script src="/js/global.js"></script>
```

### 3. Conditional Script Loading

If you want conditional script loading (like head.ejs), modify footer.ejs:

```ejs
<%
  const config = {
    includeCharts: typeof includeCharts !== 'undefined' ? includeCharts : false
  };
%>

<!-- ... existing scripts ... -->

<% if (config.includeCharts) { %>
<script src="/node_modules/chart.js/dist/chart.min.js"></script>
<% } %>
```

Usage:
```ejs
<%- include('partials/footer', { includeCharts: true }) %>
```

### 4. Add Footer Section

Create a new partial `footer-content.ejs`:

```ejs
<!-- Footer Content -->
<footer class="footer mt-auto py-3 bg-light">
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <span class="text-muted">© 2025 Your Company</span>
      </div>
      <div class="col-md-6 text-end">
        <a href="/privacy" class="text-muted me-3">Privacy</a>
        <a href="/terms" class="text-muted">Terms</a>
      </div>
    </div>
  </div>
</footer>
```

Include before scripts:
```ejs
<%- include('partials/footer-content') %>
<%- include('partials/footer') %>
```

---

## Best Practices

### 1. Conditional Loading
Only load what you need:
```ejs
<!-- ❌ Bad: Loading everything -->
<%- include('partials/head', { 
  includeDataTables: true,
  includeCardView: true,
  includeFlatpickr: true,
  includeFilters: true,
  includeSelection: true
}) %>

<!-- ✅ Good: Loading only what's used -->
<%- include('partials/head', { 
  includeDataTables: true  // Only loading what this page needs
}) %>
```

### 2. Consistent Current View
Always set currentView for proper navigation highlighting:
```ejs
<%- include('partials/header', { currentView: 'users' }) %>
```

### 3. Descriptive Page Titles
Use descriptive titles for better UX and SEO:
```ejs
<%- include('partials/head', { 
  pageTitle: 'User Management - My App'
}) %>
```

### 4. Script Order
Keep script order in footer.ejs:
1. jQuery (must be first)
2. Bootstrap
3. Third-party plugins
4. Your custom scripts

### 5. Mobile Meta Tags
The head partial includes proper mobile meta tags:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 6. Asset Versioning
For production, add version query strings:
```ejs
<link href="/css/styles.css?v=1.2.3" rel="stylesheet">
```

---

## Common Patterns

### Pattern 1: Dashboard Page
```ejs
<%- include('partials/head', { 
  pageTitle: 'Dashboard',
  includeCardView: true
}) %>
<%- include('partials/header', { currentView: 'dashboard' }) %>
<!-- Dashboard content with cards -->
<%- include('partials/footer') %>
```

### Pattern 2: Data Table Page
```ejs
<%- include('partials/head', { 
  pageTitle: 'Data Table',
  includeDataTables: true,
  includeFilters: true,
  includeSelection: true
}) %>
<%- include('partials/header', { currentView: 'data' }) %>
<!-- Table content -->
<%- include('partials/footer') %>
```

### Pattern 3: Form Page
```ejs
<%- include('partials/head', { 
  pageTitle: 'Create Entry',
  includeFlatpickr: true
}) %>
<%- include('partials/header', { currentView: 'create' }) %>
<!-- Form content -->
<%- include('partials/footer') %>
```

### Pattern 4: Combined Features
```ejs
<%- include('partials/head', { 
  pageTitle: 'Complete Dashboard',
  includeDataTables: true,
  includeCardView: true,
  includeFlatpickr: true,
  includeFilters: true
}) %>
<%- include('partials/header', { currentView: 'dashboard' }) %>
<!-- Cards, tables, and forms -->
<%- include('partials/footer') %>
```

---

## Troubleshooting

### Styles Not Loading
- ✅ Check that CSS file paths are correct
- ✅ Verify files exist in public/css directory
- ✅ Check Express static middleware is configured
- ✅ Clear browser cache

### Scripts Not Working
- ✅ Ensure jQuery loads before other scripts
- ✅ Check browser console for errors
- ✅ Verify script paths are correct
- ✅ Check that footer is included before closing body tag

### Navigation Not Highlighting
- ✅ Pass correct `currentView` value to header
- ✅ Check that view name matches nav item condition
- ✅ Verify Bootstrap CSS is loaded

### Icons Not Showing
- ✅ Ensure Bootstrap Icons CSS is loaded in head
- ✅ Verify icon class names are correct
- ✅ Check that icons font files are accessible

---

## Advanced Customization

### Custom Head Configuration

Create a config object in your Express app:

```javascript
// In app.js
app.locals.defaultHeadConfig = {
  includeDataTables: false,
  includeCardView: false,
  includeFlatpickr: false
};

// In routes
app.get('/my-page', (req, res) => {
  res.render('my-page', {
    headConfig: {
      ...app.locals.defaultHeadConfig,
      includeDataTables: true  // Override for this page
    }
  });
});
```

In your view:
```ejs
<%- include('partials/head', headConfig) %>
```

### Environment-Specific Loading

```ejs
<!-- In head.ejs -->
<% if (process.env.NODE_ENV === 'production') { %>
  <!-- Production: Minified CDN -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css">
<% } else { %>
  <!-- Development: Local files -->
  <link href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
<% } %>
```

---

## Migration Guide

### From Static HTML to EJS Partials

**Before (Static HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
  <link href="/css/bootstrap.min.css" rel="stylesheet">
  <!-- ... many more links ... -->
</head>
<body>
  <nav><!-- Navigation HTML --></nav>
  
  <!-- Content -->
  
  <script src="/js/jquery.min.js"></script>
  <script src="/js/bootstrap.min.js"></script>
  <!-- ... many more scripts ... -->
</body>
</html>
```

**After (EJS with Partials):**
```ejs
<!DOCTYPE html>
<html>
<%- include('partials/head', { pageTitle: 'My Page' }) %>
<body>
  <%- include('partials/header', { currentView: 'my-page' }) %>
  
  <!-- Content -->
  
  <%- include('partials/footer') %>
</body>
</html>
```

**Benefits:**
- ✅ Reduced code duplication
- ✅ Easier maintenance
- ✅ Consistent look across pages
- ✅ Conditional asset loading
- ✅ Faster development

---

## Support & Contribution

The layout partials are designed to be flexible and easy to customize. Modify them according to your project's needs.

### Key Files:
- `views/partials/head.ejs` - Manages CSS and meta tags
- `views/partials/header.ejs` - Navigation bar
- `views/partials/footer.ejs` - Script loading

# EJS Partials Documentation - Complete Guide

Welcome to the comprehensive documentation for all reusable EJS partials in this project. These components are designed to be portable, flexible, and easy to integrate into any Node.js/Express project.

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Core Components](#core-components)
3. [Installation & Setup](#installation--setup)
4. [Integration Guide](#integration-guide)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

---

## Quick Start

### What Are These Partials?

This project provides a collection of production-ready, reusable EJS components:

- **🎨 Card Component** - Flexible cards for dashboards and content display
- **📊 DataTable Component** - Advanced data tables with filtering, sorting, and export
- **📝 Dynamic Form Component** - Configuration-driven forms with 8+ field types
- **🎭 Layout Components** - Head, header, and footer for consistent page structure

### Quick Example

```ejs
<!DOCTYPE html>
<html>
<%- include('partials/head', { 
  pageTitle: 'Dashboard',
  includeDataTables: true,
  includeCardView: true
}) %>
<body>
  <%- include('partials/header', { currentView: 'dashboard' }) %>
  
  <div class="container-fluid mt-4">
    <!-- Stat Card -->
    <%- include('partials/card', {
      cardId: 'users',
      cardConfig: {
        type: 'stat',
        title: 'Total Users',
        statValue: '1,234',
        icon: 'people'
      }
    }) %>
    
    <!-- Data Table -->
    <%- include('partials/datatable', {
      id: 'usersTable',
      columns: [
        { data: 'name', title: 'Name' },
        { data: 'email', title: 'Email' }
      ],
      dataSource: users
    }) %>
    
    <!-- Form -->
    <%- include('partials/cet-dynamic-form', {
      id: 'contactForm',
      formConfig: {
        fields: {
          name: { label: 'Name', type: 'text', required: true },
          email: { label: 'Email', type: 'text', required: true }
        }
      }
    }) %>
  </div>
  
  <%- include('partials/footer') %>
</body>
</html>
```

---

## Core Components

### 1. 🎨 Card Partial
[**📖 Full Documentation →**](../CARD_FEATURES.md)

**Purpose:** Flexible card wrapper for dashboards and content display

**Key Features:**
- 6 card types (stat, chart, list, table, datatable, custom)
- Interactive actions (collapse, refresh, fullscreen, close)
- Bootstrap variants and styling
- Loading states

**Quick Usage:**
```ejs
<%- include('partials/card', {
  cardId: 'revenue',
  cardConfig: {
    type: 'stat',
    title: 'Revenue',
    statValue: '$45,678',
    statChange: 12.5
  }
}) %>
```

**When to Use:**
- Dashboard KPI displays
- Statistic visualizations
- Content containers
- Chart wrappers

---

### 2. 📊 DataTable Partial
[**📖 Full Documentation →**](./DATATABLE_PARTIAL.md)

**Purpose:** Advanced data tables with extensive functionality

**Key Features:**
- Column groups & nested headers
- Advanced filtering (text, select, date, range)
- Row selection (single/multiple)
- Inline editing
- Export (CSV, Excel, PDF)
- Server-side processing
- Child rows (expandable details)
- Keyboard navigation
- Accessibility features

**Quick Usage:**
```ejs
<%- include('partials/datatable', {
  id: 'usersTable',
  columns: [
    { data: 'name', title: 'Name' },
    { data: 'email', title: 'Email' }
  ],
  dataSource: users,
  exportButtons: ['copy', 'csv', 'excel'],
  stateSave: true
}) %>
```

**When to Use:**
- Data management interfaces
- Reporting pages
- Admin panels
- Any tabular data display

---

### 3. 📝 Dynamic Form Partial
[**📖 Full Documentation →**](./DYNAMIC_FORM_PARTIAL.md)

**Purpose:** Configuration-driven form generation

**Key Features:**
- 8 field types (text, textarea, select, radio, checkbox, number, file, datetime)
- Responsive layout
- HTML5 validation
- Pre-populated data support
- Flatpickr integration
- Character counters
- AJAX submission

**Quick Usage:**
```ejs
<%- include('partials/cet-dynamic-form', {
  id: 'contactForm',
  formConfig: {
    fields: {
      name: { label: 'Name', type: 'text', required: true },
      email: { label: 'Email', type: 'text', required: true },
      message: { label: 'Message', type: 'textarea', rows: 4 }
    },
    submitButton: { text: 'Send', variant: 'primary' }
  }
}) %>
```

**When to Use:**
- Contact forms
- Data entry forms
- Settings pages
- Any form-based interface

---

### 4. 🎭 Layout Partials
[**📖 Full Documentation →**](./LAYOUT_PARTIALS.md)

**Components:**
- **head.ejs** - Manages CSS dependencies and meta tags
- **header.ejs** - Navigation bar
- **footer.ejs** - JavaScript dependencies

**Purpose:** Consistent page structure and dependency management

**Quick Usage:**
```ejs
<!DOCTYPE html>
<html>
<%- include('partials/head', { 
  pageTitle: 'My Page',
  includeDataTables: true
}) %>
<body>
  <%- include('partials/header', { currentView: 'my-page' }) %>
  
  <!-- Content -->
  
  <%- include('partials/footer') %>
</body>
</html>
```

---

## Installation & Setup

### Prerequisites

- Node.js (v14+)
- Express.js
- EJS template engine

### Step 1: Install Dependencies

```bash
npm install express ejs jquery bootstrap bootstrap-icons \
  datatables.net datatables.net-bs5 \
  datatables.net-responsive datatables.net-responsive-bs5 \
  datatables.net-buttons datatables.net-buttons-bs5 \
  jszip pdfmake flatpickr
```

### Step 2: Configure Express

```javascript
// app.js
const express = require('express');
const path = require('path');
const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### Step 3: Project Structure

```
your-project/
├── app.js
├── package.json
├── views/
│   ├── index.ejs
│   └── partials/
│       ├── head.ejs
│       ├── header.ejs
│       ├── footer.ejs
│       ├── card.ejs
│       ├── datatable.ejs
│       └── dynamic-form.ejs
├── public/
│   ├── css/
│   │   ├── styles.css
│   │   ├── card-view.css
│   │   ├── datatable-*.css
│   │   └── table-*.css
│   └── js/
│       ├── card-init.js
│       ├── card-helpers.js
│       ├── table-init.js
│       ├── table-helpers.js
│       ├── form-init.js
│       ├── form-helpers.js
│       └── table-*.js
└── node_modules/
```

---

## Integration Guide

### Integrating Into Existing Project

#### Option 1: Copy All Files

```bash
# From this project to your project
cp -r views/partials/* /your-project/views/partials/
cp -r public/css/* /your-project/public/css/
cp -r public/js/* /your-project/public/js/
```

#### Option 2: Selective Integration

Pick only what you need:

**For Cards Only:**
```bash
cp views/partials/card.ejs /your-project/views/partials/
cp views/partials/head.ejs /your-project/views/partials/
cp views/partials/footer.ejs /your-project/views/partials/
cp public/css/card-view.css /your-project/public/css/
cp public/js/card-*.js /your-project/public/js/
```

**For DataTables Only:**
```bash
cp views/partials/datatable.ejs /your-project/views/partials/
cp views/partials/head.ejs /your-project/views/partials/
cp views/partials/footer.ejs /your-project/views/partials/
cp public/css/datatable-*.css /your-project/public/css/
cp public/css/table-*.css /your-project/public/css/
cp public/js/datatable-*.js /your-project/public/js/
cp public/js/table-*.js /your-project/public/js/
```

**For Forms Only:**
```bash
cp views/partials/dynamic-form.ejs /your-project/views/partials/
cp views/partials/head.ejs /your-project/views/partials/
cp views/partials/footer.ejs /your-project/views/partials/
cp public/js/form-*.js /your-project/public/js/
```

### Customizing for Your Project

#### 1. Update Branding

Edit `views/partials/header.ejs`:
```ejs
<a href="/" class="navbar-brand mb-0 h1">
  <i class="bi bi-your-icon"></i> Your App Name
</a>
```

#### 2. Update Navigation

Edit `views/partials/header.ejs`:
```ejs
<li class="nav-item">
  <a href="/your-page" class="nav-link <%= currentView === 'your-page' ? 'active' : '' %>">
    <i class="bi bi-your-icon"></i> Your Page
  </a>
</li>
```

#### 3. Customize Styling

Create `public/css/custom.css`:
```css
/* Your custom styles */
:root {
  --primary-color: #your-color;
}

.navbar-dark {
  background: your-gradient !important;
}
```

Include in views:
```ejs
<%- include('partials/head', { pageTitle: 'My Page' }) %>
<link href="/css/custom.css" rel="stylesheet">
```

---

## Best Practices

### 1. Component Selection

✅ **Do:**
- Use cards for dashboard metrics and KPIs
- Use datatables for tabular data with >20 rows
- Use dynamic forms for multi-field forms
- Use layout partials on every page

❌ **Don't:**
- Use datatable for simple lists (use card with list type)
- Use dynamic form for single input (use regular input)
- Load unnecessary CSS/JS (use head partial flags)

### 2. Performance

✅ **Do:**
- Enable server-side processing for large datasets (>10,000 rows)
- Use stateSave to persist table state
- Load only needed CSS/JS via head partial flags
- Lazy load components when possible

❌ **Don't:**
- Load all DataTable features if not needed
- Forget to paginate large datasets
- Include all export buttons if not used

### 3. Accessibility

✅ **Do:**
- Provide descriptive labels for form fields
- Use proper heading hierarchy
- Enable keyboard navigation
- Use ARIA attributes (included in partials)

❌ **Don't:**
- Skip required field indicators
- Forget alt text for images
- Disable keyboard navigation

### 4. Security

✅ **Do:**
- Validate all form inputs server-side
- Sanitize user input before display
- Use CSRF tokens for forms
- Implement proper authentication

❌ **Don't:**
- Trust client-side validation alone
- Display sensitive data in client code
- Skip server-side authorization checks

---

## Common Use Cases

### Use Case 1: Admin Dashboard

```ejs
<%- include('partials/head', { 
  pageTitle: 'Admin Dashboard',
  includeDataTables: true,
  includeCardView: true
}) %>
<%- include('partials/header', { currentView: 'dashboard' }) %>

<div class="container-fluid">
  <div class="row g-3">
    <!-- KPI Cards -->
    <div class="col-md-3">
      <%- include('partials/card', {
        cardId: 'totalUsers',
        cardConfig: {
          type: 'stat',
          title: 'Total Users',
          statValue: '1,234',
          statChange: 12
        }
      }) %>
    </div>
    <!-- More cards... -->
    
    <!-- Data Table -->
    <div class="col-12">
      <%- include('partials/card', {
        cardId: 'usersCard',
        cardConfig: {
          title: 'Users',
          type: 'datatable',
          datatableId: 'usersTable',
          datatableConfig: {
            columns: columns,
            dataSource: users
          }
        }
      }) %>
    </div>
  </div>
</div>

<%- include('partials/footer') %>
```

### Use Case 2: Data Entry Form

```ejs
<%- include('partials/head', { 
  pageTitle: 'Create Entry',
  includeFlatpickr: true
}) %>
<%- include('partials/header', { currentView: 'create' }) %>

<div class="container mt-4">
  <div class="card">
    <div class="card-header">
      <h4>Create New Entry</h4>
    </div>
    <div class="card-body">
      <%- include('partials/dynamic-form', {
        id: 'entryForm',
        formConfig: formConfig
      }) %>
    </div>
  </div>
</div>

<%- include('partials/footer') %>
```

### Use Case 3: Reports Page

```ejs
<%- include('partials/head', { 
  pageTitle: 'Reports',
  includeDataTables: true,
  includeFilters: true
}) %>
<%- include('partials/header', { currentView: 'reports' }) %>

<div class="container-fluid">
  <%- include('partials/datatable', {
    id: 'reportsTable',
    columns: columns,
    dataSource: reports,
    filterConfig: filterConfig,
    exportButtons: ['copy', 'csv', 'excel', 'pdf'],
    stateSave: true
  }) %>
</div>

<%- include('partials/footer') %>
```

---

## Troubleshooting

### Common Issues

#### Issue: Partials not found
**Error:** `Could not find partial 'partials/head'`

**Solution:**
- Check that views directory is configured correctly in Express
- Verify partial files exist in `views/partials/` directory
- Use correct path: `partials/filename` (no .ejs extension)

#### Issue: Styles not loading
**Symptoms:** Unstyled content, Bootstrap not working

**Solutions:**
- Verify static files middleware is configured
- Check that CSS files exist in `public/css/`
- Clear browser cache
- Check browser console for 404 errors
- Verify node_modules is served as static

#### Issue: DataTable not initializing
**Symptoms:** Table shows but no sorting, search, or pagination

**Solutions:**
- Check that `includeDataTables: true` in head partial
- Verify jQuery loads before DataTables
- Check browser console for JavaScript errors
- Ensure table has unique `id` attribute
- Verify `table-init.js` is loaded

#### Issue: Forms not submitting
**Symptoms:** Form submission doesn't work, no AJAX call

**Solutions:**
- Check that `form-init.js` is loaded
- Verify jQuery is available
- Check browser console for errors
- Ensure form has valid action URL
- Verify Express has body-parser middleware

#### Issue: Icons not showing
**Symptoms:** Empty squares or missing icons

**Solutions:**
- Verify Bootstrap Icons CSS is loaded in head
- Check icon names are correct (without 'bi-' prefix in config)
- Ensure font files are accessible
- Clear browser cache

---

## FAQ

### General Questions

**Q: Can I use these partials with other template engines?**
A: These are designed for EJS. You'll need to port them to other engines (Pug, Handlebars, etc.).

**Q: Are these production-ready?**
A: Yes! They're used in production applications and follow best practices.

**Q: Can I customize the styling?**
A: Absolutely! Add your own CSS files or modify the included styles.

**Q: Do I need all the dependencies?**
A: Only install what you use. See individual component docs for specific requirements.

### Component-Specific Questions

**Q: Can I use DataTable without filters or selection?**
A: Yes! All features are optional. Just omit the config objects you don't need.

**Q: Can I add custom field types to dynamic forms?**
A: Yes! Edit the `dynamic-form.ejs` partial to add new field types.

**Q: Can cards be nested inside other cards?**
A: Yes! Cards can contain any content, including other cards.

**Q: How do I handle form validation errors?**
A: Implement server-side validation and return error messages in your API response.

### Integration Questions

**Q: Will this work with my existing Bootstrap project?**
A: Yes! These components use Bootstrap 5. If you're on Bootstrap 4, minor updates may be needed.

**Q: Can I use this with TypeScript?**
A: Yes! The JavaScript files can be converted to TypeScript.

**Q: Does this work with MongoDB/PostgreSQL/MySQL?**
A: Yes! The partials are database-agnostic. You provide the data from your database.

**Q: Can I use this in a microservices architecture?**
A: Yes! Each component works independently and can call different APIs.

---

## Version History

### Current Version: 1.0.0

**Features:**
- Card component with 6 types
- DataTable with advanced filtering, selection, editing
- Dynamic form with 8 field types
- Layout partials (head, header, footer)
- Full documentation

### Roadmap

**Planned Features:**
- Modal component
- Wizard/multi-step form component
- Chart component with Chart.js integration
- Calendar/scheduler component
- File upload component with drag-drop
- Rich text editor integration

---

## Support & Contributing

### Getting Help

1. **Check Documentation** - Review individual component docs
2. **Check Examples** - Look at the complete examples
3. **Browser Console** - Check for JavaScript errors
4. **Network Tab** - Verify assets are loading

### Contributing

To add new features or fix issues:

1. Test thoroughly in browser
2. Update documentation
3. Follow existing code style
4. Ensure backward compatibility

### File Organization

```
docs/partials/
├── README.md                    # This file (master index)
├── DATATABLE_QUICK_START.md    # DataTable quick start guide
├── DYNAMIC_FORM_PARTIAL.md     # Form component documentation
└── LAYOUT_PARTIALS.md          # Layout components documentation

Card documentation in main docs folder:
- ../CARD_QUICK_START.md        # Getting started with cards
- ../CARD_FEATURES.md            # Complete card features reference
- ../CARD_CONFIGURATION.md       # Configuration-driven design guide

DataTable documentation in main docs folder:
- ../DATATABLE_FEATURES.md      # Complete feature reference
- ../DATATABLE_ENHANCEMENTS.md  # Enhancement roadmap
- ../DATATABLE_ORGANIZATION.md  # Architecture guide
```

---

## Quick Reference

### Component Parameters Cheat Sheet

**Card:**
```javascript
{ cardId, cardConfig: { type, title, icon, variant, ... } }
```

**DataTable:**
```javascript
{ id, columns, dataSource, filterConfig, selectionConfig, ... }
```

**Dynamic Form:**
```javascript
{ id, formConfig: { fields, submitButton, ... }, formData }
```

**Layout:**
```javascript
// head.ejs
{ pageTitle, includeDataTables, includeCardView, includeFlatpickr, ... }

// header.ejs
{ currentView }

// footer.ejs
// No parameters
```

---

## License

These components are part of the Error Alert Dashboard project and can be freely used and modified for your projects.

---

## Additional Resources

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [DataTables Documentation](https://datatables.net/)
- [Flatpickr Documentation](https://flatpickr.js.org/)
- [EJS Documentation](https://ejs.co/)
- [Express.js Documentation](https://expressjs.com/)

---

## Credits

Built with:
- Bootstrap 5
- DataTables
- Flatpickr
- jQuery
- Bootstrap Icons

---

**Last Updated:** December 2025

For questions or issues, refer to individual component documentation files.

# Bootstrap Card Wrapper - Features & Documentation

## Overview

The Bootstrap Card Wrapper provides a reusable, parameterized component system for creating consistent, feature-rich cards across your application. Built as an EJS partial with JSON configuration support, it follows the same successful pattern as the DataTable wrapper.

## Architecture

**Files:**
- `views/partials/card.ejs` - Reusable card partial template
- `public/js/lib/card-kit/` - Card library module
  - `core/card-init.js` - Card initialization
  - `core/card-helpers.js` - JavaScript utilities
  - `handlers/card-custom-handlers.js` - Custom update functions
  - `index.js` - Main entry point
- `public/js/card-init-bridge.js` - Bridge for ES6 module loading
- `public/css/cards.css` - Custom styling beyond Bootstrap defaults
- `public/config/cards/*.json` - Card configuration templates

## Card Types

### 1. Stat Card (`type: 'stat'`)
Display key metrics and statistics with optional change indicators.

**Features:**
- Large numeric value display
- Label and subtitle support
- Percentage change with up/down arrows
- Icon support
- Hover animations

**Configuration Example:**
```json
{
  "type": "stat",
  "title": "Total Alerts",
  "icon": "exclamation-triangle",
  "iconColor": "danger",
  "statValue": "1,234",
  "statLabel": "Active Alerts",
  "statChange": 12.5,
  "refreshable": true
}
```

**Usage:**
```ejs
<%- include('partials/card', {
  cardConfig: {
    type: 'stat',
    statValue: alertCount,
    statLabel: 'Total Alerts',
    statChange: percentChange,
    icon: 'exclamation-triangle',
    iconColor: 'danger'
  },
  cardId: 'alertStatsCard'
}) %>
```

### 2. Chart Card (`type: 'chart'`)
Display data visualizations with Chart.js or other charting libraries.

**Features:**
- Canvas element for charts
- Fullscreen mode for detailed viewing
- Refresh functionality
- Export capabilities
- Responsive sizing

**Configuration Example:**
```json
{
  "type": "chart",
  "title": "Response Time Trends",
  "icon": "graph-up",
  "collapsible": true,
  "refreshable": true,
  "fullscreenable": true,
  "chartConfigId": "responseTimeChart"
}
```

**Usage with Chart.js:**
```ejs
<%- include('partials/card', {
  cardConfig: chartCardConfig,
  cardId: 'responseChart'
}) %>

<script>
// Initialize chart after card loads
document.addEventListener('card:initialized', function(e) {
  if (e.detail.cardId === 'responseChart') {
    const ctx = document.getElementById('responseChart-chart');
    new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }
});
</script>
```

### 3. List Card (`type: 'list'`)
Display items as a Bootstrap list group with icons and badges.

**Features:**
- Icon support per item
- Badge display (counts, status, time)
- Badge color variants
- Hover effects
- Empty state handling

**Configuration Example:**
```json
{
  "type": "list",
  "title": "Recent Activities",
  "icon": "list-ul",
  "refreshable": true,
  "listItems": [
    {
      "icon": "check-circle",
      "text": "Server health check passed",
      "badge": "2m ago",
      "badgeColor": "success"
    },
    {
      "icon": "x-circle",
      "text": "Database connection timeout",
      "badge": "5m ago",
      "badgeColor": "danger"
    }
  ]
}
```

**Dynamic Usage:**
```ejs
<%
const activities = getRecentActivities(); // Your data function
const listItems = activities.map(a => ({
  icon: a.type === 'error' ? 'x-circle' : 'check-circle',
  text: a.message,
  badge: a.timeAgo,
  badgeColor: a.type === 'error' ? 'danger' : 'success'
}));
%>

<%- include('partials/card', {
  cardConfig: {
    type: 'list',
    title: 'Recent Activities',
    listItems: listItems,
    refreshable: true
  },
  cardId: 'activitiesCard'
}) %>
```

### 4. Table Card (`type: 'table'`)
Display simple tabular data without full DataTables functionality.

**Features:**
- Lightweight table rendering
- Column headers
- Hover effects
- Responsive design
- Good for small datasets

**Configuration Example:**
```json
{
  "type": "table",
  "title": "System Services",
  "icon": "server",
  "tableHeaders": ["Service", "Status", "Uptime", "Response Time"],
  "tableData": [
    ["Web Server", "✓ Running", "99.9%", "45ms"],
    ["Database", "✓ Running", "99.8%", "12ms"]
  ]
}
```

**Usage:**
```ejs
<%- include('partials/card', {
  cardConfig: {
    type: 'table',
    title: 'System Services',
    tableHeaders: ['Service', 'Status', 'Uptime'],
    tableData: servicesData
  },
  cardId: 'servicesTable'
}) %>
```

### 5. DataTable Card (`type: 'datatable'`)
Embed a full-featured DataTable within a card.

**Features:**
- Full DataTables functionality
- All DataTable wrapper features
- Seamless integration
- Shared styling

**Configuration Example:**
```json
{
  "type": "datatable",
  "title": "User Management",
  "icon": "people",
  "collapsible": true,
  "fullscreenable": true,
  "datatableId": "usersTable",
  "datatableConfig": {
    "columnsFile": "users-columns.json",
    "searching": true,
    "paging": true
  }
}
```

**Usage:**
```ejs
<%- include('partials/card', {
  cardConfig: {
    type: 'datatable',
    title: 'User Management',
    datatableId: 'usersTable',
    datatableConfig: tableConfig
  },
  cardId: 'usersCard',
  cardData: usersData
}) %>
```

### 6. Custom Card (`type: 'custom'`)
Flexible card with custom HTML content or EJS partials.

**Features:**
- HTML content support
- EJS partial includes
- Text content
- All standard card features

**Configuration Examples:**

**Simple Text:**
```json
{
  "type": "custom",
  "title": "Welcome",
  "icon": "house",
  "content": "Welcome to the dashboard!"
}
```

**HTML Content:**
```json
{
  "type": "custom",
  "title": "System Status",
  "htmlContent": "<div class='alert alert-success'>All systems operational</div>"
}
```

**EJS Partial Include:**
```json
{
  "type": "custom",
  "title": "Custom Component",
  "contentPartial": "my-custom-partial",
  "contentData": { "someData": "value" }
}
```

## Common Configuration Options

### Basic Properties

```javascript
{
  type: 'stat|chart|list|table|datatable|custom',
  title: 'Card Title',
  subtitle: 'Card Subtitle',
  icon: 'bootstrap-icon-name',
  iconColor: 'primary|success|danger|warning|info|secondary',
  variant: 'primary|success|danger|warning|info|light|dark',
  size: 'sm|md|lg',
  customClass: 'my-custom-class'
}
```

### Visual Options

```javascript
{
  shadow: true,           // Drop shadow (default: true)
  border: true,           // Card border (default: true)
  bodyClass: 'p-0',      // Custom body classes
  headerClass: 'bg-light', // Custom header classes
  footerClass: 'text-end' // Custom footer classes
}
```

### Interactive Features

```javascript
{
  collapsible: true,      // Show collapse/expand button
  collapsed: false,       // Initial collapsed state
  refreshable: true,      // Show refresh button
  closeable: true,        // Show close button
  fullscreenable: true,   // Show fullscreen button
  loading: false          // Show loading overlay
}
```

### Footer Configuration

**Simple Text:**
```javascript
{
  footer: "Updated 5 minutes ago"
}
```

**Text with Alignment:**
```javascript
{
  footer: {
    text: "Footer text",
    align: 'start|center|end'
  }
}
```

**Action Buttons:**
```javascript
{
  footer: {
    buttons: [
      {
        text: 'Action',
        variant: 'primary',
        size: 'sm',
        icon: 'download',
        action: 'export'
      }
    ],
    align: 'end'
  }
}
```

## JavaScript API

### Initialization

Cards are automatically initialized on page load. Manual initialization:

```javascript
// Initialize all cards
window.cardHelpers.initialize();

// Initialize specific card
const card = document.getElementById('myCard');
window.cardHelpers.initializeCard(card);
```

### Card Instance Methods

```javascript
// Get card instance
const card = window.cardHelpers.getCard('myCard');

// Refresh card
card.refresh();

// Close card
card.close();

// Show/hide loading
card.showLoading();
card.hideLoading();

// Update content
card.updateContent('<p>New content</p>');

// Update stat card
card.updateStats({
  value: '2,456',
  label: 'New Label',
  change: -5.2
});

// Get card state
const state = card.getState();
console.log(state.collapsed, state.loading);
```

### Direct Helper Functions

```javascript
// Refresh card
window.cardHelpers.refreshCard(document.getElementById('myCard'));

// Close card
window.cardHelpers.closeCard(document.getElementById('myCard'));

// Update content
window.cardHelpers.updateCardContent('myCard', '<p>Updated</p>');

// Update stat card
window.cardHelpers.updateStatCard('myCard', {
  value: '3,789',
  change: 15.3
});

// Show toast notification
window.cardHelpers.showToast('Card updated', 'success');
```

### Custom Event Handlers

Define custom behavior using the `window.customHandlers.cards` namespace:

```javascript
window.customHandlers = window.customHandlers || {};
window.customHandlers.cards = {
  myCard: {
    // Custom refresh handler
    refresh: function(cardElement) {
      return fetch('/api/card-data')
        .then(response => response.json())
        .then(data => {
          window.cardHelpers.updateCardContent(
            'myCard', 
            renderTemplate(data)
          );
        });
    },
    
    // Custom close handler (return false to prevent close)
    close: function(cardElement) {
      if (!confirm('Close this card?')) {
        return false;
      }
    }
  }
};
```

### Card Events

Listen for card lifecycle events:

```javascript
// Card initialized
document.addEventListener('card:initialized', (e) => {
  console.log('Card initialized:', e.detail.cardId);
});

// Card action performed
document.getElementById('myCard').addEventListener('card:action', (e) => {
  console.log('Action:', e.detail.action);
});

// Card collapsed/expanded
document.getElementById('myCard').addEventListener('card:collapse', (e) => {
  console.log('Collapsed:', e.detail.collapsed);
});

// Card refreshed
document.getElementById('myCard').addEventListener('card:refresh', (e) => {
  console.log('Card refreshed:', e.detail.cardId);
});

// Card closed
document.addEventListener('card:closed', (e) => {
  console.log('Card closed:', e.detail.cardId);
});

// Card fullscreen toggle
document.getElementById('myCard').addEventListener('card:fullscreen', (e) => {
  console.log('Fullscreen:', e.detail.fullscreen);
});

// Stat card updated
document.getElementById('myCard').addEventListener('card:stat-updated', (e) => {
  console.log('Stats updated:', e.detail.stats);
});
```

### Footer Button Handlers

Handle footer button clicks:

```javascript
document.getElementById('myCard').addEventListener('click', (e) => {
  const button = e.target.closest('[data-card-button]');
  if (button) {
    const action = button.dataset.cardButton;
    
    switch(action) {
      case 'export':
        exportCardData();
        break;
      case 'configure':
        showConfigModal();
        break;
      default:
        console.log('Button action:', action);
    }
  }
});
```

## Complete Usage Examples

### Example 1: Dashboard with Multiple Cards

```ejs
<!-- views/dashboard.ejs -->
<!DOCTYPE html>
<html>
<head>
  <%- include('partials/head') %>
  <link rel="stylesheet" href="/css/cards.css">
</head>
<body>
  <%- include('partials/header') %>
  
  <div class="container-fluid mt-4">
    <div class="row">
      <!-- Stat Cards -->
      <div class="col-md-3">
        <%- include('partials/card', {
          cardConfig: {
            type: 'stat',
            title: 'Total Alerts',
            icon: 'exclamation-triangle',
            iconColor: 'danger',
            statValue: totalAlerts,
            statLabel: 'Active Alerts',
            statChange: alertsChange,
            refreshable: true
          },
          cardId: 'totalAlertsCard'
        }) %>
      </div>
      
      <div class="col-md-3">
        <%- include('partials/card', {
          cardConfig: {
            type: 'stat',
            title: 'System Uptime',
            icon: 'clock',
            iconColor: 'success',
            statValue: uptime,
            statLabel: 'Hours',
            variant: 'success'
          },
          cardId: 'uptimeCard'
        }) %>
      </div>
      
      <div class="col-md-3">
        <%- include('partials/card', {
          cardConfig: {
            type: 'stat',
            title: 'Active Users',
            icon: 'people',
            iconColor: 'info',
            statValue: activeUsers,
            statLabel: 'Online Now',
            statChange: usersChange
          },
          cardId: 'usersCard'
        }) %>
      </div>
      
      <div class="col-md-3">
        <%- include('partials/card', {
          cardConfig: {
            type: 'stat',
            title: 'Response Time',
            icon: 'speedometer',
            iconColor: 'warning',
            statValue: avgResponseTime + 'ms',
            statLabel: 'Average',
            statChange: responseChange
          },
          cardId: 'responseCard'
        }) %>
      </div>
    </div>
    
    <div class="row mt-4">
      <!-- Chart Card -->
      <div class="col-md-8">
        <%- include('partials/card', {
          cardConfig: chartConfig,
          cardId: 'trendsChart'
        }) %>
      </div>
      
      <!-- List Card -->
      <div class="col-md-4">
        <%- include('partials/card', {
          cardConfig: activitiesConfig,
          cardId: 'recentActivities'
        }) %>
      </div>
    </div>
    
    <div class="row mt-4">
      <!-- DataTable Card -->
      <div class="col-12">
        <%- include('partials/card', {
          cardConfig: {
            type: 'datatable',
            title: 'Recent Alerts',
            icon: 'table',
            collapsible: true,
            fullscreenable: true,
            datatableId: 'alertsTable',
            datatableConfig: tableConfig
          },
          cardId: 'alertsTableCard',
          cardData: alertsData
        }) %>
      </div>
    </div>
  </div>
  
  <script src="/js/card-helpers.js"></script>
</body>
</html>
```

### Example 2: Dynamic Card Updates

```javascript
// Refresh stat cards periodically
setInterval(() => {
  fetch('/api/stats')
    .then(response => response.json())
    .then(data => {
      // Update alert count
      window.cardHelpers.updateStatCard('totalAlertsCard', {
        value: data.alerts.toLocaleString(),
        change: data.alertsChange
      });
      
      // Update active users
      window.cardHelpers.updateStatCard('usersCard', {
        value: data.users.toLocaleString(),
        change: data.usersChange
      });
      
      // Update response time
      window.cardHelpers.updateStatCard('responseCard', {
        value: data.responseTime + 'ms',
        change: data.responseChange
      });
    });
}, 30000); // Update every 30 seconds
```

### Example 3: Custom Refresh Handler

```javascript
// Define custom refresh handler for activities card
window.customHandlers = window.customHandlers || {};
window.customHandlers.cards = {
  recentActivities: {
    refresh: function(card) {
      return fetch('/api/activities')
        .then(response => response.json())
        .then(activities => {
          // Build new list HTML
          const listHtml = activities.map(a => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <i class="bi bi-${a.icon} me-2"></i>
                ${a.text}
              </span>
              <span class="badge bg-${a.badgeColor} rounded-pill">
                ${a.badge}
              </span>
            </li>
          `).join('');
          
          // Update card content
          const listGroup = card.querySelector('.list-group');
          listGroup.innerHTML = listHtml;
          
          window.cardHelpers.showToast('Activities refreshed', 'success');
        })
        .catch(error => {
          console.error('Refresh error:', error);
          window.cardHelpers.showToast('Failed to refresh', 'danger');
        });
    }
  }
};
```

### Example 4: Configuration from JSON Files

```javascript
// app.js route handler
app.get('/dashboard', (req, res) => {
  // Load card configurations
  const statCardConfig = JSON.parse(
    fs.readFileSync('public/config/cards/stat-card.json', 'utf8')
  );
  const chartCardConfig = JSON.parse(
    fs.readFileSync('public/config/cards/chart-card.json', 'utf8')
  );
  const listCardConfig = JSON.parse(
    fs.readFileSync('public/config/cards/list-card.json', 'utf8')
  );
  
  // Fetch dynamic data
  const stats = getSystemStats();
  const activities = getRecentActivities();
  
  // Customize configs with dynamic data
  statCardConfig.statValue = stats.alertCount.toLocaleString();
  statCardConfig.statChange = stats.alertChange;
  listCardConfig.listItems = activities;
  
  res.render('dashboard', {
    statCardConfig,
    chartCardConfig,
    listCardConfig
  });
});
```

## Styling and Theming

### Custom Card Styling

Add custom classes to cards:

```ejs
<%- include('partials/card', {
  cardConfig: {
    type: 'stat',
    title: 'Custom Styled Card',
    customClass: 'my-custom-card border-primary',
    headerClass: 'bg-primary text-white',
    bodyClass: 'bg-light'
  },
  cardId: 'customCard'
}) %>
```

### Gradient Headers

Use predefined gradient classes:

```ejs
<%- include('partials/card', {
  cardConfig: {
    type: 'chart',
    title: 'Analytics',
    headerClass: 'card-header-gradient-primary'
  },
  cardId: 'analyticsCard'
}) %>
```

Available gradients:
- `card-header-gradient-primary`
- `card-header-gradient-success`
- `card-header-gradient-danger`
- `card-header-gradient-warning`
- `card-header-gradient-info`

### Responsive Design

Cards automatically adapt to different screen sizes. Control layout with Bootstrap grid:

```ejs
<div class="row">
  <div class="col-12 col-md-6 col-lg-3 mb-3">
    <%- include('partials/card', { ... }) %>
  </div>
</div>
```

## Accessibility Features

- ARIA labels on action buttons
- Keyboard navigation support
- Screen reader-friendly content
- High contrast mode support
- Reduced motion support
- Focus indicators

## Best Practices

1. **Use Appropriate Card Types**: Choose the card type that best fits your data
2. **Consistent Sizing**: Use consistent card sizes within a row
3. **Meaningful Icons**: Select icons that clearly represent the content
4. **Refresh Handlers**: Implement custom refresh logic for dynamic content
5. **Loading States**: Show loading overlays during data fetches
6. **Error Handling**: Handle errors gracefully in custom handlers
7. **State Persistence**: Collapsed states are automatically saved to localStorage
8. **Event Listeners**: Clean up event listeners when cards are removed
9. **Mobile Friendly**: Test card layouts on mobile devices
10. **Performance**: Avoid too many auto-refresh cards on one page

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- Bootstrap 5.x
- Bootstrap Icons
- jQuery (optional, for DataTable cards)
- DataTables (optional, for DataTable cards)

## License

Same as parent project.

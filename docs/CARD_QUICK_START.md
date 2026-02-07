# Card Wrapper - Quick Start Guide

## What is the Card Wrapper?

A reusable Bootstrap card component system that follows the same pattern as the DataTable wrapper. Create consistent, feature-rich cards across your application using JSON configuration and EJS partials.

## Installation

Already installed! The card wrapper is ready to use in your application.

**Files Created:**
- `views/partials/card.ejs` - The reusable card partial
- `public/js/lib/card-kit/` - Card library (core/, handlers/)
- `public/css/cards.css` - Custom styling
- `public/config/cards/*.json` - Configuration templates
- `CARD_FEATURES.md` - Complete documentation

## Quick Usage

### 1. Include in Your View

```ejs
<!DOCTYPE html>
<html>
<head>
  <%- include('partials/head') %>
  <link rel="stylesheet" href="/css/cards.css">
</head>
<body>
  <%- include('partials/header') %>
  
  <!-- Your card goes here -->
  <%- include('partials/card', {
    cardConfig: {
      type: 'stat',
      title: 'Total Alerts',
      icon: 'exclamation-triangle',
      statValue: '1,234',
      statLabel: 'Active Alerts'
    },
    cardId: 'myCard'
  }) %>
  
  <script type="module" src="/js/card-init-bridge.js"></script>
</body>
</html>
```

### 2. Common Card Types

**Important:** When using cards with dynamic updates (like dashboard cards), define the `cardId` property in your configuration JSON file instead of hard-coding it in JavaScript.

**Stat Card (Metrics/KPIs):**
```ejs
<%- include('partials/card', {
  cardConfig: {
    type: 'stat',
    statValue: '99.9%',
    statLabel: 'Uptime',
    statChange: 0.5
  },
  cardId: 'uptimeCard'
}) %>
```

**List Card (Activities/Events):**
```ejs
<%- include('partials/card', {
  cardConfig: {
    type: 'list',
    title: 'Recent Activities',
    listItems: [
      { icon: 'check-circle', text: 'Task completed', badge: '2m ago' }
    ]
  },
  cardId: 'activitiesCard'
}) %>
```

**Table Card (Simple Data):**
```ejs
<%- include('partials/card', {
  cardConfig: {
    type: 'table',
    title: 'Services',
    tableHeaders: ['Name', 'Status'],
    tableData: [
      ['Web Server', 'Running'],
      ['Database', 'Running']
    ]
  },
  cardId: 'servicesCard'
}) %>
```

**Custom Card (Flexible Content):**
```ejs
<%- include('partials/card', {
  cardConfig: {
    type: 'custom',
    title: 'Welcome',
    content: 'Your custom content here'
  },
  cardId: 'welcomeCard'
}) %>
```

### 3. Using Configuration Files

**For dashboard/dynamic cards, define `cardId` and `clickAction` in your config:**
```json
// public/config/cet-dashboard-cards.json
{
  "applications": {
    "cardId": "applicationCard",       // DOM element ID
    "clickAction": "/cet-apps",        // Navigation URL (optional)
    "icon": "app-indicator",
    "label": "Applications",
    "description": "Total number of CET applications being monitored",
    "thresholds": {
      "warning": 999,
      "danger": 9999
    }
  },
  "messages": {
    "cardId": "messageCard",
    "clickAction": "/cet-issues",
    "icon": "envelope",
    "label": "Messages/Queues",
    "description": "Total pending messages awaiting processing",
    "thresholds": {
      "warning": 200,
      "danger": 400
    }
  }
}
```

**Benefits of configuration-driven cards:**
- ✅ Single source of truth for card IDs and behavior
- ✅ No hard-coded IDs in JavaScript
- ✅ Easy to modify card behavior without code changes
- ✅ Click actions defined alongside card properties

**For static cards, create a config file:**
```json
// public/config/cards/my-card.json
{
  "type": "stat",
  "title": "My Metric",
  "icon": "speedometer",
  "statValue": "42",
  "statLabel": "Performance Score",
  "refreshable": true
}
```

**Load in route:**
```javascript
// app.js
app.get('/my-page', (req, res) => {
  const cardConfig = JSON.parse(
    fs.readFileSync('public/config/cards/my-card.json', 'utf8')
  );
  
  res.render('my-page', { cardConfig });
});
```

**Use in view:**
```ejs
<%- include('partials/card', {
  cardConfig: cardConfig,
  cardId: 'myCard'
}) %>
```

### 4. Interactive Features

Add action buttons to your cards:

```ejs
<%- include('partials/card', {
  cardConfig: {
    type: 'custom',
    title: 'Interactive Card',
    collapsible: true,    // Add collapse button
    refreshable: true,    // Add refresh button
    closeable: true,      // Add close button
    fullscreenable: true, // Add fullscreen button
    content: 'Your content'
  },
  cardId: 'interactiveCard'
}) %>
```

### 5. JavaScript API

Update cards dynamically:

```javascript
// Get card instance
const card = window.cardHelpers.getCard('myCard');

// Refresh card
card.refresh();

// Update stat card
card.updateStats({
  value: '2,500',
  change: 15.3
});

// Show loading
card.showLoading();

// Update content
card.updateContent('<p>New content</p>');
```

### 6. Custom Refresh Handler

Define custom behavior when refresh is clicked:

```javascript
window.customHandlers = window.customHandlers || {};
window.customHandlers.cards = {
  myCard: {
    refresh: function(cardElement) {
      return fetch('/api/my-data')
        .then(response => response.json())
        .then(data => {
          window.cardHelpers.updateCardContent('myCard', data.html);
        });
    }
  }
};
```

## Card Types at a Glance

| Type | Purpose | Best For |
|------|---------|----------|
| `stat` | Key metrics | KPIs, statistics, counts |
| `chart` | Visualizations | Graphs, charts, analytics |
| `list` | Item lists | Activities, notifications, feeds |
| `table` | Tabular data | Simple tables, summaries |
| `datatable` | Full DataTable | Large datasets with features |
| `custom` | Anything else | Flexible content |

## Common Configuration Options

```javascript
{
  // Basic
  type: 'stat|chart|list|table|datatable|custom',
  title: 'Card Title',
  subtitle: 'Optional subtitle',
  icon: 'bootstrap-icon-name',
  iconColor: 'primary|success|danger|warning|info',
  
  // Visual
  variant: 'primary|success|danger|warning|info',
  size: 'sm|md|lg',
  shadow: true,
  border: true,
  
  // Interactive
  collapsible: true,
  refreshable: true,
  closeable: true,
  fullscreenable: true,
  loading: false,
  
  // Footer
  footer: 'Text' or {
    text: 'Footer text',
    buttons: [...]
  }
}
```

## Examples

Visit `/cards` in your application to see all card types and features in action!

## Dashboard Grid Layout Example

```ejs
<div class="row">
  <!-- Stat Cards Row -->
  <div class="col-md-3">
    <%- include('partials/card', { cardConfig: alertsCard, cardId: 'alerts' }) %>
  </div>
  <div class="col-md-3">
    <%- include('partials/card', { cardConfig: usersCard, cardId: 'users' }) %>
  </div>
  <div class="col-md-3">
    <%- include('partials/card', { cardConfig: uptimeCard, cardId: 'uptime' }) %>
  </div>
  <div class="col-md-3">
    <%- include('partials/card', { cardConfig: responseCard, cardId: 'response' }) %>
  </div>
</div>

<div class="row mt-4">
  <!-- Chart and List Row -->
  <div class="col-md-8">
    <%- include('partials/card', { cardConfig: chartCard, cardId: 'chart' }) %>
  </div>
  <div class="col-md-4">
    <%- include('partials/card', { cardConfig: activitiesCard, cardId: 'activities' }) %>
  </div>
</div>
```

## Need More Help?

- **Full Documentation:** See `CARD_FEATURES.md`
- **Config Templates:** Check `public/config/cards/`
- **Live Examples:** Visit `http://localhost:3000/cards`
- **Pattern Reference:** See how DataTables are used (same pattern)

## Benefits

✅ **Consistent Design** - All cards follow the same structure  
✅ **Reusable** - Write once, use everywhere  
✅ **Configurable** - JSON configuration for flexibility  
✅ **Interactive** - Built-in collapse, refresh, close, fullscreen  
✅ **Maintainable** - Single source of truth  
✅ **Extensible** - Easy to add custom behavior  
✅ **Accessible** - ARIA support and keyboard navigation  
✅ **Responsive** - Mobile-friendly out of the box  

## What's Next?

1. **Start Simple** - Use stat cards for your dashboard metrics
2. **Add Interactivity** - Enable refresh buttons for dynamic content
3. **Custom Handlers** - Implement refresh logic for your data sources
4. **Explore Features** - Try list, table, and chart cards
5. **Combine with DataTables** - Embed full datatables in cards

Happy coding! 🚀

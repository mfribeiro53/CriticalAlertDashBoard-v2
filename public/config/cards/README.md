# Card Configuration Templates

This directory contains JSON configuration templates for different card types used with the Bootstrap card wrapper.

## Available Templates

### `stat-card.json`
Configuration for statistic/metric display cards.
- Shows large numeric values with labels
- Supports percentage change indicators
- Ideal for KPIs and metrics

### `chart-card.json`
Configuration for cards containing charts.
- Integrates with Chart.js or other charting libraries
- Supports fullscreen mode for detailed viewing
- Includes export and configuration actions

### `list-card.json`
Configuration for list-style cards.
- Bootstrap list group styling
- Icon and badge support per item
- Perfect for activity feeds and notifications

### `table-card.json`
Configuration for simple table display.
- Lightweight alternative to DataTables
- Good for small datasets or summaries
- Responsive table design

### `custom-card.json`
Configuration for custom content cards.
- Flexible content area
- Supports HTML content or EJS partials
- All card features available (collapse, refresh, close, fullscreen)

## Usage

1. Copy a template that matches your needs
2. Modify the configuration values
3. Load the config in your route handler:

```javascript
const cardConfig = JSON.parse(
  fs.readFileSync('public/config/cards/my-card.json', 'utf8')
);

res.render('my-view', { cardConfig });
```

4. Include the card partial in your EJS view:

```ejs
<%- include('partials/card', { 
  cardConfig: cardConfig,
  cardId: 'myCard',
  cardData: myData
}) %>
```

## Configuration Options

See `CARD_FEATURES.md` in the root directory for complete documentation of all configuration options.

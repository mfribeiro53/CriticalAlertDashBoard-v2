# Card Configuration Reference

## Overview

Cards in this application follow a **configuration-driven architecture** where all card properties, including DOM element IDs and click actions, are defined in JSON configuration files rather than hard-coded in JavaScript.

## Configuration File Structure

### Dashboard Cards

Dashboard cards that display dynamic metrics should include these essential properties:

```json
{
  "cardKey": {
    "cardId": "string",           // Required: DOM element ID
    "clickAction": "string|null",  // Optional: Navigation URL
    "icon": "string",             // Bootstrap icon name (without 'bi-' prefix)
    "label": "string",            // Card title/label
    "description": "string",      // Card description text
    "thresholds": {               // Optional: Color thresholds
      "warning": number,
      "danger": number
    }
  }
}
```

### Property Descriptions

#### cardId (Required)
- **Type:** String
- **Purpose:** Unique DOM element ID for the card
- **Example:** `"applicationCard"`, `"totalQueuesCard"`
- **Usage:** Used by JavaScript to locate and update the card
- **Note:** Must match the `id` attribute in your HTML/EJS template

#### clickAction (Optional)
- **Type:** String or null
- **Purpose:** URL to navigate to when card is clicked
- **Example:** `"/cet-apps"`, `"/cet-queues"`, `null`
- **Behavior:** 
  - If provided: Card becomes clickable and navigates to the URL
  - If null: Card is not clickable (no navigation)

#### icon (Required)
- **Type:** String
- **Purpose:** Bootstrap icon to display
- **Example:** `"app-indicator"`, `"envelope"`, `"x-octagon"`
- **Format:** Icon name without the `bi-` prefix
- **Reference:** [Bootstrap Icons](https://icons.getbootstrap.com/)

#### label (Required)
- **Type:** String
- **Purpose:** Main label/title displayed on the card
- **Example:** `"Applications"`, `"Total Messages"`

#### description (Required)
- **Type:** String
- **Purpose:** Descriptive text explaining what the metric represents
- **Example:** `"Total number of CET applications being monitored in the system"`

#### thresholds (Optional)
- **Type:** Object with `warning` and `danger` properties
- **Purpose:** Defines color thresholds for visual alerts
- **Example:**
  ```json
  {
    "warning": 200,
    "danger": 400
  }
  ```
- **Behavior:**
  - Value below warning: Success (green)
  - Value >= warning: Warning (yellow/orange)
  - Value >= danger: Danger (red)
- **Special Values:**
  - Set to `null` to disable threshold styling
  - Use `Infinity` in code for cards that should never warn

## Example Configurations

### CET Dashboard Cards

**File:** `public/config/cet-dashboard-cards.json`

```json
{
  "applications": {
    "cardId": "applicationCard",
    "clickAction": "/cet-apps",
    "icon": "app-indicator",
    "label": "Applications",
    "description": "Total number of CET applications being monitored in the system",
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
    "description": "Total pending messages awaiting processing across all integration queues",
    "thresholds": {
      "warning": 200,
      "danger": 400
    }
  },
  "processesBehind": {
    "cardId": "processesBehindCard",
    "clickAction": null,
    "icon": "hourglass-split",
    "label": "Processes Behind",
    "description": "Count of integration processes experiencing delays beyond expected SLA",
    "thresholds": {
      "warning": 20,
      "danger": 50
    }
  }
}
```

### CET Apps Cards

**File:** `public/config/cet-apps-cards.json`

```json
{
  "totalApps": {
    "cardId": "totalApps",
    "icon": "hdd-stack",
    "label": "Total Applications",
    "description": "Total number of applications registered in the CET configuration registry",
    "thresholds": null
  },
  "activeApps": {
    "cardId": "activeApps",
    "icon": "check-circle",
    "label": "Active",
    "description": "Number of applications currently in active status and available for use",
    "thresholds": null
  }
}
```

### CET Queues Cards

**File:** `public/config/cet-queues-cards.json`

```json
{
  "disabledQueues": {
    "cardId": "disabledQueuesCard",
    "icon": "x-circle",
    "label": "Disabled Queues",
    "description": "Number of queues temporarily disabled due to errors or maintenance",
    "thresholds": {
      "warning": 3,
      "danger": 5
    }
  },
  "totalMessages": {
    "cardId": "totalMessagesCard",
    "icon": "envelope",
    "label": "Total Messages",
    "description": "Total pending messages awaiting processing across all queues",
    "thresholds": {
      "warning": 50,
      "danger": 100
    }
  }
}
```

## JavaScript Usage

### Reading Configuration

Configuration files are loaded asynchronously and card IDs are read from the config:

```javascript
// Load configuration
const response = await fetch('/config/cet-dashboard-cards.json');
const cardConfig = await response.json();

// Update card using config.cardId (not hard-coded)
updateDashboardCard(
  cardConfig.applications.cardId,          // ✅ From config
  applicationCount,
  cardConfig.applications.icon,
  cardConfig.applications.label,
  cardConfig.applications.description,
  cardConfig.applications.thresholds
);
```

### Setting Up Click Handlers

Click handlers are automatically configured from the `clickAction` property:

```javascript
const setupClickHandlers = (cardConfig) => {
  Object.values(cardConfig).forEach(config => {
    const card = document.getElementById(config.cardId);
    if (card && config.clickAction) {
      card.addEventListener('click', () => {
        window.location.href = config.clickAction;
      });
      card.style.cursor = 'pointer';
    }
  });
};
```

### Iterating Over Cards

Easily loop through all cards in a configuration:

```javascript
// Render all cards from config
Object.values(cardConfig).forEach(config => {
  updateDashboardCard(
    config.cardId,
    0, // Initial value
    config.icon,
    config.label,
    config.description,
    config.thresholds
  );
});
```

## Best Practices

### ✅ DO

1. **Define cardId in config files**
   ```json
   { "cardId": "myCard" }
   ```

2. **Use descriptive card IDs**
   ```json
   { "cardId": "totalApplicationsCard" }
   ```
   Not: `{ "cardId": "card1" }`

3. **Set clickAction to null if not clickable**
   ```json
   { "clickAction": null }
   ```

4. **Use meaningful descriptions**
   ```json
   { "description": "Total number of active users in the system" }
   ```

5. **Set appropriate thresholds**
   ```json
   { "thresholds": { "warning": 100, "danger": 200 } }
   ```

### ❌ DON'T

1. **Don't hard-code card IDs in JavaScript**
   ```javascript
   // ❌ Bad
   updateDashboardCard('applicationCard', ...)
   
   // ✅ Good
   updateDashboardCard(cardConfig.applications.cardId, ...)
   ```

2. **Don't hard-code navigation URLs**
   ```javascript
   // ❌ Bad
   card.addEventListener('click', () => {
     window.location.href = '/cet-apps';
   });
   
   // ✅ Good
   if (config.clickAction) {
     card.addEventListener('click', () => {
       window.location.href = config.clickAction;
     });
   }
   ```

3. **Don't create duplicate ID mappings**
   ```javascript
   // ❌ Bad
   const cardMappings = [
     { id: 'applicationCard', config: cardConfig.applications },
     { id: 'messageCard', config: cardConfig.messages }
   ];
   
   // ✅ Good - Use config.cardId directly
   Object.values(cardConfig).forEach(config => {
     updateCard(config.cardId, ...);
   });
   ```

## Migration Guide

### Converting Hard-Coded Cards to Configuration-Driven

**Before (Hard-coded):**
```javascript
// Hard-coded IDs and URLs
updateDashboardCard('applicationCard', count, ...);
updateDashboardCard('messageCard', count, ...);

document.getElementById('applicationCard').addEventListener('click', () => {
  window.location.href = '/cet-apps';
});
```

**After (Configuration-driven):**
```javascript
// Load config once
const cardConfig = await fetch('/config/cards.json').then(r => r.json());

// Use config for updates
updateDashboardCard(cardConfig.applications.cardId, count, ...);
updateDashboardCard(cardConfig.messages.cardId, count, ...);

// Setup clicks from config
Object.values(cardConfig).forEach(config => {
  if (config.clickAction) {
    document.getElementById(config.cardId).addEventListener('click', () => {
      window.location.href = config.clickAction;
    });
  }
});
```

## Benefits

✅ **Single Source of Truth** - All card properties in one place  
✅ **Easy Maintenance** - Update card IDs without touching JavaScript  
✅ **No Code Duplication** - DRY principle applied  
✅ **Flexible** - Add/remove/modify cards via config  
✅ **Testable** - Configuration can be validated independently  
✅ **Scalable** - New cards require only config updates  

## Related Documentation

- [CARD_QUICK_START.md](CARD_QUICK_START.md) - Getting started with cards
- [CARD_FEATURES.md](CARD_FEATURES.md) - Complete card features reference
- [DEVELOPER_NOTES.md](DEVELOPER_NOTES.md) - Architecture and patterns
- [README.md](README.md) - General documentation

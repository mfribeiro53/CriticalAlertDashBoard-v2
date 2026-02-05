# Accessibility Features - User Guide

## Overview

The DataTable Dashboard includes comprehensive accessibility features to ensure all users can effectively interact with the application, regardless of ability or assistive technology used.

## Two Core Accessibility Features

### 1. 🔊 Enhanced ARIA Support (Screen Readers)

**What it does:**  
Provides context-aware announcements for screen reader users, making all table interactions accessible.

**Features:**
- Live announcements for sorting, searching, pagination
- Cell position announcements during navigation
- Row selection counts
- Data change notifications
- Table metadata (row/column counts)

**Screen Reader Support:**
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (Mac/iOS)
- TalkBack (Android)

**Usage:**
Simply navigate the table with your screen reader. All interactions will be announced automatically.

---

### 2. ⌨️ Keyboard Navigation (Mouse-Free Operation)

**What it does:**  
Full keyboard support for all table operations. No mouse required!

**Navigation Keys:**

| Key | Action |
|-----|--------|
| **↑** | Move up one cell |
| **↓** | Move down one cell |
| **←** | Move left one cell |
| **→** | Move right one cell |
| **Home** | Jump to first column |
| **End** | Jump to last column |
| **Ctrl+Home** | Jump to first cell (top-left) |
| **Ctrl+End** | Jump to last cell (bottom-right) |
| **Page Up** | Go to previous page |
| **Page Down** | Go to next page |

**Action Keys:**

| Key | Action |
|-----|--------|
| **Enter** | Edit cell or activate row |
| **Space** | Select/deselect row |
| **Escape** | Cancel operation or clear selection |
| **Tab** | Move to next editable cell |
| **Shift+Tab** | Move to previous editable cell |

**Shortcuts:**

| Shortcut | Action |
|----------|--------|
| **Ctrl+F** | Focus search box |
| **Ctrl+A** | Select all rows |
| **Ctrl+E** | Export table |
| **Ctrl+R** | Refresh table data |
| **Alt+P** | Previous page |
| **Alt+N** | Next page |
| **?** | Show keyboard shortcuts help |

**Pro Tips:**
- Start by clicking any cell, then use arrow keys
- The last row's down arrow automatically goes to the next page
- Tab key only moves between editable cells (skips read-only)
- Press `?` anytime to see the full shortcuts reference

---

## Quick Start Guide

### For Screen Reader Users:

1. Navigate to any table view (e.g., `/table-view`)
2. Use your screen reader's table navigation commands
3. Arrow keys will move between cells with position announcements
4. All sort, search, and pagination actions are announced
5. Cell contents and column names are read automatically

### For Keyboard-Only Users:

1. Navigate to any table
2. Click any cell to start
3. Use arrow keys to navigate
4. Press `?` to see all shortcuts
5. Use shortcuts for quick actions:
   - `Ctrl+F` to search
   - `Ctrl+A` to select all
   - `Space` to select rows

---

## Testing Your Configuration

### Test ARIA Announcements:
1. Enable your screen reader
2. Navigate to `/table-view`
3. Sort a column - hear "Table sorted by..."
4. Search for text - hear "Search results: X rows found"
5. Change pages - hear "Page X of Y"

### Test Keyboard Navigation:
1. Go to `/table-view`
2. Click first cell
3. Press arrow keys to move
4. Press `?` to see shortcuts modal
5. Try `Ctrl+F` to focus search
6. Press `Space` to select rows

---

## Configuration Files

Each table has its own accessibility configuration:

- `public/config/table-aria.json` - Alerts table ARIA
- `public/config/table-keyboard.json` - Alerts keyboard
- `public/config/users-aria.json` - Users table ARIA
- `public/config/users-keyboard.json` - Users keyboard
- `public/config/services-aria.json` - Services table ARIA
- `public/config/services-keyboard.json` - Services keyboard
- `public/config/demographics-aria.json` - Demographics ARIA
- `public/config/demographics-keyboard.json` - Demographics keyboard

### Customizing Announcements:

Edit the ARIA config file:

```json
{
  "enabled": true,
  "announceSort": true,
  "announceSearch": true,
  "messages": {
    "initialized": "Custom initialization message",
    "searchLabel": "Custom search label"
  }
}
```

### Customizing Keyboard Shortcuts:

Edit the keyboard config file:

```json
{
  "enabled": true,
  "arrowKeyNavigation": true,
  "enterToEdit": true,
  "helpShortcut": true
}
```

---

## Compliance

### WCAG 2.1 Level AA:

✅ **1.4.3 Contrast (Minimum)**: High contrast modes exceed 7:1 ratio  
✅ **2.1.1 Keyboard**: Full keyboard accessibility  
✅ **2.4.3 Focus Order**: Logical focus progression  
✅ **2.4.7 Focus Visible**: Enhanced focus indicators  
✅ **3.3.2 Labels**: ARIA labels for all controls  
✅ **4.1.2 Name, Role, Value**: Proper ARIA roles  
✅ **4.1.3 Status Messages**: Live region announcements  

### Section 508 Compliance:

✅ Fully compliant with Section 508 standards  
✅ Compatible with government accessibility requirements  

---

## Browser Support

**Full Support:**
- Chrome 90+ ✅
- Edge 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Opera 76+ ✅

**Screen Reader Support:**
- Windows: NVDA, JAWS
- Mac/iOS: VoiceOver
- Android: TalkBack
- Linux: Orca

---

## Troubleshooting

### Screen Reader Not Announcing:

1. Verify screen reader is running
2. Check browser is in focus
3. Try refreshing the page
4. Verify ARIA config is enabled in JSON

### Keyboard Navigation Not Working:

1. Ensure you've clicked a cell first
2. Check browser console for errors
3. Verify table-feature-keyboard.js is loaded
4. Try pressing `?` for help modal

### Focus Indicators Not Visible:

1. Try tabbing with keyboard
2. Check if `.using-keyboard` class is added to body
3. Inspect element for focus styles

---

## Feedback & Support

If you encounter accessibility issues:

1. Note the specific table/view
2. Describe the assistive technology used
3. Document the steps to reproduce
4. Check browser console for errors

The accessibility features are designed to work seamlessly together, providing a comprehensive accessible experience for all users.

---

**Last Updated:** December 15, 2025  
**Version:** 1.0.0


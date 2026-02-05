# Dynamic Form Partial Documentation

## Overview
The `dynamic-form.ejs` partial is a fully flexible, configuration-driven form component that dynamically renders any field type based on JSON configuration. It's perfect for creating forms without writing repetitive HTML.

## File Location
```
views/partials/dynamic-form.ejs
```

## Features
- 🎨 **8 Field Types**: text, textarea, select, radio, checkbox, number, file, datetime
- 📱 **Responsive Layout**: Automatic Bootstrap grid layout
- ✅ **Built-in Validation**: HTML5 and Bootstrap validation
- 🔄 **Pre-populated Data**: Support for editing existing data
- 📊 **Dynamic Data Sources**: Integrate with your API data
- 🎯 **Flatpickr Integration**: Beautiful datetime picker
- 🔢 **Character Counters**: For textarea fields with maxLength
- 🎨 **Compact Design**: form-control-sm for space efficiency

---

## Quick Start

### 1. Required Dependencies

#### CSS Files (in `<head>`):
```ejs
<%- include('partials/head', { 
  includeFlatpickr: true  // Only if using datetime fields
}) %>
```

#### JavaScript Files (before `</body>`):
```ejs
<%- include('partials/footer') %>
```

The footer partial automatically includes:
- `form-init.js` - Initializes forms and Flatpickr
- `form-helpers.js` - Helper functions
- `form-dynamic.js` - Core form logic

#### NPM Packages:
```json
{
  "jquery": "^3.x",
  "bootstrap": "^5.x",
  "flatpickr": "^4.x"
}
```

---

### 2. Basic Usage

#### In Your EJS View:
```ejs
<!DOCTYPE html>
<html>
<%- include('partials/head', { 
  pageTitle: 'My Form',
  includeFlatpickr: true 
}) %>
<body>
  <%- include('partials/header', { currentView: 'my-form' }) %>
  
  <div class="container">
    <%- include('partials/cet-dynamic-form', {
      id: 'myForm',
      formConfig: formConfig
    }) %>
  </div>
  
  <%- include('partials/footer') %>
</body>
</html>
```

#### In Your Express Route:
```javascript
app.get('/my-form', (req, res) => {
  const formConfig = {
    action: '/api/submit',
    method: 'POST',
    fields: {
      name: {
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your name'
      },
      email: {
        label: 'Email',
        type: 'text',
        required: true,
        placeholder: 'your.email@example.com'
      },
      message: {
        label: 'Message',
        type: 'textarea',
        required: true,
        rows: 4,
        maxLength: 500
      }
    },
    submitButton: {
      text: 'Send',
      variant: 'primary',
      icon: 'bi-send'
    }
  };
  
  res.render('my-form', { formConfig });
});
```

---

## Configuration Reference

### Form Configuration Object

```javascript
{
  // Form attributes
  action: '/api/endpoint',      // Form action URL
  method: 'POST',                // HTTP method (default: 'POST')
  
  // Field definitions
  fields: {
    fieldName: {
      // Field configuration (see Field Types below)
    }
  },
  
  // Submit button configuration
  submitButton: {
    text: 'Submit',              // Button text
    variant: 'primary',          // Bootstrap variant
    icon: 'bi-send'              // Bootstrap icon class
  },
  
  // Optional: Data sources for select fields
  appDataSource: [],             // Array for 'appId' field
  assignedToDataSource: [],      // Array for 'assignedTo' field
  
  // Optional settings
  showToast: true                // Show success toast (default: true)
}
```

---

## Field Types

### 1. Text Input
```javascript
fieldName: {
  label: 'Field Label',
  type: 'text',                   // Can be omitted (default)
  required: true,                 // Optional
  placeholder: 'Enter text...',   // Optional
  maxLength: 100,                 // Optional
  helpText: 'Help information',   // Tooltip icon
  colClass: 'col-md-4'           // Bootstrap column class
}
```

### 2. Textarea
```javascript
description: {
  label: 'Description',
  type: 'textarea',
  required: true,
  rows: 5,                        // Number of visible rows
  maxLength: 500,                 // Shows character counter
  placeholder: 'Enter description...'
}
```

### 3. Select Dropdown
```javascript
priority: {
  label: 'Priority',
  type: 'select',
  required: true,
  placeholder: 'Select priority...',
  options: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]
}
```

#### Dynamic Select (using data sources):
```javascript
// In your form configuration
{
  fields: {
    appId: {
      label: 'Application',
      type: 'select',
      required: true
      // options not needed - uses appDataSource
    }
  },
  appDataSource: [
    { id: 1, iGateApp: 'App1', cetApp: 'CET1' },
    { id: 2, iGateApp: 'App2', cetApp: 'CET2' }
  ]
}
```

### 4. Radio Buttons
```javascript
status: {
  label: 'Status',
  type: 'radio',
  required: true,
  options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]
}
```

### 5. Checkbox
```javascript
agreement: {
  label: 'I agree to the terms',
  type: 'checkbox',
  required: true,
  helpText: 'You must agree to continue'
}
```

### 6. Number Input
```javascript
quantity: {
  label: 'Quantity',
  type: 'number',
  required: true,
  min: 1,                         // Minimum value
  max: 100,                       // Maximum value
  placeholder: '0'
}
```

### 7. File Upload
```javascript
attachment: {
  label: 'Upload File',
  type: 'file',
  required: false,
  accept: '.pdf,.doc,.docx',      // Accepted file types
  multiple: false                 // Allow multiple files
}
```

### 8. DateTime Picker
```javascript
scheduledDate: {
  label: 'Scheduled Date & Time',
  type: 'datetime',
  required: true,
  placeholder: 'Select date and time...'
}
```

---

## Pre-populating Form Data (Edit Mode)

When editing existing data, pass `formData` object:

```javascript
app.get('/edit-item/:id', (req, res) => {
  // Fetch existing data
  const existingData = {
    name: 'John Doe',
    email: 'john@example.com',
    priority: 'high',
    scheduledDate: '2025-12-20 14:30'
  };
  
  res.render('my-form', {
    formConfig: formConfig,
    formData: existingData  // Pre-populates the form
  });
});
```

In your EJS:
```ejs
<%- include('partials/dynamic-form', {
  id: 'editForm',
  formConfig: formConfig,
  formData: formData
}) %>
```

---

## Custom Layout

### Column Width Control
```javascript
fields: {
  firstName: {
    label: 'First Name',
    type: 'text',
    colClass: 'col-md-6'  // Half width
  },
  lastName: {
    label: 'Last Name',
    type: 'text',
    colClass: 'col-md-6'  // Half width
  },
  bio: {
    label: 'Biography',
    type: 'textarea',
    colClass: 'col-12'     // Full width
  }
}
```

### Default Column Widths
- Text/Number/Select/DateTime: `col-md-4` (3 per row)
- Textarea: `col-12` (full width)
- Checkbox: `col-12` (full width)

---

## Form Submission Handling

### Client-Side (Automatic)
The form automatically handles submission via AJAX. On success, it:
1. Shows a success toast notification
2. Resets the form
3. Triggers custom events

### Server-Side Example
```javascript
// Express route handler
app.post('/api/submit', async (req, res) => {
  try {
    const formData = req.body;
    
    // Process the data
    await saveToDatabase(formData);
    
    // Return success response
    res.json({
      success: true,
      message: 'Form submitted successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

---

## Extending & Customizing

### 1. Add Custom Validation

Create `form-custom-validation.js`:
```javascript
export function setupCustomValidation(formId) {
  const form = document.getElementById(formId);
  
  form.addEventListener('submit', function(e) {
    // Your custom validation logic
    const email = form.querySelector('[name="email"]').value;
    if (!email.endsWith('@company.com')) {
      e.preventDefault();
      alert('Please use company email');
      return false;
    }
  });
}
```

Include in your page:
```html
<script type="module">
  import { setupCustomValidation } from '/js/form-custom-validation.js';
  setupCustomValidation('myForm');
</script>
```

### 2. Custom Form Actions

Listen to form events:
```javascript
document.getElementById('myForm').addEventListener('formSubmitSuccess', (e) => {
  console.log('Form submitted:', e.detail);
  // Redirect or perform other actions
  window.location.href = '/success';
});

document.getElementById('myForm').addEventListener('formSubmitError', (e) => {
  console.error('Form error:', e.detail);
  // Show custom error message
});
```

### 3. Add New Field Types

To add a new field type, modify the partial:

1. Open `views/partials/dynamic-form.ejs`
2. Add a new condition in the field rendering section:
```ejs
<% } else if (fieldType === 'customType') { %>
  <!-- Your custom field HTML -->
  <input type="text" class="form-control" ... />
<% } %>
```

3. Update the `getFieldType` helper function if needed

---

## Integration with Other Projects

### Step 1: Copy Required Files
```bash
# Partial file
cp views/partials/dynamic-form.ejs /your-project/views/partials/

# JavaScript files
cp public/js/form-init.js /your-project/public/js/
cp public/js/form-helpers.js /your-project/public/js/
cp public/js/form-dynamic.js /your-project/public/js/
```

### Step 2: Install Dependencies
```bash
npm install jquery bootstrap flatpickr
```

### Step 3: Include in Your Layout
```ejs
<!-- In your main layout head -->
<link href="/node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="/node_modules/flatpickr/dist/flatpickr.min.css" rel="stylesheet">

<!-- Before closing body tag -->
<script src="/node_modules/jquery/dist/jquery.min.js"></script>
<script src="/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
<script src="/node_modules/flatpickr/dist/flatpickr.min.js"></script>
<script type="module" src="/js/form-init.js"></script>
```

### Step 4: Use in Your Views
```ejs
<%- include('partials/dynamic-form', {
  id: 'yourFormId',
  formConfig: yourConfig
}) %>
```

---

## Complete Example

### Express Route
```javascript
app.get('/contact-form', (req, res) => {
  const formConfig = {
    action: '/api/contact',
    method: 'POST',
    fields: {
      name: {
        label: 'Full Name',
        type: 'text',
        required: true,
        colClass: 'col-md-6'
      },
      email: {
        label: 'Email Address',
        type: 'text',
        required: true,
        colClass: 'col-md-6'
      },
      phone: {
        label: 'Phone Number',
        type: 'text',
        required: false,
        colClass: 'col-md-6'
      },
      company: {
        label: 'Company',
        type: 'text',
        required: false,
        colClass: 'col-md-6'
      },
      subject: {
        label: 'Subject',
        type: 'select',
        required: true,
        options: [
          { value: 'general', label: 'General Inquiry' },
          { value: 'support', label: 'Technical Support' },
          { value: 'sales', label: 'Sales Question' }
        ]
      },
      priority: {
        label: 'Priority Level',
        type: 'radio',
        required: true,
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' }
        ]
      },
      message: {
        label: 'Message',
        type: 'textarea',
        required: true,
        rows: 5,
        maxLength: 1000,
        helpText: 'Please provide details about your inquiry'
      },
      attachment: {
        label: 'Attachment (Optional)',
        type: 'file',
        accept: '.pdf,.doc,.docx,.jpg,.png',
        colClass: 'col-md-6'
      },
      followUpDate: {
        label: 'Preferred Follow-up Date',
        type: 'datetime',
        required: false,
        colClass: 'col-md-6'
      },
      newsletter: {
        label: 'Subscribe to our newsletter',
        type: 'checkbox',
        required: false
      }
    },
    submitButton: {
      text: 'Send Message',
      variant: 'success',
      icon: 'bi-envelope-check'
    }
  };
  
  res.render('contact-form', { formConfig });
});

app.post('/api/contact', (req, res) => {
  // Handle form submission
  console.log('Contact form data:', req.body);
  res.json({ success: true, message: 'Message sent successfully!' });
});
```

### View File (contact-form.ejs)
```ejs
<!DOCTYPE html>
<html lang="en">
<%- include('partials/head', { 
  pageTitle: 'Contact Us',
  includeFlatpickr: true 
}) %>
<body>
  <%- include('partials/header', { currentView: 'contact' }) %>
  
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">
              <i class="bi bi-envelope"></i> Contact Us
            </h4>
          </div>
          <div class="card-body">
            <%- include('partials/dynamic-form', {
              id: 'contactForm',
              formConfig: formConfig
            }) %>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <%- include('partials/footer') %>
</body>
</html>
```

---

## Troubleshooting

### Forms Not Submitting
- ✅ Check that `form-init.js` is loaded
- ✅ Verify jQuery is loaded before form scripts
- ✅ Check browser console for errors
- ✅ Ensure form has valid `id` attribute

### Flatpickr Not Working
- ✅ Include `includeFlatpickr: true` in head partial
- ✅ Verify Flatpickr CSS and JS are loaded
- ✅ Check that field type is 'datetime'

### Validation Not Working
- ✅ Ensure Bootstrap JS is loaded
- ✅ Check that required fields have `required: true`
- ✅ Verify form has `novalidate` attribute

### Data Not Pre-populating
- ✅ Ensure `formData` object keys match field names
- ✅ Check that values are in correct format
- ✅ For select fields, ensure value exists in options

---

## API Reference

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String | No | Unique form identifier (auto-generated if omitted) |
| `formConfig` | Object | Yes | Form configuration object |
| `formData` | Object | No | Pre-populated form data for edit mode |

### Form Config Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `action` | String | '/api/submit' | Form submission URL |
| `method` | String | 'POST' | HTTP method |
| `fields` | Object | {} | Field definitions (see Field Types) |
| `submitButton` | Object | {...} | Submit button configuration |
| `appDataSource` | Array | [] | Data for 'appId' select field |
| `assignedToDataSource` | Array | [] | Data for 'assignedTo' select field |
| `showToast` | Boolean | true | Show success toast notification |

---

## Best Practices

1. **Always provide unique form IDs** when using multiple forms on same page
2. **Use appropriate field types** for better UX (datetime for dates, number for quantities)
3. **Add helpText** for complex fields to guide users
4. **Set maxLength** on text fields to prevent overflow
5. **Use colClass** to create logical form layouts
6. **Pre-populate data** when editing to improve UX
7. **Handle server errors** gracefully with meaningful messages
8. **Test validation** thoroughly before deployment

---

## Support & Contribution

For issues or enhancements, modify the partial and JavaScript files according to your needs. The component is designed to be extended easily.

### Key Files to Modify:
- `views/partials/dynamic-form.ejs` - HTML structure and field types
- `public/js/form-init.js` - Initialization logic
- `public/js/form-helpers.js` - Helper functions
- `public/js/form-dynamic.js` - Core form behavior

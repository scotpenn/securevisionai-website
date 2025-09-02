# SecureVision AI - Development Style Guide

## Overview

This style guide establishes naming conventions, coding standards, and development workflows to ensure consistency across the SecureVision AI website codebase and prevent issues like navigation menu inconsistencies.

## File & Directory Naming Conventions

### General Rules
- **Use kebab-case** for all files and directories
- **No spaces** in file or directory names  
- **Lowercase only** except for specific exceptions
- **Descriptive names** that clearly indicate purpose

### Examples
```
✅ Good:
- customer-care.html
- product-detail.css  
- navigation.json
- styleguide.md

❌ Bad:
- customerCare.html
- ProductDetail.css
- Navigation.JSON
- Style Guide.md
```

### File Type Conventions

**HTML Files**:
```
- index.html
- about.html
- contact.html
- customer-care.html (not custumer-care.html)
```

**CSS Files**:
```
- common.css (global styles)
- index.css (homepage styles)
- product-detail.css (product page styles)
```

**JavaScript Files**:
```
- common.js (global functions)
- products.js (product-specific logic)
```

**Configuration Files**:
```
- navigation.json
- site-config.json
- products-master.json
```

**Images**:
```
- product-id-description.jpg
- svc138-main.jpg
- banner.jpg
- logo-main.png
```

## CSS Architecture & Naming

### CSS Class Naming - BEM + Kebab-Case
Use a simplified BEM (Block Element Modifier) approach with kebab-case:

```css
/* Block */
.nav-mantine { }

/* Element */
.nav-mantine .nav-logo { }
.nav-mantine .nav-menu { }
.nav-mantine .nav-dropdown { }

/* Modifier */
.nav-mantine.transparent { }
.nav-mantine.scrolled { }
```

### CSS Architecture Layers
Follow strict layering to prevent conflicts:

```
1. common.css (Base Layer - Weight: 10)
   - CSS variables and design tokens
   - Global navigation, footer, hero styles  
   - Utility classes
   - Base component styles

2. page-specific.css (Feature Layer - Weight: 20)
   - Page-unique layouts and components
   - Page-specific overrides (when absolutely necessary)

3. inline styles (Override Layer - Weight: 30)
   - Emergency fixes only
   - Dynamic styles via JavaScript
```

### CSS Rules
- **Maximum 2 levels** of selector nesting
- **Avoid !important** unless absolutely necessary
- **Use CSS variables** for colors, spacing, fonts
- **No #ID selectors** for styling (use for JS hooks only)
- **Class names must be semantic**, not presentational

```css
/* ✅ Good */
.product-card { }
.nav-dropdown-item { }
.hero-background { }

/* ❌ Bad */  
.red-button { }
.big-text { }
.mb-20 { }
```

## JavaScript Standards

### General Conventions
- **Use ES6+ features** (const, let, arrow functions, async/await)
- **Avoid global variables** - wrap in IIFE or modules
- **Check DOM elements exist** before manipulating
- **Use data attributes** for JavaScript hooks

```javascript
// ✅ Good
const navbar = document.getElementById('navbar');
if (!navbar) return;

const productsItem = container.querySelector('[data-menu="products"]');

// ❌ Bad  
var navbar = document.getElementById('navbar');
navbar.classList.add('scrolled'); // Could throw error if null

const productsItem = container.querySelector('.nav-item.products');
```

### Function Naming
- **camelCase** for function names
- **Descriptive verbs** that explain what the function does

```javascript
// ✅ Good
function hydrateNavigation() { }
function initDropdownMenus() { }
function handleScroll() { }

// ❌ Bad
function nav() { }
function init() { } // Too generic
function doStuff() { }
```

## Navigation System Standards

### Single Source of Truth
- **All navigation content** must be defined in `/config/navigation.json`
- **Never hard-code** navigation items in HTML
- **Use data attributes** to mark navigation containers: `data-menu="products"`

### Navigation HTML Structure
```html
<!-- ✅ Correct - Placeholder Structure -->
<li class="nav-item" data-menu="products">
  <a href="/products/all.html" class="nav-link">Products</a>
  <div class="nav-dropdown">
    <!-- Content populated by common.js -->
  </div>
</li>

<!-- ❌ Incorrect - Hard-coded Items -->
<li class="nav-item">
  <a href="#" class="nav-link">Products</a>
  <div class="nav-dropdown">
    <div class="nav-dropdown-item">
      <a href="/products/indoor">Indoor Cameras</a>
    </div>
  </div>
</li>
```

### Link URL Standards
- **Use absolute paths** starting with `/`
- **Consistent anchor naming** matching the target page
- **No relative paths** like `../` or `./`

```javascript
// ✅ Good
"/products/all.html#indoor"
"/contact.html"
"/images/logo.png"

// ❌ Bad
"products/all.html#indoor-cameras"
"../contact.html"
"./images/logo.png"
```

## Configuration File Standards

### JSON Structure
- **Use consistent indentation** (2 spaces)
- **Include metadata** section with version, dates, description
- **Group related data** logically
- **Use descriptive property names**

```json
{
  "navigation": {
    "main": {
      "en": [
        {
          "id": "products",
          "label": "Products", 
          "href": "/products/all.html",
          "type": "dropdown",
          "items": [...]
        }
      ]
    }
  },
  "meta": {
    "version": "1.0.0",
    "last_updated": "2025-09-02",
    "description": "Navigation configuration"
  }
}
```

## Development Workflow

### Before Making Changes
1. **Read existing code** to understand current patterns
2. **Check if configuration files** need updates instead of code changes
3. **Test changes locally** before committing
4. **Follow naming conventions** consistently

### Navigation Updates
1. **Edit `/config/navigation.json`** - never edit HTML directly
2. **Test all pages** to ensure consistent rendering  
3. **Verify all links work** and point to correct locations
4. **Check mobile responsiveness**

### CSS Updates  
1. **Determine correct layer** (common.css vs page-specific)
2. **Use CSS variables** when possible
3. **Avoid !important** - use higher specificity instead
4. **Test across all pages** that use the CSS file

## Common Anti-Patterns to Avoid

### Navigation
❌ **Different menu items on different pages**
❌ **Hard-coding navigation in HTML**
❌ **Inconsistent link URLs or anchor names**
❌ **Missing data-menu attributes**

### CSS
❌ **Duplicating styles across multiple CSS files**
❌ **Using !important for quick fixes**  
❌ **ID selectors for styling**
❌ **Non-semantic class names**

### JavaScript
❌ **Global variable pollution**
❌ **Not checking if DOM elements exist**
❌ **Using class names as JavaScript selectors**
❌ **Hard-coding navigation content in JS**

## Testing Checklist

Before committing changes, verify:

- [ ] **All pages load** without JavaScript errors  
- [ ] **Navigation menus** are identical across all pages
- [ ] **All links work** and go to correct locations
- [ ] **Mobile navigation** functions properly
- [ ] **Logo switching** works on scroll (transparent ↔ scrolled)
- [ ] **CSS validates** with no conflicts
- [ ] **No console errors** in browser developer tools

## Tools & Validation

### Recommended Tools
- **Stylelint** for CSS validation
- **ESLint** for JavaScript standards  
- **JSON Schema** for configuration validation
- **Live Server** for local testing

### Browser Testing
Test on these minimum browsers:
- Chrome (latest)
- Safari (latest) 
- Firefox (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## File Structure Reference

```
/
├── config/
│   ├── navigation.json          # Navigation configuration
│   └── navigation.schema.json   # JSON Schema validation
├── css/
│   ├── common.css              # Base layer styles
│   ├── index.css               # Homepage styles  
│   ├── about.css               # About page styles
│   └── [page-name].css         # Other page styles
├── js/
│   ├── common.js               # Global functionality
│   └── pages/
│       └── [page-name].js      # Page-specific logic
├── docs/
│   ├── styleguide.md          # This file
│   └── naming-conventions.md   # Extended naming rules
├── images/
│   ├── logo-main.png          # Standard logo
│   ├── banner.jpg             # Hero background
│   └── [product-id]-[desc].jpg # Product images
└── [page-name].html           # HTML pages
```

## Version Control

### Commit Messages
Use clear, descriptive commit messages:

```
✅ Good:
- "Add navigation configuration system"
- "Update Products menu to use dynamic rendering"
- "Fix navigation consistency across all pages"

❌ Bad:
- "Fix stuff"
- "Update"
- "Changes"
```

### Branching
- **Main branch**: stable, production-ready code
- **Feature branches**: `feature/navigation-system`, `fix/logo-sizing`
- **Never commit directly** to main branch

---

**Last Updated**: 2025-09-02  
**Version**: 1.0  
**Maintained By**: Development Team

For questions about this style guide, please review existing code patterns or consult the team.
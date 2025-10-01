# Unused Modules Archive

This directory contains code modules that are no longer used in the production codebase but are preserved for reference.

## Archived Modules

### product-detail.js (Archived: 2025-10-01)

**Why Archived:**
- Product detail pages now use inline JavaScript for tab switching and gallery functionality
- The module was redundant with simpler inline implementations in templates
- Removing it reduces page load time and complexity

**Original Purpose:**
- Loaded and parsed compiled JSON product data
- Rendered product information dynamically (title, images, specs, etc.)
- Managed tab navigation and gallery interactions
- Provided error boundaries and friendly error messages

**Replacement:**
Product detail pages are now generated as static HTML with:
- All content pre-rendered from JSON5 → JSON compilation
- Simple inline JavaScript for UI interactions (tabs, gallery)
- No need for JSON parsing or dynamic content loading

**If You Need to Restore:**
If dynamic product loading is needed in the future, this module provides:
- Comprehensive error handling with friendly UI messages
- Development logging helpers (isDev detection)
- Language detection and bilingual support
- Product data loading with fetch API
- Rendering functions for all product sections

**Related Files:**
- `products/detail/template.html` - English product detail template
- `fr/products/detail/template-fr.html` - French product detail template
- `scripts/generate-product-pages.js` - Static page generator

# SecureVision AI - I18n Implementation Guide

## Overview

This document describes the lightweight internationalization (i18n) system implemented for the SecureVision AI website, supporting English (en) and French (fr) languages.

## Architecture

### Mixed Approach
- **English (Primary)**: Root directory (`/index.html`, `/about.html`, etc.)
- **French (Secondary)**: `/fr/` directory with mirrored structure
- **Shared Resources**: Common CSS, JS, and image files
- **Language Detection**: Automatic based on URL path structure

### Key Components

#### 1. Translation Dictionary Files
Located in `/i18n/`:
- `site.en.json` - English translations (114 keys)
- `site.fr.json` - French translations (114 keys)

**Structure:**
```json
{
  "navigation": { "home": "HOME", "about": "ABOUT" },
  "productCategories": { "indoor": "Indoor Products" },
  "homepage": { "tagline": "Home, Business and Recreational Security" },
  "productFeatures": { "hdVideo": "Full HD 2MP 1080p live view" },
  // ... organized by functional areas
}
```

#### 2. Enhanced common.js
**I18n Module Features:**
- **Language Detection**: `I18n.detectLanguage()` from URL path
- **Translation Loading**: Async loading with fallback mechanism
- **Key Resolution**: `I18n.t(key, fallback)` with nested key support
- **DOM Application**: `I18n.applyTranslations()` for data-i18n elements

**Integration:**
```javascript
// Initialization sequence:
// 1. Detect language → 2. Load translations → 3. Apply to DOM → 
// 4. Hydrate navigation → 5. Bind interactions
```

#### 3. Bilingual Navigation System
**Configuration**: `/config/navigation.json`
- Contains both `en` and `fr` navigation structures
- Dynamic loading based on detected language
- Consistent category anchors across languages

**French Navigation:**
```json
{
  "navigation": {
    "main": {
      "en": [...],
      "fr": [
        {
          "id": "products",
          "label": "Produits",
          "href": "/fr/products/all-fr.html",
          "items": [
            { "label": "Caméras Intérieures", "href": "/fr/products/all-fr.html#indoor" }
          ]
        }
      ]
    }
  }
}
```

#### 4. HTML Integration
**Data Attributes:**
```html
<h1 class="hero-title" data-i18n="homepage.tagline">
  Home, Business and Recreational Security
</h1>
```

**SEO Hreflang Links:**
```html
<link rel="alternate" hreflang="en" href="https://securevision.ai/index.html">
<link rel="alternate" hreflang="fr" href="https://securevision.ai/fr/home.html">
<link rel="alternate" hreflang="x-default" href="https://securevision.ai/index.html">
```

#### 5. Validation System
**Script**: `/scripts/validate-i18n.js`
- Translation completeness checking
- Navigation consistency validation  
- HTML data-i18n usage scanning
- Hreflang link verification

**Usage:**
```bash
npm run validate-i18n
```

## Translation Source Integration

### Existing Resources Utilized
- **Translation Glossary**: `/fr/TRANSLATION-GLOSSARY.md` (173 lines, 300+ mappings)
- **Product Translations**: `/fr/glossary_2.md` (product descriptions)
- **Legacy JSON**: `/fr/glossary.json` (existing translations)

### Key Mappings Extracted
```
Product Categories:
- Indoor Products → Produits d'Intérieur
- Baby & Pet Monitor Products → Produits de Surveillance Pour Bébés et Animaux de Compagnie

Navigation:
- HOME → ACCUEIL
- PRODUCTS → PRODUITS  
- ABOUT → À PROPOS

Features:
- Full HD 2MP 1080p live view → Vue en direct Full HD 2MP 1080p
- Two-way audio → Audio bidirectionnel
- InfraRed night vision → Vision nocturne infrarouge
```

## Implementation Features

### ✅ Completed Components
1. **Unified Translation Dictionaries** - Extracted from existing resources
2. **Language Detection** - URL path-based (`/fr/` detection)
3. **Dynamic Navigation** - Language-aware dropdown menus
4. **Fallback System** - EN → fallback → key display
5. **SEO Integration** - Hreflang links for search engines
6. **Validation Tools** - Pre-commit hook ready script

### 🔧 Technical Specifications
- **Performance**: Async loading, cached translations
- **Compatibility**: Pure JavaScript, no frameworks required  
- **Accessibility**: ARIA attributes preserved
- **SEO**: Proper hreflang and language meta tags
- **Maintainability**: Single source of truth for translations

### 📊 Current Status
- **Translation Coverage**: 114 keys each for EN/FR
- **HTML Integration**: 1 data-i18n attribute demonstrated (index.html)  
- **Navigation**: Full bilingual support (7 product categories)
- **Validation**: 0 errors, 1 warning (needs more hreflang in HTML)

## Usage Examples

### Adding New Translations
1. **Add to dictionaries:**
```json
// i18n/site.en.json
"newSection": {
  "title": "New Feature",
  "description": "Feature description"
}

// i18n/site.fr.json  
"newSection": {
  "title": "Nouvelle Fonctionnalité",
  "description": "Description de la fonctionnalité"
}
```

2. **Apply to HTML:**
```html
<h2 data-i18n="newSection.title">New Feature</h2>
<p data-i18n="newSection.description">Feature description</p>
```

### Adding New Pages
1. **Create French version** in `/fr/` directory
2. **Add navigation entries** to `navigation.json`
3. **Include hreflang links** in HTML head
4. **Run validation** with `npm run validate-i18n`

## Development Workflow

### Adding Translations
1. Check existing `/fr/TRANSLATION-GLOSSARY.md` for approved translations
2. Add entries to both `site.en.json` and `site.fr.json` 
3. Apply `data-i18n` attributes to HTML elements
4. Run validation script to check completeness
5. Test both English and French URLs

### Quality Assurance
- **Automated**: `npm run validate-i18n` for consistency checks
- **Manual**: Visual testing of `/` vs `/fr/` pages
- **SEO**: Verify hreflang links and language meta tags

## Next Steps

### High Priority
1. **Apply data-i18n** to remaining HTML pages (about.html, contact.html, products/all.html)
2. **Add hreflang links** to all HTML pages  
3. **Sync French pages** with new architecture (common.css + page CSS)

### Medium Priority
1. **URL Structure** - Consider `/en/` parallel structure
2. **Product Data** - Integrate with JSON5 product files
3. **Dynamic Content** - JavaScript-generated content translations

### Optional Enhancements
1. **Language Switcher** - UI component for manual language switching
2. **Browser Detection** - Accept-Language header integration
3. **Caching Strategy** - localStorage for translation performance

## File Structure
```
/
├── i18n/
│   ├── site.en.json          # English translations
│   └── site.fr.json          # French translations
├── config/
│   └── navigation.json       # Bilingual navigation (v2.0.0)
├── js/
│   └── common.js             # Enhanced with I18n module
├── scripts/
│   └── validate-i18n.js      # Validation script
├── fr/                       # French page directory
│   ├── home.html
│   ├── about.html
│   ├── contact.html
│   └── products/all-fr.html
└── [page].html               # English pages with data-i18n
```

## Performance Notes
- **Translation Loading**: ~2KB per language file
- **Render Blocking**: Minimal, async loading after DOM ready
- **Caching**: Browser cache-friendly with cache headers
- **Bundle Size**: No external dependencies, pure vanilla JS

---

**Implementation Date**: September 2, 2025  
**Version**: 1.0.0  
**Languages Supported**: English (en), French (fr)  
**Validation Status**: ✅ All core components functional
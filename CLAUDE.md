# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SecureVision AI is a static product showcase website for a security camera and power protection company. The site displays various security products including indoor/outdoor cameras, doorbells, baby monitors, sports cameras, and portable power systems. **This is a display-only site with NO e-commerce functionality** - products are showcased but not sold directly through the website.

## Development Commands

### Local Development
```bash
# Run with Python
python -m http.server 8000

# Run with Node
npx http-server

# Direct file access - open HTML files directly in browser
```

## Current Architecture

### CSS System (Modular Architecture)
The site uses a layered, modular CSS architecture with complete migration from brand_style.css:

**common.css** - Base layer
- Defines all CSS variables and design tokens
- Global styles for navigation, footer, hero sections
- Common components and utility classes
- Logo switching system styles

**Page-specific CSS**
- `css/index.css` - Homepage styles
- `css/products.css` - Product catalog page styles
- `css/product-detail.css` - Product detail page styles
- `css/about.css` - About page specific styles
- `css/contact.css` - Contact form and page styles
- `css/customer-care.css` - Customer service page styles

### JavaScript Architecture
**common.js** - Global functionality
- Navigation state management and logo switching
- Scroll-based header transparency
- Mobile menu toggle
- Loading animations

**Page-specific JS** - Located in `js/pages/`
- `products.js` - Product filtering and grid management
- `contact.js` - Form validation and submission
- `about.js` - About page interactions
- `product-detail.js` - Bilingual product detail pages with smart image loading

**No jQuery dependency** - Pure vanilla JavaScript

### Page Migration Status

All main pages have been successfully migrated to the new architecture (common.css + page-specific CSS):
- ✅ **index.html** - Homepage
- ✅ **about.html** - About page
- ✅ **contact.html** - Contact page
- ✅ **customer-care.html** - Customer support
- ✅ **products/all.html** - Product catalog
- ✅ **products/detail/template.html** - Product detail template (EN)
- ✅ **products/detail/svc138.html** - SVC138 product page (EN)
- ✅ **fr/products/detail/template-fr.html** - Product detail template (FR)
- ✅ **fr/products/detail/svc138.html** - SVC138 product page (FR)
- ⏳ **fr/** directory - Other French translations (needs sync with new architecture)

### Bilingual Architecture
- **English (Primary)**: Root directory (`/index.html`, `/about.html`, etc.)
- **French**: `/fr/` directory with mirrored structure
- **Translation data**: 
  - `/i18n/site.en.json` - English site translations
  - `/i18n/site.fr.json` - French site translations  
  - `/products/data/products/[id].json5` - Individual product data with EN/FR content
  - `/data/products.json` - Legacy product catalog (being phased out)
  - `/data/site-config.json` - Site-wide translations
  - `/fr/TRANSLATION-GLOSSARY.md` - Translation reference (173 lines)

### Product Data Management
- **Primary product database**: `products/data/products-master.json`
  - Categories: `indoor`, `baby-pet-monitor`, `outdoor`, `doorbell`, `sports`, `secure-power`
  - Product structure: id, name, name_cn, price, images, features, specifications
- **Legacy product catalog**: `data/products.json` (being phased out)
- **Site configuration**: `data/site-config.json` - Navigation labels, feature lists, site descriptions in EN/FR

### Image Optimization
Images follow responsive naming convention:
- Base: `image.jpg`
- Responsive: `image-p-500.jpg`, `image-p-800.jpg`, `image-p-1080.jpg`
- Thumbnails: `image-p-130x130q80.jpg`

### Brand Guidelines

#### Color Palette (CSS Variables in common.css)
```css
--color-secure-blue: #4B70F5;  /* Primary */
--color-deep-blue: #353777;    /* Secondary */
--color-orange: #FF7F3E;       /* Accent */
--color-white: #F9F9F9;        /* Background */
--color-off-white: #FFF7D8;    /* Alt Background */
```

#### Typography
- **Primary**: Poppins (Google Fonts)
- **Secondary**: Switzer (custom font file)
- **Monospace**: Source Code Pro
- **Display**: Inter

## Important Constraints

1. **NO E-COMMERCE**: This is a showcase site only - no cart, checkout, or payment functionality
2. **Static HTML only**: No server-side processing or APIs
3. **Bilingual content**: All user-facing content must support EN/FR
4. **Use absolute paths**: All resources should use `/css/`, `/js/`, `/images/`
5. **NO Webflow code**: All Webflow dependencies have been removed
6. **NO brand_style.css**: File has been removed, use common.css + page-specific CSS

## Common Development Tasks

### Adding a New Product
1. Create product data file: `/products/data/products/[product-id].json5`
   - Include bilingual content (EN/FR) for all fields
   - Use existing SVC138.json5 as template
2. Create bilingual product detail pages:
   - English: `/products/detail/[product-id].html` (copy from template.html)
   - French: `/fr/products/detail/[product-id].html` (copy from template-fr.html)
3. Add product images to `/images/` with naming pattern: `[product-id]-[suffix].[ext]`
   - Smart image system automatically finds matching files
   - Supports: jpg, jpeg, png, webp formats

### Creating New Pages
1. Copy structure from existing pages
2. Include `common.css` first, then page-specific CSS
3. Include `common.js` for navigation functionality
4. Use absolute paths for all resources
5. Create page-specific CSS file in `/css/` directory

### Updating Translations
1. Check `/fr/TRANSLATION-GLOSSARY.md` for existing translations
2. Update `products/data/products-master.json` for product content
3. Update `data/site-config.json` for site-wide text
4. Sync French pages with English structure

### CSS Development Rules
1. **USE** common.css for global components only
2. **CREATE** page-specific CSS files for unique styles
3. **NEVER** modify common.css for page-specific needs
4. **MAINTAIN** clear separation between global and page styles

### Testing Checklist
- [ ] Responsive at 1440px, 768px, 375px
- [ ] Logo switches on scroll (white → blue)
- [ ] Navigation transparency works
- [ ] Mobile menu functions
- [ ] Forms validate properly
- [ ] No console errors
- [ ] All links work

## File Structure
```
/
├── index.html                    # Homepage
├── about.html                    # About page
├── contact.html                  # Contact page
├── customer-care.html            # Customer support
├── products/
│   ├── all.html                  # Product catalog
│   ├── detail/
│   │   └── svc138.html          # Product detail template
│   └── data/
│       └── products-master.json  # Product database
├── fr/                           # French translations
│   ├── home.html
│   ├── about.html
│   ├── contact.html
│   ├── customer-care.html
│   └── products/
│       ├── all-fr.html
│       └── detail/
│           ├── template-fr.html         # French product template
│           └── svc138.html              # French SVC138 page
├── css/
│   ├── common.css               # Base styles
│   ├── index.css                # Homepage styles
│   ├── products.css             # Product catalog styles
│   ├── product-detail.css       # Product detail styles
│   ├── about.css                # About page styles
│   ├── contact.css              # Contact page styles
│   └── customer-care.css        # Customer care styles
├── js/
│   ├── common.js                # Global JavaScript
│   └── pages/
│       ├── products.js          # Product page logic
│       ├── contact.js           # Contact form logic
│       ├── about.js             # About page logic
│       └── product-detail.js    # Bilingual product detail with smart images
├── images/                       # All image assets
├── data/
│   ├── products.json            # Legacy product data
│   └── site-config.json         # Site configuration
└── DEBUG/
    └── DEBUG-LOG.md             # Problem tracking
```

## Performance Targets
- Page load: < 2 seconds
- First Contentful Paint: < 1.8s
- CSS total: < 100KB
- JavaScript total: < 50KB

## Recent Major Updates (2025-01-09)

### ✅ Bilingual Product Detail System
- **Complete bilingual architecture** for product detail pages
- **Smart image loading system** with automatic path detection
- **SEO optimization** with hreflang links and structured data
- **Dynamic content rendering** from JSON5 product data files

#### Key Features:
- **Auto image detection**: Supports multiple formats (jpg, png, webp) and naming patterns
- **Intelligent fallbacks**: Missing images automatically handled with alternatives
- **Bilingual routing**: EN/FR language switching with proper URL structure
- **Error resilience**: Graceful handling of missing images or data

#### File Structure Changes:
- Added `/i18n/site.en.json` and `/i18n/site.fr.json` for translations
- Created `/js/json5-parser.js` for product data loading
- Updated `/js/pages/product-detail.js` with bilingual support
- Bilingual templates: `template.html` (EN) and `template-fr.html` (FR)

## Current Technical Debt
- French pages (`/fr/*`) need architecture sync with English pages (except product details - ✅ completed)
- Legacy `data/products.json` should be fully migrated to individual JSON5 files
- Some product detail pages may need creation based on new template system

## Debug and Recovery
- Check `/DEBUG/DEBUG-LOG.md` for problem history and solutions
- Use `.claude/project_context.md` for detailed project state
- Backup naming: `backup_YYYYMMDD_HHMM_[description]`
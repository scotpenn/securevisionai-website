# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SecureVision AI is a static product showcase website for a security camera and power protection company. The site displays various security products including indoor/outdoor cameras, doorbells, baby monitors, sports cameras, and portable power systems. **This is a display-only site with NO e-commerce functionality** - products are showcased but not sold directly through the website.

## Development Commands

### Local Development
```bash
# Primary development server
npm run dev
# or
python -m http.server 8000

# Alternative servers
npx http-server

# Direct file access - open HTML files directly in browser
```

### Validation & Testing
```bash
# Validate internationalization setup
npm run validate-i18n

# Build products (JSON5 → JSON compilation)
npm run build:products

# Validate compiled product data
npm run validate:products

# Complete production check (build + validate)
npm run prod:check

# CSS linting (requires stylelint installation)
npm run lint

# Validate navigation configuration
node scripts/validate-navigation.js

# Run pre-commit checks manually
bash scripts/pre-commit-hook.sh
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
- `product-detail.js` - NEW: Loads compiled JSON product data with comprehensive error handling

**No jQuery dependency** - Pure vanilla JavaScript

### Product Data Architecture (NEW)
The site uses a **"B+C Hybrid" approach** for product data management:

**Development (Author Experience):**
- Write product data in JSON5 format (`products/data/products/*.json5`)
- Supports comments, trailing commas, and unquoted keys
- Validated against JSON Schema for consistency

**Production (Frontend Experience):**
- JSON5 files compiled to standard JSON during build (`products/data/compiled/*.json`)
- Frontend loads only standard JSON - zero parsing risk
- Automatic validation and error detection at build time

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

### Product Data Management (UPDATED)
**Source Files (Development):**
- **Individual product files**: `products/data/products/[product-id].json5` - Primary source files in JSON5 format
- **Schema validation**: `products/data/products.schema.json` - Comprehensive validation rules
- **Legacy product catalog**: `data/products.json` (being phased out)

**Compiled Files (Production):**
- **Compiled products**: `products/data/compiled/[product-id].json` - Standard JSON for frontend
- **Product index**: `products/data/compiled/index.json` - Auto-generated catalog for listings

**Configuration Files:**
- **Site configuration**: `data/site-config.json` - Navigation labels, feature lists, site descriptions in EN/FR
- **Navigation config**: `config/navigation.json` - Dynamic navigation structure with validation schema

**Build Scripts:**
- `scripts/build-products.js` - JSON5 → JSON compiler with validation
- `scripts/validate-products.js` - Product data integrity checker

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
7. **Dynamic navigation**: Use `config/navigation.json` with `data-menu` attributes, avoid hard-coded nav items
8. **Product data workflow**: Always run `npm run prod:check` before committing product changes
9. **Build-first approach**: Frontend only loads compiled JSON, never raw JSON5

## Common Development Tasks

### Adding a New Product (UPDATED WORKFLOW)
1. **Create product data file**: `/products/data/products/[product-id].json5`
   - Use JSON5 format with comments and trailing commas
   - Include bilingual content (EN/FR) for all required fields
   - Follow the schema defined in `products.schema.json`
   - Use existing `svc138.json5` as template

2. **Validate and build**:
   ```bash
   npm run prod:check  # This will validate schema and compile to JSON
   ```

3. **Create product detail pages**:
   - English: `/products/detail/[product-id].html` (copy from template.html)  
   - French: `/fr/products/detail/[product-id].html` (copy from template-fr.html)
   - Pages will automatically load compiled JSON data

4. **Add product images**: `/images/` with naming pattern: `[product-id]-[suffix].[ext]`
   - Update image paths in the JSON5 file
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
- [ ] Run `npm run validate-i18n` - passes without errors
- [ ] Run `npm run prod:check` - products build and validate successfully
- [ ] Run `node scripts/validate-navigation.js` - passes validation
- [ ] Run `npm run lint` - no CSS errors
- [ ] Pre-commit hook passes: `bash scripts/pre-commit-hook.sh`

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
│   │   ├── template.html         # Product detail template (EN)
│   │   └── svc138.html           # SVC138 product page
│   └── data/
│       ├── products.schema.json  # Product data validation schema
│       ├── products/             # Source JSON5 files
│       │   ├── svc138.json5      # Product source data
│       │   └── *.json5           # Other product files
│       └── compiled/             # Generated JSON files (git ignored)
│           ├── svc138.json       # Compiled product data
│           └── index.json        # Product catalog index
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
├── config/
│   └── navigation.json          # Dynamic navigation configuration
├── data/
│   ├── products.json            # Legacy product data
│   └── site-config.json         # Site configuration
├── i18n/
│   ├── site.en.json            # English translations
│   └── site.fr.json            # French translations
├── scripts/
│   ├── build-products.js       # JSON5 → JSON product compiler
│   ├── validate-products.js    # Product data validation
│   ├── validate-i18n.js        # I18n validation script
│   ├── validate-navigation.js  # Navigation validation script
│   └── pre-commit-hook.sh      # Pre-commit validation
└── DEBUG/
    └── DEBUG-LOG.md             # Problem tracking
```

## Performance Targets
- Page load: < 2 seconds
- First Contentful Paint: < 1.8s
- CSS total: < 100KB
- JavaScript total: < 50KB

## Recent Major Updates (2025-09-03)

### ✅ Complete Product System Implementation (2025-09-03)
- **Product Portfolio Expansion**: 12 products across 6 categories now active
- **Hardcoded Page Generation**: 24 static pages (12 products × 2 languages) successfully generated
- **Build System Completion**: JSON5→JSON compilation with Schema validation fully operational
- **New Product Integration**: SVC263 (Baby/Pet), SVC285 (Outdoor), SVC842 (Sports), SVT100 (Power)
- **Category Distribution**: All 6 product categories properly populated
- **Navigation Optimization**: Removed redundant "All Products" menu option
- **Data Quality**: Schema validation ensures consistent product data structure

### ✅ Bilingual Product Detail System (2025-01-09)
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

## Validation Architecture

### Automated Validation Scripts
The project includes comprehensive validation to ensure quality and consistency:

1. **I18n Validation** (`scripts/validate-i18n.js`)
   - Checks translation completeness across EN/FR
   - Validates hreflang links and SEO structure
   - Scans HTML files for missing `data-i18n` attributes
   - Reports translation gaps and inconsistencies

2. **Navigation Validation** (`scripts/validate-navigation.js`)
   - Validates `config/navigation.json` structure and schema
   - Checks language consistency across navigation items
   - Ensures all HTML files use dynamic navigation with `data-menu` attributes
   - Prevents hard-coded navigation items

3. **Pre-commit Hook** (`scripts/pre-commit-hook.sh`)
   - Runs navigation and CSS validation automatically
   - Checks for common mistakes and file naming conventions
   - Ensures `common.js` is included in all main HTML files
   - Validates JSON syntax in configuration files

### Quality Gates
Before any commit, these validations must pass:
- Navigation configuration is valid JSON with proper structure
- No hard-coded navigation items in HTML files (use `data-menu` attributes)
- All main pages include `common.js` reference
- CSS follows the modular architecture (common.css + page-specific CSS)
- No relative paths in navigation links (use absolute paths with `/`)

## Current Technical Debt & Next Phase Tasks

### ✅ Completed (2025-09-03)
- ✅ All 12 product detail pages created with hardcoded generation system
- ✅ New products (svc842, svc263, svc285, svt100) successfully integrated
- ✅ JSON5→JSON build system fully operational with Schema validation

### 🚧 Priority Tasks (Next Session)

#### French Page System Issues
- **French page generation problems**: Current French product pages not displaying correctly
- **Template system**: template-fr.html needs functionality parity with English version
- **Content validation**: Verify bilingual content completeness and accuracy

#### Homepage Category Images
- **Category image updates**: Import 6 professional product series images
  - Indoor Security Cameras series image
  - Baby/Pet Monitors series image  
  - Outdoor Security Cameras series image
  - Doorbell Cameras series image
  - Sports Cameras series image
  - Secure Power Systems series image
- **Image specifications**: Establish consistent category image standards (size/format/naming)
- **Homepage integration**: Update homepage product category cards with new images

#### FAQ System Implementation
- **Data structure**: Create JSON-based FAQ database for questions and answers
- **Bilingual content**: Implement English/French FAQ content management
- **Customer Service integration**: Add JavaScript-driven FAQ display to customer-care.html
- **Search functionality**: Implement FAQ search and categorization features

### Legacy Items
- French pages (`/fr/*`) need architecture sync with English pages (ongoing)
- Legacy `data/products.json` migration to individual JSON5 files (low priority)

## Technical Specifications for Next Phase

### French Page System Debugging
**Current Issue**: French product pages generated by `scripts/generate-product-pages.js` are displaying incorrectly
- French pages are much smaller in size (10KB vs 29KB for English)
- Template rendering appears to be incomplete or failing
- Need to investigate template-fr.html functionality and data binding

**Investigation Areas**:
1. Check template-fr.html structure and placeholder system
2. Verify French translations are properly loaded during generation
3. Compare generated French HTML with English counterparts
4. Test French language detection and content switching

### Homepage Category Image System
**Requirements**:
- **Image Format**: WebP preferred, PNG/JPG fallback
- **Dimensions**: 400x300px (4:3 aspect ratio)
- **Naming Convention**: `category-[name]-hero.webp`
- **Quality**: High-quality product photography showcasing category

**Target Categories**:
```
indoor -> category-indoor-hero.webp
baby-pet-monitor -> category-baby-pet-hero.webp  
outdoor -> category-outdoor-hero.webp
doorbell -> category-doorbell-hero.webp
sports -> category-sports-hero.webp
secure-power -> category-power-hero.webp
```

### FAQ System Architecture
**Data Structure** (`data/faq.json`):
```json
{
  "categories": {
    "general": {
      "name": {"en": "General Questions", "fr": "Questions Générales"},
      "order": 1
    },
    "products": {
      "name": {"en": "Product Information", "fr": "Informations Produit"}, 
      "order": 2
    }
  },
  "faqs": [
    {
      "id": "faq001",
      "category": "general",
      "question": {
        "en": "What is your warranty policy?",
        "fr": "Quelle est votre politique de garantie?"
      },
      "answer": {
        "en": "We offer a comprehensive 2-year warranty...",
        "fr": "Nous offrons une garantie complète de 2 ans..."
      },
      "keywords": ["warranty", "garantie", "repair", "replacement"],
      "featured": true
    }
  ]
}
```

**Integration Points**:
- `customer-care.html`: Add FAQ section with search and filtering
- `js/pages/customer-care.js`: New file for FAQ functionality
- CSS updates in `css/customer-care.css` for FAQ styling

## Debug and Recovery
- Check `/DEBUG/DEBUG-LOG.md` for problem history and solutions
- Use `.claude/project_context.md` for detailed project state
- Backup naming: `backup_YYYYMMDD_HHMM_[description]`
- Run `npm run validate-i18n` to diagnose translation issues
- Use validation scripts to identify structural problems before they impact production
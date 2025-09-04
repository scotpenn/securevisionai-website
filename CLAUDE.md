# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SecureVision AI is a static product showcase website for a security camera and power protection company. The site displays various security products including indoor/outdoor cameras, doorbells, baby monitors, sports cameras, and portable power systems. **This is a display-only site with NO e-commerce functionality** - products are showcased but not sold directly through the website.

## Development Commands

### Local Development
```bash
# Start development server
npm run dev
# or
python -m http.server 8000
```

### Build & Validation
```bash
# Complete production build (compile products + generate pages)
npm run build:all

# Build product data only (JSON5 → JSON compilation)
npm run build:products

# Generate static HTML product pages (24 pages: 12 products × 2 languages)
npm run generate:pages

# Validate all systems before commit
bash scripts/pre-commit-hook.sh
```

### Validation Commands
```bash
# Check product data integrity
npm run validate:products

# Validate i18n translations
npm run validate-i18n  

# Check navigation configuration
node scripts/validate-navigation.js

# Lint CSS files
npm run lint
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
2. **Vercel Serverless Functions**: Contact form uses `/api/contact.js` for email processing via Resend API
3. **Bilingual content**: All user-facing content must support EN/FR
4. **Use absolute paths**: All resources should use `/css/`, `/js/`, `/images/`
5. **NO Webflow code**: All Webflow dependencies have been removed
6. **NO brand_style.css**: File has been removed, use common.css + page-specific CSS
7. **Dynamic navigation**: Use `config/navigation.json` with `data-menu` attributes, avoid hard-coded nav items
8. **Product data workflow**: Always run `npm run prod:check` before committing product changes
9. **Build-first approach**: Frontend only loads compiled JSON, never raw JSON5

## Common Development Tasks

### Adding a New Product
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
4. Use absolute paths for all resources (`/css/`, `/js/`, `/images/`)
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
- [ ] Run `bash scripts/pre-commit-hook.sh` - all validation passes

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
├── api/
│   └── contact.js               # Vercel serverless function for Resend email
├── css/
│   ├── common.css               # Base styles
│   ├── index.css                # Homepage styles
│   ├── products.css             # Product catalog styles
│   ├── product-detail.css       # Product detail styles
│   ├── about.css                # About page styles
│   ├── contact.css              # Contact page + contact cards styles
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

## Recent Major Updates

### ✅ Resend API Integration & Contact Enhancement (2025-09-04)
- **Production Email Service**: Integrated Resend API for professional email handling
- **Enhanced Security**: Honeypot anti-bot protection and HTML escaping
- **Contact Card System**: Modern card-based layout for contact information
- **Bilingual Form Handling**: Complete EN/FR error messages and validation

#### Key Features:
- **Vercel API Functions**: `/api/contact.js` with proper error handling and rate limiting
- **Security Measures**: Honeypot fields, input sanitization, environment variable protection
- **Responsive Cards**: Equal-width contact cards with hover effects and professional styling
- **Real Email Delivery**: Production-ready email service replacing form simulation

#### Technical Implementation:
- **API Endpoint**: Serverless function with Resend SDK integration
- **CSS Grid System**: Responsive contact cards that adapt from 2-column to single-column
- **Form Enhancement**: Real-time validation and professional success/error messaging
- **Environment Security**: API keys properly configured in `.env.local`

### ✅ Product System Complete (2025-09-03)
- **12 Products × 2 Languages**: 24 static HTML pages generated
- **Build Pipeline**: JSON5 development → JSON compilation → HTML generation
- **6 Product Categories**: Indoor, Baby/Pet, Outdoor, Doorbell, Sports, Power
- **Schema Validation**: Enforced data consistency at build time

### ✅ Bilingual Architecture (2025-01-09)
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

## Current Tasks & Technical Debt

### 🚧 Next Priority Tasks

1. **Homepage Category Images** - Add 6 professional series images
   - Format: 400x300px WebP/PNG
   - Naming: `category-[name]-hero.webp`
   - Categories: Indoor, Baby/Pet, Outdoor, Doorbell, Sports, Power

2. **FAQ System** - Implement customer service FAQ
   - JSON-based FAQ database
   - Bilingual support (EN/FR)  
   - Dynamic loading in customer-care.html

3. **Performance Optimization** - Optimize loading and images
   - WebP conversion for all product images
   - Lazy loading implementation
   - CSS/JS minification for production


## Debug and Recovery
- Check `DEBUG-LOG.md` for problem history and solutions
- Use `.claude/project_context.md` for detailed project state
- Run validation scripts to identify issues before commit
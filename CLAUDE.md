# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SecureVision AI is a static showcase website for security cameras and portable power products. **This is a display-only website with no e-commerce functionality** - products are shown for demonstration purposes and are not sold directly through the website.

## Development Commands

### Local Development
```bash
npm run dev              # Start development server (Python http.server on port 8000)
python -m http.server 8000  # Alternative method
```

### Production Build
```bash
npm run build            # Full build: compile products + generate pages + copy static files
npm run build:products   # Compile JSON5 → JSON only
npm run generate:pages   # Generate static HTML product detail pages (20 pages: 10 products × 2 languages)
```

### Validation & Quality Checks
```bash
npm run validate:products     # Validate product data against JSON Schema
npm run validate-i18n         # Check i18n translations for missing keys
npm run validate-navigation   # Verify navigation config structure
npm run lint                  # Run stylelint on CSS files
npm run prod:check            # Pre-deployment validation (build + validate)
bash scripts/pre-commit-hook.sh  # Run all validation checks
```

### Deployment
```bash
./scripts/deploy-check.sh  # Pre-deployment verification
vercel --prod              # Deploy to Vercel (requires RESEND_API_KEY env var)
```

## Architecture Overview

### Product Data System (JSON5 → JSON Build Pipeline)

**Development (Author Experience):**
- Product data authored in JSON5 format (`products/data/products/*.json5`)
- Supports comments, trailing commas, unquoted keys for better DX
- Validated against JSON Schema (`products/data/products.schema.json`)

**Production (Frontend Experience):**
- JSON5 files compiled to standard JSON during build (`products/data/compiled/*.json`)
- Frontend loads only standard JSON - zero parsing risk
- Product detail pages are pre-generated static HTML (not dynamic)

**Key Point:** Product detail pages (`products/detail/*.html`) are generated via `npm run generate:pages` and contain hardcoded product data. They do NOT use client-side JavaScript to load JSON dynamically.

### Bilingual Architecture

- **English (Primary):** Root directory (`/index.html`, `/about.html`, etc.)
- **French:** `/fr/` directory with mirrored structure
- **Translation System:** `i18n/site.en.json` and `i18n/site.fr.json` (114+ translation keys)
- **Dynamic Navigation:** Uses `config/navigation.json` with `data-menu` attributes

### CSS System (Modular Architecture)

**common.css** - Global foundation layer
- CSS variables and design tokens
- Navigation, footer, hero sections
- Logo toggle system
- Universal components and utilities

**Page-Specific CSS Files:**
- `css/index.css` - Homepage
- `css/products.css` - Product catalog page
- `css/product-detail.css` - Product detail pages
- `css/about.css` - About page
- `css/contact.css` - Contact form
- `css/customer-care.css` - Customer service page

**CSS Development Rules:**
1. Use `common.css` ONLY for global components
2. Create page-specific CSS files for unique styles
3. NEVER modify `common.css` for page-specific needs
4. Maintain clear separation between global and page styles

### JavaScript Architecture

**common.js** - Global functionality
- Navigation state management and logo toggle
- Scroll-based header transparency
- Mobile menu toggle
- Loading animations

**Page-Specific JS** (in `js/pages/`)
- `products.js` - Product filtering and grid management
- `customer-care.js` - FAQ system

**Important Notes:**
- `contact.html` uses inline JavaScript for form submission (calls `/api/contact`)
- `about.html` uses only `common.js` - no page-specific script needed
- Product detail pages use inline JavaScript for tab switching and gallery interactions
- **No jQuery dependency** - Pure vanilla JavaScript throughout

### Contact Form & Email System

- **Vercel Serverless Function:** `/api/contact.js` handles form submissions
- **Resend API Integration:** Professional email delivery service
- **Security:** Honeypot anti-bot protection, input sanitization, rate limiting (5 requests per 15 minutes per IP)
- **Environment Variable Required:** `RESEND_API_KEY` (production deployment)

### GitHub-Based Download System

Product documentation is hosted in a separate GitHub repository:

**Repository:** `https://github.com/scotpenn/securevision-downloads`

**URL Pattern:**
```
https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products/[PRODUCT-ID]/[FILENAME]
```

**File Types:** brochure, manual, spec, quickstart
**Naming Convention:** `[product-id]-[type]-[language].pdf`

## Key Constraints & Guidelines

1. **No E-commerce:** Pure showcase website - no shopping cart, checkout, or payment functionality
2. **Absolute Paths Only:** All resource and navigation links must use absolute paths (`/css/`, `/js/`, `/images/`)
3. **Bilingual Content:** All user-facing content must support EN/FR
4. **Dynamic Navigation:** Use `config/navigation.json` with `data-menu` attributes - avoid hardcoding nav items
5. **Build-First Approach:** Frontend loads compiled JSON only, never raw JSON5
6. **Schema Validation:** All product data must pass JSON Schema validation before build
7. **Static Product Pages:** Product detail pages are pre-generated HTML, not client-side dynamic

## Development Workflows

### Adding a New Product

1. **Create product data file:** `products/data/products/[product-id].json5`
   - Use JSON5 format (comments, trailing commas allowed)
   - Include bilingual content (EN/FR) for all required fields
   - Follow schema in `products/data/products.schema.json`
   - Use existing `svc138.json5` as template

2. **Validate and compile:**
   ```bash
   npm run prod:check  # Validates schema and compiles to JSON
   ```

3. **Generate product detail pages:**
   ```bash
   npm run generate:pages  # Creates EN/FR HTML pages automatically
   ```

4. **Add product images:** Place in `/images/` directory
   - Naming pattern: `[product-id]-[suffix].[ext]`
   - Update image paths in JSON5 file
   - Supported formats: jpg, jpeg, png, webp

5. **Add product documentation:** Upload PDFs to downloads repository
   - Repository: `https://github.com/scotpenn/securevision-downloads`
   - Naming: `[product-id]-[type]-[language].pdf`

### Creating a New Page

1. Copy structure from existing page
2. Include `common.css` first, then page-specific CSS
3. Include `common.js` for navigation functionality
4. Use absolute paths for all resources (`/css/`, `/js/`, `/images/`)
5. Create page-specific CSS file in `/css/` directory
6. Add bilingual support with `data-i18n` attributes

### Testing Checklist

- [ ] Responsive design: 1440px, 768px, 375px viewports
- [ ] Logo toggle on scroll (white → blue)
- [ ] Navigation transparency works correctly
- [ ] Mobile menu functions properly
- [ ] Form validation and submission successful
- [ ] All images load correctly with fallbacks
- [ ] No console errors
- [ ] All validation scripts pass: `bash scripts/pre-commit-hook.sh`
- [ ] Bilingual content displays correctly
- [ ] Product pages load compiled JSON without errors

## File Structure

```
/
├── index.html                    # Homepage
├── about.html                    # About page
├── contact.html                  # Contact page with inline form handler
├── customer-care.html            # Customer support & FAQ
├── products/
│   ├── all.html                  # Product catalog
│   ├── detail/                   # Generated product detail pages (static HTML)
│   └── data/
│       ├── products.schema.json  # JSON Schema for validation
│       ├── products/             # Source JSON5 files
│       └── compiled/             # Generated JSON (git-ignored)
├── fr/                           # French translations (mirrored structure)
├── api/
│   └── contact.js               # Vercel serverless function for email
├── css/
│   ├── common.css               # Global styles & CSS variables
│   └── [page].css               # Page-specific styles
├── js/
│   ├── common.js                # Global JavaScript
│   └── pages/                   # Page-specific JavaScript
├── images/                       # All image assets
├── config/
│   └── navigation.json          # Dynamic navigation configuration
├── data/
│   ├── site-config.json         # Site configuration
│   └── faq.json                 # FAQ database
├── i18n/
│   ├── site.en.json            # English translations
│   └── site.fr.json            # French translations
├── scripts/                      # Build and validation scripts
├── vercel.json                  # Vercel deployment config
└── public/                       # Build output directory (git-ignored)
```

## Brand Guidelines

### Color Palette (CSS Variables in common.css)

```css
--color-secure-blue: #4B70F5;  /* Primary */
--color-deep-blue: #353777;    /* Secondary */
--color-orange: #FF7F3E;       /* Accent */
--color-white: #F9F9F9;        /* Background */
--color-off-white: #FFF7D8;    /* Alt background */
```

### Typography

- **Primary:** Poppins (Google Fonts)
- **Secondary:** Switzer (Custom font files)
- **Monospace:** Source Code Pro
- **Display:** Inter

## Performance Targets

- Page Load: < 2 seconds
- First Contentful Paint: < 1.8 seconds
- Total CSS: < 100KB
- Total JavaScript: < 50KB
- All images optimized with WebP support

## Environment Variables

Required for production deployment:
- `RESEND_API_KEY` - For contact form email delivery via Resend API

## Validation Architecture

### Quality Gates

Before committing, these validations must pass:
- Navigation config is valid JSON with correct structure
- No hardcoded navigation items in HTML (must use `data-menu` attributes)
- All main pages include `common.js` reference
- CSS follows modular architecture (common.css + page-specific)
- No relative paths in navigation links (must use absolute paths with `/`)
- All product data passes JSON Schema validation
- Bilingual content is complete and consistent

### Debug Commands

```bash
npm run validate-i18n              # Check for missing translations
node scripts/validate-navigation.js # Verify navigation structure
npm run validate:products          # Validate product data integrity
bash scripts/pre-commit-hook.sh    # Full pre-commit validation
```

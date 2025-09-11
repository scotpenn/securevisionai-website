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

### Production Build & Deployment
```bash
# Complete production build (compile products + generate pages + copy static files)
npm run build

# Build product data only (JSON5 → JSON compilation)
npm run build:products

# Generate static HTML product pages (24 pages: 12 products × 2 languages)
npm run generate:pages

# Pre-deployment validation
./scripts/deploy-check.sh

# Deploy to Vercel (requires RESEND_API_KEY env var)
vercel --prod
```

### Validation & Quality Assurance
```bash
# Check product data integrity and validate against schema
npm run validate:products

# Validate i18n translations and missing keys
npm run validate-i18n

# Check navigation configuration and dynamic menu usage
node scripts/validate-navigation.js

# Lint CSS files with stylelint
npm run lint

# Run all pre-commit validations
bash scripts/pre-commit-hook.sh

# Production readiness check
npm run prod:check
```

## Architecture Overview

### CSS System (Modular Architecture)
The site uses a layered, modular CSS architecture:

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
- `contact.js` - Form validation and submission with Resend API
- `about.js` - About page interactions
- `product-detail.js` - Loads compiled JSON product data with comprehensive error handling

**No jQuery dependency** - Pure vanilla JavaScript

### Product Data System (B+C Hybrid Approach)
**Development (Author Experience):**
- Write product data in JSON5 format (`products/data/products/*.json5`)
- Supports comments, trailing commas, and unquoted keys
- Validated against JSON Schema for consistency

**Production (Frontend Experience):**
- JSON5 files compiled to standard JSON during build (`products/data/compiled/*.json`)
- Frontend loads only standard JSON - zero parsing risk
- Automatic validation and error detection at build time

### Bilingual Architecture
- **English (Primary)**: Root directory (`/index.html`, `/about.html`, etc.)
- **French**: `/fr/` directory with mirrored structure
- **Translation System**: 114 translation keys in `/i18n/site.en.json` and `/i18n/site.fr.json`
- **Dynamic Navigation**: Uses `config/navigation.json` with `data-menu` attributes

### Contact Form & Email System
- **Vercel Serverless Function**: `/api/contact.js` handles form submissions
- **Resend API Integration**: Professional email delivery service
- **Security Features**: Honeypot anti-bot protection, input sanitization
- **Environment Variables**: Requires `RESEND_API_KEY` for production

### GitHub-Based Download System
The site uses a separate GitHub repository for managing product documentation:

**Repository**: `https://github.com/scotpenn/securevision-downloads`
**URL Pattern**:
```
https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products/[PRODUCT-ID]/[FILENAME]
```

**File Types**: brochure, manual, spec, quickstart
**Naming Convention**: `[product-id]-[type]-[language].pdf`

## Important Constraints

1. **NO E-COMMERCE**: This is a showcase site only - no cart, checkout, or payment functionality
2. **Vercel Serverless Functions**: Contact form uses `/api/contact.js` for email processing via Resend API
3. **Bilingual content**: All user-facing content must support EN/FR
4. **Use absolute paths**: All resources should use `/css/`, `/js/`, `/images/`
5. **NO Webflow dependencies**: All Webflow code has been removed
6. **Dynamic navigation**: Use `config/navigation.json` with `data-menu` attributes, avoid hard-coded nav items
7. **Build-first approach**: Frontend only loads compiled JSON, never raw JSON5
8. **Schema validation**: All product data must pass JSON Schema validation before build

## Development Workflows

### Adding a New Product
1. **Create product data file**: `/products/data/products/[product-id].json5`
   - Use JSON5 format with comments and trailing commas
   - Include bilingual content (EN/FR) for all required fields
   - Follow the schema defined in `products.schema.json`
   - Use existing `svc138.json5` as template

2. **Validate and build**:
   ```bash
   npm run prod:check  # Validates schema and compiles to JSON
   ```

3. **Generate product detail pages**:
   ```bash
   npm run generate:pages  # Creates EN/FR HTML pages automatically
   ```

4. **Add product images**: `/images/` with naming pattern: `[product-id]-[suffix].[ext]`
   - Update image paths in the JSON5 file
   - Supports: jpg, jpeg, png, webp formats

5. **Add product documentation**: Upload PDFs to downloads repository
   - Repository: `https://github.com/scotpenn/securevision-downloads`
   - Naming: `[product-id]-[type]-[language].pdf`

### Creating New Pages
1. Copy structure from existing pages
2. Include `common.css` first, then page-specific CSS
3. Include `common.js` for navigation functionality
4. Use absolute paths for all resources (`/css/`, `/js/`, `/images/`)
5. Create page-specific CSS file in `/css/` directory
6. Add bilingual support and `data-i18n` attributes

### CSS Development Rules
1. **USE** common.css for global components only
2. **CREATE** page-specific CSS files for unique styles
3. **NEVER** modify common.css for page-specific needs
4. **MAINTAIN** clear separation between global and page styles
5. **FOLLOW** CSS naming conventions and BEM methodology

### Testing Checklist
- [ ] Responsive at 1440px, 768px, 375px
- [ ] Logo switches on scroll (white → blue)
- [ ] Navigation transparency works
- [ ] Mobile menu functions
- [ ] Forms validate properly and submit successfully
- [ ] All images load correctly with fallbacks
- [ ] No console errors
- [ ] All validation scripts pass: `bash scripts/pre-commit-hook.sh`
- [ ] Bilingual content displays correctly
- [ ] Product pages load compiled JSON data without errors

## File Structure
```
/
├── index.html                    # Homepage
├── about.html                    # About page
├── contact.html                  # Contact page
├── customer-care.html            # Customer support
├── products/
│   ├── all.html                  # Product catalog
│   ├── detail/                   # Generated product detail pages
│   └── data/
│       ├── products.schema.json  # Product data validation schema
│       ├── products/             # Source JSON5 files
│       └── compiled/             # Generated JSON files (git ignored)
├── fr/                           # French translations (mirrored structure)
├── api/
│   └── contact.js               # Vercel serverless function for email
├── css/
│   ├── common.css               # Base styles and CSS variables
│   └── [page].css               # Page-specific styles
├── js/
│   ├── common.js                # Global JavaScript
│   └── pages/                   # Page-specific JavaScript
├── images/                       # All image assets
├── config/
│   └── navigation.json          # Dynamic navigation configuration
├── data/
│   ├── products.json            # Legacy product data (being phased out)
│   ├── site-config.json         # Site configuration
│   └── faq.json                 # FAQ database
├── i18n/
│   ├── site.en.json            # English translations
│   └── site.fr.json            # French translations
├── scripts/                      # Build and validation scripts
├── development-docs/             # All development documentation
├── vercel.json                  # Vercel deployment configuration
└── next.config.js               # Next.js configuration for security headers
```

## Performance Targets
- Page load: < 2 seconds
- First Contentful Paint: < 1.8s
- CSS total: < 100KB
- JavaScript total: < 50KB
- All images optimized with WebP support

## Brand Guidelines

### Color Palette (CSS Variables in common.css)
```css
--color-secure-blue: #4B70F5;  /* Primary */
--color-deep-blue: #353777;    /* Secondary */
--color-orange: #FF7F3E;       /* Accent */
--color-white: #F9F9F9;        /* Background */
--color-off-white: #FFF7D8;    /* Alt Background */
```

### Typography
- **Primary**: Poppins (Google Fonts)
- **Secondary**: Switzer (custom font file)
- **Monospace**: Source Code Pro
- **Display**: Inter

## Validation Architecture

### Quality Gates
Before any commit, these validations must pass:
- Navigation configuration is valid JSON with proper structure
- No hard-coded navigation items in HTML files (use `data-menu` attributes)
- All main pages include `common.js` reference
- CSS follows the modular architecture (common.css + page-specific CSS)
- No relative paths in navigation links (use absolute paths with `/`)
- All product data passes JSON Schema validation
- Bilingual content is complete and consistent

### Debug Commands
```bash
# Check for missing translations
npm run validate-i18n

# Verify navigation structure
node scripts/validate-navigation.js

# Validate product data integrity
npm run validate:products

# Full pre-commit validation
bash scripts/pre-commit-hook.sh
```

## Environment Variables
Required for production deployment:
- `RESEND_API_KEY` - For contact form email service via Resend API

## Recent Major Updates

### Contact Form Enhancement (2025-09-04)
- Integrated Resend API for professional email handling
- Added honeypot anti-bot protection and input sanitization
- Implemented modern card-based layout for contact information
- Added bilingual form handling with proper error messages

### Product System Complete (2025-09-03)
- 12 products × 2 languages = 24 static HTML pages generated
- JSON5 development → JSON compilation → HTML generation pipeline
- Schema validation enforced at build time
- GitHub-based download system implemented

### Complete Bilingual Architecture (2025-09-04)
- All French pages use unified CSS system (common.css + page-specific)
- Dynamic navigation with language switching
- 114 translation keys in bilingual i18n system
- Static HTML generation for optimal performance
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SecureVision AI is a static product showcase website for a security camera and power protection company. The site displays various security products including indoor/outdoor cameras, doorbells, baby monitors, sports cameras, and portable power systems. **This is a display-only site with NO e-commerce functionality** - products are showcased but not sold directly through the website.

## Recent Major Update (2025-08-28)

### Modular CSS/JS Architecture Implementation
The website has undergone a complete architectural overhaul:
- **IMPLEMENTED**: Modular CSS system (common.css + page-specific CSS)
- **REFACTORED**: JavaScript to common.js + page-specific modules
- **OPTIMIZED**: Dynamic logo switching system (transparent/scrolled states)
- **STANDARDIZED**: All resource paths to absolute URLs (/images/, /css/, /js/)
- **DOCUMENTED**: Changes recorded in `DEBUG-LOG.md` and `.claude/project_context.md`

## Development Commands

### Local Development
Since this is a static HTML site, there's no build process:
- **Run locally with Python**: `python -m http.server 8000`
- **Run locally with Node**: `npx http-server`
- **Direct file access**: Open HTML files directly in browser

### Version Control
- **Check status**: `git status`
- **Stage changes**: `git add .`
- **Commit**: `git commit -m "message"`

## Current Architecture

### CSS System (Modular Architecture)
The site uses a layered, modular CSS architecture:

**common.css** - Base layer (weight: 10)
- Located at `css/common.css`
- Defines all CSS variables and design tokens
- Global styles for navigation, footer, hero sections
- Common components and utility classes
- Logo switching system styles

**Page-specific CSS** - Feature layer (weight: 20)
- `css/products.css` - Product catalog page styles
- `css/product-detail.css` - Product detail page styles
- `css/about.css` - About page specific styles
- `css/contact.css` - Contact form and page styles
- `css/custumer-care.css` - Customer service page styles

### Page Structure & Status

#### Fully Refactored Pages (New Architecture)
1. **products/all.html** - Product Catalog ✅
   - Complete modular architecture implementation
   - Dynamic category filtering
   - Responsive product grid
   - Uses common.css + products.css

2. **products/detail/svc138.html** - Product Detail Template ✅
   - Modern product detail layout
   - Image gallery with thumbnails
   - Tab-based information sections
   - Uses common.css + product-detail.css

#### Pages Awaiting Migration
- **index.html** - Homepage (uses old brand_style.css)
- **about.html** - About page (uses old brand_style.css)
- **contact.html** - Contact page (uses old brand_style.css)
- **custumer-care.html** - Customer support (note filename typo)
- **fr/** directory - French translations (needs sync with new architecture)

### Bilingual Architecture
The site supports English and French with this structure:
- **English (Primary)**: Root directory (`/index.html`, `/about.html`, etc.)
- **French**: `/fr/` directory with mirrored structure
- **Translation data**: 
  - `/data/products.json` - Product catalog with EN/FR content
  - `/data/site-config.json` - Site-wide translations
  - `/fr/TRANSLATION-GLOSSARY.md` - Translation reference
  - `/fr/glossary_2.md` - Additional translations

### Product Data Management
Products are centrally managed through JSON:
- **Primary product database**: `products/data/products-master.json`
  - Categories: `indoor`, `baby-pet-monitor`, `outdoor`, `doorbell`, `sports`, `secure-power`
  - Product structure includes: id, name, name_cn, price, images, features, specifications
  - Each category contains product IDs that reference detailed product entries
- **Legacy product catalog**: `data/products.json` (being phased out)
- **Site configuration**: `data/site-config.json`
  - Navigation labels, feature lists, site descriptions in EN/FR

### Component Structure
- **Reusable components**: Standardized across all pages
  - Navigation bar (Mantine-style with transparency effects)
  - Footer (multi-column with product links)
  - Hero sections (with background images)
  - Form components (modern validation)
- **Product templates**: `/product-pages/` directory
- **Contact variations**: `/contact-pages/` directory

## Key Technical Stack

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

**No jQuery dependency** - Pure vanilla JavaScript

### Image Optimization
Images follow responsive naming convention:
- Base: `image.jpg`
- Responsive: `image-p-500.jpg`, `image-p-800.jpg`, `image-p-1080.jpg`
- Thumbnails: `image-p-130x130q80.jpg`

### Font Stack
- **Primary**: Poppins (Google Fonts)
- **Secondary**: Switzer (custom font file)
- **Monospace**: Source Code Pro (Google Fonts)
- **Display**: Inter (Google Fonts)

## Brand Guidelines

### Color Palette (from brand_style.css)
```css
--color-secure-blue: #4B70F5;  /* Pantone 300 - Primary */
--color-deep-blue: #353777;    /* Pantone 281 - Secondary */
--color-orange: #FF7F3E;       /* Pantone 432 - Accent */
--color-white: #F9F9F9;        /* Background */
--color-off-white: #FFF7D8;    /* Alt Background */
```

### Typography Classes
Use utility classes from brand_style.css:
- Text sizes: `.text-xs`, `.text-sm`, `.text-base`, `.text-lg`, `.text-xl`, `.text-2xl`, `.text-3xl`
- Headings: `.h1-brand`, `.h2-brand`, etc.
- Buttons: `.btn-primary`, `.btn-secondary`
- Alignment: `.text-center`, `.text-left`, `.text-right`

## File Structure

```
/
├── index.html                    # Homepage (awaiting migration)
├── about.html                    # About page (awaiting migration)
├── contact.html                  # Contact page (awaiting migration)
├── custumer-care.html           # Customer care (awaiting migration)
├── products/
│   ├── all.html                 # Product catalog (✅ refactored)
│   ├── detail/
│   │   ├── template.html        # Product detail template
│   │   └── svc138.html         # Sample product page (✅ refactored)
│   └── data/
│       └── products-master.json # Primary product database
├── fr/                          # French translations (needs sync)
│   ├── home.html
│   ├── about.html
│   ├── contact.html
│   ├── custumer-care.html
│   ├── products/all-fr.html
│   └── TRANSLATION-GLOSSARY.md  # Translation reference (173 lines)
├── data/
│   ├── products.json            # Legacy product database
│   └── site-config.json         # Site configuration
├── css/
│   ├── common.css              # Base styles (all pages)
│   ├── products.css            # Product catalog styles
│   ├── product-detail.css      # Product detail styles
│   ├── about.css               # About page styles
│   ├── contact.css             # Contact page styles
│   ├── custumer-care.css       # Customer care styles
│   └── brand_style.css         # Legacy styles (being phased out)
├── js/
│   ├── common.js               # Global JavaScript
│   └── pages/
│       ├── products.js         # Product page logic
│       ├── contact.js          # Contact form logic
│       └── about.js            # About page logic
├── images/                      # All image assets
├── DEBUG/                       # Backup and debug logs
│   └── DEBUG-LOG.md            # Problem tracking and solutions
└── .claude/                     # Project management
    └── project_context.md       # Detailed project state
```

## Important Constraints

1. **NO E-COMMERCE**: This is a showcase site only - no cart, checkout, or payment functionality
2. **Static HTML only**: No server-side processing or APIs
3. **Bilingual content**: All user-facing content must support EN/FR
4. **Brand consistency**: Always use brand_style.css variables and classes
5. **NO Webflow code**: All Webflow dependencies have been removed

## Common Tasks

### Adding a New Product
1. Add product data to `products/data/products-master.json`
   - Include: id, name, name_cn, price, images array, features, specifications
   - Add product ID to appropriate category's products array
2. Create product detail page in `/products/detail/[product-id].html`
   - Copy from `template.html` or `svc138.html`
   - Update product data and images
3. Add product images to `/images/` with responsive variants
   - Main image: `[product-id]-main.jpg` (800x800px)
   - Thumbnails: `[product-id]-thumb-[1-4].jpg` (100x100px)
   - Gallery images: `[product-id]-gallery-[1-4].jpg` (800x600px)

### Creating New Pages (Using New Architecture)
1. Copy structure from refactored pages (`products/all.html` or `products/detail/svc138.html`)
2. Include common.css first, then page-specific CSS
3. Include common.js for navigation and global functionality
4. Use absolute paths for all resources (`/css/`, `/js/`, `/images/`)
5. Follow the modular CSS approach - don't add styles to common.css

### Migrating Pages to New Architecture
1. Replace brand_style.css with common.css + page-specific CSS
2. Remove jQuery dependencies if present
3. Update all resource paths to absolute URLs
4. Move page-specific styles to dedicated CSS file
5. Test logo switching and navigation functionality

### Updating Translations
1. Check `/fr/TRANSLATION-GLOSSARY.md` for existing translations
2. Update `products/data/products-master.json` for product content
3. Update `data/site-config.json` for site-wide text
4. Ensure French pages mirror English structure

## Development Workflow

### Before Making Changes
1. Check this CLAUDE.md for guidelines
2. Review existing modernized pages for patterns
3. Verify changes work on all screen sizes
4. Test in multiple browsers if possible

### CSS Development Rules
1. **USE** common.css for global components only (navigation, footer, hero)
2. **CREATE** page-specific CSS files for unique page styles
3. **NEVER** modify common.css for page-specific needs
4. **USE** CSS variables from common.css for consistency
5. **FOLLOW** the layered architecture (base → page-specific → inline)
6. **MAINTAIN** clear separation between global and page styles

### Testing Checklist
- [ ] Page displays correctly at 1440px (desktop)
- [ ] Page displays correctly at 768px (tablet)
- [ ] Page displays correctly at 375px (mobile)
- [ ] Logo switches correctly on scroll (white → blue)
- [ ] Navigation transparency works properly
- [ ] Mobile menu toggle functions
- [ ] Forms validate properly (if applicable)
- [ ] Images load with proper responsive variants
- [ ] No console errors
- [ ] No broken links
- [ ] Page-specific JavaScript loads and executes

## Backup & Recovery

### DEBUG Directory System
Located at `/DEBUG/`, this system provides:
- Timestamped backups before major changes
- Detailed change documentation
- Recovery instructions
- Rollback procedures

### Backup Naming Convention
```
backup_YYYYMMDD_HHMM_[description]
Example: backup_20250827_1012_webflow_removal
```

### Recovery Process
If issues arise after changes:
1. Check `/DEBUG/backup_*/RESTORE_INSTRUCTIONS.md`
2. Copy backup files to project root
3. Restart development server
4. Verify functionality

## Performance Considerations

### Current Optimizations
- Modular CSS architecture (common + page-specific)
- No jQuery dependency (pure vanilla JS)
- Dynamic logo loading based on scroll state
- Absolute path URLs for better caching
- Lazy loading for images
- Responsive image variants

### Target Metrics
- Page load: < 2 seconds
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- CSS total: < 100KB
- JavaScript total: < 50KB (excluding jQuery CDN)

## Notes for Future Development

### Immediate Priorities (Week 1)
1. Migrate remaining pages to new architecture:
   - index.html → common.css + index.css
   - about.html → common.css + about.css
   - contact.html → common.css + contact.css
   - custumer-care.html → common.css + custumer-care.css
2. Remove brand_style.css once migration complete
3. Test all product detail pages functionality

### Technical Debt
- Filename typo: `custumer-care.html` should be `customer-care.html` (keep as-is for now)
- Some legacy data files: `data/products.json` (migrate to products-master.json)
- French pages need architecture sync
- Clean up unused CSS from brand_style.css

### Architecture Migration Status
- ✅ Products catalog page (products/all.html)
- ✅ Product detail template (products/detail/svc138.html)
- ⏳ Homepage (index.html)
- ⏳ About page (about.html)
- ⏳ Contact page (contact.html)
- ⏳ Customer care (custumer-care.html)
- ⏳ French translations (/fr/*)

### Future Enhancements
- Complete French translation implementation
- WebP image format support with fallbacks
- Service worker for offline support
- Build process for CSS/JS minification
- Automated testing suite for cross-browser compatibility

## Contact & Support

For questions about this codebase or architecture decisions, refer to:
1. This CLAUDE.md file
2. `/DEBUG/` directory for historical context
3. `/.claude/project_context.md` for project overview
4. Git history for change tracking

---

**Last Updated**: 2025-08-28
**Major Changes**: Modular CSS/JS architecture implementation
**Status**: Product system fully refactored, 4 main pages awaiting migration
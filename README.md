# SecureVision AI Website

Professional security camera showcase website featuring indoor/outdoor cameras, doorbell systems, baby monitors, sports cameras, and portable power solutions.

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/scotpenn/securevisionai-website.git

# Navigate to project
cd securevisionai-website

# Start local server
python -m http.server 8000
# or
npx http-server

# View website
open http://localhost:8000
```

## 📁 Project Structure

```
/
├── index.html              # Homepage
├── about.html              # About page
├── contact.html            # Contact page  
├── products/all.html       # Product catalog
├── fr/                     # French translations
├── css/                    # Stylesheets
├── js/                     # JavaScript files
├── images/                 # Image assets
├── api/contact.js          # Contact form API
├── sitemap.xml             # SEO sitemap
└── robots.txt              # Search engine rules
```

## 🔧 Development

### Adding New Products
1. Create product data in `products/data/products/[id].json5`
2. Run `npm run build:products` to compile
3. Generate pages with `npm run generate:pages`

### CSS Architecture
- `css/common.css` - Global styles
- `css/[page].css` - Page-specific styles

### Bilingual Support
- English: Root directory
- French: `/fr/` directory with mirrored structure

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Build for production
npm run build

# Deploy
vercel --prod
```

**Environment Variable Required:**
- `RESEND_API_KEY` - For contact form email service

### Validation
```bash
# Check before deployment
./scripts/deploy-check.sh

# Validate product data
npm run validate:products
```

## 📊 SEO Features

- Complete sitemap with hreflang support
- Structured data (Organization, Products, BreadcrumbList)
- Open Graph and Twitter Card optimization
- Google Analytics 4 ready
- 404 error page with search functionality

## 🌐 Languages

- **English** (Primary): All pages in root directory
- **French**: Complete translation in `/fr/` directory

## 📞 Support

- **Documentation**: See `CLAUDE.md` for detailed development guide
- **Deployment**: See `DEPLOYMENT.md` for production setup
- **SEO**: See `SEO-OPTIMIZATION.md` for search optimization details

---

**Tech Stack**: Vanilla HTML/CSS/JS, Vercel Serverless Functions  
**License**: MIT  
**Last Updated**: January 2025
# SecureVision AI - Vercel Deployment Guide

## 📋 Pre-deployment Checklist

### ✅ Build & Validation
- [x] **Product Data**: All 12 products compiled (`npm run build:products`)
- [x] **Static Pages**: 24 product detail pages generated (12 EN + 12 FR)
- [x] **CSS Architecture**: Modular system (common.css + page-specific CSS)
- [x] **JavaScript**: Pure vanilla JS (no jQuery dependencies)
- [x] **Downloads**: GitHub-based download system configured
- [x] **Status Updates**: "Ready to Order" implemented across all products

### ✅ Configuration Files
- [x] **package.json**: Build script configured (`npm run build`)
- [x] **vercel.json**: Static build + API functions configured  
- [x] **.gitignore**: Excludes node_modules, .env, downloads/, temp files
- [x] **Environment**: `.env.local` for Resend API key (Vercel env vars)

### ✅ Core Features
- [x] **Bilingual Support**: EN/FR with hreflang tags and proper routing
- [x] **Contact Form**: Serverless function with Resend API integration
- [x] **Product System**: JSON5 → JSON compilation with schema validation
- [x] **Navigation**: Dynamic navigation from config/navigation.json
- [x] **SEO**: Meta tags, structured data, social media optimized

## 🚀 Deployment Steps

### 1. Environment Setup
```bash
# Add to Vercel dashboard environment variables:
RESEND_API_KEY=re_xxxxxxxxxx
```

### 2. Build Commands
Vercel will automatically run:
```bash
npm install
npm run build  # Compiles products + generates pages
```

### 3. Deploy
```bash
# Option A: Connect GitHub repository to Vercel dashboard
# Option B: Use Vercel CLI
vercel --prod
```

## 📁 File Structure for Production

```
/
├── index.html                   # Homepage
├── about.html                   # About page  
├── contact.html                 # Contact + Resend integration
├── customer-care.html           # Customer support
├── products/
│   ├── all.html                 # Product catalog
│   ├── detail/*.html            # 12 generated product pages (EN)
│   └── data/compiled/*.json     # Compiled product data
├── fr/                          # French mirror structure
│   ├── home.html
│   ├── about.html
│   ├── contact.html
│   ├── customer-care.html
│   └── products/detail/*.html   # 12 generated product pages (FR)
├── api/
│   └── contact.js              # Serverless contact form handler
├── css/                        # Modular CSS architecture
├── js/                         # Vanilla JavaScript
├── images/                     # Optimized images
├── config/                     # Navigation + schema configs
├── i18n/                       # Translation files
└── vercel.json                 # Vercel configuration
```

## 🔧 Build Process

### Automatic Build Steps (Vercel)
1. **Install dependencies**: `npm install`
2. **Compile products**: JSON5 → JSON validation + compilation
3. **Generate pages**: 24 static HTML pages from templates
4. **Serve static**: All files served as static assets
5. **API functions**: contact.js deployed as serverless function

### Build Output
- ✅ **12 Products** × **2 Languages** = **24 Product Pages**
- ✅ **JSON Schema Validation** on all product data
- ✅ **Static HTML** - no client-side compilation needed
- ✅ **Serverless API** for contact form handling

## 🌐 Domain & DNS

### Production URLs
- **Primary**: `https://securevision-ai.vercel.app` (or custom domain)
- **API Endpoint**: `https://[domain]/api/contact`

### Custom Domain Setup
1. Add domain in Vercel dashboard
2. Configure DNS records:
   - **A Record**: `@` → Vercel IP
   - **CNAME**: `www` → `alias.vercel.app`
3. SSL automatically provisioned by Vercel

## 📊 Performance & Security

### Caching Strategy (vercel.json)
- **Static Assets**: `max-age=31536000, immutable` (1 year)
- **CSS/JS/Images**: Long-term caching with immutable flag
- **HTML Pages**: Default caching (short-term)

### Security Headers
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **X-XSS-Protection**: `1; mode=block`

### Performance Targets
- **Page Load**: < 2 seconds
- **First Contentful Paint**: < 1.8s
- **CSS Bundle**: < 100KB
- **JavaScript**: < 50KB (vanilla JS only)

## 🔍 Post-Deployment Verification

### Functional Tests
- [ ] Homepage loads correctly
- [ ] All navigation links work (EN/FR)
- [ ] Product catalog displays 12 products
- [ ] Product detail pages load with correct data
- [ ] Contact form submits successfully
- [ ] Download buttons work (available files + disabled state)
- [ ] Language switching works correctly
- [ ] Mobile responsive design

### SEO Verification
- [ ] Meta tags present on all pages
- [ ] hreflang tags for bilingual support
- [ ] Social media preview works
- [ ] Sitemap accessible (if implemented)
- [ ] Google Analytics tracking (if implemented)

## 🚨 Troubleshooting

### Common Issues
1. **Build Fails**: Check `npm run build` locally first
2. **API Not Working**: Verify `RESEND_API_KEY` in Vercel env vars
3. **Missing Pages**: Ensure `npm run generate:pages` completed
4. **CSS Issues**: Check file paths use absolute paths (`/css/`)
5. **French Pages**: Verify template-fr.html structure matches template.html

### Debug Commands
```bash
# Local testing
npm run build           # Test full build process  
npm run validate:products  # Check product data integrity
npm run validate-i18n     # Verify translations
python -m http.server 8000  # Test locally

# Vercel CLI debugging
vercel dev              # Test serverless functions locally
vercel logs --follow    # Monitor deployment logs
```

## 📈 Analytics & Monitoring

### Vercel Analytics
- Built-in performance monitoring
- Web Vitals tracking
- Function execution logs

### Recommended Additions
- **Google Analytics 4**: For detailed user analytics
- **Google Search Console**: For SEO monitoring
- **Hotjar/LogRocket**: For user behavior analysis
- **Sentry**: For error monitoring

## 🔄 Continuous Deployment

### GitHub Integration
1. Connect repository to Vercel
2. Auto-deploy on push to `main` branch
3. Preview deployments on pull requests
4. Environment variables sync

### Deployment Triggers
- **Production**: Push to `main` branch
- **Preview**: Pull requests and feature branches
- **Manual**: Via Vercel dashboard or CLI

---

**Last Updated**: 2025-01-09  
**Build System**: Static Build + Serverless Functions  
**Framework**: Vanilla HTML/CSS/JS + Node.js API  
**Hosting**: Vercel Platform
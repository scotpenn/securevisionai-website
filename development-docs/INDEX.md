# SecureVision AI - Development Documentation Index

## 📚 Documentation Structure

This directory contains all development, deployment, and process documentation for the SecureVision AI website project.

---

## 🔧 Core Development Docs

### [CLAUDE.md](./CLAUDE.md)
**AI Assistant Instructions & Project Guidelines**
- Project overview and architecture
- Development commands and workflows
- CSS/JS architecture patterns
- Product data management system
- Bilingual implementation details
- File structure and conventions
- Common development tasks

### [project_context.md](./project_context.md)
**Quick Project Context Reference**
- Current project status
- Technology stack overview
- Key features and components
- Recent updates summary

---

## 🚀 Deployment & Operations

### [DEPLOYMENT.md](./DEPLOYMENT.md)
**Complete Deployment Guide**
- Vercel deployment process
- Environment variables setup
- Build and deployment commands
- Production checklist
- Domain configuration

### [READY-TO-DEPLOY.md](./READY-TO-DEPLOY.md)
**Pre-deployment Readiness Checklist**
- Final validation steps
- Production environment setup
- Performance optimization checks
- Security considerations

---

## 🔍 Debugging & Troubleshooting

### [DEBUG-LOG.md](./DEBUG-LOG.md)
**Issue Tracking & Solutions Log**
- Common problems and fixes
- Historical issue resolutions
- Debugging techniques
- Error pattern recognition

---

## 🌍 Internationalization

### [TRANSLATION-GLOSSARY.md](./TRANSLATION-GLOSSARY.md)
**English-French Translation Reference**
- Complete translation glossary
- 173 technical and business terms
- UI text translations
- Product description guidelines

### [glossary_2.md](./glossary_2.md)
**Additional Translation Resources**
- Extended terminology
- Context-specific translations
- Regional variations

---

## 📈 Optimization

### [SEO-OPTIMIZATION.md](./SEO-OPTIMIZATION.md)
**Search Engine Optimization Guide**
- Meta tags configuration
- Structured data implementation
- Performance optimization
- Multi-language SEO strategies
- Sitemap generation

---

## 🏗️ Architecture Overview

### Static Site Architecture
- **Frontend**: Pure HTML/CSS/JavaScript (No frameworks)
- **Build System**: Node.js scripts for product compilation
- **Data Format**: JSON5 → JSON compilation pipeline
- **Deployment**: Vercel with serverless functions
- **Email Service**: Resend API for contact forms

### Product Data Pipeline
```
JSON5 (Development) → Build Script → JSON (Production) → HTML Generation
```

### Directory Structure
```
/
├── development-docs/     # This documentation directory
├── public/              # Generated static files (git-ignored)
├── products/            # Product data and pages
│   ├── data/
│   │   ├── products/    # JSON5 source files
│   │   └── compiled/    # Generated JSON files
│   └── detail/          # Product detail pages
├── fr/                  # French translations
├── css/                 # Modular CSS architecture
├── js/                  # Vanilla JavaScript
├── images/              # Product and site images
├── api/                 # Vercel serverless functions
└── scripts/             # Build and validation scripts
```

---

## 📝 Quick Reference

### Essential Commands
```bash
# Development
npm run dev              # Start development server

# Build & Deploy
npm run build            # Full production build
npm run validate:products # Validate product data
vercel --prod           # Deploy to production

# Validation
npm run validate-i18n    # Check translations
npm run lint            # Lint CSS files

# Git Workflow
git add -A && git commit -m "message" && git push
```

### Environment Variables
```bash
RESEND_API_KEY          # Required for contact form
```

### Key Files
- `/api/contact.js` - Contact form handler
- `/scripts/build-products.js` - Product compilation
- `/scripts/generate-product-pages.js` - Static page generation
- `/config/navigation.json` - Dynamic navigation config

---

## 📊 Current Status

### ✅ Completed Features
- 12 products × 2 languages = 24 static pages
- Bilingual navigation system
- Contact form with Resend API
- Product data compilation pipeline
- Responsive design for all devices
- SEO optimization with structured data

### 🚧 Pending Tasks
- WebP image optimization
- FAQ system implementation
- Performance monitoring setup
- Additional product documentation uploads

---

## 🔗 External Resources

- **Production Site**: [securevisionai.com](https://securevisionai.com)
- **GitHub Repository**: [github.com/scotpenn/securevisionai-website](https://github.com/scotpenn/securevisionai-website)
- **Downloads Repository**: [github.com/scotpenn/securevision-downloads](https://github.com/scotpenn/securevision-downloads)
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)

---

## 📅 Last Updated
- Date: 2025-01-06
- Version: 1.0.0
- Maintainer: SecureVision AI Development Team
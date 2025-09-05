#!/bin/bash

# SecureVision AI - Pre-deployment Validation Script
# This script runs comprehensive checks before Vercel deployment

echo "🚀 SecureVision AI - Pre-deployment Validation"
echo "=============================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Error counter
ERRORS=0

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

# Function to print info
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo -e "\n${BLUE}1. Environment Check${NC}"
echo "-------------------"

# Check Node.js version
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
    print_status 0 "Node.js installed: $NODE_VERSION"
else
    print_status 1 "Node.js not found"
fi

# Check npm
NPM_VERSION=$(npm --version 2>/dev/null)
if [ $? -eq 0 ]; then
    print_status 0 "npm installed: $NPM_VERSION"
else
    print_status 1 "npm not found"
fi

# Check if .env.local exists
if [ -f ".env.local" ]; then
    print_status 0 ".env.local exists"
    if grep -q "RESEND_API_KEY=" .env.local; then
        print_status 0 "RESEND_API_KEY configured"
    else
        print_status 1 "RESEND_API_KEY missing in .env.local"
    fi
else
    print_status 1 ".env.local not found"
fi

echo -e "\n${BLUE}2. Dependencies Check${NC}"
echo "---------------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_status 0 "node_modules directory exists"
else
    print_warning "node_modules not found, running npm install..."
    npm install
    if [ $? -eq 0 ]; then
        print_status 0 "npm install completed"
    else
        print_status 1 "npm install failed"
    fi
fi

echo -e "\n${BLUE}3. Build Process Check${NC}"
echo "----------------------"

# Run product build
print_info "Building products..."
npm run build:products > /dev/null 2>&1
print_status $? "Product data compilation"

# Run product validation
print_info "Validating products..."
npm run validate:products > /dev/null 2>&1
print_status $? "Product data validation"

# Run page generation
print_info "Generating product pages..."
npm run generate:pages > /dev/null 2>&1
print_status $? "Product page generation"

echo -e "\n${BLUE}4. File Structure Check${NC}"
echo "-----------------------"

# Check required files
REQUIRED_FILES=(
    "index.html"
    "about.html" 
    "contact.html"
    "customer-care.html"
    "products/all.html"
    "fr/home.html"
    "fr/about.html"
    "fr/contact.html"
    "fr/customer-care.html"
    "fr/products/all.html"
    "api/contact.js"
    "vercel.json"
    "package.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$file exists"
    else
        print_status 1 "$file missing"
    fi
done

# Check product pages
PRODUCT_COUNT=$(find products/detail -name "*.html" | wc -l)
print_info "English product pages: $PRODUCT_COUNT"
if [ $PRODUCT_COUNT -ge 12 ]; then
    print_status 0 "English product pages generated"
else
    print_status 1 "Missing English product pages"
fi

FR_PRODUCT_COUNT=$(find fr/products/detail -name "*.html" | wc -l)
print_info "French product pages: $FR_PRODUCT_COUNT"
if [ $FR_PRODUCT_COUNT -ge 12 ]; then
    print_status 0 "French product pages generated"
else
    print_status 1 "Missing French product pages"
fi

echo -e "\n${BLUE}5. CSS & JS Check${NC}"
echo "-----------------"

# Check CSS files
CSS_FILES=(
    "css/common.css"
    "css/index.css"
    "css/about.css"
    "css/contact.css"
    "css/customer-care.css"
    "css/products.css"
    "css/product-detail.css"
)

for file in "${CSS_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$file exists"
    else
        print_status 1 "$file missing"
    fi
done

# Check JS files (only check files that actually exist in HTML)
JS_FILES=(
    "js/common.js"
    "js/json5-parser.js"
    "js/pages/products.js"
    "js/pages/product-detail.js"
    "js/pages/customer-care.js"
)

for file in "${JS_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$file exists"
    else
        print_status 1 "$file missing"
    fi
done

echo -e "\n${BLUE}6. Configuration Check${NC}"
echo "----------------------"

# Check vercel.json
if [ -f "vercel.json" ]; then
    if grep -q "contact.js" vercel.json; then
        print_status 0 "vercel.json API function configured"
    else
        print_status 1 "vercel.json missing API function config"
    fi
else
    print_status 1 "vercel.json missing"
fi

# Check package.json build script
if grep -q '"build":' package.json; then
    print_status 0 "package.json build script configured"
else
    print_status 1 "package.json missing build script"
fi

echo -e "\n${BLUE}7. Security Check${NC}"
echo "----------------"

# Check .gitignore
if [ -f ".gitignore" ]; then
    if grep -q "node_modules" .gitignore && grep -q ".env" .gitignore; then
        print_status 0 ".gitignore properly configured"
    else
        print_status 1 ".gitignore missing important entries"
    fi
else
    print_status 1 ".gitignore missing"
fi

echo -e "\n${BLUE}📊 Deployment Readiness Summary${NC}"
echo "=================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Ready for Vercel deployment.${NC}"
    echo -e "\n${BLUE}Next steps:${NC}"
    echo "1. Commit and push to GitHub"
    echo "2. Connect repository to Vercel"
    echo "3. Set RESEND_API_KEY in Vercel environment variables"
    echo "4. Deploy!"
    exit 0
else
    echo -e "${RED}❌ $ERRORS issues found. Please fix before deployment.${NC}"
    exit 1
fi
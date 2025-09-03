#!/bin/bash

# SecureVision AI Pre-commit Hook
# Validates navigation configuration, product data, and CSS before commit

echo "🚀 Running SecureVision AI pre-commit checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Exit on first failure
set -e

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if we're in the right directory
if [ ! -f "config/navigation.json" ]; then
    echo -e "${RED}❌ Error: Must be run from project root directory${NC}"
    exit 1
fi

# 1. Validate navigation configuration
echo "🔍 Validating navigation configuration..."
if command_exists node; then
    if [ -f "scripts/validate-navigation.js" ]; then
        node scripts/validate-navigation.js
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Navigation configuration valid${NC}"
        else
            echo -e "${RED}❌ Navigation configuration validation failed${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠️  Warning: Navigation validator not found, skipping${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Warning: Node.js not found, skipping navigation validation${NC}"
fi

# 2. Check for common mistakes
echo "🔍 Checking for common mistakes..."

# Check for hard-coded navigation items in nav sections specifically
HARDCODED_NAV=0
for file in index.html about.html contact.html customer-care.html products/all.html; do
    if [ -f "$file" ]; then
        # Extract nav section and check for hard-coded items without data-menu attribute
        if grep -A 20 -B 5 "nav-dropdown" "$file" | grep -E "Indoor Cameras|Baby/Pet Monitors|Outdoor Cameras" | grep -v "dynamically populated" >/dev/null 2>&1; then
            if ! grep -A 20 -B 5 "nav-dropdown" "$file" | grep "data-menu=\"products\"" >/dev/null 2>&1; then
                echo -e "${RED}❌ Found hard-coded navigation in ${file}${NC}"
                HARDCODED_NAV=1
            fi
        fi
    fi
done

if [ "$HARDCODED_NAV" -eq 1 ]; then
    echo "Please use placeholder navigation structure with data-menu attributes"
    exit 1
fi

# Check for relative paths in navigation links
RELATIVE_PATHS=$(grep -r "href=\"\.\." --include="*.html" . | wc -l)
if [ "$RELATIVE_PATHS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Warning: Found relative paths in HTML files${NC}"
    echo "Consider using absolute paths starting with /"
fi

# Check for missing common.js references in main HTML files
MAIN_FILES=("index.html" "about.html" "contact.html" "customer-care.html" "products/all.html")
for file in "${MAIN_FILES[@]}"; do
    if [ -f "$file" ]; then
        if ! grep -q "common.js" "$file"; then
            echo -e "${RED}❌ ${file} missing common.js reference${NC}"
            exit 1
        fi
    fi
done

# 3. Validate product data
echo "📦 Validating product data..."
if command_exists node; then
    if [ -f "scripts/build-products.js" ]; then
        echo "Building and validating products..."
        node scripts/build-products.js
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Product data validation passed${NC}"
        else
            echo -e "${RED}❌ Product data validation failed${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠️  Warning: Product build script not found, skipping product validation${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Warning: Node.js not found, skipping product validation${NC}"
fi

# 4. Validate CSS if Stylelint is available
echo "🎨 Checking CSS..."
if command_exists stylelint; then
    if [ -f ".stylelintrc.json" ]; then
        stylelint "css/**/*.css" --config .stylelintrc.json
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ CSS validation passed${NC}"
        else
            echo -e "${RED}❌ CSS validation failed${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠️  Warning: .stylelintrc.json not found, skipping CSS validation${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Warning: Stylelint not found, skipping CSS validation${NC}"
fi

# 5. Check file naming conventions
echo "📁 Checking file naming conventions..."
BAD_NAMES=$(find . -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.json" | grep -E "[ A-Z]" | grep -v node_modules | grep -v ".git" | wc -l)
if [ "$BAD_NAMES" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Warning: Found files with spaces or uppercase letters${NC}"
    find . -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.json" | grep -E "[ A-Z]" | grep -v node_modules | grep -v ".git"
    echo "Consider using kebab-case naming convention"
fi

# 6. Final validation
echo "🏁 Final checks..."

# Ensure navigation.json is valid JSON
if ! python3 -m json.tool config/navigation.json > /dev/null 2>&1; then
    echo -e "${RED}❌ config/navigation.json is not valid JSON${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 All pre-commit checks passed!${NC}"
echo "📝 Ready to commit"

exit 0
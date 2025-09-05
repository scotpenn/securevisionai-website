#!/bin/bash

# Update download links in all product detail pages
# From: https://github.com/your-username/securevision-ai-downloads/releases/download/v1.0/
# To: https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products/

echo "Updating download links in product pages..."

# Process each HTML file
for file in products/detail/*.html fr/products/detail/*.html; do
    if [ -f "$file" ]; then
        echo "Processing: $file"
        
        # Get product ID from filename (e.g., svc138.html -> svc138)
        filename=$(basename "$file")
        product_id="${filename%.html}"
        
        # Update links - handle various patterns
        # Pattern 1: releases/download/v1.0/xxx-brochure.pdf -> main/products/xxx/xxx-brochure-en.pdf
        sed -i '' "s|https://github.com/your-username/securevision-ai-downloads/releases/download/v1.0/${product_id}-brochure.pdf|https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products/${product_id}/${product_id}-brochure-en.pdf|g" "$file"
        
        # Pattern 2: releases/download/v1.0/xxx-manual.pdf -> main/products/xxx/xxx-manual-en.pdf
        sed -i '' "s|https://github.com/your-username/securevision-ai-downloads/releases/download/v1.0/${product_id}-manual.pdf|https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products/${product_id}/${product_id}-manual-en.pdf|g" "$file"
        
        # Pattern 3: releases/download/v1.0/xxx-quickstart.pdf -> main/products/xxx/xxx-quickstart-en.pdf
        sed -i '' "s|https://github.com/your-username/securevision-ai-downloads/releases/download/v1.0/${product_id}-quickstart.pdf|https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products/${product_id}/${product_id}-quickstart-en.pdf|g" "$file"
        
        # Pattern 4: releases/download/v1.0/xxx-app-guide.pdf -> main/products/xxx/xxx-app-guide-en.pdf
        sed -i '' "s|https://github.com/your-username/securevision-ai-downloads/releases/download/v1.0/${product_id}-app-guide.pdf|https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products/${product_id}/${product_id}-app-guide-en.pdf|g" "$file"
        
        # Pattern 5: releases/download/v1.0/xxx-setup-guide.pdf -> main/products/xxx/xxx-setup-guide-en.pdf
        sed -i '' "s|https://github.com/your-username/securevision-ai-downloads/releases/download/v1.0/${product_id}-setup-guide.pdf|https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products/${product_id}/${product_id}-setup-guide-en.pdf|g" "$file"
        
        # Pattern 6: releases/download/v1.0/xxx-safety.pdf -> main/products/xxx/xxx-safety-en.pdf
        sed -i '' "s|https://github.com/your-username/securevision-ai-downloads/releases/download/v1.0/${product_id}-safety.pdf|https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products/${product_id}/${product_id}-safety-en.pdf|g" "$file"
        
        # Pattern 7: releases/download/v1.0/xxx-technical.pdf -> main/products/xxx/xxx-technical-en.pdf
        sed -i '' "s|https://github.com/your-username/securevision-ai-downloads/releases/download/v1.0/${product_id}-technical.pdf|https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products/${product_id}/${product_id}-technical-en.pdf|g" "$file"
        
        # Pattern 8: releases/download/v1.0/xxx-installation.pdf -> main/products/xxx/xxx-installation-en.pdf
        sed -i '' "s|https://github.com/your-username/securevision-ai-downloads/releases/download/v1.0/${product_id}-installation.pdf|https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products/${product_id}/${product_id}-installation-en.pdf|g" "$file"
    fi
done

echo "Download links update complete!"

# Show a sample of the updated links
echo ""
echo "Sample of updated links:"
grep -h "raw.githubusercontent.com/scotpenn" products/detail/svc138.html 2>/dev/null | head -3
#!/usr/bin/env node

/**
 * 更新所有产品的下载链接
 * - 将现有文件更新为正确的GitHub raw URLs
 * - 将缺失文件的URL设置为null（用于显示禁用状态）
 * - 基于实际的downloads仓库文件存在状态
 */

const fs = require('fs');
const path = require('path');

// 实际存在的文件列表（基于downloads/FILES-SUMMARY.md）
const availableFiles = {
  'svb215': ['brochure'],
  'svc138': ['brochure'],
  'svc176': ['brochure', 'manual'],
  'svc180': ['brochure', 'manual'],
  'svc201': ['brochure', 'manual'],
  'svc207': ['brochure'],
  'svc209': ['brochure', 'manual'],
  'svc216': ['brochure', 'manual'],  // Additional product
  'svc263': ['brochure', 'manual'],
  'svc267': ['brochure'],            // Additional product
  'svc285': ['manual'],
  // Missing completely: svc286, svc842, svt100
};

// GitHub raw URL base
const BASE_URL = 'https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products';

function getFileUrl(productId, fileType, lang = 'en') {
  if (!availableFiles[productId] || !availableFiles[productId].includes(fileType)) {
    return null; // File doesn't exist
  }
  return `${BASE_URL}/${productId}/${productId}-${fileType}-${lang}.pdf`;
}

function updateDownloadsForProduct(productId, data) {
  console.log(`Updating downloads for ${productId}...`);
  
  if (!data.downloads) {
    console.log(`  No downloads section found for ${productId}`);
    return false;
  }
  
  let updated = false;
  
  // Update English downloads
  if (data.downloads.en && Array.isArray(data.downloads.en)) {
    data.downloads.en.forEach(download => {
      const oldUrl = download.url;
      
      // Determine file type from the download name/url
      let fileType = null;
      if (download.name.toLowerCase().includes('brochure') || oldUrl.includes('brochure')) {
        fileType = 'brochure';
      } else if (download.name.toLowerCase().includes('manual') || oldUrl.includes('manual')) {
        fileType = 'manual';
      } else if (download.name.toLowerCase().includes('quickstart') || oldUrl.includes('quickstart')) {
        fileType = 'quickstart';
      } else if (download.name.toLowerCase().includes('app') || download.name.toLowerCase().includes('guide')) {
        fileType = 'app-guide';
      }
      
      if (fileType) {
        const newUrl = getFileUrl(productId, fileType, 'en');
        if (newUrl !== oldUrl) {
          console.log(`  EN: ${fileType} - ${oldUrl ? 'EXISTS' : 'NULL'} -> ${newUrl ? 'EXISTS' : 'NULL'}`);
          download.url = newUrl;
          updated = true;
        }
      }
    });
  }
  
  // Update French downloads (use EN files for now)
  if (data.downloads.fr && Array.isArray(data.downloads.fr)) {
    data.downloads.fr.forEach(download => {
      const oldUrl = download.url;
      
      // Determine file type from the download name/url
      let fileType = null;
      if (download.name.toLowerCase().includes('brochure') || oldUrl.includes('brochure')) {
        fileType = 'brochure';
      } else if (download.name.toLowerCase().includes('manuel') || oldUrl.includes('manual')) {
        fileType = 'manual';
      }
      
      if (fileType) {
        // For now, use EN files for FR version (as requested)
        const newUrl = getFileUrl(productId, fileType, 'en');
        if (newUrl !== oldUrl) {
          console.log(`  FR: ${fileType} - ${oldUrl ? 'EXISTS' : 'NULL'} -> ${newUrl ? 'EXISTS' : 'NULL'} (using EN file)`);
          download.url = newUrl;
          updated = true;
        }
      }
    });
  }
  
  return updated;
}

function main() {
  const productsDir = path.join(__dirname, '../products/data/products');
  const productFiles = fs.readdirSync(productsDir).filter(f => f.endsWith('.json5'));
  
  let totalUpdated = 0;
  
  console.log('🔄 Updating product download links...\n');
  
  productFiles.forEach(filename => {
    const filepath = path.join(productsDir, filename);
    const productId = path.basename(filename, '.json5');
    
    try {
      const content = fs.readFileSync(filepath, 'utf8');
      const data = JSON.parse(content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, ''));
      
      const wasUpdated = updateDownloadsForProduct(productId, data);
      
      if (wasUpdated) {
        // Write back to file (preserve original formatting by doing a simple replacement)
        let updatedContent = content;
        
        // Replace the downloads URLs in the original content
        if (data.downloads && data.downloads.en) {
          data.downloads.en.forEach(download => {
            if (download.url) {
              // Find and replace URL in original content
              const urlRegex = new RegExp(`"url":\\s*"[^"]*"`, 'g');
              // This is a simple approach - in production you might want more sophisticated parsing
            }
          });
        }
        
        // For now, let's just write the JSON back (this will lose comments, but structure will remain)
        const jsonString = JSON.stringify(data, null, 2);
        fs.writeFileSync(filepath, jsonString);
        console.log(`  ✅ Updated ${productId}`);
        totalUpdated++;
      } else {
        console.log(`  ⏭️  No updates needed for ${productId}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${productId}:`, error.message);
    }
    
    console.log('');
  });
  
  console.log(`\n🎉 Update complete! ${totalUpdated} products updated.`);
  console.log('\n📝 Summary:');
  console.log('✅ Available files: Will use GitHub raw URLs');
  console.log('❌ Missing files: URL set to null (will show as disabled)');
  console.log('🇫🇷 French files: Currently using English versions');
  
  console.log('\n🔨 Next steps:');
  console.log('1. Run: npm run build:products');
  console.log('2. Test product pages for download functionality');
  console.log('3. Add French versions of PDFs when available');
}

if (require.main === module) {
  main();
}
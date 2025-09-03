#!/usr/bin/env node

/**
 * SecureVision AI - 硬编码产品页面生成器
 * 基于编译后的JSON数据，为每个产品生成独立的HTML页面
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// 配置
const CONFIG = {
  sourceTemplate: 'products/detail/template.html',
  frSourceTemplate: 'fr/products/detail/template-fr.html', 
  compiledDataDir: 'products/data/compiled/',
  outputDir: 'products/detail/',
  frOutputDir: 'fr/products/detail/'
};

// 工具函数
function readTemplate(templatePath) {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  return fs.readFileSync(templatePath, 'utf8');
}

function getProductData(productId) {
  const jsonPath = path.join(CONFIG.compiledDataDir, `${productId}.json`);
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Product data not found: ${jsonPath}`);
  }
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  return JSON.parse(rawData).product;
}

// 生成规格HTML
function generateSpecificationsHTML(specifications, lang) {
  let html = '';
  
  Object.entries(specifications).forEach(([groupKey, groupData]) => {
    const groupName = groupData.group_name?.[lang] || groupKey;
    const specs = groupData.specs?.[lang] || {};
    
    if (Object.keys(specs).length > 0) {
      html += `
        <section class="spec-group">
          <h4 class="spec-group-title">${groupName}</h4>
          <table class="spec-table">
            <tbody>`;
      
      Object.entries(specs).forEach(([key, value]) => {
        html += `
              <tr>
                <th>${key}</th>
                <td>${value}</td>
              </tr>`;
      });
      
      html += `
            </tbody>
          </table>
        </section>`;
    }
  });
  
  return html;
}

// 图标映射 - 根据功能关键词匹配合适的图标
const FEATURE_ICONS = {
  // Video/Recording 相关
  'HD|1080p|4K|Live View|Recording|Video': `
    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M23 7l-7 5 7 5V7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  
  // Night Vision 相关
  'Night Vision|Infrared|IR': `
    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  
  // Motion Detection 相关
  'Motion|Detection|PIR|Sensor': `
    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  
  // Audio 相关
  'Audio|Two-Way|Communication|Sound': `
    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polygon points="11 5,6 9,2 9,2 15,6 15,11 19,11 5" stroke="currentColor" stroke-width="2"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  
  // Mobile/Remote 相关
  'Mobile|Remote|App|Viewing': `
    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
      <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/>
      <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  
  // Storage 相关
  'Storage|SD Card|Cloud|Micro SD': `
    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2"/>
      <polyline points="14 2,14 8,20 8" stroke="currentColor" stroke-width="2"/>
      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  
  // WiFi/Network 相关
  'WiFi|Wi-Fi|Wireless|Network': `
    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="currentColor" stroke-width="2"/>
      <path d="M1.42 9a16 16 0 0 1 21.16 0" stroke="currentColor" stroke-width="2"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke="currentColor" stroke-width="2"/>
      <line x1="12" y1="20" x2="12.01" y2="20" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  
  // 默认图标 - 勾选标记
  'default': `
    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
};

// 根据功能文本选择合适的图标
function getFeatureIcon(featureText) {
  for (const [keywords, icon] of Object.entries(FEATURE_ICONS)) {
    if (keywords !== 'default') {
      const keywordList = keywords.split('|');
      if (keywordList.some(keyword => featureText.includes(keyword))) {
        return icon;
      }
    }
  }
  return FEATURE_ICONS.default;
}

// 生成功能亮点HTML
function generateHighlightsHTML(highlights, lang) {
  const items = highlights[lang] || [];
  return items.map(item => `<li>
                ${getFeatureIcon(item).trim()}
                <span>${item}</span>
              </li>`).join('\n              ');
}

// 生成下载链接HTML
function generateDownloadsHTML(downloads, lang) {
  const items = downloads[lang] || [];
  return items.map(download => `
    <div class="download-item">
      <div class="download-info">
        <h4>${download.name}</h4>
        <p class="download-meta">${download.type} • ${download.size}</p>
        ${download.description ? `<p class="download-desc">${download.description}</p>` : ''}
      </div>
      <a href="${download.url}" class="btn btn-secondary download-btn" download>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Download
      </a>
    </div>`).join('\n          ');
}

// 生成缩略图HTML
function generateThumbnailsHTML(gallery) {
  return gallery.map((imgSrc, index) => `
            <button class="gallery-thumb${index === 0 ? ' active' : ''}" onclick="switchMainImage('${imgSrc}')">
              <img src="${imgSrc}" alt="View ${index + 1}" />
            </button>`).join('');
}

// 生成单个产品页面
function generateProductPage(productId, isFrench = false) {
  console.log(`📄 Generating ${isFrench ? 'French' : 'English'} page for ${productId}...`);
  
  try {
    // 读取产品数据
    const product = getProductData(productId);
    const lang = isFrench ? 'fr' : 'en';
    
    // 读取模板
    const templatePath = isFrench ? CONFIG.frSourceTemplate : CONFIG.sourceTemplate;
    let template = readTemplate(templatePath);
    
    // 替换基本信息
    template = template.replace(/{{PRODUCT_ID}}/g, product.id);
    template = template.replace(/{{PRODUCT_MODEL}}/g, product.model);
    template = template.replace(/{{PRODUCT_NAME}}/g, product.name[lang] || product.name.en);
    template = template.replace(/{{PRODUCT_DESCRIPTION}}/g, product.description[lang] || product.description.en);
    template = template.replace(/{{MAIN_IMAGE}}/g, product.images.main);
    template = template.replace(/{{MAIN_IMAGE_ALT}}/g, product.name[lang] || product.name.en);
    
    // 替换SEO信息
    template = template.replace(/{{META_TITLE}}/g, `${product.name[lang]} - SecureVision AI`);
    template = template.replace(/{{META_DESCRIPTION}}/g, product.description[lang] || product.description.en);
    template = template.replace(/{{OG_IMAGE}}/g, product.images.main);
    
    // 替换功能亮点
    const highlightsHTML = generateHighlightsHTML(product.highlights, lang);
    template = template.replace(/{{PRODUCT_HIGHLIGHTS}}/g, highlightsHTML);
    
    // 替换规格信息
    const specificationsHTML = generateSpecificationsHTML(product.specifications, lang);
    template = template.replace(/{{PRODUCT_SPECIFICATIONS}}/g, specificationsHTML);
    
    // 替换下载信息
    const downloadsHTML = generateDownloadsHTML(product.downloads, lang);
    template = template.replace(/{{PRODUCT_DOWNLOADS}}/g, downloadsHTML);
    
    // 替换保修信息
    const warrantyText = product.warranty?.[lang] || product.warranty?.en || '';
    template = template.replace(/{{PRODUCT_WARRANTY}}/g, warrantyText);
    
    // 替换缩略图
    const thumbnailsHTML = generateThumbnailsHTML(product.images.gallery);
    template = template.replace(/{{GALLERY_THUMBNAILS}}/g, thumbnailsHTML);
    
    // 替换库存状态
    const statusMsg = product.availability?.message?.[lang] || 'Available';
    const statusClass = product.availability?.status === 'in_stock' ? 'in-stock' : 'out-of-stock';
    template = template.replace(/{{AVAILABILITY_STATUS}}/g, `
      <span class="availability-status ${statusClass}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
        ${statusMsg}
      </span>`);
    
    // 确保输出目录存在
    const outputDir = isFrench ? CONFIG.frOutputDir : CONFIG.outputDir;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 写入文件
    const outputPath = path.join(outputDir, `${productId}.html`);
    fs.writeFileSync(outputPath, template, 'utf8');
    
    console.log(`✅ Generated: ${outputPath}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${productId} (${lang}):`, error.message);
    return false;
  }
}

// 主函数
async function main() {
  console.log('🚀 SecureVision AI - Hardcoded Product Page Generator');
  console.log('='.repeat(60));
  
  try {
    // 获取所有编译后的产品JSON文件
    const jsonFiles = glob.sync('*.json', { cwd: CONFIG.compiledDataDir });
    const productIds = jsonFiles.map(file => path.basename(file, '.json'));
    
    console.log(`📦 Found ${productIds.length} products:`, productIds.join(', '));
    
    let successCount = 0;
    let totalPages = 0;
    
    // 为每个产品生成英语和法语页面
    for (const productId of productIds) {
      // 英语页面
      if (generateProductPage(productId, false)) {
        successCount++;
      }
      totalPages++;
      
      // 法语页面
      if (generateProductPage(productId, true)) {
        successCount++;
      }
      totalPages++;
    }
    
    console.log('\\n' + '='.repeat(60));
    console.log(`🎉 Generation complete!`);
    console.log(`📊 Success: ${successCount}/${totalPages} pages generated`);
    
    if (successCount === totalPages) {
      console.log(`✅ All product pages generated successfully!`);
      process.exit(0);
    } else {
      console.log(`⚠️  Some pages failed to generate`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateProductPage };
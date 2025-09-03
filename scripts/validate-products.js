#!/usr/bin/env node

/**
 * SecureVision AI - Product Data Validator
 * 验证编译后的产品 JSON 文件完整性和一致性
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const COMPILED_DIR = path.join(ROOT, 'products/data/compiled');

console.log('🧪 SecureVision AI Product Validator');
console.log('====================================');

// 检查编译目录是否存在
if (!fs.existsSync(COMPILED_DIR)) {
  console.error('❌ Compiled directory not found:', path.relative(ROOT, COMPILED_DIR));
  console.log('💡 Run "npm run build:products" first');
  process.exit(1);
}

// 获取所有编译后的 JSON 文件
const files = fs.readdirSync(COMPILED_DIR)
  .filter(f => f.endsWith('.json') && f !== 'index.json')
  .sort();

console.log(`📁 Found ${files.length} compiled product files`);

if (files.length === 0) {
  console.log('⚠️  No compiled product files found');
  process.exit(0);
}

let validCount = 0;
let errorCount = 0;
const validationResults = [];

// 验证每个产品文件
for (const filename of files) {
  const filePath = path.join(COMPILED_DIR, filename);
  const productId = path.basename(filename, '.json');
  
  console.log(`\\n🔍 Validating: ${filename}`);
  
  try {
    // 读取和解析 JSON 文件
    const content = fs.readFileSync(filePath, 'utf8');
    let data;
    
    try {
      data = JSON.parse(content);
    } catch (parseError) {
      throw new Error(`Invalid JSON syntax: ${parseError.message}`);
    }
    
    // 基础结构验证
    if (!data.product) {
      throw new Error('Missing required "product" object');
    }
    
    const product = data.product;
    
    // 必要字段验证
    const requiredFields = ['id', 'model', 'name', 'description', 'images'];
    const missingFields = requiredFields.filter(field => !product[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // ID 一致性验证
    if (product.id !== productId) {
      throw new Error(`Product ID mismatch: file=${productId}, data=${product.id}`);
    }
    
    // 双语内容验证
    const bilingualFields = ['name', 'description'];
    for (const field of bilingualFields) {
      if (product[field] && typeof product[field] === 'object') {
        if (!product[field].en) {
          throw new Error(`Missing English content for ${field}`);
        }
      }
    }
    
    // 图片路径验证
    if (product.images) {
      if (product.images.main && !product.images.main.startsWith('/images/')) {
        console.log(`  ⚠️  Main image path should start with /images/: ${product.images.main}`);
      }
      
      if (product.images.gallery && Array.isArray(product.images.gallery)) {
        for (const imgPath of product.images.gallery) {
          if (!imgPath.startsWith('/images/')) {
            console.log(`  ⚠️  Gallery image path should start with /images/: ${imgPath}`);
          }
        }
      }
    }
    
    // 规格验证
    if (product.specifications) {
      let specGroupCount = 0;
      for (const [groupName, groupData] of Object.entries(product.specifications)) {
        if (!groupData.group_name || !groupData.specs) {
          console.log(`  ⚠️  Specification group "${groupName}" missing group_name or specs`);
        }
        specGroupCount++;
      }
      console.log(`  📋 ${specGroupCount} specification groups`);
    }
    
    // 收集验证结果
    validationResults.push({
      id: productId,
      model: product.model,
      name: product.name?.en || 'N/A',
      category: product.category || 'unknown',
      status: 'valid'
    });
    
    console.log('  ✅ Validation passed');
    validCount++;
    
  } catch (error) {
    console.error(`  ❌ Validation failed: ${error.message}`);
    
    validationResults.push({
      id: productId,
      status: 'error',
      error: error.message
    });
    
    errorCount++;
  }
}

// 验证索引文件
console.log('\\n🔍 Validating index file...');
const indexFile = path.join(COMPILED_DIR, 'index.json');

if (!fs.existsSync(indexFile)) {
  console.error('❌ Missing index.json file');
  errorCount++;
} else {
  try {
    const indexData = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
    
    if (!indexData.products || !Array.isArray(indexData.products)) {
      throw new Error('Invalid index structure');
    }
    
    if (indexData.products.length !== files.length) {
      console.log(`⚠️  Index count mismatch: index=${indexData.products.length}, files=${files.length}`);
    }
    
    console.log(`✅ Index valid: ${indexData.products.length} products`);
    
  } catch (error) {
    console.error(`❌ Index validation failed: ${error.message}`);
    errorCount++;
  }
}

// 生成验证报告
console.log('\\n📊 Validation Summary');
console.log('======================');
console.log(`✅ Valid products: ${validCount}`);
console.log(`❌ Invalid products: ${errorCount}`);

if (validCount > 0) {
  console.log('\\n📋 Valid Products:');
  validationResults
    .filter(r => r.status === 'valid')
    .forEach(r => {
      console.log(`  - ${r.id} (${r.model}) - ${r.name} [${r.category}]`);
    });
}

if (errorCount > 0) {
  console.log('\\n❌ Products with Errors:');
  validationResults
    .filter(r => r.status === 'error')
    .forEach(r => {
      console.log(`  - ${r.id}: ${r.error}`);
    });
  
  console.log('\\n⚠️  Please fix the errors above before deployment.');
  process.exit(1);
} else {
  console.log('\\n🎉 All validations passed!');
  process.exit(0);
}
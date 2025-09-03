#!/usr/bin/env node

/**
 * SecureVision AI - Product Data Builder
 * 将 JSON5 源文件编译为标准 JSON，包含 Schema 验证和索引生成
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import JSON5 from 'json5';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'products/data/products');
const OUT_DIR = path.join(ROOT, 'products/data/compiled');
const SCHEMA_FILE = path.join(ROOT, 'products/data/products.schema.json');

// 初始化 JSON Schema 验证器
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);

console.log('🔧 SecureVision AI Product Builder');
console.log('=====================================');

// 读取和编译 Schema
let schema, validate;
try {
  schema = JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf8'));
  validate = ajv.compile(schema);
  console.log('✅ Schema loaded and compiled');
} catch (error) {
  console.error('❌ Failed to load schema:', error.message);
  process.exit(1);
}

// 确保输出目录存在
fs.mkdirSync(OUT_DIR, { recursive: true });

// 查找所有 JSON5 源文件
const files = await glob('*.json5', { cwd: SRC_DIR });
console.log(`📁 Found ${files.length} JSON5 source files`);

if (files.length === 0) {
  console.log('⚠️  No JSON5 files found in', SRC_DIR);
  process.exit(0);
}

const index = [];
let successCount = 0;
let errorCount = 0;

for (const file of files) {
  const src = path.join(SRC_DIR, file);
  const productId = path.basename(file, '.json5');
  
  console.log(`\\n🔍 Processing: ${file}`);
  
  // 读取和解析 JSON5 文件
  let data;
  try {
    const raw = fs.readFileSync(src, 'utf8');
    data = JSON5.parse(raw);
    console.log('  ✅ JSON5 parsing successful');
  } catch (error) {
    console.error(`  ❌ JSON5 parsing failed: ${error.message}`);
    errorCount++;
    continue;
  }

  // Schema 验证
  const isValid = validate(data);
  if (!isValid) {
    console.error(`  ❌ Schema validation failed:`);
    for (const err of validate.errors) {
      console.error(`     - ${err.instancePath || 'root'}: ${err.message}`);
      if (err.allowedValues) {
        console.error(`       Allowed values: ${err.allowedValues.join(', ')}`);
      }
    }
    errorCount++;
    continue;
  }
  console.log('  ✅ Schema validation passed');

  // 提取产品基础信息
  const product = data.product;
  if (!product) {
    console.error('  ❌ Missing product object');
    errorCount++;
    continue;
  }

  // 生成编译后的 JSON 文件
  const outputId = product.id || productId;
  const outputFile = path.join(OUT_DIR, `${outputId}.json`);
  
  try {
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8');
    console.log(`  ✅ Generated: compiled/${outputId}.json`);
  } catch (error) {
    console.error(`  ❌ Failed to write output file: ${error.message}`);
    errorCount++;
    continue;
  }

  // 添加到索引
  index.push({
    id: outputId,
    model: product.model || outputId.toUpperCase(),
    name: product.name?.en || product.model || outputId,
    name_fr: product.name?.fr || '',
    category: product.category || 'unknown',
    main_image: product.images?.main || '',
    href_en: `/products/detail/${outputId}.html`,
    href_fr: `/fr/products/detail/${outputId}.html`,
    availability: product.availability?.status || 'unknown'
  });

  successCount++;
}

// 生成产品索引文件
try {
  const indexData = {
    generated: new Date().toISOString(),
    total: successCount,
    products: index.sort((a, b) => a.model.localeCompare(b.model))
  };
  
  const indexFile = path.join(OUT_DIR, 'index.json');
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), 'utf8');
  console.log(`\\n📄 Generated product index: compiled/index.json`);
  console.log(`   - ${successCount} products indexed`);
} catch (error) {
  console.error(`\\n❌ Failed to generate index: ${error.message}`);
  errorCount++;
}

// 生成摘要报告
console.log('\\n📊 Build Summary');
console.log('==================');
console.log(`✅ Successful: ${successCount}`);
console.log(`❌ Failed: ${errorCount}`);
console.log(`📁 Output: ${path.relative(ROOT, OUT_DIR)}/`);

if (errorCount > 0) {
  console.log('\\n⚠️  Some products failed to build. Please fix the errors above and rerun.');
  process.exit(1);
} else {
  console.log('\\n🎉 All products built successfully!');
  process.exit(0);
}
#!/usr/bin/env node

/**
 * 静态资源复制脚本
 * 将项目根目录的静态文件复制到public/目录
 */

import fs from 'fs';
import path from 'path';

// 需要复制的静态资源目录和文件
const STATIC_ASSETS = [
  'css',
  'js', 
  'images',
  'config',
  'data',
  'i18n',
  'index.html',
  'about.html',
  'contact.html',
  'customer-care.html',
  'products',
  'fr',
  'api',
  'sitemap.xml',
  'robots.txt',
  '404.html'
];

// 工具函数：递归复制目录或文件
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠️  跳过不存在的路径: ${src}`);
    return;
  }

  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    // 创建目标目录
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    // 递归复制目录内容
    const items = fs.readdirSync(src);
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      copyRecursive(srcPath, destPath);
    }
    console.log(`📁 复制目录: ${src} → ${dest}`);
  } else {
    // 确保目标目录存在
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // 复制文件
    fs.copyFileSync(src, dest);
    console.log(`📄 复制文件: ${src} → ${dest}`);
  }
}

console.log('🚀 开始复制静态资源到public/目录...\n');

// 确保public目录存在
if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

// 复制所有静态资源
for (const asset of STATIC_ASSETS) {
  const srcPath = asset;
  const destPath = path.join('public', asset);
  
  copyRecursive(srcPath, destPath);
}

console.log('\n✅ 静态资源复制完成！');
console.log('📊 输出目录: public/');
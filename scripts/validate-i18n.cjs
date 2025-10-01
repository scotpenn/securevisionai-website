#!/usr/bin/env node

/**
 * SecureVision AI - I18n Validation Script
 * Validates translation completeness and consistency across the website
 */

const fs = require('fs');
const path = require('path');

const SUPPORTED_LANGUAGES = ['en', 'fr'];
const I18N_DIR = path.join(__dirname, '../i18n');
const HTML_DIR = path.join(__dirname, '..');

// Validation results
const results = {
  errors: [],
  warnings: [],
  info: []
};

/**
 * Load translation files
 */
function loadTranslations() {
  const translations = {};
  
  for (const lang of SUPPORTED_LANGUAGES) {
    const filePath = path.join(I18N_DIR, `site.${lang}.json`);
    
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        translations[lang] = JSON.parse(content);
        results.info.push(`✓ Loaded translations for ${lang}`);
      } else {
        results.errors.push(`✗ Missing translation file: ${filePath}`);
      }
    } catch (error) {
      results.errors.push(`✗ Invalid JSON in ${filePath}: ${error.message}`);
    }
  }
  
  return translations;
}

/**
 * Get all translation keys from an object (nested)
 */
function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Validate translation completeness
 */
function validateTranslationCompleteness(translations) {
  const [primaryLang, ...otherLangs] = SUPPORTED_LANGUAGES;
  
  if (!translations[primaryLang]) {
    results.errors.push(`✗ Primary language ${primaryLang} is missing`);
    return;
  }
  
  const primaryKeys = getAllKeys(translations[primaryLang]);
  results.info.push(`📊 Primary language (${primaryLang}) has ${primaryKeys.length} keys`);
  
  // Check each secondary language
  for (const lang of otherLangs) {
    if (!translations[lang]) {
      results.errors.push(`✗ Language ${lang} is missing`);
      continue;
    }
    
    const langKeys = getAllKeys(translations[lang]);
    const missingKeys = primaryKeys.filter(key => !langKeys.includes(key));
    const extraKeys = langKeys.filter(key => !primaryKeys.includes(key));
    
    results.info.push(`📊 Language ${lang} has ${langKeys.length} keys`);
    
    if (missingKeys.length > 0) {
      results.warnings.push(`⚠ Language ${lang} is missing ${missingKeys.length} keys: ${missingKeys.slice(0, 5).join(', ')}${missingKeys.length > 5 ? '...' : ''}`);
    }
    
    if (extraKeys.length > 0) {
      results.warnings.push(`⚠ Language ${lang} has ${extraKeys.length} extra keys: ${extraKeys.slice(0, 5).join(', ')}${extraKeys.length > 5 ? '...' : ''}`);
    }
  }
}

/**
 * Find HTML files with data-i18n attributes
 */
function findI18nUsage() {
  const htmlFiles = [];
  const usedKeys = new Set();
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (item.endsWith('.html')) {
        htmlFiles.push(fullPath);
        
        // Extract data-i18n keys from this file
        const content = fs.readFileSync(fullPath, 'utf-8');
        const matches = content.match(/data-i18n=["']([^"']+)["']/g);
        
        if (matches) {
          matches.forEach(match => {
            const key = match.match(/data-i18n=["']([^"']+)["']/)[1];
            usedKeys.add(key);
          });
        }
      }
    }
  }
  
  scanDirectory(HTML_DIR);
  
  results.info.push(`📄 Found ${htmlFiles.length} HTML files`);
  results.info.push(`🏷️  Found ${usedKeys.size} data-i18n attributes`);
  
  return { htmlFiles, usedKeys: Array.from(usedKeys) };
}

/**
 * Validate navigation configuration
 */
function validateNavigationConfig() {
  const navPath = path.join(__dirname, '../config/navigation.json');
  
  try {
    if (!fs.existsSync(navPath)) {
      results.errors.push(`✗ Missing navigation config: ${navPath}`);
      return;
    }
    
    const navConfig = JSON.parse(fs.readFileSync(navPath, 'utf-8'));
    
    if (!navConfig.navigation || !navConfig.navigation.main) {
      results.errors.push(`✗ Invalid navigation structure`);
      return;
    }
    
    const supportedInNav = Object.keys(navConfig.navigation.main);
    results.info.push(`🧭 Navigation supports languages: ${supportedInNav.join(', ')}`);
    
    // Check if all supported languages have navigation
    for (const lang of SUPPORTED_LANGUAGES) {
      if (!supportedInNav.includes(lang)) {
        results.warnings.push(`⚠ Navigation missing for language: ${lang}`);
      }
    }
    
    // Check navigation consistency
    const enNav = navConfig.navigation.main.en;
    if (enNav) {
      for (const lang of supportedInNav.filter(l => l !== 'en')) {
        const langNav = navConfig.navigation.main[lang];
        if (!langNav) continue;
        
        if (enNav.length !== langNav.length) {
          results.warnings.push(`⚠ Navigation item count mismatch: EN has ${enNav.length}, ${lang} has ${langNav.length}`);
        }
        
        // Check menu structure
        const enProducts = enNav.find(item => item.id === 'products');
        const langProducts = langNav.find(item => item.id === 'products');
        
        if (enProducts && langProducts) {
          if (enProducts.items.length !== langProducts.items.length) {
            results.warnings.push(`⚠ Products menu length mismatch: EN has ${enProducts.items.length}, ${lang} has ${langProducts.items.length}`);
          }
        }
      }
    }
    
  } catch (error) {
    results.errors.push(`✗ Navigation config error: ${error.message}`);
  }
}

/**
 * Validate hreflang links in HTML files
 */
function validateHreflangLinks(htmlFiles) {
  let hreflangFound = 0;
  
  for (const file of htmlFiles.slice(0, 5)) { // Check first 5 files
    const content = fs.readFileSync(file, 'utf-8');
    const hreflangMatches = content.match(/rel=["']alternate["'][^>]*hreflang=["']([^"']+)["']/g);
    
    if (hreflangMatches) {
      hreflangFound++;
      const langs = hreflangMatches.map(match => 
        match.match(/hreflang=["']([^"']+)["']/)[1]
      );
      
      // Check for x-default
      if (!langs.includes('x-default')) {
        results.warnings.push(`⚠ Missing x-default hreflang in ${path.basename(file)}`);
      }
    }
  }
  
  results.info.push(`🌍 Found hreflang links in ${hreflangFound}/${Math.min(htmlFiles.length, 5)} checked files`);
  
  if (hreflangFound === 0) {
    results.warnings.push(`⚠ No hreflang links found - add SEO language links`);
  }
}

/**
 * Generate report
 */
function generateReport() {
  console.log('\n=== SecureVision AI - I18n Validation Report ===\n');
  
  if (results.info.length > 0) {
    console.log('📈 Information:');
    results.info.forEach(msg => console.log(`  ${msg}`));
    console.log('');
  }
  
  if (results.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    results.warnings.forEach(msg => console.log(`  ${msg}`));
    console.log('');
  }
  
  if (results.errors.length > 0) {
    console.log('❌ Errors:');
    results.errors.forEach(msg => console.log(`  ${msg}`));
    console.log('');
  }
  
  // Summary
  const totalIssues = results.errors.length + results.warnings.length;
  if (totalIssues === 0) {
    console.log('✅ All i18n validations passed!');
  } else {
    console.log(`📊 Summary: ${results.errors.length} errors, ${results.warnings.length} warnings`);
  }
  
  console.log('\n=== End Report ===\n');
  
  // Exit with appropriate code
  process.exit(results.errors.length > 0 ? 1 : 0);
}

/**
 * Main validation function
 */
function main() {
  console.log('🔍 Starting I18n Validation...\n');
  
  // Load and validate translations
  const translations = loadTranslations();
  validateTranslationCompleteness(translations);
  
  // Check HTML usage
  const { htmlFiles, usedKeys } = findI18nUsage();
  
  // Validate navigation
  validateNavigationConfig();
  
  // Check hreflang
  validateHreflangLinks(htmlFiles);
  
  // Generate report
  generateReport();
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  loadTranslations,
  validateTranslationCompleteness,
  findI18nUsage,
  validateNavigationConfig,
  main
};
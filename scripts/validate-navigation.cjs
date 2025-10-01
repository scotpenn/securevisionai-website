#!/usr/bin/env node

/**
 * Navigation Configuration Validator
 * Validates navigation.json against schema and checks for consistency
 */

const fs = require('fs');
const path = require('path');

// Simple JSON schema validator (basic implementation)
function validateSchema(data, schema) {
  const errors = [];
  
  // Check required properties
  if (schema.required) {
    for (const prop of schema.required) {
      if (!(prop in data)) {
        errors.push(`Missing required property: ${prop}`);
      }
    }
  }
  
  // Check navigation structure
  if (data.navigation && data.navigation.main) {
    for (const [lang, items] of Object.entries(data.navigation.main)) {
      if (!Array.isArray(items)) {
        errors.push(`navigation.main.${lang} must be an array`);
        continue;
      }
      
      items.forEach((item, index) => {
        if (!item.id || !item.label || !item.href || !item.type) {
          errors.push(`navigation.main.${lang}[${index}] missing required properties`);
        }
        
        if (item.href && !item.href.startsWith('/')) {
          errors.push(`navigation.main.${lang}[${index}].href must start with /`);
        }
        
        if (item.type === 'dropdown' && (!item.items || !Array.isArray(item.items))) {
          errors.push(`navigation.main.${lang}[${index}] type 'dropdown' requires items array`);
        }
        
        if (item.items) {
          item.items.forEach((dropdownItem, dropdownIndex) => {
            if (!dropdownItem.label || !dropdownItem.href || !dropdownItem.category) {
              errors.push(`navigation.main.${lang}[${index}].items[${dropdownIndex}] missing required properties`);
            }
            
            if (dropdownItem.href && !dropdownItem.href.startsWith('/')) {
              errors.push(`navigation.main.${lang}[${index}].items[${dropdownIndex}].href must start with /`);
            }
          });
        }
      });
    }
  }
  
  return errors;
}

// Check if navigation.json exists and is valid
function validateNavigationConfig() {
  const configPath = path.join(__dirname, '../config/navigation.json');
  const schemaPath = path.join(__dirname, '../config/navigation.schema.json');
  
  console.log('🔍 Validating navigation configuration...');
  
  // Check if config file exists
  if (!fs.existsSync(configPath)) {
    console.error('❌ Error: navigation.json not found at', configPath);
    return false;
  }
  
  // Read and parse config
  let navigationConfig;
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    navigationConfig = JSON.parse(configContent);
  } catch (error) {
    console.error('❌ Error: Invalid JSON in navigation.json');
    console.error(error.message);
    return false;
  }
  
  // Read schema if available
  let schema = null;
  if (fs.existsSync(schemaPath)) {
    try {
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      schema = JSON.parse(schemaContent);
    } catch (error) {
      console.warn('⚠️  Warning: Could not parse navigation.schema.json');
    }
  }
  
  // Validate against schema
  if (schema) {
    const errors = validateSchema(navigationConfig, schema);
    if (errors.length > 0) {
      console.error('❌ Schema validation errors:');
      errors.forEach(error => console.error(`   - ${error}`));
      return false;
    }
  }
  
  // Check for consistency
  console.log('✅ JSON structure valid');
  
  // Check language consistency
  if (navigationConfig.navigation && navigationConfig.navigation.main) {
    const languages = Object.keys(navigationConfig.navigation.main);
    console.log(`📋 Found languages: ${languages.join(', ')}`);
    
    // Check if all languages have same structure
    if (languages.length > 1) {
      const baseItems = navigationConfig.navigation.main[languages[0]];
      for (let i = 1; i < languages.length; i++) {
        const currentItems = navigationConfig.navigation.main[languages[i]];
        if (baseItems.length !== currentItems.length) {
          console.warn(`⚠️  Warning: Language '${languages[i]}' has different number of items`);
        }
      }
    }
    
    // List all products dropdown items
    languages.forEach(lang => {
      const items = navigationConfig.navigation.main[lang];
      const productsItem = items.find(item => item.id === 'products');
      if (productsItem && productsItem.items) {
        console.log(`📂 ${lang.toUpperCase()} Products menu (${productsItem.items.length} items):`);
        productsItem.items.forEach(item => {
          console.log(`   - ${item.label} → ${item.href}`);
        });
      }
    });
  }
  
  console.log('✅ Navigation configuration is valid!');
  return true;
}

// Check HTML files for proper navigation structure
function validateHTMLFiles() {
  const htmlFiles = [
    'index.html',
    'about.html', 
    'contact.html',
    'customer-care.html',
    'products/all.html'
  ];
  
  console.log('\n🔍 Validating HTML navigation structure...');
  
  let allValid = true;
  
  htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Warning: ${file} not found`);
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for data-menu="products" attribute
    if (content.includes('data-menu="products"')) {
      console.log(`✅ ${file} - Uses dynamic navigation structure`);
    } else if (content.includes('Products') && content.includes('nav-dropdown')) {
      console.warn(`⚠️  ${file} - Has Products dropdown but missing data-menu attribute`);
      allValid = false;
    } else {
      console.log(`ℹ️  ${file} - No Products dropdown (may be intentional)`);
    }
    
    // Check for common.js reference
    if (content.includes('common.js')) {
      console.log(`✅ ${file} - Includes common.js`);
    } else {
      console.warn(`⚠️  ${file} - Missing common.js reference`);
      allValid = false;
    }
  });
  
  return allValid;
}

// Main validation function
function main() {
  console.log('🚀 SecureVision AI Navigation Validator\n');
  
  const configValid = validateNavigationConfig();
  const htmlValid = validateHTMLFiles();
  
  if (configValid && htmlValid) {
    console.log('\n🎉 All validations passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Some validations failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateNavigationConfig,
  validateHTMLFiles
};
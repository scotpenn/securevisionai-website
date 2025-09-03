/**
 * SecureVision AI - Product Detail Page (New Architecture)
 * 使用编译后的 JSON 文件，提供友好的错误处理和双语支持
 */

(function() {
  'use strict';

  // ============ Utility Functions ============
  function detectLang() { 
    return location.pathname.startsWith('/fr/') ? 'fr' : 'en'; 
  }
  
  function pick(obj, lang) { 
    if (!obj) return '';
    return obj[lang] ?? obj.en ?? ''; 
  }

  function getProductId() {
    // 从URL提取产品ID: /products/detail/svc138.html => svc138
    const match = location.pathname.match(/\/detail\/([a-z0-9-]+)\.html$/i);
    return match ? match[1] : null;
  }

  function friendlyError(msg, detail) {
    // 查找或创建错误显示容器
    let errorBox = document.querySelector('#product-error');
    if (!errorBox) {
      errorBox = document.createElement('div');
      errorBox.id = 'product-error';
      
      // 查找主容器并插入错误信息
      const mainContainer = document.querySelector('.main-container') || document.body;
      mainContainer.appendChild(errorBox);
    }
    
    // 设置错误显示样式
    errorBox.style.cssText = `
      max-width: 960px;
      margin: 2rem auto;
      padding: 1.5rem;
      border: 1px solid #ffebee;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, sans-serif);
    `;
    
    errorBox.innerHTML = \`
      <h3 style="color: #d32f2f; margin: 0 0 0.75rem 0; font-size: 1.25rem;">
        ⚠️ Failed to load product information
      </h3>
      <p style="margin: 0 0 1rem 0; color: #666; line-height: 1.5;">
        \${msg}
      </p>
      \${detail ? \`
        <details style="margin: 0 0 1rem 0;">
          <summary style="cursor: pointer; color: #1976d2; font-weight: 500;">
            Show technical details
          </summary>
          <pre style="
            margin: 0.5rem 0 0 0; 
            padding: 0.75rem; 
            background: #f5f5f5; 
            border-radius: 4px; 
            white-space: pre-wrap; 
            font-size: 0.875rem; 
            overflow-x: auto;
          ">\${detail}</pre>
        </details>
      \` : ''}
      <div style="display: flex; gap: 1rem; margin-top: 1rem;">
        <a class="btn btn-primary" href="/products/all.html" style="
          display: inline-block;
          padding: 0.5rem 1rem;
          background: var(--color-secure-blue, #4B70F5);
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
        ">← Back to Products</a>
        <button onclick="location.reload()" style="
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        ">🔄 Retry</button>
      </div>
    \`;
    
    // 隐藏页面其他内容
    const heroSection = document.querySelector('.product-hero');
    const detailsSection = document.querySelector('.product-details');
    if (heroSection) heroSection.style.display = 'none';
    if (detailsSection) detailsSection.style.display = 'none';
  }

  // ============ Data Loading ============
  async function loadProduct() {
    const id = getProductId();
    if (!id) {
      throw new Error('Product ID not found in URL path');
    }
    
    const url = \`/products/data/compiled/\${id}.json\`;
    console.log(\`Loading product data: \${url}\`);
    
    try {
      const response = await fetch(url, { 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(\`Product "\${id}" not found. The product may not exist or hasn't been built yet.\`);
        }
        throw new Error(\`HTTP \${response.status} \${response.statusText}\`);
      }
      
      const data = await response.json();
      
      if (!data.product) {
        throw new Error('Invalid product data structure - missing "product" object');
      }
      
      console.log('✅ Product data loaded successfully:', data.product.model);
      return data.product;
      
    } catch (error) {
      console.error('❌ Failed to load product:', error);
      throw error;
    }
  }

  // ============ Rendering Functions ============
  function renderProductHeader(product) {
    const lang = detectLang();
    
    // 产品标题
    const titleEl = document.querySelector('[data-product="title"]');
    if (titleEl) titleEl.textContent = pick(product.name, lang);
    
    // 产品型号
    const modelEls = document.querySelectorAll('[data-product="model"]');
    modelEls.forEach(el => el.textContent = product.model || '');
    
    // 产品描述
    const descEl = document.querySelector('[data-product="description"]');
    if (descEl) descEl.textContent = pick(product.description, lang);
    
    // 库存状态
    const statusEl = document.querySelector('[data-product="status"]');
    if (statusEl && product.availability) {
      const statusMsg = pick(product.availability.message, lang);
      const statusClass = product.availability.status === 'in_stock' ? 'in-stock' : 'out-of-stock';
      statusEl.innerHTML = \`
        <span class="availability-status \${statusClass}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
          \${statusMsg}
        </span>
      \`;
    }
  }

  function renderProductGallery(product) {
    // 主图片
    const mainImageEl = document.querySelector('[data-product="main-image"]');
    if (mainImageEl && product.images?.main) {
      mainImageEl.src = product.images.main;
      mainImageEl.alt = pick(product.name, detectLang());
    }
    
    // 缩略图画廊
    const thumbsContainer = document.querySelector('[data-product="thumbnails"]');
    if (thumbsContainer && product.images?.gallery) {
      thumbsContainer.innerHTML = '';
      
      product.images.gallery.forEach((imgSrc, index) => {
        const thumb = document.createElement('button');
        thumb.className = 'gallery-thumb' + (index === 0 ? ' active' : '');
        thumb.innerHTML = \`<img src="\${imgSrc}" alt="View \${index + 1}" />\`;
        thumb.onclick = () => {
          if (mainImageEl) mainImageEl.src = imgSrc;
          thumbsContainer.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        };
        thumbsContainer.appendChild(thumb);
      });
    }
  }

  function renderProductHighlights(product) {
    const lang = detectLang();
    const highlightsEl = document.querySelector('[data-product="highlights"]');
    
    if (highlightsEl && product.highlights) {
      const highlights = pick(product.highlights, lang);
      if (Array.isArray(highlights)) {
        highlightsEl.innerHTML = highlights
          .map(text => \`<li>\${text}</li>\`)
          .join('');
      }
    }
  }

  function renderProductSpecs(product) {
    const lang = detectLang();
    const specsContainer = document.querySelector('[data-product="specifications"]');
    
    if (specsContainer && product.specifications) {
      specsContainer.innerHTML = '';
      
      Object.entries(product.specifications).forEach(([groupKey, groupData]) => {
        const groupName = pick(groupData.group_name, lang);
        const specs = pick(groupData.specs, lang);
        
        if (specs && typeof specs === 'object') {
          const section = document.createElement('section');
          section.className = 'spec-group';
          
          const rows = Object.entries(specs)
            .map(([key, value]) => \`
              <tr>
                <th>\${key}</th>
                <td>\${value}</td>
              </tr>
            \`)
            .join('');
          
          section.innerHTML = \`
            <h4 class="spec-group-title">\${groupName}</h4>
            <table class="spec-table">
              <tbody>\${rows}</tbody>
            </table>
          \`;
          
          specsContainer.appendChild(section);
        }
      });
    }
  }

  function renderProductDownloads(product) {
    const lang = detectLang();
    const downloadsContainer = document.querySelector('[data-product="downloads"]');
    
    if (downloadsContainer && product.downloads) {
      const downloads = pick(product.downloads, lang);
      if (Array.isArray(downloads)) {
        downloadsContainer.innerHTML = downloads
          .map(download => \`
            <div class="download-item">
              <div class="download-info">
                <h4>\${download.name}</h4>
                <p class="download-meta">\${download.type} • \${download.size}</p>
                \${download.description ? \`<p class="download-desc">\${download.description}</p>\` : ''}
              </div>
              <a href="\${download.url}" class="btn btn-secondary download-btn" download>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Download
              </a>
            </div>
          \`)
          .join('');
      }
    }
  }

  function renderProductWarranty(product) {
    const lang = detectLang();
    const warrantyContainer = document.querySelector('[data-product="warranty"]');
    
    if (warrantyContainer && product.warranty) {
      const warrantyText = pick(product.warranty, lang);
      if (warrantyText) {
        warrantyContainer.innerHTML = \`
          <div class="warranty-content">
            <h4>Warranty Information</h4>
            <p>\${warrantyText}</p>
          </div>
        \`;
      }
    }
  }

  // ============ Tab System ============
  function initializeTabs() {
    const tabButtons = document.querySelectorAll('[data-product-tab]');
    const tabContents = document.querySelectorAll('[data-tab-content]');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.dataset.productTab;
        
        // 更新按钮状态
        tabButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        
        // 更新内容显示
        tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.dataset.tabContent === tabName) {
            content.classList.add('active');
          }
        });
      });
    });
  }

  // ============ Main Render Function ============
  function renderProduct(product) {
    try {
      renderProductHeader(product);
      renderProductGallery(product);
      renderProductHighlights(product);
      renderProductSpecs(product);
      renderProductDownloads(product);
      renderProductWarranty(product);
      
      // 初始化交互功能
      initializeTabs();
      
      console.log('✅ Product rendering completed');
      
    } catch (error) {
      console.error('❌ Error during product rendering:', error);
      friendlyError('Failed to display product information', error.message);
    }
  }

  // ============ Page Initialization ============
  document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Product detail page initializing...');
    
    try {
      const product = await loadProduct();
      if (product) {
        renderProduct(product);
      }
    } catch (error) {
      friendlyError(
        \`Unable to load product data: \${error.message}\`,
        \`URL: \${location.pathname}\\nError: \${error.stack || error.message}\`
      );
    }
  });

})();
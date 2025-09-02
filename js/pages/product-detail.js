/* ================================================
   SecureVision AI - Product Detail Page JavaScript
   产品详情页专属：双语支持、数据渲染、SEO优化
   ================================================ */

(function() {
  'use strict';

  // ============ State Management ============
  let productData = null;
  let currentLang = 'en';

  // ============ Initialization ============
  async function initProductDetail() {
    try {
      // 获取当前语言
      currentLang = window.SecureVisionCommon?.I18n?.currentLang || 'en';
      console.log(`Product detail page initializing for language: ${currentLang}`);

      // 从URL或页面元数据获取产品ID
      const productId = getProductIdFromUrl();
      if (!productId) {
        showError('Product ID not found');
        return;
      }

      // 加载产品数据
      await loadProductData(productId);
      
      // 渲染页面内容
      renderProductDetail();
      
      // 初始化交互功能
      initializeInteractions();
      
      console.log('Product detail page initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize product detail:', error);
      showError('Failed to load product information');
    }
  }

  // ============ Data Loading ============
  async function loadProductData(productId) {
    try {
      // 使用JSON5Parser加载产品数据
      productData = await JSON5Parser.loadProduct(productId);
      
      if (!productData || !productData.product) {
        throw new Error(`Product ${productId} not found`);
      }
      
      console.log('Product data loaded:', productData.product);
      return productData.product;
      
    } catch (error) {
      console.error(`Error loading product ${productId}:`, error);
      throw error;
    }
  }

  // ============ Content Rendering ============
  function renderProductDetail() {
    const product = productData.product;
    
    // 渲染基础信息
    renderProductHeader(product);
    renderProductGallery(product);
    renderProductSpecs(product);
    renderProductDownloads(product);
    renderProductWarranty(product);
    
    // 更新页面SEO信息
    updatePageSEO(product);
  }

  function renderProductHeader(product) {
    // 产品名称
    const titleElement = document.querySelector('[data-product="title"]');
    if (titleElement) {
      titleElement.textContent = product.name[currentLang] || product.name.en;
    }

    // 产品型号
    const modelElement = document.querySelector('[data-product="model"]');
    if (modelElement) {
      modelElement.textContent = product.model;
    }

    // 产品描述
    const descElement = document.querySelector('[data-product="description"]');
    if (descElement) {
      descElement.textContent = product.description[currentLang] || product.description.en;
    }

    // 产品亮点
    const highlightsElement = document.querySelector('[data-product="highlights"]');
    if (highlightsElement && product.highlights) {
      const highlights = product.highlights[currentLang] || product.highlights.en;
      highlightsElement.innerHTML = highlights
        .map(highlight => `<li class="product-highlight">${highlight}</li>`)
        .join('');
    }

    // 可用性状态
    const statusElement = document.querySelector('[data-product="status"]');
    if (statusElement && product.availability) {
      statusElement.innerHTML = `
        <span class="status-indicator status-${product.availability.status}"></span>
        ${product.availability.message[currentLang] || product.availability.message.en}
      `;
    }
  }

  function renderProductGallery(product) {
    const galleryElement = document.querySelector('[data-product="gallery"]');
    if (!galleryElement || !product.images) return;

    // 主图加载，带错误处理
    const mainImage = document.querySelector('[data-product="main-image"]');
    if (mainImage && product.images.main) {
      loadImageWithFallback(mainImage, product.images.main, '/images/placeholder-product.jpg');
      mainImage.alt = `${product.name[currentLang] || product.name.en} - Main View`;
    }

    // 图片画廊，带自动图片检测和错误处理
    if (product.images.gallery && product.images.gallery.length > 1) {
      const thumbnailsContainer = document.querySelector('[data-product="thumbnails"]');
      if (thumbnailsContainer) {
        // 异步验证所有图片，只显示存在的图片
        validateAndRenderGallery(product, thumbnailsContainer);
      }
    }
  }

  // ============ 图片处理辅助函数 ============
  
  /**
   * 异步验证图片存在性并渲染画廊
   * @param {Object} product - 产品对象
   * @param {HTMLElement} container - 缩略图容器
   */
  async function validateAndRenderGallery(product, container) {
    const validImages = [];
    
    // 并行检查所有图片是否存在
    const imageChecks = product.images.gallery.map(async (imagePath, index) => {
      const exists = await checkImageExists(imagePath);
      if (exists) {
        return { path: imagePath, index };
      }
      // 如果原图不存在，尝试自动生成可能的图片路径
      const alternatives = generateImageAlternatives(product.id || product.model.toLowerCase(), index);
      for (const altPath of alternatives) {
        const altExists = await checkImageExists(altPath);
        if (altExists) {
          return { path: altPath, index };
        }
      }
      return null;
    });
    
    const results = await Promise.all(imageChecks);
    const validImageData = results.filter(result => result !== null);
    
    if (validImageData.length > 0) {
      // 渲染存在的图片
      container.innerHTML = validImageData
        .map(({ path, index }) => `
          <img src="${path}" 
               alt="${product.name[currentLang] || product.name.en} - View ${index + 1}" 
               class="thumbnail-image ${index === 0 ? 'active' : ''}"
               data-gallery-index="${index}"
               onerror="this.style.display='none'">
        `).join('');
    } else {
      // 如果没有找到任何图片，隐藏画廊容器
      container.style.display = 'none';
    }
  }

  /**
   * 根据产品ID生成可能的图片路径替代方案
   * @param {string} productId - 产品ID
   * @param {number} index - 图片索引
   * @returns {string[]} 可能的图片路径数组
   */
  function generateImageAlternatives(productId, index) {
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    const suffixes = ['main', 'side', 'back', 'mounted', 'night', 'app', 'battery', 'package', 'front', 'detail'];
    const alternatives = [];
    
    // 生成基于产品ID和常用后缀的路径
    extensions.forEach(ext => {
      // 主图
      if (index === 0) {
        alternatives.push(`/images/${productId}-main.${ext}`);
        alternatives.push(`/images/${productId}.${ext}`);
      }
      
      // 其他视图
      if (index < suffixes.length) {
        alternatives.push(`/images/${productId}-${suffixes[index]}.${ext}`);
      }
      
      // 通用编号
      alternatives.push(`/images/${productId}-${index + 1}.${ext}`);
      alternatives.push(`/images/${productId}_${index + 1}.${ext}`);
    });
    
    return alternatives;
  }

  /**
   * 检查图片是否存在
   * @param {string} imagePath - 图片路径
   * @returns {Promise<boolean>} 图片是否存在
   */
  function checkImageExists(imagePath) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imagePath;
    });
  }

  /**
   * 加载图片，失败时使用后备图片
   * @param {HTMLImageElement} imgElement - 图片元素
   * @param {string} primarySrc - 主要图片路径
   * @param {string} fallbackSrc - 后备图片路径
   */
  function loadImageWithFallback(imgElement, primarySrc, fallbackSrc) {
    const img = new Image();
    img.onload = () => {
      imgElement.src = primarySrc;
    };
    img.onerror = () => {
      console.warn(`Primary image failed to load: ${primarySrc}, using fallback: ${fallbackSrc}`);
      imgElement.src = fallbackSrc;
    };
    img.src = primarySrc;
  }

  function renderProductSpecs(product) {
    const specsContainer = document.querySelector('[data-product="specifications"]');
    if (!specsContainer || !product.specifications) return;

    specsContainer.innerHTML = Object.entries(product.specifications)
      .map(([groupKey, groupData]) => {
        const groupName = groupData.group_name[currentLang] || groupData.group_name.en;
        const specs = groupData.specs[currentLang] || groupData.specs.en;
        
        return `
          <div class="spec-group" data-spec-group="${groupKey}">
            <h3 class="spec-group-title">${groupName}</h3>
            <div class="spec-grid">
              ${Object.entries(specs)
                .map(([key, value]) => `
                  <div class="spec-item">
                    <span class="spec-label">${key}</span>
                    <span class="spec-value">${value}</span>
                  </div>
                `).join('')}
            </div>
          </div>
        `;
      }).join('');
  }

  function renderProductDownloads(product) {
    const downloadsContainer = document.querySelector('[data-product="downloads"]');
    if (!downloadsContainer || !product.downloads) return;

    const downloads = product.downloads[currentLang] || product.downloads.en;
    if (!downloads || downloads.length === 0) {
      downloadsContainer.style.display = 'none';
      return;
    }

    downloadsContainer.innerHTML = `
      <h3 class="downloads-title" data-i18n="products.downloadsTitle">Downloads & Documentation</h3>
      <div class="downloads-grid">
        ${downloads.map(download => `
          <div class="download-item">
            <div class="download-info">
              <h4 class="download-name">${download.name}</h4>
              <p class="download-description">${download.description}</p>
              <div class="download-meta">
                <span class="download-type">${download.type}</span>
                <span class="download-size">${download.size}</span>
              </div>
            </div>
            <a href="${download.url}" 
               class="download-button" 
               target="_blank" 
               rel="noopener noreferrer"
               data-i18n="common.download">
              Download
            </a>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderProductWarranty(product) {
    const warrantyElement = document.querySelector('[data-product="warranty"]');
    if (!warrantyElement || !product.warranty) return;

    const warrantyText = product.warranty[currentLang] || product.warranty.en;
    warrantyElement.innerHTML = `
      <h3 class="warranty-title" data-i18n="products.warrantyTitle">Warranty Information</h3>
      <div class="warranty-content">
        <p>${warrantyText}</p>
      </div>
    `;
  }

  // ============ SEO & Meta Data ============
  function updatePageSEO(product) {
    const currentProduct = product.name[currentLang] || product.name.en;
    const currentDesc = product.description[currentLang] || product.description.en;
    
    // 更新页面标题
    document.title = `${currentProduct} - SecureVision AI`;
    
    // 更新meta描述
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = currentDesc;
    }
    
    // 更新Open Graph标签
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${currentProduct} - SecureVision AI`;
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = currentDesc;
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && product.images?.main) {
      ogImage.content = new URL(product.images.main, window.location.origin).href;
    }

    // 添加结构化数据
    addProductStructuredData(product);
  }

  function addProductStructuredData(product) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name[currentLang] || product.name.en,
      "description": product.description[currentLang] || product.description.en,
      "model": product.model,
      "brand": {
        "@type": "Brand",
        "name": "SecureVision AI"
      },
      "image": product.images?.gallery || [product.images?.main],
      "availability": product.availability?.status === 'in_stock' 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock"
    };

    // 插入结构化数据
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  // ============ Interactive Features ============
  function initializeInteractions() {
    // 图片画廊切换
    initGalleryInteraction();
    
    // 规格分组展开/折叠
    initSpecsInteraction();
    
    // Tab切换
    initTabsInteraction();
  }

  function initGalleryInteraction() {
    const thumbnails = document.querySelectorAll('[data-gallery-index]');
    const mainImage = document.querySelector('[data-product="main-image"]');
    
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        // 移除所有active状态
        thumbnails.forEach(t => t.classList.remove('active'));
        
        // 添加active状态到当前缩略图
        thumbnail.classList.add('active');
        
        // 更新主图，带错误处理
        if (mainImage) {
          loadImageWithFallback(mainImage, thumbnail.src, '/images/placeholder-product.jpg');
          mainImage.alt = thumbnail.alt;
        }
      });
    });
  }

  function initSpecsInteraction() {
    const specGroups = document.querySelectorAll('[data-spec-group]');
    
    specGroups.forEach(group => {
      const title = group.querySelector('.spec-group-title');
      if (title) {
        title.addEventListener('click', () => {
          group.classList.toggle('expanded');
        });
      }
    });
  }

  function initTabsInteraction() {
    const tabs = document.querySelectorAll('[data-product-tab]');
    const contents = document.querySelectorAll('[data-tab-content]');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.productTab;
        
        // 更新tab状态
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // 更新内容显示
        contents.forEach(content => {
          if (content.dataset.tabContent === targetTab) {
            content.classList.add('active');
          } else {
            content.classList.remove('active');
          }
        });
      });
    });
  }

  // ============ Utility Functions ============
  function getProductIdFromUrl() {
    // 方法1: 从URL路径获取 (如 /products/detail/svc138.html)
    const pathParts = window.location.pathname.split('/');
    const htmlFile = pathParts[pathParts.length - 1];
    if (htmlFile && htmlFile.includes('.html')) {
      return htmlFile.replace('.html', '');
    }
    
    // 方法2: 从URL参数获取
    const params = new URLSearchParams(window.location.search);
    if (params.has('id')) {
      return params.get('id');
    }
    
    // 方法3: 从页面元数据获取
    const metaElement = document.querySelector('meta[name="product-id"]');
    if (metaElement) {
      return metaElement.content;
    }
    
    return null;
  }

  function showError(message) {
    const errorContainer = document.querySelector('[data-product="error"]');
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="error-message">
          <h2>Error</h2>
          <p>${message}</p>
          <a href="/products/all.html" class="back-to-products">Back to Products</a>
        </div>
      `;
      errorContainer.style.display = 'block';
    }
  }

  // ============ Export for Global Access ============
  window.ProductDetail = {
    init: initProductDetail,
    loadProduct: loadProductData,
    getCurrentLang: () => currentLang,
    getCurrentProduct: () => productData?.product
  };

  // ============ Auto-initialization ============
  // 等待DOM和i18n系统加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // 延迟一些时间确保i18n系统已初始化
      setTimeout(initProductDetail, 100);
    });
  } else {
    setTimeout(initProductDetail, 100);
  }

})();
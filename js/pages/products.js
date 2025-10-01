/* ================================================
   SecureVision AI - Products Page JavaScript
   产品页面专属：载入JSON、渲染分类、tabs & hash联动
   ================================================ */

(function() {
  'use strict';

  // Development-only logging
  const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.includes('dev');
  const devLog = (...args) => { if (isDev) console.log(...args); };
  const devWarn = (...args) => { if (isDev) console.warn(...args); };
  const devError = (...args) => { if (isDev) console.error(...args); };

  // ============ State Management ============
  let productsData = null;
  let currentCategory = 'all';

  // ============ DOM Elements ============
  const contentContainer = document.getElementById('products-content');
  const categoryTabs = document.querySelectorAll('.category-tab');

  // ============ Language Detection ============
  function getCurrentLanguage() {
    // 检测当前页面语言
    const htmlLang = document.documentElement.lang || 'en';
    const isInFrenchFolder = window.location.pathname.startsWith('/fr/');
    return isInFrenchFolder || htmlLang === 'fr' ? 'fr' : 'en';
  }

  // ============ Data Loading ============
  async function loadProductsData() {
    try {
      showLoadingState();
      devLog('Loading products data...');
      
      // 使用JSON5Parser加载编译后的产品索引
      const productsIndex = await JSON5Parser.loadProductsIndex();
      devLog('Products index loaded:', productsIndex);
      
      // 转换为内部数据结构
      productsData = convertIndexToInternalFormat(productsIndex);
      devLog('Converted products data:', productsData);
      devLog('Categories with products:', Object.keys(productsData.categories).map(key => ({
        category: key,
        productCount: productsData.categories[key].products.length
      })));
      
      renderAllProducts();
      setupCategoryTabs();
      handleInitialHash();
      
    } catch (error) {
      devError('Error loading products data:', error);
      showErrorState();
    }
  }

  // 转换产品索引数据为内部格式
  function convertIndexToInternalFormat(productsIndex) {
    const currentLang = getCurrentLanguage();
    
    // 按分类分组产品 - 支持双语
    const categories = {
      'indoor': { 
        id: 'indoor', 
        name: { en: 'Indoor Cameras', fr: 'Caméras Intérieures' }, 
        description: { 
          en: 'Advanced indoor security cameras for home monitoring',
          fr: 'Caméras de sécurité intérieures avancées pour surveillance domestique'
        },
        visible: true, 
        display_order: 1, 
        hero_image: '/images/category-indoor.png',
        products: [] 
      },
      'baby-pet-monitor': { 
        id: 'baby-pet-monitor', 
        name: { en: 'Baby/Pet Monitor', fr: 'Surveillance Bébé/Animaux' }, 
        description: { 
          en: 'Specialized monitoring cameras for babies and pets',
          fr: 'Caméras de surveillance spécialisées pour bébés et animaux'
        },
        visible: true, 
        display_order: 2, 
        hero_image: '/images/category-baby-pet-monitor.png',
        products: [] 
      },
      'outdoor': { 
        id: 'outdoor', 
        name: { en: 'Outdoor Cameras', fr: 'Caméras Extérieures' }, 
        description: { 
          en: 'Weather-resistant outdoor security cameras',
          fr: 'Caméras de sécurité extérieures résistantes aux intempéries'
        },
        visible: true, 
        display_order: 3, 
        hero_image: '/images/category-outdoor.png',
        products: [] 
      },
      'doorbell': { 
        id: 'doorbell', 
        name: { en: 'Doorbell Cameras', fr: 'Caméras Sonnettes' }, 
        description: { 
          en: 'Smart doorbell cameras with two-way communication',
          fr: 'Sonnettes caméras intelligentes avec communication bidirectionnelle'
        },
        visible: true, 
        display_order: 4, 
        hero_image: '/images/category-doorbell.png',
        products: [] 
      },
      'sports': { 
        id: 'sports', 
        name: { en: 'Sports Cameras', fr: 'Caméras Sport' }, 
        description: { 
          en: 'Action cameras for sports and outdoor activities',
          fr: 'Caméras d\'action pour sports et activités extérieures'
        },
        visible: true, 
        display_order: 5, 
        hero_image: '/images/category-sports.png',
        products: [] 
      },
      'secure-power': { 
        id: 'secure-power', 
        name: { en: 'Secure Power', fr: 'Alimentation Sécurisée' }, 
        description: { 
          en: 'Portable power solutions for security systems',
          fr: 'Solutions d\'alimentation portables pour systèmes de sécurité'
        },
        visible: true, 
        display_order: 6, 
        hero_image: '/images/category-secure-power.png',
        products: [] 
      }
    };
    
    // 创建产品映射，包含链接信息
    const productsMap = {};
    
    productsIndex.products.forEach(product => {
      const enhancedProduct = {
        id: product.id,
        model: product.model,
        name: { en: product.name, fr: product.name_fr },
        category: product.category,
        images: { main: product.main_image },
        href: currentLang === 'fr' ? product.href_fr : product.href_en, // 根据语言选择链接
        highlights: { en: [] }, // 可以为空，因为详情页已是静态的
        display_order: 1,
        featured: false,
        new: false,
        bestseller: false
      };
      
      productsMap[product.id] = enhancedProduct;
      
      // 添加到相应分类
      if (categories[product.category]) {
        categories[product.category].products.push({
          id: product.id,
          display_order: 1,
          featured: false,
          new: false,
          bestseller: false
        });
      }
    });
    
    return {
      categories: categories,
      productsMap: productsMap
    };
  }

  // ============ Rendering Functions ============
  function renderAllProducts() {
    devLog('renderAllProducts called');
    devLog('productsData:', productsData);
    devLog('contentContainer:', contentContainer);
    
    if (!productsData || !contentContainer) {
      devError('Missing productsData or contentContainer');
      return;
    }

    let html = '';
    
    // 根据显示顺序排序分类
    const sortedCategories = Object.values(productsData.categories)
      .filter(category => category.visible)
      .sort((a, b) => a.display_order - b.display_order);
    
    devLog('Sorted categories:', sortedCategories.map(c => ({ id: c.id, productCount: c.products.length })));
    
    sortedCategories.forEach(category => {
      const categoryHtml = renderCategorySection(category);
      devLog(`Category ${category.id} HTML length:`, categoryHtml.length);
      html += categoryHtml;
    });

    devLog('Final HTML length:', html.length);
    contentContainer.innerHTML = html;
    hideLoadingState();
  }

  function renderCategorySection(category) {
    const currentLang = getCurrentLanguage();
    
    // 获取该分类下的产品，并按显示顺序排序
    const products = category.products
      .map(productRef => productsData.productsMap[productRef.id])
      .filter(Boolean)
      .sort((a, b) => a.display_order - b.display_order);
    
    if (products.length === 0) return '';
    
    // 生成产品型号按钮列表，包含准确的URL
    const productModels = products.map(product => 
      `<a href="${product.href || `/products/detail/${product.id}.html`}" class="category-model-btn" data-model="${product.model || product.id.toUpperCase()}">${product.model || product.id.toUpperCase()}</a>`
    ).join('');
    
    return `
      <div class="category-section" id="${category.id}" data-category="${category.id}">
        <div class="category-header-bar" data-category="${category.id}">
          <div class="category-accent-block" data-category="${category.id}"></div>
          <div class="category-content-area">
            <div class="category-info">
              <div class="category-title-row">
                <h3 class="category-title">${category.name[currentLang]}</h3>
                <p class="category-description">${category.description[currentLang]}</p>
              </div>
              <div class="category-models-row">
                ${productModels}
              </div>
            </div>
          </div>
        </div>
        <div class="products-grid">
          ${products.map(product => renderProductCard(product)).join('')}
        </div>
      </div>
    `;
  }

  function renderProductCard(product) {
    const currentLang = getCurrentLanguage();
    
    // 生成产品标签 - 根据语言
    const badges = [];
    const badgeLabels = {
      en: { featured: 'Featured', new: 'New', bestseller: 'Bestseller' },
      fr: { featured: 'Vedette', new: 'Nouveau', bestseller: 'Populaire' }
    };
    
    if (product.featured) badges.push(`<span class="product-badge badge-featured">${badgeLabels[currentLang].featured}</span>`);
    if (product.new) badges.push(`<span class="product-badge badge-new">${badgeLabels[currentLang].new}</span>`);
    if (product.bestseller) badges.push(`<span class="product-badge badge-bestseller">${badgeLabels[currentLang].bestseller}</span>`);
    
    // 按钮文本根据语言
    const buttonText = currentLang === 'fr' ? 'Voir Détails' : 'View Details';
    const modelText = currentLang === 'fr' ? 'Modèle' : 'Model';
    
    return `
      <div class="product-card" data-category="${product.category}">
        <div class="product-image-wrapper">
          <img src="${product.images?.main || '/images/placeholder-product.jpg'}" 
               alt="${product.name[currentLang]}" class="product-image" loading="lazy">
          ${badges.join('')}
        </div>
        <div class="product-info">
          <h4 class="product-name">${product.name[currentLang]}</h4>
          <div class="product-model">${modelText}: ${product.model}</div>
          <ul class="product-highlights">
            ${(product.highlights?.en || []).slice(0, 3).map(highlight => `
              <li class="product-highlight">${highlight}</li>
            `).join('')}
          </ul>
          <div class="product-actions">
            <a href="${product.href || `/products/detail/${product.id}.html`}" class="product-btn">${buttonText}</a>
          </div>
        </div>
      </div>
    `;
  }

  // ============ Category Filtering ============
  function setupCategoryTabs() {
    if (!categoryTabs.length) return;

    categoryTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const category = tab.dataset.category;
        switchToCategory(category);
        updateHashUrl(category);
      });
    });
  }

  function switchToCategory(category) {
    if (!productsData) return;
    
    currentCategory = category;
    
    // Update active tab
    categoryTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === category);
    });
    
    // Filter category sections
    const sections = document.querySelectorAll('.category-section');
    sections.forEach(section => {
      const sectionCategory = section.dataset.category;
      const shouldShow = category === 'all' || sectionCategory === category;
      
      if (shouldShow) {
        section.style.display = 'block';
        section.classList.remove('filtering');
      } else {
        section.classList.add('filtering');
        setTimeout(() => {
          section.style.display = 'none';
          section.classList.remove('filtering');
        }, 300);
      }
    });

    // Track analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'category_filter', {
        'event_category': 'products',
        'event_label': category
      });
    }
  }

  // ============ URL Hash Management ============
  function handleInitialHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const validCategories = ['all', ...Object.keys(productsData.categories)];
      if (validCategories.includes(hash)) {
        switchToCategory(hash);
        return;
      }
      
      // Check if hash corresponds to a specific product or section
      const targetElement = document.getElementById(hash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      }
    }
  }

  function updateHashUrl(category) {
    if (category === 'all') {
      if (window.location.hash) {
        history.pushState(null, null, window.location.pathname);
      }
    } else {
      history.pushState(null, null, `#${category}`);
    }
  }

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    handleInitialHash();
  });

  // ============ Loading & Error States ============
  function showLoadingState() {
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="loading-products">
          <div class="loading-spinner"></div>
          Loading products...
        </div>
      `;
    }
  }

  function hideLoadingState() {
    // Loading state is replaced by content
  }

  function showErrorState() {
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="empty-state">
          <h3>Unable to load products</h3>
          <p>Please refresh the page or contact support if the problem persists.</p>
          <button class="btn btn-primary" onclick="location.reload()" style="margin-top: var(--spacing-4);">
            Retry Loading
          </button>
        </div>
      `;
    }
  }

  // ============ Search Functionality (Optional Enhancement) ============
  function initProductSearch() {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;

    const searchProducts = debounce((query) => {
      if (!productsData) return;
      
      query = query.toLowerCase().trim();
      
      if (!query) {
        // Show all products when search is cleared
        switchToCategory(currentCategory);
        return;
      }

      // Filter products based on search query
      const sections = document.querySelectorAll('.category-section');
      let hasResults = false;

      sections.forEach(section => {
        const products = section.querySelectorAll('.product-card');
        let sectionHasResults = false;

        products.forEach(product => {
          const name = product.querySelector('.product-name').textContent.toLowerCase();
          const model = product.querySelector('.product-model').textContent.toLowerCase();
          const highlights = Array.from(product.querySelectorAll('.product-highlight'))
            .map(h => h.textContent.toLowerCase()).join(' ');

          const matches = name.includes(query) || 
                         model.includes(query) || 
                         highlights.includes(query);

          if (matches) {
            product.style.display = 'block';
            sectionHasResults = true;
            hasResults = true;
          } else {
            product.style.display = 'none';
          }
        });

        section.style.display = sectionHasResults ? 'block' : 'none';
      });

      // Show no results message if needed
      if (!hasResults) {
        showNoResultsState(query);
      }
    }, 300);

    searchInput.addEventListener('input', (e) => {
      searchProducts(e.target.value);
    });
  }

  function showNoResultsState(query) {
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="empty-state">
          <h3>No products found</h3>
          <p>No products match your search for "<strong>${query}</strong>"</p>
          <button class="btn btn-secondary" onclick="document.getElementById('product-search').value = ''; window.dispatchEvent(new Event('input', { target: document.getElementById('product-search') }));" style="margin-top: var(--spacing-4);">
            Clear Search
          </button>
        </div>
      `;
    }
  }

  // ============ Performance Optimization ============
  function optimizeImages() {
    // Implement lazy loading for product images
    const images = document.querySelectorAll('.product-image[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('fade-in');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  // ============ Analytics Integration ============
  function trackProductView(productId) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'view_item', {
        'event_category': 'products',
        'event_label': productId,
        'value': 1
      });
    }
  }

  function setupProductTracking() {
    document.addEventListener('click', (e) => {
      const productBtn = e.target.closest('.product-btn');
      if (productBtn) {
        const productCard = productBtn.closest('.product-card');
        const productName = productCard?.querySelector('.product-name')?.textContent;
        if (productName) {
          trackProductView(productName);
        }
      }
    });
  }

  // ============ Initialization ============
  function init() {
    devLog('Initializing products page...');
    
    // Check if JSON5Parser is available
    if (typeof JSON5Parser === 'undefined') {
      devError('JSON5Parser not found! Make sure json5-parser.js is loaded before products.js');
      showErrorState();
      return;
    }
    
    // Load and render products
    loadProductsData();
    
    // Initialize optional features
    initProductSearch();
    setupProductTracking();
    
    // Optimize performance
    setTimeout(optimizeImages, 1000);
  }

  // ============ Public API ============
  window.ProductsPage = {
    switchToCategory: switchToCategory,
    loadProductsData: loadProductsData,
    currentCategory: () => currentCategory,
    productsData: () => productsData
  };

  // ============ DOM Ready ============
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============ Utility Functions ============
  function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

})();
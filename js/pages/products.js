/* ================================================
   SecureVision AI - Products Page JavaScript
   产品页面专属：载入JSON、渲染分类、tabs & hash联动
   ================================================ */

(function() {
  'use strict';

  // ============ State Management ============
  let productsData = null;
  let currentCategory = 'all';

  // ============ DOM Elements ============
  const contentContainer = document.getElementById('products-content');
  const categoryTabs = document.querySelectorAll('.category-tab');

  // ============ Data Loading ============
  async function loadProductsData() {
    try {
      showLoadingState();
      console.log('Loading products data...');
      
      // 使用JSON5Parser加载主配置文件
      productsData = await JSON5Parser.loadProductsMaster();
      console.log('Products data loaded:', productsData);
      
      // 加载所有产品的详细信息
      await loadIndividualProducts();
      
      renderAllProducts();
      setupCategoryTabs();
      handleInitialHash();
      
    } catch (error) {
      console.error('Error loading products data:', error);
      showErrorState();
    }
  }

  // 加载各个产品的详细数据
  async function loadIndividualProducts() {
    try {
      const productPromises = [];
      
      // 收集所有产品ID
      Object.values(productsData.categories).forEach(category => {
        if (category.products && category.visible) {
          category.products.forEach(productRef => {
            productPromises.push(
              JSON5Parser.loadProduct(productRef.id).then(productData => ({
                ...productData.product,
                // 合并分类中的显示属性
                featured: productRef.featured,
                new: productRef.new,
                bestseller: productRef.bestseller,
                display_order: productRef.display_order
              }))
            );
          });
        }
      });
      
      const loadedProducts = await Promise.all(productPromises);
      
      // 创建产品数据映射
      productsData.productsMap = {};
      loadedProducts.forEach(product => {
        productsData.productsMap[product.id] = product;
      });
      
      console.log(`Loaded ${loadedProducts.length} individual products`);
      
    } catch (error) {
      console.error('Error loading individual products:', error);
      throw error;
    }
  }

  // ============ Rendering Functions ============
  function renderAllProducts() {
    if (!productsData || !contentContainer) return;

    let html = '';
    
    // 根据显示顺序排序分类
    const sortedCategories = Object.values(productsData.categories)
      .filter(category => category.visible)
      .sort((a, b) => a.display_order - b.display_order);
    
    sortedCategories.forEach(category => {
      html += renderCategorySection(category);
    });

    contentContainer.innerHTML = html;
    hideLoadingState();
  }

  function renderCategorySection(category) {
    // 获取该分类下的产品，并按显示顺序排序
    const products = category.products
      .map(productRef => productsData.productsMap[productRef.id])
      .filter(Boolean)
      .sort((a, b) => a.display_order - b.display_order);
    
    if (products.length === 0) return '';
    
    return `
      <div class="category-section" id="${category.id}" data-category="${category.id}">
        <div class="category-header">
          <img src="${category.hero_image || '/images/placeholder-category.jpg'}" 
               alt="${category.name.en}" class="category-image" loading="lazy">
          <div class="category-info">
            <h3 class="category-title">${category.name.en}</h3>
            <p class="category-description">${category.description.en}</p>
          </div>
        </div>
        <div class="products-grid">
          ${products.map(product => renderProductCard(product)).join('')}
        </div>
      </div>
    `;
  }

  function renderProductCard(product) {
    // 生成产品标签
    const badges = [];
    if (product.featured) badges.push('<span class="product-badge badge-featured">Featured</span>');
    if (product.new) badges.push('<span class="product-badge badge-new">New</span>');
    if (product.bestseller) badges.push('<span class="product-badge badge-bestseller">Bestseller</span>');
    
    return `
      <div class="product-card" data-category="${product.category}">
        <div class="product-image-wrapper">
          <img src="${product.images?.main || '/images/placeholder-product.jpg'}" 
               alt="${product.name.en}" class="product-image" loading="lazy">
          ${badges.join('')}
        </div>
        <div class="product-info">
          <h4 class="product-name">${product.name.en}</h4>
          <div class="product-model">Model: ${product.model}</div>
          <ul class="product-highlights">
            ${(product.highlights?.en || []).slice(0, 3).map(highlight => `
              <li class="product-highlight">${highlight}</li>
            `).join('')}
          </ul>
          <div class="product-actions">
            <a href="/products/detail/${product.slug || product.id}.html" class="product-btn">View Details</a>
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
    console.log('Initializing products page...');
    
    // Check if JSON5Parser is available
    if (typeof JSON5Parser === 'undefined') {
      console.error('JSON5Parser not found! Make sure json5-parser.js is loaded before products.js');
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
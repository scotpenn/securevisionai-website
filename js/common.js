/* ================================================
   SecureVision AI - Common JavaScript
   全站公用脚本：导航滚动、加载层、下拉菜单、锚点平滑
   ================================================ */

(function() {
  'use strict';

  // ============ Navigation State Management ============
  (function initNavigationState() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    const scroller = document.getElementById('scroll-container') || window;
    const hero = document.getElementById('hero-section') || document.querySelector('.hero-fullscreen');

    // Navigation state setter
    const setNavState = (isTop) => {
      if (isTop) {
        nav.classList.add('transparent');
        nav.classList.remove('scrolled');
      } else {
        nav.classList.add('scrolled');
        nav.classList.remove('transparent');
      }
    };

    // Method 1: IntersectionObserver (most stable)
    if (hero && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        ([entry]) => setNavState(entry.intersectionRatio > 0.15),
        { 
          root: scroller === window ? null : scroller, 
          threshold: [0, 0.15, 1] 
        }
      );
      io.observe(hero);
      // Set initial state
      setNavState(true);
    } else {
      // Method 2: Scroll fallback
      const getScrollY = () => (scroller === window ? window.scrollY : scroller.scrollTop);
      const onScroll = () => setNavState(getScrollY() <= 24);
      (scroller === window ? window : scroller).addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // Set initial state
    }
  })();
  
  // Keep legacy function for compatibility
  function updateNavbarState() {
    // This function is now handled by the IntersectionObserver above
  }

  // ============ Logo Dynamic Switching ============
  function initLogoSwitching() {
    const logoContainer = document.querySelector('.nav-logo');
    if (!logoContainer) return;

    // 检查是否是产品详情页等固定白色背景页面
    const isFixedWhitePage = document.body.classList.contains('fixed-white-nav') || 
                            window.location.pathname.includes('/products/detail/');

    // 单Logo系统 - 使用CSS filter实现颜色切换，不需要创建双Logo
    // 双Logo系统已在CSS中通过filter实现

    // 如果是固定白色背景页面，添加相应类
    if (isFixedWhitePage && navbar) {
      navbar.classList.add('fixed-white');
    }
  }

  // ============ Loading Animation Management ============
  function hideLoadingAnimation() {
    const loading = document.querySelector('.loading-page-animation');
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(() => {
        if (loading.parentNode) {
          loading.remove();
        }
      }, 300);
    }
  }

  // ============ Smooth Scrolling for Anchor Links ============
  function initSmoothScrolling() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // 计算导航栏高度偏移
        const navHeight = navbar ? navbar.offsetHeight : 60;
        const targetPosition = targetElement.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // 更新URL hash（可选）
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  }

  // ============ Dropdown Menu Enhancements ============
  function initDropdownMenus() {
    const dropdownItems = document.querySelectorAll('.nav-item');
    
    dropdownItems.forEach(item => {
      const dropdown = item.querySelector('.nav-dropdown');
      if (!dropdown) return;
      
      let hideTimeout;
      
      // 鼠标进入
      item.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateY(0)';
      });
      
      // 鼠标离开
      item.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(() => {
          dropdown.style.opacity = '0';
          dropdown.style.visibility = 'hidden';
          dropdown.style.transform = 'translateY(-8px)';
        }, 150);
      });
      
      // 键盘导航支持
      const navLink = item.querySelector('.nav-link');
      if (navLink) {
        navLink.addEventListener('focus', () => {
          clearTimeout(hideTimeout);
          dropdown.style.opacity = '1';
          dropdown.style.visibility = 'visible';
          dropdown.style.transform = 'translateY(0)';
        });
        
        navLink.addEventListener('blur', (e) => {
          // 检查焦点是否移动到下拉菜单内
          setTimeout(() => {
            if (!item.contains(document.activeElement)) {
              dropdown.style.opacity = '0';
              dropdown.style.visibility = 'hidden';
              dropdown.style.transform = 'translateY(-8px)';
            }
          }, 0);
        });
      }
    });
  }

  // ============ Hash URL Management ============
  function handleHashNavigation() {
    // 页面加载时处理hash
    if (window.location.hash) {
      setTimeout(() => {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const navHeight = navbar ? navbar.offsetHeight : 60;
          const targetPosition = targetElement.offsetTop - navHeight - 20;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
    
    // 监听hash变化
    window.addEventListener('hashchange', () => {
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const navHeight = navbar ? navbar.offsetHeight : 60;
          const targetPosition = targetElement.offsetTop - navHeight - 20;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  }

  // ============ Performance Optimized Scroll Listener ============
  let ticking = false;
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateNavbarState);
      ticking = true;
    }
  }

  function handleScroll() {
    requestTick();
    ticking = false;
  }

  // ============ Navigation Content Management ============
  
  // 1) fetch 容错：根路径失败时回退相对路径
  async function loadNavConfig() {
    const candidates = ['/config/navigation.json', 'config/navigation.json', './config/navigation.json'];
    for (const url of candidates) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (res.ok) return await res.json();
      } catch (_) {}
    }
    throw new Error('navigation.json not found');
  }

  // 2) Hydrate（仅负责注入 DOM，不做事件绑定）
  async function hydrateNavigation() {
    let config;
    try { 
      config = await loadNavConfig(); 
    } catch (e) { 
      console.warn('Use static nav fallback:', e); 
      return; 
    }

    const navItems = config.navigation.main.en;
    const productsCfg = navItems.find(i => i.id === 'products');
    if (!productsCfg || !productsCfg.items) return;

    document.querySelectorAll('.nav-item[data-menu="products"]').forEach(productsItem => {
      let dropdown = productsItem.querySelector('.nav-dropdown');
      if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'nav-dropdown';
        productsItem.appendChild(dropdown);
      }
      dropdown.innerHTML = productsCfg.items
        .map(i => `<div class="nav-dropdown-item"><a href="${i.href}">${i.label}</a></div>`)
        .join('');

      // 可访问性属性
      const trigger = productsItem.querySelector('a.nav-link');
      if (trigger) {
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    console.log(`Hydrated Products dropdown with ${productsCfg.items.length} items`);
  }

  // 3) 触屏/键盘行为（与 :hover 并存）
  function enhanceNavInteractions() {
    document.querySelectorAll('.nav-item[data-menu="products"]').forEach(item => {
      const trigger = item.querySelector('a.nav-link');
      const dropdown = item.querySelector('.nav-dropdown');
      if (!trigger || !dropdown) return;

      // 点击/触摸切换
      trigger.addEventListener('click', (e) => {
        // 在桌面端也允许点击打开，防止 hover 丢失
        e.preventDefault();
        const open = item.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(open));
      });

      // 焦点进入打开、离开关闭（键盘）
      item.addEventListener('focusin', () => {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      });
      item.addEventListener('focusout', (e) => {
        // 延迟以便焦点落到下拉里
        setTimeout(() => {
          if (!item.contains(document.activeElement)) {
            item.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
          }
        }, 0);
      });

      // Esc 关闭
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          item.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });
    });
  }

  // ============ Initialization ============
  
  // 4) 初始化：顺序非常关键（先 hydrate -> 绑定交互 -> Logo/滚动）
  async function init() {
    // 先完成导航内容注入
    await hydrateNavigation();
    
    // 然后绑定增强交互
    enhanceNavInteractions();

    // 初始化Logo切换
    initLogoSwitching();

    // 绑定正确的滚动容器再做首帧状态
    const scroller = document.getElementById('scroll-container') || window;
    if (scroller !== window) {
      scroller.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // 首帧立即设置 transparent/scrolled
    updateNavbarState();
    
    // 初始化平滑滚动
    initSmoothScrolling();
    
    // 处理URL hash导航
    handleHashNavigation();
    
    // 页面加载完成后隐藏加载动画
    hideLoadingAnimation();
  }

  // ============ DOM Ready ============
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============ Window Load Event ============
  window.addEventListener('load', () => {
    // 确保加载动画被隐藏
    hideLoadingAnimation();
    
    // 初始化导航栏状态（以防DOM变化）
    setTimeout(updateNavbarState, 100);
  });

  // ============ Export for Other Scripts ============
  window.SecureVisionCommon = {
    updateNavbarState: updateNavbarState,
    hideLoadingAnimation: hideLoadingAnimation,
    initLogoSwitching: initLogoSwitching
  };

})();

// ============ Utility Functions (Global) ============

/**
 * 显示通知消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 ('success', 'error', 'warning', 'info')
 * @param {number} duration - 显示时长（毫秒），0为不自动隐藏
 */
function showNotification(message, type = 'info', duration = 5000) {
  // 创建通知容器（如果不存在）
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }
  
  // 创建通知元素
  const notification = document.createElement('div');
  notification.style.cssText = `
    background: ${type === 'success' ? '#10B981' : 
                type === 'error' ? '#EF4444' : 
                type === 'warning' ? '#F59E0B' : '#4B70F5'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    pointer-events: auto;
    cursor: pointer;
    max-width: 300px;
    word-wrap: break-word;
  `;
  notification.textContent = message;
  
  // 添加到容器
  container.appendChild(notification);
  
  // 触发进入动画
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // 点击关闭
  notification.addEventListener('click', () => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  });
  
  // 自动隐藏
  if (duration > 0) {
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, duration);
  }
}

/**
 * 格式化日期
 * @param {Date|string} date - 日期对象或日期字符串
 * @param {string} format - 格式 ('YYYY-MM-DD', 'MM/DD/YYYY', 'relative')
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  if (format === 'relative') {
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  if (format === 'MM/DD/YYYY') {
    return `${month}/${day}/${year}`;
  }
  
  return `${year}-${month}-${day}`; // 默认 YYYY-MM-DD
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 延迟时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 */
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

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 时间间隔（毫秒）
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
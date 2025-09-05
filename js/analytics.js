// Google Analytics 4 Configuration
// Replace GA_MEASUREMENT_ID with your actual Google Analytics 4 measurement ID

(function() {
  // Check if Google Analytics should be loaded
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual GA4 ID
  
  // Only load if we have a valid measurement ID and we're not in development
  if (GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX' && location.hostname !== 'localhost') {
    
    // Load Google Analytics 4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    
    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      // Enhanced measurement for better tracking
      send_page_view: true,
      enhanced_measurement_settings: {
        scrolls: true,
        outbound_clicks: true,
        site_search: true,
        video_engagement: true,
        file_downloads: true
      }
    });
    
    // Custom event tracking for SecureVision AI
    
    // Track product category clicks
    document.addEventListener('click', function(e) {
      const target = e.target.closest('[data-category]');
      if (target) {
        gtag('event', 'category_click', {
          category: target.dataset.category,
          page_location: window.location.href,
          page_title: document.title
        });
      }
    });
    
    // Track product view events
    if (window.location.pathname.includes('/products/detail/')) {
      const productId = window.location.pathname.split('/').pop().replace('.html', '');
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        content_group1: 'Product Detail',
        custom_map: {
          'custom_parameter_1': productId
        }
      });
    }
    
    // Track contact form submissions
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
      contactForm.addEventListener('submit', function() {
        gtag('event', 'form_submit', {
          form_id: 'contact_form',
          page_location: window.location.href
        });
      });
    }
    
    // Track language switching
    document.addEventListener('click', function(e) {
      const langLink = e.target.closest('a[href*="/fr/"], a[href*="home.html"]');
      if (langLink) {
        const newLang = langLink.href.includes('/fr/') ? 'French' : 'English';
        gtag('event', 'language_switch', {
          language: newLang,
          page_location: window.location.href
        });
      }
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        gtag('event', 'scroll_depth', {
          percent_scrolled: scrollPercent,
          page_location: window.location.href
        });
      }
    });
    
    console.log('SecureVision AI Analytics initialized');
  }
})();
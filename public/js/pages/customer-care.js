/**
 * Customer Care Page - FAQ System
 * Dynamic FAQ loading with category support and multiple display modes
 */

class FAQSystem {
  constructor() {
    this.faqData = null;
    this.currentLanguage = document.documentElement.lang || 'en';
    this.currentCategory = 'all';
    this.searchTerm = '';
    this.init();
  }

  async init() {
    try {
      // Load FAQ data
      await this.loadFAQData();
      
      // Render all FAQ groups
      this.renderFAQGroups();
      
      // Initialize event listeners
      this.initializeEventListeners();
      
      // Initialize search if enabled
      if (this.faqData?.metadata?.searchEnabled) {
        this.initializeSearch();
      }
      
    } catch (error) {
      console.error('Failed to initialize FAQ system:', error);
      this.showFallbackContent();
    }
  }

  async loadFAQData() {
    try {
      const response = await fetch('/data/faq.json');
      if (!response.ok) throw new Error('Failed to load FAQ data');
      this.faqData = await response.json();
    } catch (error) {
      console.error('Error loading FAQ data:', error);
      throw error;
    }
  }

  renderFAQGroups() {
    const faqContainer = document.getElementById('faq-container');
    if (!faqContainer) {
      console.warn('FAQ container not found');
      return;
    }

    // Clear existing content
    faqContainer.innerHTML = '';

    // Render each FAQ group
    this.faqData.groups.forEach(group => {
      const groupElement = this.createFAQGroup(group);
      faqContainer.appendChild(groupElement);
    });
  }

  createFAQGroup(group) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'faq-group';
    groupDiv.setAttribute('data-group-id', group.id);
    groupDiv.setAttribute('data-display-mode', group.displayMode);

    // Add group title
    if (group.title) {
      const title = document.createElement('h3');
      title.className = 'faq-group-title';
      title.textContent = group.title[this.currentLanguage] || group.title.en;
      groupDiv.appendChild(title);
    }

    // Add group description
    if (group.description) {
      const description = document.createElement('p');
      description.className = 'faq-group-description';
      description.textContent = group.description[this.currentLanguage] || group.description.en;
      groupDiv.appendChild(description);
    }

    // Add category filter if enabled
    if (group.showCategories && this.faqData.categories) {
      const categoryFilter = this.createCategoryFilter(group.id);
      groupDiv.appendChild(categoryFilter);
    }

    // Create items container based on display mode
    const itemsContainer = document.createElement('div');
    itemsContainer.className = `faq-items faq-${group.displayMode}`;
    itemsContainer.setAttribute('data-group-items', group.id);

    // Add FAQ items
    const filteredItems = this.filterItems(group.items);
    filteredItems.forEach(item => {
      const itemElement = this.createFAQItem(item, group.displayMode);
      itemsContainer.appendChild(itemElement);
    });

    // Show message if no items match filter
    if (filteredItems.length === 0) {
      const noResults = document.createElement('p');
      noResults.className = 'faq-no-results';
      noResults.textContent = this.currentLanguage === 'fr' ? 
        'Aucune question trouvée pour cette catégorie.' : 
        'No questions found for this category.';
      itemsContainer.appendChild(noResults);
    }

    groupDiv.appendChild(itemsContainer);
    return groupDiv;
  }

  createCategoryFilter(groupId) {
    const filterDiv = document.createElement('div');
    filterDiv.className = 'faq-category-filter';
    filterDiv.setAttribute('data-filter-group', groupId);

    // All categories button
    const allBtn = document.createElement('button');
    allBtn.className = 'faq-category-btn active';
    allBtn.setAttribute('data-category', 'all');
    allBtn.textContent = this.currentLanguage === 'fr' ? 'Toutes' : 'All';
    allBtn.addEventListener('click', () => this.filterByCategory('all', groupId));
    filterDiv.appendChild(allBtn);

    // Category buttons
    this.faqData.categories.forEach(category => {
      const btn = document.createElement('button');
      btn.className = 'faq-category-btn';
      btn.setAttribute('data-category', category.id);
      btn.textContent = category.name[this.currentLanguage] || category.name.en;
      btn.addEventListener('click', () => this.filterByCategory(category.id, groupId));
      filterDiv.appendChild(btn);
    });

    return filterDiv;
  }

  createFAQItem(item, displayMode) {
    if (displayMode === 'cards') {
      return this.createFAQCard(item);
    } else {
      return this.createFAQAccordion(item);
    }
  }

  createFAQAccordion(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'faq-item';
    itemDiv.setAttribute('data-faq-id', item.id);
    itemDiv.setAttribute('data-category', item.category);
    if (item.featured) itemDiv.classList.add('featured');

    // Create button
    const button = document.createElement('button');
    button.className = 'faq-control';
    button.setAttribute('data-faq', item.id);
    button.setAttribute('aria-expanded', 'false');

    // Add category badge if exists
    if (item.category) {
      const category = this.faqData.categories.find(c => c.id === item.category);
      if (category) {
        const badge = document.createElement('span');
        badge.className = 'faq-category-badge';
        badge.textContent = category.name[this.currentLanguage] || category.name.en;
        button.appendChild(badge);
      }
    }

    // Question text
    const questionSpan = document.createElement('span');
    questionSpan.className = 'faq-question';
    questionSpan.textContent = item.question[this.currentLanguage] || item.question.en;
    button.appendChild(questionSpan);

    // Chevron icon
    const chevron = document.createElement('svg');
    chevron.className = 'faq-chevron';
    chevron.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    button.appendChild(chevron);

    // Create panel
    const panel = document.createElement('div');
    panel.className = 'faq-panel';
    panel.setAttribute('data-content', item.id);

    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    answer.innerHTML = this.parseAnswer(item.answer[this.currentLanguage] || item.answer.en);
    panel.appendChild(answer);

    // Add tags if present
    if (item.tags && item.tags.length > 0) {
      const tagsDiv = document.createElement('div');
      tagsDiv.className = 'faq-tags';
      item.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'faq-tag';
        tagSpan.textContent = tag;
        tagsDiv.appendChild(tagSpan);
      });
      panel.appendChild(tagsDiv);
    }

    itemDiv.appendChild(button);
    itemDiv.appendChild(panel);

    // Add click event
    button.addEventListener('click', () => this.toggleAccordion(button, panel));

    return itemDiv;
  }

  createFAQCard(item) {
    const card = document.createElement('div');
    card.className = 'faq-card';
    card.setAttribute('data-faq-id', item.id);
    card.setAttribute('data-category', item.category);
    if (item.featured) card.classList.add('featured');

    // Category badge
    if (item.category) {
      const category = this.faqData.categories.find(c => c.id === item.category);
      if (category) {
        const badge = document.createElement('span');
        badge.className = 'faq-category-badge';
        badge.textContent = category.name[this.currentLanguage] || category.name.en;
        card.appendChild(badge);
      }
    }

    // Question
    const question = document.createElement('h4');
    question.className = 'faq-card-question';
    question.textContent = item.question[this.currentLanguage] || item.question.en;
    card.appendChild(question);

    // Answer
    const answer = document.createElement('div');
    answer.className = 'faq-card-answer';
    answer.innerHTML = this.parseAnswer(item.answer[this.currentLanguage] || item.answer.en);
    card.appendChild(answer);

    // Tags
    if (item.tags && item.tags.length > 0) {
      const tagsDiv = document.createElement('div');
      tagsDiv.className = 'faq-tags';
      item.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'faq-tag';
        tagSpan.textContent = tag;
        tagsDiv.appendChild(tagSpan);
      });
      card.appendChild(tagsDiv);
    }

    return card;
  }

  parseAnswer(answer) {
    // Convert line breaks to <br> tags
    answer = answer.replace(/\n/g, '<br>');
    
    // Convert markdown-style bold
    answer = answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert markdown-style links
    answer = answer.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    return answer;
  }

  toggleAccordion(button, panel) {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    const animationDuration = this.faqData?.metadata?.animationDuration || 300;

    if (this.faqData?.metadata?.expandSingle) {
      // Close all other accordions in the same group
      const groupItems = button.closest('.faq-items');
      groupItems.querySelectorAll('.faq-control').forEach(otherButton => {
        if (otherButton !== button && otherButton.getAttribute('aria-expanded') === 'true') {
          const otherId = otherButton.getAttribute('data-faq');
          const otherPanel = groupItems.querySelector(`[data-content="${otherId}"]`);
          otherButton.setAttribute('aria-expanded', 'false');
          otherPanel.classList.remove('open');
        }
      });
    }

    // Toggle current accordion
    if (isOpen) {
      button.setAttribute('aria-expanded', 'false');
      panel.classList.remove('open');
    } else {
      button.setAttribute('aria-expanded', 'true');
      panel.classList.add('open');
    }
  }

  filterByCategory(category, groupId) {
    this.currentCategory = category;
    
    // Update button states
    const filterGroup = document.querySelector(`[data-filter-group="${groupId}"]`);
    if (filterGroup) {
      filterGroup.querySelectorAll('.faq-category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === category);
      });
    }

    // Re-render the specific group
    const group = this.faqData.groups.find(g => g.id === groupId);
    if (group) {
      const itemsContainer = document.querySelector(`[data-group-items="${groupId}"]`);
      if (itemsContainer) {
        itemsContainer.innerHTML = '';
        const filteredItems = this.filterItems(group.items);
        
        if (filteredItems.length === 0) {
          const noResults = document.createElement('p');
          noResults.className = 'faq-no-results';
          noResults.textContent = this.currentLanguage === 'fr' ? 
            'Aucune question trouvée pour cette catégorie.' : 
            'No questions found for this category.';
          itemsContainer.appendChild(noResults);
        } else {
          filteredItems.forEach(item => {
            const itemElement = this.createFAQItem(item, group.displayMode);
            itemsContainer.appendChild(itemElement);
          });
        }
      }
    }
  }

  filterItems(items) {
    return items.filter(item => {
      // Category filter
      if (this.currentCategory !== 'all' && item.category !== this.currentCategory) {
        return false;
      }
      
      // Search filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        const question = (item.question[this.currentLanguage] || item.question.en).toLowerCase();
        const answer = (item.answer[this.currentLanguage] || item.answer.en).toLowerCase();
        const tags = (item.tags || []).join(' ').toLowerCase();
        
        if (!question.includes(searchLower) && 
            !answer.includes(searchLower) && 
            !tags.includes(searchLower)) {
          return false;
        }
      }
      
      return true;
    });
  }

  initializeSearch() {
    const searchInput = document.getElementById('faq-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;
        this.renderFAQGroups();
      });
    }
  }

  initializeEventListeners() {
    // Language switch handler
    document.addEventListener('languageChanged', (e) => {
      this.currentLanguage = e.detail.language;
      this.renderFAQGroups();
    });
  }

  showFallbackContent() {
    const container = document.getElementById('faq-container');
    if (container) {
      container.innerHTML = `
        <div class="faq-error">
          <p>${this.currentLanguage === 'fr' ? 
            'Impossible de charger les questions fréquemment posées.' : 
            'Unable to load frequently asked questions.'}</p>
        </div>
      `;
    }
  }
}

// Initialize FAQ system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const faqSystem = new FAQSystem();
  
  // Export to window for debugging
  window.faqSystem = faqSystem;
});
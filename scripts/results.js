/* ========================================
   RESULTS MODULE
   Handles park results display and filtering
   ======================================== */

export const ResultsModule = {
  
  /**
   * Display park results in grid layout
   * @param {Array} parks - Array of park objects to display
   */
  displayResults(parks) {
    const grid = document.getElementById('park-grid');
    if (!grid) return;
    
    // Show message if no results found
    if (parks.length === 0) {
      grid.innerHTML = '<p>No parks found. Try a different search.</p>';
      return;
    }
    
    // Generate park cards with animation classes
    grid.innerHTML = parks.map(park => `
      <div class="park-card">
        <img src="${park.image}" alt="${park.name}">
        <div class="park-card-content">
          <h3>${park.name}</h3>
          <p class="state">${park.state}</p>
          <p>${park.description}</p>
          <a href="park-detail.html?park=${encodeURIComponent(park.name)}" class="btn">View Details</a>
        </div>
      </div>
    `).join('');
  },
  
  /**
   * Sort parks by specified criteria
   * @param {Array} parks - Array of park objects to sort
   * @param {string} sortBy - Sort criteria ('name' or 'distance')
   * @returns {Array} Sorted array of parks
   */
  sortParks(parks, sortBy) {
    const sorted = [...parks];
    
    switch(sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'distance':
        // TODO: Implement geolocation-based distance sorting
        return sorted;
      default:
        return sorted;
    }
  },
  
  /**
   * Initialize results page with search results and filters
   * @param {Array} parks - Full array of parks for fallback
   */
  initResultsPage(parks) {
    // Retrieve search results from sessionStorage
    const storedResults = sessionStorage.getItem('searchResults');
    const searchQuery = sessionStorage.getItem('searchQuery');
    
    let resultsToDisplay = storedResults ? JSON.parse(storedResults) : parks;
    
    // Update page title with search query if available
    if (searchQuery) {
      const pageTitle = document.querySelector('.page-title');
      if (pageTitle) {
        pageTitle.textContent = `Search Results for "${searchQuery}"`;
      }
    }
    
    // Display initial results
    this.displayResults(resultsToDisplay);
    
    // Setup sort filter event listener
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        const sorted = this.sortParks(resultsToDisplay, e.target.value);
        this.displayResults(sorted);
      });
    }
  }
};

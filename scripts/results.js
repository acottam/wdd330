// Results Module - handles park results display and filtering
export const ResultsModule = {
  
  // Display park results
  displayResults(parks) {
    const grid = document.getElementById('park-grid');
    if (!grid) return;
    
    if (parks.length === 0) {
      grid.innerHTML = '<p>No parks found. Try a different search.</p>';
      return;
    }
    
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
  
  // Sort parks
  sortParks(parks, sortBy) {
    const sorted = [...parks];
    
    switch(sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'distance':
        // Placeholder - would need geolocation implementation
        return sorted;
      default:
        return sorted;
    }
  },
  
  // Initialize results page
  initResultsPage(parks) {
    // Get search results from sessionStorage
    const storedResults = sessionStorage.getItem('searchResults');
    const searchQuery = sessionStorage.getItem('searchQuery');
    
    let resultsToDisplay = storedResults ? JSON.parse(storedResults) : parks;
    
    // Update page title if there was a search
    if (searchQuery) {
      const pageTitle = document.querySelector('.page-title');
      if (pageTitle) {
        pageTitle.textContent = `Search Results for "${searchQuery}"`;
      }
    }
    
    // Display initial results
    this.displayResults(resultsToDisplay);
    
    // Setup sort filter
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        const sorted = this.sortParks(resultsToDisplay, e.target.value);
        this.displayResults(sorted);
      });
    }
  }
};

/* ========================================
   SEARCH MODULE
   Handles park search functionality
   ======================================== */

export const SearchModule = {
  
  // Search parks by name or location
  searchParks(query, parks) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return parks;
    
    return parks.filter(park => 
      park.name.toLowerCase().includes(searchTerm) ||
      park.state.toLowerCase().includes(searchTerm) ||
      park.region.toLowerCase().includes(searchTerm)
    );
  },
  
  // Initialize search form
  initSearchForm(parks) {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value;
      const results = this.searchParks(query, parks);
      
      // Store results in sessionStorage
      sessionStorage.setItem('searchResults', JSON.stringify(results));
      sessionStorage.setItem('searchQuery', query);
      
      // Navigate to results page
      window.location.href = 'results.html';
    });
  }
};

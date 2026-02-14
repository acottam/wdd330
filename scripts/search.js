/* ========================================
   SEARCH MODULE
   Handles park search functionality
   ======================================== */

export const SearchModule = {
  
  /**
   * Search parks by name, state, or region
   * @param {string} query - Search term entered by user
   * @param {Array} parks - Array of park objects to search through
   * @returns {Array} Filtered array of matching parks
   */
  searchParks(query, parks) {
    const searchTerm = query.toLowerCase().trim();
    // Return all parks if search is empty
    if (!searchTerm) return parks;
    
    // Filter parks matching name, state, or region
    return parks.filter(park => 
      park.name.toLowerCase().includes(searchTerm) ||
      park.state.toLowerCase().includes(searchTerm) ||
      park.region.toLowerCase().includes(searchTerm)
    );
  },
  
  /**
   * Initialize search form with event listener
   * @param {Array} parks - Array of park objects for searching
   */
  initSearchForm(parks) {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value;
      const results = this.searchParks(query, parks);
      
      // Store results in sessionStorage for results page
      sessionStorage.setItem('searchResults', JSON.stringify(results));
      sessionStorage.setItem('searchQuery', query);
      
      // Navigate to results page
      window.location.href = 'results.html';
    });
  }
};

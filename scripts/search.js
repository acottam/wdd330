/* ========================================
   SEARCH MODULE
   Handles park search functionality
   ======================================== */

import { ApiService } from './api.js';
import { GeocodingModule } from './geocoding.js';

export const SearchModule = {
  
  /**
   * Search parks via NPS API
   * @param {string} query - Search term (park name or location)
   * @param {string} stateCode - Optional state code filter
   * @returns {Array} Array of matching parks
   */
  async searchParks(query, stateCode = null) {
    try {
      const data = await ApiService.searchParks(query, stateCode);
      return data.data || [];
    } catch (error) {
      console.error('Error searching parks:', error);
      return [];
    }
  },
  
  /**
   * Initialize search form with event listener
   */
  initSearchForm() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const radiusFilter = document.getElementById('radius-filter');
    
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = searchInput.value;
      const radius = radiusFilter ? parseInt(radiusFilter.value) : 150;
      
      // Get ALL parks from NPS API (no query filter for location searches)
      const results = await this.searchParks('', null);
      console.log(`NPS API returned ${results.length} total parks`);
      console.log('Sample park designations:', results.slice(0, 5).map(p => `${p.fullName} (${p.designation})`));
      
      // Geocode the search query to get coordinates
      const { GeocodingModule } = await import('./geocoding.js');
      const geocoded = await GeocodingModule.geocode(query);
      console.log('Geocoding result:', geocoded);
      
      if (!geocoded) {
        alert('Could not find location. Please try a different search.');
        return;
      }
      
      const searchCoords = { lat: geocoded.lat, lon: geocoded.lon };
      console.log(`Search coordinates: lat=${searchCoords.lat}, lon=${searchCoords.lon}`);
      
      // Filter results by radius
      let parksWithCoords = 0;
      let parksChecked = 0;
      const filteredResults = results.filter(park => {
        if (!park.latitude || !park.longitude) return false;
        parksWithCoords++;
        const distance = this.calculateDistance(
          searchCoords.lat,
          searchCoords.lon,
          parseFloat(park.latitude),
          parseFloat(park.longitude)
        );
        const withinRadius = distance <= radius;
        parksChecked++;
        if (parksChecked <= 10) {
          console.log(`${park.fullName} (${park.states}): ${distance} miles - ${withinRadius ? 'INCLUDED' : 'EXCLUDED'}`);
        }
        return withinRadius;
      });
      
      console.log(`Parks with coordinates: ${parksWithCoords}`);
      console.log(`Found ${filteredResults.length} parks within ${radius} miles of ${query}`);
      
      // Show Utah parks specifically for debugging
      const utahParks = results.filter(p => p.states && p.states.includes('UT'));
      console.log(`Total Utah parks in API: ${utahParks.length}`);
      console.log('Utah parks:', utahParks.slice(0, 10).map(p => `${p.fullName} (lat:${p.latitude}, lon:${p.longitude})`));
      
      // Store results and search info in sessionStorage
      sessionStorage.setItem('searchResults', JSON.stringify(filteredResults));
      sessionStorage.setItem('searchQuery', query);
      sessionStorage.setItem('searchRadius', radius.toString());
      sessionStorage.setItem('searchCoords', JSON.stringify(searchCoords));
      
      // Navigate to results page
      window.location.href = 'results.html';
    });
  },
  
  /**
   * Calculate distance between two coordinates
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  }
};

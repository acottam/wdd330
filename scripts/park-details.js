/* ========================================
   PARK DETAILS MODULE
   Displays park information
   ======================================== */

export const ParkDetailsModule = {
  
  // Get park from URL parameter
  getParkFromURL(parks) {
    const urlParams = new URLSearchParams(window.location.search);
    const parkName = urlParams.get('park');
    return parks.find(p => p.name === parkName);
  },
  
  // Display park details
  displayParkDetails(park) {
    const parkInfo = document.getElementById('park-info');
    if (!parkInfo || !park) return;
    
    parkInfo.innerHTML = `
      <img src="${park.image}" alt="${park.name}" style="width: 100%; border-radius: var(--radius); margin-bottom: 1rem;">
      <h2>${park.name}</h2>
      <p><strong>Location:</strong> ${park.state}</p>
      <p><strong>Region:</strong> ${park.region}</p>
      <p>${park.description}</p>
      ${park.website ? `<p><a href="${park.website}" target="_blank">Visit Official Website</a></p>` : ''}
      <button onclick="ParkDetailsModule.addToFavorites()" class="cta-btn">Add to Favorites</button>
    `;
  },
  
  // Add current park to favorites
  addToFavorites() {
    alert('Added to favorites!');
  },
  
  // Initialize park details page
  initParkDetailsPage(parks) {
    const park = this.getParkFromURL(parks);
    
    if (!park) {
      document.querySelector('main').innerHTML = '<section><h2>Park not found</h2><p><a href="results.html">Back to search</a></p></section>';
      return;
    }
    
    this.displayParkDetails(park);
    document.title = `${park.name} - PNW Family Adventure Finder`;
  }
};

// Make available globally
window.ParkDetailsModule = ParkDetailsModule;

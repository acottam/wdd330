/* ========================================
   PARK DETAILS MODULE
   Displays park information
   ======================================== */

import { ApiService } from './api.js';

export const ParkDetailsModule = {
  
  // Get park code from URL parameter
  getParkCodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
  },
  
  // Display park details
  displayParkDetails(park) {
    const parkInfo = document.getElementById('park-info');
    const pageTitle = document.querySelector('.page-title');
    if (!parkInfo || !park) return;
    
    if (pageTitle) {
      pageTitle.textContent = park.fullName;
    }
    
    // Calculate distance if geolocation available
    let distanceHTML = '';
    if (navigator.geolocation && park.latitude && park.longitude) {
      navigator.geolocation.getCurrentPosition((position) => {
        const distance = this.calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          parseFloat(park.latitude),
          parseFloat(park.longitude)
        );
        const distanceEl = document.getElementById('distance-info');
        if (distanceEl) {
          distanceEl.innerHTML = `<p><strong>Distance:</strong> ${distance.toLocaleString()} miles from your location</p>`;
        }
      });
      distanceHTML = '<div id="distance-info"></div>';
    }
    
    parkInfo.innerHTML = `
      <img src="${park.images?.[0]?.url || 'images/np-logo.png'}" alt="${park.fullName}" style="width: 100%; border-radius: var(--radius); margin-bottom: 1rem;">
      <div id="park-detail-content" style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
        <div>
          <p><strong>Location:</strong> ${park.states}</p>
          ${distanceHTML}
          <p>${park.description}</p>
        </div>
        <div id="park-detail-buttons" style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1rem;">
          ${park.url ? `<a href="${park.url}" target="_blank" class="cta-btn" style="display: inline-block; width: 100%; text-align: center;">Visit Official Website</a>` : ''}
          <button onclick="ParkDetailsModule.addToFavorites()" class="cta-btn" style="width: 100%;">Add to Favorites</button>
        </div>
      </div>
    `;
  },
  
  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  },
  
  // Add current park to favorites
  addToFavorites() {
    alert('Added to favorites!');
  },
  
  // Initialize park details page
  async initParkDetailsPage() {
    const parkCode = this.getParkCodeFromURL();
    
    if (!parkCode) {
      document.querySelector('main').innerHTML = '<section><h2>Park not found</h2><p><a href="results.html">Back to search</a></p></section>';
      return;
    }
    
    try {
      const data = await ApiService.getPark(parkCode);
      const park = data.data?.[0];
      
      if (!park) {
        document.querySelector('main').innerHTML = '<section><h2>Park not found</h2><p><a href="results.html">Back to search</a></p></section>';
        return;
      }
      
      this.displayParkDetails(park);
      document.title = `${park.fullName} - PNW Family Adventure Finder`;
      
      // Load alerts, nearby places, and map
      const { AlertsModule } = await import('./alerts.js');
      const { NearbyModule } = await import('./nearby.js');
      const { MapModule } = await import('./map.js');
      
      AlertsModule.initAlerts(parkCode);
      
      if (park.latitude && park.longitude) {
        const lat = parseFloat(park.latitude);
        const lng = parseFloat(park.longitude);
        NearbyModule.initNearby(lat, lng);
        
        // Get address and distance for map
        const address = park.addresses?.[0] ? 
          `${park.addresses[0].line1}, ${park.addresses[0].city}, ${park.addresses[0].stateCode}` : '';
        
        // Calculate distance if geolocation available
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const distance = this.calculateDistance(
              position.coords.latitude,
              position.coords.longitude,
              lat,
              lng
            );
            MapModule.initMap(lat, lng, park.fullName, address, distance);
          }, () => {
            MapModule.initMap(lat, lng, park.fullName, address);
          });
        } else {
          MapModule.initMap(lat, lng, park.fullName, address);
        }
      }
    } catch (error) {
      console.error('Error loading park details:', error);
      document.querySelector('main').innerHTML = '<section><h2>Error loading park</h2><p><a href="results.html">Back to search</a></p></section>';
    }
  }
};

// Make available globally
window.ParkDetailsModule = ParkDetailsModule;

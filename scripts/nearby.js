/* ========================================
   NEARBY MODULE
   Fetches nearby places
   Placeholder for Yelp API integration
   ======================================== */

export const NearbyModule = {
  
  // Fetch nearby places
  // TODO: Integrate with Yelp API via Node.js proxy
  async fetchNearbyPlaces(latitude, longitude) {
    // Mock data - replace with Yelp API call via backend
    return [
      {
        id: '1',
        name: 'Mountain View Cafe',
        category: 'Coffee & Tea',
        rating: 4.5,
        distance: '2.3 miles'
      },
      {
        id: '2',
        name: 'Trail Head Restaurant',
        category: 'American',
        rating: 4.2,
        distance: '3.1 miles'
      }
    ];
  },
  
  // Display nearby places
  displayNearbyPlaces(places) {
    const nearbyContent = document.getElementById('nearby-content');
    if (!nearbyContent) return;
    
    if (!places || places.length === 0) {
      nearbyContent.innerHTML = '<p>No nearby places found.</p>';
      return;
    }
    
    nearbyContent.innerHTML = places.map(place => `
      <div class="place-item">
        <h4>${place.name}</h4>
        <p><strong>Category:</strong> ${place.category}</p>
        <p><strong>Rating:</strong> ${place.rating} ⭐</p>
        <p><strong>Distance:</strong> ${place.distance}</p>
        <button onclick="NearbyModule.addToFavorites('${place.id}')" class="btn">Add to Favorites</button>
      </div>
    `).join('');
  },
  
  // Add place to favorites
  addToFavorites(placeId) {
    alert('Added to favorites!');
  },
  
  // Initialize nearby places
  async initNearby(latitude, longitude) {
    const places = await this.fetchNearbyPlaces(latitude, longitude);
    this.displayNearbyPlaces(places);
  }
};

// Make available globally
window.NearbyModule = NearbyModule;

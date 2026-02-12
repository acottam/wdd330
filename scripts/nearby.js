// Nearby Module - fetches nearby places (placeholder for Yelp API integration)
export const NearbyModule = {
  
  // Fetch nearby places (placeholder - would use Yelp API via Node.js proxy)
  async fetchNearbyPlaces(latitude, longitude) {
    // Placeholder: In production, this would call your Node.js backend
    // which proxies requests to Yelp Fusion API
    
    // Mock data for now
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
      <div class="place-item" style="background: #fff; padding: 1rem; margin-bottom: 1rem; border-radius: var(--radius); box-shadow: var(--shadow-1);">
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

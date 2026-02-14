/* ========================================
   NEARBY MODULE
   Fetches nearby places via Yelp API
   ======================================== */

import { ApiService } from './api.js';

export const NearbyModule = {
  
  // Fetch nearby places from Yelp API
  async fetchNearbyPlaces(latitude, longitude, limit = 10) {
    try {
      const data = await ApiService.getNearbyPlaces(latitude, longitude, 16093); // 10 miles in meters
      return (data.businesses || []).slice(0, limit).map(b => ({
        id: b.id,
        name: b.name,
        category: b.categories?.[0]?.title || 'Restaurant',
        rating: b.rating,
        distance: `${(b.distance / 1609.34).toFixed(1)} miles`,
        image: b.image_url
      }));
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      return [];
    }
  },
  
  // Display nearby places
  displayNearbyPlaces(places) {
    const nearbyContent = document.getElementById('nearby-content');
    if (!nearbyContent) return;
    
    if (!places || places.length === 0) {
      nearbyContent.innerHTML = '<p>No nearby places found.</p>';
      return;
    }
    
    nearbyContent.innerHTML = `<div id="nearby-grid" style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">${places.map(place => `
      <div class="place-item">
        <img src="${place.image || 'images/np-logo.png'}" alt="${place.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius); margin-bottom: 0.5rem;">
        <h4>${place.name}</h4>
        <p><strong>Category:</strong> ${place.category}</p>
        <p><strong>Rating:</strong> ${place.rating} ⭐</p>
        <p><strong>Distance:</strong> ${place.distance}</p>
        <button onclick="NearbyModule.addToFavorites('${place.id}')" class="btn">Add to Favorites</button>
      </div>
    `).join('')}</div>`;
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

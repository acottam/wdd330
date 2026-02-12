// Favorites Module - handles localStorage for favorites
export const FavoritesModule = {
  
  // Get favorites from localStorage
  getFavorites() {
    const favorites = localStorage.getItem('pnw-favorites');
    return favorites ? JSON.parse(favorites) : { parks: [], places: [] };
  },
  
  // Save favorites to localStorage
  saveFavorites(favorites) {
    localStorage.setItem('pnw-favorites', JSON.stringify(favorites));
  },
  
  // Add park to favorites
  addParkToFavorites(park) {
    const favorites = this.getFavorites();
    if (!favorites.parks.find(p => p.name === park.name)) {
      favorites.parks.push(park);
      this.saveFavorites(favorites);
      return true;
    }
    return false;
  },
  
  // Remove park from favorites
  removeParkFromFavorites(parkName) {
    const favorites = this.getFavorites();
    favorites.parks = favorites.parks.filter(p => p.name !== parkName);
    this.saveFavorites(favorites);
  },
  
  // Add place to favorites
  addPlaceToFavorites(place) {
    const favorites = this.getFavorites();
    if (!favorites.places.find(p => p.id === place.id)) {
      favorites.places.push(place);
      this.saveFavorites(favorites);
      return true;
    }
    return false;
  },
  
  // Remove place from favorites
  removePlaceFromFavorites(placeId) {
    const favorites = this.getFavorites();
    favorites.places = favorites.places.filter(p => p.id !== placeId);
    this.saveFavorites(favorites);
  },
  
  // Display favorites page
  displayFavoritesPage() {
    const favorites = this.getFavorites();
    
    // Display favorite parks
    const parksGrid = document.getElementById('favorites-parks-grid');
    if (parksGrid) {
      if (favorites.parks.length === 0) {
        parksGrid.innerHTML = '<p>No favorite parks yet. Start exploring!</p>';
      } else {
        parksGrid.innerHTML = favorites.parks.map(park => `
          <div class="park-card">
            <img src="${park.image}" alt="${park.name}">
            <div class="park-card-content">
              <h3>${park.name}</h3>
              <p class="state">${park.state}</p>
              <button onclick="FavoritesModule.removeParkFromFavorites('${park.name}')" class="btn">Remove</button>
            </div>
          </div>
        `).join('');
      }
    }
    
    // Display favorite places
    const placesList = document.getElementById('favorites-places-list');
    if (placesList) {
      if (favorites.places.length === 0) {
        placesList.innerHTML = '<p>No favorite places yet.</p>';
      } else {
        placesList.innerHTML = favorites.places.map(place => `
          <div class="place-item">
            <h4>${place.name}</h4>
            <p>${place.category}</p>
            <button onclick="FavoritesModule.removePlaceFromFavorites('${place.id}')" class="btn">Remove</button>
          </div>
        `).join('');
      }
    }
  }
};

// Make available globally for onclick handlers
window.FavoritesModule = FavoritesModule;

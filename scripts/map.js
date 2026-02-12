/* ========================================
   MAP MODULE
   Displays map with markers
   Placeholder for Mapbox/OSM integration
   ======================================== */

export const MapModule = {
  
  // Initialize map
  // TODO: Integrate with Mapbox or Leaflet.js
  initMap(latitude, longitude, parkName) {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;
    
    // Placeholder - replace with real map implementation
    // Example with Leaflet.js:
    // const map = L.map('map-container').setView([latitude, longitude], 13);
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    // L.marker([latitude, longitude]).addTo(map).bindPopup(parkName);
    
    mapContainer.innerHTML = `
      <div style="background: var(--alpine-sky); padding: 2rem; text-align: center; border-radius: var(--radius);">
        <p><strong>Map View</strong></p>
        <p>${parkName}</p>
        <p>Coordinates: ${latitude}, ${longitude}</p>
        <p style="font-size: 0.9rem; color: var(--ink-700);">Map integration coming soon with Mapbox/OpenStreetMap</p>
      </div>
    `;
  },
  
  // Add marker to map
  addMarker(latitude, longitude, label) {
    console.log(`Adding marker: ${label} at ${latitude}, ${longitude}`);
  }
};

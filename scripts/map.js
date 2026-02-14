/* ========================================
   MAP MODULE
   Displays interactive map with Leaflet.js
   ======================================== */

export const MapModule = {
  map: null,
  
  initMap(lat, lng, parkName, address = '', distance = null) {
    const container = document.getElementById('map-container');
    if (!container) return;
    
    const addressLink = address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const distanceText = distance ? `<p><strong>Distance:</strong> ${distance.toLocaleString()} miles from your location</p>` : '';
    
    container.innerHTML = `
      <p><strong>Address:</strong> <a href="${addressLink}" target="_blank">Open in Maps</a></p>
      ${distanceText}
      <div id="leaflet-map" style="height: 400px; margin-top: 1rem;"></div>
    `;
    
    this.map = L.map('leaflet-map', { scrollWheelZoom: false }).setView([lat, lng], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    
    L.marker([lat, lng]).addTo(this.map).bindPopup(`<b>${parkName}</b>`);
  }
};

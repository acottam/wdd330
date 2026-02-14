/* ========================================
   GEOCODING MODULE
   Converts location text to coordinates
   Uses OpenStreetMap Nominatim API
   ======================================== */

import { ApiService } from './api.js';

export const GeocodingModule = {
  
  // Geocode a location string to coordinates
  async geocode(location) {
    try {
      const data = await ApiService.geocode(location);
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          displayName: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding location:', error);
      return null;
    }
  }
};

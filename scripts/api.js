/* ========================================
   API SERVICE MODULE
   Direct API calls (client-side)
   ======================================== */

export const ApiService = {
  
  async searchParks(query, stateCode = null) {
    const params = new URLSearchParams({ api_key: API_CONFIG.NPS_API_KEY, limit: '500' });
    if (query) params.append('q', query);
    if (stateCode) params.append('stateCode', stateCode);
    
    const response = await fetch(`https://developer.nps.gov/api/v1/parks?${params}`);
    if (!response.ok) throw new Error('Failed to fetch parks');
    const data = await response.json();
    console.log(`NPS API returned ${data.data.length} parks (total: ${data.total})`);
    return data;
  },
  
  async getPark(parkCode) {
    const response = await fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${API_CONFIG.NPS_API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch park');
    return response.json();
  },
  
  async getAlerts(parkCode) {
    const response = await fetch(`https://developer.nps.gov/api/v1/alerts?parkCode=${parkCode}&api_key=${API_CONFIG.NPS_API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  },
  
  async getNearbyPlaces(latitude, longitude, radius = 16093) {
    try {
      const url = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&radius=${radius}&categories=restaurants,food`;
      const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`, {
        headers: { 'Authorization': `Bearer ${API_CONFIG.YELP_API_KEY}` }
      });
      if (!response.ok) throw new Error('Failed to fetch nearby places');
      return response.json();
    } catch (error) {
      console.warn('Yelp API error:', error);
      return { businesses: [] };
    }
  },
  
  async geocode(location) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`, {
      headers: { 'User-Agent': 'PNW-Family-Adventure-Finder' }
    });
    if (!response.ok) throw new Error('Failed to geocode location');
    return response.json();
  }
};

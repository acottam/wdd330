/* ========================================
   RESULTS MODULE
   Handles park results display and filtering
   ======================================== */

export const ResultsModule = {
  
  /**
   * Display park results in grid layout
   * @param {Array} parks - Array of park objects to display
   */
  displayResults(parks) {
    const grid = document.getElementById('park-grid');
    if (!grid) return;
    
    if (parks.length === 0) {
      grid.innerHTML = '<p>No parks found. Try a different search.</p>';
      return;
    }
    
    // Get user location for distance calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.renderParksWithDistance(parks, position.coords.latitude, position.coords.longitude);
      }, () => {
        this.renderParksWithDistance(parks);
      });
    } else {
      this.renderParksWithDistance(parks);
    }
  },
  
  /**
   * Render parks with distance calculations
   */
  renderParksWithDistance(parks, userLat = null, userLng = null) {
    const grid = document.getElementById('park-grid');
    if (!grid) return;
    
    const searchQuery = sessionStorage.getItem('searchQuery');
    const searchCoordsStr = sessionStorage.getItem('searchCoords');
    const searchCoords = searchCoordsStr ? JSON.parse(searchCoordsStr) : null;
    
    grid.innerHTML = parks.map(park => {
      const parkLat = parseFloat(park.latitude);
      const parkLng = parseFloat(park.longitude);
      
      let distanceHTML = '';
      
      // Distance from search location
      if (searchCoords && parkLat && parkLng) {
        const searchDist = this.calculateDistance(searchCoords.lat, searchCoords.lon, parkLat, parkLng);
        distanceHTML += `<p><strong>${searchQuery}:</strong> ${searchDist.toLocaleString()} miles</p>`;
      }
      
      // Distance from user location
      if (userLat && userLng && parkLat && parkLng) {
        const userDist = this.calculateDistance(userLat, userLng, parkLat, parkLng);
        distanceHTML += `<p><strong>Current location:</strong> ${userDist.toLocaleString()} miles</p>`;
      }
      
      return `
        <div class="park-card">
          <a href="park-detail.html?code=${park.parkCode || encodeURIComponent(park.name)}">
            <img src="${park.images?.[0]?.url || 'images/np-logo.png'}" alt="${park.fullName || park.name}">
          </a>
          <div class="park-card-content">
            <h3>${park.fullName || park.name}</h3>
            <p class="state">${park.states || park.state}</p>
            ${distanceHTML}
            <p>${(park.description || '').substring(0, 150)}...</p>
            <a href="park-detail.html?code=${park.parkCode || encodeURIComponent(park.name)}" class="btn">View Details</a>
          </div>
        </div>
      `;
    }).join('');
  },
  
  /**
   * Calculate distance between two coordinates
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  },
  
  /**
   * Sort parks by specified criteria
   */
  sortParks(parks, sortBy, userLat = null, userLng = null) {
    const sorted = [...parks];
    
    switch(sortBy) {
      case 'name':
        return sorted.sort((a, b) => (a.fullName || a.name).localeCompare(b.fullName || b.name));
      case 'distance':
        if (userLat && userLng) {
          return sorted.sort((a, b) => {
            const distA = this.calculateDistance(userLat, userLng, parseFloat(a.latitude), parseFloat(a.longitude));
            const distB = this.calculateDistance(userLat, userLng, parseFloat(b.latitude), parseFloat(b.longitude));
            return distA - distB;
          });
        }
        return sorted;
      default:
        return sorted;
    }
  },
  
  /**
   * Initialize results page with search results and filters
   */
  async initResultsPage(parks) {
    const storedResults = sessionStorage.getItem('searchResults');
    const searchQuery = sessionStorage.getItem('searchQuery');
    const searchRadius = sessionStorage.getItem('searchRadius') || '100';
    const searchCoordsStr = sessionStorage.getItem('searchCoords');
    const searchCoords = searchCoordsStr ? JSON.parse(searchCoordsStr) : null;
    
    let resultsToDisplay = storedResults ? JSON.parse(storedResults) : parks;
    
    // Render state links
    this.renderStateLinks();
    
    // Populate search input and radius with previous values
    const searchInput = document.getElementById('search-input');
    const radiusFilter = document.getElementById('radius-filter');
    if (searchInput && searchQuery) {
      searchInput.value = searchQuery;
    }
    if (radiusFilter) {
      radiusFilter.value = searchRadius;
    }
    
    // Initialize search form
    const { SearchModule } = await import('./search.js');
    SearchModule.initSearchForm();
    
    if (searchQuery) {
      const pageTitle = document.querySelector('.page-title');
      if (pageTitle) {
        pageTitle.innerHTML = `Search: ${searchQuery} <span class="park-count">(${resultsToDisplay.length} parks)</span>`;
      }
      
      // Underline matching state abbreviation if search is a state
      this.highlightStateLink(searchQuery);
    }
    
    // Initialize map with all results
    this.initResultsMap(resultsToDisplay);
    
    // Display search info
    this.displaySearchInfo(resultsToDisplay, searchQuery, searchCoords);
    
    // Sort by distance from search location if available, otherwise from user
    if (searchCoords) {
      const sorted = this.sortParks(resultsToDisplay, 'distance', searchCoords.lat, searchCoords.lon);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.renderParksWithDistance(sorted, position.coords.latitude, position.coords.longitude);
          this.setupSortFilterWithCoords(sorted, searchCoords, position.coords.latitude, position.coords.longitude);
        }, () => {
          this.renderParksWithDistance(sorted);
          this.setupSortFilterWithCoords(sorted, searchCoords);
        });
      } else {
        this.renderParksWithDistance(sorted);
        this.setupSortFilterWithCoords(sorted, searchCoords);
      }
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const sorted = this.sortParks(resultsToDisplay, 'distance', position.coords.latitude, position.coords.longitude);
        this.renderParksWithDistance(sorted, position.coords.latitude, position.coords.longitude);
        this.setupSortFilterWithCoords(sorted, null, position.coords.latitude, position.coords.longitude);
      }, () => {
        this.displayResults(resultsToDisplay);
        this.setupSortFilter(resultsToDisplay);
      });
    } else {
      this.displayResults(resultsToDisplay);
      this.setupSortFilter(resultsToDisplay);
    }
  },
  
  /**
   * Initialize map with all park results
   */
  initResultsMap(parks) {
    const mapContainer = document.getElementById('results-map');
    if (!mapContainer || !parks.length) return;
    
    const validParks = parks.filter(p => p.latitude && p.longitude);
    if (!validParks.length) return;
    
    // Center on first park
    const centerLat = parseFloat(validParks[0].latitude);
    const centerLng = parseFloat(validParks[0].longitude);
    
    const map = L.map('results-map', { scrollWheelZoom: false }).setView([centerLat, centerLng], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add markers for all parks
    validParks.forEach(park => {
      const lat = parseFloat(park.latitude);
      const lng = parseFloat(park.longitude);
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${park.fullName || park.name}</b><br><a href="park-detail.html?code=${park.parkCode}">View Details</a>`);
    });
    
    // Fit bounds to show all markers
    const bounds = validParks.map(p => [parseFloat(p.latitude), parseFloat(p.longitude)]);
    map.fitBounds(bounds, { padding: [50, 50] });
  },
  
  /**
   * Display search info (distance and park count)
   */
  displaySearchInfo(parks, searchQuery, searchCoords) {
    const infoContainer = document.getElementById('search-info');
    if (!infoContainer) return;
    
    let infoHTML = '';
    
    // Distance to search location
    if (searchCoords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const distance = this.calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          searchCoords.lat,
          searchCoords.lon
        );
        infoHTML = `<p><strong>${distance.toLocaleString()} miles</strong> to ${searchQuery}</p>`;
        infoHTML += `<p><strong>${parks.length} Parks</strong> within area</p>`;
        infoContainer.innerHTML = infoHTML;
      }, () => {
        infoHTML = `<p><strong>${parks.length} Parks</strong> within area</p>`;
        infoContainer.innerHTML = infoHTML;
      });
    } else {
      infoHTML = `<p><strong>${parks.length} Parks</strong> within area</p>`;
      infoContainer.innerHTML = infoHTML;
    }
  },
  
  setupSortFilterWithCoords(resultsToDisplay, searchCoords, userLat = null, userLng = null) {
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
      sortFilter.value = 'distance';
      sortFilter.addEventListener('change', (e) => {
        const sortLat = searchCoords ? searchCoords.lat : userLat;
        const sortLng = searchCoords ? searchCoords.lon : userLng;
        const sorted = this.sortParks(resultsToDisplay, e.target.value, sortLat, sortLng);
        this.renderParksWithDistance(sorted, userLat, userLng);
      });
    }
  },
  
  setupSortFilter(resultsToDisplay) {
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        const sorted = this.sortParks(resultsToDisplay, e.target.value);
        this.renderParksWithDistance(sorted);
      });
    }
  },
  
  /**
   * Render state links for quick state searches
   */
  renderStateLinks() {
    const stateMap = {
      'AL':'Alabama','AK':'Alaska','AZ':'Arizona','AR':'Arkansas','CA':'California','CO':'Colorado','CT':'Connecticut','DE':'Delaware','FL':'Florida','GA':'Georgia','HI':'Hawaii','ID':'Idaho','IL':'Illinois','IN':'Indiana','IA':'Iowa','KS':'Kansas','KY':'Kentucky','LA':'Louisiana','ME':'Maine','MD':'Maryland','MA':'Massachusetts','MI':'Michigan','MN':'Minnesota','MS':'Mississippi','MO':'Missouri','MT':'Montana','NE':'Nebraska','NV':'Nevada','NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico','NY':'New York','NC':'North Carolina','ND':'North Dakota','OH':'Ohio','OK':'Oklahoma','OR':'Oregon','PA':'Pennsylvania','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota','TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont','VA':'Virginia','WA':'Washington','WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming'
    };
    const states = Object.keys(stateMap);
    const container = document.getElementById('state-links');
    if (!container) return;
    
    const half = Math.ceil(states.length / 2);
    const line1 = states.slice(0, half).map(state => 
      `<a href="#" data-state="${state}" data-fullname="${stateMap[state]}">${state}</a>`
    ).join(' • ');
    const line2 = states.slice(half).map(state => 
      `<a href="#" data-state="${state}" data-fullname="${stateMap[state]}">${state}</a>`
    ).join(' • ');
    
    container.innerHTML = `<div>${line1}</div><div>${line2}</div>`;
    
    // Add click handlers
    container.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const fullName = e.target.dataset.fullname;
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.value = fullName;
          document.getElementById('search-form').dispatchEvent(new Event('submit'));
        }
      });
    });
  },
  
  /**
   * Highlight state abbreviation link if search matches a state
   */
  highlightStateLink(searchQuery) {
    const stateMap = {
      'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA','Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA','Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY'
    };
    
    const stateAbbr = stateMap[searchQuery];
    if (!stateAbbr) return;
    
    const container = document.getElementById('state-links');
    if (!container) return;
    
    const links = container.querySelectorAll('a');
    links.forEach(link => {
      if (link.dataset.state === stateAbbr) {
        link.style.textDecoration = 'underline';
        link.style.fontWeight = '700';
      }
    });
  }
};

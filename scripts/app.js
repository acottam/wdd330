/* ========================================
   MAIN APPLICATION CONTROLLER
   PNW Family Adventure Finder
   ======================================== */

import { SearchModule } from './search.js';
import { ResultsModule } from './results.js';
import { ParkDetailsModule } from './park-details.js';
import { AlertsModule } from './alerts.js';
import { NearbyModule } from './nearby.js';
import { MapModule } from './map.js';
import { FavoritesModule } from './favorites.js';
import { DayPlanModule } from './plans.js';

/* ========================================
   DATA LOADING
   ======================================== */

/**
 * Initialize page based on current route
 * Routes to appropriate page-specific initialization
 */
function initializePage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Initialize common elements on all pages
  initMenuToggle();
  updateFooter();
  
  // Page-specific initialization based on current route
  switch(currentPage) {
    case 'index.html':
    case '':
      initHomePage();
      break;
    case 'results.html':
      ResultsModule.initResultsPage();
      break;
    case 'park-detail.html':
      initParkDetailPage();
      break;
    case 'favorites.html':
      FavoritesModule.displayFavoritesPage();
      break;
    case 'plans.html':
      initPlansPage();
      break;
  }
}

/* ========================================
   HOME PAGE
   ======================================== */

/**
 * Initialize home page with search and featured parks
 */
async function initHomePage() {
  SearchModule.initSearchForm();
  initViewAllParks();
  
  // Load featured parks from NPS API (WA state)
  try {
    const { ApiService } = await import('./api.js');
    const data = await ApiService.searchParks('', 'WA');
    const featured = data.data.slice(0, 4);
    displayFeaturedParks(featured);
  } catch (error) {
    console.error('Error loading featured parks:', error);
  }
}

/**
 * Display featured parks on home page
 * @param {Array} parks - Array of park objects from NPS API
 */
function displayFeaturedParks(parks) {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  
  // Generate HTML for each featured park card
  grid.innerHTML = parks.map(park => `
    <div class="park-card">
      <img src="${park.images[0]?.url || 'images/np-logo.png'}" alt="${park.fullName}">
      <div class="park-card-content">
        <h3>${park.fullName}</h3>
        <p class="state">${park.states}</p>
        <a href="park-detail.html?code=${park.parkCode}" class="btn">View Details</a>
      </div>
    </div>
  `).join('');
}

/**
 * Initialize View All Parks button
 */
function initViewAllParks() {
  const viewAllBtn = document.getElementById('view-all-parks');
  if (!viewAllBtn) return;
  
  viewAllBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    // Check if there's a previous search
    const hasSearch = sessionStorage.getItem('searchResults');
    if (hasSearch) {
      window.location.href = 'results.html';
      return;
    }
    
    // Get user's state or default to Oregon
    let stateName = 'Oregon';
    
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        // Reverse geocode to get state
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`, {
          headers: { 'User-Agent': 'PNW-Family-Adventure-Finder' }
        });
        const data = await response.json();
        stateName = data.address?.state || 'Oregon';
      } catch (error) {
        console.log('Location not available, using Oregon as default');
      }
    }
    
    // Trigger search with state name
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = stateName;
      document.getElementById('search-form').dispatchEvent(new Event('submit'));
    }
  });
}

/* ========================================
   PARK DETAIL PAGE
   ======================================== */

/**
 * Initialize park detail page with all modules
 * Loads park info, alerts, nearby places, and map
 */
function initParkDetailPage() {
  ParkDetailsModule.initParkDetailsPage();
}

/**
 * Initialize plans page with NPS API data
 */
async function initPlansPage() {
  try {
    const { ApiService } = await import('./api.js');
    const data = await ApiService.searchParks('', null);
    const parks = data.data.map(p => ({ name: p.fullName, parkCode: p.parkCode }));
    DayPlanModule.initPlanForm(parks);
    DayPlanModule.displayPlans();
  } catch (error) {
    console.error('Error loading parks for plans:', error);
    DayPlanModule.displayPlans();
  }
}

/* ========================================
   UI COMPONENTS
   ======================================== */

/**
 * Initialize mobile menu toggle functionality
 * Handles hamburger menu open/close with ARIA attributes
 */
function initMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');
  
  if (!menuToggle || !nav) return;
  
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.classList.toggle('open');
    // Update ARIA attribute for accessibility
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
}

/**
 * Update footer with current year and last modified date
 */
function updateFooter() {
  const yearSpan = document.getElementById('currentyear');
  const modifiedP = document.getElementById('lastmodified');
  
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  
  if (modifiedP) {
    modifiedP.textContent = `Last Modified: ${document.lastModified}`;
  }
}

/* ========================================
   APP INITIALIZATION
   ======================================== */

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializePage);

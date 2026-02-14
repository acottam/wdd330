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

// Global parks data loaded from JSON
let parks = [];

/* ========================================
   DATA LOADING
   ======================================== */

/**
 * Load parks data from JSON file
 * Initializes the page after data is loaded
 */
async function loadParks() {
  try {
    const response = await fetch('data/parks-list.json');
    parks = await response.json();
    initializePage();
  } catch (error) {
    console.error('Error loading parks:', error);
  }
}

/* ========================================
   PAGE INITIALIZATION
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
      ResultsModule.initResultsPage(parks);
      break;
    case 'park-detail.html':
      initParkDetailPage();
      break;
    case 'favorites.html':
      FavoritesModule.displayFavoritesPage();
      break;
    case 'plans.html':
      DayPlanModule.initPlanForm(parks);
      DayPlanModule.displayPlans();
      break;
  }
}

/* ========================================
   HOME PAGE
   ======================================== */

/**
 * Initialize home page with search and featured parks
 */
function initHomePage() {
  SearchModule.initSearchForm(parks);
  
  // Display first 4 featured parks
  const featured = parks.filter(p => p.featured).slice(0, 4);
  displayFeaturedParks(featured);
}

/**
 * Display featured parks on home page
 * @param {Array} parks - Array of featured park objects
 */
function displayFeaturedParks(parks) {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  
  // Generate HTML for each featured park card
  grid.innerHTML = parks.map(park => `
    <div class="park-card">
      <img src="${park.image}" alt="${park.name}">
      <div class="park-card-content">
        <h3>${park.name}</h3>
        <p class="state">${park.state}</p>
        <a href="park-detail.html?park=${encodeURIComponent(park.name)}" class="btn">View Details</a>
      </div>
    </div>
  `).join('');
}

/* ========================================
   PARK DETAIL PAGE
   ======================================== */

/**
 * Initialize park detail page with all modules
 * Loads park info, alerts, nearby places, and map
 */
function initParkDetailPage() {
  ParkDetailsModule.initParkDetailsPage(parks);
  // TODO: Replace with actual park code from URL params
  AlertsModule.initAlerts('mock-park-code');
  // TODO: Replace with actual coordinates from selected park
  NearbyModule.initNearby(47.7511, -121.7369);
  MapModule.initMap(47.7511, -121.7369, 'Park Name');
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
document.addEventListener('DOMContentLoaded', loadParks);

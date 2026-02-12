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

// Global parks data
let parks = [];

/* ========================================
   DATA LOADING
   ======================================== */

// Load parks data from JSON
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

// Initialize page based on current route
function initializePage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Initialize common elements
  initMenuToggle();
  updateFooter();
  
  // Page-specific initialization
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

// Initialize home page
function initHomePage() {
  SearchModule.initSearchForm(parks);
  
  const featured = parks.filter(p => p.featured).slice(0, 4);
  displayFeaturedParks(featured);
}

// Display featured parks on home page
function displayFeaturedParks(parks) {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  
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

// Initialize park detail page
function initParkDetailPage() {
  ParkDetailsModule.initParkDetailsPage(parks);
  AlertsModule.initAlerts('mock-park-code');
  NearbyModule.initNearby(47.7511, -121.7369);
  MapModule.initMap(47.7511, -121.7369, 'Park Name');
}

/* ========================================
   UI COMPONENTS
   ======================================== */

// Initialize menu toggle
function initMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');
  
  if (!menuToggle || !nav) return;
  
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
}

// Update footer with current year and last modified
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

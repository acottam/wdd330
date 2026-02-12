// Main application controller
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

// Load parks data
async function loadParks() {
  try {
    const response = await fetch('data/parks-list.json');
    parks = await response.json();
    initializePage();
  } catch (error) {
    console.error('Error loading parks:', error);
  }
}

// Initialize page based on current route
function initializePage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Initialize menu toggle
  initMenuToggle();
  
  // Initialize footer
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

// Initialize home page
function initHomePage() {
  // Setup search
  SearchModule.initSearchForm(parks);
  
  // Display featured parks
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

// Initialize park detail page
function initParkDetailPage() {
  ParkDetailsModule.initParkDetailsPage(parks);
  
  // Initialize alerts (mock data for now)
  AlertsModule.initAlerts('mock-park-code');
  
  // Initialize nearby places (mock data for now)
  NearbyModule.initNearby(47.7511, -121.7369); // Example coordinates
  
  // Initialize map (mock for now)
  MapModule.initMap(47.7511, -121.7369, 'Park Name');
}

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

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', loadParks);

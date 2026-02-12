// Load parks from JSON
let parks = [];

// Function: Load parks and initialize page - data/parks-list.json
async function loadParks() {
  
  // Fetch parks data
  try {
    
    // Fetch the parks data
    const response = await fetch('data/parks-list.json');
    parks = await response.json();
    
    // Check which page we're on
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Page-specific logic
    if (currentPage === 'parks.html') {
      
      // Parks page logic: select random park for hero
      const randomPark = parks[Math.floor(Math.random() * parks.length)];
      
      // Set random hero image
      const hero = document.querySelector('.parks-page-hero');
      hero.style.backgroundImage = `linear-gradient(rgba(11, 61, 46, 0.6), rgba(11, 61, 46, 0.6)), url('${randomPark.image}')`;
      document.getElementById('hero-caption').textContent = randomPark.name;
      
      // Sort parks alphabetically - Default view
      parks.sort((a, b) => a.name.localeCompare(b.name));
      
      // Initial display of all parks on parks page
      displayParksPage(parks);
    
    } else if (currentPage === 'itineraries.html') {
      // Itineraries page logic
      const randomPark = parks[Math.floor(Math.random() * parks.length)];
      
      // Set random hero image
      const hero = document.querySelector('.itinerary-page-hero');
      hero.style.backgroundImage = `linear-gradient(rgba(11, 61, 46, 0.6), rgba(11, 61, 46, 0.6)), url('${randomPark.image}')`;
      document.getElementById('hero-caption').textContent = randomPark.name;
      
      // Generate itineraries cards
      generateItinerariesPage(parks);
      
    } else if (currentPage === 'tips.html') {
      // Tips page logic: select random park for hero
      const randomPark = parks[Math.floor(Math.random() * parks.length)];
      
      // Set random hero image
      const hero = document.querySelector('.tips-page-hero');
      hero.style.backgroundImage = `linear-gradient(rgba(11, 61, 46, 0.6), rgba(11, 61, 46, 0.6)), url('${randomPark.image}')`;
      document.getElementById('hero-caption').textContent = randomPark.name;
      
      // Populate park dropdown
      populateParkDropdown(parks);

    } else {
      // Home page logic: select random park for hero
      const randomPark = parks[Math.floor(Math.random() * parks.length)];
      
      // Set random hero image
      const hero = document.querySelector('.hero');
      hero.style.backgroundImage = `linear-gradient(rgba(11, 61, 46, 0.6), rgba(11, 61, 46, 0.6)), url('${randomPark.image}')`;
      document.getElementById('hero-caption').textContent = randomPark.name;
      
      // Select 4 random featured parks for display
      const featured = parks.filter(p => p.featured);
      
      // Shuffle and pick first 4
      const shuffled = featured.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 4);
      
      // Display parks: on home page load
      displayParks(selected);

      // Generate modals: on home page load
      generateModals(selected);

      // Generate itinerary previews: on home page load
      generateItineraryPreviews(parks);
    }

  } catch (error) {

    // Catch: Handle fetch error - log to console
    console.error('Error loading parks:', error);
  }
}

// Function: Populate park dropdown (tips page)
function populateParkDropdown(parks) {

  // Populate park select dropdown
  const parkSelect = document.getElementById('park');
  
  // Sort parks alphabetically
  parks.sort((a, b) => a.name.localeCompare(b.name));
  
  // Iterate and add options
  parks.forEach(park => {
    // Create option element
    const option = document.createElement('option');
    
    // Build option
    option.value = park.name;
    option.textContent = park.name;
    
    // Append option to select
    parkSelect.appendChild(option);
  });
  
  // Pre-select park from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPark = urlParams.get('park');
  
  // Get Park (if selected)
  if (selectedPark) {
    parkSelect.value = selectedPark;
  }
}

// Generate itineraries (itineraries page)
function generateItinerariesPage(parks) {

  // Filter parks with itineraries
  const parksWithItineraries = parks.filter(p => p.itinerary);
  
  // Get container for itineraries
  const container = document.getElementById('itineraries-container');
  
  // Build itinerary sections
  container.innerHTML = parksWithItineraries.map(park => {
    const daysHTML = park.itinerary.days.map((day, index) => `
      <div class="day day${index + 1}">
        <h5>${day.day}</h5>
        <ul>
          ${day.activities.map(activity => `<li>${activity}</li>`).join('')}
        </ul>
      </div>
    `).join('');
    
    // Upsell for 2-day itineraries (if three days not present)
    const upsellHTML = park.itinerary.days.length === 2 ? `
      <div class="day day-upsell">
        <h5>Why Not Stay Another Day?</h5>
        <p>Extend your adventure! The area surrounding ${park.name} offers incredible family-friendly activities, local attractions, and hidden gems waiting to be discovered. Make it a 3-day getaway and create even more unforgettable memories!</p>
      </div>
    ` : '';
    
    // Return itinerary section
    return `
      <section class="itinerary ${park.region}">
        <div class="itinerary-hero">
          <img src="${park.image}" alt="${park.name}">
          <h3 class="hero-title">${park.name}</h3>
        </div>
        <h3>${park.name}</h3>
        <h4>${park.itinerary.title}</h4>
        <div class="days-container">
          ${daysHTML}
          ${upsellHTML}
        </div>
        <div class="itinerary-cta">
          <a href="tips.html?park=${encodeURIComponent(park.name)}" class="cta-btn">Get Planning Tips for ${park.name}</a>
        </div>
      </section>
    `;
  }).join('');
}

// function: Generate itinerary previews - home page
function generateItineraryPreviews(allParks) {
  
  // Filter parks with showcase and itinerary
  const showcaseParks = allParks.filter(p => p.showcase && p.itinerary).slice(0, 3);
  
  // Get container for previews
  const container = document.getElementById('itinerary-preview-grid');
  
  // Build previews
  container.innerHTML = showcaseParks.map(park => {
    const highlights = park.itinerary.days.slice(0, 3).map(day => 
      day.activities[0] || day.day
    );
    
    // Return preview article
    return `
      <article class="itinerary-preview">
        <h3>${park.itinerary.title}</h3>
        <p>${park.description}</p>
        <ul>
          ${highlights.map(highlight => `<li>${highlight}</li>`).join('')}
        </ul>
      </article>
    `;
  }).join('');
}

// Function: Generate modals dynamically - home page
function generateModals(parksToShow) {
  
  // Get modal container
  const container = document.getElementById('modal-container');
  
  // Build modals
  container.innerHTML = parksToShow.map(park => {
    if (!park.itinerary) return '';
    
    const modalId = park.name.toLowerCase().replace(/\s+/g, '-') + '-modal';
    const daysHTML = park.itinerary.days.map(day => `
      <h4>${day.day}</h4>
      <ul>
        ${day.activities.map(activity => `<li>${activity}</li>`).join('')}
      </ul>
    `).join('');
    
    // Return modal HTML
    return `
      <div id="${modalId}" class="modal">
        <div class="modal-content">
          <div class="modal-header modal-header-image">
            <img src="${park.image}" alt="${park.name}">
            <div class="modal-header-overlay">
              <span class="close">&times;</span>
              <h3>${park.itinerary.title}</h3>
            </div>
          </div>
          <div class="modal-body">
            ${daysHTML}
            <div class="modal-cta">
              <a href="tips.html?park=${encodeURIComponent(park.name)}" class="cta-btn">Get Planning Tips for ${park.name}</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Re-attach modal event listeners
  attachModalListeners();
}

// Function: Attach modal event listeners - home page
function attachModalListeners() {
  
  // Get all close buttons and modals
  const closeButtons = document.querySelectorAll('.close');
  const modals = document.querySelectorAll('.modal');

  // Close button functionality
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.modal').style.display = 'none';
    });
  });

  // Click outside to close
  window.addEventListener('click', (e) => {
    modals.forEach(modal => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
}

// Function: Display parks - home page
function displayParks(parksToShow) {
  
  // Get grid container
  const grid = document.getElementById('featured-grid');
  
  // Build grid
  grid.innerHTML = parksToShow.map(park => `
    <article class="park-card">
      <img src="${park.image}" alt="${park.name}" loading="lazy">
      <div class="park-card-content">
        <span class="region">${park.region.toUpperCase()}</span>
        <h3>${park.name}</h3>
        <p class="state">${park.state}</p>
        <p>${park.description}</p>
        <p><strong>Best Season:</strong> ${park.season}</p>
        <p><strong>Top Activity:</strong> ${park.activity}</p>
        <a href="#" class="btn view-itinerary" data-modal="${park.name.toLowerCase().replace(/\s+/g, '-')}-modal">View Sample Itinerary</a>
      </div>
    </article>
  `).join('');
  
  // Add modal event listeners
  document.querySelectorAll('.view-itinerary').forEach(link => {
    link.addEventListener('click', (e) => {
      
      // Prevent default link behavior
      e.preventDefault();
      
      // Get modal ID and show modal
      const modalId = link.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      
      // Show modal if found
      if (modal) {
        modal.style.display = 'block';
      }
    });
  });
}

// Display parks (parks page)
function displayParksPage(parksToShow) {
  
  // Get grid container
  const grid = document.getElementById('park-grid');
  
  // Build grid
  grid.innerHTML = parksToShow.map(park => `
    <article class="park-card">
      <img src="${park.image}" alt="${park.name}" loading="lazy">
      <div class="park-card-content">
        <span class="region">${park.region.toUpperCase()}</span>
        <h3>${park.name}</h3>
        <p class="state">${park.state}</p>
        <p>${park.description}</p>
        <p><strong>Best Season:</strong> ${park.season}</p>
        <p><strong>Top Activity:</strong> ${park.activity}</p>
        <a href="#" class="btn view-park-details" data-park="${park.name}">View Details</a>
      </div>
    </article>
  `).join('');
  
  // Add modal event listeners
  document.querySelectorAll('.view-park-details').forEach(link => {
    
    // Click event to open park details modal
    link.addEventListener('click', (e) => {

      // Prevent default link behavior
      e.preventDefault();
      
      // Get park name and find park data
      const parkName = link.getAttribute('data-park');
      const park = parks.find(p => p.name === parkName);
      
      // Open park modal if found
      if (park) {
        openParkModal(park);
      }
    });
  });
}

// Function: Open park details modal (parks page)
function openParkModal(park) {
  
  // Create park details modal
  const modalId = 'park-details-modal';
  let modal = document.getElementById(modalId);
  
  // Create modal if it doesn't exist
  if (!modal) {
    
    // Create modal element
    modal = document.createElement('div');
    
    // Set attributes
    modal.id = modalId;
    modal.className = 'modal';

    // Append to body
    document.body.appendChild(modal);
  }
  
  // Build modal content
  const itineraryHTML = park.itinerary ? `
    <h4>Sample Itinerary: ${park.itinerary.title}</h4>
    ${park.itinerary.days.map(day => `
      <h5>${day.day}</h5>
      <ul>
        ${day.activities.map(activity => `<li>${activity}</li>`).join('')}
      </ul>
    `).join('')}
  ` : '<p>No itinerary available for this park.</p>';
  
  
  // Set modal inner HTML
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header modal-header-image">
        <img src="${park.image}" alt="${park.name}">
        <div class="modal-header-overlay">
          <span class="close">&times;</span>
          <h3>${park.name} National Park</h3>
        </div>
      </div>
      <div class="modal-body">
        <p><strong>Location:</strong> ${park.state}</p>
        <p><strong>Region:</strong> ${park.region.toUpperCase()}</p>
        <p><strong>Best Season:</strong> ${park.season}</p>
        <p><strong>Top Activity:</strong> ${park.activity}</p>
        <p>${park.description}</p>
        ${itineraryHTML}
        <div class="modal-cta">
          <a href="tips.html?park=${encodeURIComponent(park.name)}" class="cta-btn">Get Planning Tips for ${park.name}</a>
        </div>
      </div>
    </div>
  `;
  
  // Show modal
  modal.style.display = 'block';
  
  // Close button
  modal.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Click outside to close
  window.addEventListener('click', (e) => {
    
    // Close modal if clicked outside of content
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Function: Filter and sort - parks page
function filterAndSort() {
  
  // Get selected region
  const region = document.getElementById('region-filter').value;
  
  // Get selected sort option
  const sort = document.getElementById('sort-filter').value;
  
  // Filter parks by region
  let filtered = region === 'all' ? [...parks] : parks.filter(p => p.region === region);
  
  // Sort parks
  if (sort === 'name') {  
    // Sort by name
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'region') {
    // Sort by region
    filtered.sort((a, b) => a.region.localeCompare(b.region));
  } else if (sort === 'season') {
    // Sort by season
    filtered.sort((a, b) => a.season.localeCompare(b.season));
  }
  
  // Display filtered and sorted parks
  displayParksPage(filtered);
}

// Function: Display parks (home page)
function displayParks(parksToShow) {

  // Get grid container
  const grid = document.getElementById('featured-grid');
  
  // Build grid
  grid.innerHTML = parksToShow.map(park => `
    <article class="park-card">
      <img src="${park.image}" alt="${park.name}" loading="lazy">
      <div class="park-card-content">
        <span class="region">${park.region.toUpperCase()}</span>
        <h3>${park.name}</h3>
        <p class="state">${park.state}</p>
        <p>${park.description}</p>
        <p><strong>Best Season:</strong> ${park.season}</p>
        <p><strong>Top Activity:</strong> ${park.activity}</p>
        <a href="#" class="btn view-itinerary" data-modal="${park.name.toLowerCase().replace(/\s+/g, '-')}-modal">View Sample Itinerary</a>
      </div>
    </article>
  `).join('');
  
  // Add modal event listeners
  document.querySelectorAll('.view-itinerary').forEach(link => {
    
    // Click event to open modal
    link.addEventListener('click', (e) => {
      // Prevent default link behavior
      e.preventDefault();

      // Get modal ID
      const modalId = link.getAttribute('data-modal');
      
      // Get modal element
      const modal = document.getElementById(modalId);
      
      // Show modal if found
      if (modal) {
        modal.style.display = 'block';
      }
    });
  });
}

// Menu toggle
document.getElementById('menu-toggle').addEventListener('click', () => {
  
  // Toggle nav visibility
  const nav = document.getElementById('primary-nav');
  const btn = document.getElementById('menu-toggle');
  nav.classList.toggle('open');
  nav.classList.toggle('closed');
  btn.classList.toggle('open');

  // Update ARIA attribute
  btn.setAttribute('aria-expanded', nav.classList.contains('open'));
});

// Filter listeners (parks page only)
const regionFilter = document.getElementById('region-filter');
const sortFilter = document.getElementById('sort-filter');

// Attach event listeners if filters exist
if (regionFilter && sortFilter) {
  regionFilter.addEventListener('change', filterAndSort);
  sortFilter.addEventListener('change', filterAndSort);
}

// Form submission handler (tips page)
const planningForm = document.getElementById('planning-form');

// Attach submit event listener
if (planningForm) {
  
  // Add submit event listener
  planningForm.addEventListener('submit', (e) => {
    
    // Prevent default form submission
    let submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    
    // Push new submission
    submissions.push({
      timestamp: new Date().toISOString(),
      count: submissions.length + 1
    });

    // Save back to localStorage
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));
  });
}

// Thank you page logic
const currentPageCheck = window.location.pathname.split('/').pop() || 'index.html';

// Page: thankyou.html
if (currentPageCheck === 'thankyou.html') {
  
  // Get URL parameters
  const params = new URLSearchParams(window.location.search);
  const detailsDiv = document.getElementById('submission-details');
  
  // Display submission details
  if (detailsDiv) {
    // Build details HTML
    const details = [];
    
    // Add each detail if present
    if (params.get('name')) details.push(`<p><strong>Name:</strong> ${params.get('name')}</p>`);
    if (params.get('email')) details.push(`<p><strong>Email:</strong> ${params.get('email')}</p>`);
    if (params.get('park')) details.push(`<p><strong>Park of Interest:</strong> ${params.get('park')}</p>`);
    if (params.get('travel-date')) details.push(`<p><strong>Travel Date:</strong> ${params.get('travel-date')}</p>`);
    if (params.get('party-size')) details.push(`<p><strong>Party Size:</strong> ${params.get('party-size')} people</p>`);
    if (params.get('interests')) details.push(`<p><strong>Special Interests:</strong> ${params.get('interests')}</p>`);
    
    // Set inner HTML
    detailsDiv.innerHTML = details.join('');
  }
  
  // Display submission stats
  const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
  const statsDiv = document.getElementById('submission-stats');
  
  // Build stats HTML
  if (statsDiv && submissions.length > 0) {
    
    // Get latest submission
    const latest = submissions[submissions.length - 1];
    
    // Format timestamp
    const timestamp = new Date(latest.timestamp).toLocaleString();
    
    // Set stats HTML
    statsDiv.innerHTML = `
      <div class="stats-box">
        <h3>Your Submission Stats</h3>
        <p><strong>Total Submissions:</strong> ${submissions.length}</p>
        <p><strong>Latest Submission:</strong> ${timestamp}</p>
      </div>
    `;
  }
}

// Footer dates
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastmodified').textContent = `Last Modified: ${document.lastModified}`;

// Set active navigation
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Highlight active nav link
document.querySelectorAll('.nav a').forEach(link => {
  
  // Check if link matches current page
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

// Load and display parks
loadParks();
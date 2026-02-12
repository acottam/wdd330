# wdd330
WDD330 -- W04: Final Project Proposal\
Adam Cottam -- Jan 31, 2026

**PNW Family Adventure Finder**

**Overview**\
PNW Family Adventure Finder is a Node.js web application that helps
families plan simple outdoor day trips in the Pacific Northwest. It
combines park information, current alerts, and nearby food or amenities
into one place, then lets users save a lightweight "day plan." The goal
is to reduce planning friction so families can spend less time
researching and more time outside.

**Target Audience**\
Planning a kid-friendly outing often means bouncing between multiple
sites for park details, closures, and food options. This app is designed
for quick, low-stress planning on mobile or desktop.

- **Primary users:** parents or guardians planning family-friendly
  hikes, parks, and day trips.

- **Secondary users:** visitors to the region or anyone who wants fast
  outdoor ideas with nearby food options.

**Major Functions**

- **Search by location or park name:** find parks based on a city/ZIP or
  park name query.

- **"Park Results" list:** display matching parks with basic sorting and
  filters (example: distance, name).

- **"Park Details" view:** show description, location, and key links for
  the selected park.

- **Current alerts:** display closures or safety notices relevant to the
  selected park.

- **Nearby eats and amenities:** show nearby restaurants, coffee, and
  kid-friendly spots with ratings.

- **Map view:** visualize the park and nearby places on a map for quick
  orientation.

- **Favorites:** save parks and nearby spots for later using local
  storage.

- **Day plan builder:** create and save a simple plan (park, notes, and
  selected nearby stops).

- **Saved plans list:** view, edit, or delete previously saved plans.

**Wireframes**\
Wireframes will be included for the following major views (mobile and
desktop):

- Home / Search

- Results List

- Park Details (includes alerts and nearby eats)

- Favorites

- Day Plans (create/edit and saved plans list)

  (more details below)

  **Mobile + Desktop Wireframes**

  ![](media/image2.svg){width="6.504508967629047in"
  height="9.177083333333334in"}

**External Data**

- **National Park Service API:** park details and current alerts.

- **Yelp Fusion API:** nearby food and amenities (ratings, categories,
  location).

- **Mapbox or OpenStreetMap Nominatim:** geocoding (text to coordinates)
  and map display.

**Data Storage**

- Favorites stored in localStorage.

- Saved day plans stored in localStorage (park, selected spots, date,
  and notes).

**Module List**

- **Search module:** capture user input and run park queries.

- **Results module:** render park search results and basic filters.

- **Park details module:** display park information and integrate
  alerts.

- **Alerts module:** fetch and present current notices for a park.

- **Nearby module:** fetch and render Yelp results near the park.

- **Map module:** show park and nearby markers with simple interactions.

- **Favorites module:** localStorage save and retrieve favorite items.

- **Day plan module:** create, edit, save, and list day plans.

**Graphic Identity**

> **Colors:**

- **Primary (Evergreen):** #0B3D2E

- **Secondary (River Blue):** #1D6FA3

- **Accent (Sunrise):** #F4A261

- **Background (Mist):** #F3F6F8 Looks like this 🡪(**Background**)

- **Text (Charcoal):** #1F2933

> **Typography:**

- **Headings:** Raleway (600--700)\
  ![A black and white text AI-generated content may be
  incorrect.](media/image3.png){width="3.181198600174978in"
  height="0.40269903762029746in"}\
  ![](media/image4.png){width="2.9794717847769028in"
  height="0.36829615048118985in"}

- **Body:** Open Sans (400--600)\
  ![A black and white sign with white text AI-generated content may be
  incorrect.](media/image5.png){width="3.123753280839895in"
  height="0.4521380139982502in"}\
  ![A black background with white text AI-generated content may be
  incorrect.](media/image6.png){width="3.2355522747156606in"
  height="0.42980205599300086in"}

> **Icon design:**
>
> A simple compass circle with a pine tree silhouette and a small map
> pin, sized to read clearly at small app icon dimensions.

**Timeline (Weeks 5--7)**

> **Week 5**

- Finalize wireframes and visual style guide (colors, fonts, icon).

- Set up Node.js/Express structure and environment variables.

- Implement search flow and connect to the NPS API to display park
  results.

> **Week 6**

- Build "Park Details" view and display current alerts.

- Integrate Yelp nearby eats and map view.

- Implement favorites using localStorage and improve responsive layout.

> **Week 7**

- Build day plan create/edit/list features (localStorage).

- Add loading and error states across views.

- Final testing (mobile and desktop), accessibility checks, and
  deployment.

**Project Planning**

> **Trello board link:** <https://trello.com/b/Iayyrx2E/my-trello-board>
>
> **Initial task cards will include:**

- Wireframes (mobile and desktop) for core views

- API integrations (NPS, Yelp, geocoding)

- UI pages (home, results, details, favorites, plans)

- LocalStorage (favorites, day plans)

- Error handling and loading states

- Responsive styling and final QA checklist

**Challenges**

- **API key safety:** keep third-party keys on the server side and proxy
  requests through Node.

- **Rate limits and reliability:** handle throttling and missing data
  with graceful fallbacks.

- **Location accuracy:** geocoding and "nearby" radius tuning for
  relevant results.

- **Map UX on mobile:** keep maps useful without overwhelming the
  screen.

- **Scope control:** prioritize MVP features and avoid feature creep.

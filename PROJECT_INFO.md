# PNW Family Adventure Finder

## Technology Stack

This project uses **VANILLA JAVASCRIPT ONLY** - no frameworks or build tools.

### What's Used:
- ✓ **Vanilla JavaScript** (ES6 modules)
- ✓ **Native Browser APIs** (fetch, localStorage, geolocation)
- ✓ **Leaflet.js** (mapping library via CDN - not a framework)
- ✓ **HTML5 & CSS3**

### What's NOT Used:
- ✗ No JavaScript frameworks (React, Vue, Angular, etc.)
- ✗ No Node.js runtime (runs in browser only)
- ✗ No build tools (Webpack, Vite, etc.)
- ✗ No package managers for client code

## APIs Integrated:
1. **National Park Service API** - Park data and alerts
2. **Yelp Fusion API** - Nearby restaurants and amenities
3. **OpenStreetMap Nominatim** - Geocoding (no key required)
4. **Leaflet.js + OpenStreetMap** - Interactive maps

## Running the Application:

### Option 1: Direct File Access
Simply open `index.html` in your browser.

### Option 2: Local HTTP Server
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if available)
npx http-server
```

Then visit: `http://localhost:8000`

## Project Structure:
```
/scripts/          - Vanilla JavaScript modules
/styles/           - CSS files
/images/           - Image assets
/data/             - Static JSON data
/_unused_nodejs/   - Old Node.js files (NOT USED)
*.html             - HTML pages
```

## Note on API Keys:
API keys are exposed in `scripts/config.js` for demonstration purposes only.
In production, these should be protected with a backend server.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// NPS API proxy - specific park by code (must come before general search)
app.get('/api/parks/:parkCode', async (req, res) => {
  const { parkCode } = req.params;
  try {
    const response = await fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${process.env.NPS_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch park' });
  }
});

// NPS API proxy - general search
app.get('/api/parks', async (req, res) => {
  const { stateCode, q } = req.query;
  const params = new URLSearchParams({ api_key: process.env.NPS_API_KEY });
  if (stateCode) params.append('stateCode', stateCode);
  if (q) params.append('q', q);
  
  try {
    const response = await fetch(`https://developer.nps.gov/api/v1/parks?${params}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch parks' });
  }
});

app.get('/api/alerts/:parkCode', async (req, res) => {
  const { parkCode } = req.params;
  try {
    const response = await fetch(`https://developer.nps.gov/api/v1/alerts?parkCode=${parkCode}&api_key=${process.env.NPS_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Yelp API proxy
app.get('/api/nearby', async (req, res) => {
  const { latitude, longitude, radius = 8000 } = req.query;
  try {
    const response = await fetch(`https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&radius=${radius}&categories=restaurants,food`, {
      headers: { 'Authorization': `Bearer ${process.env.YELP_API_KEY}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nearby places' });
  }
});

// Nominatim geocoding proxy
app.get('/api/geocode', async (req, res) => {
  const { q } = req.query;
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`, {
      headers: { 'User-Agent': 'PNW-Family-Adventure-Finder' }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to geocode location' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

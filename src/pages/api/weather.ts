import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { location } = req.query;

  if (!location) {
    res.status(400).json({ error: 'Location is required' });
    return;
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
  console.log('API Key:', apiKey); // Log the API key

  if (!apiKey) {
    res.status(500).json({ error: 'API key is missing' });
    return;
  }

  try {
    console.log(`Fetching geographical coordinates for ${location}`);
    const geoResponse = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`
    );
    console.log('Geo API response status:', geoResponse.status);

    if (!geoResponse.ok) {
      const geoErrorText = await geoResponse.text();
      console.error('Geo API response:', geoResponse.status, geoErrorText);
      res.status(geoResponse.status).json({ error: 'Failed to fetch geographical coordinates' });
      return;
    }

    const geoData = await geoResponse.json();
    console.log('Geo API data:', geoData);

    if (!geoData.length) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    const { lat, lon } = geoData[0];
    console.log(`Fetching weather data for coordinates: ${lat}, ${lon}`);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`;

    const weatherResponse = await fetch(weatherUrl);
    console.log('Weather API response status:', weatherResponse.status);

    if (!weatherResponse.ok) {
      const weatherErrorText = await weatherResponse.text();
      console.error('Weather API response:', weatherResponse.status, weatherErrorText);
      res.status(weatherResponse.status).json({ error: 'Failed to fetch weather data' });
      return;
    }

    const weatherData = await weatherResponse.json();
    console.log('Weather API data:', weatherData);
    res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



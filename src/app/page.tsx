// src/app/page.tsx
'use client';

import { useState } from 'react';
import WeatherCard from '../../components/WeatherCard';

export default function Home() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    setError('');
    try {
      const res = await fetch(`/api/weather?location=${location}`);
      const data = await res.json();
      console.log('API response:', data);
      if (data.error) {
        setError(data.error);
        return;
      }
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Weather App</h1>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2 rounded-lg mb-4"
      />
      <button
        onClick={fetchWeather}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Get Weather
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {weatherData && (
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Current Weather</h2>
            <WeatherCard
              date="Now"
              temperature={weatherData.current.temp}
              description={weatherData.current.weather[0].description}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold">5-Day Forecast</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {weatherData.daily.map((day: any, index: number) => (
                <WeatherCard
                  key={index}
                  date={new Date(day.dt * 1000).toLocaleDateString()}
                  temperature={day.temp.day}
                  description={day.weather[0].description}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

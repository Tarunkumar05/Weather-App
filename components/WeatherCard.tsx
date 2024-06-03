// components/WeatherCard.tsx
import React from 'react';

type WeatherCardProps = {
  date: string;
  temperature: string;
  description: string;
};

const WeatherCard: React.FC<WeatherCardProps> = ({ date, temperature, description }) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold">{date}</h3>
      <p className="text-lg">{temperature}°C</p>
      <p className="text-md">{description}</p>
    </div>
  );
};

export default WeatherCard;

import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Sun, Moon, CloudRain, Cloud, Wind, Droplets,
  Thermometer, Sunrise, Sunset, Gauge, Zap, Search
} from "lucide-react";


function WeatherPage() {
  const { city } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    if (location.trim()) {
      navigate(`/weather/${encodeURIComponent(location.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Placeholder demo data — replace with real API integration
  const weather = {
    temp: 26,
    condition: "Cloudy",
    humidity: 72,
    wind: 12,
    pressure: 1012,
    sunrise: "06:12 AM",
    sunset: "06:42 PM",
  };

  const hourly = [
    { time: "09:00", temp: 25, icon: <Cloud className="w-6 h-6" /> },
    { time: "12:00", temp: 28, icon: <Sun className="w-6 h-6" /> },
    { time: "15:00", temp: 27, icon: <CloudRain className="w-6 h-6" /> },
    { time: "18:00", temp: 24, icon: <Moon className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 p-4">
      <nav className="bg-white/80 backdrop-blur-md py-4 px-8 rounded-full shadow-lg mx-auto w-full max-w-4xl mt-1 mb-6 border border-amber-200/50">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-amber-800">WeatherAi</Link>
          <div className="flex space-x-6">
            <a href="#features" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">Features</a>
            <Link to="/about" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">About</Link>
          </div>
        </div>
      </nav>
      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-amber-900">
          Weather in {city}
        </h1>
        <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-lg p-2 w-full max-w-md border border-amber-300/50">
          <input
            type="text"
            placeholder="Enter location (e.g., New Delhi)"
            className="flex-grow px-4 py-2 outline-none bg-transparent text-amber-900 placeholder-amber-600"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            onClick={handleSearch}
            className="bg-amber-600 text-white p-3 rounded-full hover:bg-amber-700 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Current Weather Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Temperature Card */}
        <div className="bg-gradient-to-br from-amber-100/80 to-orange-200/80 backdrop-blur-md rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center border border-amber-300/40">
          <Thermometer className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-5xl font-bold text-amber-900">{weather.temp}°C</p>
          <p className="text-lg text-amber-800">{weather.condition}</p>
        </div>

        {/* Extra Metrics */}
        <div className="bg-gradient-to-br from-amber-100/80 to-orange-200/80 backdrop-blur-md rounded-2xl p-6 shadow-lg grid grid-cols-2 gap-6 border border-amber-300/40">
          <div className="flex items-center space-x-3">
            <Droplets className="w-8 h-8 text-cyan-500" />
            <div>
              <p className="text-amber-700 text-sm">Humidity</p>
              <p className="font-bold text-amber-900">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Wind className="w-8 h-8 text-indigo-500" />
            <div>
              <p className="text-amber-700 text-sm">Wind</p>
              <p className="font-bold text-amber-900">{weather.wind} km/h</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Gauge className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-amber-700 text-sm">Pressure</p>
              <p className="font-bold text-amber-900">{weather.pressure} hPa</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-amber-700 text-sm">Alerts</p>
              <p className="font-bold text-amber-900">None</p>
            </div>
          </div>
        </div>

        {/* Sunrise / Sunset */}
        <div className="bg-gradient-to-br from-amber-100/80 to-orange-200/80 backdrop-blur-md rounded-2xl p-6 shadow-lg flex flex-col justify-center border border-amber-300/40">
          <div className="flex items-center space-x-4 mb-4">
            <Sunrise className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-amber-700 text-sm">Sunrise</p>
              <p className="font-bold text-amber-900">{weather.sunrise}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Sunset className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-amber-700 text-sm">Sunset</p>
              <p className="font-bold text-amber-900">{weather.sunset}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hourly Forecast */}
      <section className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Hourly Forecast</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {hourly.map((h, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-amber-100/80 to-orange-200/80 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center shadow hover:scale-105 transition border border-amber-300/40"
            >
              <p className="text-amber-700 text-sm mb-2">{h.time}</p>
              {h.icon}
              <p className="font-bold text-amber-900 mt-2">{h.temp}°C</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Insights Placeholder */}
      <section className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">AI Insights</h2>
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
          <p>
            Based on current conditions, expect mild weather with scattered clouds.
            No severe events predicted in the next 24 hours. Winds may increase slightly
            during the evening.
          </p>
        </div>
      </section>
    </div>
  );
}

export default WeatherPage;

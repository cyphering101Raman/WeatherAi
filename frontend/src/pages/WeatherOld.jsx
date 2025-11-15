import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    Search, 
    Droplets, 
    Wind, 
    Thermometer, 
    Gauge, 
    Eye,
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    Zap,
    CloudDrizzle
} from 'lucide-react';

const WeatherOld = () => {
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
    const [city, setCity] = useState('Miami');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Weather icon mapping based on OpenWeatherMap weather codes
    const getWeatherIcon = (weatherId) => {
        if (weatherId >= 200 && weatherId < 300) return <Zap className="w-16 h-16 text-yellow-500" />; // Thunderstorm
        if (weatherId >= 300 && weatherId < 400) return <CloudDrizzle className="w-16 h-16 text-blue-400" />; // Drizzle
        if (weatherId >= 500 && weatherId < 600) return <CloudRain className="w-16 h-16 text-blue-600" />; // Rain
        if (weatherId >= 600 && weatherId < 700) return <CloudSnow className="w-16 h-16 text-blue-200" />; // Snow
        if (weatherId >= 700 && weatherId < 800) return <Cloud className="w-16 h-16 text-gray-500" />; // Atmosphere
        if (weatherId === 800) return <Sun className="w-16 h-16 text-yellow-500" />; // Clear
        if (weatherId > 800) return <Cloud className="w-16 h-16 text-gray-400" />; // Clouds
        return <Cloud className="w-16 h-16 text-gray-400" />;
    };

    const getWeatherDescription = (weatherId) => {
        if (weatherId >= 200 && weatherId < 300) return "Thunderstorm";
        if (weatherId >= 300 && weatherId < 400) return "Drizzle";
        if (weatherId >= 500 && weatherId < 600) return "Rain";
        if (weatherId >= 600 && weatherId < 700) return "Snow";
        if (weatherId >= 700 && weatherId < 800) return "Atmosphere";
        if (weatherId === 800) return "Clear Sky";
        if (weatherId > 800) return "Clouds";
        return "Unknown";
    };

    useEffect(() => {
        fetchWeather('Mumbai');
    }, []);

    const fetchWeather = async (cityName) => {
        if (!cityName.trim()) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`);
            const data = response.data;

            if (data.cod !== 200) {
                setError("City not found. Please try again.");
                return;
            }

            setWeatherData({
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                windSpeed: data.wind.speed,
                windGust: data.wind.gust,
                windDirection: data.wind.deg,
                visibility: data.visibility / 1000, // Convert to km
                location: data.name,
                country: data.sys.country,
                weatherId: data.weather[0].id,
                weatherDescription: data.weather[0].description,
                cloudCover: data.clouds.all,
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                }),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                })
            });
            setCity("");

        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError("City not found. Please try again.");
            } else {
                setError("Failed to fetch weather data. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchWeather(city);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 left-40 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            </div>

            {/* Navigation */}
            <nav id="#classic-ui" className="relative z-10 bg-black/20 backdrop-blur-md py-4 px-8 rounded-full shadow-2xl mx-auto w-full max-w-4xl mt-4 mb-8 border border-white/10">
                <div className="flex justify-between items-center">
                    <Link to="/classic-ui" className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        WeatherAi
                    </Link>
                    <div className="flex space-x-8">
                        <Link to="/" className="text-white/80 hover:text-white font-medium transition-all duration-300 hover:scale-105">
                            New Look
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
                        Weather in Real Time
                    </h1>
                    <p className="text-xl text-white/70 mb-8">Discover the weather anywhere in the world</p>
                </div>

                {/* Search Section */}
                <div className="bg-black/30 backdrop-blur-xl rounded-full shadow-2xl p-6 mb-12 border border-white/20 max-w-2xl mx-auto">
                    <div className="flex items-center space-x-4">
                        <div className="flex-grow relative">
                            <input
                                type="text"
                                placeholder="Search for any city..."
                                className="w-full px-6 py-4 pr-16 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/60 text-lg"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <button
                                onClick={() => fetchWeather(city)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
                                disabled={loading}
                            >
                                <Search className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-2xl mb-8 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-white/20 border-t-purple-400 rounded-full animate-spin mx-auto"></div>
                            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-pink-400 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
                        </div>
                        <p className="text-white/70 mt-6 text-lg">Loading weather data...</p>
                    </div>
                )}

                {/* Weather Data */}
                {weatherData && !loading && (
                    <div className="max-w-4xl mx-auto">
                        {/* Single Weather Block */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-bold text-white mb-2">{weatherData.location}, {weatherData.country}</h2>
                                <p className="text-lg text-white/70 capitalize">{weatherData.weatherDescription}</p>
                            </div>

                            {/* Main Weather Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                {/* Temperature & Icon */}
                                <div className="text-center">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                            {getWeatherIcon(weatherData.weatherId)}
                                        </div>
                                    </div>
                                    <h3 className="text-6xl font-black text-white mb-2">{weatherData.temperature}°</h3>
                                    <p className="text-xl text-white/80 mb-1">{getWeatherDescription(weatherData.weatherId)}</p>
                                    <p className="text-lg text-white/60">Feels like {weatherData.feelsLike}°C</p>
                                </div>

                                {/* Sunrise/Sunset */}
                                <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl p-6 backdrop-blur-sm flex items-center justify-center">
                                    <div className="grid grid-cols-2 gap-8 text-center">
                                        <div>
                                            <Sun className="w-8 h-8 mx-auto mb-2 text-orange-300" />
                                            <p className="text-sm text-white/70">Sunrise</p>
                                            <p className="text-xl font-bold text-white">{weatherData.sunrise}</p>
                                        </div>
                                        <div>
                                            <Sun className="w-8 h-8 mx-auto mb-2 text-pink-300" />
                                            <p className="text-sm text-white/70">Sunset</p>
                                            <p className="text-xl font-bold text-white">{weatherData.sunset}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Details */}
                                <div className="space-y-4">
                                    <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-3">
                                        <Droplets className="w-6 h-6 text-cyan-300" />
                                        <div>
                                            <p className="text-sm text-white/70">Humidity</p>
                                            <p className="text-xl font-bold text-white">{weatherData.humidity}%</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-3">
                                        <Wind className="w-6 h-6 text-indigo-300" />
                                        <div>
                                            <p className="text-sm text-white/70">Wind Speed</p>
                                            <p className="text-xl font-bold text-white">{weatherData.windSpeed} km/h</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Metrics Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <Gauge className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
                                    <p className="text-sm text-white/70">Pressure</p>
                                    <p className="text-lg font-bold text-white">{weatherData.pressure} hPa</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <Eye className="w-6 h-6 text-green-300 mx-auto mb-2" />
                                    <p className="text-sm text-white/70">Visibility</p>
                                    <p className="text-lg font-bold text-white">{weatherData.visibility} km</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <Cloud className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-white/70">Cloud Cover</p>
                                    <p className="text-lg font-bold text-white">{weatherData.cloudCover}%</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <Thermometer className="w-6 h-6 text-red-300 mx-auto mb-2" />
                                    <p className="text-sm text-white/70">Feels Like</p>
                                    <p className="text-lg font-bold text-white">{weatherData.feelsLike}°C</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="relative z-10 mt-16 bg-black/20 backdrop-blur-md border-t border-white/10">
                <div className="max-w-6xl mx-auto px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Brand Section */}
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                                WeatherAi
                            </h3>
                            <p className="text-white/70 mb-4">
                                Your trusted companion for accurate weather forecasts and real-time weather data.
                            </p>
                            <div className="flex justify-center md:justify-start space-x-4">
                                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                    <span className="text-white text-sm">🌤️</span>
                                </div>
                                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                    <span className="text-white text-sm">🌍</span>
                                </div>
                                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                    <span className="text-white text-sm">📱</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="text-center md:text-left">
                            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link 
                                        to="/classic-ui" 
                                        className="text-white/70 hover:text-purple-300 transition-colors"
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="text-white/70 hover:text-purple-300 transition-colors">
                                        Advanced Weather
                                    </Link>
                                </li>
                                <li>
                                    <a href="#features" className="text-white/70 hover:text-purple-300 transition-colors">
                                        Features
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact & Info */}
                        <div className="text-center md:text-left">
                            <h4 className="text-lg font-semibold text-white mb-4">Weather Info</h4>
                            <div className="space-y-2 text-white/70">
                                <p className="flex items-center justify-center md:justify-start">
                                    <span className="mr-2">🌡️</span>
                                    Real-time Temperature
                                </p>
                                <p className="flex items-center justify-center md:justify-start">
                                    <span className="mr-2">🌍</span>
                                    Global Coverage
                                </p>
                                <p className="flex items-center justify-center md:justify-start">
                                    <span className="mr-2">⚡</span>
                                    Instant Updates
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-white/60 text-sm mb-4 md:mb-0">
                            © 2024 WeatherAi. Made with ❤️ for weather enthusiasts.
                        </p>
                        <div className="flex space-x-6 text-sm text-white/60">
                            <a href="#privacy" className="hover:text-purple-300 transition-colors">Privacy</a>
                            <a href="#terms" className="hover:text-purple-300 transition-colors">Terms</a>
                            <a href="#support" className="hover:text-purple-300 transition-colors">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WeatherOld;
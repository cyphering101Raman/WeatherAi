import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    Sun, Moon, CloudRain, Cloud, Wind, Droplets,
    Thermometer, Sunrise, Sunset, Gauge, Zap, Search
} from "lucide-react";
import axios from "axios";

// Cache Time-To-Live: 10 minutes
const CACHE_TTL_MS = 10 * 60 * 1000;

const loadCache = () => {
    const saved = localStorage.getItem("weatherCache");
    return saved ? JSON.parse(saved) : {};
}

const saveCache = (cache) => {
    localStorage.setItem("weatherCache", JSON.stringify(cache));
}

const fetchWeather = async (city, type, url) => {
    let cache = loadCache();
    const key = city.toLowerCase();

    if (!cache[key]) {
        cache[key] = {};
    }

    // Check if we have cached data for this type
    if (cache[key][type]) {
        const entry = cache[key][type];
        const isStructured = entry && typeof entry === 'object' && 'data' in entry && 'timestamp' in entry;

        if (isStructured) {
            const isFresh = Date.now() - entry.timestamp < CACHE_TTL_MS;
            if (isFresh) {
                console.log("⚡ From cache (fresh):", key, type);
                return entry.data;
            } else {
                // Expired entry; remove and fall through to fetch
                delete cache[key][type];
                saveCache(cache);
                console.log("🗑️ Cache expired, refetching:", key, type);
            }
        } else {
            // Legacy cache without TTL; clear and refetch
            delete cache[key][type];
            saveCache(cache);
            console.log("♻️ Clearing legacy cache (no TTL), refetching:", key, type);
        }
    }

    try {
    const res = await axios.get(url);
    const data = res.data;

        // Store the data in cache
    cache[key][type] = { data, timestamp: Date.now() };
    saveCache(cache);

    console.log("🌍 From API:", key, type);
    return data;
    } catch (error) {
        console.error(`Error fetching ${type} weather for ${city}:`, error);
        throw error;
    }
}

// Helper function to convert UTC to local time (UTC+5:30 for India)
const convertToLocalTime = (utcTimeString) => {
    const date = new Date(utcTimeString);
    return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

// Helper function to get weather condition icon
const getWeatherIcon = (weatherCode) => {
    if (weatherCode === 1000) return <Sun className="w-6 h-6 text-yellow-500" />;
    if (weatherCode >= 1100 && weatherCode <= 1102) return <Cloud className="w-6 h-6 text-gray-500" />;
    if (weatherCode >= 4000 && weatherCode <= 4201) return <CloudRain className="w-6 h-6 text-blue-500" />;
    if (weatherCode >= 5000 && weatherCode <= 5001) return <CloudRain className="w-6 h-6 text-blue-600" />;
    if (weatherCode >= 6000 && weatherCode <= 6201) return <CloudRain className="w-6 h-6 text-blue-700" />;
    if (weatherCode >= 7000 && weatherCode <= 7102) return <CloudRain className="w-6 h-6 text-gray-600" />;
    if (weatherCode >= 8000) return <CloudRain className="w-6 h-6 text-red-500" />;
    return <Cloud className="w-6 h-6 text-gray-500" />;
};

// Helper function to get weather condition text
const getWeatherCondition = (weatherCode) => {
    if (weatherCode >= 1000) return "Clear";
    if (weatherCode >= 1100 && weatherCode <= 1102) return "Partly Cloudy";
    if (weatherCode >= 4000 && weatherCode <= 4201) return "Rain";
    if (weatherCode >= 5000 && weatherCode <= 5001) return "Drizzle";
    if (weatherCode >= 6000 && weatherCode <= 6201) return "Freezing Rain";
    if (weatherCode >= 7000 && weatherCode <= 7102) return "Snow";
    if (weatherCode >= 8000) return "Thunderstorm";
    return "Unknown";
};

function WeatherPage() {
    const { city } = useParams();
    const navigate = useNavigate();
    const [location, setLocation] = useState("");
    const [weatherData, setWeatherData] = useState({
        realtime: null,
        history: null,
        forecast: null,
        loading: false,
        error: null
    });

    const capitalizeWords = (text) => {
        if (!text) return "";
        return text
            .split(/\s+/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    // Load weather data for the current city
    const loadWeatherData = async (cityName) => {
        if (!cityName) return;
        
        setWeatherData(prev => ({ ...prev, loading: true, error: null }));
        
            try {
                const realtime = await fetchWeather(
                    cityName,
                    "realtime",
                    `https://api.tomorrow.io/v4/weather/realtime?location=${cityName}&apikey=${import.meta.env.VITE_TOMORROW_API_KEY}`
                );

                const history = await fetchWeather(
                    cityName,
                    "history",
                    `https://api.tomorrow.io/v4/weather/history/recent?location=${cityName}&apikey=${import.meta.env.VITE_TOMORROW_API_KEY}`
                );

                const forecast = await fetchWeather(
                    cityName,
                    "forecast",
                    `https://api.tomorrow.io/v4/weather/forecast?location=${cityName}&apikey=${import.meta.env.VITE_TOMORROW_API_KEY}`
                );

            setWeatherData({
                realtime,
                history,
                forecast,
                loading: false,
                error: null
            });

            console.log("Weather data loaded:", { realtime, history, forecast });
            
            } catch (err) {
                console.error("Weather API error:", err);
            setWeatherData(prev => ({ 
                ...prev, 
                loading: false, 
                error: err.message || "Failed to load weather data" 
            }));
        }
    };

    // Load weather data when component mounts or city changes
    useEffect(() => {
        if (city) {
            loadWeatherData(city);
        }
    }, [city]);

    const handleSearch = async () => {
        if (location.trim()) {
            navigate(`/test/${encodeURIComponent(location.trim())}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // current weather data from realtime API
    const getCurrentWeather = () => {
        if (!weatherData.realtime?.data?.values) return null;
        
        const values = weatherData.realtime.data.values;
        return {
            temp: Math.round(values.temperature),
            condition: getWeatherCondition(values.weatherCode),
            humidity: Math.round(values.humidity),
            wind: Math.round(values.windSpeed),
            pressure: Math.round(values.pressureSeaLevel),
            apparentTemp: Math.round(values.temperatureApparent),
            uvIndex: values.uvIndex,
            visibility: values.visibility,
            weatherCode: values.weatherCode
        };
    };

    // Get detailed location information
    const getLocationDetails = () => {
        if (!weatherData.realtime?.location) return null;
        
        const location = weatherData.realtime.location;
        const locationParts = location.name.split(', ');

        let locationName = locationParts[0] || '';
        let city = '';
        let country = '';
        
        // Find country (last part)
        if (locationParts.length >= 1) {
            country = locationParts[locationParts.length - 1] || '';
        }
        
        // Find main city name, (usually second to last part)
        for (let i = locationParts.length - 2; i >= 0; i--) {
            const part = locationParts[i];
            // Skip postal codes and area indicators
            if (!part.match(/^\d+$/) && 
                !part.toLowerCase().includes('tehsil') && 
                !part.toLowerCase().includes('south') && 
                !part.toLowerCase().includes('east') && 
                !part.toLowerCase().includes('north') && 
                !part.toLowerCase().includes('west') &&
                part.length > 2) {
                city = part;
                break;
            }
        }
        
        return {
            fullName: location.name,
            location: locationName,
            city: city,
            country: country,
            coordinates: `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`
        };
    };

    // Get hourly forecast data (24 hours)
    const getHourlyForecast = () => {
        if (!weatherData.forecast?.timelines?.hourly) return [];
        
        return weatherData.forecast.timelines.hourly.slice(0, 24).map(hour => ({
            time: convertToLocalTime(hour.time),
            temp: Math.round(hour.values.temperature),
            icon: getWeatherIcon(hour.values.weatherCode),
            weatherCode: hour.values.weatherCode,
            humidity: Math.round(hour.values.humidity),
            windSpeed: Math.round(hour.values.windSpeed),
            precipitation: Math.round(hour.values.precipitationProbability)
        }));
    };

    // Get sunrise/sunset from daily forecast
    const getSunTimes = () => {
        if (!weatherData.forecast?.timelines?.daily?.[0]?.values) return { sunrise: "N/A", sunset: "N/A" };
        
        const daily = weatherData.forecast.timelines.daily[0].values;
        return {
            sunrise: convertToLocalTime(daily.sunriseTime),
            sunset: convertToLocalTime(daily.sunsetTime)
        };
    };

    // Get daily forecast data
    const getDailyForecast = () => {
        if (!weatherData.forecast?.timelines?.daily) return [];
        
        return weatherData.forecast.timelines.daily.slice(0, 5).map(day => {
            const date = new Date(day.time);
            const dayName = date.toLocaleDateString('en-IN', { 
                weekday: 'short',
                timeZone: 'Asia/Kolkata'
            });
            const dayDate = date.toLocaleDateString('en-IN', { 
                day: 'numeric',
                month: 'short',
                timeZone: 'Asia/Kolkata'
            });
            
            return {
                day: dayName,
                date: dayDate,
                tempMax: Math.round(day.values.temperatureMax),
                tempMin: Math.round(day.values.temperatureMin),
                icon: getWeatherIcon(day.values.weatherCodeMax),
                weatherCode: day.values.weatherCodeMax,
                condition: getWeatherCondition(day.values.weatherCodeMax),
                humidity: Math.round(day.values.humidityAvg),
                windSpeed: Math.round(day.values.windSpeedAvg),
                precipitation: Math.round(day.values.precipitationProbabilityAvg)
            };
        });
    };

    const currentWeather = getCurrentWeather();
    const locationDetails = getLocationDetails();
    const hourlyForecast = getHourlyForecast();
    const dailyForecast = getDailyForecast();
    const sunTimes = getSunTimes();

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 p-4">
            <nav className="bg-white/80 backdrop-blur-md py-4 px-8 rounded-full shadow-lg mx-auto w-full max-w-4xl mt-1 mb-6 border border-amber-200/50">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-amber-800">WeatherAi</Link>
                    <div className="flex space-x-6">
                        <a href="/#features" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">Features</a>
                        <Link to="/" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">About</Link>
                    </div>
                </div>
            </nav>
            {/* Header */}
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-extrabold text-amber-900">
                        Weather in {locationDetails ? locationDetails.location : capitalizeWords(city)}
                    </h1>
                    {locationDetails && (
                        <p className="text-lg text-amber-700 mt-1">
                            {locationDetails.city}, {locationDetails.country}
                        </p>
                    )}
                </div>
                <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-lg p-2 w-full max-w-md border border-amber-300/50">
                    <input
                        type="text"
                        placeholder="Enter location (e.g., New Delhi)"
                        className="flex-grow px-4 py-2 outline-none bg-transparent text-amber-900 placeholder-amber-600"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-amber-600 text-white p-3 rounded-full hover:bg-amber-700 transition-colors"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Loading State */}
            {weatherData.loading && (
                <div className="max-w-6xl mx-auto text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="text-amber-700 mt-4">Loading weather data...</p>
                </div>
            )}

            {/* Error State */}
            {weatherData.error && (
                <div className="max-w-6xl mx-auto text-center py-12">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p>Error: {weatherData.error}</p>
                    </div>
                </div>
            )}

            {/* Current Weather Section */}
            {currentWeather && (
            <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                {/* Temperature Card */}
                <div className="bg-gradient-to-br from-amber-100/80 to-orange-200/80 backdrop-blur-md rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center border border-amber-300/40">
                        {getWeatherIcon(currentWeather.weatherCode)}
                        <p className="text-5xl font-bold text-amber-900 mt-4">{currentWeather.temp}°C</p>
                        <p className="text-lg text-amber-800">{currentWeather.condition}</p>
                        <p className="text-sm text-amber-700 mt-2">Feels like {currentWeather.apparentTemp}°C</p>
                </div>

                {/* Extra Metrics */}
                <div className="bg-gradient-to-br from-amber-100/80 to-orange-200/80 backdrop-blur-md rounded-2xl p-6 shadow-lg grid grid-cols-2 gap-6 border border-amber-300/40">
                    <div className="flex items-center space-x-3">
                        <Droplets className="w-8 h-8 text-cyan-500" />
                        <div>
                            <p className="text-amber-700 text-sm">Humidity</p>
                                <p className="font-bold text-amber-900">{currentWeather.humidity}%</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Wind className="w-8 h-8 text-indigo-500" />
                        <div>
                            <p className="text-amber-700 text-sm">Wind</p>
                                <p className="font-bold text-amber-900">{currentWeather.wind} km/h</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Gauge className="w-8 h-8 text-yellow-500" />
                        <div>
                            <p className="text-amber-700 text-sm">Pressure</p>
                                <p className="font-bold text-amber-900">{currentWeather.pressure} hPa</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Zap className="w-8 h-8 text-orange-500" />
                        <div>
                                <p className="text-amber-700 text-sm">UV Index</p>
                                <p className="font-bold text-amber-900">{currentWeather.uvIndex}</p>
                        </div>
                    </div>
                </div>

                {/* Sunrise / Sunset */}
                <div className="bg-gradient-to-br from-amber-100/80 to-orange-200/80 backdrop-blur-md rounded-2xl p-6 shadow-lg flex flex-col justify-center border border-amber-300/40">
                    <div className="flex items-center space-x-4 mb-4">
                        <Sunrise className="w-8 h-8 text-yellow-500" />
                        <div>
                            <p className="text-amber-700 text-sm">Sunrise</p>
                                <p className="font-bold text-amber-900">{sunTimes.sunrise}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Sunset className="w-8 h-8 text-red-500" />
                        <div>
                            <p className="text-amber-700 text-sm">Sunset</p>
                                <p className="font-bold text-amber-900">{sunTimes.sunset}</p>
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* 24-Hour Forecast with Horizontal Scroll */}
            {hourlyForecast.length > 0 && (
            <section className="max-w-6xl mx-auto mb-12">
                    <h2 className="text-2xl font-bold text-amber-900 mb-6">24-Hour Forecast</h2>
                    <div className="relative">
                        <div className="flex overflow-x-auto gap-4 pb-4 pl-2 scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                            {hourlyForecast.map((h, i) => (
                        <div
                            key={i}
                                    className="bg-gradient-to-br from-amber-100/80 to-orange-200/80 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center shadow hover:scale-105 transition border border-amber-300/40 min-w-[140px] flex-shrink-0"
                        >
                                    <p className="text-amber-700 text-sm mb-2 font-medium">{h.time}</p>
                                    <div className="mb-2">
                            {h.icon}
                                    </div>
                                    <p className="font-bold text-amber-900 text-lg mb-2">{h.temp}°C</p>
                                    
                                    <div className="space-y-1 text-xs text-amber-700 text-center">
                                        <div className="flex justify-between items-center">
                                            <span>Humidity</span>
                                            <span className="ml-2">{h.humidity}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Wind</span>
                                            <span className="ml-2">{h.windSpeed} km/h</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Rain</span>
                                            <span className="ml-2">{h.precipitation}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Scroll indicators */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-50 to-transparent w-8 h-full pointer-events-none"></div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-amber-50 to-transparent w-8 h-full pointer-events-none"></div>
                    </div>
                </section>
            )}

            {/* Daily Forecast */}
            {dailyForecast.length > 0 && (
                <section className="max-w-6xl mx-auto mb-12">
                    <h2 className="text-2xl font-bold text-amber-900 mb-6">5-Day Forecast</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {dailyForecast.map((day, i) => (
                            <div
                                key={i}
                                className="bg-gradient-to-br from-amber-100/80 to-orange-200/80 backdrop-blur-md rounded-2xl p-4 shadow hover:scale-105 transition border border-amber-300/40"
                            >
                                <div className="text-center">
                                    <p className="text-amber-700 text-sm font-medium">{day.day}</p>
                                    <p className="text-amber-600 text-xs mb-3">{day.date}</p>
                                    
                                    <div className="flex justify-center mb-3">
                                        {day.icon}
                                    </div>
                                    
                                    <p className="text-amber-800 text-sm mb-2">{day.condition}</p>
                                    
                                    <div className="flex justify-center items-center space-x-2 mb-3">
                                        <span className="text-lg font-bold text-amber-900">{day.tempMax}°</span>
                                        <span className="text-amber-600">/</span>
                                        <span className="text-amber-700">{day.tempMin}°</span>
                                    </div>
                                    
                                    <div className="space-y-1 text-xs text-amber-700">
                                        <div className="flex justify-between">
                                            <span>Humidity</span>
                                            <span>{day.humidity}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Wind</span>
                                            <span>{day.windSpeed} km/h</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Rain</span>
                                            <span>{day.precipitation}%</span>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    ))}
                </div>
            </section>
            )}

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

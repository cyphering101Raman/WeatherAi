import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Wind, Droplets, Sunrise, Sunset, Gauge, Zap, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { getWeatherIcon, getWeatherCondition, capitalizeWords } from "../utils/weatherHelpers";
import axios from "axios";
import { getHourlyForecast, getDailyForecast, getSunTimes, getLocationDetails } from "../utils/forecastUtils";

// Cache Time-To-Live: 10 minutes
const CACHE_TTL_MS = 10 * 60 * 1000;
const DEFAULT_CITY = "Delhi";

const loadCache = () => {
    const saved = localStorage.getItem("weatherCache");
    return saved ? JSON.parse(saved) : {};
}

const saveCache = (cache) => {
    localStorage.setItem("weatherCache", JSON.stringify(cache));
}

// type : [realTime, forecast]
const fetchWeather = async (city, type, url) => {
    let cache = loadCache();
    const cityName = city.toLowerCase();

    if (!cache[cityName]) {
        cache[cityName] = {};
    }

    // Check if we have cached data for this type
    if (cache[cityName][type]) {
        const entry = cache[cityName][type];
        const isStructured = entry && typeof entry === 'object' && 'data' in entry && 'timestamp' in entry;

        if (isStructured) {
            const isFresh = Date.now() - entry.timestamp < CACHE_TTL_MS;
            if (isFresh) {
                // console.log("⚡ From cache (fresh):", cityName, type);
                return entry.data;
            } else {
                // Expired entry; remove and fall through to fetch
                delete cache[cityName][type];
                saveCache(cache);
                // console.log("🗑️ Cache expired, refetching:", cityName, type);
            }
        } else {
            // Legacy cache without TTL; clear and refetch
            delete cache[cityName][type];
            saveCache(cache);
            // console.log("♻️ Clearing legacy cache (no TTL), refetching:", cityName, type);
        }
    }

    try {
        const res = await axios.get(url);
        const data = res.data;

        // Store the data in cache
        cache[cityName][type] = { data, timestamp: Date.now() };
        saveCache(cache);

        return data;
    } catch (error) {
        // console.error(`Error fetching ${type} weather for ${city}:`, error);
        throw error;
    }
}

function WeatherPage() {
    const { city } = useParams();
    const navigate = useNavigate();
    const [location, setLocation] = useState("");
    const [weatherData, setWeatherData] = useState({
        realtime: null,
        forecast: null,
        loading: false,
        error: null
    });
    const [insight, setInsight] = useState("");

    // Load weather data for the current city
    const loadWeatherData = async (cityName) => {
        if (!cityName) return;

        // Clear previous data while loading new city
        setInsight("");
        setWeatherData({ realtime: null, forecast: null, loading: true, error: null });

        try {
            const realtime = await fetchWeather(
                cityName,
                "realtime",
                `https://api.tomorrow.io/v4/weather/realtime?location=${cityName}&apikey=${import.meta.env.VITE_TOMORROW_API_KEY}`
            );

            const forecast = await fetchWeather(
                cityName,
                "forecast",
                `${import.meta.env.VITE_BACKEND_URL}/fetch-weather-forecast?locationName=${encodeURIComponent(cityName)}`
                // http://127.0.0.1:8000/fetch-weather-forecast?locationName=govindpuri
            );
            
            setInsight(forecast.insight);
            setWeatherData({ realtime, forecast: forecast.data, loading: false, error: null });

        }
        catch (err) {
            // console.error("Weather API error:", err);
            let message = "Failed to load weather data";

            if (err?.response?.status === 400 || err?.response?.status === 404) {
                message = "Location not found. Please enter a valid city.";
            }

            else if (typeof err?.message === 'string' && err.message.includes('Network')) {
                message = "Network error. Please check your connection and try again.";
            }

            setWeatherData({
                realtime: null,
                forecast: null,
                loading: false,
                error: message
            });
        }
    };

    // Load weather data when component mounts or city changes
    useEffect(() => {
        const cityToLoad = city && city.trim() ? city : DEFAULT_CITY;
        loadWeatherData(cityToLoad);
    }, [city]);

    const handleSearch = async () => {
        if (location.trim()) {
            navigate(`/weather/${encodeURIComponent(location.trim())}`);
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

    const currentWeather = getCurrentWeather();
    const locationDetails = getLocationDetails(weatherData.realtime);
    const hourlyForecast = getHourlyForecast(weatherData.forecast);
    const dailyForecast = getDailyForecast(weatherData.forecast);
    const sunTimes = getSunTimes(weatherData.forecast);

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
                        Weather in {locationDetails ? locationDetails.location : capitalizeWords(city || DEFAULT_CITY)}
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
                        <p className="text-5xl font-bold text-amber-900 mb-3">{currentWeather.temp}°C</p>
                        <div className="flex items-center justify-center gap-4 my-1">
                            <span>{getWeatherIcon(currentWeather.weatherCode)}</span>
                            <p className="text-lg font-medium text-amber-800">{currentWeather.condition}</p>
                        </div> 
                        <p className="text-lg text-amber-700 mt-2">Feels like {currentWeather.apparentTemp}°C</p>
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
                                <p className="text-amber-700 text-sm tracking-tight">Sunrise</p>
                                <p className="font-bold text-amber-900 text-lg leading-none">
                                    {sunTimes.sunrise}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Sunset className="w-8 h-8 text-red-500" />
                            <div>
                                <p className="text-amber-700 text-sm tracking-tight">Sunset</p>
                                <p className="font-bold text-amber-900 text-lg leading-none">
                                    {sunTimes.sunset}
                                </p>
                            </div>
                        </div>

                    </div>
                </section>
            )}

            {/* 24-Hour Forecast with Horizontal Scroll */}
            {hourlyForecast.length > 0 && (
                <section className="max-w-6xl mx-auto mb-12">

                    <h2 className="text-2xl font-bold tracking-tight text-amber-900 mb-8 text-center leading-snug">
                        Hourly Outlook
                    </h2>

                    <div className="relative">
                        <div
                            onWheel={(e) => {
                                e.preventDefault();
                                const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
                                e.currentTarget.scrollLeft += delta;
                            }}
                            className="flex overflow-x-auto overflow-y-hidden gap-4 pb-4 pl-2 scrollbar-hide"
                            style={{ scrollbarWidth: "none",
                                msOverflowStyle: "none",
                                touchAction: "pan-x",
                                overscrollBehavior: "contain",
                            }}
                        >
                            {hourlyForecast.map((h, i) => (
                                <div key={i} className="min-w-[140px] flex-shrink-0 rounded-2xl p-4 flex flex-col items-center bg-gradient-to-br from-amber-100/80 to-orange-200/80 border border-amber-200/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all backdrop-blur-md " >

                                    <p className="text-sm font-medium text-amber-800 tracking-tight mb-1">{h.time}</p>

                                    <div className="flex items-center justify-center gap-4 my-1">
                                        <span>{h.icon}</span>
                                        <p className="text-sm font-medium text-amber-800">{h.condition}</p>
                                    </div> 

                                    <p className="text-2xl font-bold text-amber-900 leading-none mb-2">{h.temp}°</p>

                                    <div className="h-px w-full bg-amber-300/70 my-2"></div>

                                    {/* stats */}
                                    <div className="text-xs text-amber-700 space-y-1 w-full">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Humidity</span>
                                            <span>{h.humidity}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Wind</span>
                                            <span>{h.windSpeed} km/h</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Rain</span>
                                            <span>{h.precipitation}%</span>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>

                        {/* Scroll indicators */}
                        <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-100/70 to-transparent w-12 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-amber-100/70 to-transparent w-12 pointer-events-none"></div>
                    </div>
                </section>
            )}

            {/* Daily Forecast */}
            {dailyForecast.length > 0 && (
                <section className="max-w-6xl mx-auto mb-12">
                    <h2 className="text-2xl font-bold tracking-tight text-amber-900 mb-8 text-center leading-snug">
                        This Week’s Weather
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {dailyForecast.map((day, i) => (
                            <div
                                key={i}
                                className="rounded-2xl p-5 bg-gradient-to-br from-amber-100/80 to-orange-200/80 border border-amber-200/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all backdrop-blur-md" >
                                <div className="flex flex-col items-center space-y-1.5">

                                    <p className="text-lg font-semibold tracking-tight text-amber-900">{day.day}</p>

                                    <p className="text-sm text-amber-600 tracking-tight opacity-90">{day.date}</p>

                                    <div className="flex items-center justify-center gap-4 my-1">
                                        <span>{day.icon}</span>
                                        <p className="text-sm font-medium text-amber-800">{day.condition}</p>
                                    </div> 

                                    <p className="text-3xl font-bold text-amber-900 leading-none my-2"> {day.tempAvg}° </p> 

                                    <div className="h-px w-full bg-amber-300/70 my-2"></div>

                                    <div className="text-sm text-amber-700 space-y-1 w-full">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Humidity</span>
                                            <span>{day.humidity}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Wind</span>
                                            <span>{day.windSpeed} km/h</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Rain</span>
                                            <span>{day.precipitation}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* AI Insights - Coming Soon */}
            <section className="max-w-6xl mx-auto mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-amber-900 mb-8 text-center leading-snug">AI Insights</h2>

                {insight ? (
                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 p-6 rounded-2xl shadow-lg border border-amber-300/40 prose prose-amber max-w-none">
                        <ReactMarkdown>{insight}</ReactMarkdown>
                    </div>
                ) : (
                        <div className="p-6 rounded-2xl shadow-sm border border-amber-300/40 bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center text-center animate-pulse">
                            <p className="text-sm font-medium tracking-wide">
                                Generating AI insights...
                            </p>
                        </div>

                )}
            </section>

        </div>
    );
}

export default WeatherPage;

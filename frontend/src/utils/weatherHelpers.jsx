import { Sun, Cloud, CloudRain } from "lucide-react";

export const capitalizeWords = (text) => {
    if (!text) return "";
    return text
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

// Convert UTC → local (India)
export const convertToLocalTime = (utcTimeString) => {
    const date = new Date(utcTimeString);
    return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

// Return weather icon component
export const getWeatherIcon = (weatherCode) => {
    if (weatherCode === 1000) return <Sun className="w-6 h-6 text-yellow-500" />;
    if (weatherCode >= 1100 && weatherCode <= 1102)
        return <Cloud className="w-6 h-6 text-gray-500" />;
    if (weatherCode >= 4000 && weatherCode <= 4201)
        return <CloudRain className="w-6 h-6 text-blue-500" />;
    if (weatherCode >= 5000 && weatherCode <= 5001)
        return <CloudRain className="w-6 h-6 text-blue-600" />;
    if (weatherCode >= 6000 && weatherCode <= 6201)
        return <CloudRain className="w-6 h-6 text-blue-700" />;
    if (weatherCode >= 7000 && weatherCode <= 7102)
        return <CloudRain className="w-6 h-6 text-gray-600" />;
    if (weatherCode >= 8000)
        return <CloudRain className="w-6 h-6 text-red-500" />;
    return <Cloud className="w-6 h-6 text-gray-500" />;
};

// Return text condition
export const getWeatherCondition = (weatherCode) => {
    if (weatherCode === 1000) return "Clear";
    if (weatherCode >= 1100 && weatherCode <= 1102) return "Partly Cloudy";
    if (weatherCode >= 4000 && weatherCode <= 4201) return "Rain";
    if (weatherCode >= 5000 && weatherCode <= 5001) return "Drizzle";
    if (weatherCode >= 6000 && weatherCode <= 6201) return "Freezing Rain";
    if (weatherCode >= 7000 && weatherCode <= 7102) return "Snow";
    if (weatherCode >= 8000) return "Thunderstorm";
    return "Unknown";
};

import { convertToLocalTime, getWeatherIcon, getWeatherCondition } from "./weatherHelpers";

// 🕐 24-hour forecast
export const getHourlyForecast = (forecast) => {
	if (!forecast?.timelines?.hourly) return [];
	
	const location = forecast.location;
	return forecast.timelines.hourly.slice(0, 24).map(hour => ({
		time: convertToLocalTime(hour.time, location.lat, location.lon),
		temp: Math.round(hour.values.temperature),
		icon: getWeatherIcon(hour.values.weatherCode),
		weatherCode: hour.values.weatherCode,
		condition: getWeatherCondition(hour.values.weatherCode),
		humidity: Math.round(hour.values.humidity),
		windSpeed: Math.round(hour.values.windSpeed),
		precipitation: Math.round(hour.values.precipitationProbability)
	}));
};

// 🌅 Sunrise / Sunset
export const getSunTimes = (forecast) => {
	if (!forecast?.timelines?.daily?.[0]?.values)
		return { sunrise: "N/A", sunset: "N/A" };

	const location = forecast.location;
	const daily = forecast.timelines.daily[0].values;
	return {
		sunrise: convertToLocalTime(daily.sunriseTime, location.lat, location.lon),
		sunset: convertToLocalTime(daily.sunsetTime, location.lat, location.lon),
	};
};

// 📆 5-day forecast
export const getDailyForecast = (forecast) => {
	if (!forecast?.timelines?.daily) return [];

	return forecast.timelines.daily.slice(1, 6).map(day => {
		const date = new Date(day.time);
		const dayName = date.toLocaleDateString("en-IN", {
			weekday: "long",
			timeZone: "Asia/Kolkata",
		});
		const dayDate = date.toLocaleDateString("en-IN", {
			day: "numeric",
			month: "long",
			timeZone: "Asia/Kolkata",
		});

		return {
			day: dayName,
			date: dayDate,
			tempAvg: Math.round(day.values.temperatureAvg),
			icon: getWeatherIcon(day.values.weatherCodeMax),
			weatherCode: day.values.weatherCodeMax,
			condition: getWeatherCondition(day.values.weatherCodeMax),
			humidity: Math.round(day.values.humidityAvg),
			windSpeed: Math.round(day.values.windGustMax || 0),
			precipitation: Math.round(day.values.precipitationProbabilityAvg || 0),
		};

	});
};

// 📍 Location info
export const getLocationDetails = (realtime) => {
	if (!realtime?.location) return null;

	const location = realtime.location;
	const parts = location.name.split(", ");
	const locationName = parts[0] || "";
	const country = parts.at(-1) || "";

	let city = "";
	for (let i = parts.length - 2; i >= 0; i--) {
		const part = parts[i].toLowerCase();
		if (
			!/^\d+$/.test(part) &&
			!part.includes("tehsil") &&
			!["south", "north", "east", "west"].some(d => part.includes(d)) &&
			part.length > 2
		) {
			city = parts[i];
			break;
		}
	}

	return {
		fullName: location.name,
		location: locationName,
		city,
		country,
		coordinates: `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`,
	};
};

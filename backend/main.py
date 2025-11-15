from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from upstash_redis import Redis
import os, requests, json

from weather_insight import generate_weather_report

load_dotenv()
weather_key=os.getenv("TOMORROW_API_KEY")
frontend_url=os.getenv("FRONTEND_URL", "*")

redis_client =Redis(
    url=os.getenv("UPSTASH_REDIS_URL"),
    token=os.getenv("UPSTASH_REDIS_TOKEN")
)

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_FIELDS = {
    "hourly": [
        "cloudCover",
        "humidity",
        "temperature",
        "temperatureApparent",
        "uvIndex",
        "visibility",
        "weatherCode",
        "windDirection",
        "windGust",
        "windSpeed",
        "precipitationProbability"
    ],
    "minutely": [
        "cloudCover",
        "humidity",
        "temperature",
        "temperatureApparent",
        "uvIndex",
        "visibility",
        "weatherCode",
        "windDirection",
        "windGust",
        "windSpeed",
    ],
    "daily": [
        "humidityAvg",
        "moonriseTime",
        "moonsetTime",
        "pressureSurfaceLevelAvg",
        "sunriseTime",
        "sunsetTime",
        "temperatureApparentAvg",
        "temperatureAvg",
        "uvHealthConcernMax",
        "visibilityAvg",
        "weatherCodeMax",
        "windDirectionAvg",
        "windGustMax",
    ],
}

@app.get("/weather/full_data")
def fetch_full_weather(locationName: str):

    locationName = locationName.lower().strip()

    key_rt = f"weather:realtime:{locationName}"
    key_fc = f"weather:forecast:{locationName}"
    key_in = f"weather:insight:{locationName}"

    cached_rt = redis_client.get(key_rt)
    cached_fc = redis_client.get(key_fc)
    cached_in = redis_client.get(key_in)

    realtime = None
    forecast_raw = None
    insight = None

    if cached_rt:
        realtime = json.loads(cached_rt)

    if cached_fc and cached_in:
        forecast_raw = json.loads(cached_fc)
        insight = cached_in

    if realtime is None:
        url_rt = f"https://api.tomorrow.io/v4/weather/realtime?location={locationName}&apikey={weather_key}"
        try:
            res = requests.get(url_rt)
            realtime = res.json()

            if res.status_code == 200:
                redis_client.setex(key_rt, 600, json.dumps(realtime))
            else:
                realtime = {"error": "Failed to fetch realtime weather"}

        except:
            realtime = {"error": "Failed to fetch realtime weather"}

    if forecast_raw is None or insight is None:
        url_fc = f"https://api.tomorrow.io/v4/weather/forecast?location={locationName}&apikey={weather_key}"
        try:
            res = requests.get(url_fc)
            forecast_raw = res.json()

            if res.status_code == 200:

                timelines = forecast_raw.get("timelines", {})
                for section_name, section_data in timelines.items():
                    if isinstance(section_data, list):
                        allowed = ALLOWED_FIELDS.get(section_name, [])
                        for entry in section_data:
                            values = entry.get("values", {})
                            entry["values"] = {k: v for k, v in values.items() if k in allowed}

                redis_client.setex(key_fc, 1800, json.dumps(forecast_raw))

                try:
                    insight = generate_weather_report(forecast_raw)
                    redis_client.setex(key_in, 1800, insight)
                except Exception as ai_err:
                    insight = f"AI unavailable. Error: {str(ai_err)}"

            else:
                forecast_raw = {"error": "Failed to fetch forecast weather"}
                insight = "AI unavailable due to invalid forecast data."

        except:
            forecast_raw = {"error": "Failed to fetch forecast weather"}
            insight = "AI unavailable due to invalid forecast data."

    return {
        "status": "success",
        "realtime": realtime,
        "forecast": forecast_raw,
        "insight": insight,
    }


@app.get("/")
def root():
    return {"status": "WeatherXAI backend online"}

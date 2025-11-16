# WeatherAi  
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009485?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Language-Python-3776AB?logo=python&logoColor=white)
![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?logo=redis&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq%20LLM-FF6B00?logo=visualstudiocode&logoColor=white)
![Tomorrow.io](https://img.shields.io/badge/WeatherAPI-Tomorrow.io-1E90FF?logo=cloud&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)

![License](https://img.shields.io/badge/License-MIT-lightgrey)


**Live Demo:** [*(WeatherxAI)*  ](https://weatherxai.netlify.app/)

**Repository:** https://github.com/cyphering101Raman/WeatherAi


---


## Overview
WeatherAi is a full-stack weather intelligence app that fetches real-time weather data and generates AI-powered insights.  
Built with a clean React frontend and FastAPI backend, it demonstrates API integration, UI/UX design, and modular code architecture.


---


## Screenshots
<img width="1351" height="1886" alt="HomePageWeatherxAi" src="https://github.com/user-attachments/assets/25088a0d-8ccf-4c46-824d-aeda863ccba4" />
<img width="1351" height="1680" alt="WeatherPage" src="https://github.com/user-attachments/assets/a445ed25-0d9b-42c0-9a7f-4b8d6a0ad6bd" />



---


## Features
- Real-time weather data
- AI-generated summaries
- Responsive interface
- Search by location
- Error + edge-case handling
- Clean modular structure (frontend + backend)


---


## Tech Stack

### **Frontend**
- **React** — core UI framework  
- **React Router** — dynamic routing
- **Axios** — API requests
- **TailwindCSS**
- **Lucide Icons**  
- **React Markdown** 
- **Custom UI Components**  
  - `TiltedCard`


### **Backend**
- **Python (FastAPI)**
- **FastAPI** — API framework
- **Uvicorn** — server
- **Requests** — weather API calls
- **Groq LLM (via `openai` client)** — generates AI weather insights
- **Tomorrow.io API** — realtime + forecast weather provider
- **Upstash Redis** — caching layer (realtime, forecast, insights)
- **python-dotenv** — environment variable management


### Deployment
- **Netlify**
- **Render**


---


## Folder Structure
```bash
WeatherAI/
├── backend/
│   ├── .gitignore
│   ├── main.py
│   ├── requirements.txt
│   └── weather_insight.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── react-bits/
│   │   │       └── TiltedCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── WeatherOld.jsx
│   │   │   └── WeatherPage.jsx
│   │   ├── router/
│   │   ├── utils/
│   │   │   ├── forecastUtils.js
│   │   │   └── weatherHelpers.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── netlify.toml
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   └── vite.config.js
```
---

## Environment Variables

Create a `.env` file in **backend**:

TOMORROW_API_KEY= ****** <br>
GROK_API_KEY= ****** <br>
FRONTEND_URL= ****** <br>
UPSTASH_REDIS_URL= ****** <br>
UPSTASH_REDIS_TOKEN= ****** 


If the **frontend** requires environment variables (Vite):

VITE_OPEN_WEATHER_API_KEY = ********* <br>
VITE_BACKEND_URL = ********* <br>

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/cyphering101Raman/WeatherAi
cd WeatherAi
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.sample .env
npm start       # or npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

---


### API Endpoints (Example)

| 🔧 Method | 🌐 Endpoint      | 📌 Description                   |
|-----------|-------------------|----------------------------------|
| GET       | `/api/weather`    | Fetches weather by location      |
| POST      | `/api/insight`    | Generates AI insight (optional)  |


---

## How It Works

1. **Frontend sends location → backend**
2. **Backend calls external weather API**
3. **Weather data is cleaned and normalized**
4. **AI logic processes insights (optional feature)**
5. **Frontend renders results using UI components**
6. **Realtime refresh + error boundaries** handle failures gracefully

### Key Logic Areas
- `frontend/src/utils/*`
- `backend/routes/weather.js`
- `backend/app.js`

---


## License

MIT License.
Copyright (c) 2025 Raman Gupta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so.

---

## Acknowledgements

- Weather data from **OpenWeather** / **Tomorrow.io** / **WeatherAPI**  
- Icons provided by **Lucide**  
- Built by **Raman Gupta**


🌫️ AuraTrace
<div align="center"> <img src="public/og-image.png" alt="AuraTrace Banner" width="800"/>
https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js
https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript
https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css
https://img.shields.io/badge/Framer%2520Motion-12.34-0055FF?style=for-the-badge&logo=framer
https://img.shields.io/badge/OpenWeatherMap-API-FF6B4A?style=for-the-badge&logo=openweathermap
https://img.shields.io/badge/Google%2520Maps-API-4285F4?style=for-the-badge&logo=google-maps
https://img.shields.io/badge/NASA%2520FIRMS-API-FC6D26?style=for-the-badge&logo=nasa

<h3>Real-time Air Quality Monitoring with Personalized Health Risk Assessment & Smart Route Planning</h3> <p> <a href="#-features">Features</a> • <a href="#-demo">Demo</a> • <a href="#-tech-stack">Tech Stack</a> • <a href="#-architecture">Architecture</a> • <a href="#-getting-started">Getting Started</a> • <a href="#-api-reference">API Reference</a> • <a href="#-deployment">Deployment</a> </p> </div>
📋 Overview
AuraTrace is a cutting-edge environmental health platform that transforms raw air quality data into personalized, actionable health guidance. Unlike traditional weather apps that show abstract numbers, AuraTrace answers the critical question: "What does this air mean for MY health?"

The Problem We Solve
Raw air quality data like "PM2.5 is 55 µg/m³" is meaningless to most people. More importantly, the same reading affects different people dramatically differently:

Person	Same PM2.5 = 55 µg/m³ Impact
Healthy adult	Minor irritation, mostly fine
Asthma patient	Potential bronchospasm trigger, needs rescue inhaler
Elderly person	Cardiovascular strain, blood pressure spike risk
Infant	Serious lung development risk, 6× more susceptible
AuraTrace bridges this gap by translating atmospheric data into personalized, actionable guidance.

What Makes AuraTrace Unique
Feature	Traditional Apps	AuraTrace
Data Source	Single source	Multi-source fusion (EPA, PurpleAir, OpenWeather, NASA)
Personalization	One-size-fits-all	Profile-specific (Asthma/Elderly/Infant)
Actionability	"AQI is 150"	"Close windows now, take medication in 2 hours"
Route Planning	Fastest only	Health-optimized routes with 73% less exposure
Prediction	Current only	12-hour forecast + smoke plume tracking
Visualization	Basic numbers	Animated particle system, heat maps, AR-ready
✨ Features
🫁 Personalized Health Profiles
Asthma Profile: Heightened PM2.5 sensitivity (1.4× multiplier)

Elderly Profile: Cardiovascular compound risk (1.2× multiplier)

Infant Profile: Developing lung vulnerability (1.6× multiplier)

📊 Real-time Environmental Data
Multi-source fusion: EPA AirNow (official), PurpleAir (hyperlocal), OpenWeather (global)

12-hour health forecast with respiratory strain prediction

Live AQI, PM2.5, temperature, humidity, wind, visibility

🗺️ Smart Route Planning (BREATHE)
text
✨ BREATHE suggests a safer route through the park:
• Only 5 min longer
• 73% lower pollution exposure
• 62% less respiratory strain

🏥 Long-term health impact:
Using BreatheSmart daily could reduce your annual PM2.5 exposure
by 41% - equivalent to gaining back 8 days of lung function per year
🔥 Wildfire & Smoke Tracking
NASA FIRMS integration for active fire detection

Smoke plume prediction - know when smoke will arrive

Proactive alerts before air quality deteriorates

🎯 Interactive Visualizations
Impact Pulse: Circular gauge with heartbeat animation

Smoke Density Map: Animated heat zones

Particle Background: Canvas-based system responding to AQI

Health Forecast: SVG line chart with Bézier curves

📱 Mobile-Ready
Fully responsive design

Bottom sheet for detailed analysis

Touch-optimized interactions

🏗️ Architecture
text
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Dashboard │ │ RoutePlanner│ │ HealthForecast      │   │
│  │   Impact    │ │   Map       │ │ RecommendationPanel │   │
│  │   Pulse     │ │   Component │ │ MobileBottomSheet   │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API LAYER                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │  /api/aqi   │ │/api/risk/[id]│ │   /api/geocode      │   │
│  │  GET        │ │ GET         │ │   GET               │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 DataService (Singleton)              │   │
│  │  ┌──────────┐ ┌─────────┐ ┌────────┐ ┌────────┐   │   │
│  │  │  Cache   │ │ Risk    │ │ Route  │ │ Health │   │   │
│  │  │  Manager │ │ Engine  │ │ Scorer │ │ Calc   │   │   │
│  │  └──────────┘ └─────────┘ └────────┘ └────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA SOURCE LAYER                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ OpenWeather │ │   AirNow    │ │     PurpleAir       │   │
│  │   Client    │ │   Client    │ │      Client         │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 NASA FIRMS Client                   │   │
│  │         (Satellite fire & smoke data)               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
🛠️ Tech Stack
Frontend
Technology	Purpose
Next.js 16	React framework with App Router
TypeScript	Type safety and developer experience
Tailwind CSS v4	Utility-first styling
Framer Motion	Smooth animations and transitions
Recharts	Health forecast visualizations
@react-google-maps/api	Route planning and heat maps
Backend & APIs
API	Purpose	Free Tier
OpenWeatherMap	Weather & air quality	1,000,000 calls/month
EPA AirNow	Official US air quality	500 calls/hour
PurpleAir	Hyperlocal community sensors	1M points free
NASA FIRMS	Satellite fire detection	5,000 calls/10min
Google Maps	Routing & geocoding	$200/month credit
Infrastructure
Next.js API Routes - Serverless functions

In-memory caching - 5-minute TTL

Vercel - Deployment platform

📦 Project Structure
text
auratrace/
├── public/                    # Static assets
│   ├── og-image.png          # Open Graph image
│   └── favicon.ico            # Site icon
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── aqi/           # GET /api/aqi
│   │   │   ├── risk/          # GET /api/risk/[profileId]
│   │   │   └── geocode/       # GET /api/geocode
│   │   ├── dashboard/         # Dashboard page
│   │   ├── docs/              # Documentation
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   │
│   ├── components/             # React components
│   │   ├── ImpactPulse.tsx     # Circular risk gauge
│   │   ├── ProfileToggle.tsx    # Profile switcher
│   │   ├── ParticleMap.tsx      # Smoke density map
│   │   ├── HealthForecast.tsx   # 12-hour chart
│   │   ├── DataCard.tsx         # Environmental data
│   │   ├── RecommendationPanel.tsx # Safety tips
│   │   ├── SmokeBackground.tsx  # Canvas particle system
│   │   ├── RoutePlanner/        # BREATHE feature
│   │   │   ├── index.tsx
│   │   │   ├── RouteComparison.tsx
│   │   │   └── HealthImpact.tsx
│   │   └── Icons.tsx            # Custom icon set
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useLocation.ts       # Geolocation
│   │   ├── useRealtimeData.ts   # Live data fetching
│   │   └── useRoutePlanner.ts   # Route optimization
│   │
│   ├── lib/                      # Utilities & services
│   │   ├── data-sources/         # API clients
│   │   │   ├── openweather.ts
│   │   │   ├── airnow.ts
│   │   │   ├── purpleair.ts
│   │   │   └── nasa-firms.ts
│   │   ├── data-service.ts       # Main service layer
│   │   ├── risk-engine.ts        # Risk calculation
│   │   ├── route-scorer.ts       # Route optimization
│   │   └── health-calculator.ts  # Health impact
│   │
│   ├── types/                     # TypeScript definitions
│   │   └── index.ts
│   │
│   └── utils/                      # Helper functions
│       ├── aqi.ts                   # AQI conversions
│       └── distance.ts              # Geolocation math
│
├── .env.local                       # Environment variables
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
└── package.json                      # Dependencies
🚀 Getting Started
Prerequisites
Node.js 20+

npm or yarn

API keys (see below)

Installation
Clone the repository

bash
git clone https://github.com/yourusername/auratrace.git
cd auratrace
Install dependencies

bash
npm install
Set up environment variables

Create .env.local:

env
# OpenWeatherMap (required)
OPENWEATHER_API_KEY=your_key_here

# EPA AirNow (recommended)
EPA_AIRNOW_API_KEY=your_key_here

# PurpleAir (recommended for hyperlocal data)
PURPLEAIR_API_KEY=your_key_here

# NASA FIRMS (for wildfire tracking)
NASA_FIRMS_API_KEY=your_key_here

# Google Maps (for route planning)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# Default location (fallback if geolocation denied)
DEFAULT_LAT=40.7128
DEFAULT_LON=-74.0060
DEFAULT_CITY=New York
Run development server

bash
npm run dev
Open your browser

text
http://localhost:3000
🔑 API Key Setup Guide
OpenWeatherMap (Required)
Go to https://openweathermap.org/api

Sign up for free account

Get API key from dashboard

Add to .env.local

EPA AirNow (Recommended)
Go to https://docs.airnowapi.org/account/request/

Fill registration form

Receive key via email (instant)

Add to .env.local

PurpleAir (Hyperlocal Data)
Go to https://develop.purpleair.com/

Sign in with Google

Create Read API key

Add 1M points to project (free)

Add to .env.local

NASA FIRMS (Fire Detection)
Go to https://firms.modaps.eosdis.nasa.gov/api/

Register for free account

Get MAP_KEY via email

Add to .env.local

Google Maps (Route Planning)
Go to https://console.cloud.google.com/

Create new project

Enable APIs: Maps JavaScript, Routes, Places, Air Quality

Create API key with restrictions

Add to .env.local

📊 API Reference
GET /api/aqi
Get current air quality and weather data

Parameters:

Name	Type	Description
lat	number	Latitude (optional, defaults to DEFAULT_LAT)
lon	number	Longitude (optional, defaults to DEFAULT_LON)
Response:

json
{
  "aqi": 142,
  "pm25": 42.3,
  "pm10": 50.8,
  "temperature": 24,
  "humidity": 65,
  "windSpeed": 3.5,
  "visibility": 8.2,
  "category": "Unhealthy for Sensitive Groups",
  "color": "var(--accent-warn)",
  "source": "purpleair",
  "timestamp": "2026-02-23T12:00:00Z",
  "location": { "lat": 40.7128, "lon": -74.006 }
}
GET /api/risk/[profileId]
Get personalized risk score for a health profile

Parameters:

Name	Type	Description
profileId	string	asthma, elderly, or infant
lat	number	Optional
lon	number	Optional
Response:

json
{
  "profileId": "asthma",
  "score": 72,
  "level": "high",
  "aqi": 168,
  "contributingFactors": {
    "pm25": 60,
    "temperature": 20,
    "humidity": 10,
    "wind": 10
  },
  "forecast": [
    { "hour": "Now", "strain": 72, "aqi": 168 },
    { "hour": "1h", "strain": 75, "aqi": 175 }
  ],
  "recommendations": [
    {
      "id": "asthma-1",
      "text": "High risk of bronchospasm. Keep rescue inhaler accessible.",
      "severity": "hazard"
    }
  ],
  "timestamp": "2026-02-23T12:00:00Z"
}
GET /api/geocode
Reverse geocoding to get city name from coordinates

Parameters:

Name	Type	Description
lat	number	Latitude
lon	number	Longitude
Response:

json
{
  "city": "New York",
  "country": "US"
}
🧪 Risk Scoring Engine
Formula
text
RiskScore = (
  PM2.5_weight × PM2.5_normalized +
  Temperature_weight × Heat_index +
  Humidity_weight × Dryness_factor +
  Wind_weight × Dispersion_factor
) × Profile_multiplier
Profile Multipliers
Profile	Multiplier	Reasoning
Asthma	1.4×	Heightened PM2.5 sensitivity
Elderly	1.2×	Cardiovascular compound risk
Infant	1.6×	Developing lung vulnerability
Risk Levels
Score	Level	Color	Action
0-30	Low	Safe	Normal activities
31-60	Moderate	Warn	Limit prolonged exposure
61-100	High	Hazard	Stay indoors, use filtration
🗺️ BreatheSmart Route Planner
Algorithm
text
For each potential route:
  - Divide route into 100m segments
  - Query best available AQI for each segment
  - Calculate exposure = Σ (AQI × time_in_segment)
  - Apply profile multiplier
  - Rank routes by health impact
Health Impact Translation
Metric	Conversion
Cigarette Equivalent	1 cigarette = 22µg PM2.5
Lung Function Days	10µg daily reduction = +1 lung day/year
Mortality Risk	10µg increase = 7.3% increased mortality
🎨 Design System
Colors
css
--accent-safe: #2CD4A2;
--accent-warn: #F5B731;
--accent-hazard: #FF6B2C;

--bg-primary: #0A0C0F;
--bg-secondary: #111316;
--text-primary: #FFFFFF;
--text-secondary: #A0A4A8;
--text-tertiary: #6B6F73;
Typography
Sans-serif: Inter, -apple-system, BlinkMacSystemFont

Mono: JetBrains Mono, SF Mono, Menlo

Components
Glass cards with backdrop blur

Animated pulses for risk indication

Gradient borders and subtle shadows

Smooth transitions with Framer Motion

📈 Performance Optimizations
Multi-layer caching: 5-minute TTL for all API responses

Image optimization: Next.js Image component

Code splitting: Dynamic imports for heavy components

Debounced searches: Route planning

Request coalescing: Prevent duplicate API calls

🚢 Deployment
Deploy to Vercel (Recommended)
Push to GitHub

bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/auratrace.git
git push -u origin main
Import to Vercel

Go to https://vercel.com

Import GitHub repository

Add environment variables

Deploy!

Manual Build
bash
npm run build
npm run start
🧪 Testing
bash
# Run tests
npm run test

# Run linting
npm run lint

# Type check
npm run type-check
🤝 Contributing
We welcome contributions! Please see our Contributing Guidelines.

Fork the repository

Create feature branch (git checkout -b feature/amazing)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing)

Open a Pull Request

📄 License
MIT License - see LICENSE file for details.


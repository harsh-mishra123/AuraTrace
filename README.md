<div align="center">

# 🌫️ AuraTrace

### Real-Time Smoke & Air Quality Impact Monitor

**Breathe smarter. Live safer.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

---

AuraTrace combines multiple air quality data sources with personalized health profiles to deliver real-time risk scores, 12-hour forecasts, and adaptive recommendations — built for the people who need it most.

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Health Profiles](#-health-profiles)
- [Data Sources](#-data-sources)
- [Components](#-components)
- [License](#-license)

---

## 🔍 Overview

AuraTrace is a **real-time smoke and air quality impact monitoring platform** designed for vulnerable populations — individuals with **asthma**, the **elderly**, and **infants**. It aggregates data from multiple government and community-driven air quality APIs, runs it through a weighted risk engine, and presents actionable, personalized health guidance through an elegant glass-morphism dashboard.

The app works **out-of-the-box** with mock data (no API keys required) and upgrades seamlessly to live data when keys are provided.

---

## ✨ Features

### 🎯 Personalized Risk Scoring
A multi-factor risk engine calculates a **0–100 risk score** based on PM2.5 concentration (60%), temperature (20%), humidity (10%), and wind speed (10%) — adjusted by profile-specific vulnerability multipliers.

### 📊 12-Hour Health Forecast
Smooth spline-curve visualizations predict respiratory strain over the next 12 hours, accounting for time-of-day pollution patterns and individual sensitivity.

### 🗺️ Smoke Density Map
SVG-based heat map with animated hotspots showing real-time particulate distribution around your location, including road overlays and gradient intensity zones.

### 💡 Adaptive Recommendations
Context-aware health guidance that shifts dynamically based on your profile and current conditions — from medication reminders to HEPA filter advisories.

### 🫁 Impact Pulse Gauge
An animated circular gauge with pulsing rings that visualizes your personal risk score at a glance, color-coded from safe (green) to hazardous (red).

### 🌫️ Living Smoke Background
A full-screen canvas particle system where drift speed and density respond to the current AQI — the worse the air, the thicker the haze.

### 📱 Mobile-First Design
Draggable bottom sheet, responsive layouts, and touch-optimized interactions for monitoring on the go.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, CSS Variables (Dark Theme) |
| **Animations** | Framer Motion 12, HTML Canvas |
| **State** | React Hooks, Custom Hooks |
| **Data Sources** | OpenWeather API, EPA AirNow, PurpleAir |
| **Deployment** | Vercel-ready (ISR + Edge caching) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                   │
│                                                         │
│  useLocation() ──► useRealtimeData() ──► Components     │
│                    useRiskProfile()      ┌─────────────┐│
│                         │               │ ImpactPulse  ││
│                         │               │ ParticleMap  ││
│                         ▼               │ HealthFcst   ││
│                    Dashboard            │ DataCards    ││
│                                         │ Recommend.  ││
│                                         └─────────────┘│
└────────────────────────┬────────────────────────────────┘
                         │ fetch
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Next.js API Routes                    │
│                                                         │
│  /api/aqi ──────────► DataService (singleton)           │
│  /api/risk/[id] ───►  ├─ OpenWeather                   │
│                        ├─ AirNow (EPA)                  │
│                        ├─ PurpleAir                     │
│                        └─ 5-min cache + fallback chain  │
│                              │                          │
│                              ▼                          │
│                        RiskEngine                       │
│                        ├─ calculateRiskScore()          │
│                        ├─ generateForecast()            │
│                        └─ getRecommendations()          │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Geolocation** — `useLocation` requests browser geolocation (falls back to NYC coordinates)
2. **Aggregation** — `DataService` queries all three APIs in parallel with a fallback chain: AirNow → PurpleAir → OpenWeather
3. **Risk Calculation** — `RiskEngine` normalizes environmental factors, applies profile multipliers, and generates scores
4. **Rendering** — Dashboard components consume data via custom hooks and render visualizations with Framer Motion animations

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/AuraTrace.git
cd AuraTrace

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Production Build

```bash
npm run build
npm start
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# Air Quality APIs (optional — falls back to realistic mock data)
OPENWEATHER_API_KEY=your_openweather_key
EPA_AIRNOW_API_KEY=your_airnow_key
PURPLEAIR_API_KEY=your_purpleair_key

# Default fallback coordinates (NYC)
DEFAULT_LAT=40.7128
DEFAULT_LON=-74.0060
```

> **Note:** The app is fully functional without any API keys. Mock data simulates realistic daily patterns including rush-hour pollution peaks.

### Getting API Keys

| Provider | Free Tier | Link |
|---|---|---|
| **OpenWeather** | 1,000 calls/day | [openweathermap.org/api](https://openweathermap.org/api) |
| **EPA AirNow** | Unlimited | [docs.airnowapi.org](https://docs.airnowapi.org/) |
| **PurpleAir** | On request | [develop.purpleair.com](https://develop.purpleair.com/) |

---

## 📁 Project Structure

```
AuraTrace/
├── public/                    # Static assets
├── scripts/
│   └── test-openweather.js    # API connectivity tester
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (Inter font, metadata)
│   │   ├── page.tsx           # Landing page with hero & features
│   │   ├── globals.css        # CSS variables, glass-morphism theme
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Main monitoring dashboard
│   │   ├── docs/
│   │   │   └── page.tsx       # Documentation with sidebar nav
│   │   └── api/
│   │       ├── aqi/
│   │       │   └── route.ts   # GET — air quality + weather data
│   │       └── risk/
│   │           └── [profileId]/
│   │               └── route.ts  # GET — risk score + forecast
│   ├── components/
│   │   ├── DataCard.tsx       # Environmental metric display
│   │   ├── Header.tsx         # In-page header with live clock
│   │   ├── HealthForecast.tsx # 12-hour strain spline chart
│   │   ├── Icons.tsx          # Custom SVG icon library
│   │   ├── ImpactPulse.tsx    # Animated risk score gauge
│   │   ├── LocationPrompt.tsx # Geolocation permission dialog
│   │   ├── MobileBottomSheet.tsx # Draggable mobile modal
│   │   ├── Navbar.tsx         # Fixed top navigation bar
│   │   ├── NavbarWrapper.tsx  # Client-side navbar wrapper
│   │   ├── ParticleMap.tsx    # SVG smoke density heat map
│   │   ├── ProfileToggle.tsx  # Health profile selector
│   │   ├── RecommendationPanel.tsx # Adaptive health guidance
│   │   └── SmokeBackground.tsx    # Canvas particle animation
│   ├── hooks/
│   │   ├── useLocation.ts     # Browser geolocation hook
│   │   └── useRealtimeData.ts # Data fetching + polling hook
│   ├── lib/
│   │   ├── api.ts             # Client-side API helpers
│   │   ├── data-service.ts    # Singleton data aggregator
│   │   ├── risk-engine.ts     # Risk scoring + forecast engine
│   │   └── data-sources/
│   │       ├── airnow.ts      # EPA AirNow integration
│   │       ├── openweather.ts # OpenWeather integration
│   │       └── purpleair.ts   # PurpleAir sensor network
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── eslint.config.mjs
```

---

## 📡 API Reference

### `GET /api/aqi`

Returns current air quality and weather data for a location.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `lat` | `number` | Yes | Latitude |
| `lon` | `number` | Yes | Longitude |

**Response:**
```json
{
  "aqi": 72,
  "pm25": 22.5,
  "temperature": 28,
  "humidity": 55,
  "windSpeed": 3.2,
  "visibility": 8.5,
  "source": "openweather",
  "timestamp": "2026-03-10T12:00:00Z"
}
```

### `GET /api/risk/:profileId`

Returns a personalized risk assessment with forecast and recommendations.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `lat` | `number` | Yes | Latitude |
| `lon` | `number` | Yes | Longitude |
| `profileId` | `string` | Yes | `asthma`, `elderly`, or `infant` |

**Response:**
```json
{
  "riskScore": 65,
  "riskLevel": "high",
  "forecast": [
    { "hour": 0, "strain": 45, "aqi": 72 },
    { "hour": 1, "strain": 48, "aqi": 75 }
  ],
  "recommendations": [
    {
      "text": "Keep rescue inhaler accessible",
      "severity": "warn",
      "icon": "lung"
    }
  ]
}
```

> Both endpoints use **5-minute ISR caching** for optimal performance.

---

## 🫁 Health Profiles

AuraTrace supports three vulnerability profiles, each with a distinct risk multiplier that adjusts the base environmental risk score:

| Profile | Multiplier | Key Recommendations |
|---|---|---|
| **🫁 Asthma** | 1.4× | Rescue inhaler, avoid triggers, nebulizer use, indoor air filtration |
| **👴 Elderly** | 1.2× | Blood pressure monitoring, hydration, medication timing, indoor rest |
| **👶 Infant** | 1.6× | Sealed windows, HEPA filtration, outdoor avoidance, pediatric consultation |

### Risk Levels

| Score | Level | Color | Meaning |
|---|---|---|---|
| 0–30 | **Low** | 🟢 Green | Safe for most activities |
| 31–60 | **Moderate** | 🟡 Yellow | Take precautions, limit exposure |
| 61–100 | **High** | 🔴 Red | Stay indoors, follow medical guidance |

---

## 📡 Data Sources

### OpenWeather API
- **Purpose:** Weather conditions + fallback air quality
- **AQI Method:** EPA PM2.5 breakpoint conversion (official formula)
- **Fallback:** Realistic mock data with daily variation patterns

### EPA AirNow
- **Purpose:** Official U.S. government air quality readings
- **Search Radius:** 25 km from user location
- **Timeout:** 12 seconds (fast fallback on slow response)

### PurpleAir
- **Purpose:** Hyperlocal community sensor data
- **Method:** Bounding box query with inverse distance weighting
- **Filter:** Only sensors active within the last hour
- **Output:** Weighted PM2.5 average from nearby sensors

### Fallback Chain

```
AirNow (official) → PurpleAir (hyperlocal) → OpenWeather (global) → Mock Data
```

Each source fails silently — the system always returns usable data.

---

## 🧩 Components

| Component | Description |
|---|---|
| **ImpactPulse** | Animated SVG gauge with concentric pulsing rings — risk score at center, color shifts from green → yellow → red |
| **ParticleMap** | SVG heat map with animated gradient hotspots, road networks, and a location pin |
| **HealthForecast** | Smooth Catmull-Rom spline chart with gradient fill showing 12-hour respiratory strain |
| **DataCard** | Glass-morphism cards displaying AQI, PM2.5, temperature, humidity, wind speed, and visibility |
| **RecommendationPanel** | Severity-tagged recommendation list with contextual icons and color-coded borders |
| **ProfileToggle** | Segmented pill selector for switching between Asthma / Elderly / Infant profiles |
| **SmokeBackground** | Full-viewport canvas rendering drifting particles — density and speed scale with current AQI |
| **MobileBottomSheet** | Touch-draggable modal with snap points and pull-to-dismiss gesture |
| **LocationPrompt** | Animated dialog requesting geolocation permission with privacy messaging |

---

## 🧪 Testing

```bash
# Test OpenWeather API connectivity
node scripts/test-openweather.js
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with care for the people who need clean air the most.**

</div>
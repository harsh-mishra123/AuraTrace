// Matching the frontend interfaces
export interface AirQualityData {
  aqi: number;           // 0-500
  pm25: number;          // µg/m³
  pm10?: number;         // µg/m³
  ozone?: number;        // ppb
  timestamp: string;
  source: 'epa' | 'purpleair' | 'openweather';
}

export interface WeatherData {
  temperature: number;   // °C
  humidity: number;      // %
  windSpeed: number;     // m/s
  windDirection: number; // degrees
  visibility: number;    // km
  timestamp: string;
}

export interface HealthProfile {
  id: 'asthma' | 'elderly' | 'infant';
  multiplier: number;    // Risk multiplier (1.4, 1.2, 1.6)
}

export interface RiskScore {
  profileId: string;
  score: number;         // 0-100
  level: 'low' | 'moderate' | 'high';
  aqi: number;
  contributingFactors: {
    pm25: number;
    temperature: number;
    humidity: number;
    wind: number;
  };
  timestamp: string;
}

export interface ForecastPoint {
  hour: string;          // "Now", "1h", "2h", etc.
  strain: number;        // 0-100
  aqi: number;
  timestamp: string;
}

export interface Recommendation {
  id: string;
  icon: React.ReactNode; // Will be mapped server-side or client-side
  text: string;
  severity: 'safe' | 'warn' | 'hazard';
}

export interface HeatZone {
  x: number;             // % position (0-100)
  y: number;             // % position (0-100)
  intensity: number;     // 0-1
  size: number;          // pixels
}
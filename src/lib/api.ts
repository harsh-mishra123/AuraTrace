// Types for API responses
export interface AQIResponse {
  aqi: number;
  pm25: number;
  pm10?: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  category: string;
  color: string;
  timestamp: string;
  source: string;
  location: { lat: number; lon: number };
}

export interface RiskResponse {
  profileId: string;
  score: number;
  level: 'low' | 'moderate' | 'high';
  aqi: number;
  forecast: Array<{ hour: string; strain: number; aqi: number }>;
  recommendations: Array<{
    id: string;
    text: string;
    severity: 'safe' | 'warn' | 'hazard';
  }>;
  timestamp: string;
}

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `API error: ${res.status}`);
  }

  return res.json();
}

// API functions with location support
export const api = {
  // Get current AQI and weather
  getAQI: (lat?: number, lon?: number) => {
    const params = new URLSearchParams();
    if (lat) params.append('lat', lat.toString());
    if (lon) params.append('lon', lon.toString());
    
    return fetchAPI<AQIResponse>(`/api/aqi?${params.toString()}`);
  },

  // Get risk score for a profile
  getRisk: (profileId: string, lat?: number, lon?: number) => {
    const params = new URLSearchParams();
    if (lat) params.append('lat', lat.toString());
    if (lon) params.append('lon', lon.toString());
    
    return fetchAPI<RiskResponse>(`/api/risk/${profileId}?${params.toString()}`);
  },
};
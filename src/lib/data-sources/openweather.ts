import { WeatherData, AirQualityData } from '@/types';

interface OpenWeatherResponse {
  coord: { lon: number; lat: number };
  weather: Array<{ main: string; description: string; icon: string }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  dt: number;
  name: string;
  cod: number;
}

interface OpenWeatherAirResponse {
  coord: { lon: number; lat: number };
  list: Array<{
    main: { aqi: number };
    components: {
      pm2_5: number;
      pm10: number;
      o3: number;
      no2: number;
      so2: number;
      co: number;
    };
    dt: number;
  }>;
}

// EPA standard AQI breakpoints for PM2.5 (24-hour average)
const PM25_BREAKPOINTS = [
  { low: 0.0, high: 12.0, aqiLow: 0, aqiHigh: 50 },
  { low: 12.1, high: 35.4, aqiLow: 51, aqiHigh: 100 },
  { low: 35.5, high: 55.4, aqiLow: 101, aqiHigh: 150 },
  { low: 55.5, high: 150.4, aqiLow: 151, aqiHigh: 200 },
  { low: 150.5, high: 250.4, aqiLow: 201, aqiHigh: 300 },
  { low: 250.5, high: 500.4, aqiLow: 301, aqiHigh: 500 },
];

function calculateAQIFromPM25(pm25: number): number {
  if (pm25 < 0) return 0;
  
  const breakpoint = PM25_BREAKPOINTS.find(
    bp => pm25 >= bp.low && pm25 <= bp.high
  );
  
  if (!breakpoint) {
    // Above 500.4
    return 500;
  }
  
  // Linear interpolation formula: 
  // AQI = ((AQI_high - AQI_low) / (Conc_high - Conc_low)) * (Conc - Conc_low) + AQI_low
  const aqi = Math.round(
    ((breakpoint.aqiHigh - breakpoint.aqiLow) / 
     (breakpoint.high - breakpoint.low)) * 
    (pm25 - breakpoint.low) + 
    breakpoint.aqiLow
  );
  
  return Math.min(500, Math.max(0, aqi));
}

export class OpenWeatherClient {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';
  private useMockData: boolean;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.useMockData = !apiKey || apiKey === 'your_key_here';
    
    if (this.useMockData) {
      console.warn('⚠️ OpenWeatherClient: Using mock data');
    } else {
      console.log('✅ OpenWeatherClient: Initialized with real API key');
    }
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    if (this.useMockData) {
      return this.getMockWeatherData();
    }

    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    
    try {
      const response = await fetch(url, {
        next: { revalidate: 300 } // Cache for 5 minutes
      });
      const data: OpenWeatherResponse = await response.json();
      
      if (data.cod === 401 || !response.ok) {
        console.error('❌ OpenWeather API error:', data);
        return this.getMockWeatherData();
      }
      
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 10) / 10,
        windDirection: data.wind.deg,
        visibility: data.visibility / 1000,
        timestamp: new Date(data.dt * 1000).toISOString(),
      };
    } catch (error) {
      console.error('❌ Failed to fetch weather data:', error);
      return this.getMockWeatherData();
    }
  }

  async getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
    if (this.useMockData) {
      return this.getMockAirQualityData();
    }

    const url = `${this.baseUrl}/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    
    try {
      const response = await fetch(url, {
        next: { revalidate: 300 }
      });
      const data: OpenWeatherAirResponse = await response.json();
      
      if (!response.ok) {
        console.error('❌ OpenWeather Air API error:', data);
        return this.getMockAirQualityData();
      }
      
      const airData = data.list[0];
      const pm25 = airData.components.pm2_5;
      
      // Calculate standard AQI from PM2.5 using EPA formula
      const standardAQI = calculateAQIFromPM25(pm25);
      
      return {
        aqi: standardAQI,
        pm25: Math.round(pm25 * 10) / 10,
        pm10: Math.round(airData.components.pm10 * 10) / 10,
        ozone: Math.round(airData.components.o3 * 10) / 10,
        timestamp: new Date(airData.dt * 1000).toISOString(),
        source: 'openweather',
      };
    } catch (error) {
      console.error('❌ Failed to fetch air quality:', error);
      return this.getMockAirQualityData();
    }
  }

  private getMockWeatherData(): WeatherData {
    const hour = new Date().getHours();
    const tempBase = 22;
    const tempVariation = Math.sin((hour - 14) * Math.PI / 12) * 5;
    
    return {
      temperature: Math.round(tempBase + tempVariation),
      humidity: Math.round(45 + Math.random() * 20),
      windSpeed: Math.round((3 + Math.random() * 4) * 10) / 10,
      windDirection: Math.round(Math.random() * 360),
      visibility: Math.round((8 + Math.random() * 4) * 10) / 10,
      timestamp: new Date().toISOString(),
    };
  }

  private getMockAirQualityData(): AirQualityData {
    const hour = new Date().getHours();
    let baseAQI = 85;
    
    if (hour >= 7 && hour <= 9) baseAQI = 120;
    else if (hour >= 17 && hour <= 19) baseAQI = 130;
    else if (hour >= 23 || hour <= 4) baseAQI = 60;
    
    const aqi = Math.round(baseAQI + (Math.random() * 20 - 10));
    const pm25 = Math.round((aqi / 500) * 200 * 10) / 10;
    
    return {
      aqi,
      pm25,
      pm10: Math.round(pm25 * 1.2 * 10) / 10,
      ozone: Math.round(30 + Math.random() * 15),
      timestamp: new Date().toISOString(),
      source: 'openweather',
    };
  }
}
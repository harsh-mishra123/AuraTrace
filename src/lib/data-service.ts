import { OpenWeatherClient } from './data-sources/openweather';
import { AirNowClient } from './data-sources/airnow';
import { PurpleAirClient } from './data-sources/purpleair';
import { RiskEngine } from './risk-engine';
import type { WeatherData, AirQualityData, RiskScore, ForecastPoint, Recommendation } from '@/types';

class DataService {
  private openWeather: OpenWeatherClient;
  private airNow: AirNowClient;
  private purpleAir: PurpleAirClient;
  private riskEngine: RiskEngine;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    const openWeatherKey = process.env.OPENWEATHER_API_KEY || '';
    const airNowKey = process.env.EPA_AIRNOW_API_KEY || '';
    const purpleAirKey = process.env.PURPLEAIR_API_KEY || '';

    this.openWeather = new OpenWeatherClient(openWeatherKey);
    this.airNow = new AirNowClient(airNowKey);
    this.purpleAir = new PurpleAirClient(purpleAirKey);
    this.riskEngine = new RiskEngine();

    console.log('📡 DataService initialized with sources:', {
      openWeather: openWeatherKey ? '✅' : '❌',
      airNow: airNowKey ? '✅' : '❌',
      purpleAir: purpleAirKey ? '✅' : '❌',
    });
  }

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Convert PM2.5 concentration to AQI using EPA formula
  private pm25ToAQI(pm25: number): number {
    if (pm25 <= 12.0) return Math.round((50 / 12) * pm25);
    if (pm25 <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
    if (pm25 <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
    if (pm25 <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
    if (pm25 <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
    return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301);
  }

  // Get hyperlocal PM2.5 from PurpleAir sensors
  async getHyperlocalPM25(lat: number, lon: number, radius: number = 5) {
    const cacheKey = `purpleair-${lat}-${lon}-${radius}`;
    const cached = this.getCached<{ pm25: number; sensorCount: number; sensors: any[] }>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const sensors = await this.purpleAir.getSensorsInArea(lat, lon, radius);
      
      if (sensors.length === 0) {
        return null;
      }

      // Filter sensors seen in last hour
      const now = Date.now() / 1000;
      const recentSensors = sensors.filter(s => (now - s.lastSeen) < 3600);
      
      if (recentSensors.length === 0) {
        return null;
      }

      // Calculate weighted average based on proximity
      const sensorsWithWeight = recentSensors.map(sensor => {
        const distance = this.calculateDistance(lat, lon, sensor.latitude, sensor.longitude);
        const weight = 1 / (distance + 0.1); // Inverse distance weighting
        return {
          ...sensor,
          weight,
          pm25: sensor.pm25_atm || sensor.pm25_cf1,
        };
      });

      const totalWeight = sensorsWithWeight.reduce((sum, s) => sum + s.weight, 0);
      const weightedPM25 = sensorsWithWeight.reduce((sum, s) => sum + (s.pm25 * s.weight), 0) / totalWeight;

      const result = {
        pm25: Math.round(weightedPM25 * 10) / 10,
        sensorCount: recentSensors.length,
        sensors: recentSensors.map(s => ({
          id: s.id,
          name: s.name,
          pm25: s.pm25_atm || s.pm25_cf1,
          lat: s.latitude,
          lon: s.longitude,
        })),
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('PurpleAir error:', error);
      return null;
    }
  }

  // Calculate distance between two coordinates (km)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Get best available AQI by combining multiple sources
  async getBestAvailableAQI(lat: number, lon: number): Promise<{
    aqi: number;
    pm25: number;
    source: string;
    confidence: 'high' | 'medium' | 'low';
    sensorCount?: number;
  }> {
    const cacheKey = `best-aqi-${lat}-${lon}`;
    const cached = this.getCached<any>(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Try AirNow first (official government data)
    if (this.airNow) {
      try {
        const airNow = await this.airNow.getCurrentConditions(lat, lon);
        if (airNow && airNow.aqi) {
          const result = {
            aqi: airNow.aqi,
            pm25: airNow.pm25 || this.aqiToPM25(airNow.aqi),
            source: 'airnow',
            confidence: 'high' as const,
          };
          this.setCache(cacheKey, result);
          return result;
        }
      } catch (error) {
        console.warn('AirNow failed, falling back to PurpleAir');
      }
    }

    // Try PurpleAir next (hyperlocal)
    if (this.purpleAir) {
      try {
        const purpleAir = await this.getHyperlocalPM25(lat, lon);
        if (purpleAir && purpleAir.pm25) {
          const result = {
            aqi: this.pm25ToAQI(purpleAir.pm25),
            pm25: purpleAir.pm25,
            source: 'purpleair',
            confidence: purpleAir.sensorCount > 3 ? 'high' : 'medium',
            sensorCount: purpleAir.sensorCount,
          };
          this.setCache(cacheKey, result);
          return result;
        }
      } catch (error) {
        console.warn('PurpleAir failed, falling back to OpenWeather');
      }
    }

    // Finally fallback to OpenWeather
    const airQuality = await this.openWeather.getAirQuality(lat, lon);
    const result = {
      aqi: airQuality.aqi,
      pm25: airQuality.pm25,
      source: 'openweather',
      confidence: 'low' as const,
    };
    
    this.setCache(cacheKey, result);
    return result;
  }

  // Convert AQI back to approximate PM2.5 (for sources that only provide AQI)
  private aqiToPM25(aqi: number): number {
    if (aqi <= 50) return (aqi / 50) * 12;
    if (aqi <= 100) return 12 + ((aqi - 50) / 50) * (35.4 - 12);
    if (aqi <= 150) return 35.4 + ((aqi - 100) / 50) * (55.4 - 35.4);
    if (aqi <= 200) return 55.4 + ((aqi - 150) / 50) * (150.4 - 55.4);
    if (aqi <= 300) return 150.4 + ((aqi - 200) / 100) * (250.4 - 150.4);
    return 250.4 + ((aqi - 300) / 200) * (500.4 - 250.4);
  }

  // Get route-specific air quality data
  async getRouteAQI(path: Array<{ lat: number; lon: number }>) {
    const results = [];
    
    for (const point of path) {
      const aqi = await this.getBestAvailableAQI(point.lat, point.lon);
      results.push({
        ...point,
        ...aqi,
      });
    }
    
    return results;
  }

  // Override getCurrentConditions to use best available AQI
  async getCurrentConditions(lat?: number, lon?: number): Promise<{
    weather: WeatherData;
    airQuality: AirQualityData;
  }> {
    const cacheKey = `conditions-${lat || 'default'}-${lon || 'default'}`;
    const cached = this.getCached<{ weather: WeatherData; airQuality: AirQualityData }>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const defaultLat = parseFloat(process.env.DEFAULT_LAT || '40.7128');
    const defaultLon = parseFloat(process.env.DEFAULT_LON || '-74.0060');
    const targetLat = lat || defaultLat;
    const targetLon = lon || defaultLon;
    
    // Get weather from OpenWeather (still needed)
    const weather = await this.openWeather.getCurrentWeather(targetLat, targetLon);
    
    // Get best available AQI from our new method
    const bestAQI = await this.getBestAvailableAQI(targetLat, targetLon);
    
    const airQuality: AirQualityData = {
      aqi: bestAQI.aqi,
      pm25: bestAQI.pm25,
      pm10: bestAQI.pm25 * 1.2, // Estimate if not available
      ozone: 30, // Default if not available
      timestamp: new Date().toISOString(),
      source: bestAQI.source,
    };

    const result = { weather, airQuality };
    this.setCache(cacheKey, result);
    
    console.log(`📍 Current conditions: ${bestAQI.source} AQI ${bestAQI.aqi} (confidence: ${bestAQI.confidence})`);
    
    return result;
  }

  async getRiskScore(profileId: string, lat?: number, lon?: number): Promise<RiskScore & {
    forecast: ForecastPoint[];
    recommendations: Recommendation[];
  }> {
    const cacheKey = `risk-${profileId}-${lat || 'default'}-${lon || 'default'}`;
    const cached = this.getCached<any>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { weather, airQuality } = await this.getCurrentConditions(lat, lon);
    
    const riskScore = this.riskEngine.calculateRiskScore(profileId, airQuality, weather);
    const forecast = this.riskEngine.generateForecast(profileId, airQuality.aqi, riskScore.score);
    const recommendations = this.riskEngine.getRecommendations(profileId, riskScore.score, airQuality.aqi);

    const result = {
      ...riskScore,
      forecast,
      recommendations,
    };

    this.setCache(cacheKey, result);
    return result;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Export a singleton instance
export const dataService = new DataService();
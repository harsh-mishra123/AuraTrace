import { OpenWeatherClient } from './data-sources/openweather';
import { RiskEngine } from './risk-engine';
import type { WeatherData, AirQualityData, RiskScore, ForecastPoint, Recommendation } from '@/types';

class DataService {
  private openWeather: OpenWeatherClient;
  private riskEngine: RiskEngine;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    const apiKey = process.env.OPENWEATHER_API_KEY || '';
    this.openWeather = new OpenWeatherClient(apiKey);
    this.riskEngine = new RiskEngine();
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
    
    const [weather, airQuality] = await Promise.all([
      this.openWeather.getCurrentWeather(lat || defaultLat, lon || defaultLon),
      this.openWeather.getAirQuality(lat || defaultLat, lon || defaultLon),
    ]);

    const result = { weather, airQuality };
    this.setCache(cacheKey, result);
    
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
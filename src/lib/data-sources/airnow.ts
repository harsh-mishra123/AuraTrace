// src/lib/data-sources/airnow.ts
export class AirNowClient {
  private apiKey: string;
  private baseUrl = 'http://www.airnowapi.org/aq';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentConditions(lat: number, lon: number) {
    const url = `${this.baseUrl}/observation/latLong/current/?format=application/json&latitude=${lat}&longitude=${lon}&distance=25&API_KEY=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data || data.length === 0) {
        console.warn('No AirNow data for location');
        return null;
      }

      // AirNow returns array of pollutants [citation:3]
      const pm25 = data.find((d: any) => d.ParameterName === 'PM2.5');
      const pm10 = data.find((d: any) => d.ParameterName === 'PM10');
      const o3 = data.find((d: any) => d.ParameterName === 'O3');

      return {
        aqi: pm25?.AQI,
        pm25: pm25?.AQI, // Note: AirNow gives AQI, not raw concentration
        pm10: pm10?.AQI,
        ozone: o3?.AQI,
        timestamp: new Date().toISOString(),
        source: 'airnow',
      };
    } catch (error) {
      console.error('AirNow API error:', error);
      return null;
    }
  }
}
export class AirNowClient {
  private apiKey: string;
  private baseUrl = 'http://www.airnowapi.org/aq';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentConditions(lat: number, lon: number) {
    // Skip if no valid API key
    if (!this.apiKey || this.apiKey === 'your_key_here' || this.apiKey.length < 10) {
      return null;
    }

    const url = `${this.baseUrl}/observation/latLong/current/?format=application/json&latitude=${lat}&longitude=${lon}&distance=25&API_KEY=${this.apiKey}`;
    
    // SUPER SHORT TIMEOUT - 2 seconds max
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        next: { revalidate: 300 }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) return null;
      
      const data = await response.json();
      if (!data || data.length === 0) return null;

      const pm25 = data.find((d: any) => d.ParameterName === 'PM2.5');
      
      if (!pm25) return null;

      return {
        aqi: pm25.AQI,
        pm25: pm25.AQI,
        source: 'airnow',
      };
    } catch (error) {
      clearTimeout(timeoutId);
      // COMPLETELY SILENT - no console logs
      return null;
    }
  }
}
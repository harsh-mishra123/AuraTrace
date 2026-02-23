// src/lib/data-sources/purpleair.ts
export class PurpleAirClient {
  private apiKey: string;
  private baseUrl = 'https://api.purpleair.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getSensorsInArea(lat: number, lon: number, radius: number = 50) {
    // PurpleAir API v1 uses bounding box [citation:4]
    const latMin = lat - (radius / 111); // 1° lat ≈ 111km
    const latMax = lat + (radius / 111);
    const lonMin = lon - (radius / (111 * Math.cos(lat * Math.PI / 180)));
    const lonMax = lon + (radius / (111 * Math.cos(lat * Math.PI / 180)));

    const url = `${this.baseUrl}/sensors?fields=name,last_seen,pm2.5_atm,pm2.5_cf_1,latitude,longitude&location_type=0&nwlng=${lonMin}&nwlat=${latMax}&selng=${lonMax}&selat=${latMin}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'X-API-Key': this.apiKey,
        },
      });
      
      const data = await response.json();
      
      if (!data.data) return [];

      // Parse PurpleAir response format [citation:4]
      return data.data.map((sensor: any[]) => ({
        id: sensor[0],
        name: sensor[1],
        lastSeen: sensor[2],
        pm25_atm: sensor[3],
        pm25_cf1: sensor[4],
        latitude: sensor[5],
        longitude: sensor[6],
      }));
    } catch (error) {
      console.error('PurpleAir API error:', error);
      return [];
    }
  }

  async getSensorHistory(sensorId: string, startDate: Date, endDate: Date) {
    const url = `${this.baseUrl}/sensors/${sensorId}/history?fields=pm2.5_atm&start_timestamp=${Math.floor(startDate.getTime() / 1000)}&end_timestamp=${Math.floor(endDate.getTime() / 1000)}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'X-API-Key': this.apiKey,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('PurpleAir history error:', error);
      return null;
    }
  }
}
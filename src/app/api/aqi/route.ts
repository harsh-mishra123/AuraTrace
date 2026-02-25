import { NextResponse } from 'next/server';
import { dataService } from '@/lib/data-service';

export async function GET(request: Request) {
  try {
    // Get location from query params or use defaults
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || process.env.DEFAULT_LAT || '40.7128');
    const lon = parseFloat(searchParams.get('lon') || process.env.DEFAULT_LON || '-74.0060');

    console.log(` Fetching AQI data for coordinates: ${lat}, ${lon}`);

    // Fetch data using the service (which handles caching)
    const { weather, airQuality } = await dataService.getCurrentConditions(lat, lon);

    // Determine AQI category and color
    let category = 'Good';
    let color = 'var(--accent-safe)';
    
    if (airQuality.aqi > 300) {
      category = 'Hazardous';
      color = 'var(--accent-hazard)';
    } else if (airQuality.aqi > 200) {
      category = 'Very Unhealthy';
      color = 'var(--accent-hazard)';
    } else if (airQuality.aqi > 150) {
      category = 'Unhealthy';
      color = 'var(--accent-hazard)';
    } else if (airQuality.aqi > 100) {
      category = 'Unhealthy for Sensitive Groups';
      color = 'var(--accent-warn)';
    } else if (airQuality.aqi > 50) {
      category = 'Moderate';
      color = 'var(--accent-warn)';
    }

    const response = {
      aqi: airQuality.aqi,
      pm25: airQuality.pm25,
      pm10: airQuality.pm10,
      ozone: airQuality.ozone,
      temperature: weather.temperature,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      windDirection: weather.windDirection,
      visibility: weather.visibility,
      category,
      color,
      timestamp: new Date().toISOString(),
      source: airQuality.source,
      location: { lat, lon },
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150',
      },
    });
  } catch (error) {
    console.error(' AQI API route error:', error);
    
    const isDev = process.env.NODE_ENV === 'development';
    return NextResponse.json(
      { 
        error: 'Failed to fetch air quality data',
        ...(isDev && { details: error instanceof Error ? error.message : String(error) })
      },
      { status: 500 }
    );
  }
}

// Revalidate every 5 minutes
export const revalidate = 300;
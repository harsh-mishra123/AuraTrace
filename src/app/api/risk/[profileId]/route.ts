import { NextResponse } from 'next/server';
import { dataService } from '@/lib/data-service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ profileId: string }> }
) {
  try {
    // Await the params (Next.js 15+ requires this)
    const { profileId } = await params;
    
    // Validate profile
    if (!['asthma', 'elderly', 'infant'].includes(profileId)) {
      return NextResponse.json(
        { error: 'Invalid profile ID. Must be asthma, elderly, or infant' },
        { status: 400 }
      );
    }

    // Get location from query params or use defaults
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || process.env.DEFAULT_LAT || '40.7128');
    const lon = parseFloat(searchParams.get('lon') || process.env.DEFAULT_LON || '-74.0060');

    console.log(`📍 Fetching risk data for ${profileId} at coordinates: ${lat}, ${lon}`);

    // Get risk data from the data service (which handles caching)
    const riskData = await dataService.getRiskScore(profileId, lat, lon);

    // Add CORS headers if needed
    return NextResponse.json(riskData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150',
      },
    });
  } catch (error) {
    console.error('❌ Risk API error:', error);
    
    // Return a more detailed error in development
    const isDev = process.env.NODE_ENV === 'development';
    return NextResponse.json(
      { 
        error: 'Failed to calculate risk score',
        ...(isDev && { details: error instanceof Error ? error.message : String(error) })
      },
      { status: 500 }
    );
  }
}

// Optional: Add revalidation for ISR
export const revalidate = 300; // 5 minutes
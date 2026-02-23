import { useState, useEffect, useCallback } from 'react';
import { useLocation } from './useLocation';

interface AQIResponse {
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
  location: { lat: number; lon: number; city?: string; country?: string };
}

interface RiskResponse {
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

export function useRealtimeData() {
  const location = useLocation();
  const [data, setData] = useState<Partial<AQIResponse>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (location.loading) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lon: location.lon.toString(),
      });
      
      // FIXED: Changed from '/api/api' to '/api/aqi'
      const response = await fetch(`/api/aqi?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch air quality data');
      }
      
      const result = await response.json();
      setData({
        ...result,
        location: {
          ...result.location,
          city: location.city,
          country: location.country,
        },
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [location.lat, location.lon, location.loading, location.city, location.country]);

  useEffect(() => {
    fetchData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    ...data,
    loading: loading || location.loading,
    error: error || location.error,
    refresh: fetchData,
  } as AQIResponse & { loading: boolean; error: string | null; refresh: () => void };
}

export function useRiskProfile(profileId: string) {
  const location = useLocation();
  const [data, setData] = useState<RiskResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (location.loading || !profileId) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lon: location.lon.toString(),
      });
      
      const response = await fetch(`/api/risk/${profileId}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch risk data');
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [profileId, location.lat, location.lon, location.loading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading: loading || location.loading,
    error: error || location.error,
    refresh: fetchData,
  };
}
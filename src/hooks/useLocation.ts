import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
  loading: boolean;
  error: string | null;
}

export function useLocation() {
  const [location, setLocation] = useState<Location>({
    lat: 40.7128, // Default to NYC
    lon: -74.0060,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Optional: Get city name from coordinates (reverse geocoding)
        try {
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
          );
          const data = await response.json();
          const city = data[0]?.name;
          const country = data[0]?.country;
          
          setLocation({
            lat: latitude,
            lon: longitude,
            city,
            country,
            loading: false,
            error: null,
          });
        } catch (error) {
          // Still set location even if reverse geocoding fails
          setLocation({
            lat: latitude,
            lon: longitude,
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        let errorMessage = 'Failed to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Please allow location access to get local air quality data';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  return location;
}
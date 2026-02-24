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
    lat: 28.6139, // Default to Delhi
    lon: 77.2090,
    city: "Delhi",
    country: "IN",
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      console.log('Geolocation not supported, using default location (Delhi)');
      setLocation(prev => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    console.log('Requesting location permission...');

    // Request location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Location granted:', latitude, longitude);
        
        // Determine city based on coordinates
        let city = "Your location";
        
        // Delhi region
        if (latitude > 28.4 && latitude < 29 && longitude > 76.8 && longitude < 77.5) {
          city = "Delhi";
        }
        // Mumbai region
        else if (latitude > 18.9 && latitude < 19.3 && longitude > 72.8 && longitude < 73.0) {
          city = "Mumbai";
        }
        // Bangalore region
        else if (latitude > 12.9 && latitude < 13.1 && longitude > 77.5 && longitude < 77.7) {
          city = "Bengaluru";
        }
        // Chennai region
        else if (latitude > 13.0 && latitude < 13.2 && longitude > 80.2 && longitude < 80.3) {
          city = "Chennai";
        }
        // Kolkata region
        else if (latitude > 22.5 && latitude < 22.6 && longitude > 88.3 && longitude < 88.4) {
          city = "Kolkata";
        }
        
        setLocation({
          lat: latitude,
          lon: longitude,
          city: city,
          country: "IN",
          loading: false,
          error: null,
        });
      },
      (error) => {
        // Handle different error types
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Using Delhi as default.';
            console.warn('User denied location permission');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable. Using Delhi as default.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Using Delhi as default.';
            break;
        }
        
        console.warn(errorMessage);
        
        // Use default Delhi location
        setLocation({
          lat: 28.6139,
          lon: 77.2090,
          city: "Delhi",
          country: "IN",
          loading: false,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return location;
}
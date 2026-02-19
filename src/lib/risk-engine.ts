import { WeatherData, AirQualityData, RiskScore } from '@/types';

const PROFILE_MULTIPLIERS = {
  asthma: 1.4,
  elderly: 1.2,
  infant: 1.6,
};

export class RiskEngine {
  calculateRiskScore(
    profileId: string,
    aqiData: AirQualityData,
    weatherData: WeatherData
  ): RiskScore {
    // Normalize PM2.5 (0-500 scale to 0-100)
    const pm25Normalized = Math.min(100, (aqiData.pm25 / 250) * 100);
    
    // Heat index factor (temperature above 30°C adds risk)
    const heatFactor = Math.max(0, (weatherData.temperature - 30) / 20);
    
    // Humidity factor (below 30% or above 70% adds risk)
    const humidityFactor = 
      weatherData.humidity < 30 ? (30 - weatherData.humidity) / 30 :
      weatherData.humidity > 70 ? (weatherData.humidity - 70) / 30 : 0;
    
    // Wind factor (low wind = less dispersion = higher risk)
    const windFactor = Math.max(0, (5 - weatherData.windSpeed) / 5);
    
    // Calculate raw score (0-100)
    const rawScore = 
      (pm25Normalized * 0.6) +      // PM2.5 is primary factor (60%)
      (heatFactor * 0.2) +          // Temperature (20%)
      (humidityFactor * 0.1) +       // Humidity (10%)
      (windFactor * 0.1);            // Wind (10%)
    
    // Apply profile multiplier
    const multiplier = PROFILE_MULTIPLIERS[profileId as keyof typeof PROFILE_MULTIPLIERS] || 1.0;
    const finalScore = Math.min(100, Math.round(rawScore * multiplier));
    
    // Determine risk level
    let level: 'low' | 'moderate' | 'high';
    if (finalScore <= 30) level = 'low';
    else if (finalScore <= 60) level = 'moderate';
    else level = 'high';
    
    return {
      profileId,
      score: finalScore,
      level,
      aqi: aqiData.aqi,
      contributingFactors: {
        pm25: Math.round(pm25Normalized),
        temperature: Math.round(heatFactor * 100),
        humidity: Math.round(humidityFactor * 100),
        wind: Math.round(windFactor * 100),
      },
      timestamp: new Date().toISOString(),
    };
  }

  generateForecast(
    profileId: string,
    currentAqi: number,
    currentScore: number
  ): Array<{ hour: string; strain: number; aqi: number }> {
    const forecast = [];
    const now = new Date();
    
    // Simple forecast model: AQI and strain follow a sine wave pattern
    // In production, this would use actual weather forecast data
    for (let i = 0; i <= 12; i++) {
      const hour = i === 0 ? 'Now' : `${i}h`;
      
      // Simulate variation based on time of day
      const timeOfDay = (now.getHours() + i) % 24;
      const timeFactor = Math.sin((timeOfDay - 6) * Math.PI / 12); // Peak at noon, low at midnight
      
      // AQI tends to be higher during day, lower at night
      const aqiVariation = Math.round(30 * timeFactor);
      const forecastAqi = Math.max(0, currentAqi + aqiVariation);
      
      // Strain follows AQI but with profile-specific sensitivity
      const baseStrain = (forecastAqi / 500) * 100;
      const multiplier = PROFILE_MULTIPLIERS[profileId as keyof typeof PROFILE_MULTIPLIERS] || 1.0;
      const strain = Math.min(100, Math.round(baseStrain * multiplier));
      
      forecast.push({
        hour,
        strain,
        aqi: forecastAqi,
      });
    }
    
    return forecast;
  }

  getRecommendations(
    profileId: string,
    riskScore: number,
    aqi: number
  ): Array<{ id: string; text: string; severity: 'safe' | 'warn' | 'hazard' }> {
    const recommendations = [];
    
    // General AQI-based recommendations
    if (aqi > 150) {
      recommendations.push({
        id: 'high-aqi-1',
        text: `Current AQI (${aqi}) is in hazardous range. Avoid all outdoor activity.`,
        severity: 'hazard',
      });
    } else if (aqi > 100) {
      recommendations.push({
        id: 'high-aqi-2',
        text: `AQI is elevated (${aqi}). Limit outdoor exposure and wear a mask if going out.`,
        severity: 'warn',
      });
    } else if (aqi <= 50) {
      recommendations.push({
        id: 'good-aqi-1',
        text: 'Air quality is good. Normal activities recommended.',
        severity: 'safe',
      });
    } else {
      recommendations.push({
        id: 'moderate-aqi-1',
        text: 'Air quality is moderate. Sensitive individuals should limit prolonged outdoor exertion.',
        severity: 'safe',
      });
    }
    
    // Profile-specific recommendations
    if (profileId === 'asthma') {
      if (riskScore > 60) {
        recommendations.push({
          id: 'asthma-1',
          text: 'High risk of bronchospasm. Keep rescue inhaler accessible and use preventive medication as prescribed.',
          severity: 'hazard',
        });
      } else if (riskScore > 30) {
        recommendations.push({
          id: 'asthma-2',
          text: 'Moderate risk. Consider pre-treatment before any outdoor activity.',
          severity: 'warn',
        });
      } else {
        recommendations.push({
          id: 'asthma-3',
          text: 'Low risk today. Continue normal asthma management.',
          severity: 'safe',
        });
      }
    }
    
    if (profileId === 'elderly') {
      if (riskScore > 50) {
        recommendations.push({
          id: 'elderly-1',
          text: 'Monitor blood pressure more frequently during poor air quality days. Stay in air-conditioned spaces.',
          severity: 'warn',
        });
      } else {
        recommendations.push({
          id: 'elderly-2',
          text: 'Monitor health closely. Stay hydrated and avoid strenuous activity.',
          severity: 'safe',
        });
      }
    }
    
    if (profileId === 'infant') {
      if (riskScore > 40) {
        recommendations.push({
          id: 'infant-1',
          text: 'Keep infant indoors with HEPA filtration running. Monitor breathing rate.',
          severity: 'hazard',
        });
      } else {
        recommendations.push({
          id: 'infant-2',
          text: 'Limit outdoor time. Ensure nursery has good air filtration.',
          severity: 'warn',
        });
      }
    }
    
    // Limit to 4 recommendations and remove duplicates
    return recommendations.slice(0, 4);
  }
}
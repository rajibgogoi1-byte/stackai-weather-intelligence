import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  HelpCircle,
  LucideIcon
} from 'lucide-react';
import { WeatherData, Recommendation } from '../types';

export interface WeatherCodeDetails {
  description: string;
  icon: LucideIcon;
  bgColorClass: string; // Tailwind gradient background
  textThemeClass: string; // Tailwind text color scheme
  accentColorClass: string; // Secondary highlights
}

/**
 * Maps standard WMO Weather Interpretation Codes (0-99) to human-readable text,
 * Lucide icons, and visual styling themes.
 */
export function getWeatherCodeDetails(code: number, isDay: boolean = true): WeatherCodeDetails {
  // Clear sky
  if (code === 0) {
    return {
      description: isDay ? 'Clear Sky' : 'Clear Night',
      icon: Sun,
      bgColorClass: isDay 
        ? 'from-blue-400 via-sky-400 to-amber-100' 
        : 'from-slate-900 via-indigo-950 to-slate-900',
      textThemeClass: isDay ? 'text-blue-900' : 'text-indigo-100',
      accentColorClass: isDay ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-800 text-slate-100 border-slate-700'
    };
  }
  
  // Mainly clear, partly cloudy, overcast
  if (code === 1 || code === 2 || code === 3) {
    const desc = code === 1 ? 'Mainly Clear' : code === 2 ? 'Partly Cloudy' : 'Overcast';
    return {
      description: desc,
      icon: CloudSun,
      bgColorClass: isDay 
        ? 'from-blue-500 via-sky-400 to-slate-100' 
        : 'from-slate-900 via-slate-800 to-indigo-950',
      textThemeClass: isDay ? 'text-blue-950' : 'text-slate-100',
      accentColorClass: isDay ? 'bg-sky-100 text-sky-800 border-sky-200' : 'bg-indigo-950 text-indigo-200 border-indigo-900'
    };
  }
  
  // Fog and depositing rime fog
  if (code === 45 || code === 48) {
    return {
      description: 'Foggy Conditions',
      icon: CloudFog,
      bgColorClass: 'from-slate-400 via-zinc-300 to-slate-200',
      textThemeClass: 'text-slate-800',
      accentColorClass: 'bg-slate-100 text-slate-700 border-slate-300'
    };
  }
  
  // Drizzle: Light, moderate, and dense intensity
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
    return {
      description: 'Drizzle Rain',
      icon: CloudDrizzle,
      bgColorClass: 'from-blue-600 via-sky-500 to-slate-300',
      textThemeClass: 'text-blue-950',
      accentColorClass: 'bg-blue-50 text-blue-800 border-blue-200'
    };
  }
  
  // Rain: Slight, moderate and heavy intensity
  if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67) {
    return {
      description: code === 65 ? 'Heavy Rain' : 'Rainy Weather',
      icon: CloudRain,
      bgColorClass: 'from-sky-700 via-blue-600 to-slate-400',
      textThemeClass: 'text-sky-50',
      accentColorClass: 'bg-sky-900/40 text-sky-200 border-sky-800'
    };
  }
  
  // Snow fall: Slight, moderate, and heavy intensity; Snow grains
  if (code === 71 || code === 73 || code === 75 || code === 77) {
    return {
      description: 'Snowfall',
      icon: CloudSnow,
      bgColorClass: 'from-cyan-200 via-sky-100 to-slate-50',
      textThemeClass: 'text-sky-950',
      accentColorClass: 'bg-white text-cyan-800 border-cyan-100'
    };
  }
  
  // Rain showers: Slight, moderate, and violent
  if (code === 80 || code === 81 || code === 82) {
    return {
      description: 'Rain Showers',
      icon: CloudRain,
      bgColorClass: 'from-blue-700 via-sky-600 to-slate-300',
      textThemeClass: 'text-blue-50',
      accentColorClass: 'bg-sky-950 text-sky-100 border-sky-800'
    };
  }
  
  // Snow showers: Slight and heavy
  if (code === 85 || code === 86) {
    return {
      description: 'Snow Showers',
      icon: CloudSnow,
      bgColorClass: 'from-teal-100 via-sky-100 to-white',
      textThemeClass: 'text-slate-800',
      accentColorClass: 'bg-teal-50 text-teal-800 border-teal-200'
    };
  }
  
  // Thunderstorm: Slight or moderate, or with hail
  if (code === 95 || code === 96 || code === 99) {
    return {
      description: 'Thunderstorm',
      icon: CloudLightning,
      bgColorClass: 'from-purple-900 via-indigo-950 to-slate-900',
      textThemeClass: 'text-indigo-100',
      accentColorClass: 'bg-purple-950 text-purple-200 border-purple-800'
    };
  }

  // Default fallback
  return {
    description: 'Unknown Weather',
    icon: HelpCircle,
    bgColorClass: 'from-blue-500 via-sky-400 to-white',
    textThemeClass: 'text-blue-900',
    accentColorClass: 'bg-blue-50 text-blue-800 border-blue-200'
  };
}

/**
 * Helper to obtain the abbreviated day of the week from a date string (YYYY-MM-DD).
 */
export function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Format date string into a user-friendly displays (e.g., "Thursday, July 23")
 */
export function formatFriendlyDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Generates highly descriptive rules-based weather intelligence recommendations
 * based on current weather parameters and the upcoming 7-day forecast.
 */
export function generateRecommendations(data: WeatherData): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const { current, daily } = data;
  
  // 1. Temperature checks
  if (current.temperature < 15) {
    recommendations.push({
      id: 'temp-cold',
      type: 'info',
      category: 'temperature',
      text: `Chilly weather current at ${current.temperature}°C. We recommend wearing warm clothes or layering up.`
    });
  } else if (current.temperature > 35) {
    recommendations.push({
      id: 'temp-hot',
      type: 'danger',
      category: 'temperature',
      text: `Extreme heat of ${current.temperature}°C detected. Stay hydrated, wear light clothing, and avoid direct midday sun.`
    });
  } else if (current.temperature >= 30 && current.temperature <= 35) {
    recommendations.push({
      id: 'temp-warm',
      type: 'warning',
      category: 'temperature',
      text: `Warm temperatures today (${current.temperature}°C). Keep a bottle of water handy to remain properly hydrated.`
    });
  }

  // 2. Precipitation/Rain Checks
  const isCurrentlyRaining = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(current.weatherCode);
  const rainInForecast = daily.slice(0, 3).some(day => day.precipitationProb > 45 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(day.weatherCode));
  
  if (isCurrentlyRaining) {
    recommendations.push({
      id: 'precip-now',
      type: 'danger',
      category: 'precipitation',
      text: 'It is currently raining. Be sure to carry an umbrella and wear water-resistant footwear if heading outside.'
    });
  } else if (rainInForecast) {
    recommendations.push({
      id: 'precip-forecast',
      type: 'warning',
      category: 'precipitation',
      text: 'Rain is expected in the coming days. Keeping an umbrella in your bag is highly advised!'
    });
  }

  // 3. Wind Checks
  if (current.windSpeed > 25) {
    recommendations.push({
      id: 'wind-strong',
      type: 'warning',
      category: 'wind',
      text: `Breezy conditions with wind speeds of ${current.windSpeed} km/h. Secure light outdoor objects and watch out for wind drafts.`
    });
  }

  // 4. Thunderstorm Check
  const isThunderstorm = [95, 96, 99].includes(current.weatherCode);
  if (isThunderstorm) {
    recommendations.push({
      id: 'thunderstorm',
      type: 'danger',
      category: 'general',
      text: 'Thunderstorm in progress. It is safest to remain indoors and avoid using high-power electrical appliances.'
    });
  }

  // 5. Perfect Outdoor Day Check
  const isClear = [0, 1, 2].includes(current.weatherCode);
  const isPerfectTemp = current.temperature >= 18 && current.temperature <= 28;
  const isDry = current.humidity < 75 && !isCurrentlyRaining;
  
  if (isClear && isPerfectTemp && isDry) {
    recommendations.push({
      id: 'outdoor-perfect',
      type: 'success',
      category: 'general',
      text: 'Superb weather conditions! It is an excellent day for outdoor activities, light exercise, or a walk in the park.'
    });
  }

  // 6. Generic Nice Forecast Check (fallback if recommendations are thin)
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'general-nice',
      type: 'success',
      category: 'general',
      text: 'Weather is stable and comfortable. A great time to plan your routine activities without weather disruptions.'
    });
  }

  return recommendations;
}

/**
 * Types and interfaces for the Weather Intelligence application.
 */

export interface CityGeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State or province
  country_code: string;
  population?: number;
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number; // Feels like
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProb: number;
}

export interface WeatherData {
  city: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecast[];
}

export interface Recommendation {
  id: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  text: string;
  category: 'temperature' | 'precipitation' | 'wind' | 'general';
}

export interface ChartDataPoint {
  dayName: string;
  dateStr: string;
  maxTemp: number;
  minTemp: number;
  avgTemp: number;
}

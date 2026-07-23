import { WeatherData } from '../types';
import { 
  getWeatherCodeDetails, 
  generateRecommendations, 
  formatFriendlyDate 
} from '../utils/weatherUtils';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  CloudRain, 
  Compass, 
  Clock, 
  MapPin, 
  Calendar 
} from 'lucide-react';
import ForecastList from './ForecastList';
import WeatherChart from './WeatherChart';
import Recommendations from './Recommendations';

interface WeatherDashboardProps {
  weatherData: WeatherData;
}

export default function WeatherDashboard({ weatherData }: WeatherDashboardProps) {
  const { current, daily, city, country, state, timezone } = weatherData;
  
  // Get active weather code styling
  const { 
    description, 
    icon: WeatherIcon, 
    bgColorClass, 
    textThemeClass 
  } = getWeatherCodeDetails(current.weatherCode, current.isDay);

  // Generate real-time recommendations
  const recommendations = generateRecommendations(weatherData);

  // Localized clock time from UTC/Timezone offset if available, or current formatted time
  const formatTime = (isoTimeStr: string) => {
    try {
      const date = new Date(isoTimeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="w-full space-y-6" id="dashboard-layout">
      
      {/* 1. Dynamic Weather Hero Card */}
      <div 
        id="dynamic-hero-banner"
        className={`w-full bg-gradient-to-br ${bgColorClass} ${textThemeClass} rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 transition-all duration-700 overflow-hidden relative`}
      >
        {/* Subtle background graphic */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10">
          <WeatherIcon size={300} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            {/* Location & Time info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="opacity-85 flex-shrink-0" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">
                  {city}
                  {state && <span className="font-normal text-base opacity-90">, {state}</span>}
                  <span className="font-light text-base opacity-80">, {country}</span>
                </h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs opacity-90 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {formatFriendlyDate(current.time)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  Local Time: {formatTime(current.time)} ({timezone})
                </span>
              </div>
            </div>

            {/* Weather status line */}
            <div className="flex items-center gap-4 pt-3">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
                <WeatherIcon size={44} className="stroke-[2]" />
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-black tracking-tighter">
                  {Math.round(current.temperature)}°C
                </p>
                <p className="text-sm font-bold tracking-wide uppercase opacity-90 mt-0.5">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics grid (non-nested layout design) */}
          <div className="grid grid-cols-2 gap-3 min-w-full md:min-w-[340px]" id="quick-metrics-grid">
            
            {/* Feels Like */}
            <div className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl text-current">
                <Thermometer size={18} />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-bold tracking-wider uppercase opacity-75">Feels Like</p>
                <p className="text-base font-extrabold">{Math.round(current.apparentTemperature)}°C</p>
              </div>
            </div>

            {/* Humidity */}
            <div className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl text-current">
                <Droplets size={18} />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-bold tracking-wider uppercase opacity-75">Humidity</p>
                <p className="text-base font-extrabold">{current.humidity}%</p>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl text-current">
                <Wind size={18} />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-bold tracking-wider uppercase opacity-75">Wind Speed</p>
                <p className="text-base font-extrabold">{current.windSpeed} km/h</p>
              </div>
            </div>

            {/* Precipitation */}
            <div className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl text-current">
                <CloudRain size={18} />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-bold tracking-wider uppercase opacity-75">Precipitation</p>
                <p className="text-base font-extrabold">{current.precipitation} mm</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Smart Recommendations */}
      <Recommendations recommendations={recommendations} />

      {/* 3. Charts & Analytics Section */}
      <WeatherChart dailyForecasts={daily} />

      {/* 4. 7-Day Extended Forecast */}
      <ForecastList forecasts={daily} />

    </div>
  );
}

import { useState, useEffect } from 'react';
import { WeatherData, CityGeocodingResult } from './types';
import SearchBar from './components/SearchBar';
import WeatherDashboard from './components/WeatherDashboard';
import { 
  CloudSun, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  TrendingUp,
  MapPin,
  Compass
} from 'lucide-react';

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchedCity, setLastSearchedCity] = useState<string>('New York');

  // Multi-matching location states
  const [matchingCities, setMatchingCities] = useState<CityGeocodingResult[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

  // Trigger search on mount with standard default city
  useEffect(() => {
    handleSearchCity(lastSearchedCity);
  }, []);

  const handleFetchWeatherForLocation = async (location: CityGeocodingResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const { name, latitude, longitude, country, admin1, timezone } = location;

      // 2. Fetch Forecast details
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
      
      const forecastRes = await fetch(forecastUrl);
      if (!forecastRes.ok) {
        throw new Error('Forecast API network response was not successful.');
      }
      
      const forecastData = await forecastRes.json();

      // Extract details securely
      const currentObj = forecastData.current;
      const dailyObj = forecastData.daily;

      // Match the correct weather code names (with underscores as per Open-Meteo specification)
      const currentCode = currentObj.weather_code !== undefined ? currentObj.weather_code : 0;
      const dailyCodes = dailyObj.weather_code !== undefined ? dailyObj.weather_code : [];

      const mappedDaily = dailyObj.time.map((timeStr: string, idx: number) => ({
        date: timeStr,
        weatherCode: dailyCodes[idx] !== undefined ? dailyCodes[idx] : 0,
        tempMax: dailyObj.temperature_2m_max[idx] !== undefined ? dailyObj.temperature_2m_max[idx] : 0,
        tempMin: dailyObj.temperature_2m_min[idx] !== undefined ? dailyObj.temperature_2m_min[idx] : 0,
        precipitationProb: dailyObj.precipitation_probability_max !== undefined ? dailyObj.precipitation_probability_max[idx] : 0,
      }));

      setWeatherData({
        city: name,
        country: country || 'Unknown Country',
        state: admin1,
        latitude,
        longitude,
        timezone: forecastData.timezone || timezone || 'UTC',
        current: {
          time: currentObj.time,
          temperature: currentObj.temperature_2m ?? 0,
          apparentTemperature: currentObj.apparent_temperature ?? currentObj.temperature_2m ?? 0,
          humidity: currentObj.relative_humidity_2m ?? 0,
          windSpeed: currentObj.wind_speed_10m ?? 0,
          isDay: currentObj.is_day === 1,
          precipitation: currentObj.precipitation ?? 0,
          weatherCode: currentCode,
        },
        daily: mappedDaily,
      });
      
      setLastSearchedCity(name);
      setSelectedCityId(location.id);
    } catch (err: any) {
      console.error('Weather fetching error:', err);
      setError(err.message || 'An unexpected server error occurred while contacting weather stations.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchCity = async (cityName: string) => {
    if (!cityName.trim()) return;
    
    const trimmedInput = cityName.trim();

    // 1. Check if trimmedInput directly matches a city already present in matchingCities
    const existingMatch = matchingCities.find(c => {
      const fullDisplay = `${c.name}${c.admin1 ? ', ' + c.admin1 : ''}, ${c.country}`.toLowerCase();
      const simpleDisplay = `${c.name}, ${c.country}`.toLowerCase();
      const inputLower = trimmedInput.toLowerCase();
      return fullDisplay === inputLower || simpleDisplay === inputLower || c.name.toLowerCase() === inputLower;
    });

    if (existingMatch) {
      await handleFetchWeatherForLocation(existingMatch);
      return;
    }

    setIsLoading(true);
    setError(null);
    setMatchingCities([]);
    setSelectedCityId(null);
    
    try {
      // 2. Extract base city name and qualifiers if input contains commas (e.g. "London, England, United Kingdom")
      const parts = trimmedInput.split(',').map(s => s.trim()).filter(Boolean);
      let searchName = parts[0] || trimmedInput;
      const qualifiers = parts.slice(1).map(s => s.toLowerCase());

      // Normalize query (e.g. searching for Bangalore redirects search to Bengaluru)
      if (/^bangalore$/i.test(searchName)) {
        searchName = 'Bengaluru';
      } else if (/bangalore/i.test(searchName)) {
        searchName = searchName.replace(/bangalore/i, 'Bengaluru');
      }

      // 3. Fetch Geocoding information
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        searchName
      )}&count=10&language=en&format=json`;
      
      const geoRes = await fetch(geocodingUrl);
      if (!geoRes.ok) {
        throw new Error('Geocoding API network response was not successful.');
      }
      
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        setError(`City "${cityName}" not found. Please verify the spelling or try another location.`);
        setIsLoading(false);
        return;
      }

      // 4. Sort results: Boost qualifier matches, Bangalore preference, population descending, exact name match
      const sortedResults = [...geoData.results];
      
      sortedResults.sort((a, b) => {
        if (qualifiers.length > 0) {
          const matchA = qualifiers.some(q => 
            a.country?.toLowerCase().includes(q) || 
            a.admin1?.toLowerCase().includes(q) ||
            a.name?.toLowerCase().includes(q)
          ) ? 1 : 0;
          const matchB = qualifiers.some(q => 
            b.country?.toLowerCase().includes(q) || 
            b.admin1?.toLowerCase().includes(q) ||
            b.name?.toLowerCase().includes(q)
          ) ? 1 : 0;
          if (matchB !== matchA) return matchB - matchA;
        }

        const isBangQuery = /bangalore|bengaluru/i.test(cityName);
        if (isBangQuery) {
          const isA = (a.name?.toLowerCase() === 'bengaluru' || a.name?.toLowerCase() === 'bangalore') && a.country?.toLowerCase() === 'india';
          const isB = (b.name?.toLowerCase() === 'bengaluru' || b.name?.toLowerCase() === 'bangalore') && b.country?.toLowerCase() === 'india';
          if (isA && !isB) return -1;
          if (!isA && isB) return 1;
        }

        // Prefer larger population to automatically return the most well-known cities
        const popA = a.population || 0;
        const popB = b.population || 0;
        if (popB !== popA) {
          return popB - popA;
        }

        // Secondary priority: Exact name match
        const matchA = a.name?.toLowerCase() === searchName.toLowerCase() ? 1 : 0;
        const matchB = b.name?.toLowerCase() === searchName.toLowerCase() ? 1 : 0;
        return matchB - matchA;
      });

      setMatchingCities(sortedResults);
      
      // Auto-load weather parameters for the top sorted match directly using lat/lon
      await handleFetchWeatherForLocation(sortedResults[0]);
      
    } catch (err: any) {
      console.error('Weather fetching error:', err);
      setError(err.message || 'An unexpected server error occurred while contacting weather stations.');
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    handleSearchCity(lastSearchedCity);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900" id="app-root-container">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs" id="app-header">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20" id="header-logo-badge">
              <CloudSun size={24} className="stroke-[2]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-1">
                Weather <span className="text-blue-600">Intelligence</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Atmospheric Modeling & Diagnostics
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-500" id="header-meta">
            <span className="flex items-center gap-1 bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200/45">
              <Compass size={14} className="text-blue-600" />
              Open-Meteo Engine
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6" id="main-content-layout">
        
        {/* Search Bar section */}
        <section className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100" id="search-section">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center sm:text-left">
              <h2 className="text-base font-extrabold text-slate-800">Analyze Weather Insights</h2>
              <p className="text-xs text-slate-500">Search for any global city to fetch real-time forecasts and smart alerts.</p>
            </div>
            <SearchBar 
              onSearch={handleSearchCity} 
              isLoading={isLoading} 
              matchingCities={matchingCities}
              selectedCityId={selectedCityId}
              onSelectCity={handleFetchWeatherForLocation}
            />
          </div>
        </section>

        {/* Dynamic Loading, Error, or Dashboard View */}
        {isLoading && !weatherData && (
          <div className="w-full py-20 flex flex-col items-center justify-center space-y-4" id="main-spinner-view">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
              <CloudSun size={20} className="absolute inset-0 m-auto text-blue-600 animate-pulse" />
            </div>
            <p className="text-sm font-bold text-slate-500 tracking-wide">
              Retrieving atmospheric geocoding models...
            </p>
          </div>
        )}

        {error && (
          <div 
            id="error-notification"
            className="w-full bg-red-50/60 border border-red-100 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all"
          >
            <div className="p-3 bg-red-100 text-red-700 rounded-2xl border border-red-200 flex-shrink-0">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-3 text-center sm:text-left flex-grow">
              <h3 className="text-base font-extrabold text-red-950">Geocoding Failure / City Not Found</h3>
              <p className="text-sm text-red-900/80 leading-relaxed max-w-2xl">
                {error}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-4 py-2 bg-red-900/10 hover:bg-red-900/15 text-red-950 font-bold text-xs rounded-xl border border-red-900/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Retry Search</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content Container */}
        <div className={isLoading ? 'opacity-65 pointer-events-none transition-opacity' : 'transition-opacity'}>
          {weatherData && (
            <section id="dashboard-section">
              <WeatherDashboard weatherData={weatherData} />
            </section>
          )}
        </div>

      </main>

      {/* Aesthetic Footer */}
      <footer className="bg-white border-t border-slate-100 mt-16 py-8" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500">
              Weather Intelligence Dashboard
            </p>
            <p className="text-[10px] text-slate-400">
              Data modeled autonomously using public domain meteorological services. No API key required.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1 bg-slate-50 py-1 px-2.5 rounded-md border border-slate-100">
              <TrendingUp size={12} className="text-blue-500" />
              Live Diagnostics
            </span>
            <span>v1.0.0</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

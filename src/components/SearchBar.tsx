import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, Globe } from 'lucide-react';
import { CityGeocodingResult } from '../types';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  matchingCities?: CityGeocodingResult[];
  selectedCityId?: number | null;
  onSelectCity?: (city: CityGeocodingResult) => void;
}

const POPULAR_CITIES = [
  'New York',
  'London',
  'Tokyo',
  'Sydney',
  'Paris',
  'Mumbai'
];

export default function SearchBar({ 
  onSearch, 
  isLoading,
  matchingCities = [],
  selectedCityId = null,
  onSelectCity
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handlePopularCityClick = (city: string) => {
    setQuery(city);
    onSearch(city);
  };

  const handleDropdownSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selected = matchingCities.find(c => c.id === selectedId);
    if (selected && onSelectCity) {
      setQuery(selected.name);
      onSelectCity(selected);
    }
  };

  return (
    <div className="w-full space-y-4" id="search-container">
      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-400">
            <MapPin size={20} className="animate-pulse" />
          </div>
          <input
            id="city-search-input"
            type="text"
            placeholder="Enter city name (e.g. Tokyo, Berlin, San Francisco...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="w-full py-3.5 pl-12 pr-32 bg-white text-slate-800 border border-slate-200/80 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-[15px] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
          />
          <button
            id="search-submit-btn"
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-medium text-sm rounded-xl transition-all flex items-center gap-2 disabled:bg-slate-300 disabled:text-slate-500 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Searching</span>
              </>
            ) : (
              <>
                <Search size={16} />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Matching Cities Dropdown (shown when multiple results exist) */}
      {matchingCities.length > 1 && (
        <div 
          className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
          id="search-matching-cities-wrapper"
        >
          <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
            <Globe size={16} className="text-blue-600 flex-shrink-0" />
            <span>Multiple cities found ({matchingCities.length}):</span>
          </div>

          <div className="relative min-w-[240px] sm:max-w-xs w-full">
            <select
              id="city-matches-select"
              value={selectedCityId || ''}
              disabled={isLoading}
              onChange={handleDropdownSelect}
              className="w-full bg-white text-slate-800 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {matchingCities.map((cityObj) => {
                const populationStr = cityObj.population 
                  ? ` • Pop: ${(cityObj.population / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k`
                  : '';
                const stateStr = cityObj.admin1 ? `, ${cityObj.admin1}` : '';
                return (
                  <option key={cityObj.id} value={cityObj.id}>
                    {cityObj.name}{stateStr}, {cityObj.country}{populationStr}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      )}

      {/* Popular City Shortcuts */}
      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start" id="popular-cities-section">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
          Suggestions:
        </span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city}
            id={`shortcut-${city.toLowerCase().replace(' ', '-')}`}
            type="button"
            onClick={() => handlePopularCityClick(city)}
            disabled={isLoading}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-600 text-xs font-medium rounded-lg border border-slate-200/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

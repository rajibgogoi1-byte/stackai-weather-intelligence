import { DailyForecast } from '../types';
import { getWeatherCodeDetails, getDayName, formatFriendlyDate } from '../utils/weatherUtils';
import { Calendar } from 'lucide-react';

interface ForecastListProps {
  forecasts: DailyForecast[];
}

export default function ForecastList({ forecasts }: ForecastListProps) {
  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5" id="forecast-card-container">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <Calendar size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">7-Day Extended Forecast</h3>
          <p className="text-xs text-slate-500">Day-by-day meteorological forecast breakdown</p>
        </div>
      </div>

      {/* Grid of 7 days */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3" id="forecast-grid">
        {forecasts.map((day, index) => {
          const { description, icon: IconComp, textThemeClass, accentColorClass } = getWeatherCodeDetails(day.weatherCode, true);
          const dayName = getDayName(day.date);
          const friendlyDateStr = formatFriendlyDate(day.date);
          const isToday = index === 0;

          return (
            <div
              key={day.date}
              id={`forecast-day-card-${index}`}
              title={`${friendlyDateStr} - ${description}`}
              className={`flex flex-col items-center p-4 rounded-2xl border transition-all hover:shadow-md hover:scale-[1.02] duration-200 ${
                isToday 
                  ? 'bg-blue-50/50 border-blue-200 shadow-sm relative overflow-hidden' 
                  : 'bg-slate-50/30 border-slate-100'
              }`}
            >
              {/* Today Badge */}
              {isToday && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                  TODAY
                </div>
              )}

              {/* Day Name */}
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1">
                {dayName}
              </span>
              <span className="text-[10px] text-slate-400 mb-3 font-medium">
                {day.date.split('-').slice(1).join('/')}
              </span>

              {/* Weather Icon (Enclosed in a beautiful circular backdrop) */}
              <div className={`p-3 rounded-full mb-3 flex items-center justify-center ${accentColorClass}`}>
                <IconComp size={22} className="stroke-[2.2]" />
              </div>

              {/* Max/Min Temperatures */}
              <div className="flex items-baseline gap-1.5 mb-2.5 text-center">
                <span className="text-sm font-bold text-slate-800">
                  {Math.round(day.tempMax)}°
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {Math.round(day.tempMin)}°
                </span>
              </div>

              {/* Condition Text */}
              <span className="text-[11px] font-semibold text-slate-600 text-center line-clamp-1 max-w-full" title={description}>
                {description}
              </span>

              {/* Precipitation probability */}
              {day.precipitationProb > 0 && (
                <span className="text-[9px] font-bold text-blue-500 mt-2 bg-blue-50/70 border border-blue-100 px-1.5 py-0.5 rounded-md">
                  ☔ {day.precipitationProb}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

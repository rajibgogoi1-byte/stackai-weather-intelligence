import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { DailyForecast } from '../types';
import { getDayName } from '../utils/weatherUtils';

interface WeatherChartProps {
  dailyForecasts: DailyForecast[];
}

export default function WeatherChart({ dailyForecasts }: WeatherChartProps) {
  // Map daily forecast to chart-friendly structures
  const chartData = dailyForecasts.map((day) => ({
    name: getDayName(day.date),
    'Max Temp (°C)': Math.round(day.tempMax),
    'Min Temp (°C)': Math.round(day.tempMin),
    'Precip Prob (%)': day.precipitationProb,
  }));

  // Custom tooltips with sleek dashboard card design
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-xl text-xs space-y-1.5 text-white">
          <p className="font-bold text-slate-300 tracking-wide border-b border-slate-800 pb-1 mb-1.5">
            {label} Forecast
          </p>
          <div className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              Max Temp:
            </span>
            <span className="font-semibold text-[13px]">{payload[0].value}°C</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              Min Temp:
            </span>
            <span className="font-semibold text-[13px]">{payload[1].value}°C</span>
          </div>
          {payload[2] !== undefined && (
            <div className="flex items-center justify-between gap-6 pt-1 border-t border-slate-800 mt-1">
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
                Rain Prob:
              </span>
              <span className="font-semibold text-[13px]">{payload[2].value}%</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4" id="weather-trend-card">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">7-Day Temperature Trend</h3>
          <p className="text-xs text-slate-500">Visual comparison of maximum and minimum temperature models</p>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-72 md:h-80" id="recharts-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="name" 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            
            <YAxis 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              domain={['auto', 'auto']}
              dx={-5}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}
            />
            
            <Area 
              type="monotone" 
              dataKey="Max Temp (°C)" 
              stroke="#f59e0b" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorMax)" 
            />
            
            <Area 
              type="monotone" 
              dataKey="Min Temp (°C)" 
              stroke="#3b82f6" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorMin)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

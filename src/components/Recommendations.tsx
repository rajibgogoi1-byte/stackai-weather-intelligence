import { 
  Umbrella, 
  Thermometer, 
  Wind, 
  Sparkles, 
  AlertOctagon, 
  Info, 
  CheckCircle2, 
  HelpCircle,
  LucideIcon 
} from 'lucide-react';
import { Recommendation } from '../types';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  // Map category to icon
  const getCategoryIcon = (category: string): LucideIcon => {
    switch (category) {
      case 'temperature':
        return Thermometer;
      case 'precipitation':
        return Umbrella;
      case 'wind':
        return Wind;
      case 'general':
      default:
        return Sparkles;
    }
  };

  // Map recommendation type to Tailwind visual theme classes (completely bordered, high contrast, clean)
  const getTypeClasses = (type: string) => {
    switch (type) {
      case 'danger':
        return {
          card: 'bg-red-50/60 border-red-100 text-red-950',
          badge: 'bg-red-100 text-red-700 border-red-200',
          indicator: 'bg-red-600',
          label: 'Alert'
        };
      case 'warning':
        return {
          card: 'bg-amber-50/60 border-amber-100 text-amber-950',
          badge: 'bg-amber-100 text-amber-700 border-amber-200',
          indicator: 'bg-amber-600',
          label: 'Precaution'
        };
      case 'success':
        return {
          card: 'bg-emerald-50/60 border-emerald-100 text-emerald-950',
          badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          indicator: 'bg-emerald-600',
          label: 'Activity'
        };
      case 'info':
      default:
        return {
          card: 'bg-sky-50/60 border-sky-100 text-sky-950',
          badge: 'bg-sky-100 text-sky-700 border-sky-200',
          indicator: 'bg-sky-600',
          label: 'Guidance'
        };
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5" id="recommendations-container">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <Sparkles size={18} className="animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Smart Weather Intelligence</h3>
          <p className="text-xs text-slate-500">Actionable recommendations generated from weather models</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="recommendations-grid">
        {recommendations.map((rec) => {
          const theme = getTypeClasses(rec.type);
          const IconComponent = getCategoryIcon(rec.category);

          return (
            <div
              key={rec.id}
              id={`rec-card-${rec.id}`}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${theme.card}`}
            >
              <div className={`p-2.5 rounded-xl border flex-shrink-0 ${theme.badge}`} id={`rec-icon-${rec.id}`}>
                <IconComponent size={18} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${theme.indicator}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {theme.label} • {rec.category}
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  {rec.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

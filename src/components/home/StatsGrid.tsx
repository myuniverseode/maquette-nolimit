// components/home/StatsGrid.tsx
import { TrendingUp, Users, Star, MapPin, Trophy, Award } from 'lucide-react';

interface StatItem {
  value: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'green' | 'blue' | 'orange' | 'purple';
}

export function StatsGrid({ compact = false }: { compact?: boolean }) {
  const stats: StatItem[] = [
    {
      value: '5',
      label: 'Parcs',
      sublabel: 'en France',
      icon: <MapPin className="size-5" />,
      trend: 'up',
      trendValue: '+1 cette année',
      color: 'green'
    },
    {
      value: '98%',
      label: 'Satisfaction',
      sublabel: 'clients',
      icon: <Star className="size-5" />,
      trend: 'up',
      trendValue: '4.8/5 avis',
      color: 'orange'
    },
    {
      value: '50k+',
      label: 'Aventuriers',
      sublabel: 'par an',
      icon: <Users className="size-5" />,
      trend: 'up',
      trendValue: '+15% vs 2023',
      color: 'blue'
    },
    {
      value: '20+',
      label: 'Activités',
      sublabel: 'uniques',
      icon: <Award className="size-5" />,
      trend: 'up',
      trendValue: 'Nouveautés régulières',
      color: 'purple'
    }
  ];

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getBgColor = (color?: string) => {
    switch (color) {
      case 'green': return 'bg-gradient-to-br from-green-400/20 to-green-600/10';
      case 'blue': return 'bg-gradient-to-br from-blue-400/20 to-blue-600/10';
      case 'orange': return 'bg-gradient-to-br from-orange-400/20 to-orange-600/10';
      case 'purple': return 'bg-gradient-to-br from-purple-400/20 to-purple-600/10';
      default: return 'bg-white/10';
    }
  };

  return (
    <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-4 max-w-3xl mx-auto`}>
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className={`${getBgColor(stat.color)} backdrop-blur-sm rounded-xl p-4 text-white relative overflow-hidden`}
        >
          {/* Effet de brillance */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              {stat.icon}
            </div>
            {stat.trend && (
              <div className={`text-xs font-medium ${getTrendColor(stat.trend)}`}>
                {stat.trend === 'up' ? '↗' : '↘'} {stat.trendValue}
              </div>
            )}
          </div>
          
          <div className="text-3xl font-bold mb-1">{stat.value}</div>
          <div className="font-medium text-sm">{stat.label}</div>
          {stat.sublabel && (
            <div className="text-xs text-white/70 mt-1">{stat.sublabel}</div>
          )}
        </div>
      ))}
    </div>
  );
}
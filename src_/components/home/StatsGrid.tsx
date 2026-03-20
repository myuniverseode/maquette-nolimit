// components/home/StatsGrid.tsx
import { TrendingUp, Users, Star, MapPin, Trophy, Award, Heart, Zap } from 'lucide-react';
import { useStatsData } from '../../hooks/useStatsData';

const iconMap: Record<string, React.ReactNode> = {
  MapPin: <MapPin className="size-5" />,
  Star: <Star className="size-5" />,
  Users: <Users className="size-5" />,
  Award: <Award className="size-5" />,
  Trophy: <Trophy className="size-5" />,
  TrendingUp: <TrendingUp className="size-5" />,
  Heart: <Heart className="size-5" />,
  Zap: <Zap className="size-5" />,
};

export function StatsGrid({ compact = false }: { compact?: boolean }) {
  const { data } = useStatsData();

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
      {data.stats.map((stat) => (
        <div 
          key={stat.label}
          className={`${getBgColor(stat.color)} backdrop-blur-sm rounded-xl p-4 text-white relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              {iconMap[stat.icon] || <Star className="size-5" />}
            </div>
            {stat.trendValue && (
              <div className="text-xs font-medium text-green-500">
                ↗ {stat.trendValue}
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

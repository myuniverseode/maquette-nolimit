// hooks/useStatsData.ts
import { useState, useEffect } from 'react';
import { API_URL, API_KEY } from '../config/config';

export interface StatItem {
  value: string;
  label: string;
  sublabel?: string;
  icon: string;
  trendValue?: string;
  color?: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface StatsApiData {
  stats: StatItem[];
  features: FeatureItem[];
}

const defaultStatsData: StatsApiData = {
  stats: [
    { value: '5', label: 'Parcs', sublabel: 'en France', icon: 'MapPin', trendValue: '+1 cette année', color: 'green' },
    { value: '98%', label: 'Satisfaction', sublabel: 'clients', icon: 'Star', trendValue: '4.8/5 avis', color: 'orange' },
    { value: '50k+', label: 'Aventuriers', sublabel: 'par an', icon: 'Users', trendValue: '+15% vs 2023', color: 'blue' },
    { value: '20+', label: 'Activités', sublabel: 'uniques', icon: 'Award', trendValue: 'Nouveautés régulières', color: 'purple' },
  ],
  features: [
    { icon: 'shield', title: 'Sécurité maximale', description: 'Équipement aux normes et encadrement professionnel' },
    { icon: 'users', title: 'Pour tous', description: 'Activités adaptées de 3 à 99 ans' },
    { icon: 'leaf', title: 'Nature préservée', description: "Dans le respect de l'environnement" },
  ],
};

export function useStatsData() {
  const [data, setData] = useState<StatsApiData>(defaultStatsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/stats`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    })
      .then(res => { if (!res.ok) throw new Error('Erreur API Stats'); return res.json(); })
      .then(wpData => {
        console.log('✅ Stats chargées depuis WordPress:', wpData);
        setData({
          stats: wpData.stats?.length ? wpData.stats : defaultStatsData.stats,
          features: wpData.features?.length ? wpData.features : defaultStatsData.features,
        });
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ Stats WordPress indisponibles:', err.message);
        setData(defaultStatsData);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error, defaultData: defaultStatsData };
}

export { defaultStatsData };

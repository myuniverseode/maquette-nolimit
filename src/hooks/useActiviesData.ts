// hooks/useActivitiesData.ts
import { useState, useEffect } from 'react';
import { Activity } from '../types';
import { API_URL, API_KEY } from '../config/config';

export type { Activity };


// ===== DONNÉES PAR DÉFAUT =====

const defaultActivities: Activity[] = [
  {
    id: 'accrobranche',
    name: 'Accrobranche',
    slug: 'accrobranche',
    description:
      "Évoluez d'arbre en arbre sur nos parcours sécurisés. Tyroliennes, ponts de singe, lianes... Une aventure au cœur de la canopée !",
    icon: 'TreePine',
    image:
      'https://www.aventureland.fr/media/images/activities/w-1280-parcours-accrobranche-1687269691.JPG',
    gallery: [
      'https://www.aventureland.fr/media/images/activities/w-1280-parcours-accrobranche-1687269691.JPG',
      'https://ofunpark.fr/wp-content/uploads/2023/01/accrobranche-vendee-2.webp',
    ],
    difficulty: 'Intermédiaire',
    intensity: 'medium',
    minAge: 6,
    duration: '2-3 heures',
    price: 28,
    participants: '1-20',
    emoji: '🌳',
    restrictions: [
      'Poids minimum : 20kg',
      'Poids maximum : 120kg',
      'Port de chaussures fermées obligatoire',
      'Non recommandé aux femmes enceintes',
    ],
  },
];

export function useActivitiesData() {
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);

        // 🔥 DEBUG: vérifier si la clé est lue correctement
        console.log('🔑 Clé API depuis import.meta.env:', API_KEY);

        const response = await fetch(`${API_URL}/activities`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-NoLimit-Key': API_KEY || 'EMPTY_KEY', // marque si vide
          },
        });

        console.log('🌐 Response status:', response.status);
        console.log('🌐 Response headers:', [...response.headers.entries()]);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log('📦 Données brutes reçues:', data);

        if (Array.isArray(data) && data.length > 0) {
          const formattedActivities: Activity[] = data.map((item: any, index: number) => {
            const defaultActivity =
              defaultActivities.find(a => a.id === item.slug || a.slug === item.slug) ||
              defaultActivities[index];

            return {
              id: item.slug || item.id || defaultActivity?.id || `activity-${index}`,
              slug: item.slug || defaultActivity?.slug || '',
              name: item.name || defaultActivity?.name || '',
              description: item.description || defaultActivity?.description || '',
              icon: item.icon || defaultActivity?.icon || 'Star',
              image: item.image || defaultActivity?.image || '',
              gallery: item.gallery || defaultActivity?.gallery,
              difficulty: item.difficulty || defaultActivity?.difficulty || 'Intermédiaire',
              intensity: item.intensity || defaultActivity?.intensity || 'medium',
              minAge: item.minAge || item.min_age || defaultActivity?.minAge || 8,
              duration: item.duration || defaultActivity?.duration || '2h',
              price: item.price || defaultActivity?.price || 25,
              participants: item.participants || defaultActivity?.participants || 'Groupe',
              emoji: item.emoji || defaultActivity?.emoji || '🎯',
              restrictions: item.restrictions || defaultActivity?.restrictions || [],
            };
          });

          console.log('✅ Activités formatées:', formattedActivities);

          setActivities(formattedActivities);
          setError(null);
        } else {
          console.log('⚠️ API vide, utilisation des activités par défaut');
          setActivities(defaultActivities);
        }
      } catch (err) {
        console.warn(
          '⚠️ Activités WordPress indisponibles, utilisation des valeurs par défaut:',
          err
        );
        setActivities(defaultActivities);
        setError('Activités chargées depuis le cache local');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityById = (idOrSlug: string): Activity | undefined => {
    return activities.find(a => a.id === idOrSlug || a.slug === idOrSlug);
  };

  return { activities, loading, error, getActivityById, defaultActivities };
}

export { defaultActivities };
// hooks/usePourQuiData.ts - Hook pour la section "Pour Qui"
import { useState, useEffect } from 'react';
import { PourQuiData, PourQuiCard } from '../types';
import { API_URL, API_KEY, cleanWpData } from '../config/config';

// ===== DONNÉES PAR DÉFAUT =====
const defaultPourQuiData: PourQuiData = {
  title: 'Pour Qui ?',
  subtitle: "Que vous soyez en duo, en famille, avec des enfants ou en équipe, nous avons l'aventure qu'il vous faut",
  cards: [
    { id: 'duo',        title: 'En Duo',      description: "Vivez l'aventure à deux",             image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/pour-qui/duo',        iconName: 'Heart',     color: '#eb700f' },
    { id: 'famille',    title: 'En Famille',   description: 'Des aventures pour toute la famille', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/pour-qui/famille',    iconName: 'Users',     color: '#357600' },
    { id: 'enfant',     title: 'Enfants',      description: 'Anniversaires et sorties scolaires', image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/pour-qui/enfant',     iconName: 'Cake',      color: '#eb700f' },
    { id: 'entreprise', title: 'Entreprises',  description: 'Team building et séminaires',        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/pour-qui/entreprise', iconName: 'Briefcase', color: '#357600' },
  ]
};

export function usePourQuiData() {
  const [data, setData] = useState<PourQuiData>(defaultPourQuiData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPourQui = async () => {
      try {
        const response = await fetch(`${API_URL}/pour-qui`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-NoLimit-Key': API_KEY || '',
          },
        });

        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const wpData = cleanWpData(await response.json());
        console.log('✅ Pour Qui chargé depuis WordPress:', wpData);

        const mergedData: PourQuiData = {
          title: wpData.title || defaultPourQuiData.title,
          subtitle: wpData.subtitle || defaultPourQuiData.subtitle,
          cards: Array.isArray(wpData.cards) && wpData.cards.length > 0
            ? wpData.cards.map((card: any, i: number) => {
                const defaultCard = defaultPourQuiData.cards[i];
                return {
                  id: card.id || defaultCard?.id || `card-${i}`,
                  title: card.title || defaultCard?.title || '',
                  description: card.description || defaultCard?.description || '',
                  image: card.image || defaultCard?.image || '',
                  link: card.link || defaultCard?.link || '/',
                  iconName: card.iconName || defaultCard?.iconName || 'Star',
                  color: card.color || defaultCard?.color || '#eb700f',
                };
              })
            : defaultPourQuiData.cards,
        };

        setData(mergedData);
        setError(null);
      } catch (err) {
        console.warn('⚠️ Pour Qui WordPress indisponible, utilisation des valeurs par défaut:', err);
        setData(defaultPourQuiData);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setLoading(false);
      }
    };

    fetchPourQui();
  }, []);

  return { data, loading, error, defaultData: defaultPourQuiData };
}

export { defaultPourQuiData };

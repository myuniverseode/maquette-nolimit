// hooks/usePourQuiData.ts - Hook pour la section "Pour Qui"
import { useState, useEffect } from 'react';
import { PourQuiData } from '../types';
import { API_URL, API_KEY } from '../config/config';

const defaultPourQuiData: PourQuiData = {
  title: 'Pour Qui ?',
  subtitle: "Que vous soyez en duo, en famille, avec des enfants ou en équipe, nous avons l'aventure qu'il vous faut",
  cards: [
    { id: 'duo', title: 'En Duo', description: "Vivez l'aventure à deux", image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1080', link: '/pour-qui/duo', iconName: 'Heart', color: '#eb700f' },
    { id: 'famille', title: 'En Famille', description: 'Des aventures pour toute la famille', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1080', link: '/pour-qui/famille', iconName: 'Users', color: '#357600' },
    { id: 'enfant', title: 'Enfants', description: 'Anniversaires et sorties scolaires', image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1080', link: '/pour-qui/enfant', iconName: 'Cake', color: '#eb700f' },
    { id: 'entreprise', title: 'Entreprises', description: 'Team building et séminaires', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1080', link: '/pour-qui/entreprise', iconName: 'Briefcase', color: '#357600' },
  ],
};

export function usePourQuiData() {
  const [data, setData] = useState<PourQuiData>(defaultPourQuiData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/pour-qui`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur API Pour Qui');
        return res.json();
      })
      .then(wpData => {
        console.log('✅ Pour Qui chargé depuis WordPress:', wpData);
        const mergedData: PourQuiData = {
          title: wpData.title || defaultPourQuiData.title,
          subtitle: wpData.subtitle || defaultPourQuiData.subtitle,
          cards: wpData.cards?.length
            ? wpData.cards.map((card: any, i: number) => {
                const def = defaultPourQuiData.cards.find(c => c.id === card.id) || defaultPourQuiData.cards[i];
                return {
                  id: card.id || def?.id || `card-${i}`,
                  title: card.title || def?.title || '',
                  description: card.description || def?.description || '',
                  image: card.image || def?.image || '',
                  link: card.link || def?.link || '',
                  iconName: card.iconName || def?.iconName || 'Star',
                  color: card.color || def?.color || '#eb700f',
                };
              })
            : defaultPourQuiData.cards,
        };
        setData(mergedData);
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ Pour Qui WordPress indisponible:', err.message);
        setData(defaultPourQuiData);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error, defaultData: defaultPourQuiData };
}

export { defaultPourQuiData };

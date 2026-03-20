// hooks/useHeroData.ts - Hook pour les données du Hero/Carousel
import { useState, useEffect } from 'react';
import { HeroData, HeroSlide } from '../types';
import { API_URL, API_KEY, cleanWpData } from '../config/config';

// ===== DONNÉES PAR DÉFAUT =====
const defaultHeroData: HeroData = {
  slides: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1630804261876-7e18e3a9c7aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
      title: 'Tyrolienne géante',
      subtitle: 'Sensation de vol garantie'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1653154138513-ed13199917e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
      title: 'Accrobranche extrême',
      subtitle: 'Défis à la hauteur'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1759872138838-45bd5c07ddc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
      title: 'Paintball stratégique',
      subtitle: "Adrénaline et esprit d'équipe"
    }
  ],
  badge: {
    text: "L'aventure commence ici",
    icon: 'Sparkles'
  },
  mainTitle: {
    line1: "L'aventure vous",
    highlight: 'appelle'
  },
  video: {
    url: 'https://www.youtube.com/watch?v=VT2qF97pQNw',
    thumbnail: '',
    buttonText: 'Voir la vidéo',
    description: "Découvrez l'expérience"
  }
};

export function useHeroData() {
  const [data, setData] = useState<HeroData>(defaultHeroData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await fetch(`${API_URL}/hero`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-NoLimit-Key': API_KEY || '',
          },
        });

        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const wpData = cleanWpData(await response.json());
        console.log('✅ Hero chargé depuis WordPress:', wpData);

        // Fusion intelligente : chaque champ a un fallback vers les valeurs par défaut
        const mergedData: HeroData = {
          slides: wpData.slides?.length
            ? wpData.slides.map((s: any, i: number) => ({
                id: s.id || String(i + 1),
                url: s.url || defaultHeroData.slides[i]?.url || '',
                title: s.title || defaultHeroData.slides[i]?.title || '',
                subtitle: s.subtitle || defaultHeroData.slides[i]?.subtitle || '',
              }))
            : defaultHeroData.slides,
          badge: {
            text: wpData.badge?.text || defaultHeroData.badge.text,
            icon: wpData.badge?.icon || defaultHeroData.badge.icon,
          },
          mainTitle: {
            line1: wpData.mainTitle?.line1 || defaultHeroData.mainTitle.line1,
            highlight: wpData.mainTitle?.highlight || defaultHeroData.mainTitle.highlight,
          },
          video: {
            url: wpData.video?.url || defaultHeroData.video?.url || '',
            thumbnail: wpData.video?.thumbnail || defaultHeroData.video?.thumbnail || '',
            buttonText: wpData.video?.buttonText || defaultHeroData.video?.buttonText || '',
            description: wpData.video?.description || defaultHeroData.video?.description || '',
          },
        };

        setData(mergedData);
        setError(null);
      } catch (err) {
        console.warn('⚠️ Hero WordPress indisponible, utilisation des valeurs par défaut:', err);
        setData(defaultHeroData);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  return { data, loading, error, defaultData: defaultHeroData };
}

export { defaultHeroData };

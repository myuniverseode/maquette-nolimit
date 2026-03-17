// hooks/useHeroData.ts - Hook pour les données du Hero/Carousel
import { useState, useEffect } from 'react';
import { HeroData, HeroSlide } from '../types';

// ===== DONNÉES PAR DÉFAUT (actuellement en dur dans le composant) =====
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
      subtitle: 'Adrénaline et esprit d\'équipe'
    }
  ],
  badge: {
    text: 'L\'aventure commence ici',
    icon: 'Sparkles'
  },
  mainTitle: {
    line1: 'L\'aventure vous',
    highlight: 'appelle'
  },
  video: {
    url: 'https://www.youtube.com/watch?v=VT2qF97pQNw',
    thumbnail: '',
    buttonText: 'Voir la vidéo',
    description: 'Découvrez l\'expérience'
  }
};

export function useHeroData() {
  const [data, setData] = useState<HeroData>(defaultHeroData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const apiUrl = 'https://www.preprod.nolimit-aventure.com/wp-json/nolimit/v1/hero';

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error('Erreur API Hero');
        return res.json();
      })
      .then(wpData => {
        console.log('✅ Hero chargé depuis WordPress:', wpData);
        // Fusion intelligente avec les valeurs par défaut
        const mergedData: HeroData = {
          slides: wpData.slides?.length ? wpData.slides : defaultHeroData.slides,
          badge: {
            text: wpData.badge?.text || defaultHeroData.badge.text,
            icon: wpData.badge?.icon || defaultHeroData.badge.icon,
          },
          mainTitle: {
            line1: wpData.mainTitle?.line1 || defaultHeroData.mainTitle.line1,
            highlight: wpData.mainTitle?.highlight || defaultHeroData.mainTitle.highlight,
          },
          video: wpData.video ? {
            url: wpData.video.url || defaultHeroData.video?.url || '',
            thumbnail: wpData.video.thumbnail || '',
            buttonText: wpData.video.buttonText || defaultHeroData.video?.buttonText || '',
            description: wpData.video.description || defaultHeroData.video?.description || '',
          } : defaultHeroData.video,
        };
        setData(mergedData);
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ Hero WordPress indisponible, utilisation des valeurs par défaut:', err.message);
        setData(defaultHeroData);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error, defaultData: defaultHeroData };
}

// Export des données par défaut pour utilisation externe si nécessaire
export { defaultHeroData };

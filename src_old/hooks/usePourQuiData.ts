// hooks/usePourQuiData.ts - Hook pour la section "Pour Qui"
import { useState, useEffect } from 'react';
import { PourQuiData, PourQuiCard } from '../types';

// ===== DONNÉES PAR DÉFAUT (actuellement en dur dans PourQuiSection.tsx) =====
const defaultPourQuiData: PourQuiData = {
  title: 'Pour Qui ?',
  subtitle: 'Que vous soyez en duo, en famille, avec des enfants ou en équipe, nous avons l\'aventure qu\'il vous faut',
  cards: [
    {
      id: 'duo',
      title: 'En Duo',
      description: 'Vivez l\'aventure à deux',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      link: '/pour-qui/duo',
      iconName: 'Heart',
      color: '#eb700f' // Orange NoLimit
    },
    {
      id: 'famille',
      title: 'En Famille',
      description: 'Des aventures pour toute la famille',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      link: '/pour-qui/famille',
      iconName: 'Users',
      color: '#357600' // Vert NoLimit
    },
    {
      id: 'enfant',
      title: 'Enfants',
      description: 'Anniversaires et sorties scolaires',
      image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      link: '/pour-qui/enfant',
      iconName: 'Cake',
      color: '#eb700f'
    },
    {
      id: 'entreprise',
      title: 'Entreprises',
      description: 'Team building et séminaires',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      link: '/pour-qui/entreprise',
      iconName: 'Briefcase',
      color: '#357600'
    }
  ]
};

export function usePourQuiData() {
  const [data, setData] = useState<PourQuiData>(defaultPourQuiData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const apiUrl = 'https://www.preprod.nolimit-aventure.com/wp-json/nolimit/v1/home-config';

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error('Erreur API Pour Qui');
        return res.json();
      })
      .then(wpData => {
        console.log('✅ Données WordPress reçues:', wpData);
        
        // Extraire spécifiquement la section "pourqui" de la réponse
        if (wpData.pourqui && wpData.pourqui.enabled) {
          const mergedData: PourQuiData = {
            title: wpData.pourqui.title || defaultPourQuiData.title,
            subtitle: wpData.pourqui.subtitle || defaultPourQuiData.subtitle,
            // Garder les cards par défaut car l'API ne les fournit pas
            cards: defaultPourQuiData.cards,
          };
          setData(mergedData);
        } else {
          console.log('ℹ️ Section "pourqui" non disponible ou désactivée dans l\'API, utilisation des valeurs par défaut');
          setData(defaultPourQuiData);
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ Pour Qui WordPress indisponible, utilisation des valeurs par défaut:', err.message);
        setData(defaultPourQuiData);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error, defaultData: defaultPourQuiData };
}

// Export des données par défaut
export { defaultPourQuiData };
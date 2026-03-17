// hooks/useHeaderData.ts
import { useState, useEffect } from 'react';
import nolimitLogoFallback from '../assets/nolimit-logo-removebg.png';
import { API_URL, API_KEY } from '../config/config';

interface HeaderData {
  logo: {
    url: string;
    alt: string;
  } | null;
  primaryColor: string;
  secondaryColor: string;
  greenColor: string;
  ctaText: string;
  ctaUrl: string;
  showParkSelector: boolean;
  menuItems: Array<{
    id: number;
    label: string;
    type: 'simple' | 'megamenu';
    url?: string;
    position: number;
    megaMenuType?: string;
    megaMenu?: any;
  }>;
  parks: Array<{
    id: string;
    name: string;
    location: string;
    emoji: string;
    url: string;
  }>;
}

// ===== DONNÉES PAR DÉFAUT =====

const defaultHeaderData: HeaderData = {
  logo: {
    url: nolimitLogoFallback,
    alt: 'NoLimit Aventure',
  },
  primaryColor: '#357600',
  secondaryColor: '#eb700f',
  greenColor: '#1B5E20',
  ctaText: 'Réserver',
  ctaUrl: '/booking',
  showParkSelector: true,
  menuItems: [
    {
      id: 1,
      label: 'Activités',
      type: 'megamenu',
      position: 1,
      megaMenuType: 'audience',
    },
    {
      id: 2,
      label: 'Découvrir',
      type: 'megamenu',
      position: 2,
      megaMenuType: 'discover',
    },
    {
      id: 3,
      label: 'Groupes',
      type: 'megamenu',
      position: 3,
      megaMenuType: 'groups',
    },
    {
      id: 4,
      label: 'Préparer',
      type: 'megamenu',
      position: 4,
      megaMenuType: 'prepare',
    },
    {
      id: 5,
      label: 'Tarifs',
      type: 'simple',
      url: '/prices',
      position: 5,
    },
    {
      id: 6,
      label: 'Contact',
      type: 'simple',
      url: '/contact',
      position: 6,
    },
  ],
  parks: [
    {
      id: 'parc-nord',
      name: 'Parc Nord',
      location: 'Lille',
      emoji: '🌲',
      url: '/parc/nord',
    },
    {
      id: 'parc-sud',
      name: 'Parc Sud',
      location: 'Marseille',
      emoji: '🌊',
      url: '/parc/sud',
    },
    {
      id: 'parc-est',
      name: 'Parc Est',
      location: 'Strasbourg',
      emoji: '⛰️',
      url: '/parc/est',
    },
    {
      id: 'parc-ouest',
      name: 'Parc Ouest',
      location: 'Nantes',
      emoji: '🏰',
      url: '/parc/ouest',
    },
    {
      id: 'parc-centre',
      name: 'Parc Centre',
      location: 'Lyon',
      emoji: '🏔️',
      url: '/parc/centre',
    },
  ],
};

export function useHeaderData() {
  const [data, setData] = useState<HeaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        setLoading(true);

        // 🔥 DEBUG: vérifier si la clé est lue correctement
        console.log('🔑 Clé API depuis import.meta.env:', API_KEY);

        const response = await fetch(`${API_URL}/header`, {
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

        if (data && Object.keys(data).length > 0) {
          // Fusionner les données reçues avec les valeurs par défaut
          const formattedData: HeaderData = {
            logo: data.logo || defaultHeaderData.logo,
            primaryColor: data.primaryColor || defaultHeaderData.primaryColor,
            secondaryColor: data.secondaryColor || defaultHeaderData.secondaryColor,
            greenColor: data.greenColor || defaultHeaderData.greenColor,
            ctaText: data.ctaText || defaultHeaderData.ctaText,
            ctaUrl: data.ctaUrl || defaultHeaderData.ctaUrl,
            showParkSelector: data.showParkSelector ?? defaultHeaderData.showParkSelector,
            menuItems: Array.isArray(data.menuItems) && data.menuItems.length > 0 
              ? data.menuItems.sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
              : defaultHeaderData.menuItems,
            parks: Array.isArray(data.parks) && data.parks.length > 0 
              ? data.parks 
              : defaultHeaderData.parks,
          };

          console.log('✅ Données formatées:', formattedData);

          setData(formattedData);
          setError(null);
        } else {
          console.log('⚠️ API vide, utilisation des données par défaut');
          setData(defaultHeaderData);
        }
      } catch (err) {
        console.warn(
          '⚠️ Header WordPress indisponible, utilisation des valeurs par défaut:',
          err
        );
        setData(defaultHeaderData);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderData();
  }, []);

  // Fonctions utilitaires
  const getMenuItemById = (id: number) => {
    return data?.menuItems.find(item => item.id === id);
  };

  const getMenuItemByType = (type: string) => {
    return data?.menuItems.filter(item => item.megaMenuType === type);
  };

  const getParkById = (id: string) => {
    return data?.parks.find(park => park.id === id);
  };

  const getParkByLocation = (location: string) => {
    return data?.parks.find(park => park.location === location);
  };

  return { 
    data, 
    loading, 
    error, 
    defaultHeaderData,
    getMenuItemById,
    getMenuItemByType,
    getParkById,
    getParkByLocation
  };
}

export { defaultHeaderData };
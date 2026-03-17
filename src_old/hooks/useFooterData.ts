// hooks/useFooterData.ts
import { useState, useEffect } from 'react';
import { API_URL, API_KEY } from '../config/config';

interface FooterData {
  colors: {
    background: string;
    primary: string;
    secondary: string;
  };
  contact: {
    phone: string;
    email: string;
    description: string;
  };
  stats: Array<{
    number: string;
    label: string;
  }>;
  quickLinks: Array<{
    label: string;
    to: string;
  }>;
  activities: Array<{
    name: string;
    emoji: string;
    link: string;
  }>;
  legalLinks: Array<{
    label: string;
    to: string;
  }>;
  cta: {
    title: string;
    subtitle: string;
  };
  parks: Array<{
    id: string;
    name: string;
    location: string;
    emoji: string;
    minAge: number;
    rating: number;
    minPrice: number;
    activities: string[];
  }>;
  showBackToTop: boolean;
  currentYear: number;
}

// ===== DONNÉES PAR DÉFAUT =====

const defaultFooterData: FooterData = {
  colors: {
    background: '#1a1a1a',
    primary: '#357600',
    secondary: '#eb700f',
  },
  contact: {
    phone: '01 23 45 67 89',
    email: 'contact@nolimit-aventure.com',
    description: 'NoLimit Aventure - Des expériences uniques pour tous !',
  },
  stats: [
    { number: '15+', label: 'Années d\'expérience' },
    { number: '5', label: 'Parcs en France' },
    { number: '50k+', label: 'Visiteurs par an' },
    { number: '98%', label: 'Clients satisfaits' },
  ],
  quickLinks: [
    { label: 'Accueil', to: '/' },
    { label: 'Activités', to: '/activities' },
    { label: 'Tarifs', to: '/prices' },
    { label: 'Groupes', to: '/groups' },
    { label: 'Contact', to: '/contact' },
  ],
  activities: [
    { name: 'Accrobranche', emoji: '🌳', link: '/activities/accrobranche' },
    { name: 'Tir à l\'arc', emoji: '🏹', link: '/activities/archery' },
    { name: 'Laser game', emoji: '🔫', link: '/activities/laser-game' },
    { name: 'Escape game', emoji: '🔐', link: '/activities/escape-game' },
  ],
  legalLinks: [
    { label: 'Mentions légales', to: '/legal' },
    { label: 'Politique de confidentialité', to: '/privacy' },
    { label: 'CGV', to: '/terms' },
    { label: 'Plan du site', to: '/sitemap' },
  ],
  cta: {
    title: 'Prêt pour l\'aventure ?',
    subtitle: 'Réservez dès maintenant votre activité',
  },
  parks: [
    {
      id: 'parc-nord',
      name: 'Parc Nord',
      location: 'Lille',
      emoji: '🌲',
      minAge: 6,
      rating: 4.8,
      minPrice: 25,
      activities: ['accrobranche', 'laser-game', 'escape-game'],
    },
    {
      id: 'parc-sud',
      name: 'Parc Sud',
      location: 'Marseille',
      emoji: '🌊',
      minAge: 6,
      rating: 4.7,
      minPrice: 28,
      activities: ['accrobranche', 'tir-arc', 'laser-game'],
    },
    {
      id: 'parc-est',
      name: 'Parc Est',
      location: 'Strasbourg',
      emoji: '⛰️',
      minAge: 6,
      rating: 4.9,
      minPrice: 26,
      activities: ['accrobranche', 'escape-game', 'tir-arc'],
    },
    {
      id: 'parc-ouest',
      name: 'Parc Ouest',
      location: 'Nantes',
      emoji: '🏰',
      minAge: 6,
      rating: 4.6,
      minPrice: 27,
      activities: ['accrobranche', 'laser-game'],
    },
    {
      id: 'parc-centre',
      name: 'Parc Centre',
      location: 'Lyon',
      emoji: '🏔️',
      minAge: 6,
      rating: 4.8,
      minPrice: 29,
      activities: ['accrobranche', 'escape-game', 'laser-game', 'tir-arc'],
    },
  ],
  showBackToTop: true,
  currentYear: new Date().getFullYear(),
};

export function useFooterData() {
  const [data, setData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);

        // 🔥 DEBUG: vérifier si la clé est lue correctement
        console.log('🔑 Clé API depuis import.meta.env:', API_KEY);

        const response = await fetch(`${API_URL}/footer`, {
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
          const formattedData: FooterData = {
            colors: {
              background: data.colors?.background || defaultFooterData.colors.background,
              primary: data.colors?.primary || defaultFooterData.colors.primary,
              secondary: data.colors?.secondary || defaultFooterData.colors.secondary,
            },
            contact: {
              phone: data.contact?.phone || defaultFooterData.contact.phone,
              email: data.contact?.email || defaultFooterData.contact.email,
              description: data.contact?.description || defaultFooterData.contact.description,
            },
            stats: Array.isArray(data.stats) && data.stats.length > 0 
              ? data.stats 
              : defaultFooterData.stats,
            quickLinks: Array.isArray(data.quickLinks) && data.quickLinks.length > 0 
              ? data.quickLinks 
              : defaultFooterData.quickLinks,
            activities: Array.isArray(data.activities) && data.activities.length > 0 
              ? data.activities 
              : defaultFooterData.activities,
            legalLinks: Array.isArray(data.legalLinks) && data.legalLinks.length > 0 
              ? data.legalLinks 
              : defaultFooterData.legalLinks,
            cta: {
              title: data.cta?.title || defaultFooterData.cta.title,
              subtitle: data.cta?.subtitle || defaultFooterData.cta.subtitle,
            },
            parks: Array.isArray(data.parks) && data.parks.length > 0 
              ? data.parks 
              : defaultFooterData.parks,
            showBackToTop: data.showBackToTop ?? defaultFooterData.showBackToTop,
            currentYear: data.currentYear || new Date().getFullYear(),
          };

          console.log('✅ Données formatées:', formattedData);

          setData(formattedData);
          setError(null);
        } else {
          console.log('⚠️ API vide, utilisation des données par défaut');
          // Mettre à jour l'année courante dans les données par défaut
          setData({
            ...defaultFooterData,
            currentYear: new Date().getFullYear(),
          });
        }
      } catch (err) {
        console.warn(
          '⚠️ Footer WordPress indisponible, utilisation des valeurs par défaut:',
          err
        );
        // Mettre à jour l'année courante dans les données par défaut
        setData({
          ...defaultFooterData,
          currentYear: new Date().getFullYear(),
        });
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  // Fonctions utilitaires
  const getParkById = (id: string) => {
    return data?.parks.find(park => park.id === id);
  };

  const getParkByLocation = (location: string) => {
    return data?.parks.find(park => park.location === location);
  };

  const getActivityLink = (activityName: string) => {
    return data?.activities.find(act => 
      act.name.toLowerCase() === activityName.toLowerCase()
    )?.link;
  };

  const getQuickLink = (label: string) => {
    return data?.quickLinks.find(link => link.label === label)?.to;
  };

  const getLegalLink = (label: string) => {
    return data?.legalLinks.find(link => link.label === label)?.to;
  };

  return { 
    data, 
    loading, 
    error,
    defaultFooterData,
    getParkById,
    getParkByLocation,
    getActivityLink,
    getQuickLink,
    getLegalLink
  };
}

export { defaultFooterData };
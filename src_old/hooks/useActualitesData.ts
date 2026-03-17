// hooks/useActualitesData.ts - Hook pour la section Actualités/Événements
import { useState, useEffect } from 'react';
import { ActualitesData, Actualite } from '../types';

// ===== DONNÉES PAR DÉFAUT (actuellement en dur dans ActualitesSection.tsx) =====
const defaultActualitesData: ActualitesData = {
  title: 'Actualités & Événements',
  subtitle: 'Restez informé de nos dernières nouveautés et événements spéciaux',
  showViewAllButton: true,
  viewAllUrl: '/actualites',
  articles: [
    {
      id: '1',
      titre: 'Soirée accrobranche nocturne',
      date: '2025-02-15',
      image: 'https://images.unsplash.com/photo-1630804261876-7e18e3a9c7aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      extrait: 'Venez découvrir l\'accrobranche sous les étoiles ! Une expérience unique avec parcours illuminés et ambiance magique.',
      isEvenement: true,
      lienInscription: '/evenements/accro-nocturne',
      lien: '/actualites/soiree-accrobranche-nocturne'
    },
    {
      id: '2',
      titre: 'Nouveaux parcours enfants à Chevry',
      date: '2025-01-20',
      image: 'https://images.unsplash.com/photo-1653154138513-ed13199917e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      extrait: 'Découvrez nos 3 nouveaux parcours spécialement conçus pour les enfants de 3 à 7 ans. Sécurité maximale, plaisir garanti !',
      isEvenement: false,
      lien: '/actualites/nouveaux-parcours-enfants'
    },
    {
      id: '3',
      titre: 'Offre spéciale Saint-Valentin',
      date: '2025-02-01',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      extrait: 'Pour la Saint-Valentin, profitez de notre pack duo avec accrobranche + déjeuner romantique en forêt. Réservation limitée.',
      isEvenement: true,
      lienInscription: '/evenements/saint-valentin',
      lien: '/actualites/offre-saint-valentin'
    }
  ]
};

export function useActualitesData() {
  const [data, setData] = useState<ActualitesData>(defaultActualitesData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const apiUrl = 'https://www.preprod.nolimit-aventure.com/wp-json/nolimit/v1/actualites';

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error('Erreur API Actualités');
        return res.json();
      })
      .then(wpData => {
        console.log('✅ Actualités chargées depuis WordPress:', wpData);
        // Fusion intelligente avec les valeurs par défaut
        const mergedData: ActualitesData = {
          title: wpData.title || defaultActualitesData.title,
          subtitle: wpData.subtitle || defaultActualitesData.subtitle,
          showViewAllButton: wpData.showViewAllButton ?? defaultActualitesData.showViewAllButton,
          viewAllUrl: wpData.viewAllUrl || defaultActualitesData.viewAllUrl,
          articles: wpData.articles?.length ? wpData.articles.map((article: any) => ({
            id: article.id || String(Math.random()),
            titre: article.titre || article.title || '',
            date: article.date || new Date().toISOString().split('T')[0],
            image: article.image || 'https://images.unsplash.com/photo-1630804261876-7e18e3a9c7aa?w=800',
            extrait: article.extrait || article.excerpt || '',
            isEvenement: article.isEvenement ?? article.is_event ?? false,
            lienInscription: article.lienInscription || article.registration_link || undefined,
            lien: article.lien || article.link || `/actualites/${article.id}`,
            categorie: article.categorie || article.category,
            auteur: article.auteur || article.author,
          })) : defaultActualitesData.articles,
        };
        setData(mergedData);
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ Actualités WordPress indisponibles, utilisation des valeurs par défaut:', err.message);
        setData(defaultActualitesData);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error, defaultData: defaultActualitesData };
}

// Export des données par défaut
export { defaultActualitesData };

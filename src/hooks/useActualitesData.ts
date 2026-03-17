// hooks/useActualitesData.ts - Hook pour la section Actualités/Événements
import { useState, useEffect } from 'react';
import { ActualitesData } from '../types';
import { API_URL, API_KEY } from '../config/config';

const defaultActualitesData: ActualitesData = {
  title: 'Actualités & Événements',
  subtitle: 'Restez informé de nos dernières nouveautés et événements spéciaux',
  showViewAllButton: true,
  viewAllUrl: '/actualites',
  articles: [
    {
      id: '1', titre: 'Soirée accrobranche nocturne', date: '2025-02-15',
      image: 'https://images.unsplash.com/photo-1630804261876-7e18e3a9c7aa?w=800',
      extrait: "Venez découvrir l'accrobranche sous les étoiles !",
      isEvenement: true, lienInscription: '/evenements/accro-nocturne', lien: '/actualites/soiree-accrobranche-nocturne',
    },
    {
      id: '2', titre: 'Nouveaux parcours enfants à Chevry', date: '2025-01-20',
      image: 'https://images.unsplash.com/photo-1653154138513-ed13199917e2?w=800',
      extrait: 'Découvrez nos 3 nouveaux parcours spécialement conçus pour les enfants de 3 à 7 ans.',
      isEvenement: false, lien: '/actualites/nouveaux-parcours-enfants',
    },
    {
      id: '3', titre: 'Offre spéciale Saint-Valentin', date: '2025-02-01',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      extrait: 'Pour la Saint-Valentin, profitez de notre pack duo.',
      isEvenement: true, lienInscription: '/evenements/saint-valentin', lien: '/actualites/offre-saint-valentin',
    },
  ],
};

export function useActualitesData() {
  const [data, setData] = useState<ActualitesData>(defaultActualitesData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/actualites`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur API Actualités');
        return res.json();
      })
      .then(wpData => {
        console.log('✅ Actualités chargées depuis WordPress:', wpData);
        const mergedData: ActualitesData = {
          title: wpData.title || defaultActualitesData.title,
          subtitle: wpData.subtitle || defaultActualitesData.subtitle,
          showViewAllButton: wpData.showViewAllButton ?? defaultActualitesData.showViewAllButton,
          viewAllUrl: wpData.viewAllUrl || defaultActualitesData.viewAllUrl,
          articles: wpData.articles?.length
            ? wpData.articles.map((article: any) => ({
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
              }))
            : defaultActualitesData.articles,
        };
        setData(mergedData);
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ Actualités WordPress indisponibles:', err.message);
        setData(defaultActualitesData);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error, defaultData: defaultActualitesData };
}

export { defaultActualitesData };

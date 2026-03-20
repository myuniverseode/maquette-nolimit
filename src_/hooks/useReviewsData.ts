import { API_URL, API_KEY, cleanWpData } from '../config/config';
// hooks/useReviewsData.ts - Hook pour les avis clients
import { useState, useEffect } from 'react';
import { Review } from '../types';

// ===== DONNÉES PAR DÉFAUT (actuellement dans data/reviews.ts) =====
const defaultReviews: Review[] = [
  {
    id: '1',
    author: 'Sophie M.',
    rating: 5,
    date: '15 novembre 2024',
    comment: 'Journée exceptionnelle en famille ! Les parcours accrobranche sont très bien entretenus et sécurisés. Les enfants ont adoré et nous aussi !',
    parkId: 'nolimit-chevry',
    parkName: 'NoLimit Chevry',
    verified: true
  },
  {
    id: '2',
    author: 'Thomas L.',
    rating: 5,
    date: '3 novembre 2024',
    comment: 'Super expérience pour mon EVG ! Le paintball était top, terrain immense et équipement de qualité. Je recommande vivement !',
    parkId: 'nolimit-nemours',
    parkName: 'NoLimit Nemours',
    verified: true
  },
  {
    id: '3',
    author: 'Marie D.',
    rating: 4,
    date: '28 octobre 2024',
    comment: 'L\'escape game outdoor était vraiment immersif. Les décors sont magnifiques et les énigmes bien pensées. Seul bémol : un peu d\'attente à l\'accueil.',
    parkId: 'nolimit-montargis',
    parkName: 'NoLimit Montargis',
    verified: true
  },
  {
    id: '4',
    author: 'Lucas B.',
    rating: 5,
    date: '20 octobre 2024',
    comment: 'Parcours extrême incroyable ! Pour les amateurs de sensations fortes, c\'est parfait. L\'équipe est très professionnelle et rassurante.',
    parkId: 'nolimit-nemours',
    parkName: 'NoLimit Nemours',
    verified: true
  },
  {
    id: '5',
    author: 'Camille R.',
    rating: 5,
    date: '12 octobre 2024',
    comment: 'Parfait pour un anniversaire d\'enfant ! Le parcours filet et l\'accrobranche kids sont géniaux. Personnel au top avec les petits.',
    parkId: 'nolimit-coudray',
    parkName: 'NoLimit Le Coudray',
    verified: true
  },
  {
    id: '6',
    author: 'Alexandre P.',
    rating: 4,
    date: '5 octobre 2024',
    comment: 'Très bonne journée entre amis. Le tir à l\'arc était une belle découverte, et l\'archery tag vraiment fun ! On reviendra.',
    parkId: 'nolimit-digny',
    parkName: 'NoLimit Digny',
    verified: true
  }
];

interface UseReviewsOptions {
  parkId?: string;
  limit?: number;
}

export function useReviewsData(options: UseReviewsOptions = {}) {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let apiUrl = `${API_URL}/reviews`;

    // Ajouter les paramètres de requête si spécifiés
    const params = new URLSearchParams();
    if (options.parkId) params.append('park_id', options.parkId);
    if (options.limit) params.append('limit', String(options.limit));
    if (params.toString()) apiUrl += `?${params.toString()}`;

    fetch(apiUrl, { headers: { 'Content-Type': 'application/json', ...(API_KEY ? { 'X-NoLimit-Key': API_KEY } : {}) } })
      .then(res => {
        if (!res.ok) throw new Error('Erreur API Reviews');
        return res.json().then(_x=>cleanWpData(_x));
      })
      .then(rawWp => { const wpData = cleanWpData(rawWp);
        console.log('✅ Avis chargés depuis WordPress:', wpData);

        if (Array.isArray(wpData) && wpData.length > 0) {
          const mappedReviews: Review[] = wpData.map((review: any) => ({
            id: review.id || String(Math.random()),
            author: review.author || review.author_name || 'Anonyme',
            avatar: review.avatar || review.author_avatar,
            rating: review.rating || 5,
            date: review.date || new Date().toLocaleDateString('fr-FR'),
            comment: review.comment || review.content || '',
            parkId: review.parkId || review.park_id || '',
            parkName: review.parkName || review.park_name,
            verified: review.verified ?? true,
            helpful: review.helpful || 0,
          }));
          setReviews(mappedReviews);
        } else {
          // Filtrer les reviews par défaut si parkId est spécifié
          let filteredReviews = defaultReviews;
          if (options.parkId) {
            filteredReviews = defaultReviews.filter(r => r.parkId === options.parkId);
          }
          if (options.limit) {
            filteredReviews = filteredReviews.slice(0, options.limit);
          }
          setReviews(filteredReviews);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ Reviews WordPress indisponibles, utilisation des valeurs par défaut:', err.message);

        // Filtrer les reviews par défaut
        let filteredReviews = defaultReviews;
        if (options.parkId) {
          filteredReviews = defaultReviews.filter(r => r.parkId === options.parkId);
        }
        if (options.limit) {
          filteredReviews = filteredReviews.slice(0, options.limit);
        }
        setReviews(filteredReviews);
        setError(err);
        setLoading(false);
      });
  }, [options.parkId, options.limit]);

  // Calculer les statistiques
  const stats = {
    total: reviews.length,
    averageRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0',
    fiveStars: reviews.filter(r => r.rating === 5).length,
    fourStars: reviews.filter(r => r.rating === 4).length,
  };

  return { reviews, loading, error, stats, defaultReviews };
}

// Export des données par défaut
export { defaultReviews };

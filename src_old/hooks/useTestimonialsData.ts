// hooks/useTestimonialsData.ts
import { useState, useEffect } from 'react';
import { Review } from '../types';
import { reviews as defaultReviews } from '../data/reviews'; // Import de ton fichier existant

interface UseTestimonialsOptions {
  parkId?: string;
  activity?: string;
  limit?: number;
  featured?: boolean;
  minRating?: number;
}

interface TestimonialsStats {
  total: number;
  averageRating: string;
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
  distribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}

export function useTestimonialsData(options: UseTestimonialsOptions = {}) {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let apiUrl = 'https://www.preprod.nolimit-aventure.com/wp-json/nolimit/v1/reviews';

    // Ajouter les paramètres de requête si spécifiés
    const params = new URLSearchParams();
    if (options.parkId) params.append('park_id', options.parkId);
    if (options.activity) params.append('activity', options.activity);
    if (options.limit) params.append('limit', String(options.limit));
    if (options.featured) params.append('featured', '1');
    if (options.minRating) params.append('min_rating', String(options.minRating));
    if (params.toString()) apiUrl += `?${params.toString()}`;

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error('Erreur API Reviews');
        return res.json();
      })
      .then(wpData => {
        console.log('✅ Avis chargés depuis WordPress:', wpData);

        if (Array.isArray(wpData) && wpData.length > 0) {
          const mappedReviews: Review[] = wpData.map((review: any) => ({
            id: review.id || String(Math.random()),
            author: review.author || review.author_name || 'Anonyme',
            rating: review.rating || 5,
            date: review.date || new Date().toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            }),
            comment: review.comment || review.content || '',
            parkId: review.parkId || review.park_id || '',
            verified: review.verified ?? true,
          }));
          setReviews(mappedReviews);
        } else {
          // Filtrer les reviews par défaut selon les options
          let filteredReviews = [...defaultReviews];
          
          if (options.parkId) {
            filteredReviews = filteredReviews.filter(r => 
              r.parkId === options.parkId
            );
          }
          
          if (options.minRating) {
            filteredReviews = filteredReviews.filter(r => 
              r.rating >= options.minRating!
            );
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
        let filteredReviews = [...defaultReviews];
        
        if (options.parkId) {
          filteredReviews = filteredReviews.filter(r => 
            r.parkId === options.parkId
          );
        }
        
        if (options.minRating) {
          filteredReviews = filteredReviews.filter(r => 
            r.rating >= options.minRating!
          );
        }
        
        if (options.limit) {
          filteredReviews = filteredReviews.slice(0, options.limit);
        }

        setReviews(filteredReviews);
        setError(err);
        setLoading(false);
      });
  }, [options.parkId, options.activity, options.limit, options.featured, options.minRating]);

  // Calculer les statistiques détaillées
  const stats: TestimonialsStats = {
    total: reviews.length,
    averageRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0',
    fiveStars: reviews.filter(r => r.rating === 5).length,
    fourStars: reviews.filter(r => r.rating === 4).length,
    threeStars: reviews.filter(r => r.rating === 3).length,
    twoStars: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length,
    distribution: [5, 4, 3, 2, 1].map(rating => {
      const count = reviews.filter(r => r.rating === rating).length;
      return {
        rating,
        count,
        percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0
      };
    })
  };

  // Grouper par parc
  const groupedByPark = reviews.reduce((acc, review) => {
    const parkId = review.parkId || 'autre';
    if (!acc[parkId]) {
      acc[parkId] = [];
    }
    acc[parkId].push(review);
    return acc;
  }, {} as Record<string, Review[]>);

  // Statistiques par parc
  const parkStats = Object.entries(groupedByPark).map(([parkId, parkReviews]) => ({
    parkId,
    count: parkReviews.length,
    averageRating: (parkReviews.reduce((sum, r) => sum + r.rating, 0) / parkReviews.length).toFixed(1)
  }));

  // Top reviews (les mieux notées)
  const topReviews = [...reviews]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return { 
    reviews, 
    loading, 
    error, 
    stats,
    groupedByPark,
    parkStats,
    topReviews,
    defaultReviews 
  };
}

// Export des données par défaut
export { defaultReviews };
// hooks/useParksData.ts - Hook pour les données des parcs
import { useState, useEffect } from 'react';
import { Park } from '../types';

// ===== DONNÉES PAR DÉFAUT (actuellement dans data/parks.ts) =====
const defaultParks: Park[] = [
  {
    id: 'nolimit-chevry',
    name: 'NoLimit Aventure - Chevry',
    location: 'Chevry, Essonne (91)',
    coordinates: { lat: 48.5351, lng: 2.2669 },
    description: 'Le parc historique NoLimit Aventure à 30 minutes de Paris. 14 parcours accrobranche dans une forêt de 5 hectares. Parfait pour les initiations et les sorties en famille.',
    image: 'https://images.unsplash.com/photo-1630804261876-7e18e3a9c7aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    activities: ['Accrobranche', 'Tyrolienne', 'Parcours filet', 'Tir à l\'arc'],
    difficulty: ['Débutant', 'Intermédiaire'],
    minAge: 3,
    rating: 4.7,
    departement: 'Seine-et-Marne',
    reviewCount: 423,
    minPrice: 25,
    capacity: 120,
    highlights: ['14 parcours', 'Parcours Kids', 'Proche de Paris', 'Ouvert toute l\'année']
  },
  {
    id: 'nolimit-nemours',
    name: 'NoLimit Aventure - Nemours',
    location: 'Nemours, Seine-et-Marne (77)',
    coordinates: { lat: 48.2802, lng: 2.7121 },
    description: 'Le plus grand parc NoLimit avec 18 parcours dont des parcours extrêmes. Tyrolienne géante de 300m et activités variées pour tous les niveaux.',
    image: 'https://images.unsplash.com/photo-1653154138513-ed13199917e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    activities: ['Accrobranche', 'Tyrolienne 300m', 'Paintball', 'Archery Tag', 'Parcours extrême'],
    difficulty: ['Débutant', 'Intermédiaire', 'Avancé'],
    minAge: 6,
    rating: 4.8,
    departement: 'Seine-et-Marne',
    reviewCount: 512, 
    minPrice: 28,
    capacity: 180,
    highlights: ['18 parcours', 'Tyrolienne géante', 'Terrain Paintball', 'Parcours Black expert']
  },
  {
    id: 'nolimit-montargis',
    name: 'NoLimit Aventure - Montargis',
    location: 'Montargis, Loiret (45)',
    coordinates: { lat: 48.0000, lng: 2.7333 },
    description: 'Parc familial au cœur du Loiret avec des parcours adaptés à tous les âges. Cadre verdoyant et activités diversifiées.',
    image: 'https://images.unsplash.com/photo-1462926703708-44ab9e271d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    activities: ['Accrobranche', 'Parcours filet', 'Tir à l\'arc', 'Escape Game'],
    difficulty: ['Débutant', 'Intermédiaire'],
    minAge: 5,
    rating: 4.6,
    departement: 'Loiret',
    reviewCount: 287,
    minPrice: 23,
    capacity: 100,
    highlights: ['Parcours familial', 'Escape Game', 'Cadre naturel', 'Accès facile']
  },
  {
    id: 'nolimit-digny',
    name: 'NoLimit Aventure - Digny',
    location: 'Digny, Eure-et-Loir (28)',
    coordinates: { lat: 48.5333, lng: 1.1500 },
    description: 'Parc au cœur de la forêt avec des parcours techniques et un environnement préservé. Idéal pour les amateurs de nature et d\'aventure.',
    image: 'https://images.unsplash.com/photo-1630804261876-7e18e3a9c7aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    activities: ['Accrobranche', 'Paintball', 'Orientation', 'Chasse au trésor'],
    difficulty: ['Intermédiaire', 'Avancé'],
    minAge: 8,  
    rating: 4.5,
    departement: 'Eure-et-Loir',
    reviewCount: 198,
    minPrice: 24,
    capacity: 90,
    highlights: ['Forêt dense', 'Parcours techniques', 'Chasse au trésor', 'Environnement préservé']
  },
  {
    id: 'nolimit-coudray',
    name: 'NoLimit Aventure - Le Coudray',
    location: 'Le Coudray, Eure-et-Loir (28)',
    coordinates: { lat: 48.4333, lng: 1.4833 },
    description: 'Parc moderne avec des installations récentes et des parcours innovants. Très apprécié pour les sorties scolaires et les groupes.',
    image: 'https://images.unsplash.com/photo-1759872138838-45bd5c07ddc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    activities: ['Accrobranche', 'Parcours Kids', 'Tir à l\'arc', 'Animations pédagogiques'],
    difficulty: ['Débutant'],
    minAge: 3,
    rating: 4.7,
    departement: 'Eure-et-Loir',
    reviewCount: 234,
    minPrice: 22,
    capacity: 110,
    highlights: ['Installations modernes', 'Pédagogique', 'Sorties scolaires', 'Parcours adaptés'],
 
  },
];

export function useParksData() {
  const [parks, setParks] = useState<Park[]>(defaultParks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const apiUrl = 'https://www.preprod.nolimit-aventure.com/wp-json/nolimit/v1/parks';

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error('Erreur API Parks');
        return res.json();
      })
      .then(wpData => {
        console.log('✅ Parcs chargés depuis WordPress:', wpData);

        // Si l'API retourne des données, les mapper au format attendu
        if (Array.isArray(wpData) && wpData.length > 0) {
          const mappedParks: Park[] = wpData.map((park: any, index: number) => {
            // Trouver le parc par défaut correspondant pour fallback sur les images
            const defaultPark = defaultParks.find(p => p.id === park.id) || defaultParks[index];

            // Gérer l'image: si false ou vide, utiliser l'image par défaut
            const parkImage = (park.image && park.image !== false)
              ? park.image
              : defaultPark?.image || defaultParks[0].image;

            return {
              id: park.id || park.slug || `park-${Math.random()}`,
              name: park.name || park.title || defaultPark?.name || '',
              location: park.location || defaultPark?.location || '',
              coordinates: park.coordinates || defaultPark?.coordinates || { lat: 0, lng: 0 },
              description: park.description || defaultPark?.description || '',
              image: parkImage,
              gallery: (park.gallery && park.gallery.length > 0) ? park.gallery : (defaultPark?.gallery || []),
              activities: park.activities || defaultPark?.activities || [],
              difficulty: park.difficulty || defaultPark?.difficulty || ['Débutant'],
              minAge: park.minAge ?? park.min_age ?? defaultPark?.minAge ?? 3,
              rating: park.rating ?? defaultPark?.rating ?? 4.5,
              reviewCount: park.reviewCount ?? park.review_count ?? defaultPark?.reviewCount ?? 0,
              minPrice: park.minPrice ?? park.min_price ?? defaultPark?.minPrice ?? 20,
              capacity: park.capacity ?? defaultPark?.capacity ?? 100,
              departement: park.departement || defaultPark?.departement || '',
              highlights: (park.highlights || park.features || []).length > 0
                ? (park.highlights || park.features)
                : (defaultPark?.highlights || []),
              openingHours: park.openingHours || park.opening_hours || defaultPark?.openingHours,
              contact: park.contact || defaultPark?.contact,
         
            };
          });
          setParks(mappedParks);
        } else {
          // Pas de données, garder les valeurs par défaut
          setParks(defaultParks);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ Parks WordPress indisponibles, utilisation des valeurs par défaut:', err.message);
        setParks(defaultParks);
        setError(err);
        setLoading(false);
      });
  }, []);

  // Hook pour obtenir un parc spécifique par ID
  const getParkById = (id: string): Park | undefined => {
    return parks.find(park => park.id === id);
  };

  return { parks, loading, error, getParkById, defaultParks };
}

// Export des données par défaut
export { defaultParks };

// components/ParksList.tsx
import { useState } from 'react';
import { useParksData } from '../hooks/useParksData';
import { ParkCard } from '../components/ParkCard';
import { ParkFilters } from '../components/ParkFilters';
import { Filters } from '../types';
import { ArrowDownUp, MapPin, Search } from 'lucide-react';

interface ParksListProps {
  compact?: boolean;
  showFilter?: boolean;
  maxItems?: number;
  centeredFilters?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}

export function ParksList({
  compact = false,
  showFilter = true,
  maxItems,
  centeredFilters = false,
  primaryColor = '#357600',
  secondaryColor = '#eb700f'
}: ParksListProps) {
  const { parks, loading } = useParksData();
  
  const [filters, setFilters] = useState<Filters>({
    activities: [],
    minAge: null,
    difficulty: [],
    location: '',
    maxDistance: null
  });
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name'>('rating');
  const [searchQuery, setSearchQuery] = useState('');

  const normalizeActivityName = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const filteredParks = parks.filter((park) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!park.name.toLowerCase().includes(query) && 
          !park.location.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    if (filters.activities.length > 0) {
      const hasAllActivities = filters.activities.every((activityId) => {
        return park.activities.some(parkActivity => 
          normalizeActivityName(parkActivity) === activityId
        );
      });
      if (!hasAllActivities) return false;
    }
    
    if (filters.minAge !== null) {
      if (park.minAge < filters.minAge) return false;
    }
    
    if (filters.difficulty.length > 0) {
      const hasAllDifficulties = filters.difficulty.every((difficulty) =>
        park.difficulty.includes(difficulty)
      );
      if (!hasAllDifficulties) return false;
    }
    
    return true;
  });

  const sortedParks = [...filteredParks].sort((a, b) => {
    switch (sortBy) {
      case 'price': return a.minPrice - b.minPrice;
      case 'rating': return b.rating - a.rating;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const displayedParks = maxItems ? sortedParks.slice(0, maxItems) : sortedParks;
  const activeFilterCount = filters.activities.length + (filters.minAge ? 1 : 0) + filters.difficulty.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-600">Chargement des parcs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Barre de recherche et filtres */}
      {showFilter && centeredFilters && (
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="text"
                placeholder="Rechercher un parc par nom ou ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {['Tous', 'Essonne (91)', 'Seine-et-Marne (77)', 'Loiret (45)', 'Eure-et-Loir (28)'].map((region) => (
              <button
                key={region}
                onClick={() => {
                  if (region === 'Tous') {
                    setFilters(prev => ({ ...prev, location: '' }));
                  } else {
                    setFilters(prev => ({ ...prev, location: region }));
                  }
                }}
                className={`px-4 py-2 rounded-full transition-all ${
                  (region === 'Tous' && !filters.location) || filters.location === region
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filtres avancés */}
      {showFilter && (
        <ParkFilters 
          onFilterChange={setFilters}
          parks={parks}
          compact={compact}
        />
      )}

      {/* Header avec statistiques et tri */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="text-gray-700">
          <span className="font-bold text-lg">{sortedParks.length}</span>
          <span className="text-gray-600 ml-2">
            parc{sortedParks.length > 1 ? 's' : ''} trouvé{sortedParks.length > 1 ? 's' : ''}
            {activeFilterCount > 0 && (
              <span className="ml-2 text-green-600 font-medium">
                avec {activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''}
              </span>
            )}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <ArrowDownUp className="size-5 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'name')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="rating">Meilleures notes</option>
            <option value="price">Prix croissant</option>
            <option value="name">Nom (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Liste des parcs */}
      {displayedParks.length > 0 ? (
        <>
          {compact ? (
            // MODE BULLES : Grille flexible décalée
            <div className="flex flex-wrap justify-center gap-6 items-center">
              {displayedParks.map((park, index) => (
                <div 
                  key={park.id}
                  style={{
                    marginTop: index % 2 === 0 ? '0' : '2rem'
                  }}
                >
                  <ParkCard 
                    park={park}
                    index={index}
                    compact={true}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                  />
                </div>
              ))}
            </div>
          ) : (
            // MODE GRILLE CLASSIQUE
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedParks.map((park, index) => (
                <ParkCard 
                  key={park.id} 
                  park={park}
                  index={index}
                  compact={false}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        // Message quand aucun parc trouvé
        <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center max-w-2xl mx-auto">
          <MapPin className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun parc trouvé</h3>
          <p className="text-gray-600 mb-6">
            Essayez de modifier vos critères de recherche
          </p>
          <button
            onClick={() => {
              setFilters({
                activities: [],
                minAge: null,
                difficulty: [],
                location: '',
                maxDistance: null
              });
              setSearchQuery('');
            }}
            className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
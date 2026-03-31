// components/ParksList.tsx — Layout sidebar gauche + grille parcs droite
import { useState } from 'react';
import { useParksData } from '../hooks/useParksData';
import { ParkCard } from '../components/ParkCard';
import { ParkFilters } from '../components/ParkFilters';
import { Filters } from '../types';
import { ArrowDownUp, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

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
  secondaryColor = '#eb700f',
}: ParksListProps) {
  const { parks, loading } = useParksData();

  const [filters, setFilters] = useState<Filters>({
    activities: [], minAge: null, difficulty: [], location: '', maxDistance: null,
  });
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name'>('rating');
  const [searchQuery, setSearchQuery] = useState('');

  const normalizeActivityName = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const filteredParks = parks.filter(park => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!park.name.toLowerCase().includes(q) && !park.location.toLowerCase().includes(q)) return false;
    }
    if (filters.activities.length > 0) {
      const ok = filters.activities.every(id =>
        park.activities.some(a => normalizeActivityName(a) === id)
      );
      if (!ok) return false;
    }
    if (filters.minAge !== null && park.minAge < filters.minAge) return false;
    if (filters.difficulty.length > 0) {
      if (!filters.difficulty.every(d => park.difficulty.includes(d))) return false;
    }
    return true;
  });

  const sortedParks = [...filteredParks].sort((a, b) => {
    if (sortBy === 'price') return a.minPrice - b.minPrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });

  const displayedParks = maxItems ? sortedParks.slice(0, maxItems) : sortedParks;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4" />
          <p className="text-gray-600">Chargement des parcs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ── Barre de recherche + filtres rapides de région ── */}
      {showFilter && centeredFilters && (
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="text"
                placeholder="Rechercher par nom ou ville…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#357600]/30 focus:border-[#357600] transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {['Tous', 'Essonne (91)', 'Seine-et-Marne (77)', 'Loiret (45)', 'Eure-et-Loir (28)'].map(region => (
              <button
                key={region}
                onClick={() => setFilters(prev => ({ ...prev, location: region === 'Tous' ? '' : region }))}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  (region === 'Tous' && !filters.location) || filters.location === region
                    ? 'bg-[#357600] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Layout principal : sidebar gauche + contenu droite ── */}
      <div className="flex gap-8 items-start">

        {/* ── SIDEBAR FILTRES (desktop sticky, mobile drawer) ── */}
        {showFilter && (
          <ParkFilters
            onFilterChange={setFilters}
            parks={parks}
            compact={compact}
          />
        )}

        {/* ── COLONNE DROITE ── */}
        <div className="flex-1 min-w-0">

          {/* Barre de résultats + tri */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-gray-900">{sortedParks.length}</span>
              <span className="text-gray-500 text-sm">
                parc{sortedParks.length > 1 ? 's' : ''} trouvé{sortedParks.length > 1 ? 's' : ''}
              </span>
            </div>

         
          </div>

          {/* ── Grille / bulles ── */}
          {displayedParks.length > 0 ? (
            compact ? (
              // MODE BULLES
              <div className="flex flex-wrap justify-center gap-6 items-center">
                {displayedParks.map((park, i) => (
                  <div key={park.id}>
                    <ParkCard park={park} index={i} compact primaryColor={primaryColor} secondaryColor={secondaryColor} />
                  </div>
                ))}
              </div>
            ) : (
              // MODE GRILLE CLASSIQUE
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              >
                {displayedParks.map((park, i) => (
                  <motion.div
                    key={park.id}
                    variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <ParkCard park={park} index={i} compact={false} primaryColor={primaryColor} secondaryColor={secondaryColor} />
                  </motion.div>
                ))}
              </motion.div>
            )
          ) : (
            // Aucun résultat
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <MapPin className="size-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun parc trouvé</h3>
              <p className="text-gray-500 text-sm mb-5">Essayez de modifier vos filtres</p>
              <button
                onClick={() => {
                  setFilters({ activities: [], minAge: null, difficulty: [], location: '', maxDistance: null });
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 bg-[#357600] text-white rounded-full text-sm font-semibold hover:bg-[#2a5e00] transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// pages/ActivitiesPage.tsx - Version avec recherche floue (fuzzy search)
import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { ActivityCard } from '../components/ActivityCard';
import { CTAEvenement } from '../components/CTAEvenement';
import { useActivitiesData } from '../hooks/useActiviesData';

// Fonction pour extraire le nombre minimum de participants
const getMinParticipants = (activity: any): number => {
  if (activity.participants) {
    if (typeof activity.participants === 'object' && activity.participants !== null) {
      return (activity.participants as any).min || 1;
    }
    if (typeof activity.participants === 'string') {
      const match = activity.participants.match(/(\d+)/);
      return match ? parseInt(match[1]) : 1;
    }
    if (typeof activity.participants === 'number') return activity.participants;
  }
  return 1;
};

const getMaxParticipants = (activity: any): number => {
  if (activity.participants) {
    if (typeof activity.participants === 'object' && activity.participants !== null) {
      return (activity.participants as any).max || Infinity;
    }
    if (typeof activity.participants === 'string') {
      const matches = activity.participants.match(/(\d+)[^\d]*(\d+)?/);
      if (matches && matches[2]) return parseInt(matches[2]);
      if (matches && matches[1]) return parseInt(matches[1]);
    }
    if (typeof activity.participants === 'number') return activity.participants;
  }
  return Infinity;
};

// Bouton filtre réutilisable
function FilterBtn({
  active,
  onClick,
  activeColor,
  children,
}: {
  active: boolean;
  onClick: () => void;
  activeColor: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md"
      style={{
        backgroundColor: active ? activeColor : 'white',
        color: active ? 'white' : '#374151',
        border: `2px solid ${active ? activeColor : '#e5e7eb'}`,
      }}
    >
      {children}
    </motion.button>
  );
}

export function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { activities, loading, error } = useActivitiesData();

  const fuse = useMemo(() => new Fuse(activities, {
    keys: ['name', 'description'],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 2,
    shouldSort: true,
  }), [activities]);

  const fuzzyResults = useMemo(() => {
    if (!searchQuery.trim()) return activities;
    return fuse.search(searchQuery).map(r => r.item);
  }, [searchQuery, fuse, activities]);

  const filteredActivities = useMemo(() => {
    return fuzzyResults.filter((activity) => {
      let matchesParticipants = selectedParticipants === 'all';
      if (!matchesParticipants) {
        const min = getMinParticipants(activity);
        const max = getMaxParticipants(activity);
        switch (selectedParticipants) {
          case '1':   matchesParticipants = min <= 1 && max >= 1; break;
          case '2-5': matchesParticipants = min <= 5 && max >= 2; break;
          case '6-10':matchesParticipants = min <= 10 && max >= 6; break;
          case '10+': matchesParticipants = min >= 10 || max >= 10; break;
        }
      }
      const matchesAge = selectedAge === 'all' ||
        (activity.minAge && activity.minAge <= parseInt(selectedAge));
      const matchesCategory = selectedCategory === 'all';
      return matchesParticipants && matchesAge && matchesCategory;
    });
  }, [fuzzyResults, selectedParticipants, selectedAge, selectedCategory]);

  const resetFilters = () => {
    setSelectedParticipants('all');
    setSelectedAge('all');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#357600', borderTopColor: 'transparent' }}
          />
          <p className="text-gray-600 font-medium">Chargement des activités...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ color: '#111111' }}>Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-white rounded-full font-bold hover:shadow-xl transition-all"
            style={{ backgroundColor: '#357600' }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-white">

      {/* ── HERO ── */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1653154138513-ed13199917e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Activités NoLimit"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/70 via-[#111111]/50 to-[#111111]/80" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl"
          >
            Trouvez votre{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(to right, #357600, #4a9d00)' }}
            >
              aventure
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            Des activités outdoor et indoor pour tous les âges et tous les groupes
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une activité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-white/30 focus:border-white/60 focus:outline-none text-gray-900 placeholder-gray-500 font-medium shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FILTRES ── */}
      <section className="relative -mt-20 pb-12 z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <div className="text-center mb-8">
              <span className="font-bold text-2xl" style={{ color: '#357600' }}>
                {filteredActivities.length}
              </span>{' '}
              <span className="text-sm text-gray-600">
                activité{filteredActivities.length > 1 ? 's' : ''} disponible{filteredActivities.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {/* Participants — vert */}
              <FilterBtn active={selectedParticipants === 'all'}  onClick={() => setSelectedParticipants('all')}  activeColor="#357600">Tous groupes</FilterBtn>
              <FilterBtn active={selectedParticipants === '1'}    onClick={() => setSelectedParticipants('1')}    activeColor="#357600">👤 1 personne</FilterBtn>
              <FilterBtn active={selectedParticipants === '2-5'}  onClick={() => setSelectedParticipants('2-5')}  activeColor="#357600">👥 2-5 personnes</FilterBtn>
              <FilterBtn active={selectedParticipants === '6-10'} onClick={() => setSelectedParticipants('6-10')} activeColor="#357600">👨‍👩‍👧‍👦 6-10 personnes</FilterBtn>
              <FilterBtn active={selectedParticipants === '10+'}  onClick={() => setSelectedParticipants('10+')}  activeColor="#357600">👥👥 10+ personnes</FilterBtn>

              <div className="w-px h-10 bg-gray-200" />

              {/* Âges — orange */}
              <FilterBtn active={selectedAge === 'all'} onClick={() => setSelectedAge('all')} activeColor="#eb700f">Tous âges</FilterBtn>
              <FilterBtn active={selectedAge === '3'}   onClick={() => setSelectedAge('3')}   activeColor="#eb700f">👶 3 ans+</FilterBtn>
              <FilterBtn active={selectedAge === '8'}   onClick={() => setSelectedAge('8')}   activeColor="#eb700f">👦 8 ans+</FilterBtn>
              <FilterBtn active={selectedAge === '12'}  onClick={() => setSelectedAge('12')}  activeColor="#eb700f">🧑 12 ans+</FilterBtn>
            </div>

            {(selectedParticipants !== 'all' || selectedAge !== 'all' || searchQuery) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-6 pt-6 border-t border-gray-100"
              >
                <button
                  onClick={resetFilters}
                  className="text-sm font-medium text-gray-500 hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── GRILLE ACTIVITÉS ── */}
      <section className="relative py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 relative z-10">
          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
              {filteredActivities.map((activity, index) => (
                <ActivityCard key={activity.id} activity={activity} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#35760015' }}
              >
                <Search className="size-12" style={{ color: '#357600' }} />
              </div>
              <h3 className="text-2xl font-black mb-3" style={{ color: '#111111' }}>
                Aucune activité trouvée
              </h3>
              <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 text-white rounded-full font-bold hover:shadow-xl transition-all"
                style={{ backgroundColor: '#357600' }}
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA ÉVÉNEMENT ── */}
      <CTAEvenement variant="dark" />

    </div>
  );
}
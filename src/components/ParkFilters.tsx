// components/ParkFilters.tsx - MODIFIED: accessibility (transport) + event type instead of age/difficulty
import { useState } from 'react';
import { Filter, X, ChevronDown, Zap, Train, Car, Bus, PartyPopper, Users, Cake, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filters, Park } from '../types';

interface ParkFiltersProps {
  onFilterChange: (filters: Filters) => void;
  parks: Park[];
  compact?: boolean;
}

// Helper for activity emojis
function getActivityEmoji(activity: string): string {
  const emojiMap: Record<string, string> = {
    'Accrobranche': '🌳', 'Paintball': '🎯', 'Escape Game': '🔐',
    "Tir à l'arc": '🏹', 'Parcours filet': '🕸️', 'Archery Tag': '🎯',
    'Tyrolienne': '⚡', 'Tyrolienne 300m': '⚡', 'Orientation': '🧭',
    'Chasse au trésor': '🗺️', 'Parcours extrême': '🔥', 'Parcours Kids': '👶',
    'Animations pédagogiques': '📚', 'Laser Game': '🔫', 'Lazer': '🔫',
  };
  return emojiMap[activity] || '⭐';
}

// Accessibility / Transport options
const TRANSPORT_OPTIONS = [
  {
    id: 'voiture',
    label: 'En voiture',
    icon: Car,
    description: 'Accès parking gratuit',
    color: 'green' as const,
  },
  {
    id: 'train',
    label: 'En train',
    icon: Train,
    description: 'Gare à proximité',
    color: 'blue' as const,
  },
  {
    id: 'bus',
    label: 'En bus / navette',
    icon: Bus,
    description: 'Bus ou navette disponible',
    color: 'orange' as const,
  },
];

// Event types (instead of age/difficulty)
const EVENT_OPTIONS = [
  { id: 'evg', label: 'EVG / EVJF', emoji: '🥂', description: 'Enterrement de vie de garçon / fille', color: 'pink' as const },
  { id: 'anniversaire', label: 'Anniversaire', emoji: '🎂', description: 'Fêtez votre anniversaire', color: 'yellow' as const, popular: true },
  { id: 'famille', label: 'En famille', emoji: '👨‍👩‍👧‍👦', description: 'Sortie famille avec enfants', color: 'green' as const },
  { id: 'entreprise', label: 'Team Building', emoji: '💼', description: 'Cohésion d\'équipe', color: 'blue' as const },
  { id: 'scolaire', label: 'Sortie scolaire', emoji: '🏫', description: 'Classes & groupes scolaires', color: 'purple' as const },
  { id: 'ami', label: 'Entre amis', emoji: '🤝', description: 'Sortie entre potes', color: 'orange' as const },
];

export function ParkFilters({ onFilterChange, parks, compact = false }: ParkFiltersProps) {
  const [filters, setFilters] = useState<Filters & { transport: string[]; eventType: string[] }>({
    activities: [],
    minAge: null,
    difficulty: [],
    location: '',
    maxDistance: null,
    transport: [],
    eventType: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    activities: !compact,
    transport: !compact,
    event: !compact,
  });

  // Unique activities from parks props
  const getUniqueActivities = () => {
    const allActivities = parks.flatMap(park => park.activities);
    const uniqueActivities = [...new Set(allActivities)];
    return uniqueActivities.map(activity => ({
      id: activity.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      label: activity,
      emoji: getActivityEmoji(activity),
    }));
  };

  const ACTIVITIES = getUniqueActivities();

  const handleActivityToggle = (activityId: string) => {
    const newActivities = filters.activities.includes(activityId)
      ? filters.activities.filter(id => id !== activityId)
      : [...filters.activities, activityId];
    const newFilters = { ...filters, activities: newActivities };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTransportToggle = (transportId: string) => {
    const newTransport = filters.transport.includes(transportId)
      ? filters.transport.filter(id => id !== transportId)
      : [...filters.transport, transportId];
    const newFilters = { ...filters, transport: newTransport };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleEventToggle = (eventId: string) => {
    const newEvent = filters.eventType.includes(eventId)
      ? filters.eventType.filter(id => id !== eventId)
      : [...filters.eventType, eventId];
    const newFilters = { ...filters, eventType: newEvent };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      activities: [], minAge: null, difficulty: [],
      location: '', maxDistance: null, transport: [], eventType: [],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFilterCount = filters.activities.length + filters.transport.length + filters.eventType.length;

  const colorClasses: Record<string, string> = {
    green: 'from-green-500 to-emerald-600 border-green-400 shadow-green-500/40',
    blue: 'from-blue-500 to-blue-600 border-blue-400 shadow-blue-500/40',
    orange: 'from-orange-500 to-orange-600 border-orange-400 shadow-orange-500/40',
    pink: 'from-pink-500 to-rose-600 border-pink-400 shadow-pink-500/40',
    yellow: 'from-yellow-400 to-amber-500 border-yellow-400 shadow-yellow-500/40',
    purple: 'from-purple-500 to-purple-600 border-purple-400 shadow-purple-500/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl shadow-2xl shadow-green-500/10 p-8 mb-12 border border-gray-100"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30"
          >
            <Filter className="size-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-black text-green-800 flex items-center gap-2">
              Filtres de recherche
              {activeFilterCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="inline-flex items-center justify-center w-7 h-7 bg-green-500 text-white text-sm font-bold rounded-full"
                >
                  {activeFilterCount}
                </motion.span>
              )}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {activeFilterCount > 0
                ? `${activeFilterCount} filtre${activeFilterCount > 1 ? 's' : ''} actif${activeFilterCount > 1 ? 's' : ''}`
                : 'Affinez votre recherche'}
            </p>
          </div>
        </div>
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all font-medium"
            >
              <X className="size-4" />
              Réinitialiser
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-5">
        
        {/* ACTIVITIES */}
        <motion.div layout className="border-2 border-gray-100 rounded-2xl p-5 bg-gradient-to-br from-gray-50 to-white hover:border-green-200 transition-colors">
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, activities: !prev.activities }))}
            className="flex items-center justify-between w-full text-left group"
          >
            <div className="flex items-center gap-3">
              <Zap className="size-5 text-green-600" />
              <div>
                <span className="font-bold text-gray-900 text-base">Activités</span>
                <span className="ml-3 text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {filters.activities.length > 0 ? `${filters.activities.length}/${ACTIVITIES.length}` : `${ACTIVITIES.length}`}
                </span>
              </div>
            </div>
            <motion.div animate={{ rotate: expandedSections.activities ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="size-5 text-gray-400" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {expandedSections.activities && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }} className="overflow-hidden"
              >
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {ACTIVITIES.map((activity, index) => {
                    const isSelected = filters.activities.includes(activity.id);
                    return (
                      <motion.button
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        onClick={() => handleActivityToggle(activity.id)}
                        whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                        className={`relative px-3 py-3 rounded-xl transition-all font-medium text-sm ${
                          isSelected
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/40 border-2 border-green-400'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <motion.div animate={isSelected ? { rotate: [0, -10, 10, 0] } : {}} transition={{ duration: 0.5 }} className="text-2xl mb-1">
                          {activity.emoji}
                        </motion.div>
                        <div className="text-xs leading-tight">{activity.label}</div>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md text-xs"
                            >✓</motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* TRANSPORT / ACCESSIBILITÉ */}
        <motion.div layout className="border-2 border-gray-100 rounded-2xl p-5 bg-gradient-to-br from-blue-50/40 to-white hover:border-blue-200 transition-colors">
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, transport: !prev.transport }))}
            className="flex items-center justify-between w-full text-left group"
          >
            <div className="flex items-center gap-3">
              <Car className="size-5 text-blue-600" />
              <div>
                <span className="font-bold text-gray-900 text-base">Accessibilité / Transport</span>
                {filters.transport.length > 0 && (
                  <span className="ml-2 text-sm text-blue-600 font-bold">{filters.transport.length} choisi{filters.transport.length > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
            <motion.div animate={{ rotate: expandedSections.transport ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="size-5 text-gray-400" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {expandedSections.transport && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }} className="overflow-hidden"
              >
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TRANSPORT_OPTIONS.map((option, index) => {
                    const isSelected = filters.transport.includes(option.id);
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        onClick={() => handleTransportToggle(option.id)}
                        whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                        className={`relative px-4 py-4 rounded-xl text-left transition-all ${
                          isSelected
                            ? `bg-gradient-to-br ${colorClasses[option.color]} text-white shadow-lg border-2`
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Icon className={`size-6 mb-2 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                        <div className="font-bold text-sm">{option.label}</div>
                        <div className={`text-xs mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>{option.description}</div>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                              className="absolute top-2 right-2 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center text-xs"
                            >✓</motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* TYPE D'ÉVÉNEMENT */}
        <motion.div layout className="border-2 border-gray-100 rounded-2xl p-5 bg-gradient-to-br from-orange-50/40 to-white hover:border-orange-200 transition-colors">
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, event: !prev.event }))}
            className="flex items-center justify-between w-full text-left group"
          >
            <div className="flex items-center gap-3">
              <PartyPopper className="size-5 text-orange-500" />
              <div>
                <span className="font-bold text-gray-900 text-base">Votre événement</span>
                {filters.eventType.length > 0 && (
                  <span className="ml-2 text-sm text-orange-600 font-bold">{filters.eventType.length} choisi{filters.eventType.length > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
            <motion.div animate={{ rotate: expandedSections.event ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="size-5 text-gray-400" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {expandedSections.event && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }} className="overflow-hidden"
              >
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {EVENT_OPTIONS.map((option, index) => {
                    const isSelected = filters.eventType.includes(option.id);
                    return (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleEventToggle(option.id)}
                        whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                        className={`relative px-4 py-4 rounded-xl text-left transition-all ${
                          isSelected
                            ? `bg-gradient-to-br ${colorClasses[option.color]} text-white shadow-lg border-2`
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="text-2xl mb-1.5">{option.emoji}</div>
                        <div className="font-bold text-sm flex items-center gap-1.5">
                          {option.label}
                          {option.popular && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-orange-100 text-orange-700'}`}>
                              ⭐
                            </span>
                          )}
                        </div>
                        <div className={`text-xs mt-0.5 leading-tight ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                          {option.description}
                        </div>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                              className="absolute top-2 right-2 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center text-xs"
                            >✓</motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ACTIVE FILTERS */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-5 border-t-2 border-gray-100"
          >
            <p className="text-sm font-semibold text-gray-600 mb-3">Filtres actifs :</p>
            <div className="flex flex-wrap gap-2">
              {filters.activities.map(actId => {
                const a = ACTIVITIES.find(x => x.id === actId);
                return a && (
                  <motion.span key={a.id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium"
                  >
                    <span>{a.emoji}</span>{a.label}
                    <button onClick={() => handleActivityToggle(a.id)} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                      <X className="size-3" />
                    </button>
                  </motion.span>
                );
              })}
              {filters.transport.map(tId => {
                const t = TRANSPORT_OPTIONS.find(x => x.id === tId);
                return t && (
                  <motion.span key={t.id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium"
                  >
                    {t.label}
                    <button onClick={() => handleTransportToggle(t.id)} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                      <X className="size-3" />
                    </button>
                  </motion.span>
                );
              })}
              {filters.eventType.map(eId => {
                const e = EVENT_OPTIONS.find(x => x.id === eId);
                return e && (
                  <motion.span key={e.id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-sm font-medium"
                  >
                    <span>{e.emoji}</span>{e.label}
                    <button onClick={() => handleEventToggle(e.id)} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                      <X className="size-3" />
                    </button>
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

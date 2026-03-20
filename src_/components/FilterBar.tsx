// components/FilterBar.tsx
import { useState } from 'react';
import { Filter, X, Check } from 'lucide-react';
import { Filters } from '../types';

interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<Filters>({
    activities: [],
    minAge: null,
    difficulty: [],
    location: '',
    maxDistance: null
  });

  const activities = [
    'Accrobranche',
    'Paintball',
    'Escape Game',
    'Tir à l\'arc',
    'Parcours filet',
    'Archery Tag',
    'Tyrolienne',
    'Orientation'
  ];

  const difficulties = ['Débutant', 'Intermédiaire', 'Avancé'];

  const handleActivityToggle = (activity: string) => {
    const newActivities = filters.activities.includes(activity)
      ? filters.activities.filter(a => a !== activity)
      : [...filters.activities, activity];
    
    const newFilters = { ...filters, activities: newActivities };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDifficultyToggle = (difficulty: string) => {
    const newDifficulties = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter(d => d !== difficulty)
      : [...filters.difficulty, difficulty];
    
    const newFilters = { ...filters, difficulty: newDifficulties };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAgeChange = (age: number | null) => {
    const newFilters = { ...filters, minAge: age };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const emptyFilters: Filters = {
      activities: [],
      minAge: null,
      difficulty: [],
      location: '',
      maxDistance: null
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = 
    filters.activities.length + 
    filters.difficulty.length + 
    (filters.minAge ? 1 : 0);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header avec gradient subtil */}
        <div className="bg-gradient-to-r from-green-50 via-green-100 to-green-50 px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-sm border border-green-100">
                <Filter className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Filtres de recherche</h3>
                <p className="text-sm text-gray-600 mt-0.5">Affinez vos résultats (filtrage en ET)</p>
              </div>
              {activeFilterCount > 0 && (
                <div className="flex items-center justify-center min-w-[2rem] h-7 px-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs font-bold shadow-md">
                  {activeFilterCount}
                </div>
              )}
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Contenu des filtres */}
        <div className="p-6 space-y-6">
          {/* Section Activités */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-900">
                Activités (ET logique)
              </label>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {activities.length} disponibles
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {activities.map((activity) => {
                const isSelected = filters.activities.includes(activity);
                return (
                  <button
                    key={activity}
                    onClick={() => handleActivityToggle(activity)}
                    className={`
                      inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200 border-2
                      ${isSelected
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700'
                      }
                    `}
                  >
                    <span>{activity}</span>
                    {isSelected && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                );
              })}
            </div>
            {filters.activities.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                ⓘ Seuls les parcs ayant <strong>toutes</strong> les activités sélectionnées seront affichés
              </p>
            )}
          </div>

          {/* Section Âge minimum */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-900">
                Âge minimum
              </label>
              {filters.minAge && (
                <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full border border-orange-200">
                  {filters.minAge}+ ans
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {[3, 6, 8, 10, 12].map((age) => {
                const isSelected = filters.minAge === age;
                return (
                  <button
                    key={age}
                    onClick={() => handleAgeChange(isSelected ? null : age)}
                    className={`
                      relative inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200 border-2 min-w-[4rem]
                      ${isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700'
                      }
                    `}
                  >
                    {age}+ ans
                    {age === 6 && !isSelected && (
                      <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-[10px] font-bold rounded-full shadow-md border-2 border-white">
                        ★
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Niveau de difficulté */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-900">
                Niveau de difficulté (ET logique)
              </label>
              {filters.difficulty.length > 0 && (
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {filters.difficulty.length} sélectionné{filters.difficulty.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {difficulties.map((difficulty) => {
                const isSelected = filters.difficulty.includes(difficulty);
                return (
                  <button
                    key={difficulty}
                    onClick={() => handleDifficultyToggle(difficulty)}
                    className={`
                      inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200 border-2
                      ${isSelected
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-500 shadow-md hover:shadow-lg hover:from-purple-600 hover:to-purple-700 transform hover:scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700'
                      }
                    `}
                  >
                    <span>{difficulty}</span>
                    {isSelected && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                );
              })}
            </div>
            {filters.difficulty.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                ⓘ Seuls les parcs ayant <strong>tous</strong> les niveaux sélectionnés seront affichés
              </p>
            )}
          </div>
        </div>

        {/* Résumé des filtres actifs */}
        {activeFilterCount > 0 && (
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0 mt-0.5">
                <Filter className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-2.5">
                  Filtres actifs (logique ET)
                </p>
                <div className="flex flex-wrap gap-2">
                  {filters.activities.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {filters.activities.length} activité{filters.activities.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {filters.difficulty.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium border border-purple-200">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      {filters.difficulty.length} niveau{filters.difficulty.length > 1 ? 'x' : ''}
                    </span>
                  )}
                  {filters.minAge && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium border border-orange-200">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      {filters.minAge}+ ans
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  🔍 Affichage des parcs qui satisfont <strong>tous</strong> les critères sélectionnés
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
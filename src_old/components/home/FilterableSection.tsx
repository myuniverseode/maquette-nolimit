// components/home/FilterableSection.tsx
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FilterButtons } from './FilterButtons';
import { activities } from '../../data/activities';
import { parks } from '../../data/parks';
import { ActivityCard } from '../ActivityCard';
import { ParkCard } from '../ParkCard';

interface FilterableSectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  type: 'activities' | 'parks';
  maxItems?: number;
  centeredFilters?: boolean;
  compactView?: boolean;
  filters?: Array<{ id: string; label: string }>;
}

export function FilterableSection({
  title,
  subtitle,
  icon,
  type,
  maxItems = 6,
  centeredFilters = false,
  compactView = false,
  filters: customFilters
}: FilterableSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const defaultFilters = {
    activities: [
      { id: 'all', label: 'Toutes' },
      { id: 'accrobranche', label: 'Accrobranche' },
      { id: 'team', label: 'Team Building' },
      { id: 'family', label: 'Famille' },
      { id: 'extreme', label: 'Sensations fortes' },
      { id: 'indoor', label: 'Intérieur' }
    ],
    parks: [
      { id: 'all', label: 'Tous' },
      { id: 'nord', label: 'Nord' },
      { id: 'sud', label: 'Sud' },
      { id: 'est', label: 'Est' },
      { id: 'ouest', label: 'Ouest' },
      { id: 'centre', label: 'Centre' }
    ]
  };

  const filters = customFilters || defaultFilters[type];
  const items = type === 'activities' ? activities : parks;

  // Fonction de filtrage
  const filteredItems = items.filter(item => {
    if (selectedFilter === 'all') return true;
    
    if (type === 'activities') {
      const activity = item as any;
      switch (selectedFilter) {
        case 'accrobranche':
          return activity.name.toLowerCase().includes('accrobranche');
        case 'team':
          return ['Escape Game', 'Paintball', 'Laser Game'].includes(activity.name);
        case 'family':
          return activity.availableFor?.includes('kids') || activity.minAge < 12;
        case 'extreme':
          return ['Paintball', 'Tyrolienne', 'Parcours extrême'].some(name => 
            activity.name.includes(name)
          );
        case 'indoor':
          return activity.name.includes('Escape Game') || activity.name.includes('Laser Game');
        default:
          return true;
      }
    }
    
    return true;
  });

  return (
    <section className={`py-12 ${type === 'activities' ? 'bg-transparent' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {/* En-tête conditionnel */}
        {(title || subtitle) && (
          <div className={`mb-10 ${centeredFilters ? 'text-center' : ''}`}>
            {icon && (
              <div className={`inline-flex items-center gap-3 mb-4 ${centeredFilters ? 'justify-center' : ''}`}>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  {icon}
                </div>
                {title && <h2 className="text-green-800 text-2xl font-bold">{title}</h2>}
              </div>
            )}
            {!icon && title && (
              <h2 className={`text-green-800 text-2xl font-bold mb-4 ${centeredFilters ? 'text-center' : ''}`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`text-gray-600 ${centeredFilters ? 'mx-auto text-center max-w-2xl' : ''}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Filtres CENTRÉS */}
        <div className={`${centeredFilters ? 'flex justify-center mb-10' : 'mb-8'}`}>
          <FilterButtons
            filters={filters}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            color="green"
            centered={centeredFilters}
            compact={compactView}
          />
        </div>

        {/* Items filtrés */}
        <div className={`grid ${
          compactView 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        }`}>
          {filteredItems.slice(0, maxItems).map((item) => (
            type === 'activities' ? (
              <ActivityCard key={item.id} activity={item} compact={compactView} />
            ) : (
              <ParkCard key={item.id} park={item} compact={compactView} />
            )
          ))}
        </div>

        {/* Bouton "Voir tout" */}
        {maxItems < items.length && (
          <div className="text-center mt-12">
            <Link
              to={type === 'activities' ? '/activities' : '/parks'}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition-all hover:scale-105 hover:shadow-lg"
            >
              Voir tous les {type === 'activities' ? 'activités' : 'parcs'}
              <ArrowRight className="size-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
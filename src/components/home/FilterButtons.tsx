// components/home/FilterButtons.tsx
interface Filter {
  id: string;
  label: string;
}

interface FilterButtonsProps {
  filters: Filter[];
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
  color?: 'green' | 'blue' | 'orange';
  centered?: boolean;
  compact?: boolean;
}

export function FilterButtons({
  filters,
  selectedFilter,
  onFilterChange,
  color = 'green',
  centered = false,
  compact = false
}: FilterButtonsProps) {
  const colorClasses = {
    green: {
      selected: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg',
      default: 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
    },
    blue: {
      selected: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg',
      default: 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
    },
    orange: {
      selected: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg',
      default: 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
    }
  };

  // Calcul des classes de taille et d'espacement en fonction du mode compact
  const sizeClasses = compact 
    ? 'px-3 py-1.5 text-sm rounded-full' 
    : 'px-5 py-2.5 rounded-full';

  return (
    <div className={`flex flex-wrap gap-2 ${centered ? 'justify-center' : ''}`}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`${sizeClasses} transition-all hover:scale-105 ${
            selectedFilter === filter.id
              ? `${colorClasses[color].selected} shadow-md`
              : `${colorClasses[color].default} border border-gray-200`
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
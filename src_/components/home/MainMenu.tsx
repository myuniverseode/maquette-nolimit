// components/home/MainMenu.tsx
import { Link } from 'react-router-dom';
import { MapPin, Search, Calendar, Users, Gift, Newspaper, BookOpen } from 'lucide-react';

interface MenuItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  color: 'green' | 'orange' | 'blue' | 'purple';
  variant?: 'primary' | 'secondary';
}

export function MainMenu() {
  const menuItems: MenuItem[] = [
    {
      to: "/parks",
      icon: <MapPin className="size-4" />,
      label: "Trouver un parc",
      color: "green",
      variant: "secondary"
    },
    {
      to: "/activities",
      icon: <Search className="size-4" />,
      label: "Explorer les activités",
      color: "green",
      variant: "secondary"
    },
    {
      to: "/booking",
      icon: <Calendar className="size-4" />,
      label: "Réserver",
      color: "orange",
      variant: "primary"
    },
    {
      to: "/groups",
      icon: <Users className="size-4" />,
      label: "Groupes & Événements",
      color: "green",
      variant: "primary"
    },
    {
      to: "/special-offers",
      icon: <Gift className="size-4" />,
      label: "Offres spéciales",
      color: "orange",
      variant: "secondary"
    },
    {
      to: "/news",
      icon: <Newspaper className="size-4" />,
      label: "Actualités",
      color: "blue",
      variant: "secondary"
    },
    {
      to: "/blog",
      icon: <BookOpen className="size-4" />,
      label: "Blog",
      color: "purple",
      variant: "secondary"
    }
  ];

  const colorClasses = {
    green: {
      primary: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      secondary: 'bg-white text-green-700 border border-green-200 hover:bg-green-50'
    },
    orange: {
      primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      secondary: 'bg-white text-orange-700 border border-orange-200 hover:bg-orange-50'
    },
    blue: {
      primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      secondary: 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
    },
    purple: {
      primary: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      secondary: 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {menuItems.map((item) => {
        const variant = item.variant || 'secondary';
        const colors = colorClasses[item.color][variant];
        
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`px-5 py-2.5 rounded-full transition-all hover:scale-105 inline-flex items-center gap-2 font-medium ${
              variant === 'primary' 
                ? `${colors} text-white shadow-lg hover:shadow-xl` 
                : `${colors} shadow-sm hover:shadow-md`
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
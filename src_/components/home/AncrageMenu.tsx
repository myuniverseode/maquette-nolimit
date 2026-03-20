// components/home/AncrageMenu.tsx
// Menu d'ancrage page accueil — items depuis WordPress (siteConfig.anchorMenu)
import { motion } from 'framer-motion';
import { Activity, MapPin, Users, Newspaper, Calendar, Star, Zap, Gift, HelpCircle, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSiteConfig } from '../../hooks/useSiteConfig';

const iconMap: Record<string, React.ReactNode> = {
  MapPin: <MapPin className="size-4" />,
  Activity: <Activity className="size-4" />,
  Users: <Users className="size-4" />,
  Newspaper: <Newspaper className="size-4" />,
  Calendar: <Calendar className="size-4" />,
  Star: <Star className="size-4" />,
  Zap: <Zap className="size-4" />,
  Gift: <Gift className="size-4" />,
  HelpCircle: <HelpCircle className="size-4" />,
  MessageCircle: <MessageCircle className="size-4" />,
};

// Fallback si pas de données WP
const defaultItems = [
  { id: 'parcs', label: 'Parcs', icon: 'MapPin', section: 'parcs' },
  { id: 'activites', label: 'Activités', icon: 'Activity', section: 'activites' },
  { id: 'pour-qui', label: 'Pour Qui', icon: 'Users', section: 'pour-qui' },
  { id: 'actualites', label: 'Actualités', icon: 'Newspaper', section: 'actualites' },
  { id: 'reserver', label: 'Réserver', icon: 'Calendar', section: 'reserver' },
];

export function AncrageMenu() {
  const { config } = useSiteConfig();
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  // Utiliser les items WP ou fallback
  const menuItems = (config.anchorMenu && config.anchorMenu.length > 0)
    ? config.anchorMenu.map((item: any) => ({
        id: item.id || item.section,
        label: item.label,
        icon: item.icon || 'Star',
        section: item.section || item.id,
      }))
    : defaultItems;

  const scrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 140;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
      const scrollPosition = window.scrollY + 200;
      for (let i = menuItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(menuItems[i].section);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(menuItems[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuItems]);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b shadow-sm"
      style={{ borderColor: '#35760020' }}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {menuItems.map((item: any) => {
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.section)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: isActive ? '#357600' : 'transparent',
                  color: isActive ? 'white' : '#374151',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex-shrink-0">
                  {iconMap[item.icon] || <Star className="size-4" />}
                </span>
                <span className="text-sm font-semibold">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: '#eb700f', opacity: 0.1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
}

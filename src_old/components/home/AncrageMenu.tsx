// components/home/AncrageMenu.tsx
/* MENU ANCRAGE - UNIQUEMENT PAGE ACCUEIL - Ne pas répliquer sur autres pages */

import { motion } from 'framer-motion';
import { Activity, MapPin, Users, Newspaper, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  targetId: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'parcs',
    label: 'Parcs',
    icon: <MapPin className="size-4" />,
    targetId: 'parcs'
  },
  {
    id: 'activites',
    label: 'Activités',
    icon: <Activity className="size-4" />,
    targetId: 'activites'
  },
  {
    id: 'pour-qui',
    label: 'Pour Qui',
    icon: <Users className="size-4" />,
    targetId: 'pour-qui'
  },
  {
    id: 'actualites',
    label: 'Actualités',
    icon: <Newspaper className="size-4" />,
    targetId: 'actualites'
  },
  {
    id: 'reserver',
    label: 'Réserver',
    icon: <Calendar className="size-4" />,
    targetId: 'reserver'
  }
];

export function AncrageMenu() {
  const [activeSection, setActiveSection] = useState<string>('activites');
  const [isVisible, setIsVisible] = useState(false);

  // Smooth scroll vers une section
  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 140; // Hauteur du header + menu ancrage
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Détecter la section active pendant le scroll
  useEffect(() => {
    const handleScroll = () => {
      // Afficher le menu après avoir scrollé 200px
      setIsVisible(window.scrollY > 200);

      // Détecter quelle section est visible
      const sections = menuItems.map(item => document.getElementById(item.targetId));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(menuItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b shadow-sm"
      style={{ borderColor: '#35760020' }}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.targetId)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: isActive ? '#357600' : 'transparent',
                  color: isActive ? 'white' : '#374151'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex-shrink-0">
                  {item.icon}
                </span>
                <span className="text-sm font-semibold">
                  {item.label}
                </span>

                {/* Indicateur actif */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      backgroundColor: '#eb700f',
                      opacity: 0.1
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30
                    }}
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

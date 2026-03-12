// components/park/ParkAnchorMenu.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Gift, Info, MessageCircle, Calendar } from 'lucide-react';

const GREEN  = '#357600';
const ORANGE = '#eb700f';

interface AnchorItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const anchorItems: AnchorItem[] = [
  { id: 'accueil',   label: 'Accueil',        icon: <Star className="size-4" /> },
  { id: 'activites', label: 'Activités',       icon: <Zap className="size-4" /> },
  { id: 'tarifs',    label: 'Tarifs',          icon: <Gift className="size-4" /> },
  { id: 'infos',     label: 'Infos pratiques', icon: <Info className="size-4" /> },
  { id: 'contact',   label: 'Contact',         icon: <MessageCircle className="size-4" /> },
  { id: 'reserver',  label: 'Réserver',        icon: <Calendar className="size-4" /> },
];

export function ParkAnchorMenu() {
  const [activeSection, setActiveSection] = useState<string>('accueil');
  const [isVisible, setIsVisible]         = useState(false);

  const scrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 140;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
      const scrollPos = window.scrollY + 200;
      for (let i = anchorItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(anchorItems[i].id);
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(anchorItems[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b shadow-sm"
      style={{ borderColor: `${GREEN}20` }}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {anchorItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: isActive ? GREEN : 'transparent',
                  color: isActive ? 'white' : '#374151',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="text-sm font-semibold">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="park-anchor-active"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: ORANGE, opacity: 0.1 }}
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

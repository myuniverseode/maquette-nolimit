// parks/ParkAnchorMenu.tsx — Menu d'ancrage parc, items depuis WordPress
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, Zap, Gift, Info, MessageCircle, Calendar,
  Shield, Clock, HelpCircle, Newspaper, FileText,
} from 'lucide-react';
import { useParkConfig } from '../hooks/useSiteConfig';

const GREEN = '#357600';
const ORANGE = '#eb700f';

const iconMap: Record<string, any> = {
  Star, Zap, Gift, Info, MessageCircle, Calendar,
  Shield, Clock, HelpCircle, Newspaper, FileText,
};

// Fallback items si pas de config WP pour ce parc
const defaultAnchorItems = [
  { id: 'accueil', label: 'Accueil', icon: 'Star', section: 'accueil' },
  { id: 'activites', label: 'Activités', icon: 'Zap', section: 'activites' },
  { id: 'infos', label: 'Infos pratiques', icon: 'Info', section: 'infos' },
  { id: 'tarifs', label: 'Tarifs', icon: 'Gift', section: 'tarifs' },
  { id: 'faq', label: 'FAQ', icon: 'HelpCircle', section: 'faq' },
  { id: 'actualites', label: 'Actualités', icon: 'Newspaper', section: 'actualites' },
  { id: 'contact', label: 'Contact', icon: 'MessageCircle', section: 'contact' },
];

export function ParkAnchorMenu() {
  const { parkId } = useParams<{ parkId: string }>();
  const { config: parkConfig } = useParkConfig(parkId);

  const [activeSection, setActiveSection] = useState<string>('accueil');
  const [isVisible, setIsVisible] = useState(false);

  // Items depuis WP ou fallback
  const anchorItems = (parkConfig?.anchorMenu && parkConfig.anchorMenu.length > 0)
    ? parkConfig.anchorMenu
    : defaultAnchorItems;

  const scrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
      const scrollPos = window.scrollY + 200;
      for (let i = anchorItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(anchorItems[i].section || anchorItems[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(anchorItems[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [anchorItems]);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b shadow-sm"
      style={{ borderColor: `${GREEN}20` }}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
          {anchorItems.map((item: any) => {
            const isActive = activeSection === item.id;
            const Icon = iconMap[item.icon] || Star;
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.section || item.id)}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: isActive ? GREEN : 'transparent',
                  color: isActive ? 'white' : '#374151',
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="flex-shrink-0" style={{ color: isActive ? 'white' : item.id === 'reserver' ? ORANGE : undefined }}>
                  <Icon className="size-4" />
                </span>
                <span className="text-xs font-semibold">{item.label}</span>
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

// components/home/AncrageMenu.tsx
// Menu d'ancrage page accueil — items depuis WordPress (siteConfig.anchorMenu)
import { motion } from 'framer-motion';
import { Activity, MapPin, Users, Newspaper, Calendar, Star, Zap, Gift, HelpCircle, MessageCircle } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSiteConfig } from '../../hooks/useSiteConfig';

const GREEN = '#357600';
const ORANGE = '#eb700f';

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

// Fallback si pas de données WP — IDs doivent matcher les id="" des sections HTML
const defaultItems = [
  { id: 'parcs', label: 'Parcs', icon: 'MapPin', section: 'parcs' },
  { id: 'activites', label: 'Activités', icon: 'Activity', section: 'activites' },
  { id: 'pour-qui', label: 'Pour Qui', icon: 'Users', section: 'pour-qui' },
  { id: 'actualites', label: 'Actualités', icon: 'Newspaper', section: 'actualites' },
  { id: 'reserver', label: 'Réserver', icon: 'Calendar', section: 'reserver' },
];

// Hauteur du header fixe + marge
const HEADER_HEIGHT = 80;
const MENU_HEIGHT = 56;
const SCROLL_OFFSET = HEADER_HEIGHT + MENU_HEIGHT + 20;

export function AncrageMenu() {
  const { config } = useSiteConfig();
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [validItems, setValidItems] = useState<typeof defaultItems>([]);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Utiliser les items WP ou fallback
  const menuItems = (config.anchorMenu && config.anchorMenu.length > 0)
    ? config.anchorMenu.map((item: any) => ({
        id: item.id || item.section,
        label: item.label,
        icon: item.icon || 'Star',
        section: item.section || item.id,
      }))
    : defaultItems;

  // Filtrer les items pour ne garder que ceux dont la section existe dans le DOM
  useEffect(() => {
    const checkSections = () => {
      const existing = menuItems.filter((item) => {
        const el = document.getElementById(item.section);
        return el !== null;
      });
      setValidItems(existing);
    };
    
    // Vérifier après un court délai pour laisser le DOM se charger
    const timer = setTimeout(checkSections, 100);
    
    // Re-vérifier si le DOM change (lazy loading, etc.)
    const observer = new MutationObserver(checkSections);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [menuItems]);

  const scrollToSection = useCallback((targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) {
      console.warn(`Section "${targetId}" non trouvée dans le DOM`);
      return;
    }
    
    // Marquer qu'on est en train de scroller (pour éviter les conflits avec handleScroll)
    isScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    
    // Mettre à jour immédiatement la section active
    const item = validItems.find(i => i.section === targetId);
    if (item) setActiveSection(item.id);
    
    // Calculer la position avec l'offset correct
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - SCROLL_OFFSET;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Réactiver la détection après la fin du scroll
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  }, [validItems]);

  useEffect(() => {
    const handleScroll = () => {
      // Afficher le menu après avoir scrollé au-delà du hero
      setIsVisible(window.scrollY > 300);
      
      // Ne pas mettre à jour la section active si on est en train de scroller programmatiquement
      if (isScrollingRef.current) return;
      if (validItems.length === 0) return;
      
      const scrollPosition = window.scrollY + SCROLL_OFFSET + 50;
      
      // Trouver la section actuellement visible
      let currentSection = validItems[0]?.id || '';
      
      for (let i = validItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(validItems[i].section);
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          
          if (sectionTop <= scrollPosition) {
            currentSection = validItems[i].id;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Appel initial
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [validItems]);

  // Ne pas afficher si aucun item valide
  if (validItems.length === 0) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b shadow-sm"
      style={{ borderColor: `${GREEN}20` }}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {validItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.section)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: isActive ? GREEN : 'transparent',
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
                    layoutId="home-anchor-active"
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{ backgroundColor: ORANGE, opacity: 0.15 }}
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

// parks/ParkAnchorMenu.tsx — Menu d'ancrage parc, items depuis WordPress
import { useState, useEffect, useCallback, useRef } from 'react';
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
// Les IDs doivent correspondre aux id="" des sections HTML dans ParkOnePage
const defaultAnchorItems = [
  { id: 'accueil', label: 'Accueil', icon: 'Star', section: 'accueil' },
  { id: 'activites', label: 'Activités', icon: 'Zap', section: 'activites' },
  { id: 'tarifs', label: 'Tarifs', icon: 'Gift', section: 'tarifs' },
  { id: 'faq', label: 'FAQ', icon: 'HelpCircle', section: 'faq' },
  { id: 'actualites', label: 'Actualités', icon: 'Newspaper', section: 'actualites' },
  { id: 'contact', label: 'Contact', icon: 'MessageCircle', section: 'contact' },
];

// Hauteur du header fixe + marge
const HEADER_HEIGHT = 80;
const MENU_HEIGHT = 52;
const SCROLL_OFFSET = HEADER_HEIGHT + MENU_HEIGHT + 16;

export function ParkAnchorMenu() {
  const { parkId } = useParams<{ parkId: string }>();
  const { config: parkConfig } = useParkConfig(parkId);

  const [activeSection, setActiveSection] = useState<string>('accueil');
  const [isVisible, setIsVisible] = useState(false);
  const [validItems, setValidItems] = useState<typeof defaultAnchorItems>([]);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Items depuis WP ou fallback
  const anchorItems = (parkConfig?.anchorMenu && parkConfig.anchorMenu.length > 0)
    ? parkConfig.anchorMenu.map((item: any) => ({
        id: item.id || item.section,
        label: item.label,
        icon: item.icon || 'Star',
        section: item.section || item.id,
      }))
    : defaultAnchorItems;

  // Filtrer les items pour ne garder que ceux dont la section existe dans le DOM
  useEffect(() => {
    const checkSections = () => {
      const existing = anchorItems.filter((item) => {
        const el = document.getElementById(item.section);
        return el !== null;
      });
      setValidItems(existing);
      
      // Définir la première section valide comme active par défaut
      if (existing.length > 0 && !activeSection) {
        setActiveSection(existing[0].id);
      }
    };
    
    // Vérifier après un court délai pour laisser le DOM se charger
    const timer = setTimeout(checkSections, 150);
    
    // Re-vérifier si le DOM change (lazy loading, etc.)
    const observer = new MutationObserver(checkSections);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [anchorItems, parkId]);

  const scrollToSection = useCallback((targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) {
      console.warn(`Section "${targetId}" non trouvée dans le DOM`);
      return;
    }
    
    // Marquer qu'on est en train de scroller
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
      setIsVisible(window.scrollY > 400);
      
      // Ne pas mettre à jour si on est en train de scroller programmatiquement
      if (isScrollingRef.current) return;
      if (validItems.length === 0) return;
      
      const scrollPosition = window.scrollY + SCROLL_OFFSET + 50;
      
      // Trouver la section actuellement visible
      let currentSection = validItems[0]?.id || 'accueil';
      
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
        <nav className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
          {validItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = iconMap[item.icon] || Star;
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.section)}
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

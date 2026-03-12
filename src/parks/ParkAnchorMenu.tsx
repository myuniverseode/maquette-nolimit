// components/park/ParkAnchorMenu.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Zap, Gift, Info, MessageCircle, Calendar, 
  Shield, Clock, HelpCircle, Newspaper, FileText 
} from 'lucide-react';

const GREEN  = '#357600';
const ORANGE = '#eb700f';

interface AnchorItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  section: string; // nom de la section dans la page
}

const anchorItems: AnchorItem[] = [
  { id: 'accueil',   label: 'Accueil',        icon: <Star className="size-4" />, section: 'accueil' },
  { id: 'activites', label: 'Activités',      icon: <Zap className="size-4" />, section: 'activites' },
  { id: 'infos',     label: 'Infos pratiques', icon: <Info className="size-4" />, section: 'infos' },
  { id: 'equipements', label: 'Équipements',  icon: <Shield className="size-4" />, section: 'equipements' },
  { id: 'tarifs',    label: 'Tarifs',         icon: <Gift className="size-4" />, section: 'tarifs' },
  { id: 'bonsavoir', label: 'Bon à savoir',   icon: <Clock className="size-4" />, section: 'bonsavoir' },
  { id: 'faq',       label: 'FAQ',            icon: <HelpCircle className="size-4" />, section: 'faq' },
  { id: 'actualites', label: 'Actualités',    icon: <Newspaper className="size-4" />, section: 'actualites' },
  { id: 'blog',      label: 'Blog',           icon: <FileText className="size-4" />, section: 'blog' },
  { id: 'contact',   label: 'Contact',        icon: <MessageCircle className="size-4" />, section: 'contact' },
  { id: 'reserver',  label: 'Réserver',       icon: <Calendar className="size-4" />, section: 'reserver' },
];

export function ParkAnchorMenu() {
  const [activeSection, setActiveSection] = useState<string>('accueil');
  const [isVisible, setIsVisible]         = useState(false);

  const scrollToSection = (targetId: string) => {
    // Mapping entre l'id du menu et les sections réelles de la page
    const sectionMap: Record<string, string> = {
      'accueil': 'accueil',
      'activites': 'activites',
      'infos': 'infos',
      'equipements': 'equipements',
      'tarifs': 'tarifs',
      'bonsavoir': 'bonsavoir',
      'faq': 'faq',
      'actualites': 'actualites',
      'blog': 'blog',
      'contact': 'contact',
      'reserver': 'reserver',
    };

    const targetSection = sectionMap[targetId] || targetId;
    const el = document.getElementById(targetSection);
    
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      // Fallback pour les sections qui n'ont pas d'ID explicite
      const sections = {
        'equipements': 'Équipements & services',
        'bonsavoir': 'Bon à savoir',
        'actualites': 'Actualités',
        'blog': 'Blog',
      };
      
      // Chercher par titre de section
      const allHeadings = document.querySelectorAll('h2, h3');
      for (const heading of allHeadings) {
        if (heading.textContent?.includes(sections[targetId as keyof typeof sections])) {
          const top = heading.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top, behavior: 'smooth' });
          break;
        }
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
      
      // Déterminer la section active
      const scrollPos = window.scrollY + 200;
      
      // Liste des sections à surveiller avec leurs offsets
      const sections = [
        { id: 'accueil', element: document.getElementById('accueil') },
        { id: 'activites', element: document.getElementById('activites') },
        { id: 'infos', element: document.getElementById('infos') },
        { id: 'equipements', element: document.querySelector('section:has([class*="Équipements"])') },
        { id: 'tarifs', element: document.getElementById('tarifs') },
        { id: 'bonsavoir', element: document.querySelector('section:has([class*="Bon à savoir"])') },
        { id: 'faq', element: document.querySelector('section:has([class*="FAQ"])') },
        { id: 'actualites', element: document.querySelector('section:has([class*="Actualités"])') },
        { id: 'blog', element: document.querySelector('section:has([class*="Blog"])') },
        { id: 'contact', element: document.getElementById('contact') },
      ];

      // Trouver la dernière section visible
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPos) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
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
        <nav className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
          {anchorItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: isActive ? GREEN : 'transparent',
                  color: isActive ? 'white' : '#374151',
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="flex-shrink-0" style={{ color: isActive ? 'white' : item.id === 'reserver' ? ORANGE : undefined }}>
                  {item.icon}
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
// components/park/ParkSidebar.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar, Phone, Mail, ArrowRight,
  PartyPopper, PanelRightClose, PanelRightOpen,
  Star,
} from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { ParkStatusBadge } from './ParkStatusBadge';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTiktok, 
  FaLinkedinIn, 
  FaYoutube,
  FaGoogle,
  FaTripadvisor
} from 'react-icons/fa';


const GREEN  = '#357600';
const ORANGE = '#eb700f';

// Réseaux sociaux - 1 ligne avec icônes officielles
const DEFAULT_SIDEBAR_SOCIAL = [
  { icon: FaFacebookF, label: 'Facebook', handle: '@nolimitparc', color: '#1877F2' },
  { icon: FaInstagram, label: 'Instagram', handle: '@nolimitparc', color: '#E4405F' },
  { icon: FaTiktok, label: 'TikTok', handle: '@nolimitparc', color: '#000000' },
  { icon: FaLinkedinIn, label: 'LinkedIn', handle: 'NoLimit', color: '#0A66C2' },
  { icon: FaYoutube, label: 'YouTube', handle: 'NoLimit', color: '#FF0000' },
];

// Sites d'avis - 1 ligne avec icônes officielles
const reviewLinks = [
  { icon: FaGoogle, label: 'Google', handle: '4.5 ★', color: '#4285F4' },
  { icon: FaTripadvisor, label: 'Tripadvisor', handle: '4.5 ★', color: '#00AF87' },
];

export function ParkSidebar({ park }: { park: any }) {
  const { config } = useSiteConfig();
  const socialLinks = DEFAULT_SIDEBAR_SOCIAL;
  const [collapsed, setCollapsed]   = useState(false);
  const [topOffset, setTopOffset]   = useState(96);
  const [maxHeight, setMaxHeight]   = useState('calc(100vh - 6rem)');
  const sidebarRef                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const anchorMenuBottom = 80 + 48;
      setTopOffset(anchorMenuBottom + 8);

      const footer = document.querySelector('footer') as HTMLElement | null;
      if (footer) {
        const footerTop    = footer.getBoundingClientRect().top + window.scrollY;
        const sidebarTop   = anchorMenuBottom + 8;
        const available    = footerTop - sidebarTop - 24;
        setMaxHeight(`${Math.max(300, available)}px`);
      }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Variantes d'animation optimisées
  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      width: '20rem',
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    },
    collapsed: {
      opacity: 0,
      x: 40,
      width: 0,
      transition: {
        type: 'spring',
        damping: 35,
        stiffness: 350,
        when: "afterChildren",
        staggerChildren: 0.02,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', damping: 25, stiffness: 200 }
    },
    collapsed: {
      opacity: 0,
      x: 20,
      transition: { type: 'spring', damping: 30, stiffness: 250 }
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="hidden xl:block fixed right-6 z-30"
      style={{
        top: topOffset,
        width: collapsed ? '3rem' : '20rem',
        transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        maxHeight: `calc(100vh - ${topOffset + 24}px)`,
      }}
    >
      {/* ── Bouton toggle — bien visible, orange quand ouvert / vert quand réduit ── */}
      <motion.button
        onClick={() => setCollapsed(c => !c)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        className="absolute -left-5 top-6 w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-xl"
        style={{
          background: collapsed
            ? `linear-gradient(135deg, ${GREEN}, #4a9d00)`
            : `linear-gradient(135deg, ${ORANGE}, #ff9a3c)`,
          boxShadow: collapsed
            ? `0 4px 20px ${GREEN}70`
            : `0 4px 20px ${ORANGE}70`,
        }}
        title={collapsed ? 'Afficher la sidebar' : 'Réduire'}
      >
        {collapsed
          ? <PanelRightOpen  className="size-5 text-white" />
          : <PanelRightClose className="size-5 text-white" />
        }
      </motion.button>

      {/* Contenu principal */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="sidebar-content"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="overflow-y-auto space-y-4 pr-1 pb-6"
            style={{ maxHeight, scrollbarWidth: 'thin' }}
          >
            {/* ── Fond décoratif vert derrière le premier bloc ── */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl overflow-hidden shadow-xl border border-white/20"
              style={{
                background: `linear-gradient(145deg, ${GREEN}18 0%, ${ORANGE}12 100%)`,
                borderColor: `${GREEN}30`,
              }}
            >
              <div className="h-1.5" style={{ background: `linear-gradient(to right, ${GREEN}, ${ORANGE})` }} />
              <div className="p-6">
                {/* Status badge */}
                <div className="flex justify-center mb-6">
                  <ParkStatusBadge parkId={park.id} size="lg" />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="mb-2">
                  <Link
                    to="booking"
                    state={{ parkId: park.id }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-white shadow-lg text-sm"
                    style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)`, boxShadow: `0 8px 28px ${ORANGE}40` }}
                  >
                    <Calendar className="size-4" /> Réserver maintenant
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/evenements"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm border-2 bg-white/60"
                    style={{ borderColor: GREEN, color: GREEN }}
                  >
                    <PartyPopper className="size-4" /> En faire un événement
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Séparateur */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 px-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Des questions ?</span>
              <div className="flex-1 h-px bg-gray-200" />
            </motion.div>

            {/* Bloc contact */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm"
            >
              <a
                href={`tel:${park.phone ?? '0123456789'}`}
                className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors group border-b border-gray-100"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${GREEN}15` }}>
                  <Phone className="size-4 group-hover:scale-110 transition-transform" style={{ color: GREEN }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Téléphone</div>
                  <div className="font-black text-gray-900 text-sm truncate">{park.phone ?? '01 23 45 67 89'}</div>
                </div>
                <ArrowRight className="size-3.5 text-gray-300 ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href={`mailto:${park.email ?? 'contact@nolimit.fr'}`}
                className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${ORANGE}15` }}>
                  <Mail className="size-4 group-hover:scale-110 transition-transform" style={{ color: ORANGE }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Email</div>
                  <div className="font-black text-gray-900 text-sm truncate">{park.email ?? 'contact@nolimit.fr'}</div>
                </div>
                <ArrowRight className="size-3.5 text-gray-300 ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </motion.div>

            {/* Réseaux sociaux */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm p-4"
            >
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">Suivez-nous</div>
              <div className="grid grid-cols-5 gap-1">
                {socialLinks.map(({ icon: Icon, label, handle, color }) => (
                  <motion.a
                    key={label}
                    href="#"
                    whileHover={{ y: -2 }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-50 transition-all group"
                    title={label}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center mb-1 transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}15` }}>
                      <Icon className="text-sm" style={{ color }} />
                    </div>
                    <span className="text-[8px] font-medium text-gray-500 text-center truncate w-full">{handle}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* ── Avis : label + icônes sur la même ligne ── */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm p-4"
            >
              {/* Label + icônes côte à côte */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider whitespace-nowrap">
                    Laissez-nous un avis
                  </span>
                </div>
                <div className="flex gap-2">
                  {reviewLinks.map(({ icon: Icon, label, handle, color }) => (
                    <motion.a
                      key={label}
                      href="#"
                      whileHover={{ y: -2, scale: 1.1 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all group border border-gray-100"
                      title={label}
                    >
                      <div className="w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}15` }}>
                        <Icon className="text-xs" style={{ color }} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600">{handle}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version réduite */}
      <AnimatePresence>
        {collapsed && (
          <motion.div
            key="sidebar-collapsed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="flex flex-col items-center gap-3 pt-12"
          >
            <Link
              to="booking"
              state={{ parkId: park.id }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              style={{ backgroundColor: ORANGE }}
              title="Réserver"
            >
              <Calendar className="size-4 text-white" />
            </Link>

            <a
              href={`tel:${park.phone ?? '0123456789'}`}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100 bg-white shadow-sm hover:scale-110 transition-transform"
              style={{ color: GREEN }}
              title="Appeler"
            >
              <Phone className="size-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Zap, PartyPopper, ChevronRight, Clock, Users, Info } from 'lucide-react';
import { useActivitiesData, type TarifGroupe } from '../../hooks/useActiviesData';
import { usePourQuiData } from '../../hooks/usePourQuiData';

const GREEN  = '#357600';
const ORANGE = '#eb700f';

const POUR_QUI_FALLBACK = [
  { id: 'famille',     emoji: '👨‍👩‍👧‍👦', title: 'Familles',      desc: 'Dès 3 ans, activités pour tous',       link: '/pour-qui/famille',     color: GREEN     },
  { id: 'ados',        emoji: '🎯',       title: 'Ados & Amis',   desc: 'Sensations et défi entre potes',       link: '/pour-qui/ados',        color: ORANGE    },
  { id: 'entreprise',  emoji: '💼',       title: 'Entreprises',   desc: 'Team-building & séminaires',           link: '/pour-qui/entreprise',  color: '#3b82f6' },
  { id: 'evg-evjf',   emoji: '🥂',       title: 'EVG / EVJF',    desc: 'Fête inoubliable avant le grand jour', link: '/pour-qui/evg-evjf',   color: '#8b5cf6' },
  { id: 'anniversaire',emoji: '🎂',       title: 'Anniversaires', desc: 'De 3 à 99 ans, on gère tout',         link: '/pour-qui/anniversaire',color: '#ec4899' },
];

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  });
  useEffect(() => {
    const h = () => setIsTouch(true);
    window.addEventListener('touchstart', h, { once: true, passive: true });
    return () => window.removeEventListener('touchstart', h);
  }, []);
  return isTouch;
}

export function ActivitiesSection() {
  const { activities, loading } = useActivitiesData();
  const { data: pourQuiData }   = usePourQuiData();
  const isTouch                 = useIsTouchDevice();
  const [expandedCard, setExpandedCard]     = useState<string | null>(null);
  const [evenementModal, setEvenementModal] = useState(false);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!expandedCard || !isTouch) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      let inside = false;
      cardRefs.current.forEach(ref => { if (ref?.contains(e.target as Node)) inside = true; });
      if (!inside) setExpandedCard(null);
    };
    const timer = setTimeout(() => {
      document.addEventListener('touchstart', handleOutside, { passive: true });
      document.addEventListener('mousedown', handleOutside);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [expandedCard, isTouch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setExpandedCard(null); setEvenementModal(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = evenementModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [evenementModal]);

  const displayedActivities = activities.slice(0, 6);
  const pourQuiCards = pourQuiData?.cards?.length
    ? pourQuiData.cards.map((c: any) => ({ id: c.link, emoji: c.iconName ? '🎯' : '👥', title: c.title, desc: c.description, link: c.link, color: c.color || GREEN }))
    : POUR_QUI_FALLBACK;

  const handleCardClick = (activityId: string, e: React.MouseEvent | React.TouchEvent) => {
    if (isTouch) {
      e.preventDefault();
      if (expandedCard === activityId) {
        const act = displayedActivities.find(a => a.id === activityId);
        window.location.href = `/activity/${act?.slug || activityId}`;
      } else {
        setExpandedCard(activityId);
      }
    }
  };

  return (
    <>
      <section id="activites" className="relative py-20 overflow-hidden" style={{ backgroundColor: '#111111' }}>
        {/* Background and decorative elements unchanged */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L100 0L100 1L0 1ZM0 0L0 100L1 100L1 0Z' fill='%23ffffff'/%3E%3C/svg%3E")`, backgroundSize: '50px 50px' }} />
        <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: GREEN, opacity: 0.12 }} animate={{ scale: [1,1.3,1], opacity: [0.12,0.22,0.12] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: ORANGE, opacity: 0.12 }} animate={{ scale: [1,1.4,1], opacity: [0.12,0.25,0.12] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200 }} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full mb-4 text-sm font-medium border border-white/20">
              <Zap className="size-4" style={{ color: ORANGE }} />Explorer nos activités
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Quelle activité{' '}
              <span className="relative inline-block" style={{ color: ORANGE }}>
                vous tente ?
                <motion.span className="absolute bottom-1 left-0 right-0 h-3 -z-10 blur-sm" style={{ backgroundColor: `${ORANGE}40` }} initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
              </span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              {isTouch ? "Appuyez une fois pour voir les infos, deux fois pour découvrir l'activité" : "Passez la souris sur une activité pour découvrir les infos"}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ borderColor: GREEN, borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto justify-items-center">
              {displayedActivities.map((activity, index) => {
                const isExpanded = expandedCard === activity.id;
                return (
                  <ActivityRond
                    key={activity.id}
                    activity={activity}
                    index={index}
                    isExpanded={isExpanded}
                    isTouch={isTouch}
                    onExpand={() => setExpandedCard(activity.id)}
                    onCollapse={() => setExpandedCard(null)}
                    onClick={(e) => handleCardClick(activity.id, e)}
                    onSatelliteClick={() => { const act = displayedActivities.find(a => a.id === activity.id); window.location.href = `/activity/${act?.slug || activity.id}`; }}
                    ref={(el) => { if (el) cardRefs.current.set(activity.id, el); else cardRefs.current.delete(activity.id); }}
                  />
                );
              })}
            </div>
          )}

          <motion.div className="text-center mt-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            <motion.button onClick={() => setEvenementModal(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white text-lg shadow-2xl transition-all relative overflow-hidden" style={{ backgroundColor: ORANGE, boxShadow: `0 8px 32px ${ORANGE}50` }}>
              <motion.div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} initial={{ x: '-100%' }} whileHover={{ x: '200%' }} transition={{ duration: 0.7 }} />
              <PartyPopper className="size-6 relative z-10" />
              <span className="relative z-10">Votre événement</span>
              <ArrowRight className="size-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <p className="text-white/40 text-sm mt-3">Anniversaire · EVG · EVJF · Team Building · Soirée privée</p>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {evenementModal && <EvenementModal cards={pourQuiCards} onClose={() => setEvenementModal(false)} />}
      </AnimatePresence>
    </>
  );
}

// ── Rond activité (modifié avec info et repositionnement) ─────────────────────

const ActivityRond = React.forwardRef<HTMLDivElement, {
  activity: any; index: number;
  isExpanded: boolean; isTouch: boolean;
  onExpand: () => void; onCollapse: () => void;
  onClick: (e: React.MouseEvent | React.TouchEvent) => void;
  onSatelliteClick: () => void;
}>(({ activity, index, isExpanded, isTouch, onExpand, onCollapse, onClick, onSatelliteClick }, ref) => {
  // Récupérer une description courte (si disponible)
  const description = activity.description || activity.excerpt || "Découvrez cette activité unique.";
  const shortDesc = description.length > 80 ? description.substring(0, 80) + '…' : description;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="relative"
      style={{ zIndex: isExpanded ? 50 : 1, width: '240px', height: '240px' }}
      onMouseEnter={() => !isTouch && onExpand()}
      onMouseLeave={() => !isTouch && onCollapse()}
      onClick={onClick}
    >
      {/* Rond principal */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 cursor-pointer"
        style={{ boxShadow: isExpanded ? `0 0 40px ${GREEN}40` : 'none' }}
        animate={isExpanded ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="absolute inset-0">
          <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" style={{ transform: isExpanded ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${GREEN}dd 0%, ${GREEN}bb 50%, ${GREEN}dd 100%)` }} />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 gap-2">
          <span className="text-4xl mb-1">{activity.emoji}</span>
          <h3 className="text-white font-black text-base leading-tight">{activity.name}</h3>
          {/* Âge et durée retirés du cercle principal */}
          {isTouch && (
            <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
              <ChevronRight className="size-3 text-white" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Bulles satellites */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Bulle principale (informations générales) */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-48 left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-2xl w-64 overflow-hidden cursor-pointer"
              style={{ border: `3px solid ${GREEN}`, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
              onClick={(e) => { e.stopPropagation(); onSatelliteClick(); }}
              onMouseEnter={() => !isTouch && onExpand()}
            >
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN}cc)` }}>
                <Info className="size-5 text-white" />
                <span className="text-white font-black text-sm">À propos</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-700">{shortDesc}</p>
                <div className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-xs font-bold" style={{ backgroundColor: GREEN }}>
                  Voir l'activité <ArrowRight className="size-3" />
                </div>
              </div>
            </motion.div>

            {/* Durée (gauche) – repositionnée un peu plus loin */}
            {activity.duration && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.8 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-24 bg-white rounded-2xl shadow-xl px-4 py-3 cursor-pointer"
                style={{ border: `3px solid ${ORANGE}`, minWidth: '100px' }}
                onClick={(e) => { e.stopPropagation(); onSatelliteClick(); }}
              >
                <div className="text-center">
                  <Clock className="size-5 mx-auto mb-1" style={{ color: ORANGE }} />
                  <div className="text-sm font-black" style={{ color: ORANGE }}>Durée</div>
                  <div className="text-xs text-gray-600 font-bold">{activity.duration}</div>
                </div>
              </motion.div>
            )}

            {/* Âge (droite) – repositionnée un peu plus loin */}
            {activity.minAge && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.8 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-24 bg-white rounded-2xl shadow-xl px-4 py-3 cursor-pointer"
                style={{ border: `3px solid ${GREEN}`, minWidth: '100px' }}
                onClick={(e) => { e.stopPropagation(); onSatelliteClick(); }}
              >
                <div className="text-center">
                  <Users className="size-5 mx-auto mb-1" style={{ color: GREEN }} />
                  <div className="text-sm font-black" style={{ color: GREEN }}>Âge min.</div>
                  <div className="text-xs text-gray-600 font-bold">{activity.minAge}+ ans</div>
                </div>
              </motion.div>
            )}

            {/* Badge mobile */}
            {isTouch && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg px-4 py-2 cursor-pointer whitespace-nowrap"
                style={{ border: `2px solid ${GREEN}` }}
                onClick={(e) => { e.stopPropagation(); onSatelliteClick(); }}
              >
                <div className="flex items-center gap-2 text-xs font-black" style={{ color: GREEN }}>
                  <span>👆</span><span>Appuyez pour voir l'activité</span>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
ActivityRond.displayName = 'ActivityRond';

// ── Modale événement (inchangée) ───────────────────────────────────────────────
function EvenementModal({ cards, onClose }: { cards: typeof POUR_QUI_FALLBACK; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 30 }} transition={{ type: 'spring', damping: 25, stiffness: 280 }} className="relative w-full max-w-lg rounded-3xl overflow-hidden" style={{ backgroundColor: '#161616', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${GREEN}, ${ORANGE})` }}>
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1"><PartyPopper className="size-5 text-white" /><span className="text-white/80 text-sm font-medium">Vous organisez un événement ?</span></div>
              <h3 className="text-white font-black text-2xl">C'est pour qui ?</h3>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"><X className="size-5" /></button>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {cards.map((card, i) => (
            <motion.div key={card.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07, duration: 0.3 }}>
              <Link to={card.link} onClick={onClose} className="group flex items-center gap-4 p-4 rounded-2xl border border-white/8 transition-all hover:border-white/20" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = `${card.color}15`; (e.currentTarget as HTMLElement).style.borderColor = `${card.color}50`; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: `${card.color}20` }}>{card.emoji}</div>
                <div className="flex-1 min-w-0"><div className="text-white font-black text-base">{card.title}</div><div className="text-white/50 text-sm truncate">{card.desc}</div></div>
                <ChevronRight className="size-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="px-5 pb-5">
          <Link to="/evenements" onClick={onClose} className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-white text-sm transition-all hover:gap-3" style={{ background: `linear-gradient(to right, ${GREEN}, ${ORANGE})` }}>
            Voir tous nos événements <ArrowRight className="size-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
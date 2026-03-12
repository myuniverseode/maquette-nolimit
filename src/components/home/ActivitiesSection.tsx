// components/home/ActivitiesSection.tsx
// Section activités pour HomePage :
// - Ronds interactifs avec tarifs au hover (desktop) / tap (mobile = modale centrée)
// - Bouton "Votre événement" qui ouvre une modale avec les 5 profils "Pour qui ?"
// - Structure prête pour brancher les tarifs depuis l'API WordPress

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Zap, PartyPopper, ChevronRight } from 'lucide-react';
import { useActivitiesData } from '../../hooks/useActiviesData';
import { usePourQuiData } from '../../hooks/usePourQuiData';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

// ─── Types tarifs ──────────────────────────────────────────

interface TarifLigne {
  label: string;
  prix: string;
}

interface TarifGroupe {
  titre: string;        // ex: "Tarifs internet Matin"
  lignes: TarifLigne[];
}

// ─── Fallback tarifs par slug ───────────────────────────────
// Structure prête pour être remplacée par les données API :
// activity.tarifs?: TarifGroupe[]

const TARIFS_FALLBACK: Record<string, TarifGroupe[]> = {
  accrobranche: [
    {
      titre: 'Tarifs internet — Matin',
      lignes: [
        { label: 'Pitchoun (- 1m20)',       prix: '10,00 €' },
        { label: 'Enfant (1m20 à 1m40)',    prix: '14,00 €' },
        { label: 'Ado (+1m40, - 18 ans)',   prix: '18,00 €' },
        { label: 'Adulte',                  prix: '22,00 €' },
      ],
    },
    {
      titre: 'Tarifs internet — Après-midi',
      lignes: [
        { label: 'Pitchoun (- 1m20)',       prix: '12,00 €' },
        { label: 'Enfant (1m20 à 1m40)',    prix: '16,00 €' },
        { label: 'Ado (+1m40, - 18 ans)',   prix: '20,00 €' },
        { label: 'Adulte',                  prix: '25,00 €' },
      ],
    },
  ],
  paintball: [
    {
      titre: 'Tarifs internet',
      lignes: [
        { label: 'Pack 100 billes',   prix: '15,00 €' },
        { label: 'Pack 200 billes',   prix: '25,00 €' },
        { label: 'Pack 300 billes',   prix: '32,00 €' },
        { label: 'Équipement inclus', prix: 'Offert'  },
      ],
    },
  ],
  'escape-game': [
    {
      titre: 'Tarifs internet',
      lignes: [
        { label: '2 personnes',  prix: '20,00 €/pers' },
        { label: '3-4 personnes',prix: '16,00 €/pers' },
        { label: '5-6 personnes',prix: '14,00 €/pers' },
      ],
    },
  ],
  'tir-arc': [
    {
      titre: 'Tarifs internet',
      lignes: [
        { label: 'Enfant (- 12 ans)', prix: '10,00 €' },
        { label: 'Ado / Adulte',      prix: '14,00 €' },
        { label: 'Initiation 30 min', prix: '8,00 €'  },
      ],
    },
  ],
  'parcours-filet': [
    {
      titre: 'Tarifs internet',
      lignes: [
        { label: 'Enfant (3-12 ans)', prix: '8,00 €'  },
        { label: 'Ado / Adulte',      prix: '12,00 €' },
      ],
    },
  ],
  'archery-tag': [
    {
      titre: 'Tarifs internet',
      lignes: [
        { label: 'Par personne (1h)',    prix: '16,00 €' },
        { label: 'Groupe (10 pers. min)',prix: '14,00 €/pers' },
      ],
    },
  ],
};

// ─── Données Pour qui (fallback) ───────────────────────────

const POUR_QUI_FALLBACK = [
  { id: 'famille',    emoji: '👨‍👩‍👧‍👦', title: 'Familles',       desc: 'Dès 3 ans, activités pour tous',  link: '/pour-qui/famille',    color: GREEN  },
  { id: 'ados',       emoji: '🎯',       title: 'Ados & Amis',    desc: 'Sensations et défi entre potes',  link: '/pour-qui/ados',       color: ORANGE },
  { id: 'entreprise', emoji: '💼',       title: 'Entreprises',    desc: 'Team-building & séminaires',      link: '/pour-qui/entreprise', color: '#3b82f6' },
  { id: 'evg-evjf',  emoji: '🥂',       title: 'EVG / EVJF',     desc: 'Fête inoubliable avant le grand jour', link: '/pour-qui/evg-evjf', color: '#8b5cf6' },
  { id: 'anniversaire',emoji: '🎂',     title: 'Anniversaires',  desc: 'De 3 à 99 ans, on gère tout',    link: '/pour-qui/anniversaire', color: '#ec4899' },
];

// ══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ══════════════════════════════════════════════════════════

export function ActivitiesSection() {
  const { activities, loading, error } = useActivitiesData();
  const { data: pourQuiData } = usePourQuiData();

  const [activeCard, setActiveCard]           = useState<string | null>(null);
  const [mobileModal, setMobileModal]         = useState<string | null>(null);
  const [evenementModal, setEvenementModal]   = useState(false);
  const [isMobile, setIsMobile]               = useState(false);

  // Détection mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Fermer modale sur Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileModal(null); setEvenementModal(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lock scroll quand une modale est ouverte
  useEffect(() => {
    document.body.style.overflow = (mobileModal || evenementModal) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileModal, evenementModal]);

  const displayedActivities = activities.slice(0, 6);

  // Données Pour qui depuis WordPress ou fallback
  const pourQuiCards = pourQuiData?.cards?.length
    ? pourQuiData.cards.map((c: any) => ({
        id: c.link,
        emoji: c.iconName ? '🎯' : '👥',
        title: c.title,
        desc: c.description,
        link: c.link,
        color: c.color || GREEN,
      }))
    : POUR_QUI_FALLBACK;

  return (
    <>
      <section
        id="activites"
        className="relative py-20 overflow-hidden"
        style={{ backgroundColor: DARK }}
      >
        {/* Grille de fond */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L100 0L100 1L0 1ZM0 0L0 100L1 100L1 0Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
            backgroundSize: '50px 50px',
          }}
        />
        {/* Glows */}
        <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: GREEN, opacity: 0.12 }}
          animate={{ scale: [1,1.3,1], opacity: [0.12,0.22,0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: ORANGE, opacity: 0.12 }}
          animate={{ scale: [1,1.4,1], opacity: [0.12,0.25,0.12] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container mx-auto px-4 relative z-10">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full mb-4 text-sm font-medium border border-white/20"
            >
              <Zap className="size-4" style={{ color: ORANGE }} />
              Explorer nos activités
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Quelle activité{' '}
              <span className="relative inline-block" style={{ color: ORANGE }}>
                vous tente ?
                <motion.span
                  className="absolute bottom-1 left-0 right-0 h-3 -z-10 blur-sm"
                  style={{ backgroundColor: `${ORANGE}40` }}
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              Passez la souris sur une activité pour découvrir les tarifs
            </p>
          </motion.div>

          {/* ── Grille des ronds ── */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 rounded-full animate-spin"
                style={{ borderColor: GREEN, borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto justify-items-center">
              {displayedActivities.map((activity, index) => {
                const tarifs = (activity as any).tarifs || TARIFS_FALLBACK[activity.slug] || TARIFS_FALLBACK[activity.id] || [];
                const isActive = activeCard === activity.id;

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    className="relative"
                    style={{ zIndex: isActive ? 20 : 1 }}
                  >
                    <ActivityRond
                      activity={activity}
                      tarifs={tarifs}
                      isMobile={isMobile}
                      isActive={isActive}
                      index={index}
                      onHoverEnter={() => !isMobile && setActiveCard(activity.id)}
                      onHoverLeave={() => !isMobile && setActiveCard(null)}
                      onTap={() => isMobile && setMobileModal(activity.id)}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── CTA Événement ── */}
          <motion.div
            className="text-center mt-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.button
              onClick={() => setEvenementModal(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white text-lg shadow-2xl transition-all relative overflow-hidden"
              style={{ backgroundColor: ORANGE, boxShadow: `0 8px 32px ${ORANGE}50` }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.7 }}
              />
              <PartyPopper className="size-6 relative z-10" />
              <span className="relative z-10">Votre événement</span>
              <ArrowRight className="size-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <p className="text-white/40 text-sm mt-3">Anniversaire · EVG · EVJF · Team Building · Soirée privée</p>
          </motion.div>

        </div>
      </section>

      {/* ── Modale mobile tarifs ── */}
      <AnimatePresence>
        {mobileModal && (
          <TarifsModal
            activity={displayedActivities.find(a => a.id === mobileModal)!}
            tarifs={
              (displayedActivities.find(a => a.id === mobileModal) as any)?.tarifs ||
              TARIFS_FALLBACK[displayedActivities.find(a => a.id === mobileModal)?.slug || ''] ||
              TARIFS_FALLBACK[mobileModal] || []
            }
            onClose={() => setMobileModal(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Modale événement Pour qui ── */}
      <AnimatePresence>
        {evenementModal && (
          <EvenementModal
            cards={pourQuiCards}
            onClose={() => setEvenementModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ══════════════════════════════════════════════════════════
// COMPOSANT ROND ACTIVITÉ
// ══════════════════════════════════════════════════════════

function ActivityRond({
  activity, tarifs, isMobile, isActive, index,
  onHoverEnter, onHoverLeave, onTap,
}: {
  activity: any;
  tarifs: TarifGroupe[];
  isMobile: boolean;
  isActive: boolean;
  index: number;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  onTap: () => void;
}) {
  // Les ronds de la 2e rangée (index 3,4,5) → carte s'ouvre vers le haut
  // Les ronds de la 1e rangée (index 0,1,2) → carte s'ouvre vers le bas
  const opensUpward = index >= 3;

  // Positionnement horizontal : éviter débordement gauche/droite
  // col 0 (index 0,3) → aligner à gauche ; col 2 (index 2,5) → aligner à droite ; sinon centré
  const col = index % 3;
  const hAlign =
    col === 0 ? 'left-0 -translate-x-0'
    : col === 2 ? 'right-0 translate-x-0'
    : 'left-1/2 -translate-x-1/2';

  return (
    <div
      className="relative"
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
    >
      {/* ── Le rond — Link vers la page activité au clic ── */}
      <motion.div
        animate={{ scale: isActive && !isMobile ? 1.06 : 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-52 h-52 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-colors"
        style={{ boxShadow: isActive ? `0 0 40px ${GREEN}40` : 'none' }}
      >
        {/* Image */}
        <div className="absolute inset-0">
          <img
            src={activity.image}
            alt={activity.name}
            className="w-full h-full object-cover"
            style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.5s ease' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
        </div>

        {/* Contenu — lien de navigation (toute la surface) */}
        <Link
          to={`/activity/${activity.slug || activity.id}`}
          className="relative h-full flex flex-col items-center justify-center text-center px-4 gap-1 cursor-pointer"
          onClick={e => {
            // Sur mobile : intercepter pour ouvrir modale tarifs, pas naviguer
            if (isMobile) { e.preventDefault(); onTap(); }
          }}
        >
          <span className="text-4xl mb-1">{activity.emoji}</span>

          <h3 className="text-white font-black text-base leading-tight">
            {activity.name}
          </h3>

          {/* Infos : âge, participants, durée */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-1">
            {activity.minAge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-white/20 border border-white/30">
                {activity.minAge}+ ans
              </span>
            )}
            {activity.participants && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/30"
                style={{ backgroundColor: `${GREEN}50` }}>
                {activity.participants}
              </span>
            )}
            {activity.duration && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/30"
                style={{ backgroundColor: `${ORANGE}50` }}>
                {activity.duration}
              </span>
            )}
          </div>

          {/* Indicateur tap mobile */}
          {isMobile && (
            <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
              <ChevronRight className="size-3 text-white" />
            </div>
          )}
        </Link>
      </motion.div>

      {/* ── Carte tarifs desktop (hover) ──
          Positionnée intelligemment :
          - vers le haut si rangée du bas (index >= 3)
          - vers le bas si rangée du haut (index < 3)
          - alignement horizontal selon la colonne
      ── */}
      <AnimatePresence>
        {isActive && !isMobile && tarifs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: opensUpward ? 8 : -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: opensUpward ? 8 : -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute z-30 w-72 ${hAlign}`}
            style={{
              // Vers le haut : bottom de la carte = dessus du rond (+ petit gap)
              // Vers le bas  : top de la carte  = dessous du rond (+ petit gap)
              ...(opensUpward
                ? { bottom: 'calc(100% + 12px)' }
                : { top:    'calc(100% + 12px)' }),
              filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.8))',
            }}
          >
            <TarifsCard activity={activity} tarifs={tarifs} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// CARTE TARIFS (réutilisée desktop + mobile)
// ══════════════════════════════════════════════════════════

function TarifsCard({ activity, tarifs }: { activity: any; tarifs: TarifGroupe[] }) {
  return (
    <div
      className="rounded-3xl overflow-hidden border border-white/10"
      style={{ backgroundColor: '#1a1a1a', backdropFilter: 'blur(20px)' }}
    >
      {/* Header carte */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ background: `linear-gradient(135deg, ${GREEN}cc, ${GREEN}88)` }}
      >
        <span className="text-3xl">{activity.emoji}</span>
        <div>
          <div className="text-white font-black text-base">{activity.name}</div>
          <div className="text-white/70 text-xs">{activity.difficulty} · {activity.duration}</div>
        </div>
      </div>

      {/* Groupes de tarifs */}
      <div className="p-4 space-y-4">
        {tarifs.map((groupe, gi) => (
          <div key={gi}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: ORANGE }}>
              {groupe.titre}
            </div>
            <div className="space-y-1.5">
              {groupe.lignes.map((ligne, li) => (
                <div key={li} className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">{ligne.label}</span>
                  <span className="text-white font-black text-sm ml-4 whitespace-nowrap">{ligne.prix}</span>
                </div>
              ))}
            </div>
            {gi < tarifs.length - 1 && <div className="h-px bg-white/10 mt-3" />}
          </div>
        ))}
      </div>

      {/* Bouton En savoir plus */}
      <div className="px-4 pb-4">
        <Link
          to={`/activities/${activity.slug || activity.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-white text-sm transition-all hover:gap-3"
          style={{ backgroundColor: GREEN }}
          onClick={e => e.stopPropagation()}
        >
          En savoir plus
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MODALE TARIFS MOBILE
// ══════════════════════════════════════════════════════════

function TarifsModal({ activity, tarifs, onClose }: {
  activity: any;
  tarifs: TarifGroupe[];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.95 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute -top-4 right-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
        >
          <X className="size-5" />
        </button>

        <TarifsCard activity={activity} tarifs={tarifs} />
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════
// MODALE ÉVÉNEMENT — Pour qui ?
// ══════════════════════════════════════════════════════════

function EvenementModal({ cards, onClose }: {
  cards: typeof POUR_QUI_FALLBACK;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ backgroundColor: '#161616', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-5 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${GREEN}, ${ORANGE})` }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)' }}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PartyPopper className="size-5 text-white" />
                <span className="text-white/80 text-sm font-medium">Vous organisez un événement ?</span>
              </div>
              <h3 className="text-white font-black text-2xl">C'est pour qui ?</h3>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Cartes Pour qui */}
        <div className="p-5 space-y-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
            >
              <Link
                to={card.link}
                onClick={onClose}
                className="group flex items-center gap-4 p-4 rounded-2xl border border-white/8 transition-all hover:border-white/20"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = `${card.color}15`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${card.color}50`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${card.color}20` }}
                >
                  {card.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-black text-base">{card.title}</div>
                  <div className="text-white/50 text-sm truncate">{card.desc}</div>
                </div>
                <ChevronRight
                  className="size-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <Link
            to="/evenements"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-white text-sm transition-all hover:gap-3"
            style={{ background: `linear-gradient(to right, ${GREEN}, ${ORANGE})` }}
          >
            Voir tous nos événements
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
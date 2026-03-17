// components/BoutonEvenement.tsx
//
// ── Bouton "Votre événement" réutilisable partout ────────────────────────────
//
// VARIANTES :
//   <BoutonEvenement />                       → pill orange (défaut)
//   <BoutonEvenement variant="green" />       → pill vert
//   <BoutonEvenement variant="bubble" />      → bulle ronde animée
//   <BoutonEvenement variant="bubble-dark" /> → bulle ronde fond sombre
//
// OPTIONS :
//   href="/mon-lien"      → lien personnalisé (défaut: /evenements)
//   label="Mon texte"     → texte personnalisé
//   size="sm|md|lg"       → taille (défaut: md)
//   className="..."       → classes supplémentaires
//
// ── Exemples d'usage ─────────────────────────────────────────────────────────
//   // Dans un coin de page, flottant
//   <BoutonEvenement variant="bubble" className="fixed bottom-8 right-8 z-50" />
//
//   // Inline dans du texte/section
//   <BoutonEvenement size="sm" />
//
//   // Gros CTA centré
//   <div className="flex justify-center my-12">
//     <BoutonEvenement variant="bubble-dark" size="lg" />
//   </div>
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PartyPopper, Calendar } from 'lucide-react';

type BoutonVariant = 'orange' | 'green' | 'bubble' | 'bubble-dark';
type BoutonSize    = 'sm' | 'md' | 'lg';

interface BoutonEvenementProps {
  variant?  : BoutonVariant;
  href?     : string;
  label?    : string;
  size?     : BoutonSize;
  className?: string;
}

// ── Tailles pour les pills ────────────────────────────────────────────────────
const pillSize: Record<BoutonSize, { px: string; py: string; text: string; icon: string }> = {
  sm: { px: 'px-4',  py: 'py-2',   text: 'text-xs',  icon: 'size-3.5' },
  md: { px: 'px-6',  py: 'py-3.5',   text: 'text-sm',  icon: 'size-4'   },
  lg: { px: 'px-8',  py: 'py-4',   text: 'text-base', icon: 'size-5'  },
};

// ── Tailles pour les bulles ───────────────────────────────────────────────────
const bubbleSize: Record<BoutonSize, { outer: string; inner: string; icon: string; text: string; subtext: string }> = {
  sm: { outer: 'w-24 h-24',  inner: 'size-7',  icon: 'size-6',  text: 'text-[10px]', subtext: 'text-[8px]'  },
  md: { outer: 'w-44 h-44',  inner: 'size-12',  icon: 'size-8',  text: 'text-[11px]', subtext: 'text-[9px]'  },
  lg: { outer: 'w-24 h-24',  inner: 'size-12', icon: 'size-10', text: 'text-sm',     subtext: 'text-[10px]' },
};

export function BoutonEvenement({
  variant   = 'orange',
  href      = '/evenements',
  label     = 'Votre événement',
  size      = 'md',
  className = '',
}: BoutonEvenementProps) {

  // ── PILL ──────────────────────────────────────────────────────────────────
  if (variant === 'orange' || variant === 'green') {
    const bg    = variant === 'orange' ? '#eb700f' : '#357600';
    const shine = 'rgba(255,255,255,0.25)';
    const s     = pillSize[size];

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className={`inline-flex ${className}`}
      >
        <Link
          to={href}
          className={`relative inline-flex items-center gap-2 ${s.px} ${s.py} rounded-full font-black text-white overflow-hidden shadow-lg ${s.text}`}
          style={{ backgroundColor: bg }}
        >
          {/* Shine au hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(90deg, transparent, ${shine}, transparent)` }}
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.55 }}
          />
          {/* Pulse ring discret */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: `2px solid ${bg}` }}
            animate={{ scale: [1, 1.12, 1], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
          <Calendar className={`relative z-10 ${s.icon}`} />
          <span className="relative z-10">{label}</span>
          <PartyPopper className={`relative z-10 ${s.icon} opacity-80`} />
        </Link>
      </motion.div>
    );
  }

  // ── BUBBLE ────────────────────────────────────────────────────────────────
  const isDark  = variant === 'bubble-dark';
  const bgOuter = isDark ? '#1a1a1a' : 'white';
  const accent  = '#eb700f';
  const green   = '#357600';
  const s       = bubbleSize[size];

  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className={`relative inline-flex ${className}`}
    >
      <Link
        to={href}
        className={`relative flex flex-col items-center justify-center rounded-full shadow-2xl overflow-hidden group cursor-pointer ${s.outer}`}
        style={{
          backgroundColor: bgOuter,
          // Barre dégradée en haut via box-shadow inset
          boxShadow: `inset 0 3px 0 0 ${accent}, 0 8px 32px -4px rgba(0,0,0,0.25)`,
        }}
      >
        {/* Fond intérieur au hover */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `radial-gradient(circle at center, ${accent}18 0%, transparent 70%)` }}
        />

        {/* Pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 pointer-events-none"
          style={{ borderColor: accent }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border pointer-events-none"
          style={{ borderColor: green }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.25, 0, 0.25] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.7 }}
        />

        {/* Icône */}
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 mb-1"
        >
          <PartyPopper
            className={s.icon}
            style={{ color: accent }}
          />
        </motion.div>

        {/* Texte */}
        <span
          className={`relative z-10 font-black leading-tight text-center px-2 ${s.text}`}
          style={{ color: isDark ? 'white' : '#111111' }}
        >
          {label}
        </span>
        <span
          className={`relative z-10 font-medium opacity-60 ${s.subtext}`}
          style={{ color: isDark ? 'white' : '#555' }}
        >
          En savoir plus →
        </span>
      </Link>
    </motion.div>
  );
}
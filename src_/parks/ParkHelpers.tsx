// components/park/ParkHelpers.tsx
// Composants utilitaires partagés dans toute la section parc
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const GREEN  = '#357600';
export const ORANGE = '#eb700f';
export const DARK   = '#111111';

// ── Section animée au scroll ──────────────────────────────
export function AnimatedSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ── Badge de section (fond sombre) ───────────────────────
export function SectionBadge({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full mb-6 text-sm font-medium border border-white/20"
    >
      {icon} {text}
    </motion.div>
  );
}

// ── Fond grille sombre ────────────────────────────────────
export function DarkSectionBg() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0 0 L 100 0 L 100 1 L 0 1 Z M 0 0 L 0 100 L 1 100 L 1 0 Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
          backgroundSize: '50px 50px',
        }}
      />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: GREEN, opacity: 0.15 }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: ORANGE, opacity: 0.15 }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

// ── Fond pattern clair ────────────────────────────────────
export function SubtlePatternBg() {
  return (
    <div
      className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23111111' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
      }}
    />
  );
}

// ── Blob flottant ─────────────────────────────────────────
export function FloatingBlob({
  color,
  className,
  size = 'w-32 h-32',
  delay = 0,
}: {
  color: string;
  className: string;
  size?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute ${size} rounded-full blur-2xl ${className}`}
      style={{ backgroundColor: color, opacity: 0.08 }}
      animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 15 + delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

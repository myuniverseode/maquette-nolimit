// components/CTAEvenement.tsx
//
// ── Usage simple ──────────────────────────────────────────────
//   import { CTAEvenement } from './CTAEvenement';
//   <CTAEvenement />
//
// ── Avec options ─────────────────────────────────────────────
//   <CTAEvenement variant="dark" />        → fond sombre
//   <CTAEvenement variant="orange" />      → fond brandOrange
//   <CTAEvenement href="/mon-lien" />      → lien personnalisé
// ─────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, PartyPopper, Users, Briefcase, Heart, ArrowRight } from 'lucide-react';

type CTAVariant = 'light' | 'dark' | 'orange';

interface CTAEvenementProps {
  variant?: CTAVariant;
  href?: string;
}

const TAGS = [
  { icon: Heart,       label: 'Anniversaire' },
  { icon: Users,       label: 'EVG / EVJF' },
  { icon: Briefcase,   label: 'Team Building' },
  { icon: PartyPopper, label: 'Soirée privée' },
];

export function CTAEvenement({ variant = 'light', href = '/evenements' }: CTAEvenementProps) {
  const isLight  = variant === 'light';
  const isOrange = variant === 'orange';

  // Couleurs selon le variant
  const sectionBg   = isLight ? 'bg-white' : isOrange ? 'bg-gradient-to-b from-brandOrange-100 to-brandOrange-500' : 'bg-[#111111]';
  const cardBg      = isOrange ? 'bg-[#111111]' : 'bg-gradient-to-br from-[#111111] to-[#1c1c1c]';
  const accentColor = '#eb700f';
  const greenColor  = '#357600';
  const btnBg       = isOrange ? greenColor : accentColor;
  const titleGrad   = isOrange ? 'from-[#d4f57a] to-[#a8e040]' : 'from-[#eb700f] to-[#ff9a3c]';

  return (
    <section className={`relative py-20 overflow-hidden ${sectionBg}`}>
      {/* Blobs flottants */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: greenColor, opacity: 0.08 }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: accentColor, opacity: 0.10 }}
        animate={{ x: [0, -40, 0], y: [0, 25, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative max-w-4xl mx-auto rounded-3xl border border-[#2a2a2a] overflow-hidden ${cardBg}`}
        >
          {/* Barre vert→orange en haut */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${greenColor}, ${accentColor})` }} />

          {/* Pattern intérieur */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-10">

              {/* ── Gauche : contenu ── */}
              <div className="flex-1 text-center md:text-left">
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
                  style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                >
                  <PartyPopper className="size-4" />
                  Organisez votre événement
                </div>

                {/* Titre */}
                <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight text-white">
                  Une aventure{' '}
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${titleGrad}`}>
                    rien que pour vous
                  </span>
                </h2>

                {/* Description */}
                <p className="text-white/60 text-base mb-6 leading-relaxed max-w-md">
                  Anniversaire, EVG, team building ou soirée privée — nos équipes créent une expérience sur-mesure inoubliable pour votre groupe.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
                  {TAGS.map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/75 border border-white/10"
                      style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                    >
                      <Icon className="size-3" />
                      {label}
                    </span>
                  ))}
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  {/* Principal */}
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to={href}
                      className="relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-black text-sm text-white overflow-hidden shadow-lg"
                      style={{ backgroundColor: btnBg }}
                    >
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)' }}
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '200%' }}
                        transition={{ duration: 0.55 }}
                      />
                      <Calendar className="size-4 relative z-10" />
                      <span className="relative z-10">Réserver votre événement</span>
                    </Link>
                  </motion.div>

                  {/* Devis */}
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/devis"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white/65 border border-white/15 hover:bg-white/08 transition-colors"
                    >
                      Demander un devis
                      <ArrowRight className="size-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* ── Droite : icône animée ── */}
              <div className="hidden md:flex flex-col items-center gap-5 shrink-0">
                <motion.div
                  className="relative w-36 h-36 rounded-full flex items-center justify-center"
                  style={{ background: `${accentColor}22` }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Pulse rings */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: accentColor }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border"
                    style={{ borderColor: greenColor }}
                    animate={{ scale: [1, 1.65, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                  />
                  <PartyPopper className="size-14" style={{ color: accentColor }} />
                </motion.div>

                <div className="text-center">
                  <div className="text-3xl font-black text-white">200+</div>
                  <div className="text-xs text-white/45 uppercase tracking-wider">événements / an</div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
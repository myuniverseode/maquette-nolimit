// components/home/TextBlocSection.tsx
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTextBlocData } from '../../hooks/useTextBlocData';

const GREEN  = '#357600';
const ORANGE = '#eb700f';

// Transforme **mot** en vert et ~~mot~~ en orange dans le titre
function formatTitle(title: string): string {
  return title
    .replace(/\*\*(.+?)\*\*/g, `<span style="color:${GREEN}">$1</span>`)
    .replace(/~~(.+?)~~/g, `<span style="color:${ORANGE}">$1</span>`);
}

export function TextBlocSection() {
  // ⚠️  Plus de `loading` — les données par défaut sont dans le state initial,
  //     donc le composant s'affiche immédiatement sans section blanche.
  const { data } = useTextBlocData();

  // Le ref est sur le wrapper le plus externe pour que useInView soit fiable
  // even: true + margin large pour déclencher dès que la section entre en vue
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  // Masquage si désactivé depuis WordPress
  if (!data.enabled) return null;

  const stats    = data.stats ?? [];
  const hasStats = stats.length > 0;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white"
    >
      {/* ── Déco fond ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 80% at 110% 50%, ${GREEN}08 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at -10% 50%, ${ORANGE}06 0%, transparent 70%)
          `,
        }}
      />

      {/* Ligne décorative gauche — transformOrigin via style uniquement */}
      <motion.div
        className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full"
        style={{
          background: `linear-gradient(to bottom, transparent, ${GREEN}60, transparent)`,
          transformOrigin: 'top',
          scaleY: isInView ? 1 : 0,
        }}
        animate={{ scaleY: isInView ? 1 : 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />

      <div className="container mx-auto px-4 py-16 md:py-20">
        <div
          className={
            hasStats
              ? 'max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center'
              : 'max-w-3xl mx-auto'
          }
        >

          {/* ══ Colonne texte ══ */}
          <div>

            {/* Badge */}
            {data.badge && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5 border"
                style={{ color: GREEN, borderColor: `${GREEN}30`, backgroundColor: `${GREEN}0d` }}
              >
                <Leaf className="size-3" />
                {data.badge}
              </motion.div>
            )}

            {/* Titre — supporte **vert** et ~~orange~~ */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-5"
              dangerouslySetInnerHTML={{ __html: formatTitle(data.title ?? '') }}
            />

            {/* Texte principal */}
            {data.text && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.55, delay: 0.16 }}
                className="text-gray-600 text-lg leading-relaxed mb-5"
              >
                {data.text}
              </motion.p>
            )}

            {/* Texte secondaire */}
            {data.textSecondary && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                className="text-gray-500 text-base leading-relaxed mb-8"
              >
                {data.textSecondary}
              </motion.p>
            )}

            {/* CTA */}
            {data.cta?.label && data.cta?.url && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.45, delay: 0.3 }}
              >
                <Link
                  to={data.cta.url}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110"
                  style={{ backgroundColor: ORANGE, boxShadow: `0 4px 18px ${ORANGE}45` }}
                >
                  {data.cta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </motion.div>
            )}
          </div>

          {/* ══ Grille de stats (si présentes) ══ */}
          {hasStats && (
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24, scale: 0.94 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.94 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.09 }}
                  className="relative rounded-2xl p-5 overflow-hidden"
                  style={{
                    background: i % 2 === 0
                      ? `linear-gradient(135deg, ${GREEN}10, ${GREEN}05)`
                      : `linear-gradient(135deg, ${ORANGE}10, ${ORANGE}05)`,
                    border: `1.5px solid ${i % 2 === 0 ? `${GREEN}20` : `${ORANGE}20`}`,
                  }}
                >
                  {/* Halo déco */}
                  <div
                    className="absolute -top-5 -right-5 w-16 h-16 rounded-full blur-2xl opacity-25"
                    style={{ backgroundColor: i % 2 === 0 ? GREEN : ORANGE }}
                  />
                  <div
                    className="text-3xl font-black mb-1 leading-none"
                    style={{ color: i % 2 === 0 ? GREEN : ORANGE }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold text-gray-800 leading-snug">
                    {stat.label}
                  </div>
                  {stat.sublabel && (
                    <div className="text-xs text-gray-400 mt-0.5">{stat.sublabel}</div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
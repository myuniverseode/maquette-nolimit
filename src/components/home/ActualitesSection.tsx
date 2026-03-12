// components/home/ActualitesSection.tsx
// Desktop : 3 articles visibles + navigation carrousel
// Mobile  : 1 article visible + navigation carrousel

import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useActualitesData } from '../../hooks/useActualitesData';
import { useState, useEffect, useRef, useCallback } from 'react';

const GREEN  = '#357600';
const ORANGE = '#eb700f';

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

// ── Nombre d'articles visibles selon la largeur ──────────────
function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const check = () => setCount(window.innerWidth < 768 ? 1 : 3);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return count;
}

// ════════════════════════════════════════════════════════════
export function ActualitesSection() {
  const { data }        = useActualitesData();
  const visibleCount    = useVisibleCount();
  const articles        = data.articles;
  const total           = articles.length;

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxIndex = Math.max(0, total - visibleCount);

  const go = useCallback((dir: 1 | -1) => {
    setDirection(dir);
    setCurrent(prev => {
      const next = prev + dir;
      if (next < 0) return maxIndex;
      if (next > maxIndex) return 0;
      return next;
    });
  }, [maxIndex]);

  // Auto-play toutes les 4s
  useEffect(() => {
    autoRef.current = setInterval(() => go(1), 4000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [go]);

  const pauseAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
  };
  const resumeAuto = () => {
    autoRef.current = setInterval(() => go(1), 4000);
  };

  const visibleArticles = articles.slice(current, current + visibleCount);

  // Dots : nombre de positions possibles
  const dotsCount = maxIndex + 1;

  const variants = {
    enter:  (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <section id="actualites" className="relative py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black mb-4" style={{ color: GREEN }}>
            {data.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </motion.div>

        {/* ── Carrousel ── */}
        <div
          className="relative max-w-7xl mx-auto"
          onMouseEnter={pauseAuto}
          onMouseLeave={resumeAuto}
        >
          {/* Boutons prev / next */}
          {total > visibleCount && (
            <>
              <button
                onClick={() => { pauseAuto(); go(-1); resumeAuto(); }}
                className="absolute -left-5 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:border-green-500 hover:shadow-xl transition-all group"
                aria-label="Article précédent"
              >
                <ChevronLeft className="size-5 text-gray-500 group-hover:text-green-600 transition-colors" />
              </button>
              <button
                onClick={() => { pauseAuto(); go(1); resumeAuto(); }}
                className="absolute -right-5 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:border-green-500 hover:shadow-xl transition-all group"
                aria-label="Article suivant"
              >
                <ChevronRight className="size-5 text-gray-500 group-hover:text-green-600 transition-colors" />
              </button>
            </>
          )}

          {/* Grid animée */}
          <div className="overflow-hidden">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className={`grid gap-8 ${
                  visibleCount === 1
                    ? 'grid-cols-1'
                    : 'grid-cols-1 md:grid-cols-3'
                }`}
              >
                {visibleArticles.map((actu, index) => (
                  <ArticleCard key={actu.id} actu={actu} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          {dotsCount > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: dotsCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width:  current === i ? '2rem' : '0.5rem',
                    height: '0.5rem',
                    backgroundColor: current === i ? GREEN : '#d1d5db',
                  }}
                  aria-label={`Aller à la position ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Bouton Voir toutes ── */}
        {data.showViewAllButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              to={data.viewAllUrl}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:gap-5 hover:shadow-xl"
              style={{ backgroundColor: GREEN }}
            >
              <span>Voir toutes les actualités</span>
              <ArrowRight className="size-6" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ── Carte article ─────────────────────────────────────────
function ArticleCard({ actu, index }: { actu: any; index: number }) {
  return (
    <div className="group h-full">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">

        {/* Image */}
        <div className="relative h-56 overflow-hidden flex-shrink-0">
          <img
            src={actu.image}
            alt={actu.titre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {actu.isEvenement && (
            <div
              className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg"
              style={{ backgroundColor: ORANGE }}
            >
              📅 Événement
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Contenu */}
        <div className="p-6 flex flex-col flex-1">
          {/* Date */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
            <Calendar className="size-4" />
            <span>{formatDate(actu.date)}</span>
          </div>

          {/* Titre */}
          <h3
            className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-700 transition-colors duration-300 leading-tight"
          >
            {actu.titre}
          </h3>

          {/* Extrait */}
          <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
            {actu.extrait}
          </p>

          {/* Boutons */}
          <div className="flex flex-col gap-3 mt-auto">
            <Link
              to={actu.lien}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:gap-4 hover:shadow-lg"
              style={{ backgroundColor: GREEN }}
            >
              <span>Lire la suite</span>
              <ArrowRight className="size-5" />
            </Link>

            {actu.isEvenement && actu.lienInscription && (
              <Link
                to={actu.lienInscription}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:gap-4 hover:shadow-lg"
                style={{ backgroundColor: ORANGE }}
              >
                <UserPlus className="size-5" />
                <span>S'inscrire</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
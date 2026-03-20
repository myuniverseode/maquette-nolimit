// pages/HomePage.tsx
import { Link } from 'react-router-dom';
import { Play, MapPin, Sparkles, Zap, ArrowRight, Star, Heart, Shield, Users, Leaf } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { ParksList } from '../components/ParkList';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { AncrageMenu } from '../components/home/AncrageMenu';
import { PourQuiSection } from '../components/home/PourQuiSection';
import { ActualitesSection } from '../components/home/ActualitesSection';
import { ActivitiesSection } from '../components/home/ActivitiesSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { useHeroData } from '../hooks/useHeroData';


// Mapping des noms d'icônes Lucide vers les composants
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Sparkles, Star, Zap, Heart, Play, MapPin, ArrowRight, Shield, Users, Leaf,
};

function getLucideIcon(name: string, fallback: React.ComponentType<any> = Sparkles) {
  return ICON_MAP[name] || fallback;
}

export function HomePage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // ── Données dynamiques depuis WordPress ──
  const { data: heroData } = useHeroData();



  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale   = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // Icône du badge résolue depuis WordPress
  const BadgeIcon = useMemo(
    () => getLucideIcon(heroData.badge.icon),
    [heroData.badge.icon]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        setMousePosition({
          x: (clientX - innerWidth  / 2) / 50,
          y: (clientY - innerHeight / 2) / 50,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-white">

      {/* MENU ANCRAGE */}
      <AncrageMenu />

      {/* ════════════════════════════════════════
          SECTION 1 : HERO (données WordPress)
          ════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <HeroCarousel />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/60 via-[#111111]/30 to-[#111111]/70" />
        </div>

        {/* Floating blobs */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: '#357600', opacity: 0.15 }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: '#eb700f', opacity: 0.15 }}
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Contenu hero : badge + titre depuis WP ── */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, x: mousePosition.x, y: mousePosition.y }}
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        >
          {/* Badge dynamique */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-6"
          >
            <BadgeIcon className="size-4" style={{ color: '#eb700f' }} />
            <span className="text-white text-sm font-medium">
              {heroData.badge.text}
            </span>
          </motion.div>

          {/* Titre dynamique */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl"
          >
            {heroData.mainTitle.line1}{' '}
            <span className="relative inline-block">
              <span
                className="relative z-10 text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(to right, #357600, #4a9d00)' }}
              >
                {heroData.mainTitle.highlight}
              </span>
              <motion.span
                className="absolute inset-0 blur-xl"
                style={{ background: 'linear-gradient(to right, rgba(53,118,0,0.4), rgba(74,157,0,0.4))' }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </motion.h1>

          {/* Stats grid dynamique */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8"
          >
      
          </motion.div>
        </motion.div>

        {/* ── Bouton vidéo dynamique ── */}
        {heroData.video?.url && (
          <motion.div
            className="absolute bottom-20 right-8 z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            {!isVideoPlaying ? (
              <motion.button
                onClick={() => setIsVideoPlaying(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all border border-white/20"
              >
                <motion.div
                  className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <Play className="size-6 ml-1 relative z-10" style={{ color: '#357600' }} />
                </motion.div>
                <div className="text-left">
                  <div className="font-bold">{heroData.video.buttonText}</div>
                  <div className="text-sm opacity-80">{heroData.video.description}</div>
                </div>
              </motion.button>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-96 h-64 rounded-2xl overflow-hidden shadow-2xl"
                style={{ backgroundColor: '#111111' }}
              >
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  onPause={() => setIsVideoPlaying(false)}
                  onEnded={() => setIsVideoPlaying(false)}
                >
                  <source src={heroData.video.url} />
                </video>
              </motion.div>
            )}
          </motion.div>
        )}
      </section>

      {/* ════════════════════════════════════════
          SECTION 2 : PARCS
          ════════════════════════════════════════ */}
      <section id="parcs" />
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-brandOrange-100 to-brandOrange-500">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23111111' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full blur-2xl pointer-events-none"
          style={{ backgroundColor: '#357600', opacity: 0.08 }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-40 h-40 rounded-full blur-2xl pointer-events-none"
          style={{ backgroundColor: '#eb700f', opacity: 0.08 }}
          animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-medium shadow-lg text-white"
              style={{ backgroundColor: '#357600' }}
            >
              <MapPin className="size-4" />
              Nos destinations
            </div>

            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: '#111111' }}>
              Nos parcs à travers{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(to right, #357600, #4a9d00)' }}
              >
                la France
              </span>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto text-lg font-medium">
              5 destinations uniques pour des aventures inoubliables
            </p>
          </div>

          <div className="max-w-6xl mx-auto pb-20 pt-2">
            <ParksList compact={true} showFilter={true} maxItems={6} centeredFilters={true} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 3 : ACTIVITÉS
          ════════════════════════════════════════ */}
      <ActivitiesSection />

      {/* ════════════════════════════════════════
          SECTION 4 : POUR QUI
          ════════════════════════════════════════ */}
      <PourQuiSection />

      {/* ════════════════════════════════════════
          SECTION 5 : ACTUALITÉS
          ════════════════════════════════════════ */}
      <ActualitesSection />

      {/* ════════════════════════════════════════
          SECTION 6 : TÉMOIGNAGES
          ════════════════════════════════════════ */}
      <TestimonialsSection />

      {/* ════════════════════════════════════════
          SECTION 7 : NEWSLETTER
          ════════════════════════════════════════ */}
      <div id="reserver" className="relative bg-gradient-to-b from-gray-50 to-white">
        <NewsletterSection compact={true} />
      </div>

    </div>
  );
}

// ════════════════════════════════════════
// COMPOSANT : Stats Grid dynamique (données WP)
// ════════════════════════════════════════
import { TrendingUp, Award, Trophy } from 'lucide-react';

const STAT_ICON_MAP: Record<string, React.ComponentType<any>> = {
  MapPin, Star, Users, Award, Trophy, TrendingUp, Heart, Zap,
};



     

// ════════════════════════════════════════
// COMPOSANT HELPER : Section animée réutilisable
// ════════════════════════════════════════
function AnimatedSection({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      id={id}
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

// ============================================================
// Nouveau fichier : components/home/TestimonialsSection.tsx
// ============================================================
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ReviewCard } from '../ReviewCard';
import { Review } from '../../types';
import { defaultParks } from '../../hooks/useParksData';

  


// ── données mock (à remplacer par un fetch WordPress) ────────
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Marie L.',
    date: 'Janvier 2025',
    rating: 5,
    comment: 'Une journée absolument incroyable avec mes enfants ! Les moniteurs sont au top, on a adoré l\'accrobranche et le paintball. On reviendra sans hésiter.',
    activity: 'Accrobranche',
    avatar: '',
  },
  {
    id: '2',
    author: 'Thomas R.',
    date: 'Décembre 2024',
    rating: 5,
    comment: 'Parfait pour un team building d\'entreprise. L\'équipe NoLimit a su adapter les activités pour notre groupe de 25 personnes. Tout le monde est reparti avec le sourire.',
    activity: 'Paintball',
    avatar: '',
  },
  {
    id: '3',
    author: 'Sophie & Marc',
    date: 'Novembre 2024',
    rating: 4,
    comment: 'Super expérience pour notre anniversaire de mariage. Le parcours filet géant était spectaculaire. Seul bémol : la file d\'attente un peu longue le week-end.',
    park: 'Parc Bordeaux',
    activity: 'Parcours Filet',
    avatar: '',
  },
  {
    id: '4',
    author: 'Lucas B.',
    date: 'Octobre 2024',
    rating: 5,
    comment: 'L\'escape game outdoor était une révélation ! Jamais vu ça ailleurs. La mise en scène est bluffante et les énigmes vraiment bien pensées. BRAVO !',
    park: 'Parc Paris',
    activity: 'Escape Game',
    avatar: '',
  },
  {
    id: '5',
    author: 'Camille D.',
    date: 'Septembre 2024',
    rating: 5,
    comment: 'Mes enfants de 7 et 10 ans ont vécu leur meilleure journée de vacances ici. Le personnel est bienveillant, les parcours adaptés à tous les niveaux. Magique !',
    park: 'Parc Toulouse',
    activity: 'Accrobranche',
    avatar: '',
  },
  {
    id: '6',
    author: 'Alexis M.',
    date: 'Août 2024',
    rating: 5,
    comment: 'Archery Tag : une activité que je recommande à 100% ! Adrénaline garantie. Les équipements sont en parfait état et les règles bien expliquées.',
    park: 'Parc Lyon',
    activity: 'Archery Tag',
    avatar: '',
  },
];

// ── ReviewCard améliorée (si tu veux remplacer l'existante) ──
function EnhancedReviewCard({ review, index }: { review: Review; index: number }) {
  const initials = review.author
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Couleurs d'avatar cycliques harmonisées avec la charte
  const avatarColors = [
    { bg: '#357600', text: '#ffffff' },
    { bg: '#eb700f', text: '#ffffff' },
    { bg: '#4a9d00', text: '#ffffff' },
    { bg: '#c45000', text: '#ffffff' },
    { bg: '#2a5c00', text: '#ffffff' },
    { bg: '#ff8c2a', text: '#ffffff' },
  ];
  const color = avatarColors[index % avatarColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="relative flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Barre colorée en haut */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(to right, ${color.bg}, #eb700f)` }}
      />

      <div className="flex flex-col flex-1 p-6">
        {/* Guillemet décoratif */}
        <Quote
          className="size-8 mb-3 opacity-20"
          style={{ color: color.bg }}
        />

        {/* Étoiles */}
        <div className="flex gap-0.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`size-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`}
            />
          ))}
        </div>

        {/* Commentaire */}
        <p className="text-white/80 leading-relaxed flex-1 text-sm mb-6">
          "{review.comment}"
        </p>

        {/* Footer : auteur + activité */}
        <div className="flex items-center justify-between mt-auto pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar initiales */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-md flex-shrink-0"
              style={{ backgroundColor: color.bg, color: color.text }}
            >
              {initials}
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">{review.author}</p>
              <p className="text-white/40 text-xs">{review.date}</p>
            </div>
          </div>

          {/* Badge activité */}
          {review.activity && (
            <span
              className="px-2 py-1 rounded-full text-[10px] font-semibold flex-shrink-0"
              style={{ backgroundColor: `${color.bg}25`, color: color.bg === '#eb700f' ? '#ff9a3c' : '#7acc00' }}
            >
              {review.activity}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Composant principal ──────────────────────────────────────
export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [page, setPage] = useState(0);

  const CARDS_PER_PAGE = 3;
  const totalPages = Math.ceil(MOCK_REVIEWS.length / CARDS_PER_PAGE);
  const visibleReviews = MOCK_REVIEWS.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  // Score agrégé
  const avgRating = (MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ backgroundColor: '#111111' }}
    >
      {/* ── Fond animé ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: '#357600', opacity: 0.10 }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: '#eb700f', opacity: 0.08 }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-4 relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-medium border"
            style={{
              backgroundColor: 'rgba(235,112,15,0.12)',
              borderColor: 'rgba(235,112,15,0.30)',
              color: '#ff9a3c',
            }}
          >
            <Star className="size-4 fill-current" />
            Ce que disent nos aventuriers
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ils ont vécu{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(to right, #eb700f, #ff9a3c)' }}
            >
              l'expérience
            </span>
          </h2>

          {/* Score agrégé */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 mt-2 px-6 py-3 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-3xl font-black text-white">{avgRating}</span>
            <span className="text-white/40 text-sm">/ 5 · {MOCK_REVIEWS.length} avis</span>
          </motion.div>
        </motion.div>

        {/* ── Grille de cards ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {visibleReviews.map((review, i) => (
              <EnhancedReviewCard key={review.id} review={review} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-3 rounded-full border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.12)',
                color: 'white',
              }}
            >
              <ChevronLeft className="size-5" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setPage(i)}
                  animate={{ width: i === page ? 28 : 8 }}
                  className="h-2 rounded-full transition-colors"
                  style={{ backgroundColor: i === page ? '#eb700f' : 'rgba(255,255,255,0.2)' }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-3 rounded-full border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.12)',
                color: 'white',
              }}
            >
              <ChevronRight className="size-5" />
            </motion.button>
          </div>
        )}

        {/* ── CTA laisser un avis ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://g.page/r/nolimit-aventure/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.60)',
            }}
          >
            <Star className="size-4" style={{ color: '#eb700f' }} />
            Laisser un avis Google
          </a>
        </motion.div>
      </div>
    </section>
  );
}
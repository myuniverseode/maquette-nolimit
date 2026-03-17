// components/park/ParkReviewsSection.tsx
// Section avis propre au parc — s'insère entre "Ne ratez rien" et "Contactez-nous"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { FaGoogle, FaTripadvisor } from 'react-icons/fa';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

// ── Avis spécifiques au parc (à remplacer par données API/WP) ──
const parkReviews = [
  {
    name: 'Camille D.',
    avatar: '🧗',
    rating: 5,
    date: 'Janvier 2025',
    source: 'google',
    comment: 'Une journée magique avec toute la famille ! Les parcours accrobranche sont variés et bien entretenus. Les moniteurs sont très attentionnés avec les enfants. On reviendra sans hésiter.',
    tag: 'Famille',
  },
  {
    name: 'Antoine V.',
    avatar: '💼',
    rating: 5,
    date: 'Décembre 2024',
    source: 'tripadvisor',
    comment: 'Excellent team-building pour notre équipe de 15 personnes. Organisation au top, staff professionnel et souriant. La tyrolienne de 300m est incroyable ! Je recommande vivement pour les entreprises.',
    tag: 'Entreprise',
  },
  {
    name: 'Nathalie R.',
    avatar: '🎂',
    rating: 5,
    date: 'Novembre 2024',
    source: 'google',
    comment: 'Anniversaire de mon fils réussi à 100% ! Le parc a tout géré parfaitement, les enfants ont adoré. Le paintball était le moment préféré de tout le monde. Merci à toute l\'équipe.',
    tag: 'Anniversaire',
  },
  {
    name: 'Julien M.',
    avatar: '🎯',
    rating: 4,
    date: 'Octobre 2024',
    source: 'google',
    comment: 'Très bonne expérience globale. Les activités sont nombreuses et bien pensées pour tous les niveaux. Petit bémol sur l\'attente à l\'accueil, mais rien de rédhibitoire. Le parcours extrême vaut le déplacement !',
    tag: 'Amis',
  },
  {
    name: 'Sophie L.',
    avatar: '🥂',
    rating: 5,
    date: 'Septembre 2024',
    source: 'tripadvisor',
    comment: 'Notre EVJF était parfait ! L\'équipe a su adapter les activités pour notre groupe et nous a réservé des surprises inattendues. L\'escape game était hilarant. Merci pour ces souvenirs inoubliables.',
    tag: 'EVJF',
  },
  {
    name: 'Marc T.',
    avatar: '🌟',
    rating: 5,
    date: 'Août 2024',
    source: 'google',
    comment: 'Le meilleur parc de loisirs de la région sans aucun doute. Rapport qualité-prix excellent, accueil chaleureux, activités pour tous les âges. Le parc est propre et bien entretenu. À faire absolument !',
    tag: 'Famille',
  },
];

const tagColors: Record<string, string> = {
  'Famille':     GREEN,
  'Entreprise':  '#3b82f6',
  'Anniversaire':'#ec4899',
  'Amis':        ORANGE,
  'EVJF':        '#8b5cf6',
};

const sourceConfig = {
  google:      { icon: FaGoogle,      label: 'Google',      color: '#4285F4' },
  tripadvisor: { icon: FaTripadvisor, label: 'Tripadvisor', color: '#00AF87' },
};

// Moyenne et répartition
const avgRating = (parkReviews.reduce((s, r) => s + r.rating, 0) / parkReviews.length).toFixed(1);
const ratingDist = [5,4,3,2,1].map(s => ({
  stars: s,
  pct: Math.round((parkReviews.filter(r => r.rating === s).length / parkReviews.length) * 100),
}));

export function ParkReviewsSection({ park }: { park: any }) {
  const [current, setCurrent] = useState(0);
  const total = parkReviews.length;
  const prev = () => setCurrent(c => (c - 1 + total) % total);
  const next = () => setCurrent(c => (c + 1) % total);

  // 3 avis visibles à la fois sur desktop
  const visibleIndices = [
    current % total,
    (current + 1) % total,
    (current + 2) % total,
  ];

  return (
    <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Décor de fond */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23357600' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12"
        >
          {/* Gauche : titre + note globale */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-7 rounded-full" style={{ backgroundColor: ORANGE }} />
              <h2 className="text-3xl font-black" style={{ color: DARK }}>
                Ce que disent nos <span style={{ color: GREEN }}>visiteurs</span>
              </h2>
            </div>
            <p className="text-gray-500 text-sm ml-4">Avis vérifiés sur Google & Tripadvisor</p>
          </div>

          {/* Droite : score + distribution */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 bg-white rounded-2xl p-5 shadow-md border border-gray-100 shrink-0"
          >
            {/* Score */}
            <div className="text-center">
              <div className="text-5xl font-black leading-none mb-1" style={{ color: DARK }}>{avgRating}</div>
              <div className="flex gap-0.5 justify-center mb-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`size-4 ${parseFloat(avgRating) >= s ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                ))}
              </div>
              <div className="text-gray-400 text-xs font-medium">{total} avis</div>
            </div>

            <div className="w-px h-14 bg-gray-200" />

            {/* Distribution */}
            <div className="space-y-1.5 min-w-[120px]">
              {ratingDist.map(({ stars, pct }) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-3 text-right">{stars}</span>
                  <Star className="size-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: (5 - stars) * 0.08 }}
                      className="h-full rounded-full bg-yellow-400"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 w-7 text-right">{pct}%</span>
                </div>
              ))}
            </div>

            <div className="w-px h-14 bg-gray-200" />

            {/* Liens avis */}
            <div className="flex flex-col gap-2">
              {Object.entries(sourceConfig).map(([key, { icon: Icon, label, color }]) => (
                <motion.a
                  key={key}
                  href="#"
                  whileHover={{ scale: 1.06, x: 2 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:shadow-sm"
                  style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
                >
                  <Icon className="text-sm" style={{ color }} />
                  <span className="text-xs font-bold text-gray-700">{label}</span>
                  <ExternalLink className="size-3 text-gray-400" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Carrousel 3 cartes ── */}
        <div className="relative">
          {/* Cartes desktop : 3 côte à côte */}
          <div className="hidden md:grid grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {visibleIndices.map((idx, pos) => (
                <motion.div
                  key={`${idx}-${pos}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: pos * 0.06 }}
                >
                  <ReviewCard review={parkReviews[idx]} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Mobile : 1 carte à la fois */}
          <div className="md:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                <ReviewCard review={parkReviews[current]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-gray-300 transition-colors"
            >
              <ChevronLeft className="size-5 text-gray-600" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {parkReviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === current ? '24px' : '8px',
                    height: '8px',
                    backgroundColor: i === current ? ORANGE : '#d1d5db',
                  }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-gray-300 transition-colors"
            >
              <ChevronRight className="size-5 text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* ── CTA laisser un avis ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-gray-500 text-sm mb-4">Vous avez visité le parc ? Partagez votre expérience !</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Object.entries(sourceConfig).map(([key, { icon: Icon, label, color }]) => (
              <motion.a
                key={key}
                href="#"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white shadow-md transition-all"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 4px 14px ${color}40`,
                }}
              >
                <Icon className="text-base" />
                Laisser un avis {label}
              </motion.a>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ── Carte avis individuelle ──
function ReviewCard({ review }: { review: typeof parkReviews[0] }) {
  const source = sourceConfig[review.source as keyof typeof sourceConfig];
  const SourceIcon = source.icon;
  const tagColor = tagColors[review.tag] || GREEN;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col gap-4 h-full hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl bg-gray-50 border border-gray-100 flex-shrink-0">
            {review.avatar}
          </div>
          <div>
            <div className="font-black text-gray-900 text-sm">{review.name}</div>
            <div className="text-gray-400 text-xs">{review.date}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <SourceIcon className="text-xs" style={{ color: source.color }} />
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`size-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Guillemets + texte */}
      <div className="relative flex-1">
        <Quote className="size-8 absolute -top-1 -left-1 opacity-10" style={{ color: GREEN }} />
        <p className="text-gray-600 text-sm leading-relaxed italic pl-4">
          "{review.comment}"
        </p>
      </div>

      {/* Tag */}
      <div className="flex items-center justify-between">
        <span
          className="px-2.5 py-1 rounded-full text-[10px] font-black text-white"
          style={{ backgroundColor: tagColor }}
        >
          {review.tag}
        </span>
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className={`size-3.5 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-100'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
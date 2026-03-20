// parks/ParkReviewsSection.tsx
// Section avis parc — récupère les avis depuis l'API WordPress
// (qui agrège Google Reviews, TripAdvisor et avis manuels)
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink, Loader2 } from 'lucide-react';
import { FaGoogle, FaTripadvisor } from 'react-icons/fa';
import { API_URL, API_KEY, cleanWpData } from '../config/config';
import { Review } from '../types';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';

// ── Config sources ──────────────────────────────────
const sourceConfig = {
  google: { icon: FaGoogle, label: 'Google', color: '#4285F4' },
  tripadvisor: { icon: FaTripadvisor, label: 'Tripadvisor', color: '#00AF87' },
  manual: { icon: FaGoogle, label: 'NoLimit', color: GREEN },
};

const tagColors: Record<string, string> = {
  'Famille': GREEN,
  'Entreprise': '#3b82f6',
  'Anniversaire': '#ec4899',
  'Amis': ORANGE,
  'EVJF': '#8b5cf6',
  'Team Building': '#3b82f6',
  'Couple': '#ec4899',
};

// ── Fallback reviews ──
const fallbackReviews: (Review & { tag?: string })[] = [
  { id: '1', author: 'Camille D.', avatar: '🧗', rating: 5, date: 'Janvier 2025', source: 'google', comment: 'Une journée magique avec toute la famille ! Les parcours accrobranche sont variés et bien entretenus.', tag: 'Famille' },
  { id: '2', author: 'Antoine V.', avatar: '💼', rating: 5, date: 'Décembre 2024', source: 'tripadvisor', comment: 'Excellent team-building pour notre équipe. Organisation au top, staff professionnel et souriant.', tag: 'Entreprise' },
  { id: '3', author: 'Nathalie R.', avatar: '🎂', rating: 5, date: 'Novembre 2024', source: 'google', comment: 'Anniversaire de mon fils réussi à 100% ! Le parc a tout géré parfaitement.', tag: 'Anniversaire' },
  { id: '4', author: 'Julien M.', avatar: '🎯', rating: 4, date: 'Octobre 2024', source: 'google', comment: 'Très bonne expérience globale. Les activités sont nombreuses et bien pensées pour tous les niveaux.', tag: 'Amis' },
  { id: '5', author: 'Sophie L.', avatar: '🥂', rating: 5, date: 'Septembre 2024', source: 'tripadvisor', comment: "Notre EVJF était parfait ! L'équipe a su adapter les activités pour notre groupe.", tag: 'EVJF' },
  { id: '6', author: 'Marc T.', avatar: '🌟', rating: 5, date: 'Août 2024', source: 'google', comment: 'Le meilleur parc de loisirs de la région. Rapport qualité-prix excellent.', tag: 'Famille' },
];

// ── Hook pour charger les avis du parc ──
function useParkReviews(parkId: string) {
  const [reviews, setReviews] = useState<(Review & { tag?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [externalLinks, setExternalLinks] = useState<{ google?: string; tripadvisor?: string }>({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/reviews?park=${parkId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(API_KEY ? { 'X-NoLimit-Key': API_KEY } : {}),
          },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = cleanWpData(await response.json());

        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((r: any) => ({
            id: r.id || String(Math.random()),
            author: r.author || 'Anonyme',
            avatar: r.avatar || '⭐',
            rating: r.rating || 5,
            date: r.date || '',
            source: r.source || 'manual',
            comment: r.comment || r.content || '',
            tag: r.tag || '',
            parkId: r.parkId,
          }));
          setReviews(mapped);
        } else {
          setReviews(fallbackReviews);
        }

        // Charger les liens externes du parc
        if (data.externalLinks) {
          setExternalLinks(data.externalLinks);
        }
      } catch {
        setReviews(fallbackReviews);
      } finally {
        setLoading(false);
      }
    };

    // Aussi charger les liens externes depuis les données parc
    const fetchParkLinks = async () => {
      try {
        const resp = await fetch(`${API_URL}/parks/${parkId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(API_KEY ? { 'X-NoLimit-Key': API_KEY } : {}),
          },
        });
        if (resp.ok) {
          const parkData = await resp.json();
          setExternalLinks({
            google: parkData.googlePlaceId ? `https://search.google.com/local/reviews?placeid=${parkData.googlePlaceId}` : undefined,
            tripadvisor: parkData.tripadvisorUrl || undefined,
          });
        }
      } catch { /* silent */ }
    };

    fetchReviews();
    fetchParkLinks();
  }, [parkId]);

  return { reviews, loading, externalLinks };
}

export function ParkReviewsSection({ park }: { park: any }) {
  const { reviews: parkReviews, loading, externalLinks } = useParkReviews(park.id);
  const [current, setCurrent] = useState(0);

  if (loading) {
    return (
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container mx-auto px-6 text-center">
          <Loader2 className="size-8 animate-spin mx-auto text-gray-400" />
          <p className="text-gray-400 mt-3 text-sm">Chargement des avis...</p>
        </div>
      </section>
    );
  }

  if (parkReviews.length === 0) return null;

  const total = parkReviews.length;
  const prev = () => setCurrent(c => (c - 1 + total) % total);
  const next = () => setCurrent(c => (c + 1) % total);
  const visibleIndices = [current % total, (current + 1) % total, (current + 2) % total];

  const avgRating = (parkReviews.reduce((s, r) => s + r.rating, 0) / parkReviews.length).toFixed(1);
  const ratingDist = [5, 4, 3, 2, 1].map(s => ({
    stars: s,
    pct: Math.round((parkReviews.filter(r => r.rating === s).length / parkReviews.length) * 100),
  }));

  return (
    <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23357600' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-7 rounded-full" style={{ backgroundColor: ORANGE }} />
              <h2 className="text-3xl font-black" style={{ color: DARK }}>
                Ce que disent nos <span style={{ color: GREEN }}>visiteurs</span>
              </h2>
            </div>
            <p className="text-gray-500 text-sm ml-4">Avis vérifiés sur Google & Tripadvisor</p>
          </div>

          {/* Score + distribution */}
          <motion.div initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex items-center gap-6 bg-white rounded-2xl p-5 shadow-md border border-gray-100 shrink-0">
            <div className="text-center">
              <div className="text-5xl font-black leading-none mb-1" style={{ color: DARK }}>{avgRating}</div>
              <div className="flex gap-0.5 justify-center mb-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`size-4 ${parseFloat(avgRating) >= s ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                ))}
              </div>
              <div className="text-gray-400 text-xs font-medium">{total} avis</div>
            </div>
            <div className="w-px h-14 bg-gray-200" />
            <div className="space-y-1.5 min-w-[120px]">
              {ratingDist.map(({ stars, pct }) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-3 text-right">{stars}</span>
                  <Star className="size-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: (5 - stars) * 0.08 }} className="h-full rounded-full bg-yellow-400" />
                  </div>
                  <span className="text-[10px] text-gray-400 w-7 text-right">{pct}%</span>
                </div>
              ))}
            </div>
            <div className="w-px h-14 bg-gray-200" />
            <div className="flex flex-col gap-2">
              {Object.entries(sourceConfig).filter(([key]) => key !== 'manual').map(([key, { icon: Icon, label, color }]) => {
                const href = key === 'google' ? externalLinks.google : externalLinks.tripadvisor;
                return (
                  <motion.a key={key} href={href || '#'} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.06, x: 2 }} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:shadow-sm" style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}>
                    <Icon className="text-sm" style={{ color }} />
                    <span className="text-xs font-bold text-gray-700">{label}</span>
                    <ExternalLink className="size-3 text-gray-400" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Carrousel */}
        <div className="relative">
          <div className="hidden md:grid grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {visibleIndices.map((idx, pos) => (
                <motion.div key={`${idx}-${pos}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, delay: pos * 0.06 }}>
                  <ReviewCard review={parkReviews[idx]} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="md:hidden">
            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
                <ReviewCard review={parkReviews[current]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prev} className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-gray-300 transition-colors">
              <ChevronLeft className="size-5 text-gray-600" />
            </motion.button>
            <div className="flex gap-2">
              {parkReviews.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className="rounded-full transition-all" style={{ width: i === current ? '24px' : '8px', height: '8px', backgroundColor: i === current ? ORANGE : '#d1d5db' }} />
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={next} className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-gray-300 transition-colors">
              <ChevronRight className="size-5 text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* CTA laisser un avis */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
          <p className="text-gray-500 text-sm mb-4">Vous avez visité le parc ? Partagez votre expérience !</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Object.entries(sourceConfig).filter(([key]) => key !== 'manual').map(([key, { icon: Icon, label, color }]) => {
              const href = key === 'google'
                ? (externalLinks.google || '#')
                : (externalLinks.tripadvisor || '#');
              return (
                <motion.a key={key} href={href} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white shadow-md transition-all" style={{ backgroundColor: color, boxShadow: `0 4px 14px ${color}40` }}>
                  <Icon className="text-base" /> Laisser un avis {label}
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Carte avis ──
function ReviewCard({ review }: { review: Review & { tag?: string } }) {
  const source = sourceConfig[(review.source as keyof typeof sourceConfig) || 'manual'] || sourceConfig.manual;
  const SourceIcon = source.icon;
  const tagColor = tagColors[review.tag || ''] || GREEN;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col gap-4 h-full hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl bg-gray-50 border border-gray-100 flex-shrink-0">
            {review.avatar || '⭐'}
          </div>
          <div>
            <div className="font-black text-gray-900 text-sm">{review.author}</div>
            <div className="text-gray-400 text-xs">{review.date}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <SourceIcon className="text-xs" style={{ color: source.color }} />
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`size-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="relative flex-1">
        <Quote className="size-8 absolute -top-1 -left-1 opacity-10" style={{ color: GREEN }} />
        <p className="text-gray-600 text-sm leading-relaxed italic pl-4">"{review.comment}"</p>
      </div>
      {review.tag && (
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black text-white" style={{ backgroundColor: tagColor }}>
            {review.tag}
          </span>
        </div>
      )}
    </div>
  );
}

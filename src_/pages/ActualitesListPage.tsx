// pages/ActualitesListPage.tsx
// Page de listing de toutes les actualités globales (tous parcs confondus)
// Route: /actualites
// Données depuis useActualitesData (WordPress + fallback)

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, ChevronLeft, Sparkles, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useActualitesData } from '../hooks/useActualitesData';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

export function ActualitesListPage() {
  const { data, loading } = useActualitesData();
  const [activeFilter, setActiveFilter] = useState('all');

  // Catégories dynamiques extraites des articles
  const categories = [
    'all',
    ...Array.from(new Set(data.articles.map(a => a.isEvenement ? 'Événement' : 'Actualité'))),
  ];

  const filtered = activeFilter === 'all'
    ? data.articles
    : data.articles.filter(a =>
        activeFilter === 'Événement' ? a.isEvenement : !a.isEvenement
      );

  const heroImage = data.articles[0]?.image ||
    'https://images.unsplash.com/photo-1653154138513-ed13199917e2?w=1200';

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Actualités" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111]/70 via-[#111]/50 to-[#111]/80" />

        {/* Bouton retour accueil */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-6 left-6 z-20"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/25 hover:bg-white/25 transition-all"
          >
            <ChevronLeft className="size-4" />
            Retour à l'accueil
          </Link>
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-6"
          >
            <Sparkles className="size-4" style={{ color: ORANGE }} />
            <span className="text-white text-sm font-medium">NoLimit Aventure</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-2xl"
          >
            Actualités &{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(to right, ${ORANGE}, #ff9a3c)` }}
            >
              Événements
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-white/80"
          >
            Toutes les nouveautés et événements de nos parcs
          </motion.p>
        </div>
      </section>

      {/* ── Filtres + Liste ── */}
      <section className="relative -mt-12 pb-20 z-20">
        <div className="container mx-auto px-4">

          {/* Barre de filtres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6 mb-12 max-w-4xl mx-auto"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(cat)}
                  className="px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-md"
                  style={{
                    backgroundColor: activeFilter === cat ? GREEN : 'white',
                    color: activeFilter === cat ? 'white' : '#374151',
                    border: `2px solid ${activeFilter === cat ? GREEN : '#e5e7eb'}`,
                  }}
                >
                  {cat === 'all' ? 'Toutes' : cat === 'Événement' ? '📅 Événements' : '📰 Actualités'}
                </motion.button>
              ))}
            </div>
            <div className="text-center mt-4 text-sm text-gray-500">
              {loading ? (
                <span className="text-gray-400">Chargement...</span>
              ) : (
                <>
                  <span className="font-bold text-lg" style={{ color: GREEN }}>{filtered.length}</span>
                  {' '}article{filtered.length > 1 ? 's' : ''}
                </>
              )}
            </div>
          </motion.div>

          {/* Skeleton loading */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-10 bg-gray-200 rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grille d'articles */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {filtered.map((actu, index) => (
                <motion.div
                  key={actu.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group"
                >
                  <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={actu.image}
                        alt={actu.titre}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Badge */}
                      <div
                        className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-black text-white shadow"
                        style={{ backgroundColor: actu.isEvenement ? ORANGE : GREEN }}
                      >
                        {actu.isEvenement ? '📅 Événement' : '📰 Actualité'}
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                        <Calendar className="size-3.5" />
                        {formatDate(actu.date)}
                      </div>

                      <h3
                        className="text-lg font-black mb-2 leading-tight group-hover:text-green-700 transition-colors"
                        style={{ color: DARK }}
                      >
                        {actu.titre}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3 mb-6">
                        {actu.extrait}
                      </p>

                      <div className="flex flex-col gap-2">
                        <Link
                          to={actu.lien}
                          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-all hover:shadow-lg hover:gap-3"
                          style={{ backgroundColor: GREEN }}
                        >
                          Lire la suite
                          <ArrowRight className="size-4" />
                        </Link>

                        {actu.isEvenement && actu.lienInscription && (
                          <Link
                            to={actu.lienInscription}
                            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-all hover:shadow-lg"
                            style={{ backgroundColor: ORANGE }}
                          >
                            <UserPlus className="size-4" />
                            S'inscrire
                          </Link>
                        )}
                      </div>
                    </div>

                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: actu.isEvenement ? ORANGE : GREEN }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Aucun résultat */}
          {!loading && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Aucune actualité</h3>
              <p className="text-gray-500 mb-6">Pas de contenu dans cette catégorie pour le moment</p>
              <button
                onClick={() => setActiveFilter('all')}
                className="px-6 py-3 rounded-xl font-bold text-white"
                style={{ backgroundColor: GREEN }}
              >
                Voir toutes les actus
              </button>
            </motion.div>
          )}

          {/* Retour accueil en bas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm border-2 transition-all hover:shadow-lg group"
              style={{ borderColor: GREEN, color: GREEN }}
            >
              <ChevronLeft className="size-5 group-hover:-translate-x-0.5 transition-transform" />
              Retour à l'accueil
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

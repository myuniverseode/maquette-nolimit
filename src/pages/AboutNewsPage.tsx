// pages/AboutNewsPage.tsx — Actualités
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const categories = ['Tout', 'Nouveauté', 'Événement', 'Innovation', 'Promo', 'Portrait'];

const articles = [
  {
    cat: 'Nouveauté',
    catColor: GREEN,
    date: '15 mars 2025',
    title: 'Ouverture d\'un 6ème parc à Toulouse',
    desc: 'On pose nos arbres dans le Sud ! Notre nouveau parc toulousain ouvre ses portes en avril 2025, avec 3 parcours inédits et une via ferrata de 800m.',
    reading: '3 min',
    big: true,
    emoji: '🎊',
  },
  {
    cat: 'Innovation',
    catColor: '#8b5cf6',
    date: '1er mars 2025',
    title: 'Nouvelle via ferrata inaugurée à Nemours',
    desc: 'Un parcours de 1,2 km taillé dans la roche, avec 4 niveaux de difficulté. Ouverture officielle le 1er avril.',
    reading: '2 min',
    big: false,
    emoji: '🧗',
  },
  {
    cat: 'Promo',
    catColor: ORANGE,
    date: 'Jusqu\'au 31 mars',
    title: '-20% sur les réservations groupe',
    desc: 'Ce mois-ci uniquement : -20% pour tout groupe de 8 personnes et plus. Valable sur tous nos parcs.',
    reading: '1 min',
    big: false,
    emoji: '🎁',
  },
  {
    cat: 'Portrait',
    catColor: '#ec4899',
    date: '20 fév. 2025',
    title: 'Rencontrez Laura, notre cheffe monitrice à Chevry',
    desc: 'De championne de grimpe à formatrice, Laura nous raconte comment elle a transformé sa passion en vocation. Une interview sans filtre.',
    reading: '5 min',
    big: false,
    emoji: '🌟',
  },
  {
    cat: 'Événement',
    catColor: '#f59e0b',
    date: 'Déc. 2024',
    title: 'Noël en forêt : le bilan d\'une édition magique',
    desc: '3 500 visiteurs, des lumières dans les arbres, des ateliers créatifs pour enfants. Retour sur notre édition Noël qui a battu tous les records.',
    reading: '4 min',
    big: false,
    emoji: '🎄',
  },
  {
    cat: 'Innovation',
    catColor: '#8b5cf6',
    date: 'Oct. 2024',
    title: 'Parcours Black : le retour du plus difficile de France',
    desc: 'Réouvert après refonte complète, le parcours Black de Nemours s\'affirme comme le plus technique du réseau. Uniquement pour les profils confirmés.',
    reading: '3 min',
    big: false,
    emoji: '🖤',
  },
];

export function AboutNewsPage() {
  const [filter, setFilter] = useState('Tout');

  const filtered = filter === 'Tout' ? articles : articles.filter(a => a.cat === filter);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: `linear-gradient(135deg, ${DARK} 0%, #1a2a00 100%)` }}>
        <motion.div className="absolute top-10 right-20 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: GREEN, opacity: 0.18 }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 9, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: ORANGE, opacity: 0.13 }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 11, repeat: Infinity, delay: 3 }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Crect x='0' y='0' width='1' height='60'/%3E%3Crect x='0' y='0' width='60' height='1'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />

        <div className="container mx-auto px-6 relative z-10">
          <Link to="/about" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-10 transition-colors">
            <ArrowLeft className="size-4" /> Retour à À propos
          </Link>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 text-white">
              🗞️ Actualités
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-5">
              Quoi de<br />
              <span style={{ color: ORANGE }}>neuf ?</span>
            </h1>
            <p className="text-lg text-white/65 leading-relaxed max-w-xl">
              Nouveautés, événements, portraits d'équipe, promos… Le flux direct des coulisses de NoLimit Aventure.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none">
            <path d="M0,20 C360,60 900,0 1440,40 L1440,60 L0,60 Z" className="fill-white" />
          </svg>
        </div>
      </section>

      {/* ── FILTRES ── */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(cat)}
                className="px-5 py-2.5 rounded-xl text-sm font-black border-2 transition-all"
                style={filter === cat
                  ? { backgroundColor: GREEN, borderColor: GREEN, color: 'white' }
                  : { backgroundColor: 'white', borderColor: '#e5e7eb', color: '#6b7280' }
                }
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-6xl mx-auto">
            {filtered.map((article, i) => (
              <motion.article
                key={i}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -8 }}
                className={`group bg-white rounded-3xl overflow-hidden shadow-sm border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all cursor-pointer flex flex-col ${article.big ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                {/* Image / color block */}
                <div
                  className={`relative overflow-hidden ${article.big ? 'h-56' : 'h-44'}`}
                  style={{ background: `linear-gradient(135deg, ${article.catColor}30, ${article.catColor}10)` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-20">
                    {article.emoji}
                  </div>
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center text-7xl"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: 'spring' }}
                  >
                    {article.emoji}
                  </motion.div>
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1.5 rounded-full text-xs font-black text-white backdrop-blur-sm" style={{ backgroundColor: `${article.catColor}EE` }}>
                      {article.cat}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-full text-[10px] text-white font-medium">
                    {article.reading} de lecture
                  </div>
                  {/* Date en bas */}
                  <div className="absolute bottom-0 left-0 right-0 px-5 py-3 bg-gradient-to-t from-black/40 to-transparent">
                    <span className="text-xs text-white/80 font-medium">{article.date}</span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className={`font-black mb-3 leading-tight ${article.big ? 'text-2xl' : 'text-lg'}`} style={{ color: DARK }}>
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{article.desc}</p>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-black"
                    style={{ color: article.catColor }}
                  >
                    Lire l'article <ArrowRight className="size-3.5" />
                  </motion.div>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <div className="font-black text-xl text-gray-400">Aucun article dans cette catégorie</div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-16 overflow-hidden" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-4xl font-black text-white mb-3">
              Ne ratez rien de <span style={{ color: ORANGE }}>l'aventure.</span>
            </h2>
            <p className="text-white/55">Newsletter mensuelle · Pas de spam · Désinscription libre</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="votre@email.fr"
              className="flex-1 px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors text-sm font-medium"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-7 py-4 rounded-2xl font-black text-white flex items-center gap-2 shrink-0"
              style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}
            >
              <Sparkles className="size-4" /> S'abonner
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── NAV ── */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 flex items-center justify-between max-w-5xl">
          <Link to="/about/emplois" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 font-bold text-sm transition-colors">
            <ArrowLeft className="size-4" /> Nos Emplois
          </Link>
          <Link to="/about/partenaires" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
            Nos Partenaires <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// pages/AboutNewsPage.tsx — Actualités avec bloc texte, actu parcs incluses, sidebar
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_URL, API_KEY } from '../config/config';
import { AboutSidebar } from '../components/AboutSidebar';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const CAT_COLORS: Record<string, string> = {
  'Nouveauté': GREEN, 'Innovation': '#8b5cf6', 'Promo': ORANGE,
  'Portrait': '#ec4899', 'Événement': '#f59e0b', 'Parc': '#3b82f6',
};

function getCatColor(cat: string): string { return CAT_COLORS[cat] || GREEN; }

const FALLBACK_ARTICLES = [
  { cat: 'Nouveauté', catColor: GREEN, date: '15 mars 2025', title: "Ouverture d'un 6ème parc", desc: 'Nouveau parc toulousain avec 3 parcours inédits.', reading: '3 min', big: true, emoji: '🎊', slug: '', parkName: '' },
  { cat: 'Innovation', catColor: '#8b5cf6', date: '1er mars 2025', title: 'Nouvelle via ferrata à Nemours', desc: 'Parcours de 1,2 km taillé dans la roche.', reading: '2 min', big: false, emoji: '🧗', slug: '', parkName: 'Nemours' },
  { cat: 'Promo', catColor: ORANGE, date: "Jusqu'au 31 mars", title: '-20% sur les réservations groupe', desc: 'Valable sur tous nos parcs.', reading: '1 min', big: false, emoji: '🎁', slug: '', parkName: '' },
];

export function AboutNewsPage() {
  const [filter, setFilter] = useState('Tout');
  const [articles, setArticles] = useState(FALLBACK_ARTICLES);
  const [categories, setCategories] = useState(['Tout', 'Nouveauté', 'Événement', 'Innovation', 'Promo', 'Parc']);

  useEffect(() => {
    // Charger les actualités générales
    const fetchNews = fetch(`${API_URL}/news?per_page=12`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    }).then(r => r.ok ? r.json() : []).catch(() => []);

    // Charger aussi les actualités des parcs (si l'API supporte un filtre)
    const fetchParkNews = fetch(`${API_URL}/news?per_page=6&type=park`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    }).then(r => r.ok ? r.json() : []).catch(() => []);

    Promise.all([fetchNews, fetchParkNews]).then(([newsData, parkData]) => {
      const allArticles: any[] = [];

      // Mapper les actus générales
      if (Array.isArray(newsData) && newsData.length > 0) {
        newsData.forEach((a: any, i: number) => {
          allArticles.push({
            cat: a.category || 'Actualité', catColor: getCatColor(a.category || ''),
            date: a.date || '', title: a.title || '', desc: a.excerpt || '',
            reading: `${Math.max(1, Math.round((a.excerpt || '').split(' ').length / 200))} min`,
            big: a.featured || i === 0, emoji: '📰', slug: a.slug || '',
            parkName: a.parkName || '',
          });
        });
      }

      // Mapper les actus parcs
      if (Array.isArray(parkData) && parkData.length > 0) {
        parkData.forEach((a: any) => {
          allArticles.push({
            cat: 'Parc', catColor: '#3b82f6',
            date: a.date || '', title: a.title || '', desc: a.excerpt || '',
            reading: `${Math.max(1, Math.round((a.excerpt || '').split(' ').length / 200))} min`,
            big: false, emoji: '🌲', slug: a.slug || '',
            parkName: a.parkName || a.park || '',
          });
        });
      }

      if (allArticles.length > 0) {
        setArticles(allArticles);
        const cats = ['Tout', ...Array.from(new Set(allArticles.map(a => a.cat)))];
        setCategories(cats);
      }
    });
  }, []);

  const filtered = filter === 'Tout' ? articles : articles.filter(a => a.cat === filter);

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: `linear-gradient(135deg, ${DARK} 0%, #1a2a00 100%)` }}>
        <motion.div className="absolute top-10 right-20 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: GREEN, opacity: 0.18 }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 9, repeat: Infinity }} />
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/about" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-10 transition-colors">
            <ArrowLeft className="size-4" /> Retour à Découvrir
          </Link>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 text-white">🗞️ Actualités</div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-5">Quoi de<br /><span style={{ color: ORANGE }}>neuf ?</span></h1>
            <p className="text-lg text-white/65 leading-relaxed max-w-xl">Nouveautés, événements, portraits, promos — le flux direct de NoLimit Aventure et de tous nos parcs.</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none">
            <path d="M0,20 C360,60 900,0 1440,40 L1440,60 L0,60 Z" className="fill-white" />
          </svg>
        </div>
      </section>

      {/* CONTENU AVEC SIDEBAR */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <AboutSidebar />

          <main className="flex-1 min-w-0">

            {/* Bloc texte intro */}
            <section className="py-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="rounded-3xl p-8 md:p-10" style={{ background: `linear-gradient(135deg, ${GREEN}08, ${ORANGE}06)`, border: `2px solid ${GREEN}15` }}>
                <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: DARK }}>Restez informés</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Retrouvez ici toutes les actualités NoLimit Aventure : nouveaux parcours, événements spéciaux, promotions en cours,
                  portraits d'équipe, et les dernières nouvelles de chacun de nos 5 parcs. Un concentré d'aventure en temps réel.
                </p>
              </motion.div>
            </section>

            {/* FILTRES */}
            <section className="py-6">
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(cat)}
                    className="px-5 py-2.5 rounded-xl text-sm font-black border-2 transition-all"
                    style={filter === cat
                      ? { backgroundColor: GREEN, borderColor: GREEN, color: 'white' }
                      : { backgroundColor: 'white', borderColor: '#e5e7eb', color: '#6b7280' }
                    }>{cat}</motion.button>
                ))}
              </div>
            </section>

            {/* ARTICLES */}
            <section className="py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((article, i) => (
                  <motion.article key={i} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }} whileHover={{ y: -8 }}
                    className={`group bg-white rounded-3xl overflow-hidden shadow-sm border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all flex flex-col ${article.big ? 'md:col-span-2' : ''}`}>
                    <Link to={article.slug ? `/actualites/${article.slug}` : '/actualites'} className="flex flex-col flex-1">
                      <div className={`relative overflow-hidden ${article.big ? 'h-48' : 'h-36'}`}
                        style={{ background: `linear-gradient(135deg, ${article.catColor}30, ${article.catColor}10)` }}>
                        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">{article.emoji}</div>
                        <motion.div className="absolute inset-0 flex items-center justify-center text-6xl" whileHover={{ scale: 1.2 }}>{article.emoji}</motion.div>
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-3 py-1.5 rounded-full text-xs font-black text-white backdrop-blur-sm" style={{ backgroundColor: `${article.catColor}EE` }}>{article.cat}</span>
                          {article.parkName && (
                            <span className="px-3 py-1.5 rounded-full text-xs font-black text-white/90 backdrop-blur-sm bg-black/30">📍 {article.parkName}</span>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 px-5 py-3 bg-gradient-to-t from-black/40 to-transparent">
                          <span className="text-xs text-white/80 font-medium">{article.date}</span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className={`font-black mb-2 leading-tight ${article.big ? 'text-xl' : 'text-lg'}`} style={{ color: DARK }}>{article.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed flex-1">{article.desc}</p>
                        <motion.div whileHover={{ x: 4 }} className="mt-4 inline-flex items-center gap-1.5 text-sm font-black" style={{ color: article.catColor }}>
                          Lire l'article <ArrowRight className="size-3.5" />
                        </motion.div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {filtered.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <div className="text-5xl mb-4">📭</div>
                  <div className="font-black text-xl text-gray-400">Aucun article dans cette catégorie</div>
                </motion.div>
              )}
            </section>

            {/* NEWSLETTER */}
            <section className="py-12 rounded-3xl overflow-hidden" style={{ backgroundColor: DARK }}>
              <div className="px-8 md:px-12">
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
                  <div className="text-4xl mb-3">📬</div>
                  <h2 className="text-3xl font-black text-white mb-2">Ne ratez rien de <span style={{ color: ORANGE }}>l'aventure.</span></h2>
                  <p className="text-white/55 text-sm">Newsletter mensuelle · Pas de spam</p>
                </motion.div>
                <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <input type="email" placeholder="votre@email.fr"
                    className="flex-1 px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-white/50 text-sm font-medium" />
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-7 py-4 rounded-2xl font-black text-white flex items-center gap-2 shrink-0"
                    style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}>
                    <Sparkles className="size-4" /> S'abonner
                  </motion.button>
                </div>
              </div>
            </section>

            {/* NAV */}
            <div className="flex items-center justify-between py-10">
              <Link to="/about/emplois" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 font-bold text-sm"><ArrowLeft className="size-4" /> Nos Emplois</Link>
              <Link to="/about/partenaires" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
                Nos Partenaires <ArrowRight className="size-4" />
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// pages/AboutParksPage.tsx — Nos Parcs avec carte en premier, bloc texte, sidebar
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star, MapPin, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useParksData } from '../hooks/useParksData';
import { AboutSidebar } from '../components/AboutSidebar';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

export function AboutParksPage() {
  const { parks } = useParksData();

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: `linear-gradient(135deg, #1a3a00 0%, ${GREEN} 60%, #4a9d00 100%)` }}>
        <motion.div className="absolute top-10 right-10 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: ORANGE, opacity: 0.2 }} animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 9, repeat: Infinity }} />
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/about" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-10 transition-colors">
            <ArrowLeft className="size-4" /> Retour à Découvrir
          </Link>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 text-white">📍 Nos Parcs</div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-5">
              {parks.length} parcs,<br /><span style={{ color: ORANGE }}>une famille.</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">Chaque parc a son caractère, ses paysages, ses activités signature.</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none">
            <path d="M0,20 C360,60 720,0 1080,40 C1260,55 1380,20 1440,30 L1440,60 L0,60 Z" className="fill-white" />
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
                <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: DARK }}>Un réseau de parcs à taille humaine</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Implantés en Île-de-France, dans le Loiret et en Eure-et-Loir, nos 5 parcs partagent les mêmes exigences de qualité, de sécurité et d'accueil.
                  Chaque site est unique par sa forêt, ses parcours et son ambiance — mais tous offrent la même promesse NoLimit : des moments inoubliables en pleine nature.
                </p>
              </motion.div>
            </section>

            {/* CARTE (avant les parcs) */}
            <section className="py-10">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: DARK }}>
                  Toujours plus <span style={{ color: GREEN }}>proches de vous.</span>
                </h2>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="rounded-3xl overflow-hidden border-2 border-gray-200 shadow-lg">
                <div className="h-72 flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${GREEN}15, ${ORANGE}10)` }}>
                  <div className="text-center">
                    <div className="text-6xl mb-3">🗺️</div>
                    <div className="font-black text-lg" style={{ color: DARK }}>Carte interactive des parcs</div>
                    <div className="text-gray-400 text-sm mt-1">Intégration Google Maps / Mapbox</div>
                  </div>
                  {parks.map((park, i) => (
                    <motion.div key={park.id} className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: i % 2 === 0 ? GREEN : ORANGE, top: `${20 + i * 12}%`, left: `${20 + i * 14}%` }}
                      animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
                  ))}
                </div>
              </motion.div>
            </section>

            {/* GRILLE PARCS */}
            <section className="py-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {parks.map((park, i) => (
                  <motion.div key={park.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }} whileHover={{ y: -8 }}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all">
                    <div className="relative h-48 overflow-hidden">
                      {park.image && <img src={park.image} alt={park.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                        <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-black text-gray-900 text-sm">{park.rating}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-black text-white">{park.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin className="size-3.5 text-white/70" />
                          <span className="text-white/70 text-xs">{park.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {park.activities.slice(0, 3).map((act, ai) => (
                          <span key={ai} className="px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ backgroundColor: `${GREEN}12`, color: GREEN }}>{act}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="size-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{park.capacity} pers.</span>
                        </div>
                        <div><span className="text-xs text-gray-400">Dès </span><span className="text-xl font-black" style={{ color: ORANGE }}>{park.minPrice}€</span></div>
                      </div>
                      <Link to={`/parc/${park.id}`} className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-black text-sm text-white"
                        style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
                        Visiter le parc <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
                <Link to="/parcs" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white text-base"
                  style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)`, boxShadow: `0 8px 28px ${ORANGE}40` }}>
                  <Zap className="size-5" /> Trouver le parc près de chez moi <ArrowRight className="size-5" />
                </Link>
              </motion.div>
            </section>

            {/* NAV */}
            <div className="flex items-center justify-between py-10">
              <Link to="/about/valeurs" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 font-bold text-sm"><ArrowLeft className="size-4" /> Notre ADN</Link>
              <Link to="/about/emplois" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
                Nos Emplois <ArrowRight className="size-4" />
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

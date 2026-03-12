// pages/AboutHistorePage.tsx — Notre Histoire
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Award, TrendingUp, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { parks } from '../data/parks';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const timeline = [
  {
    year: '2015',
    icon: '🌲',
    title: 'Naissance à Chevry',
    desc: 'Trois amis passionnés de nature et de sports outdoor ouvrent le premier parc NoLimit Aventure en Essonne. L\'objectif : rendre l\'aventure accessible à tous, en plein cœur de la forêt.',
    color: GREEN,
    side: 'left',
  },
  {
    year: '2017',
    icon: '📍',
    title: 'Nemours nous appelle',
    desc: 'Face au succès fulgurant du premier site, on ouvre à Nemours. La formule prend, les familles adorent, les groupes reviennent.',
    color: ORANGE,
    side: 'right',
  },
  {
    year: '2019',
    icon: '🏆',
    title: 'Montargis & la croissance',
    desc: 'Troisième parc, première équipe de +30 personnes. On commence à penser "réseau" plutôt que "parc unique". L\'ADN NoLimit prend forme.',
    color: GREEN,
    side: 'left',
  },
  {
    year: '2021',
    icon: '🌿',
    title: 'Digny : la renaissance post-Covid',
    desc: 'Malgré la tempête sanitaire, on inaugure Digny. Pari osé, succès immédiat. La nature, ça manquait à tout le monde.',
    color: ORANGE,
    side: 'right',
  },
  {
    year: '2022',
    icon: '🚀',
    title: 'Le Coudray & l\'ambition nationale',
    desc: 'Cinquième parc, premier label "Partenaire ONF". On pose les bases d\'une expansion en France entière.',
    color: GREEN,
    side: 'left',
  },
  {
    year: '2025',
    icon: '✨',
    title: 'Aujourd\'hui & demain',
    desc: `${parks.length} parcs, 75 000+ aventuriers par an, et un cap : devenir le leader incontesté du parc aventure en France d'ici 2027.`,
    color: ORANGE,
    side: 'right',
  },
];

const stats = [
  { val: `${parks.length}`, label: 'Parcs', icon: '🌲' },
  { val: '10', label: 'Ans', icon: '🏆' },
  { val: '75k+', label: 'Aventuriers/an', icon: '🧗' },
  { val: '98%', label: 'Satisfaits', icon: '⭐' },
];

export function AboutHistorePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 overflow-hidden" style={{ backgroundColor: DARK }}>
        <motion.div className="absolute top-16 right-16 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: GREEN, opacity: 0.15 }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 9, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: ORANGE, opacity: 0.12 }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 11, repeat: Infinity, delay: 2 }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Crect x='0' y='0' width='1' height='60'/%3E%3Crect x='0' y='0' width='60' height='1'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />

        <div className="container mx-auto px-6 relative z-10">
          <Link to="/about" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-10 transition-colors">
            <ArrowLeft className="size-4" /> Retour à À propos
          </Link>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 text-white">
              🏔️ Notre Histoire
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-5">
              10 ans<br />
              <span style={{ color: ORANGE }}>d'aventure.</span>
            </h1>
            <p className="text-lg text-white/65 leading-relaxed max-w-xl">
              De trois amis et une idée folle à un réseau de {parks.length} parcs — l'histoire de NoLimit Aventure, c'est surtout l'histoire de gens qui ont dit oui à leurs rêves.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none">
            <path d="M0,30 C400,60 800,0 1200,40 C1350,55 1420,25 1440,30 L1440,60 L0,60 Z" className="fill-white" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.09 }} whileHover={{ y: -4 }} className="text-center p-5 rounded-3xl border-2 border-gray-100 hover:border-green-200 hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-3xl font-black" style={{ color: DARK }}>{s.val}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: DARK }}>Notre <span style={{ color: GREEN }}>timeline</span></h2>
            <p className="text-gray-500">Une étape à la fois, un parc à la fois.</p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Ligne centrale */}
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: item.side === 'left' ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex items-center gap-8 ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Contenu */}
                  <div className="flex-1 md:w-[calc(50%-2rem)]">
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-3xl p-7 shadow-sm border-2 hover:shadow-lg transition-all"
                      style={{ borderColor: `${item.color}30` }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{item.emoji || item.icon}</span>
                        <div className="px-3 py-1 rounded-full text-xs font-black text-white" style={{ backgroundColor: item.color }}>
                          {item.year}
                        </div>
                      </div>
                      <h3 className="text-xl font-black mb-2" style={{ color: DARK }}>{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                  </div>

                  {/* Point central */}
                  <div className="hidden md:flex w-8 h-8 rounded-full border-4 border-white shadow-lg items-center justify-center flex-shrink-0 z-10 text-lg" style={{ backgroundColor: item.color }}>
                    {item.icon}
                  </div>

                  {/* Espace opposé */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VISION ── */}
      <section className="py-20 overflow-hidden" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold bg-white/10 border border-white/20 text-white">
                  <Award className="size-4" style={{ color: ORANGE }} /> Notre vision 2027
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
                  Leader national du <span style={{ color: ORANGE }}>parc aventure.</span>
                </h2>
                <p className="text-white/65 leading-relaxed mb-8">
                  Notre objectif est clair : créer le réseau de parcs aventure le plus qualitatif de France, avec une présence dans chaque grande région d'ici 2027. Pas pour grandir pour grandir — mais pour que chaque famille en France ait un NoLimit à moins d'une heure de chez elle.
                </p>
                <Link to="/about/parcs" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-white text-sm" style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}>
                  Voir nos parcs <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🌍', title: '15 parcs', sub: 'objectif 2027' },
                  { icon: '🧗', title: '150k+', sub: 'aventuriers / an' },
                  { icon: '🌿', title: '100%', sub: 'écoresponsable' },
                  { icon: '💼', title: '500+', sub: 'emplois créés' },
                ].map(({ icon, title, sub }, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.04 }} className="rounded-2xl p-5 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)' }}>
                    <div className="text-3xl mb-2">{icon}</div>
                    <div className="text-xl font-black text-white">{title}</div>
                    <div className="text-white/45 text-xs mt-0.5">{sub}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── NAV SUIVANT ── */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 flex items-center justify-between max-w-5xl">
          <Link to="/about" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 font-bold text-sm transition-colors">
            <ArrowLeft className="size-4" /> Retour
          </Link>
          <Link to="/about/valeurs" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
            Notre ADN <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

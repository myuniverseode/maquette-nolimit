// pages/AboutPage.tsx — Refonte complète · hub de navigation
import { motion } from 'framer-motion';
import {
  History, Target, MapPin, Briefcase, Newspaper, Users,
  ArrowRight, Star, Zap, Award, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { parks } from '../data/parks';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const navCards = [
  {
    to: '/about/histoire',
    icon: History,
    emoji: '🏔️',
    title: 'Notre Histoire',
    desc: 'De Chevry à la France entière, 10 ans d\'aventure collective.',
    color: GREEN,
    bg: '#f0f7e8',
  },
  {
    to: '/about/valeurs',
    icon: Target,
    emoji: '💚',
    title: 'Notre ADN',
    desc: 'Sécurité, nature, plaisir : les 5 piliers qui nous définissent.',
    color: ORANGE,
    bg: '#fef3ea',
  },
  {
    to: '/about/parcs',
    icon: MapPin,
    emoji: '📍',
    title: 'Nos Parcs',
    desc: `${parks.length} parcs uniques, chacun avec son caractère et ses paysages.`,
    color: GREEN,
    bg: '#f0f7e8',
  },
  {
    to: '/about/emplois',
    icon: Briefcase,
    emoji: '🧗',
    title: 'Nos Emplois',
    desc: 'Fais de ta passion ton métier. On recrute toute l\'année.',
    color: ORANGE,
    bg: '#fef3ea',
  },
  {
    to: '/about/actualites',
    icon: Newspaper,
    emoji: '🗞️',
    title: 'Actualités',
    desc: 'Nouveautés, événements et coulisses du parc en temps réel.',
    color: GREEN,
    bg: '#f0f7e8',
  },
  {
    to: '/about/partenaires',
    icon: Users,
    emoji: '🤝',
    title: 'Partenaires',
    desc: 'Les organisations qui partagent nos valeurs et notre vision.',
    color: ORANGE,
    bg: '#fef3ea',
  },
];

const stats = [
  { val: `${parks.length}`, label: 'Parcs en France', icon: '🌲' },
  { val: '10', label: 'Ans d\'expérience', icon: '🏆' },
  { val: '75k+', label: 'Aventuriers / an', icon: '🧗' },
  { val: '98%', label: 'Clients satisfaits', icon: '⭐' },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden" style={{ backgroundColor: DARK }}>
        {/* Blobs animés */}
        <motion.div
          className="absolute top-20 left-10 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: GREEN, opacity: 0.18 }}
          animate={{ scale: [1, 1.25, 1], x: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 right-20 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: ORANGE, opacity: 0.14 }}
          animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Grille subtile */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Crect x='0' y='0' width='1' height='60'/%3E%3Crect x='0' y='0' width='60' height='1'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />

        <div className="container mx-auto px-6 relative z-10 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-bold border border-white/20 bg-white/10 backdrop-blur-sm text-white"
            >
              <Award className="size-4" style={{ color: ORANGE }} />
              Depuis 2015 · Leader français du parc aventure
            </motion.div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6">
              On est<br />
              <span style={{ color: ORANGE }}>NoLimit.</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl leading-relaxed mb-10">
              Une équipe de passionnés qui croit dur comme fer que l'aventure, ça change la vie. 
              10 ans à construire des expériences qui marquent, des forêts aux falaises.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/about/histoire"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-white text-base"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)`, boxShadow: `0 8px 28px ${ORANGE}45` }}
              >
                Notre histoire <ArrowRight className="size-5" />
              </Link>
              <Link
                to="/parcs"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-white border-2 border-white/25 hover:border-white/50 hover:bg-white/10 transition-all"
              >
                Découvrir nos parcs
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Vague de transition */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1440 80" className="w-full h-16 md:h-20" preserveAspectRatio="none">
            <path d="M0,40 C300,80 600,0 900,50 C1100,80 1300,20 1440,50 L1440,80 L0,80 Z" className="fill-white" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="text-center p-6 rounded-3xl border-2 border-gray-100 hover:border-green-200 bg-white hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="text-4xl font-black mb-1" style={{ color: DARK }}>{s.val}</div>
                <div className="text-sm text-gray-500 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NAVIGATION HUB ── */}
      <section className="py-16 pb-28 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-bold border" style={{ backgroundColor: `${GREEN}10`, borderColor: `${GREEN}30`, color: GREEN }}>
              <Zap className="size-4" /> Tout sur NoLimit Aventure
            </div>
            <h2 className="text-4xl md:text-5xl font-black" style={{ color: DARK }}>
              Explorez notre <span style={{ color: GREEN }}>univers</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {navCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="group"
                >
                  <Link to={card.to} className="block h-full">
                    <div className="h-full bg-white rounded-3xl p-7 shadow-sm border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all flex flex-col gap-5">
                      {/* Icon + emoji */}
                      <div className="flex items-start justify-between">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: card.bg }}
                        >
                          {card.emoji}
                        </div>
                        <motion.div
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          className="w-9 h-9 rounded-xl flex items-center justify-center border-2 border-gray-100 group-hover:border-gray-300 transition-all mt-1"
                        >
                          <ArrowRight className="size-4 text-gray-400" />
                        </motion.div>
                      </div>
                      {/* Texte */}
                      <div>
                        <h3 className="text-xl font-black mb-2" style={{ color: DARK }}>{card.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                      </div>
                      {/* Barre couleur en bas */}
                      <div className="mt-auto pt-5 border-t border-gray-100">
                        <div
                          className="h-1 w-10 rounded-full group-hover:w-20 transition-all duration-500"
                          style={{ backgroundColor: card.color }}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

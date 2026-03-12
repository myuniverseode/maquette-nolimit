// pages/AboutValuesPage.tsx — Notre ADN & Valeurs
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Shield, Leaf, Heart, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const values = [
  {
    icon: Shield,
    emoji: '🛡️',
    title: 'Sécurité avant tout',
    desc: 'Chaque visiteur repart sain et sauf. Sans exception. Nos équipements sont certifiés CE, contrôlés quotidiennement, et nos moniteurs sont diplômés d\'État avec recyclage annuel.',
    details: ['Matériel certifié CE/EN', 'Contrôle technique chaque matin', 'Moniteurs diplômés d\'État', 'Formations premiers secours annuelles'],
    color: '#3b82f6',
    bg: '#eff6ff',
    num: '01',
  },
  {
    icon: Leaf,
    emoji: '🌿',
    title: 'Respect de la nature',
    desc: 'Nos parcs sont des espaces vivants. On construit avec la forêt, pas contre elle. Chaque installation est pensée pour laisser le moins de trace possible.',
    details: ['Partenaire ONF officiel', 'Zéro produit chimique', 'Matériaux biosourcés', 'Plan de gestion biodiversité'],
    color: GREEN,
    bg: '#f0fdf4',
    num: '02',
  },
  {
    icon: Heart,
    emoji: '❤️',
    title: 'Plaisir partagé',
    desc: 'L\'aventure ne vaut rien si elle ne crée pas un lien. Entre vous et la nature, entre vous et les autres. On conçoit chaque activité pour générer des souvenirs communs.',
    details: ['Activités multi-niveaux', 'Espaces familles dédiés', 'Photos souvenirs offertes', 'Programme fidélité'],
    color: '#ec4899',
    bg: '#fdf2f8',
    num: '03',
  },
  {
    icon: Star,
    emoji: '⭐',
    title: 'Excellence du service',
    desc: '98% de satisfaction, c\'est bien. 100%, c\'est le cap. On relit chaque avis, on forme sans cesse nos équipes, on améliore chaque détail.',
    details: ['NPS moyen > 70', 'Réponse aux avis sous 24h', 'Formation continue des équipes', 'Audit qualité semestriel'],
    color: '#f59e0b',
    bg: '#fffbeb',
    num: '04',
  },
  {
    icon: TrendingUp,
    emoji: '🚀',
    title: 'Innovation continue',
    desc: 'On ne s\'endort jamais sur nos lauriers. Chaque saison apporte de nouvelles activités, de nouvelles technologies, de nouveaux parcours pour surprendre même les habitués.',
    details: ['1 nouveauté minimum / saison', 'R&D matériel en interne', 'Tests utilisateurs réguliers', 'Veille internationale'],
    color: '#8b5cf6',
    bg: '#f5f3ff',
    num: '05',
  },
];

const manifesto = [
  'L\'aventure n\'est pas réservée aux experts.',
  'La nature mérite mieux que d\'être un décor.',
  'Un souvenir partagé vaut mieux qu\'une photo seule.',
  'On ne finit jamais d\'apprendre à s\'émerveiller.',
  'Chaque défi relevé transforme un peu celui qui l\'affronte.',
];

export function AboutValuesPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #2d6100 100%)` }}>
        <motion.div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl bg-white/10" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: ORANGE, opacity: 0.2 }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }} />

        <div className="container mx-auto px-6 relative z-10">
          <Link to="/about" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-10 transition-colors">
            <ArrowLeft className="size-4" /> Retour à À propos
          </Link>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 text-white">
              💚 Notre ADN
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-5">
              Ce qui nous<br />
              <span style={{ color: ORANGE }}>définit.</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">
              5 valeurs. Pas des mots sur un mur — des engagements concrets qu'on honore chaque jour, dans chaque parc, avec chaque visiteur.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none">
            <path d="M0,20 C500,60 1000,0 1440,40 L1440,60 L0,60 Z" className="fill-white" />
          </svg>
        </div>
      </section>

      {/* ── VALEURS ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className={`flex flex-col md:flex-row gap-8 items-start p-8 rounded-3xl border-2 hover:shadow-lg transition-all ${!isEven ? 'md:flex-row-reverse' : ''}`}
                  style={{ borderColor: `${v.color}25`, backgroundColor: `${v.color}06` }}
                >
                  {/* Numéro + icone */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div className="text-5xl font-black opacity-10" style={{ color: v.color }}>{v.num}</div>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: v.bg }}>
                      {v.emoji}
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-3" style={{ color: DARK }}>{v.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-5">{v.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {v.details.map((d, di) => (
                        <span key={di} className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ backgroundColor: v.bg, color: v.color }}>
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="py-20 overflow-hidden" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
              Ce qu'on <span style={{ color: ORANGE }}>croit.</span>
            </h2>
            <p className="text-white/50">Notre manifeste, cinq convictions qu'on ne négocie pas.</p>
          </motion.div>

          <div className="space-y-4">
            {manifesto.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 8 }}
                className="flex items-center gap-5 p-5 rounded-2xl border border-white/10 hover:border-white/25 transition-all cursor-default"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ backgroundColor: ORANGE }}>
                  {i + 1}
                </div>
                <p className="text-white/85 font-bold text-lg">{line}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NAV ── */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 flex items-center justify-between max-w-5xl">
          <Link to="/about/histoire" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 font-bold text-sm transition-colors">
            <ArrowLeft className="size-4" /> Notre Histoire
          </Link>
          <Link to="/about/parcs" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
            Nos Parcs <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

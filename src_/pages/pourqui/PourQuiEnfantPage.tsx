// pages/PourQuiEnfantPage.tsx — Pour les enfants
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Calendar, Shield, ChevronDown, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { usePourQuiEnfant } from "../../hooks/usePourQuiPages";

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const YELLOW = '#f59e0b';
const PURPLE = '#8b5cf6';
const PINK   = '#ec4899';

const DEFAULT_CHILD_ACTIVITIES = [
  {
    emoji: '🌳',
    name: 'Parcours Découverte',
    ageMin: 5,
    duration: '1h30',
    color: GREEN,
    bg: '#f0fdf4',
    desc: 'Premier contact avec les arbres et la hauteur, en toute douceur. Ponts de lianes, filets et plateformes basses.',
    badges: ['Dès 5 ans', 'Toujours encadré', 'Matériel adapté'],
  },
  {
    emoji: '🏹',
    name: 'Tir à l\'Arc Juniors',
    ageMin: 7,
    duration: '1h',
    color: ORANGE,
    bg: '#fef3ea',
    desc: 'Concentration, précision, satisfaction. Une activité qui développe la motricité et la confiance en soi.',
    badges: ['Dès 7 ans', 'Arcs adaptés', 'Médaille à gagner'],
  },
  {
    emoji: '🧗',
    name: 'Accrob\'Junior',
    ageMin: 8,
    duration: '2h',
    color: YELLOW,
    bg: '#fffbeb',
    desc: 'Le grand parcours accrobranche réservé aux enfants. 3 niveaux progressifs, du sol jusqu\'aux cimes.',
    badges: ['8–14 ans', 'Moniteur dédié', 'Certificat inclus'],
  },
  {
    emoji: '🔍',
    name: 'Chasse au Trésor',
    ageMin: 5,
    duration: '1h30',
    color: PURPLE,
    bg: '#f5f3ff',
    desc: 'Une aventure en forêt avec une vraie carte et de vraies énigmes. Le trésor existe vraiment !',
    badges: ['Dès 5 ans', 'Groupes', 'Goûter offert'],
  },
  {
    emoji: '🪁',
    name: 'Tyrolienne Enfant',
    ageMin: 6,
    duration: '45 min',
    color: PINK,
    bg: '#fdf2f8',
    desc: 'Un moment de vertige contrôlé et de pure joie. La tyrolienne courte spécialement conçue pour les plus jeunes.',
    badges: ['Dès 6 ans', 'Max 40 kg', 'Moniteur au départ'],
  },
  {
    emoji: '🌿',
    name: 'Atelier Nature',
    ageMin: 4,
    duration: '1h',
    color: GREEN,
    bg: '#f0fdf4',
    desc: 'Reconnaissance des plantes, insectes, empreintes d\'animaux. Un éveil naturel encadré par un guide nature.',
    badges: ['Dès 4 ans', 'Petit groupe', 'Carnet offert'],
  },
];

const DEFAULT_SAFETY_POINTS = [
  { icon: '🛡️', title: 'Harnais sur mesure', desc: 'Équipements spécialement dimensionnés pour les enfants, certifiés EN.' },
  { icon: '👨‍🏫', title: 'Moniteurs spécialisés', desc: 'Diplômés BPJEPS ou BAFA, formés à l\'animation enfance.' },
  { icon: '🚑', title: 'Secouriste sur place', desc: 'Un secouriste qualifié est présent sur le parc à tout moment.' },
  { icon: '📏', title: 'Tailles et poids', desc: 'Chaque activité a des critères stricts pour garantir la sécurité. Toujours vérifiés à l\'accueil.' },
];

const DEFAULT_ENFANT_TESTIMONIALS = [
  { text: "Ma fille de 7 ans avait peur au départ. Au bout de 10 minutes, elle ne voulait plus descendre. Les moniteurs sont incroyables avec les enfants.", author: "Sophie L., maman", stars: 5 },
  { text: "L'atelier nature a rendu mes fils curieux de tout ce qui pousse. Depuis, on ne peut plus faire une promenade sans qu'ils identifient les plantes.", author: "Marc D., papa de 2 garçons", stars: 5 },
  { text: "La chasse au trésor était parfaite pour l'anniversaire de mon fils. 12 enfants comblés. Le goûter inclus, un vrai plus !", author: "Aline K.", stars: 5 },
];

const DEFAULT_BIRTHDAY_FEATURES = [
  'Invitation personnalisée offerte',
  'Zone pique-nique réservée',
  'Animation dédiée 1h30',
  'Goûter + boissons inclus',
  'Photo de groupe imprimée',
  'Coffret souvenir pour l\'anniversaire',
];

export function PourQuiEnfantPage() {
  const { data: enfantData } = usePourQuiEnfant();
  const childActivities = enfantData.activities?.length > 0 ? enfantData.activities : DEFAULT_CHILD_ACTIVITIES;
  const safetyPoints = enfantData.safetyPoints?.length > 0 ? enfantData.safetyPoints : DEFAULT_SAFETY_POINTS;
  const testimonials = enfantData.testimonials?.length > 0 ? enfantData.testimonials : DEFAULT_ENFANT_TESTIMONIALS;
  const birthdayFeatures = DEFAULT_BIRTHDAY_FEATURES;
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO playful ── */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <div
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse at 15% 40%, ${YELLOW}50 0%, transparent 40%),
                radial-gradient(ellipse at 80% 25%, ${PURPLE}40 0%, transparent 40%),
                radial-gradient(ellipse at 55% 70%, ${GREEN}60 0%, transparent 50%),
                linear-gradient(160deg, #0d2b04 0%, #1a5c08 40%, #0f1a0a 100%)
              `,
            }}
          />
          {['⭐', '🌟', '✨', '🍃', '🌿', '🦋', '🐞', '🌸'].map((star, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl select-none pointer-events-none"
              style={{ left: `${8 + i * 12}%`, top: `${12 + (i % 3) * 22}%` }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
            >
              {star}
            </motion.div>
          ))}
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-20 container mx-auto px-6 pb-20 md:pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 mb-8">
            <Link to="/" className="text-white/50 hover:text-white text-sm transition-colors">Accueil</Link>
            <span className="text-white/30">/</span>
            <span className="text-white/70 text-sm">Pour qui</span>
            <span className="text-white/30">/</span>
            <span className="text-white text-sm font-bold">Enfant</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 backdrop-blur-sm text-white">
              🌱 Pour les enfants
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6">
              Leur première<br />
              <span style={{ color: YELLOW }}>grande aventure.</span>
            </h1>

            <p className="text-xl text-white/70 leading-relaxed max-w-xl mb-10">
              Des activités pensées et adaptées pour chaque âge, de 4 à 15 ans. Encadrées par des spécialistes passionnés, dans un cadre sécurisé et naturel.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/parcs"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-white"
                style={{ background: `linear-gradient(135deg, ${YELLOW}, #f97316)`, boxShadow: `0 8px 28px ${YELLOW}50`, color: DARK }}
              >
                Découvrir les activités <ArrowRight className="size-5" />
              </Link>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-white border-2 border-white/25 hover:bg-white/10 transition-all"
              >
                Anniversaire enfant →
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <span className="text-white/40 text-xs tracking-widest uppercase">Explorer</span>
          <ChevronDown className="size-5 text-white/40" />
        </motion.div>
      </section>

      {/* ── BLOC TEXTE (NOUVEAU) : orientation famille et anniversaires ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: DARK }}>
              Pour les enfants <span style={{ color: YELLOW }}>en famille</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Nos activités sont conçues pour que les enfants vivent leur aventure en toute sécurité,<br />
              accompagnés de leurs parents ou dans des groupes restreints. <strong>Pas de grandes collectivités</strong> : nous privilégions les groupes à taille humaine pour un encadrement personnalisé.<br />
              Anniversaires, sorties en famille, moments entre cousins – chaque visite est unique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── ACTIVITÉS ENFANT ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: DARK }}>
              6 activités <span style={{ color: GREEN }}>rien que pour eux.</span>
            </h2>
            <p className="text-gray-500">Progressives, encadrées, mémorables.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {childActivities.map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="bg-white rounded-3xl overflow-hidden border-2 hover:shadow-xl transition-all"
                style={{ borderColor: `${act.color}30` }}
              >
                <div className="h-24 flex items-center justify-center text-6xl" style={{ backgroundColor: act.bg }}>
                  {act.emoji}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-black text-xl" style={{ color: DARK }}>{act.name}</h3>
                    <span className="text-xs font-bold shrink-0 px-2.5 py-1 rounded-lg" style={{ backgroundColor: `${act.color}15`, color: act.color }}>
                      {act.duration}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{act.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {act.badges.map((badge, bi) => (
                      <span key={bi} className="px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ backgroundColor: `${act.color}12`, color: act.color }}>
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNIVERSAIRE ── */}
      <section className="py-20" style={{ backgroundColor: '#fffbeb' }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="rounded-3xl overflow-hidden border-2" style={{ borderColor: `${YELLOW}60` }}>
              <div className="grid md:grid-cols-2">
                <div className="p-10 md:p-12" style={{ background: `linear-gradient(135deg, ${YELLOW}20, ${ORANGE}10)` }}>
                  <div className="text-6xl mb-5">🎂</div>
                  <h2 className="text-4xl font-black mb-4" style={{ color: DARK }}>
                    Anniversaire<br /><span style={{ color: YELLOW }}>inoubliable.</span>
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    Offrez à votre enfant un anniversaire qui sort vraiment de l'ordinaire. On s'occupe de tout — animation, goûter, souvenirs.
                  </p>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pack anniversaire</div>
                      <div className="text-3xl font-black" style={{ color: YELLOW }}>À partir de 199€</div>
                      <div className="text-xs text-gray-400">jusqu'à 12 enfants</div>
                    </div>
                  </div>
                  <Link
                    to="/booking"
                    className="mt-7 inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-black"
                    style={{ background: `linear-gradient(135deg, ${YELLOW}, #f97316)`, color: DARK }}
                  >
                    Organiser un anniversaire <ArrowRight className="size-5" />
                  </Link>
                </div>
                <div className="p-10 bg-white">
                  <h3 className="font-black text-lg mb-6" style={{ color: DARK }}>Ce qui est inclus</h3>
                  <ul className="space-y-3">
                    {birthdayFeatures.map((f, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${YELLOW}25` }}>
                          <CheckCircle className="size-4" style={{ color: YELLOW }} />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{f}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SÉCURITÉ ── */}
      <section className="py-20" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-bold border border-white/20 bg-white/10 text-white">
              <Shield className="size-4" style={{ color: GREEN }} /> Sécurité des enfants
            </div>
            <h2 className="text-4xl font-black text-white mb-3">
              Leur sécurité,<br /><span style={{ color: GREEN }}>notre obsession.</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">Chaque détail de nos installations et de nos protocoles est pensé pour que les parents puissent souffler pendant que les enfants s'amusent.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {safetyPoints.map((pt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="text-center p-6 rounded-3xl border border-white/10 hover:border-white/25 transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="text-4xl mb-4">{pt.icon}</div>
                <h4 className="font-black text-white text-sm mb-2">{pt.title}</h4>
                <p className="text-white/45 text-xs leading-relaxed">{pt.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES PARENTS ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-black mb-2" style={{ color: DARK }}>Des parents <span style={{ color: YELLOW }}>rassurés.</span></h2>
            <p className="text-gray-400 text-sm">Et des enfants qui réclament de revenir.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-7 shadow-sm border-2 border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all"
              >
                <div className="flex gap-1 mb-4">{[...Array(t.stars)].map((_, s) => <Star key={s} className="size-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="font-black text-sm" style={{ color: DARK }}>{t.author}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 border-t border-gray-100 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-5xl mb-5">🌱</div>
            <h2 className="text-3xl font-black mb-3" style={{ color: DARK }}>Leur prochaine aventure commence ici.</h2>
            <p className="text-gray-500 mb-8">Réservez en 2 minutes, souvenirs pour la vie.</p>
            <Link to="/parcs" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black" style={{ background: `linear-gradient(135deg, ${YELLOW}, #f97316)`, color: DARK, boxShadow: `0 8px 28px ${YELLOW}40` }}>
              <Calendar className="size-5" /> Trouver un parc <ArrowRight className="size-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
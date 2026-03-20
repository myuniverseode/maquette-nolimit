// pages/PourQuiDuoPage.tsx — Pour les duos
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Heart, Star, Calendar, Shield, Zap, ChevronDown, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePourQuiDuo } from "../../hooks/usePourQuiPages";
import { useRef } from 'react';
import { useParksData } from '../../hooks/useParksData';
import { useActivitiesData } from '../../hooks/useActiviesData';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const DEFAULT_DUO_ACTIVITIES = [
  { emoji: '🧗', name: 'Accrobranche',     desc: 'Encouragez-vous mutuellement dans les hauteurs.',  diff: 'Tous niveaux', price: 24 },
  { emoji: '🏹', name: 'Tir à l\'arc',     desc: 'Défi amical ou duo synchronisé, à vous de choisir.', diff: 'Débutant',    price: 18 },
  { emoji: '🪂', name: 'Tyrolienne',        desc: 'Le frisson partagé d\'une descente côte à côte.',   diff: 'Intermédiaire', price: 29 },
  { emoji: '🧩', name: 'Escape game forêt', desc: 'Résolvez les énigmes ensemble avant le coucher du soleil.', diff: 'Tous niveaux', price: 34 },
  { emoji: '🛶', name: 'Canoë duo',         desc: 'Trouvez votre rythme sur l\'eau ensemble.',         diff: 'Débutant',    price: 22 },
  { emoji: '⛰️', name: 'Via ferrata',       desc: 'Un défi vertical qui rapproche vraiment.',          diff: 'Intermédiaire', price: 38 },
];

const DEFAULT_MOMENTS = [
  { icon: '🎂', title: 'Anniversaire à deux', desc: 'Une journée mémorable, en dehors du commun.' },
  { icon: '💍', title: 'EVJF / EVG', desc: 'L\'aventure avant la grande journée.' },
  { icon: '🎁', title: 'Cadeau original', desc: 'Offrez une expérience plutôt qu\'un objet.' },
  { icon: '💡', title: 'Premier rendez-vous', desc: 'Sortez des sentiers battus dès le départ.' },
];

const DEFAULT_DUO_TESTIMONIALS = [
  { text: "On cherchait quelque chose d'original pour nos 5 ans ensemble. La tyrolienne en duo, c'était exactement ça.", author: "Camille & Théo", stars: 5 },
  { text: "Mon copain avait peur des hauteurs. Après l'accrobranche, il voulait recommencer. Magie.", author: "Inès", stars: 5 },
  { text: "Parfait pour notre EVJF. L'équipe a rendu ça encore plus spécial.", author: "Marine", stars: 5 },
];

// Blog posts factices
const BLOG_POSTS = [
  {
    title: "5 idées de rendez-vous originaux en pleine nature",
    excerpt: "Oubliez le restaurant et le cinéma, découvrez des activités à deux qui créent des souvenirs.",
    date: "15 mars 2026",
    link: "/blog/rendez-vous-nature",
    image: "🌲"
  },
  {
    title: "Pourquoi l'aventure renforce les liens de couple",
    excerpt: "Les neurosciences expliquent pourquoi partager des sensations fortes rend plus proche.",
    date: "2 février 2026",
    link: "/blog/aventure-couple",
    image: "❤️"
  },
  {
    title: "Top 5 des activités à faire à deux près de chez vous",
    excerpt: "Accrobranche, canoë, escape game… notre sélection pour un duo inoubliable.",
    date: "12 janvier 2026",
    link: "/blog/top-activites-duo",
    image: "🗺️"
  }
];

export function PourQuiDuoPage() {
  const { parks } = useParksData();
  const { activities } = useActivitiesData();
  const { data: duoData } = usePourQuiDuo();
  const duoActivities = duoData.activities?.length > 0 ? duoData.activities : DEFAULT_DUO_ACTIVITIES;
  const moments = duoData.moments?.length > 0 ? duoData.moments : DEFAULT_MOMENTS;
  const testimonials = duoData.testimonials?.length > 0 ? duoData.testimonials : DEFAULT_DUO_TESTIMONIALS;
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO full-bleed ── */}
      <section ref={heroRef} className="relative h-screen flex items-end overflow-hidden">
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 scale-110"
        >
          <div
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse at 30% 40%, #1a4a0a 0%, transparent 55%),
                radial-gradient(ellipse at 75% 60%, ${ORANGE}55 0%, transparent 50%),
                linear-gradient(160deg, #0d2b04 0%, #1e5c08 40%, #2d1a00 100%)
              `,
            }}
          />
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: 20 + i * 15,
                height: 20 + i * 15,
                left: `${8 + i * 8}%`,
                top: `${10 + (i % 4) * 20}%`,
              }}
              animate={{ y: [0, -20, 0], opacity: [0.05, 0.12, 0.05] }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-20 container mx-auto px-6 pb-20 md:pb-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-8"
          >
            <Link to="/" className="text-white/50 hover:text-white text-sm transition-colors">Accueil</Link>
            <span className="text-white/30 text-sm">/</span>
            <span className="text-white/70 text-sm">Pour qui</span>
            <span className="text-white/30 text-sm">/</span>
            <span className="text-white text-sm font-bold">Duo</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 backdrop-blur-sm text-white">
              <Heart className="size-4 fill-red-400 text-red-400" />
              Pour les duos
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6">
              À deux,<br />
              <span style={{ color: ORANGE }}>tout change.</span>
            </h1>

            <p className="text-xl text-white/70 leading-relaxed max-w-xl mb-10">
              Parce que les meilleurs souvenirs se créent avec quelqu'un. Couple, amis proches, frères et sœurs — l'aventure prend un autre sens quand on la partage.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/parcs"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-white text-base"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)`, boxShadow: `0 8px 28px ${ORANGE}50` }}
              >
                Réserver à deux <ArrowRight className="size-5" />
              </Link>
              <Link
                to="/activities"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-white border-2 border-white/25 hover:border-white/50 hover:bg-white/10 transition-all"
              >
                Voir les activités
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white/40 text-xs font-medium tracking-widest uppercase">Découvrir</span>
          <ChevronDown className="size-5 text-white/40" />
        </motion.div>
      </section>

      {/* ── BLOC TEXTE AU DÉBUT (NOUVEAU) ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: DARK }}>
              L’aventure en duo, c’est <span style={{ color: ORANGE }}>magique</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Que ce soit pour un anniversaire de mariage, un EVJF entre meilleures amies, ou simplement pour partager un moment fort,<br />
              nos activités sont pensées pour deux. Le stress devient excitation, le doute devient fierté, et le souvenir devient commun.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MOMENTS ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: DARK }}>
              Pour quel <span style={{ color: ORANGE }}>moment ?</span>
            </h2>
            <p className="text-gray-500">L'occasion idéale pour faire quelque chose d'inoubliable.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {moments.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="text-center p-6 rounded-3xl border-2 border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all cursor-default"
              >
                <div className="text-5xl mb-4">{m.icon}</div>
                <h3 className="font-black text-base mb-1" style={{ color: DARK }}>{m.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACTIVITÉS DUO ── */}
      <section className="py-20" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-bold border border-white/20 bg-white/10 text-white">
              <Zap className="size-4" style={{ color: ORANGE }} /> Activités recommandées
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
              Fait pour <span style={{ color: ORANGE }}>deux.</span>
            </h2>
            <p className="text-white/50">Sélection d'activités qui prennent tout leur sens en duo.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {duoActivities.map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-6 rounded-3xl border border-white/10 hover:border-white/25 transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="text-5xl mb-5">{act.emoji}</div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-black text-white text-xl leading-tight">{act.name}</h3>
                  <div className="shrink-0 text-2xl font-black" style={{ color: ORANGE }}>{act.price}€</div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-4">{act.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: `${GREEN}25`, color: '#7dda30' }}>
                    {act.diff}
                  </span>
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: ORANGE }}
                  >
                    Réserver <ArrowRight className="size-3" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFRE DUO ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #2d6100 50%, #1a3a00 100%)` }}
          >
            <div className="p-10 md:p-14 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="text-6xl mb-5">💑</div>
                <h2 className="text-4xl font-black text-white mb-4">Pack Duo<br /><span style={{ color: ORANGE }}>-15%</span></h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  Réservez 2 places sur la même activité et profitez d'une réduction immédiate. Aucun code promo nécessaire — la réduction s'applique automatiquement.
                </p>
                <ul className="space-y-2 mb-8">
                  {['2 places au tarif réduit', 'Même activité, même créneau', 'Photo souvenir offerte', 'Annulation gratuite 48h avant'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${ORANGE}40` }}>
                        <span className="text-[10px]">✓</span>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}
                >
                  Profiter du pack <ArrowRight className="size-5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: '-15%', label: 'sur 2 places' },
                  { val: '2h', label: 'en moyenne' },
                  { val: '6', label: 'activités dispo' },
                  { val: '4.9★', label: 'note duo' },
                ].map(({ val, label }, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="text-center rounded-2xl p-5"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.15)' }}
                  >
                    <div className="text-3xl font-black text-white">{val}</div>
                    <div className="text-white/50 text-xs mt-1">{label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-20" style={{ backgroundColor: '#f8faf8' }}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-black mb-2" style={{ color: DARK }}>Ils en <span style={{ color: GREEN }}>parlent.</span></h2>
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
                className="bg-white rounded-3xl p-7 shadow-sm border-2 border-gray-100 hover:border-red-100 hover:shadow-lg transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, s) => (
                    <Star key={s} className="size-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="font-black text-sm" style={{ color: DARK }}>{t.author}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION BLOG & ACTUALITÉS (NOUVEAU) ── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black mb-3" style={{ color: DARK }}>
              Idées & <span style={{ color: ORANGE }}>actualités</span>
            </h2>
            <p className="text-gray-500">Inspirez-vous pour votre prochaine aventure à deux.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {BLOG_POSTS.map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl border border-gray-200 hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="text-5xl mb-4">{post.image}</div>
                  <div className="text-xs text-gray-400 mb-2">{post.date}</div>
                  <h3 className="font-black text-lg mb-2" style={{ color: DARK }}>{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <Link
                    to={post.link}
                    className="inline-flex items-center gap-1 text-sm font-bold transition-colors"
                    style={{ color: ORANGE }}
                  >
                    Lire la suite <ArrowRight className="size-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-6xl mb-6">❤️</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: DARK }}>
              Prêts pour <span style={{ color: ORANGE }}>l'aventure ?</span>
            </h2>
            <p className="text-gray-500 mb-8">Choisissez votre parc et réservez vos deux places en 2 minutes.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/parcs" className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-white" style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)`, boxShadow: `0 8px 28px ${ORANGE}40` }}>
                <Calendar className="size-5" /> Trouver un parc <ArrowRight className="size-5" />
              </Link>
              <Link to="/activities" className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold border-2 border-gray-200 hover:border-gray-400 transition-colors" style={{ color: DARK }}>
                Voir toutes les activités
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
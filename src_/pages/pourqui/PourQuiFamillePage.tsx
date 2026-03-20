// pages/PourQuiFamillePage.tsx — Pour les familles
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Calendar, Shield, Users, ChevronDown, CheckCircle, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { usePourQuiFamille } from "../../hooks/usePourQuiPages";

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const DEFAULT_AGE_GROUPS = [
  {
    age: '5–7 ans',
    emoji: '🐣',
    color: '#f59e0b',
    bg: '#fffbeb',
    activities: ['Parcours découverte', 'Tir à l\'arc initiation', 'Balades nature guidées'],
    note: 'Accompagné obligatoire',
  },
  {
    age: '8–11 ans',
    emoji: '🌱',
    color: GREEN,
    bg: '#f0fdf4',
    activities: ['Accrobranche junior', 'Tyrolienne courte', 'Orientation boussole'],
    note: 'Moniteur dédié',
  },
  {
    age: '12–17 ans',
    emoji: '🚀',
    color: ORANGE,
    bg: '#fef3ea',
    activities: ['Accrobranche expert', 'Via ferrata niveau 1', 'Canoë rapide'],
    note: 'Avec ou sans parent',
  },
  {
    age: 'Adultes',
    emoji: '🏔️',
    color: '#6366f1',
    bg: '#f0f0ff',
    activities: ['Tous les parcours', 'Via ferrata complète', 'Tyrolienne longue'],
    note: 'Liberté totale',
  },
];

const DEFAULT_FAMILY_PACKS = [
  {
    name: 'Pack Famille S',
    desc: '2 adultes + 1 enfant',
    price: 69,
    original: 82,
    emoji: '👨‍👩‍👦',
    popular: false,
    features: ['3 accès activités au choix', 'Équipement inclus', 'Encadrement mixte adultes/enfants'],
  },
  {
    name: 'Pack Famille M',
    desc: '2 adultes + 2 enfants',
    price: 89,
    original: 108,
    emoji: '👨‍👩‍👧‍👦',
    popular: true,
    features: ['4 accès activités au choix', 'Équipement inclus', 'Moniteur dédié enfants', 'Pique-nique zone dédiée'],
  },
  {
    name: 'Pack Famille XL',
    desc: '2 adultes + 3 enfants ou +',
    price: 109,
    original: 140,
    emoji: '🏡',
    popular: false,
    features: ['Accès illimité à la journée', 'Équipement inclus', 'Animateur enfants inclus', 'Goûter offert', 'Photos incluses'],
  },
];

const DEFAULT_PRACTICAL_INFO = [
  { icon: '👟', title: 'Tenue requise', desc: 'Chaussures fermées et vêtements sportifs. Pas de talons ni sandales.' },
  { icon: '☀️', title: 'Météo', desc: 'Certaines activités peuvent être suspendues par mauvais temps. Vérifiez avant de partir.' },
  { icon: '🍱', title: 'Pique-nique', desc: 'Espaces dédiés disponibles sur tous nos parcs. Glacières bienvenues.' },
  { icon: '🅿️', title: 'Parking', desc: 'Parking familial gratuit et spacieux sur tous les sites. Poussettes acceptées.' },
  { icon: '🍼', title: 'Tout-petits', desc: 'Aire de jeux et espace détente ombragé pour les moins de 5 ans et les parents.' },
  { icon: '🏥', title: 'Sécurité', desc: 'Infirmier ou secouriste présent sur chaque parc tous les jours.' },
];

const DEFAULT_FAMILLE_TESTIMONIALS = [
  { text: "Mes enfants ont 6 et 10 ans — ils ont adoré chacun à leur niveau. C'est rare de trouver un endroit où tout le monde est heureux en même temps.", author: "Claire M., maman de 2 enfants", stars: 5 },
  { text: "On y est allés en famille recomposée avec 4 enfants de 7 à 15 ans. Personne ne s'est ennuyé, tout le monde a trouvé son activité.", author: "David R.", stars: 5 },
  { text: "Le pack famille est vraiment avantageux. L'accueil des moniteurs avec les enfants était top.", author: "Sarah & Thomas", stars: 5 },
];

// Blog posts factices
const BLOG_POSTS = [
  {
    title: "5 sorties nature à faire en famille ce printemps",
    excerpt: "Des idées pour tous les âges, du tout-petit aux ados.",
    date: "20 mars 2026",
    link: "/blog/sorties-famille",
    image: "🌳"
  },
  {
    title: "Pourquoi les activités en forêt développent la confiance des enfants",
    excerpt: "Les bienfaits de l'aventure en plein air sur le développement.",
    date: "5 février 2026",
    link: "/blog/bienfaits-foret",
    image: "🌿"
  },
  {
    title: "Organiser un anniversaire en famille : nos conseils",
    excerpt: "Goûter, activités, sécurité : tout pour réussir un anniversaire inoubliable.",
    date: "10 janvier 2026",
    link: "/blog/anniversaire-famille",
    image: "🎂"
  }
];

export function PourQuiFamillePage() {
  const { data: famData } = usePourQuiFamille();
  const ageGroups = famData.ageGroups?.length > 0 ? famData.ageGroups : DEFAULT_AGE_GROUPS;
  const familyPacks = famData.familyPacks?.length > 0 ? famData.familyPacks : DEFAULT_FAMILY_PACKS;
  const practicalInfo = famData.practicalInfo?.length > 0 ? famData.practicalInfo : DEFAULT_PRACTICAL_INFO;
  const testimonials = famData.testimonials?.length > 0 ? famData.testimonials : DEFAULT_FAMILLE_TESTIMONIALS;
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const [openAge, setOpenAge] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 scale-110"
        >
          <div
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse at 20% 50%, #0d3b1a 0%, transparent 50%),
                radial-gradient(ellipse at 80% 30%, #4a9d00 0%, transparent 45%),
                radial-gradient(ellipse at 60% 80%, ${ORANGE}40 0%, transparent 40%),
                linear-gradient(160deg, #071a0a 0%, #1a5c08 50%, #102800 100%)
              `,
            }}
          />
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 40 + i * 25,
                height: 40 + i * 25,
                left: `${5 + i * 12}%`,
                top: `${15 + (i % 3) * 25}%`,
                backgroundColor: i % 2 === 0 ? `${GREEN}15` : `${ORANGE}10`,
                filter: 'blur(20px)',
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 6 + i, repeat: Infinity, delay: i * 0.5 }}
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
            <span className="text-white/30">/</span>
            <span className="text-white/70 text-sm">Pour qui</span>
            <span className="text-white/30">/</span>
            <span className="text-white text-sm font-bold">Famille</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 backdrop-blur-sm text-white">
              <Users className="size-4" style={{ color: GREEN }} />
              Pour les familles
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6">
              La forêt<br />
              <span style={{ color: GREEN }}>pour tous.</span>
            </h1>

            <p className="text-xl text-white/70 leading-relaxed max-w-xl mb-10">
              De 5 à 75 ans, chaque membre de la famille trouve son aventure. Des parcours pensés pour que petits et grands vivent des émotions fortes ensemble.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/parcs"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-white"
                style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)`, boxShadow: `0 8px 28px ${GREEN}50` }}
              >
                Voir nos parcs <ArrowRight className="size-5" />
              </Link>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-white border-2 border-white/25 hover:bg-white/10 transition-all"
              >
                Pack famille →
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <span className="text-white/40 text-xs tracking-widest uppercase">Explorer</span>
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
              Des moments <span style={{ color: GREEN }}>en famille</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Chez NoLimit Aventure, nous savons que chaque famille est unique. C’est pourquoi nous proposons des activités adaptées à tous les âges,<br />
              des espaces pique‑nique, et des tarifs avantageux pour que personne ne soit laissé de côté.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── PAR TRANCHE D'ÂGE ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: DARK }}>
              Un programme pour <span style={{ color: GREEN }}>chaque âge.</span>
            </h2>
            <p className="text-gray-500">Activités adaptées, encadrement spécialisé, plaisir garanti.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {ageGroups.map((group, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="rounded-3xl overflow-hidden border-2 hover:shadow-xl transition-all cursor-default"
                style={{ borderColor: `${group.color}30` }}
              >
                <div className="px-6 py-8 text-center" style={{ backgroundColor: group.bg }}>
                  <div className="text-5xl mb-3">{group.emoji}</div>
                  <div className="font-black text-2xl" style={{ color: group.color }}>{group.age}</div>
                  <div className="text-xs font-bold mt-1 text-gray-500">{group.note}</div>
                </div>
                <div className="p-5 bg-white space-y-2">
                  {group.activities.map((act, ai) => (
                    <div key={ai} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${group.color}20` }}>
                        <span className="text-[8px]">✓</span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{act}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKS FAMILLE ── */}
      <section className="py-20" style={{ backgroundColor: '#f8faf8' }}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: DARK }}>
              Packs <span style={{ color: ORANGE }}>famille.</span>
            </h2>
            <p className="text-gray-500">Plus vous êtes nombreux, plus vous économisez.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-5xl mx-auto">
            {familyPacks.map((pack, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -10 }}
                className={`relative bg-white rounded-3xl p-8 shadow-sm border-2 hover:shadow-xl transition-all ${pack.popular ? 'border-orange-400' : 'border-gray-100'}`}
              >
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-black text-white" style={{ background: `linear-gradient(to right, ${ORANGE}, #ff9a3c)` }}>
                    ⭐ Le plus choisi
                  </div>
                )}
                <div className="text-5xl text-center mb-5">{pack.emoji}</div>
                <h3 className="font-black text-xl text-center mb-1" style={{ color: DARK }}>{pack.name}</h3>
                <p className="text-center text-gray-400 text-sm mb-6">{pack.desc}</p>
                <div className="text-center mb-7 py-5 rounded-2xl" style={{ backgroundColor: `${GREEN}08` }}>
                  <div className="text-xs text-gray-400 line-through mb-1">{pack.original}€</div>
                  <div className="text-5xl font-black" style={{ color: GREEN }}>{pack.price}€</div>
                  <div className="text-xs text-gray-400 mt-1">par famille</div>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {pack.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-3">
                      <CheckCircle className="size-4 shrink-0" style={{ color: GREEN }} />
                      <span className="text-sm text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/booking"
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm transition-all ${pack.popular ? 'text-white' : 'text-gray-900 bg-gray-100 hover:bg-gray-200'}`}
                  style={pack.popular ? { background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` } : {}}
                >
                  Choisir ce pack <ArrowRight className="size-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION ÉVÉNEMENT FAMILIAL (NOUVEAU) ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden shadow-xl"
            style={{ background: `linear-gradient(135deg, #fffbeb 0%, #fff6e5 100%)` }}
          >
            <div className="p-10 md:p-12 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="text-6xl mb-5">🎉</div>
                <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: DARK }}>
                  Vous avez un événement<br />
                  <span style={{ color: ORANGE }}>à fêter en famille ?</span>
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Anniversaire, retrouvailles, EVJF version tribu… On s’occupe de tout : animation, goûter, photo souvenir. Une expérience clé en main pour que vous profitiez.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white shadow-sm">🎂 Anniversaire enfant</span>
                  <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white shadow-sm">🎓 Fête de fin d’année</span>
                  <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white shadow-sm">👵 Grands-parents & petits-enfants</span>
                </div>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}
                >
                  Organiser mon événement <ArrowRight className="size-5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-5 rounded-2xl bg-white shadow-sm">
                  <PartyPopper className="size-8 mx-auto mb-2" style={{ color: ORANGE }} />
                  <div className="font-bold">Animation dédiée</div>
                  <div className="text-xs text-gray-400">1h30 encadrée</div>
                </div>
                <div className="text-center p-5 rounded-2xl bg-white shadow-sm">
                  <Calendar className="size-8 mx-auto mb-2" style={{ color: GREEN }} />
                  <div className="font-bold">Sur réservation</div>
                  <div className="text-xs text-gray-400">7j/7</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── INFOS PRATIQUES ── */}
      <section className="py-20" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-3">
              Préparez votre <span style={{ color: ORANGE }}>journée.</span>
            </h2>
            <p className="text-white/50">Tout ce qu'il faut savoir avant de partir en famille.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {practicalInfo.map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="flex items-start gap-4 p-5 rounded-2xl border border-white/10 hover:border-white/25 transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
              >
                <span className="text-3xl flex-shrink-0">{info.icon}</span>
                <div>
                  <h4 className="font-black text-white text-sm mb-1">{info.title}</h4>
                  <p className="text-white/50 text-xs leading-relaxed">{info.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-black mb-2" style={{ color: DARK }}>Des familles <span style={{ color: GREEN }}>heureuses.</span></h2>
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
                className="bg-white rounded-3xl p-7 shadow-sm border-2 border-gray-100 hover:border-green-200 hover:shadow-lg transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, s) => <Star key={s} className="size-4 fill-yellow-400 text-yellow-400" />)}
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
              Actualités & <span style={{ color: GREEN }}>conseils famille</span>
            </h2>
            <p className="text-gray-500">Des idées pour profiter de la nature en famille.</p>
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
                    style={{ color: GREEN }}
                  >
                    Lire la suite <ArrowRight className="size-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-5xl mb-5">🌲</div>
            <h2 className="text-3xl font-black mb-3" style={{ color: DARK }}>La forêt vous attend.</h2>
            <p className="text-gray-500 mb-8">Réservez votre journée famille dès maintenant.</p>
            <Link to="/parcs" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)`, boxShadow: `0 8px 28px ${GREEN}40` }}>
              <Calendar className="size-5" /> Trouver un parc près de chez moi <ArrowRight className="size-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
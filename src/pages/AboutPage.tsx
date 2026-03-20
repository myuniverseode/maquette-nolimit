// pages/AboutPage.tsx — Hub About avec sidebar, blocs texte+image, stats
import { motion } from 'framer-motion';
import { History, Target, MapPin, Briefcase, Newspaper, Users, Award, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAboutMain } from '../hooks/useAboutData';
import { AboutSidebar } from '../components/AboutSidebar';
import { TextBlock, TextImageBlocks, ContentBlock } from '../components/AboutBlocks';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';

const ICON_MAP: Record<string, React.ElementType> = { History, Target, MapPin, Briefcase, Newspaper, Users, Award, Zap };
const ALT_COLOR = (i: number) => (i % 2 === 0 ? GREEN : ORANGE);
const ALT_BG = (i: number) => (i % 2 === 0 ? '#f0f7e8' : '#fef3ea');
const STAT_ICONS = ['🌲', '🏆', '🧗', '⭐', '💼', '📍'];

const DEFAULT_NAV_CARDS = [
  { to: '/about/histoire',    Icon: History,   emoji: '🏔️', title: 'Notre Histoire',  desc: "De Chevry à la France entière, 10 ans d'aventure.",            color: GREEN,  bg: '#f0f7e8' },
  { to: '/about/valeurs',     Icon: Target,    emoji: '💚', title: 'Notre ADN',       desc: 'Sécurité, nature, plaisir : les piliers qui nous définissent.', color: ORANGE, bg: '#fef3ea' },
  { to: '/about/parcs',       Icon: MapPin,    emoji: '📍', title: 'Nos Parcs',       desc: '5 parcs uniques, chacun avec son caractère.',                   color: GREEN,  bg: '#f0f7e8' },
  { to: '/about/emplois',     Icon: Briefcase, emoji: '🧗', title: 'Nos Emplois',     desc: "Fais de ta passion ton métier.",                                 color: ORANGE, bg: '#fef3ea' },
  { to: '/about/actualites',  Icon: Newspaper, emoji: '🗞️', title: 'Actualités',     desc: 'Nouveautés, événements et coulisses.',                          color: GREEN,  bg: '#f0f7e8' },
  { to: '/about/partenaires', Icon: Users,     emoji: '🤝', title: 'Partenaires',     desc: 'Les organisations qui partagent nos valeurs.',                   color: ORANGE, bg: '#fef3ea' },
];

const DEFAULT_STATS = [
  { val: '2016', label: 'Année de création', icon: '🌲' },
  { val: '5',    label: 'Parcs en France',   icon: '🏆' },
  { val: '120+', label: 'Collaborateurs',    icon: '🧗' },
  { val: '50k+', label: 'Visiteurs / an',    icon: '⭐' },
];

// Blocs texte+image par défaut (éditables depuis l'API)
const DEFAULT_CONTENT_BLOCKS: ContentBlock[] = [
  {
    title: "Une aventure née de la passion",
    text: "Depuis 2016, NoLimit Aventure transforme les forêts françaises en terrains de jeu pour toute la famille. Nos 5 parcs accueillent chaque année des milliers d'aventuriers, des plus petits aux plus grands.",
    image: '',
  },
  {
    title: "L'humain au cœur de tout",
    text: "Derrière chaque parcours, chaque tyrolienne, chaque sourire, il y a une équipe de passionnés. Plus de 120 collaborateurs qui partagent la même vision : rendre l'aventure accessible à tous.",
    image: '',
  },
];

export function AboutPage() {
  const { data } = useAboutMain();

  const hero = data.hero ?? {};
  const hub  = data.hub  ?? {};

  const stats = data.stats?.length > 0
    ? data.stats.map((s, i) => ({ val: s.value ?? (s as any).val ?? '', label: s.label, icon: s.icon ?? STAT_ICONS[i] }))
    : DEFAULT_STATS;

  const navCards = data.navCards?.length > 0
    ? data.navCards.map((c, i) => {
        const local = DEFAULT_NAV_CARDS[i] ?? DEFAULT_NAV_CARDS[0];
        return {
          to: c.link ?? local.to, Icon: ICON_MAP[c.icon] ?? local.Icon,
          emoji: (c as any).emoji ?? local.emoji, title: c.title ?? local.title,
          desc: c.desc ?? local.desc, color: c.color ?? ALT_COLOR(i), bg: ALT_BG(i),
        };
      })
    : DEFAULT_NAV_CARDS;

  // Blocs texte+image depuis l'API (si disponible) ou fallback
  const contentBlocks: ContentBlock[] = (data as any).contentBlocks?.length > 0
    ? (data as any).contentBlocks
    : DEFAULT_CONTENT_BLOCKS;

  // Texte d'intro avant les stats
  const introTitle = (data as any).introTitle || "Qui sommes-nous ?";
  const introText = (data as any).introText || "NoLimit Aventure, c'est bien plus qu'un parc accrobranche. C'est une aventure humaine, un engagement pour la nature, et une promesse : celle de moments inoubliables en famille, entre amis ou en équipe.";

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden" style={{ backgroundColor: DARK }}>
        <motion.div className="absolute top-20 left-10 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: GREEN, opacity: 0.18 }}
          animate={{ scale: [1, 1.25, 1], x: [0, 40, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-10 right-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: ORANGE, opacity: 0.14 }}
          animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }} />

        <div className="container mx-auto px-6 relative z-10 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-bold border border-white/20 bg-white/10 backdrop-blur-sm text-white">
              <Award className="size-4" style={{ color: ORANGE }} />
              {hero.badge || 'Depuis 2015 · Leader français du parc aventure'}
            </motion.div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6">
              {hero.title || 'On est'}<br />
              <span style={{ color: ORANGE }}>NoLimit.</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl leading-relaxed mb-10">
              {hero.subtitle || "Une équipe de passionnés qui croit dur comme fer que l'aventure, ça change la vie."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={hero.cta1Link || '/about/histoire'}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-white text-base"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)`, boxShadow: `0 8px 28px ${ORANGE}45` }}>
                {hero.cta1Text || 'Notre histoire'} <ArrowRight className="size-5" />
              </Link>
              <Link to={hero.cta2Link || '/parcs'}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-white border-2 border-white/25 hover:border-white/50 hover:bg-white/10 transition-all">
                {hero.cta2Text || 'Découvrir nos parcs'}
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1440 80" className="w-full h-16 md:h-20" preserveAspectRatio="none">
            <path d="M0,40 C300,80 600,0 900,50 C1100,80 1300,20 1440,50 L1440,80 L0,80 Z" className="fill-white" />
          </svg>
        </div>
      </section>

      {/* ── CONTENU AVEC SIDEBAR ── */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <AboutSidebar />

          <main className="flex-1 min-w-0">
            {/* Bloc texte d'intro */}
            <TextBlock title={introTitle} text={introText} />

            {/* STATS */}
            <section className="py-14">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {stats.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}
                    className="text-center p-5 rounded-3xl border-2 border-gray-100 hover:border-green-200 bg-white hover:shadow-lg transition-all">
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <div className="text-3xl font-black mb-1" style={{ color: DARK }}>{s.val}</div>
                    <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Blocs texte + image alternés */}
            <TextImageBlocks blocks={contentBlocks} />

            {/* NAV HUB */}
            <section className="py-14">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-bold border"
                  style={{ backgroundColor: `${GREEN}10`, borderColor: `${GREEN}30`, color: GREEN }}>
                  <Zap className="size-4" /> {hub.badge || 'Tout sur NoLimit Aventure'}
                </div>
                <h2 className="text-4xl md:text-5xl font-black" style={{ color: DARK }}>
                  {hub.title || 'Explorez notre '}<span style={{ color: GREEN }}>univers</span>
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {navCards.map((card, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }} whileHover={{ y: -6, scale: 1.01 }} className="group">
                    <Link to={card.to} className="block h-full">
                      <div className="h-full bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all flex gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: card.bg }}>
                          {card.emoji}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-black mb-1" style={{ color: DARK }}>{card.title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                        </div>
                        <ArrowRight className="size-4 text-gray-300 group-hover:text-gray-600 transition-colors self-center shrink-0" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

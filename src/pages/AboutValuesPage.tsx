// pages/AboutValuesPage.tsx — Valeurs avec bloc texte intro + sidebar
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Shield, Leaf, Heart, Star, TrendingUp, Smile, Award, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAboutValues } from '../hooks/useAboutData';
import { AboutSidebar } from '../components/AboutSidebar';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';

const ICON_MAP: Record<string, React.ElementType> = { Shield, Leaf, Heart, Star, TrendingUp, Smile, Award, Lightbulb };
const ICON_EMOJI: Record<string, string> = { Shield: '🛡️', Leaf: '🌿', Heart: '❤️', Star: '⭐', TrendingUp: '🚀', Smile: '😊', Award: '🏆', Lightbulb: '💡' };

function colorToBg(color: string): string {
  const map: Record<string, string> = { '#357600': '#f0fdf4', '#3b82f6': '#eff6ff', '#22c55e': '#f0fdf4', '#eb700f': '#fff7ed', '#f59e0b': '#fffbeb', '#ec4899': '#fdf2f8', '#8b5cf6': '#f5f3ff' };
  return map[color] ?? '#f9fafb';
}

const DEFAULT_VALUES = [
  { Icon: Shield, emoji: '🛡️', title: 'Sécurité avant tout', desc: "Matériel certifié CE, contrôlé quotidiennement.", details: ['Certification CE/EN', 'Contrôle quotidien', 'Moniteurs diplômés', 'Premiers secours'], color: '#3b82f6', bg: '#eff6ff', num: '01' },
  { Icon: Leaf, emoji: '🌿', title: 'Respect de la nature', desc: "Nos parcs sont des espaces vivants.", details: ['Partenaire ONF', 'Zéro produit chimique', 'Matériaux biosourcés', 'Gestion biodiversité'], color: GREEN, bg: '#f0fdf4', num: '02' },
  { Icon: Heart, emoji: '❤️', title: 'Plaisir partagé', desc: "L'aventure crée du lien.", details: ['Multi-niveaux', 'Espaces familles', 'Photos offertes', 'Programme fidélité'], color: '#ec4899', bg: '#fdf2f8', num: '03' },
  { Icon: Star, emoji: '⭐', title: 'Excellence du service', desc: "98% de satisfaction.", details: ['NPS > 70', 'Réponse sous 24h', 'Formation continue', 'Audit semestriel'], color: '#f59e0b', bg: '#fffbeb', num: '04' },
  { Icon: TrendingUp, emoji: '🚀', title: 'Innovation continue', desc: "Nouveautés chaque saison.", details: ['1 nouveauté / saison', 'R&D interne', 'Tests utilisateurs', 'Veille internationale'], color: '#8b5cf6', bg: '#f5f3ff', num: '05' },
];

const DEFAULT_MANIFESTO = [
  "L'aventure n'est pas réservée aux experts.",
  "La nature mérite mieux que d'être un décor.",
  "Un souvenir partagé vaut mieux qu'une photo seule.",
  "On ne finit jamais d'apprendre à s'émerveiller.",
  "Chaque défi relevé transforme un peu celui qui l'affronte.",
];

export function AboutValuesPage() {
  const { data } = useAboutValues();
  const hero = data.hero ?? {};
  const sections = data.sections ?? {};

  const values = data.values?.length > 0
    ? data.values.map((v, i) => {
        const local = DEFAULT_VALUES[i % DEFAULT_VALUES.length];
        const iconName = v.icon ?? '';
        return { Icon: ICON_MAP[iconName] ?? local.Icon, emoji: ICON_EMOJI[iconName] ?? local.emoji, title: v.title ?? local.title, desc: v.desc ?? local.desc, details: v.details ?? local.details, color: v.color ?? local.color, bg: colorToBg(v.color ?? '') || local.bg, num: String(i + 1).padStart(2, '0') };
      })
    : DEFAULT_VALUES;

  const manifesto = data.manifesto?.length > 0 ? data.manifesto : DEFAULT_MANIFESTO;

  const introTitle = (data as any).introTitle || "Notre ADN, nos engagements";
  const introText = (data as any).introText || "Chez NoLimit Aventure, 5 valeurs guident chaque décision, chaque investissement, chaque interaction avec nos visiteurs. Ce ne sont pas des mots affichés dans un bureau — ce sont des engagements concrets, mesurables, que nous honorons chaque jour dans chacun de nos 5 parcs.";

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #2d6100 100%)` }}>
        <motion.div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl bg-white/10" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: ORANGE, opacity: 0.2 }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }} />

        <div className="container mx-auto px-6 relative z-10">
          <Link to="/about" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-10 transition-colors">
            <ArrowLeft className="size-4" /> Retour à Découvrir
          </Link>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 text-white">
              {hero.badge || '💚 Notre ADN'}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-5">
              {hero.h1 || 'Ce qui nous'}<br /><span style={{ color: ORANGE }}>{hero.h1accent || 'définit.'}</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">{hero.intro || "5 valeurs. Des engagements concrets."}</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none">
            <path d="M0,20 C500,60 1000,0 1440,40 L1440,60 L0,60 Z" className="fill-white" />
          </svg>
        </div>
      </section>

      {/* CONTENU AVEC SIDEBAR */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <AboutSidebar />

          <main className="flex-1 min-w-0">

            {/* Bloc texte d'intro */}
            <section className="py-10">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="rounded-3xl p-8 md:p-10" style={{ background: `linear-gradient(135deg, ${GREEN}08, #f0fdf4)`, border: `2px solid ${GREEN}15` }}>
                <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: DARK }}>{introTitle}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{introText}</p>
              </motion.div>
            </section>

            {/* VALEURS */}
            <section className="py-12">
              <div className="space-y-8">
                {values.map((v, i) => {
                  const isEven = i % 2 === 0;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: isEven ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
                      className={`flex flex-col md:flex-row gap-8 items-start p-8 rounded-3xl border-2 hover:shadow-lg transition-all ${!isEven ? 'md:flex-row-reverse' : ''}`}
                      style={{ borderColor: `${v.color}25`, backgroundColor: `${v.color}06` }}>
                      <div className="flex-shrink-0 flex flex-col items-center gap-3">
                        <div className="text-5xl font-black opacity-10" style={{ color: v.color }}>{v.num}</div>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: v.bg }}>{v.emoji}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black mb-3" style={{ color: DARK }}>{v.title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-5">{v.desc}</p>
                        {v.details?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {v.details.map((d: string, di: number) => (
                              <span key={di} className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ backgroundColor: v.bg, color: v.color }}>✓ {d}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* MANIFESTO */}
            <section className="py-14 rounded-3xl overflow-hidden" style={{ backgroundColor: DARK }}>
              <div className="px-8 md:px-12">
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                    {sections.manifestoTitle ? sections.manifestoTitle.replace(/\.$/, '') + '.' : <span>Ce qu'on <span style={{ color: ORANGE }}>croit.</span></span>}
                  </h2>
                  <p className="text-white/50">{sections.manifestoSubtitle || "Des convictions qu'on ne négocie pas."}</p>
                </motion.div>
                <div className="space-y-4 max-w-3xl mx-auto">
                  {manifesto.map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }} whileHover={{ x: 8 }}
                      className="flex items-center gap-5 p-5 rounded-2xl border border-white/10 hover:border-white/25 transition-all"
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ backgroundColor: ORANGE }}>{i + 1}</div>
                      <p className="text-white/85 font-bold text-lg">{line}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* NAV */}
            <div className="flex items-center justify-between py-10">
              <Link to="/about/histoire" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 font-bold text-sm"><ArrowLeft className="size-4" /> Notre Histoire</Link>
              <Link to="/about/parcs" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
                Nos Parcs <ArrowRight className="size-4" />
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

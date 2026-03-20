// pages/PourQuiFamillePage.tsx — Pour les familles (dynamique via API)
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Calendar, Users, ChevronDown, CheckCircle, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { usePourQuiFamille } from "../../hooks/usePourQuiPages";

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const FALLBACK_AGE_GROUPS = [
  { age: '5–7 ans', emoji: '🐣', color: '#f59e0b', bg: '#fffbeb', activities: ['Parcours découverte', "Tir à l'arc initiation", 'Balades nature guidées'], note: 'Accompagné obligatoire' },
  { age: '8–11 ans', emoji: '🌱', color: GREEN, bg: '#f0fdf4', activities: ['Accrobranche junior', 'Tyrolienne courte', 'Orientation boussole'], note: 'Moniteur dédié' },
  { age: '12–17 ans', emoji: '🚀', color: ORANGE, bg: '#fef3ea', activities: ['Accrobranche expert', 'Via ferrata niveau 1', 'Canoë rapide'], note: 'Avec ou sans parent' },
  { age: 'Adultes', emoji: '🏔️', color: '#6366f1', bg: '#f0f0ff', activities: ['Tous les parcours', 'Via ferrata complète', 'Tyrolienne longue'], note: 'Liberté totale' },
];

const FALLBACK_FAMILY_PACKS = [
  { name: 'Pack Famille S', desc: '2 adultes + 1 enfant', price: 69, original: 82, emoji: '👨‍👩‍👦', popular: false, features: ['3 accès activités', 'Équipement inclus', 'Encadrement mixte'] },
  { name: 'Pack Famille M', desc: '2 adultes + 2 enfants', price: 89, original: 108, emoji: '👨‍👩‍👧‍👦', popular: true, features: ['4 accès activités', 'Équipement inclus', 'Moniteur dédié', 'Zone pique-nique'] },
  { name: 'Pack Famille XL', desc: '2 adultes + 3 enfants ou +', price: 109, original: 140, emoji: '🏡', popular: false, features: ['Accès illimité', 'Équipement inclus', 'Animateur inclus', 'Goûter offert', 'Photos incluses'] },
];

const FALLBACK_PRACTICAL = [
  { icon: '👟', title: 'Tenue requise', desc: 'Chaussures fermées et vêtements sportifs.' },
  { icon: '☀️', title: 'Météo', desc: 'Certaines activités suspendues par mauvais temps.' },
  { icon: '🍱', title: 'Pique-nique', desc: 'Espaces dédiés disponibles.' },
  { icon: '🅿️', title: 'Parking', desc: 'Parking familial gratuit.' },
  { icon: '🍼', title: 'Tout-petits', desc: 'Aire de jeux et espace détente.' },
  { icon: '🏥', title: 'Sécurité', desc: 'Infirmier ou secouriste présent.' },
];

const FALLBACK_TESTIMONIALS = [
  { text: "Mes enfants ont 6 et 10 ans — ils ont adoré chacun à leur niveau.", author: "Claire M.", stars: 5 },
  { text: "On y est allés en famille recomposée. Personne ne s'est ennuyé.", author: "David R.", stars: 5 },
  { text: "Le pack famille est vraiment avantageux. L'accueil était top.", author: "Sarah & Thomas", stars: 5 },
];

export function PourQuiFamillePage() {
  const { data: famData } = usePourQuiFamille();

  const hero = famData.hero || { title: "La forêt pour tous.", subtitle: "De 5 à 75 ans, chaque membre trouve son aventure.", badge: 'Pour les familles' };
  const intro = famData.intro || { title: "Des moments en famille", text: "" };
  const ageGroups = famData.ageGroups?.length > 0 ? famData.ageGroups : FALLBACK_AGE_GROUPS;
  const familyPacks = famData.familyPacks?.length > 0 ? famData.familyPacks : FALLBACK_FAMILY_PACKS;
  const event = famData.event || { title: "Vous avez un événement à fêter en famille ?", description: "", tags: [] };
  const eventTags = event.tags?.length > 0 ? event.tags : ['Anniversaire enfant', "Fête de fin d'année", 'Grands-parents & petits-enfants'];
  const practicalInfo = famData.practicalInfo?.length > 0 ? famData.practicalInfo : FALLBACK_PRACTICAL;
  const blogSection = famData.blog || { title: 'Actualités & conseils famille', subtitle: '' };
  const blogPosts = famData.blogPosts || [];
  const ctaData = famData.cta || { title: "La forêt vous attend.", subtitle: "Réservez votre journée famille." };

  const testimonials = famData.testimonials?.length > 0
    ? famData.testimonials.map((t: any) => ({
        text: t.text || t.comment || '', author: t.author || '', stars: t.stars || t.rating || 5,
      }))
    : FALLBACK_TESTIMONIALS;

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <div className="w-full h-full" style={{
            background: `radial-gradient(ellipse at 20% 50%, #0d3b1a 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, #4a9d00 0%, transparent 45%), radial-gradient(ellipse at 60% 80%, ${ORANGE}40 0%, transparent 40%), linear-gradient(160deg, #071a0a 0%, #1a5c08 50%, #102800 100%)`,
          }} />
          {[...Array(8)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{ width: 40 + i * 25, height: 40 + i * 25, left: `${5 + i * 12}%`, top: `${15 + (i % 3) * 25}%`, backgroundColor: i % 2 === 0 ? `${GREEN}15` : `${ORANGE}10`, filter: 'blur(20px)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 6 + i, repeat: Infinity, delay: i * 0.5 }} />
          ))}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
        <motion.div style={{ opacity: heroOpacity }} className="relative z-20 container mx-auto px-6 pb-20 md:pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 mb-8">
            <Link to="/" className="text-white/50 hover:text-white text-sm transition-colors">Accueil</Link>
            <span className="text-white/30">/</span><span className="text-white/70 text-sm">Pour qui</span>
            <span className="text-white/30">/</span><span className="text-white text-sm font-bold">Famille</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 backdrop-blur-sm text-white">
              <Users className="size-4" style={{ color: GREEN }} /> {hero.badge}
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6" dangerouslySetInnerHTML={{
              __html: hero.title
            }} />
            <p className="text-xl text-white/70 leading-relaxed max-w-xl mb-10">{hero.subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/parcs" className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-white"
                style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)`, boxShadow: `0 8px 28px ${GREEN}50` }}>
                Voir nos parcs <ArrowRight className="size-5" />
              </Link>
              <Link to="/booking" className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-white border-2 border-white/25 hover:bg-white/10 transition-all">
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

      {/* ── INTRO ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: DARK }}>{intro.title}</h2>
            {intro.text && <p className="text-gray-600 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: intro.text }} />}
          </motion.div>
        </div>
      </section>

      {/* ── TRANCHES D'ÂGE ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: DARK }}>Un programme pour <span style={{ color: GREEN }}>chaque âge.</span></h2>
            <p className="text-gray-500">Activités adaptées, encadrement spécialisé, plaisir garanti.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {ageGroups.map((group: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }}
                className="rounded-3xl overflow-hidden border-2 hover:shadow-xl transition-all cursor-default"
                style={{ borderColor: `${group.color}30` }}>
                <div className="px-6 py-8 text-center" style={{ backgroundColor: group.bg }}>
                  <div className="text-5xl mb-3">{group.emoji}</div>
                  <div className="font-black text-2xl" style={{ color: group.color }}>{group.age}</div>
                  <div className="text-xs font-bold mt-1 text-gray-500">{group.note}</div>
                </div>
                <div className="p-5 bg-white space-y-2">
                  {(Array.isArray(group.activities) ? group.activities : []).map((act: string, ai: number) => (
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
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: DARK }}>Packs <span style={{ color: ORANGE }}>famille.</span></h2>
            <p className="text-gray-500">Plus vous êtes nombreux, plus vous économisez.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-5xl mx-auto">
            {familyPacks.map((pack: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.12 }} whileHover={{ y: -10 }}
                className={`relative bg-white rounded-3xl p-8 shadow-sm border-2 hover:shadow-xl transition-all ${pack.popular ? 'border-orange-400' : 'border-gray-100'}`}>
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-black text-white" style={{ background: `linear-gradient(to right, ${ORANGE}, #ff9a3c)` }}>
                    ⭐ Le plus choisi
                  </div>
                )}
                <div className="text-5xl text-center mb-5">{pack.emoji}</div>
                <h3 className="font-black text-xl text-center mb-1" style={{ color: DARK }}>{pack.name}</h3>
                <p className="text-center text-gray-400 text-sm mb-6">{pack.desc}</p>
                <div className="text-center mb-7 py-5 rounded-2xl" style={{ backgroundColor: `${GREEN}08` }}>
                  {pack.original && <div className="text-xs text-gray-400 line-through mb-1">{pack.original}€</div>}
                  <div className="text-5xl font-black" style={{ color: GREEN }}>{pack.price}€</div>
                  <div className="text-xs text-gray-400 mt-1">par famille</div>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {(pack.features || []).map((f: string, fi: number) => (
                    <li key={fi} className="flex items-center gap-3">
                      <CheckCircle className="size-4 shrink-0" style={{ color: GREEN }} />
                      <span className="text-sm text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/booking"
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm transition-all ${pack.popular ? 'text-white' : 'text-gray-900 bg-gray-100 hover:bg-gray-200'}`}
                  style={pack.popular ? { background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` } : {}}>
                  Choisir ce pack <ArrowRight className="size-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÉVÉNEMENT FAMILIAL ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl overflow-hidden shadow-xl" style={{ background: `linear-gradient(135deg, #fffbeb 0%, #fff6e5 100%)` }}>
            <div className="p-10 md:p-12 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="text-6xl mb-5">🎉</div>
                <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: DARK }}>{event.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{event.description || "Anniversaire, retrouvailles… On s'occupe de tout."}</p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {eventTags.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium bg-white shadow-sm">🎂 {tag}</span>
                  ))}
                </div>
                <Link to="/booking" className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}>
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
            <h2 className="text-4xl font-black text-white mb-3">Préparez votre <span style={{ color: ORANGE }}>journée.</span></h2>
            <p className="text-white/50">Tout ce qu'il faut savoir avant de partir en famille.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {practicalInfo.map((info: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
                className="flex items-start gap-4 p-5 rounded-2xl border border-white/10 hover:border-white/25 transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
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
            {testimonials.map((t: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-7 shadow-sm border-2 border-gray-100 hover:border-green-200 hover:shadow-lg transition-all">
                <div className="flex gap-1 mb-4">{[...Array(t.stars)].map((_, s) => <Star key={s} className="size-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="font-black text-sm" style={{ color: DARK }}>{t.author}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG (vrais articles) ── */}
      {blogPosts.length > 0 && (
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-4xl font-black mb-3" style={{ color: DARK }}>{blogSection.title}</h2>
              {blogSection.subtitle && <p className="text-gray-500">{blogSection.subtitle}</p>}
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {blogPosts.map((post: any, i: number) => (
                <motion.div key={post.id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl border border-gray-200 hover:shadow-xl transition-all overflow-hidden">
                  <div className="p-6">
                    {post.image
                      ? <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded-2xl mb-4" />
                      : <div className="text-5xl mb-4">📝</div>
                    }
                    <div className="text-xs text-gray-400 mb-2">{post.date}</div>
                    <h3 className="font-black text-lg mb-2" style={{ color: DARK }}>{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-sm font-bold transition-colors" style={{ color: GREEN }}>
                      Lire la suite <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-5xl mb-5">🌲</div>
            <h2 className="text-3xl font-black mb-3" style={{ color: DARK }}>{ctaData.title}</h2>
            <p className="text-gray-500 mb-8">{ctaData.subtitle}</p>
            <Link to="/parcs" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white"
              style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)`, boxShadow: `0 8px 28px ${GREEN}40` }}>
              <Calendar className="size-5" /> Trouver un parc près de chez moi <ArrowRight className="size-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

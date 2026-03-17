// pages/ActivityDetailPage.tsx
import { useParams, Link } from 'react-router-dom';
import { activities } from '../data/activities';
import { parks } from '../data/parks';
import {
  Clock, Users, AlertCircle, Calendar, CheckCircle, MapPin, Star, ArrowRight,
  Shield, ChevronRight, Zap, PartyPopper, Camera, Info, X, TreePine,
  Heart, GraduationCap, Building2, Baby, User, ChevronDown, ChevronLeft,
  Sparkles, Target, List, TrendingUp, BookOpen
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const G = '#357600';
const O = '#eb700f';
const D = '#111111';

const DIFF: Record<string, { bg: string; text: string; label: string }> = {
  'Débutant':      { bg: '#16a34a20', text: '#16a34a', label: 'Débutant'      },
  'Intermédiaire': { bg: `${O}20`,    text: O,          label: 'Intermédiaire' },
  'Avancé':        { bg: '#dc262620', text: '#dc2626',  label: 'Avancé'        },
};

const ROTS = [-3.5, 2.2, -1.8, 3.1, -2.5, 1.4];

// ── Blog posts ────────────────────────────────────────────────────────────────
const blogPosts = [
  {
    category: '🎯 Conseil', categoryColor: G,
    date: '5 mars 2025', readTime: '4 min',
    title: '5 conseils pour préparer sa première session',
    excerpt: "Que vous soyez débutant ou sportif confirmé, une bonne préparation fait toute la différence. Découvrez nos conseils d'experts pour profiter pleinement de cette expérience unique.",
    author: { name: 'Marc D.', role: 'Moniteur', avatar: '🧗' },
    emoji: '🧗',
  },
  {
    category: '📖 Guide', categoryColor: O,
    date: '20 fév. 2025', readTime: '6 min',
    title: 'Activités outdoor en famille : notre guide complet',
    excerpt: "Partager une aventure en plein air avec ses enfants, c'est créer des souvenirs inoubliables. Notre sélection des meilleures activités pour toute la famille.",
    author: { name: 'Sophie L.', role: 'Responsable activités', avatar: '🌟' },
    emoji: '👨‍👩‍👧',
  },
  {
    category: '🌿 Nature', categoryColor: '#22c55e',
    date: '10 fév. 2025', readTime: '5 min',
    title: 'La biodiversité du parc : entre les sessions, observez !',
    excerpt: "Notre parc est niché dans un espace naturel exceptionnel. Entre deux activités, prenez le temps d'observer la faune et la flore locale.",
    author: { name: 'Julien B.', role: 'Guide nature', avatar: '🦅' },
    emoji: '🦅',
  },
];

// ── Menu ancrage ──────────────────────────────────────────────────────────────
const menuItems = [
  { id: 'description', label: "L'activité", icon: <Zap className="size-4" />,         targetId: 'description' },
  { id: 'parcs',       label: 'Parcs',       icon: <MapPin className="size-4" />,       targetId: 'parcs'       },
  { id: 'galerie',     label: 'Galerie',     icon: <Camera className="size-4" />,       targetId: 'galerie'     },
  { id: 'inclus',      label: 'Inclus',      icon: <CheckCircle className="size-4" />,  targetId: 'inclus'      },
  { id: 'faq',         label: 'FAQ',         icon: <List className="size-4" />,         targetId: 'faq'         },
  { id: 'pour-qui',    label: 'Pour qui ?',  icon: <Users className="size-4" />,        targetId: 'pour-qui'    },
  { id: 'reserver',    label: 'Réserver',    icon: <Calendar className="size-4" />,     targetId: 'reserver'    },
];

function ActivityAnchorMenu() {
  const [activeSection, setActiveSection] = useState('description');
  const [isVisible, setIsVisible]         = useState(false);

  const scrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 140, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
      const scrollPos = window.scrollY + 200;
      for (let i = menuItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(menuItems[i].targetId);
        if (el && el.offsetTop <= scrollPos) { setActiveSection(menuItems[i].id); break; }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b shadow-sm"
      style={{ borderColor: `${G}20` }}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {menuItems.map(item => {
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.targetId)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all"
                style={{ backgroundColor: isActive ? G : 'transparent', color: isActive ? 'white' : '#374151' }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                <span className="text-sm font-semibold">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
}

// ── Profils Pour qui ──────────────────────────────────────────────────────────
interface AudienceProfile { icon: React.ReactNode; emoji: string; label: string; desc: string; color: string; match: string[]; }
const ALL_PROFILES: AudienceProfile[] = [
  { icon: <Baby className="size-5" />,         emoji: '👶', label: 'Famille avec enfants', desc: 'Activité accessible dès le plus jeune âge, idéale pour une sortie en famille inoubliable.',     color: '#f59e0b', match: ['enfant','junior','famille','accro','zip','tyrolienne','parcours'] },
  { icon: <Heart className="size-5" />,        emoji: '💑', label: 'En couple',            desc: "Partagez une montée d'adrénaline unique à deux. L'aventure renforce les liens.",               color: '#ec4899', match: ['escalade','via','rappel','canyoning','tyrolienne','saut'] },
  { icon: <Users className="size-5" />,        emoji: '👯', label: 'Entre amis',           desc: 'Les meilleurs souvenirs se créent en groupe. Défiez-vous dans une ambiance de fête.',         color: O,         match: ['accro','escalade','via','paintball','laser','karting','parcours'] },
  { icon: <Building2 className="size-5" />,    emoji: '🏢', label: 'Team building',        desc: "Cohésion d'équipe garantie. Challenges collaboratifs pensés pour les groupes pro.",           color: '#3b82f6', match: ['accro','parcours','escalade','orientation','via','zip'] },
  { icon: <PartyPopper className="size-5" />,  emoji: '🎉', label: 'EVG / EVJF',           desc: 'Un programme qui marquera les esprits avant le grand jour. Défis et fous rires assurés.',     color: '#8b5cf6', match: ['escalade','via','accro','paintball','saut','karting','laser'] },
  { icon: <GraduationCap className="size-5" />,emoji: '🎒', label: 'Sorties scolaires',    desc: "Pédagogie outdoor et apprentissage par l'expérience. Moniteurs formés à l'accueil scolaire.", color: '#16a34a', match: ['accro','escalade','parcours','orientation','nature','via'] },
  { icon: <User className="size-5" />,         emoji: '🧗', label: 'Solo & passionné',     desc: 'Perfectionnez votre technique ou découvrez une nouvelle discipline à votre rythme.',         color: '#06b6d4', match: ['escalade','via','rappel','canyoning','saut','parachute'] },
  { icon: <Heart className="size-5" />,        emoji: '🎂', label: 'Anniversaire',         desc: 'Offrez une expérience mémorable. Animations spéciales anniversaire sur demande.',            color: '#ef4444', match: ['accro','escalade','paintball','laser','karting','via','tyrolienne'] },
];

function getMatchedProfiles(activity: { name: string; description?: string }): AudienceProfile[] {
  const text = `${activity.name} ${activity.description ?? ''}`.toLowerCase();
  const matched = ALL_PROFILES.filter(p => p.match.some(kw => text.includes(kw)));
  if (matched.length < 4) return [...matched, ...ALL_PROFILES.filter(p => !matched.includes(p)).slice(0, 4 - matched.length)];
  return matched.slice(0, 6);
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function getFAQs(activity: any) {
  return [
    { q: `Faut-il de l'expérience pour pratiquer ${activity.name} ?`, a: activity.difficulty === 'Débutant' ? `Aucune expérience requise ! ${activity.name} est accessible à tous. Nos moniteurs diplômés d'État vous accompagnent de A à Z.` : `Une condition physique correcte est recommandée. Nos moniteurs adaptent l'encadrement à votre niveau.` },
    { q: `À partir de quel âge peut-on pratiquer ${activity.name} ?`, a: `L'accès est possible dès ${activity.minAge} ans. En dessous de 18 ans, une autorisation parentale est obligatoire.` },
    { q: 'Que faut-il porter et apporter ?', a: `Tenue sportive et chaussures fermées obligatoires. Tout l'équipement de sécurité est fourni et inclus.` },
    { q: 'Peut-on annuler ou reporter sa réservation ?', a: `Annulation gratuite jusqu'à 48h avant. En cas de météo défavorable, remboursement intégral ou report sans frais.` },
    { q: 'Y a-t-il des restrictions médicales ou physiques ?', a: activity.restrictions?.length > 0 ? `Oui : ${activity.restrictions.join(', ').toLowerCase()}.` : `Pas de restriction particulière. En cas de doute, contactez-nous.` },
  ];
}

// ── Carte parc polaroïd ───────────────────────────────────────────────────────
function ParkPolaroid({ park, activity, index }: { park: any; activity: any; index: number }) {
  const [hov, setHov] = useState(false);
  const rot = ROTS[index % ROTS.length];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rot * 1.8 }}
      whileInView={{ opacity: 1, y: 0, rotate: rot }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, y: -14, scale: 1.04, zIndex: 10 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative cursor-pointer"
      style={{ filter: `drop-shadow(0 ${hov ? 28 : 10}px ${hov ? 48 : 22}px rgba(0,0,0,${hov ? 0.25 : 0.14}))`, transition: 'filter 0.35s ease', transformOrigin: 'center bottom' }}
    >
      <Link to={`/parks/${park.id}`} state={{ openActivityId: activity.id }}>
        <div className="bg-white" style={{ padding: '10px 10px 0 10px', borderRadius: '4px' }}>
          <div className="relative overflow-hidden" style={{ height: '180px', borderRadius: '2px' }}>
            <motion.img src={park.image} alt={park.name} className="w-full h-full object-cover" animate={{ scale: hov ? 1.08 : 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black text-white" style={{ backgroundColor: O }}>
              <Zap className="size-2.5" />{activity.name}
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
              <Star className="size-2.5 fill-yellow-400 text-yellow-400" />{park.rating ?? '4.8'}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-3 px-2">
            <div className="font-black text-sm text-gray-800 text-center leading-tight w-full truncate" style={{ fontFamily: '"Patrick Hand", cursive, sans-serif' }}>{park.name}</div>
            <div className="flex items-center gap-1 text-gray-400 text-[10px] mt-0.5">
              <MapPin className="size-2.5" />{park.location?.split(',')[0]}
            </div>
          </div>
        </div>
        <motion.div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-black shadow-lg" style={{ background: `linear-gradient(135deg, ${G}, ${O})` }} animate={{ scale: hov ? 1.2 : 1 }} transition={{ duration: 0.2 }}>
          {index + 1}
        </motion.div>
        <AnimatePresence>
          {hov && (
            <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.18 }} className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 rounded-2xl px-3 py-2.5 text-white text-center shadow-2xl z-20 pointer-events-none" style={{ background: `linear-gradient(135deg, ${D}, #2a2a2a)`, border: '1px solid rgba(255,255,255,0.10)' }}>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45" style={{ backgroundColor: '#2a2a2a' }} />
              <div className="flex items-center justify-center gap-3 text-xs relative z-10">
                <span className="flex items-center gap-1"><Clock className="size-3" />{activity.duration}</span>
                <span className="flex items-center gap-1"><Users className="size-3" />{activity.minAge}+</span>
              </div>
              <div className="mt-1.5 text-[11px] font-bold relative z-10" style={{ color: O }}>Cliquer pour réserver →</div>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}

function HeroWave() {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
      <svg viewBox="0 0 1440 90" className="w-full" style={{ height: '90px' }} preserveAspectRatio="none">
        <path d="M0,50 C200,5 400,85 640,40 C880,-5 1080,80 1280,38 C1360,22 1410,55 1440,50 L1440,90 L0,90 Z" fill="white" />
      </svg>
    </div>
  );
}

// ── FAQ Section ───────────────────────────────────────────────────────────────
function FAQSection({ activity }: { activity: any }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = getFAQs(activity);
  return (
    <motion.section id="faq" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="flex items-center gap-2 mb-8">
        <div className="w-1 h-7 rounded-full" style={{ backgroundColor: G }} />
        <h2 className="text-3xl font-black" style={{ color: D }}>Questions fréquentes</h2>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl overflow-hidden border-2 transition-all" style={{ borderColor: isOpen ? G : '#f3f4f6' }}>
              <button onClick={() => setOpenIdx(isOpen ? null : i)} className="w-full flex items-center justify-between p-5 text-left gap-4">
                <span className="font-bold text-gray-900 text-sm leading-snug">{faq.q}</span>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all" style={{ backgroundColor: isOpen ? G : '#f3f4f6' }}>
                  <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180 text-white' : 'text-gray-500'}`} />
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-5 pb-5"><p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

// ── Pour qui Section ──────────────────────────────────────────────────────────
function PourQuiSection({ activity }: { activity: any }) {
  const profiles = getMatchedProfiles(activity);
  return (
    <motion.section id="pour-qui" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-7 rounded-full" style={{ backgroundColor: O }} />
        <h2 className="text-3xl font-black" style={{ color: D }}>Pour qui ?</h2>
      </div>
      <p className="text-gray-500 text-base mb-8 leading-relaxed">{activity.name} s'adapte à de nombreuses occasions.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile, i) => (
          <motion.div key={profile.label} initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07, type: 'spring', stiffness: 180 }} whileHover={{ y: -6, scale: 1.02 }} className="group rounded-2xl p-5 border-2 bg-white hover:shadow-lg transition-all" style={{ borderColor: `${profile.color}30` }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${profile.color}15` }}>{profile.emoji}</div>
              <div>
                <div className="font-black text-gray-900 text-sm mb-1">{profile.label}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{profile.desc}</div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: profile.color }}><CheckCircle className="size-3.5" />Recommandé</div>
              <Link to="/groups" className="text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: profile.color }}>Formules <ArrowRight className="size-3" /></Link>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="mt-6 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-5 border-2" style={{ backgroundColor: `${G}06`, borderColor: `${G}25` }}>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${G}18` }}><Target className="size-5" style={{ color: G }} /></div>
          <div>
            <div className="font-black text-gray-900 text-sm">Groupe ou événement spécial ?</div>
            <div className="text-gray-500 text-xs">Tarifs dégressifs à partir de 10 personnes · Coordinateur dédié</div>
          </div>
        </div>
        <Link to="/groups" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-white text-sm flex-shrink-0" style={{ background: `linear-gradient(135deg, ${G}, #4a9d00)` }}>
          Voir les formules groupe <ArrowRight className="size-4" />
        </Link>
      </motion.div>
    </motion.section>
  );
}

// ── Blog Section (inline dans la page activité) ───────────────────────────────
function ActivityBlogSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const total = blogPosts.length;

  return (
    <section className="relative py-16 overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-sm font-medium border" style={{ backgroundColor: `${G}10`, borderColor: `${G}30`, color: G }}>
              <BookOpen className="size-4" /> Le blog
            </div>
            <h2 className="text-3xl font-black" style={{ color: D }}>Conseils & <span style={{ color: G }}>inspirations</span></h2>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border-2 transition-all hover:shadow-md whitespace-nowrap" style={{ borderColor: G, color: G }}>
            Tous les articles <ArrowRight className="size-4" />
          </Link>
        </motion.div>

        {/* Desktop : 3 cartes fixes */}
        <div className="hidden md:grid grid-cols-3 gap-5 mb-6">
          {blogPosts.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden bg-gray-100 flex items-center justify-center text-6xl">
                {post.emoji}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-black text-white" style={{ backgroundColor: `${post.categoryColor}ee` }}>{post.category}</div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/50 rounded-full text-xs text-white">⏱ {post.readTime}</div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs text-gray-400 mb-2">{post.date}</div>
                <h3 className="font-black text-gray-900 text-base leading-tight mb-2 group-hover:opacity-80 transition-opacity line-clamp-2">{post.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">{post.author.avatar}</div>
                    <span className="text-xs font-bold text-gray-700">{post.author.name}</span>
                  </div>
                  <span className="text-xs font-bold flex items-center gap-1" style={{ color: post.categoryColor }}>Lire <ArrowRight className="size-3" /></span>
                </div>
              </div>
              <div className="h-1 w-full" style={{ backgroundColor: post.categoryColor }} />
            </motion.article>
          ))}
        </div>

        {/* Carrousel desktop (dots navigation sous les 3 cartes) */}
        <div className="hidden md:flex justify-center gap-2">
          {blogPosts.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className="rounded-full transition-all" style={{ width: i === currentSlide ? '24px' : '8px', height: '8px', backgroundColor: i === currentSlide ? O : '#d1d5db' }} />
          ))}
        </div>

        {/* Mobile : 1 carte visible + navigation */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.article
              key={currentSlide}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-gray-100 flex items-center justify-center text-6xl">
                {blogPosts[currentSlide].emoji}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-black text-white" style={{ backgroundColor: `${blogPosts[currentSlide].categoryColor}ee` }}>{blogPosts[currentSlide].category}</div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/50 rounded-full text-xs text-white">⏱ {blogPosts[currentSlide].readTime}</div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs text-gray-400 mb-2">{blogPosts[currentSlide].date}</div>
                <h3 className="font-black text-gray-900 text-base leading-tight mb-2">{blogPosts[currentSlide].title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{blogPosts[currentSlide].excerpt}</p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">{blogPosts[currentSlide].author.avatar}</div>
                    <span className="text-xs font-bold text-gray-700">{blogPosts[currentSlide].author.name}</span>
                  </div>
                  <span className="text-xs font-bold flex items-center gap-1" style={{ color: blogPosts[currentSlide].categoryColor }}>Lire <ArrowRight className="size-3" /></span>
                </div>
              </div>
              <div className="h-1 w-full" style={{ backgroundColor: blogPosts[currentSlide].categoryColor }} />
            </motion.article>
          </AnimatePresence>

          {/* Navigation mobile */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentSlide(c => (c - 1 + total) % total)} className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
              <ChevronLeft className="size-4 text-gray-600" />
            </motion.button>
            <div className="flex gap-2">
              {blogPosts.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className="rounded-full transition-all" style={{ width: i === currentSlide ? '24px' : '8px', height: '8px', backgroundColor: i === currentSlide ? O : '#d1d5db' }} />
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentSlide(c => (c + 1) % total)} className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
              <ChevronRight className="size-4 text-gray-600" />
            </motion.button>
          </div>
        </div>

      </div>
    </section>
  );
}

// ── PricingBlock ──────────────────────────────────────────────────────────────
function PricingBlock({ activity, availableParks }: { activity: any; availableParks: any[] }) {
  return (
    <section id="reserver" className="relative py-20 overflow-hidden" style={{ background: `linear-gradient(135deg, ${D} 0%, #1a2a00 60%, #0d1600 100%)` }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
      <motion.div className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ backgroundColor: G }} animate={{ scale: [1, 1.3, 1], x: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute -bottom-20 right-0 w-96 h-96 rounded-full blur-3xl opacity-15" style={{ backgroundColor: O }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-bold border border-white/20 text-white/80">
            <Sparkles className="size-4" style={{ color: O }} />Prêt à vous lancer ?
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            Réservez<br /><span style={{ color: O }}>{activity.name}</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">Confirmation instantanée · Annulation gratuite 48h avant · Encadrement pro inclus</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {/* CTA principal — sans prix */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="lg:col-span-1 rounded-3xl overflow-hidden bg-white shadow-2xl">
            <div className="h-1.5" style={{ background: `linear-gradient(to right, ${G}, ${O})` }} />
            <div className="p-8">

              {/* Stats rapides — sans prix */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { val: '98%',             label: 'Satisfaction', color: G },
                  { val: '4.9',             label: 'Note',         color: O },
                  { val: activity.duration, label: 'Durée',        color: G },
                  { val: `${activity.minAge}+`, label: 'Âge min.', color: O },
                ].map(({ val, label, color }) => (
                  <div key={label} className="text-center py-3 rounded-2xl bg-gray-50">
                    <div className="text-xl font-black" style={{ color }}>{val}</div>
                    <div className="text-xs text-gray-400">{label}</div>
                  </div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mb-3">
                <Link to="/booking" state={{ activityId: activity.id }} className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-white shadow-xl text-base" style={{ background: `linear-gradient(135deg, ${O}, #ff9a3c)`, boxShadow: `0 10px 32px ${O}45` }}>
                  <Calendar className="size-5" />Réserver maintenant
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/evenements" className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm border-2 transition-colors" style={{ borderColor: G, color: G }}>
                  <PartyPopper className="size-4" />En faire un événement
                </Link>
              </motion.div>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                {[
                  { icon: Calendar,     c: G,         t: 'Dispo immédiate',     s: 'Confirmation instantanée' },
                  { icon: Shield,       c: '#3b82f6', t: 'Annulation gratuite', s: "Jusqu'à 48h avant"       },
                  { icon: CheckCircle,  c: G,         t: 'Équipement inclus',   s: 'Harnais, casque, gants'  },
                ].map(({ icon: Icon, c, t, s }) => (
                  <div key={t} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${c}12` }}><Icon className="size-4" style={{ color: c }} /></div>
                    <div><div className="font-bold text-gray-900 text-sm">{t}</div><div className="text-xs text-gray-400">{s}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sélection de parc — mobile sans photos, info scrollable */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="lg:col-span-2 flex flex-col gap-4">
            <div>
              <div className="text-white/50 text-xs font-black uppercase tracking-wider mb-4">
                {availableParks.length} parc{availableParks.length > 1 ? 's' : ''} disponible{availableParks.length > 1 ? 's' : ''}
              </div>

              {/* Desktop : avec photos */}
              <div className="hidden sm:block space-y-3">
                {availableParks.map((park, i) => (
                  <motion.div key={park.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.07 }} whileHover={{ x: 4 }}>
                    <Link to={`/parks/${park.id}`} state={{ openActivityId: activity.id }} className="group flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/25 transition-all">
                      <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={park.image} alt={park.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-white text-base leading-tight mb-1">{park.name}</div>
                        <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2"><MapPin className="size-3.5" />{park.location}</div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-white/60"><Star className="size-3 fill-yellow-400 text-yellow-400" />{park.rating ?? '4.8'}</span>
                          <span className="flex items-center gap-1 text-xs text-white/60"><Users className="size-3" />{park.capacity} pers.</span>
                        </div>
                      </div>
                      <div className="px-5 py-2.5 rounded-xl font-black text-white text-sm flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" style={{ backgroundColor: O }}>
                        Choisir <ArrowRight className="size-4" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile : sans photos, liste scrollable compacte */}
              <div className="sm:hidden overflow-y-auto space-y-2.5 pr-1" style={{ maxHeight: '320px', scrollbarWidth: 'thin' }}>
                {availableParks.map((park, i) => (
                  <motion.div key={park.id} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                    <Link to={`/parks/${park.id}`} state={{ openActivityId: activity.id }} className="flex items-center gap-4 p-4 rounded-2xl bg-white/8 border border-white/12 active:bg-white/15 transition-all">
                      {/* Numéro au lieu de la photo */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-base flex-shrink-0" style={{ background: `linear-gradient(135deg, ${G}, ${O})` }}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-white text-sm leading-tight mb-1 truncate">{park.name}</div>
                        <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1.5"><MapPin className="size-3" />{park.location?.split(',')[0]}</div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-white/60"><Star className="size-3 fill-yellow-400 text-yellow-400" />{park.rating ?? '4.8'}</span>
                          <span className="flex items-center gap-1 text-xs text-white/60"><Users className="size-3" />{park.capacity} pers.</span>
                          {park.departement && <span className="text-xs text-white/40 font-medium">{park.departement}</span>}
                        </div>
                      </div>
                      <ChevronRight className="size-5 text-white/30 flex-shrink-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ── PAGE PRINCIPALE ───────────────────────────────────────────────────────────
export function ActivityDetailPage() {
  const { id } = useParams();
  const activity = activities.find(a => a.id === id);
  const { scrollY } = useScroll();
  const yImg = useTransform(scrollY, [0, 600], [0, -110]);
  const [activeImg,    setActiveImg]    = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx,  setLightboxIdx]  = useState(0);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${O}15` }}><AlertCircle className="size-12" style={{ color: O }} /></div>
          <h1 className="text-4xl font-black mb-4" style={{ color: D }}>Activité introuvable</h1>
          <Link to="/activities" className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-full font-bold" style={{ backgroundColor: G }}>Retour aux activités <ArrowRight className="size-5" /></Link>
        </div>
      </div>
    );
  }

  const availableParks = parks.filter(park =>
    park.activities.some(a => a.toLowerCase().includes(activity.name.toLowerCase().split(' ')[0]))
  );
  const diff    = DIFF[activity.difficulty] ?? DIFF['Débutant'];
  const gallery = activity.gallery || [activity.image, activity.image, activity.image, activity.image];

  return (
    <div className="min-h-screen bg-white">
      <ActivityAnchorMenu />

      {/* HERO */}
      <div className="relative overflow-hidden" style={{ height: '92vh' }}>
        <motion.div style={{ y: yImg }} className="absolute inset-0 will-change-transform">
          <img src={activity.image} alt={activity.name} className="w-full h-[115%] object-cover" />
        </motion.div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.32) 50%, transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${G}18 0%, transparent 55%)` }} />
        <motion.div className="absolute top-20 right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none" style={{ backgroundColor: O, opacity: 0.08 }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 12, repeat: Infinity }} />

        <div className="absolute top-28 left-6 right-6 flex items-center justify-between z-10">
          <Link to="/activities" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white backdrop-blur-md" style={{ backgroundColor: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)' }}>← Toutes les activités</Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full backdrop-blur-md" style={{ backgroundColor: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-white font-bold text-sm">4.9</span>
              <span className="text-white/45 text-xs">(842)</span>
            </div>
            <div className="px-3 py-2 rounded-full backdrop-blur-md text-sm font-bold" style={{ backgroundColor: diff.bg, color: diff.text, border: `1px solid ${diff.text}35` }}>{activity.difficulty}</div>
          </div>
        </div>

        <div className="absolute bottom-20 left-0 right-0 z-10">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
              <h1 className="text-5xl md:text-[4.5rem] font-black text-white mb-5 leading-[0.93] drop-shadow-2xl max-w-3xl tracking-tight">{activity.name}</h1>
              <div className="flex flex-wrap items-center gap-2.5 mb-7">
                {[
                  { icon: Clock,  label: activity.duration },
                  { icon: Users,  label: `Dès ${activity.minAge} ans` },
                  { icon: MapPin, label: `${availableParks.length} parc${availableParks.length > 1 ? 's' : ''}` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold text-white backdrop-blur-md" style={{ backgroundColor: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.18)' }}>
                    <Icon className="size-3.5" />{label}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/booking" state={{ activityId: activity.id }} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-black text-white text-sm" style={{ background: `linear-gradient(135deg, ${O}, #ff9a3c)`, boxShadow: `0 8px 28px ${O}55` }}>
                    <Calendar className="size-5" />Réserver maintenant
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <button onClick={() => { const el = document.getElementById('pour-qui'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' }); }} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white text-sm backdrop-blur-md" style={{ backgroundColor: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.24)' }}>
                    <Users className="size-4" />Pour qui ?
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        <HeroWave />
      </div>

      {/* CONTENU */}
      <div className="container mx-auto px-4 md:px-8 py-14 max-w-6xl">
        <div className="space-y-20">

          {/* Description */}
          <motion.section id="description" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xl text-gray-600 leading-[1.8] border-l-4 pl-6" style={{ borderColor: O }}>{activity.description}</p>
          </motion.section>

          {/* ── PARCS ── */}
          <motion.section id="parcs" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>

            {/* Comparer EN PREMIER */}
            {availableParks.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4"
                style={{ backgroundColor: `${G}08`, border: `1.5px solid ${G}25` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${G}18` }}>
                  <TreePine className="size-5" style={{ color: G }} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="font-black text-gray-900 text-sm">{availableParks.length} parcs proposent {activity.name}</div>
                  <div className="text-gray-400 text-xs mt-0.5">Comparez les emplacements, notes et disponibilités</div>
                </div>
                <Link to="/parks" className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-white text-sm" style={{ background: `linear-gradient(135deg, ${G}, #4a9d00)` }}>
                  Comparer tous les parcs <ChevronRight className="size-4" />
                </Link>
              </motion.div>
            )}

            {/* Titre */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: O }} />
                <span className="text-[11px] font-black uppercase tracking-[0.14em]" style={{ color: O }}>Où pratiquer</span>
              </div>
              <h2 className="text-3xl font-black" style={{ color: D }}>
                {availableParks.length} parc{availableParks.length > 1 ? 's' : ''}{' '}
                <span className="font-light text-gray-400">disponible{availableParks.length > 1 ? 's' : ''}</span>
              </h2>
            </div>

            {/*
              Grille polaroïds :
              PC       → 5 colonnes max (jusqu'à 5 parcs)
              Tablette → 3 colonnes
              Mobile   → 2 colonnes
            */}
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
              style={{ padding: '12px 8px 36px' }}
            >
              {availableParks.slice(0, 5).map((park, i) => (
                <ParkPolaroid key={park.id} park={park} activity={activity} index={i} />
              ))}
            </div>

            {/* Si > 5 parcs, afficher un lien */}
            {availableParks.length > 5 && (
              <div className="text-center mt-4">
                <Link to="/parks" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm border-2" style={{ borderColor: G, color: G }}>
                  Voir les {availableParks.length - 5} autres parcs <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </motion.section>

          {/* Galerie */}
          <motion.section id="galerie" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-2 mb-7">
              <div className="w-1 h-7 rounded-full" style={{ backgroundColor: G }} />
              <h2 className="text-3xl font-black" style={{ color: D }}>Galerie</h2>
              <Camera className="size-5 ml-1" style={{ color: G }} />
            </div>
            <div className="relative h-80 md:h-[460px] rounded-3xl overflow-hidden mb-4 cursor-zoom-in shadow-lg" onClick={() => { setLightboxIdx(activeImg); setLightboxOpen(true); }}>
              <AnimatePresence mode="wait">
                <motion.img key={activeImg} src={gallery[activeImg]} alt={`${activity.name} ${activeImg + 1}`} className="w-full h-full object-cover" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} />
              </AnimatePresence>
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white font-medium backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
                <Camera className="size-3.5" />Agrandir
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {gallery.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className="relative h-24 rounded-2xl overflow-hidden" style={{ outline: activeImg === i ? `2.5px solid ${O}` : '2.5px solid transparent', outlineOffset: '2px' }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {activeImg !== i && <div className="absolute inset-0 bg-black/22 hover:bg-black/0 transition-colors" />}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Inclus + Restrictions */}
          <motion.section id="inclus" className="grid grid-cols-1 md:grid-cols-2 gap-5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="rounded-2xl p-6 border border-gray-100 shadow-sm" style={{ background: 'linear-gradient(135deg, #f0fdf4, #f7fef4)' }}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${G}18` }}><CheckCircle className="size-5" style={{ color: G }} /></div>
                <h3 className="text-lg font-black" style={{ color: D }}>Inclus</h3>
              </div>
              <ul className="space-y-2.5">
                {['Équipement complet', 'Encadrement pro', 'Assurance', 'Briefing sécurité'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 font-medium text-sm">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${G}18` }}><CheckCircle className="size-3.5" style={{ color: G }} /></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-6 border shadow-sm" style={{ background: `${O}08`, borderColor: `${O}28` }}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${O}18` }}><Info className="size-5" style={{ color: O }} /></div>
                <h3 className="text-lg font-black" style={{ color: D }}>Restrictions</h3>
              </div>
              <ul className="space-y-2.5">
                {activity.restrictions.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 font-medium text-sm">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: O }} />{r}
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* FAQ */}
          <FAQSection activity={activity} />

          {/* Pour qui */}
          <PourQuiSection activity={activity} />

        </div>
      </div>

      {/* Blog */}
      <ActivityBlogSection />

      {/* Réserver */}
      <PricingBlock activity={activity} availableParks={availableParks} />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.92)' }} onClick={() => setLightboxOpen(false)}>
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 z-10"><X className="size-6" /></motion.button>
            <motion.img key={lightboxIdx} src={gallery[lightboxIdx]} alt={`Photo ${lightboxIdx + 1}`} className="max-w-5xl max-h-[85vh] w-full object-contain rounded-2xl shadow-2xl px-4" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={e => e.stopPropagation()} />
            <div className="absolute bottom-6 flex gap-2">
              {gallery.slice(0, 4).map((_, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setLightboxIdx(i); }} className="h-2 rounded-full transition-all" style={{ width: i === lightboxIdx ? '24px' : '8px', backgroundColor: i === lightboxIdx ? O : 'rgba(255,255,255,0.35)' }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// pages/groups/GroupeAdultesPage.tsx — EVG, EVJF, Anniversaires & Fêtes adultes
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PartyPopper, Users, Calendar, Phone, ArrowRight, CheckCircle,
  Star, Heart, ChevronRight, Camera, Music,
  Sparkles, Gift, Crown, Flame, Trophy
} from 'lucide-react';
import { useGroupsAdults } from '../../hooks/useGroupsData';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#0d0d0d';
const GOLD = '#d97706';
const PINK = '#ec4899';

const EVENT_TYPES = [
  {
    id: 'evg',
    emoji: '🕺',
    label: 'EVG',
    fullLabel: "Enterrement de Vie de Garçon",
    color: '#1e40af',
    accent: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=700&h=500&fit=crop',
    tagline: 'Une aventure dont le futur marié parlera longtemps',
    highlights: ['Défis personnalisés au prénom', 'Classements et pénalités fun', 'Photo-souvenir groupe', 'Options soirée ajoutables'],
    minPeople: 4,
    maxPeople: 30,
    price: 'Dès 38€/pers.',
    popular: false,
  },
  {
    id: 'evjf',
    emoji: '💃',
    label: 'EVJF',
    fullLabel: "Enterrement de Vie de Jeune Fille",
    color: '#9d174d',
    accent: PINK,
    image: 'https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=700&h=500&fit=crop',
    tagline: 'La journée parfaite avant le grand jour',
    highlights: ['Bandeau "Future Mariée" fourni', 'Challenges personnalisés', 'Goûter champagne en option', 'Animation bachelorette'],
    minPeople: 4,
    maxPeople: 25,
    price: 'Dès 38€/pers.',
    popular: true,
  },
  {
    id: 'anniversaire',
    emoji: '🎂',
    label: 'Anniversaire',
    fullLabel: 'Anniversaire adulte',
    color: GOLD,
    accent: '#fbbf24',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=700&h=500&fit=crop',
    tagline: 'Les 30, 40, 50, 60 ans qui laissent une trace',
    highlights: ['Décoration personnalisée possible', 'Gâteau sur commande', 'Activité au choix de l\'heureux élu', 'Vidéo souvenir'],
    minPeople: 6,
    maxPeople: 50,
    price: 'Dès 35€/pers.',
    popular: false,
  },
  {
    id: 'soiree',
    emoji: '🔥',
    label: 'Soirée privée',
    fullLabel: 'Soirée / Fête entre amis',
    color: '#7c3aed',
    accent: '#a855f7',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700&h=500&fit=crop',
    tagline: 'Parce que les amis méritent mieux que le bar du coin',
    highlights: ['Créneau privatisé possible', 'Bar et catering options', 'Ambiance musicale', 'Jeux & animations adultes'],
    minPeople: 8,
    maxPeople: 60,
    price: 'Sur devis',
    popular: false,
  },
];

const ADD_ONS = [
  { icon: Camera, label: 'Photographe', desc: 'Pro pendant 2h', price: '+90€', color: '#3b82f6' },
  { icon: Music, label: 'Sound system', desc: 'Playlist & sono', price: '+60€', color: '#8b5cf6' },
  { icon: Gift, label: 'Cadeau surprise', desc: 'Organisé par nous', price: '+45€', color: PINK },
  { icon: Crown, label: 'Pack VIP', desc: 'Accueil champagne', price: '+35€/pers.', color: GOLD },
  { icon: Flame, label: 'Défi pimenté', desc: 'Challenges osés', price: '+25€', color: ORANGE },
  { icon: Trophy, label: 'Cérémonie', desc: 'Remise de prix', price: '+40€', color: GREEN },
];

const TESTIMONIALS_ADULTS = [
  {
    text: "EVG de Jules : 14 potes, 1 journée d'escalade + via ferrata + défis. Le marié a pleuré de rire. Meilleur EVG qu'on ait organisé. On reviendra pour l'anniv de Marco.",
    author: 'Antoine F.',
    role: 'Témoin · EVG de 14 personnes',
    rating: 5,
    avatar: '🕺',
    event: 'EVG',
    eventColor: '#3b82f6',
  },
  {
    text: "Mon EVJF de rêve. Sophie (l'organisatrice) nous a préparé des défis personnalisés avec des anecdotes sur moi. On a ri, on a grimpé, on a pleuré de bonheur.",
    author: 'Camille L.',
    role: 'Future mariée · EVJF 10 filles',
    rating: 5,
    avatar: '💍',
    event: 'EVJF',
    eventColor: PINK,
  },
  {
    text: "Mes 40 ans avec 20 amis d'enfance. Je craignais le vide — c'était la meilleure journée de ma vie adulte. Merci pour la surprise au moment du goûter.",
    author: 'Bertrand M.',
    role: 'Anniversaire 40 ans · 20 personnes',
    rating: 5,
    avatar: '🎂',
    event: 'Anniversaire',
    eventColor: GOLD,
  },
];

// ─── Composants avec props ────────────────────────────────────────────────────

function AdultesHero({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <section className="relative min-h-[85vh] overflow-hidden flex items-end">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1800&h=900&fit=crop" alt="Fête entre amis" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${DARK}CC 0%, transparent 60%)` }} />

      {['🎉', '🥳', '🎊', '✨', '🔥'].map((emoji, i) => (
        <motion.div key={i} className="absolute text-3xl pointer-events-none select-none"
          style={{ top: `${10 + i * 15}%`, right: `${5 + i * 6}%` }}
          animate={{ y: [0, -20, 0], rotate: [0, 15, -15, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}>
          {emoji}
        </motion.div>
      ))}

      <div className="relative z-10 container mx-auto px-6 pb-24 w-full">
        <div className="flex items-center gap-2 text-white/50 text-sm mb-8">
          <Link to="/" className="hover:text-white/70">Accueil</Link>
          <ChevronRight className="size-3.5" />
          <Link to="/groups" className="hover:text-white/70">Groupes</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-white/80">Adultes & Fêtes</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 text-white/80" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <PartyPopper className="size-4" style={{ color: GOLD }} /> EVG · EVJF · Anniversaires · Soirées
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tight mb-6">
            {title || (<>Des souvenirs<br />dont vous<br /><span style={{ color: GOLD }}>parlerez 10 ans.</span></>)}
          </h1>
          <p className="text-white/70 text-xl max-w-xl leading-relaxed mb-10">
            {subtitle || "Finis les after-works mollassons. Les plus belles fêtes se vivent dans l'action, sous l'adrénaline et avec des rires qu'on entend depuis la vallée."}
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/devis" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #d66310)`, boxShadow: `0 12px 40px ${ORANGE}50` }}>
                <Calendar className="size-5" /> Organiser mon événement <ArrowRight className="size-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }}>
              <a href="tel:0123456789" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white border border-white/30" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <Phone className="size-5" /> 01 23 45 67 89
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none">
          <path d="M0,30 C240,60 480,0 720,40 C960,70 1200,10 1440,35 L1440,60 L0,60 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

function EventTypesSection({ eventTypes }: { eventTypes: typeof EVENT_TYPES }) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: DARK }}>
            Quelle est<br /><span style={{ color: ORANGE }}>l'occasion ?</span>
          </h2>
          <p className="text-gray-500 text-lg">Chaque événement mérite son propre programme. On s'occupe de tout.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {eventTypes.map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }} className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer">
              <Link to="/devis" className="block">
                <div className="relative h-64 overflow-hidden">
                  <img src={event.image} alt={event.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${event.color}88 0%, transparent 70%)` }} />
                  {event.popular && (
                    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                      className="absolute top-4 right-4 px-4 py-1.5 rounded-2xl text-xs font-black text-white shadow-lg"
                      style={{ background: `linear-gradient(to right, ${PINK}, #be185d)` }}>
                      💃 Le plus populaire
                    </motion.div>
                  )}
                  <div className="absolute top-4 left-4 text-4xl">{event.emoji}</div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-white font-black text-2xl mb-0.5">{event.label}</div>
                    <div className="text-white/70 text-sm">{event.fullLabel}</div>
                  </div>
                </div>
                <div className="bg-white p-6">
                  <p className="font-bold text-gray-800 text-base mb-4 italic">"{event.tagline}"</p>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {event.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-gray-600">
                        <Sparkles className="size-3.5 flex-shrink-0" style={{ color: event.accent }} />
                        {h}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="font-black text-lg" style={{ color: event.accent }}>{event.price}</div>
                      <div className="text-xs text-gray-400">{event.minPeople}–{event.maxPeople} pers.</div>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-2xl text-white"
                      style={{ background: `linear-gradient(to right, ${event.accent}, ${event.color})` }}>
                      Organiser <ArrowRight className="size-4" />
                    </div>
                  </div>
                </div>
                <div className="h-1" style={{ backgroundColor: event.accent }} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AddOnsSection({ addOns }: { addOns: typeof ADD_ONS }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-bold border" style={{ backgroundColor: `${GOLD}15`, borderColor: `${GOLD}40`, color: GOLD }}>
            <Crown className="size-4" /> Options & extras
          </div>
          <h2 className="text-4xl font-black mb-3" style={{ color: DARK }}>
            Personnalisez votre<br /><span style={{ color: GOLD }}>journée</span>
          </h2>
          <p className="text-gray-500">Ajoutez des options pour rendre votre événement encore plus mémorable</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {addOns.map((addon, i) => (
            <motion.div key={addon.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -6, scale: 1.04 }}
              className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-100 text-center hover:shadow-xl transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${addon.color}15` }}>
                <addon.icon className="size-6" style={{ color: addon.color }} />
              </div>
              <div className="font-black text-sm text-gray-900 mb-1">{addon.label}</div>
              <div className="text-xs text-gray-500 mb-2">{addon.desc}</div>
              <div className="font-black text-sm" style={{ color: addon.color }}>{addon.price}</div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-gray-400 text-sm mt-8">Options à personnaliser lors de votre demande de devis · Combinables entre elles</p>
      </div>
    </section>
  );
}

function TestimonialsAdults({ testimonials }: { testimonials: typeof TESTIMONIALS_ADULTS }) {
  return (
    <section className="py-20" style={{ backgroundColor: DARK }}>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4">
            Ils en parlent<br /><span style={{ color: GOLD }}>encore</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="rounded-3xl p-7 bg-white/5 border border-white/10">
              <div className="inline-flex px-3 py-1 rounded-full text-xs font-black text-white mb-5" style={{ backgroundColor: t.eventColor }}>
                {t.event}
              </div>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => <Star key={s} className="size-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-white/80 italic text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-base">{t.avatar}</div>
                <div>
                  <div className="font-bold text-white text-sm">{t.author}</div>
                  <div className="text-white/50 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAAdultes() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: `linear-gradient(135deg, #1a0a00 0%, #2d1500 50%, #1a0a00 100%)` }}>
      <motion.div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: GOLD }}
        animate={{ scale: [1, 1.3, 1], x: [0, -40, 0] }} transition={{ duration: 8, repeat: Infinity }} />
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-6xl mb-5">🥂</div>
          <h2 className="text-5xl font-black text-white mb-5 leading-tight">
            Votre fête mérite<br /><span style={{ color: GOLD }}>d'être inoubliable</span>
          </h2>
          <p className="text-white/60 text-xl mb-10 max-w-xl mx-auto">
            Devis gratuit en 24h · Programme 100% personnalisé · On s'occupe de tout
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/devis" className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-white shadow-2xl text-lg"
              style={{ background: `linear-gradient(135deg, ${ORANGE}, #c2520a)` }}>
              <Calendar className="size-6" /> Organiser mon événement <ArrowRight className="size-6" />
            </Link>
            <a href="tel:0123456789" className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-white border-2 border-white/20 text-lg hover:bg-white/10 transition-colors">
              <Phone className="size-6" /> Appeler directement
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function GroupeAdultesPage() {
  const { data: adultData } = useGroupsAdults();

  const eventTypes = adultData.eventTypes?.length > 0
    ? adultData.eventTypes.map((et: any, i: number) => ({
        ...EVENT_TYPES[i % EVENT_TYPES.length],
        id: et.id || `et-${i}`,
        label: et.label || EVENT_TYPES[i]?.label || '',
        fullLabel: et.fullLabel || et.description || EVENT_TYPES[i]?.fullLabel || '',
        tagline: et.tagline || EVENT_TYPES[i]?.tagline || '',
        highlights: et.highlights || EVENT_TYPES[i]?.highlights || [],
        minPeople: et.minPeople || EVENT_TYPES[i]?.minPeople || 4,
        maxPeople: et.maxPeople || EVENT_TYPES[i]?.maxPeople || 50,
        price: et.price || EVENT_TYPES[i]?.price || '',
        popular: et.popular || EVENT_TYPES[i]?.popular || false,
      }))
    : EVENT_TYPES;

  const addOns = adultData.addOns?.length > 0
    ? adultData.addOns.map((ao: any, i: number) => ({
        ...ADD_ONS[i % ADD_ONS.length],
        label: ao.label || ADD_ONS[i]?.label || '',
        desc: ao.desc || ao.description || ADD_ONS[i]?.desc || '',
        price: ao.price || ADD_ONS[i]?.price || '',
      }))
    : ADD_ONS;

  const testimonials = adultData.testimonials?.length > 0
    ? adultData.testimonials.map((t: any, i: number) => ({
        text: t.text || t.quote || '',
        author: t.author || t.name || '',
        role: t.role || '',
        rating: t.rating || 5,
        avatar: t.avatar || '👤',
        event: t.event || t.category || '',
        eventColor: t.eventColor || t.categoryColor || GOLD,
      }))
    : TESTIMONIALS_ADULTS;

  return (
    <div className="min-h-screen bg-white">
      <AdultesHero title={adultData.hero?.title} subtitle={adultData.hero?.subtitle} />
      <EventTypesSection eventTypes={eventTypes} />
      <AddOnsSection addOns={addOns} />
      <TestimonialsAdults testimonials={testimonials} />
      <CTAAdultes />
    </div>
  );
}

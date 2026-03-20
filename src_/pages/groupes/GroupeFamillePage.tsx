// pages/groups/GroupeFamillePage.tsx — Grandes familles & multi-générations
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Calendar, Phone, ArrowRight, CheckCircle,
  Star, Heart, ChevronRight, TreePine, Sun, MapPin,
  Baby, Shield, Camera, Utensils
} from 'lucide-react';
import { useGroupsFamily } from '../../hooks/useGroupsData';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';
const WARM = '#92400e';
const TEAL = '#0d9488';

const FAMILY_PACKS = [
  {
    id: 'reunion',
    emoji: '🏡',
    title: 'Réunion de famille',
    subtitle: 'Retrouvailles annuelles',
    desc: 'La journée qui réunit tout le monde autour d\'une même aventure. Des grands-parents aux petits-enfants, chaque génération y trouve sa place.',
    minPeople: 8,
    maxPeople: 60,
    price: 'Dès 22€/pers.',
    color: GREEN,
    popular: true,
    includes: ['Activités multi-niveaux en parallèle', 'Zone pique-nique réservée', 'Animateur famille dédié', 'Photo de groupe offerte', 'Tarif -3 ans : gratuit'],
  },
  {
    id: 'multi-gen',
    emoji: '👴👨👧',
    title: 'Multi-générations',
    subtitle: 'De 3 à 80 ans',
    desc: 'Un programme pensé pour que chaque génération vive sa propre aventure tout en partageant les mêmes souvenirs.',
    minPeople: 12,
    maxPeople: 80,
    price: 'Sur devis',
    color: TEAL,
    popular: false,
    includes: ['Parcours seniors adaptés PMR', 'Zone jeux libres pour les tout-petits', 'Activités adultes et ados séparées', 'Point de rendez-vous commun', 'Repas / pique-nique coordonné'],
  },
  {
    id: 'weekend',
    emoji: '⛺',
    title: 'Week-end famille',
    subtitle: '2 jours · hébergement inclus',
    desc: 'Le weekend qui crée des souvenirs pour 20 ans. Activités le samedi, détente et repas du soir, activités légères le dimanche.',
    minPeople: 10,
    maxPeople: 40,
    price: 'Sur devis',
    color: WARM,
    popular: false,
    includes: ['Programme 2 jours', 'Hébergement partenaire', 'Repas du soir inclus', 'Petit-déjeuner buffet', 'Soirée contes & jeux'],
  },
];

const GENERATIONS = [
  {
    emoji: '👶',
    range: '0 – 4 ans',
    label: 'Les bébés aventuriers',
    color: '#fbbf24',
    activities: ['Zone jeux sécurisée', 'Observation nature guidée', 'Atelier peinture nature', 'Promenade nature poussette'],
    note: 'Gratuit · Encadrement parental requis',
  },
  {
    emoji: '🧒',
    range: '5 – 11 ans',
    label: 'Les explorateurs',
    color: GREEN,
    activities: ['Accrobranche junior', 'Chasse au trésor', 'Orientation nature', 'Tyrolienne courte'],
    note: 'Dès 5 ans · 1 moniteur / 5 enfants',
  },
  {
    emoji: '🧑',
    range: '12 – 17 ans',
    label: 'Les challengers',
    color: ORANGE,
    activities: ['Escalade sport', 'Via ferrata', 'Accrobranche expert', 'Rappel'],
    note: 'Autonomes · Défis avancés disponibles',
  },
  {
    emoji: '🧑‍🦳',
    range: '60+ ans',
    label: 'Les sages aventuriers',
    color: TEAL,
    activities: ['Randonnée guidée', 'Parcours PMR', 'Accrobranche bas', 'Atelier faune & flore'],
    note: 'Adapté · Rythme personnalisé',
  },
];

const TESTIMONIALS_FAMILY = [
  {
    text: "Réunion familiale avec 45 personnes de 3 à 78 ans. Tout le monde a trouvé son activité, même grand-père qui n'avait pas fait de sport depuis 30 ans. Un miracle.",
    author: 'Isabelle G.',
    role: 'Réunion de famille · 45 pers. · 4 générations',
    rating: 5,
    avatar: '👨‍👩‍👧‍👦',
  },
  {
    text: "Week-end famille avec nos deux fratries. L'organisation était parfaite, le repas du soir incroyable. Les enfants ont dormi dans la voiture en souriant. Parfait.",
    author: 'Jean-Pierre L.',
    role: 'Week-end famille · 28 personnes',
    rating: 5,
    avatar: '🏡',
  },
  {
    text: "Ce qui m'a bluffé : la façon dont l'équipe a géré les âges si différents. Ma belle-mère de 74 ans et mon neveu de 6 ans ont eu leur propre aventure ET partagé la même.",
    author: 'Marie-Laure B.',
    role: 'Multi-générations · 35 pers.',
    rating: 5,
    avatar: '👴👧',
  },
];

const PRACTICAL_INFO = [
  { icon: Baby, text: 'Moins de 3 ans : accès gratuit avec activités adaptées', color: '#f59e0b' },
  { icon: MapPin, text: 'Parking familial gratuit avec accès direct — pas de marche à pied', color: GREEN },
  { icon: Utensils, text: 'Zone pique-nique couverte et snack bar sur place', color: ORANGE },
  { icon: Shield, text: 'Parcours PMR disponibles pour seniors et mobilité réduite', color: TEAL },
  { icon: Camera, text: 'Séance photo de groupe offerte pour les familles de 10+', color: '#8b5cf6' },
  { icon: Sun, text: 'Zone ombre et détente avec transats pour les non-participants', color: '#d97706' },
];

// ─── Composants avec props ────────────────────────────────────────────────────

function FamilleHero({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <section className="relative min-h-[85vh] overflow-hidden flex items-end">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1800&h=900&fit=crop" alt="Grande famille en aventure" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${GREEN}55 0%, transparent 60%)` }} />

      <div className="relative z-10 container mx-auto px-6 pb-24 w-full">
        <div className="flex items-center gap-2 text-white/50 text-sm mb-8">
          <Link to="/" className="hover:text-white/70">Accueil</Link>
          <ChevronRight className="size-3.5" />
          <Link to="/groups" className="hover:text-white/70">Groupes</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-white/80">Familles</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 text-white/80" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <TreePine className="size-4 text-green-400" /> Réunions de famille · Multi-générations · Week-ends
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tight mb-6">
            {title || (<>Des moments<br />qui durent<br /><span style={{ color: '#86efac' }}>toujours.</span></>)}
          </h1>
          <p className="text-white/70 text-xl max-w-xl leading-relaxed mb-10">
            {subtitle || "Des grands-parents aux petits-enfants — un endroit où toutes les générations se retrouvent autour d'une même aventure, chacun à son rythme."}
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/devis" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #d66310)`, boxShadow: `0 12px 40px ${ORANGE}50` }}>
                <Calendar className="size-5" /> Organiser notre réunion <ArrowRight className="size-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }}>
              <a href="tel:0123456789" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white border border-white/30" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <Phone className="size-5" /> 01 23 45 67 89
              </a>
            </motion.div>
          </div>
          <div className="flex flex-wrap gap-3 mt-10">
            {[{ icon: '👶', text: 'Dès 0 an' }, { icon: '👴', text: "Jusqu'à 90 ans" }, { icon: '♿', text: 'Accessible PMR' }, { icon: '🆓', text: '-3 ans gratuit' }].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-white/10 border border-white/20 backdrop-blur-sm">
                <span>{icon}</span> {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none">
          <path d="M0,35 C300,65 600,5 900,45 C1100,65 1300,20 1440,40 L1440,60 L0,60 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

function GenerationsSection({ generations }: { generations: typeof GENERATIONS }) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: DARK }}>
            Une aventure pour<br /><span style={{ color: GREEN }}>chaque génération</span>
          </h2>
          <p className="text-gray-500 text-lg">Chacun vit sa propre expérience, tous partagent les mêmes souvenirs</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {generations.map((gen, i) => (
            <motion.div key={gen.range} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }}
              className="rounded-3xl overflow-hidden shadow-lg border-2 bg-white" style={{ borderColor: `${gen.color}35` }}>
              <div className="p-6 text-center" style={{ background: `linear-gradient(135deg, ${gen.color} 0%, ${gen.color}cc 100%)` }}>
                <div className="text-5xl mb-3">{gen.emoji}</div>
                <div className="text-white font-black text-xl">{gen.range}</div>
                <div className="text-white/80 text-sm font-medium">{gen.label}</div>
              </div>
              <div className="p-5">
                <div className="space-y-2.5 mb-4">
                  {gen.activities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-4 flex-shrink-0" style={{ color: gen.color }} />
                      {a}
                    </div>
                  ))}
                </div>
                <div className="text-xs font-medium p-3 rounded-xl" style={{ backgroundColor: `${gen.color}10`, color: gen.color }}>
                  {gen.note}
                </div>
              </div>
              <div className="h-1" style={{ backgroundColor: gen.color }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PacksSection({ familyPacks }: { familyPacks: typeof FAMILY_PACKS }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-bold border" style={{ backgroundColor: `${GREEN}10`, borderColor: `${GREEN}30`, color: GREEN }}>
            <Heart className="size-4" /> Nos formules famille
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: DARK }}>
            Choisissez votre<br /><span style={{ color: GREEN }}>formule</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {familyPacks.map((pack, i) => (
            <motion.div key={pack.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} whileHover={{ y: -8 }} className="relative">
              {pack.popular && (
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-5 py-1.5 rounded-full text-xs font-black text-white shadow-lg"
                  style={{ background: `linear-gradient(to right, ${GREEN}, #4a9d00)` }}>
                  🏡 Le plus choisi
                </motion.div>
              )}
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl h-full flex flex-col"
                style={{ border: pack.popular ? `2px solid ${GREEN}` : '2px solid #f3f4f6' }}>
                <div className="p-7 flex-1">
                  <div className="text-4xl mb-4">{pack.emoji}</div>
                  <h3 className="text-2xl font-black mb-1" style={{ color: DARK }}>{pack.title}</h3>
                  <p className="text-sm font-bold mb-4" style={{ color: pack.color }}>{pack.subtitle}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{pack.desc}</p>
                  <div className="flex items-center gap-3 mb-5 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><Users className="size-4" />{pack.minPeople}–{pack.maxPeople} pers.</span>
                    <span className="font-black" style={{ color: pack.color }}>{pack.price}</span>
                  </div>
                  <div className="space-y-2.5">
                    {pack.includes.map((item) => (
                      <div key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <CheckCircle className="size-4 flex-shrink-0" style={{ color: pack.color }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-5 border-t border-gray-100">
                  <Link to="/devis"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-base transition-all hover:shadow-lg"
                    style={pack.popular ? { background: `linear-gradient(to right, ${GREEN}, #4a9d00)`, color: 'white' } : { backgroundColor: `${pack.color}10`, color: pack.color }}>
                    Choisir cette formule <ArrowRight className="size-5" />
                  </Link>
                </div>
                <div className="h-1" style={{ backgroundColor: pack.color }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PracticalSection({ practicalInfo }: { practicalInfo: typeof PRACTICAL_INFO }) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4" style={{ color: DARK }}>
            Tout est prévu pour<br /><span style={{ color: TEAL }}>votre confort</span>
          </h2>
          <p className="text-gray-500">On a pensé aux détails qui comptent pour les familles</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {practicalInfo.map((info, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border-2 border-gray-100">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${info.color}15` }}>
                <info.icon className="size-5" style={{ color: info.color }} />
              </div>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">{info.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsFamily({ testimonials }: { testimonials: typeof TESTIMONIALS_FAMILY }) {
  return (
    <section className="py-20" style={{ background: `linear-gradient(160deg, #0d2600 0%, #1a4a00 100%)` }}>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4">
            Des familles qui<br /><span style={{ color: '#86efac' }}>reviennent chaque année</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="rounded-3xl p-7 bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => <Star key={s} className="size-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-white/85 italic text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">{t.avatar}</div>
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

function CTAFamille() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-5xl mb-5">🌳</div>
          <h2 className="text-4xl font-black mb-4" style={{ color: DARK }}>
            Votre prochaine réunion de famille<br /><span style={{ color: GREEN }}>commence ici</span>
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
            Devis gratuit · Programme personnalisé · De 8 à 80 personnes · Toutes générations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/devis" className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-white shadow-xl text-lg"
              style={{ background: `linear-gradient(135deg, ${GREEN}, #2d6100)` }}>
              <Calendar className="size-6" /> Organiser notre réunion
            </Link>
            <a href="tel:0123456789" className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold border-2 text-gray-700 text-lg hover:shadow-md transition-all"
              style={{ borderColor: `${GREEN}50` }}>
              <Phone className="size-6" style={{ color: GREEN }} /> Parler à l'équipe
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function GroupeFamillePage() {
  const { data: famData } = useGroupsFamily();

  const generations = famData.generations?.length > 0
    ? famData.generations.map((g: any, i: number) => ({
        emoji: g.emoji || GENERATIONS[i]?.emoji || '👶',
        range: g.age || g.range || GENERATIONS[i]?.range || '',
        label: g.label || GENERATIONS[i]?.label || '',
        color: g.color || GENERATIONS[i]?.color || GREEN,
        activities: Array.isArray(g.activities) ? g.activities : (g.activities?.split(',').map((a: string) => a.trim()) || GENERATIONS[i]?.activities || []),
        note: g.note || GENERATIONS[i]?.note || '',
      }))
    : GENERATIONS;

  const familyPacks = famData.familyPacks?.length > 0
    ? famData.familyPacks.map((p: any, i: number) => ({
        ...FAMILY_PACKS[i % FAMILY_PACKS.length],
        id: p.id || `pack-${i}`,
        title: p.title || FAMILY_PACKS[i]?.title || '',
        subtitle: p.subtitle || FAMILY_PACKS[i]?.subtitle || '',
        desc: p.desc || p.description || FAMILY_PACKS[i]?.desc || '',
        minPeople: p.minPersons || p.minPeople || FAMILY_PACKS[i]?.minPeople || 8,
        maxPeople: p.maxPersons || p.maxPeople || FAMILY_PACKS[i]?.maxPeople || 60,
        price: p.price || FAMILY_PACKS[i]?.price || '',
        includes: p.includes || FAMILY_PACKS[i]?.includes || [],
        popular: p.popular || FAMILY_PACKS[i]?.popular || false,
        color: p.color || FAMILY_PACKS[i]?.color || GREEN,
      }))
    : FAMILY_PACKS;

  const testimonials = famData.testimonials?.length > 0
    ? famData.testimonials.map((t: any) => ({
        text: t.text || t.quote || '',
        author: t.author || t.name || '',
        role: t.role || '',
        rating: t.rating || 5,
        avatar: t.avatar || '👨‍👩‍👧‍👦',
      }))
    : TESTIMONIALS_FAMILY;

  return (
    <div className="min-h-screen bg-white">
      <FamilleHero title={famData.hero?.title} subtitle={famData.hero?.subtitle} />
      <GenerationsSection generations={generations} />
      <PacksSection familyPacks={familyPacks} />
      <PracticalSection practicalInfo={PRACTICAL_INFO} />
      <TestimonialsFamily testimonials={testimonials} />
      <CTAFamille />
    </div>
  );
}

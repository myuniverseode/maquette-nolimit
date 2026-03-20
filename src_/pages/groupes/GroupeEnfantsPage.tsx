// pages/groups/GroupeEnfantsPage.tsx — Enfants, Ados, Écoles & Anniversaires
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Users, Calendar, Phone, ArrowRight, CheckCircle,
  Shield, Star, Heart, ChevronRight, Smile, Cake,
  BookOpen, Award, AlertCircle, Mail
} from 'lucide-react';
import { useGroupsKids } from '../../hooks/useGroupsData';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';
const KIDS_BLUE = '#2563eb';
const KIDS_PURPLE = '#7c3aed';

const AGE_GROUPS = [
  {
    range: '5 – 7 ans',
    emoji: '🐣',
    label: 'Les explorateurs',
    color: '#f59e0b',
    activities: ['Accrobranche junior (max 3m)', 'Parcours de motricité', 'Chasse au trésor nature', 'Atelier orientation'],
    ratio: '1 moniteur / 5 enfants',
    duration: '1h30 – 2h',
  },
  {
    range: '8 – 12 ans',
    emoji: '🧗',
    label: 'Les aventuriers',
    color: GREEN,
    activities: ['Escalade initiation', 'Accrobranche intermédiaire', 'Via ferrata découverte', 'Tyrolienne'],
    ratio: '1 moniteur / 6 enfants',
    duration: '2h – 3h',
  },
  {
    range: '13 – 17 ans',
    emoji: '⚡',
    label: 'Les challengers',
    color: KIDS_PURPLE,
    activities: ['Escalade sport', 'Accrobranche expert', 'Via ferrata complète', 'Descente en rappel'],
    ratio: '1 moniteur / 8 ados',
    duration: '3h – demi-journée',
  },
];

const BOOKING_TYPES = [
  {
    id: 'scolaire',
    icon: GraduationCap,
    emoji: '🏫',
    title: 'Sortie scolaire',
    subtitle: 'Maternelle, primaire, collège, lycée',
    desc: 'Contenu pédagogique adapté aux niveaux scolaires. Fiches de liaison, autorisation parentale type, compte-rendu pour les enseignants.',
    minPeople: 15,
    maxPeople: 120,
    price: 'Dès 18€/élève',
    color: KIDS_BLUE,
    popular: false,
    perks: ['Facturation établissement', 'Fiche pédagogique incluse', 'Autorisations parentales type', 'Transport bus facilité'],
  },
  {
    id: 'anniversaire',
    icon: Cake,
    emoji: '🎂',
    title: 'Anniversaire',
    subtitle: 'Pour les 5 – 17 ans',
    desc: 'Un anniversaire inoubliable avec activités, animation, goûter et photo de groupe. Le cadeau d\'aventure qui impressionne tous les parents.',
    minPeople: 6,
    maxPeople: 30,
    price: 'Dès 25€/enfant',
    color: ORANGE,
    popular: true,
    perks: ['Goûter inclus', 'Décoration thème possible', 'Photo de groupe offerte', 'Animation anniversaire'],
  },
  {
    id: 'colonie',
    icon: BookOpen,
    emoji: '⛺',
    title: 'Séjour & colonie',
    subtitle: 'Multi-activités, 1 à 5 jours',
    desc: 'Programme pluriactivités pour centres de vacances, colonies et accueils de loisirs. Hébergement partenaire disponible.',
    minPeople: 12,
    maxPeople: 80,
    price: 'Sur devis',
    color: GREEN,
    popular: false,
    perks: ['Multi-activités programmées', 'Hébergement partenaire', 'Repas complets', 'Programme journalier'],
  },
  {
    id: 'cohesion',
    icon: Heart,
    emoji: '🤝',
    title: 'Cohésion de classe',
    subtitle: 'Rentrée, intégration, conseil de classe',
    desc: 'Idéal en début d\'année ou après une période difficile. Défis collaboratifs qui brisent les clichés et créent du lien entre élèves.',
    minPeople: 15,
    maxPeople: 35,
    price: 'Dès 22€/élève',
    color: KIDS_PURPLE,
    popular: false,
    perks: ['Objectif pédagogique défini', 'Débriefing guidé', 'Compte-rendu classe', 'Adapté aux besoins spécifiques'],
  },
];

const TESTIMONIALS_KIDS = [
  {
    text: "Mes 60 CM2 ont vécu la meilleure sortie scolaire de l'année. Les moniteurs étaient incroyablement patients et pédagogues. La sécurité était irréprochable.",
    author: 'Madame Leclerc',
    role: 'Institutrice CE2 · 25 élèves',
    rating: 5,
    avatar: '👩‍🏫',
  },
  {
    text: "L'anniversaire de Léa (8 ans) au parc : un succès total. Tous les enfants étaient euphoriques. Le goûter était délicieux, l'animation top. On reviendra !",
    author: 'Sophie M.',
    role: 'Maman de Léa · 12 enfants',
    rating: 5,
    avatar: '🎂',
  },
  {
    text: "Séjour de 3 jours avec nos ados de la MJC. Programme varié, encadrement bienveillant. Les ados les plus réticents sont repartis les premiers à vouloir revenir.",
    author: 'Julien B.',
    role: 'Animateur MJC · 20 ados',
    rating: 5,
    avatar: '⛺',
  },
];

const SAFETY_POINTS = [
  { icon: Shield, text: 'Matériel certifié EN adapté aux gabarits enfants — taille et poids pris en compte' },
  { icon: Users, text: 'Ratio d\'encadrement renforcé : 1 moniteur pour 5 à 8 enfants selon l\'âge' },
  { icon: Award, text: 'Tous nos moniteurs sont BPJEPS ou Diplôme d\'État + BNSSA ou PSC1' },
  { icon: AlertCircle, text: 'Trousse de secours sur chaque parcours + responsable sécurité présent à tout moment' },
  { icon: Heart, text: 'Protocole allergie et handicap : informez-nous à la réservation, on s\'adapte' },
  { icon: BookOpen, text: 'Livret de sécurité remis aux enseignants et animateurs avant la sortie' },
];

// ─── Composants avec props ────────────────────────────────────────────────────

function KidsHero({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <section className="relative min-h-[85vh] overflow-hidden flex items-end">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1800&h=900&fit=crop"
          alt="Enfants en aventure"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${GREEN}55 0%, transparent 70%)` }} />

      <div className="relative z-10 container mx-auto px-6 pb-24 w-full">
        <div className="flex items-center gap-2 text-white/50 text-sm mb-8">
          <Link to="/" className="hover:text-white/70">Accueil</Link>
          <ChevronRight className="size-3.5" />
          <Link to="/groups" className="hover:text-white/70">Groupes</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-white/80">Enfants & Ados</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 text-white/80" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <GraduationCap className="size-4" /> Enfants · Ados · Écoles · Anniversaires
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tight mb-6">
            {title || (<>L'aventure<br />dès<br /><span style={{ color: '#fbbf24' }}>5 ans.</span></>)}
          </h1>

          <p className="text-white/70 text-xl max-w-xl leading-relaxed mb-10">
            {subtitle || "Des activités pensées pour les enfants et les ados, avec un encadrement renforcé, un matériel adapté et une sécurité absolue."}
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/devis" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #d66310)`, boxShadow: `0 12px 40px ${ORANGE}50` }}>
                <Calendar className="size-5" /> Réserver <ArrowRight className="size-5" />
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
          <path d="M0,40 C360,10 720,60 1080,30 C1260,15 1380,55 1440,40 L1440,60 L0,60 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

function AgeGroupsSection({ ageGroups }: { ageGroups: typeof AGE_GROUPS }) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: DARK }}>
            Une activité pour<br /><span style={{ color: GREEN }}>chaque âge</span>
          </h2>
          <p className="text-gray-500 text-lg">Des parcours calibrés selon le développement physique et cognitif</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {ageGroups.map((group, i) => (
            <motion.div
              key={group.range}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="rounded-3xl overflow-hidden shadow-lg border-2 bg-white"
              style={{ borderColor: `${group.color}40` }}
            >
              <div className="p-6" style={{ background: `linear-gradient(135deg, ${group.color} 0%, ${group.color}cc 100%)` }}>
                <div className="text-5xl mb-3">{group.emoji}</div>
                <div className="text-white font-black text-2xl">{group.range}</div>
                <div className="text-white/80 text-sm font-medium">{group.label}</div>
              </div>
              <div className="p-6">
                <div className="space-y-2 mb-5">
                  {group.activities.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <CheckCircle className="size-4 flex-shrink-0" style={{ color: group.color }} />
                      {a}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Encadrement</div>
                    <div className="text-xs font-bold text-gray-700">{group.ratio}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Durée</div>
                    <div className="text-xs font-bold text-gray-700">{group.duration}</div>
                  </div>
                </div>
              </div>
              <div className="h-1" style={{ backgroundColor: group.color }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingTypesSection({ bookingTypes }: { bookingTypes: typeof BOOKING_TYPES }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-bold border" style={{ backgroundColor: `${ORANGE}10`, borderColor: `${ORANGE}30`, color: ORANGE }}>
            <Smile className="size-4" /> Nos formules
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: DARK }}>
            Pour quelle<br /><span style={{ color: ORANGE }}>occasion ?</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {bookingTypes.map((bt, i) => (
            <motion.div
              key={bt.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
              whileHover={{ y: -6 }}
              className="relative bg-white rounded-3xl overflow-hidden shadow-lg"
              style={{ border: bt.popular ? `2px solid ${ORANGE}` : '2px solid #f3f4f6' }}
            >
              {bt.popular && (
                <div className="absolute top-0 left-0 right-0 py-2 text-center text-xs font-black text-white" style={{ backgroundColor: ORANGE }}>
                  🎂 Le plus réservé
                </div>
              )}
              <div className={`p-7 ${bt.popular ? 'pt-12' : ''}`}>
                <div className="flex items-start gap-5 mb-5">
                  <div className="text-4xl flex-shrink-0">{bt.emoji}</div>
                  <div>
                    <h3 className="text-2xl font-black mb-1" style={{ color: DARK }}>{bt.title}</h3>
                    <p className="text-sm font-medium" style={{ color: bt.color }}>{bt.subtitle}</p>
                  </div>
                  <div className="ml-auto text-right flex-shrink-0">
                    <div className="font-black text-lg" style={{ color: bt.color }}>{bt.price}</div>
                    <div className="text-xs text-gray-400">{bt.minPeople}–{bt.maxPeople} pers.</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-5">{bt.desc}</p>

                <div className="grid grid-cols-2 gap-2">
                  {bt.perks.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="size-3.5 flex-shrink-0" style={{ color: bt.color }} />
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-7 pb-6">
                <Link
                  to="/devis"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm transition-all"
                  style={bt.popular
                    ? { background: `linear-gradient(to right, ${ORANGE}, #d66310)`, color: 'white' }
                    : { backgroundColor: `${bt.color}10`, color: bt.color }
                  }
                >
                  Réserver cette formule <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="h-1" style={{ backgroundColor: bt.color }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SafetySection({ safetyPoints }: { safetyPoints: typeof SAFETY_POINTS }) {
  return (
    <section className="py-20" style={{ backgroundColor: DARK }}>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-bold border border-white/20 text-white/80">
            <Shield className="size-4 text-green-400" /> La sécurité en priorité
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            La sécurité de vos<br />
            <span style={{ color: '#4ade80' }}>enfants, notre obsession</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {safetyPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${GREEN}30` }}>
                <point.icon className="size-5" style={{ color: '#4ade80' }} />
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{point.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsKids({ testimonials }: { testimonials: typeof TESTIMONIALS_KIDS }) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4" style={{ color: DARK }}>
            Ils ont vécu<br /><span style={{ color: GREEN }}>l'aventure</span>
          </h2>
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
              className="bg-gray-50 rounded-3xl p-7 border-2 border-gray-100"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => <Star key={s} className="size-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-700 italic text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">{t.avatar}</div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{t.author}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAKids() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-5xl mb-5">🎒</div>
          <h2 className="text-4xl font-black mb-4" style={{ color: DARK }}>
            Offrez-leur l'aventure<br />
            <span style={{ color: GREEN }}>ils s'en souviendront</span>
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Devis gratuit · Réponse en 24h · Programme adapté à votre groupe
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/devis" className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-white shadow-xl"
              style={{ background: `linear-gradient(135deg, ${ORANGE}, #d66310)` }}>
              <Calendar className="size-5" /> Réserver maintenant
            </Link>
            <a href="tel:0123456789" className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold border-2 text-gray-700 hover:shadow-md transition-all"
              style={{ borderColor: `${GREEN}40` }}>
              <Phone className="size-5" style={{ color: GREEN }} /> Appeler notre équipe
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function GroupeEnfantsPage() {
  const { data: kidsData } = useGroupsKids();

  const ageGroups = kidsData.ageGroups?.length > 0
    ? kidsData.ageGroups.map((g: any, i: number) => ({
        range: g.ageRange || g.range || AGE_GROUPS[i]?.range || '',
        emoji: g.emoji || AGE_GROUPS[i]?.emoji || '🧒',
        label: g.label || AGE_GROUPS[i]?.label || '',
        color: g.color || AGE_GROUPS[i]?.color || GREEN,
        activities: g.activities || AGE_GROUPS[i]?.activities || [],
        ratio: g.ratio || AGE_GROUPS[i]?.ratio || '',
        duration: g.duration || AGE_GROUPS[i]?.duration || '',
      }))
    : AGE_GROUPS;

  const bookingTypes = kidsData.bookingTypes?.length > 0
    ? kidsData.bookingTypes.map((bt: any, i: number) => ({
        ...BOOKING_TYPES[i % BOOKING_TYPES.length],
        id: bt.id || BOOKING_TYPES[i]?.id || `bt-${i}`,
        title: bt.title || BOOKING_TYPES[i]?.title || '',
        subtitle: bt.subtitle || BOOKING_TYPES[i]?.subtitle || '',
        desc: bt.desc || bt.description || BOOKING_TYPES[i]?.desc || '',
        price: bt.price || BOOKING_TYPES[i]?.price || '',
        minPeople: bt.minPeople || BOOKING_TYPES[i]?.minPeople || 1,
        maxPeople: bt.maxPeople || BOOKING_TYPES[i]?.maxPeople || 50,
        perks: bt.perks || BOOKING_TYPES[i]?.perks || [],
        popular: bt.popular || BOOKING_TYPES[i]?.popular || false,
        color: bt.color || BOOKING_TYPES[i]?.color || GREEN,
      }))
    : BOOKING_TYPES;

  const testimonials = kidsData.testimonials?.length > 0
    ? kidsData.testimonials.map((t: any) => ({
        text: t.text || t.quote || '',
        author: t.author || t.name || '',
        role: t.role || '',
        rating: t.rating || 5,
        avatar: t.avatar || '👤',
      }))
    : TESTIMONIALS_KIDS;

  return (
    <div className="min-h-screen bg-white">
      <KidsHero title={kidsData.hero?.title} subtitle={kidsData.hero?.subtitle} />
      <AgeGroupsSection ageGroups={ageGroups} />
      <BookingTypesSection bookingTypes={bookingTypes} />
      <SafetySection safetyPoints={SAFETY_POINTS} />
      <TestimonialsKids testimonials={testimonials} />
      <CTAKids />
    </div>
  );
}

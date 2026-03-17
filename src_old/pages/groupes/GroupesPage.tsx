// pages/GroupesPage.tsx — Hub principal "Groupes & Événements"
// Direction : Editorial bold · dark luxury · outdoor premium
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Building2, GraduationCap, PartyPopper, Users, Phone,
  ArrowRight, Calendar, CheckCircle, Star, Shield,
  Zap, Gift, ChevronRight, MessageSquare, TrendingUp,
  Clock, Sparkles, Award
} from 'lucide-react';
import { useRef, useState } from 'react';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#0d0d0d';

// ─── Données des catégories ────────────────────────────────────────────────────
const GROUP_CATEGORIES = [
  {
    id: 'corporate',
    slug: '/groups/corporate',
    emoji: '🏢',
    icon: Building2,
    label: 'Entreprises',
    tagline: 'Team building & séminaires',
    description: 'Renforcez la cohésion de vos équipes avec des défis outdoor sur mesure. De 10 à 500 collaborateurs, nous créons l\'expérience qui transforme vos collègues en équipe.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=600&fit=crop',
    color: '#1a1a2e',
    accent: ORANGE,
    badge: 'Le plus demandé',
    features: ['Devis en 24h', 'Coordinateur dédié', 'Repas inclus possible', 'Compte-rendu RH'],
    minGroup: 10,
    maxGroup: 500,
  },
  {
    id: 'kids',
    slug: '/groups/kids',
    emoji: '🎒',
    icon: GraduationCap,
    label: 'Enfants & Ados',
    tagline: 'Écoles, colonies & anniversaires',
    description: 'Des activités pensées pour les 5-17 ans avec encadrement pédagogique renforcé. Sorties scolaires, séjours de cohésion, anniversaires inoubliables.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&h=600&fit=crop',
    color: '#1a3a1a',
    accent: GREEN,
    badge: 'Idéal familles',
    features: ['Dès 5 ans', 'Encadrement 1/6', 'Matériel adapté taille', 'Goûter inclus'],
    minGroup: 6,
    maxGroup: 120,
  },
  {
    id: 'adults',
    slug: '/groups/adults',
    emoji: '🎉',
    icon: PartyPopper,
    label: 'Adultes & Fêtes',
    tagline: 'EVG, EVJF, anniversaires & soirées',
    description: 'Les moments qui précèdent les grands événements méritent d\'être à la hauteur. EVG, EVJF, anniversaires ronds : on crée la journée dont vous parlerez 10 ans.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&h=600&fit=crop',
    color: '#3a1a00',
    accent: '#f59e0b',
    badge: 'Ambiance garantie',
    features: ['Animations incluses', 'Défis personnalisés', 'Photos souvenir', 'Programme libre'],
    minGroup: 4,
    maxGroup: 60,
  },
  {
    id: 'family',
    slug: '/groups/family',
    emoji: '👨‍👩‍👧‍👦',
    icon: Users,
    label: 'Grandes familles',
    tagline: 'Réunions de famille & multi-générations',
    description: 'Des grands-parents aux petits-enfants, tout le monde trouve son activité. Réunions de famille, retrouvailles, fêtes de fin d\'année : l\'aventure se vit ensemble.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=900&h=600&fit=crop',
    color: '#1a2a3a',
    accent: '#3b82f6',
    badge: 'Tous âges',
    features: ['Dès 3 ans', 'Parcours adaptés', 'Zone picnic', 'Tarifs famille'],
    minGroup: 8,
    maxGroup: 80,
  },
];

const STATS = [
  { val: '12 000+', label: 'groupes accueillis', icon: '👥' },
  { val: '98%', label: 'satisfaction globale', icon: '⭐' },
  { val: '24h', label: 'délai de réponse devis', icon: '⚡' },
  { val: '5 parcs', label: 'destinations disponibles', icon: '📍' },
];

const TESTIMONIALS = [
  {
    text: "Notre séminaire annuel au parc a transformé notre équipe. L'organisation était impeccable, les moniteurs au top. On repart l'année prochaine.",
    author: 'Sarah K.',
    role: 'DRH, groupe de 45 personnes',
    rating: 5,
    avatar: '👩‍💼',
    category: 'Entreprise',
    categoryColor: ORANGE,
  },
  {
    text: "L'anniversaire de mes 40 ans avec 20 amis. Du début à la fin, c'était parfait. Le staff a même préparé une surprise qu'on n'avait pas demandée.",
    author: 'Thomas B.',
    role: 'Anniversaire · 20 personnes',
    rating: 5,
    avatar: '🎉',
    category: 'Adultes',
    categoryColor: '#f59e0b',
  },
  {
    text: "Sortie scolaire avec 60 CM2. Les enfants ont adoré, les moniteurs étaient patients et pédagogues. Les parents nous ont réclamé la même sortie l'an prochain !",
    author: 'Mme Leclerc',
    role: 'Institutrice · 60 élèves',
    rating: 5,
    avatar: '👩‍🏫',
    category: 'Enfants',
    categoryColor: GREEN,
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    icon: MessageSquare,
    title: 'Vous nous contactez',
    desc: 'Formulaire en ligne, téléphone ou email. On vous répond sous 24h avec une première proposition.',
    color: GREEN,
  },
  {
    step: '02',
    icon: Calendar,
    title: 'On construit votre programme',
    desc: 'Un coordinateur dédié crée un programme sur mesure selon vos objectifs, budget et groupe.',
    color: ORANGE,
  },
  {
    step: '03',
    icon: CheckCircle,
    title: 'Vous validez, on prépare',
    desc: 'Acompte, confirmation, logistique — on gère tout pour que vous arriviez les mains dans les poches.',
    color: GREEN,
  },
  {
    step: '04',
    icon: Zap,
    title: 'Le jour J, c\'est magique',
    desc: 'Accueil VIP, équipe dédiée, programme millimétré. Votre seul boulot : profiter.',
    color: ORANGE,
  },
];

// ─── Sous-composants ──────────────────────────────────────────────────────────

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-[90vh] min-h-[600px] overflow-hidden flex items-end">
      {/* Background */}
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1800&h=900&fit=crop"
          alt="Groupes en aventure"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${GREEN}30 0%, transparent 60%)` }} />

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.035]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }} />

      <motion.div style={{ opacity }} className="relative z-10 container mx-auto px-6 pb-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-8 border border-white/20 backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/90 text-sm font-bold tracking-wide">Groupes & Événements · Jusqu'à 500 personnes</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tight mb-6">
            L'aventure<br />
            <span style={{ color: ORANGE }}>se vit</span><br />
            ensemble.
          </h1>

          <p className="text-white/70 text-xl max-w-2xl leading-relaxed mb-10">
            Team building, anniversaires, sorties scolaires, réunions de famille — nous créons des expériences sur mesure pour chaque groupe, chaque occasion.
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/devis"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white shadow-2xl text-base"
                style={{ background: `linear-gradient(135deg, ${ORANGE} 0%, #d66310 100%)`, boxShadow: `0 12px 40px ${ORANGE}50` }}
              >
                <Calendar className="size-5" />
                Demander un devis gratuit
                <ArrowRight className="size-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <a
                href="tel:0123456789"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white border border-white/30 backdrop-blur-sm text-base"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <Phone className="size-5" />
                01 23 45 67 89
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 80" className="w-full h-16" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,50 C1260,70 1380,20 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ val, label, icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <div className="text-4xl font-black mb-1" style={{ color: DARK }}>{val}</div>
              <div className="text-gray-500 text-sm font-medium">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-bold border" style={{ backgroundColor: `${GREEN}10`, borderColor: `${GREEN}30`, color: GREEN }}>
            <Sparkles className="size-4" /> Nos formules groupes
          </div>
          <h2 className="text-5xl font-black mb-4" style={{ color: DARK }}>
            Trouvez votre<br />
            <span style={{ color: GREEN }}>expérience</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            4 univers pensés pour 4 occasions différentes. Chacun avec un programme adapté, des activités calibrées et une équipe dédiée.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {GROUP_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer"
            >
              <Link to={cat.slug} className="block">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Dark overlay with brand color tint */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${cat.color}EE 0%, ${cat.color}99 50%, transparent 100%)` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badge */}
                  {cat.badge && (
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }}
                      whileInView={{ scale: 1, rotate: -3 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                      className="absolute top-5 right-5 px-4 py-2 rounded-2xl text-xs font-black text-white shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}bb)` }}
                    >
                      {cat.badge}
                    </motion.div>
                  )}

                  {/* Emoji large */}
                  <div className="absolute top-5 left-5 text-5xl">{cat.emoji}</div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="text-3xl font-black text-white mb-1 leading-tight">{cat.label}</h3>
                        <p className="text-white/70 text-sm font-medium">{cat.tagline}</p>
                      </div>
                      <motion.div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: cat.accent }}
                      >
                        <ArrowRight className="size-6 text-white" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-white p-6">
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{cat.description}</p>

                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="size-4" />
                      <span className="font-bold">{cat.minGroup} – {cat.maxGroup} personnes</span>
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-full text-xs font-black text-white"
                      style={{ backgroundColor: cat.accent }}
                    >
                      Devis gratuit
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {cat.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                        <CheckCircle className="size-3.5 flex-shrink-0" style={{ color: cat.accent }} />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="h-1" style={{ background: `linear-gradient(to right, ${cat.accent}, ${cat.accent}60)` }} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CSE card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6"
        >
          <Link
            to="/groups/cse"
            className="group flex flex-col sm:flex-row items-center gap-6 p-7 rounded-3xl border-2 bg-white hover:shadow-xl transition-all"
            style={{ borderColor: `${GREEN}30` }}
          >
            <div className="text-5xl flex-shrink-0">🏦</div>
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black text-white mb-2" style={{ backgroundColor: GREEN }}>
                Avantage CSE
              </div>
              <h3 className="text-2xl font-black mb-1" style={{ color: DARK }}>CSE & Comités d'entreprise</h3>
              <p className="text-gray-500 text-sm">Tarifs préférentiels, prise en charge simplifiée et facturation adaptée pour les représentants du personnel.</p>
            </div>
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 font-black text-sm px-6 py-3 rounded-2xl text-white flex-shrink-0"
              style={{ backgroundColor: GREEN }}
            >
              En savoir plus <ArrowRight className="size-4" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-bold border" style={{ backgroundColor: `${ORANGE}10`, borderColor: `${ORANGE}30`, color: ORANGE }}>
            <TrendingUp className="size-4" /> Comment ça marche
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: DARK }}>
            De la demande au<br />
            <span style={{ color: ORANGE }}>jour J</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative"
            >
              {/* Connector */}
              {i < PROCESS_STEPS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-10 left-full w-full h-0.5 z-0"
                  style={{ background: `linear-gradient(to right, ${step.color}40, ${PROCESS_STEPS[i + 1].color}40)` }}
                />
              )}

              <motion.div
                whileHover={{ y: -6 }}
                className="relative z-10 bg-white rounded-3xl p-7 shadow-lg border-2 h-full"
                style={{ borderColor: `${step.color}25` }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-white font-black text-xl shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}bb)` }}
                >
                  {step.step}
                </div>
                <h3 className="font-black text-lg mb-3" style={{ color: DARK }}>{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-20" style={{ backgroundColor: DARK }}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-bold border border-white/20 text-white/80">
            <Award className="size-4" style={{ color: ORANGE }} /> Ils nous font confiance
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ce que disent<br />
            <span style={{ color: ORANGE }}>nos groupes</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl p-8 bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-6 italic text-base">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">{t.avatar}</div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.author}</div>
                    <div className="text-white/50 text-xs">{t.role}</div>
                  </div>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-black text-white"
                  style={{ backgroundColor: t.categoryColor }}
                >
                  {t.category}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuaranteesSection() {
  const guarantees = [
    { icon: Shield, title: 'Devis en 24h', desc: 'Réponse garantie en 24 heures ouvrées, programme détaillé inclus.', color: GREEN },
    { icon: CheckCircle, title: 'Annulation souple', desc: 'Remboursement intégral jusqu\'à 72h avant. Report sans frais jusqu\'à 30 jours.', color: ORANGE },
    { icon: Award, title: 'Coordinateur dédié', desc: 'Un interlocuteur unique de la demande au debriefing post-événement.', color: GREEN },
    { icon: Zap, title: 'Matériel inclus', desc: 'Tout l\'équipement de sécurité certifié est fourni et vérifié quotidiennement.', color: ORANGE },
    { icon: Users, title: 'Encadrement renforcé', desc: 'Ratio moniteur/participants adapté à chaque type de groupe et activité.', color: GREEN },
    { icon: Gift, title: 'Options sur mesure', desc: 'Restauration, photographe, activités bonus, cadeaux souvenir — tout est possible.', color: ORANGE },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: DARK }}>
            Nos <span style={{ color: GREEN }}>engagements</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Pour les groupes, la confiance se gagne sur des promesses tenues.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {guarantees.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-7 shadow-md border-2 border-transparent hover:shadow-xl transition-all"
              style={{ ['--hover-border' as any]: `${g.color}30` }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${g.color}30`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: `${g.color}12` }}>
                <g.icon className="size-7" style={{ color: g.color }} />
              </div>
              <h3 className="font-black text-lg mb-2" style={{ color: DARK }}>{g.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{g.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #1a3d00 50%, ${GREEN} 100%)` }}>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`, backgroundSize: '28px 28px' }} />
      <motion.div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: ORANGE }}
        animate={{ scale: [1, 1.3, 1], x: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: '#fff' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Construisons votre<br />journée ensemble
          </h2>
          <p className="text-white/75 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Un appel, un email ou un formulaire — notre équipe vous répond en 24h avec une proposition personnalisée et gratuite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/devis"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-white shadow-2xl text-lg"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #c2520a)`, boxShadow: `0 16px 50px ${ORANGE}60` }}
              >
                <Calendar className="size-6" />
                Demander un devis gratuit
                <ArrowRight className="size-6" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <a
                href="tel:0123456789"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-white border-2 border-white/30 backdrop-blur-sm text-lg hover:bg-white/10 transition-colors"
              >
                <Phone className="size-6" />
                01 23 45 67 89
              </a>
            </motion.div>
          </div>
          <p className="text-white/40 text-sm mt-8">Devis gratuit · Réponse en 24h · Aucun engagement</p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export function GroupesPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <StatsBar />
      <CategoryGrid />
      <ProcessSection />
      <TestimonialsSection />
      <GuaranteesSection />
      <CTASection />
    </div>
  );
}

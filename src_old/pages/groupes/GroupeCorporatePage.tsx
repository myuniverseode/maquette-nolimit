// pages/groups/GroupeCorporatePage.tsx — Entreprises & Team Building
// Direction : Corporate premium · dark power · ROI driven
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Building2, Users, Calendar, Phone, ArrowRight, CheckCircle,
  TrendingUp, Shield, Clock, Award, Briefcase, Target,
  BarChart3, Handshake, Zap, ChevronRight, MessageSquare, Star, Mail,
  Filter, BookOpen, Sun, CloudRain, Dumbbell, CalendarCheck, PawPrint,
  Utensils, MapPin, Lightbulb, Eye, Tag, Heart
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#0d0d0d';
const CORP_ACCENT = '#1e3a5f'; // navy pro

// Types pour le blog
interface Article {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: number;
  date: string;
  views: number;
  image: string;
  featured: boolean;
  tags: string[];
  author: { name: string; role: string; avatar: string };
  difficulty?: 'facile' | 'moyen' | 'avancé';
}

// Types de programmes (nouveau bloc)
const PROGRAM_TYPES = [
  {
    id: 'cohesion',
    icon: '🤝',
    title: 'Team Building Cohésion',
    shortDesc: 'Renforcer les liens',
    color: GREEN,
  },
  {
    id: 'challenge',
    icon: '⚡',
    title: 'Challenge Performance',
    shortDesc: 'Dépassement collectif',
    color: ORANGE,
  },
  {
    id: 'seminaire',
    icon: '🎯',
    title: 'Séminaire Résidentiel',
    shortDesc: 'Travailler autrement',
    color: CORP_ACCENT,
  },
  {
    id: 'incentive',
    icon: '🏆',
    title: 'Séjour Incentive',
    shortDesc: 'Récompenser & motiver',
    color: '#9b59b6',
  },
  {
    id: 'fusion',
    icon: '🔄',
    title: 'Post-Fusion / Réorg',
    shortDesc: 'Intégrer & aligner',
    color: '#e67e22',
  },
  {
    id: 'comite',
    icon: '👥',
    title: 'CSE & Comité',
    shortDesc: 'Sorties collaborateurs',
    color: '#3498db',
  },
];

const PROGRAMS = [
  {
    id: 'cohesion',
    icon: '🤝',
    title: 'Team Building Cohésion',
    duration: 'Demi-journée ou journée',
    minPeople: 10,
    maxPeople: 80,
    price: 'Dès 45€/pers.',
    description: 'Défis collaboratifs, icebreakers et activités outdoor pour renforcer les liens entre collègues. Idéal après une fusion, une réorg ou en début d\'année.',
    includes: ['Activités collaboratives sélectionnées', 'Animateur·trice dédié·e', 'Débriefing facilité', 'Compte-rendu équipe', 'Repas possible en option'],
    outcomes: ['Amélioration de la communication', 'Création de liens inter-équipes', 'Boost de moral et motivation'],
    popular: false,
    color: GREEN,
  },
  {
    id: 'challenge',
    icon: '⚡',
    title: 'Challenge Performance',
    duration: 'Journée complète',
    minPeople: 20,
    maxPeople: 200,
    price: 'Dès 65€/pers.',
    description: 'Compétition bienveillante entre équipes, classements en temps réel, cérémonie de remise des prix. Le programme qui crée les meilleures histoires.',
    includes: ['Olympiades outdoor sur mesure', '2 coordinateurs', 'Tableau des scores live', 'Trophées & récompenses', 'Cocktail de fin inclus'],
    outcomes: ['Émulation positive', 'Révélateur de leaders', 'Mémoire collective forte'],
    popular: true,
    color: ORANGE,
  },
  {
    id: 'seminaire',
    icon: '🎯',
    title: 'Séminaire Résidentiel',
    duration: '1 à 3 jours',
    minPeople: 15,
    maxPeople: 150,
    price: 'Sur devis',
    description: 'Programme complet alternant sessions de travail, activités de cohésion et moments conviviaux. Un séminaire qui a du sens et laisse des traces.',
    includes: ['Programme sur mesure', 'Hébergement partenaire', 'Restauration complète', 'Salle de réunion équipée', 'Support logistique total'],
    outcomes: ['Décisions prises ensemble', 'Vision partagée', 'Équipe alignée et motivée'],
    popular: false,
    color: CORP_ACCENT,
  },
];

const SECTORS = [
  { icon: '🏦', label: 'Finance & Banque' },
  { icon: '💊', label: 'Santé & Pharma' },
  { icon: '💻', label: 'Tech & SaaS' },
  { icon: '🏗️', label: 'BTP & Industrie' },
  { icon: '🛒', label: 'Retail & Distribution' },
  { icon: '⚖️', label: 'Conseil & Juridique' },
  { icon: '🏛️', label: 'Secteur public' },
  { icon: '🎓', label: 'Éducation & Formation' },
];

const TESTIMONIALS_CORP = [
  {
    text: "Le meilleur team building qu'on ait organisé en 8 ans. Le retour des collaborateurs était unanime : ils en parlent encore 6 mois plus tard.",
    author: 'Arnaud M.',
    company: 'Groupe industriel · 120 pers.',
    rating: 5,
    avatar: '👨‍💼',
    metric: '+34% engagement',
  },
  {
    text: "Organisation irréprochable, coordinatrice au top, programme qui correspondait exactement à nos enjeux de fusion d'équipes. Merci !",
    author: 'Claire D.',
    company: 'Cabinet de conseil · 45 pers.',
    rating: 5,
    avatar: '👩‍💼',
    metric: 'NPS interne +28pts',
  },
  {
    text: "On a fait une demande de devis un vendredi soir, on avait une proposition complète le lundi matin. Réactivité et professionnalisme au rendez-vous.",
    author: 'Stéphane L.',
    company: 'Scale-up tech · 60 pers.',
    rating: 5,
    avatar: '🧑‍💻',
    metric: 'Devis en 18h',
  },
];

const FAQ_CORP = [
  { q: 'Puis-je intégrer des ateliers de travail dans la journée ?', a: 'Absolument. On alterne sessions outdoor et salle de réunion selon votre programme. Nous avons des salles équipées (vidéoprojecteur, paper board, WiFi) disponibles.' },
  { q: 'Comment gérer un groupe avec des niveaux physiques très différents ?', a: 'Nos programmes sont conçus pour inclure tout le monde. Chaque activité a une variante accessible. Personne n\'est laissé de côté — c\'est notre philosophie.' },
  { q: 'Peut-on avoir une facturation multi-postes pour le CSE et l\'entreprise ?', a: 'Oui. Nous proposons des facturations partagées, des conventions avec comités d\'entreprise et des prises en charge adaptées aux règles comptables de votre structure.' },
  { q: 'Y a-t-il un nombre minimum de participants ?', a: 'À partir de 10 personnes pour nos formules groupe. En dessous, nos tarifs individuels avec réservation de créneau privé s\'appliquent.' },
];

// Données blog (articles entreprise)
const BLOG_ARTICLES: Article[] = [
  {
    id: 'b1',
    slug: 'team-building-8-conseils',
    category: 'entreprise',
    title: 'Team building : 8 conseils pour un événement réussi',
    excerpt: "Objectifs clairs, activités adaptées, suivi post-événement... Notre guide complet pour organiser un team building qui crée de la valeur.",
    readTime: 7,
    date: '15 mars 2025',
    views: 3420,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
    featured: true,
    tags: ['team-building', 'organisation', 'conseils'],
    author: { name: 'Paul V.', role: 'Coordinateur événements', avatar: '💼' },
  },
  {
    id: 'b2',
    slug: 'journee-groupe-entreprise',
    category: 'entreprise',
    title: 'Team building réussi : comment structurer votre journée d\'entreprise',
    excerpt: "Icebreakers matinaux, défis collaboratifs, repas collectif et bilan d'équipe : le plan de journée type pour un team building qui crée de vraies connexions entre collègues.",
    readTime: 9,
    date: '10 mars 2025',
    views: 3240,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
    featured: false,
    tags: ['entreprise', 'team-building', 'programme'],
    author: { name: 'Paul V.', role: 'Coordinateur événements', avatar: '💼' },
  },
  {
    id: 'b3',
    slug: 'activites-sans-voiture',
    category: 'entreprise',
    title: 'Activités sans voiture : accessibilité en transport',
    excerpt: "Comment venir au parc en transports en commun, navettes et solutions pour les groupes sans véhicule.",
    readTime: 4,
    date: '5 mars 2025',
    views: 1890,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=500&fit=crop',
    featured: false,
    tags: ['transport', 'logistique', 'accès'],
    author: { name: 'Julie M.', role: 'Responsable accueil', avatar: '😊' },
  },
  {
    id: 'b4',
    slug: 'forfait-groupe-tarifs',
    category: 'entreprise',
    title: 'Forfaits groupe : tarifs dégressifs et options',
    excerpt: "Tous nos tarifs groupes, conditions de réservation, gratuités et options de personnalisation.",
    readTime: 5,
    date: '28 fév. 2025',
    views: 2560,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop',
    featured: false,
    tags: ['tarifs', 'groupes', 'budget'],
    author: { name: 'Alex K.', role: 'Coach sportif', avatar: '💪' },
  },
  {
    id: 'b5',
    slug: 'activites-pluie',
    category: 'entreprise',
    title: "Il pleut : que faire au parc quand la météo ne coopère pas ?",
    excerpt: "Orage, bruine ou averse imprévue — tout n'est pas annulé pour autant. Voici nos activités couvertes, nos procédures de report et comment sauver votre journée malgré les nuages.",
    readTime: 5,
    date: '22 mars 2025',
    views: 8340,
    image: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&h=500&fit=crop',
    featured: true,
    tags: ['météo', 'pluie', 'alternatives'],
    author: { name: 'Julie M.', role: 'Responsable accueil', avatar: '😊' },
  },
];

// ─── Composants ───────────────────────────────────────────────────────────────

function CorporateHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  return (
    <section ref={ref} className="relative min-h-[85vh] overflow-hidden flex items-end">
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1800&h=900&fit=crop"
          alt="Team building entreprise"
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${CORP_ACCENT}BB 0%, transparent 60%)` }} />

      <div className="relative z-10 container mx-auto px-6 pb-24 w-full">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-white/50 text-sm mb-8">
          <Link to="/" className="hover:text-white/70">Accueil</Link>
          <ChevronRight className="size-3.5" />
          <Link to="/groups" className="hover:text-white/70">Groupes</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-white/80">Entreprises</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 text-white/80" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <Building2 className="size-4" />
            Team building & événements d'entreprise
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tight mb-6">
            L'équipe<br />
            qui gagne<br />
            <span style={{ color: ORANGE }}>ensemble.</span>
          </h1>

          <p className="text-white/70 text-xl max-w-xl leading-relaxed mb-10">
            Des expériences outdoor qui renforcent réellement les équipes. Pas des animations gadget — des défis qui créent du lien, de la confiance et de la performance collective.
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/devis" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #d66310)`, boxShadow: `0 12px 40px ${ORANGE}50` }}>
                <Calendar className="size-5" /> Demander un devis <ArrowRight className="size-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }}>
              <a href="tel:0123456789" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white border border-white/30 backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <Phone className="size-5" /> 01 23 45 67 89
              </a>
            </motion.div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 mt-14">
            {[
              { val: '850+', label: 'entreprises clientes' },
              { val: '24h', label: 'délai de réponse' },
              { val: 'Dès 10', label: 'participants' },
            ].map(({ val, label }) => (
              <div key={label}>
                <div className="text-3xl font-black text-white">{val}</div>
                <div className="text-white/50 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none">
          <path d="M0,30 C360,60 720,0 1080,40 C1260,55 1380,15 1440,30 L1440,60 L0,60 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

// NOUVEAU : Bloc "type" - Catégories de programmes
function ProgramTypesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-bold" style={{ backgroundColor: `${GREEN}10`, color: GREEN }}>
            <Filter className="size-4" /> Trouvez votre formule
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: DARK }}>
            Quel est votre <span style={{ color: ORANGE }}>objectif</span> ?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Sélectionnez le type d'événement qui correspond à vos besoins — chaque programme est personnalisable
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
          {PROGRAM_TYPES.map((type, i) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
            >
              <div 
                className="flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all group-hover:shadow-lg"
                style={{ 
                  borderColor: `${type.color}30`,
                  backgroundColor: `${type.color}08`,
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-2 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${type.color}20` }}
                >
                  {type.icon}
                </div>
                <h3 className="font-black text-sm mb-0.5" style={{ color: DARK }}>{type.title}</h3>
                <p className="text-xs text-gray-500">{type.shortDesc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lien vers toutes les formules */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link 
            to="/corporate/programmes" 
            className="inline-flex items-center gap-2 text-sm font-bold transition-colors"
            style={{ color: GREEN }}
          >
            Voir tous nos programmes <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ProgramsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-bold border" style={{ backgroundColor: `${ORANGE}10`, borderColor: `${ORANGE}30`, color: ORANGE }}>
            <Target className="size-4" /> Nos formules entreprise
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: DARK }}>
            Choisissez votre<br /><span style={{ color: GREEN }}>programme</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Trois formules pour trois occasions différentes. Chacune est personnalisable à 100%.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {PROGRAMS.map((prog, i) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              className="relative"
            >
              {prog.popular && (
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-5 py-1.5 rounded-full text-xs font-black text-white shadow-lg"
                  style={{ background: `linear-gradient(to right, ${ORANGE}, #d66310)` }}
                >
                  ⭐ Le plus choisi
                </motion.div>
              )}

              <div
                className="bg-white rounded-3xl overflow-hidden shadow-xl h-full flex flex-col"
                style={{ border: prog.popular ? `2px solid ${ORANGE}` : '2px solid #f3f4f6' }}
              >
                <div className="p-7 flex-1">
                  <div className="text-4xl mb-4">{prog.icon}</div>
                  <h3 className="text-2xl font-black mb-2" style={{ color: DARK }}>{prog.title}</h3>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><Clock className="size-4" />{prog.duration}</span>
                    <span className="flex items-center gap-1.5"><Users className="size-4" />{prog.minPeople}–{prog.maxPeople} pers.</span>
                  </div>

                  <div className="text-2xl font-black mb-5" style={{ color: prog.color }}>{prog.price}</div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{prog.description}</p>

                  <div className="mb-5">
                    <div className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Inclus</div>
                    <div className="space-y-2">
                      {prog.includes.map((item) => (
                        <div key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                          <CheckCircle className="size-4 flex-shrink-0" style={{ color: prog.color }} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl" style={{ backgroundColor: `${prog.color}08`, border: `1px solid ${prog.color}20` }}>
                    <div className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: prog.color }}>Résultats attendus</div>
                    {prog.outcomes.map((o) => (
                      <div key={o} className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <TrendingUp className="size-3 flex-shrink-0" style={{ color: prog.color }} />
                        {o}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 border-t border-gray-100">
                  <Link
                    to="/devis"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-base transition-all hover:shadow-lg"
                    style={prog.popular
                      ? { background: `linear-gradient(to right, ${ORANGE}, #d66310)`, color: 'white' }
                      : { backgroundColor: `${prog.color}10`, color: prog.color }
                    }
                  >
                    Demander ce programme <ArrowRight className="size-5" />
                  </Link>
                </div>

                <div className="h-1" style={{ backgroundColor: prog.color }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectorsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h3 className="text-2xl font-black mb-2" style={{ color: DARK }}>Ils nous font confiance</h3>
          <p className="text-gray-500">Dans tous les secteurs, pour toutes les tailles d'entreprise</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {SECTORS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.06, y: -2 }}
              className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 font-bold text-sm text-gray-700 cursor-default"
            >
              <span className="text-xl">{s.icon}</span>
              {s.label}
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
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Résultats <span style={{ color: ORANGE }}>mesurables</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS_CORP.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl p-7 bg-white/5 border border-white/10"
            >
              <div className="inline-flex px-4 py-1.5 rounded-full text-sm font-black text-white mb-5" style={{ backgroundColor: ORANGE }}>
                {t.metric}
              </div>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => <Star key={s} className="size-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-white/80 italic mb-5 leading-relaxed text-sm">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-base">{t.avatar}</div>
                <div>
                  <div className="font-bold text-white text-sm">{t.author}</div>
                  <div className="text-white/50 text-xs">{t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// NOUVEAU : Module blog pour les articles entreprises
function BlogSection() {
  const [saved, setSaved] = useState<string[]>([]);
  const entrepriseArticles = BLOG_ARTICLES;

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSaved(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-bold" style={{ backgroundColor: `${GREEN}10`, color: GREEN }}>
            <BookOpen className="size-4" /> Blog & Conseils
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: DARK }}>
            Préparez votre <span style={{ color: ORANGE }}>événement</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Tous nos guides, conseils et astuces pour organiser un team building réussi
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {entrepriseArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all flex flex-col"
            >
              <Link to={`/blog/${article.slug}`} className="flex flex-col flex-1">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Badge lecture */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold">
                    <Clock className="size-3" />
                    {article.readTime} min
                  </div>

                  {/* Bouton sauvegarde */}
                  <button
                    onClick={(e) => toggleSave(article.id, e)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
                    style={{ backgroundColor: saved.includes(article.id) ? '#ef4444' : 'rgba(0,0,0,0.4)' }}
                  >
                    <Heart className={`size-3.5 ${saved.includes(article.id) ? 'fill-white text-white' : 'text-white'}`} />
                  </button>
                </div>

                {/* Contenu */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: `${GREEN}15`, color: GREEN }}
                      >
                        #{tag}
                      </span>
                    ))}
                    {article.featured && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: ORANGE }}>
                        À la une
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-gray-900 text-base leading-tight mb-2 flex-1 group-hover:text-green-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                        {article.author.avatar}
                      </div>
                      <div className="text-xs text-gray-500">{article.date}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Eye className="size-3" />
                      {article.views > 999 ? `${(article.views / 1000).toFixed(1)}k` : article.views}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="h-0.5" style={{ backgroundColor: GREEN }} />
            </motion.article>
          ))}
        </div>

        {/* Lien vers tout le blog */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link 
            to="/blog/preparer?categorie=entreprise" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:shadow-lg"
            style={{ backgroundColor: `${GREEN}10`, color: GREEN }}
          >
            Voir tous les articles <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4" style={{ color: DARK }}>
            Questions <span style={{ color: GREEN }}>fréquentes</span>
          </h2>
        </motion.div>
        <div className="space-y-3">
          {FAQ_CORP.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border-2 overflow-hidden"
              style={{ borderColor: open === i ? GREEN : '#f3f4f6' }}
            >
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-bold text-gray-900 text-sm pr-4">{faq.q}</span>
                <motion.div animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: open === i ? GREEN : '#f3f4f6' }}>
                    <span className={`text-sm font-black ${open === i ? 'text-white' : 'text-gray-500'}`}>+</span>
                  </div>
                </motion.div>
              </button>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// NOUVEAU : Sidebar complète
function CTASidebar() {
  return (
    <div className="space-y-6">
      {/* Raccourcis catégories */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${GREEN}15` }}>
            <Filter className="size-4" style={{ color: GREEN }} />
          </div>
          <h3 className="font-black text-gray-900">Type d'événement</h3>
        </div>
        <div className="space-y-1.5">
          {PROGRAM_TYPES.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ x: 4 }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm text-gray-600 hover:text-gray-900"
            >
              <span className="text-xl">{type.icon}</span>
              <span className="flex-1 font-medium">{type.title}</span>
              <ChevronRight className="size-4 text-gray-400" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Articles populaires */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${ORANGE}15` }}>
            <TrendingUp className="size-4" style={{ color: ORANGE }} />
          </div>
          <h3 className="font-black text-gray-900">Articles les plus lus</h3>
        </div>
        <div className="space-y-4">
          {BLOG_ARTICLES.sort((a, b) => b.views - a.views).slice(0, 4).map((article, i) => (
            <motion.div key={article.id} whileHover={{ x: 4 }} className="group">
              <Link to={`/blog/${article.slug}`} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
                  style={{ background: i === 0 ? `linear-gradient(135deg, ${ORANGE}, #d66310)` : `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}
                >
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-900 leading-tight group-hover:text-green-700 transition-colors line-clamp-2">
                    {article.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                    <span className="flex items-center gap-0.5"><Eye className="size-3" />{article.views.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tags populaires */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${GREEN}15` }}>
            <Tag className="size-4" style={{ color: GREEN }} />
          </div>
          <h3 className="font-black text-gray-900">Sujets populaires</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['team-building', 'organisation', 'cohesion', 'performance', 'outdoor', 'seminaire', 'fusion', 'incentive'].map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border"
              style={{ borderColor: `${GREEN}30`, color: GREEN, backgroundColor: `${GREEN}08` }}
            >
              #{tag}
            </motion.button>
          ))}
        </div>
      </div>

      {/* CTA Réservation */}
      <motion.div
        whileHover={{ y: -4 }}
        className="relative rounded-3xl overflow-hidden shadow-xl p-6 text-white"
        style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #2d6100 100%)` }}
      >
        <motion.div 
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ duration: 6, repeat: Infinity }} 
        />
        <div className="relative z-10">
          <div className="text-3xl mb-3">📅</div>
          <h4 className="font-black text-lg mb-2">Prêt à organiser ?</h4>
          <p className="text-white/70 text-sm mb-5 leading-relaxed">
            Recevez un devis personnalisé sous 24h
          </p>
          <Link
            to="/devis"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-black text-sm text-white transition-all hover:shadow-lg"
            style={{ background: `linear-gradient(135deg, ${ORANGE}, #d66310)` }}
          >
            Demander un devis <ArrowRight className="size-4" />
          </Link>
          <a 
            href="tel:0123456789"
            className="flex items-center justify-center gap-2 mt-3 text-white/60 text-xs hover:text-white/80 transition-colors"
          >
            <Phone className="size-3" /> 01 23 45 67 89
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function CTACorporate() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${CORP_ACCENT} 100%)` }}
        >
          <div className="p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="text-4xl mb-4">💼</div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Votre prochain événement d'entreprise commence ici</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-0">
                Devis personnalisé sous 24h, coordonnateur dédié, aucune contrainte logistique pour vous.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto">
              <Link to="/devis" className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-white shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #d66310)` }}>
                <Calendar className="size-5" /> Demander un devis
              </Link>
              <a href="mailto:groupes@nolimit.fr" className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white border border-white/20 bg-white/10">
                <Mail className="size-5" /> groupes@nolimit.fr
              </a>
              <a href="tel:0123456789" className="flex items-center justify-center gap-2 text-white/60 text-sm hover:text-white/80 transition-colors">
                <Phone className="size-4" /> 01 23 45 67 89
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function GroupeCorporatePage() {
  return (
    <div className="min-h-screen bg-white">
      <CorporateHero />
      
      {/* NOUVEAU : Bloc "type" - juste après le hero */}
      <ProgramTypesSection />
      
      <ProgramsSection />
      
      {/* Section avec deux colonnes */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Colonne principale - contenu existant */}
          <div className="flex-1 min-w-0">
            <SectorsSection />
            <TestimonialsSection />
            <FAQSection />
          </div>
          
          {/* NOUVEAU : Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <CTASidebar />
            </div>
          </aside>
          
        </div>
      </div>

      {/* NOUVEAU : Module blog - après la sidebar */}
      <BlogSection />

      {/* CTA final */}
      <CTACorporate />
    </div>
  );
}
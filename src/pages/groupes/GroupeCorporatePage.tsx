// pages/groups/GroupeCorporatePage.tsx — Entreprises & Team Building
// Direction : Corporate premium · dark power · ROI driven
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Building2, Users, Calendar, Phone, ArrowRight, CheckCircle,
  TrendingUp, Shield, Clock, Award, Briefcase, Target,
  BarChart3, Handshake, Zap, ChevronRight, MessageSquare, Star, Mail
} from 'lucide-react';
import { useRef, useState } from 'react';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#0d0d0d';
const CORP_ACCENT = '#1e3a5f'; // navy pro

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

function ProgramsSection() {
  return (
    <section className="py-20 bg-white">
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
    <section className="py-16 bg-gray-50">
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
      <ProgramsSection />
      <SectorsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTACorporate />
    </div>
  );
}

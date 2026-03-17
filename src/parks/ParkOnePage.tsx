// pages/ParkOnePage.tsx (partie modifiée uniquement)
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Calendar, Clock, CheckCircle, Users, Shield,
  ArrowRight, Zap, PartyPopper, Gift, Sparkles, Target,
  Car, Bike, AlertCircle, Utensils, ShoppingBag, Droplets,
  Trees, Wifi, Send,
} from 'lucide-react';

import { usePark }              from '../utils/usePark';
import { activities }           from '../data/activities';
import { ParkActualitesSection } from './ParkActualitesSection';
import { ParkStatusBadge }       from './ParkStatusBadge';

// ── Composants extraits ──────────────────────────────────
import { ParkAnchorMenu }       from './ParkAnchorMenu';
import { ParkHero }             from './ParkHero';
import { ParkSidebar }          from './ParkSidebar';
import { ParkWeatherBlock }     from './ParkWeatherBlock';
import { ParkOnSiteBlock }      from './ParkOnSiteBlock';
import { ParkAccessibilityBlock } from './ParkAccessibilityBlock';
import { ParkFAQSection }       from './ParkFAQSection';
import { ParkBlogSection }      from './/ParkBlogSection';
import { ParkContactSection }   from './ParkContactSection';
import { ParkActivityModal }    from './ParkActivityModal';
import { ParkNewsletterBanner } from './ParkNewsletterBanner';
import { ParkBrevoForm }        from './ParkBrevoForm';
import { ParkReviewsSection }   from './Parkreviewssection';
import {
  AnimatedSection, SectionBadge, DarkSectionBg,
  SubtlePatternBg, FloatingBlob,
  GREEN, ORANGE, DARK,
} from './ParkHelpers';

// ════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ════════════════════════════════════════════════════════
export function ParkOnePage() {
  const park     = usePark();
  const parkId   = useParams().parkId;
  const location = useLocation();

  const [selectedActivity, setSelectedActivity]               = useState<typeof activities[0] | null>(null);
  const [hasProcessedInitialState, setHasProcessedInitialState] = useState(false);

  if (!park) return null;

  const parkActivities = activities.filter(activity =>
    park.activities.some((pa: string) =>
      pa.toLowerCase().includes(activity.name.toLowerCase().split(' ')[0])
    )
  );

  // Ouvrir l'activité depuis la navigation (state router)
  useEffect(() => {
    if (hasProcessedInitialState) return;
    const openActivityId = (location.state as any)?.openActivityId;
    if (!openActivityId || parkActivities.length === 0) return;
    const target = parkActivities.find(a => a.id === openActivityId || (a as any).slug === openActivityId);
    if (target) {
      setHasProcessedInitialState(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      setSelectedActivity(target);
    }
  }, [location.state, parkActivities, hasProcessedInitialState]);

  // Escape pour fermer la modale
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && selectedActivity) setSelectedActivity(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedActivity]);

  // Lock scroll sur modale ouverte
  useEffect(() => {
    document.body.style.overflow = selectedActivity ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedActivity]);

  const pricingOptions = [
    {
      name: 'Individuel', price: park.minPrice, description: 'Parfait pour une personne',
      features: ['Accès à toutes les activités','Équipement inclus','Encadrement professionnel','Assurance comprise'],
      popular: false, icon: '🧗', color: GREEN,
    },
    {
      name: 'Groupe (5-10)', price: park.minPrice - 5, description: 'Idéal entre amis',
      features: ['Accès à toutes les activités','Équipement inclus','Encadrement professionnel','Réduction groupe','Photo souvenir offerte'],
      popular: true, icon: '👥', color: ORANGE,
    },
    {
      name: 'Entreprise', price: 'Sur devis' as string | number, description: 'Team building sur mesure',
      features: ['Programme personnalisé','Équipement inclus','Encadrement dédié','Forfait restauration possible','Salle de réunion'],
      popular: false, icon: '🏢', color: GREEN,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ParkAnchorMenu />
      <ParkHero park={park} />
      <ParkSidebar park={park} />

      {/* ════ CONTENU PRINCIPAL ════ */}
      <div className="xl:pr-[22rem]">
        <div className="container mx-auto px-6 py-16">
          <div className="space-y-14">

            {/* ── Description ── */}
            <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-7 rounded-full" style={{ backgroundColor: ORANGE }} />
                <h2 className="text-3xl font-black" style={{ color: DARK }}>Bienvenue au parc</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">{park.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {park.highlights.map((h: string, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3 py-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${GREEN}18` }}>
                      <CheckCircle className="size-3.5" style={{ color: GREEN }} />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">{h}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

         

            {/* ── INFOS PRATIQUES UNIFIÉES ── */}
            <section id="infos" className="relative">
              {/* Titre aligné à gauche comme "Bienvenue au parc" */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-7 rounded-full" style={{ backgroundColor: ORANGE }} />
                  <h2 className="text-3xl font-black" style={{ color: DARK }}>Infos <span style={{ color: GREEN }}>pratiques</span></h2>
                </div>
                <p className="text-gray-500 text-sm ml-4">Tout ce qu'il faut savoir avant de venir</p>
              </motion.div>

              {/*
                DISPOSITION :
                ┌──────────────────┬──────────────────┬──────────────────┐
                │  Calendrier /    │      Météo       │  Comment venir   │  ← 3 cols égales, météo & comment même hauteur
                │  Horaires        │   (agrandi ↕)    │  infos en liste  │
                │  (agrandi ↕)     ├──────────────────┴──────────────────┤
                │                  │      Équipements & Services          │  ← 2/3 de largeur, sous météo + comment venir
                └──────────────────┴─────────────────────────────────────┘
              */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">

                {/* ── COL 1 : Calendrier / Horaires ── agrandi vers le bas */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col lg:row-span-2"
                  style={{ minHeight: '480px' }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${GREEN}15` }}>
                      <Clock className="size-5" style={{ color: GREEN }} />
                    </div>
                    <h3 className="text-xl font-black" style={{ color: DARK }}>Calendrier & horaires</h3>
                  </div>

                  <div className="mb-5">
                    <ParkStatusBadge parkSlug={park.id} size="md" showDetails={true} />
                  </div>

                  {/* Placeholder calendrier — sera remplacé. flex-1 pour remplir toute la hauteur disponible */}
                  <div
                    className="flex-1 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 p-6"
                    style={{ borderColor: `${GREEN}30`, backgroundColor: `${GREEN}05`, minHeight: '220px' }}
                  >
                    <Calendar className="size-12 opacity-25" style={{ color: GREEN }} />
                    <span className="text-sm text-gray-400 font-medium text-center">
                      Calendrier de disponibilités
                      <br /><span className="text-xs">Bientôt disponible</span>
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-start gap-2 text-xs p-3 rounded-lg" style={{ backgroundColor: `${ORANGE}08`, border: `1px solid ${ORANGE}20` }}>
                      <AlertCircle className="size-4 flex-shrink-0" style={{ color: ORANGE }} />
                      <span className="text-gray-700">Fermé les lundis hors vacances scolaires</span>
                    </div>
                  </div>
                </motion.div>

                {/* ── COL 2 : Météo — allongée verticalement, même hauteur que Comment venir ── */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col"
                  style={{ minHeight: '200px' }}
                >
                  {/* Le bloc météo prend toute la hauteur disponible */}
                  <div className="flex-1 h-full">
                    <ParkWeatherBlock />
                  </div>
                </motion.div>

                {/* ── COL 3 : Comment venir — même hauteur que Météo, infos en colonne ── */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col gap-3"
                  style={{ minHeight: '200px' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${ORANGE}15` }}>
                      <MapPin className="size-4" style={{ color: ORANGE }} />
                    </div>
                    <h3 className="text-base font-black" style={{ color: DARK }}>Comment venir ?</h3>
                  </div>

                  {/* Adresse */}
                  <motion.a
                    href={`https://maps.google.com/?q=${encodeURIComponent(park.location)}`}
                    target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.01 }}
                    className="flex items-start gap-2 p-3 rounded-xl transition-all"
                    style={{ backgroundColor: `${ORANGE}08`, border: `1px solid ${ORANGE}30` }}
                  >
                    <MapPin className="size-4 flex-shrink-0 mt-0.5" style={{ color: ORANGE }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-700 text-xs leading-relaxed">{park.location}</div>
                      <div className="text-[10px] mt-0.5 font-medium" style={{ color: ORANGE }}>Ouvrir Google Maps →</div>
                    </div>
                  </motion.a>

                  {/* Modes de transport — en colonne */}
                  <div className="flex flex-col gap-2 flex-1">
                    {[
                      { icon: Car,  color: GREEN,  title: 'Voiture', desc: 'Parking gratuit sur place' },
                      { icon: Bike, color: ORANGE, title: 'Vélo',    desc: 'Piste cyclable à proximité' },
                    ].map(({ icon: Icon, color, title, desc }) => (
                      <div key={title} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                          <Icon className="size-4" style={{ color }} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{title}</div>
                          <div className="text-gray-500 text-xs">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ── Équipements & Services ── occupe les 2 dernières colonnes (météo + comment venir) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-md border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${GREEN}15` }}>
                      <Shield className="size-5" style={{ color: GREEN }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-black" style={{ color: DARK }}>Équipements & Services</h3>
                      <p className="text-gray-400 text-xs">Accessibilité, services et commodités sur place</p>
                    </div>
                    <div className="px-2.5 py-1 rounded-full text-[10px] font-black text-white shrink-0" style={{ backgroundColor: GREEN }}>
                      Label Tourisme & Handicap
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {[
                      { icon: '♿', label: 'PMR',                  detail: 'Rampes, parking réservé' },
                      { icon: '👁️', label: 'Déficience visuelle',  detail: 'Parcours balisés' },
                      { icon: '👂', label: 'Déficience auditive',   detail: 'Communication visuelle' },
                      { icon: '🧠', label: 'Handicap cognitif',     detail: 'Activités adaptées' },
                      { icon: '🧒', label: 'Poussettes',            detail: 'Allées larges, aire de change' },
                      { icon: '🐕', label: 'Animaux assistance',    detail: 'Chiens guides acceptés' },
                      { icon: '🅿️', label: 'Parking',              detail: '200 places · gratuit' },
                      { icon: '🍽️', label: 'Snack bar',             detail: 'Ouvert 10h–17h' },
                      { icon: '🚿', label: 'Vestiaires',            detail: 'Douches incluses' },
                      { icon: '📶', label: 'WiFi',                  detail: 'Gratuit & illimité' },
                      { icon: '🧰', label: 'Matériel',              detail: 'Tout fourni' },
                      { icon: '🌳', label: 'Détente',               detail: 'Zone ombragée' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all"
                      >
                        <span className="text-base flex-shrink-0">{item.icon}</span>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 text-[11px] truncate">{item.label}</div>
                          <div className="text-gray-400 text-[10px] truncate">{item.detail}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

              </div>
            </section>

          </div>
        </div>
      </div>

      {/* ════ ACTIVITÉS ════ */}
      <section id="activites" className="relative py-20 overflow-hidden" style={{ backgroundColor: DARK }}>
        <DarkSectionBg />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <SectionBadge icon={<Zap className="size-4" style={{ color: ORANGE }} />} text="Nos activités" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Découvrez <span style={{ color: ORANGE }}>l'aventure</span>
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">Des activités outdoor et indoor pour tous les âges et tous les niveaux</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {parkActivities.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative cursor-pointer"
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="relative w-full aspect-square rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/40 transition-all">
                  <img src={activity.image} alt={activity.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/40 via-[#111111]/60 to-[#111111]/80" />
                  <div className="relative h-full flex flex-col items-center justify-center text-center p-4" style={{ marginTop: '-100%' }}>
                    <h3 className="text-lg font-black text-white mb-2 px-2">{activity.name}</h3>
                    <div className="flex flex-col gap-1.5">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium border border-white/30">{activity.difficulty}</span>
                      <span className="px-3 py-1 backdrop-blur-sm rounded-full text-xs text-white font-medium border border-white/30" style={{ backgroundColor: `${GREEN}4D` }}>{activity.minAge}+ ans</span>
                    </div>
                  </div>
                  <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center backdrop-blur-md" style={{ background: `linear-gradient(135deg, ${GREEN}EB, #4a9d00EB)` }}>
                    <span className="text-white font-bold text-sm flex items-center gap-2">En savoir plus <ArrowRight className="size-4" /></span>
                  </motion.div>
                </div>
                <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 0.4 }} className="absolute -inset-1 rounded-full blur-xl -z-10" style={{ background: `linear-gradient(to right, ${GREEN}, ${ORANGE})` }} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="activities" className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full font-bold text-sm hover:bg-gray-100 transition-colors group" style={{ color: DARK }}>
              Voir toutes les activités <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

         {/* ── TARIFS (remontés) ── */}
            <section id="tarifs" className="relative py-20">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-medium border mt-8" style={{ backgroundColor: `${GREEN}10`, borderColor: `${GREEN}30`, color: GREEN }}>
                  <Gift className="size-4" /> Tarifs transparents
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-2" style={{ color: DARK }}>
                  Nos <span style={{ color: GREEN }}>tarifs</span>
                </h2>
                <p className="text-gray-600">Des formules adaptées à tous vos besoins</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {pricingOptions.map((option, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15, type: 'spring' }} whileHover={{ y: -8, scale: 1.02 }} className="relative group">
                    {option.popular && (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', delay: 0.4 }} className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg" style={{ background: `linear-gradient(to right, ${ORANGE}, #d66310)` }}>
                        <Sparkles className="size-3 inline mr-1" /> Le plus populaire
                      </motion.div>
                    )}
                    <div className={`relative bg-white rounded-2xl p-6 shadow-lg transition-all ${option.popular ? 'ring-2' : 'border border-gray-100'}`} style={option.popular ? { borderColor: ORANGE } : {}}>
                      <div className="text-center mb-4">
                        <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-4xl mb-3">{option.icon}</motion.div>
                        <h3 className="text-xl font-black mb-1" style={{ color: DARK }}>{option.name}</h3>
                        <p className="text-gray-600 text-xs">{option.description}</p>
                      </div>
                      <div className="text-center mb-4 py-3 rounded-xl" style={{ backgroundColor: `${option.color}08` }}>
                        <div className="text-3xl font-black mb-0.5" style={{ color: option.color }}>
                          {typeof option.price === 'number' ? `${option.price}€` : option.price}
                        </div>
                        {typeof option.price === 'number' && <div className="text-gray-500 text-[10px] font-medium">par personne</div>}
                      </div>
                      <ul className="space-y-2 mb-4">
                        {option.features.slice(0, 3).map((f, fi) => (
                          <li key={fi} className="flex items-center gap-2 text-xs">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${option.color}20` }}>
                              <CheckCircle className="size-2.5" style={{ color: option.color }} />
                            </div>
                            <span className="text-gray-700">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Link to="/booking" state={{ parkId: park.id }}>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${option.popular ? 'text-white shadow-md' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`} style={option.popular ? { background: `linear-gradient(to right, ${ORANGE}, #d66310)` } : {}}>
                          Réserver <ArrowRight className="size-3.5" />
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

      {/* ════ BON À SAVOIR (simplifié) ════ */}
      <section className="relative py-16 overflow-hidden" style={{ backgroundColor: DARK }}>
        <DarkSectionBg />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <SectionBadge icon={<Shield className="size-4" style={{ color: ORANGE }} />} text="Bon à savoir" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Informations <span style={{ color: ORANGE }}>importantes</span></h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: Clock, title: 'Annulation gratuite', color: GREEN },
              { icon: Users, title: 'Tarifs dégressifs', color: ORANGE },
              { icon: Shield, title: 'Assurance incluse', color: GREEN },
              { icon: Calendar, title: 'Réservation flexible', color: ORANGE },
              { icon: Gift, title: 'Carte cadeau', color: GREEN },
              { icon: Star, title: 'Programme fidélité', color: ORANGE },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
              >
                <item.icon className="size-6 mx-auto mb-2" style={{ color: item.color }} />
                <h4 className="text-white font-bold text-xs">{item.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FAQ ════ */}
      <ParkFAQSection />

      {/* ════ ACTUALITÉS — Quoi de neuf ════ */}
      <ParkActualitesSection parkId={parkId!} parkImage={park.image} />
 
      {/* ════ BLOG — Inspirations ════ */}
      <ParkBlogSection />
 
      {/* ════ BANDEAU NEWSLETTER (léger) ════ */}
      <ParkNewsletterBanner parkSlug={parkId} />

      {/* ════ AVIS DU PARC ════ */}
      <ParkReviewsSection park={park} />
 
      {/* ════ CONTACT ════ */}
      <section id="contact" className="relative bg-gradient-to-b from-gray-50 to-white">
        <SubtlePatternBg />
        <ParkContactSection park={park} />
      </section>
 

 
      {/* ════ MODALE ACTIVITÉ ════ */}
      <AnimatePresence>
        {selectedActivity && (
          <ParkActivityModal
            activity={selectedActivity}
            park={park}
            allActivities={parkActivities}
            onClose={() => setSelectedActivity(null)}
            onNavigate={(a) => setSelectedActivity(a)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
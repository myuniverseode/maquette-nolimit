// parks/ParkOnePage.tsx — 100% dynamique depuis WordPress
// ⚠️ Tous les hooks sont appelés AVANT tout return conditionnel (Rules of Hooks)
import { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Calendar, Clock, CheckCircle, Users, Shield,
  ArrowRight, Zap, Gift, Sparkles,
  Car, Bike, Utensils, ShoppingBag, Droplets,
  Trees, Wifi, Loader2,
} from 'lucide-react';

import { usePark } from '../utils/usePark';
import { useActivitiesData, ActivityWithTarifs } from '../hooks/useActiviesData';
import { ParkActualitesSection } from './ParkActualitesSection';
import { ParkStatusBadge } from './ParkStatusBadge';
import { ParkReviewsSection } from './ParkReviewsSection';
import { ParkAnchorMenu } from './ParkAnchorMenu';
import { ParkHero } from './ParkHero';
import { ParkSidebar } from './ParkSidebar';
import { ParkWeatherBlock } from './ParkWeatherBlock';
import { ParkFAQSection } from './ParkFAQSection';
import { ParkBlogSection } from './ParkBlogSection';
import { ParkContactSection } from './ParkContactSection';
import { ParkActivityModal } from './ParkActivityModal';
import { ParkNewsletterBanner } from './ParkNewsletterBanner';
import {
  SectionBadge, DarkSectionBg,
  SubtlePatternBg,
  GREEN, ORANGE, DARK,
} from './ParkHelpers';
import ParkCalendarSection from './calendar/ParkCalendarSection';

// Mapping icônes pour données dynamiques WP
const iconMap: Record<string, any> = {
  Shield, Utensils, ShoppingBag, Droplets, Trees, Wifi,
  Car, Bike, Users, Clock, Calendar, Star, Gift, CheckCircle,
};

export function ParkOnePage() {
  // ═══════════════════════════════════════════════════
  // TOUS LES HOOKS EN PREMIER — jamais après un return
  // ═══════════════════════════════════════════════════
  const park = usePark();
  const parkId = useParams().parkId;
  const location = useLocation();
  const { activities } = useActivitiesData();

  const [selectedActivity, setSelectedActivity] = useState<ActivityWithTarifs | null>(null);
  const [hasProcessedInitialState, setHasProcessedInitialState] = useState(false);

  // Filtrer les activités du parc + appliquer les tarifs spécifiques à ce parc
  const parkActivities = useMemo(() => {
    if (!park) return [];
    const filtered = activities.filter(activity =>
      park.activities.some((pa: string) =>
        pa.toLowerCase().includes(activity.name.toLowerCase().split(' ')[0])
      )
    );
    // Overlay park-specific tarifs si le parc en a
    const parkTarifs = (park as any).activityTarifs || {};
    return filtered.map(activity => {
      const slug = activity.slug || String(activity.id);
      const parkSpecific = parkTarifs[slug];
      if (parkSpecific && Array.isArray(parkSpecific) && parkSpecific.length > 0) {
        return { ...activity, tarifs: parkSpecific };
      }
      return activity;
    });
  }, [park, activities]);

  // Ouvrir activité depuis navigation (state router)
  useEffect(() => {
    if (!park || hasProcessedInitialState) return;
    const openActivityId = (location.state as any)?.openActivityId;
    if (!openActivityId || parkActivities.length === 0) return;
    const target = parkActivities.find(a => a.id === openActivityId || a.slug === openActivityId);
    if (target) {
      setHasProcessedInitialState(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      setSelectedActivity(target);
    }
  }, [park, location.state, parkActivities, hasProcessedInitialState]);

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

  // ═══════════════════════════════════════════════════
  // EARLY RETURN — après tous les hooks
  // ═══════════════════════════════════════════════════
  if (!park) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-gray-300" />
      </div>
    );
  }

  // ── Tarifs dynamiques depuis WP (avec fallback) ──
  const pricingOptions = park.pricingOptions?.length ? park.pricingOptions : [
    {
      name: 'Individuel', price: park.minPrice, description: 'Parfait pour une personne',
      features: ['Accès à toutes les activités', 'Équipement inclus', 'Encadrement professionnel', 'Assurance comprise'],
      popular: false, icon: '🧗', color: GREEN,
    },
    {
      name: 'Groupe (5-10)', price: park.minPrice - 5, description: 'Idéal entre amis',
      features: ['Accès à toutes les activités', 'Équipement inclus', 'Encadrement professionnel', 'Réduction groupe', 'Photo souvenir offerte'],
      popular: true, icon: '👥', color: ORANGE,
    },
    {
      name: 'Entreprise', price: 'Sur devis' as string | number, description: 'Team building sur mesure',
      features: ['Programme personnalisé', 'Équipement inclus', 'Encadrement dédié', 'Forfait restauration possible', 'Salle de réunion'],
      popular: false, icon: '🏢', color: GREEN,
    },
  ];

  // ── Services sur place ──
  const onSiteServices = park.onSiteServices?.length ? park.onSiteServices : [
    { icon: 'Shield', label: 'Vestiaires', color: GREEN },
    { icon: 'Utensils', label: 'Restauration', color: ORANGE },
    { icon: 'ShoppingBag', label: 'Boutique', color: GREEN },
    { icon: 'Droplets', label: 'Sanitaires', color: ORANGE },
    { icon: 'Trees', label: 'Ombragé', color: GREEN },
    { icon: 'Wifi', label: 'WiFi', color: ORANGE },
  ];

  // ── Accessibilité ──
  const accessibilityItems = park.accessibilityItems?.length ? park.accessibilityItems : [
    { emoji: '♿', label: 'Accès PMR', available: true },
    { emoji: '👁️', label: 'Déf. visuelle', available: true },
    { emoji: '🍼', label: 'Poussettes', available: true },
    { emoji: '🐕', label: 'Animaux guide', available: true },
  ];

  // ── Transport ──
  const transportOptions = park.transportOptions?.length ? park.transportOptions : [
    { icon: 'Car', color: GREEN, title: 'Parking', desc: 'Gratuit sur place' },
    { icon: 'Bike', color: ORANGE, title: 'Vélo', desc: 'Piste cyclable à proximité' },
    { icon: 'Users', color: GREEN, title: 'Covoiturage', desc: 'BlaBlaCar recommandé' },
  ];

  // ── Bon à savoir ──
  const goodToKnow = park.goodToKnow?.length ? park.goodToKnow : [
    { icon: 'Clock', title: 'Annulation gratuite', color: GREEN },
    { icon: 'Users', title: 'Tarifs dégressifs', color: ORANGE },
    { icon: 'Shield', title: 'Assurance incluse', color: GREEN },
    { icon: 'Calendar', title: 'Réservation flexible', color: ORANGE },
    { icon: 'Gift', title: 'Carte cadeau', color: GREEN },
    { icon: 'Star', title: 'Programme fidélité', color: ORANGE },
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
              <h2 className="text-3xl font-black mb-5" style={{ color: DARK }}>Bienvenue au parc</h2>
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

            {/* ── INFOS PRATIQUES + CALENDRIER ── */}
            <section id="infos" className="relative">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-medium border" style={{ backgroundColor: `${ORANGE}10`, borderColor: `${ORANGE}30`, color: ORANGE }}>
                  Préparez votre visite
                </div>
                <p className="text-gray-500 text-sm ml-4">Tout ce qu'il faut savoir avant de venir</p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-6 items-stretch">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:h-full [&>*]:lg:h-full">
                  <ParkCalendarSection parkId={park.id} />
                </motion.div>

                <div className="flex flex-col gap-4 lg:h-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch lg:flex-1">
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:h-full [&>*]:lg:h-full">
                      <ParkWeatherBlock />
                    </motion.div>

                    {/* Comment venir */}
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col gap-3 lg:h-full">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${ORANGE}15` }}>
                          <MapPin className="size-4" style={{ color: ORANGE }} />
                        </div>
                        <h3 className="font-black text-sm" style={{ color: DARK }}>Comment venir ?</h3>
                      </div>
                      <motion.a href={`https://maps.google.com/?q=${encodeURIComponent(park.address || park.location)}`} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.01 }} className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: `${ORANGE}08`, border: `1.5px solid ${ORANGE}30` }}>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: ORANGE }}>
                          <MapPin className="size-5 text-white" />
                        </div>
                        <div>
                          <div className="text-gray-900 text-sm font-bold leading-snug">{park.location}</div>
                          <div className="text-xs mt-1 font-semibold" style={{ color: ORANGE }}>Voir sur Google Maps →</div>
                        </div>
                      </motion.a>
                      <div className="flex flex-col gap-2 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Accès</p>
                        <div className="flex flex-col gap-2 flex-1 justify-evenly">
                          {transportOptions.map(({ icon, color, title, desc }: any) => {
                            const Icon = iconMap[icon] || Car;
                            const c = color || GREEN;
                            return (
                              <div key={title} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${c}15` }}>
                                  <Icon className="size-4" style={{ color: c }} />
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 text-xs">{title}</div>
                                  <div className="text-gray-500 text-[10px]">{desc}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Sur place + Accessibilité */}
                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 lg:flex-1 flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${GREEN}15` }}>
                          <Shield className="size-3.5" style={{ color: GREEN }} />
                        </div>
                        <span className="font-black text-sm" style={{ color: DARK }}>Sur place</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {onSiteServices.map(({ icon, label, color: c }: any, idx: number) => {
                          const Icon = iconMap[icon] || Shield;
                          const clr = c || (idx % 2 === 0 ? GREEN : ORANGE);
                          return (
                            <div key={idx} className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-gray-50 text-center">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${clr}15` }}>
                                <Icon className="size-4" style={{ color: clr }} />
                              </div>
                              <span className="text-[11px] font-semibold text-gray-600 leading-none">{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${ORANGE}15` }}>
                          <CheckCircle className="size-3.5" style={{ color: ORANGE }} />
                        </div>
                        <span className="font-black text-sm" style={{ color: DARK }}>Accessibilité</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {accessibilityItems.map(({ emoji, label, available }: any) => (
                          <div key={label} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50">
                            <span className="text-base leading-none">{emoji}</span>
                            <span className="text-xs font-medium text-gray-700 flex-1">{label}</span>
                            {available !== false && <CheckCircle className="size-3.5 flex-shrink-0" style={{ color: GREEN }} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Horaires */}
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-6 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${GREEN}15` }}>
                    <Clock className="size-5" style={{ color: GREEN }} />
                  </div>
                  <h3 className="font-black text-base" style={{ color: DARK }}>Horaires d'ouverture</h3>
                </div>
                <ParkStatusBadge parkSlug={park.id} size="md" showDetails={true} />
              </motion.div>
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
              {"Découvrez "}
              <span style={{ color: ORANGE }}>l'aventure</span>
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">Des activités outdoor et indoor pour tous les âges et tous les niveaux</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {parkActivities.map((activity, i) => (
              <motion.div key={activity.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -8, scale: 1.02 }} className="group relative cursor-pointer" onClick={() => setSelectedActivity(activity)}>
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
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/activities" className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full font-bold text-sm hover:bg-gray-100 transition-colors group" style={{ color: DARK }}>
              Voir toutes les activités <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TARIFS ── */}
      <section id="tarifs" className="relative py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-medium border mt-8" style={{ backgroundColor: `${GREEN}10`, borderColor: `${GREEN}30`, color: GREEN }}>
            <Gift className="size-4" /> Tarifs transparents
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-2" style={{ color: DARK }}>
            {"Nos "}<span style={{ color: GREEN }}>tarifs</span>
          </h2>
          <p className="text-gray-600">Des formules adaptées à tous vos besoins</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingOptions.map((option: any, idx: number) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15, type: 'spring' }} whileHover={{ y: -8, scale: 1.02 }} className="relative group">
              {option.popular && (
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', delay: 0.4 }} className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg" style={{ background: `linear-gradient(to right, ${ORANGE}, #d66310)` }}>
                  <Sparkles className="size-3 inline mr-1" /> Le plus populaire
                </motion.div>
              )}
              <div className={`relative bg-white rounded-2xl p-6 shadow-lg transition-all ${option.popular ? 'ring-2' : 'border border-gray-100'}`} style={option.popular ? { borderColor: ORANGE } : {}}>
                <div className="text-center mb-4">
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-4xl mb-3">{option.icon || '🎯'}</motion.div>
                  <h3 className="text-xl font-black mb-1" style={{ color: DARK }}>{option.name}</h3>
                  <p className="text-gray-600 text-xs">{option.description}</p>
                </div>
                <div className="text-center mb-4 py-3 rounded-xl" style={{ backgroundColor: `${option.color || GREEN}08` }}>
                  <div className="text-3xl font-black mb-0.5" style={{ color: option.color || GREEN }}>
                    {typeof option.price === 'number' ? `${option.price}€` : option.price}
                  </div>
                  {typeof option.price === 'number' && <div className="text-gray-500 text-[10px] font-medium">par personne</div>}
                </div>
                <ul className="space-y-2 mb-4">
                  {(option.features || []).slice(0, 3).map((f: string, fi: number) => (
                    <li key={fi} className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${option.color || GREEN}20` }}>
                        <CheckCircle className="size-2.5" style={{ color: option.color || GREEN }} />
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

      {/* ════ BON À SAVOIR ════ */}
      <section className="relative py-16 overflow-hidden" style={{ backgroundColor: DARK }}>
        <DarkSectionBg />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <SectionBadge icon={<Shield className="size-4" style={{ color: ORANGE }} />} text="Bon à savoir" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              {"Informations "}<span style={{ color: ORANGE }}>importantes</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {goodToKnow.map((item: any, idx: number) => {
              const Icon = iconMap[item.icon] || Shield;
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Icon className="size-6 mx-auto mb-2" style={{ color: item.color || GREEN }} />
                  <h4 className="text-white font-bold text-xs">{item.title}</h4>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <ParkFAQSection />
      <ParkActualitesSection parkId={parkId!} parkImage={park.image} />
      <ParkBlogSection />
      <ParkNewsletterBanner parkSlug={parkId} />
      <ParkReviewsSection park={park} />

      <section id="contact" className="relative bg-gradient-to-b from-gray-50 to-white">
        <SubtlePatternBg />
        <ParkContactSection park={park} />
      </section>

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

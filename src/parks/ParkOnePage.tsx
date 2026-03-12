// pages/ParkOnePage.tsx
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
import { ParkBrevoForm }        from './ParkBrevoForm';
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

            {/* ── Infos pratiques inline ── */}
            <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-7 rounded-full" style={{ backgroundColor: GREEN }} />
                <h2 className="text-3xl font-black" style={{ color: DARK }}>Infos pratiques</h2>
              </div>
                <ParkStatusBadge 
        parkSlug="nolimit-chevry"
        size="md"
        showDetails={true}
      />
              <div className="col-span-1 sm:col-span-2 mt-4">
                <ParkWeatherBlock />
              </div>
              <div className="mt-4">
                <ParkOnSiteBlock park={park} />
              </div>
            </motion.section>

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

      {/* ════ TARIFS ════ */}
      <section id="tarifs" className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
        <SubtlePatternBg />
        <FloatingBlob color={GREEN}  className="top-20 left-10"    size="w-32 h-32" />
        <FloatingBlob color={ORANGE} className="bottom-32 right-20" size="w-40 h-40" delay={3} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium border" style={{ backgroundColor: `${GREEN}10`, borderColor: `${GREEN}30`, color: GREEN }}>
              <Gift className="size-4" /> Tarifs transparents
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: DARK }}>
              Nos <span style={{ color: GREEN }}>tarifs</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Des formules adaptées à tous vos besoins</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingOptions.map((option, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15, type: 'spring' }} whileHover={{ y: -12, scale: 1.02 }} className="relative group">
                {option.popular && (
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', delay: 0.4 }} className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-6 py-2 rounded-full text-sm font-bold text-white shadow-lg" style={{ background: `linear-gradient(to right, ${ORANGE}, #d66310)` }}>
                    <Sparkles className="size-4 inline mr-1" /> Le plus populaire
                  </motion.div>
                )}
                <div className={`relative bg-white rounded-3xl p-8 shadow-lg transition-all ${option.popular ? 'ring-4' : 'border-2 border-gray-100'}`} style={option.popular ? { borderColor: ORANGE } : {}}>
                  <div className="text-center mb-6">
                    <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-6xl mb-4">{option.icon}</motion.div>
                    <h3 className="text-2xl font-black mb-2" style={{ color: DARK }}>{option.name}</h3>
                    <p className="text-gray-600 text-sm">{option.description}</p>
                  </div>
                  <div className="text-center mb-8 py-6 rounded-2xl" style={{ backgroundColor: `${option.color}08` }}>
                    <div className="text-5xl font-black mb-1" style={{ color: option.color }}>
                      {typeof option.price === 'number' ? `${option.price}€` : option.price}
                    </div>
                    {typeof option.price === 'number' && <div className="text-gray-500 text-sm font-medium">par personne</div>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {option.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${option.color}20` }}>
                          <CheckCircle className="size-4" style={{ color: option.color }} />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/booking" state={{ parkId: park.id }}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${option.popular ? 'text-white shadow-xl' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`} style={option.popular ? { background: `linear-gradient(to right, ${ORANGE}, #d66310)` } : {}}>
                      Réserver <ArrowRight className="size-5" />
                    </motion.button>
                  </Link>
                </div>
                {option.popular && <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 0.3 }} className="absolute -inset-1 rounded-3xl blur-xl -z-10" style={{ backgroundColor: ORANGE }} />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ BON À SAVOIR ════ */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: DARK }}>
        <DarkSectionBg />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <SectionBadge icon={<Shield className="size-4" style={{ color: ORANGE }} />} text="Informations importantes" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Bon à <span style={{ color: ORANGE }}>savoir</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Clock,     title: 'Annulation gratuite',  desc: "Jusqu'à 48h avant votre venue",          color: GREEN  },
              { icon: Users,     title: 'Tarifs dégressifs',    desc: 'À partir de 10 personnes',               color: ORANGE },
              { icon: Shield,    title: 'Assurance incluse',    desc: "Couverture complète pendant l'activité", color: GREEN  },
              { icon: Calendar,  title: 'Réservation flexible', desc: "Modifiez vos dates jusqu'à 7 jours avant", color: ORANGE },
              { icon: Gift,      title: 'Carte cadeau',         desc: 'Offrez une expérience inoubliable',      color: GREEN  },
              { icon: Star,      title: 'Programme fidélité',   desc: '-10% dès la 3ème réservation',           color: ORANGE },
            ].map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ x: 5 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 hover:border-white/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}30` }}>
                    <item.icon className="size-7" style={{ color: item.color }} />
                  </div>
                  <div>
                    <h4 className="font-black text-white mb-2 text-lg">{item.title}</h4>
                    <p className="text-white/70 text-sm">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      {/* ════ FAQ ════ */}
      <ParkFAQSection />

      {/* ════ INFOS PRATIQUES COMPLÈTES ════ */}
      <section id="infos" className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
        <SubtlePatternBg />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium border" style={{ backgroundColor: `${ORANGE}10`, borderColor: `${ORANGE}30`, color: ORANGE }}>
              Préparez votre visite
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: DARK }}>
              Infos <span style={{ color: GREEN }}>pratiques</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Horaires */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} whileHover={{ y: -8 }} className="bg-white rounded-3xl p-8 shadow-lg border-2" style={{ borderColor: GREEN }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${GREEN}15` }}>
                  <Clock className="size-8" style={{ color: GREEN }} />
                </div>
                <div>
                  <h3 className="text-3xl font-black" style={{ color: DARK }}>Horaires</h3>
                  <div className="mt-2"><ParkStatusBadge parkSlug={park.id} /></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl" style={{ backgroundColor: `${GREEN}08` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GREEN }} />
                    <div className="font-black text-lg" style={{ color: DARK }}>Haute saison</div>
                  </div>
                  <div className="text-gray-600 text-sm mb-2">Avril - Septembre</div>
                  <div className="text-2xl font-black" style={{ color: GREEN }}>9h00 - 19h00</div>
                </div>
                <div className="p-6 rounded-2xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    <div className="font-black text-lg" style={{ color: DARK }}>Basse saison</div>
                  </div>
                  <div className="text-gray-600 text-sm mb-2">Octobre - Mars</div>
                  <div className="text-2xl font-black text-gray-700">10h00 - 17h00</div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl border-2" style={{ borderColor: ORANGE, backgroundColor: `${ORANGE}08` }}>
                  <AlertCircle className="size-6 flex-shrink-0 mt-0.5" style={{ color: ORANGE }} />
                  <div>
                    <div className="font-bold" style={{ color: ORANGE }}>Important</div>
                    <div className="text-gray-700 text-sm">Fermé les lundis hors vacances scolaires</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Accès */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} whileHover={{ y: -8 }} className="bg-white rounded-3xl p-8 shadow-lg border-2" style={{ borderColor: ORANGE }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${ORANGE}15` }}>
                  <MapPin className="size-8" style={{ color: ORANGE }} />
                </div>
                <h3 className="text-3xl font-black" style={{ color: DARK }}>Accès</h3>
              </div>
              <div className="space-y-6">
                <motion.a
                  href={`https://maps.google.com/?q=${encodeURIComponent(park.location)}`}
                  target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-4 p-5 rounded-2xl group cursor-pointer transition-all"
                  style={{ backgroundColor: `${ORANGE}08`, border: `2px solid ${ORANGE}30` }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: ORANGE }}>
                    <MapPin className="size-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-lg" style={{ color: DARK }}>📍 Adresse</div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white" style={{ backgroundColor: ORANGE }}>Ouvrir GPS</span>
                    </div>
                    <div className="text-gray-700">{park.location}</div>
                    <div className="text-xs mt-1" style={{ color: ORANGE }}>Appuyez pour lancer la navigation →</div>
                  </div>
                </motion.a>
                {[
                  { icon: Car,  color: GREEN,  title: 'En voiture', desc: 'Parking gratuit sur place • 200 places'       },
                  { icon: Bike, color: ORANGE, title: 'À vélo',     desc: 'Piste cyclable + stationnement vélos sécurisé' },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                      <Icon className="size-6" style={{ color }} />
                    </div>
                    <div>
                      <div className="font-black text-gray-900 mb-1">{title}</div>
                      <div className="text-gray-600 text-sm">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Accessibilité PMR */}
          <div className="max-w-6xl mx-auto mt-8">
            <ParkAccessibilityBlock />

          </div>
        </div>
      </section>

      {/* ════ ÉQUIPEMENTS ════ */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: DARK }}>
        <DarkSectionBg />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <SectionBadge icon={<Shield className="size-4" style={{ color: ORANGE }} />} text="Services disponibles" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Sur <span style={{ color: ORANGE }}>place</span></h2>
            <p className="text-white/80 text-lg">Tout le confort pour une journée parfaite</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Shield,      title: 'Vestiaires',    desc: 'Casiers sécurisés gratuits',       color: GREEN  },
              { icon: Utensils,    title: 'Restauration',  desc: 'Snack et aire de pique-nique',      color: ORANGE },
              { icon: ShoppingBag, title: 'Boutique',      desc: 'Souvenirs et équipements',           color: GREEN  },
              { icon: Droplets,    title: 'Sanitaires',    desc: 'WC et douches',                     color: ORANGE },
              { icon: Trees,       title: 'Zone ombragée', desc: 'Espaces de détente',                color: GREEN  },
              { icon: Wifi,        title: 'WiFi gratuit',  desc: 'Connexion illimitée',               color: ORANGE },
            ].map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 hover:border-white/40 transition-all">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${item.color}30` }}>
                  <item.icon className="size-8" style={{ color: item.color }} />
                </div>
                <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    

      {/* ════ ACTUALITÉS + CONTACT ════ */}
      <section id="contact" className="relative bg-gradient-to-b from-gray-50 to-white">
        <SubtlePatternBg />
        <ParkActualitesSection parkId={parkId!} parkImage={park.image} />
        <div className="relative w-full overflow-hidden leading-none -mb-1">
          <svg viewBox="0 0 1440 60" className="w-full h-10" preserveAspectRatio="none">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z" fill="#f8fafc" />
          </svg>
        </div>
        <ParkContactSection park={park} />
      </section>


      {/* ════ CTA RÉSERVATION FINALE ════ */}
      <section id="reserver" className="relative py-24 overflow-hidden" style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #2d6100 50%, ${GREEN} 100%)` }}>
        <div className="absolute inset-0 opacity-20">
          <motion.div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" animate={{ scale: [1,1.2,1], x: [0,50,0], y: [0,-30,0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: ORANGE }} animate={{ scale: [1,1.3,1], x: [0,-60,0], y: [0,40,0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200 }} className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 text-sm font-medium border border-white/30">
              <Target className="size-4" />
              <span className="text-white">Prêt à vous lancer ?</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Réservez votre aventure</h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">Choisissez votre activité et réservez votre créneau en quelques clics</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/booking" className="inline-flex items-center gap-3 px-8 py-4 rounded-full hover:shadow-2xl transition-all font-bold text-white" style={{ backgroundColor: ORANGE }}>
                  <Calendar className="size-5" /> Réserver maintenant <ArrowRight className="size-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-full hover:bg-white/20 transition-all font-bold">
                  Demander un devis <ArrowRight className="size-5" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════ BLOG ════ */}
      <ParkBlogSection />

      {/* ════ NEWSLETTER BREVO ════ */}
      <ParkBrevoForm />

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

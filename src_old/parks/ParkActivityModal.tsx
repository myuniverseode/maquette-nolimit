// components/park/ParkActivityModal.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Calendar, Clock, CheckCircle, ArrowRight, Info, ChevronDown, Ticket, PartyPopper } from 'lucide-react';
import { activities } from '../data/activities';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

type Activity = typeof activities[0];

const difficultyMap: Record<string, { pct: number; color: string; label: string }> = {
  'Facile':         { pct: 25, color: '#22c55e', label: 'Accessible à tous'          },
  'Intermédiaire':  { pct: 55, color: ORANGE,    label: 'Quelques notions requises'  },
  'Difficile':      { pct: 80, color: '#ef4444', label: 'Expérience recommandée'     },
  'Expert':         { pct: 100,color: '#7c3aed', label: 'Profils confirmés'          },
};

const mockReviews = [
  { name: 'Sophie M.', rating: 5, date: 'Déc 2024', comment: 'Expérience incroyable, moniteurs au top et matériel de qualité. On revient !',     avatar: '🧗' },
  { name: 'Thomas R.', rating: 5, date: 'Nov 2024', comment: "Parfait pour notre séminaire d'entreprise. Toute l'équipe a adoré.",               avatar: '👨‍💼' },
  { name: 'Léa D.',    rating: 4, date: 'Oct 2024', comment: 'Super journée, accessible même pour les débutants. Je recommande vivement.',        avatar: '🌟' },
];

const faqItems = [
  {
    question: "Faut-il être en bonne condition physique ?",
    answer: "Notre activité est accessible à tous les niveaux. Les parcours sont adaptables selon votre forme du moment. Nos moniteurs vous guideront pour choisir le parcours le plus adapté."
  },
  {
    question: "Est-ce que le matériel est fourni ?",
    answer: "Oui, tout l'équipement de sécurité est fourni : casque, harnais, longes, etc. Nous vous fournissons également des gants. Seule une tenue sportive et des chaussures fermées sont nécessaires."
  },
  {
    question: "Peut-on venir avec des enfants ?",
    answer: "Absolument ! L'activité est accessible dès 8 ans. Des parcours spécialement conçus pour les enfants sont disponibles, avec un encadrement renforcé."
  },
  {
    question: "Que se passe-t-il en cas de mauvais temps ?",
    answer: "L'activité peut être suspendue par sécurité en cas d'orage ou de vents violents. Vous serez remboursé intégralement ou pourrez reporter votre session."
  }
];

interface Props {
  activity: Activity;
  park: any;
  allActivities: Activity[];
  onClose: () => void;
  onNavigate: (a: Activity) => void;
}

export function ParkActivityModal({ activity, park, allActivities, onClose, onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'infos' | 'inclus' | 'avis' | 'faq'>('infos');
  const [imgIndex,  setImgIndex]  = useState(0);
  const [liked,     setLiked]     = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const diff   = difficultyMap[activity.difficulty] ?? { pct: 50, color: GREEN, label: '' };
  const others = allActivities.filter(a => a.id !== activity.id).slice(0, 3);
  const imgs   = [activity.image, activity.image, activity.image];

  const tabs = [
    { key: 'infos',  label: '📋 Infos'                    },
    { key: 'inclus', label: '✅ Inclus'                   },
    { key: 'avis',   label: `⭐ Avis (${mockReviews.length})` },
    { key: 'faq',    label: '❓ FAQ'                      },
  ] as const;

  const handleClose = (e?: React.MouseEvent) => { e?.stopPropagation(); onClose(); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center"
      onClick={handleClose}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="relative w-full lg:max-w-5xl lg:mx-4 bg-white rounded-t-[2rem] lg:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">

          {/* ── Colonne image ── */}
          {/* Sur mobile : pas d'images (hidden) */}
          <div className="hidden lg:block lg:w-[42%] lg:flex-shrink-0 flex-col">
            <div className="relative h-56 sm:h-72 lg:h-full overflow-hidden bg-gray-900">
              {imgs.map((src, i) => (
                <motion.img key={i} src={src} alt={`${activity.name} ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: i === imgIndex ? 1 : 0 }} transition={{ duration: 0.5 }} />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30" />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-white/40 lg:hidden" />

              {/* Miniatures */}
              <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                {imgs.map((src, i) => (
                  <motion.button key={i} onClick={(e) => { e.stopPropagation(); setImgIndex(i); }} whileHover={{ scale: 1.1 }} className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${i === imgIndex ? 'border-white scale-105' : 'border-white/30 opacity-60'}`}>
                    <img src={src} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>

              {/* Badges desktop */}
              <div className="absolute bottom-4 right-4 hidden lg:flex flex-col items-end gap-2 z-20">
                <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-bold border border-white/30">{activity.difficulty}</div>
                <div className="px-3 py-1.5 rounded-full text-xs text-white font-bold border border-white/30 backdrop-blur-sm" style={{ backgroundColor: `${GREEN}66` }}>{activity.minAge}+ ans</div>
              </div>
            </div>

            {/* Barre difficulté desktop */}
            <div className="hidden lg:block p-5 bg-gray-950 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Difficulté</span>
                  <span className="text-xs font-black" style={{ color: diff.color }}>{activity.difficulty}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${diff.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }} className="h-full rounded-full" style={{ backgroundColor: diff.color }} />
                </div>
                <div className="text-white/40 text-[10px] mt-1">{diff.label}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: '👥', val: `${activity.minAge}+`, label: 'Ans min' },
                  { icon: '⏱️', val: (activity as any).duration ?? '2h', label: 'Durée' },
                  { icon: '📍', val: 'Ext.', label: 'Type' },
                ].map(({ icon, val, label }) => (
                  <div key={label} className="text-center py-2.5 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="text-xl mb-1">{icon}</div>
                    <div className="text-white font-black text-sm">{val}</div>
                    <div className="text-white/40 text-[10px]">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Colonne contenu ── */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header mobile sans images */}
            <div className="lg:hidden pt-6 px-6 pb-0">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black leading-tight" style={{ color: DARK }}>{activity.name}</h2>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleClose} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg hover:bg-gray-200 transition-colors">✕</motion.button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`size-4 ${s <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-900">4.8</span>
                    <span className="text-sm text-gray-400">({mockReviews.length} avis)</span>
                  </div>
                </div>
              </div>

              {/* Badges mobiles */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700 flex items-center gap-1">
                  <span className="text-base">🎯</span>{activity.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1" style={{ backgroundColor: GREEN }}>
                  <span className="text-base">👥</span>{activity.minAge}+ ans
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Clock className="size-3" />{(activity as any).duration ?? '2h'}
                </span>
              </div>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block p-6 pb-0 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-black leading-tight" style={{ color: DARK }}>{activity.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`size-4 ${s <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-900">4.8</span>
                    <span className="text-sm text-gray-400">({mockReviews.length} avis)</span>
                  </div>
                </div>
              </div>

              {/* Like button desktop */}
              <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} onClick={(e) => { e.stopPropagation(); setLiked(l => !l); }} className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center z-20 text-xl hover:bg-black/70 transition-colors" animate={{ scale: liked ? [1, 1.4, 1] : 1 }}>
                {liked ? '❤️' : '🤍'}
              </motion.button>
            </div>

            {/* Onglets */}
            <div className="px-6 pt-2 border-b border-gray-100 overflow-x-auto scrollbar-hide">
              <div className="flex gap-1 min-w-max">
                {tabs.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`relative px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all ${activeTab === tab.key ? 'text-gray-900 bg-white border-t-2 border-x-2 border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}>
                    {tab.label}
                    {activeTab === tab.key && (
                      <motion.div layoutId="modal-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: ORANGE }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu des onglets */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'infos' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <h3 className="font-black text-gray-900 mb-2 text-sm uppercase tracking-wider">Description</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{(activity as any).description ?? `${activity.name} est une activité outdoor exceptionnelle proposée au cœur de notre parc.`}</p>
                  </div>
                  {/* Difficulté mobile */}
                  <div className="lg:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Difficulté</span>
                      <span className="text-xs font-black" style={{ color: diff.color }}>{activity.difficulty}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${diff.pct}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: diff.color }} />
                    </div>
                    <p className="text-gray-400 text-[11px]">{diff.label}</p>
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wider">Points forts</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {((activity as any).highlights ?? ['Encadrement professionnel','Matériel fourni et vérifié','Adapté aux débutants','Accessible dès 8 ans','En pleine nature','Photo souvenir incluse']).map((h: string, i: number) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all group">
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${GREEN}15` }}>
                            <CheckCircle className="size-4" style={{ color: GREEN }} />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{h}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-gray-100">
                    <div className="px-4 py-3 flex items-center gap-2" style={{ background: `linear-gradient(to right, ${GREEN}15, ${GREEN}05)` }}>
                      <Info className="size-4" style={{ color: GREEN }} />
                      <span className="font-black text-sm" style={{ color: GREEN }}>À savoir</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {[
                        { icon: '👕', label: 'Tenue',        val: 'Sportive, chaussures fermées'    },
                        { icon: '🌦️', label: 'Météo',        val: 'Suspendable par mauvais temps'   },
                        { icon: '📅', label: 'Réservation',  val: 'Recommandée, disponible 7j/7'    },
                        { icon: '🔞', label: 'Âge minimum',  val: `${activity.minAge} ans`           },
                      ].map(({ icon, label, val }) => (
                        <div key={label} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                          <span className="text-xl w-7 text-center flex-shrink-0">{icon}</span>
                          <span className="text-sm text-gray-400 font-medium w-28 flex-shrink-0">{label}</span>
                          <span className="text-sm text-gray-800 font-bold">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Activités similaires */}
                  {others.length > 0 && (
                    <div>
                      <h3 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wider">Vous aimerez aussi</h3>
                      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                        {others.map(other => (
                          <motion.button key={other.id} whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => { onNavigate(other); setActiveTab('infos'); setImgIndex(0); }} className="flex-shrink-0 w-36 rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-green-300 transition-all text-left group">
                            <div className="relative h-20 overflow-hidden">
                              <img src={other.image} alt={other.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <span className="absolute bottom-1.5 left-2 text-white text-[10px] font-black leading-tight">{other.name}</span>
                            </div>
                            <div className="px-3 py-2 bg-white">
                              <span className="text-[10px] text-gray-400 font-medium">{other.difficulty}</span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'inclus' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div>
                    <h3 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wider flex items-center gap-2"><span className="text-green-500">✓</span> Ce qui est inclus</h3>
                    <div className="space-y-2">
                      {[
                        { icon: '🪖', item: 'Équipement de sécurité complet',  detail: 'Casque, harnais, gants'          },
                        { icon: '👨‍🏫', item: 'Encadrement professionnel',       detail: "Moniteur diplômé d'État"         },
                        { icon: '📸', item: 'Photo souvenir',                   detail: 'En format numérique'             },
                        { icon: '🛡️', item: "Assurance activité",               detail: 'Couverture totale pendant la session' },
                        { icon: '🚿', item: 'Accès vestiaires',                 detail: 'Douches et casiers sécurisés'    },
                        { icon: '💧', item: 'Eau et ravitaillement',            detail: "Fontaines et point d'eau"        },
                      ].map(({ icon, item, detail }, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                          <span className="text-2xl w-9 text-center flex-shrink-0">{icon}</span>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">{item}</div>
                            <div className="text-gray-400 text-xs">{detail}</div>
                          </div>
                          <CheckCircle className="size-5 ml-auto flex-shrink-0" style={{ color: GREEN }} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wider flex items-center gap-2"><span className="text-red-400">✕</span> Non inclus</h3>
                    <div className="space-y-2">
                      {[
                        { icon: '🥤', item: 'Restauration', detail: 'Snack bar disponible sur place' },
                        { icon: '🚗', item: 'Transport',    detail: 'Parking gratuit disponible'     },
                      ].map(({ icon, item, detail }, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-red-50/50 border border-red-100/60">
                          <span className="text-2xl w-9 text-center flex-shrink-0 opacity-60">{icon}</span>
                          <div>
                            <div className="font-bold text-gray-500 text-sm">{item}</div>
                            <div className="text-gray-400 text-xs">{detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'avis' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg, #fefce8, #fef3c7)', border: '2px solid #fde68a' }}>
                    <div className="text-6xl font-black text-gray-900 leading-none mb-1">4.8</div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`size-6 ${s <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-200 text-yellow-200'}`} />)}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Basé sur {mockReviews.length} avis vérifiés</div>
                    <div className="mt-4 space-y-1.5 text-left">
                      {[{stars:5,pct:75},{stars:4,pct:18},{stars:3,pct:5},{stars:2,pct:1},{stars:1,pct:1}].map(({stars,pct}) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-3">{stars}</span>
                          <Star className="size-3 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 h-1.5 bg-yellow-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: 0.1 * (5 - stars) }} className="h-full rounded-full bg-yellow-400" />
                          </div>
                          <span className="text-xs text-gray-400 w-7 text-right">{pct}%</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  {mockReviews.map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-white">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 bg-gray-50">{r.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-black text-gray-900 text-sm">{r.name}</span>
                            <span className="text-gray-400 text-xs flex-shrink-0">{r.date}</span>
                          </div>
                          <div className="flex gap-0.5 mt-1">
                            {[1,2,3,4,5].map(s => <Star key={s} className={`size-3.5 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed italic">"{r.comment}"</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'faq' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <h3 className="font-black text-gray-900 mb-4 text-sm uppercase tracking-wider">Questions fréquentes</h3>
                  {faqItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-100 rounded-2xl overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-bold text-gray-900 text-sm flex-1">{item.question}</span>
                        <ChevronDown
                          className={`size-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                            openFaqIndex === index ? 'rotate-180' : ''
                          }`}
                          style={{ color: GREEN }}
                        />
                      </button>
                      <AnimatePresence>
                        {openFaqIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer avec 2 CTA - Sans prix */}
            <div className="p-4 lg:p-5 border-t border-gray-100 bg-white/95 backdrop-blur-sm grid grid-cols-2 gap-3">
              <Link
                to="/booking"
                state={{ parkId: park.id, activityId: activity.id }}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-white text-sm shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${ORANGE} 0%, #ff9a3c 100%)`, boxShadow: `0 4px 16px ${ORANGE}40` }}
                onClick={handleClose}
              >
                <Ticket className="size-4" />
                Billetterie
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/evenements"
                state={{ parkId: park.id, activityId: activity.id }}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm border-2 transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ borderColor: GREEN, color: GREEN }}
                onClick={handleClose}
              >
                <PartyPopper className="size-4" />
                Événement
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
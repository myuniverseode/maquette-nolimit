// components/park/ParkContactSection.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteConfig } from "../hooks/useSiteConfig";
import { Phone, Mail, Send, MessageCircle, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { SubtlePatternBg } from './ParkHelpers';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

function ContactSubjectPicker() {
  const [selected, setSelected] = useState<string | null>(null);
  const subjects = [
    { id: 'resa',   label: '📅 Réservation'    },
    { id: 'info',   label: '❓ Infos activités' },
    { id: 'groupe', label: '👥 Devis groupe'    },
    { id: 'event',  label: '🎉 Événement privé' },
    { id: 'recla',  label: '⚠️ Réclamation'     },
    { id: 'autre',  label: '💬 Autre'           },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {subjects.map(s => (
        <motion.button
          key={s.id}
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setSelected(s.id === selected ? null : s.id)}
          className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all"
          style={selected === s.id
            ? { backgroundColor: GREEN, borderColor: GREEN, color: 'white' }
            : { backgroundColor: '#f9fafb', borderColor: '#f3f4f6', color: '#6b7280' }
          }
        >
          {s.label}
        </motion.button>
      ))}
    </div>
  );
}

const DEFAULT_SOCIAL_LINKS = [
  { icon: '📸', label: 'Instagram', color: '#e1306c', handle: '@nolimit_parc' },
  { icon: '👥', label: 'Facebook',  color: '#1877f2', handle: 'NoLimit Parc'  },
  { icon: '🎵', label: 'TikTok',    color: '#010101', handle: '@nolimit'       },
];

export function ParkContactSection({ park }: { park: any }) {
  const { config } = useSiteConfig();
  const contactSocialLinks = DEFAULT_SOCIAL_LINKS;
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const inputStyle = {
    base: 'w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:outline-none transition-all text-sm font-medium placeholder-gray-300',
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = GREEN;
      e.target.style.backgroundColor = 'white';
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = '#f3f4f6';
      e.target.style.backgroundColor = '#f9fafb';
    },
  };

  return (
    <div className="relative bg-slate-50 pt-16 pb-20">
      <SubtlePatternBg />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-medium border" style={{ backgroundColor: `${GREEN}10`, borderColor: `${GREEN}30`, color: GREEN }}>
            <MessageCircle className="size-4" /> Nous sommes là pour vous
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: DARK }}>
            Contactez-<span style={{ color: GREEN }}>nous</span>
          </h2>
          <p className="text-gray-500 text-lg">Notre équipe répond en moins de 2h · 7j/7</p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Colonne gauche ── */}
          <div className="lg:col-span-2 space-y-4">
            <motion.a
              href={`tel:${park.phone ?? '0123456789'}`}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="flex items-center gap-5 p-6 bg-white rounded-3xl shadow-sm border-2 group transition-all"
              style={{ borderColor: `${GREEN}40` }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
                <Phone className="size-7 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Téléphone</div>
                <div className="text-xl font-black" style={{ color: GREEN }}>{park.phone ?? '01 23 45 67 89'}</div>
                <div className="text-xs text-gray-400 mt-0.5">Lun – Dim · 9h–18h</div>
              </div>
              <ArrowRight className="size-5 text-gray-300 ml-auto group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <motion.a
              href={`mailto:${park.email ?? 'contact@nolimit.fr'}`}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="flex items-center gap-5 p-6 bg-white rounded-3xl shadow-sm border-2 group transition-all"
              style={{ borderColor: `${ORANGE}40` }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}>
                <Mail className="size-7 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Email</div>
                <div className="text-lg font-black" style={{ color: ORANGE }}>{park.email ?? 'contact@nolimit.fr'}</div>
                <div className="text-xs text-gray-400 mt-0.5">Réponse sous 24h garantie</div>
              </div>
              <ArrowRight className="size-5 text-gray-300 ml-auto group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-3xl p-6 text-white"
              style={{ background: `linear-gradient(135deg, ${ORANGE} 0%, #c2520a 100%)` }}
            >
              <motion.div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 5, repeat: Infinity }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="size-5" />
                  <span className="font-black text-base">Urgence jour J</span>
                </div>
                <div className="text-white/80 text-xs mb-3">En cas d'urgence le jour de votre visite</div>
                <a href="tel:0612345678" className="text-2xl font-black hover:underline">06 12 34 56 78</a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">Suivez-nous</div>
              <div className="flex gap-3">
                {contactSocialLinks.map(({ icon, label, handle }) => (
                  <motion.a key={label} href="#" whileHover={{ y: -3, scale: 1.05 }} className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl text-center border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                    <span className="text-xl">{icon}</span>
                    <span className="text-[10px] font-black text-gray-600">{label}</span>
                    <span className="text-[9px] text-gray-400 truncate w-full text-center px-1">{handle}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Formulaire ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lg:col-span-3 bg-white rounded-3xl shadow-lg overflow-hidden border-2"
            style={{ borderColor: `${GREEN}30` }}
          >
            <div className="px-8 py-6 flex items-center gap-4" style={{ background: `linear-gradient(135deg, ${GREEN}12, ${GREEN}06)` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
                <MessageCircle className="size-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black" style={{ color: DARK }}>Envoyez-nous un message</h3>
                <p className="text-gray-400 text-xs">Réponse sous 2h en moyenne · 7j/7</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-700">En ligne</span>
              </div>
            </div>

            <AnimatePresence>
              {formSubmitted && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mx-6 mt-6 p-4 rounded-2xl border-2 flex items-center gap-3" style={{ borderColor: GREEN, backgroundColor: `${GREEN}08` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: GREEN }}>
                    <CheckCircle className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="font-black" style={{ color: GREEN }}>Message envoyé ! 🎉</div>
                    <div className="text-xs text-gray-500 mt-0.5">Nous vous répondrons dans les 2 heures.</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Nom *</label>
                  <input type="text" required placeholder="Dupont" className={inputStyle.base} onFocus={inputStyle.onFocus} onBlur={inputStyle.onBlur} />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Prénom *</label>
                  <input type="text" required placeholder="Jean" className={inputStyle.base} onFocus={inputStyle.onFocus} onBlur={inputStyle.onBlur} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Email *</label>
                  <input type="email" required placeholder="jean@email.fr" className={inputStyle.base} onFocus={inputStyle.onFocus} onBlur={inputStyle.onBlur} />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Téléphone</label>
                  <input type="tel" placeholder="06 XX XX XX XX" className={inputStyle.base} onFocus={inputStyle.onFocus} onBlur={inputStyle.onBlur} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-3">Sujet *</label>
                <ContactSubjectPicker />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Message *</label>
                <textarea
                  required rows={4}
                  placeholder="Décrivez votre demande, on vous répond vite ! 🚀"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:outline-none transition-all resize-none text-sm font-medium placeholder-gray-300"
                  onFocus={inputStyle.onFocus as any}
                  onBlur={inputStyle.onBlur as any}
                />
              </div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" required className="mt-0.5 accent-green-600 shrink-0 w-4 h-4" />
                <span className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-600 transition-colors">
                  J'accepte que mes données soient utilisées pour traiter ma demande.{' '}
                  <a href="#" className="underline" style={{ color: GREEN }}>Politique de confidentialité</a>
                </span>
              </label>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: `0 16px 40px ${GREEN}40` }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 text-white rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all"
                style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #4a9d00 100%)`, boxShadow: `0 8px 28px ${GREEN}35` }}
              >
                <Send className="size-5" />
                Envoyer le message
                <ArrowRight className="size-5" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

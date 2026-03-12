// pages/AboutPartnersPage.tsx — Nos Partenaires
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const partners = [
  { name: 'ONF', full: 'Office National des Forêts', emoji: '🌲', type: 'Institutionnel', desc: 'Partenaire historique pour la gestion durable de nos espaces naturels.' },
  { name: 'UNAT', full: 'Union Nationale des Ass. de Tourisme', emoji: '🏕️', type: 'Associatif', desc: 'Label tourisme responsable et accès aux réseaux associatifs.' },
  { name: 'Région IDF', full: 'Île-de-France Mobilités', emoji: '🚉', type: 'Institutionnel', desc: 'Partenariat transports pour faciliter l\'accès sans voiture.' },
  { name: 'La Ligue', full: 'Ligue de l\'Enseignement', emoji: '🎓', type: 'Éducatif', desc: 'Programme sorties scolaires à tarif préférentiel dans tous nos parcs.' },
  { name: 'BpiFrance', full: 'Bpifrance Startup', emoji: '💡', type: 'Financier', desc: 'Accompagnement levée de fonds et développement technologique.' },
  { name: 'Decathlon', full: 'Decathlon Pro', emoji: '⛺', type: 'Commercial', desc: 'Fourniture équipements de sécurité certifiés à prix partenaire.' },
];

const rseEngagements = [
  { icon: '🌳', title: 'Zéro artificialisation nette', desc: 'Pour chaque arbre touché, 3 plantés en compensation' },
  { icon: '♻️', title: 'Matériaux biosourcés', desc: 'Bois local, cordages recyclés, quincaillerie inox longue durée' },
  { icon: '🚗', title: 'Mobilité douce', desc: 'Navette bus depuis les gares, parking vélos sécurisé' },
  { icon: '👥', title: 'Insertion professionnelle', desc: 'Partenariat ESAT et formations jeunes sans emploi' },
  { icon: '🌍', title: 'Bilan carbone annuel', desc: 'Mesuré et compensé via partenariat reforestation locale' },
  { icon: '🏫', title: 'Sensibilisation scolaire', desc: '5 000 élèves accueillis en sortie pédagogique / an' },
];

export function AboutPartnersPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: `linear-gradient(135deg, #0a2200 0%, ${GREEN} 100%)` }}>
        <motion.div className="absolute top-10 right-10 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: ORANGE, opacity: 0.16 }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 9, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 left-10 w-64 h-64 rounded-full blur-3xl bg-white/10" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 12, repeat: Infinity, delay: 3 }} />

        <div className="container mx-auto px-6 relative z-10">
          <Link to="/about" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-10 transition-colors">
            <ArrowLeft className="size-4" /> Retour à À propos
          </Link>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 text-white">
              🤝 Nos Partenaires
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-5">
              Ensemble,<br />
              <span style={{ color: ORANGE }}>on va plus loin.</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">
              On ne croit pas au succès solitaire. Nos partenaires institutionnels, associatifs et commerciaux nous aident à faire mieux, ensemble.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none">
            <path d="M0,20 C500,60 900,0 1440,40 L1440,60 L0,60 Z" className="fill-white" />
          </svg>
        </div>
      </section>

      {/* ── PARTENAIRES ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: DARK }}>
              Ils nous <span style={{ color: GREEN }}>font confiance</span>
            </h2>
            <p className="text-gray-500">6 partenaires stratégiques, des valeurs communes.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {partners.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white rounded-3xl p-7 border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all"
              >
                {/* Logo placeholder */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 border-gray-100 bg-gray-50">
                    {p.emoji}
                  </div>
                  <div>
                    <div className="font-black text-lg" style={{ color: DARK }}>{p.name}</div>
                    <div className="px-2 py-0.5 rounded-md text-[10px] font-black" style={{ backgroundColor: `${GREEN}15`, color: GREEN }}>{p.type}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 font-medium mb-2">{p.full}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RSE ── */}
      <section className="py-20" style={{ backgroundColor: '#f8faf8' }}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: DARK }}>
              Nos engagements <span style={{ color: GREEN }}>RSE</span>
            </h2>
            <p className="text-gray-500">Pas juste des mots. Des mesures concrètes et mesurables.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {rseEngagements.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="flex items-start gap-4 p-6 bg-white rounded-3xl border-2 border-gray-100 hover:border-green-200 hover:shadow-md transition-all"
              >
                <span className="text-3xl flex-shrink-0">{e.icon}</span>
                <div>
                  <h4 className="font-black text-base mb-1" style={{ color: DARK }}>{e.title}</h4>
                  <p className="text-gray-500 text-sm">{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVENIR PARTENAIRE ── */}
      <section className="py-20" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-4xl font-black text-white mb-3">
              Devenir <span style={{ color: ORANGE }}>partenaire.</span>
            </h2>
            <p className="text-white/55">On est ouverts aux partenariats commerciaux, institutionnels et associatifs.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8"
          >
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="text-6xl mb-4">🤝</div>
                <div className="text-2xl font-black mb-2" style={{ color: DARK }}>Demande reçue !</div>
                <div className="text-gray-500">Notre responsable partenariats vous contactera sous 48h.</div>
              </motion.div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Nom / Prénom *</label>
                    <input type="text" required placeholder="Jean Dupont" className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Organisation *</label>
                    <input type="text" required placeholder="Nom de votre structure" className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all text-sm font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Email *</label>
                  <input type="email" required placeholder="contact@organisation.fr" className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Type de partenariat *</label>
                  <div className="flex flex-wrap gap-2">
                    {['Commercial', 'Institutionnel', 'Associatif', 'Mécénat', 'Autre'].map(type => (
                      <label key={type} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-100 cursor-pointer hover:border-green-300 transition-all text-sm font-bold text-gray-600">
                        <input type="radio" name="type_partenariat" value={type} className="accent-green-600" />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Votre projet *</label>
                  <textarea required rows={4} placeholder="Décrivez votre projet de partenariat, vos objectifs, ce que vous apportez..." className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all resize-none text-sm font-medium" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: `0 12px 32px ${GREEN}40` }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}
                >
                  <Send className="size-5" /> Envoyer ma demande
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── NAV ── */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 flex items-center justify-between max-w-5xl">
          <Link to="/about/actualites" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 font-bold text-sm transition-colors">
            <ArrowLeft className="size-4" /> Actualités
          </Link>
          <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
            Retour à l'accueil <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

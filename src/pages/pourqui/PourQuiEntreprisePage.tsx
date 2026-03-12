// pages/PourQuiEntreprisePage.tsx — Pour les entreprises
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Calendar, Shield, Users, TrendingUp, Zap, ChevronDown, CheckCircle, Send, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const formats = [
  {
    emoji: '🤝',
    title: 'Team Building',
    desc: 'Activités collaboratives conçues pour renforcer la cohésion, la communication et la confiance entre collègues.',
    duration: '½ journée ou journée complète',
    participants: '10 à 200 personnes',
    color: GREEN,
    bg: '#f0fdf4',
    includes: ['Animation facilitée', 'Défis en équipe', 'Compte-rendu cohésion', 'Photos & vidéos'],
  },
  {
    emoji: '🎯',
    title: 'Séminaire Outdoor',
    desc: 'Combinez objectifs stratégiques et ressourcement en pleine nature. Salles disponibles + espaces outdoor.',
    duration: '1 à 3 jours',
    participants: '5 à 80 personnes',
    color: ORANGE,
    bg: '#fef3ea',
    includes: ['Salle de réunion équipée', 'Pauses actives', 'Restauration incluse', 'Hébergement partenaire'],
  },
  {
    emoji: '🏆',
    title: 'Challenge Inter-équipes',
    desc: 'Compétition saine et conviviale entre départements ou agences. Trophées, classement, souvenirs garantis.',
    duration: '½ journée',
    participants: '20 à 300 personnes',
    color: '#6366f1',
    bg: '#f0f0ff',
    includes: ['Briefing & règles', 'Arbitres dédiés', 'Podium & trophées', 'Cocktail de clôture'],
  },
  {
    emoji: '🎉',
    title: 'Événement Corporate',
    desc: 'Journée portes ouvertes, incentive client, anniversaire d\'entreprise — on crée l\'événement sur mesure.',
    duration: 'Sur mesure',
    participants: 'Sans limite',
    color: '#ec4899',
    bg: '#fdf2f8',
    includes: ['Scénographie', 'Catering & bar', 'Animation DJ option', 'Coordination complète'],
  },
];

const advantages = [
  { icon: '⚡', title: 'Réponse en 24h', desc: 'Devis personnalisé envoyé sous 24h ouvrées.' },
  { icon: '🎨', title: '100% sur mesure', desc: 'Programme adapté à vos objectifs, votre budget, votre culture d\'entreprise.' },
  { icon: '🌿', title: 'Cadre naturel unique', desc: '5 parcs forestiers, chacun avec sa personnalité et ses atouts.' },
  { icon: '👨‍🏫', title: 'Facilitateurs experts', desc: 'Nos animateurs maîtrisent la dynamique de groupe et les enjeux corporate.' },
  { icon: '📸', title: 'Livrables inclus', desc: 'Photos HD, résumé cohésion, accès galerie en ligne pendant 6 mois.' },
  { icon: '💳', title: 'Facturation pro', desc: 'Facture avec TVA, paiement 30 jours fin de mois, devis signé électronique.' },
];

const clientLogos = [
  { name: 'TechCorp', emoji: '💻' },
  { name: 'FinanceGroup', emoji: '🏦' },
  { name: 'RetailCo', emoji: '🛍️' },
  { name: 'MediaGroup', emoji: '📺' },
  { name: 'ConsultCo', emoji: '📊' },
  { name: 'HealthCare+', emoji: '🏥' },
];

const testimonials = [
  { text: "L'organisation était parfaite du début à la fin. Nos 80 collaborateurs ont vécu une journée d'exception. Le facilitateur a su créer une vraie dynamique de groupe.", author: "Directrice RH, groupe de 400 personnes", stars: 5 },
  { text: "On cherchait quelque chose qui sorte des afterworks habituels. Le challenge inter-équipes a dépassé toutes nos attentes. On revient l'année prochaine.", author: "DG, startup 50 personnes", stars: 5 },
  { text: "Devis reçu en 3h, programme finalisé en 2 jours, exécution impeccable. C'est rare d'avoir ce niveau de réactivité et de qualité.", author: "Event Manager, grande entreprise", stars: 5 },
];

export function PourQuiEntreprisePage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const [formSent, setFormSent] = useState(false);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO — ton premium, sombre ── */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <div
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse at 70% 30%, ${GREEN}50 0%, transparent 45%),
                radial-gradient(ellipse at 20% 70%, ${ORANGE}35 0%, transparent 40%),
                linear-gradient(160deg, #050d03 0%, #0a1f05 40%, #030a01 100%)
              `,
            }}
          />
          {/* Lignes de grille subtiles — feeling corporate tech */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
          {/* Points décoratifs */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/20"
              style={{ left: `${6 + i * 6.5}%`, top: `${10 + (i % 5) * 17}%` }}
              animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent z-10" />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-20 container mx-auto px-6 pb-20 md:pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 mb-8">
            <Link to="/" className="text-white/50 hover:text-white text-sm transition-colors">Accueil</Link>
            <span className="text-white/30">/</span>
            <span className="text-white/70 text-sm">Pour qui</span>
            <span className="text-white/30">/</span>
            <span className="text-white text-sm font-bold">Entreprise</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 backdrop-blur-sm text-white">
              <TrendingUp className="size-4" style={{ color: GREEN }} />
              Pour les entreprises
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6">
              La nature<br />
              <span style={{ color: GREEN }}>transforme</span><br />
              vos équipes.
            </h1>

            <p className="text-xl text-white/70 leading-relaxed max-w-2xl mb-10">
              Team building, séminaires, incentives — des formats outdoor sur mesure qui créent de la cohésion durable. Plus efficaces qu'un repas d'équipe, plus mémorables qu'une salle de conf.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#devis"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-white"
                style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)`, boxShadow: `0 8px 28px ${GREEN}50` }}
              >
                Demander un devis <ArrowRight className="size-5" />
              </a>
              <a
                href="tel:0123456789"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-white border-2 border-white/25 hover:bg-white/10 transition-all"
              >
                <Phone className="size-4" /> Appeler directement
              </a>
            </div>

            {/* KPI inline */}
            <div className="flex flex-wrap gap-6 mt-10">
              {[['500+', 'événements réalisés'], ['98%', 'de satisfaction'], ['24h', 'délai de réponse'], ['10–300', 'participants']].map(([val, label]) => (
                <div key={label}>
                  <div className="text-2xl font-black text-white">{val}</div>
                  <div className="text-white/45 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <span className="text-white/40 text-xs tracking-widest uppercase">Nos formats</span>
          <ChevronDown className="size-5 text-white/40" />
        </motion.div>
      </section>

      {/* ── FORMATS ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: DARK }}>
              Nos <span style={{ color: GREEN }}>formats.</span>
            </h2>
            <p className="text-gray-500">4 expériences conçues pour vos objectifs business.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-6xl mx-auto">
            {formats.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl overflow-hidden border-2 hover:shadow-2xl transition-all"
                style={{ borderColor: `${f.color}30` }}
              >
                {/* Header */}
                <div className="px-8 py-7 flex items-start gap-5" style={{ backgroundColor: f.bg }}>
                  <div className="text-5xl">{f.emoji}</div>
                  <div>
                    <h3 className="font-black text-2xl mb-1" style={{ color: DARK }}>{f.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80" style={{ color: f.color }}>⏱ {f.duration}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80" style={{ color: f.color }}>👥 {f.participants}</span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed mb-5">{f.desc}</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {f.includes.map((item, ii) => (
                      <div key={ii} className="flex items-center gap-2">
                        <CheckCircle className="size-3.5 shrink-0" style={{ color: f.color }} />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href="#devis"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm text-white transition-all hover:shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${f.color}, ${f.color}cc)` }}
                  >
                    Demander un devis <ArrowRight className="size-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVANTAGES ── */}
      <section className="py-20" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-3">
              Pourquoi choisir <span style={{ color: GREEN }}>NoLimit ?</span>
            </h2>
            <p className="text-white/50">Ce que nos clients corporate apprécient le plus.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {advantages.map((adv, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-6 rounded-3xl border border-white/10 hover:border-white/25 transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="text-4xl mb-4">{adv.icon}</div>
                <h4 className="font-black text-white text-base mb-2">{adv.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{adv.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS ── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Ils nous ont fait confiance</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-5 max-w-4xl mx-auto">
            {clientLogos.map((client, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-default"
              >
                <span className="text-2xl">{client.emoji}</span>
                <span className="font-black text-gray-400 text-sm">{client.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-20" style={{ backgroundColor: '#f8faf8' }}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-black mb-2" style={{ color: DARK }}>Ce qu'ils <span style={{ color: GREEN }}>disent.</span></h2>
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
                className="bg-white rounded-3xl p-7 shadow-sm border-2 border-gray-100 hover:border-green-200 hover:shadow-lg transition-all"
              >
                <div className="flex gap-1 mb-4">{[...Array(t.stars)].map((_, s) => <Star key={s} className="size-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="font-black text-sm text-gray-500">{t.author}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULAIRE DEVIS ── */}
      <section id="devis" className="py-20" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-3">
              Obtenez votre <span style={{ color: GREEN }}>devis.</span>
            </h2>
            <p className="text-white/50">Réponse garantie sous 24h ouvrées. Sans engagement.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="px-8 py-6 flex items-center gap-4" style={{ background: `linear-gradient(135deg, ${GREEN}15, ${GREEN}06)` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
                <Zap className="size-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-xl" style={{ color: DARK }}>Demande de devis entreprise</h3>
                <p className="text-gray-400 text-xs">Réponse sous 24h · Devis gratuit · Sans engagement</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-700">Commercial disponible</span>
              </div>
            </div>

            {formSent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-12 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <div className="text-2xl font-black mb-2" style={{ color: DARK }}>Demande reçue !</div>
                <div className="text-gray-500">Notre équipe commerciale vous contacte sous 24h ouvrées.</div>
              </motion.div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setFormSent(true); }} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Infos contact */}
                {[
                  { label: 'Prénom & Nom *', placeholder: 'Jean Dupont', type: 'text' },
                  { label: 'Entreprise *', placeholder: 'Nom de votre société', type: 'text' },
                  { label: 'Email professionnel *', placeholder: 'jean@entreprise.fr', type: 'email' },
                  { label: 'Téléphone *', placeholder: '06 XX XX XX XX', type: 'tel' },
                ].map(({ label, placeholder, type }) => (
                  <div key={label}>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">{label}</label>
                    <input
                      type={type} required
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all text-sm font-medium"
                    />
                  </div>
                ))}

                {/* Format */}
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Format souhaité *</label>
                  <select className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all text-sm font-medium text-gray-700">
                    <option>Team Building</option>
                    <option>Séminaire Outdoor</option>
                    <option>Challenge Inter-équipes</option>
                    <option>Événement Corporate</option>
                    <option>Autre / Sur mesure</option>
                  </select>
                </div>

                {/* Participants */}
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Nombre de participants *</label>
                  <select className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all text-sm font-medium text-gray-700">
                    <option>10–30 personnes</option>
                    <option>30–60 personnes</option>
                    <option>60–100 personnes</option>
                    <option>100–200 personnes</option>
                    <option>200+ personnes</option>
                  </select>
                </div>

                {/* Date souhaitée */}
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Date souhaitée</label>
                  <input type="date" className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all text-sm font-medium text-gray-700" />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Budget indicatif</label>
                  <select className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all text-sm font-medium text-gray-700">
                    <option>Moins de 2 000€</option>
                    <option>2 000 – 5 000€</option>
                    <option>5 000 – 10 000€</option>
                    <option>10 000€ +</option>
                    <option>À définir</option>
                  </select>
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Vos objectifs & contexte</label>
                  <textarea rows={4} placeholder="Décrivez votre projet, vos objectifs RH ou business, les contraintes particulières…" className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all resize-none text-sm font-medium" />
                </div>

                {/* Submit */}
                <div className="md:col-span-2">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: `0 16px 40px ${GREEN}40` }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-3"
                    style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)`, boxShadow: `0 8px 28px ${GREEN}35` }}
                  >
                    <Send className="size-5" />
                    Envoyer ma demande de devis
                    <ArrowRight className="size-5" />
                  </motion.button>
                  <p className="text-center text-gray-400 text-xs mt-3">Réponse sous 24h · Pas de spam · Devis gratuit</p>
                </div>
              </form>
            )}
          </motion.div>

          {/* Contact direct */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="tel:0123456789" className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/15 transition-all">
              <Phone className="size-4" style={{ color: GREEN }} />
              01 23 45 67 89 — Commercial Direct
            </a>
            <a href="mailto:entreprise@nolimit.fr" className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/15 transition-all">
              <Mail className="size-4" style={{ color: ORANGE }} />
              entreprise@nolimit.fr
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

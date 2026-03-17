// pages/AboutJobsPage.tsx — Nos Emplois
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Send, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const perks = [
  { icon: '🌲', title: 'Bureau en forêt', desc: 'Ton poste de travail, c\'est la nature. Chaque jour.' },
  { icon: '🎯', title: 'Formation complète', desc: 'On te forme de A à Z, même si tu pars de zéro.' },
  { icon: '🚀', title: 'Évolution rapide', desc: 'Moniteur → Responsable de parc en 2 saisons possible.' },
  { icon: '🤝', title: 'Ambiance famille', desc: 'Une team soudée, des soirées, des aventures partagées.' },
  { icon: '💰', title: 'Salaire juste', desc: 'Grille salariale transparente + primes sur objectifs.' },
  { icon: '🌍', title: 'Mobilité réseau', desc: `Évolue dans l'un de nos parcs partout en France.` },
];

const openPositions = [
  {
    title: 'Moniteur Accrobranche',
    location: 'Chevry (91)',
    type: 'Saisonnier · Avr–Sep',
    level: 'Débutant accepté',
    urgent: true,
    color: GREEN,
    desc: 'Encadrement des visiteurs sur les parcours, briefing sécurité, gestion des situations d\'urgence.',
  },
  {
    title: 'Responsable de Parc',
    location: 'Nemours (77)',
    type: 'CDI · Temps plein',
    level: '2 ans exp. requis',
    urgent: false,
    color: ORANGE,
    desc: 'Gestion opérationnelle complète d\'un parc : équipe, sécurité, qualité, relation client.',
  },
  {
    title: 'Agent d\'Accueil',
    location: 'Montargis (45)',
    type: 'CDD 6 mois',
    level: 'Débutant accepté',
    urgent: true,
    color: GREEN,
    desc: 'Accueil visiteurs, gestion des réservations, boutique, et bonne humeur garantie.',
  },
  {
    title: 'Commercial B2B',
    location: 'Paris / Remote',
    type: 'CDI · Temps plein',
    level: '3 ans exp. requis',
    urgent: false,
    color: '#8b5cf6',
    desc: 'Développement du portefeuille entreprises pour séminaires, team building et événements groupe.',
  },
  {
    title: 'Animateur Enfants',
    location: 'Le Coudray (28)',
    type: 'Saisonnier · Juil–Août',
    level: 'BAFA souhaité',
    urgent: true,
    color: ORANGE,
    desc: 'Animation ateliers enfants, gestion de groupes scolaires et colonies de vacances.',
  },
];

export function AboutJobsPage() {
  const [applied, setApplied] = useState(false);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 overflow-hidden" style={{ backgroundColor: DARK }}>
        <motion.div className="absolute top-10 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: ORANGE, opacity: 0.15 }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 right-10 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: GREEN, opacity: 0.2 }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Crect x='0' y='0' width='1' height='60'/%3E%3Crect x='0' y='0' width='60' height='1'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />

        <div className="container mx-auto px-6 relative z-10">
          <Link to="/about" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-10 transition-colors">
            <ArrowLeft className="size-4" /> Retour à À propos
          </Link>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 text-white">
              🧗 Nos Emplois
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-5">
              Ta passion,<br />
              <span style={{ color: ORANGE }}>ton métier.</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">
              On cherche des gens qui ne voient pas leur travail comme un travail. Des passionnés, des curieux, des aventuriers qui veulent transmettre quelque chose.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none">
            <path d="M0,20 C500,60 900,0 1440,40 L1440,60 L0,60 Z" className="fill-white" />
          </svg>
        </div>
      </section>

      {/* ── AVANTAGES ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: DARK }}>
              Pourquoi nous <span style={{ color: GREEN }}>rejoindre ?</span>
            </h2>
            <p className="text-gray-500">6 raisons concrètes, pas des promesses en l'air.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {perks.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-6 rounded-3xl border-2 border-gray-100 hover:border-green-200 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="font-black text-lg mb-2" style={{ color: DARK }}>{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFRES D'EMPLOI ── */}
      <section className="py-20" style={{ backgroundColor: '#f8faf8' }}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: DARK }}>
              Postes à <span style={{ color: ORANGE }}>pourvoir</span>
            </h2>
            <p className="text-gray-500">{openPositions.filter(p => p.urgent).length} postes urgents · candidatures ouvertes</p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-5">
            {openPositions.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 4 }}
                className="bg-white rounded-3xl p-7 border-2 hover:shadow-lg transition-all flex flex-col sm:flex-row sm:items-center gap-6"
                style={{ borderColor: `${job.color}25` }}
              >
                {/* Couleur latérale */}
                <div className="hidden sm:block w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: job.color }} />

                {/* Info principale */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-xl font-black" style={{ color: DARK }}>{job.title}</h3>
                    {job.urgent && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black text-white animate-pulse" style={{ backgroundColor: ORANGE }}>
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mb-3 leading-relaxed">{job.desc}</p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                      <MapPin className="size-3.5" /> {job.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                      <Clock className="size-3.5" /> {job.type}
                    </div>
                    <div className="px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{ backgroundColor: `${job.color}15`, color: job.color }}>
                      {job.level}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="shrink-0 px-6 py-3 rounded-2xl font-black text-sm text-white"
                  style={{ background: `linear-gradient(135deg, ${job.color}, ${job.color}cc)` }}
                >
                  Postuler →
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CANDIDATURE SPONTANÉE ── */}
      <section className="py-20" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-4xl font-black text-white mb-3">
              Pas votre poste ici ? <span style={{ color: ORANGE }}>Écrivez-nous.</span>
            </h2>
            <p className="text-white/55">On étudie toutes les candidatures spontanées sérieusement.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8"
          >
            {applied ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <div className="text-2xl font-black mb-2" style={{ color: DARK }}>Candidature reçue !</div>
                <div className="text-gray-500">On revient vers vous sous 5 jours ouvrés.</div>
              </motion.div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setApplied(true); }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Nom *</label>
                    <input type="text" required placeholder="Dupont" className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Prénom *</label>
                    <input type="text" required placeholder="Jean" className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all text-sm font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Email *</label>
                  <input type="email" required placeholder="jean@email.fr" className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Poste souhaité</label>
                  <input type="text" placeholder="Moniteur, accueil, commercial..." className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Motivation *</label>
                  <textarea required rows={4} placeholder="Parlez-nous de vous et de votre passion pour l'aventure..." className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none transition-all resize-none text-sm font-medium" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: `0 12px 32px ${GREEN}40` }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}
                >
                  <Send className="size-5" /> Envoyer ma candidature
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── NAV ── */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 flex items-center justify-between max-w-5xl">
          <Link to="/about/parcs" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 font-bold text-sm transition-colors">
            <ArrowLeft className="size-4" /> Nos Parcs
          </Link>
          <Link to="/about/actualites" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
            Actualités <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// pages/AboutPartnersPage.tsx — Partenaires + sections référencement/médias (backlinks)
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Send, ExternalLink, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAboutPartners } from '../hooks/useAboutData';
import { AboutSidebar } from '../components/AboutSidebar';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';

const TYPE_EMOJI: Record<string, string> = { 'Institutionnel': '🏛️', 'Associatif': '🤝', 'Éducatif': '🎓', 'Financier': '💡', 'Commercial': '🛒' };

const DEFAULT_PARTNERS = [
  { name: 'ONF', full: 'Office National des Forêts', emoji: '🌲', type: 'Institutionnel', desc: 'Partenaire historique pour la gestion durable.' },
  { name: 'UNAT', full: 'Union Nat. des Ass. de Tourisme', emoji: '🏕️', type: 'Associatif', desc: 'Label tourisme responsable.' },
  { name: 'La Ligue', full: "Ligue de l'Enseignement", emoji: '🎓', type: 'Éducatif', desc: 'Sorties scolaires à tarif préférentiel.' },
];

// Plateformes où NoLimit est référencé (backlinks)
const DEFAULT_LISTINGS = [
  { name: 'TripAdvisor', emoji: '🦉', url: 'https://www.tripadvisor.fr', desc: 'Note 4.5/5 — Plus de 800 avis vérifiés', badge: '⭐ Recommandé' },
  { name: 'Le Petit Futé', emoji: '📗', url: 'https://www.petitfute.com', desc: "Sélectionné dans le guide des loisirs plein air d'Île-de-France", badge: '🏆 Sélection 2025' },
  { name: 'Google Maps', emoji: '📍', url: 'https://maps.google.com', desc: 'Note moyenne 4.7/5 sur nos 5 parcs', badge: '⭐ 4.7/5' },
  { name: 'France Voyage', emoji: '🇫🇷', url: 'https://www.france-voyage.com', desc: 'Référencé parmi les activités nature en Île-de-France', badge: '✅ Vérifié' },
  { name: 'Familin\'', emoji: '👨‍👩‍👧', url: 'https://www.familin.com', desc: 'Recommandé pour les sorties famille avec enfants', badge: '👶 Famille' },
  { name: 'Loisirs Enchères', emoji: '🎫', url: 'https://www.loisirs-encheres.com', desc: 'Offres et bons plans disponibles régulièrement', badge: '💰 Bons plans' },
];

// Médias / Presse
const DEFAULT_PRESS = [
  { name: 'Le Parisien', emoji: '📰', url: '#', quote: "NoLimit Aventure s'impose comme la référence de l'accrobranche en Île-de-France.", date: 'Mars 2024' },
  { name: 'France 3 Régions', emoji: '📺', url: '#', quote: "Un concept qui séduit les familles par son accessibilité et la qualité de ses parcours.", date: 'Été 2024' },
  { name: 'Sortir à Paris', emoji: '🏙️', url: '#', quote: "L'un des meilleurs parcs accrobranche à moins d'une heure de la capitale.", date: 'Printemps 2025' },
];

export function AboutPartnersPage() {
  const { data } = useAboutPartners();
  const [submitted, setSubmitted] = useState(false);
  const hero = data.hero ?? {};
  const sections = data.sections ?? {};

  const partners = data.partners?.length > 0
    ? data.partners.map((p, i) => ({ name: p.name ?? DEFAULT_PARTNERS[i % DEFAULT_PARTNERS.length].name, full: p.full ?? '', emoji: p.emoji ?? TYPE_EMOJI[p.type ?? ''] ?? '🤝', type: p.type ?? '', desc: p.desc ?? '' }))
    : DEFAULT_PARTNERS;

  // Données de listing/référencement (depuis l'API si dispo, sinon fallback)
  const listings = (data as any).listings?.length > 0 ? (data as any).listings : DEFAULT_LISTINGS;
  const press = (data as any).press?.length > 0 ? (data as any).press : DEFAULT_PRESS;

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: `linear-gradient(135deg, #0a2200 0%, ${GREEN} 100%)` }}>
        <motion.div className="absolute top-10 right-10 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: ORANGE, opacity: 0.16 }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 9, repeat: Infinity }} />
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/about" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-10 transition-colors">
            <ArrowLeft className="size-4" /> Retour à Découvrir
          </Link>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold border border-white/20 bg-white/10 text-white">
              {hero.badge || '🤝 Nos Partenaires'}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-5">
              {hero.h1 || 'Ensemble,'}<br /><span style={{ color: ORANGE }}>{hero.h1accent || 'on va plus loin.'}</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">{hero.intro || "On ne croit pas au succès solitaire."}</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none">
            <path d="M0,20 C500,60 900,0 1440,40 L1440,60 L0,60 Z" className="fill-white" />
          </svg>
        </div>
      </section>

      {/* CONTENU AVEC SIDEBAR */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <AboutSidebar />

          <main className="flex-1 min-w-0">

            {/* Bloc texte intro */}
            <section className="py-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="rounded-3xl p-8 md:p-10" style={{ background: `linear-gradient(135deg, ${GREEN}08, ${ORANGE}06)`, border: `2px solid ${GREEN}15` }}>
                <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: DARK }}>Un écosystème de confiance</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  NoLimit Aventure s'appuie sur un réseau de partenaires institutionnels, associatifs et commerciaux qui partagent nos valeurs.
                  Ensemble, nous construisons une offre de loisirs nature responsable, accessible et de qualité.
                </p>
              </motion.div>
            </section>

            {/* PARTENAIRES */}
            <section className="py-10">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: DARK }}>{sections.partnersTitle || 'Ils nous font confiance'}</h2>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {partners.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }}
                    className="bg-white rounded-3xl p-6 border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 border-gray-100 bg-gray-50">{p.emoji}</div>
                      <div>
                        <div className="font-black text-lg" style={{ color: DARK }}>{p.name}</div>
                        <div className="px-2 py-0.5 rounded-md text-[10px] font-black" style={{ backgroundColor: `${GREEN}15`, color: GREEN }}>{p.type}</div>
                      </div>
                    </div>
                    {p.full && <div className="text-xs text-gray-400 font-medium mb-2">{p.full}</div>}
                    <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ═══ SECTION RÉFÉRENCEMENT — Où nous trouver ═══ */}
            <section className="py-12">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-bold border" style={{ backgroundColor: `${ORANGE}10`, borderColor: `${ORANGE}30`, color: ORANGE }}>
                  <Globe className="size-4" /> Où nous trouver en ligne
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-2" style={{ color: DARK }}>NoLimit à travers le web</h2>
                <p className="text-gray-500">Les plateformes qui nous référencent et nous recommandent.</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map((item: any, i: number) => (
                  <motion.a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }} whileHover={{ y: -6, scale: 1.02 }}
                    className="block bg-white rounded-3xl p-6 border-2 border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.emoji}</span>
                        <div className="font-black text-lg" style={{ color: DARK }}>{item.name}</div>
                      </div>
                      <ExternalLink className="size-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                    </div>
                    {item.badge && (
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-black mb-3" style={{ backgroundColor: `${ORANGE}12`, color: ORANGE }}>
                        {item.badge}
                      </span>
                    )}
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </motion.a>
                ))}
              </div>
            </section>

            {/* ═══ SECTION PRESSE / MÉDIAS ═══ */}
            <section className="py-12">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black mb-2" style={{ color: DARK }}>Ils parlent de nous</h2>
                <p className="text-gray-500">Revue de presse et mentions médias.</p>
              </motion.div>

              <div className="space-y-5">
                {press.map((item: any, i: number) => (
                  <motion.a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }} whileHover={{ x: 6 }}
                    className="flex items-start gap-5 p-6 bg-white rounded-3xl border-2 border-gray-100 hover:border-green-200 hover:shadow-lg transition-all group">
                    <div className="text-4xl shrink-0">{item.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-black text-lg" style={{ color: DARK }}>{item.name}</span>
                        <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                        <ExternalLink className="size-3.5 text-gray-300 group-hover:text-green-600 transition-colors" />
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed italic">"{item.quote}"</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </section>

            {/* DEVENIR PARTENAIRE */}
            <section className="py-12 rounded-3xl overflow-hidden" style={{ backgroundColor: DARK }}>
              <div className="px-8 md:px-12">
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
                  <h2 className="text-3xl font-black text-white mb-3">{sections.becomeTitle || 'Devenir partenaire.'}</h2>
                  <p className="text-white/55">{sections.becomeSubtitle || "On est ouverts aux partenariats."}</p>
                </motion.div>

                <div className="bg-white rounded-3xl p-8 max-w-2xl mx-auto">
                  {submitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                      <div className="text-6xl mb-4">🤝</div>
                      <div className="text-2xl font-black mb-2" style={{ color: DARK }}>{sections.confirmedTitle || 'Demande reçue !'}</div>
                      <div className="text-gray-500">{sections.confirmedText || 'Notre responsable vous contactera sous 48h.'}</div>
                    </motion.div>
                  ) : (
                    <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Nom / Prénom *</label>
                          <input type="text" required placeholder="Jean Dupont" className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none text-sm font-medium" />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Organisation *</label>
                          <input type="text" required placeholder="Nom de votre structure" className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none text-sm font-medium" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Email *</label>
                        <input type="email" required placeholder="contact@organisation.fr" className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none text-sm font-medium" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Votre projet *</label>
                        <textarea required rows={4} placeholder="Décrivez votre projet de partenariat…"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none resize-none text-sm font-medium" />
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                        className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2"
                        style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
                        <Send className="size-5" /> {sections.becomeCta || 'Envoyer ma demande'}
                      </motion.button>
                    </form>
                  )}
                </div>
              </div>
            </section>

            {/* NAV */}
            <div className="flex items-center justify-between py-10">
              <Link to="/about/actualites" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 font-bold text-sm"><ArrowLeft className="size-4" /> Actualités</Link>
              <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
                Retour à l'accueil <ArrowRight className="size-4" />
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

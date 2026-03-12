// components/park/ParkFAQSection.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const themes = [
  {
    id: 'reservation', label: '📅 Réservation',
    faqs: [
      { q: 'Comment réserver une activité ?',          a: "Vous pouvez réserver directement en ligne via le bouton \"Réserver maintenant\", par téléphone au 01 23 45 67 89, ou vous présenter directement à l'accueil selon les disponibilités." },
      { q: 'Puis-je annuler ou modifier ma réservation ?', a: "Oui, l'annulation est gratuite jusqu'à 48h avant votre venue. La modification de date est possible jusqu'à 7 jours avant. Au-delà, des frais peuvent s'appliquer." },
      { q: 'La réservation est-elle obligatoire ?',    a: "Elle est fortement recommandée, surtout en haute saison et les week-ends. Sans réservation, l'accès est possible sous réserve de disponibilité." },
      { q: 'Y a-t-il une confirmation de réservation ?', a: "Oui, vous recevez un email de confirmation immédiatement après votre réservation, avec tous les détails de votre venue (horaire, lieu, consignes)." },
    ],
  },
  {
    id: 'tarifs', label: '💰 Tarifs',
    faqs: [
      { q: 'Y a-t-il des réductions pour les groupes ?', a: "Oui, à partir de 5 personnes vous bénéficiez d'une réduction de 10%, et à partir de 10 personnes de 15%. Contactez-nous pour un devis entreprise ou événement." },
      { q: 'Les enfants bénéficient-ils d\'un tarif réduit ?', a: "Oui, les enfants de moins de 12 ans bénéficient d'un tarif réduit. Les moins de 3 ans sont gratuits (sans participation aux activités)." },
      { q: 'Avez-vous des cartes cadeaux ?',           a: "Oui ! Nos cartes cadeaux sont disponibles en ligne et à l'accueil du parc. Elles sont valables 1 an et utilisables pour toutes les activités." },
      { q: 'Acceptez-vous les chèques vacances (ANCV) ?', a: "Oui, nous acceptons les chèques vacances ANCV ainsi que les coupons Sport. Renseignez-vous à l'accueil." },
    ],
  },
  {
    id: 'activites', label: '🧗 Activités',
    faqs: [
      { q: "Faut-il avoir de l'expérience pour participer ?", a: "Aucune expérience n'est requise pour la plupart de nos activités. Nos moniteurs diplômés assurent une initiation complète et sécurisée, quel que soit votre niveau." },
      { q: 'Y a-t-il un âge ou poids minimum ?',      a: "L'âge minimum varie selon les activités (généralement 5 à 10 ans). Certaines activités ont des restrictions de poids pour des raisons de sécurité. Consultez la fiche de chaque activité." },
      { q: 'Les activités ont-elles lieu par mauvais temps ?', a: "Les activités en plein air peuvent être suspendues en cas de vent fort, orage ou pluie intense. En cas d'annulation météo, vous êtes remboursé intégralement ou pouvez reporter sans frais." },
      { q: 'Combien de temps dure une session ?',      a: "La durée varie de 1h à une demi-journée selon l'activité. Comptez en général 2h pour une session standard incluant briefing, pratique et débriefing." },
    ],
  },
  {
    id: 'pratique', label: '🎒 Pratique',
    faqs: [
      { q: 'Que dois-je apporter ?',                   a: "Une tenue sportive confortable, des chaussures fermées et de l'eau. Tout l'équipement de sécurité (harnais, casque, etc.) est fourni et inclus dans le prix." },
      { q: 'Y a-t-il un parking sur place ?',          a: "Oui, un parking gratuit de 200 places est disponible directement sur le site, y compris des places réservées aux PMR à proximité de l'entrée." },
      { q: 'Peut-on manger sur place ?',               a: "Oui, notre snack bar est ouvert de 10h à 17h. Une aire de pique-nique avec tables et abris est également disponible pour apporter votre repas." },
      { q: 'Les vestiaires sont-ils inclus ?',         a: "Oui, l'accès aux vestiaires avec casiers sécurisés et douches est inclus dans le prix de toutes les activités." },
    ],
  },
  {
    id: 'securite', label: '🛡️ Sécurité',
    faqs: [
      { q: 'Le parc est-il sécurisé ?',               a: "Absolument. Tout notre matériel est conforme aux normes européennes EN et vérifié quotidiennement. Nos moniteurs sont diplômés d'État et formés aux premiers secours (PSC1 minimum)." },
      { q: "Suis-je assuré pendant l'activité ?",     a: "Oui, une assurance responsabilité civile couvre l'intégralité de la session. En cas d'accident, notre équipe est formée pour intervenir rapidement." },
      { q: "Que faire en cas d'urgence sur place ?",  a: "Un responsable de sécurité est présent à tout moment. En cas d'urgence, contactez directement l'accueil ou notre ligne urgence : 06 12 34 56 78." },
    ],
  },
];

export function ParkFAQSection() {
  const [openItem, setOpenItem]       = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState('reservation');

  const currentTheme = themes.find(t => t.id === activeTheme) ?? themes[0];

  return (
    <section className="relative py-20 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium border" style={{ backgroundColor: `${GREEN}10`, borderColor: `${GREEN}30`, color: GREEN }}>
            <Sparkles className="size-4" /> Questions fréquentes
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: DARK }}>
            Tout ce que vous <span style={{ color: GREEN }}>souhaitez savoir</span>
          </h2>
          <p className="text-gray-500 text-lg">Des réponses précises pour préparer votre visite</p>
        </motion.div>

        {/* Thèmes */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {themes.map(theme => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setActiveTheme(theme.id); setOpenItem(null); }}
              className="px-5 py-2.5 rounded-2xl font-bold text-sm transition-all border-2"
              style={activeTheme === theme.id
                ? { backgroundColor: GREEN, borderColor: GREEN, color: 'white', boxShadow: `0 4px 16px ${GREEN}40` }
                : { backgroundColor: 'white', borderColor: '#e5e7eb', color: '#6b7280' }
              }
            >
              {theme.label}
            </motion.button>
          ))}
        </div>

        {/* FAQs */}
        <motion.div key={activeTheme} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {currentTheme.faqs.map((faq, i) => {
            const id     = `${activeTheme}-${i}`;
            const isOpen = openItem === id;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border-2 overflow-hidden shadow-sm transition-all"
                style={{ borderColor: isOpen ? GREEN : '#f3f4f6' }}
              >
                <button
                  onClick={() => setOpenItem(isOpen ? null : id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: isOpen ? GREEN : `${GREEN}15` }}>
                      <ChevronDown className={`size-4 transition-transform ${isOpen ? 'text-white' : 'rotate-[-90deg]'}`} style={isOpen ? {} : { color: GREEN }} />
                    </div>
                    <span className="font-bold text-gray-900 text-sm group-hover:text-green-700 transition-colors">{faq.q}</span>
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pl-[4.25rem]">
                        <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="mt-10 text-center">
          <p className="text-gray-500 text-sm mb-4">Vous ne trouvez pas la réponse à votre question ?</p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white text-sm"
            style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}
          >
            <MessageCircle className="size-4" /> Contactez-nous directement <ArrowRight className="size-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

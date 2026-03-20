// parks/ParkFAQSection.tsx — FAQ dynamique depuis WordPress
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, MessageCircle, ArrowRight, Loader2 } from 'lucide-react';
import { API_URL, API_KEY, cleanWpData } from '../config/config';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  parkId?: string;
}

interface FaqCategory {
  id: string;
  label: string;
}

interface FaqApiResponse {
  title: string;
  subtitle: string;
  categories: FaqCategory[];
  faqs: FaqItem[];
}

// Fallback FAQ par défaut
const fallbackThemes = [
  {
    id: 'reservation', label: '📅 Réservation',
    faqs: [
      { q: 'Comment réserver une activité ?', a: "Vous pouvez réserver directement en ligne via le bouton \"Réserver maintenant\", par téléphone, ou vous présenter directement à l'accueil selon les disponibilités." },
      { q: 'Puis-je annuler ou modifier ma réservation ?', a: "Oui, l'annulation est gratuite jusqu'à 48h avant votre venue. La modification de date est possible jusqu'à 7 jours avant." },
    ],
  },
  {
    id: 'activites', label: '🧗 Activités',
    faqs: [
      { q: "À partir de quel âge peut-on faire de l'accrobranche ?", a: 'Nos parcours sont accessibles dès 3 ans avec des parcours adaptés.' },
      { q: 'Les activités sont-elles sécurisées ?', a: "Toutes nos activités respectent les normes de sécurité les plus strictes." },
    ],
  },
  {
    id: 'pratique', label: '📍 Pratique',
    faqs: [
      { q: 'Que se passe-t-il en cas de mauvais temps ?', a: 'En cas de conditions météo dangereuses, nous vous proposons un report gratuit.' },
    ],
  },
];

export function ParkFAQSection() {
  const { parkId } = useParams<{ parkId: string }>();
  const [activeTheme, setActiveTheme] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [themes, setThemes] = useState(fallbackThemes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const url = parkId
          ? `${API_URL}/faqs/park/${parkId}`
          : `${API_URL}/faqs`;

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...(API_KEY ? { 'X-NoLimit-Key': API_KEY } : {}),
          },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: FaqApiResponse = cleanWpData(await response.json());

        if (data.faqs && data.faqs.length > 0) {
          // Regrouper par catégorie
          const catMap = new Map<string, { id: string; label: string; faqs: { q: string; a: string }[] }>();
          const catLabels = new Map<string, string>();
          
          for (const cat of (data.categories || [])) {
            if (cat.id !== 'all') catLabels.set(cat.id, cat.label);
          }

          for (const faq of data.faqs) {
            const catId = faq.category || 'general';
            if (!catMap.has(catId)) {
              catMap.set(catId, {
                id: catId,
                label: catLabels.get(catId) || catId.charAt(0).toUpperCase() + catId.slice(1),
                faqs: [],
              });
            }
            catMap.get(catId)!.faqs.push({ q: faq.question, a: faq.answer });
          }

          const grouped = Array.from(catMap.values()).filter(c => c.faqs.length > 0);
          if (grouped.length > 0) setThemes(grouped);
        }
      } catch (err) {
        console.warn('⚠️ FAQ indisponible, fallback local', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, [parkId]);

  const currentFaqs = themes[activeTheme]?.faqs || [];

  if (loading) {
    return (
      <section id="faq" className="py-20">
        <div className="container mx-auto px-6 text-center">
          <Loader2 className="size-8 animate-spin mx-auto text-gray-300" />
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-medium border" style={{ backgroundColor: `${GREEN}10`, borderColor: `${GREEN}30`, color: GREEN }}>
            <Sparkles className="size-4" /> Questions fréquentes
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-2" style={{ color: DARK }}>
            {"Une question ? "}
            <span style={{ color: GREEN }}>On vous répond</span>
          </h2>
        </motion.div>

        {/* Onglets thématiques */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {themes.map((theme, idx) => (
            <motion.button
              key={theme.id}
              onClick={() => { setActiveTheme(idx); setOpenIndex(null); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                backgroundColor: activeTheme === idx ? GREEN : '#f3f4f6',
                color: activeTheme === idx ? 'white' : '#374151',
              }}
            >
              {theme.label}
            </motion.button>
          ))}
        </div>

        {/* Questions / Réponses */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {currentFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div
                  key={`${activeTheme}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-bold text-sm pr-4" style={{ color: DARK }}>{faq.q}</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="size-5 flex-shrink-0" style={{ color: GREEN }} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
          <p className="text-gray-500 text-sm mb-4">Vous n'avez pas trouvé la réponse ?</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white shadow-md" style={{ backgroundColor: ORANGE }}>
            <MessageCircle className="size-4" /> Contactez-nous <ArrowRight className="size-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

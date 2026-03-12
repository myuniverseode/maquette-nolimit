// components/park/ParkNewsletterBanner.tsx
// Bandeau newsletter léger — horizontal, 1 champ email + bouton
// À placer après ParkActualitesSection + ParkBlogSection

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';

interface Props {
  parkSlug?: string;
}

export function ParkNewsletterBanner({ parkSlug }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    // TODO: Appel API Brevo avec parkSlug pour segmentation
    setTimeout(() => {
      setStatus('ok');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    }, 800);
  };

  return (
    <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${DARK} 0%, #1a1a1a 100%)` }}>
      {/* Glows décoratifs */}
      <motion.div
        className="absolute -left-24 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: GREEN, opacity: 0.07 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-24 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: ORANGE, opacity: 0.07 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 max-w-4xl mx-auto"
        >
          {/* Icône + texte */}
          <div className="flex items-center gap-4 shrink-0">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}
            >
              <Mail className="size-5 text-white" />
            </motion.div>
            <div className="text-left">
              <div className="text-white font-black text-sm leading-tight">Ne ratez rien</div>
              <div className="text-white/45 text-xs">Actus, promos & événements · 1×/mois max</div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="flex-1 flex gap-2 w-full sm:w-auto">
            <AnimatePresence mode="wait">
              {status === 'ok' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 flex-1"
                >
                  <CheckCircle className="size-4" style={{ color: GREEN }} />
                  <span className="text-white text-sm font-bold">Inscrit ! Merci 🎉</span>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-2 flex-1 w-full"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.fr"
                    className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/30 text-sm font-medium border border-white/15 focus:outline-none focus:border-white/40 transition-colors"
                  />
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-5 py-3 rounded-xl text-sm font-black text-white shrink-0 flex items-center gap-2 disabled:opacity-60 transition-all"
                    style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}
                  >
                    {status === 'loading' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>S'abonner <ArrowRight className="size-4" /></>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

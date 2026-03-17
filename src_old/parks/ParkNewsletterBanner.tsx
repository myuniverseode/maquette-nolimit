// components/park/ParkNewsletterBanner.tsx
// Bandeau newsletter léger — horizontal, 1 champ email + bouton
// À placer après ParkActualitesSection + ParkBlogSection

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

const GREEN = '#357600';
const ORANGE = '#eb700f';

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
    <section className="relative overflow-hidden bg-white py-10">
      {/* Décoration subtile */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-green-50 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-orange-50 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10"
          style={{
            boxShadow: `0 20px 40px -15px ${GREEN}20, 0 10px 20px -10px ${ORANGE}10`
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Icône + texte */}
            <div className="flex items-center gap-4 shrink-0">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${GREEN}15, ${ORANGE}10)`,
                  border: `1px solid ${GREEN}20`
                }}
              >
                <Mail className="size-6" style={{ color: GREEN }} />
              </motion.div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-black text-lg leading-tight">Ne ratez rien</span>
                  <Sparkles className="size-4" style={{ color: ORANGE }} />
                </div>
                <div className="text-gray-500 text-sm">Actus, promos & événements · 1×/mois max</div>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="flex-1 w-full">
              <AnimatePresence mode="wait">
                {status === 'ok' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100"
                  >
                    <CheckCircle className="size-5" style={{ color: GREEN }} />
                    <span className="text-gray-700 text-base font-bold">Inscrit avec succès ! Merci 🎉</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.fr"
                        className="w-full px-5 py-4 rounded-xl bg-white text-gray-700 placeholder-gray-400 text-base font-medium border-2 border-gray-200 focus:outline-none transition-all"
                        style={{ 
                          focusBorderColor: GREEN,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}
                        onFocus={(e) => e.target.style.borderColor = GREEN}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={status === 'loading'}
                      className="px-8 py-4 rounded-xl text-base font-black text-white shrink-0 flex items-center justify-center gap-2 disabled:opacity-60 transition-all shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)`,
                        boxShadow: `0 8px 20px -5px ${ORANGE}60`
                      }}
                    >
                      {status === 'loading' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          S'abonner
                          <ArrowRight className="size-5" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Petit texte de réassurance */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center md:text-left md:ml-[4.5rem]"
          >
            <p className="text-xs text-gray-400">
              🔒 Vos données sont confidentielles · désabonnement en 1 clic
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
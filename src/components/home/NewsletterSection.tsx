// components/home/NewsletterSection.tsx - SANS RÉSEAUX SOCIAUX
import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewsletterSectionProps {
  compact?: boolean;
}

export function NewsletterSection({ compact = false }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubmitted(true);
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Card principale */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #357600 0%, #2d6100 100%)' }}
          >
            {/* Background pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Floating elements */}
            <motion.div
              className="absolute top-10 right-10 w-32 h-32 rounded-full blur-2xl"
              style={{ backgroundColor: '#eb700f', opacity: 0.2 }}
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, -20, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <div className="relative z-10 p-8 md:p-12 text-center text-white">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6"
              >
                <Mail className="size-8" style={{ color: '#eb700f' }} />
              </motion.div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Restez informé de nos aventures
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Recevez nos offres exclusives, nouveautés et conseils d'aventure directement dans votre boîte mail
              </p>

              {/* Form */}
              {!isSubmitted ? (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                    className="flex-1 px-6 py-4 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-white/60 transition-all"
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full font-bold transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                    style={{ backgroundColor: '#eb700f', color: 'white' }}
                  >
                    {isLoading ? (
                      <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        S'inscrire
                        <Send className="size-5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex items-center justify-center gap-3 text-white text-lg font-medium"
                >
                  <CheckCircle className="size-6" style={{ color: '#eb700f' }} />
                  <span>Merci ! Vous êtes inscrit à notre newsletter 🎉</span>
                </motion.div>
              )}

              {/* Privacy notice */}
              <p className="text-xs text-white/60 mt-6">
                En vous inscrivant, vous acceptez de recevoir nos emails. 
                Vous pouvez vous désabonner à tout moment.
              </p>
            </div>
          </motion.div>

          {/* Avantages de l'inscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            {[
              { icon: '🎟️', title: 'Offres exclusives', desc: 'Réductions réservées aux abonnés' },
              { icon: '🎯', title: 'Nouveautés en avant-première', desc: 'Soyez les premiers informés' },
              { icon: '💡', title: 'Conseils d\'experts', desc: 'Astuces pour profiter au maximum' }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: '#111111' }}>
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
// components/park/ParkBrevoForm.tsx
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { SubtlePatternBg } from './ParkHelpers';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

export function ParkBrevoForm() {
  return (
    <section className="relative py-20 bg-white">
      <SubtlePatternBg />
      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium border" style={{ backgroundColor: `${ORANGE}10`, borderColor: `${ORANGE}30`, color: ORANGE }}>
            <Send className="size-4" /> Newsletter & Contact
          </div>
          <h2 className="text-4xl font-black mb-4" style={{ color: DARK }}>
            Restez <span style={{ color: ORANGE }}>informé</span>
          </h2>
          <p className="text-gray-500 text-lg">Inscrivez-vous pour recevoir nos actualités, offres exclusives et bons plans</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl border-2 overflow-hidden"
          style={{ borderColor: `${ORANGE}30` }}
        >
          <div className="h-1.5" style={{ background: `linear-gradient(to right, ${GREEN}, ${ORANGE})` }} />
          <div className="p-8">
            {/*
              Remplacer le bloc ci-dessous par le code embed Brevo :
              <div className="sib-form" data-id="XXXXXXXXX" ... />
              <script defer src="https://sibforms.com/forms/end-form/build/main.js"></script>
            */}
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center bg-gray-50">
              <div className="text-4xl mb-4">📧</div>
              <div className="font-black text-gray-700 text-lg mb-2">Formulaire Brevo</div>
              <p className="text-gray-400 text-sm mb-6">
                Remplacez ce bloc par votre code d'intégration Brevo.<br />
                Connectez-vous → Contacts → Formulaires → Créer → Copier le code embed
              </p>
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-left max-w-md mx-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Prénom</label>
                    <input type="text" placeholder="Jean" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
                    <input type="email" placeholder="jean@email.fr" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-sm focus:outline-none" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}
                  >
                    <Send className="size-4" /> S'abonner à la newsletter
                  </motion.button>
                </div>
              </div>
              <p className="text-gray-300 text-[10px] mt-4">Intégration Brevo à configurer · Données protégées · Désabonnement en 1 clic</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

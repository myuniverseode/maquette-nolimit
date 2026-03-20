// components/park/ParkAccessibilityBlock.tsx
import { motion } from 'framer-motion';
import { useSiteConfig } from "../hooks/useSiteConfig";
import { CheckCircle, Phone } from 'lucide-react';

const GREEN = '#357600';
const DARK  = '#111111';

const DEFAULT_ACCESS_ITEMS = [
  { icon: '♿', label: 'Mobilité réduite (PMR)',   detail: "Accès rampes, sanitaires adaptés, parking PMR réservé à l'entrée", available: true },
  { icon: '👁️', label: 'Déficience visuelle',     detail: 'Parcours balisés, accueil en langage simplifié sur demande',         available: true },
  { icon: '👂', label: 'Déficience auditive',      detail: 'Personnel formé à la communication visuelle, supports écrits',        available: true },
  { icon: '🧠', label: 'Handicap cognitif',        detail: 'Activités adaptées sur réservation, accompagnateurs bienvenus',       available: true },
  { icon: '🧒', label: 'Poussettes & jeunes enfants', detail: 'Allées larges, zone jeux enfants adaptée, aire de change',         available: true },
  { icon: '🐕', label: "Animaux d'assistance",     detail: "Chiens guides acceptés sur l'ensemble du site",                      available: true },
];

export function ParkAccessibilityBlock() {
  const { config } = useSiteConfig();
  const accessItems = config.accessibility?.length > 0 ? config.accessibility : DEFAULT_ACCESS_ITEMS;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl p-8 shadow-lg border-2"
      style={{ borderColor: `${GREEN}40` }}
    >
      <div className="flex items-center gap-4 mb-7">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}>
          <span className="text-2xl">♿</span>
        </div>
        <div>
          <h3 className="text-2xl font-black" style={{ color: DARK }}>Accessibilité</h3>
          <p className="text-gray-500 text-sm">Un parc inclusif pour tous</p>
        </div>
        <div className="ml-auto px-3 py-1.5 rounded-full text-xs font-black text-white" style={{ backgroundColor: GREEN }}>
          Label Tourisme & Handicap
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {accessItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all"
          >
            <span className="text-2xl flex-shrink-0">{item.icon}</span>
            <div>
              <div className="font-bold text-gray-900 text-sm leading-tight mb-1">{item.label}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{item.detail}</div>
            </div>
            <CheckCircle className="size-4 flex-shrink-0 mt-0.5 ml-auto" style={{ color: GREEN }} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// components/park/ParkOnSiteBlock.tsx
import { motion } from 'framer-motion';
import { useSiteConfig } from "../hooks/useSiteConfig";
import { MapPin, Users } from 'lucide-react';

const GREEN  = '#357600';
const ORANGE = '#eb700f';

const DEFAULT_AMENITIES = [
  { icon: '🅿️', label: 'Parking',       sub: '200 places · gratuit'  },
  { icon: '🍽️', label: 'Snack bar',      sub: 'Ouvert 10h–17h'        },
  { icon: '🚿', label: 'Vestiaires',     sub: 'Douches incluses'       },
  { icon: '📶', label: 'WiFi',           sub: 'Gratuit & illimité'     },
  { icon: '🧰', label: 'Matériel',       sub: 'Tout fourni'            },
  { icon: '🌳', label: 'Espace détente', sub: 'Zone ombragée'          },
];

export function ParkOnSiteBlock({ park }: { park: any }) {
  const { config } = useSiteConfig();
  const amenities = config.onSiteServices?.length > 0 ? config.onSiteServices : DEFAULT_AMENITIES;
  const addressEncoded = encodeURIComponent(park.location);
  const mapsUrl = `https://maps.google.com/?q=${addressEncoded}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="rounded-3xl overflow-hidden shadow-lg border-2 bg-white"
      style={{ borderColor: `${GREEN}40` }}
    >
      <div className="px-6 py-5 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #4a9d00 100%)` }}>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <MapPin className="size-5 text-white" />
        </div>
        <div>
          <div className="text-white font-black text-lg leading-tight">Sur place</div>
          <div className="text-white/75 text-xs">Tout ce qu'il faut pour profiter</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
          <Users className="size-3.5 text-white" />
          <span className="text-white text-xs font-bold">{park.capacity} pers.</span>
        </div>
      </div>

      <div className="p-5 grid grid-cols-2 gap-3">
        {amenities.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.03, backgroundColor: `${GREEN}08` }}
            className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 cursor-default transition-colors"
          >
            <span className="text-2xl leading-none">{a.icon}</span>
            <div>
              <div className="text-gray-900 font-bold text-sm leading-tight">{a.label}</div>
              <div className="text-gray-500 text-[11px]">{a.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="px-5 pb-5">
        <motion.a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-start gap-3 p-4 rounded-2xl cursor-pointer group transition-all"
          style={{ backgroundColor: `${ORANGE}10`, border: `1.5px dashed ${ORANGE}50` }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: ORANGE }}>
            <MapPin className="size-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-gray-900 text-sm mb-0.5 flex items-center gap-2">
              Adresse
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: ORANGE }}>
                📍 Ouvrir le GPS
              </span>
            </div>
            <div className="text-gray-600 text-xs leading-relaxed">{park.location}</div>
          </div>
        </motion.a>
      </div>
    </motion.div>
  );
}

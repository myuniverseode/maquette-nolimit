// parks/ParkStatusBadge.tsx
// Badge statut parc alimenté par le plugin NoLimit Calendrier Admin
// Remplace l'ancien système useHorairesData (règles saison/jours)
// par un calendrier explicite jour par jour géré dans WordPress.
//
// Endpoint : GET /nolimit/v1/calendar/{park_id}  (public, pas d'auth)
// Données   : { legend[], dateColors{date→id}, dateEvents{date→{title,icon,description}} }

import { motion } from 'framer-motion';
import { Clock, Info, Phone } from 'lucide-react';
import { useCalendarData, ParkDayStatus, CalendarData } from '../hooks/useCalendarData';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ParkStatusBadgeProps {
  /** Slug / ID du parc (ex: 'nolimit-chevry') */
  parkId: string;
  /** Taille du badge */
  size?: 'sm' | 'md' | 'lg';
  /** Afficher le panneau détail (légende + événement + téléphone) */
  showDetails?: boolean;
  /** Mode compact : juste le point coloré + label */
  compact?: boolean;
}

// ─── Helpers visuels ────────────────────────────────────────────────────────

/** Contraste texte sur fond coloré */
function textColor(hex: string): string {
  if (!hex || hex.length < 7) return '#333';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#1c1c1e' : '#ffffff';
}

/** Fond très léger depuis la couleur (hex → rgba 10%) */
function lightBg(hex: string): string {
  return `${hex}18`;
}

/** Bordure légère (hex → rgba 40%) */
function lightBorder(hex: string): string {
  return `${hex}55`;
}

/** Le badge doit-il pulser ? (si ouvert ou presque) */
function shouldPulse(color: string): boolean {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  // Vert ou orange = parc actif
  const isGreen  = g > r + 20 && g > b + 20;
  const isOrange = r > 160 && g > 60 && g < 160 && b < 60;
  return isGreen || isOrange;
}

// ─── Squelette de chargement ─────────────────────────────────────────────────

function LoadingBadge({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const pad = size === 'sm' ? 'px-3 py-1.5' : size === 'md' ? 'px-4 py-2.5' : 'px-5 py-3';
  return (
    <div className={`inline-flex items-center gap-2 rounded-2xl border-2 bg-gray-50 border-gray-200 animate-pulse ${pad}`}>
      <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
      <div className="h-3 w-24 bg-gray-200 rounded" />
    </div>
  );
}

// ─── Badge statut (mode compact ou normal) ───────────────────────────────────

function StatusBadge({
  status,
  size,
}: {
  status: ParkDayStatus;
  size: 'sm' | 'md' | 'lg';
}) {
  const color  = status.color;
  const pulse  = shouldPulse(color);
  const pad    = size === 'sm' ? 'px-3 py-1.5' : size === 'md' ? 'px-4 py-2.5' : 'px-5 py-3';
  const textSz = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';
  const subSz  = size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2.5 rounded-2xl border-2 font-medium ${pad}`}
      style={{
        backgroundColor: lightBg(color),
        borderColor:     lightBorder(color),
        color,
      }}
    >
      {/* Point animé */}
      <motion.div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
        animate={pulse ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Texte */}
      <div>
        <div className={`font-black leading-tight ${textSz}`}>
          {status.event?.icon && <span className="mr-1">{status.event.icon}</span>}
          {status.label}
        </div>
        {status.sub && (
          <div className={`opacity-70 ${subSz}`}>{status.sub}</div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Panneau détail ──────────────────────────────────────────────────────────

function DetailPanel({
  status,
  calendar,
  color,
}: {
  status: ParkDayStatus;
  calendar: CalendarData;
  color: string;
}) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Prochains jours avec infos (jusqu'à 7 jours)
  const upcomingDays: Array<{ key: string; label: string; legend: typeof calendar.legend[0] | null; event: typeof calendar.dateEvents[string] | null }> = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const legendId = calendar.dateColors[key];
    if (!legendId) continue;
    const leg = calendar.legend.find(l => l.id === legendId) ?? null;
    const event = calendar.dateEvents[key] ?? null;
    const dayLabel = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    upcomingDays.push({ key, label: dayLabel, legend: leg, event });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl border-2 p-4 space-y-3 min-w-[220px]"
      style={{ borderColor: lightBorder(color) }}
    >
      {/* Événement du jour */}
      {status.event && (status.event.title || status.event.description) && (
        <div className="p-3 rounded-xl" style={{ backgroundColor: lightBg(color) }}>
          {status.event.title && (
            <div className="font-bold text-sm" style={{ color }}>
              {status.event.icon} {status.event.title}
            </div>
          )}
          {status.event.description && (
            <p className="text-xs text-gray-600 mt-1">{status.event.description}</p>
          )}
        </div>
      )}

      {/* Légende complète */}
   

      {/* Prochains jours */}
      {upcomingDays.length > 0 && (
        <div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Prochains jours</div>
          <div className="space-y-1">
            {upcomingDays.slice(0, 4).map(({ key, label, legend: leg, event }) => (
              <div key={key} className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500 capitalize">{label}</span>
                <div className="flex items-center gap-1.5">
                  {event?.icon && <span className="text-xs">{event.icon}</span>}
                  {leg && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: lightBg(leg.color), color: leg.color }}
                    >
                      {leg.label}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Téléphone */}
      {calendar.phone && (
        <a
          href={`tel:${calendar.phone.replace(/[\s.]/g, '')}`}
          className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Phone className="size-3.5" />
          {calendar.phone}
        </a>
      )}

      {/* Message groupes */}
      {calendar.groupsMessage && (
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <Info className="size-3.5 flex-shrink-0 mt-0.5" />
          <span>{calendar.groupsMessage}</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Composant principal ─────────────────────────────────────────────────────

export function ParkStatusBadge({
  parkId,
  size = 'md',
  showDetails = false,
  compact = false,
}: ParkStatusBadgeProps) {
  const { calendar, status, loading } = useCalendarData(parkId);

  if (loading) return <LoadingBadge size={size} />;

  // Mode compact (point + label seul)
  if (compact) {
    const color  = status.color;
    const pulse  = shouldPulse(color);
    const pad    = size === 'sm' ? 'px-3 py-1.5' : size === 'md' ? 'px-4 py-2.5' : 'px-5 py-3';
    const textSz = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 rounded-2xl border-2 font-medium ${pad}`}
        style={{ backgroundColor: lightBg(color), borderColor: lightBorder(color), color }}
      >
        <motion.div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
          animate={pulse ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className={`font-black ${textSz}`}>
          {status.event?.icon && <span className="mr-1">{status.event.icon}</span>}
          {status.label}
        </span>
      </motion.div>
    );
  }

  // Mode normal (badge + panneau détail optionnel)
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <StatusBadge status={status} size={size} />
      {showDetails && (
        <DetailPanel status={status} calendar={calendar} color={status.color} />
      )}
    </motion.div>
  );
}

// ─── Variantes légères ───────────────────────────────────────────────────────

/** Simple point coloré animé + label texte */
export function ParkStatusDot({ parkId }: { parkId: string }) {
  const { status } = useCalendarData(parkId);
  const color = status.color;
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
        animate={shouldPulse(color) ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="text-xs font-bold" style={{ color }}>
        {status.event?.icon && <span className="mr-0.5">{status.event.icon}</span>}
        {status.label}
      </span>
    </div>
  );
}

/** Statut + horaires pour le header (extrait le 9h-18h du label si format standard) */
export function ParkHeaderStatus({ parkId }: { parkId: string }) {
  const { status, calendar } = useCalendarData(parkId);
  const color = status.color;

  // Tenter d'extraire les horaires du label (ex: "Ouvert 9h-18h" → "9h-18h")
  const hoursMatch = status.label.match(/(\d{1,2}h(?:\d{2})?[\s–-]+\d{1,2}h(?:\d{2})?)/);
  const hoursText  = hoursMatch ? hoursMatch[1] : null;

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
          animate={shouldPulse(color) ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="font-bold" style={{ color }}>
          {status.event?.icon && <span className="mr-0.5">{status.event.icon}</span>}
          {status.label}
        </span>
      </div>
      {hoursText && (
        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="size-3.5" />
          <span className="text-xs">{hoursText}</span>
        </div>
      )}
      {calendar.phone && !hoursText && (
        <a href={`tel:${calendar.phone.replace(/[\s.]/g, '')}`}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
          <Clock className="size-3.5" />
          <span className="text-xs">{calendar.phone}</span>
        </a>
      )}
    </div>
  );
}

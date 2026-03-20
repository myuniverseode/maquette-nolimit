// parks/ParkCalendar.tsx
// Calendrier mensuel public — alimenté par le plugin NoLimit Calendrier Admin
// Endpoint : GET /nolimit/v1/calendar/{park_id}  (public, pas d'auth)

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useCalendarData, CalendarData, CalendarLegendItem } from '../hooks/useCalendarData';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ParkCalendarProps {
  parkId: string;
  /** Afficher la légende sous le calendrier */
  showLegend?: boolean;
  /** Classe CSS supplémentaire sur le conteneur */
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS_FR = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
];
const DAYS_FR = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

function pad(n: number) { return String(n).padStart(2, '0'); }

/** Clé YYYY-MM-DD en heure locale (sans décalage UTC) */
function dateKey(y: number, m: number, d: number): string {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

/** Contraste texte blanc/noir selon luminosité du fond */
function contrast(hex: string): string {
  if (!hex || hex.length < 7) return '#1c1c1e';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#1c1c1e' : '#ffffff';
}

/**
 * Lookup direct : dateColors[key] → legend item
 * ⚠️ N'utilise PAS computeDayStatus pour éviter les faux gris
 * quand un legendId existe mais que .find() échoue (race condition ou data stale).
 */
function getLegend(calendar: CalendarData, key: string): CalendarLegendItem | null {
  const legendId = calendar.dateColors[key];
  if (!legendId) return null;
  return calendar.legend.find(l => l.id === legendId) ?? null;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CalendarSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm animate-pulse">
      <div className="bg-gradient-to-r from-[#eb700f] to-[#f5a623] p-5">
        <div className="h-6 w-32 bg-white/20 rounded-lg mx-auto" />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-5 rounded bg-gray-100" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-50" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tooltip positionné selon colonne ─────────────────────────────────────────
// col 0–1 → ancré à gauche   col 5–6 → ancré à droite   col 2–4 → centré

interface DayTooltipProps {
  col: number; // 0=Lun … 6=Dim
  label: string;
  event: { title?: string; icon?: string; description?: string } | null;
}

function DayTooltip({ col, label, event }: DayTooltipProps) {
  const isLeft   = col <= 1;
  const isRight  = col >= 5;
  const isCenter = !isLeft && !isRight;

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    marginBottom: '8px',
    pointerEvents: 'none',
    zIndex: 50,
    ...(isLeft  ? { left: 0 } : {}),
    ...(isRight ? { right: 0 } : {}),
    ...(isCenter ? { left: '50%', transform: 'translateX(-50%)' } : {}),
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          background: '#111827',
          color: '#fff',
          fontSize: '11px',
          borderRadius: '8px',
          padding: '6px 10px',
          boxShadow: '0 4px 16px rgba(0,0,0,.25)',
          fontWeight: 500,
          lineHeight: 1.4,
          whiteSpace: 'normal',
          maxWidth: '150px',
          minWidth: '70px',
        }}
      >
        {event?.icon && <span style={{ marginRight: '3px' }}>{event.icon}</span>}
        {label}
        {event?.title && event.title !== label && (
          <div style={{ opacity: 0.65, fontSize: '10px', marginTop: '2px' }}>{event.title}</div>
        )}
      </div>
      {/* Flèche alignée avec la cellule */}
      <div
        style={{
          width: '8px',
          height: '8px',
          background: '#111827',
          transform: 'rotate(45deg)',
          marginTop: '-4px',
          ...(isLeft  ? { marginLeft: '12px' } : {}),
          ...(isRight ? { marginLeft: 'auto', marginRight: '12px' } : {}),
          ...(isCenter ? { marginLeft: 'auto', marginRight: 'auto' } : {}),
        }}
      />
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function ParkCalendar({
  parkId,
  showLegend = true,
  className = '',
}: ParkCalendarProps) {
  const { calendar, loading } = useCalendarData(parkId);

  const today = new Date();
  const [year, setYear]       = useState(today.getFullYear());
  const [month, setMonth]     = useState(today.getMonth());
  const [hovered, setHovered] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  if (loading) return <CalendarSkeleton />;

  // ── Navigation ──────────────────────────────────────────────────────────────
  function navigate(delta: 1 | -1) {
    setDirection(delta);
    setHovered(null);
    let m = month + delta;
    let y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0)  { m = 11; y--; }
    setMonth(m);
    setYear(y);
  }

  function goToday() {
    const fy = today.getFullYear();
    const fm = today.getMonth();
    setDirection(fy > year || (fy === year && fm > month) ? 1 : -1);
    setYear(fy);
    setMonth(fm);
    setHovered(null);
  }

  // ── Calcul grille (semaine commence lundi) ──────────────────────────────────
  const firstDayRaw = new Date(year, month, 1).getDay(); // 0=dim
  const offset      = firstDayRaw === 0 ? 6 : firstDayRaw - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey    = dateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const rows        = Math.ceil((offset + daysInMonth) / 7);

  return (
    <div className={`select-none ${className}`}>
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-[#eb700f] to-[#f5a623] px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="text-center" style={{ minWidth: '130px' }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${year}-${month}`}
                  initial={{ opacity: 0, x: direction * 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 18 }}
                  transition={{ duration: 0.16 }}
                >
                  <div className="font-extrabold text-xl tracking-tight leading-none">
                    {MONTHS_FR[month]}
                  </div>
                  <div className="text-white/75 text-sm font-semibold mt-0.5">{year}</div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={() => navigate(1)}
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center"
              aria-label="Mois suivant"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* ── Grille ── */}
        <div className="p-3 md:p-4">

          {/* En-têtes jours */}
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {DAYS_FR.map((d, i) => (
              <div
                key={d}
                className={`text-center text-[11px] font-bold py-1 ${
                  i >= 5 ? 'text-[#eb700f]' : 'text-gray-400'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Cellules */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${year}-${month}-grid`}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 24 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-7 gap-1.5"
              style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
            >
              {/* Cases vides décalage lundi */}
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Jours */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day       = idx + 1;
                const key       = dateKey(year, month, day);
                // ─ Lookup DIRECT (pas de computeDayStatus) ─
                const leg       = getLegend(calendar, key);
                const hasColor  = leg !== null;
                const bgColor   = leg?.color ?? null;
                const ev        = calendar.dateEvents[key] ?? null;
                const isToday   = key === todayKey;
                const dateObj   = new Date(year, month, day);
                const isPast    = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const dow       = dateObj.getDay(); // 0=dim
                const isWeekend = dow === 0 || dow === 6;
                const isHov     = hovered === key;
                const col       = (offset + idx) % 7; // 0=Lun … 6=Dim

                const bg = hasColor && bgColor
                  ? bgColor
                  : isWeekend && !isPast
                  ? '#fef3ec'
                  : '#f4f5f7';

                const textCol = hasColor && bgColor
                  ? contrast(bgColor)
                  : isPast
                  ? '#d1d5db'
                  : isWeekend
                  ? '#eb700f'
                  : '#374151';

                const boxShadow = isToday
                  ? `inset 0 0 0 2px #eb700f${hasColor ? ', 0 2px 6px ' + bgColor + '55' : ''}`
                  : hasColor && bgColor
                  ? `0 2px 6px ${bgColor}44`
                  : 'none';

                return (
                  <div
                    key={key}
                    className="relative aspect-square"
                    onMouseEnter={() => { if (hasColor) setHovered(key); }}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <motion.div
                      className="w-full h-full rounded-xl flex flex-col items-center justify-center gap-0.5 text-[13px] font-bold cursor-default"
                      style={{
                        background: bg,
                        color: textCol,
                        opacity: isPast && !hasColor ? 0.4 : 1,
                        boxShadow,
                      }}
                      animate={isHov ? { scale: 1.1, zIndex: 10 } : { scale: 1, zIndex: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <span className="leading-none tabular-nums">{day}</span>

                      {ev?.icon ? (
                        <span className="text-[10px] leading-none">{ev.icon}</span>
                      ) : ev?.title ? (
                        <span
                          className="w-1 h-1 rounded-full opacity-60"
                          style={{
                            background: hasColor && bgColor ? contrast(bgColor) : '#eb700f',
                          }}
                        />
                      ) : null}
                    </motion.div>

                    {/* Tooltip positionné selon colonne */}
                    {isHov && hasColor && leg && (
                      <DayTooltip col={col} label={leg.label} event={ev} />
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <div className="px-4 pb-4 flex justify-end">
          <button
            onClick={goToday}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#eb700f] hover:text-[#d4640d] transition-colors"
          >
            <CalendarDays className="size-3.5" />
            Aujourd'hui
          </button>
        </div>
      </div>

      {/* ── Légende ── */}
      {showLegend && calendar.legend.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Légende
          </div>
          <div className="flex flex-col gap-2">
            {calendar.legend.map(item => (
              <div key={item.id} className="flex items-center gap-2.5">
                <div
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 1px 4px ${item.color}55`,
                  }}
                />
                <span className="text-xs text-gray-700 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
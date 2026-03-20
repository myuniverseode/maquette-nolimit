// parks/calendar/CalendarGrid.tsx
import { useRef, useState } from 'react';
import { useCalendar } from './ParkCalendarContext';

const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

function adjustBrightness(hex: string, amount: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(parseInt(hex.slice(1, 3), 16) + amount);
  const g = clamp(parseInt(hex.slice(3, 5), 16) + amount);
  const b = clamp(parseInt(hex.slice(5, 7), 16) + amount);
  return `rgb(${r},${g},${b})`;
}

function getContrastColor(hex: string): string {
  if (!hex || hex.length < 7) return '#1c1c1e';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#1c1c1e' : '#ffffff';
}

interface DayCellProps {
  day: number;
  bgColor: string | null;
  hasEvent: boolean;
  eventIcon: string | null;
  tooltipText: string | null;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  colIndex: number;
  onClick: () => void;
}

function DayCell({ day, bgColor, hasEvent, eventIcon, tooltipText, isToday, isSelected, isWeekend, colIndex, onClick }: DayCellProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  let bg = 'transparent';
  let color = isWeekend ? '#FF6B6B' : '#1f2937';
  let fw: number = 400;
  const scale = pressed ? 0.88 : (hovered && !bgColor && !isToday && !isSelected ? 1.04 : 1);

  if (bgColor) { bg = bgColor; color = getContrastColor(bgColor); fw = 500; }
  if (isSelected) { bg = '#eb700f'; color = '#fff'; fw = 600; }
  if (isToday && !bgColor && !isSelected) { bg = '#1f2937'; color = '#fff'; fw = 700; }
  if (hovered && bgColor && !isSelected) { bg = adjustBrightness(bgColor, -12); }
  if (hovered && !bgColor && !isToday && !isSelected) { bg = 'rgba(0,0,0,0.05)'; }

  const dotColor = color === '#fff' ? 'rgba(255,255,255,0.9)' : '#444';

  return (
    <div
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: hasEvent ? 2 : 0, paddingTop: 6, paddingBottom: hasEvent ? 5 : 6,
        minHeight: 52, borderRadius: 12,
        background: bg, color,
        cursor: 'pointer',
        transition: 'transform 0.12s, background 0.12s',
        transform: `scale(${scale})`,
        position: 'relative',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span style={{ fontSize: 15, fontWeight: fw, lineHeight: 1 }}>{day}</span>

      {hasEvent && (
        eventIcon
          ? <span style={{ fontSize: 16, lineHeight: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>{eventIcon}</span>
          : <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
      )}

      {hovered && tooltipText && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          ...(colIndex <= 1
            ? { left: 0 }
            : colIndex >= 5
              ? { right: 0 }
              : { left: '50%', transform: 'translateX(-50%)' }),
          background: '#1a1a1a', color: '#fff',
          borderRadius: 10, padding: '8px 12px',
          fontSize: 12, fontWeight: 500, lineHeight: 1.45,
          whiteSpace: 'normal', zIndex: 200,
          pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.28)',
          width: 'max-content', maxWidth: 200,
          textAlign: colIndex <= 1 ? 'left' : colIndex >= 5 ? 'right' : 'center',
        }}>
          {eventIcon && <span style={{ marginRight: 5, fontSize: 14 }}>{eventIcon}</span>}
          {tooltipText}
        </div>
      )}
    </div>
  );
}

interface CalendarGridProps {
  year: number;
  month: number;
  onDayClick?: (key: string, day: number, month: number) => void;
  selectedDates?: string[];
  highlightToday?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function CalendarGrid({
  year, month, onDayClick,
  selectedDates = [], highlightToday = true,
  onSwipeLeft, onSwipeRight,
}: CalendarGridProps) {
  const { colorLegend, dateColors, dateEvents } = useCalendar();

  const colorMap: Record<string, string> = {};
  const legendMap: Record<string, string> = {};
  colorLegend.forEach(item => { colorMap[item.id] = item.color; legendMap[item.id] = item.label; });

  const today = new Date();
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? onSwipeLeft?.() : onSwipeRight?.(); }
    touchStartX.current = null;
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ width: '100%', userSelect: 'none' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {DAYS_SHORT.map((d, i) => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 12, fontWeight: 600,
            color: i >= 5 ? '#FF6B6B' : '#9ca3af',
            padding: '8px 0', letterSpacing: '0.3px',
          }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} style={{ minHeight: 52 }} />;
          const key = dateKey(year, month, day);
          const colorId = dateColors[key];
          const bgColor = colorId ? colorMap[colorId] : null;
          const eventData = dateEvents[key] || null;
          const eventIcon = eventData?.icon || null;
          const hasEvent = !!eventData;
          const tooltipText = eventData?.title || (colorId ? legendMap[colorId] : null) || null;
          const isToday = key === todayKey && highlightToday;
          const isSelected = selectedDates.includes(key);
          const isWeekend = (idx % 7 >= 5);

          return (
            <DayCell
              key={key}
              day={day}
              bgColor={bgColor ?? null}
              hasEvent={hasEvent}
              eventIcon={eventIcon ?? null}
              tooltipText={tooltipText ?? null}
              isToday={isToday}
              isSelected={isSelected}
              isWeekend={isWeekend}
              colIndex={idx % 7}
              onClick={() => onDayClick?.(key, day, month)}
            />
          );
        })}
      </div>
    </div>
  );
}

// parks/calendar/ParkCalendarSection.tsx
// Section calendrier d'ouverture pour la page parc (lecture publique uniquement)
// L'interface admin est dans WordPress : wp-admin → Calendrier
import { useState, useEffect, useRef } from 'react';
import { ParkCalendarProvider, useCalendar } from './ParkCalendarContext';
import CalendarGrid from './CalendarGrid';
import EventModal from './EventModal';

const MONTH_NAMES = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
];

// Normalise : minuscules + supprime accents
function norm(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// Mois indexés avec variantes normalisées
const MONTHS_VARIANTS = [
  ['janvier','janv','jan'],
  ['fevrier','fevr','fev'],
  ['mars','mar'],
  ['avril','avr'],
  ['mai'],
  ['juin','jun'],
  ['juillet','juil','jul'],
  ['aout','aou'],
  ['septembre','sept','sep'],
  ['octobre','oct'],
  ['novembre','nov'],
  ['decembre','dec'],
];

function fuzzyMonth(word: string): number | null {
  const w = norm(word);
  if (!w || w.length < 2) return null;
  // 1. Correspondance exacte ou alias
  for (let i = 0; i < MONTHS_VARIANTS.length; i++) {
    if (MONTHS_VARIANTS[i].some(v => v === w || v.startsWith(w) || w.startsWith(v.slice(0, 3)))) return i;
  }
  // 2. Fuzzy : meilleur préfixe commun (tolère 1 faute)
  let best = -1, bestScore = 0;
  for (let i = 0; i < MONTHS_VARIANTS.length; i++) {
    const main = MONTHS_VARIANTS[i][0];
    let score = 0;
    const len = Math.min(w.length, main.length);
    for (let j = 0; j < len; j++) { if (w[j] === main[j]) score++; else break; }
    if (score >= 2 && score > bestScore) { bestScore = score; best = i; }
  }
  return best >= 0 ? best : null;
}

function parseDate(str: string): Date | null {
  const s = str.trim().toLowerCase();
  const today = new Date();

  // Format avec séparateurs : 15/03/2026 ou 15-03-2026
  const sepMatch = s.match(/^(\d{1,2})[/\-.](\d{1,2})(?:[/\-.](\d{4}))?$/);
  if (sepMatch) {
    const y = sepMatch[3] ? +sepMatch[3] : today.getFullYear();
    return new Date(y, +sepMatch[2] - 1, +sepMatch[1]);
  }

  // Extraction des nombres et du texte
  const numbers = (s.match(/\d+/g) || []).map(Number);
  const textPart = norm(s.replace(/\d+/g, ' '));
  const words = textPart.split(/\s+/).filter(w => w.length >= 2);

  // Année explicite (4 chiffres entre 1900 et 2100)
  const yearNum = numbers.find(n => n > 1900 && n < 2100);
  const year = yearNum ?? today.getFullYear();
  const rest = numbers.filter(n => n !== yearNum);

  // Cherche un mois texte (fuzzy)
  let mIdx: number | null = null;
  for (const w of words) { mIdx = fuzzyMonth(w); if (mIdx !== null) break; }
  if (mIdx === null && textPart) mIdx = fuzzyMonth(textPart.replace(/\s/g, ''));

  if (mIdx !== null) {
    // "15 mars", "15 marz 2026", etc.
    const day = rest[0];
    if (!day || day < 1 || day > 31) return null;
    return new Date(year, mIdx, day);
  }

  if (rest.length >= 1) {
    const day = rest[0];
    if (day < 1 || day > 31) return null;
    // Cherche le premier nombre valide comme mois (1-12) après le jour
    const monthNum = rest.slice(1).find(n => n >= 1 && n <= 12);
    if (monthNum !== undefined) return new Date(year, monthNum - 1, day);
    // Aucun mois trouvé → jour du mois courant
    return new Date(year, today.getMonth(), day);
  }

  return null;
}

function navigate(year: number, month: number, delta: number) {
  let m = month + delta, y = year;
  if (m > 11) { m = 0; y++; }
  if (m < 0)  { m = 11; y--; }
  return { year: y, month: m };
}

function HeaderArrow({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: 38, height: 38, borderRadius: 12,
      background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
      color: '#fff', fontSize: 20, fontWeight: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, backdropFilter: 'blur(4px)',
      cursor: 'pointer', outline: 'none',
    }}>{children}</button>
  );
}

// ── Widget public ──────────────────────────────────────────────────────────────
const DEFAULT_PHONE         = '06.07.60.73.72';
const DEFAULT_GROUPS_MSG   = 'Groupes 15+ personnes — ouverture sur devis';

function PublicCalendarWidget() {
  const { activeLegend, phone, groupsMessage } = useCalendar();
  const displayPhone      = phone         || DEFAULT_PHONE;
  const displayGroupsMsg  = groupsMessage || DEFAULT_GROUPS_MSG;
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchKey, setSearchKey] = useState<string | null>(null);
  const [searchFound, setSearchFound] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goNext = () => { const n = navigate(year, month, 1); setYear(n.year); setMonth(n.month); };
  const goPrev = () => { const n = navigate(year, month, -1); setYear(n.year); setMonth(n.month); };
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  // Recherche instantanée avec debounce 120ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchInput.trim()) { setSearchKey(null); setSearchFound(false); return; }
    debounceRef.current = setTimeout(() => {
      const d = parseDate(searchInput);
      if (d && !isNaN(d.getTime())) {
        setYear(d.getFullYear()); setMonth(d.getMonth());
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        setSearchKey(key);
        setSearchFound(true);
      } else {
        setSearchKey(null);
        setSearchFound(false);
      }
    }, 120);
  }, [searchInput]);

  const clearSearch = () => { setSearchKey(null); setSearchInput(''); setSearchFound(false); };

  return (
    <div style={{ width: '100%', height: '100%', borderRadius: 28, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.13)', background: '#fff', display: 'flex', flexDirection: 'column' }}>

      {/* Orange header */}
      <div style={{ background: 'linear-gradient(135deg, #eb700f 0%, #f5a623 100%)', padding: '22px 24px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 40, bottom: -50, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />

        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>
          Nolimit Aventure
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', marginBottom: 14 }}>
          Calendrier d'ouverture
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <HeaderArrow onClick={goPrev}>‹</HeaderArrow>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.2px' }}>{MONTH_NAMES[month]}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 1 }}>
              <button onClick={() => setYear(y => y - 1)} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, padding: '0 4px', background: 'none', border: 'none', cursor: 'pointer' }}>‹</button>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{year}</span>
              <button onClick={() => setYear(y => y + 1)} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, padding: '0 4px', background: 'none', border: 'none', cursor: 'pointer' }}>›</button>
            </div>
          </div>
          <HeaderArrow onClick={goNext}>›</HeaderArrow>
        </div>

        {!isCurrentMonth && (
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <button onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); }} style={{ padding: '4px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
              Aujourd'hui
            </button>
          </div>
        )}
      </div>

      {/* Calendar card */}
      <div style={{ background: '#fff', padding: '16px 18px 20px', flex: 1 }}>
        {/* Search */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8f9fa', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '7px 12px' }}>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && clearSearch()}
              placeholder="15 mars 2026 ou 15/03/2026"
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: '#1f2937', outline: 'none', fontFamily: 'inherit' }}
            />
            {searchInput && (
              <button onClick={clearSearch} style={{ fontSize: 18, color: '#9ca3af', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            )}
          </div>
        </div>

        <CalendarGrid year={year} month={month} onDayClick={setSelectedDate} selectedDates={searchKey ? [searchKey] : []} highlightToday onSwipeLeft={goNext} onSwipeRight={goPrev} />
      </div>

      {/* Legend */}
      {activeLegend.length > 0 && (() => {
        const n = activeLegend.length;
        const pad   = n > 8 ? '6px 12px'  : n > 4 ? '8px 14px'  : '12px 18px';
        const hPad  = n > 8 ? '5px 10px'  : n > 4 ? '6px 11px'  : '8px 12px';
        const fs    = n > 8 ? 9.5         : n > 4 ? 11           : 12;
        const dot   = n > 8 ? 9           : n > 4 ? 10           : 12;
        const gap   = n > 8 ? 4           : n > 4 ? 5            : 8;
        const mb    = n > 8 ? 6           : n > 4 ? 7            : 10;
        return (
          <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: pad }}>
            <div style={{ background: 'linear-gradient(90deg, #4CAF50, #388E3C)', borderRadius: 8, padding: hPad, marginBottom: mb, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: n > 8 ? 12 : 14 }}>🗓️</span>
              <span style={{ fontSize: n > 8 ? 10 : 12, fontWeight: 700, color: '#fff' }}>Légende</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap }}>
              {activeLegend.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: dot, height: dot, borderRadius: 3, background: item.color, flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }} />
                  <span style={{ fontSize: fs, color: '#6b7280', lineHeight: 1.3 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Contact groupes */}
      <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '14px 18px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, flex: 1, minWidth: 160 }}>{displayGroupsMsg}</p>
        <a href={`tel:${displayPhone.replace(/[^0-9+]/g, '')}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#eb700f', borderRadius: 10, padding: '8px 14px', fontSize: 14, fontWeight: 700, textDecoration: 'none', border: '1.5px solid #eb700f', background: '#fff7f0', letterSpacing: '0.2px', flexShrink: 0 }}>
          {displayPhone}
        </a>
      </div>

      {selectedDate && <EventModal dateKey={selectedDate} readOnly onClose={() => setSelectedDate(null)} />}
    </div>
  );
}

// ── Export avec Provider ───────────────────────────────────────────────────────
interface ParkCalendarSectionProps {
  parkId: string;
}

export default function ParkCalendarSection({ parkId }: ParkCalendarSectionProps) {
  return (
    <ParkCalendarProvider parkId={parkId}>
      <PublicCalendarWidget />
    </ParkCalendarProvider>
  );
}

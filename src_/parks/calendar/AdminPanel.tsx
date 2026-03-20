// parks/calendar/AdminPanel.tsx
import { useState } from 'react';
import { useCalendar } from './ParkCalendarContext';
import CalendarGrid from './CalendarGrid';
import AdminDayModal from './AdminDayModal';
import LegendManager from './LegendManager';
import ChangePassword from './ChangePassword';

const MONTH_NAMES = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
];

function navigate(year: number, month: number, delta: number) {
  let m = month + delta, y = year;
  if (m > 11) { m = 0; y++; }
  if (m < 0) { m = 11; y--; }
  return { year: y, month: m };
}

function NavArrow({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: 42, height: 42, borderRadius: 14,
      background: 'var(--surface)', border: '1px solid var(--border)',
      fontSize: 22, color: 'var(--text-secondary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: 'var(--shadow-sm)', fontWeight: 300, flexShrink: 0,
    }}>{children}</button>
  );
}

export default function AdminPanel() {
  const { logout, setDateColorBulk, colorLegend, save, isSaving } = useCalendar();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tab, setTab] = useState<'calendar' | 'legend' | 'settings'>('calendar');
  const [multiSelect, setMultiSelect] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkColorId, setBulkColorId] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<'idle' | 'saving' | 'saved'>('idle');

  const goNext = () => { const n = navigate(year, month, 1); setYear(n.year); setMonth(n.month); };
  const goPrev = () => { const n = navigate(year, month, -1); setYear(n.year); setMonth(n.month); };

  const handleDayClick = (dateKey: string) => {
    if (multiSelect) {
      setSelected(prev => prev.includes(dateKey) ? prev.filter(d => d !== dateKey) : [...prev, dateKey]);
    } else {
      setSelectedDate(dateKey);
    }
  };

  const applyBulkColor = () => {
    setDateColorBulk(selected, bulkColorId || null);
    setSelected([]); setMultiSelect(false); setBulkColorId(null);
  };

  const cancelMultiSelect = () => { setMultiSelect(false); setSelected([]); setBulkColorId(null); };

  const handleSave = async () => {
    setSaveMsg('saving');
    await save();
    setSaveMsg('saved');
    setTimeout(() => setSaveMsg('idle'), 2000);
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ padding: '3px 10px', borderRadius: 20, background: '#dcfce7', color: '#15803d', fontSize: 11, fontWeight: 700, letterSpacing: '0.3px' }}>ADMIN</span>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>Calendrier</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleSave} disabled={isSaving} style={{
            padding: '7px 14px', borderRadius: 10,
            background: saveMsg === 'saved' ? '#dcfce7' : 'var(--text-primary)',
            color: saveMsg === 'saved' ? '#15803d' : '#fff',
            fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
          }}>
            {saveMsg === 'saving' ? 'Sauvegarde…' : saveMsg === 'saved' ? '✓ Sauvegardé' : '💾 Sauvegarder'}
          </button>
          <button onClick={logout} style={{ padding: '7px 14px', borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, background: 'var(--surface)' }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 3, background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: 3, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
        {(['calendar', 'legend', 'settings'] as const).map((key) => {
          const labels = { calendar: 'Calendrier', legend: 'Couleurs', settings: 'Sécurité' };
          return (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, padding: '7px 10px', borderRadius: 9,
              fontSize: 13, fontWeight: 500,
              background: tab === key ? 'var(--text-primary)' : 'transparent',
              color: tab === key ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}>{labels[key]}</button>
          );
        })}
      </div>

      {tab === 'legend' && <LegendManager />}
      {tab === 'settings' && <ChangePassword />}

      {tab === 'calendar' && (
        <>
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <NavArrow onClick={goPrev}>‹</NavArrow>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{MONTH_NAMES[month]}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 1 }}>
                <button onClick={() => setYear(y => y - 1)} style={{ color: 'var(--text-tertiary)', fontSize: 15, padding: '0 3px' }}>‹</button>
                <span>{year}</span>
                <button onClick={() => setYear(y => y + 1)} style={{ color: 'var(--text-tertiary)', fontSize: 15, padding: '0 3px' }}>›</button>
              </div>
            </div>
            <NavArrow onClick={goNext}>›</NavArrow>
          </div>

          {/* Calendar */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '12px 16px 20px', boxShadow: 'var(--shadow-md)', marginBottom: 16 }}>
            <CalendarGrid year={year} month={month} onDayClick={handleDayClick} selectedDates={selected} highlightToday onSwipeLeft={goNext} onSwipeRight={goPrev} />
          </div>

          {/* Multi-select toolbar */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <button onClick={() => multiSelect ? cancelMultiSelect() : setMultiSelect(true)} style={{
                padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                background: multiSelect ? '#fff0f0' : 'var(--bg)',
                color: multiSelect ? 'var(--danger)' : 'var(--text-secondary)',
                border: `1px solid ${multiSelect ? '#fca5a5' : 'var(--border)'}`,
                transition: 'all 0.15s',
              }}>
                {multiSelect ? 'Annuler' : '⬜ Multi-sélection'}
              </button>
              {multiSelect && (
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {selected.length} jour{selected.length > 1 ? 's' : ''} sélectionné{selected.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {multiSelect && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-tertiary)', marginBottom: 8 }}>Couleur à appliquer</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {colorLegend.map(item => (
                    <button key={item.id} onClick={() => setBulkColorId(item.id)} title={item.label} style={{
                      width: 34, height: 34, borderRadius: 10, background: item.color,
                      border: bulkColorId === item.id ? '3px solid var(--text-primary)' : '2px solid transparent',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                      transition: 'all 0.12s',
                      transform: bulkColorId === item.id ? 'scale(1.12)' : 'scale(1)',
                    }} />
                  ))}
                  <button onClick={() => setBulkColorId('__clear__')} title="Effacer la couleur" style={{
                    width: 34, height: 34, borderRadius: 10,
                    border: `2px solid ${bulkColorId === '__clear__' ? 'var(--text-primary)' : 'var(--border)'}`,
                    background: 'var(--bg)', fontSize: 16, color: 'var(--text-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✕</button>
                </div>
                {selected.length > 0 && (
                  <button onClick={applyBulkColor} style={{ width: '100%', padding: 10, borderRadius: 10, background: 'var(--text-primary)', color: '#fff', fontSize: 14, fontWeight: 600 }}>
                    Appliquer sur {selected.length} jour{selected.length > 1 ? 's' : ''}
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {selectedDate && <AdminDayModal dateKey={selectedDate} onClose={() => setSelectedDate(null)} />}
    </div>
  );
}

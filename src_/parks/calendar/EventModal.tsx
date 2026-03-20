// parks/calendar/EventModal.tsx
import { useEffect } from 'react';
import { useCalendar } from './ParkCalendarContext';

const MONTH_NAMES = [
  'janvier','février','mars','avril','mai','juin',
  'juillet','août','septembre','octobre','novembre','décembre',
];

function formatDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  return `${days[date.getDay()]} ${d} ${MONTH_NAMES[m - 1]} ${y}`;
}

function Backdrop({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      animation: 'fadeIn 0.15s ease',
    }}>
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } } @keyframes slideUp { from { transform: translateY(20px); opacity:0 } to { transform: translateY(0); opacity:1 } }`}</style>
      {children}
    </div>
  );
}

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 24,
  width: '100%', maxWidth: 420,
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  animation: 'slideUp 0.2s ease',
  overflow: 'hidden',
};

function ModalHeader({ dateKey, onClose }: { dateKey: string; onClose: () => void }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #eb700f, #f5a623)',
      padding: '18px 20px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.75)', marginBottom: 3 }}>
          Informations
        </p>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{formatDate(dateKey)}</p>
      </div>
      <button onClick={onClose} style={{
        width: 32, height: 32, borderRadius: 10,
        background: 'rgba(255,255,255,0.25)', color: '#fff',
        fontSize: 16, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', cursor: 'pointer',
      }}>✕</button>
    </div>
  );
}

interface EventModalProps {
  dateKey: string;
  readOnly?: boolean;
  onClose: () => void;
}

export default function EventModal({ dateKey, readOnly, onClose }: EventModalProps) {
  const { dateEvents, dateColors, colorLegend } = useCalendar();
  const event = dateEvents[dateKey];
  const colorId = dateColors[dateKey];
  const legendItem = colorId ? colorLegend.find(c => c.id === colorId) : null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (readOnly && !event && !legendItem) {
    return (
      <Backdrop onClick={onClose}>
        <div onClick={e => e.stopPropagation()} style={modalStyle}>
          <ModalHeader dateKey={dateKey} onClose={onClose} />
          <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📅</div>
            Aucune information pour ce jour
          </div>
        </div>
      </Backdrop>
    );
  }

  return (
    <Backdrop onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={modalStyle}>
        <ModalHeader dateKey={dateKey} onClose={onClose} />

        <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {legendItem && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 12,
              background: legendItem.color + '18',
              border: `1.5px solid ${legendItem.color}40`,
            }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, background: legendItem.color, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{legendItem.label}</span>
            </div>
          )}

          {event && (
            <div style={{
              padding: '16px', borderRadius: 12,
              background: '#f8f9fa', border: '1px solid #e5e7eb',
            }}>
              {(event.icon || event.title) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: event.description ? 8 : 0 }}>
                  {event.icon && <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{event.icon}</span>}
                  {event.title && <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{event.title}</h3>}
                </div>
              )}
              {event.description && (
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {event.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Backdrop>
  );
}

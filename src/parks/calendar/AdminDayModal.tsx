// parks/calendar/AdminDayModal.tsx
import { useState, useEffect } from 'react';
import { useCalendar } from './ParkCalendarContext';

const MONTH_NAMES = [
  'janvier','février','mars','avril','mai','juin',
  'juillet','août','septembre','octobre','novembre','décembre',
];

const ICON_PRESETS = [
  '🎉','🎪','🏕️','🧗','🪂','🚵','🏊','🎣','🌲','🌊',
  '🔥','⭐','🌟','🎯','🏆','📢','🎵','🎨','💡','🎭',
  '☀️','🌤️','⛅','🌧️','❄️','🌈','🎊','🎈','📍','🔔',
  '⚠️','✅','🛑','❗','📌','🎟️','👥','🚧','🎠','🏄',
];

function formatDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  return `${days[date.getDay()]} ${d} ${MONTH_NAMES[m - 1]} ${y}`;
}

interface AdminDayModalProps {
  dateKey: string;
  onClose: () => void;
}

export default function AdminDayModal({ dateKey, onClose }: AdminDayModalProps) {
  const { colorLegend, dateColors, dateEvents, setDateColor, setEvent } = useCalendar();
  const existing = dateEvents[dateKey];
  const [colorId, setColorId] = useState<string | null>(dateColors[dateKey] || null);
  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [icon, setIcon] = useState(existing?.icon || '');
  const [customIcon, setCustomIcon] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSave = () => {
    setDateColor(dateKey, colorId);
    if (title.trim() || description.trim() || icon) {
      setEvent(dateKey, { title: title.trim(), description: description.trim(), icon: icon || undefined });
    } else {
      setEvent(dateKey, null);
    }
    onClose();
  };

  const handleClear = () => {
    setDateColor(dateKey, null);
    setEvent(dateKey, null);
    onClose();
  };

  const applyCustomIcon = () => {
    const trimmed = customIcon.trim();
    if (trimmed) { setIcon(trimmed); setCustomIcon(''); }
  };

  const selectedColor = colorId ? colorLegend.find(c => c.id === colorId) : null;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        width: '100%', maxWidth: 460,
        boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', marginBottom: 3 }}>Modifier</p>
            <p style={{ fontSize: 16, fontWeight: 600 }}>{formatDate(dateKey)}</p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 10, background: 'var(--bg)',
            color: 'var(--text-secondary)', fontSize: 16, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
          {/* Color selector */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Couleur
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {colorLegend.map(item => (
                <button
                  key={item.id}
                  onClick={() => setColorId(colorId === item.id ? null : item.id)}
                  title={item.label}
                  style={{
                    width: 36, height: 36, borderRadius: 10, background: item.color,
                    border: colorId === item.id ? '3px solid var(--text-primary)' : '2px solid transparent',
                    outline: colorId === item.id ? '2px solid rgba(0,0,0,0.15)' : 'none',
                    outlineOffset: 1,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                    transition: 'all 0.12s',
                    transform: colorId === item.id ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              ))}
              {colorId && (
                <button onClick={() => setColorId(null)} title="Supprimer la couleur" style={{
                  width: 36, height: 36, borderRadius: 10,
                  border: '1.5px dashed var(--border)',
                  background: 'transparent', color: 'var(--text-tertiary)', fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              )}
            </div>
            {selectedColor && (
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: selectedColor.color, display: 'inline-block' }} />
                {selectedColor.label}
              </p>
            )}
          </div>

          {/* Event section */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Événement / Information
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <button
                onClick={() => setShowIconPicker(v => !v)}
                style={{
                  width: 48, height: 48, borderRadius: 12,
                  border: `2px solid ${showIconPicker ? 'var(--accent)' : 'var(--border)'}`,
                  background: 'var(--surface2)',
                  fontSize: icon ? 22 : 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'border-color 0.15s',
                }}
                title="Choisir une icône"
              >{icon || '＋'}</button>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {icon ? `Icône : ${icon}` : 'Aucune icône (point par défaut)'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>
                  Apparaît sur le calendrier pour signaler l'événement
                </p>
              </div>
              {icon && (
                <button onClick={() => setIcon('')} style={{ fontSize: 12, color: 'var(--danger)', padding: '4px 8px', borderRadius: 6, border: '1px solid #fca5a5', background: '#fff5f5' }}>
                  Retirer
                </button>
              )}
            </div>

            {showIconPicker && (
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 12, marginBottom: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4, marginBottom: 10 }}>
                  {ICON_PRESETS.map(emoji => (
                    <button key={emoji} onClick={() => { setIcon(icon === emoji ? '' : emoji); setShowIconPicker(false); }} style={{
                      fontSize: 20, height: 36, borderRadius: 8,
                      background: icon === emoji ? 'var(--accent-light)' : 'transparent',
                      border: icon === emoji ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.1s',
                    }} title={emoji}>{emoji}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    placeholder="Icône personnalisée (ex: 🎸)"
                    value={customIcon}
                    onChange={e => setCustomIcon(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { applyCustomIcon(); setShowIconPicker(false); } }}
                    maxLength={4}
                    style={{ flex: 1, padding: '7px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none', background: 'var(--surface)' }}
                  />
                  <button onClick={() => { applyCustomIcon(); setShowIconPicker(false); }} disabled={!customIcon.trim()} style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                    background: customIcon.trim() ? 'var(--text-primary)' : 'var(--border)',
                    color: customIcon.trim() ? '#fff' : 'var(--text-tertiary)',
                  }}>OK</button>
                </div>
              </div>
            )}

            <input type="text" placeholder="Titre (optionnel)" value={title} onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)', fontSize: 14, marginBottom: 8, background: 'var(--surface2)', outline: 'none' }}
            />
            <textarea placeholder="Description, informations, notes..." value={description} onChange={e => setDescription(e.target.value)} rows={3}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)', fontSize: 14, resize: 'vertical', background: 'var(--surface2)', outline: 'none', lineHeight: 1.5 }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 24px 20px', display: 'flex', gap: 8, justifyContent: 'space-between', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <button onClick={handleClear} style={{ padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500, border: '1px solid var(--border)', color: 'var(--danger)', background: '#fff5f5' }}>
            Tout effacer
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500, border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
              Annuler
            </button>
            <button onClick={handleSave} style={{ padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'var(--text-primary)', color: '#fff' }}>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

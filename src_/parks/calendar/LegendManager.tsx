// parks/calendar/LegendManager.tsx
import { useState } from 'react';
import { useCalendar } from './ParkCalendarContext';

const PRESET_COLORS = [
  '#4CAF50','#8BC34A','#CDDC39',
  '#FFC107','#FF9800','#FF5722',
  '#F44336','#E91E63','#9C27B0',
  '#673AB7','#3F51B5','#2196F3',
  '#03A9F4','#00BCD4','#009688',
  '#607D8B','#795548','#FFE0B2',
  '#B2DFDB','#E1BEE7',
];

interface EditRowProps {
  color: string; label: string;
  setColor: (c: string) => void; setLabel: (l: string) => void;
  onSave: () => void; onCancel: () => void;
}

function EditRow({ color, label, setColor, setLabel, onSave, onCancel }: EditRowProps) {
  return (
    <div style={{ flex: 1, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <label style={{ position: 'relative', flexShrink: 0 }}>
        <input type="color" value={color} onChange={e => setColor(e.target.value)}
          style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', width: '100%', height: '100%' }}
        />
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color, boxShadow: '0 2px 6px rgba(0,0,0,0.2)', cursor: 'pointer' }} />
      </label>
      <input type="text" value={label} onChange={e => setLabel(e.target.value)} autoFocus
        onKeyDown={e => e.key === 'Enter' && onSave()}
        style={{ flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--accent)', fontSize: 14, outline: 'none' }}
      />
      <button onClick={onSave} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'var(--text-primary)', color: '#fff' }}>✓</button>
      <button onClick={onCancel} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>✕</button>
    </div>
  );
}

export default function LegendManager() {
  const { colorLegend, addColorToLegend, updateLegendItem, removeLegendItem, dateColors } = useCalendar();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editColor, setEditColor] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [newColor, setNewColor] = useState('#4CAF50');
  const [newLabel, setNewLabel] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const usageCounts: Record<string, number> = {};
  Object.values(dateColors).forEach(id => { usageCounts[id] = (usageCounts[id] || 0) + 1; });

  const startEdit = (item: { id: string; color: string; label: string }) => {
    setEditingId(item.id); setEditColor(item.color); setEditLabel(item.label);
  };

  const saveEdit = () => {
    if (editingId) updateLegendItem(editingId, editColor, editLabel);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    addColorToLegend(newColor, newLabel.trim());
    setNewLabel(''); setNewColor('#4CAF50'); setShowAdd(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Légende des couleurs</h2>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Ces couleurs apparaissent dans la légende du calendrier public</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} style={{ padding: '7px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'var(--text-primary)', color: '#fff' }}>
            + Ajouter
          </button>
        </div>

        {showAdd && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>Nouvelle couleur</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {PRESET_COLORS.map(c => (
                <button key={c} onClick={() => setNewColor(c)} style={{
                  width: 28, height: 28, borderRadius: 8, background: c,
                  border: newColor === c ? '3px solid var(--text-primary)' : '2px solid transparent',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  transition: 'all 0.1s', transform: newColor === c ? 'scale(1.15)' : 'scale(1)',
                }} />
              ))}
              <label title="Couleur personnalisée" style={{ position: 'relative' }}>
                <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)}
                  style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                />
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'conic-gradient(red, yellow, green, cyan, blue, magenta, red)', border: '2px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🎨</div>
              </label>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: newColor, flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
              <input type="text" placeholder="Description (ex: Ouvert de 10h à 19h)" value={newLabel}
                onChange={e => setNewLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()}
                style={{ flex: 1, padding: '9px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, background: 'var(--surface)', outline: 'none' }}
              />
              <button onClick={handleAdd} disabled={!newLabel.trim()} style={{
                padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: newLabel.trim() ? 'var(--text-primary)' : 'var(--border)',
                color: newLabel.trim() ? '#fff' : 'var(--text-tertiary)', transition: 'all 0.15s',
              }}>Créer</button>
            </div>
          </div>
        )}

        {colorLegend.map((item, idx) => (
          <div key={item.id} style={{ padding: '14px 20px', borderBottom: idx < colorLegend.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            {editingId === item.id ? (
              <EditRow color={editColor} label={editLabel} setColor={setEditColor} setLabel={setEditLabel} onSave={saveEdit} onCancel={() => setEditingId(null)} />
            ) : (
              <>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: item.color, flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>
                    {usageCounts[item.id] ? `Utilisé sur ${usageCounts[item.id]} jour${usageCounts[item.id] > 1 ? 's' : ''}` : 'Non utilisé'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => startEdit(item)} style={{ padding: '5px 10px', borderRadius: 7, fontSize: 12, fontWeight: 500, border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg)' }}>Modifier</button>
                  <button onClick={() => removeLegendItem(item.id)} style={{ padding: '5px 10px', borderRadius: 7, fontSize: 12, fontWeight: 500, border: '1px solid transparent', color: 'var(--danger)', background: '#fff5f5' }}>Supprimer</button>
                </div>
              </>
            )}
          </div>
        ))}

        {colorLegend.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>Aucune couleur définie</div>
        )}
      </div>
    </div>
  );
}

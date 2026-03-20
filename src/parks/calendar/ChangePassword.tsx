// parks/calendar/ChangePassword.tsx
import { useState } from 'react';
import { useCalendar } from './ParkCalendarContext';

type StatusKey = 'success' | 'error' | 'mismatch' | 'short';

const msgs: Record<StatusKey, { color: string; bg: string; text: string }> = {
  success: { color: '#15803d', bg: '#dcfce7', text: 'Mot de passe modifié avec succès !' },
  error:   { color: '#b91c1c', bg: '#fee2e2', text: 'Mot de passe actuel incorrect.' },
  mismatch:{ color: '#b45309', bg: '#fef3c7', text: 'Les nouveaux mots de passe ne correspondent pas.' },
  short:   { color: '#b45309', bg: '#fef3c7', text: 'Le mot de passe doit faire au moins 6 caractères.' },
};

export default function ChangePassword() {
  const { changePassword } = useCalendar();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<StatusKey | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) { setStatus('mismatch'); return; }
    if (next.length < 6) { setStatus('short'); return; }
    const ok = await changePassword(current, next);
    setStatus(ok ? 'success' : 'error');
    if (ok) { setCurrent(''); setNext(''); setConfirm(''); }
  };

  const fields: { key: 'current' | 'next' | 'confirm'; label: string; value: string; setter: (v: string) => void }[] = [
    { key: 'current', label: 'Mot de passe actuel', value: current, setter: setCurrent },
    { key: 'next',    label: 'Nouveau mot de passe', value: next,    setter: setNext },
    { key: 'confirm', label: 'Confirmer le nouveau', value: confirm, setter: setConfirm },
  ];

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', maxWidth: 420 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 600 }}>Changer le mot de passe</h2>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 3 }}>
          Le mot de passe est haché avec SHA-256 — il n'est jamais stocké en clair.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {fields.map(({ key, label, value, setter }) => (
          <div key={key}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              {label}
            </label>
            <input type="password" value={value} onChange={e => { setter(e.target.value); setStatus(null); }}
              required minLength={key === 'current' ? 1 : 6}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none', background: 'var(--surface2)' }}
            />
          </div>
        ))}

        {status && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: msgs[status].bg, color: msgs[status].color, fontSize: 13, fontWeight: 500 }}>
            {msgs[status].text}
          </div>
        )}

        <button type="submit" style={{ padding: 10, borderRadius: 10, background: 'var(--text-primary)', color: '#fff', fontSize: 14, fontWeight: 600, marginTop: 4 }}>
          Mettre à jour
        </button>
      </form>

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>À propos du stockage</p>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
            Les données sont sauvegardées dans <strong>WordPress</strong> et accessibles depuis tous les appareils.
          </p>
        </div>
      </div>
    </div>
  );
}

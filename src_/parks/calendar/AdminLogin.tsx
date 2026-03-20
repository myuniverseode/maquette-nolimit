// parks/calendar/AdminLogin.tsx
import { useState } from 'react';
import { useCalendar } from './ParkCalendarContext';

export default function AdminLogin() {
  const { login } = useCalendar();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(password);
    setLoading(false);
    if (ok) {
      // isAdmin in context will flip → parent re-renders to show AdminPanel
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: '40px 36px', width: '100%', maxWidth: 380,
        boxShadow: 'var(--shadow-lg)',
        animation: shake ? 'shake 0.4s ease' : 'none',
      }}>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
          }
        `}</style>

        <div style={{
          margin: '-40px -36px 28px',
          background: 'linear-gradient(135deg, var(--orange), var(--orange-light))',
          padding: '28px 36px 24px', textAlign: 'center',
        }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 24 }}>🔒</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Espace Admin</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Nolimit Aventure</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <input
              type="password" placeholder="Mot de passe" value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              autoFocus
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                fontSize: 15, outline: 'none', transition: 'border-color 0.2s',
                background: error ? '#fff5f5' : 'var(--surface2)',
              }}
            />
            {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 6, paddingLeft: 4 }}>Mot de passe incorrect</p>}
          </div>
          <button type="submit" disabled={loading} style={{
            padding: 13, borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--orange), var(--orange-light))',
            color: '#fff', fontSize: 15, fontWeight: 700,
            opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s',
            boxShadow: '0 4px 14px rgba(240,120,0,0.3)',
          }}>{loading ? 'Vérification…' : 'Se connecter'}</button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 24 }}>
          Mot de passe par défaut : <code style={{ background: 'var(--bg)', padding: '2px 6px', borderRadius: 4 }}>admin123</code>
        </p>
      </div>
    </div>
  );
}

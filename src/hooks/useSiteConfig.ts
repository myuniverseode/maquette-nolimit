// hooks/useSiteConfig.ts
import { useState, useEffect } from 'react';
import { API_URL, API_KEY, cleanWpData } from '../config/config';

export interface SiteConfig {
  social: Record<string, string>;
  anchorMenu: Array<{ id: string; label: string; section: string }>;
  activityFilters: Array<{ id: string; label: string }>;
  accessibility: Array<{ icon: string; label: string; detail: string; available: boolean }>;
  onSiteServices: Array<{ icon: string; label: string; sub: string }>;
  pricingTypes: Array<{ name: string; priceKey: string; description: string }>;
  transport: Array<{ icon: string; title: string; desc: string }>;
  difficultyLevels: Array<{ key: string; label: string; color: string }>;
  audienceTypes: Array<{ id: string; emoji: string; label: string; desc: string; color: string }>;
}

const defaultSiteConfig: SiteConfig = {
  social: {},
  anchorMenu: [
    { id: 'parcs', label: 'Parcs', section: 'parcs' },
    { id: 'activites', label: 'Activités', section: 'activites' },
    { id: 'pour-qui', label: 'Pour Qui', section: 'pour-qui' },
    { id: 'actualites', label: 'Actualités', section: 'actualites' },
    { id: 'reserver', label: 'Réserver', section: 'reserver' },
  ],
  activityFilters: [
    { id: 'all', label: 'Toutes' }, { id: 'accrobranche', label: 'Accrobranche' },
    { id: 'team', label: 'Team Building' }, { id: 'family', label: 'Famille' },
    { id: 'extreme', label: 'Sensations fortes' },
  ],
  accessibility: [],
  onSiteServices: [],
  pricingTypes: [],
  transport: [],
  difficultyLevels: [
    { key: 'Débutant', label: 'Accessible à tous', color: '#22c55e' },
    { key: 'Intermédiaire', label: 'Quelques notions requises', color: '#eb700f' },
    { key: 'Avancé', label: 'Expérience recommandée', color: '#dc2626' },
    { key: 'Expert', label: 'Profils confirmés', color: '#7c3aed' },
  ],
  audienceTypes: [],
};

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/site-config`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json().then(_x=>cleanWpData(_x)); })
      .then(rawD => { const d = cleanWpData(rawD);
        const merged: SiteConfig = { ...defaultSiteConfig };
        for (const key of Object.keys(defaultSiteConfig) as (keyof SiteConfig)[]) {
          if (d[key] && (Array.isArray(d[key]) ? d[key].length > 0 : Object.keys(d[key]).length > 0)) {
            (merged as any)[key] = d[key];
          }
        }
        setConfig(merged);
        setError(null);
      })
      .catch(e => { console.warn('⚠️ Site config indisponible:', e); setError(e); })
      .finally(() => setLoading(false));
  }, []);

  return { config, loading, error, defaultConfig: defaultSiteConfig };
}

export function useParkConfig(slug?: string) {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    fetch(`${API_URL}/site-config/park/${slug}`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    })
      .then(r => r.ok ? r.json().then(_x=>cleanWpData(_x)) : null)
      .then(_raw80 => { const d = cleanWpData(_raw80); if (d) setConfig(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  return { config, loading };
}

export { defaultSiteConfig };

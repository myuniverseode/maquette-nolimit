// hooks/usePourQuiPages.ts
import { useState, useEffect } from 'react';
import { API_URL, API_KEY, cleanWpData } from '../config/config';

function useFetchPourQui<T>(endpoint: string, defaultData: T) {
  const [data, setData] = useState<T>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/${endpoint}`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json().then(_x=>cleanWpData(_x)); })
      .then(rawD => { const d = cleanWpData(rawD); setData({ ...defaultData, ...d }); setError(null); })
      .catch(e => { console.warn(`⚠️ ${endpoint} indisponible:`, e); setError(e); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function usePourQuiDuo() {
  return useFetchPourQui('pour-qui/duo', {
    hero: { title: "L'aventure à deux", subtitle: "" },
    activities: [], moments: [], testimonials: [],
  });
}

export function usePourQuiEnfant() {
  return useFetchPourQui('pour-qui/enfant', {
    hero: { title: "L'aventure pour les enfants", subtitle: "" },
    activities: [], safetyPoints: [], testimonials: [],
  });
}

export function usePourQuiEntreprise() {
  return useFetchPourQui('pour-qui/entreprise', {
    hero: { title: "Team Building & Corporate", subtitle: "" },
    formats: [], advantages: [], clientLogos: [], testimonials: [],
  });
}

export function usePourQuiFamille() {
  return useFetchPourQui('pour-qui/famille', {
    hero: { title: "Aventure en famille", subtitle: "" },
    ageGroups: [], familyPacks: [], practicalInfo: [], testimonials: [],
  });
}

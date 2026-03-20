// hooks/useGroupsData.ts
import { useState, useEffect } from 'react';
import { API_URL, API_KEY, cleanWpData } from '../config/config';

function useFetchGroups<T>(endpoint: string, defaultData: T) {
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

// Hub
export function useGroupsHub() {
  return useFetchGroups('groups', {
    hero: { title: "Groupes & Événements", subtitle: "", image: "" },
    categories: [], stats: [], testimonials: [],
    benefitsSection: { title: "", description: "" }, benefits: [],
    cse: { title: "", subtitle: "" },
    cta: { title: "", subtitle: "", buttonText: "", buttonUrl: "" },
  });
}

// Corporate
export function useGroupsCorporate() {
  return useFetchGroups('groups/corporate', {
    hero: { title: "Team Building & Séminaires", subtitle: "" },
    programTypes: [], programs: [], sectors: [], testimonials: [],
  });
}

// Kids
export function useGroupsKids() {
  return useFetchGroups('groups/kids', {
    hero: { title: "Enfants, Ados & Écoles", subtitle: "" },
    ageGroups: [], bookingTypes: [], testimonials: [],
  });
}

// Adults
export function useGroupsAdults() {
  return useFetchGroups('groups/adults', {
    hero: { title: "EVG · EVJF · Anniversaires · Soirées", subtitle: "" },
    eventTypes: [], addOns: [], testimonials: [],
  });
}

// Family
export function useGroupsFamily() {
  return useFetchGroups('groups/family', {
    hero: { title: "Grandes Familles & Multi-générations", subtitle: "" },
    familyPacks: [], generations: [], testimonials: [],
  });
}

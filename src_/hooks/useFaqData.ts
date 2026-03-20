// hooks/useFaqData.ts
import { useState, useEffect } from 'react';
import { API_URL, API_KEY, cleanWpData } from '../config/config';

export interface FaqItem {
  id?: number;
  question: string;
  answer: string;
  category: string;
}

export interface FaqCategory {
  id: string;
  label: string;
}

export interface FaqData {
  title: string;
  subtitle: string;
  categories: FaqCategory[];
  faqs: FaqItem[];
}

const defaultFaqData: FaqData = {
  title: 'Foire Aux Questions',
  subtitle: 'Retrouvez les réponses aux questions les plus fréquentes',
  categories: [
    { id: 'all', label: 'Toutes' },
    { id: 'booking', label: 'Réservation' },
    { id: 'tarifs', label: 'Tarifs et Paiement' },
    { id: 'safety', label: 'Sécurité et Équipement' },
    { id: 'activities', label: 'Activités' },
    { id: 'practical', label: 'Pratique' },
  ],
  faqs: [],
};

export function useFaqData() {
  const [data, setData] = useState<FaqData>(defaultFaqData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/faqs`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json().then(_x=>cleanWpData(_x)); })
      .then(rawD => { const d = cleanWpData(rawD);
        setData({
          title: d.title || defaultFaqData.title,
          subtitle: d.subtitle || defaultFaqData.subtitle,
          categories: d.categories?.length > 0 ? d.categories : defaultFaqData.categories,
          faqs: d.faqs || [],
        });
        setError(null);
      })
      .catch(e => { console.warn('⚠️ FAQ indisponible:', e); setError(e); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

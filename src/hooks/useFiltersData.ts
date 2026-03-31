// hooks/useFiltersData.ts — Hook pour les données des filtres de parcs
import { useState, useEffect } from 'react';
import { API_URL, API_KEY, cleanWpData } from '../config/config';

// ─── Types ────────────────────────────────────────────────────

export interface FilterActivity {
  id: string;
  label: string;
  emoji: string;
}

export interface FilterTransport {
  id: string;
  label: string;
  icon: string;        // nom d'un composant Lucide React (ex: "Car", "Train", "Bus")
  description: string;
}

export interface FilterEventType {
  id: string;
  label: string;
  emoji: string;
  popular?: boolean;
}

export interface FiltersData {
  activities: FilterActivity[];
  transport: FilterTransport[];
  eventTypes: FilterEventType[];
}

// ─── Données par défaut ───────────────────────────────────────
// Utilisées en cas d'échec de l'API (fallback hors-ligne ou erreur réseau)

const defaultFiltersData: FiltersData = {
  activities: [
    { id: 'accrobranche',   label: 'Accrobranche',        emoji: '🌳' },
    { id: 'paintball',      label: 'Paintball',            emoji: '🎯' },
    { id: 'escape-game',    label: 'Escape Game',          emoji: '🔐' },
    { id: 'tir-arc',        label: "Tir à l'arc",          emoji: '🏹' },
    { id: 'parcours-filet', label: 'Parcours filet',       emoji: '🕸️' },
    { id: 'archery-tag',    label: 'Archery Tag',          emoji: '🎯' },
    { id: 'tyrolienne',     label: 'Tyrolienne',           emoji: '⚡' },
    { id: 'orientation',    label: 'Orientation',          emoji: '🧭' },
    { id: 'laser-game',     label: 'Laser Game',           emoji: '🔫' },
    { id: 'parcours-kids',  label: 'Parcours Kids',        emoji: '👶' },
  ],
  transport: [
    { id: 'voiture', label: 'En voiture', icon: 'Car',   description: 'Parking gratuit'  },
    { id: 'train',   label: 'En train',   icon: 'Train', description: 'Gare à proximité' },
    { id: 'bus',     label: 'En bus',     icon: 'Bus',   description: 'Bus ou navette'   },
  ],
  eventTypes: [
    { id: 'evg',          label: 'EVG / EVJF',      emoji: '🥂', popular: false },
    { id: 'anniversaire', label: 'Anniversaire',    emoji: '🎂', popular: true  },
    { id: 'famille',      label: 'En famille',      emoji: '👨‍👩‍👧‍👦', popular: false },
    { id: 'entreprise',   label: 'Team Building',   emoji: '💼', popular: false },
    { id: 'scolaire',     label: 'Sortie scolaire', emoji: '🏫', popular: false },
    { id: 'ami',          label: 'Entre amis',      emoji: '🤝', popular: false },
  ],
};

// ─── Hook ─────────────────────────────────────────────────────

export function useFiltersData() {
  const [data, setData]       = useState<FiltersData>(defaultFiltersData);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<Error | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`${API_URL}/filters`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-NoLimit-Key': API_KEY || '',
          },
        });

        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const wpData = cleanWpData(await response.json());
        console.log('✅ Filtres chargés depuis WordPress:', wpData);

        const mergedData: FiltersData = {

          // ── Activités ──────────────────────────────────────
          activities:
            Array.isArray(wpData.activities) && wpData.activities.length > 0
              ? wpData.activities.map((a: any) => ({
                  id:    a.id    || '',
                  label: a.label || '',
                  emoji: a.emoji || '⭐',
                }))
              : defaultFiltersData.activities,

          // ── Transport ──────────────────────────────────────
          transport:
            Array.isArray(wpData.transport) && wpData.transport.length > 0
              ? wpData.transport.map((t: any) => ({
                  id:          t.id          || '',
                  label:       t.label       || '',
                  icon:        t.icon        || 'Car',
                  description: t.description || '',
                }))
              : defaultFiltersData.transport,

          // ── Types d'événement ──────────────────────────────
          eventTypes:
            Array.isArray(wpData.eventTypes) && wpData.eventTypes.length > 0
              ? wpData.eventTypes.map((e: any) => ({
                  id:      e.id      || '',
                  label:   e.label   || '',
                  emoji:   e.emoji   || '🎉',
                  popular: Boolean(e.popular),
                }))
              : defaultFiltersData.eventTypes,
        };

        setData(mergedData);
        setError(null);
      } catch (err) {
        console.warn('⚠️ Filtres WordPress indisponibles, utilisation des valeurs par défaut:', err);
        setData(defaultFiltersData);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return { data, loading, error, defaultData: defaultFiltersData };
}

export { defaultFiltersData };
// hooks/useTextBlocData.ts
import { useState, useEffect } from 'react';
import { API_URL, API_KEY, cleanWpData } from '../config/config';

// ─── Types ────────────────────────────────────────────────────

export interface TextBlocStat {
  value: string;
  label: string;
  sublabel?: string;
}

export interface TextBlocCta {
  label: string;
  url: string;
}

export interface TextBlocData {
  enabled: boolean;
  badge?: string;
  title: string;
  text?: string;
  textSecondary?: string;
  cta?: TextBlocCta;
  stats?: TextBlocStat[];
}

// ─── Valeurs par défaut ───────────────────────────────────────

const defaultTextBlocData: TextBlocData = {
  enabled: true,
  badge: 'NoLimit Aventure',
  title: "L'aventure **en pleine nature**, c'est maintenant",
  text: "Depuis plus de 10 ans, NoLimit Aventure vous propose des expériences outdoor uniques dans 5 parcs à travers la France. Accrobranche, paintball, escape game, tyrolienne… il y en a pour tous les goûts et tous les âges.",
  textSecondary: "Familles, entreprises, groupes d'amis — chaque sortie devient un souvenir inoubliable.",
  cta: {
    label: 'Découvrir nos activités',
    url: '/activites',
  },
  stats: [
    { value: '5',       label: 'Parcs en France',      sublabel: 'Île-de-France & régions' },
    { value: '+10 000', label: 'Aventuriers / an',      sublabel: 'Nous font confiance'     },
    { value: '15+',     label: 'Activités différentes', sublabel: 'Pour tous les niveaux'   },
    { value: '4.9★',   label: 'Note moyenne',           sublabel: 'Sur +1 200 avis'          },
  ],
};

// ─── Hook ─────────────────────────────────────────────────────
// IMPORTANT : loading démarre à FALSE — les données par défaut sont
// immédiatement disponibles dans le state initial, donc le composant
// s'affiche dès le premier rendu. WordPress ne fait que les remplacer.

export function useTextBlocData() {
  const [data, setData] = useState<TextBlocData>(defaultTextBlocData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTextBloc = async () => {
      try {
        const response = await fetch(`${API_URL}/text-bloc`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-NoLimit-Key': API_KEY || '',
          },
        });

        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const wpData = cleanWpData(await response.json());
        console.log('✅ TextBloc chargé depuis WordPress:', wpData);

        setData({
          enabled:       wpData.enabled !== undefined ? Boolean(wpData.enabled) : defaultTextBlocData.enabled,
          badge:         wpData.badge         || defaultTextBlocData.badge,
          title:         wpData.title         || defaultTextBlocData.title,
          text:          wpData.text          || defaultTextBlocData.text,
          textSecondary: wpData.textSecondary || defaultTextBlocData.textSecondary,
          cta: {
            label: wpData.cta?.label || defaultTextBlocData.cta?.label || '',
            url:   wpData.cta?.url   || defaultTextBlocData.cta?.url   || '/',
          },
          stats: Array.isArray(wpData.stats) && wpData.stats.length > 0
            ? wpData.stats.map((s: any) => ({
                value:    s.value    || '',
                label:    s.label    || '',
                sublabel: s.sublabel || undefined,
              }))
            : defaultTextBlocData.stats,
        });
        setError(null);
      } catch (err) {
        console.warn('⚠️ TextBloc WordPress indisponible, données par défaut conservées:', err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        // Pas de setData ici → les valeurs par défaut restent affichées
      }
    };

    fetchTextBloc();
  }, []);

  return { data, error, defaultData: defaultTextBlocData };
}

export { defaultTextBlocData };
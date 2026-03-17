// hooks/useHorairesData.ts
// Fetch les horaires d'un parc depuis WordPress + calcul du statut en temps réel

import { useState, useEffect, useCallback } from 'react';
import { API_URL, API_KEY } from '../config/config';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface FermetureExcep {
  date: string;   // 'YYYY-MM-DD'
  motif: string;
}

export interface OuvertureExcep {
  date: string;   // 'YYYY-MM-DD'
  ouverture: number;
  fermeture: number;
  label: string;
}

export interface HorairesData {
  slug: string;
  hauteSaison: {
    moisDebut: number;  // 0-indexé (3 = avril)
    moisFin: number;
    ouverture: number;
    fermeture: number;
  };
  basseSaison: {
    ouverture: number;
    fermeture: number;
  };
  joursFermes: string[];           // ['monday', 'tuesday', ...]
  fermeturesExcep: FermetureExcep[];
  ouverturesExcep: OuvertureExcep[];
  message: string;
}

export type ParkStatus =
  | 'open'          // Ouvert normalement
  | 'closes-soon'   // Ferme dans moins de 60 min
  | 'opens-soon'    // Ouvre dans moins de 60 min
  | 'closed'        // Fermé
  | 'exceptional-open'   // Ouvert en horaire exceptionnel
  | 'exceptional-closed' // Fermé exceptionnellement

export interface StatusResult {
  status: ParkStatus;
  label: string;
  sub: string;
  openHour: number;
  closeHour: number;
  isHighSeason: boolean;
}

// ─── Defaults ──────────────────────────────────────────────────────────────

export const defaultHoraires: HorairesData = {
  slug: 'default',
  hauteSaison:  { moisDebut: 3, moisFin: 8, ouverture: 9,  fermeture: 19 },
  basseSaison:  { ouverture: 11, fermeture: 17 },
  joursFermes:  ['monday'],
  fermeturesExcep: [],
  ouverturesExcep: [],
  message: '',
};

// ─── Helpers ───────────────────────────────────────────────────────────────

const DAY_NAMES: Record<number, string> = {
  0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday',
  4: 'thursday', 5: 'friday', 6: 'saturday',
};

const DAY_NAMES_FR: Record<number, string> = {
  0: 'dimanche', 1: 'lundi', 2: 'mardi', 3: 'mercredi',
  4: 'jeudi', 5: 'vendredi', 6: 'samedi',
};

function toDateKey(date: Date): string {
  // 'YYYY-MM-DD' en heure locale
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calcule le statut d'ouverture du parc à un instant donné.
 * Toute la logique reste côté React — WordPress ne fait que stocker les données.
 */
export function computeStatus(h: HorairesData, now: Date = new Date()): StatusResult {
  const month      = now.getMonth();   // 0-11
  const dayOfWeek  = now.getDay();     // 0=dim
  const dayName    = DAY_NAMES[dayOfWeek];
  const todayKey   = toDateKey(now);
  const curMin     = now.getHours() * 60 + now.getMinutes();

  // 1. Ouverture exceptionnelle ?
  const exOpen = h.ouverturesExcep.find(e => e.date === todayKey);
  if (exOpen) {
    const openMin  = exOpen.ouverture  * 60;
    const closeMin = exOpen.fermeture  * 60;
    if (curMin >= openMin && curMin < closeMin) {
      const closesIn60 = curMin >= closeMin - 60;
      return {
        status: closesIn60 ? 'closes-soon' : 'exceptional-open',
        label:  closesIn60 ? 'Ferme bientôt' : (exOpen.label || 'Ouverture spéciale'),
        sub:    `Fermeture à ${exOpen.fermeture}h00`,
        openHour: exOpen.ouverture, closeHour: exOpen.fermeture, isHighSeason: false,
      };
    }
    // Hors des horaires exceptionnels → fermé ce jour (on ne tombe pas sur le traitement normal)
    if (curMin < exOpen.ouverture * 60) {
      const opensIn60 = curMin >= exOpen.ouverture * 60 - 60;
      return {
        status: opensIn60 ? 'opens-soon' : 'exceptional-open',
        label:  opensIn60 ? 'Ouvre bientôt' : (exOpen.label || 'Ouverture spéciale'),
        sub:    `Ouverture à ${exOpen.ouverture}h00`,
        openHour: exOpen.ouverture, closeHour: exOpen.fermeture, isHighSeason: false,
      };
    }
    return {
      status: 'closed',
      label: 'Fermé', 
      sub: `Ouvre demain`,
      openHour: exOpen.ouverture, closeHour: exOpen.fermeture, isHighSeason: false,
    };
  }

  // 2. Fermeture exceptionnelle ?
  const exClosed = h.fermeturesExcep.find(e => e.date === todayKey);
  if (exClosed) {
    return {
      status: 'exceptional-closed',
      label: 'Fermé exceptionnellement',
      sub: exClosed.motif || 'Fermeture exceptionnelle',
      openHour: 0, closeHour: 0, isHighSeason: false,
    };
  }

  // 3. Jour de fermeture hebdomadaire ?
  if (h.joursFermes.includes(dayName)) {
    const isHighSeason = month >= h.hauteSaison.moisDebut && month <= h.hauteSaison.moisFin;
    const openHour = isHighSeason ? h.hauteSaison.ouverture : h.basseSaison.ouverture;
    return {
      status: 'closed',
      label: 'Fermé',
      sub: `Fermé le ${DAY_NAMES_FR[dayOfWeek]}`,
      openHour, closeHour: 0, isHighSeason,
    };
  }

  // 4. Horaires standards
  const isHighSeason = month >= h.hauteSaison.moisDebut && month <= h.hauteSaison.moisFin;
  const openHour  = isHighSeason ? h.hauteSaison.ouverture : h.basseSaison.ouverture;
  const closeHour = isHighSeason ? h.hauteSaison.fermeture : h.basseSaison.fermeture;
  const openMin   = openHour  * 60;
  const closeMin  = closeHour * 60;

  if (curMin >= openMin && curMin < closeMin) {
    const closesIn60 = curMin >= closeMin - 60;
    return {
      status: closesIn60 ? 'closes-soon' : 'open',
      label:  closesIn60 ? 'Ferme bientôt' : 'Ouvert maintenant',
      sub:    `Fermeture à ${closeHour}h00`,
      openHour, closeHour, isHighSeason,
    };
  }

  if (curMin < openMin) {
    const opensIn60 = curMin >= openMin - 60;
    return {
      status: opensIn60 ? 'opens-soon' : 'closed',
      label:  opensIn60 ? 'Ouvre bientôt' : 'Fermé',
      sub:    `Ouverture à ${openHour}h00`,
      openHour, closeHour, isHighSeason,
    };
  }

  // Après fermeture
  return {
    status: 'closed',
    label: 'Fermé',
    sub: `Ouvre demain à ${openHour}h00`,
    openHour, closeHour, isHighSeason,
  };
}

// ─── Hook principal ────────────────────────────────────────────────────────

interface UseHorairesReturn {
  horaires: HorairesData;
  status: StatusResult;
  loading: boolean;
  error: string | null;
  defaultHoraires: HorairesData;
  /** Force un recalcul du statut (utile pour un refresh toutes les minutes) */
  refresh: () => void;
}

export function useHorairesData(parkSlug?: string): UseHorairesReturn {
  const [horaires, setHoraires] = useState<HorairesData>(() => ({
    ...defaultHoraires, 
    slug: parkSlug || 'default'
  }));
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [tick,     setTick]     = useState(0);

  const refresh = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    // Si pas de slug, on utilise directement les données par défaut
    if (!parkSlug) {
      console.log('ℹ️ Aucun slug fourni, utilisation des données par défaut');
      setHoraires({ ...defaultHoraires, slug: 'default' });
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const fetchHoraires = async () => {
      try {
        console.log('🔑 Clé API depuis import.meta.env:', API_KEY);
        console.log('📍 Slug du parc:', parkSlug);

        const response = await fetch(`${API_URL}/horaires/${parkSlug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-NoLimit-Key': API_KEY || 'EMPTY_KEY',
          },
        });

        console.log('🌐 Response status horaires:', response.status);

        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const data: HorairesData = await response.json();

        console.log('📦 Horaires reçus:', data);

        if (!cancelled) {
          // Fusionner avec les valeurs par défaut
          const formattedData: HorairesData = {
            slug: data.slug || parkSlug,
            hauteSaison: {
              moisDebut: data.hauteSaison?.moisDebut ?? defaultHoraires.hauteSaison.moisDebut,
              moisFin: data.hauteSaison?.moisFin ?? defaultHoraires.hauteSaison.moisFin,
              ouverture: data.hauteSaison?.ouverture ?? defaultHoraires.hauteSaison.ouverture,
              fermeture: data.hauteSaison?.fermeture ?? defaultHoraires.hauteSaison.fermeture,
            },
            basseSaison: {
              ouverture: data.basseSaison?.ouverture ?? defaultHoraires.basseSaison.ouverture,
              fermeture: data.basseSaison?.fermeture ?? defaultHoraires.basseSaison.fermeture,
            },
            joursFermes: Array.isArray(data.joursFermes) ? data.joursFermes : defaultHoraires.joursFermes,
            fermeturesExcep: Array.isArray(data.fermeturesExcep) ? data.fermeturesExcep : defaultHoraires.fermeturesExcep,
            ouverturesExcep: Array.isArray(data.ouverturesExcep) ? data.ouverturesExcep : defaultHoraires.ouverturesExcep,
            message: data.message || defaultHoraires.message,
          };

          console.log('✅ Horaires formatés:', formattedData);
          setHoraires(formattedData);
          setError(null);
        }
      } catch (err) {
        console.warn(
          `⚠️ Horaires WordPress indisponibles pour "${parkSlug}", fallback utilisé:`,
          err
        );
        if (!cancelled) {
          setHoraires({ ...defaultHoraires, slug: parkSlug });
          setError('Horaires chargés depuis le cache local');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHoraires();
    return () => { cancelled = true; };
  }, [parkSlug]);

  // Recalcul auto du statut toutes les minutes
  useEffect(() => {
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  // tick est volontairement utilisé pour forcer le recalcul
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const status = computeStatus(horaires, new Date());

  return { 
    horaires, 
    status, 
    loading, 
    error, 
    defaultHoraires,
    refresh 
  };
}

// ─── Hook global (tous les parcs) ─────────────────────────────────────────

interface UseAllHorairesReturn {
  allHoraires: Record<string, HorairesData>;
  loading: boolean;
  error: string | null;
  defaultHoraires: HorairesData;
}

export function useAllHorairesData(): UseAllHorairesReturn {
  const [allHoraires, setAllHoraires] = useState<Record<string, HorairesData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        console.log('🔑 Récupération de tous les horaires avec clé:', API_KEY);

        const response = await fetch(`${API_URL}/horaires`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-NoLimit-Key': API_KEY || 'EMPTY_KEY',
          },
        });

        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const data: Record<string, HorairesData> = await response.json();

        console.log('📦 Tous les horaires reçus:', data);

        if (data && Object.keys(data).length > 0) {
          setAllHoraires(data);
          setError(null);
        } else {
          console.log('⚠️ API vide, pas d\'horaires disponibles');
          setAllHoraires({});
        }
      } catch (err) {
        console.warn('⚠️ Horaires globaux indisponibles:', err);
        setError('Horaires chargés depuis le cache local');
        setAllHoraires({});
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { 
    allHoraires, 
    loading, 
    error,
    defaultHoraires 
  };
}
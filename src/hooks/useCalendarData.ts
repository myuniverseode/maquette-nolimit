import { cleanWpData } from '../config/config';
// hooks/useCalendarData.ts
// Consomme l'API du plugin NoLimit Calendrier Admin
// GET /wp-json/nolimit/v1/calendar/{park_id}
// Endpoint public — pas d'authentification requise

import { useState, useEffect, useCallback } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface CalendarLegendItem {
  id: string;     // ex: "c1710000000000"
  color: string;  // ex: "#22c55e"
  label: string;  // ex: "Ouvert 9h–18h"
}

export interface CalendarEvent {
  title: string;
  description: string;
  icon: string;  // emoji
}

export interface CalendarData {
  /** Couleurs définies par l'admin */
  legend: CalendarLegendItem[];
  /** dateColors : { "YYYY-MM-DD": "legend_id" } */
  dateColors: Record<string, string>;
  /** dateEvents : { "YYYY-MM-DD": CalendarEvent } */
  dateEvents: Record<string, CalendarEvent>;
  /** Téléphone du parc */
  phone: string;
  /** Message pour les groupes */
  groupsMessage: string;
}

export interface ParkDayStatus {
  /** null = aucune info pour ce jour */
  legend: CalendarLegendItem | null;
  /** Événement du jour (icône, titre, description) */
  event: CalendarEvent | null;
  /** Couleur hex à afficher (#22c55e, #ef4444…) */
  color: string;
  /** Texte principal du badge (ex: "Ouvert 9h–18h") */
  label: string;
  /** Texte secondaire (titre de l'événement si présent) */
  sub: string;
  /** Le parc est-il considéré ouvert ? (heuristique sur la couleur verte) */
  isOpen: boolean;
}

// ─── Valeurs par défaut ─────────────────────────────────────────────────────

const DEFAULT_CALENDAR: CalendarData = {
  legend: [],
  dateColors: {},
  dateEvents: {},
  phone: '',
  groupsMessage: '',
};

const DEFAULT_STATUS: ParkDayStatus = {
  legend: null,
  event: null,
  color: '#9ca3af',
  label: 'Statut inconnu',
  sub: '',
  isOpen: false,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Formate la date locale en YYYY-MM-DD (sans décalage UTC) */
function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Couleur verte = parc ouvert (heuristique) */
function isGreenish(hex: string): boolean {
  if (!hex || hex.length < 7) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return g > r + 20 && g > b + 20;
}

/** Calcule le statut du parc pour un jour donné */
export function computeDayStatus(cal: CalendarData, date: Date = new Date()): ParkDayStatus {
  const key = todayKey(date);

  const legendId = cal.dateColors[key] ?? null;
  const event    = cal.dateEvents[key]  ?? null;
  // Lookup direct sur l'id — pas de double interprétation
  const legend   = legendId
    ? (cal.legend.find(l => l.id === legendId) ?? null)
    : null;

  if (!legend) {
    return {
      ...DEFAULT_STATUS,
      event,
      sub: event?.title ?? '',
    };
  }

  return {
    legend,
    event,
    color:  legend.color,
    label:  legend.label,
    sub:    event?.title ?? '',
    isOpen: isGreenish(legend.color),
  };
}

// ─── Normalisation données API ───────────────────────────────────────────────

function normalizeCalendar(data: Partial<CalendarData>): CalendarData {
  return {
    legend:        Array.isArray(data.legend)                                    ? data.legend        : [],
    dateColors:    (data.dateColors  && !Array.isArray(data.dateColors))         ? data.dateColors    : {},
    dateEvents:    (data.dateEvents  && !Array.isArray(data.dateEvents))         ? data.dateEvents    : {},
    phone:         data.phone         ?? '',
    groupsMessage: data.groupsMessage ?? '',
  };
}

// ─── Hook principal ─────────────────────────────────────────────────────────

interface UseCalendarReturn {
  calendar: CalendarData;
  status: ParkDayStatus;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useCalendarData(parkId: string | undefined): UseCalendarReturn {
  const [calendar, setCalendar] = useState<CalendarData>(DEFAULT_CALENDAR);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [tick, setTick]         = useState(0);

  const refresh = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    if (!parkId) {
      setCalendar(DEFAULT_CALENDAR);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    import('../config/config').then(({ API_URL }) => {
      // ─────────────────────────────────────────────────────────────────────
      // CORRECTIF CACHE : on ajoute cache:'no-store' pour que le navigateur
      // n'utilise pas la réponse de Chevry pour tous les autres parcs.
      // Sans ça, GET /calendar/nolimit-nemours retourne le cache de /calendar/nolimit-chevry.
      // ─────────────────────────────────────────────────────────────────────
      return fetch(`${API_URL}/calendar/${parkId}`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',   // ← correctif principal
      });
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json().then(d => cleanWpData(d));
      })
      .then((data: Partial<CalendarData>) => {
        if (cancelled) return;
        setCalendar(normalizeCalendar(data));
        setError(null);
      })
      .catch(err => {
        if (cancelled) return;
        console.warn(`⚠️ Calendrier indisponible pour "${parkId}":`, err);
        setError('Calendrier non disponible');
        setCalendar(DEFAULT_CALENDAR);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };

  // tick inclus : permet au refresh() manuel ET à l'intervalle de re-fetcher
  }, [parkId, tick]);

  // Refresh toutes les 5 minutes (changement d'horaire possible en journée)
  useEffect(() => {
    const interval = setInterval(refresh, 5 * 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const status = computeDayStatus(calendar, new Date());

  return { calendar, status, loading, error, refresh };
}

// ─── Hook pour tous les parcs ────────────────────────────────────────────────

interface UseAllCalendarsReturn {
  calendars: Record<string, CalendarData>;
  statuses: Record<string, ParkDayStatus>;
  loading: boolean;
}

export function useAllCalendarsData(parkIds: string[]): UseAllCalendarsReturn {
  const [calendars, setCalendars] = useState<Record<string, CalendarData>>({});
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!parkIds.length) { setLoading(false); return; }

    import('../config/config').then(({ API_URL }) =>
      Promise.all(
        parkIds.map(id =>
          fetch(`${API_URL}/calendar/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',   // ← même correctif pour le hook multi-parcs
          })
            .then(r => r.ok ? r.json().then(d => cleanWpData(d)) : null)
            .then((data: Partial<CalendarData> | null) => ({
              id,
              cal: data ? normalizeCalendar(data) : DEFAULT_CALENDAR,
            }))
            .catch(() => ({ id, cal: DEFAULT_CALENDAR }))
        )
      )
    ).then(results => {
      const map: Record<string, CalendarData> = {};
      results.forEach(({ id, cal }) => { map[id] = cal; });
      setCalendars(map);
    }).catch(() => {
      setCalendars({});
    }).finally(() => setLoading(false));

  // parkIds.join garantit que l'effet se relance si le tableau change
  }, [parkIds.join(',')]);

  const statuses: Record<string, ParkDayStatus> = {};
  const today = new Date();
  Object.entries(calendars).forEach(([id, cal]) => {
    statuses[id] = computeDayStatus(cal, today);
  });

  return { calendars, statuses, loading };
}
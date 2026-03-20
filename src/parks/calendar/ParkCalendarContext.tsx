// parks/calendar/ParkCalendarContext.tsx
// Contexte calendrier avec backend WordPress REST API (par parc)
// Remplace localStorage par des appels API — les données sont partagées entre tous les appareils

import {
  createContext, useContext, useState, useEffect,
  useCallback, ReactNode,
} from 'react';
import { API_URL, API_KEY } from '../../config/config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface LegendItem { id: string; color: string; label: string }
export interface EventData   { title: string; icon?: string; description?: string }

export interface CalendarData {
  legend:        LegendItem[];
  dateColors:    Record<string, string>;   // "2025-06-15" → colorId
  dateEvents:    Record<string, EventData>;
  phone?:        string;
  groupsMessage?: string;
}

interface CalendarContextValue {
  isAdmin:         boolean;
  isLoading:       boolean;
  isSaving:        boolean;
  colorLegend:     LegendItem[];
  activeLegend:    LegendItem[];
  dateColors:      Record<string, string>;
  dateEvents:      Record<string, EventData>;
  phone:           string;
  groupsMessage:   string;
  login:           (password: string) => Promise<boolean>;
  logout:          () => void;
  changePassword:  (current: string, newPwd: string) => Promise<boolean>;
  setDateColor:    (dateKey: string, colorId: string | null) => void;
  setDateColorBulk:(dateKeys: string[], colorId: string | null) => void;
  setEvent:        (dateKey: string, event: EventData | null) => void;
  addColorToLegend:(color: string, label: string) => string;
  updateLegendItem:(id: string, color: string, label: string) => void;
  removeLegendItem:(id: string) => void;
  save:            () => Promise<void>;
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

// ─── Sécurité (même implémentation que le calendrier standalone) ───────────────
const SALT = 'nolimit_aventure_cal_v1';
const SESSION_KEY = 'cal_session';
const SESSION_TTL = 8 * 60 * 60 * 1000;

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + SALT);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function checkSession(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const { expires } = JSON.parse(raw);
    if (Date.now() > expires) { sessionStorage.removeItem(SESSION_KEY); return false; }
    return true;
  } catch { return false; }
}

function createSession() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    token: crypto.randomUUID(),
    expires: Date.now() + SESSION_TTL,
  }));
}

// ─── Couleurs par défaut ────────────────────────────────────────────────────
const DEFAULT_LEGEND: LegendItem[] = [
  { id: 'c1', color: '#4CAF50', label: 'Ouvert de 10h00 à 19h00' },
  { id: 'c2', color: '#FFC107', label: 'Ouvert de 10h00 à 18h00 (selon luminosité)' },
  { id: 'c3', color: '#FF9800', label: 'Ouvert de 13h00 à 19h00' },
  { id: 'c4', color: '#FF5722', label: 'Ouvert de 13h00 à 18h00 (selon luminosité)' },
  { id: 'c5', color: '#2196F3', label: 'Ouvert de 10h00 à 17h00 (selon luminosité)' },
  { id: 'c6', color: '#9C27B0', label: 'Ouvert de 13h00 à 17h00 (selon luminosité)' },
  { id: 'c7', color: '#FFE0B2', label: 'Ouvert sur réservation pour les groupes' },
];

// ─── Fetch helper ─────────────────────────────────────────────────────────────
async function fetchCalendarData(parkId: string): Promise<CalendarData> {
  const res = await fetch(`${API_URL}/calendar/${parkId}`);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  const data = await res.json();
  return {
    legend:        Array.isArray(data.legend) ? data.legend : DEFAULT_LEGEND,
    dateColors:    (data.dateColors && !Array.isArray(data.dateColors)) ? data.dateColors : {},
    dateEvents:    (data.dateEvents && !Array.isArray(data.dateEvents)) ? data.dateEvents : {},
    phone:         data.phone         || '',
    groupsMessage: data.groupsMessage || '',
  };
}

async function saveCalendarData(parkId: string, data: CalendarData): Promise<void> {
  const res = await fetch(`${API_URL}/calendar/${parkId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-NoLimit-Key': API_KEY || '',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur sauvegarde ${res.status}`);
}

// ─── Provider ──────────────────────────────────────────────────────────────────
interface Props { parkId: string; children: ReactNode }

export function ParkCalendarProvider({ parkId, children }: Props) {
  const qClient = useQueryClient();
  const queryKey = ['calendar', parkId];

  // Chargement depuis WP
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchCalendarData(parkId),
    staleTime: 2 * 60 * 1000,
    placeholderData: { legend: DEFAULT_LEGEND, dateColors: {}, dateEvents: {} },
  });

  // État local pour les modifications non encore sauvegardées
  const [legend,        setLegend]        = useState<LegendItem[]>(DEFAULT_LEGEND);
  const [dateColors,    setDateColors]    = useState<Record<string, string>>({});
  const [dateEvents,    setDateEvents]    = useState<Record<string, EventData>>({});
  const [phone,         setPhone]         = useState('');
  const [groupsMessage, setGroupsMessage] = useState('');
  const [isAdmin,       setIsAdmin]       = useState(() => checkSession());

  // Sync données WP → état local quand elles arrivent
  useEffect(() => {
    if (data) {
      setLegend(data.legend);
      setDateColors(data.dateColors);
      setDateEvents(data.dateEvents);
      setPhone(data.phone        || '');
      setGroupsMessage(data.groupsMessage || '');
    }
  }, [data]);

  // Mutation de sauvegarde
  const saveMutation = useMutation({
    mutationFn: () => saveCalendarData(parkId, { legend, dateColors, dateEvents, phone, groupsMessage }),
    onSuccess: () => qClient.invalidateQueries({ queryKey }),
  });

  // Vérification session périodique
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAdmin && !checkSession()) setIsAdmin(false);
    }, 60_000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (password: string): Promise<boolean> => {
    const hash = await hashPassword(password);
    try {
      const res = await fetch(`${API_URL}/calendar/${parkId}/check-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash }),
      });
      const json = await res.json();
      if (json.valid || json.first_run) {
        createSession();
        setIsAdmin(true);
        return true;
      }
      return false;
    } catch {
      // Fallback offline : hash stocké en local (premier lancement)
      const stored = localStorage.getItem(`cal_pwd_${parkId}`);
      if (!stored) {
        // Première connexion — initialiser avec le hash
        localStorage.setItem(`cal_pwd_${parkId}`, hash);
        createSession(); setIsAdmin(true); return true;
      }
      if (stored === hash) { createSession(); setIsAdmin(true); return true; }
      return false;
    }
  }, [parkId]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAdmin(false);
  }, []);

  const changePassword = useCallback(async (current: string, newPwd: string): Promise<boolean> => {
    const currentHash = await hashPassword(current);
    const newHash     = await hashPassword(newPwd);
    try {
      const res = await fetch(`${API_URL}/calendar/${parkId}/update-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentHash, newHash }),
      });
      return res.ok;
    } catch {
      const stored = localStorage.getItem(`cal_pwd_${parkId}`);
      if (stored !== currentHash) return false;
      localStorage.setItem(`cal_pwd_${parkId}`, newHash);
      return true;
    }
  }, [parkId]);

  // ── Mutations données ─────────────────────────────────────────────────────
  const setDateColor = useCallback((key: string, colorId: string | null) => {
    setDateColors(prev => {
      const n = { ...prev };
      if (!colorId) delete n[key]; else n[key] = colorId;
      return n;
    });
  }, []);

  const setDateColorBulk = useCallback((keys: string[], colorId: string | null) => {
    setDateColors(prev => {
      const n = { ...prev };
      keys.forEach(k => { if (!colorId) delete n[k]; else n[k] = colorId; });
      return n;
    });
  }, []);

  const setEvent = useCallback((key: string, event: EventData | null) => {
    setDateEvents(prev => {
      const n = { ...prev };
      if (!event) delete n[key]; else n[key] = event;
      return n;
    });
  }, []);

  const addColorToLegend = useCallback((color: string, label: string): string => {
    const id = 'c' + Date.now();
    setLegend(prev => [...prev, { id, color, label }]);
    return id;
  }, []);

  const updateLegendItem = useCallback((id: string, color: string, label: string) => {
    setLegend(prev => prev.map(item => item.id === id ? { ...item, color, label } : item));
  }, []);

  const removeLegendItem = useCallback((id: string) => {
    setLegend(prev => prev.filter(item => item.id !== id));
    setDateColors(prev => {
      const n = { ...prev };
      Object.keys(n).forEach(k => { if (n[k] === id) delete n[k]; });
      return n;
    });
  }, []);

  const save = useCallback(async () => {
    await saveMutation.mutateAsync();
  }, [saveMutation]);

  const usedColorIds = [...new Set(Object.values(dateColors))];
  const activeLegend = legend.filter(item => usedColorIds.includes(item.id));

  return (
    <CalendarContext.Provider value={{
      isAdmin, isLoading, isSaving: saveMutation.isPending,
      colorLegend: legend, activeLegend,
      dateColors, dateEvents,
      phone, groupsMessage,
      login, logout, changePassword,
      setDateColor, setDateColorBulk, setEvent,
      addColorToLegend, updateLegendItem, removeLegendItem,
      save,
    }}>
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendar = () => {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used inside ParkCalendarProvider');
  return ctx;
};

// hooks/useBookingData.ts
import { useState, useEffect } from 'react';
import { API_URL, API_KEY, cleanWpData } from '../config/config';

export interface BookingConfig {
  title: string; subtitle: string;
  quickleUrl: string; quickleEnabled: boolean;
  minParticipants: number; maxParticipants: number;
  timeSlots: Array<{ value: string; label: string }>;
  closedMessage: string; enabled: boolean;
}

const defaultBookingConfig: BookingConfig = {
  title: 'Réservation', subtitle: 'Choisissez votre créneau',
  quickleUrl: '', quickleEnabled: true,
  minParticipants: 1, maxParticipants: 30,
  timeSlots: [
    { value: '09:00', label: '9h00' }, { value: '10:00', label: '10h00' },
    { value: '11:00', label: '11h00' }, { value: '14:00', label: '14h00' },
    { value: '15:00', label: '15h00' }, { value: '16:00', label: '16h00' },
  ],
  closedMessage: '', enabled: true,
};

export function useBookingData() {
  const [config, setConfig] = useState<BookingConfig>(defaultBookingConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/booking/config`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json().then(_x=>cleanWpData(_x)); })
      .then(rawD => { const d = cleanWpData(rawD); setConfig({ ...defaultBookingConfig, ...d }); setError(null); })
      .catch(e => { console.warn('⚠️ Booking config indisponible:', e); setError(e); })
      .finally(() => setLoading(false));
  }, []);

  return { config, loading, error };
}

export { defaultBookingConfig };

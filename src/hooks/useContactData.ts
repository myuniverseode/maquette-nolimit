// hooks/useContactData.ts
import { useState, useEffect } from 'react';
import { API_URL, API_KEY } from '../config/config';

export interface ContactConfig {
  title: string;
  subtitle: string;
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  openingHours: string;
  subjects: string[];
}

const defaultContactData: ContactConfig = {
  title: 'Contactez-nous',
  subtitle: "Une question ? N'hésitez pas à nous écrire",
  phone: '01 23 45 67 89',
  email: 'contact@nolimit-aventure.fr',
  address: '',
  mapUrl: '',
  openingHours: 'Du lundi au dimanche, 9h-19h (haute saison)',
  subjects: ['Information générale', 'Réservation', 'Groupe / Événement', 'Réclamation', 'Partenariat', 'Autre'],
};

export function useContactData() {
  const [data, setData] = useState<ContactConfig>(defaultContactData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/contact`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    })
      .then(res => { if (!res.ok) throw new Error('Erreur API Contact'); return res.json(); })
      .then(wpData => {
        console.log('✅ Contact config chargée depuis WordPress:', wpData);
        setData({
          title: wpData.title || defaultContactData.title,
          subtitle: wpData.subtitle || defaultContactData.subtitle,
          phone: wpData.phone || defaultContactData.phone,
          email: wpData.email || defaultContactData.email,
          address: wpData.address || defaultContactData.address,
          mapUrl: wpData.mapUrl || defaultContactData.mapUrl,
          openingHours: wpData.openingHours || defaultContactData.openingHours,
          subjects: wpData.subjects?.length ? wpData.subjects : defaultContactData.subjects,
        });
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ Contact WordPress indisponible:', err.message);
        setData(defaultContactData);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error, defaultData: defaultContactData };
}

export { defaultContactData };

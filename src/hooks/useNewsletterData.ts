// hooks/useNewsletterData.ts - Hook pour la section Newsletter
import { useState, useEffect } from 'react';
import { NewsletterData } from '../types';
import { API_URL, API_KEY } from '../config/config';

const defaultNewsletterData: NewsletterData = {
  title: 'Restez informé de nos aventures',
  subtitle: "Recevez nos offres exclusives, nouveautés et conseils d'aventure directement dans votre boîte mail",
  placeholder: 'Votre adresse email',
  buttonText: "S'inscrire",
  privacyNotice: 'En vous inscrivant, vous acceptez de recevoir nos emails. Vous pouvez vous désabonner à tout moment.',
  successMessage: 'Merci ! Vous êtes inscrit à notre newsletter',
  benefits: [
    { icon: '🎟️', title: 'Offres exclusives', description: 'Réductions réservées aux abonnés' },
    { icon: '🎯', title: 'Nouveautés en avant-première', description: 'Soyez les premiers informés' },
    { icon: '💡', title: "Conseils d'experts", description: 'Astuces pour profiter au maximum' },
  ],
  apiEndpoint: '/wp-json/nolimit/v1/newsletter/subscribe',
};

export function useNewsletterData() {
  const [data, setData] = useState<NewsletterData>(defaultNewsletterData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/newsletter`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur API Newsletter');
        return res.json();
      })
      .then(wpData => {
        console.log('✅ Newsletter config chargée depuis WordPress:', wpData);
        const mergedData: NewsletterData = {
          title: wpData.title || defaultNewsletterData.title,
          subtitle: wpData.subtitle || defaultNewsletterData.subtitle,
          placeholder: wpData.placeholder || defaultNewsletterData.placeholder,
          buttonText: wpData.buttonText || wpData.button_text || defaultNewsletterData.buttonText,
          privacyNotice: wpData.privacyNotice || wpData.privacy_notice || defaultNewsletterData.privacyNotice,
          successMessage: wpData.successMessage || wpData.success_message || defaultNewsletterData.successMessage,
          benefits: wpData.benefits?.length
            ? wpData.benefits.map((b: any, i: number) => ({
                icon: b.icon || defaultNewsletterData.benefits[i]?.icon || '✨',
                title: b.title || defaultNewsletterData.benefits[i]?.title || '',
                description: b.description || b.desc || defaultNewsletterData.benefits[i]?.description || '',
              }))
            : defaultNewsletterData.benefits,
          apiEndpoint: wpData.apiEndpoint || defaultNewsletterData.apiEndpoint,
        };
        setData(mergedData);
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ Newsletter WordPress indisponible:', err.message);
        setData(defaultNewsletterData);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error, defaultData: defaultNewsletterData };
}

export { defaultNewsletterData };

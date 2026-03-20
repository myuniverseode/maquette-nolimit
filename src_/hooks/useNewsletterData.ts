// hooks/useNewsletterData.ts - Hook pour la section Newsletter
import { useState, useEffect } from 'react';
import { NewsletterData, NewsletterBenefit } from '../types';
import { API_URL, API_KEY, cleanWpData } from '../config/config';

// ===== DONNÉES PAR DÉFAUT =====
const defaultNewsletterData: NewsletterData = {
  title: 'Restez informé de nos aventures',
  subtitle: "Recevez nos offres exclusives, nouveautés et conseils d'aventure directement dans votre boîte mail",
  placeholder: 'Votre adresse email',
  buttonText: "S'inscrire",
  privacyNotice: 'En vous inscrivant, vous acceptez de recevoir nos emails. Vous pouvez vous désabonner à tout moment.',
  successMessage: 'Merci ! Vous êtes inscrit à notre newsletter',
  benefits: [
    { icon: '🎟️', title: 'Offres exclusives',            description: 'Réductions réservées aux abonnés' },
    { icon: '🎯', title: 'Nouveautés en avant-première',  description: 'Soyez les premiers informés' },
    { icon: '💡', title: "Conseils d'experts",             description: 'Astuces pour profiter au maximum' },
  ],
  apiEndpoint: '/wp-json/nolimit/v1/newsletter/subscribe'
};

export function useNewsletterData() {
  const [data, setData] = useState<NewsletterData>(defaultNewsletterData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const response = await fetch(`${API_URL}/newsletter`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-NoLimit-Key': API_KEY || '',
          },
        });

        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const wpData = cleanWpData(await response.json());
        console.log('✅ Newsletter config chargée depuis WordPress:', wpData);

        const mergedData: NewsletterData = {
          title: wpData.title || defaultNewsletterData.title,
          subtitle: wpData.subtitle || defaultNewsletterData.subtitle,
          placeholder: wpData.placeholder || defaultNewsletterData.placeholder,
          buttonText: wpData.buttonText || wpData.button_text || defaultNewsletterData.buttonText,
          privacyNotice: wpData.privacyNotice || wpData.privacy_notice || defaultNewsletterData.privacyNotice,
          successMessage: wpData.successMessage || wpData.success_message || defaultNewsletterData.successMessage,
          benefits: wpData.benefits?.length ? wpData.benefits.map((benefit: any, index: number) => ({
            icon: benefit.icon || defaultNewsletterData.benefits[index]?.icon || '✨',
            title: benefit.title || defaultNewsletterData.benefits[index]?.title || '',
            description: benefit.description || benefit.desc || defaultNewsletterData.benefits[index]?.description || '',
          })) : defaultNewsletterData.benefits,
          apiEndpoint: wpData.apiEndpoint || wpData.api_endpoint || defaultNewsletterData.apiEndpoint,
        };

        setData(mergedData);
        setError(null);
      } catch (err) {
        console.warn('⚠️ Newsletter WordPress indisponible, utilisation des valeurs par défaut:', err);
        setData(defaultNewsletterData);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, []);

  return { data, loading, error, defaultData: defaultNewsletterData };
}

export { defaultNewsletterData };

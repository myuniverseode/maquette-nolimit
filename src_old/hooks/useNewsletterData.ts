// hooks/useNewsletterData.ts - Hook pour la section Newsletter
import { useState, useEffect } from 'react';
import { NewsletterData, NewsletterBenefit } from '../types';

// ===== DONNÉES PAR DÉFAUT (actuellement en dur dans NewsletterSection.tsx) =====
const defaultNewsletterData: NewsletterData = {
  title: 'Restez informé de nos aventures',
  subtitle: 'Recevez nos offres exclusives, nouveautés et conseils d\'aventure directement dans votre boîte mail',
  placeholder: 'Votre adresse email',
  buttonText: 'S\'inscrire',
  privacyNotice: 'En vous inscrivant, vous acceptez de recevoir nos emails. Vous pouvez vous désabonner à tout moment.',
  successMessage: 'Merci ! Vous êtes inscrit à notre newsletter',
  benefits: [
    {
      icon: '🎟️',
      title: 'Offres exclusives',
      description: 'Réductions réservées aux abonnés'
    },
    {
      icon: '🎯',
      title: 'Nouveautés en avant-première',
      description: 'Soyez les premiers informés'
    },
    {
      icon: '💡',
      title: 'Conseils d\'experts',
      description: 'Astuces pour profiter au maximum'
    }
  ],
  apiEndpoint: '/wp-json/nolimit/v1/newsletter/subscribe'
};

export function useNewsletterData() {
  const [data, setData] = useState<NewsletterData>(defaultNewsletterData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const apiUrl = 'https://www.preprod.nolimit-aventure.com/wp-json/nolimit/v1/newsletter';

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error('Erreur API Newsletter');
        return res.json();
      })
      .then(wpData => {
        console.log('✅ Newsletter config chargée depuis WordPress:', wpData);
        // Fusion intelligente avec les valeurs par défaut
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
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ Newsletter WordPress indisponible, utilisation des valeurs par défaut:', err.message);
        setData(defaultNewsletterData);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error, defaultData: defaultNewsletterData };
}

// Export des données par défaut
export { defaultNewsletterData };

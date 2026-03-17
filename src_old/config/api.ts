// config/api.ts - Configuration centralisée de l'API WordPress

// ============================================
// CONFIGURATION DE L'API WORDPRESS
// ============================================

// URL de base de l'API WordPress
// CHANGEZ CETTE VALEUR selon votre environnement
export const WP_API_BASE_URL = import.meta.env.VITE_NOLIMIT_API_KEY
  || 'http://localhost/test-nolimit/wordpress/wp-json';

// Namespace de l'API NoLimit
export const NOLIMIT_API_NAMESPACE = 'nolimit/v1';

// URL complète de l'API NoLimit
export const NOLIMIT_API_URL = `${WP_API_BASE_URL}/${NOLIMIT_API_NAMESPACE}`;

// ============================================
// ENDPOINTS DISPONIBLES
// ============================================
export const API_ENDPOINTS = {
  // Données globales du site
  header: `${NOLIMIT_API_URL}/header`,
  footer: `${NOLIMIT_API_URL}/footer`,

  // Page d'accueil
  hero: `${NOLIMIT_API_URL}/hero`,
  pourQui: `${NOLIMIT_API_URL}/pour-qui`,
  actualites: `${NOLIMIT_API_URL}/actualites`,
  newsletter: `${NOLIMIT_API_URL}/newsletter`,

  // Contenu principal
  parks: `${NOLIMIT_API_URL}/parks`,
  park: (id: string) => `${NOLIMIT_API_URL}/parks/${id}`,
  activities: `${NOLIMIT_API_URL}/activities`,
  activity: (id: string) => `${NOLIMIT_API_URL}/activities/${id}`,
  reviews: `${NOLIMIT_API_URL}/reviews`,

  // Pages spécifiques
  faq: `${NOLIMIT_API_URL}/faq`,
  contact: `${NOLIMIT_API_URL}/contact`,
  groups: `${NOLIMIT_API_URL}/groups`,

  // Actions
  newsletterSubscribe: `${NOLIMIT_API_URL}/newsletter/subscribe`,
  contactSubmit: `${NOLIMIT_API_URL}/contact/submit`,
  bookingCreate: `${NOLIMIT_API_URL}/booking/create`,
} as const;

// ============================================
// UTILITAIRE DE FETCH AVEC GESTION D'ERREUR
// ============================================
export async function fetchFromWordPress<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Données chargées depuis ${endpoint}`);
    return { data, error: null };
  } catch (error) {
    console.warn(`⚠️ Erreur API (${endpoint}):`, error);
    return { data: null, error: error as Error };
  }
}

// ============================================
// TIMEOUT CONFIGURATION
// ============================================
export const API_CONFIG = {
  // Timeout en millisecondes pour les requêtes
  timeout: 10000,

  // Nombre de tentatives en cas d'échec
  retryCount: 2,

  // Délai entre les tentatives (ms)
  retryDelay: 1000,

  // Cache TTL en secondes
  cacheTTL: 300, // 5 minutes
};

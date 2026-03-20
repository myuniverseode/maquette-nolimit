// config/config.ts - Configuration UNIQUE de l'API WordPress
// ════════════════════════════════════════════════════════════

export const API_URL =
  import.meta.env.VITE_NOLIMIT_API_URL ||
  'https://www.preprod.nolimit-aventure.com/wp-json/nolimit/v1';

export const API_KEY =
  import.meta.env.VITE_NOLIMIT_API_KEY || '';

/** Fetch utilitaire avec headers API pré-configurés et nettoyage auto */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { 'X-NoLimit-Key': API_KEY } : {}),
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API Error ${response.status}: ${response.statusText}`);
  }
  const raw = await response.json();
  return cleanWpData(raw);
}

/**
 * Nettoie une string provenant de WordPress.
 * WordPress peut ajouter des backslashes devant : ' " / \
 * Exemples : L\'aventure → L'aventure, http:\/\/site → http://site
 */
export function cleanWpString(str: string): string {
  if (!str || typeof str !== 'string') return str;
  // Ordre important : d'abord \\ → \, puis \' → ', \" → ", \/ → /
  return str
    .replace(/\\\\/g, '%%BACKSLASH%%')   // protège les vrais \\
    .replace(/\\'/g, "'")                  // \' → '
    .replace(/\\"/g, '"')                  // \" → "
    .replace(/\\\//g, '/')                 // \/ → /
    .replace(/%%BACKSLASH%%/g, '\\');      // restaure les vrais \
}

/**
 * Nettoie récursivement un objet/tableau de données WordPress
 */
export function cleanWpData<T>(data: T): T {
  if (typeof data === 'string') return cleanWpString(data) as unknown as T;
  if (Array.isArray(data)) return data.map(cleanWpData) as unknown as T;
  if (data && typeof data === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      cleaned[key] = cleanWpData(value);
    }
    return cleaned as T;
  }
  return data;
}

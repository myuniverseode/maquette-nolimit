// hooks/index.ts - Export centralisé de tous les hooks WordPress

// Hooks existants
export { useHeaderData } from './useHeaderData';
export { useFooterData } from './useFooterData';
export { useActivitiesData, defaultActivities } from './useActiviesData';

// Nouveaux hooks avec fallback
export { useHeroData, defaultHeroData } from './useHeroData';
export { usePourQuiData, defaultPourQuiData } from './usePourQuiData';
export { useActualitesData, defaultActualitesData } from './useActualitesData';
export { useNewsletterData, defaultNewsletterData } from './useNewsletterData';
export { useParksData, defaultParks } from './useParksData';
export { useReviewsData, defaultReviews } from './useReviewsData';

// Réexporter les types Activity pour compatibilité
export type { Activity } from './useActiviesData';

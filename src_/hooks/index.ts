// hooks/index.ts - Export centralisé de TOUS les hooks WordPress

// ─── Hooks globaux ─────────────────────────────────
export { useHeaderData } from './useHeaderData';
export { useFooterData } from './useFooterData';
export { useActivitiesData, defaultActivities } from './useActiviesData';
export { useHeroData, defaultHeroData } from './useHeroData';
export { usePourQuiData, defaultPourQuiData } from './usePourQuiData';
export { useActualitesData, defaultActualitesData } from './useActualitesData';
export { useNewsletterData, defaultNewsletterData } from './useNewsletterData';
export { useParksData, defaultParks } from './useParksData';
export { useReviewsData, defaultReviews } from './useReviewsData';
export { useStatsData, defaultStatsData } from './useStatsData';

// ─── Hooks v8 ──────────────────────────────────────
export { useAboutMain, useAboutHistory, useAboutValues, useAboutJobs, useAboutPartners } from './useAboutData';
export { useBlogData, useBlogArticle } from './useBlogData';
export { useBookingData, defaultBookingConfig } from './useBookingData';
export { useSiteConfig, useParkConfig, defaultSiteConfig } from './useSiteConfig';
export { useGroupsHub, useGroupsCorporate, useGroupsKids, useGroupsAdults, useGroupsFamily } from './useGroupsData';
export { usePourQuiDuo, usePourQuiEnfant, usePourQuiEntreprise, usePourQuiFamille } from './usePourQuiPages';
export { useFaqData } from './useFaqData';
export { useContactData } from './useContactData';
export { useCalendarData, useAllCalendarsData, computeDayStatus } from './useCalendarData';

// ─── Types réexportés ──────────────────────────────
export type { Activity } from './useActiviesData';
export type { ActivityWithTarifs, TarifGroupe, TarifLigne } from './useActiviesData';
export type { StatItem, FeatureItem, StatsData } from './useStatsData';
export type { BlogArticle, BlogData } from './useBlogData';
export type { BookingConfig } from './useBookingData';
export type { SiteConfig } from './useSiteConfig';
export type { AboutMainData, AboutHistoryData, AboutValuesData, AboutJobsData, AboutPartnersData } from './useAboutData';
export type { FaqData, FaqItem, FaqCategory } from './useFaqData';
export type { CalendarData, CalendarLegendItem, CalendarEvent, ParkDayStatus } from './useCalendarData';

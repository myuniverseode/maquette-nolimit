// hooks/useAboutData.ts
import { useState, useEffect } from 'react';
import { API_URL, API_KEY, cleanWpData } from '../config/config';

/* ── Types ─────────────────────────────────────────────────── */

interface AboutHero {
  badge?: string;
  title?: string;
  subtitle?: string;
  h1?: string;
  h1accent?: string;
  intro?: string;
  cta1Text?: string;
  cta1Link?: string;
  cta2Text?: string;
  cta2Link?: string;
}

interface AboutHub {
  badge?: string;
  title?: string;
}

interface AboutSections {
  // history
  timelineTitle?: string;
  timelineSubtitle?: string;
  visionBadge?: string;
  visionTitle?: string;
  visionSubtitle?: string;
  visionCtaText?: string;
  visionCtaLink?: string;
  // values
  valuesTitle?: string;
  manifestoTitle?: string;
  manifestoSubtitle?: string;
  // jobs
  perksTitle?: string;
  perksSubtitle?: string;
  positionsTitle?: string;
  spontaneousTitle?: string;
  spontaneousSubtitle?: string;
  ctaButton?: string;
  confirmedTitle?: string;
  confirmedText?: string;
  // partners
  partnersTitle?: string;
  partnersSubtitle?: string;
  becomeTitle?: string;
  becomeSubtitle?: string;
  becomeCta?: string;
}

export interface NavCard {
  id: string;
  title: string;
  desc: string;
  icon: string;
  link: string;
  color: string;
}

export interface StatItem {
  value?: string;
  val?: string;
  label: string;
  icon?: string;
}

export interface TimelineItem {
  year: string;
  emoji?: string;
  icon?: string;
  title: string;
  desc: string;
  color: string;
  side?: string;
}

export interface VisionMetric {
  icon: string;
  title: string;
  sub: string;
}

export interface ValueItem {
  icon: string;
  title: string;
  desc: string;
  details?: string[];
  color: string;
}

export interface PerkItem {
  icon: string;
  title: string;
  desc: string;
}

export interface PositionItem {
  title: string;
  location: string;
  type: string;
  level?: string;
  urgent: boolean;
  color?: string;
  desc?: string;
}

export interface PartnerItem {
  name: string;
  full?: string;
  emoji?: string;
  type: string;
  desc: string;
}

export interface RseItem {
  icon: string;
  title: string;
  desc: string;
}

export interface AboutMainData {
  hero: AboutHero;
  hub: AboutHub;
  navCards: NavCard[];
  stats: StatItem[];
}

export interface AboutHistoryData {
  hero: AboutHero;
  sections: AboutSections;
  title: string;
  subtitle: string;
  vision: string;
  visionMetrics: VisionMetric[];
  timeline: TimelineItem[];
  stats: StatItem[];
}

export interface AboutValuesData {
  hero: AboutHero;
  sections: AboutSections;
  title: string;
  subtitle: string;
  values: ValueItem[];
  manifesto: string[];
}

export interface AboutJobsData {
  hero: AboutHero;
  sections: AboutSections;
  title: string;
  subtitle: string;
  perks: PerkItem[];
  positions: PositionItem[];
  spontaneous: { enabled: boolean; email: string; text: string };
}

export interface AboutPartnersData {
  hero: AboutHero;
  sections: AboutSections;
  title: string;
  subtitle: string;
  partners: PartnerItem[];
  rseTitle: string;
  rseSubtitle: string;
  rse: RseItem[];
}

/* ── Fetch helper ───────────────────────────────────────────── */

function useFetchAbout<T>(endpoint: string, defaultData: T) {
  const [data, setData] = useState<T>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/${endpoint}`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json().then(_x=>cleanWpData(_x)); })
      .then(rawD => { const d = cleanWpData(rawD); setData({ ...defaultData, ...d }); setError(null); })
      .catch(e => { console.warn(`⚠️ ${endpoint} indisponible:`, e); setError(e); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

/* ── Hooks ──────────────────────────────────────────────────── */

export function useAboutMain() {
  return useFetchAbout<AboutMainData>('about', {
    hero: {
      badge: 'Depuis 2015 · Leader français du parc aventure',
      title: 'On est NoLimit.',
      subtitle: "Une équipe de passionnés qui croit dur comme fer que l'aventure, ça change la vie.",
      cta1Text: 'Notre histoire', cta1Link: '/about/histoire',
      cta2Text: 'Découvrir nos parcs', cta2Link: '/parcs',
    },
    hub: { badge: 'Tout sur NoLimit Aventure', title: 'Explorez notre univers' },
    navCards: [],
    stats: [],
  });
}

export function useAboutHistory() {
  return useFetchAbout<AboutHistoryData>('about/history', {
    hero: { badge: '🏔️ Notre Histoire', h1: '10 ans', h1accent: "d'aventure.", intro: '' },
    sections: {
      timelineTitle: 'Notre timeline', timelineSubtitle: 'Une étape à la fois, un parc à la fois.',
      visionBadge: 'Notre vision 2027', visionTitle: 'Leader national du parc aventure.',
      visionSubtitle: '', visionCtaText: 'Voir nos parcs', visionCtaLink: '/about/parcs',
    },
    title: 'Notre Histoire', subtitle: '', vision: '', visionMetrics: [], timeline: [], stats: [],
  });
}

export function useAboutValues() {
  return useFetchAbout<AboutValuesData>('about/values', {
    hero: { badge: '💚 Notre ADN', h1: 'Ce qui nous', h1accent: 'définit.', intro: '' },
    sections: {
      valuesTitle: 'Nos valeurs en détail',
      manifestoTitle: "Ce qu'on croit.",
      manifestoSubtitle: "Notre manifeste, des convictions qu'on ne négocie pas.",
    },
    title: 'Notre ADN', subtitle: '', values: [], manifesto: [],
  });
}

export function useAboutJobs() {
  return useFetchAbout<AboutJobsData>('about/jobs', {
    hero: { badge: '🧗 Nos Emplois', h1: 'Ta passion,', h1accent: 'ton métier.', intro: '' },
    sections: {
      perksTitle: 'Pourquoi nous rejoindre ?', perksSubtitle: '',
      positionsTitle: 'Postes à pourvoir',
      spontaneousTitle: "Pas votre poste ici ? Écrivez-nous.", spontaneousSubtitle: '',
      ctaButton: 'Envoyer ma candidature',
      confirmedTitle: 'Candidature reçue !', confirmedText: 'On revient vers vous sous 5 jours ouvrés.',
    },
    title: 'Rejoignez NoLimit', subtitle: '', perks: [], positions: [],
    spontaneous: { enabled: true, email: 'jobs@nolimit-aventure.fr', text: '' },
  });
}

export function useAboutPartners() {
  return useFetchAbout<AboutPartnersData>('about/partners', {
    hero: { badge: '🤝 Nos Partenaires', h1: 'Ensemble,', h1accent: 'on va plus loin.', intro: '' },
    sections: {
      partnersTitle: 'Ils nous font confiance', partnersSubtitle: '',
      becomeTitle: 'Devenir partenaire.', becomeSubtitle: '',
      becomeCta: 'Envoyer ma demande',
      confirmedTitle: 'Demande reçue !', confirmedText: 'Notre responsable vous contactera sous 48h.',
    },
    title: 'Nos Partenaires', subtitle: '', partners: [],
    rseTitle: 'Nos Engagements RSE', rseSubtitle: '', rse: [],
  });
}

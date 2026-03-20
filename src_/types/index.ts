// types/index.ts - Définitions de types centralisées
// ═══════════════════════════════════════════════════

// ── Park ─────────────────────────────────────────
export interface Park {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  image: string;
  gallery?: string[];
  activities: string[];
  difficulty: string[];
  minAge: number;
  rating: number;
  reviewCount: number;
  minPrice: number;
  capacity: number;
  departement: string;
  highlights: string[];
  emoji?: string;
  features?: string[];
  openingHours?: { highSeason?: string; lowSeason?: string };
  contact?: { phone?: string; email?: string };
  address?: string;
  // Champs avis externes
  googlePlaceId?: string;
  tripadvisorUrl?: string;
  // Champs sur place / accessibilité
  onSiteServices?: OnSiteService[];
  accessibilityItems?: AccessibilityItem[];
  transportOptions?: TransportOption[];
  // Tarifs
  pricingOptions?: ParkPricingOption[];
  // Bon à savoir
  goodToKnow?: GoodToKnowItem[];
}

export interface OnSiteService {
  icon: string;
  label: string;
  color?: string;
}

export interface AccessibilityItem {
  emoji: string;
  label: string;
  available: boolean;
}

export interface TransportOption {
  icon: string;
  title: string;
  desc: string;
  color?: string;
}

export interface ParkPricingOption {
  name: string;
  price: number | string;
  description: string;
  features: string[];
  popular?: boolean;
  icon?: string;
  color?: string;
}

export interface GoodToKnowItem {
  icon: string;
  title: string;
  color?: string;
}

// ── Activity ─────────────────────────────────────
export interface Activity {
  id: string | number;
  name: string;
  slug?: string;
  description: string;
  icon?: string;
  image: string;
  gallery?: string[];
  difficulty: string;
  intensity?: string;
  minAge: number;
  duration: string;
  price?: number;
  participants?: string;
  emoji?: string;
  restrictions?: string[];
  tarifs?: TarifGroupe[];
}

export interface TarifLigne {
  label: string;
  prix: string;
}

export interface TarifGroupe {
  titre: string;
  lignes: TarifLigne[];
}

// ── Review ───────────────────────────────────────
export interface Review {
  id: string | number;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  parkId?: string;
  parkName?: string;
  verified?: boolean;
  helpful?: number;
  source?: 'google' | 'tripadvisor' | 'manual';
  tag?: string;
}

// ── Hero ─────────────────────────────────────────
export interface HeroSlide {
  id: string;
  url: string;
  title: string;
  subtitle: string;
}

export interface HeroData {
  slides: HeroSlide[];
  badge: { text: string; icon: string };
  mainTitle: { line1: string; highlight: string };
  video?: {
    url: string;
    thumbnail: string;
    buttonText: string;
    description: string;
  };
}

// ── Newsletter ───────────────────────────────────
export interface NewsletterData {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  successMessage: string;
  backgroundColor: string;
  formAction?: string;
}

// ── PourQui ──────────────────────────────────────
export interface PourQuiItem {
  id: string;
  emoji: string;
  label: string;
  desc: string;
  color: string;
  link?: string;
  image?: string;
}

export interface PourQuiData {
  title: string;
  subtitle: string;
  items: PourQuiItem[];
}

// ── Actualités ───────────────────────────────────
export interface ActualiteItem {
  id: string | number;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  date: string;
  category?: string;
  parkId?: string;
  parkName?: string;
  slug?: string;
}

export interface ActualitesData {
  title: string;
  subtitle: string;
  items: ActualiteItem[];
}

// ── Stats ────────────────────────────────────────
export interface StatItem {
  value: string;
  label: string;
  sublabel?: string;
  icon: string;
  trendValue?: string;
  color?: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface StatsData {
  stats: StatItem[];
  features: FeatureItem[];
}

// ── FAQ ──────────────────────────────────────────
export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  items: FaqItem[];
}

export interface FaqData {
  title: string;
  subtitle: string;
  categories: FaqCategory[];
}

// ── Contact ──────────────────────────────────────
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

// ── Aliases de compatibilité ─────────────────────
export type Actualite = ActualiteItem;
export type PourQuiCard = PourQuiItem;

export interface NewsletterBenefit {
  icon: string;
  text: string;
}

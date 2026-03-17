// types/index.ts - Types TypeScript complets pour NoLimit Aventure

// ==========================================
// TYPES PARC
// ==========================================
export interface Park {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
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
  openingHours?: {
    weekdays: string;
    weekends: string;
    holidays?: string;
  };
  contact?: {
    phone: string;
    email: string;
    address: string;
  };
}

// ==========================================
// TYPES ACTIVITÉ
// ==========================================
export interface Activity {
  id: string;
  name: string;
  slug?: string;
  description: string;
  icon: string;
  image: string;
  gallery?: string[];
  difficulty: string;
  intensity?: 'easy' | 'medium' | 'hard' | 'extreme';
  minAge: number;
  duration: string;
  price: number | string;
  participants?: string;
  emoji?: string;
  restrictions: string[];
  equipment?: string[];
  parkIds?: string[];
}

// ==========================================
// TYPES AVIS / REVIEWS
// ==========================================
export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  parkId: string;
  parkName?: string;
  verified?: boolean;
  helpful?: number;
}

// ==========================================
// TYPES FILTRES
// ==========================================
export interface Filters {
  activities: string[];
  minAge: number | null;
  difficulty: string[];
  location: string;
  maxDistance: number | null;
  priceRange?: {
    min: number;
    max: number;
  };
}

// ==========================================
// TYPES HEADER / NAVIGATION
// ==========================================
export interface MenuItem {
  id: number;
  label: string;
  type: 'simple' | 'megamenu';
  url?: string;
  position: number;
  megaMenuType?: string;
  megaMenu?: MegaMenuContent;
}

export interface MegaMenuContent {
  sections?: MegaMenuSection[];
  featured?: {
    title: string;
    image: string;
    link: string;
  };
}

export interface MegaMenuSection {
  title: string;
  links: {
    label: string;
    url: string;
    icon?: string;
  }[];
}

export interface HeaderData {
  logo: {
    url: string;
    alt: string;
  } | null;
  primaryColor: string;
  secondaryColor: string;
  greenColor: string;
  ctaText: string;
  ctaUrl: string;
  showParkSelector: boolean;
  menuItems: MenuItem[];
  parks: {
    id: string;
    name: string;
    location: string;
    emoji: string;
    url: string;
  }[];
}

// ==========================================
// TYPES FOOTER
// ==========================================
export interface FooterData {
  colors: {
    background: string;
    primary: string;
    secondary: string;
  };
  contact: {
    phone: string;
    email: string;
    description: string;
  };
  stats: {
    number: string;
    label: string;
  }[];
  quickLinks: {
    label: string;
    to: string;
  }[];
  activities: {
    name: string;
    emoji: string;
    link: string;
  }[];
  legalLinks: {
    label: string;
    to: string;
  }[];
  cta: {
    title: string;
    subtitle: string;
    bookingUrl: string;
    contactUrl: string;
  };
  parks: {
    id: string;
    name: string;
    location: string;
    emoji: string;
    minAge: number;
    rating: number;
    minPrice: number;
    activities: string[];
  }[];
  showBackToTop: boolean;
  currentYear: number;
}

// ==========================================
// TYPES HERO / CAROUSEL
// ==========================================
export interface HeroSlide {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface HeroData {
  slides: HeroSlide[];
  badge: {
    text: string;
    icon?: string;
  };
  mainTitle: {
    line1: string;
    highlight: string;
  };
  video?: {
    url: string;
    thumbnail: string;
    buttonText: string;
    description: string;
  };
}

// ==========================================
// TYPES POUR QUI
// ==========================================
export interface PourQuiCard {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  iconName: string;
  color: string;
}

export interface PourQuiData {
  title: string;
  subtitle: string;
  cards: PourQuiCard[];
}

// ==========================================
// TYPES ACTUALITÉS
// ==========================================
export interface Actualite {
  id: string;
  titre: string;
  date: string;
  image: string;
  extrait: string;
  isEvenement: boolean;
  lienInscription?: string;
  lien: string;
  categorie?: string;
  auteur?: string;
}

export interface ActualitesData {
  title: string;
  subtitle: string;
  articles: Actualite[];
  showViewAllButton: boolean;
  viewAllUrl: string;
}

// ==========================================
// TYPES NEWSLETTER
// ==========================================
export interface NewsletterBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface NewsletterData {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  privacyNotice: string;
  successMessage: string;
  benefits: NewsletterBenefit[];
  apiEndpoint?: string;
}

// ==========================================
// TYPES STATISTIQUES
// ==========================================
export interface Stat {
  number: string;
  label: string;
  icon?: string;
}

export interface StatsData {
  items: Stat[];
  backgroundColor?: string;
}

// ==========================================
// TYPES FAQ
// ==========================================
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQData {
  title: string;
  subtitle: string;
  items: FAQItem[];
  categories?: string[];
}

// ==========================================
// TYPES CONTACT
// ==========================================
export interface ContactData {
  title: string;
  subtitle: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  mapUrl?: string;
  formFields: {
    name: boolean;
    email: boolean;
    phone: boolean;
    subject: boolean;
    message: boolean;
    park?: boolean;
  };
}

// ==========================================
// TYPES GROUPES
// ==========================================
export interface GroupType {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  minPersons: number;
  maxPersons: number;
  pricePerPerson: number;
  features: string[];
}

export interface GroupsData {
  title: string;
  subtitle: string;
  types: GroupType[];
  benefits: string[];
  ctaText: string;
  ctaUrl: string;
}

// ==========================================
// TYPES API RESPONSE GÉNÉRIQUES
// ==========================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// ==========================================
// TYPES BOOKING
// ==========================================
export interface BookingSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  price: number;
  capacity: number;
  remainingSpots: number;
}

export interface BookingData {
  parkId: string;
  activityId?: string;
  date: string;
  time: string;
  participants: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

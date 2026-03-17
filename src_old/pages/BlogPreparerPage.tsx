// pages/BlogPreparerPage.tsx
// Gabarit Blog / Préparer votre visite — avec catégories thématiques
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Clock, ArrowRight, Tag, BookOpen, Eye,
  Sun, CloudRain, Dumbbell, CalendarCheck, PawPrint,
  Utensils, ShieldCheck, MapPin, Lightbulb, ChevronRight,
  TrendingUp, Bookmark, Share2, Heart, Filter, X
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// ─── Constantes de couleurs ────────────────────────────────────────────────────
const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  count: number;
  description: string;
}

interface Article {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: number;
  date: string;
  views: number;
  image: string;
  featured: boolean;
  tags: string[];
  author: { name: string; role: string; avatar: string };
  difficulty?: 'facile' | 'moyen' | 'avancé';
}

// ─── Données ───────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  {
    id: 'tous',
    label: 'Tous les articles',
    icon: <BookOpen className="size-4" />,
    color: DARK,
    count: 18,
    description: "Toute notre base de conseils et guides pratiques",
  },
  {
    id: 'bonne-journee',
    label: 'Passer une bonne journée',
    icon: <Sun className="size-4" />,
    color: '#f59e0b',
    count: 4,
    description: "Nos secrets pour une expérience 10/10",
  },
  {
    id: 'journee-type',
    label: 'Une journée type',
    icon: <CalendarCheck className="size-4" />,
    color: GREEN,
    count: 3,
    description: "Programme, timing et organisation",
  },
  {
    id: 'niveau-sportif',
    label: 'Niveau sportif',
    icon: <Dumbbell className="size-4" />,
    color: ORANGE,
    count: 3,
    description: "Accessibilité et pré-requis physiques",
  },
  {
    id: 'meteo',
    label: 'Météo & saisons',
    icon: <CloudRain className="size-4" />,
    color: '#3b82f6',
    count: 3,
    description: "Que faire par beau temps ou mauvais temps",
  },
  {
    id: 'animaux',
    label: 'Animaux & accessibilité',
    icon: <PawPrint className="size-4" />,
    color: '#8b5cf6',
    count: 2,
    description: "Règles, conditions et infos pratiques",
  },
  {
    id: 'restauration',
    label: 'Restauration & logistique',
    icon: <Utensils className="size-4" />,
    color: '#ef4444',
    count: 3,
    description: "Manger, se déplacer, s'équiper",
  },
];

const ARTICLES: Article[] = [
  // ── Bonne journée ──────────────────────────────────────────────────────────
  {
    id: '1',
    slug: 'conseils-bonne-journee',
    category: 'bonne-journee',
    title: '10 conseils pour une journée inoubliable au parc',
    excerpt: "Nos moniteurs partagent leurs astuces exclusives pour maximiser votre plaisir et repartir avec des souvenirs plein la tête. De l'équipement à l'état d'esprit, tout ce qu'il faut savoir.",
    readTime: 6,
    date: '12 mars 2025',
    views: 4820,
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&h=500&fit=crop',
    featured: true,
    tags: ['conseils', 'préparation', 'équipement'],
    author: { name: 'Marc D.', role: 'Moniteur escalade', avatar: '🧗' },
    difficulty: 'facile',
  },
  {
    id: '2',
    slug: 'tenue-ideale',
    category: 'bonne-journee',
    title: 'Quelle tenue porter pour vos activités outdoor ?',
    excerpt: "Chaussures fermées, tenue respirante, couches... On démystifie les essentiels vestimentaires pour profiter sans se soucier du confort ou de la sécurité.",
    readTime: 4,
    date: '5 mars 2025',
    views: 2340,
    image: 'https://images.unsplash.com/photo-1589662159690-0d76fffa2c21?w=800&h=500&fit=crop',
    featured: false,
    tags: ['équipement', 'vêtements', 'sécurité'],
    author: { name: 'Sophie L.', role: 'Responsable activités', avatar: '🌟' },
    difficulty: 'facile',
  },
  {
    id: '3',
    slug: 'reserver-ou-pas',
    category: 'bonne-journee',
    title: 'Faut-il absolument réserver à l\'avance ?',
    excerpt: "La réponse courte : ça dépend. La réponse longue, c'est ici. On analyse les périodes saturées, les disponibilités de dernière minute et quand vous pouvez tenter votre chance sans réservation.",
    readTime: 5,
    date: '28 fév. 2025',
    views: 3100,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=500&fit=crop',
    featured: false,
    tags: ['réservation', 'planning', 'conseils'],
    author: { name: 'Julie M.', role: 'Responsable accueil', avatar: '😊' },
    difficulty: 'facile',
  },
  {
    id: '4',
    slug: 'photographier-aventure',
    category: 'bonne-journee',
    title: 'Capturer vos moments d\'aventure : le guide photo',
    excerpt: "GoPro, smartphone waterproof, angles insolites... Nos photographes amateurs du parc vous livrent leurs techniques pour ramener des clichés qui impressionnent.",
    readTime: 7,
    date: '18 fév. 2025',
    views: 1890,
    image: 'https://images.unsplash.com/photo-1452573992436-6d508f200b30?w=800&h=500&fit=crop',
    featured: false,
    tags: ['photo', 'souvenirs', 'matériel'],
    author: { name: 'Thomas R.', role: 'Guide terrain', avatar: '📸' },
    difficulty: 'moyen',
  },
  // ── Journée type ──────────────────────────────────────────────────────────
  {
    id: '5',
    slug: 'programme-journee-famille',
    category: 'journee-type',
    title: 'Une journée en famille : le programme parfait de 9h à 17h',
    excerpt: "Accueil, briefing sécurité, premières sensations, déjeuner sur l'herbe et retour en beauté — on vous déroule minute par minute une journée familiale idéale avec enfants de 6 à 12 ans.",
    readTime: 8,
    date: '20 mars 2025',
    views: 5670,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
    featured: true,
    tags: ['famille', 'programme', 'enfants'],
    author: { name: 'Camille B.', role: 'Animatrice jeunesse', avatar: '👧' },
    difficulty: 'facile',
  },
  {
    id: '6',
    slug: 'journee-groupe-entreprise',
    category: 'journee-type',
    title: 'Team building réussi : comment structurer votre journée d\'entreprise',
    excerpt: "Icebreakers matinaux, défis collaboratifs, repas collectif et bilan d'équipe : le plan de journée type pour un team building qui crée de vraies connexions entre collègues.",
    readTime: 9,
    date: '10 mars 2025',
    views: 3240,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
    featured: false,
    tags: ['entreprise', 'team-building', 'programme'],
    author: { name: 'Paul V.', role: 'Coordinateur événements', avatar: '💼' },
    difficulty: 'moyen',
  },
  {
    id: '7',
    slug: 'journee-evjf',
    category: 'journee-type',
    title: 'EVJF outdoor : la journée aventure avant le grand jour',
    excerpt: "Fini les classiques spa et brunch parisien. Notre guide pour organiser une journée EVJF palpitante, avec activités à sensations, défis rigolos et photos de groupe épiques.",
    readTime: 6,
    date: '2 mars 2025',
    views: 4120,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=500&fit=crop',
    featured: false,
    tags: ['EVJF', 'groupe', 'événement'],
    author: { name: 'Léa D.', role: 'Animatrice', avatar: '🎉' },
    difficulty: 'facile',
  },
  // ── Niveau sportif ────────────────────────────────────────────────────────
  {
    id: '8',
    slug: 'escalade-debutant',
    category: 'niveau-sportif',
    title: "Escalade pour débutants : zéro expérience requise, vraiment ?",
    excerpt: "La vraie réponse aux doutes des néophytes. Force, souplesse, vertige... on démonte les idées reçues et vous prouve que l'escalade est plus accessible que vous ne le pensez.",
    readTime: 5,
    date: '15 mars 2025',
    views: 6780,
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&h=500&fit=crop',
    featured: true,
    tags: ['débutant', 'escalade', 'accessibilité'],
    author: { name: 'Marc D.', role: 'Moniteur escalade', avatar: '🧗' },
    difficulty: 'facile',
  },
  {
    id: '9',
    slug: 'preparation-physique',
    category: 'niveau-sportif',
    title: '3 exercices simples pour préparer votre corps avant de venir',
    excerpt: "Un peu de gainage, de grip et d'endurance cardiovasculaire peut transformer votre expérience. Nos moniteurs vous donnent leur programme de préparation sur 2 semaines.",
    readTime: 7,
    date: '8 mars 2025',
    views: 2890,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
    featured: false,
    tags: ['sport', 'préparation', 'fitness'],
    author: { name: 'Alex K.', role: 'Coach sportif', avatar: '💪' },
    difficulty: 'moyen',
  },
  {
    id: '10',
    slug: 'activites-seniors',
    category: 'niveau-sportif',
    title: 'Activités outdoor après 60 ans : ce qui est accessible',
    excerpt: "L'aventure n'a pas d'âge. On passe en revue les activités adaptées aux seniors actifs, avec les précautions à prendre et les anecdotes de nos visiteurs les plus... expérimentés.",
    readTime: 6,
    date: '25 fév. 2025',
    views: 2150,
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=500&fit=crop',
    featured: false,
    tags: ['seniors', 'accessibilité', 'adapté'],
    author: { name: 'Sophie L.', role: 'Responsable activités', avatar: '🌟' },
    difficulty: 'facile',
  },
  // ── Météo ──────────────────────────────────────────────────────────────────
  {
    id: '11',
    slug: 'activites-pluie',
    category: 'meteo',
    title: "Il pleut : que faire au parc quand la météo ne coopère pas ?",
    excerpt: "Orage, bruine ou averse imprévue — tout n'est pas annulé pour autant. Voici nos activités couvertes, nos procédures de report et comment sauver votre journée malgré les nuages.",
    readTime: 5,
    date: '22 mars 2025',
    views: 8340,
    image: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&h=500&fit=crop',
    featured: true,
    tags: ['météo', 'pluie', 'alternatives'],
    author: { name: 'Julie M.', role: 'Responsable accueil', avatar: '😊' },
    difficulty: 'facile',
  },
  {
    id: '12',
    slug: 'meilleures-saisons',
    category: 'meteo',
    title: 'Quelle est la meilleure saison pour visiter le parc ?',
    excerpt: "Printemps frais, été brûlant, automne coloré, hiver calme — chaque saison a ses atouts cachés. Notre guide saisonnier complet pour choisir votre fenêtre idéale.",
    readTime: 6,
    date: '14 mars 2025',
    views: 3670,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop',
    featured: false,
    tags: ['saisons', 'planning', 'météo'],
    author: { name: 'Thomas R.', role: 'Guide terrain', avatar: '📸' },
    difficulty: 'facile',
  },
  {
    id: '13',
    slug: 'activites-chaleur',
    category: 'meteo',
    title: "Canicule et activités outdoor : nos conseils hydratation et ombre",
    excerpt: "Quand le mercure dépasse les 30°C, l'aventure se prépare différemment. Horaires adaptés, zones fraîches, équipement anti-chaleur — le guide indispensable pour l'été.",
    readTime: 4,
    date: '5 juil. 2024',
    views: 4520,
    image: 'https://images.unsplash.com/photo-1530569673472-307dc017a82d?w=800&h=500&fit=crop',
    featured: false,
    tags: ['été', 'chaleur', 'hydratation'],
    author: { name: 'Marc D.', role: 'Moniteur escalade', avatar: '🧗' },
    difficulty: 'facile',
  },
  // ── Animaux ──────────────────────────────────────────────────────────────
  {
    id: '14',
    slug: 'chiens-au-parc',
    category: 'animaux',
    title: 'Puis-je venir avec mon chien ? La réponse complète',
    excerpt: "Races acceptées, zones autorisées, laisse obligatoire ou non, point d'eau et zones d'ombre pour vos compagnons. Tout ce que les propriétaires de chiens doivent savoir avant de venir.",
    readTime: 4,
    date: '18 mars 2025',
    views: 5890,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=500&fit=crop',
    featured: false,
    tags: ['animaux', 'chiens', 'règlement'],
    author: { name: 'Camille B.', role: 'Animatrice jeunesse', avatar: '👧' },
    difficulty: 'facile',
  },
  {
    id: '15',
    slug: 'accessibilite-pmr',
    category: 'animaux',
    title: 'Accessibilité PMR : ce que nous faisons pour vous accueillir',
    excerpt: "Rampes, parking adapté, activités aménagées, personnel formé — un tour complet de nos dispositifs d'accessibilité pour les personnes à mobilité réduite et leurs accompagnants.",
    readTime: 5,
    date: '10 janv. 2025',
    views: 2340,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=500&fit=crop',
    featured: false,
    tags: ['PMR', 'accessibilité', 'inclusion'],
    author: { name: 'Paul V.', role: 'Coordinateur événements', avatar: '💼' },
    difficulty: 'facile',
  },
  // ── Restauration ──────────────────────────────────────────────────────────
  {
    id: '16',
    slug: 'manger-au-parc',
    category: 'restauration',
    title: 'Manger au parc : snack, pique-nique ou restaurant partenaire ?',
    excerpt: "Notre snack bar, les meilleures tables aux alentours, les règles du pique-nique sur site et où trouver les meilleures glaces artisanales à 5 minutes du parc.",
    readTime: 4,
    date: '25 mars 2025',
    views: 3120,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop',
    featured: false,
    tags: ['restauration', 'pique-nique', 'food'],
    author: { name: 'Léa D.', role: 'Animatrice', avatar: '🎉' },
    difficulty: 'facile',
  },
  {
    id: '17',
    slug: 'parkings-acces',
    category: 'restauration',
    title: "Comment accéder au parc : parking, transports en commun, GPS",
    excerpt: "Coordonnées GPS précises, itinéraires depuis l'autoroute, lignes de bus et train, plan du parking — on vous mâche le travail pour que vous arriviez sereinement.",
    readTime: 3,
    date: '20 mars 2025',
    views: 4560,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=500&fit=crop',
    featured: false,
    tags: ['accès', 'parking', 'transport'],
    author: { name: 'Julie M.', role: 'Responsable accueil', avatar: '😊' },
    difficulty: 'facile',
  },
  {
    id: '18',
    slug: 'budget-journee',
    category: 'restauration',
    title: "Combien prévoir pour une journée au parc : le budget complet",
    excerpt: "Activités, repas, souvenirs, transport — on détaille poste par poste ce qu'il faut budgéter pour une journée sans mauvaises surprises, du tarif solo au forfait famille.",
    readTime: 5,
    date: '15 mars 2025',
    views: 2980,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop',
    featured: false,
    tags: ['budget', 'tarifs', 'économies'],
    author: { name: 'Alex K.', role: 'Coach sportif', avatar: '💪' },
    difficulty: 'facile',
  },
];

// ─── Sous-composants ──────────────────────────────────────────────────────────

function HeroSection({ onSearch, searchQuery }: { onSearch: (q: string) => void; searchQuery: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="relative overflow-hidden pt-28 pb-20">
      {/* Fond texturé */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #0d2600 0%, #1a4a00 40%, #0d2600 100%)` }} />
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`, backgroundSize: '32px 32px' }} />

      {/* Blobs animés */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: GREEN, opacity: 0.2 }}
        animate={{ scale: [1, 1.3, 1], x: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: ORANGE, opacity: 0.15 }}
        animate={{ scale: [1, 1.4, 1], y: [0, -30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          {/* Fil d'Ariane */}
          <div className="flex items-center gap-2 text-white/50 text-sm mb-8">
            <Link to="/" className="hover:text-white/80 transition-colors">Accueil</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-white/80 font-medium">Blog & Conseils</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <Lightbulb className="size-6 text-white" />
            </motion.div>
            <div className="px-4 py-1.5 rounded-full border text-sm font-bold text-white/80" style={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.08)' }}>
              Conseils & préparation
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-6 tracking-tight">
            Préparez<br />
            <span style={{ color: ORANGE }}>votre aventure</span>
          </h1>
          <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-2xl">
            Tous nos guides, conseils et astuces pour vivre une expérience parfaite — de la première réservation au dernier sourire sur la route du retour.
          </p>

          {/* Barre de recherche */}
          <div className="relative max-w-xl">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="size-5 text-white/40" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Rechercher un conseil, un sujet..."
              className="w-full pl-14 pr-6 py-5 rounded-2xl text-white placeholder-white/30 text-base font-medium focus:outline-none transition-all"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1.5px solid rgba(255,255,255,0.2)',
              }}
              onFocus={(e) => { e.target.style.borderColor = ORANGE; e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
              >
                <X className="size-5" />
              </button>
            )}
          </div>

          {/* Stats rapides */}
          <div className="flex items-center gap-8 mt-10">
            {[
              { val: '18', label: 'articles' },
              { val: '6', label: 'catégories' },
              { val: '5 min', label: 'lecture moy.' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-white">{val}</div>
                <div className="text-white/50 text-xs font-medium uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 80" className="w-full h-16" preserveAspectRatio="none">
          <path d="M0,50 C300,20 600,70 900,40 C1150,15 1300,65 1440,45 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

function CategoryBar({
  categories,
  active,
  onChange,
}: {
  categories: Category[];
  active: string;
  onChange: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white border-b border-gray-100 sticky top-20 z-30 shadow-sm">
      <div className="container mx-auto px-4">
        <div
          ref={scrollRef}
          className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide"
        >
          {categories.map((cat) => {
            const isActive = active === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border-2 flex-shrink-0"
                style={
                  isActive
                    ? {
                        backgroundColor: cat.color === DARK ? DARK : cat.color,
                        borderColor: cat.color === DARK ? DARK : cat.color,
                        color: 'white',
                        boxShadow: `0 4px 14px ${cat.color}40`,
                      }
                    : {
                        backgroundColor: 'white',
                        borderColor: '#e5e7eb',
                        color: '#6b7280',
                      }
                }
              >
                <span
                  className="flex-shrink-0"
                  style={{ color: isActive ? 'white' : cat.color }}
                >
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
                <span
                  className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                  style={
                    isActive
                      ? { backgroundColor: 'rgba(255,255,255,0.25)', color: 'white' }
                      : { backgroundColor: '#f3f4f6', color: '#9ca3af' }
                  }
                >
                  {cat.count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FeaturedArticle({ article }: { article: Article }) {
  const cat = CATEGORIES.find((c) => c.id === article.category);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 hover:shadow-3xl transition-all cursor-pointer"
      whileHover={{ y: -6 }}
    >
      <Link to={`/blog/${article.slug}`} className="block">
        {/* Image */}
        <div className="relative h-72 lg:h-96 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Badge À la une */}
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="absolute top-6 left-6 px-4 py-2 rounded-2xl text-sm font-black text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${ORANGE}, #d66310)` }}
          >
            ⭐ À la une
          </motion.div>

          {/* Catégorie */}
          <div
            className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-sm border border-white/20"
            style={{ backgroundColor: `${cat?.color ?? GREEN}CC` }}
          >
            {cat?.icon}
            <span>{cat?.label}</span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8 bg-white">
          <div className="flex items-center gap-4 mb-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {article.readTime} min de lecture
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="size-3.5" />
              {article.views.toLocaleString()} vues
            </span>
            <span>{article.date}</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-black mb-3 leading-tight group-hover:text-green-700 transition-colors" style={{ color: DARK }}>
            {article.title}
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-6 line-clamp-2">{article.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                {article.author.avatar}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{article.author.name}</div>
                <div className="text-gray-400 text-xs">{article.author.role}</div>
              </div>
            </div>
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-xl"
              style={{ color: GREEN, backgroundColor: `${GREEN}12` }}
            >
              Lire l'article <ArrowRight className="size-4" />
            </motion.div>
          </div>
        </div>
        <div className="h-1" style={{ backgroundColor: cat?.color ?? GREEN }} />
      </Link>
    </motion.div>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const cat = CATEGORIES.find((c) => c.id === article.category);
  const [saved, setSaved] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all flex flex-col"
    >
      <Link to={`/blog/${article.slug}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Catégorie */}
          <div
            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black text-white backdrop-blur-sm"
            style={{ backgroundColor: `${cat?.color ?? GREEN}DD` }}
          >
            {cat?.icon}
            <span className="hidden sm:inline">{cat?.label}</span>
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => { e.preventDefault(); setSaved(s => !s); }}
              className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
              style={{ backgroundColor: saved ? '#ef4444' : 'rgba(0,0,0,0.4)' }}
            >
              <Heart className={`size-3.5 ${saved ? 'fill-white text-white' : 'text-white'}`} />
            </motion.button>
          </div>

          {/* Read time badge */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold">
            <Clock className="size-3" />
            {article.readTime} min
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                style={{ backgroundColor: `${cat?.color ?? GREEN}15`, color: cat?.color ?? GREEN }}
              >
                #{tag}
              </span>
            ))}
          </div>

          <h3 className="font-black text-gray-900 text-base leading-tight mb-3 flex-1 group-hover:text-green-700 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>

          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                {article.author.avatar}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">{article.author.name}</div>
                <div className="text-[10px] text-gray-400">{article.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Eye className="size-3" />
              {article.views > 999 ? `${(article.views / 1000).toFixed(1)}k` : article.views}
            </div>
          </div>
        </div>
      </Link>
      <div className="h-0.5" style={{ backgroundColor: cat?.color ?? GREEN }} />
    </motion.article>
  );
}

function CategoryInfoBanner({ category }: { category: Category | undefined }) {
  if (!category || category.id === 'tous') return null;
  return (
    <motion.div
      key={category.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-5 rounded-2xl mb-8 border-2"
      style={{
        backgroundColor: `${category.color}08`,
        borderColor: `${category.color}30`,
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white"
        style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}bb)` }}
      >
        {category.icon}
      </div>
      <div>
        <div className="font-black text-gray-900 text-base">{category.label}</div>
        <div className="text-gray-500 text-sm">{category.description} · {category.count} article{category.count > 1 ? 's' : ''}</div>
      </div>
    </motion.div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-black text-gray-900 mb-2">Aucun résultat</h3>
      <p className="text-gray-500 mb-6">
        {query
          ? `Aucun article ne correspond à "${query}".`
          : "Aucun article dans cette catégorie pour le moment."}
      </p>
      <Link
        to="/contact"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white text-sm"
        style={{ background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}
      >
        Posez-nous votre question <ArrowRight className="size-4" />
      </Link>
    </motion.div>
  );
}

function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSent(true); setTimeout(() => setSent(false), 5000); setEmail(''); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative rounded-3xl overflow-hidden shadow-xl my-16"
    >
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${DARK} 0%, #1a2a00 60%, #0d1a00 100%)` }} />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
      <motion.div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ backgroundColor: GREEN }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />

      <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 text-center lg:text-left">
          <div className="text-3xl mb-3">📬</div>
          <h3 className="text-2xl lg:text-3xl font-black text-white mb-2">Ne ratez aucun conseil</h3>
          <p className="text-white/60">Un email par mois, les meilleurs articles, zéro spam.</p>
        </div>
        <div className="w-full lg:w-auto lg:min-w-[360px]">
          {sent ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl"
              style={{ backgroundColor: `${GREEN}25`, border: `2px solid ${GREEN}50` }}
            >
              <div className="text-2xl">✅</div>
              <div className="text-white font-bold">Inscription confirmée !</div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                className="flex-1 px-5 py-3.5 rounded-2xl bg-white/10 text-white placeholder-white/30 text-sm font-medium border border-white/20 focus:outline-none focus:border-white/50 transition-colors"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3.5 rounded-2xl font-black text-white text-sm whitespace-nowrap"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}
              >
                S'abonner
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function PopularArticlesSidebar({ articles }: { articles: Article[] }) {
  const top5 = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${ORANGE}15` }}>
          <TrendingUp className="size-4" style={{ color: ORANGE }} />
        </div>
        <h3 className="font-black text-gray-900">Les plus lus</h3>
      </div>
      <div className="space-y-4">
        {top5.map((article, i) => {
          const cat = CATEGORIES.find((c) => c.id === article.category);
          return (
            <motion.div key={article.id} whileHover={{ x: 4 }} className="group">
              <Link to={`/blog/${article.slug}`} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black text-white"
                  style={{ background: i === 0 ? `linear-gradient(135deg, ${ORANGE}, #d66310)` : `linear-gradient(135deg, ${GREEN}, #4a9d00)` }}
                >
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-900 leading-tight group-hover:text-green-700 transition-colors line-clamp-2">{article.title}</div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                    <span style={{ color: cat?.color }}>{cat?.label}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5"><Eye className="size-3" />{article.views.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TagCloud() {
  const allTags = [...new Set(ARTICLES.flatMap((a) => a.tags))];
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${GREEN}15` }}>
          <Tag className="size-4" style={{ color: GREEN }} />
        </div>
        <h3 className="font-black text-gray-900">Sujets populaires</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <motion.button
            key={tag}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border"
            style={{ borderColor: `${GREEN}30`, color: GREEN, backgroundColor: `${GREEN}08` }}
          >
            #{tag}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export function BlogPreparerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('categorie') || 'tous';
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync URL param
  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setSearchQuery('');
    if (id === 'tous') {
      setSearchParams({});
    } else {
      setSearchParams({ categorie: id });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtrage
  const filteredArticles = ARTICLES.filter((a) => {
    const matchCat = activeCategory === 'tous' || a.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some((t) => t.includes(q));
    return matchCat && matchSearch;
  });

  const featuredArticles = filteredArticles.filter((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured || searchQuery);
  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroSection onSearch={setSearchQuery} searchQuery={searchQuery} />

      {/* Barre de catégories */}
      <CategoryBar
        categories={CATEGORIES}
        active={activeCategory}
        onChange={handleCategoryChange}
      />

      {/* Contenu */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col xl:flex-row gap-10">

          {/* ── Colonne principale ── */}
          <div className="flex-1 min-w-0">

            {/* Bandeau catégorie active */}
            <AnimatePresence mode="wait">
              <motion.div key={activeCategory}>
                <CategoryInfoBanner category={currentCategory} />
              </motion.div>
            </AnimatePresence>

            {/* Résultats de recherche */}
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-white border border-gray-200"
              >
                <Search className="size-4 text-gray-400" />
                <span className="text-gray-600 text-sm">
                  <strong>{filteredArticles.length}</strong> résultat{filteredArticles.length !== 1 ? 's' : ''} pour "
                  <strong>{searchQuery}</strong>"
                </span>
                <button onClick={() => setSearchQuery('')} className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="size-4" />
                </button>
              </motion.div>
            )}

            {/* État vide */}
            {filteredArticles.length === 0 && (
              <EmptyState query={searchQuery} />
            )}

            {/* Articles à la une */}
            {!searchQuery && featuredArticles.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-7 rounded-full" style={{ backgroundColor: ORANGE }} />
                  <h2 className="text-xl font-black text-gray-900">
                    {activeCategory === 'tous' ? 'Articles à la une' : 'Article mis en avant'}
                  </h2>
                </div>
                <div className={`grid gap-6 ${featuredArticles.length > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                  {featuredArticles.map((article) => (
                    <FeaturedArticle key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Tous les articles */}
            {regularArticles.length > 0 && (
              <section>
                {!searchQuery && featuredArticles.length > 0 && (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-7 rounded-full" style={{ backgroundColor: GREEN }} />
                    <h2 className="text-xl font-black text-gray-900">
                      {activeCategory === 'tous' ? 'Tous nos guides' : 'Autres articles'}
                    </h2>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                  {(searchQuery ? filteredArticles : regularArticles).map((article, i) => (
                    <ArticleCard key={article.id} article={article} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Newsletter */}
            <NewsletterBanner />
          </div>

          {/* ── Sidebar ── */}
          <aside className="xl:w-72 flex-shrink-0">
            <div className="sticky top-36 space-y-6">

              {/* Raccourcis catégories */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${GREEN}15` }}>
                    <Filter className="size-4" style={{ color: GREEN }} />
                  </div>
                  <h3 className="font-black text-gray-900">Catégories</h3>
                </div>
                <div className="space-y-1.5">
                  {CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat.id}
                      whileHover={{ x: 4 }}
                      onClick={() => handleCategoryChange(cat.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all text-sm"
                      style={
                        activeCategory === cat.id
                          ? { backgroundColor: `${cat.color}15`, color: cat.color, fontWeight: 700 }
                          : { color: '#6b7280', fontWeight: 500 }
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <span style={{ color: cat.color }}>{cat.icon}</span>
                        <span className="line-clamp-1">{cat.label}</span>
                      </div>
                      <span
                        className="text-[11px] font-black px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                      >
                        {cat.count}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Articles populaires */}
              <PopularArticlesSidebar articles={ARTICLES} />

              {/* Tags */}
              <TagCloud />

              {/* CTA Réservation */}
              <motion.div
                whileHover={{ y: -4 }}
                className="relative rounded-3xl overflow-hidden shadow-xl p-6 text-white"
                style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #2d6100 100%)` }}
              >
                <motion.div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
                <div className="relative z-10">
                  <div className="text-3xl mb-3">🧗</div>
                  <h4 className="font-black text-lg mb-2">Prêt à vous lancer ?</h4>
                  <p className="text-white/70 text-sm mb-5 leading-relaxed">Réservez votre activité en quelques clics</p>
                  <Link
                    to="/booking"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-black text-sm text-white transition-all hover:shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${ORANGE}, #d66310)` }}
                  >
                    Réserver maintenant <ArrowRight className="size-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
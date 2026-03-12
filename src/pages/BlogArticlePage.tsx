// pages/BlogArticlePage.tsx
// Gabarit article individuel — style magazine outdoor premium
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import {
  Clock, Eye, Calendar, ArrowLeft, ArrowRight,
  ChevronRight, Share2, Bookmark, Heart, Copy,
  Check, Twitter, Facebook, Link2, Tag,
  MessageSquare, ThumbsUp, ChevronDown, ChevronUp,
  Sun, CloudRain, Dumbbell, CalendarCheck, PawPrint,
  Utensils, Lightbulb, AlertCircle, Info, Star,
  TrendingUp, BookOpen, List, X
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

// ─── Couleurs ──────────────────────────────────────────────────────────────────
const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Section {
  id: string;
  title: string;
  level: 1 | 2;
}

interface ArticleContent {
  slug: string;
  category: string;
  categoryColor: string;
  categoryIcon: React.ReactNode;
  title: string;
  subtitle: string;
  excerpt: string;
  heroImage: string;
  readTime: number;
  date: string;
  updatedDate?: string;
  views: number;
  likes: number;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
    articlesCount: number;
  };
  tags: string[];
  sections: Section[];
  body: React.ReactNode;
  relatedSlugs: string[];
}

// ─── Base d'articles (données + contenu complet) ──────────────────────────────
const ARTICLES_DB: Record<string, ArticleContent> = {
  'conseils-bonne-journee': {
    slug: 'conseils-bonne-journee',
    category: 'Passer une bonne journée',
    categoryColor: '#f59e0b',
    categoryIcon: <Sun className="size-4" />,
    title: '10 conseils pour une journée inoubliable au parc',
    subtitle: "De l'équipement à l'état d'esprit, tout ce qu'il faut savoir avant d'arriver",
    excerpt: "Nos moniteurs partagent leurs astuces exclusives pour maximiser votre plaisir et repartir avec des souvenirs plein la tête.",
    heroImage: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1600&h=800&fit=crop',
    readTime: 6,
    date: '12 mars 2025',
    updatedDate: '18 mars 2025',
    views: 4820,
    likes: 342,
    author: {
      name: 'Marc Durand',
      role: 'Moniteur escalade · 8 ans d\'expérience',
      avatar: '🧗',
      bio: "Moniteur d'État escalade depuis 2017, Marc a guidé plus de 3 000 grimpeurs. Passionné par la pédagogie et l'accessibilité de la montagne pour tous.",
      articlesCount: 12,
    },
    tags: ['conseils', 'préparation', 'équipement', 'débutant', 'organisation'],
    sections: [
      { id: 'intro', title: 'Pourquoi se préparer ?', level: 1 },
      { id: 'avant-depart', title: 'Avant le départ', level: 1 },
      { id: 'tenue', title: '1. La bonne tenue', level: 2 },
      { id: 'horaire', title: '2. Arriver tôt', level: 2 },
      { id: 'hydratation', title: '3. S\'hydrater avant', level: 2 },
      { id: 'sur-place', title: 'Sur place', level: 1 },
      { id: 'ecoute', title: '4. Écouter le briefing', level: 2 },
      { id: 'rythme', title: '5. Respecter son rythme', level: 2 },
      { id: 'photos', title: '6. Penser aux photos', level: 2 },
      { id: 'retour', title: 'Pour repartir au top', level: 1 },
      { id: 'recuperation', title: '7. La récupération active', level: 2 },
      { id: 'avis', title: '8. Laisser un avis', level: 2 },
      { id: 'conclusion', title: 'En résumé', level: 1 },
    ],
    relatedSlugs: ['tenue-ideale', 'reserver-ou-pas', 'activites-pluie'],
    body: null, // injecté plus bas via ArticleBody
  },
  'activites-pluie': {
    slug: 'activites-pluie',
    category: 'Météo & saisons',
    categoryColor: '#3b82f6',
    categoryIcon: <CloudRain className="size-4" />,
    title: "Il pleut : que faire au parc quand la météo ne coopère pas ?",
    subtitle: "Orage, bruine ou averse imprévue — tout n'est pas annulé pour autant",
    excerpt: "Voici nos activités couvertes, nos procédures de report et comment sauver votre journée malgré les nuages.",
    heroImage: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1600&h=800&fit=crop',
    readTime: 5,
    date: '22 mars 2025',
    views: 8340,
    likes: 521,
    author: {
      name: 'Julie Martin',
      role: "Responsable accueil · 5 ans d'expérience",
      avatar: '😊',
      bio: "Julie gère l'accueil et l'expérience client depuis 2020. Elle connaît toutes les situations météo possibles et leurs solutions.",
      articlesCount: 7,
    },
    tags: ['météo', 'pluie', 'alternatives', 'annulation', 'remboursement'],
    sections: [
      { id: 'intro', title: 'La météo et nous', level: 1 },
      { id: 'activites-couvertes', title: 'Activités par tous temps', level: 1 },
      { id: 'politique', title: 'Notre politique météo', level: 1 },
      { id: 'report', title: 'Reporter sans stress', level: 2 },
      { id: 'remboursement', title: 'Remboursement', level: 2 },
      { id: 'conseils', title: 'Conseils pratiques', level: 1 },
      { id: 'conclusion', title: 'En résumé', level: 1 },
    ],
    relatedSlugs: ['meilleures-saisons', 'conseils-bonne-journee', 'reserver-ou-pas'],
    body: null,
  },
};

// Fallback article pour les slugs non trouvés
const FALLBACK_ARTICLE = ARTICLES_DB['conseils-bonne-journee'];

// Articles liés (données simplifiées pour les cards)
const RELATED_ARTICLES_DATA: Record<string, { title: string; excerpt: string; image: string; readTime: number; category: string; categoryColor: string; date: string }> = {
  'tenue-ideale': {
    title: 'Quelle tenue porter pour vos activités outdoor ?',
    excerpt: 'Chaussures fermées, tenue respirante, couches... On démystifie les essentiels vestimentaires.',
    image: 'https://images.unsplash.com/photo-1589662159690-0d76fffa2c21?w=600&h=400&fit=crop',
    readTime: 4,
    category: 'Passer une bonne journée',
    categoryColor: '#f59e0b',
    date: '5 mars 2025',
  },
  'reserver-ou-pas': {
    title: "Faut-il absolument réserver à l'avance ?",
    excerpt: 'On analyse les périodes saturées et quand vous pouvez tenter votre chance sans réservation.',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop',
    readTime: 5,
    category: 'Passer une bonne journée',
    categoryColor: '#f59e0b',
    date: '28 fév. 2025',
  },
  'activites-pluie': {
    title: "Il pleut : que faire au parc quand la météo ne coopère pas ?",
    excerpt: "Activités couvertes, procédures de report et comment sauver votre journée malgré les nuages.",
    image: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=600&h=400&fit=crop',
    readTime: 5,
    category: 'Météo & saisons',
    categoryColor: '#3b82f6',
    date: '22 mars 2025',
  },
  'meilleures-saisons': {
    title: 'Quelle est la meilleure saison pour visiter le parc ?',
    excerpt: 'Printemps frais, été brûlant, automne coloré — chaque saison a ses atouts cachés.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    readTime: 6,
    category: 'Météo & saisons',
    categoryColor: '#3b82f6',
    date: '14 mars 2025',
  },
  'conseils-bonne-journee': {
    title: '10 conseils pour une journée inoubliable au parc',
    excerpt: "Nos moniteurs partagent leurs astuces exclusives pour maximiser votre plaisir.",
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&h=400&fit=crop',
    readTime: 6,
    category: 'Passer une bonne journée',
    categoryColor: '#f59e0b',
    date: '12 mars 2025',
  },
};

// ─── Composants de contenu enrichi ────────────────────────────────────────────

function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: 'info' | 'warning' | 'tip' | 'success';
  title?: string;
  children: React.ReactNode;
}) {
  const configs = {
    info: { bg: '#eff6ff', border: '#3b82f6', icon: <Info className="size-5 text-blue-500" />, titleColor: '#1d4ed8' },
    warning: { bg: `${ORANGE}0D`, border: ORANGE, icon: <AlertCircle className="size-5" style={{ color: ORANGE }} />, titleColor: ORANGE },
    tip: { bg: `${GREEN}0A`, border: GREEN, icon: <Lightbulb className="size-5" style={{ color: GREEN }} />, titleColor: GREEN },
    success: { bg: '#f0fdf4', border: '#22c55e', icon: <Check className="size-5 text-green-500" />, titleColor: '#15803d' },
  };
  const c = configs[type];
  return (
    <div className="my-8 rounded-2xl p-5 border-l-4" style={{ backgroundColor: c.bg, borderLeftColor: c.border }}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{c.icon}</div>
        <div>
          {title && <div className="font-black text-sm mb-2" style={{ color: c.titleColor }}>{title}</div>}
          <div className="text-gray-700 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CheckList({ items, color = GREEN }: { items: string[]; color?: string }) {
  return (
    <ul className="my-6 space-y-3">
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="flex items-start gap-3"
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: `${color}20` }}
          >
            <Check className="size-3.5" style={{ color }} />
          </div>
          <span className="text-gray-700 leading-relaxed">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function NumberedStep({
  number,
  title,
  children,
  color = GREEN,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex gap-5 my-8"
    >
      <div className="flex-shrink-0">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
        >
          {number}
        </div>
        <div className="w-0.5 h-full mx-auto mt-3" style={{ backgroundColor: `${color}30` }} />
      </div>
      <div className="flex-1 pb-8">
        <h3 className="font-black text-xl mb-3" style={{ color: DARK }}>{title}</h3>
        <div className="text-gray-600 leading-relaxed">{children}</div>
      </div>
    </motion.div>
  );
}

function PullQuote({ children, author }: { children: React.ReactNode; author?: string }) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="my-10 pl-8 border-l-4 py-4 relative"
      style={{ borderLeftColor: ORANGE }}
    >
      <div
        className="absolute -left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg font-black"
        style={{ backgroundColor: ORANGE }}
      >
        "
      </div>
      <p className="text-xl lg:text-2xl font-black leading-tight mb-3" style={{ color: DARK, fontStyle: 'italic' }}>
        {children}
      </p>
      {author && <cite className="text-sm font-bold not-italic" style={{ color: ORANGE }}>— {author}</cite>}
    </motion.blockquote>
  );
}

function InlineImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="my-10 rounded-2xl overflow-hidden shadow-xl"
    >
      <img src={src} alt={alt} className="w-full object-cover" style={{ maxHeight: '460px' }} />
      {caption && (
        <figcaption className="bg-gray-50 px-5 py-3 text-sm text-gray-500 italic border-t border-gray-100">
          📷 {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

function StatGrid({ stats }: { stats: { val: string; label: string; icon?: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
      {stats.map(({ val, label, icon }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center p-5 rounded-2xl border-2"
          style={{ borderColor: `${GREEN}25`, backgroundColor: `${GREEN}06` }}
        >
          {icon && <div className="text-2xl mb-2">{icon}</div>}
          <div className="text-3xl font-black mb-1" style={{ color: GREEN }}>{val}</div>
          <div className="text-xs text-gray-500 font-medium leading-tight">{label}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Corps de l'article principal ─────────────────────────────────────────────
function ArticleBodyConseils() {
  return (
    <div className="article-content">

      <section id="intro">
        <p className="text-xl text-gray-600 leading-relaxed mb-6 font-medium">
          Après 8 ans à accueillir des milliers de visiteurs, j'ai vu des journées extraordinaires et quelques déceptions évitables. La différence ? Pas le niveau sportif, pas la météo, ni même l'activité choisie. C'est la <strong>préparation</strong> — ou l'absence de préparation.
        </p>

        <p className="text-gray-600 leading-relaxed mb-6">
          Ce guide compile tout ce que j'aurais voulu dire à chaque visiteur avant qu'il arrive. Dix conseils testés, éprouvés, parfois appris à la dure. Lisez-les une fois, et votre journée n'aura rien à envier aux plus belles aventures.
        </p>

        <StatGrid stats={[
          { val: '3 000+', label: 'grimpeurs accompagnés', icon: '🧗' },
          { val: '98%', label: 'taux de satisfaction', icon: '⭐' },
          { val: '8 ans', label: "d'expérience terrain", icon: '📅' },
          { val: '0', label: 'accident grave en 2024', icon: '🛡️' },
        ]} />
      </section>

      <section id="avant-depart">
        <h2 className="text-3xl font-black mt-12 mb-6" style={{ color: DARK }}>Avant le départ</h2>
        <p className="text-gray-600 leading-relaxed mb-8">
          La moitié des bonnes journées se jouent à la maison, la veille au soir. Voici les trois points qui font toute la différence.
        </p>
      </section>

      <section id="tenue">
        <NumberedStep number={1} title="La bonne tenue — pas de chaussures ouvertes" color={GREEN}>
          <p className="mb-4">
            Je le répète à chaque arrivée de groupe et pourtant, chaque week-end, quelqu'un débarque en tongs. Règle absolue : <strong>chaussures fermées obligatoires</strong>. Baskets, chaussures de sport, chaussures de randonnée légères — tout passe. Sandales, claquettes, talons : non.
          </p>
          <CheckList items={[
            "Chaussures fermées avec bonne accroche (sneakers ou trail léger idéal)",
            "Pantalon ou legging qui ne gêne pas les mouvements des jambes",
            "T-shirt technique respirant (évitez le coton qui retient la transpiration)",
            "Une couche supplémentaire pour le matin si fraîche saison",
            "Cheveux longs attachés — obligatoire sur certaines activités",
          ]} />
          <Callout type="warning" title="Ce qu'il faut enlever">
            Bijoux (bagues, bracelets, colliers), montres non sportives et lunettes de vue sans cordon. Les casiers sécurisés sont gratuits — utilisez-les.
          </Callout>
        </NumberedStep>
      </section>

      <section id="horaire">
        <NumberedStep number={2} title="Arriver 20 minutes avant — l'heure c'est l'heure" color={GREEN}>
          <p className="mb-4">
            Nos sessions démarrent à l'heure précise pour deux raisons : le briefing sécurité est obligatoire et les créneaux s'enchaînent. Arriver en retard, c'est raccourcir votre propre session — jamais celle du groupe suivant.
          </p>
          <p className="mb-4">
            J'conseille d'arriver <strong>20 minutes avant</strong> votre créneau. Ça vous laisse le temps de vous garer sereinement, récupérer votre équipement, et découvrir le site avant que l'action commence.
          </p>
          <Callout type="tip" title="Le bonus de l'arrivée matinale">
            Les premiers créneaux du matin (9h et 10h) sont systématiquement les moins bondés. Les files d'attente sont nulles, les moniteurs ont plus de temps pour vous. Un vrai luxe.
          </Callout>
        </NumberedStep>
      </section>

      <section id="hydratation">
        <NumberedStep number={3} title="S'hydrater avant — pas seulement pendant" color={GREEN}>
          <p className="mb-4">
            La plupart des gens pensent à boire pendant l'activité. C'est bien, mais <strong>trop tard</strong>. La déshydratation commence 2 heures avant que vous ressentiez la soif. Si vous arrivez déjà légèrement déshydraté (après une longue route, par exemple), vos performances et votre moral s'en ressentiront dès la première heure.
          </p>
          <StatGrid stats={[
            { val: '500ml', label: 'à boire 1h avant', icon: '💧' },
            { val: '200ml', label: 'toutes les 20 min pendant', icon: '🚰' },
            { val: '0', label: 'alcool la veille', icon: '🚫' },
            { val: '+30%', label: 'd\'endurance avec bonne hydratation', icon: '⚡' },
          ]} />
        </NumberedStep>
      </section>

      <PullQuote author="Marc Durand, moniteur escalade">
        "Un visiteur bien préparé profite 3 fois plus. Ce n'est pas une métaphore — c'est ce que je vois chaque semaine."
      </PullQuote>

      <InlineImage
        src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=600&fit=crop"
        alt="Grimpeurs en pleine action sur la via ferrata"
        caption="Un groupe bien préparé sur notre via ferrata intermédiaire — été 2024"
      />

      <section id="sur-place">
        <h2 className="text-3xl font-black mt-12 mb-6" style={{ color: DARK }}>Sur place</h2>
      </section>

      <section id="ecoute">
        <NumberedStep number={4} title="Écouter le briefing comme si votre vie en dépendait" color={ORANGE}>
          <p className="mb-4">
            Elle en dépend, en partie. Je sais que c'est tentant de regarder son téléphone pendant les explications de sécurité, surtout si vous avez déjà fait une activité similaire ailleurs. <strong>Ne le faites pas.</strong>
          </p>
          <p>
            Chaque parc a ses spécificités. Les gestes de sécurité que j'enseigne sont précis et adaptés à notre matériel. Un mousqueton qui s'ouvre d'une façon chez nous peut s'ouvrir différemment ailleurs. Cinq minutes d'attention au départ = une journée sans incident.
          </p>
        </NumberedStep>
      </section>

      <section id="rythme">
        <NumberedStep number={5} title="Respecter votre rythme — l'ego au vestiaire" color={ORANGE}>
          <p className="mb-4">
            Le piège le plus courant, surtout entre amis ou en famille : vouloir tout faire en premier, aller plus vite que les autres, tenter le niveau supérieur trop tôt. Résultat ? Fatigue prématurée, frustration, parfois blessure légère.
          </p>
          <CheckList items={[
            "Commencez par les niveaux faciles, même si vous êtes sportif",
            "Faites des pauses régulières — l'adrénaline masque la fatigue",
            "Ne vous comparez pas aux autres groupes",
            "Signalez à votre moniteur si quelque chose vous fait peur",
            "Il est toujours ok de dire non à un obstacle trop difficile",
          ]} color={ORANGE} />
        </NumberedStep>
      </section>

      <section id="photos">
        <NumberedStep number={6} title="Penser aux photos — mais en sécurité" color={ORANGE}>
          <p className="mb-4">
            Oui, vous voudrez des photos. Non, vous ne pouvez pas tenir votre téléphone en main sur la via ferrata ou au-dessus du vide. La solution ? Les deux options officielles :
          </p>
          <CheckList items={[
            "Bracelet de poignet pour téléphone (vendu à la boutique du parc)",
            "GoPro avec fixation casque — disponible à la location à l'accueil",
            "Zones photos désignées à chaque arrêt — on vous en informe au briefing",
            "Notre photographe partenaire est présent les weekends (option à réserver)",
          ]} color={ORANGE} />
          <Callout type="info" title="Photo souvenir offerte">
            Chaque participant reçoit une photo de groupe professionnelle en fin de session. Elle est envoyée par email dans les 48h — et c'est inclus dans le prix.
          </Callout>
        </NumberedStep>
      </section>

      <section id="retour">
        <h2 className="text-3xl font-black mt-12 mb-6" style={{ color: DARK }}>Pour repartir au top</h2>
      </section>

      <section id="recuperation">
        <NumberedStep number={7} title="La récupération active après l'effort" color={GREEN}>
          <p className="mb-4">
            Après 2 à 4 heures d'activité physique intense, votre corps a besoin d'aide. Ne sautez pas dans votre voiture en claquant des doigts — prenez 15 minutes pour décompresser.
          </p>
          <CheckList items={[
            "Étirements légers dans notre zone de récupération (ombragée, tables disponibles)",
            "Rehydratation : au moins 500ml avant de reprendre le volant",
            "Snack protéiné : notre snack bar propose des options récupération",
            "Douche si vous avez transpiré — vestiaires ouverts jusqu'à 19h30",
          ]} />
        </NumberedStep>
      </section>

      <section id="avis">
        <NumberedStep number={8} title="Laisser un avis — ça nous aide vraiment" color={GREEN}>
          <p>
            Pas pour flatter notre ego (enfin, un peu quand même) mais parce que vos retours guident nos améliorations. Un moniteur trop pressé ? Un parcours mal indiqué ? Un accueil froid à la caisse ? Dites-le. Et si tout était parfait, dites-le aussi — ça compte.
          </p>
          <Callout type="success" title="Où laisser votre avis ?">
            Google, TripAdvisor, ou directement via le QR code à l'accueil. Les avis prennent 2 minutes et nous aident à améliorer l'expérience pour les prochains visiteurs.
          </Callout>
        </NumberedStep>
      </section>

      <section id="conclusion">
        <h2 className="text-3xl font-black mt-14 mb-6" style={{ color: DARK }}>En résumé</h2>

        <div className="bg-gray-50 rounded-3xl p-8 border-2" style={{ borderColor: `${GREEN}30` }}>
          <p className="text-gray-700 leading-relaxed mb-6">
            Une journée parfaite au parc se prépare en amont, se vit dans l'instant présent et se prolonge dans les souvenirs. Suivez ces 10 conseils — ou simplement les 3 premiers — et vous repartirez avec le sourire.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Chaussures fermées + tenue sportive",
              "Arriver 20 min en avance",
              "S'hydrater avant et pendant",
              "Écouter le briefing complet",
              "Respecter son propre rythme",
              "Récupérer avant de repartir",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0" style={{ backgroundColor: GREEN }}>
                  {i + 1}
                </div>
                <span className="text-gray-700 font-medium text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

function ArticleBodyPluie() {
  return (
    <div className="article-content">
      <p className="text-xl text-gray-600 leading-relaxed mb-6 font-medium">
        La météo est capricieuse, les aventures ne devraient pas l'être. Voici comment nous gérons les jours de pluie et ce que vous pouvez faire pour sauver votre journée.
      </p>

      <section id="intro">
        <Callout type="info" title="Notre politique météo en bref">
          En cas de conditions dangereuses (orage, vent &gt; 60 km/h, inondation), les activités extérieures sont suspendues et vous êtes intégralement remboursé ou reporté sans frais.
        </Callout>
      </section>

      <section id="activites-couvertes">
        <h2 className="text-3xl font-black mt-12 mb-6" style={{ color: DARK }}>Activités par tous temps</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          Une petite pluie ne nous arrête pas. Certaines de nos activités sont accessibles même sous la bruine :
        </p>
        <CheckList items={[
          "Escalade indoor — notre mur de 15m est entièrement couvert",
          "Via ferrata basse — praticable jusqu'à pluie modérée",
          "Accrobranche bas (moins de 5m) — praticable sous pluie légère",
          "Salle de briefing et zone de restauration couvertes",
          "Activités de cohésion en salle (pour groupes, sur réservation)",
        ]} />
      </section>

      <section id="politique">
        <h2 className="text-3xl font-black mt-12 mb-6" style={{ color: DARK }}>Notre politique météo</h2>
      </section>

      <section id="report">
        <NumberedStep number={1} title="Reporter sans stress" color={'#3b82f6'}>
          <p className="mb-4">Vous pouvez reporter jusqu'à 2h avant votre créneau, sans frais et sans justification. Appelez le <strong>01 23 45 67 89</strong> ou faites-le depuis votre espace client en ligne.</p>
          <Callout type="tip" title="Astuce">
            Réservez par défaut un créneau de remplacement lors de votre report. Nos weekends se remplissent vite.
          </Callout>
        </NumberedStep>
      </section>

      <section id="remboursement">
        <NumberedStep number={2} title="Remboursement" color={'#3b82f6'}>
          <p>Si c'est nous qui annulons pour raisons météo, le remboursement est automatique sous 5 jours ouvrés. Si c'est vous qui annulez moins de 48h avant, les conditions générales s'appliquent.</p>
        </NumberedStep>
      </section>

      <section id="conseils">
        <h2 className="text-3xl font-black mt-12 mb-6" style={{ color: DARK }}>Conseils pratiques</h2>
        <CheckList items={[
          "Vérifiez la météo locale 48h et 24h avant votre visite",
          "Apportez un imperméable léger même par temps incertain",
          "Nos moniteurs décident en temps réel si les conditions permettent l'activité",
          "Une bruine légère n'empêche généralement pas nos activités",
        ]} color={'#3b82f6'} />
      </section>

      <section id="conclusion">
        <h2 className="text-3xl font-black mt-12 mb-6" style={{ color: DARK }}>En résumé</h2>
        <div className="bg-blue-50 rounded-3xl p-8 border-2 border-blue-100">
          <p className="text-gray-700 leading-relaxed">
            La pluie n'est pas une fatalité. Avec nos activités couvertes et notre politique de report souple, votre aventure peut toujours avoir lieu — ou être décalée sereinement.
          </p>
        </div>
      </section>
    </div>
  );
}

// Map slug → corps d'article
const ARTICLE_BODIES: Record<string, React.ReactNode> = {
  'conseils-bonne-journee': <ArticleBodyConseils />,
  'activites-pluie': <ArticleBodyPluie />,
};

// ─── Barre de progression de lecture ─────────────────────────────────────────
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left"
      style={{ scaleX, background: `linear-gradient(to right, ${GREEN}, ${ORANGE})` }}
    />
  );
}

// ─── Table des matières ────────────────────────────────────────────────────────
function TableOfContents({
  sections,
  activeId,
}: {
  sections: Section[];
  activeId: string;
}) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${GREEN}15` }}>
          <List className="size-4" style={{ color: GREEN }} />
        </div>
        <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Sommaire</h3>
      </div>
      <nav className="space-y-1">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              whileHover={{ x: 3 }}
              className={`w-full text-left flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm transition-all ${
                section.level === 2 ? 'pl-7' : ''
              }`}
              style={
                isActive
                  ? { backgroundColor: `${GREEN}12`, color: GREEN, fontWeight: 700 }
                  : { color: '#6b7280', fontWeight: 500 }
              }
            >
              {isActive && (
                <motion.div
                  layoutId="toc-indicator"
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: GREEN }}
                />
              )}
              {!isActive && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gray-200" />}
              <span className="leading-tight">{section.title}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}

// ─── Boutons de partage ────────────────────────────────────────────────────────
function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareActions = [
    {
      label: 'Twitter / X',
      icon: <Twitter className="size-4" />,
      color: '#000',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank'),
    },
    {
      label: 'Facebook',
      icon: <Facebook className="size-4" />,
      color: '#1877f2',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'),
    },
    {
      label: copied ? 'Copié !' : 'Copier le lien',
      icon: copied ? <Check className="size-4" /> : <Copy className="size-4" />,
      color: copied ? '#22c55e' : GREEN,
      action: copyLink,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${ORANGE}15` }}>
          <Share2 className="size-4" style={{ color: ORANGE }} />
        </div>
        <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Partager</h3>
      </div>
      <div className="space-y-2">
        {shareActions.map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ x: 3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={action.action}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all border-2 border-transparent hover:shadow-sm"
            style={{ color: action.color, backgroundColor: `${action.color}10` }}
          >
            {action.icon}
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Commentaires / Réactions ─────────────────────────────────────────────────
function ReactionBar({ likes: initialLikes }: { likes: number }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(l => liked ? l - 1 : l + 1);
  };

  return (
    <div className="flex items-center gap-3 py-6 border-t border-b border-gray-100 my-10">
      <span className="text-sm text-gray-500 font-medium">Cet article vous a aidé ?</span>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLike}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all"
        style={
          liked
            ? { backgroundColor: `${GREEN}15`, color: GREEN }
            : { backgroundColor: '#f3f4f6', color: '#6b7280' }
        }
        animate={liked ? { scale: [1, 1.15, 1] } : {}}
      >
        <ThumbsUp className={`size-4 ${liked ? 'fill-current' : ''}`} />
        <span>{likes}</span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSaved(!saved)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all"
        style={
          saved
            ? { backgroundColor: `${ORANGE}15`, color: ORANGE }
            : { backgroundColor: '#f3f4f6', color: '#6b7280' }
        }
      >
        <Bookmark className={`size-4 ${saved ? 'fill-current' : ''}`} />
        {saved ? 'Sauvegardé' : 'Sauvegarder'}
      </motion.button>
    </div>
  );
}

// ─── Card article lié ──────────────────────────────────────────────────────────
function RelatedArticleCard({ slug }: { slug: string }) {
  const data = RELATED_ARTICLES_DATA[slug];
  if (!data) return null;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all"
    >
      <Link to={`/blog/${slug}`} className="block">
        <div className="relative h-44 overflow-hidden">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-black text-white backdrop-blur-sm"
            style={{ backgroundColor: `${data.categoryColor}DD` }}
          >
            {data.category}
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-[11px] font-bold">
            <Clock className="size-3" /> {data.readTime} min
          </div>
        </div>
        <div className="p-5">
          <h4 className="font-black text-gray-900 text-sm leading-tight mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
            {data.title}
          </h4>
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{data.excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{data.date}</span>
            <motion.span whileHover={{ x: 3 }} className="text-xs font-bold flex items-center gap-1" style={{ color: GREEN }}>
              Lire <ArrowRight className="size-3" />
            </motion.span>
          </div>
        </div>
        <div className="h-0.5" style={{ backgroundColor: data.categoryColor }} />
      </Link>
    </motion.div>
  );
}

// ─── Hook : détection section active ─────────────────────────────────────────
function useActiveSection(sections: Section[]) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: '-20% 0px -70% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  return activeId;
}

// ─── Page principale ──────────────────────────────────────────────────────────
export function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const article = ARTICLES_DB[slug ?? ''] ?? FALLBACK_ARTICLE;
  const activeSection = useActiveSection(article.sections);
  const [showMobileTOC, setShowMobileTOC] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.08]);

  // Corps d'article
  const bodyContent = ARTICLE_BODIES[article.slug] ?? ARTICLE_BODIES['conseils-bonne-journee'];

  return (
    <>
      <ReadingProgress />

      <div className="min-h-screen bg-white">

        {/* ── HERO ── */}
        <div ref={heroRef} className="relative h-[75vh] min-h-[520px] overflow-hidden">
          <motion.div style={{ scale: heroScale }} className="absolute inset-0">
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Contenu hero */}
          <motion.div
            style={{ opacity: heroOpacity }}
            className="absolute inset-0 flex flex-col justify-end container mx-auto px-6 pb-16"
          >
            {/* Fil d'Ariane */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 text-white/50 text-sm mb-6"
            >
              <Link to="/" className="hover:text-white/80 transition-colors">Accueil</Link>
              <ChevronRight className="size-3.5" />
              <Link to="/blog" className="hover:text-white/80 transition-colors">Blog & Conseils</Link>
              <ChevronRight className="size-3.5" />
              <span className="text-white/70 truncate max-w-xs">{article.category}</span>
            </motion.div>

            {/* Catégorie */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black text-white mb-5 w-fit backdrop-blur-sm border border-white/20"
              style={{ backgroundColor: `${article.categoryColor}CC` }}
            >
              {article.categoryIcon}
              {article.category}
            </motion.div>

            {/* Titre */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
              className="text-4xl md:text-6xl font-black text-white leading-[1.05] mb-4 max-w-4xl"
            >
              {article.title}
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/75 text-lg max-w-2xl mb-7 leading-relaxed"
            >
              {article.subtitle}
            </motion.p>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-5 text-white/70 text-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg backdrop-blur-sm">
                  {article.author.avatar}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{article.author.name}</div>
                  <div className="text-white/60 text-xs">{article.author.role}</div>
                </div>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <span className="flex items-center gap-1.5"><Calendar className="size-4" />{article.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="size-4" />{article.readTime} min de lecture</span>
              <span className="flex items-center gap-1.5"><Eye className="size-4" />{article.views.toLocaleString()} vues</span>
            </motion.div>
          </motion.div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg viewBox="0 0 1440 60" className="w-full h-14" preserveAspectRatio="none">
              <path d="M0,30 C240,60 480,5 720,35 C960,60 1200,10 1440,40 L1440,60 L0,60 Z" fill="white" />
            </svg>
          </div>
        </div>

        {/* ── BARRE MOBILE (TOC + partage) ── */}
        <div className="lg:hidden sticky top-20 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setShowMobileTOC(!showMobileTOC)}
              className="flex items-center gap-2 text-sm font-bold text-gray-700"
            >
              <List className="size-4" style={{ color: GREEN }} />
              Sommaire
              {showMobileTOC ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Clock className="size-4" />
              {article.readTime} min
            </div>
          </div>

          <AnimatePresence>
            {showMobileTOC && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-gray-100"
              >
                <div className="p-4 grid grid-cols-1 gap-1 max-h-64 overflow-y-auto">
                  {article.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setShowMobileTOC(false);
                        const el = document.getElementById(section.id);
                        if (el) {
                          const top = el.getBoundingClientRect().top + window.pageYOffset - 110;
                          window.scrollTo({ top, behavior: 'smooth' });
                        }
                      }}
                      className={`text-left px-3 py-2 rounded-xl text-sm transition-all ${section.level === 2 ? 'pl-8' : ''}`}
                      style={
                        activeSection === section.id
                          ? { backgroundColor: `${GREEN}12`, color: GREEN, fontWeight: 700 }
                          : { color: '#6b7280' }
                      }
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CONTENU PRINCIPAL ── */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col xl:flex-row gap-12">

            {/* ── Article ── */}
            <main className="flex-1 min-w-0 max-w-3xl">

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.06 }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer"
                    style={{ borderColor: `${article.categoryColor}40`, color: article.categoryColor, backgroundColor: `${article.categoryColor}0D` }}
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>

              {/* Corps */}
              <div className="prose-article">
                {bodyContent}
              </div>

              {/* Réactions */}
              <ReactionBar likes={article.likes} />

              {/* Auteur */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl p-7 my-10 border-2"
                style={{ borderColor: `${GREEN}30`, backgroundColor: `${GREEN}06` }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl flex-shrink-0">
                    {article.author.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-black text-lg text-gray-900">{article.author.name}</span>
                      <span className="px-3 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: GREEN }}>
                        Auteur
                      </span>
                    </div>
                    <div className="text-sm font-medium mb-3" style={{ color: GREEN }}>{article.author.role}</div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{article.author.bio}</p>
                    <Link
                      to={`/blog?auteur=${article.author.name}`}
                      className="inline-flex items-center gap-2 text-sm font-bold transition-colors"
                      style={{ color: GREEN }}
                    >
                      <BookOpen className="size-4" />
                      Voir ses {article.author.articlesCount} articles
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Nav prev/next */}
              <div className="flex flex-col sm:flex-row gap-4 my-10">
                <motion.button
                  whileHover={{ x: -4 }}
                  onClick={() => navigate('/blog')}
                  className="flex-1 flex items-center gap-3 p-5 rounded-2xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-md transition-all group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors flex-shrink-0">
                    <ArrowLeft className="size-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Retour</div>
                    <div className="font-bold text-gray-900 text-sm">Tous les articles</div>
                  </div>
                </motion.button>

                {article.relatedSlugs[0] && RELATED_ARTICLES_DATA[article.relatedSlugs[0]] && (
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex-1"
                  >
                    <Link
                      to={`/blog/${article.relatedSlugs[0]}`}
                      className="flex items-center gap-3 p-5 rounded-2xl border-2 border-gray-100 hover:border-green-200 hover:shadow-md transition-all group h-full"
                      style={{ justifyContent: 'flex-end', textAlign: 'right' }}
                    >
                      <div className="flex-1">
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Article suivant</div>
                        <div className="font-bold text-gray-900 text-sm line-clamp-2">
                          {RELATED_ARTICLES_DATA[article.relatedSlugs[0]].title}
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${GREEN}15` }}>
                        <ArrowRight className="size-5" style={{ color: GREEN }} />
                      </div>
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Articles liés */}
              <section className="mt-16">
                <div className="flex items-center gap-2 mb-7">
                  <div className="w-1 h-7 rounded-full" style={{ backgroundColor: ORANGE }} />
                  <h2 className="text-2xl font-black text-gray-900">Articles liés</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {article.relatedSlugs.map((s) => (
                    <RelatedArticleCard key={s} slug={s} />
                  ))}
                </div>
              </section>

            </main>

            {/* ── Sidebar sticky ── */}
            <aside className="hidden xl:block xl:w-72 flex-shrink-0">
              <div className="sticky top-28 space-y-6">

                {/* Table des matières */}
                <TableOfContents
                  sections={article.sections}
                  activeId={activeSection}
                />

                {/* Partage */}
                <ShareButtons title={article.title} />

                {/* Stats article */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${GREEN}15` }}>
                      <TrendingUp className="size-4" style={{ color: GREEN }} />
                    </div>
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Stats</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: article.readTime + ' min', label: 'Lecture', icon: '📖' },
                      { val: article.views.toLocaleString(), label: 'Vues', icon: '👁️' },
                      { val: article.likes.toString(), label: 'Utile', icon: '👍' },
                      { val: article.tags.length.toString(), label: 'Sujets', icon: '🏷️' },
                    ].map(({ val, label, icon }) => (
                      <div key={label} className="text-center p-3 rounded-2xl bg-gray-50">
                        <div className="text-lg mb-1">{icon}</div>
                        <div className="font-black text-gray-900 text-sm">{val}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative rounded-3xl overflow-hidden shadow-xl p-6 text-white"
                  style={{ background: `linear-gradient(135deg, ${DARK} 0%, #1a2a00 100%)` }}
                >
                  <motion.div
                    className="absolute -top-6 -right-6 w-24 h-24 rounded-full"
                    style={{ backgroundColor: GREEN, opacity: 0.2 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />
                  <div className="relative z-10">
                    <div className="text-2xl mb-3">🚀</div>
                    <h4 className="font-black text-base mb-1">Prêt à vivre l'aventure ?</h4>
                    <p className="text-white/60 text-xs mb-4 leading-relaxed">
                      Réservez votre session maintenant
                    </p>
                    <Link
                      to="/booking"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-black text-sm text-white"
                      style={{ background: `linear-gradient(135deg, ${ORANGE}, #d66310)` }}
                    >
                      Réserver <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      to="/blog"
                      className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 rounded-2xl font-bold text-sm text-white/70 hover:text-white transition-colors"
                    >
                      ← Tous les articles
                    </Link>
                  </div>
                </motion.div>

              </div>
            </aside>

          </div>
        </div>

      </div>

      {/* Styles article */}
      <style>{`
        .article-content h2 {
          font-size: 1.875rem;
          font-weight: 900;
          color: ${DARK};
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          line-height: 1.2;
        }
        .article-content h3 {
          font-size: 1.375rem;
          font-weight: 800;
          color: ${DARK};
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .article-content p {
          color: #4b5563;
          line-height: 1.8;
          margin-bottom: 1.25rem;
        }
        .article-content strong {
          color: ${DARK};
          font-weight: 700;
        }
        .article-content a {
          color: ${GREEN};
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .article-content a:hover {
          color: ${ORANGE};
        }
      `}</style>
    </>
  );
}
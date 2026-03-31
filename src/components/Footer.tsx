// components/Footer.tsx
import { cleanWpData, API_URL, API_KEY } from '../config/config';
import { Link, useLocation } from 'react-router-dom';
import { Mountain, Mail, MapPin, Calendar, Heart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface FooterPark {
  id: string;
  name: string;
  location: string;
  emoji: string;
  minAge: number;
  rating: number;
  minPrice: number;
  activities: string[];
  cgvUrl?: string;    // ACF parc_cgv_url  — slug relatif ou URL externe
  cgvLabel?: string;  // ACF parc_cgv_label — libellé optionnel
}

interface LegalLink { label: string; to: string }

interface FooterData {
  logo: { url: string; alt: string } | null;
  colors: { background: string; primary: string; secondary: string };
  contact: { phone: string; email: string; description: string };
  stats: Array<{ number: string; label: string }>;
  quickLinks: LegalLink[];
  activities: Array<{ name: string; emoji: string; link: string }>;
  legalLinks: LegalLink[];
  cta: { title: string; subtitle: string; bookingUrl: string; contactUrl: string };
  parks: FooterPark[];
  showBackToTop: boolean;
  currentYear: number;
}

// ─────────────────────────────────────────────────────────────
// VALEURS PAR DÉFAUT
// Affichées immédiatement — WordPress les remplace silencieusement.
// Les legalLinks par défaut N'incluent PAS de CGV générique :
// le lien CGV est injecté dynamiquement selon la page visitée.
// ─────────────────────────────────────────────────────────────

const DEFAULT: FooterData = {
  logo: null,
  colors: { background: '#111111', primary: '#357600', secondary: '#eb700f' },
  contact: {
    phone:       '01 23 45 67 89',
    email:       'contact@nolimit-aventure.fr',
    description: '5 parcs multi-activités en France pour vivre des sensations fortes en pleine nature.',
  },
  stats: [
    { number: '5',   label: 'Parcs'     },
    { number: '20+', label: 'Activités' },
    { number: '∞',   label: 'Souvenirs' },
  ],
  quickLinks: [
    { label: 'Nos Parcs',            to: '/parks'     },
    { label: 'Activités',            to: '/activities'},
    { label: 'Réserver',             to: '/booking'   },
    { label: 'Groupes & Événements', to: '/groups'    },
    { label: 'FAQ',                  to: '/faq'       },
    { label: 'Contact',              to: '/contact'   },
  ],
  activities: [
    { name: 'Accrobranche',   emoji: '🌳', link: '/activities/accrobranche' },
    { name: 'Paintball',      emoji: '🎯', link: '/activities/paintball'    },
    { name: 'Tyrolienne',     emoji: '⚡', link: '/activities/tyrolienne'   },
    { name: "Tir à l'arc",   emoji: '🏹', link: '/activities/archery'      },
    { name: 'Escape Game',    emoji: '🔐', link: '/activities/escape'       },
    { name: 'Parcours Filet', emoji: '🕸️', link: '/activities/filet'       },
  ],
  legalLinks: [
    { label: 'Mentions légales',             to: '/legal'   },
    { label: 'Politique de confidentialité', to: '/privacy' },
    { label: 'Règlement intérieur',          to: '/rules'   },
  ],
  cta: {
    title:      "Rejoignez l'aventure",
    subtitle:   "Réservez dès maintenant et vivez une expérience inoubliable dans l'un de nos 5 parcs",
    bookingUrl: '/booking',
    contactUrl: '/contact',
  },
  parks: [],
  showBackToTop: true,
  currentYear: new Date().getFullYear(),
};

// ─────────────────────────────────────────────────────────────
// HOOK — données footer depuis WordPress
// loading = false dès le départ : les valeurs par défaut
// s'affichent immédiatement, WP met à jour après le fetch.
// ─────────────────────────────────────────────────────────────

function useFooterData(): FooterData {
  const [data, setData] = useState<FooterData>(DEFAULT);

  useEffect(() => {
    fetch(`${API_URL}/footer`, {
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { 'X-NoLimit-Key': API_KEY } : {}),
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(raw => {
        const d = cleanWpData(raw);
        setData({
          logo: d.logo?.url ? d.logo : DEFAULT.logo,
          colors: {
            background: d.colors?.background || DEFAULT.colors.background,
            primary:    d.colors?.primary    || DEFAULT.colors.primary,
            secondary:  d.colors?.secondary  || DEFAULT.colors.secondary,
          },
          contact: {
            phone:       d.contact?.phone       || DEFAULT.contact.phone,
            email:       d.contact?.email       || DEFAULT.contact.email,
            description: d.contact?.description || DEFAULT.contact.description,
          },
          stats:      d.stats?.length      ? d.stats      : DEFAULT.stats,
          quickLinks: d.quickLinks?.length  ? d.quickLinks : DEFAULT.quickLinks,
          activities: d.activities?.length  ? d.activities : DEFAULT.activities,
          // legalLinks vient de WordPress (chaque lien pointe vers un slug relatif grâce au fix page_url)
          legalLinks: d.legalLinks?.length  ? d.legalLinks : DEFAULT.legalLinks,
          cta: {
            title:      d.cta?.title      || DEFAULT.cta.title,
            subtitle:   d.cta?.subtitle   || DEFAULT.cta.subtitle,
            bookingUrl: d.cta?.bookingUrl || DEFAULT.cta.bookingUrl,
            contactUrl: d.cta?.contactUrl || DEFAULT.cta.contactUrl,
          },
          // Les parcs embarquent déjà cgvUrl + cgvLabel via get_parks_for_footer()
          parks:         d.parks?.length ? d.parks : DEFAULT.parks,
          showBackToTop: d.showBackToTop ?? DEFAULT.showBackToTop,
          currentYear:   d.currentYear   || new Date().getFullYear(),
        });
      })
      .catch(err => {
        console.warn('⚠️ Footer WordPress indisponible, valeurs par défaut conservées:', err);
      });
  }, []);

  return data;
}

// ─────────────────────────────────────────────────────────────
// HOOK — CGV du parc selon l'URL courante
//
// Lit pathname via useLocation, match /parks/{slug},
// cherche le parc dans la liste, retourne son CGV si renseigné.
//
//   /parks/nolimit-chevry   → { label: "CGV – NoLimit Chevry", to: "/cgv/chevry" }
//   /parks/nolimit-nemours  → { label: "CGV – NoLimit Nemours", to: "/cgv/nemours" }
//   /activites              → null
//   /parks/nolimit-chevry   → null (si parc sans cgvUrl dans ACF)
// ─────────────────────────────────────────────────────────────

function useParkCgv(parks: FooterPark[]): LegalLink | null {
  const { pathname } = useLocation();

  return useMemo(() => {
    const match = pathname.match(/^\/parks?\/([^/?#]+)/i);
    if (!match) return null;

    const slug = match[1].toLowerCase();

    const park = parks.find(p => {
      const pid = p.id.toLowerCase();
      return pid === slug || pid === slug.replace(/^nolimit-/, '');
    });

    if (!park?.cgvUrl) return null;

    return {
      to:    park.cgvUrl,
      label: park.cgvLabel?.trim() || `CGV – ${park.name}`,
    };
  }, [pathname, parks]);
}

// ─────────────────────────────────────────────────────────────
// HELPER — construit la liste finale des liens légaux
//
// Stratégie : on cherche si un lien "CGV" générique existe déjà
// dans la liste WordPress (label contient "cgv" ou to = "/terms").
//   • Si oui → on le remplace par le CGV du parc
//   • Si non → on l'ajoute en fin de liste
// Quand on n'est pas sur une page parc → liste inchangée.
// ─────────────────────────────────────────────────────────────

function buildLegalLinks(base: LegalLink[], parkCgv: LegalLink | null): LegalLink[] {
  if (!parkCgv) return base;

  const cgvIndex = base.findIndex(
    l => l.label.toLowerCase().includes('cgv') || l.to === '/terms'
  );

  if (cgvIndex >= 0) {
    const updated = [...base];
    updated[cgvIndex] = parkCgv;
    return updated;
  }

  return [...base, parkCgv];
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT — Bulle de parc interactive
// ─────────────────────────────────────────────────────────────

interface ParkBubbleProps {
  park: FooterPark;
  index: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
}

function ParkBubble({ park, index, primaryColor, secondaryColor, backgroundColor }: ParkBubbleProps) {
  const [hovered, setHovered] = useState(false);
  if (!park) return null;

  const acts = Array.isArray(park.activities) ? park.activities : [];
  const POSITIONS = [
    { top: '5%',  left: '8%',  size: 70 },
    { top: '10%', left: '62%', size: 68 },
    { top: '52%', left: '15%', size: 65 },
    { top: '55%', left: '68%', size: 62 },
    { top: '28%', left: '38%', size: 72 },
  ];
  const pos       = POSITIONS[index] ?? POSITIONS[0];
  const shortName = (park.location || park.name).split(',')[0];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 }}
      className="absolute cursor-pointer"
      style={{ top: pos.top, left: pos.left, width: pos.size, height: pos.size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/parks/${park.id}`}>
        <motion.div
          className="relative w-full h-full rounded-full flex items-center justify-center shadow-lg border-2 overflow-hidden"
          style={{
            background:   `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
            borderColor:  hovered ? secondaryColor : primaryColor,
          }}
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ y: { duration: 3 + index * 0.5, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: secondaryColor }}
            animate={{ opacity: hovered ? 0.2 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <div className="relative z-10 text-center px-1">
            <motion.div
              className="text-2xl mb-1"
              animate={hovered ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {park.emoji || '🏞️'}
            </motion.div>
            <div className="text-white text-[10px] font-bold leading-tight">{shortName}</div>
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: secondaryColor }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        </motion.div>
      </Link>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 pointer-events-none"
            style={{
              top:          index < 2 ? '100%'  : 'auto',
              bottom:       index >= 2 ? '100%' : 'auto',
              left:         '50%',
              transform:    'translateX(-50%)',
              marginTop:    index < 2  ? '12px' : '0',
              marginBottom: index >= 2 ? '12px' : '0',
              width:        '240px',
            }}
          >
            <div
              className="relative rounded-2xl p-4 shadow-2xl border-2"
              style={{ backgroundColor, borderColor: primaryColor }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
              />
              <h4 className="text-white font-black text-sm mb-2 mt-1">{park.name}</h4>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="size-3" style={{ color: secondaryColor }} />
                <span className="text-gray-400 text-xs">{park.location}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { val: `${park.minAge}+`, sub: 'ans',       color: primaryColor   },
                  { val: acts.length,       sub: 'activités',  color: secondaryColor },
                  { val: `⭐ ${park.rating}`,sub: 'note',      color: '#eab308'      },
                ].map((s, i) => (
                  <div key={i} className="text-center p-2 rounded-lg" style={{ backgroundColor: '#ffffff05' }}>
                    <div className="text-xs font-black" style={{ color: s.color }}>{s.val}</div>
                    <div className="text-[10px] text-gray-500">{s.sub}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-xs">À partir de</span>
                <span className="text-lg font-black" style={{ color: primaryColor }}>{park.minPrice}€</span>
              </div>
              {acts.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {acts.slice(0, 3).map((a, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-full text-[9px] font-medium"
                      style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                    >
                      {a}
                    </span>
                  ))}
                  {acts.length > 3 && (
                    <span className="px-2 py-1 rounded-full text-[9px] text-gray-400" style={{ backgroundColor: '#ffffff10' }}>
                      +{acts.length - 3}
                    </span>
                  )}
                </div>
              )}
              <div
                className="w-full text-center py-2 rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: secondaryColor }}
              >
                Découvrir →
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

export function Footer() {
  const footerData = useFooterData();
  const parkCgv    = useParkCgv(footerData.parks);
  const legalLinks = useMemo(
    () => buildLegalLinks(footerData.legalLinks, parkCgv),
    [footerData.legalLinks, parkCgv]
  );

  const { colors, contact, stats, quickLinks, cta, parks, showBackToTop, currentYear } = footerData;

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: colors.background }}>

      {/* Fond texturé */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Blobs */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: colors.primary, opacity: 0.1 }}
        animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: colors.secondary, opacity: 0.1 }}
        animate={{ x: [0, -60, 0], y: [0, 40, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: `${colors.primary}20` }}>
            <Heart className="size-4" style={{ color: colors.secondary }} />
            <span className="text-sm font-medium text-white">Prêt pour l'aventure ?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            {cta.title.split(' ')[0]}{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.primary}dd)` }}
            >
              {cta.title.split(' ').slice(1).join(' ')}
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">{cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={cta.bookingUrl}
                className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-full font-bold shadow-lg"
                style={{ backgroundColor: colors.secondary }}
              >
                <Calendar className="size-5" /> Réserver maintenant
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={cta.contactUrl}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold border-2 border-white/20 hover:border-white/40 transition-all"
              >
                <Mail className="size-5" /> Nous contacter
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Grid 4 colonnes ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="p-2.5 rounded-xl shadow-lg"
                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)` }}
              >
                {footerData.logo?.url
                  ? <img src={footerData.logo.url} alt={footerData.logo.alt || 'NoLimit Aventure'} className="h-7 w-auto" />
                  : <Mountain className="size-7 text-white" />
                }
              </motion.div>
              <div className="font-black">
                <div className="text-xl text-white leading-tight">NoLimit</div>
                <div className="text-sm leading-tight -mt-1" style={{ color: colors.secondary }}>Aventure</div>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">{contact.description}</p>
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s, i) => (
                <motion.div
                  key={`stat-${i}`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
                  className="text-center p-3 rounded-xl"
                  style={{ backgroundColor: '#ffffff05' }}
                >
                  <div className="text-2xl font-black" style={{ color: colors.primary }}>{s.number}</div>
                  <div className="text-xs text-gray-500 uppercase">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Liens rapides */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <ChevronRight className="size-5" style={{ color: colors.primary }} />
              Liens rapides
            </h3>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-3">
              {quickLinks.map((link, i) => (
                <motion.li key={`ql-${i}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.05 }}>
                  <Link to={link.to} className="flex items-center gap-1 text-gray-400 hover:text-white transition-all group">
                    <ChevronRight className="size-3 flex-shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: colors.primary }} />
                    <span className="text-sm group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Activités */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Activités
            </h3>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-3">
              {footerData.activities.map((a, i) => (
                <motion.li key={`act-${i}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.05 }}>
                  <Link to={a.link} className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group">
                    <motion.span className="text-lg flex-shrink-0" whileHover={{ scale: 1.3, rotate: 10 }} transition={{ type: 'spring', stiffness: 300 }}>{a.emoji}</motion.span>
                    <span className="text-sm group-hover:translate-x-1 transition-transform">{a.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Bulles parcs */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <MapPin className="size-5" style={{ color: colors.secondary }} />
              Nos parcs
            </h3>
            <p className="text-gray-400 text-sm mb-6">Survolez les bulles pour découvrir nos destinations</p>
            <div className="relative h-72 rounded-2xl" style={{ backgroundColor: '#ffffff03' }}>
              {parks.slice(0, 5).map((park, i) => (
                <ParkBubble
                  key={park.id}
                  park={park}
                  index={i}
                  primaryColor={colors.primary}
                  secondaryColor={colors.secondary}
                  backgroundColor={colors.background}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Séparateur ── */}
        <div
          className="h-px mb-8"
          style={{ background: `linear-gradient(to right, transparent, ${colors.primary}, ${colors.secondary}, transparent)` }}
        />

        {/* ── Bottom bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-gray-500 text-sm flex items-center gap-2 flex-wrap">
            © {currentYear} NoLimit Aventure.{' '}
            <span className="hidden sm:inline">Tous droits réservés.</span>
            <span className="inline-flex items-center gap-1">
              Fait avec <Heart className="size-3 fill-current" style={{ color: colors.secondary }} /> en France
            </span>
          </p>

          {/* ── Liens légaux ─────────────────────────────────────
              buildLegalLinks() a remplacé/ajouté le lien CGV
              adapté au parc courant si on est sur /parks/{slug}.
              Le lien contextuel est mis en évidence en orange.
          ── */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {legalLinks.map((link, i) => {
              const isContextual = parkCgv !== null && link.to === parkCgv.to;
              return (
                <Link
                  key={`legal-${i}`}
                  to={link.to}
                  className="transition-colors hover:text-white"
                  style={{ color: isContextual ? colors.secondary : '#6b7280' }}
                >
                  {link.label}
                  {isContextual && (
                    <span
                      className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full align-middle font-semibold"
                      style={{ backgroundColor: `${colors.secondary}25`, color: colors.secondary }}
                    >
                      ce parc
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* ── Back to top ── */}
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-4 rounded-full shadow-2xl z-50 hidden lg:flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronRight className="size-6 text-white -rotate-90" />
            </motion.div>
          </motion.button>
        )}

      </div>
    </footer>
  );
}
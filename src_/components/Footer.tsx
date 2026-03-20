import { cleanWpData } from "../config/config";
import { API_URL, API_KEY } from '../config/config';
// components/Footer.tsx - VERSION COMPLÈTE ET CORRIGÉE
import { Link } from 'react-router-dom';
import { Mountain, Mail, Phone, MapPin, Calendar, Heart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';


// ===== TYPES =====
interface FooterData {
  logo: {
    url: string;
    alt: string;
  } | null;
  colors: {
    background: string;
    primary: string;
    secondary: string;
  };
  contact: {
    description: string;
  };
  stats: Array<{
    number: string;
    label: string;
  }>;
  quickLinks: Array<{
    label: string;
    to: string;
  }>;
  activities: Array<{
    name: string;
    emoji: string;
    link: string;
  }>;
  legalLinks: Array<{
    label: string;
    to: string;
  }>;
  cta: {
    title: string;
    subtitle: string;
    bookingUrl: string;
    contactUrl: string;
  };
  parks: Array<{
    id: string;
    name: string;
    location: string;
    emoji: string;
    minAge: number;
    rating: number;
    minPrice: number;
    activities: string[];
  }>;
  showBackToTop: boolean;
  currentYear: number;
}

// ===== HOOK POUR CHARGER LES DONNÉES =====
function useFooterData() {
  const [data, setData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const apiUrl = `${API_URL}/footer`;
    
    fetch(apiUrl, { headers: { 'Content-Type': 'application/json', ...(API_KEY ? { 'X-NoLimit-Key': API_KEY } : {}) } })
      .then(res => {
        if (!res.ok) throw new Error('Erreur API Footer');
        return res.json().then(_x=>cleanWpData(_x));
      })
      .then(rawData => {
        const data = cleanWpData(rawData);
        console.log('✅ Footer chargé depuis WordPress:', data);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Erreur chargement footer:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

// ===== VALEURS PAR DÉFAUT =====
const defaultFooterData: FooterData = {
  logo: null,
  colors: { background: '#111111', primary: '#357600', secondary: '#eb700f' },
  contact: {

    description: '5 parcs multi-activités en France pour vivre des sensations fortes en pleine nature.'
  },
  stats: [
    { number: '5', label: 'Parcs' },
    { number: '20+', label: 'Activités' },
    { number: '∞', label: 'Souvenirs' }
  ],
  quickLinks: [
    { label: 'Nos Parcs', to: '/parks' },
    { label: 'Activités', to: '/activities' },
    { label: 'Réserver', to: '/booking' },
    { label: 'Groupes & Événements', to: '/groups' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact', to: '/contact' }
  ],
  activities: [
    { name: 'Accrobranche', emoji: '🌳', link: '/activities/accrobranche' },
    { name: 'Paintball', emoji: '🎯', link: '/activities/paintball' },
    { name: 'Tyrolienne', emoji: '⚡', link: '/activities/tyrolienne' },
    { name: "Tir à l'arc", emoji: '🏹', link: '/activities/archery' },
    { name: 'Escape Game', emoji: '🔐', link: '/activities/escape' },
    { name: 'Parcours Filet', emoji: '🕸️', link: '/activities/filet' }
  ],
  legalLinks: [
    { label: 'Mentions légales', to: '/legal' },
    { label: 'Politique de confidentialité', to: '/privacy' },
    { label: 'CGV', to: '/terms' },
    { label: 'Règlement intérieur', to: '/rules' }
  ],
  cta: {
    title: "Rejoignez l'aventure",
    subtitle: "Réservez dès maintenant et vivez une expérience inoubliable dans l'un de nos 5 parcs",
    bookingUrl: '/booking',
    contactUrl: '/contact'
  },
  parks: [],
  showBackToTop: true,
  currentYear: new Date().getFullYear()
};

// ========================================
// COMPOSANT: Bulle de parc interactive - VERSION CORRIGÉE
// ========================================
interface ParkBubbleProps {
  park: {
    id: string;
    name: string;
    location: string;
    emoji: string;
    minAge: number;
    rating: number;
    minPrice: number;
    activities: string[];
  };
  index: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
}

function ParkBubble({ park, index, primaryColor, secondaryColor, backgroundColor }: ParkBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);

  // ✅ VÉRIFICATIONS DE SÉCURITÉ
  if (!park) return null;
  
  // S'assurer que activities est un tableau
  const activities = Array.isArray(park.activities) ? park.activities : [];
  const location = park.location || 'Localisation inconnue';
  const name = park.name || 'Parc';
  const emoji = park.emoji || '🏞️';
  const minAge = park.minAge || 0;
  const rating = park.rating || 0;
  const minPrice = park.minPrice || 0;

  // Positions des bulles (layout naturel)
  const positions = [
    { top: '5%', left: '8%', size: 70 },
    { top: '10%', left: '62%', size: 68 },
    { top: '52%', left: '15%', size: 65 },
    { top: '55%', left: '68%', size: 62 },
    { top: '28%', left: '38%', size: 72 },
  ];

  const position = positions[index] || positions[0];
  const parkName = location.split(',')[0];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ 
        delay: 0.5 + index * 0.1,
        type: "spring",
        stiffness: 200
      }}
      className="absolute cursor-pointer"
      style={{
        top: position.top,
        left: position.left,
        width: `${position.size}px`,
        height: `${position.size}px`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bulle principale */}
      <Link to={`/parks/${park.id}`}>
        <motion.div
          className="relative w-full h-full rounded-full flex items-center justify-center shadow-lg border-2 overflow-hidden group"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
            borderColor: isHovered ? secondaryColor : primaryColor
          }}
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            y: {
              duration: 3 + index * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: secondaryColor }}
            animate={{
              opacity: isHovered ? 0.2 : 0
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Emoji + Nom */}
          <div className="relative z-10 text-center px-1">
            <motion.div
              className="text-2xl mb-1"
              animate={isHovered ? { 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.2, 1]
              } : {}}
              transition={{ duration: 0.5 }}
            >
              {emoji}
            </motion.div>
            <div className="text-white text-[10px] font-bold leading-tight">
              {parkName}
            </div>
          </div>

          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: secondaryColor }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.div>
      </Link>

      {/* Popup au hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 pointer-events-none"
            style={{
              top: index < 2 ? '100%' : 'auto',
              bottom: index >= 2 ? '100%' : 'auto',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: index < 2 ? '12px' : '0',
              marginBottom: index >= 2 ? '12px' : '0',
              width: '240px'
            }}
          >
            {/* Flèche du popup */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
              style={{ 
                backgroundColor: backgroundColor,
                borderTop: index >= 2 ? 'none' : `2px solid ${primaryColor}`,
                borderLeft: index >= 2 ? 'none' : `2px solid ${primaryColor}`,
                borderBottom: index < 2 ? 'none' : `2px solid ${primaryColor}`,
                borderRight: index < 2 ? 'none' : `2px solid ${primaryColor}`,
                [index < 2 ? 'top' : 'bottom']: '-2px'
              }}
            />

            {/* Contenu du popup */}
            <div 
              className="relative rounded-2xl p-4 shadow-2xl border-2"
              style={{ 
                backgroundColor: backgroundColor,
                borderColor: primaryColor
              }}
            >
              {/* Top gradient bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
              />

              {/* Park name */}
              <h4 className="text-white font-black text-sm mb-2 mt-1">
                {name}
              </h4>

              {/* Location */}
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="size-3" style={{ color: secondaryColor }} />
                <span className="text-gray-400 text-xs">{location}</span>
              </div>

              {/* Stats mini */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-lg" style={{ backgroundColor: '#ffffff05' }}>
                  <div className="text-xs font-black" style={{ color: primaryColor }}>
                    {minAge}+
                  </div>
                  <div className="text-[10px] text-gray-500">ans</div>
                </div>
                <div className="text-center p-2 rounded-lg" style={{ backgroundColor: '#ffffff05' }}>
                  <div className="text-xs font-black" style={{ color: secondaryColor }}>
                    {activities.length}
                  </div>
                  <div className="text-[10px] text-gray-500">activités</div>
                </div>
                <div className="text-center p-2 rounded-lg" style={{ backgroundColor: '#ffffff05' }}>
                  <div className="text-xs font-black text-yellow-500">
                    ⭐ {rating}
                  </div>
                  <div className="text-[10px] text-gray-500">note</div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-xs">À partir de</span>
                <span className="text-lg font-black" style={{ color: primaryColor }}>
                  {minPrice}€
                </span>
              </div>

              {/* Activities badges - N'afficher que si des activités existent */}
              {activities.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {activities.slice(0, 3).map((activity, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 rounded-full text-[9px] font-medium"
                      style={{ 
                        backgroundColor: `${primaryColor}20`,
                        color: primaryColor
                      }}
                    >
                      {activity}
                    </span>
                  ))}
                  {activities.length > 3 && (
                    <span 
                      className="px-2 py-1 rounded-full text-[9px] font-medium text-gray-400"
                      style={{ 
                        backgroundColor: '#ffffff10'
                      }}
                    >
                      +{activities.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* CTA */}
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

// ===== COMPOSANT PRINCIPAL =====
export function Footer() {
  const { data: footerDataFromApi, loading, error } = useFooterData();

  // Loading state
  if (loading) {
    return (
      <footer className="relative overflow-hidden" style={{ backgroundColor: '#111111' }}>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#eb700f' }}></div>
          <p className="text-white mt-4">Chargement du footer...</p>
        </div>
      </footer>
    );
  }

  // ✅ FUSION INTELLIGENTE: API + valeurs par défaut
  const footerData: FooterData = {
    logo: footerDataFromApi?.logo?.url ? footerDataFromApi.logo : defaultFooterData.logo,
    colors: {
      background: footerDataFromApi?.colors?.background || defaultFooterData.colors.background,
      primary: footerDataFromApi?.colors?.primary || defaultFooterData.colors.primary,
      secondary: footerDataFromApi?.colors?.secondary || defaultFooterData.colors.secondary,
    },
    contact: {
      description: footerDataFromApi?.contact?.description || defaultFooterData.contact.description,
    },
    stats: footerDataFromApi?.stats?.length ? footerDataFromApi.stats : defaultFooterData.stats,
    quickLinks: footerDataFromApi?.quickLinks?.length ? footerDataFromApi.quickLinks : defaultFooterData.quickLinks,
    activities: footerDataFromApi?.activities?.length ? footerDataFromApi.activities : defaultFooterData.activities,
    legalLinks: footerDataFromApi?.legalLinks?.length ? footerDataFromApi.legalLinks : defaultFooterData.legalLinks,
    cta: {
      title: footerDataFromApi?.cta?.title || defaultFooterData.cta.title,
      subtitle: footerDataFromApi?.cta?.subtitle || defaultFooterData.cta.subtitle,
      bookingUrl: footerDataFromApi?.cta?.bookingUrl || defaultFooterData.cta.bookingUrl,
      contactUrl: footerDataFromApi?.cta?.contactUrl || defaultFooterData.cta.contactUrl,
    },
    parks: footerDataFromApi?.parks?.length ? footerDataFromApi.parks : defaultFooterData.parks,
    showBackToTop: footerDataFromApi?.showBackToTop ?? defaultFooterData.showBackToTop,
    currentYear: footerDataFromApi?.currentYear || defaultFooterData.currentYear,
  };

  if (error) {
    console.warn('⚠️ Footer WordPress indisponible, utilisation des valeurs par défaut');
  }

  const { colors, contact, stats, quickLinks, activities, legalLinks, cta, parks, showBackToTop, currentYear } = footerData;

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: colors.background }}>
      {/* Pattern de fond */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl"
        style={{ backgroundColor: colors.primary, opacity: 0.1 }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: colors.secondary, opacity: 0.1 }}
        animate={{
          x: [0, -60, 0],
          y: [0, 40, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Top section - CTA */}
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
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.primary}dd)` }}>
              {cta.title.split(' ').slice(1).join(' ')}
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            {cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={cta.bookingUrl}
                className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-full font-bold shadow-lg transition-all"
                style={{ backgroundColor: colors.secondary }}
              >
                <Calendar className="size-5" />
                Réserver maintenant
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={cta.contactUrl}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold border-2 border-white/20 hover:border-white/40 transition-all"
              >
                <Mail className="size-5" />
                Nous contacter
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="p-2.5 rounded-xl shadow-lg"
                style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}dd 100%)` }}
              >
                {footerData.logo?.url ? (
                  <img src={footerData.logo.url} alt={footerData.logo.alt || 'NoLimit Aventure'} className="h-7 w-auto" />
                ) : (
                  <Mountain className="size-7 text-white" />
                )}
              </motion.div>
              <div className="font-black">
                <div className="text-xl text-white leading-tight">NoLimit</div>
                <div className="text-sm leading-tight -mt-1" style={{ color: colors.secondary }}>Aventure</div>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {contact.description}
            </p>
            
            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                  className="text-center p-3 rounded-xl"
                  style={{ backgroundColor: '#ffffff05' }}
                >
                  <div className="text-2xl font-black" style={{ color: colors.primary }}>{stat.number}</div>
                  <div className="text-xs text-gray-500 uppercase">{stat.label}</div>
                </motion.div>
              ))}
            </div>

      
  
          </motion.div>

          {/* Liens rapides - 2 colonnes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <ChevronRight className="size-5" style={{ color: colors.primary }} />
              Liens rapides
            </h3>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link 
                    to={link.to} 
                    className="flex items-center gap-1 text-gray-400 hover:text-white transition-all group"
                  >
                    <ChevronRight className="size-3 flex-shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: colors.primary }} />
                    <span className="text-sm group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Activités avec emojis - 2 colonnes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Activités
            </h3>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-3">
              {activities.map((activity, index) => (
                <motion.li
                  key={activity.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Link 
                    to={activity.link} 
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group"
                  >
                    <motion.span 
                      className="text-lg flex-shrink-0"
                      whileHover={{ scale: 1.3, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {activity.emoji}
                    </motion.span>
                    <span className="text-sm group-hover:translate-x-1 transition-transform">{activity.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Nos parcs - BULLES INTERACTIVES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <MapPin className="size-5" style={{ color: colors.secondary }} />
              Nos parcs
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Survolez les bulles pour découvrir nos destinations
            </p>
            
            {/* Bulles de parcs */}
            <div className="relative h-72 rounded-2xl" style={{ backgroundColor: '#ffffff03' }}>
              {parks.slice(0, 5).map((park, index) => (
                <ParkBubble 
                  key={park.id} 
                  park={park} 
                  index={index}
                  primaryColor={colors.primary}
                  secondaryColor={colors.secondary}
                  backgroundColor={colors.background}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Separator */}
        <div className="h-px mb-8" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}, ${colors.secondary}, transparent)` }} />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* Copyright */}
          <p className="text-gray-500 text-sm flex items-center gap-2">
            © {currentYear} NoLimit Aventure. 
            <span className="hidden sm:inline">Tous droits réservés.</span>
            <span className="inline-flex items-center gap-1">
              Fait avec <Heart className="size-3 fill-current" style={{ color: colors.secondary }} /> en France
            </span>
          </p>

          {/* Legal links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {legalLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className="text-gray-500 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Back to top */}
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
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight className="size-6 text-white -rotate-90" />
            </motion.div>
          </motion.button>
        )}
      </div>
    </footer>
  );
}
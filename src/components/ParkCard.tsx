// components/ParkCard.tsx
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Users, Activity, Clock, TrendingUp } from 'lucide-react';
import { Park } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';

interface ParkCardProps {
  park: Park;
  compact?: boolean;
  index?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

const getActivityIcon = (activity: string): string => {
  const iconMap: Record<string, string> = {
    'Accrobranche': '🌳',
    'Tyrolienne': '⚡',
    'Tyrolienne 300m': '⚡',
    'Paintball': '🎯',
    'Parcours filet': '🕸️',
    "Tir à l'arc": '🏹',
    'Archery Tag': '🏹',
    'Escape Game': '🔐',
    'Parcours extrême': '🔥',
    'Orientation': '🧭',
    'Chasse au trésor': '🗺️',
    'Parcours Kids': '👶',
    'Animations pédagogiques': '📚'
  };
  return iconMap[activity] || '🎯';
};

const getParkEmoji = (park: Park): string => {
  const { name, location } = park;
  const locationLower = location.toLowerCase();
  const nameLower = name.toLowerCase();
  
  if (locationLower.includes('savoie') || locationLower.includes('mont')) return '⛰️';
  if (locationLower.includes('forêt') || locationLower.includes('bois')) return '🌲';
  if (locationLower.includes('lac')) return '🏞️';
  if (locationLower.includes('rivière')) return '🌊';
  if (locationLower.includes('vallée')) return '🏔️';
  
  if (nameLower.includes('forest') || nameLower.includes('wood')) return '🌲';
  if (nameLower.includes('mountain')) return '⛰️';
  if (nameLower.includes('lake')) return '🏞️';
  if (nameLower.includes('river')) return '🌊';
  if (nameLower.includes('adventure')) return '⚡';
  if (nameLower.includes('extreme')) return '🔥';
  if (nameLower.includes('nature')) return '🍃';
  
  const fallbackEmojis = ['🌳', '🏞️', '⛰️', '🌊', '🏔️', '🧗', '⚡', '🍃', '🔥', '🌲'];
  return fallbackEmojis[park.id.charCodeAt(0) % fallbackEmojis.length];
};

// Hook pour détecter le touch device
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    const check = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    check();
    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') setIsTouch(true);
    }, { once: true });
  }, []);
  
  return isTouch;
}

export function ParkCard({ 
  park, 
  compact = false, 
  index = 0,
  primaryColor = '#357600',
  secondaryColor = '#eb700f'
}: ParkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapExpanded, setIsTapExpanded] = useState(false);
  const isTouch = useIsTouchDevice();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const parkEmoji = getParkEmoji(park);
  const cityName = park.location.split(',')[0]?.trim() || park.location;
  const minAge = park.minAge || 8;
  const parkUrl = `/parks/${park.id}`;

  // Fermer le hover mobile quand on clique ailleurs
  useEffect(() => {
    if (!isTapExpanded) return;
    
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsTapExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isTapExpanded]);

  const handleClick = useCallback(() => {
    if (isTouch) {
      // Mobile : premier tap → afficher les infos satellites, deuxième tap → naviguer
      if (!isTapExpanded) {
        setIsTapExpanded(true);
      } else {
        navigate(parkUrl);
      }
    } else {
      // Desktop : clic direct → naviguer
      navigate(parkUrl);
    }
  }, [isTouch, isTapExpanded, navigate, parkUrl]);

  // Sur mobile, cliquer sur un élément satellite navigue aussi
  const handleSatelliteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(parkUrl);
  }, [navigate, parkUrl]);

  // L'état "expanded" est actif soit via hover (desktop) soit via tap (mobile)
  const isExpanded = isTouch ? isTapExpanded : isHovered;

  // ========================================
  // MODE BULLES AVEC HOVER LUDIQUE
  // ========================================
  if (compact) {
    return (
      <motion.div
        ref={cardRef}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: index * 0.05,
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        className="relative cursor-pointer"
        style={{ 
          width: '280px',
          height: '280px',
          zIndex: isExpanded ? 50 : 1,
          willChange: isExpanded ? 'transform, z-index' : 'auto',
        }}
        onMouseEnter={() => !isTouch && setIsHovered(true)}
        onMouseLeave={() => !isTouch && setIsHovered(false)}
        onClick={handleClick}
      >
        {/* BULLE PRINCIPALE */}
        <motion.div
          className="relative w-full h-full rounded-full flex flex-col items-center justify-center shadow-2xl overflow-hidden"
          style={{ 
            willChange: isExpanded ? 'transform' : 'auto',
          }}
          animate={isExpanded ? {
            scale: 1.12,
          } : {
            scale: 1,
          }}
          transition={{ 
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          {/* Image de fond */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${park.image})`,
            }}
          />
          
          {/* Overlay pour lisibilité */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}dd 0%, ${primaryColor}bb 50%, ${primaryColor}dd 100%)`,
            }}
          />
          
          {/* Brillance */}
          <div 
            className="absolute top-8 left-8 w-24 h-24 bg-white/20 rounded-full blur-2xl"
          />

          {/* Contenu bulle */}
          <div className="relative z-10 text-center px-6 space-y-4">
            {/* Emoji */}
            <motion.div 
              className="text-8xl mb-2"
              animate={isExpanded ? {
                scale: 1.15,
              } : {
                scale: 1
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {parkEmoji}
            </motion.div>
            
            {/* Nom */}
            <motion.h3 
              className="text-white font-black text-2xl leading-tight"
              style={{ 
                textShadow: '0 2px 10px rgba(0,0,0,0.5)' 
              }}
              animate={isExpanded ? { scale: 0.9 } : { scale: 1 }}
            >
              {park.name.length > 25 ? park.name.substring(0, 25) + '...' : park.name}
            </motion.h3>
            
            {/* Stats */}
            <motion.div 
              className="flex items-center justify-center gap-3"
              animate={isExpanded ? { 
                scale: 0.85,
                opacity: 0.7
              } : { 
                scale: 1,
                opacity: 1
              }}
            >
              <div className="flex items-center gap-1 bg-white/30 backdrop-blur px-3 py-2 rounded-full">
                
                <span className="text-white text-sm font-black">{park.departement}</span>
              </div>
           
            </motion.div>
            
            {/* Prix */}
            <motion.div 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-black text-xl shadow-lg"
              style={{ 
                background: secondaryColor
              }}
              animate={isExpanded ? { 
                scale: 0.9,
                opacity: 0.8
              } : { 
                scale: 1,
                opacity: 1
              }}
            >
              {park.minPrice}€
            </motion.div>
          </div>
        </motion.div>

        {/* INFOS SATELLITES - Apparaissent au hover (desktop) ou au premier tap (mobile) */}
        <AnimatePresence>
          {isExpanded && (
            <>
              {/* Info 1 : Ville (en haut) */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl px-6 py-3 cursor-pointer"
                style={{ 
                  border: `3px solid ${primaryColor}`,
                  willChange: 'transform, opacity'
                }}
                onClick={handleSatelliteClick}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="size-5 text-gray-700" />
                  <span className="font-black text-gray-900">{cityName}</span>
                </div>
              </motion.div>

              {/* Info 2 : Âge minimum (à gauche) */}
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-24 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-xl px-5 py-4 cursor-pointer"
                style={{ 
                  border: `3px solid ${primaryColor}`,
                  willChange: 'transform, opacity'
                }}
                onClick={handleSatelliteClick}
              >
                <div className="text-center">
                  <Users className="size-6 mx-auto mb-1" style={{ color: primaryColor }} />
                  <div className="text-3xl font-black mb-1" style={{ color: primaryColor }}>
                    {minAge}+
                  </div>
                  <div className="text-xs text-gray-700 font-bold uppercase">Âge</div>
                </div>
              </motion.div>

              {/* Info 3 : Top 3 activités (à droite) */}
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-32 bg-white rounded-2xl shadow-xl p-4 cursor-pointer"
                style={{ 
                  border: `3px solid ${secondaryColor}`,
                  width: '200px',
                  willChange: 'transform, opacity'
                }}
                onClick={handleSatelliteClick}
              >
                <div className="text-xs font-black text-gray-900 mb-2 uppercase">Top activités</div>
                <div className="space-y-2">
                  {park.activities.slice(0, 3).map((activity) => (
                    <div
                      key={activity}
                      className="flex items-center gap-2 text-sm font-bold"
                      style={{ color: primaryColor }}
                    >
                      <span className="text-lg">{getActivityIcon(activity)}</span>
                      <span className="truncate">{activity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Info 4 : Prix détails (en bas) */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.15 }}
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl shadow-xl px-6 py-4 cursor-pointer"
                style={{ 
                  border: `3px solid ${secondaryColor}`,
                  willChange: 'transform, opacity'
                }}
                onClick={handleSatelliteClick}
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-black" style={{ color: secondaryColor }}>
                      {park.minPrice}€
                    </div>
                    <div className="text-xs text-gray-600 font-bold">à partir de</div>
                  </div>
                  <div className="h-12 w-px bg-gray-300" />
                  <div className="text-xs text-gray-600 font-semibold">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="size-3" />
                      <span>Durée : 2h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      <span>Note : {park.rating}/5</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Badge contextuel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.2 }}
                className="absolute -bottom-32 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-2 cursor-pointer"
                style={{ 
                  border: `2px solid ${primaryColor}`,
                  willChange: 'transform, opacity'
                }}
                onClick={handleSatelliteClick}
              >
                <div className="flex items-center gap-2 text-sm font-black" style={{ color: primaryColor }}>
                  <span>{isTouch ? '👆' : '👆'}</span>
                  <span>{isTouch ? 'Appuyez pour voir le parc' : 'Cliquez pour voir le parc'}</span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ========================================
  // MODE CARTE CLASSIQUE
  // ========================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={parkUrl} className="group block">
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
          <div className="relative h-80">
            <img
              src={park.image}
              alt={park.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute top-6 right-6 bg-white rounded-2xl px-4 py-2 flex items-center gap-2">
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <span className="font-black text-lg">{park.rating}</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-3xl font-black text-white mb-2">
                {park.name}
              </h3>
              <div className="flex items-center gap-2 text-white mb-4">
                <MapPin className="size-5" />
                <span className="font-bold">{cityName}</span>
              </div>
              <div 
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
                style={{ backgroundColor: secondaryColor }}
              >
                <span className="text-white font-black text-lg">Dès {park.minPrice}€</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {park.activities.slice(0, 3).map((activity) => (
                <span
                  key={activity}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                  style={{ 
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor
                  }}
                >
                  <span>{getActivityIcon(activity)}</span>
                  <span>{activity}</span>
                </span>
              ))}
              {park.activities.length > 3 && (
                <span className="px-3 py-2 bg-gray-100 rounded-xl text-xs font-bold">
                  +{park.activities.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
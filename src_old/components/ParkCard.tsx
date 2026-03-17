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

const cleanParkName = (name: string): string => {
  return name
    .replace(/No[\s-]*limit/i, '')
    .replace(/Nolimit/i, '')
    .trim();
};

// Hook fiable pour détecter les touch devices
// On utilise matchMedia + ontouchstart pour une détection immédiate au montage
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  });

  useEffect(() => {
    // Écoute le premier événement touch pour confirmer si pas encore détecté
    const handleTouch = () => setIsTouch(true);
    window.addEventListener('touchstart', handleTouch, { once: true, passive: true });
    return () => window.removeEventListener('touchstart', handleTouch);
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
  
  const cleanName = cleanParkName(park.name);
  const cityName = park.location.split(',')[0]?.trim() || park.location;
  const minAge = park.minAge || 8;
  const parkUrl = `/parks/${park.id}`;

  // Fermer les bulles quand on touche en dehors
  useEffect(() => {
    if (!isTapExpanded) return;
    
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsTapExpanded(false);
      }
    };
    
    // Délai léger pour ne pas capter le tap qui vient d'ouvrir
    const timer = setTimeout(() => {
      document.addEventListener('touchstart', handleOutside, { passive: true });
      document.addEventListener('mousedown', handleOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [isTapExpanded]);

  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isTouch) {
      if (!isTapExpanded) {
        // 1er tap → ouvre les bulles satellites
        e.preventDefault();
        setIsTapExpanded(true);
      } else {
        // 2ème tap → navigate
        navigate(parkUrl);
      }
    } else {
      // Desktop → navigate directement
      navigate(parkUrl);
    }
  }, [isTouch, isTapExpanded, navigate, parkUrl]);

  // Clic sur un élément satellite → navigate aussi
  const handleSatelliteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(parkUrl);
  }, [navigate, parkUrl]);

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
          animate={isExpanded ? { scale: 1.12 } : { scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Image de fond */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${park.image})` }}
          />
          
          {/* Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}dd 0%, ${primaryColor}bb 50%, ${primaryColor}dd 100%)`,
            }}
          />
          
          {/* Brillance */}
          <div className="absolute top-8 left-8 w-24 h-24 bg-white/20 rounded-full blur-2xl" />

          {/* Contenu bulle */}
          <div className="relative z-10 text-center px-6 space-y-4">
            <motion.h3 
              className="text-white font-black text-3xl leading-tight"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              animate={isExpanded ? { scale: 0.9 } : { scale: 1 }}
            >
              {cleanName}
            </motion.h3>
            
            <motion.div 
              className="flex items-center justify-center gap-3"
              animate={isExpanded ? { scale: 0.85, opacity: 0.7 } : { scale: 1, opacity: 1 }}
            >
              <div className="flex items-center gap-1 bg-white/30 backdrop-blur px-3 py-2 rounded-full">
                <span className="text-white text-sm font-black">{park.departement}</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="inline-flex items-center gap-1 px-6 py-3 rounded-full text-white font-black text-xl shadow-lg"
              style={{ background: secondaryColor }}
              animate={isExpanded ? { scale: 0.9, opacity: 0.8 } : { scale: 1, opacity: 1 }}
            >
              <Star className="size-5 fill-white text-white mr-1" />
              {park.rating}/5
            </motion.div>
          </div>
        </motion.div>

        {/* INFOS SATELLITES */}
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
                style={{ border: `3px solid ${primaryColor}`, willChange: 'transform, opacity' }}
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
                style={{ border: `3px solid ${primaryColor}`, willChange: 'transform, opacity' }}
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
                style={{ border: `3px solid ${secondaryColor}`, width: '200px', willChange: 'transform, opacity' }}
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

              {/* Info 4 : Note détaillée (en bas) */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.15 }}
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl shadow-xl px-6 py-4 cursor-pointer"
                style={{ border: `3px solid ${secondaryColor}`, willChange: 'transform, opacity' }}
                onClick={handleSatelliteClick}
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-black flex items-center gap-1" style={{ color: secondaryColor }}>
                      <Star className="size-6 fill-current" />
                      {park.rating}
                    </div>
                    <div className="text-xs text-gray-600 font-bold">note moyenne</div>
                  </div>
                  <div className="h-12 w-px bg-gray-300" />
                  <div className="text-xs text-gray-600 font-semibold">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="size-3" />
                      <span>Durée : 2h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="size-3" />
                      <span>{minAge}+ ans</span>
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
                style={{ border: `2px solid ${primaryColor}`, willChange: 'transform, opacity' }}
                onClick={handleSatelliteClick}
              >
                <div className="flex items-center gap-2 text-sm font-black" style={{ color: primaryColor }}>
                  <span>👆</span>
                  <span>Appuyez pour voir le parc</span>
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
                {cleanName}
              </h3>
              <div className="flex items-center gap-2 text-white mb-4">
                <MapPin className="size-5" />
                <span className="font-bold">{cityName}</span>
              </div>
              <div 
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
                style={{ backgroundColor: secondaryColor }}
              >
                <Star className="size-4 text-white" />
                <span className="text-white font-black text-lg">{park.rating}/5</span>
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
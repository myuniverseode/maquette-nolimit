// components/ParkCard.tsx
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Users, Clock } from 'lucide-react';
import { Park } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useCalendarData } from '../hooks/useCalendarData';
import { API_URL } from '../config/config';

interface ParkCardProps {
  park: Park;
  compact?: boolean;
  index?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

// ─── Type activité API ────────────────────────────────────────────────────────
interface ApiActivity {
  id: number;
  name: string;
  slug: string;
  emoji: string;
  image?: string;
  minAge?: number;
}

// ─── Hook activités par parc ──────────────────────────────────────────────────
function useParkActivities(parkId: string) {
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`${API_URL}/activities?park=${parkId}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then((data: ApiActivity[]) => {
        if (!cancelled) setActivities(Array.isArray(data) ? data.slice(0, 2) : []);
      })
      .catch(() => {
        // Fallback silencieux : on garde un tableau vide
        if (!cancelled) setActivities([]);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [parkId]);

  return { activities, loading };
}

// ─── Fallback icône si l'emoji API est absent ─────────────────────────────────
const FALLBACK_EMOJI: Record<string, string> = {
  'accrobranche': '🌳', 'tyrolienne': '⚡', 'paintball': '🎯',
  'parcours-filet': '🕸️', 'tir-arc': '🏹', 'archery-tag': '🏹',
  'escape-game': '🔐', 'parcours-extreme': '🔥', 'orientation': '🧭',
  'chasse-tresor': '🗺️', 'parcours-kids': '👶', 'laser': '🔫',
};
function getEmoji(activity: ApiActivity): string {
  if (activity.emoji) return activity.emoji;
  return FALLBACK_EMOJI[activity.slug] ?? '🎯';
}

// ─── Helpers visuels ──────────────────────────────────────────────────────────
function lightBg(hex: string)     { return `${hex}18`; }
function lightBorder(hex: string) { return `${hex}66`; }
function shouldPulse(color: string): boolean {
  if (!color || color.length < 7) return false;
  const r = parseInt(color.slice(1,3), 16);
  const g = parseInt(color.slice(3,5), 16);
  const b = parseInt(color.slice(5,7), 16);
  return (g > r + 20 && g > b + 20) || (r > 160 && g > 60 && g < 160 && b < 60);
}

// ─── Hook touch device ────────────────────────────────────────────────────────
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  });
  useEffect(() => {
    const h = () => setIsTouch(true);
    window.addEventListener('touchstart', h, { once: true, passive: true });
    return () => window.removeEventListener('touchstart', h);
  }, []);
  return isTouch;
}

// ─── Bulle statut (haut-droite, largeur fixe 140px) ──────────────────────────
function StatusSatellite({ parkId, onNavigate }: { parkId: string; onNavigate: (e: React.MouseEvent) => void }) {
  const { status, loading } = useCalendarData(parkId);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.8 }}
        transition={{ duration: 0.2, ease: 'easeOut', delay: 0.05 }}
        className="absolute -top-16 right-0 translate-x-4 bg-gray-50 border-2 border-gray-200 rounded-2xl shadow-xl px-4 py-2.5 animate-pulse cursor-pointer"
        style={{ width: '140px' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="h-3 w-14 bg-gray-200 rounded" />
        </div>
      </motion.div>
    );
  }

  const color  = status.color;
  const pulse  = shouldPulse(color);
  const isOpen   = /ouvert/i.test(status.label);
  const isClosed = /fermé/i.test(status.label);
  const word     = isOpen ? 'Ouvert' : isClosed ? 'Fermé' : 'Info';
  const m        = status.label.match(/(\d{1,2}h\d{0,2})\s*(?:à|–|-)\s*(\d{1,2}h\d{0,2})/);
  const hours    = m ? `${m[1]}–${m[2]}` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.8 }}
      transition={{ duration: 0.2, ease: 'easeOut', delay: 0.05 }}
      className="absolute -top-16 right-0 translate-x-4 rounded-2xl shadow-xl px-4 py-2.5 cursor-pointer"
      style={{
        backgroundColor: lightBg(color),
        border: `3px solid ${lightBorder(color)}`,
        width: '140px',
        willChange: 'transform, opacity',
      }}
      onClick={onNavigate}
    >
      <div className="flex items-center gap-2">
        <motion.div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
          animate={pulse ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="font-black text-sm leading-none" style={{ color }}>{word}</span>
      </div>
      {hours && (
        <div className="text-[11px] font-bold mt-1 pl-[18px]" style={{ color, opacity: 0.8 }}>
          {hours}
        </div>
      )}
      {!hours && status.event?.icon && (
        <div className="text-[11px] mt-1 pl-[18px]">{status.event.icon}</div>
      )}
    </motion.div>
  );
}

// ─── Bulle activités (droite) — données API ───────────────────────────────────
function ActivitiesSatellite({
  parkId,
  onNavigate,
  primaryColor,
  secondaryColor,
}: {
  parkId: string;
  onNavigate: (e: React.MouseEvent) => void;
  primaryColor: string;
  secondaryColor: string;
}) {
  const { activities, loading } = useParkActivities(parkId);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -10, scale: 0.8 }}
      transition={{ duration: 0.2, ease: 'easeOut', delay: 0.1 }}
      className="absolute right-0 top-2/3 -translate-y-1/2 translate-x-32 bg-white rounded-2xl shadow-xl p-4 cursor-pointer"
      style={{ border: `3px solid ${secondaryColor}`, width: '200px', willChange: 'transform, opacity' }}
      onClick={onNavigate}
    >
      <div className="text-xs font-black text-gray-900 mb-2 uppercase">Top activités</div>

      {loading ? (
        // Skeleton 2 lignes
        <div className="space-y-2">
          {[1,2].map(i => (
            <div key={i} className="flex items-center gap-2 animate-pulse">
              <div className="w-5 h-5 rounded bg-gray-100 flex-shrink-0" />
              <div className="h-3 bg-gray-100 rounded flex-1" />
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-2">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-center gap-2 text-sm font-bold" style={{ color: primaryColor }}>
              <span className="text-lg flex-shrink-0">{getEmoji(activity)}</span>
              <span className="truncate">{activity.name}</span>
            </div>
          ))}
        </div>
      ) : (
        // Fallback si l'API ne répond pas
        <p className="text-xs text-gray-400 italic">Activités à découvrir</p>
      )}
    </motion.div>
  );
}

// ─── ParkCard ─────────────────────────────────────────────────────────────────
export function ParkCard({
  park, compact = false, index = 0,
  primaryColor = '#357600', secondaryColor = '#eb700f',
}: ParkCardProps) {
  const [isHovered,     setIsHovered]     = useState(false);
  const [isTapExpanded, setIsTapExpanded] = useState(false);
  const isTouch  = useIsTouchDevice();
  const navigate = useNavigate();
  const cardRef  = useRef<HTMLDivElement>(null);

  const cleanName = park.name.replace(/No[\s-]*limit/i, '').replace(/Nolimit/i, '').trim();
  const cityName  = park.location.split(',')[0]?.trim() || park.location;
  const minAge    = park.minAge || 8;
  const parkUrl   = `/parks/${park.id}`;

  useEffect(() => {
    if (!isTapExpanded) return;
    const handle = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) setIsTapExpanded(false);
    };
    const t = setTimeout(() => {
      document.addEventListener('touchstart', handle, { passive: true });
      document.addEventListener('mousedown', handle);
    }, 100);
    return () => {
      clearTimeout(t);
      document.removeEventListener('touchstart', handle);
      document.removeEventListener('mousedown', handle);
    };
  }, [isTapExpanded]);

  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isTouch) {
      if (!isTapExpanded) { e.preventDefault(); setIsTapExpanded(true); }
      else navigate(parkUrl);
    } else { navigate(parkUrl); }
  }, [isTouch, isTapExpanded, navigate, parkUrl]);

  const handleSatelliteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); navigate(parkUrl);
  }, [navigate, parkUrl]);

  const isExpanded = isTouch ? isTapExpanded : isHovered;

  // ── MODE BULLES ─────────────────────────────────────────────────────────────
  if (compact) {
    return (
      <motion.div
        ref={cardRef}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
        className="relative cursor-pointer"
        style={{ width: '280px', height: '280px', zIndex: isExpanded ? 50 : 1 }}
        onMouseEnter={() => !isTouch && setIsHovered(true)}
        onMouseLeave={() => !isTouch && setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Bulle principale */}
        <motion.div
          className="relative w-full h-full rounded-full flex flex-col items-center justify-center shadow-2xl overflow-hidden"
          animate={isExpanded ? { scale: 1.12 } : { scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${park.image})` }} />
          <div className="absolute inset-0" style={{ }} />
          <div className="absolute top-8 left-8 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
          <div className="relative z-10 text-center px-6 space-y-4">
            <motion.h3
              className="text-white font-black text-3xl leading-tight"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              animate={isExpanded ? { scale: 0.9 } : { scale: 1 }}
            >
              {cleanName}
            </motion.h3>
            <motion.div animate={isExpanded ? { scale: 0.85, opacity: 0.7 } : { scale: 1, opacity: 1 }}>
              <div className="flex items-center gap-1 bg-white/30 backdrop-blur px-3 py-2 rounded-full justify-center">
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

        {/* Satellites */}
        <AnimatePresence>
          {isExpanded && (
            <>
            

              {/* Haut droite : Statut */}
              <StatusSatellite parkId={park.id} onNavigate={handleSatelliteClick} />

              {/* Gauche : Âge */}
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.8 }}
                transition={{ duration: 0.2, ease: 'easeOut', delay: 0.05 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-24 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-xl px-5 py-4 cursor-pointer"
                style={{ border: `3px solid ${primaryColor}` }}
                onClick={handleSatelliteClick}
              >
                <div className="text-center">
                  <Users className="size-6 mx-auto mb-1" style={{ color: primaryColor }} />
                  <div className="text-3xl font-black mb-1" style={{ color: primaryColor }}>{minAge}+</div>
                  <div className="text-xs text-gray-700 font-bold uppercase">Âge</div>
                </div>
              </motion.div>

              {/* Droite : Activités depuis l'API */}
              <ActivitiesSatellite
                parkId={park.id}
                onNavigate={handleSatelliteClick}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />

             

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: 'easeOut', delay: 0.2 }}
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-2 cursor-pointer whitespace-nowrap"
                style={{ border: `2px solid ${primaryColor}` }}
                onClick={handleSatelliteClick}
              >
                <div className="flex items-center gap-2 text-sm font-black" style={{ color: primaryColor }}>
                  <span>👆</span><span>Appuyez pour voir le parc</span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ── MODE CARTE CLASSIQUE ────────────────────────────────────────────────────
  // En mode carte, on utilise toujours l'API pour les activités aussi
  const { activities: cardActivities, loading: cardActivitiesLoading } = useParkActivities(park.id);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <a href={parkUrl} className="group block cursor-pointer" onClick={e => { e.preventDefault(); navigate(parkUrl); }}>
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
          <div className="relative h-80">
            <img src={park.image} alt={park.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute top-6 right-6 bg-white rounded-2xl px-4 py-2 flex items-center gap-2">
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <span className="font-black text-lg">{park.rating}</span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-3xl font-black text-white mb-2">{cleanName}</h3>
              <div className="flex items-center gap-2 text-white mb-4">
                <MapPin className="size-5" /><span className="font-bold">{cityName}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full" style={{ backgroundColor: secondaryColor }}>
                <Star className="size-4 text-white" />
                <span className="text-white font-black text-lg">{park.rating}/5</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {cardActivitiesLoading ? (
                [1,2].map(i => (
                  <div key={i} className="h-8 w-24 bg-gray-100 rounded-xl animate-pulse" />
                ))
              ) : cardActivities.length > 0 ? (
                cardActivities.map(activity => (
                  <span key={activity.id} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                    <span>{getEmoji(activity)}</span>
                    <span>{activity.name}</span>
                  </span>
                ))
              ) : (
                park.activities.slice(0, 2).map(activity => (
                  <span key={activity} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                    <span>{activity}</span>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
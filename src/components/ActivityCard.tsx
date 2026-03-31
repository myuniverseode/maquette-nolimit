// components/ActivityCard.tsx
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Activity } from '../types';
import { useState } from 'react';

interface ActivityCardProps {
  activity: Activity;
  index?: number;
}

export function ActivityCard({ activity, index = 0 }: ActivityCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Mapping des emojis par activité
  const activityEmojis: { [key: string]: string } = {
    accrobranche: '🌳',
    paintball: '🎯',
    'escape-game': '🔐',
    'tir-arc': '🏹',
    'archery-tag': '⚡',
    'laser-game': '🔫',
    tyrolienne: '🪂',
  };

  const emoji = activityEmojis[activity.id] || '🎯';

  // Récupérer l'URL de l'image depuis WordPress
  const getImageUrl = () => {
    if (activity.image && !imageError) {
      return activity.image;
    }
    return 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=400&fit=crop&q=80';
  };

  // Fonction pour obtenir le nombre minimum de participants
  const getMinParticipants = (): number => {
    if (activity.participants) {
      // Si c'est un objet avec min
      if (typeof activity.participants === 'object' && activity.participants !== null) {
        const parts = activity.participants as any;
        return parts.min || 1;
      }
      // Si c'est une chaîne comme "2-5 personnes"
      if (typeof activity.participants === 'string') {
        const match = activity.participants.match(/(\d+)/);
        return match ? parseInt(match[1]) : 1;
      }
      // Si c'est un nombre
      if (typeof activity.participants === 'number') {
        return activity.participants;
      }
    }
    return 1; // Valeur par défaut
  };

  // Affichage du prix sous forme de fourchette
  const formatPriceRange = (): string => {
    if (!activity.price) return 'Sur devis';

    // Si c'est un objet avec min et max
    if (typeof activity.price === 'object' && activity.price !== null) {
      const p = activity.price as any;
      if (p.min && p.max) {
        return `${p.min}€ - ${p.max}€`;
      } else if (p.min) {
        return `À partir de ${p.min}€`;
      }
    }

    // Si c'est une chaîne déjà formatée (ex: "25-35€")
    if (typeof activity.price === 'string') {
      return activity.price;
    }

    // Sinon, affichage simple (nombre)
    return `${activity.price}€`;
  };

  return (
    <Link
      to={`/activity/${activity.slug || activity.id}`}
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group relative cursor-pointer"
      >
        {/* Card principale - FORMAT ROND */}
        <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/40 transition-all shadow-xl">
          {/* Image de fond */}
          <div className="absolute inset-0">
            <img
              src={getImageUrl()}
              alt={activity.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/40 via-[#111111]/60 to-[#111111]/80" />
          </div>

          {/* Contenu centré */}
          <div className="relative h-full flex flex-col items-center justify-center text-center p-6">
          

            {/* Nom de l'activité */}
            <h3
              className="text-xl font-black mb-2 transition-colors line-clamp-2"
              style={{
                color: isHovered ? '#eb700f' : 'white',
              }}
            >
              {activity.name}
            </h3>

            {/* Badges : uniquement l'âge (le niveau a été retiré) */}
            <div className="flex gap-2 flex-wrap justify-center mb-2">
              <span
                className="px-2 py-1 backdrop-blur-sm rounded-full text-xs text-white font-medium border border-white/30"
                style={{ backgroundColor: 'rgba(53, 118, 0, 0.3)' }}
              >
                {activity.minAge || 8}+ ans
              </span>
            </div>

            {/* Info supplémentaires */}
            <div className="flex gap-3 text-xs text-white/80">
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>{activity.duration || '2h'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="size-3" />
                {/* Participants : toujours affichés sous forme "X+ pers." */}
                <span>{getMinParticipants()}+ pers.</span>
              </div>
            </div>

         
          </div>

          {/* Hover overlay avec emoji flouté et texte "En savoir plus" */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md"
            style={{
              background:
                'linear-gradient(135deg, rgba(53, 118, 0, 0.85), rgba(74, 157, 0, 0.85))',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="text-5xl opacity-40 blur-sm">{emoji}</div>
              <span className="text-white font-bold text-lg flex items-center gap-2">
                En savoir plus
                <ArrowRight className="size-4" />
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Glow effect au hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.4 : 0 }}
          className="absolute -inset-1 rounded-full blur-xl -z-10"
          style={{ background: 'linear-gradient(to right, #357600, #eb700f)' }}
        />
      </motion.div>
    </Link>
  );
}
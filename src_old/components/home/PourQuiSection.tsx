import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, Cake, Briefcase, Star, Calendar } from 'lucide-react';
import { usePourQuiData } from '../../hooks/usePourQuiData';

const iconMap: { [key: string]: React.ReactNode } = {
  Heart: <Heart className="size-8" />,
  Users: <Users className="size-8" />,
  Cake: <Cake className="size-8" />,
  Briefcase: <Briefcase className="size-8" />,
  Star: <Star className="size-8" />,
  Calendar: <Calendar className="size-8" />,
};

function EventCard({ card, index, raiseContent = false }: { card: any; index: number; raiseContent?: boolean }) {
  return (
    <Link to={card.link} className="block group">
      <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className={`absolute inset-0 flex flex-col justify-end p-8 ${raiseContent ? 'pb-44' : ''}`}>
          <motion.div
            className="mb-4 p-3 rounded-full w-fit"
            style={{ backgroundColor: `${card.color}20` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div style={{ color: card.color }}>
              {iconMap[card.iconName] || <Star className="size-8" />}
            </div>
          </motion.div>
          <h3 className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
            {card.title}
          </h3>
          <p className="text-lg text-white/90 mb-4 group-hover:translate-x-2 transition-transform duration-300 delay-75">
            {card.description}
          </p>
          <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all duration-300">
            <span>En savoir plus</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </div>
        </div>
        <div
          className="absolute inset-0 border-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ borderColor: card.color }}
        />
      </div>
    </Link>
  );
}

function CentralBubble({ className = '', isMobile = false }: { className?: string; isMobile?: boolean }) {
  return (
    <div className={className}>
      <Link to="/evenements" className="block group">
        {isMobile ? (
          // Mobile : pas de bordure décorative
          <div className="relative overflow-hidden shadow-2xl w-full h-64 rounded-2xl">
            <BubbleInner isMobile />
          </div>
        ) : (
          // Desktop : wrapper div avec exactement le même gradient que la section
          // → joue le rôle de bordure "fondue" dans le fond
          <div
            className="rounded-full"
            style={{
              padding: '20px',
              background: 'rgb(247 248 248)',
             
            }}
          >
            <div className="relative overflow-hidden w-80 h-80 rounded-full shadow-inner">
              <BubbleInner />
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}

function BubbleInner({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg"
          alt="Votre événement"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          className="mb-4 p-4 rounded-full"
          style={{ backgroundColor: '#FF6B3530' }}
          whileHover={{ scale: 1.15, rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Calendar className="size-10" style={{ color: '#FF6B35' }} />
        </motion.div>
        <h3 className="text-3xl font-black text-white mb-3 group-hover:scale-105 transition-transform duration-300">
          Votre événement
        </h3>
        <p className="text-sm text-white/90 mb-1 leading-tight">
          Anniversaire • EVG • EVJF
        </p>
        <p className="text-sm text-white/90 leading-tight">
          Team Building • Soirée privée
        </p>
        <motion.div
          className="mt-4 text-white font-semibold text-lg"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          ↓
        </motion.div>
      </div>
      <div
        className={`absolute inset-0 border-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${isMobile ? 'rounded-2xl' : 'rounded-full'}`}
        style={{ borderColor: '#FF6B35' }}
      />
    </>
  );
}

export function PourQuiSection() {
  const { data } = usePourQuiData();

  const topCards = data.cards.slice(0, 2);
  const bottomCards = data.cards.slice(2);

  return (
    <section id="pour-qui" className="relative py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black mb-4" style={{ color: '#357600' }}>
            {data.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{data.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topCards.map((card, index) => (
              <EventCard key={index} card={card} index={index} raiseContent={true} />
            ))}
            {bottomCards.map((card, index) => (
              <EventCard key={index + 2} card={card} index={index + 2} raiseContent={false} />
            ))}
            <div className="md:hidden">
              <CentralBubble isMobile={true} />
            </div>
          </div>

          {/* Bulle desktop centrée */}
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            <div className="flex items-center justify-center h-full">
              <CentralBubble className="pointer-events-auto" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
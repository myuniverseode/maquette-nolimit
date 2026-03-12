// components/park/ParkHero.tsx
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Play } from 'lucide-react';
import { useRef } from 'react';
import { 
  FaInstagram, 
  FaFacebookF, 
  FaTiktok, 
  FaYoutube 
} from 'react-icons/fa';

const ORANGE = '#eb700f';

interface SocialLink {
  icon: React.ElementType;
  label: string;
  color: string;
  url: string;
  handle: string;
}

interface ParkHeroProps {
  park: any;
}

const socialLinks: SocialLink[] = [
  { 
    icon: FaInstagram, 
    label: 'Instagram', 
    color: '#e1306c', 
    url: '#', 
    handle: '@nolimit_parc' 
  },
  { 
    icon: FaFacebookF, 
    label: 'Facebook',  
    color: '#1877f2', 
    url: '#', 
    handle: 'NoLimit Parc'  
  },
  { 
    icon: FaTiktok, 
    label: 'TikTok',    
    color: '#010101', 
    url: '#', 
    handle: '@nolimit'       
  },
  { 
    icon: FaYoutube, 
    label: 'YouTube',   
    color: '#ff0000', 
    url: '#', 
    handle: 'NoLimit TV'     
  },
];

export function ParkHero({ park }: ParkHeroProps) {
  const heroRef                         = useRef(null);
  const [currentHeroIndex, setCurrent]  = useState(0);
  const [isVideoPlaying, setVideo]      = useState(false);
  const { scrollYProgress }             = useScroll();
  const heroScale                       = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  const heroImages = [park.image, park.image, park.image];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section id="accueil" className="relative h-[70vh] overflow-hidden">
      <motion.div ref={heroRef} style={{ scale: heroScale }} className="absolute inset-0">
        <img
          src={heroImages[currentHeroIndex]}
          alt={park.name}
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

      {/* Titre + réseaux */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="absolute bottom-24 left-0 right-0 z-20 container mx-auto px-6"
      >
        <h1 className="text-5xl md:text-7xl font-black text-white leading-none drop-shadow-xl mb-3">
          {park.name}
        </h1>
        <div className="flex items-center gap-2 text-white/80 mb-4">
          <MapPin className="size-4 flex-shrink-0" />
          <span className="text-base font-medium tracking-wide">{park.location}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {socialLinks.map((social) => {
            const IconComponent = social.icon;
            return (
              <motion.a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm border border-white/30 text-white transition-all"
                style={{ backgroundColor: `${social.color}CC` }}
                title={social.handle}
              >
                <IconComponent className="text-sm" />
                <span className="hidden sm:inline">{social.handle}</span>
              </motion.a>
            );
          })}
        </div>
      </motion.div>

      {/* Bouton vidéo */}
      <motion.div
        className="absolute bottom-8 right-8 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
      >
        {!isVideoPlaying ? (
          <motion.button
            onClick={() => setVideo(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all border border-white/20"
          >
            <motion.div
              className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <Play className="size-6 ml-1 relative z-10" style={{ color: '#357600' }} />
            </motion.div>
            <div className="text-left">
              <div className="font-bold">Voir la vidéo</div>
              <div className="text-sm opacity-80">Découvrez l'expérience</div>
            </div>
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-96 h-64 rounded-2xl overflow-hidden shadow-2xl bg-black"
          >
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              onPause={() => setVideo(false)}
              onEnded={() => setVideo(false)}
            >
              <source src="https://www.youtube.com/watch?v=VT2qF97pQNw" />
            </video>
          </motion.div>
        )}
      </motion.div>

      {/* Vague de transition */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-30">
        <svg viewBox="0 0 1440 160" className="w-full h-24 md:h-32" preserveAspectRatio="none">
          <path
            d="M0,100 C200,40 400,140 650,90 C900,40 1150,140 1440,80 L1440,160 L0,160 Z"
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  );
}

export { socialLinks };
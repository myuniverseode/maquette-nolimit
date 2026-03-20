// components/park/ParkWeatherBlock.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, Wind, ExternalLink } from 'lucide-react';

const ORANGE = '#eb700f';

// Fonction pour déterminer l'icône en fonction du code météo (WMO)
function getWeatherIcon(code: number, size = 'size-6') {
  if (code === 0) return <Sun className={`${size} text-yellow-400`} />; // Ciel dégagé
  if (code === 1 || code === 2 || code === 3) return <Cloud className={`${size} text-gray-400`} />; // Partiellement nuageux
  if (code >= 51 && code <= 67) return <CloudRain className={`${size} text-blue-400`} />; // Pluie
  if (code >= 71 && code <= 77) return <CloudSnow className={`${size} text-blue-200`} />; // Neige
  if (code >= 45 && code <= 48) return <CloudFog className={`${size} text-gray-300`} />; // Brouillard
  return <Wind className={`${size} text-teal-400`} />; // Défaut
}

// Traduction des conditions météo
function getWeatherLabel(code: number): string {
  if (code === 0) return 'Ensoleillé';
  if (code === 1) return 'Peu nuageux';
  if (code === 2) return 'Partiellement nuageux';
  if (code === 3) return 'Nuageux';
  if (code >= 51 && code <= 67) return 'Pluvieux';
  if (code >= 71 && code <= 77) return 'Neigeux';
  if (code >= 45 && code <= 48) return 'Brouillard';
  return 'Variable';
}

// Vérifier si le temps est mauvais
function isBadWeather(code: number): boolean {
  return (code >= 51 && code <= 67) || (code >= 71 && code <= 77);
}

interface WeatherData {
  current: {
    temperature: number;
    weatherCode: number;
  };
  daily: {
    time: string[];
    weatherCode: number[];
    temperatureMax: number[];
    temperatureMin: number[];
  };
}

export function ParkWeatherBlock() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Utilisation de l'API Open-Meteo (gratuite, sans clé)
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3'
        );
        
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        
        setWeatherData({
          current: {
            temperature: Math.round(data.current_weather.temperature),
            weatherCode: data.current_weather.weathercode
          },
          daily: {
            time: data.daily.time,
            weatherCode: data.daily.weathercode,
            temperatureMax: data.daily.temperature_2m_max.map((t: number) => Math.round(t)),
            temperatureMin: data.daily.temperature_2m_min.map((t: number) => Math.round(t))
          }
        });
        
        setError(false);
      } catch (err) {
        console.error('Erreur météo:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    // Rafraîchir toutes les heures
    const interval = setInterval(fetchWeather, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Jours de la semaine en français
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  
  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  // URL Météo France pour Paris (à modifier selon votre ville)
  const weatherUrl = 'https://meteofrance.com/previsions-meteo-france/paris/75000';

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative rounded-2xl overflow-hidden shadow-lg border-2"
        style={{ borderColor: `${ORANGE}40` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800" />
        <div className="relative z-10 p-4 text-center">
          <p className="text-white/80 text-sm">Chargement météo...</p>
        </div>
      </motion.div>
    );
  }

  if (error || !weatherData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative rounded-2xl overflow-hidden shadow-lg border-2"
        style={{ borderColor: `${ORANGE}40` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800" />
        <div className="relative z-10 p-4 text-center">
          <p className="text-white/80 text-sm">Météo temporairement indisponible</p>
        </div>
      </motion.div>
    );
  }

  const badWeather = isBadWeather(weatherData.current.weatherCode);

  return (
    <motion.a
      href={weatherUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      className="relative rounded-2xl overflow-hidden shadow-lg border-2 block cursor-pointer group"
      style={{ borderColor: `${ORANGE}40` }}
    >
      {/* Fond avec dégradé selon la météo */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: badWeather
            ? 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)'
            : 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
        }}
      />
      
      {/* Éléments décoratifs animés */}
      <motion.div 
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10"
        animate={{ scale: [1, 1.2, 1] }} 
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} 
      />
      
      <div className="relative z-10 p-4">
        {/* En-tête compact */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
              <Sun className="size-3 text-white" />
            </div>
            <span className="text-white/90 text-xs font-semibold">Météo</span>
          </div>
          <ExternalLink className="size-3 text-white/60 group-hover:text-white transition-colors" />
        </div>

        {/* Météo actuelle simplifiée */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{weatherData.current.temperature}°</span>
            <span className="text-white/70 text-xs">{getWeatherLabel(weatherData.current.weatherCode)}</span>
          </div>
          <div className="scale-75 origin-right">
            {getWeatherIcon(weatherData.current.weatherCode, 'size-10')}
          </div>
        </div>

        {/* Prévisions 3 jours */}
        <div className="flex justify-between gap-1">
          {weatherData.daily.time.map((time, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1 bg-white/15 backdrop-blur-sm rounded-lg py-1.5 px-1"
            >
              <span className="text-white/70 text-[10px] font-medium">{getDayLabel(time)}</span>
              <div className="scale-75">
                {getWeatherIcon(weatherData.daily.weatherCode[i], 'size-4')}
              </div>
              <span className="text-white text-[11px] font-bold">
                {weatherData.daily.temperatureMax[i]}°
              </span>
            </div>
          ))}
        </div>

        {/* Message si mauvais temps (optionnel, plus compact) */}
        {badWeather && (
          <div className="mt-2 text-[10px] text-white/80 text-center bg-white/10 py-1 px-2 rounded-lg">
            ⚡ Activités extérieures susceptibles d'être modifiées
          </div>
        )}
      </div>
    </motion.a>
  );
}
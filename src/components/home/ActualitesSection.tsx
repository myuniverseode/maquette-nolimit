// components/home/ActualitesSection.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, UserPlus } from 'lucide-react';
import { useActualitesData } from '../../hooks/useActualitesData';

// Fonction pour formater la date en français
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('fr-FR', options);
};

export function ActualitesSection() {
  // Utiliser le hook WordPress avec fallback
  const { data } = useActualitesData();

  return (
    <section id="actualites" className="relative py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Grid des 3 actualités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {data.articles.map((actu, index) => (
            <motion.div
              key={actu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={actu.image}
                    alt={actu.titre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Badge événement si applicable */}
                  {actu.isEvenement && (
                    <div className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                         style={{ backgroundColor: '#eb700f' }}>
                      📅 Événement
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Contenu */}
                <div className="p-6">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <Calendar className="size-4" />
                    <span>{formatDate(actu.date)}</span>
                  </div>

                  {/* Titre */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#357600] transition-colors duration-300">
                    {actu.titre}
                  </h3>

                  {/* Extrait */}
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                    {actu.extrait}
                  </p>

                  {/* Boutons d'action */}
                  <div className="flex flex-col gap-3">
                    {/* Bouton Lire la suite */}
                    <Link
                      to={actu.lien}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:gap-4 hover:shadow-lg"
                      style={{ backgroundColor: '#357600' }}
                    >
                      <span>Lire la suite</span>
                      <ArrowRight className="size-5" />
                    </Link>

                    {/* Bouton S'inscrire si événement */}
                    {actu.isEvenement && actu.lienInscription && (
                      <Link
                        to={actu.lienInscription}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:gap-4 hover:shadow-lg"
                        style={{ backgroundColor: '#eb700f' }}
                      >
                        <UserPlus className="size-5" />
                        <span>S'inscrire</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bouton Voir toutes les actualités */}
        {data.showViewAllButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              to={data.viewAllUrl}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:gap-5 hover:shadow-xl"
              style={{ backgroundColor: '#357600' }}
            >
              <span>Voir toutes les actualités</span>
              <ArrowRight className="size-6" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

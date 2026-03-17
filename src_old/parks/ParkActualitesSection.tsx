

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, UserPlus, Sparkles } from 'lucide-react';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

interface ParkActu {
  id: string;
  slug: string;
  titre: string;
  extrait: string;
  image: string;
  date: string;
  categorie: string;
  categorieColor: string;
  isEvenement?: boolean;
  lienInscription?: string;
}

interface Props {
  parkId: string;           // correspond à :parkId dans /parks/:parkId
  articles?: ParkActu[];    // depuis WordPress/API ou fallback
  parkImage?: string;       // fallback image
}

// Données de fallback
const defaultArticles: ParkActu[] = [
  {
    id: '1', slug: 'championnat-escalade-2025',
    titre: "Championnat régional d'escalade",
    extrait: "Rejoignez-nous pour le grand championnat ouvert à tous les niveaux. Inscriptions ouvertes.",
    image: '', date: '2025-03-15',
    categorie: '🎉 Événement', categorieColor: ORANGE,
    isEvenement: true, lienInscription: '/inscription-championnat',
  },
  {
    id: '2', slug: 'nouvelle-via-ferrata',
    titre: 'Nouvelle via ferrata inaugurée',
    extrait: "Découvrez notre tout nouveau parcours via ferrata de niveau intermédiaire, ouvert au printemps.",
    image: '', date: '2025-04-01',
    categorie: '🆕 Nouveauté', categorieColor: GREEN,
  },
  {
    id: '3', slug: 'promo-groupes-fevrier',
    titre: '-20% pour les groupes ce mois-ci',
    extrait: "Profitez de 20% de réduction sur toutes les réservations groupe de plus de 8 personnes.",
    image: '', date: '2025-02-01',
    categorie: '🎁 Promo', categorieColor: '#8b5cf6',
  },
];

export function ParkActualitesSection({ parkId, articles, parkImage }: Props) {
  const actus = (articles && articles.length > 0 ? articles : defaultArticles).map(a => ({
    ...a,
    image: a.image || parkImage || 'https://images.unsplash.com/photo-1653154138513-ed13199917e2?w=800',
  }));

  return (
    <section id="actualites" className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
      {/* Pattern subtil */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23111111' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 max-w-6xl mx-auto"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-medium border"
            style={{ backgroundColor: `${ORANGE}10`, borderColor: `${ORANGE}30`, color: ORANGE }}
          >
            <Sparkles className="size-4" /> Actualités du parc
          </div>
          <h2 className="text-4xl md:text-5xl font-black" style={{ color: DARK }}>
            Quoi de <span style={{ color: ORANGE }}>neuf ?</span>
          </h2>
          <p className="text-gray-500 mt-2">Événements, nouveautés et bons plans</p>
        </motion.div>

        {/* Grid des articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {actus.slice(0, 3).map((actu, index) => (
            <motion.div
              key={actu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={actu.image}
                    alt={actu.titre}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    style={{
                      filter: index === 1 ? 'saturate(1.2)' : index === 2 ? 'hue-rotate(15deg) saturate(0.9)' : 'none',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Badge catégorie */}
                  <div
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-black text-white backdrop-blur-sm shadow"
                    style={{ backgroundColor: `${actu.categorieColor}DD` }}
                  >
                    {actu.categorie}
                  </div>

                  {/* Date */}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                    {formatDate(actu.date)}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 flex flex-col flex-1">
                  <h3
                    className="font-black text-lg mb-2 leading-tight group-hover:text-green-700 transition-colors"
                    style={{ color: DARK }}
                  >
                    {actu.titre}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3 mb-6">
                    {actu.extrait}
                  </p>

                  {/* Boutons */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/parks/${parkId}/actualites/${actu.slug}`}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-all hover:shadow-lg hover:gap-3"
                      style={{ backgroundColor: GREEN }}
                    >
                      Lire la suite
                      <ArrowRight className="size-4" />
                    </Link>

                    {actu.isEvenement && actu.lienInscription && (
                      <Link
                        to={actu.lienInscription}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-all hover:shadow-lg hover:gap-3"
                        style={{ backgroundColor: ORANGE }}
                      >
                        <UserPlus className="size-4" />
                        S'inscrire
                      </Link>
                    )}
                  </div>
                </div>

                {/* Barre couleur bas */}
                <div className="h-1 w-full" style={{ backgroundColor: actu.categorieColor }} />
              </div>
            </motion.div>
          ))}
        </div>

       
      </div>
    </section>
  );
}
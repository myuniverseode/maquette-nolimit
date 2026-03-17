// components/home/NewsSection.tsx
import { Newspaper, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsCard } from './NewsCard';
import { EventCard } from './EventCard';

export function NewsSection() {
  const newsArticles = [
    {
      id: 1,
      title: 'Nouveau parcours extrême à Nemours',
      date: '15 décembre 2024',
      category: 'Nouveauté',
      excerpt: 'Découvrez notre nouveau parcours Black, le plus technique jamais créé avec une tyrolienne de 300m.',
      image: 'https://images.unsplash.com/photo-1653154138513-ed13199917e2?q=80&w=1920',
      readTime: '3 min',
      featured: true
    },
    {
      id: 2,
      title: 'Noël magique en forêt',
      date: '1 décembre 2024',
      category: 'Événement',
      excerpt: 'Pour les fêtes, nos parcs s\'illuminent ! Parcours nocturnes et ateliers spéciaux pour toute la famille.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1920',
      readTime: '4 min',
      featured: true
    },
    {
      id: 3,
      title: 'Ouverture du parc de Toulouse',
      date: '20 novembre 2024',
      category: 'Expansion',
      excerpt: 'Notre premier parc dans le Sud de la France ouvre ses portes avec des activités adaptées au climat méditerranéen.',
      image: 'https://images.unsplash.com/photo-1630804261876-7e18e3a9c7aa?q=80&w=1920',
      readTime: '5 min',
      featured: true
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Tournoi de Paintball',
      date: '25 janvier 2025',
      location: 'Nemours',
      participants: 32,
      status: 'ouvert',
      price: '45€'
    },
    {
      id: 2,
      title: 'Escape Game spécial Saint-Valentin',
      date: '14 février 2025',
      location: 'Chevry',
      participants: 20,
      status: 'bientôt',
      price: '60€/couple'
    },
    {
      id: 3,
      title: 'Challenge Accrobranche',
      date: '15 mars 2025',
      location: 'Le Coudray',
      participants: 50,
      status: 'ouvert',
      price: '30€'
    }
  ];

  const blogStats = [
    { label: 'Articles', value: '128', icon: Newspaper },
    { label: 'Auteurs', value: '12', icon: TrendingUp },
    { label: 'Lecteurs/mois', value: '15k', icon: Calendar }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Newspaper className="size-6 text-orange-600" />
            </div>
            <h2 className="text-green-800">Actualités & Événements</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos dernières nouveautés, événements spéciaux et articles de blog
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {newsArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>

        {/* Événements à venir */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Événements à venir</h3>
            <Link
              to="/events"
              className="text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1"
            >
              Voir le calendrier complet
              <ArrowRight className="size-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Stats du blog */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Le Blog NoLimit</h3>
            <p className="text-gray-600">Votre source d'inspiration aventureuse</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-sm mb-4">
                    <Icon className="size-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-full hover:bg-gray-50 transition-all hover:scale-105 border border-green-200"
            >
              Explorer le blog
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
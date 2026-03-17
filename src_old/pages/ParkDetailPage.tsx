import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { React } from 'react'; 
import { parks } from '../data/parks';
import { reviews } from '../data/reviews';
import { MapPin, Star, Users, Clock, Calendar, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReviewCard } from '../components/ReviewCard';

export function ParkDetailPage() {
  const { id } = useParams();
  const park = parks.find((p) => p.id === id);
  const parkReviews = reviews.filter((r) => r.parkId === id);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!park) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-gray-900 mb-4">Parc non trouvé</h1>
          <Link to="/parks" className="text-green-600 hover:text-green-700">
            Retour à la liste des parcs
          </Link>
        </div>
      </div>
    );
  }

  // Mock gallery images (in real app, park would have multiple images)
  const galleryImages = [park.image, park.image, park.image];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const pricingOptions = [
    { name: 'Tarif Adulte', price: park.minPrice, description: 'À partir de 16 ans' },
    { name: 'Tarif Enfant', price: park.minPrice - 5, description: '6-15 ans' },
    { name: 'Tarif Famille', price: park.minPrice * 3.5, description: '2 adultes + 2 enfants' },
    { name: 'Tarif Groupe', price: park.minPrice * 0.8, description: 'À partir de 10 personnes' }
  ];

  const faqItems = [
    {
      question: 'Quels sont les horaires d\'ouverture ?',
      answer: 'Le parc est ouvert tous les jours de 9h à 19h en haute saison (avril-septembre) et de 10h à 17h en basse saison (octobre-mars).'
    },
    {
      question: 'Dois-je réserver à l\'avance ?',
      answer: 'La réservation est fortement recommandée, surtout en haute saison et les week-ends, pour garantir votre créneau horaire.'
    },
    {
      question: 'Que dois-je apporter ?',
      answer: 'Prévoyez des vêtements confortables, des chaussures fermées, de l\'eau et de la crème solaire. Tout l\'équipement de sécurité est fourni.'
    },
    {
      question: 'Les activités sont-elles adaptées aux enfants ?',
      answer: 'Oui ! Nous proposons des parcours adaptés à tous les âges à partir de 3 ans, avec un encadrement professionnel.'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Image Gallery */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={galleryImages[currentImageIndex]}
          alt={park.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Gallery Navigation */}
        <button
          onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all"
        >
          <ChevronLeft className="size-6 text-white" />
        </button>
        <button
          onClick={() => setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all"
        >
          <ChevronRight className="size-6 text-white" />
        </button>

        {/* Park Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-white mb-3">{park.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="size-5" />
                <span>{park.location}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <span>{park.rating}</span>
                <span className="text-sm">({park.reviewCount} avis)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-green-800 mb-4">À propos du parc</h2>
              <p className="text-gray-700 mb-6">{park.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {park.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Activities */}
            <section className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-green-800 mb-6">Activités disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {park.activities.map((activity) => (
                  <div
                    key={activity}
                    className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <div className="w-3 h-3 bg-green-600 rounded-full" />
                    <span className="text-gray-800">{activity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Pricing */}
            <section className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-green-800 mb-6">Tarifs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pricingOptions.map((option) => (
                  <div
                    key={option.name}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 transition-colors"
                  >
                    <h3 className="text-gray-900 mb-1">{option.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                    <div className="text-3xl text-green-600">{option.price}€</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-green-800">Avis clients</h2>
                <div className="flex items-center gap-2">
                  <Star className="size-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl text-gray-900">{park.rating}</span>
                  <span className="text-gray-500">/ 5</span>
                </div>
              </div>
              <div className="space-y-4">
                {parkReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-green-800 mb-6">Questions fréquentes</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <details
                    key={index}
                    className="p-4 bg-gray-50 rounded-xl cursor-pointer group"
                  >
                    <summary className="list-none text-gray-900 group-hover:text-green-600 transition-colors">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-gray-600">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-600 mb-1">À partir de</div>
                  <div className="text-4xl text-green-600 mb-1">{park.minPrice}€</div>
                  <div className="text-sm text-gray-500">par personne</div>
                </div>

                <Link
                  to="/booking"
                  state={{ parkId: park.id }}
                  className="block w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-center hover:from-orange-600 hover:to-orange-700 transition-all hover:scale-105 hover:shadow-xl mb-4"
                >
                  Réserver maintenant
                </Link>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-green-600" />
                    <span>Réservation instantanée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-green-600" />
                    <span>Capacité : {park.capacity} personnes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-green-600" />
                    <span>Ouvert 7j/7</span>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl p-6">
                <h3 className="text-gray-900 mb-4">Besoin d&apos;aide ?</h3>
                <div className="space-y-3">
                  <a
                    href="tel:0123456789"
                    className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-shadow"
                  >
                    <Phone className="size-5 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-600">Téléphone</div>
                      <div className="text-gray-900">01 23 45 67 89</div>
                    </div>
                  </a>
                  <a
                    href="mailto:contact@nolimit-aventure.fr"
                    className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-shadow"
                  >
                    <Mail className="size-5 text-orange-600" />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="text-gray-900">Contact</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

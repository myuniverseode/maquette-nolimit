import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { parks } from '../data/parks';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    park: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send data to backend
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-green-800 mb-4">Contactez-nous</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une question ? Besoin d&apos;un devis personnalisé ? Notre équipe est à votre écoute
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Cards */}
            <a
              href="tel:0123456789"
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Phone className="size-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Téléphone</h3>
              <p className="text-gray-600 mb-2">Lun-Dim : 9h-19h</p>
              <p className="text-green-600">01 23 45 67 89</p>
            </a>

            <a
              href="mailto:contact@nolimit-aventure.fr"
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="size-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-2">Réponse sous 24h</p>
              <p className="text-orange-600">contact@nolimit-aventure.fr</p>
            </a>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="bg-gradient-to-br from-green-700 to-green-800 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Clock className="size-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Horaires</h3>
              <p className="text-gray-600 mb-1">Lun-Ven : 9h-19h</p>
              <p className="text-gray-600">Sam-Dim : 9h-20h</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-green-800 mb-6">Envoyez-nous un message</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="size-8 text-white" />
                  </div>
                  <h3 className="text-green-800 mb-2">Message envoyé !</h3>
                  <p className="text-green-700">
                    Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Nom complet</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="jean@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Parc concerné (optionnel)</label>
                    <select
                      value={formData.park}
                      onChange={(e) => setFormData({ ...formData, park: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Sélectionnez un parc</option>
                      {parks.map((park) => (
                        <option key={park.id} value={park.id}>
                          {park.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Sujet</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="reservation">Réservation</option>
                      <option value="group">Devis groupe</option>
                      <option value="info">Demande d&apos;information</option>
                      <option value="reclamation">Réclamation</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder="Votre message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Envoyer le message
                    <Send className="size-5" />
                  </button>
                </form>
              )}
            </div>

            {/* Parks List */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-md">
                <h2 className="text-green-800 mb-6">Nos parcs</h2>
                <div className="space-y-4">
                  {parks.map((park) => (
                    <div key={park.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <MapPin className="size-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-gray-900 mb-1">{park.name}</h3>
                        <p className="text-sm text-gray-600">{park.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl p-6">
                <h3 className="text-gray-900 mb-3">Besoin d&apos;aide ?</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Notre équipe est disponible pour répondre à toutes vos questions concernant nos parcs, nos activités et vos réservations.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
                    <span>Réponse sous 24h par email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
                    <span>Service client 7j/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
                    <span>Devis groupes sur mesure</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

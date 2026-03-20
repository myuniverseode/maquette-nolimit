import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { useParksData } from '../hooks/useParksData';
import { useContactData } from '../hooks/useContactData';

export function ContactPage() {
  const { parks } = useParksData();
  const { data: contactConfig } = useContactData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    park: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      // Envoi vers l'API WordPress si disponible
      const { API_URL, API_KEY } = await import('../config/config');
      await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
        body: JSON.stringify(formData),
      });
    } catch (_) {
      // Fallback silencieux
    }
    setSending(false);
    setSubmitted(true);
  };

  const subjects = contactConfig.subjects?.length > 0
    ? contactConfig.subjects
    : ['Réservation', 'Devis groupe', "Demande d'information", 'Réclamation', 'Autre'];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-green-800 mb-4">{contactConfig.title}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{contactConfig.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <a
              href={`tel:${contactConfig.phone.replace(/\s/g, '')}`}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Phone className="size-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Téléphone</h3>
              <p className="text-gray-600 mb-2">Lun-Dim : 9h-19h</p>
              <p className="text-green-600">{contactConfig.phone}</p>
            </a>

            <a
              href={`mailto:${contactConfig.email}`}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="size-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-2">Réponse sous 24h</p>
              <p className="text-orange-600">{contactConfig.email}</p>
            </a>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="bg-gradient-to-br from-green-700 to-green-800 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Clock className="size-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Horaires</h3>
              <p className="text-gray-600 text-sm">{contactConfig.openingHours}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire */}
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
                        <option key={park.id} value={park.id}>{park.name}</option>
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
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
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
                    disabled={sending}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {sending ? 'Envoi en cours...' : 'Envoyer le message'}
                    <Send className="size-5" />
                  </button>
                </form>
              )}
            </div>

            {/* Parcs */}
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

              {contactConfig.address && (
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-start gap-3">
                    <MapPin className="size-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-gray-900 mb-1">Adresse</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{contactConfig.address}</p>
                    </div>
                  </div>
                </div>
              )}

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

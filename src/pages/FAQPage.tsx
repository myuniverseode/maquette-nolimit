import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, HelpCircle, Phone, Mail } from 'lucide-react';

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqCategories = [
    {
      name: 'Réservation',
      faqs: [
        {
          question: 'Comment réserver une activité ?',
          answer: 'Vous pouvez réserver directement en ligne via notre site web en cliquant sur "Réserver" et en suivant les étapes. Vous pouvez également nous contacter par téléphone au 01 23 45 67 89 pour une réservation personnalisée.'
        },
        {
          question: 'Puis-je annuler ou modifier ma réservation ?',
          answer: 'Oui, les annulations sont gratuites jusqu\'à 48h avant la date prévue. Pour toute modification ou annulation, contactez-nous par email ou téléphone avec votre numéro de réservation.'
        },
        {
          question: 'Quel est le délai pour réserver ?',
          answer: 'Nous recommandons de réserver au moins 3 jours à l\'avance, surtout en haute saison et pour les week-ends. Les réservations de dernière minute restent possibles selon les disponibilités.'
        }
      ]
    },
    {
      name: 'Tarifs et Paiement',
      faqs: [
        {
          question: 'Quels sont les modes de paiement acceptés ?',
          answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), les chèques, les espèces et les chèques vacances. Pour les groupes, le paiement en plusieurs fois est possible sur demande.'
        },
        {
          question: 'Proposez-vous des tarifs groupes ?',
          answer: 'Oui ! Nous proposons des tarifs préférentiels pour les groupes à partir de 10 personnes. Contactez-nous pour obtenir un devis personnalisé adapté à vos besoins.'
        },
        {
          question: 'Y a-t-il des réductions pour les enfants ?',
          answer: 'Oui, nous proposons des tarifs enfants (6-15 ans) avec une réduction d\'environ 20% sur le tarif adulte. Les enfants de moins de 3 ans ne paient pas pour certaines activités.'
        }
      ]
    },
    {
      name: 'Sécurité et Équipement',
      faqs: [
        {
          question: 'Les activités sont-elles sécurisées ?',
          answer: 'Absolument ! Toutes nos activités respectent les normes de sécurité les plus strictes. Nous fournissons tout l\'équipement de protection nécessaire et chaque groupe est encadré par des professionnels diplômés.'
        },
        {
          question: 'Dois-je apporter mon propre équipement ?',
          answer: 'Non, tout l\'équipement de sécurité (harnais, casques, baudriers, etc.) est fourni et inclus dans le prix. Il vous suffit de venir avec des vêtements confortables et des chaussures fermées.'
        },
        {
          question: 'Que se passe-t-il en cas de mauvais temps ?',
          answer: 'La plupart de nos activités peuvent se pratiquer sous la pluie. En cas de conditions météorologiques dangereuses (orages, vents violents), nous vous proposerons de reporter votre session ou de la remplacer par une activité indoor.'
        }
      ]
    },
    {
      name: 'Accès et Pratique',
      faqs: [
        {
          question: 'À partir de quel âge peut-on participer ?',
          answer: 'Cela dépend de l\'activité ! Nous proposons des parcours dès 3 ans (parcours filet), 6 ans (accrobranche kids), et certaines activités comme le paintball sont accessibles dès 12 ans. Consultez chaque fiche activité pour plus de détails.'
        },
        {
          question: 'Faut-il être sportif pour participer ?',
          answer: 'Non ! Nos parcours sont adaptés à tous les niveaux. Nous proposons des parcours débutants accessibles à tous, ainsi que des parcours plus sportifs pour les amateurs de sensations fortes.'
        },
        {
          question: 'Combien de temps dure une session ?',
          answer: 'La durée varie selon l\'activité : de 1h pour le parcours filet à 3h pour l\'accrobranche complet. Chaque activité indique sa durée approximative dans sa description.'
        },
        {
          question: 'Peut-on venir avec notre propre nourriture ?',
          answer: 'Oui, des aires de pique-nique sont disponibles dans tous nos parcs. Certains parcs disposent également d\'un restaurant ou d\'un snack sur place.'
        }
      ]
    },
    {
      name: 'Groupes et Événements',
      faqs: [
        {
          question: 'Organisez-vous des anniversaires ?',
          answer: 'Oui ! Nous proposons des formules anniversaire clé en main avec activités, espace réservé et options restauration. Contactez-nous pour personnaliser votre fête.'
        },
        {
          question: 'Proposez-vous des activités pour les entreprises ?',
          answer: 'Absolument ! Nous organisons des team buildings, séminaires et événements d\'entreprise sur mesure. Contactez notre service groupes pour un devis personnalisé.'
        },
        {
          question: 'Quel est le nombre minimum pour un groupe ?',
          answer: 'Nous considérons qu\'un groupe commence à partir de 10 personnes. Pour les entreprises et événements spéciaux, nous pouvons privatiser tout ou partie d\'un parc.'
        }
      ]
    }
  ];

  const allFaqs = faqCategories.flatMap((cat, catIndex) =>
    cat.faqs.map((faq, faqIndex) => ({
      ...faq,
      category: cat.name,
      globalIndex: catIndex * 100 + faqIndex
    }))
  );

  const filteredFaqs = searchQuery
    ? allFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFaqs;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="size-10 text-white" />
            </div>
            <h1 className="text-green-800 mb-4">Foire aux questions</h1>
            <p className="text-xl text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl p-4 shadow-md mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une question..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* FAQ List */}
          {searchQuery ? (
            // Search Results
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.globalIndex}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenIndex(openIndex === faq.globalIndex ? null : faq.globalIndex)
                      }
                      className="w-full px-6 py-4 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 pr-4">
                        <div className="text-xs text-green-600 mb-1">{faq.category}</div>
                        <h3 className="text-gray-900">{faq.question}</h3>
                      </div>
                      <ChevronDown
                        className={`size-5 text-gray-400 flex-shrink-0 transition-transform ${
                          openIndex === faq.globalIndex ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openIndex === faq.globalIndex && (
                      <div className="px-6 pb-6 text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-md">
                  <p className="text-gray-600">Aucun résultat trouvé pour &quot;{searchQuery}&quot;</p>
                </div>
              )}
            </div>
          ) : (
            // Categories
            <div className="space-y-8">
              {faqCategories.map((category, catIndex) => (
                <div key={category.name} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                    <h2 className="text-white">{category.name}</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {category.faqs.map((faq, faqIndex) => {
                      const globalIndex = catIndex * 100 + faqIndex;
                      return (
                        <div key={faqIndex}>
                          <button
                            onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                            className="w-full px-6 py-4 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
                          >
                            <h3 className="text-gray-900 flex-1 pr-4">{faq.question}</h3>
                            <ChevronDown
                              className={`size-5 text-gray-400 flex-shrink-0 transition-transform ${
                                openIndex === globalIndex ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {openIndex === globalIndex && (
                            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-12 bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl p-8 text-center">
            <h2 className="text-green-800 mb-4">Vous ne trouvez pas votre réponse ?</h2>
            <p className="text-gray-600 mb-6">
              Notre équipe est là pour vous aider. N&apos;hésitez pas à nous contacter !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all hover:scale-105"
              >
                <Mail className="size-5" />
                Nous contacter
              </Link>
              <a
                href="tel:0123456789"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-green-700 border-2 border-green-200 rounded-full hover:bg-green-50 transition-all hover:scale-105"
              >
                <Phone className="size-5" />
                01 23 45 67 89
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

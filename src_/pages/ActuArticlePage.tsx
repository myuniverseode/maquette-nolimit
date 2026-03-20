// pages/ActuArticlePage.tsx
// Gabarit article d'actualité — utilisable pour les actus globales ET les actus par parc
// Route: /actualites/:slug  OU  /parks/:parkId/actualites/:slug

import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Share2, MapPin, ArrowRight,
  UserPlus, Tag, ChevronLeft, BookOpen
} from 'lucide-react';
import { useState } from 'react';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';

// ── Types ──
interface ActuArticle {
  id: string;
  slug: string;
  titre: string;
  extrait: string;
  contenu: string;
  image: string;
  date: string;
  auteur?: string;
  readTime?: string;
  categorie?: string;
  tags?: string[];
  isEvenement?: boolean;
  lienInscription?: string;
  parkId?: string;
  parkName?: string;
}

// ── Helpers ──
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

// ── Composant Article ──
export function ActuArticlePage() {
  const { slug, parkId } = useParams();
  const [shared, setShared] = useState(false);

  // TODO: Remplacer par un vrai fetch (WordPress, Strapi, etc.) basé sur slug + parkId
  const article: ActuArticle = {
    id: '1',
    slug: slug ?? 'article',
    titre: "Championnat régional d'escalade 2025",
    extrait: 'Rejoignez-nous pour le grand championnat régional ouvert à tous les niveaux.',
    contenu: `
      <p>Le parc NoLimit est fier d'accueillir la 5ème édition du championnat régional d'escalade, un événement incontournable pour tous les passionnés de grimpe.</p>
      <h2>Programme de la journée</h2>
      <ul>
        <li><strong>9h00 :</strong> Accueil des participants et échauffement collectif</li>
        <li><strong>10h00 :</strong> Début des épreuves qualificatives</li>
        <li><strong>12h30 :</strong> Pause déjeuner (restauration sur place)</li>
        <li><strong>14h00 :</strong> Finales toutes catégories</li>
        <li><strong>16h30 :</strong> Remise des prix et cocktail</li>
      </ul>
      <h2>Catégories</h2>
      <p>L'événement est ouvert à tous les niveaux : débutants, intermédiaires et confirmés. Chaque catégorie dispose de voies adaptées pour garantir un challenge équilibré.</p>
      <h2>Inscriptions</h2>
      <p>Les inscriptions sont ouvertes jusqu'au 10 mars. Places limitées à 120 participants. Tarif d'inscription : 15€ (inclut l'accès au parc toute la journée + un t-shirt souvenir).</p>
    `,
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1200',
    date: '2025-03-15',
    auteur: 'Équipe NoLimit',
    readTime: '4 min',
    categorie: 'Événement',
    tags: ['escalade', 'compétition', 'événement'],
    isEvenement: true,
    lienInscription: '/inscription-championnat',
    parkId: parkId,
    parkName: 'NoLimit Aventure',
  };

  // Articles suggérés (mock)
  const related: Pick<ActuArticle, 'id' | 'slug' | 'titre' | 'image' | 'date' | 'categorie'>[] = [
    { id: '2', slug: 'nouvelle-via-ferrata', titre: 'Nouvelle via ferrata inaugurée', image: article.image, date: '2025-04-01', categorie: 'Nouveauté' },
    { id: '3', slug: 'promo-groupes', titre: '-20% pour les groupes', image: article.image, date: '2025-02-01', categorie: 'Promo' },
  ];

  // Bouton retour : vers le parc si actu parc, sinon vers /actualites globales
  const backLabel = parkId ? 'Retour au parc' : 'Toutes les actualités';
  const backTo = parkId
    ? `/parks/${parkId}#actualites`
    : '/actualites';

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: article.titre, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero image ── */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={article.image}
          alt={article.titre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-6 left-6 z-20"
        >
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/25 hover:bg-white/25 transition-all"
          >
            <ChevronLeft className="size-4" />
            {backLabel}
          </Link>
        </motion.div>

        {/* Share */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleShare}
          className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/25 hover:bg-white/25 transition-all"
        >
          {shared ? '✓' : <Share2 className="size-4" />}
        </motion.button>

        {/* Meta overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-6 pb-10"
        >
          {article.categorie && (
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-black text-white mb-4"
              style={{ backgroundColor: article.isEvenement ? ORANGE : GREEN }}
            >
              {article.isEvenement ? '📅 ' : ''}
              {article.categorie}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-3xl drop-shadow-xl">
            {article.titre}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-white/70 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {formatDate(article.date)}
            </div>
            {article.readTime && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="size-4" />
                {article.readTime} de lecture
              </div>
            )}
            {article.parkName && (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {article.parkName}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ── Contenu article ── */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Corps de l'article */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            {/* Extrait mis en avant */}
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 pl-5" style={{ borderColor: GREEN }}>
              {article.extrait}
            </p>

            {/* Contenu HTML */}
            <div
              className="prose prose-lg prose-gray max-w-none
                prose-headings:font-black prose-headings:text-gray-900
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-li:text-gray-600
                prose-strong:text-gray-900
                prose-a:text-green-700 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: article.contenu }}
            />

            {/* CTA événement */}
            {article.isEvenement && article.lienInscription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 rounded-3xl p-8 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${ORANGE} 0%, #d66310 100%)` }}
              >
                <motion.div
                  className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white mb-2">Participez à l'événement !</h3>
                  <p className="text-white/80 mb-6 text-sm">Places limitées — Inscriptions ouvertes</p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={article.lienInscription}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-black text-sm hover:shadow-lg transition-all"
                      style={{ color: ORANGE }}
                    >
                      <UserPlus className="size-5" />
                      S'inscrire maintenant
                    </Link>
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 border border-white/30 rounded-xl font-bold text-sm text-white hover:bg-white/30 transition-all"
                    >
                      <Share2 className="size-4" />
                      Partager
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <Tag className="size-3.5" /> Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.article>

          {/* Sidebar sticky */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Auteur */}
              {article.auteur && (
                <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50/50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Publié par</div>
                  <div className="font-black text-gray-900 text-sm">{article.auteur}</div>
                </div>
              )}

              {/* Retour parc */}
              {parkId && (
                <Link
                  to={`/parks/${parkId}#actualites`}
                  className="flex items-center gap-3 p-5 rounded-2xl border-2 transition-all hover:shadow-md group"
                  style={{ borderColor: `${GREEN}40`, backgroundColor: `${GREEN}08` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: GREEN }}>
                    <MapPin className="size-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-sm" style={{ color: GREEN }}>Retour au parc</div>
                    <div className="text-xs text-gray-500 truncate">{article.parkName}</div>
                  </div>
                  <ArrowRight className="size-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}

              {/* Articles liés */}
              {related.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">À lire aussi</div>
                  <div className="space-y-3">
                    {related.map(r => (
                      <Link
                        key={r.id}
                        to={parkId ? `/parks/${parkId}/actualites/${r.slug}` : `/actualites/${r.slug}`}
                        className="flex gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={r.image}
                            alt={r.titre}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-sm leading-tight group-hover:text-green-700 transition-colors line-clamp-2">
                            {r.titre}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{formatDate(r.date)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ── Barre de retour sticky en bas (mobile) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-3">
        <Link
          to={backTo}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-white text-sm"
          style={{ backgroundColor: GREEN }}
        >
          <ChevronLeft className="size-4" />
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
// components/park/ParkBlogSection.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { SubtlePatternBg } from './ParkHelpers';

const GREEN  = '#357600';
const ORANGE = '#eb700f';
const DARK   = '#111111';

const blogPosts = [
  {
    category: '🎯 Conseil', categoryColor: GREEN,
    date: '5 mars 2025', readTime: '4 min',
    title: '5 conseils pour préparer sa première via ferrata',
    excerpt: "Que vous soyez débutant ou sportif confirmé, la via ferrata demande une préparation spécifique. Découvrez nos conseils d'experts pour profiter pleinement de cette expérience unique.",
    author: { name: 'Marc D.', role: 'Moniteur escalade', avatar: '🧗' },
  },
  {
    category: '📖 Guide', categoryColor: ORANGE,
    date: '20 fév. 2025', readTime: '6 min',
    title: 'Activités outdoor en famille : notre guide complet',
    excerpt: "Partager une aventure en plein air avec ses enfants, c'est créer des souvenirs inoubliables. Voici notre sélection des meilleures activités adaptées à toute la famille, de 5 à 77 ans.",
    author: { name: 'Sophie L.', role: 'Responsable activités', avatar: '🌟' },
  },
  {
    category: '🌿 Nature', categoryColor: '#22c55e',
    date: '10 fév. 2025', readTime: '5 min',
    title: 'La biodiversité du parc : entre les sessions, observez !',
    excerpt: 'Notre parc est niché dans un espace naturel exceptionnel. Entre deux activités, prenez le temps d\'observer la faune et la flore locale.',
    author: { name: 'Julien B.', role: 'Guide nature', avatar: '🦅' },
  },
];

export function ParkBlogSection() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
      <SubtlePatternBg />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 max-w-6xl mx-auto"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-medium border" style={{ backgroundColor: `${GREEN}10`, borderColor: `${GREEN}30`, color: GREEN }}>
              <TrendingUp className="size-4" /> Le blog du parc
            </div>
            <h2 className="text-4xl md:text-5xl font-black" style={{ color: DARK }}>
              Conseils & <span style={{ color: GREEN }}>inspirations</span>
            </h2>
            <p className="text-gray-500 mt-2">Guides, astuces et coulisses du parc</p>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm border-2 transition-all hover:shadow-md whitespace-nowrap" style={{ borderColor: GREEN, color: GREEN }}>
            Voir tous les articles <ArrowRight className="size-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {blogPosts.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-6xl">
                  {i === 0 ? '🧗' : i === 1 ? '👨‍👩‍👧' : '🦅'}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-black text-white backdrop-blur-sm" style={{ backgroundColor: `${post.categoryColor}DD` }}>
                  {post.category}
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                  ⏱ {post.readTime}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="text-xs text-gray-400 font-medium mb-3">{post.date}</div>
                <h3 className="font-black text-gray-900 text-lg leading-tight mb-3 group-hover:text-green-700 transition-colors">{post.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm">{post.author.avatar}</div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{post.author.name}</div>
                      <div className="text-[10px] text-gray-400">{post.author.role}</div>
                    </div>
                  </div>
                  <motion.div whileHover={{ x: 3 }} className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: post.categoryColor }}>
                    Lire <ArrowRight className="size-3.5" />
                  </motion.div>
                </div>
              </div>

              <div className="h-1 w-full" style={{ backgroundColor: post.categoryColor }} />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

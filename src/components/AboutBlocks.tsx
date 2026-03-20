// components/AboutBlocks.tsx — Composants réutilisables pour les pages About
import { motion } from 'framer-motion';

const DARK = '#111111';

/** Bloc texte simple (titre + paragraphe) */
export function TextBlock({ title, text, className = '' }: { title?: string; text?: string; className?: string }) {
  if (!title && !text) return null;
  return (
    <section className={`py-14 bg-white ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {title && <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: DARK }}>{title}</h2>}
          {text && <p className="text-gray-600 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />}
        </motion.div>
      </div>
    </section>
  );
}

/** Bloc texte + image alternés (type édito) */
export interface ContentBlock {
  title?: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function TextImageBlocks({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <section className="py-16 bg-white">
      <div className="space-y-20 max-w-6xl mx-auto">
        {blocks.map((block, i) => {
          const reversed = i % 2 !== 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col md:flex-row gap-10 items-center ${reversed ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Image */}
              <div className="flex-1 w-full">
                {block.image ? (
                  <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-gray-100">
                    <img
                      src={block.image}
                      alt={block.imageAlt || block.title || ''}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-3xl h-64 md:h-80 flex items-center justify-center" style={{ background: `linear-gradient(135deg, #f0fdf4, #fef3ea)` }}>
                    <span className="text-7xl opacity-30">🌲</span>
                  </div>
                )}
              </div>

              {/* Texte */}
              <div className="flex-1">
                {block.title && (
                  <h3 className="text-2xl md:text-3xl font-black mb-4" style={{ color: DARK }}>{block.title}</h3>
                )}
                {block.text && (
                  <p className="text-gray-600 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: block.text }} />
                )}
                {block.ctaText && block.ctaLink && (
                  <a href={block.ctaLink} className="inline-flex items-center gap-2 text-sm font-black" style={{ color: '#357600' }}>
                    {block.ctaText} →
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

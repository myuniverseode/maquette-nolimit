// components/home/NewsCard.tsx
import { ArrowRight, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsArticle {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  featured?: boolean;
  author?: string;
}

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'nouveauté': return 'bg-green-100 text-green-700';
      case 'événement': return 'bg-orange-100 text-orange-700';
      case 'expansion': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200 group">
      <div className="h-48 overflow-hidden relative">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {article.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full">
            ✨ À la une
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
          <span>{article.date}</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {article.readTime}
          </span>
          {article.author && (
            <span className="flex items-center gap-1">
              <User className="size-3" />
              {article.author}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            to={`/news/${article.id}`}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium group/link"
          >
            Lire l'article
            <ArrowRight className="size-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
          
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
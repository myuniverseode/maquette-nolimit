// hooks/useBlogData.ts
import { useState, useEffect } from 'react';
import { API_URL, API_KEY, cleanWpData } from '../config/config';

export interface BlogArticle {
  id: number; slug: string; title: string; subtitle: string; excerpt: string;
  image: string; date: string; readTime: string; author: string; authorRole: string;
  difficulty: string; views: number; featured: boolean; category: string;
  tags: string[]; parkSlug?: string; content?: string;
  related?: Array<{ id: number; slug: string; title: string; image: string; date: string; category: string }>;
}

export interface BlogData {
  title: string; subtitle: string;
  categories: Array<{ slug: string; name: string; description: string }>;
  articles: BlogArticle[];
}

export function useBlogData(options: { category?: string; park?: string } = {}) {
  const [data, setData] = useState<BlogData>({ title: 'Blog & Conseils', subtitle: '', categories: [], articles: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (options.category && options.category !== 'all') params.append('category', options.category);
    if (options.park) params.append('park', options.park);
    const qs = params.toString() ? `?${params}` : '';

    fetch(`${API_URL}/blog${qs}`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json().then(_x=>cleanWpData(_x)); })
      .then(raw => { const d = cleanWpData(raw); setData(d); setError(null); })
      .catch(e => { console.warn('⚠️ Blog indisponible:', e); setError(e); })
      .finally(() => setLoading(false));
  }, [options.category, options.park]);

  return { data, loading, error };
}

export function useBlogArticle(slug: string) {
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/blog/${slug}`, {
      headers: { 'Content-Type': 'application/json', 'X-NoLimit-Key': API_KEY || '' },
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json().then(_x=>cleanWpData(_x)); })
      .then(raw => { const d = cleanWpData(raw); setArticle(d); setError(null); })
      .catch(e => { console.warn('⚠️ Article blog indisponible:', e); setError(e); })
      .finally(() => setLoading(false));
  }, [slug]);

  return { article, loading, error };
}

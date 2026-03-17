// components/home/TopicGrid.tsx
import { TrendingUp, Users, Shield, Clock, Star, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogTopic {
  title: string;
  icon: React.ReactNode;
  count: string;
  color: string;
  path: string;
}

export function TopicGrid() {
  const topics: BlogTopic[] = [
    {
      title: 'Les bienfaits des sports outdoor',
      icon: <TrendingUp className="size-4" />,
      count: '12 articles',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      path: '/blog/sports-outdoor'
    },
    {
      title: 'Organiser un team-building réussi',
      icon: <Users className="size-4" />,
      count: '8 guides',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      path: '/blog/team-building'
    },
    {
      title: 'Aventure en famille : nos conseils',
      icon: <Shield className="size-4" />,
      count: '15 astuces',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      path: '/blog/famille'
    },
    {
      title: 'Histoire de l\'accrobranche',
      icon: <Clock className="size-4" />,
      count: '5 récits',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      path: '/blog/histoire'
    },
    {
      title: 'Meilleurs spots photo',
      icon: <Star className="size-4" />,
      count: '7 tutoriels',
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
      path: '/blog/photos'
    },
    {
      title: 'Préparation physique',
      icon: <Target className="size-4" />,
      count: '10 exercices',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      path: '/blog/preparation'
    }
  ];

  return (
    <>
      <h4 className="font-bold text-gray-900 mb-4">Blog & Actus</h4>
      <div className="grid grid-cols-2 gap-3">
        {topics.map((topic, index) => (
          <Link
            key={index}
            to={topic.path}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`${topic.color} w-7 h-7 rounded-lg flex items-center justify-center`}>
                {topic.icon}
              </div>
              <span className="text-sm font-medium text-gray-900 group-hover:text-green-700">
                {topic.title}
              </span>
            </div>
            <div className="text-xs text-gray-500">{topic.count}</div>
          </Link>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Link
          to="/blog"
          className="text-sm text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1"
        >
          Explorer tous les sujets →
        </Link>
      </div>
    </>
  );
}
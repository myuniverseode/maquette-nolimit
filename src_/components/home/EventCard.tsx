// components/home/EventCard.tsx
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  participants: number;
  status: 'ouvert' | 'complet' | 'bientôt';
  price: string;
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ouvert': return 'bg-green-100 text-green-700';
      case 'complet': return 'bg-red-100 text-red-700';
      case 'bientôt': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="size-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">{event.date}</span>
          </div>
          <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-700">
            {event.title}
          </h4>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
          {event.status}
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="size-4" />
          <span className="text-sm">{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="size-4" />
          <span className="text-sm">{event.participants} participants max</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Ticket className="size-4" />
          <span className="text-sm font-medium">{event.price}</span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Link
          to={`/events/${event.id}`}
          className="flex-1 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors text-center"
        >
          S'inscrire
        </Link>
        <button className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
          + Calendrier
        </button>
      </div>
    </div>
  );
}
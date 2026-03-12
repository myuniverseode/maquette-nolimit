// components/home/SocialCard.tsx
import { LucideIcon } from 'lucide-react';

interface SocialNetwork {
  name: string;
  icon: LucideIcon;
  url: string;
  handle: string;
  followers: string;
  color: string;
  bgColor: string;
}

interface SocialCardProps {
  network: SocialNetwork;
}

export function SocialCard({ network }: SocialCardProps) {
  const Icon = network.icon;
  
  return (
    <a
      href={network.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${network.bgColor} rounded-xl hover:shadow-md transition-shadow p-4 block`}
    >
      <div className="flex items-center gap-4">
        <div className={`bg-gradient-to-br ${network.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className="size-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-900">{network.name}</div>
              <div className="text-sm text-gray-600">{network.handle}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Abonnés</div>
              <div className="font-bold text-gray-900">{network.followers}</div>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              Suivre sur {network.name} →
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
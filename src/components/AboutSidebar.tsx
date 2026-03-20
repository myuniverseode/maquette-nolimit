// components/AboutSidebar.tsx — Sidebar « Découvrir » réutilisable sur toutes les pages About
import { motion } from 'framer-motion';
import { ArrowRight, History, Target, MapPin, Briefcase, Newspaper, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const GREEN = '#357600';
const ORANGE = '#eb700f';
const DARK = '#111111';

const MENU_ITEMS = [
  { to: '/about',              icon: '📖', label: 'À propos',     Icon: History },
  { to: '/about/histoire',     icon: '🏔️', label: 'Notre Histoire', Icon: History },
  { to: '/about/valeurs',      icon: '💚', label: 'Notre ADN',    Icon: Target },
  { to: '/about/parcs',        icon: '📍', label: 'Nos Parcs',    Icon: MapPin },
  { to: '/about/emplois',      icon: '🧗', label: 'Nos Emplois',  Icon: Briefcase },
  { to: '/about/actualites',   icon: '🗞️', label: 'Actualités',   Icon: Newspaper },
  { to: '/about/partenaires',  icon: '🤝', label: 'Partenaires',  Icon: Users },
];

export function AboutSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="sticky top-28">
        <div className="rounded-3xl border-2 border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ backgroundColor: `${GREEN}15`, color: GREEN }}>
              📖
            </div>
            <span className="font-black text-sm" style={{ color: DARK }}>Découvrir NoLimit</span>
          </div>

          <nav className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const isActive = currentPath === item.to || (item.to !== '/about' && currentPath.startsWith(item.to));
              const isExactAbout = item.to === '/about' && currentPath === '/about';
              const active = isActive || isExactAbout;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group ${
                    active
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  style={active ? { background: `linear-gradient(135deg, ${GREEN}, #4a9d00)` } : {}}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {active && <ArrowRight className="size-3.5 opacity-70" />}
                </Link>
              );
            })}
          </nav>

          {/* CTA réservation */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <Link
              to="/booking"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-xs text-white transition-all hover:shadow-lg"
              style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff9a3c)` }}
            >
              🎫 Réserver maintenant
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

/**
 * Layout wrapper pour les pages About avec sidebar
 * Usage: <AboutLayout><contenu de la page /></AboutLayout>
 */
export function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        <AboutSidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

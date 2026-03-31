// components/ParkFilters.tsx — Sidebar layout (filtres dynamiques depuis WordPress)
import { useState, useMemo, memo, useCallback } from 'react';
import { Filter, X, ChevronDown, Zap, Car, PartyPopper, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filters, Park } from '../types';
import { useFiltersData } from '../hooks/useFiltersData';
import * as LucideIcons from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────

function getLucideIcon(name: string): React.ComponentType<any> {
  const Icon = (LucideIcons as Record<string, any>)[name];
  return Icon ?? Car;
}

// ─── Types ────────────────────────────────────────────────────

interface ParkFiltersProps {
  onFilterChange: (filters: Filters) => void;
  parks: Park[];
  compact?: boolean;
}

type ActiveFilters = Filters & { transport: string[]; eventType: string[] };

const EMPTY_FILTERS: ActiveFilters = {
  activities: [], minAge: null, difficulty: [],
  location: '', maxDistance: null, transport: [], eventType: [],
};

// ─── Section collapsible (définie HORS du composant parent) ───
const Section = memo(({
  id, icon: Icon, title, color, expanded, onToggle, children,
}: {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  color: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="border-b border-gray-100 last:border-0">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-4 px-1 text-left"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon className="size-3.5" style={{ color }} />
        </div>
        <span className="font-bold text-gray-800 text-sm">{title}</span>
      </div>
      <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
        <ChevronDown className="size-4 text-gray-400" />
      </motion.div>
    </button>

    <AnimatePresence initial={false}>
      {expanded && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="pb-4 px-1">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));
Section.displayName = 'Section';

// ─── Composant principal ──────────────────────────────────────

export function ParkFilters({ onFilterChange, parks, compact = false }: ParkFiltersProps) {
  const { data: filtersData, loading: filtersLoading } = useFiltersData();

  const [filters, setFilters]       = useState<ActiveFilters>(EMPTY_FILTERS);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded]     = useState({
    activities: true,
    transport:  false,
    event:      false,
  });

  // ── Activités : WordPress en priorité, parcs en fallback ──
  const ACTIVITIES = useMemo(() => {
    if (!filtersLoading && filtersData.activities.length > 0) {
      return filtersData.activities;
    }
    const all = parks.flatMap(p => p.activities);
    return [...new Set(all)].map(a => ({
      id:    a.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      label: a,
      emoji: '⭐',
    }));
  }, [filtersData, filtersLoading, parks]);

  const TRANSPORT_OPTIONS = filtersData.transport;
  const EVENT_OPTIONS     = filtersData.eventTypes;

  // ── Callbacks stables ──────────────────────────────────────
  const toggle = useCallback((key: 'activities' | 'transport' | 'eventType', id: string) => {
    setFilters(prev => {
      const arr = prev[key] as string[];
      const next = {
        ...prev,
        [key]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id],
      };
      onFilterChange(next);
      return next;
    });
  }, [onFilterChange]);

  const reset = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    onFilterChange(EMPTY_FILTERS);
  }, [onFilterChange]);

  const toggleSection = useCallback((id: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const activeCount =
    filters.activities.length +
    filters.transport.length +
    filters.eventType.length;

  // ─── Contenu du panneau (plus aucun overflow-y-auto) ────
  const panelContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-[#357600] to-[#4a9d00] rounded-xl flex items-center justify-center shadow-sm">
            <SlidersHorizontal className="size-4 text-white" />
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-base leading-none">Filtres</h3>
            {activeCount > 0 && (
              <p className="text-xs text-[#357600] font-semibold mt-0.5">
                {activeCount} actif{activeCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <AnimatePresence>
          {activeCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="size-3" />
              Effacer
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Skeleton pendant le chargement WordPress */}
      {filtersLoading ? (
        <div className="space-y-3 px-1">
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} className="h-9 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        // Plus de overflow-y-auto → le contenu prend sa hauteur naturelle
        <div className="-mx-1 px-1">
          {/* ── Activités : maintenant en grille 2 colonnes ── */}
          <Section
            id="activities"
            icon={Zap}
            title="Activités"
            color="#357600"
            expanded={expanded.activities}
            onToggle={() => toggleSection('activities')}
          >
            <div className="grid grid-cols-2 gap-2">
              {ACTIVITIES.map(a => {
                const on = filters.activities.includes(a.id);
                return (
                  <motion.button
                    key={a.id}
                    onClick={() => toggle('activities', a.id)}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-2 py-2.5 rounded-xl text-xs font-semibold transition-all border-2 text-left ${
                      on
                        ? 'bg-[#357600] text-white border-[#357600] shadow-md shadow-green-500/20'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#357600]/40 hover:bg-green-50'
                    }`}
                  >
                    <span className="text-base leading-none flex-shrink-0">{a.emoji}</span>
                    <span className="leading-snug break-words">{a.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </Section>

          {/* ── Transport ── */}
          {TRANSPORT_OPTIONS.length > 0 && (
            <Section
              id="transport"
              icon={Car}
              title="Accessibilité"
              color="#2563eb"
              expanded={expanded.transport}
              onToggle={() => toggleSection('transport')}
            >
              <div className="space-y-2">
                {TRANSPORT_OPTIONS.map(t => {
                  const on = filters.transport.includes(t.id);
                  const Icon = getLucideIcon(t.icon);
                  return (
                    <motion.button
                      key={t.id}
                      onClick={() => toggle('transport', t.id)}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
                        on
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className={`size-5 flex-shrink-0 ${on ? 'text-white' : 'text-blue-500'}`} />
                      <div className="text-left">
                        <div>{t.label}</div>
                        <div className={`text-xs font-normal ${on ? 'text-white/70' : 'text-gray-400'}`}>
                          {t.description}
                        </div>
                      </div>
                      {on && (
                        <div className="ml-auto w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ── Événements ── */}
          {EVENT_OPTIONS.length > 0 && (
            <Section
              id="event"
              icon={PartyPopper}
              title="Votre événement"
              color="#eb700f"
              expanded={expanded.event}
              onToggle={() => toggleSection('event')}
            >
              <div className="grid grid-cols-2 gap-2">
                {EVENT_OPTIONS.map(e => {
                  const on = filters.eventType.includes(e.id);
                  return (
                    <motion.button
                      key={e.id}
                      onClick={() => toggle('eventType', e.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-start px-3 py-3 rounded-xl text-xs font-semibold transition-all border-2 ${
                        on
                          ? 'bg-[#eb700f] text-white border-[#eb700f] shadow-md shadow-orange-500/20'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#eb700f]/40 hover:bg-orange-50'
                      }`}
                    >
                      <span className="text-xl mb-1 leading-none">{e.emoji}</span>
                      <span className="leading-tight whitespace-normal">{e.label}{e.popular && <span className="ml-1">⭐</span>}</span>
                    </motion.button>
                  );
                })}
              </div>
            </Section>
          )}
        </div>
      )}

      {/* Tags récapitulatifs */}
      <AnimatePresence>
        {activeCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-100 px-1"
          >
            <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Sélection</p>
            <div className="flex flex-wrap gap-1.5">
              {filters.activities.map(id => {
                const a = ACTIVITIES.find(x => x.id === id);
                return a && (
                  <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {a.emoji} {a.label}
                    <button onClick={() => toggle('activities', id)} className="hover:bg-green-200 rounded-full p-0.5 ml-0.5">
                      <X className="size-2.5" />
                    </button>
                  </span>
                );
              })}
              {filters.transport.map(id => {
                const t = TRANSPORT_OPTIONS.find(x => x.id === id);
                return t && (
                  <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {t.label}
                    <button onClick={() => toggle('transport', id)} className="hover:bg-blue-200 rounded-full p-0.5 ml-0.5">
                      <X className="size-2.5" />
                    </button>
                  </span>
                );
              })}
              {filters.eventType.map(id => {
                const e = EVENT_OPTIONS.find(x => x.id === id);
                return e && (
                  <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                    {e.emoji} {e.label}
                    <button onClick={() => toggle('eventType', id)} className="hover:bg-orange-200 rounded-full p-0.5 ml-0.5">
                      <X className="size-2.5" />
                    </button>
                  </span>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ─── Rendu ─────────────────────────────────────────────────

  return (
    <>
      {/* ── DESKTOP : sidebar sticky, plus de hauteur max ni scroll ── */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-6 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-5 flex flex-col">
          {panelContent}
        </div>
      </aside>

      {/* ── MOBILE : bouton flottant + drawer (scroll conservé pour les petits écrans) ── */}
      <div className="lg:hidden">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 pl-4 pr-5 py-3 bg-[#357600] text-white rounded-full shadow-2xl shadow-green-600/40 font-bold text-sm"
        >
          <Filter className="size-4" />
          Filtres
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-[#eb700f] rounded-full text-xs font-black flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <h2 className="font-black text-gray-900">Filtrer les parcs</h2>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <X className="size-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  {panelContent}
                </div>
                <div className="p-5 border-t border-gray-100">
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-3 bg-[#357600] text-white rounded-xl font-bold hover:bg-[#2a5e00] transition-colors"
                  >
                    Voir les résultats
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
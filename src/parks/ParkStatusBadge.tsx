// components/park/ParkStatusBadge.tsx
// Badge ouvert/fermé + horaires complets alimentés par les horaires WordPress via useHorairesData()

import { motion } from 'framer-motion';
import { useHorairesData, ParkStatus } from '../hooks/useHorairesData';
import { Clock, AlertCircle } from 'lucide-react';

// ─── Config visuelle par statut ─────────────────────────────────────────────

const STATUS_CONFIG: Record<ParkStatus, {
  color: string; bg: string; border: string; dot: string; animate: boolean;
}> = {
  'open': {
    color: '#22c55e', bg: '#f0fdf4', border: '#86efac', dot: '#22c55e', animate: true,
  },
  'closes-soon': {
    color: '#eb700f', bg: '#eb700f10', border: '#eb700f50', dot: '#eb700f', animate: true,
  },
  'opens-soon': {
    color: '#3b82f6', bg: '#eff6ff', border: '#93c5fd', dot: '#3b82f6', animate: false,
  },
  'closed': {
    color: '#ef4444', bg: '#fef2f2', border: '#fca5a5', dot: '#ef4444', animate: false,
  },
  'exceptional-open': {
    color: '#8b5cf6', bg: '#f5f3ff', border: '#c4b5fd', dot: '#8b5cf6', animate: true,
  },
  'exceptional-closed': {
    color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d', dot: '#f59e0b', animate: false,
  },
};

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ParkStatusBadgeProps {
  /** Slug du parc (ex: 'nolimit-chevry') */
  parkSlug: string;
  /** Taille du badge */
  size?: 'sm' | 'md' | 'lg';
  /** Afficher le détail des horaires ? */
  showDetails?: boolean;
  /** Mode compact (juste le statut) */
  compact?: boolean;
}

// ─── Helper pour les noms de mois en français ───────────────────────────────

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const MONTHS_SHORT_FR = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
  'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
];

// ─── Helper pour traduire les jours ─────────────────────────────────────────

const translateDay = (day: string): string => {
  const days: Record<string, string> = {
    'monday': 'lundi',
    'tuesday': 'mardi',
    'wednesday': 'mercredi',
    'thursday': 'jeudi',
    'friday': 'vendredi',
    'saturday': 'samedi',
    'sunday': 'dimanche'
  };
  return days[day] || day;
};

// ─── Composant principal ───────────────────────────────────────────────────

export function ParkStatusBadge({ 
  parkSlug, 
  size = 'md', 
  showDetails = false,
  compact = false 
}: ParkStatusBadgeProps) {
  const { horaires, status: statusResult, loading } = useHorairesData(parkSlug);

  // Debug
  console.log(`📍 ParkStatusBadge - Données pour ${parkSlug}:`, horaires);
  console.log(`📍 ParkStatusBadge - Statut calculé:`, statusResult);

  if (loading) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-2xl border-2 bg-gray-50 border-gray-200 animate-pulse ${
        size === 'sm' ? 'px-3 py-1.5' : 
        size === 'md' ? 'px-4 py-2.5' : 
        'px-5 py-3'
      }`}>
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>
    );
  }

  const cfg = STATUS_CONFIG[statusResult.status];

  // Version compacte (juste le statut)
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 rounded-2xl border-2 font-medium ${
          size === 'sm' ? 'px-3 py-1.5 text-xs' : 
          size === 'md' ? 'px-4 py-2.5 text-sm' : 
          'px-5 py-3 text-base'
        }`}
        style={{ backgroundColor: cfg.bg, borderColor: cfg.border, color: cfg.color }}
      >
        <motion.div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: cfg.dot }}
          animate={cfg.animate ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="font-black">{statusResult.label}</span>
      </motion.div>
    );
  }

  // Version complète avec badge + horaires
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Badge statut */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2.5 rounded-2xl border-2 font-medium ${
          size === 'sm' ? 'px-3 py-1.5' : 
          size === 'md' ? 'px-4 py-2.5' : 
          'px-5 py-3'
        }`}
        style={{ backgroundColor: cfg.bg, borderColor: cfg.border, color: cfg.color }}
      >
        <motion.div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: cfg.dot }}
          animate={cfg.animate ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <div>
          <div className={`font-black leading-tight ${
            size === 'sm' ? 'text-xs' : 
            size === 'md' ? 'text-sm' : 
            'text-base'
          }`}>
            {statusResult.label}
          </div>
          <div className={`opacity-75 ${
            size === 'sm' ? 'text-[10px]' : 
            size === 'md' ? 'text-xs' : 
            'text-sm'
          }`}>
            {statusResult.sub}
          </div>
        </div>
      </motion.div>

      {/* Détails des horaires (optionnel) */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border-2 p-4 space-y-3"
          style={{ borderColor: `${cfg.color}30` }}
        >
          {/* Haute saison */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                <span className="text-xs font-bold text-gray-700">Haute saison</span>
              </div>
              <span className="text-sm font-black" style={{ color: '#22c55e' }}>
                {horaires.hauteSaison.ouverture}h - {horaires.hauteSaison.fermeture}h
              </span>
            </div>
            <div className="text-[10px] text-gray-400 mt-1">
              {MONTHS_FR[horaires.hauteSaison.moisDebut]} – {MONTHS_FR[horaires.hauteSaison.moisFin]}
            </div>
          </div>

          {/* Basse saison */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-xs font-bold text-gray-700">Basse saison</span>
              </div>
              <span className="text-sm font-black text-gray-700">
                {horaires.basseSaison.ouverture}h - {horaires.basseSaison.fermeture}h
              </span>
            </div>
            <div className="text-[10px] text-gray-400 mt-1">
              {MONTHS_FR[(horaires.hauteSaison.moisFin + 1) % 12]} – {MONTHS_FR[(horaires.hauteSaison.moisDebut + 11) % 12]}
            </div>
          </div>

          {/* Jours de fermeture */}
          {horaires.joursFermes.length > 0 && (
            <div className="flex items-start gap-2 pt-2 border-t border-gray-100">
              <AlertCircle className="size-4 flex-shrink-0 mt-0.5" style={{ color: '#eb700f' }} />
              <div className="text-xs text-gray-600">
                <span className="font-bold">Fermé le{horaires.joursFermes.length > 1 ? 's' : ''}:</span>{' '}
                {horaires.joursFermes.map(translateDay).join(', ')}
                {horaires.joursFermes.includes('monday') && horaires.joursFermes.length === 1 && ' (hors vacances scolaires)'}
              </div>
            </div>
          )}

          {/* Message spécial */}
          {horaires.message && (
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-blue-700 text-xs text-center">{horaires.message}</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Version compacte pour la sidebar / header ──────────────────────────────

export function ParkStatusDot({ parkSlug }: { parkSlug: string }) {
  const { status: statusResult } = useHorairesData(parkSlug);
  const cfg = STATUS_CONFIG[statusResult.status];

  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: cfg.dot }}
        animate={cfg.animate ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="text-xs font-bold" style={{ color: cfg.color }}>
        {statusResult.label}
      </span>
    </div>
  );
}

// ─── Version pour le header (statut + horaires du jour) ─────────────────────

export function ParkHeaderStatus({ parkSlug }: { parkSlug: string }) {
  const { horaires, status: statusResult } = useHorairesData(parkSlug);
  const cfg = STATUS_CONFIG[statusResult.status];

  const isHighSeason = (month: number) => 
    month >= horaires.hauteSaison.moisDebut && month <= horaires.hauteSaison.moisFin;

  const currentMonth = new Date().getMonth();
  const currentOpenHour = isHighSeason(currentMonth) 
    ? horaires.hauteSaison.ouverture 
    : horaires.basseSaison.ouverture;
  const currentCloseHour = isHighSeason(currentMonth) 
    ? horaires.hauteSaison.fermeture 
    : horaires.basseSaison.fermeture;

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: cfg.dot }}
          animate={cfg.animate ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="font-bold" style={{ color: cfg.color }}>
          {statusResult.label}
        </span>
      </div>
      <div className="flex items-center gap-1 text-gray-500">
        <Clock className="size-3.5" />
        <span className="text-xs">{currentOpenHour}h - {currentCloseHour}h</span>
      </div>
    </div>
  );
}
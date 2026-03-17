// hooks/useActivitiesData.ts
import { useState, useEffect } from 'react';
import { Activity } from '../types';
import { API_URL, API_KEY } from '../config/config';

export type { Activity };

// ─── Types tarifs (identiques à ceux utilisés dans ActivitiesSection) ──────────
export interface TarifLigne {
  label: string;
  prix: string;
}

export interface TarifGroupe {
  titre: string;
  lignes: TarifLigne[];
}

// On étend Activity avec le champ tarifs optionnel
export interface ActivityWithTarifs extends Activity {
  tarifs?: TarifGroupe[];
}

// ─── Données par défaut (avec tarifs) ───────────────────────────────────────────
const defaultActivities: ActivityWithTarifs[] = [
  {
    id: 'accrobranche',
    name: 'Accrobranche',
    slug: 'accrobranche',
    description:
      "Évoluez d'arbre en arbre sur nos parcours sécurisés. Tyroliennes, ponts de singe, lianes... Une aventure au cœur de la canopée !",
    icon: 'TreePine',
    image:
      'https://www.aventureland.fr/media/images/activities/w-1280-parcours-accrobranche-1687269691.JPG',
    gallery: [
      'https://www.aventureland.fr/media/images/activities/w-1280-parcours-accrobranche-1687269691.JPG',
    ],
    difficulty: 'Intermédiaire',
    intensity: 'medium',
    minAge: 6,
    duration: '2-3 heures',
    price: 28,
    participants: '1-20',
    emoji: '🌳',
    restrictions: [
      'Poids minimum : 20kg',
      'Poids maximum : 120kg',
      'Port de chaussures fermées obligatoire',
    ],
    tarifs: [
      {
        titre: 'Tarifs internet — Matin',
        lignes: [
          { label: 'Pitchoun (- 1m20)',     prix: '10,00 €' },
          { label: 'Enfant (1m20 à 1m40)',  prix: '14,00 €' },
          { label: 'Ado (+1m40, - 18 ans)', prix: '18,00 €' },
          { label: 'Adulte',                prix: '22,00 €' },
        ],
      },
      {
        titre: 'Tarifs internet — Après-midi',
        lignes: [
          { label: 'Pitchoun (- 1m20)',     prix: '12,00 €' },
          { label: 'Enfant (1m20 à 1m40)',  prix: '16,00 €' },
          { label: 'Ado (+1m40, - 18 ans)', prix: '20,00 €' },
          { label: 'Adulte',                prix: '25,00 €' },
        ],
      },
    ],
  },
  {
    id: 'paintball',
    name: 'Paintball',
    slug: 'paintball',
    description: 'Affrontez-vous en équipe dans des scénarios variés.',
    icon: 'Target',
    image: '',
    difficulty: 'Intermédiaire',
    intensity: 'hard',
    minAge: 12,
    duration: '2h',
    price: 25,
    participants: '6-30',
    emoji: '🎯',
    restrictions: [],
    tarifs: [
      {
        titre: 'Tarifs internet',
        lignes: [
          { label: 'Pack 100 billes',   prix: '15,00 €' },
          { label: 'Pack 200 billes',   prix: '25,00 €' },
          { label: 'Pack 300 billes',   prix: '32,00 €' },
          { label: 'Équipement inclus', prix: 'Offert'  },
        ],
      },
    ],
  },
  {
    id: 'tyrolienne',
    name: 'Tyrolienne',
    slug: 'tyrolienne',
    description: 'Sensations fortes garanties sur nos tyroliennes géantes.',
    icon: 'Zap',
    image: '',
    difficulty: 'Difficile',
    intensity: 'hard',
    minAge: 8,
    duration: '30min',
    price: 16,
    participants: '1-10',
    emoji: '⚡',
    restrictions: [],
    tarifs: [
      {
        titre: 'Tarifs internet',
        lignes: [
          { label: 'Enfant (- 12 ans)', prix: '12,00 €' },
          { label: 'Ado / Adulte',      prix: '16,00 €' },
        ],
      },
    ],
  },
  {
    id: 'tir-arc',
    name: "Tir à l'arc",
    slug: 'tir-arc',
    description: "Initiez-vous au tir à l'arc avec nos moniteurs.",
    icon: 'Target',
    image: '',
    difficulty: 'Facile',
    intensity: 'easy',
    minAge: 6,
    duration: '1h',
    price: 14,
    participants: '1-15',
    emoji: '🏹',
    restrictions: [],
    tarifs: [
      {
        titre: 'Tarifs internet',
        lignes: [
          { label: 'Enfant (- 12 ans)', prix: '10,00 €' },
          { label: 'Ado / Adulte',      prix: '14,00 €' },
          { label: 'Initiation 30 min', prix: '8,00 €'  },
        ],
      },
    ],
  },
  {
    id: 'escape-game',
    name: 'Escape Game Outdoor',
    slug: 'escape-game',
    description: 'Résolvez les énigmes en pleine nature.',
    icon: 'Lock',
    image: '',
    difficulty: 'Intermédiaire',
    intensity: 'medium',
    minAge: 10,
    duration: '1h',
    price: 16,
    participants: '2-6',
    emoji: '🔐',
    restrictions: [],
    tarifs: [
      {
        titre: 'Tarifs internet',
        lignes: [
          { label: '2 personnes',   prix: '20,00 €/pers' },
          { label: '3-4 personnes', prix: '16,00 €/pers' },
          { label: '5-6 personnes', prix: '14,00 €/pers' },
        ],
      },
    ],
  },
  {
    id: 'parcours-filet',
    name: 'Parcours Filet',
    slug: 'parcours-filet',
    description: 'Parcours suspendu sur filets pour les petits et grands.',
    icon: 'Grid',
    image: '',
    difficulty: 'Facile',
    intensity: 'easy',
    minAge: 3,
    duration: '1h',
    price: 12,
    participants: '1-20',
    emoji: '🕸️',
    restrictions: [],
    tarifs: [
      {
        titre: 'Tarifs internet',
        lignes: [
          { label: 'Enfant (3-12 ans)', prix: '8,00 €'  },
          { label: 'Ado / Adulte',      prix: '12,00 €' },
        ],
      },
    ],
  },
];

// ─── Hook ────────────────────────────────────────────────────────────────────────
export function useActivitiesData() {
  const [activities, setActivities] = useState<ActivityWithTarifs[]>(defaultActivities);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/activities`, {
          method:  'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-NoLimit-Key': API_KEY || 'EMPTY_KEY',
          },
        });

        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const formatted: ActivityWithTarifs[] = data.map((item: any, index: number) => {
            // Fallback local pour compléter les champs manquants côté API
            const fallback =
              defaultActivities.find(a => a.slug === item.slug || a.id === item.slug) ||
              defaultActivities[index];

            return {
              id:           item.slug    || item.id        || fallback?.id           || `activity-${index}`,
              slug:         item.slug                      || fallback?.slug         || '',
              name:         item.name                      || fallback?.name         || '',
              description:  item.description               || fallback?.description  || '',
              icon:         item.icon                      || fallback?.icon         || 'Star',
              image:        item.image                     || fallback?.image        || '',
              gallery:      item.gallery                   || fallback?.gallery,
              difficulty:   item.difficulty                || fallback?.difficulty   || 'Intermédiaire',
              intensity:    item.intensity                 || fallback?.intensity    || 'medium',
              minAge:       item.minAge  || item.min_age   || fallback?.minAge       || 8,
              duration:     item.duration                  || fallback?.duration     || '2h',
              price:        item.price                     || fallback?.price        || 25,
              participants: item.participants               || fallback?.participants || 'Groupe',
              emoji:        item.emoji                     || fallback?.emoji        || '🎯',
              restrictions: item.restrictions              || fallback?.restrictions || [],

              // ─── Tarifs : on prend TOUJOURS la valeur API en priorité.
              // Si l'API renvoie un tableau vide ou absent, on garde le fallback local
              // pour ne jamais afficher une carte sans tarifs.
              tarifs: (Array.isArray(item.tarifs) && item.tarifs.length > 0)
                ? item.tarifs
                : (fallback?.tarifs ?? []),
            };
          });

          setActivities(formatted);
          setError(null);
        } else {
          // API vide → garder les défauts (qui incluent déjà les tarifs)
          setActivities(defaultActivities);
        }
      } catch (err) {
        console.warn('⚠️ Activités WordPress indisponibles, utilisation des valeurs par défaut:', err);
        setActivities(defaultActivities);
        setError('Activités chargées depuis le cache local');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityById = (idOrSlug: string): ActivityWithTarifs | undefined =>
    activities.find(a => a.id === idOrSlug || a.slug === idOrSlug);

  return { activities, loading, error, getActivityById, defaultActivities };
}

export { defaultActivities };
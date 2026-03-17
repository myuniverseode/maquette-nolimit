import { Activity } from '../types';

export const activities: Activity[] = [
  {
    id: 'accrobranche',
    name: 'Accrobranche',
    description: 'Évoluez d\'arbre en arbre sur nos parcours sécurisés. Tyroliennes, ponts de singe, lianes... Une aventure au cœur de la canopée !',
    icon: 'TreePine',
    image: 'https://www.aventureland.fr/media/images/activities/w-1280-parcours-accrobranche-1687269691.JPG',
    gallery: [
      'https://www.aventureland.fr/media/images/activities/w-1280-parcours-accrobranche-1687269691.JPG',
      'https://ofunpark.fr/wp-content/uploads/2023/01/accrobranche-vendee-2.webp',
      'https://ofunpark.fr/wp-content/uploads/2023/01/accrobranche-vendee-2.webp',
      'https://ofunpark.fr/wp-content/uploads/2023/01/accrobranche-vendee-2.webp'
    ],
    difficulty: 'Intermédiaire',
    minAge: 6,
    duration: '2-3 heures',
    price: 28,
    restrictions: [
      'Poids minimum : 20kg',
      'Poids maximum : 120kg',
      'Port de chaussures fermées obligatoire',
      'Non recommandé aux femmes enceintes'
    ]
  },
  {
    id: 'paintball',
    name: 'Paintball',
    description: 'Affrontez vos amis sur nos terrains de jeu variés. Stratégie, adrénaline et teamwork garantis !',
    icon: 'Target',
    image: 'https://images.unsplash.com/photo-1759872138838-45bd5c07ddc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGJhbGwlMjBvdXRkb29yJTIwc3BvcnR8ZW58MXx8fHwxNzY1Mzc1MTk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    gallery: [
      'https://images.unsplash.com/photo-1759872138838-45bd5c07ddc6?w=1200',
      'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=1200',
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1200',
      'https://images.unsplash.com/photo-1626201353090-8e96186d2b4a?w=1200'
    ],
    difficulty: 'Débutant',
    minAge: 12,
    duration: '2 heures',
    price: 35,
    restrictions: [
      'Âge minimum : 12 ans',
      'Autorisation parentale pour les mineurs',
      'Lunettes de protection obligatoires',
      'Non recommandé en cas de problèmes cardiaques'
    ]
  },
  {
    id: 'escape-game',
    name: 'Escape Game',
    description: 'Résolvez les énigmes et trouvez la sortie avant la fin du temps imparti. Indoor ou outdoor, choisissez votre aventure !',
    icon: 'KeyRound',
    image: 'https://images.unsplash.com/photo-1761207850889-75d5765d33c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc2NhcGUlMjByb29tJTIwYWR2ZW50dXJlfGVufDF8fHx8MTc2NTMzMjc4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    gallery: [
      'https://images.unsplash.com/photo-1761207850889-75d5765d33c0?w=1200',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
      'https://images.unsplash.com/photo-1604076947099-998e58c5e1aa?w=1200',
      'https://images.unsplash.com/photo-1596008194705-2091cd6764d4?w=1200'
    ],
    difficulty: 'Intermédiaire',
    minAge: 10,
    duration: '60-90 minutes',
    price: 25,
    restrictions: [
      'Âge minimum : 10 ans (accompagné)',
      'Groupe de 2 à 6 personnes',
      'Déconseillé aux claustrophobes (indoor)',
      'Nécessite de savoir lire'
    ]
  },
  {
    id: 'tir-arc',
    name: 'Tir à l\'Arc',
    description: 'Initiez-vous au tir à l\'arc ou perfectionnez votre technique sur nos parcours 3D en forêt.',
    icon: 'Crosshair',
    image: 'https://images.unsplash.com/photo-1764526481731-0258f3ec9a53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoZXJ5JTIwdGFyZ2V0JTIwb3V0ZG9vcnxlbnwxfHx8fDE3NjUzNzUyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    gallery: [
      'https://images.unsplash.com/photo-1764526481731-0258f3ec9a53?w=1200',
      'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=1200',
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1200',
      'https://images.unsplash.com/photo-1617146672803-8a2b9e1f2e69?w=1200'
    ],
    difficulty: 'Débutant',
    minAge: 8,
    duration: '1-2 heures',
    price: 20,
    restrictions: [
      'Âge minimum : 8 ans',
      'Encadrement obligatoire pour les débutants',
      'Force physique minimale requise',
      'Lunettes de protection fournies'
    ]
  },
  {
    id: 'parcours-filet',
    name: 'Parcours Filet',
    description: 'Amusez-vous en toute sécurité sur nos structures de filets suspendus. Idéal pour les familles !',
    icon: 'Network',
    image: 'https://images.unsplash.com/photo-1653154138513-ed13199917e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBhZHZlbnR1cmUlMjBwYXJrfGVufDF8fHx8MTc2NTM3NTIwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    gallery: [
      'https://images.unsplash.com/photo-1653154138513-ed13199917e2?w=1200',
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200',
      'https://images.unsplash.com/photo-1630804261876-7e18e3a9c7aa?w=1200',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200'
    ],
    difficulty: 'Débutant',
    minAge: 3,
    duration: '1 heure',
    price: 15,
    restrictions: [
      'Accessible dès 3 ans',
      'Surveillance parentale obligatoire pour les moins de 8 ans',
      'Chaussettes obligatoires',
      'Poids maximum : 100kg'
    ]
  },
  {
    id: 'archery-tag',
    name: 'Archery Tag',
    description: 'Le mélange parfait entre tir à l\'arc et paintball ! Affrontez-vous avec des flèches à embout mousse.',
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1764526481731-0258f3ec9a53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoZXJ5JTIwdGFyZ2V0JTIwb3V0ZG9vcnxlbnwxfHx8fDE3NjUzNzUyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    gallery: [
      'https://images.unsplash.com/photo-1764526481731-0258f3ec9a53?w=1200',
      'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=1200',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200',
      'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1200'
    ],
    difficulty: 'Intermédiaire',
    minAge: 10,
    duration: '1h30',
    price: 30,
    restrictions: [
      'Âge minimum : 10 ans',
      'Masque de protection obligatoire',
      'Minimum 8 joueurs',
      'Tenue sportive recommandée'
    ]
  }
];
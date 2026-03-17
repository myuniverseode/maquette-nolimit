import { Review } from '../types';

export const reviews: Review[] = [
  {
    id: '1',
    author: 'Sophie M.',
    rating: 5,
    date: '15 novembre 2024',
    comment: 'Journée exceptionnelle en famille ! Les parcours accrobranche sont très bien entretenus et sécurisés. Les enfants ont adoré et nous aussi !',
    parkId: 'parc-nord',
  },
  {
    id: '2',
    author: 'Thomas L.',
    rating: 5,
    date: '3 novembre 2024',
    comment: 'Super expérience pour mon EVG ! Le paintball était top, terrain immense et équipement de qualité. Je recommande vivement !',
    parkId: 'parc-est',
  },
  {
    id: '3',
    author: 'Marie D.',
    rating: 4,
    date: '28 octobre 2024',
    comment: 'L\'escape game outdoor était vraiment immersif. Les décors sont magnifiques et les énigmes bien pensées. Seul bémol : un peu d\'attente à l\'accueil.',
    parkId: 'parc-ouest'
  },
  {
    id: '4',
    author: 'Lucas B.',
    rating: 5,
    date: '20 octobre 2024',
    comment: 'Parcours extrême incroyable ! Pour les amateurs de sensations fortes, c\'est parfait. L\'équipe est très professionnelle et rassurante.',
    parkId: 'parc-nord'
  },
  {
    id: '5',
    author: 'Camille R.',
    rating: 5,
    date: '12 octobre 2024',
    comment: 'Parfait pour un anniversaire d\'enfant ! Le parcours filet et l\'accrobranche kids sont géniaux. Personnel au top avec les petits.',
    parkId: 'parc-centre'
  },
  {
    id: '6',
    author: 'Alexandre P.',
    rating: 4,
    date: '5 octobre 2024',
    comment: 'Très bonne journée entre amis. Le tir à l\'arc était une belle découverte, et l\'archery tag vraiment fun ! On reviendra.',
    parkId: 'parc-sud'
  }
];

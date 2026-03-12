// pages/ParkLayout.tsx - VERSION ONE PAGE (plus de sous-routes)
// Remplace l'ancien ParkLayout qui utilisait <Outlet /> pour les sous-pages.
// Maintenant toutes les sections (Accueil, Activités, Tarifs, Infos, Contact)
// sont sur une seule page avec un menu d'ancrage.

import { ParkOnePage } from './ParkOnePage';

export function ParkLayout() {
  return <ParkOnePage />;
}
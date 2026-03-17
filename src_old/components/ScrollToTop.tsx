// components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll instantané en haut de page à chaque changement de route
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
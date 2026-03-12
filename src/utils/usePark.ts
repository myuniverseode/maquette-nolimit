import { useParams, useNavigate } from 'react-router-dom';
import { parks } from '../data/parks';

export function usePark() {
  const { parkId } = useParams<{ parkId: string }>();
  const navigate = useNavigate();

  const park = parks.find(p => p.id === parkId);

  // Sécurité : si le parc n'existe pas
  if (!park) {
    navigate('/');
    return null;
  }

  return park;
}

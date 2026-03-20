// utils/usePark.ts - Hook pour récupérer un parc dynamiquement depuis l'API
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Park } from '../types';
import { API_URL, API_KEY, cleanWpData } from '../config/config';
import { defaultParks } from '../hooks/useParksData';

export function usePark() {
  const { parkId } = useParams<{ parkId: string }>();
  const [park, setPark] = useState<Park | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parkId) { setLoading(false); return; }

    const fetchPark = async () => {
      try {
        const response = await fetch(`${API_URL}/parks/${parkId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(API_KEY ? { 'X-NoLimit-Key': API_KEY } : {}),
          },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = cleanWpData(await response.json());

        // Fallback local pour compléter les champs manquants
        const fallback = defaultParks.find(p => p.id === parkId);

        const mapped: Park = {
          id: data.id || parkId,
          name: data.name || fallback?.name || '',
          location: data.location || fallback?.location || '',
          coordinates: data.coordinates || fallback?.coordinates || { lat: 0, lng: 0 },
          description: data.description || fallback?.description || '',
          image: (data.image && data.image !== false) ? data.image : (fallback?.image || ''),
          gallery: data.gallery?.length ? data.gallery : (fallback?.gallery || []),
          activities: data.activities || fallback?.activities || [],
          difficulty: data.difficulty || fallback?.difficulty || ['Débutant'],
          minAge: data.minAge ?? data.min_age ?? fallback?.minAge ?? 3,
          rating: data.rating ?? fallback?.rating ?? 4.5,
          reviewCount: data.reviewCount ?? data.review_count ?? fallback?.reviewCount ?? 0,
          minPrice: data.minPrice ?? data.min_price ?? fallback?.minPrice ?? 20,
          capacity: data.capacity ?? fallback?.capacity ?? 100,
          departement: data.departement || fallback?.departement || '',
          highlights: (data.highlights || data.features || []).length > 0
            ? (data.highlights || data.features) : (fallback?.highlights || []),
          emoji: data.emoji || fallback?.emoji,
          features: data.features || fallback?.features,
          openingHours: data.openingHours || fallback?.openingHours,
          contact: data.contact || fallback?.contact,
          address: data.address || fallback?.address,
          googlePlaceId: data.googlePlaceId || data.google_place_id,
          tripadvisorUrl: data.tripadvisorUrl || data.tripadvisor_url,
          onSiteServices: data.onSiteServices || data.on_site_services,
          accessibilityItems: data.accessibilityItems || data.accessibility_items,
          transportOptions: data.transportOptions || data.transport_options,
          pricingOptions: data.pricingOptions || data.pricing_options,
          goodToKnow: data.goodToKnow || data.good_to_know,
          activityTarifs: data.activityTarifs || data.activity_tarifs || {},
        };

        setPark(mapped);
      } catch (err) {
        console.warn(`⚠️ Parc "${parkId}" indisponible via API, fallback local`, err);
        const fallback = defaultParks.find(p => p.id === parkId);
        if (fallback) setPark(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchPark();
  }, [parkId]);

  return park;
}

export { usePark as default };

import { useMemo, useEffect, useState } from 'react';
import { ParkCard } from './ParkCard';
import { Park } from '../types';

interface OrganicBubbleLayoutProps {
  parks: Park[];
  primaryColor?: string;
  secondaryColor?: string;
}

interface BubblePosition {
  x: number;
  y: number;
  size: number;
  zIndex: number;
}

const getBubbleSize = (park: Park): number => {
  if (park.rating >= 4.8 && park.activities.length >= 8) return 320;
  if (park.rating >= 4.7 || park.activities.length >= 8) return 280;
  if (park.rating >= 4.5 || park.activities.length >= 5) return 250;
  return 220;
};

const generateOrganicPositions = (
  parks: Park[],
  containerWidth: number,
  isMobile: boolean
): BubblePosition[] => {
  if (isMobile) {
    return parks.map((park, index) => ({
      x: containerWidth / 2 - getBubbleSize(park) / 2,
      y: index * (getBubbleSize(park) + 30),
      size: getBubbleSize(park),
      zIndex: parks.length - index
    }));
  }

  const positions: BubblePosition[] = [];
  const margin = 50;
  const maxAttempts = 100;

  const isOverlapping = (
    pos: { x: number; y: number; size: number },
    existing: BubblePosition[]
  ): boolean => {
    return existing.some(other => {
      const dx = pos.x + pos.size / 2 - (other.x + other.size / 2);
      const dy = pos.y + pos.size / 2 - (other.y + other.size / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = (pos.size + other.size) / 2 + margin;
      return distance < minDistance;
    });
  };

  const sortedParks = [...parks].sort((a, b) => {
    const sizeA = getBubbleSize(a);
    const sizeB = getBubbleSize(b);
    return sizeB - sizeA;
  });

  sortedParks.forEach((park, index) => {
    const size = getBubbleSize(park);
    let positioned = false;
    let attempts = 0;

    while (!positioned && attempts < maxAttempts) {
      let x: number, y: number;

      if (index === 0) {
        x = containerWidth / 2 - size / 2;
        y = 100;
      } else {
        const clusters = [
          { centerX: containerWidth * 0.25, centerY: 200, radius: 300 },
          { centerX: containerWidth * 0.5, centerY: 400, radius: 350 },
          { centerX: containerWidth * 0.75, centerY: 250, radius: 300 },
          { centerX: containerWidth * 0.35, centerY: 600, radius: 280 },
          { centerX: containerWidth * 0.65, centerY: 550, radius: 280 }
        ];

        const cluster = clusters[index % clusters.length];
        const angle = (index * 2.4 + Math.random() * 0.8) % (Math.PI * 2);
        const distance = cluster.radius * (0.3 + Math.random() * 0.7);

        x = cluster.centerX + Math.cos(angle) * distance - size / 2;
        y = cluster.centerY + Math.sin(angle) * distance - size / 2;

        x = Math.max(margin, Math.min(containerWidth - size - margin, x));
        y = Math.max(margin, y);
      }

      if (!isOverlapping({ x, y, size }, positions)) {
        positions.push({
          x,
          y,
          size,
          zIndex: sortedParks.length - index + Math.floor(Math.random() * 3)
        });
        positioned = true;
      }

      attempts++;
    }

    if (!positioned) {
      const fallbackY = positions.length > 0
        ? Math.max(...positions.map(p => p.y + p.size)) + margin
        : 100;
      positions.push({
        x: (containerWidth / 2) - size / 2,
        y: fallbackY,
        size,
        zIndex: sortedParks.length - index
      });
    }
  });

  const parkIndexMap = new Map(sortedParks.map((park, idx) => [park.id, idx]));
  return parks.map(park => {
    const sortedIndex = parkIndexMap.get(park.id)!;
    return positions[sortedIndex];
  });
};

export function OrganicBubbleLayout({
  parks,
  primaryColor,
  secondaryColor
}: OrganicBubbleLayoutProps) {
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      setContainerWidth(Math.max(width - 48, 320));
      setIsMobile(width < 768);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const positions = useMemo(
    () => generateOrganicPositions(parks, containerWidth, isMobile),
    [parks, containerWidth, isMobile]
  );

  const containerHeight = useMemo(() => {
    if (positions.length === 0) return 600;
    const maxY = Math.max(...positions.map(p => p.y + p.size));
    return maxY + 150;
  }, [positions]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: `${containerHeight}px`,
        background: 'linear-gradient(180deg, transparent 0%, rgba(53, 118, 0, 0.03) 100%)'
      }}
    >
      {/* Effet de décoration : lignes de connexion subtiles */}
      <svg
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{ width: '100%', height: '100%' }}
      >
        {positions.slice(0, 10).map((pos, i) => {
          const nextPos = positions[(i + 1) % Math.min(positions.length, 10)];
          return (
            <line
              key={`line-${i}`}
              x1={pos.x + pos.size / 2}
              y1={pos.y + pos.size / 2}
              x2={nextPos.x + nextPos.size / 2}
              y2={nextPos.y + nextPos.size / 2}
              stroke={primaryColor || '#357600'}
              strokeWidth="2"
              strokeDasharray="10,10"
            />
          );
        })}
      </svg>

      {/* Bulles positionnées organiquement */}
      {parks.map((park, index) => {
        const position = positions[index];
        if (!position) return null;

        return (
          <div
            key={park.id}
            style={{
              position: 'absolute',
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: position.zIndex
            }}
          >
            <ParkCard
              park={park}
              index={index}
              compact={true}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          </div>
        );
      })}
    </div>
  );
}

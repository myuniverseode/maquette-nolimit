// components/home/HeroCarousel.tsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroData } from '../../hooks/useHeroData';

interface HeroImage {
  url: string;
  title: string;
  subtitle: string;
}

interface HeroCarouselProps {
  images?: HeroImage[];
  autoPlayInterval?: number;
}

export function HeroCarousel({
  images: customImages,
  autoPlayInterval = 5000
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: heroData } = useHeroData();

  const slidesFromHook: HeroImage[] =
    heroData?.slides?.map(slide => ({
      url: slide.url,
      title: slide.title,
      subtitle: slide.subtitle
    })) || [];

  const images =
    customImages && customImages.length > 0
      ? customImages
      : slidesFromHook;

  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval]);

  const goToSlide = (index: number) => setCurrentIndex(index);
  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const goToNext = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);

  if (!images.length) return null;

  return (
    <div className="absolute inset-0 bg-brandOrange">
      {/* Images */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Filtre atténué : opacités plus faibles */}
            <div className="absolute inset-0" />
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        aria-label="Image précédente"
      >
        <ChevronLeft className="size-6 text-white" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        aria-label="Image suivante"
      >
        <ChevronRight className="size-6 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80 w-2'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>

      {/* Vague avec continuité couleur */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg
          viewBox="0 0 1440 160"
          className="w-full h-24 md:h-32"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C200,40 400,140 650,90 C900,40 1150,140 1440,80 L1440,160 L0,160 Z"
            className="fill-white"
          />
        </svg>
      </div>
    </div>
  );
}
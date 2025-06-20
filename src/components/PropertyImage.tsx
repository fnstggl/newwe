
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImageProps {
  images: any;
  address: string;
  className?: string;
}

const PropertyImage: React.FC<PropertyImageProps> = ({ images, address, className }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Process images to handle different formats
  const processedImages = React.useMemo(() => {
    if (!images) return [];

    if (Array.isArray(images) && images.length > 0) {
      return images.map((img: any) => {
        if (typeof img === 'string') return img;
        if (typeof img === 'object' && img !== null) {
          return img.url || img.image_url || '/placeholder.svg';
        }
        return '/placeholder.svg';
      });
    }

    if (typeof images === 'string') {
      return [images];
    }

    return [];
  }, [images]);

  const hasMultipleImages = processedImages.length > 1;

  // Create thumbnail version of image URL (simplified approach)
  const getThumbnailUrl = useCallback((url: string) => {
    if (url === '/placeholder.svg') return url;
    // For most image services, you can add size parameters
    // This is a simplified approach - in production you'd want proper thumbnail generation
    return url.includes('?') ? `${url}&w=400&h=300` : `${url}?w=400&h=300`;
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Preload the first few images
          preloadImages([0, 1, 2]);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Preload images function
  const preloadImages = useCallback((indices: number[]) => {
    indices.forEach((index) => {
      if (index < processedImages.length && !loadedImages.has(index)) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, index]));
        };
        img.src = getThumbnailUrl(processedImages[index]);
      }
    });
  }, [processedImages, loadedImages, getThumbnailUrl]);

  // Navigation functions
  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      const nextIndex = (currentImageIndex + 1) % processedImages.length;
      setCurrentImageIndex(nextIndex);
      // Preload next image
      preloadImages([nextIndex, (nextIndex + 1) % processedImages.length]);
    }
  }, [currentImageIndex, processedImages.length, hasMultipleImages, preloadImages]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      const prevIndex = (currentImageIndex - 1 + processedImages.length) % processedImages.length;
      setCurrentImageIndex(prevIndex);
      // Preload previous image
      preloadImages([prevIndex, (prevIndex - 1 + processedImages.length) % processedImages.length]);
    }
  }, [currentImageIndex, processedImages.length, hasMultipleImages, preloadImages]);

  const currentImageUrl = processedImages[currentImageIndex] || '/placeholder.svg';

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden group ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isVisible ? (
        <>
          <img
            src={getThumbnailUrl(currentImageUrl)}
            alt={address}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
            loading="lazy"
          />
          
          {/* Navigation arrows - only show on hover and if multiple images */}
          {hasMultipleImages && isHovered && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              {/* Image counter */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {currentImageIndex + 1} / {processedImages.length}
              </div>
            </>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </>
      ) : (
        // Placeholder while not visible
        <div className="w-full h-full bg-gray-800 animate-pulse" />
      )}
    </div>
  );
};

export default PropertyImage;

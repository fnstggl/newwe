
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImageProps {
  images: any;
  address: string;
  className?: string;
}

const PropertyImage: React.FC<PropertyImageProps> = ({ images, address, className }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isHovered, setIsHovered] = useState(false);

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

  // Create thumbnail version of image URL (optimized for grid)
  const getThumbnailUrl = useCallback((url: string) => {
    if (url === '/placeholder.svg') return url;
    return url.includes('?') ? `${url}&w=400&h=300` : `${url}?w=400&h=300`;
  }, []);

  // Preload all images immediately for fast switching
  useEffect(() => {
    processedImages.forEach((imageUrl, index) => {
      if (!loadedImages.has(index)) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, index]));
        };
        img.src = getThumbnailUrl(imageUrl);
      }
    });
  }, [processedImages, loadedImages, getThumbnailUrl]);

  // Navigation functions with event.stopPropagation()
  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages) {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % processedImages.length
      );
    }
  }, [processedImages.length, hasMultipleImages]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages) {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex - 1 + processedImages.length) % processedImages.length
      );
    }
  }, [processedImages.length, hasMultipleImages]);

  const currentImageUrl = processedImages[currentImageIndex] || '/placeholder.svg';

  return (
    <div 
      className={`relative overflow-hidden group ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={getThumbnailUrl(currentImageUrl)}
        alt={address}
        className="w-full h-full object-cover transition-opacity duration-200"
        onError={(e) => {
          e.currentTarget.src = '/placeholder.svg';
        }}
      />
      
      {/* Navigation arrows - only show on hover and if multiple images */}
      {hasMultipleImages && isHovered && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
            aria-label="Previous image"
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
            aria-label="Next image"
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          
          {/* Image counter */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            {currentImageIndex + 1} / {processedImages.length}
          </div>
        </>
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  );
};

export default PropertyImage;

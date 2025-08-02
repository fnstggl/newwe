
import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImageProps {
  images: any;
  address: string;
  className?: string;
  preloadImages?: string[]; // Add prop to preload additional images
}

const PropertyImage: React.FC<PropertyImageProps> = ({ images, address, className, preloadImages = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Process images - use original URLs directly
  const processedImages = React.useMemo(() => {
    if (!images) return [];

    const processImageUrl = (url: string) => {
      if (typeof url !== 'string') return '';
      // Return the original URL without any proxy processing
      return url;
    };

    if (Array.isArray(images) && images.length > 0) {
      return images.map((img: any) => {
        if (typeof img === 'string') return processImageUrl(img);
        if (typeof img === 'object' && img !== null) {
          return processImageUrl(img.url || img.image_url || '');
        }
        return '';
      }).filter(Boolean); // Remove empty strings
    }

    if (typeof images === 'string') {
      return [processImageUrl(images)].filter(Boolean);
    }

    return [];
  }, [images]);

  const hasMultipleImages = processedImages.length > 1;

  // Preload images for better performance
  useEffect(() => {
    const imagesToPreload = [...processedImages, ...preloadImages].filter(Boolean);
    
    imagesToPreload.forEach((imageUrl) => {
      if (imageUrl) {
        const img = new Image();
        img.src = imageUrl;
      }
    });
  }, [processedImages, preloadImages]);

  // Navigation functions
  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages) {
      const nextIndex = (currentImageIndex + 1) % processedImages.length;
      setCurrentImageIndex(nextIndex);
    }
  }, [processedImages.length, hasMultipleImages, currentImageIndex]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages) {
      const prevIndex = (currentImageIndex - 1 + processedImages.length) % processedImages.length;
      setCurrentImageIndex(prevIndex);
    }
  }, [processedImages.length, hasMultipleImages, currentImageIndex]);

  const currentImageUrl = processedImages[currentImageIndex] || '';

  return (
    <div 
      className={`relative overflow-hidden group ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image display */}
      {currentImageUrl ? (
        <img
          src={currentImageUrl}
          alt={address}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full bg-gray-700" />
      )}
      
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

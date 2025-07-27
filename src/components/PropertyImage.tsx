
import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImageProps {
  images: any;
  address: string;
  className?: string;
  lowResolution?: boolean; // New prop for low-res images
}

const PropertyImage: React.FC<PropertyImageProps> = ({ images, address, className, lowResolution = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [preloadedThumbnails, setPreloadedThumbnails] = useState<string[]>([]);

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

  // Create thumbnail URL (smaller, optimized version)
  const getThumbnailUrl = useCallback((url: string) => {
    if (url === '/placeholder.svg') return url;
    
    // Use much lower resolution for blurred listings
    if (lowResolution) {
      return url.includes('?') ? `${url}&w=200&h=130&q=40` : `${url}?w=200&h=130&q=40`;
    }
    
    // Regular thumbnail parameters for normal listings
    return url.includes('?') ? `${url}&w=300&h=200&q=80` : `${url}?w=300&h=200&q=80`;
  }, [lowResolution]);

  // Preload thumbnail versions of all images for instant switching
  useEffect(() => {
    if (hasMultipleImages) {
      const thumbnailPromises = processedImages.map((imageUrl) => {
        return new Promise<string>((resolve) => {
          const img = new Image();
          const thumbnailUrl = getThumbnailUrl(imageUrl);
          img.onload = () => resolve(thumbnailUrl);
          img.onerror = () => resolve('/placeholder.svg');
          img.src = thumbnailUrl;
        });
      });

      Promise.all(thumbnailPromises).then(setPreloadedThumbnails);
    }
  }, [processedImages, hasMultipleImages, getThumbnailUrl]);

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

  // Use full resolution for first image, thumbnails for others when navigating
  const getCurrentImageUrl = () => {
    if (lowResolution) {
      // Always use low resolution for blurred listings
      return getThumbnailUrl(processedImages[currentImageIndex] || '/placeholder.svg');
    }
    
    if (currentImageIndex === 0) {
      return processedImages[0] || '/placeholder.svg';
    }
    
    // Use preloaded thumbnail if available, otherwise fallback to full image
    return preloadedThumbnails[currentImageIndex] || processedImages[currentImageIndex] || '/placeholder.svg';
  };

  return (
    <div 
      className={`relative overflow-hidden group ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={getCurrentImageUrl()}
        alt={address}
        className="w-full h-full object-cover transition-opacity duration-150"
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

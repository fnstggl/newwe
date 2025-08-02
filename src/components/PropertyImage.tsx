
import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImageProps {
  images: any;
  address: string;
  className?: string;
  preloadImages?: string[]; // Add prop to preload additional images
}

// Global cache for image URLs to prevent duplicate requests
const imageCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string>>();

const PropertyImage: React.FC<PropertyImageProps> = ({ images, address, className, preloadImages = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [currentLoadedImage, setCurrentLoadedImage] = useState<string>('');

  // Process images with deduplication and lazy loading
  const processedImages = React.useMemo(() => {
    if (!images) return [];

    const processImageUrl = (url: string) => {
      if (typeof url !== 'string') return '';
      
      // Check if it's a Zillow image URL
      if (url.startsWith('https://photos.zillowstatic.com/')) {
        // Create a cache key
        const cacheKey = `${url}_250_25`;
        
        // Return cached URL if available
        if (imageCache.has(cacheKey)) {
          return imageCache.get(cacheKey)!;
        }
        
        // Create optimized URL
        const optimizedUrl = `https://rskcssgjpbshagjocdre.supabase.co/functions/v1/proxy-image?url=${encodeURIComponent(url)}&width=250&quality=25`;
        imageCache.set(cacheKey, optimizedUrl);
        return optimizedUrl;
      }
      
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

  // Preload current image and set it when loaded
  useEffect(() => {
    const currentImageUrl = processedImages[currentImageIndex];
    if (currentImageUrl) {
      const img = new Image();
      img.onload = () => {
        setCurrentLoadedImage(currentImageUrl);
        setLoadedImages(prev => new Set([...prev, currentImageIndex]));
      };
      img.onerror = () => {
        setImageLoadErrors(prev => new Set([...prev, currentImageIndex]));
      };
      img.src = currentImageUrl;
    }
  }, [processedImages, currentImageIndex]);

  // Preload additional images for this property and any additional preload images
  useEffect(() => {
    const imagesToPreload = [...processedImages, ...preloadImages].filter(Boolean);
    
    imagesToPreload.forEach((imageUrl, index) => {
      if (imageUrl) {
        const img = new Image();
        img.onload = () => {
          if (index < processedImages.length) {
            setLoadedImages(prev => new Set([...prev, index]));
          }
        };
        img.src = imageUrl;
      }
    });
  }, [processedImages, preloadImages]);

  // Navigation functions with instant transitions (no opacity changes)
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

  return (
    <div 
      className={`relative overflow-hidden group ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Use background-image to prevent placeholder flashing, but only show when image is loaded */}
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: currentLoadedImage ? `url(${currentLoadedImage})` : 'none',
          backgroundColor: currentLoadedImage ? 'transparent' : '#1f2937' // subtle dark background when no image
        }}
        role="img"
        aria-label={address}
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

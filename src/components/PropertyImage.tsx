
import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImageProps {
  images: any;
  address: string;
  className?: string;
  preloadImages?: string[];
}

const PropertyImage: React.FC<PropertyImageProps> = ({ images, address, className, preloadImages = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Process images with deduplication
  const processedImages = React.useMemo(() => {
    if (!images) return [];

    const processImageUrl = (url: string) => {
      if (typeof url !== 'string') return '/placeholder.svg';
      
      // Check if it's a Zillow image URL
      if (url.startsWith('https://photos.zillowstatic.com/')) {
        // Create optimized URL
        const optimizedUrl = `https://rskcssgjpbshagjocdre.supabase.co/functions/v1/proxy-image?url=${encodeURIComponent(url)}&width=250&quality=25`;
        return optimizedUrl;
      }
      
      return url;
    };

    if (Array.isArray(images) && images.length > 0) {
      return images.map((img: any) => {
        if (typeof img === 'string') return processImageUrl(img);
        if (typeof img === 'object' && img !== null) {
          return processImageUrl(img.url || img.image_url || '/placeholder.svg');
        }
        return '/placeholder.svg';
      });
    }

    if (typeof images === 'string') {
      return [processImageUrl(images)];
    }

    return [];
  }, [images]);

  const hasMultipleImages = processedImages.length > 1;

  // Preload images in the background
  useEffect(() => {
    const imagesToPreload = [
      ...processedImages,
      ...preloadImages
    ].filter(Boolean);

    imagesToPreload.forEach((imageUrl) => {
      if (imageUrl && imageUrl !== '/placeholder.svg' && !loadedImages.has(imageUrl)) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, imageUrl]));
        };
        img.onerror = () => {
          // Try fallback to original URL if proxy fails
          if (imageUrl.includes('rskcssgjpbshagjocdre.supabase.co/functions/v1/proxy-image')) {
            try {
              const urlParams = new URLSearchParams(imageUrl.split('?')[1]);
              const originalUrl = decodeURIComponent(urlParams.get('url') || '');
              if (originalUrl) {
                const fallbackImg = new Image();
                fallbackImg.onload = () => {
                  setLoadedImages(prev => new Set([...prev, originalUrl]));
                };
                fallbackImg.src = originalUrl;
              }
            } catch {
              // Ignore fallback errors
            }
          }
        };
        img.src = imageUrl;
      }
    });
  }, [processedImages, preloadImages, loadedImages]);

  // Simple navigation - no waiting for image load
  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages) {
      setCurrentImageIndex((currentImageIndex + 1) % processedImages.length);
    }
  }, [processedImages, hasMultipleImages, currentImageIndex]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages) {
      setCurrentImageIndex((currentImageIndex - 1 + processedImages.length) % processedImages.length);
    }
  }, [processedImages, hasMultipleImages, currentImageIndex]);

  const getCurrentImageUrl = () => {
    return processedImages[currentImageIndex] || '/placeholder.svg';
  };

  const currentImageUrl = getCurrentImageUrl();
  const isImageLoaded = loadedImages.has(currentImageUrl) || currentImageUrl === '/placeholder.svg';

  return (
    <div 
      className={`relative overflow-hidden group ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={currentImageUrl}
        alt={address}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="eager"
        decoding="async"
        style={{
          opacity: isImageLoaded ? 1 : 0.3
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

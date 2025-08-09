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
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  // Process images - use original URLs directly
  const processedImages = React.useMemo(() => {
    if (!images) return [];

    const processImageUrl = (url: string) => {
      if (typeof url !== 'string') return '';
      return url;
    };

    if (Array.isArray(images) && images.length > 0) {
      return images.map((img: any) => {
        if (typeof img === 'string') return processImageUrl(img);
        if (typeof img === 'object' && img !== null) {
          return processImageUrl(img.url || img.image_url || '');
        }
        return '';
      }).filter(Boolean);
    }

    if (typeof images === 'string') {
      return [processImageUrl(images)].filter(Boolean);
    }

    return [];
  }, [images]);

  const hasMultipleImages = processedImages.length > 1;
  const currentImageUrl = processedImages[currentImageIndex] || '';

  // Generate thumbnail version for blur effect
  const getThumbnailUrl = useCallback((originalUrl: string) => {
    if (!originalUrl) return '';
    // Create a very small version for blur effect - many CDNs support this
    return `${originalUrl}${originalUrl.includes('?') ? '&' : '?'}w=50&q=30`;
  }, []);

  // Simple preloading function
  const preloadImage = useCallback((url: string, isThumbnail = false) => {
    if (!url || loadedImages.has(url) || loadingImages.has(url)) return;

    setLoadingImages(prev => new Set(prev).add(url));

    const img = new Image();
    img.onload = () => {
      setLoadedImages(prev => new Set(prev).add(url));
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(url);
        return newSet;
      });
      
      // If this is a thumbnail, immediately start loading the full image
      if (isThumbnail) {
        const fullUrl = url.split('?')[0]; // Remove thumbnail params
        setTimeout(() => preloadImage(fullUrl), 50);
      }
    };
    img.onerror = () => {
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(url);
        return newSet;
      });
      
      // If thumbnail fails, try loading full image directly
      if (isThumbnail) {
        const fullUrl = url.split('?')[0];
        preloadImage(fullUrl);
      }
    };
    img.src = url;
  }, [loadedImages, loadingImages]);

  // Load current image and preload next images
  useEffect(() => {
    if (processedImages.length === 0) return;

    // Load thumbnail first, then full image
    const thumbnailUrl = getThumbnailUrl(currentImageUrl);
    if (thumbnailUrl !== currentImageUrl) {
      preloadImage(thumbnailUrl, true);
    } else {
      preloadImage(currentImageUrl);
    }

    // Preload next 2 images for smooth navigation
    const preloadIndices = [
      (currentImageIndex + 1) % processedImages.length,
      (currentImageIndex + 2) % processedImages.length
    ];

    preloadIndices.forEach(index => {
      if (processedImages[index]) {
        setTimeout(() => preloadImage(processedImages[index]), 50);
      }
    });
  }, [currentImageIndex, processedImages, preloadImage, currentImageUrl, getThumbnailUrl]);

  // Preload additional images from props
  useEffect(() => {
    preloadImages.forEach((imageUrl, index) => {
      setTimeout(() => preloadImage(imageUrl), 200 + index * 100);
    });
  }, [preloadImages, preloadImage]);

  // Navigation functions
  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages) {
      setCurrentImageIndex(prev => (prev + 1) % processedImages.length);
    }
  }, [processedImages.length, hasMultipleImages]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages) {
      setCurrentImageIndex(prev => (prev - 1 + processedImages.length) % processedImages.length);
    }
  }, [processedImages.length, hasMultipleImages]);

  const isImageLoaded = loadedImages.has(currentImageUrl);
  const isImageLoading = loadingImages.has(currentImageUrl);

  return (
    <div 
      className={`relative overflow-hidden group ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Single image with smooth loading states */}
      <div className="relative w-full h-full">
        {/* Gray fallback */}
        <div className="absolute inset-0 bg-gray-700" />
        
        {/* Blurred thumbnail while full image loads */}
        {!isImageLoaded && isThumbnailLoaded && thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={address}
            className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-105 transition-opacity duration-300"
            loading="eager"
            decoding="async"
          />
        )}
        
        {/* Main full-resolution image */}
        {currentImageUrl && (
          <img
            src={currentImageUrl}
            alt={address}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="eager"
            decoding="async"
            onLoad={() => {
              setLoadedImages(prev => new Set(prev).add(currentImageUrl));
              setLoadingImages(prev => {
                const newSet = new Set(prev);
                newSet.delete(currentImageUrl);
                return newSet;
              });
            }}
          />
        )}
      </div>
      
      {/* Navigation arrows */}
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

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
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [currentBackgroundImage, setCurrentBackgroundImage] = useState<string>('');
  const [nextBackgroundImage, setNextBackgroundImage] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Process images with deduplication and lazy loading
  const processedImages = React.useMemo(() => {
    if (!images) return [];

    const processImageUrl = (url: string) => {
      if (typeof url !== 'string') return '/placeholder.svg';
      
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

  // Initialize the first background image
  useEffect(() => {
    if (processedImages.length > 0 && !currentBackgroundImage) {
      const firstImage = processedImages[0];
      setCurrentBackgroundImage(firstImage);
    }
  }, [processedImages, currentBackgroundImage]);

  // Preload images in background
  useEffect(() => {
    const imagesToPreload = [...processedImages, ...preloadImages].filter(Boolean);
    
    imagesToPreload.forEach((imageUrl, index) => {
      if (imageUrl && imageUrl !== '/placeholder.svg') {
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

  // Handle image transitions with crossfade
  const transitionToImage = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= processedImages.length) return;
    
    const newImageUrl = processedImages[newIndex];
    
    // Start transition
    setIsTransitioning(true);
    setNextBackgroundImage(newImageUrl);
    
    // Preload the new image
    const img = new Image();
    img.onload = () => {
      // After image loads, complete the transition
      setTimeout(() => {
        setCurrentBackgroundImage(newImageUrl);
        setNextBackgroundImage('');
        setIsTransitioning(false);
      }, 50); // Brief delay for smooth transition
    };
    img.onerror = () => {
      // If image fails to load, still complete transition to avoid stuck state
      setCurrentBackgroundImage(newImageUrl);
      setNextBackgroundImage('');
      setIsTransitioning(false);
    };
    img.src = newImageUrl;
  }, [processedImages]);

  // Navigation functions with crossfade transitions
  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages && !isTransitioning) {
      const nextIndex = (currentImageIndex + 1) % processedImages.length;
      setCurrentImageIndex(nextIndex);
      transitionToImage(nextIndex);
    }
  }, [processedImages.length, hasMultipleImages, currentImageIndex, isTransitioning, transitionToImage]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages && !isTransitioning) {
      const prevIndex = (currentImageIndex - 1 + processedImages.length) % processedImages.length;
      setCurrentImageIndex(prevIndex);
      transitionToImage(prevIndex);
    }
  }, [processedImages.length, hasMultipleImages, currentImageIndex, isTransitioning, transitionToImage]);

  return (
    <div 
      className={`relative overflow-hidden group ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Current background image */}
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-300"
        style={{ 
          backgroundImage: currentBackgroundImage ? `url(${currentBackgroundImage})` : 'none',
          opacity: isTransitioning ? 0.7 : 1
        }}
      />
      
      {/* Next background image for crossfade */}
      {nextBackgroundImage && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-300"
          style={{ 
            backgroundImage: `url(${nextBackgroundImage})`,
            opacity: isTransitioning ? 1 : 0
          }}
        />
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

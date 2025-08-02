
import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImageProps {
  images: any;
  address: string;
  className?: string;
  preloadImages?: string[]; // Add prop to preload additional images
}

// Global cache for loaded images to prevent re-loading
const loadedImageCache = new Set<string>();
const imageLoadPromises = new Map<string, Promise<string>>();

const PropertyImage: React.FC<PropertyImageProps> = ({ images, address, className, preloadImages = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [readyImages, setReadyImages] = useState<Set<number>>(new Set());

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

  // Preload image with promise-based loading
  const preloadImage = useCallback((imageUrl: string): Promise<string> => {
    if (loadedImageCache.has(imageUrl)) {
      return Promise.resolve(imageUrl);
    }

    if (imageLoadPromises.has(imageUrl)) {
      return imageLoadPromises.get(imageUrl)!;
    }

    const promise = new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        loadedImageCache.add(imageUrl);
        imageLoadPromises.delete(imageUrl);
        resolve(imageUrl);
      };
      img.onerror = () => {
        imageLoadPromises.delete(imageUrl);
        // Try fallback to original URL if proxy fails
        if (imageUrl.includes('rskcssgjpbshagjocdre.supabase.co/functions/v1/proxy-image')) {
          try {
            const urlParams = new URLSearchParams(imageUrl.split('?')[1]);
            const originalUrl = decodeURIComponent(urlParams.get('url') || '');
            if (originalUrl) {
              const fallbackImg = new Image();
              fallbackImg.onload = () => {
                loadedImageCache.add(originalUrl);
                resolve(originalUrl);
              };
              fallbackImg.onerror = () => resolve('/placeholder.svg');
              fallbackImg.src = originalUrl;
            } else {
              resolve('/placeholder.svg');
            }
          } catch {
            resolve('/placeholder.svg');
          }
        } else {
          resolve('/placeholder.svg');
        }
      };
      img.src = imageUrl;
    });

    imageLoadPromises.set(imageUrl, promise);
    return promise;
  }, []);

  // Preload current and next images immediately
  useEffect(() => {
    const imagesToPreload = [
      ...processedImages,
      ...preloadImages
    ].filter(Boolean);

    // Preload all images but mark current as ready immediately if cached
    imagesToPreload.forEach(async (imageUrl, index) => {
      if (imageUrl && imageUrl !== '/placeholder.svg') {
        try {
          await preloadImage(imageUrl);
          if (index < processedImages.length) {
            setReadyImages(prev => new Set([...prev, index]));
          }
        } catch (error) {
          console.error('Failed to preload image:', error);
        }
      }
    });
  }, [processedImages, preloadImages, preloadImage]);

  // Navigation functions - only navigate if next image is ready or cached
  const nextImage = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages) {
      const nextIndex = (currentImageIndex + 1) % processedImages.length;
      const nextImageUrl = processedImages[nextIndex];
      
      // Ensure next image is loaded before switching
      if (nextImageUrl && !loadedImageCache.has(nextImageUrl)) {
        await preloadImage(nextImageUrl);
      }
      
      setCurrentImageIndex(nextIndex);
    }
  }, [processedImages, hasMultipleImages, currentImageIndex, preloadImage]);

  const prevImage = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages) {
      const prevIndex = (currentImageIndex - 1 + processedImages.length) % processedImages.length;
      const prevImageUrl = processedImages[prevIndex];
      
      // Ensure prev image is loaded before switching
      if (prevImageUrl && !loadedImageCache.has(prevImageUrl)) {
        await preloadImage(prevImageUrl);
      }
      
      setCurrentImageIndex(prevIndex);
    }
  }, [processedImages, hasMultipleImages, currentImageIndex, preloadImage]);

  const getCurrentImageUrl = () => {
    const url = processedImages[currentImageIndex] || '/placeholder.svg';
    // Only return the URL if it's loaded or is the placeholder
    if (url === '/placeholder.svg' || loadedImageCache.has(url)) {
      return url;
    }
    // Return a data URL with the same aspect ratio while loading
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTExIi8+PC9zdmc+';
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
        className="w-full h-full object-cover"
        loading="eager"
        decoding="sync"
        style={{
          opacity: loadedImageCache.has(processedImages[currentImageIndex]) || processedImages[currentImageIndex] === '/placeholder.svg' ? 1 : 0.1,
          transition: 'opacity 0.2s ease-in-out'
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

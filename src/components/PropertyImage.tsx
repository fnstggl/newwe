
import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImageProps {
  images: any;
  address: string;
  className?: string;
  preloadImages?: string[];
  shouldLoad?: boolean;
  onImageLoaded?: () => void;
  isLoaded?: boolean;
}

const PropertyImage: React.FC<PropertyImageProps> = ({ 
  images, 
  address, 
  className, 
  preloadImages = [],
  shouldLoad = true,
  onImageLoaded,
  isLoaded = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: number]: 'loading' | 'thumbnail' | 'medium' | 'high'}>({});
  const [imageLoaded, setImageLoaded] = useState(false);

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

  // Generate different quality versions of image URLs
  const getImageVariants = useCallback((originalUrl: string) => {
    if (!originalUrl) return { thumbnail: '', medium: '', high: '' };
    
    const thumbnail = `${originalUrl}${originalUrl.includes('?') ? '&' : '?'}w=100&q=40`;
    const medium = `${originalUrl}${originalUrl.includes('?') ? '&' : '?'}w=400&q=75`;
    const high = originalUrl;
    
    return { thumbnail, medium, high };
  }, []);

  // Load image progressively only when shouldLoad is true
  const loadImageProgressively = useCallback((imageUrl: string, index: number) => {
    if (!imageUrl || !shouldLoad) return;

    const variants = getImageVariants(imageUrl);
    
    setImageLoadingStates(prev => ({ ...prev, [index]: 'loading' }));

    // Load thumbnail first
    const thumbnailImg = new Image();
    thumbnailImg.onload = () => {
      setImageLoadingStates(prev => ({ ...prev, [index]: 'thumbnail' }));
      setImageLoaded(true);
      
      // Notify parent that this image has loaded
      if (onImageLoaded) {
        onImageLoaded();
      }
      
      // After thumbnail loads, load medium quality
      setTimeout(() => {
        const mediumImg = new Image();
        mediumImg.onload = () => {
          setImageLoadingStates(prev => ({ ...prev, [index]: 'medium' }));
        };
        mediumImg.src = variants.medium;
      }, 100);
    };
    thumbnailImg.src = variants.thumbnail;
  }, [getImageVariants, shouldLoad, onImageLoaded]);

  // Only start loading when shouldLoad becomes true
  useEffect(() => {
    if (shouldLoad && processedImages.length > 0 && !imageLoaded) {
      loadImageProgressively(processedImages[currentImageIndex], currentImageIndex);
    }
  }, [shouldLoad, currentImageIndex, processedImages, loadImageProgressively, imageLoaded]);

  // Navigation functions
  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages) {
      const nextIndex = (currentImageIndex + 1) % processedImages.length;
      setCurrentImageIndex(nextIndex);
      
      // Load the next image if it hasn't been loaded yet
      if (imageLoadingStates[nextIndex] === undefined) {
        loadImageProgressively(processedImages[nextIndex], nextIndex);
      }
    }
  }, [processedImages.length, hasMultipleImages, currentImageIndex, imageLoadingStates, loadImageProgressively]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasMultipleImages) {
      const prevIndex = (currentImageIndex - 1 + processedImages.length) % processedImages.length;
      setCurrentImageIndex(prevIndex);
      
      // Load the previous image if it hasn't been loaded yet
      if (imageLoadingStates[prevIndex] === undefined) {
        loadImageProgressively(processedImages[prevIndex], prevIndex);
      }
    }
  }, [processedImages.length, hasMultipleImages, currentImageIndex, imageLoadingStates, loadImageProgressively]);

  // Get the appropriate image URL based on loading state
  const getCurrentImageUrl = useCallback(() => {
    const originalUrl = processedImages[currentImageIndex] || '';
    if (!originalUrl || !shouldLoad) return '';

    const variants = getImageVariants(originalUrl);
    const loadingState = imageLoadingStates[currentImageIndex];
    
    switch (loadingState) {
      case 'high':
        return variants.high;
      case 'medium':
        return variants.medium;
      case 'thumbnail':
        return variants.thumbnail;
      default:
        return '';
    }
  }, [processedImages, currentImageIndex, imageLoadingStates, getImageVariants, shouldLoad]);

  const currentImageUrl = getCurrentImageUrl();

  // Handle hover for high-res loading
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    if (shouldLoad && imageLoaded) {
      const originalUrl = processedImages[currentImageIndex];
      if (originalUrl && imageLoadingStates[currentImageIndex] !== 'high') {
        const variants = getImageVariants(originalUrl);
        const highImg = new Image();
        highImg.onload = () => {
          setImageLoadingStates(prev => ({ ...prev, [currentImageIndex]: 'high' }));
        };
        highImg.src = variants.high;
      }
    }
  }, [shouldLoad, imageLoaded, processedImages, currentImageIndex, imageLoadingStates, getImageVariants]);

  return (
    <div 
      className={`relative overflow-hidden group ${className || ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image display with cascading loading effect */}
      {currentImageUrl && imageLoaded ? (
        <img
          src={currentImageUrl}
          alt={address}
          className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
          loading="eager"
          decoding="async"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'scale(1)' : 'scale(0.95)',
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out'
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          {shouldLoad && (
            <div className="animate-pulse bg-gray-800 w-full h-full"></div>
          )}
        </div>
      )}
      
      {/* Navigation arrows - only show on hover and if multiple images */}
      {hasMultipleImages && isHovered && imageLoaded && (
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

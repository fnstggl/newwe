
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
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: number]: 'thumbnail' | 'medium' | 'high'}>({});
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

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

  // Generate different quality versions of image URLs
  const getImageVariants = useCallback((originalUrl: string) => {
    if (!originalUrl) return { thumbnail: '', medium: '', high: '' };
    
    // For now, we'll use the same URL but with different query parameters
    // In a real implementation, you might use a CDN that supports dynamic resizing
    const thumbnail = `${originalUrl}${originalUrl.includes('?') ? '&' : '?'}w=50&q=30`; // Very small, low quality
    const medium = `${originalUrl}${originalUrl.includes('?') ? '&' : '?'}w=400&q=70`;   // Medium size, good quality
    const high = originalUrl; // Original high quality
    
    return { thumbnail, medium, high };
  }, []);

  // Progressive image loading function
  const loadImageProgressively = useCallback((imageUrl: string, index: number) => {
    if (!imageUrl) return;

    const variants = getImageVariants(imageUrl);
    
    // Set initial state to thumbnail
    setImageLoadingStates(prev => ({ ...prev, [index]: 'thumbnail' }));

    // Load thumbnail first (should be very fast)
    const thumbnailImg = new Image();
    thumbnailImg.onload = () => {
      // Immediately start loading medium quality
      const mediumImg = new Image();
      mediumImg.onload = () => {
        setImageLoadingStates(prev => ({ ...prev, [index]: 'medium' }));
        
        // Start preloading high quality in background
        if (!preloadedImages.has(variants.high)) {
          const highImg = new Image();
          highImg.onload = () => {
            setPreloadedImages(prev => new Set(prev).add(variants.high));
            setImageLoadingStates(prev => ({ ...prev, [index]: 'high' }));
          };
          highImg.src = variants.high;
        }
      };
      mediumImg.src = variants.medium;
    };
    thumbnailImg.src = variants.thumbnail;
  }, [getImageVariants, preloadedImages]);

  // Load current image and preload next few images
  useEffect(() => {
    if (processedImages.length === 0) return;

    // Load current image progressively
    loadImageProgressively(processedImages[currentImageIndex], currentImageIndex);

    // Preload next 2 images for faster navigation
    const preloadIndices = [
      (currentImageIndex + 1) % processedImages.length,
      (currentImageIndex + 2) % processedImages.length
    ];

    preloadIndices.forEach(index => {
      if (index !== currentImageIndex && processedImages[index]) {
        setTimeout(() => {
          loadImageProgressively(processedImages[index], index);
        }, 100); // Small delay to prioritize current image
      }
    });
  }, [currentImageIndex, processedImages, loadImageProgressively]);

  // Preload additional images from props
  useEffect(() => {
    const allImagesToPreload = [...processedImages, ...preloadImages].filter(Boolean);
    
    allImagesToPreload.forEach((imageUrl, index) => {
      if (imageUrl && index >= processedImages.length) {
        // Only preload additional images after a delay
        setTimeout(() => {
          const variants = getImageVariants(imageUrl);
          const img = new Image();
          img.src = variants.medium;
        }, 500);
      }
    });
  }, [processedImages, preloadImages, getImageVariants]);

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

  // Get the appropriate image URL based on loading state
  const getCurrentImageUrl = useCallback(() => {
    const originalUrl = processedImages[currentImageIndex] || '';
    if (!originalUrl) return '';

    const variants = getImageVariants(originalUrl);
    const loadingState = imageLoadingStates[currentImageIndex] || 'thumbnail';
    
    switch (loadingState) {
      case 'high':
        return preloadedImages.has(variants.high) ? variants.high : variants.medium;
      case 'medium':
        return variants.medium;
      default:
        return variants.thumbnail;
    }
  }, [processedImages, currentImageIndex, imageLoadingStates, getImageVariants, preloadedImages]);

  const currentImageUrl = getCurrentImageUrl();

  // Handle hover for high-res loading
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    // Force load high-res version on hover if not already loaded
    const originalUrl = processedImages[currentImageIndex];
    if (originalUrl && imageLoadingStates[currentImageIndex] !== 'high') {
      const variants = getImageVariants(originalUrl);
      if (!preloadedImages.has(variants.high)) {
        const highImg = new Image();
        highImg.onload = () => {
          setPreloadedImages(prev => new Set(prev).add(variants.high));
          setImageLoadingStates(prev => ({ ...prev, [currentImageIndex]: 'high' }));
        };
        highImg.src = variants.high;
      }
    }
  }, [processedImages, currentImageIndex, imageLoadingStates, getImageVariants, preloadedImages]);

  return (
    <div 
      className={`relative overflow-hidden group ${className || ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image display with progressive loading */}
      {currentImageUrl ? (
        <img
          src={currentImageUrl}
          alt={address}
          className="w-full h-full object-cover transition-opacity duration-200"
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

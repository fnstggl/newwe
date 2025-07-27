
import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImageProps {
  images: any;
  address: string;
  className?: string;
}

const PropertyImage: React.FC<PropertyImageProps> = ({ images, address, className }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());

  // Process images to handle different formats and apply optimized proxy for Zillow URLs
  const processedImages = React.useMemo(() => {
    if (!images) return [];

    const processImageUrl = (url: string) => {
      if (typeof url !== 'string') return '/placeholder.svg';
      
      // Check if it's a Zillow image URL
      if (url.startsWith('https://photos.zillowstatic.com/')) {
        // Use optimized Supabase Edge Function proxy with compression
        return `https://rskcssgjpbshagjocdre.supabase.co/functions/v1/proxy-image?url=${encodeURIComponent(url)}&width=300&quality=50`;
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

  // Aggressive preloading for faster image switching
  useEffect(() => {
    if (processedImages.length > 0) {
      // Preload first 2 images immediately with very low quality for instant display
      const immediatePreloadCount = Math.min(2, processedImages.length);
      
      for (let i = 0; i < immediatePreloadCount; i++) {
        const img = new Image();
        // Use even lower quality for immediate preload
        const lowQualityUrl = processedImages[i].replace('quality=50', 'quality=30').replace('width=300', 'width=200');
        img.src = lowQualityUrl;
      }
      
      // Preload remaining images with slight delay at normal quality
      if (processedImages.length > 2) {
        setTimeout(() => {
          for (let i = 2; i < Math.min(6, processedImages.length); i++) {
            const img = new Image();
            img.src = processedImages[i];
          }
        }, 50);
      }
      
      // Preload the rest with longer delay
      if (processedImages.length > 6) {
        setTimeout(() => {
          for (let i = 6; i < processedImages.length; i++) {
            const img = new Image();
            img.src = processedImages[i];
          }
        }, 200);
      }
    }
  }, [processedImages]);

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;
    
    // Mark this image index as having an error
    setImageLoadErrors(prev => new Set([...prev, currentImageIndex]));
    
    // If optimized proxy failed, try original URL
    if (currentSrc.includes('rskcssgjpbshagjocdre.supabase.co/functions/v1/proxy-image')) {
      try {
        const urlParams = new URLSearchParams(currentSrc.split('?')[1]);
        const originalUrl = decodeURIComponent(urlParams.get('url') || '');
        if (originalUrl) {
          img.src = originalUrl;
        }
      } catch (error) {
        console.error('Error parsing proxy URL:', error);
      }
    }
  };

  const getCurrentImageUrl = () => {
    return processedImages[currentImageIndex] || '';
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
        onError={handleImageError}
        loading={currentImageIndex === 0 ? "eager" : "lazy"}
        decoding="async"
        style={{ 
          willChange: 'opacity'
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

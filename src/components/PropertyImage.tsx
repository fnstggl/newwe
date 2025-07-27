
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
  const [preloadedThumbnails, setPreloadedThumbnails] = useState<string[]>([]);

  // Process images to handle different formats and apply proxy for Zillow URLs
  const processedImages = React.useMemo(() => {
    if (!images) return [];

    const processImageUrl = (url: string) => {
      if (typeof url !== 'string') return '/placeholder.svg';
      
      // Check if it's a Zillow image URL
      if (url.startsWith('https://photos.zillowstatic.com/')) {
        // Use Supabase Edge Function proxy for Zillow images
        return `https://rskcssgjpbshagjocdre.supabase.co/functions/v1/proxy-image?url=${encodeURIComponent(url)}`;
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

  // Create thumbnail URL (smaller, optimized version)
  const getThumbnailUrl = useCallback((url: string) => {
    if (url === '/placeholder.svg') return url;
    // For proxy URLs, add thumbnail parameters
    if (url.includes('rskcssgjpbshagjocdre.supabase.co/functions/v1/proxy-image')) {
      return url; // Proxy already handles optimization
    }
    // Add thumbnail parameters for other images
    return url.includes('?') ? `${url}&w=300&h=200&q=80` : `${url}?w=300&h=200&q=80`;
  }, []);

  // Preload thumbnail versions of all images for instant switching
  useEffect(() => {
    if (hasMultipleImages) {
      const thumbnailPromises = processedImages.map((imageUrl) => {
        return new Promise<string>((resolve) => {
          const img = new Image();
          const thumbnailUrl = getThumbnailUrl(imageUrl);
          img.onload = () => resolve(thumbnailUrl);
          img.onerror = () => {
            // If proxy fails, try original URL
            if (imageUrl.includes('rskcssgjpbshagjocdre.supabase.co/functions/v1/proxy-image')) {
              const originalUrl = decodeURIComponent(imageUrl.split('url=')[1]);
              const fallbackImg = new Image();
              fallbackImg.onload = () => resolve(originalUrl);
              fallbackImg.onerror = () => resolve('/placeholder.svg');
              fallbackImg.src = originalUrl;
            } else {
              resolve('/placeholder.svg');
            }
          };
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
    if (currentImageIndex === 0) {
      return processedImages[0] || '/placeholder.svg';
    }
    
    // Use preloaded thumbnail if available, otherwise fallback to full image
    return preloadedThumbnails[currentImageIndex] || processedImages[currentImageIndex] || '/placeholder.svg';
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;
    
    // If proxy failed, try original URL
    if (currentSrc.includes('rskcssgjpbshagjocdre.supabase.co/functions/v1/proxy-image')) {
      const originalUrl = decodeURIComponent(currentSrc.split('url=')[1]);
      img.src = originalUrl;
    } else {
      img.src = '/placeholder.svg';
    }
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

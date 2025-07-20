
import { useState, useRef, useEffect } from 'react';
import { MapPin, Bed, Bath, Square, Clock, TrendingUp, Home, Banknote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface PropertyCardProps {
  property: any;
  isRental: boolean;
  onClick: () => void;
  gradeColors?: {
    badge: string;
    scoreText: string;
    scoreBorder: string;
    hover: string;
  };
}

const PropertyCard = ({ property, isRental, onClick, gradeColors }: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMobile = useIsMobile();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const images = property.images || [];
  const hasMultipleImages = images.length > 1;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || !hasMultipleImages) return;
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || !hasMultipleImages) return;
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      // Swipe left - next image
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else if (swipeDistance < -minSwipeDistance) {
      // Swipe right - previous image
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return address.replace(/\s+/g, ' ').trim();
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price?.toLocaleString()}`;
  };

  const formatDiscount = (discount: number) => {
    if (discount >= 1000000) {
      return `$${(discount / 1000000).toFixed(1)}M`;
    } else if (discount >= 1000) {
      return `$${(discount / 1000).toFixed(0)}K`;
    }
    return `$${discount?.toLocaleString()}`;
  };

  const defaultGradeColors = {
    badge: 'bg-white text-black border-gray-300',
    scoreText: 'text-gray-300',
    scoreBorder: 'border-gray-600',
    hover: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:border-white/40'
  };

  const colors = gradeColors || defaultGradeColors;

  return (
    <Card 
      className={`group cursor-pointer bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-xl overflow-hidden transition-all duration-300 ${colors.hover}`}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {images.length > 0 ? (
          <div className="relative w-full h-full">
            <img
              src={images[currentImageIndex]}
              alt={`Property ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />
            
            {/* Desktop Navigation Arrows */}
            {!isMobile && hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  →
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <Home className="h-12 w-12 text-gray-600" />
          </div>
        )}

        {/* Image Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Grade Badge */}
        {property.grade && (
          <Badge className={`absolute top-3 left-3 ${colors.badge} font-semibold text-sm px-3 py-1`}>
            {property.grade}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Price and Discount */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">
              {isRental ? formatPrice(property.monthly_rent) : formatPrice(property.price)}
              {isRental && <span className="text-sm text-gray-400">/month</span>}
            </span>
            {property.discount_amount && (
              <span className="text-sm text-green-400 font-medium">
                Save {formatDiscount(property.discount_amount)}
              </span>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-300 text-sm leading-relaxed">
            {formatAddress(property.address)}
          </p>
        </div>

        {/* Property Details */}
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms || 'N/A'} bath</span>
          </div>
          {property.sqft && (
            <div className="flex items-center space-x-1">
              <Square className="h-4 w-4" />
              <span>{property.sqft?.toLocaleString()} sqft</span>
            </div>
          )}
        </div>

        {/* Days on Market */}
        {property.days_on_market !== null && (
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{property.days_on_market} days on market</span>
          </div>
        )}

        {/* Score */}
        {property.score && (
          <div className={`flex items-center space-x-2 pt-2 border-t ${colors.scoreBorder}`}>
            <TrendingUp className={`h-4 w-4 ${colors.scoreText}`} />
            <span className={`text-sm font-medium ${colors.scoreText}`}>
              Deal Score: {property.score}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PropertyCard;

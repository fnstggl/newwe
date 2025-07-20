
import { useState, useEffect, useRef } from 'react';
import { X, MapPin, Bed, Bath, Square, Clock, TrendingUp, Home, ExternalLink, Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedProperties } from '@/hooks/useSavedProperties';

interface PropertyDetailProps {
  property: any;
  isRental: boolean;
  onClose: () => void;
}

const PropertyDetail = ({ property, isRental, onClose }: PropertyDetailProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { savedProperties, saveProperty, unsaveProperty } = useSavedProperties();
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

  const getGradeColors = (grade: string) => {
    if (grade === 'A+') {
      return {
        badge: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black',
        scoreText: 'text-yellow-400',
        scoreBorder: 'border-yellow-600'
      };
    } else if (grade === 'A' || grade === 'A-') {
      return {
        badge: 'bg-gradient-to-r from-purple-400 to-purple-600 text-white',
        scoreText: 'text-purple-400',
        scoreBorder: 'border-purple-600'
      };
    } else if (grade.startsWith('B')) {
      return {
        badge: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white',
        scoreText: 'text-blue-400',
        scoreBorder: 'border-blue-600'
      };
    } else {
      return {
        badge: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
        scoreText: 'text-gray-300',
        scoreBorder: 'border-gray-600'
      };
    }
  };

  const gradeColors = getGradeColors(property.grade);

  const isSaved = savedProperties.some(saved => saved.listing_id === property.listing_id);

  const handleSaveToggle = async () => {
    if (!user) return;
    
    try {
      if (isSaved) {
        await unsaveProperty(property.listing_id);
      } else {
        await saveProperty(property, isRental);
      }
    } catch (error) {
      console.error('Error toggling saved property:', error);
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-900 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isMobile ? 'mx-0' : 'mx-4'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Property Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Image Gallery */}
        <div className={`relative bg-gray-800 ${isMobile ? 'h-64' : 'h-80'}`}>
          {images.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={images[currentImageIndex]}
                alt={`Property ${currentImageIndex + 1}`}
                className={`w-full h-full object-cover ${isMobile ? '' : 'p-4 rounded-xl'}`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              />
              
              {/* Desktop Navigation Arrows */}
              {!isMobile && hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    →
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="h-16 w-16 text-gray-600" />
            </div>
          )}

          {/* Image Indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}

          {/* Grade Badge */}
          {property.grade && (
            <Badge className={`absolute top-4 left-4 ${gradeColors.badge} font-semibold text-sm px-3 py-1`}>
              {property.grade}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Price and Actions */}
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'}`}>
            <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-4'}`}>
              <div className={`flex items-center ${isMobile ? 'justify-between' : 'space-x-4'}`}>
                <span className="text-3xl font-bold text-white">
                  {isRental ? formatPrice(property.monthly_rent) : formatPrice(property.price)}
                  {isRental && <span className="text-lg text-gray-400">/month</span>}
                </span>
                
                {/* Mobile: Grade and Deal Score beside price */}
                {isMobile && (
                  <div className="flex items-center space-x-3">
                    {property.grade && (
                      <Badge className={`${gradeColors.badge} font-semibold text-sm px-3 py-1`}>
                        {property.grade}
                      </Badge>
                    )}
                    {property.score && (
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${gradeColors.scoreBorder}`}>
                        <TrendingUp className={`h-4 w-4 ${gradeColors.scoreText}`} />
                        <span className={`text-sm font-medium ${gradeColors.scoreText}`}>
                          {property.score}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {property.discount_amount && (
                <span className="text-lg text-green-400 font-medium">
                  Save {formatDiscount(property.discount_amount)}
                </span>
              )}
            </div>

            <div className={`flex ${isMobile ? 'justify-between' : 'space-x-3'}`}>
              {user && (
                <Button
                  variant="outline"
                  onClick={handleSaveToggle}
                  className={`${isSaved ? 'bg-blue-600 border-blue-600' : 'border-gray-700'} text-white hover:bg-blue-600 hover:border-blue-600`}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
              )}
              
              {property.listing_url && (
                <Button
                  variant="outline"
                  onClick={() => window.open(property.listing_url, '_blank')}
                  className="border-gray-700 text-white hover:bg-gray-700"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Listing
                </Button>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300 text-lg leading-relaxed">
              {property.address}
            </p>
          </div>

          {/* Property Stats */}
          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {property.bedrooms === 0 ? 'Studio' : property.bedrooms || <span style={{ color: '#19202D' }}>00</span>}
              </div>
              <div className="text-sm text-gray-400">Bedrooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {property.bathrooms || <span style={{ color: '#19202D' }}>00</span>}
              </div>
              <div className="text-sm text-gray-400">Bathrooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {property.sqft?.toLocaleString() || <span style={{ color: '#19202D' }}>00</span>}
              </div>
              <div className="text-sm text-gray-400">Sqft</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {property.year_built || <span style={{ color: '#19202D' }}>00</span>}
              </div>
              <div className="text-sm text-gray-400">Built</div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Property Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white">{isRental ? 'Rental' : 'Sale'}</span>
                </div>
                {property.days_on_market !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Days on Market</span>
                    <span className="text-white">{property.days_on_market}</span>
                  </div>
                )}
                {property.neighborhood && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Neighborhood</span>
                    <span className="text-white">{property.neighborhood}</span>
                  </div>
                )}
                {property.zipcode && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Zipcode</span>
                    <span className="text-white">{property.zipcode}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Market Analysis</h3>
              <div className="space-y-2">
                {!isMobile && property.grade && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Grade</span>
                    <Badge className={`${gradeColors.badge} font-semibold`}>
                      {property.grade}
                    </Badge>
                  </div>
                )}
                {!isMobile && property.score && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Deal Score</span>
                    <span className={`font-semibold ${gradeColors.scoreText}`}>
                      {property.score}
                    </span>
                  </div>
                )}
                {property.discount_percent && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Discount</span>
                    <span className="text-green-400 font-semibold">{property.discount_percent}%</span>
                  </div>
                )}
                {property.price_per_sqft && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price per sqft</span>
                    <span className="text-white">${property.price_per_sqft}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;

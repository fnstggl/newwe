
import React from 'react';
import { Badge } from '@/components/ui/badge';

// Use flexible types that can handle any data structure from Supabase
interface FlexibleProperty {
  id: string;
  address: string;
  grade: any; // Allow any type for grade
  score: any; // Allow any type for score
  price?: number;
  monthly_rent?: number;
  price_per_sqft?: number;
  rent_per_sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  neighborhood?: string;
  discount_percent?: number;
  reasoning?: string;
  images: any; // Allow any type for images
  [key: string]: any; // Allow any additional properties
}

interface PropertyCardProps {
  property: FlexibleProperty;
  isRental?: boolean;
  onClick: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isRental = false, onClick }) => {
  // EXTENSIVE DEBUG: Log the EXACT property data
  console.log(`🏠 PROPERTY CARD [${property.address}]:`, {
    fullProperty: property,
    gradeValue: property.grade,
    scoreValue: property.score,
    gradeType: typeof property.grade,
    scoreType: typeof property.score,
    allKeys: Object.keys(property)
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountPercentage = () => {
    // First try to get from discount_percent field
    if (property.discount_percent && property.discount_percent > 0) {
      return `${Math.round(property.discount_percent)}% below market`;
    }
    
    // Fallback to parsing from reasoning
    const reasoningText = property.reasoning || '';
    const discountMatch = reasoningText.match(/(\d+)%\s*below/i);
    return discountMatch ? `${discountMatch[1]}% below market` : 'Below market';
  };

  // Handle image URL extraction with flexible typing
  const getImageUrl = () => {
    const images = property.images;
    
    if (!images) {
      return '/placeholder.svg';
    }

    // Handle any possible structure for images
    if (Array.isArray(images) && images.length > 0) {
      const firstImage = images[0];
      
      if (typeof firstImage === 'string') {
        return firstImage;
      }
      
      if (typeof firstImage === 'object' && firstImage !== null) {
        return firstImage.url || firstImage.image_url || '/placeholder.svg';
      }
    }

    // If images is a string, use it directly
    if (typeof images === 'string') {
      return images;
    }

    return '/placeholder.svg';
  };

  const imageUrl = getImageUrl();

  const price = isRental 
    ? property.monthly_rent 
    : property.price;

  const pricePerSqft = isRental
    ? property.rent_per_sqft
    : property.price_per_sqft;

  // LOG THE ACTUAL VALUES BEING RENDERED
  console.log(`🎯 RENDERING VALUES FOR [${property.address}]:`, {
    displayGrade: property.grade,
    displayScore: property.score,
    gradeInBadge: property.grade,
    scoreInBadge: property.score
  });

  return (
    <div 
      className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/40 overflow-hidden relative"
      onClick={onClick}
    >
      {/* Grade badge - positioned absolutely over the image */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-2 rounded-full text-sm font-bold tracking-tight shadow-lg">
          {String(property.grade)}
        </div>
      </div>
      
      {/* Image container - spans full width and height of top half */}
      <div className="h-56 relative overflow-hidden">
        <img
          src={imageUrl}
          alt={property.address}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold tracking-tight text-white line-clamp-2">
          {property.address}
        </h3>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-white tracking-tight">
            {formatPrice(price)}{isRental ? '/mo' : ''}
          </span>
          {pricePerSqft && (
            <span className="text-gray-300 tracking-tight font-medium">
              {formatPrice(pricePerSqft)}/sqft
            </span>
          )}
        </div>
        
        <div className="flex justify-between text-sm text-gray-400">
          <span className="tracking-tight">
            {property.bedrooms || 0} bed, {property.bathrooms || 0} bath
          </span>
          {property.sqft && (
            <span className="tracking-tight">{property.sqft} sqft</span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300 italic">
            {getDiscountPercentage()}
          </span>
          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
            Score: {String(property.score)}
          </Badge>
        </div>

        {property.neighborhood && (
          <div className="text-sm text-gray-500 tracking-tight">
            {property.neighborhood}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;

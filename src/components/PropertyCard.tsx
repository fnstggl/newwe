
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
  console.log('🃏 PROPERTY CARD RECEIVED - DETAILED:', {
    id: property?.id,
    address: property?.address,
    grade: property?.grade,
    score: property?.score,
    gradeType: typeof property?.grade,
    scoreType: typeof property?.score,
    propertyKeys: Object.keys(property || {}),
    fullProperty: property
  });

  const getGradeColor = (grade: any) => {
    if (!grade) return 'bg-gray-600/90';
    
    const gradeStr = String(grade).toUpperCase();
    switch (gradeStr) {
      case 'A+':
      case 'A':
        return 'bg-green-600/90';
      case 'A-':
      case 'B+':
        return 'bg-green-500/90';
      case 'B':
      case 'B-':
        return 'bg-yellow-500/90';
      case 'C+':
      case 'C':
        return 'bg-orange-500/90';
      case 'C-':
      case 'D':
        return 'bg-red-600/90';
      default:
        return 'bg-gray-600/90';
    }
  };

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

  // Use flexible access to grade and score - convert to string/number as needed
  const displayGrade = property.grade ? String(property.grade) : 'N/A';
  const displayScore = property.score ? String(property.score) : 'N/A';

  console.log('🃏 FINAL VALUES BEING DISPLAYED:', {
    address: property.address,
    displayGrade,
    displayScore,
    rawGrade: property.grade,
    rawScore: property.score,
    gradeIsNull: property.grade === null,
    scoreIsNull: property.score === null,
    gradeIsUndefined: property.grade === undefined,
    scoreIsUndefined: property.score === undefined
  });

  return (
    <div 
      className="relative rounded-3xl overflow-hidden border border-gray-700/50 hover:border-blue-500/70 transition-all duration-300 hover:scale-[1.02] cursor-pointer group bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm"
      onClick={onClick}
    >
      {/* Score badge - top right with glassmorphic effect */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`${getGradeColor(displayGrade)} backdrop-blur-md border border-white/20 text-white px-3 py-2 rounded-full text-sm font-bold tracking-tight shadow-lg`}>
          {displayGrade}
        </div>
      </div>
      
      {/* Image container */}
      <div className="h-56 bg-gray-800 relative overflow-hidden">
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
        <h3 className="text-lg font-semibold tracking-tight text-white group-hover:text-blue-300 transition-colors line-clamp-2">
          {property.address}
        </h3>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-400 tracking-tight">
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
          <span className="text-sm text-blue-400 font-medium">
            {getDiscountPercentage()}
          </span>
          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
            Score: {displayScore}
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

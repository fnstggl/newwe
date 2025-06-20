
import React from 'react';
import { Badge } from '@/components/ui/badge';
import PropertyImage from './PropertyImage';

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

interface GradeColors {
  badge: string;
  scoreText: string;
  scoreBorder: string;
  hover: string;
}

interface PropertyCardProps {
  property: FlexibleProperty;
  isRental?: boolean;
  onClick: () => void;
  gradeColors?: GradeColors;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isRental = false, onClick, gradeColors }) => {
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

  const price = isRental 
    ? property.monthly_rent 
    : property.price;

  const pricePerSqft = isRental
    ? property.rent_per_sqft
    : property.price_per_sqft;

  // Default colors if not provided
  const defaultColors = {
    badge: 'bg-white/20 border-white/30 text-white',
    scoreText: 'text-gray-300',
    scoreBorder: 'border-gray-600',
    hover: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/40'
  };

  const colors = gradeColors || defaultColors;

  // LOG THE ACTUAL VALUES BEING RENDERED
  console.log(`🎯 RENDERING VALUES FOR [${property.address}]:`, {
    displayGrade: property.grade,
    displayScore: property.score,
    gradeInBadge: property.grade,
    scoreInBadge: property.score
  });

  return (
    <div 
      className={`bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl cursor-pointer transition-all duration-300 ${colors.hover} overflow-hidden relative`}
      onClick={onClick}
    >
      {/* Grade badge - positioned absolutely over the image */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`${colors.badge} backdrop-blur-md border px-3 py-2 rounded-full text-sm font-bold tracking-tight shadow-lg`}>
          {String(property.grade)}
        </div>
      </div>
      
      {/* Optimized Image container with lazy loading and carousel */}
      <PropertyImage
        images={property.images}
        address={property.address}
        className="h-56"
      />
      
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
          <Badge variant="outline" className={`text-xs ${colors.scoreBorder} ${colors.scoreText}`}>
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

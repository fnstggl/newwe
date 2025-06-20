
import React from 'react';
import { Tables } from '@/integrations/supabase/types';
import { Badge } from '@/components/ui/badge';

// Use the auto-generated Supabase types directly
type SupabaseUndervaluedSales = Tables<'undervalued_sales'>;
type SupabaseUndervaluedRentals = Tables<'undervalued_rentals'>;

interface PropertyCardProps {
  property: SupabaseUndervaluedSales | SupabaseUndervaluedRentals;
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

  const getGradeColor = (grade: string) => {
    if (!grade) return 'bg-gray-600/90';
    
    switch (grade.toUpperCase()) {
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

  // Handle image URL extraction properly with Supabase types
  const getImageUrl = () => {
    // Handle the Supabase Json type properly
    const images = property.images;
    
    if (!images || (Array.isArray(images) && images.length === 0)) {
      return '/placeholder.svg';
    }

    if (Array.isArray(images)) {
      const firstImage = images[0];
      
      // If it's already a string URL, use it directly
      if (typeof firstImage === 'string') {
        return firstImage;
      }
      
      // If it's an object with url or image_url property
      if (typeof firstImage === 'object' && firstImage !== null) {
        const imageObj = firstImage as any;
        return imageObj.url || imageObj.image_url || '/placeholder.svg';
      }
    }

    return '/placeholder.svg';
  };

  const imageUrl = getImageUrl();

  const price = isRental 
    ? (property as SupabaseUndervaluedRentals).monthly_rent 
    : (property as SupabaseUndervaluedSales).price;

  const pricePerSqft = isRental
    ? (property as SupabaseUndervaluedRentals).rent_per_sqft
    : (property as SupabaseUndervaluedSales).price_per_sqft;

  // Direct access to grade and score from property - using Supabase types
  const actualGrade = property.grade;
  const actualScore = property.score;

  console.log('🃏 FINAL VALUES BEING DISPLAYED:', {
    address: property.address,
    actualGrade,
    actualScore,
    gradeIsNull: actualGrade === null,
    scoreIsNull: actualScore === null,
    gradeIsUndefined: actualGrade === undefined,
    scoreIsUndefined: actualScore === undefined
  });

  return (
    <div 
      className="relative rounded-3xl overflow-hidden border border-gray-700/50 hover:border-blue-500/70 transition-all duration-300 hover:scale-[1.02] cursor-pointer group bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm"
      onClick={onClick}
    >
      {/* Score badge - top right with glassmorphic effect */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`${getGradeColor(actualGrade)} backdrop-blur-md border border-white/20 text-white px-3 py-2 rounded-full text-sm font-bold tracking-tight shadow-lg`}>
          {actualGrade || 'N/A'}
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
            Score: {actualScore || 'N/A'}
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

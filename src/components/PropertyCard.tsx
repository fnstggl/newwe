
import React from 'react';
import { Badge } from '@/components/ui/badge';
import PropertyImage from './PropertyImage';
import BookmarkButton from './BookmarkButton';

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
  isRentStabilized?: boolean; // Flag for rent-stabilized properties
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

  // Calculate grade from score for rent-stabilized properties
  const calculateGradeFromScore = (score: number): string => {
    if (score >= 98) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 88) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 79) return 'B-';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'C-';
    return 'D';
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
    // For rent-stabilized properties, handle above/below market differently
    if (property.isRentStabilized && property.discount_percent !== undefined) {
      const percent = Math.abs(property.discount_percent);
      // All rent-stabilized should be "below market"
      return `${Math.round(percent)}% below market`;
    }
    
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

  // Determine the display grade - for rent-stabilized, calculate from score
  const displayGrade = property.isRentStabilized 
    ? calculateGradeFromScore(Number(property.score))
    : String(property.grade);

  // Get colors based on the actual grade (not just rent-stabilized status)
  const getGradeColorsForProperty = (grade: string, isRentStabilized?: boolean) => {
    if (grade === 'A+') {
      return {
        badge: 'bg-white text-black border-gray-300',
        scoreText: 'text-yellow-400',
        scoreBorder: 'border-yellow-600',
        hover: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:border-yellow-400/40'
      };
    } else if (grade === 'A' || grade === 'A-') {
      return {
        badge: 'bg-white text-black border-gray-300',
        scoreText: 'text-purple-400',
        scoreBorder: 'border-purple-600',
        hover: 'hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:border-purple-400/40'
      };
    } else if (grade.startsWith('B')) {
      return {
        badge: 'bg-white text-black border-gray-300',
        scoreText: 'text-blue-400',
        scoreBorder: 'border-blue-600',
        hover: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/40'
      };
    } else {
      return {
        badge: 'bg-white text-black border-gray-300',
        scoreText: 'text-gray-300',
        scoreBorder: 'border-gray-600',
        hover: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:border-white/40'
      };
    }
  };

  // Use grade-based colors instead of passed gradeColors for rent-stabilized
  const colors = property.isRentStabilized 
    ? getGradeColorsForProperty(displayGrade, true)
    : (gradeColors || {
        badge: 'bg-white/20 backdrop-blur-md border-white/30 text-white',
        scoreText: 'text-gray-300',
        scoreBorder: 'border-gray-600',
        hover: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/40'
      });

  // LOG THE ACTUAL VALUES BEING RENDERED
  console.log(`🎯 RENDERING VALUES FOR [${property.address}]:`, {
    displayGrade: displayGrade,
    displayScore: property.score,
    isRentStabilized: property.isRentStabilized
  });

  return (
    <div 
      className={`bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl cursor-pointer transition-all duration-300 ${colors.hover} overflow-hidden relative`}
      onClick={onClick}
    >
      {/* Optimized Image container with lazy loading and carousel */}
      <div className="relative">
        <PropertyImage
          images={property.images}
          address={property.address}
          className="h-56"
        />
        
        {/* Grade badge - positioned absolutely over the image, top left */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 text-black w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold tracking-tight shadow-lg">
            {displayGrade}
          </div>
        </div>

        {/* Bookmark button - positioned absolutely over the image, top right */}
        <div className="absolute top-4 right-4 z-10">
          <BookmarkButton 
            propertyId={property.id}
            propertyType={isRental ? 'rental' : 'sale'}
            className="bg-transparent p-2 rounded-full"
          />
        </div>
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
          <div className="flex gap-2">
            {property.isRentStabilized && (
              <Badge variant="outline" className="text-xs border-green-600 text-green-400">
                Rent-stabilized
              </Badge>
            )}
            <Badge variant="outline" className={`text-xs ${colors.scoreBorder} ${colors.scoreText}`}>
              Score: {String(property.score)}
            </Badge>
          </div>
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

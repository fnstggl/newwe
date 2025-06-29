
import { useState } from "react";
import { Heart } from "lucide-react";
import PropertyImage from "./PropertyImage";
import { useSavedProperties } from "@/hooks/useSavedProperties";

interface PropertyCardProps {
  property: any;
  isRental?: boolean;
  onClick?: () => void;
  gradeColors?: {
    badge: string;
    scoreText: string;
    scoreBorder: string;
    hover: string;
  };
  isRentStabilized?: boolean;
}

const PropertyCard = ({ property, isRental = false, onClick, gradeColors, isRentStabilized = false }: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { saveProperty, unsaveProperty, isSaved } = useSavedProperties();
  
  const propertyType = isRental ? 'rental' : 'sale';
  const saved = isSaved(property.id, propertyType);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      await unsaveProperty(property.id, propertyType);
    } else {
      await saveProperty(property.id, propertyType);
    }
  };

  const formatPrice = (price: number) => {
    if (isRental) {
      return `$${price.toLocaleString()}/mo`;
    }
    return price >= 1000000 
      ? `$${(price / 1000000).toFixed(1)}M`
      : `$${(price / 1000).toFixed(0)}K`;
  };

  const getBedBathText = () => {
    const beds = property.bedrooms || 0;
    const baths = property.bathrooms || 0;
    
    if (beds === 0) return "Studio";
    return `${beds} bed${beds > 1 ? 's' : ''}, ${baths} bath${baths > 1 ? 's' : ''}`;
  };

  const defaultGradeColors = {
    badge: 'bg-white text-black border-gray-300',
    scoreText: 'text-blue-400',
    scoreBorder: 'border-blue-600',
    hover: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/40'
  };

  const colors = gradeColors || defaultGradeColors;

  return (
    <div
      className={`bg-gray-900 rounded-2xl border border-gray-800 transition-all duration-300 cursor-pointer ${colors.hover}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative">
        <PropertyImage 
          images={property.images || []} 
          address={property.address}
          className="w-full h-64 object-cover rounded-t-2xl"
        />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${colors.badge}`}>
            {property.grade}
          </div>
          {isRentStabilized && (
            <div className="px-3 py-1 rounded-full text-sm font-semibold bg-green-600 text-white border border-green-500">
              Rent-stabilized
            </div>
          )}
        </div>
        
        <button
          onClick={handleSaveToggle}
          className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full transition-all duration-200 hover:bg-black/70"
        >
          <Heart 
            size={20} 
            className={`transition-colors ${
              saved ? 'fill-red-500 text-red-500' : 'text-white hover:text-red-500'
            }`}
          />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
              {formatPrice(isRental ? property.monthly_rent : property.price)}
            </h3>
            {property.sqft && (
              <p className="text-gray-400 text-sm tracking-tight">
                ${Math.round((isRental ? property.monthly_rent : property.price) / property.sqft)}/sqft
              </p>
            )}
          </div>
          <div className={`text-right border-l-2 pl-4 ${colors.scoreBorder}`}>
            <div className={`text-2xl font-bold ${colors.scoreText}`}>
              {property.score}
            </div>
            <div className="text-xs text-gray-400 tracking-tight">SCORE</div>
          </div>
        </div>

        <p className="text-gray-300 font-medium mb-2 tracking-tight">
          {property.address}
        </p>
        
        <p className="text-gray-400 text-sm mb-4 tracking-tight">
          {property.neighborhood}, {property.borough}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
          <span className="tracking-tight">{getBedBathText()}</span>
          {property.sqft && (
            <span className="tracking-tight">{property.sqft} sqft</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-green-400 font-semibold tracking-tight">
            {isRental ? (
              <>Save ${property.potential_monthly_savings || property.annual_savings}/mo</>
            ) : (
              <>Save ${((property.potential_savings || 0) / 1000).toFixed(0)}K</>
            )}
          </div>
          <div className="text-gray-400 text-sm tracking-tight">
            {property.discount_percent}% off
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

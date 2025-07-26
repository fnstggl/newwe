
import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SoftGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    bedrooms?: number;
    neighborhood?: string;
    monthly_rent?: number;
    price?: number;
    discount_percent?: number;
    rent_stabilized_detected?: boolean;
    rent_stabilized_confidence?: number;
  };
  isRental: boolean;
}

const SoftGateModal: React.FC<SoftGateModalProps> = ({ 
  isOpen, 
  onClose, 
  property,
  isRental 
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    } else {
      return `$${price.toLocaleString()}`;
    }
  };

  const displayPrice = isRental 
    ? `$${property.monthly_rent?.toLocaleString()}/mo`
    : formatPrice(property.price || 0);

  const isRentStabilized = property.rent_stabilized_detected || 
    (property.rent_stabilized_confidence && property.rent_stabilized_confidence > 70);

  const bedroomText = property.bedrooms === 0 ? 'Studio' : 
    property.bedrooms === 1 ? '1 BR' : `${property.bedrooms} BR`;

  const discountText = isRentStabilized 
    ? `This home is ${Math.round(property.discount_percent || 0)}% below-market and rent-stabilized`
    : `This home is ${Math.round(property.discount_percent || 0)}% below-market`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-3 font-inter">
            Upgrade to view listing
          </h2>
          
          <p className="text-gray-300 mb-6 font-inter">
            {discountText}
          </p>

          <div className="bg-gray-900/50 rounded-xl p-4 mb-6 border border-gray-700/30">
            <p className="text-white font-medium font-inter">
              🏠 {bedroomText} · {property.neighborhood} · {displayPrice}
            </p>
          </div>

          <p className="text-gray-300 mb-8 font-inter">
            Get full details, photos, and market analysis
          </p>

          <button
            onClick={handleUpgrade}
            className="w-full bg-white text-black py-3 px-6 rounded-full font-semibold font-inter mb-4 hover:bg-gray-100 transition-colors"
          >
            Unlock for $3/month
          </button>

          <p className="text-xs text-gray-400 mb-4 font-inter">
            6,000+ New Yorkers already searching
          </p>

          <button
            onClick={onClose}
            className="text-blue-400 hover:text-blue-300 text-sm font-inter transition-colors"
          >
            No thanks, take me back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoftGateModal;


import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SoftGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    bedrooms?: number;
    neighborhood?: string;
    monthly_rent?: number;
    discount_percent?: number;
    isRentStabilized?: boolean;
    price?: number;
  };
  isRental?: boolean;
}

const SoftGateModal: React.FC<SoftGateModalProps> = ({ 
  isOpen, 
  onClose, 
  property, 
  isRental = false 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatNeighborhood = (neighborhood: string) => {
    return neighborhood
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const displayPrice = isRental ? property.monthly_rent : property.price;
  const priceText = isRental ? `${formatPrice(displayPrice)}/mo` : formatPrice(displayPrice);
  const discountPercent = Math.round(property.discount_percent || 0);
  const bedroomText = (property.bedrooms || 0) === 0 ? 'Studio' : `${property.bedrooms} BR`;
  const neighborhoodText = property.neighborhood ? formatNeighborhood(property.neighborhood) : 'NYC';

  const subheaderText = property.isRentStabilized 
    ? `This home is ${discountPercent}% below-market and rent-stabilized`
    : `This home is ${discountPercent}% below-market`;

  const handleUpgrade = () => {
    if (user) {
      navigate('/pricing');
    } else {
      navigate('/join');
    }
  };

  const headerText = user ? "You've found a deal" : "Sign in to view more listings";
  const ctaText = user ? "Unlock for $3/month" : "Create free account";
  const descriptionText = user 
    ? "See why this listing is undervalued, full details, and more"
    : "Get full details, photos, and market analysis";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
     <div
  className="relative bg-black/90 backdrop-blur-lg border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 text-center"
  style={{
    boxShadow:
      '0 10px 30px rgba(0, 0, 0, 0.6), inset 0 0 1px rgba(255,255,255,0.06)',
  }}
>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tighter">
          {headerText}
        </h2>

        {/* Subheader */}
      <p className="text-white font-medium text-lg mb-6 leading-snug">
          {subheaderText}
        </p>

        {/* Property details */}
        <div className="text-white/80 mb-6 text-lg">
          🏠 {bedroomText} · {neighborhoodText} · {priceText}
        </div>

        {/* Description */}
        <p className="text-white/70 mb-8 text-base">
          {descriptionText}
        </p>

        {/* CTA Button */}
        <button
          onClick={handleUpgrade}
          className="w-full bg-white text-black py-4 px-6 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors mb-4"
        >
          {ctaText}
        </button>

        {/* Social proof */}
        <p className="text-gray-500 text-sm mb-4">
          6000+ New Yorkers already searching
        </p>

        {/* Dismiss link */}
        <button
          onClick={onClose}
          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          No thanks, take me back
        </button>
      </div>
    </div>
  );
};

export default SoftGateModal;

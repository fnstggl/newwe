
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { capitalizeNeighborhood } from '@/data/neighborhoodData';
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
    isRentStabilized?: boolean;
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

  const handleUpgradeClick = () => {
    navigate('/pricing');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountText = () => {
    if (property.discount_percent) {
      const percent = Math.round(Math.abs(property.discount_percent));
      const rentStabilizedText = property.isRentStabilized ? ' and rent-stabilized' : '';
      return `This home is ${percent}% below-market${rentStabilizedText}`;
    }
    return 'This home is below-market';
  };

  const displayPrice = isRental ? property.monthly_rent : property.price;
  const priceText = displayPrice ? formatPrice(displayPrice) : 'Price available';
  const suffix = isRental ? '/mo' : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-black/90 backdrop-blur-xl border-white/10 text-white">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Upgrade to view listing</h2>
              <p className="text-white/80 text-lg">
                {getDiscountText()}
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-lg">
                🏠 {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms || 0} BR`} · {capitalizeNeighborhood(property.neighborhood)} · {priceText}{suffix}
              </div>
              
              <p className="text-white/70">
                Get full details, photos, and market analysis
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleUpgradeClick}
                className="w-full bg-white text-black hover:bg-white/90 font-semibold py-3 rounded-xl"
              >
                Unlock for $3/month
              </Button>
              
              <p className="text-center text-white/50 text-sm">
                6000+ New Yorkers already searching
              </p>
              
              <button
                onClick={onClose}
                className="w-full text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                No thanks, take me back
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SoftGateModal;

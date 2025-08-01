
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import PropertyCard from './PropertyCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SwipeablePropertyCardProps {
  property: any;
  isRental?: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onPropertyClick: () => void;
}

const SwipeablePropertyCard: React.FC<SwipeablePropertyCardProps> = ({
  property,
  isRental,
  onSwipeLeft,
  onSwipeRight,
  onPropertyClick
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-30, 0, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

  // Background gradients based on swipe direction
  const leftGradientOpacity = useTransform(x, [0, -150], [0, 0.6]);
  const rightGradientOpacity = useTransform(x, [0, 150], [0, 0.6]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const swipeThreshold = 150;

    if (info.offset.x > swipeThreshold) {
      // Swiped right - Save
      handleSave();
      setIsVisible(false);
      setTimeout(onSwipeRight, 300);
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped left - Discard
      setIsVisible(false);
      setTimeout(onSwipeLeft, 300);
    } else {
      // Return to center
      x.set(0);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_properties')
        .insert([{
          user_id: user.id,
          property_id: property.id,
          property_type: isRental ? 'rental' : 'sale',
          table_source: property.table_source
        }]);

      if (error) {
        console.error('Error saving property:', error);
        toast({
          title: "Error",
          description: "Failed to save the property. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Property Saved",
          description: "This property has been saved to your profile.",
        });
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px] overflow-hidden">
      {/* Left gradient (discard) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-600/60 to-transparent z-10 flex items-center justify-start pl-8"
        style={{ opacity: leftGradientOpacity }}
        initial={{ opacity: 0 }}
      >
        <div className="text-white font-bold text-xl">
          Drag left to discard
        </div>
      </motion.div>

      {/* Right gradient (save) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-l from-green-600/60 to-transparent z-10 flex items-center justify-end pr-8"
        style={{ opacity: rightGradientOpacity }}
        initial={{ opacity: 0 }}
      >
        <div className="text-white font-bold text-xl">
          Drag right to save
        </div>
      </motion.div>

      {/* Swipeable card */}
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -300, right: 300 }}
        style={{ x, rotate, opacity }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.05, transition: { duration: 0.1 } }}
        dragElastic={0.2}
      >
        <div 
          className="w-full h-full"
          onClick={!isDragging ? onPropertyClick : undefined}
        >
          <PropertyCard
            property={property}
            isRental={isRental}
            onClick={() => !isDragging && onPropertyClick()}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SwipeablePropertyCard;


import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { useNavigate } from 'react-router-dom';

interface BookmarkButtonProps {
  propertyId: string;
  propertyType: 'sale' | 'rental';
  className?: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ 
  propertyId, 
  propertyType, 
  className = '' 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { saveProperty, unsaveProperty, isSaved } = useSavedProperties();
  const [isLoading, setIsLoading] = useState(false);

  const saved = isSaved(propertyId, propertyType);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      if (saved) {
        await unsaveProperty(propertyId, propertyType);
      } else {
        await saveProperty(propertyId, propertyType);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmarkClick}
      disabled={isLoading}
     className={`transition-all duration-200 ${className}`} // Remove p-2
    >
      <Heart 
        className={`h-5 w-5 ${
          saved 
            ? 'fill-red-500 text-red-500' 
            : 'fill-none text-white hover:text-red-500'
        } stroke-2`} 
      />
    </button>
  );
};

export default BookmarkButton;

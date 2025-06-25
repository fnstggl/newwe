
import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBookmarkClick}
      disabled={isLoading}
      className={`bg-black/50 hover:bg-black/70 text-white transition-all duration-200 ${className}`}
    >
      <Bookmark 
        className={`h-5 w-5 ${saved ? 'fill-white text-white' : 'text-white'}`} 
      />
    </Button>
  );
};

export default BookmarkButton;

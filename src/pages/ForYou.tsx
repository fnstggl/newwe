
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, X, Settings, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSavedProperties } from "../hooks/useSavedProperties";
import type { UndervaluedSales, UndervaluedRentals, UndervaluedRentStabilized } from "../types/database";

type Property = UndervaluedSales | UndervaluedRentals | UndervaluedRentStabilized;

const ForYou = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveProperty, isSaved } = useSavedProperties();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/join');
      return;
    }

    fetchUserPreferences();
    fetchProperties();
  }, [user]);

  const fetchUserPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserPreferences(data);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const fetchProperties = async () => {
    if (!user || !userPreferences) return;

    setIsLoading(true);
    try {
      const queries = [];
      
      // Build queries based on user preferences
      if (userPreferences.property_type === 'rent') {
        // Fetch from undervalued_rentals
        let rentalsQuery = supabase
          .from('undervalued_rentals')
          .select('*')
          .eq('status', 'active');

        if (userPreferences.bedrooms !== null) {
          rentalsQuery = rentalsQuery.eq('bedrooms', userPreferences.bedrooms);
        }
        if (userPreferences.max_budget) {
          rentalsQuery = rentalsQuery.lte('monthly_rent', userPreferences.max_budget);
        }
        if (userPreferences.preferred_neighborhoods?.length > 0) {
          rentalsQuery = rentalsQuery.in('neighborhood', userPreferences.preferred_neighborhoods);
        }
        if (userPreferences.discount_threshold) {
          rentalsQuery = rentalsQuery.gte('discount_percent', userPreferences.discount_threshold);
        }

        queries.push(rentalsQuery.limit(50));

        // Also fetch from undervalued_rent_stabilized
        let stabilizedQuery = supabase
          .from('undervalued_rent_stabilized')
          .select('*');

        if (userPreferences.bedrooms !== null) {
          stabilizedQuery = stabilizedQuery.eq('bedrooms', userPreferences.bedrooms);
        }
        if (userPreferences.max_budget) {
          stabilizedQuery = stabilizedQuery.lte('monthly_rent', userPreferences.max_budget);
        }
        if (userPreferences.preferred_neighborhoods?.length > 0) {
          stabilizedQuery = stabilizedQuery.in('neighborhood', userPreferences.preferred_neighborhoods);
        }
        if (userPreferences.discount_threshold) {
          stabilizedQuery = stabilizedQuery.gte('undervaluation_percent', userPreferences.discount_threshold);
        }

        queries.push(stabilizedQuery.limit(25));
      } else if (userPreferences.property_type === 'buy') {
        // Fetch from undervalued_sales
        let salesQuery = supabase
          .from('undervalued_sales')
          .select('*')
          .eq('status', 'active');

        if (userPreferences.bedrooms !== null) {
          salesQuery = salesQuery.eq('bedrooms', userPreferences.bedrooms);
        }
        if (userPreferences.max_budget) {
          salesQuery = salesQuery.lte('price', userPreferences.max_budget);
        }
        if (userPreferences.preferred_neighborhoods?.length > 0) {
          salesQuery = salesQuery.in('neighborhood', userPreferences.preferred_neighborhoods);
        }
        if (userPreferences.discount_threshold) {
          salesQuery = salesQuery.gte('discount_percent', userPreferences.discount_threshold);
        }

        queries.push(salesQuery.limit(50));
      }

      const results = await Promise.all(queries);
      const allProperties = results.flatMap(result => result.data || []);
      
      // Shuffle and set properties
      const shuffledProperties = allProperties.sort(() => Math.random() - 0.5);
      setProperties(shuffledProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to load your personalized listings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (currentIndex >= properties.length) return;

    const currentProperty = properties[currentIndex];
    setSwipeDirection(direction);

    // Animate swipe
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex(prev => prev + 1);
    }, 300);

    if (direction === 'right') {
      // Save property
      const propertyType = 'monthly_rent' in currentProperty ? 'rental' : 'sale';
      await saveProperty(currentProperty.id, propertyType as 'rental' | 'sale');
      
      toast({
        title: "Saved!",
        description: "Property added to your saved list.",
      });
    }
  };

  const currentProperty = properties[currentIndex];
  const isFreePlan = userProfile?.subscription_plan === 'free';
  const canViewProperty = !isFreePlan || currentIndex < 3;

  const formatPrice = (property: Property) => {
    if ('monthly_rent' in property) {
      return `$${property.monthly_rent?.toLocaleString()}/month`;
    }
    return `$${property.price?.toLocaleString()}`;
  };

  const getPropertyType = (property: Property) => {
    if ('monthly_rent' in property) return 'rental';
    return 'sale';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Finding your perfect matches...</p>
        </div>
      </div>
    );
  }

  if (!currentProperty) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">No more matches!</h2>
          <p className="text-gray-400 mb-6">
            You've seen all the properties that match your criteria. Try adjusting your preferences or check back later for new listings.
          </p>
          <button
            onClick={() => setShowPreferences(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
          >
            Update Preferences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold">For You</h1>
          <button
            onClick={() => setShowPreferences(true)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Property Counter */}
        <div className="px-4 py-2 text-center text-gray-400 text-sm">
          {currentIndex + 1} of {properties.length}
          {isFreePlan && (
            <span className="ml-2 text-amber-400">
              (Free: {Math.min(3, properties.length - currentIndex)} left)
            </span>
          )}
        </div>

        {/* Property Card */}
        <div className="p-4">
          <div
            className={`relative bg-gray-900 rounded-3xl overflow-hidden transition-all duration-300 ${
              swipeDirection === 'left' ? 'transform -translate-x-full bg-red-500/20' :
              swipeDirection === 'right' ? 'transform translate-x-full bg-green-500/20' : ''
            }`}
            style={{ aspectRatio: '3/4' }}
          >
            {!canViewProperty && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex items-center justify-center">
                <div className="text-center p-6">
                  <h3 className="text-xl font-bold mb-2">Upgrade to see more</h3>
                  <p className="text-gray-400 mb-4">
                    You've used your 3 free daily matches. Upgrade for unlimited access.
                  </p>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
                  >
                    Upgrade for $3/month
                  </button>
                </div>
              </div>
            )}

            {/* Property Image */}
            <div className="h-2/3 bg-gray-800 relative">
              {currentProperty.images && (currentProperty.images as any[]).length > 0 ? (
                <img
                  src={(currentProperty.images as any[])[0]}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}
              
              {/* Property badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {'discount_percent' in currentProperty && (
                  <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                    {currentProperty.discount_percent}% off
                  </span>
                )}
                {'grade' in currentProperty && (
                  <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium">
                    Grade {currentProperty.grade}
                  </span>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold">{formatPrice(currentProperty)}</h2>
                <div className="text-right text-sm text-gray-400">
                  {currentProperty.bedrooms ? `${currentProperty.bedrooms}BR` : ''}
                  {currentProperty.bathrooms ? ` • ${currentProperty.bathrooms}BA` : ''}
                  {currentProperty.sqft ? ` • ${currentProperty.sqft} sqft` : ''}
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{currentProperty.address}</p>
              
              {/* Amenities */}
              {currentProperty.amenities && (currentProperty.amenities as any[]).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {(currentProperty.amenities as any[]).slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-300 rounded-md text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              )}

              {canViewProperty && (
                <div className="flex justify-center gap-8 mt-6">
                  <button
                    onClick={() => handleSwipe('left')}
                    className="w-16 h-16 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <X size={28} className="text-white group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleSwipe('right')}
                    className="w-16 h-16 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <Heart size={28} className="text-white group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-gray-400" />
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Tell us what you're looking for..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                // TODO: Implement AI chat functionality
                toast({
                  title: "Coming soon!",
                  description: "AI chat will be available in the next update.",
                });
                setChatMessage("");
              }}
              disabled={!chatMessage.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-full transition-colors"
            >
              Send
            </button>
          </div>
        </div>

        {/* Navigation arrows for desktop */}
        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="p-2 bg-gray-800/80 hover:bg-gray-700/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-4">
          <button
            onClick={() => setCurrentIndex(Math.min(properties.length - 1, currentIndex + 1))}
            disabled={currentIndex >= properties.length - 1}
            className="p-2 bg-gray-800/80 hover:bg-gray-700/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Update Preferences</h2>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-gray-400">
                Adjust your preferences to see different properties. Changes will take effect immediately.
              </p>
              
              <div className="text-center">
                <button
                  onClick={() => navigate('/pricing')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
                >
                  Upgrade to customize all preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForYou;

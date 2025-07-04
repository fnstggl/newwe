import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "@/components/PropertyCard";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { UndervaluedRentStabilized } from "@/types/database";

const Rent = () => {
  const { user } = useAuth();
  const { subscribed, loading: subscriptionLoading } = useSubscription();
  const [rentStabilizedProperties, setRentStabilizedProperties] = useState<UndervaluedRentStabilized[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRentStabilizedProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('undervalued_rent_stabilized')
        .select('*')
        .order('potential_monthly_savings', { ascending: false })
        .limit(subscribed ? 100 : 3);

      if (error) {
        console.error('Error fetching rent stabilized properties:', error);
        setError('Failed to load properties. Please try again.');
        return;
      }

      // Type-safe conversion
      const typedData: UndervaluedRentStabilized[] = (data || []).map(item => ({
        ...item,
        amenities: Array.isArray(item.amenities) ? item.amenities : [],
        building_amenities: Array.isArray(item.building_amenities) ? item.building_amenities : [],
        images: Array.isArray(item.images) ? item.images : [],
        risk_factors: Array.isArray(item.risk_factors) ? item.risk_factors : [],
        tags: Array.isArray(item.tags) ? item.tags : []
      }));

      setRentStabilizedProperties(typedData);
    } catch (error) {
      console.error('Error fetching rent stabilized properties:', error);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentStabilizedProperties();
  }, [subscribed]);

  if (loading || subscriptionLoading) {
    return (
      <div className="font-inter min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-inter min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchRentStabilizedProperties}
              className="mt-4 px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Rent-Stabilized Deals in NYC
          </h1>
          <p className="text-xl text-gray-400 tracking-tight">
            Discover rent-stabilized apartments with below-market pricing
          </p>
        </div>

        {!subscribed && (
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 mb-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">
              Limited Access - Free Plan
            </h2>
            <p className="text-gray-400 mb-6 tracking-tight">
              You're seeing {rentStabilizedProperties.length} of our top rent-stabilized deals. 
              Upgrade to see all available properties and get daily updates.
            </p>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="bg-white text-black px-8 py-3 rounded-full font-medium tracking-tight hover:bg-gray-200 transition-colors"
            >
              Upgrade to Unlimited
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rentStabilizedProperties.map((property) => (
            <PropertyCard 
              key={property.id}
              property={property}
              type="rent-stabilized"
            />
          ))}
        </div>

        {rentStabilizedProperties.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No rent-stabilized properties available at the moment.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Check back soon for new listings!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rent;

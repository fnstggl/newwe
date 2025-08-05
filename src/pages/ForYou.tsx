import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "../components/PropertyCard";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import SoftGateModal from "../components/SoftGateModal";
import EndOfMatchesScreen from "../components/EndOfMatchesScreen";
import PreSignupOnboarding from "../components/PreSignupOnboarding";

interface OnboardingData {
  search_duration?: string;
  frustrations?: string[];
  searching_for?: string;
  property_type?: string;
  bedrooms?: number;
  max_budget?: number;
  preferred_neighborhoods?: string[];
  must_haves?: string[];
  discount_threshold?: number;
}

const ForYou = () => {
  const { user, subscriptionPlan, onboardingCompleted } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSoftGate, setShowSoftGate] = useState(false);
  const [viewedProperties, setViewedProperties] = useState<Set<string>>(new Set());
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user needs onboarding
  useEffect(() => {
    if (!user) {
      // User not signed in - show pre-signup onboarding
      setShowOnboarding(true);
    } else if (user && !onboardingCompleted) {
      // User signed in but no onboarding completed - show onboarding without auth
      setShowOnboarding(true);
    }
  }, [user, onboardingCompleted]);

  const handleOnboardingComplete = async (data: OnboardingData, adjustedFilters?: OnboardingData | null) => {
    if (!user) {
      // This shouldn't happen since pre-signup onboarding handles auth
      return;
    }

    try {
      // Save onboarding data for signed-in users
      const dataToSave = adjustedFilters || data;
      const updateData: any = {
        search_duration: dataToSave.search_duration,
        frustrations: dataToSave.frustrations,
        searching_for: dataToSave.searching_for,
        property_type: dataToSave.property_type,
        bedrooms: dataToSave.bedrooms,
        max_budget: dataToSave.max_budget,
        preferred_neighborhoods: dataToSave.preferred_neighborhoods,
        must_haves: dataToSave.must_haves,
        discount_threshold: dataToSave.discount_threshold,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error saving onboarding data:', error);
        toast({
          title: "Error",
          description: "Failed to save your preferences. Please try again.",
          variant: "destructive",
        });
      } else {
        setShowOnboarding(false);
        // Force a refresh of the auth context to update onboarding status
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show onboarding if needed
  if (showOnboarding) {
    return (
      <PreSignupOnboarding 
        onComplete={handleOnboardingComplete}
        skipAuth={!!user} // Skip auth if user is already signed in
      />
    );
  }

  const { data: properties, isLoading } = useQuery({
    queryKey: ['for-you-properties', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return [];

      const isRental = profile.property_type === 'rent';
      let query;
      
      if (isRental) {
        query = supabase
          .from('undervalued_rentals')
          .select('*')
          .eq('status', 'active')
          .order('discount_percent', { ascending: false });

        if (profile.max_budget) {
          query = query.lte('monthly_rent', profile.max_budget);
        }
        if (profile.bedrooms !== null && profile.bedrooms !== undefined) {
          query = query.eq('bedrooms', profile.bedrooms);
        }
        if (profile.preferred_neighborhoods && profile.preferred_neighborhoods.length > 0) {
          const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
          const selectedBoroughs = profile.preferred_neighborhoods.filter((n: string) => boroughs.includes(n));
          const selectedNeighborhoods = profile.preferred_neighborhoods.filter((n: string) => !boroughs.includes(n) && n !== 'Anywhere with a train');
          
          if (!profile.preferred_neighborhoods.includes('Anywhere with a train')) {
            let conditions = [];
            if (selectedBoroughs.length > 0) {
              conditions.push(`borough.in.(${selectedBoroughs.join(',')})`);
            }
            if (selectedNeighborhoods.length > 0) {
              const neighborhoodConditions = selectedNeighborhoods.map((n: string) => `neighborhood.ilike.%${n}%`);
              conditions.push(`or(${neighborhoodConditions.join(',')})`);
            }
            if (conditions.length > 0) {
              query = query.or(conditions.join(','));
            }
          }
        }
        if (profile.discount_threshold) {
          query = query.gte('discount_percent', profile.discount_threshold);
        }
      } else {
        query = supabase
          .from('undervalued_sales')
          .select('*')
          .eq('status', 'active')
          .order('discount_percent', { ascending: false });

        if (profile.max_budget) {
          query = query.lte('price', profile.max_budget);
        }
        if (profile.bedrooms !== null && profile.bedrooms !== undefined) {
          query = query.eq('bedrooms', profile.bedrooms);
        }
        if (profile.preferred_neighborhoods && profile.preferred_neighborhoods.length > 0) {
          const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
          const selectedBoroughs = profile.preferred_neighborhoods.filter((n: string) => boroughs.includes(n));
          const selectedNeighborhoods = profile.preferred_neighborhoods.filter((n: string) => !boroughs.includes(n) && n !== 'Anywhere with a train');
          
          if (!profile.preferred_neighborhoods.includes('Anywhere with a train')) {
            let conditions = [];
            if (selectedBoroughs.length > 0) {
              conditions.push(`borough.in.(${selectedBoroughs.join(',')})`);
            }
            if (selectedNeighborhoods.length > 0) {
              const neighborhoodConditions = selectedNeighborhoods.map((n: string) => `neighborhood.ilike.%${n}%`);
              conditions.push(`or(${neighborhoodConditions.join(',')})`);
            }
            if (conditions.length > 0) {
              query = query.or(conditions.join(','));
            }
          }
        }
        if (profile.discount_threshold) {
          query = query.gte('discount_percent', profile.discount_threshold);
        }
      }

      const { data, error } = await query.limit(50);
      if (error) {
        console.error('Error fetching properties:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user && onboardingCompleted,
  });

  if (!user || !onboardingCompleted) {
    return <div className="min-h-screen bg-black"></div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your personalized deals...</p>
        </div>
      </div>
    );
  }

  const filteredProperties = properties?.filter(property => 
    !viewedProperties.has(property.id)
  ) || [];

  const currentProperty = filteredProperties[currentIndex];
  const hasMoreProperties = currentIndex < filteredProperties.length - 1;
  const totalViewableProperties = Math.min(filteredProperties.length, subscriptionPlan === 'free' ? 3 : filteredProperties.length);

  const handleNext = () => {
    if (currentProperty) {
      const newViewed = new Set(viewedProperties);
      newViewed.add(currentProperty.id);
      setViewedProperties(newViewed);

      if (subscriptionPlan === 'free' && newViewed.size >= 3) {
        setShowSoftGate(true);
        return;
      }

      if (hasMoreProperties) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handlePass = () => {
    handleNext();
  };

  const handleSave = async () => {
    if (!currentProperty || !user) return;

    try {
      const { error } = await supabase
        .from('saved_properties')
        .insert([
          {
            user_id: user.id,
            property_id: currentProperty.id,
            property_type: currentProperty.monthly_rent ? 'rental' : 'sale',
            saved_at: new Date().toISOString()
          }
        ]);

      if (error && error.code !== '23505') { // Ignore duplicate key errors
        throw error;
      }

      toast({
        title: "Property Saved!",
        description: "Added to your saved properties.",
      });

      handleNext();
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Error",
        description: "Failed to save property. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!currentProperty && viewedProperties.size > 0) {
    return <EndOfMatchesScreen />;
  }

  if (!currentProperty) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">No matching properties found</h2>
          <p className="text-gray-400">Try adjusting your search criteria to see more results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">For You</h1>
            <div className="text-sm text-gray-400">
              {Math.min(currentIndex + 1, totalViewableProperties)} of {totalViewableProperties}
              {subscriptionPlan === 'free' && filteredProperties.length > 3 && (
                <span className="ml-1">• Free Preview</span>
              )}
            </div>
          </div>

          <PropertyCard
            property={currentProperty}
            onSave={handleSave}
            onPass={handlePass}
            isBlurred={subscriptionPlan === 'free'}
          />
        </div>
      </div>

      <SoftGateModal
        isOpen={showSoftGate}
        onClose={() => setShowSoftGate(false)}
      />
    </div>
  );
};

export default ForYou;

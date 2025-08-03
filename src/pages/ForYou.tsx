import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BeatLoader } from 'react-spinners';
import ListingCard from '@/components/ListingCard';
import { supabase } from '@/integrations/supabase/client';
import PreSignupOnboarding from '@/components/PreSignupOnboarding';

interface Listing {
  id: string;
  title: string;
  address: string;
  price: number;
  image_url: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  neighborhood: string;
  borough: string;
  description: string;
  amenities: string[];
  listing_url: string;
  source: string;
  discount_percent: number;
  monthly_rent?: number;
  rent_stabilized?: boolean;
  no_fee?: boolean;
}

const ForYou = () => {
  const { user, userProfile } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState({});
  const [step, setStep] = useState<'loading' | 'loaded' | 'error' | 'success'>('loading');

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      setStep('loading');

      try {
        if (!userProfile) {
          // Handle case where user profile is not available
          setError('User profile not found.');
          setStep('error');
          setLoading(false);
          return;
        }

        // Extract preferences from userProfile
        const {
          property_type,
          bedrooms,
          max_budget,
          preferred_neighborhoods,
          must_haves,
          discount_threshold,
        } = userProfile;

        // Construct the Supabase query based on user preferences
        let query = supabase
          .from(property_type === 'rent' ? 'undervalued_rentals' : 'undervalued_sales')
          .select('*')
          .eq('status', 'active')
          .order('discount_percent', { ascending: false })
          .limit(20);

        if (bedrooms) {
          query = query.eq('bedrooms', bedrooms);
        }
        if (max_budget) {
          query = query = query.lte(property_type === 'rent' ? 'monthly_rent' : 'price', max_budget);
        }
        if (discount_threshold) {
            query = query.gte('discount_percent', discount_threshold);
        }
        if (preferred_neighborhoods && preferred_neighborhoods.length > 0) {
          const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
          const selectedBoroughs = preferred_neighborhoods.filter(n => boroughs.includes(n));
          const selectedNeighborhoods = preferred_neighborhoods.filter(n => !boroughs.includes(n) && n !== 'Anywhere with a train');
          
          if (!preferred_neighborhoods.includes('Anywhere with a train')) {
            if (selectedBoroughs.length > 0) {
              query = query.in('borough', selectedBoroughs);
            }
            if (selectedNeighborhoods.length > 0) {
              const neighborhoodConditions = selectedNeighborhoods.map(n => `neighborhood.ilike.%${n}%`).join(',');
              query = query.or(neighborhoodConditions);
            }
          }
        }
        if (must_haves && must_haves.includes('No broker fee')) {
          query = query.eq('no_fee', true);
        }
        if (property_type === 'rent' && must_haves && must_haves.includes('Rent-stabilized')) {
          query = query.eq('rent_stabilized', true);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching listings:', error);
          setError('Failed to load listings.');
          setStep('error');
        } else {
          setListings(data || []);
          setStep('loaded');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred.');
        setStep('error');
      } finally {
        setLoading(false);
        setTimeout(() => setStep('success'), 1500);
      }
    };

    if (userProfile) {
      fetchListings();
    } else {
      // Handle case where user profile is not immediately available
      // You might want to show a loading state or a message
      setLoading(false);
      setError('Loading user profile...');
    }
  }, [userProfile]);

    // Add this new useEffect for logged-out user redirect
  useEffect(() => {
    // Only redirect if user is not logged in and we've completed the loading animation
    if (!user && !loading && step === 'success') {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 2000); // Wait 2 seconds after success screen before redirecting
      
      return () => clearTimeout(timer);
    }
  }, [user, loading, step]);

  const handleOnboardingComplete = (data: any) => {
    setOnboardingData(data);
    // Optionally, you can handle the data here, e.g., save it to local storage or a context
    console.log('Onboarding data:', data);
  };

  if (showOnboarding) {
    return <PreSignupOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="container mx-auto py-8">
      {loading && step === 'loading' && (
        <div className="flex flex-col items-center justify-center h-screen">
          <BeatLoader color="#fff" loading={loading} size={24} />
          <p className="mt-4 text-white">Finding deals in your area...</p>
        </div>
      )}

      {error && step === 'error' && (
        <div className="text-red-500 text-center">Error: {error}</div>
      )}

      {!loading && !error && step === 'loaded' && listings.length === 0 && (
        <div className="text-white text-center">No listings found based on your preferences.</div>
      )}

      {step === 'success' && !user && (
        <div className="flex flex-col items-center justify-center h-screen text-white">
          <h2 className="text-3xl font-bold mb-4">Your dream homes await.</h2>
          <p className="text-gray-400">Creating your personalized list of deals...</p>
        </div>
      )}

      {!loading && !error && step === 'loaded' && listings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ForYou;

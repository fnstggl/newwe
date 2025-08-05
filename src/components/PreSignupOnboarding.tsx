import React, { useState, useEffect } from 'react';
import OnboardingStep from './OnboardingStep';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { HoverButton } from './ui/hover-button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getSimilarNeighborhoods, normalizeNeighborhoodForSimilar } from '../data/similarNeighborhoods';

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

interface PreSignupOnboardingProps {
  onComplete: (data: OnboardingData, adjustedFilters?: OnboardingData | null) => void;
}

const PreSignupOnboarding: React.FC<PreSignupOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [scanningProgress, setScanningProgress] = useState(0);
  const [scanningStage, setScanningStage] = useState(0);
  const [matchedListings, setMatchedListings] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [currentLiveCount, setCurrentLiveCount] = useState(0);
  const [lastUpdatedFilter, setLastUpdatedFilter] = useState<string>('');
  const [hasInitiallyAnimated, setHasInitiallyAnimated] = useState<{[key: number]: boolean}>({});
  const [isCheckingSimilar, setIsCheckingSimilar] = useState(false);
  const [similarListingsFound, setSimilarListingsFound] = useState(0);
  const [usedSimilarFilters, setUsedSimilarFilters] = useState<Partial<OnboardingData> | null>(null);
  const [finalFiltersToSave, setFinalFiltersToSave] = useState<Partial<OnboardingData> | null>(null);
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  

  const totalSteps = 8;

  const scanningStages = [
    "Analyzing market trends...",
    "Looking for properties in your budget...",
    "Scanning for rent-stabilized units...",
    "Cross-referencing your wishlist...",
    "✅ Found matching listings"
  ];

 const neighborhoods = [
  "Manhattan", "Brooklyn", "Queens", "Bronx", "Carroll Gardens", "Bed-Stuy", "Williamsburg", "Astoria", 
  "Long Island City", "Park Slope", "Greenpoint", "Bushwick",
  "Crown Heights", "Sunset Park", "Red Hook", "Dumbo",
  "Fort Greene", "Prospect Heights", "Chelsea", "SoHo",
  "East Village", "West Village", "Lower East Side", "Tribeca",
  "Financial District", "Midtown", "Upper East Side", "Upper West Side",
  "Harlem", "Washington Heights", "Inwood", "Jackson Heights",
  "Elmhurst", "Forest Hills", "Flushing",
  
  // NEW NEIGHBORHOODS ADDED FROM LIST 2:
  // Manhattan
  "Kips Bay", "Midtown East", "Midtown West", "Hell's Kitchen",
  "Morningside Heights", "Hamilton Heights", "Greenwich Village",
  "NoHo", "Civic Center", "Hudson Square", "Roosevelt Island",
  "Hudson Yards", "NoMad", "Manhattan Valley", "Central Harlem",
  "Little Italy", "NoLita", "Two Bridges", "Murray Hill",
  "Battery Park City",
  
  // Brooklyn
  "Prospect Lefferts Gardens", "Vinegar Hill", "Windsor Terrace",
  "Cobble Hill", "Boerum Hill", "Gowanus", "Clinton Hill",
  "Downtown Brooklyn", "Columbia St Waterfront District",
  "Brooklyn Heights", "Ditmas Park",
  
  // Queens
  "Corona", "Ridgewood", "Maspeth", "Rego Park", "Bayside",
  "Ditmars Steinway", "Sunnyside", "Woodside", "Briarwood",
  "Fresh Meadows",
  
  // Bronx
  "Kingsbridge", "Norwood", "Mott Haven", "Melrose", "South Bronx",
  "Concourse",
  
  "Anywhere with a train"
];

  const rentalMustHaveOptions = [
    "Rent-stabilized", "No broker fee", "Pet-friendly", "Outdoor space",
    "In-unit laundry", "Doorman", "Gym", "Rooftop access"
  ];

  const salesMustHaveOptions = [
    "No broker fee", "Pet-friendly", "Outdoor space",
    "In-unit laundry", "Doorman", "Gym", "Rooftop access"
  ];

  // Helper function to normalize neighborhood names for matching
  const normalizeNeighborhoodName = (name: string): string => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')  // Replace spaces with hyphens
      .replace(/'/g, '');    // Remove apostrophes
  };

  // Helper function to get neighborhood variations for flexible matching
  const getNeighborhoodVariations = (neighborhood: string): string[] => {
    const variations = [neighborhood.toLowerCase()];
    
    // Add hyphenated version
    variations.push(neighborhood.toLowerCase().replace(/\s+/g, '-'));
    
    // Add version without apostrophes and spaces replaced with hyphens
    variations.push(neighborhood.toLowerCase().replace(/['\s]/g, '').replace(/-+/g, '-'));
    
    // Add version with spaces replaced by hyphens and apostrophes removed
    variations.push(neighborhood.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-'));
    
    return variations;
  };

  // Get live counts for filters with fallback logic
  const getLiveCount = async (filters: Partial<OnboardingData>, trySimilar = false): Promise<{ direct: number; similar: number; adjustedFilters?: Partial<OnboardingData> }> => {
    try {
      const propertyType = filters.property_type || onboardingData.property_type;
      
      // First try with direct filters
      const directCount = await getDirectListingCount(filters, propertyType);
      
      if (directCount > 0 || !trySimilar) {
        return { direct: directCount, similar: 0 };
      }

      // If no direct results and trySimilar is true, try fallback strategies
      let adjustedFilters = { ...filters };
      let similarCount = 0;

      // Strategy 1: Remove must-haves (except rent-stabilized for rentals)
      if (adjustedFilters.must_haves && adjustedFilters.must_haves.length > 0) {
        const originalMustHaves = [...adjustedFilters.must_haves];
        if (propertyType === 'rent') {
          adjustedFilters.must_haves = adjustedFilters.must_haves.filter(item => item === 'Rent-stabilized');
        } else {
          adjustedFilters.must_haves = [];
        }
        
        similarCount = await getDirectListingCount(adjustedFilters, propertyType);
        if (similarCount > 0) {
          return { direct: 0, similar: similarCount, adjustedFilters };
        }
        adjustedFilters.must_haves = originalMustHaves; // Reset for next strategy
      }

      // Strategy 2: Try similar neighborhoods
      if (adjustedFilters.preferred_neighborhoods && adjustedFilters.preferred_neighborhoods.length > 0) {
        const originalNeighborhoods = [...adjustedFilters.preferred_neighborhoods];
        const allSimilarNeighborhoods = new Set<string>();
        
        originalNeighborhoods.forEach(neighborhood => {
          if (neighborhood !== 'Anywhere with a train' && !['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'].includes(neighborhood)) {
            const similar = getSimilarNeighborhoods(neighborhood);
            similar.forEach(s => allSimilarNeighborhoods.add(s));
          }
        });

        if (allSimilarNeighborhoods.size > 0) {
          adjustedFilters.preferred_neighborhoods = [...originalNeighborhoods, ...Array.from(allSimilarNeighborhoods)];
          similarCount = await getDirectListingCount(adjustedFilters, propertyType);
          if (similarCount > 0) {
            return { direct: 0, similar: similarCount, adjustedFilters };
          }
        }
        adjustedFilters.preferred_neighborhoods = originalNeighborhoods; // Reset for next strategy
      }

      // Strategy 3: Reduce bedrooms (if not already studio)
      if (adjustedFilters.bedrooms && adjustedFilters.bedrooms > 0) {
        const originalBedrooms = adjustedFilters.bedrooms;
        adjustedFilters.bedrooms = originalBedrooms - 1;
        similarCount = await getDirectListingCount(adjustedFilters, propertyType);
        if (similarCount > 0) {
          return { direct: 0, similar: similarCount, adjustedFilters };
        }
        adjustedFilters.bedrooms = originalBedrooms; // Reset for next strategy
      }

      // Strategy 4: Increase budget by 20% increments until we find at least 3 listings
      if (adjustedFilters.max_budget) {
        const originalBudget = adjustedFilters.max_budget;
        let budgetMultiplier = 1.2;
        
        while (budgetMultiplier <= 2.0) { // Don't go beyond 2x original budget
          adjustedFilters.max_budget = Math.round(originalBudget * budgetMultiplier);
          similarCount = await getDirectListingCount(adjustedFilters, propertyType);
          if (similarCount >= 3) {
            return { direct: 0, similar: similarCount, adjustedFilters };
          }
          budgetMultiplier += 0.2;
        }
      }

      return { direct: 0, similar: 0 };

    } catch (error) {
      console.error('Error getting live count:', error);
      return { direct: 0, similar: 0 };
    }
  };

  const getDirectListingCount = async (filters: Partial<OnboardingData>, propertyType?: string): Promise<number> => {
    try {
      if (propertyType === 'rent') {
        // Count from undervalued_rentals
        let rentalQuery = supabase
          .from('undervalued_rentals')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active');

        // Count from undervalued_rent_stabilized
        let stabilizedQuery = supabase
          .from('undervalued_rent_stabilized')
          .select('id', { count: 'exact', head: true })
          .eq('display_status', 'active');

        // Apply filters to both queries
        if (filters.max_budget) {
          rentalQuery = rentalQuery.lte('monthly_rent', filters.max_budget);
          stabilizedQuery = stabilizedQuery.lte('monthly_rent', filters.max_budget);
        }
        if (filters.bedrooms !== undefined) {
          rentalQuery = rentalQuery.eq('bedrooms', filters.bedrooms);
          stabilizedQuery = stabilizedQuery.eq('bedrooms', filters.bedrooms);
        }
        if (filters.preferred_neighborhoods && filters.preferred_neighborhoods.length > 0) {
          const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
          const selectedBoroughs = filters.preferred_neighborhoods.filter(n => boroughs.includes(n));
          let selectedNeighborhoods = filters.preferred_neighborhoods.filter(n => !boroughs.includes(n) && n !== 'Anywhere with a train');
          
          if (!filters.preferred_neighborhoods.includes('Anywhere with a train')) {
            if (selectedBoroughs.length > 0) {
              rentalQuery = rentalQuery.in('borough', selectedBoroughs);
              stabilizedQuery = stabilizedQuery.in('borough', selectedBoroughs);
            }
            if (selectedNeighborhoods.length > 0) {
              // Create flexible neighborhood matching conditions
              const neighborhoodConditions: string[] = [];
              selectedNeighborhoods.forEach(neighborhood => {
                const variations = getNeighborhoodVariations(neighborhood);
                variations.forEach(variation => {
                  neighborhoodConditions.push(`neighborhood.ilike.%${variation}%`);
                });
              });
              const conditionString = neighborhoodConditions.join(',');
              rentalQuery = rentalQuery.or(conditionString);
              stabilizedQuery = stabilizedQuery.or(conditionString);
            }
          }
        }
        if (filters.discount_threshold) {
          rentalQuery = rentalQuery.gte('discount_percent', filters.discount_threshold);
          stabilizedQuery = stabilizedQuery.gte('undervaluation_percent', filters.discount_threshold);
        }
        if (filters.must_haves && filters.must_haves.includes('No broker fee')) {
          rentalQuery = rentalQuery.eq('no_fee', true);
        }
        if (filters.must_haves && filters.must_haves.includes('Rent-stabilized')) {
          // Only count stabilized rentals if this filter is selected
          const { count: stabilizedCount } = await stabilizedQuery;
          return stabilizedCount || 0;
        }

        const [rentalResult, stabilizedResult] = await Promise.all([
          rentalQuery,
          stabilizedQuery
        ]);

        return (rentalResult.count || 0) + (stabilizedResult.count || 0);

      } else if (propertyType === 'buy') {
        let query = supabase
          .from('undervalued_sales')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active');

        if (filters.max_budget) {
          query = query.lte('price', filters.max_budget);
        }
        if (filters.bedrooms !== undefined) {
          query = query.eq('bedrooms', filters.bedrooms);
        }
        if (filters.preferred_neighborhoods && filters.preferred_neighborhoods.length > 0) {
          const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
          const selectedBoroughs = filters.preferred_neighborhoods.filter(n => boroughs.includes(n));
          let selectedNeighborhoods = filters.preferred_neighborhoods.filter(n => !boroughs.includes(n) && n !== 'Anywhere with a train');
          
          if (!filters.preferred_neighborhoods.includes('Anywhere with a train')) {
            if (selectedBoroughs.length > 0) {
              query = query.in('borough', selectedBoroughs);
            }
            if (selectedNeighborhoods.length > 0) {
              // Create flexible neighborhood matching conditions
              const neighborhoodConditions: string[] = [];
              selectedNeighborhoods.forEach(neighborhood => {
                const variations = getNeighborhoodVariations(neighborhood);
                variations.forEach(variation => {
                  neighborhoodConditions.push(`neighborhood.ilike.%${variation}%`);
                });
              });
              const conditionString = neighborhoodConditions.join(',');
              query = query.or(conditionString);
            }
          }
        }
        if (filters.discount_threshold) {
          query = query.gte('discount_percent', filters.discount_threshold);
        }

        const { count } = await query;
        return count || 0;
      }
    } catch (error) {
      console.error('Error getting direct listing count:', error);
    }
    return 0;
  };

 // NEW useEffect for step 6 initialization - ADD THIS ONE
useEffect(() => {
  // Initialize live count for step 6 (below-market slider) when it loads
  if (currentStep === 6 && !onboardingData.discount_threshold) {
    // Set default discount threshold and get live count
    const defaultThreshold = 20;
    const newData = { ...onboardingData, discount_threshold: defaultThreshold };
    setOnboardingData(newData);
    setLastUpdatedFilter('discount_threshold');
    
    getLiveCount(newData, false).then(result => {
      setCurrentLiveCount(result.direct);
      if (result.direct === 0) {
        setIsCheckingSimilar(true);
        getLiveCount(newData, true).then(similarResult => {
          setIsCheckingSimilar(false);
          setSimilarListingsFound(similarResult.similar);
          if (similarResult.adjustedFilters) {
            setUsedSimilarFilters(similarResult.adjustedFilters);
          }
        });
      }
    });
  }
}, [currentStep]);

// EXISTING useEffect for step 7 scanning - KEEP AS IS
useEffect(() => {
  if (currentStep === 7) {
    const interval = setInterval(() => {
      setScanningProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress <= 20) setScanningStage(0);
        else if (newProgress <= 40) setScanningStage(1);
        else if (newProgress <= 60) setScanningStage(2);
        else if (newProgress <= 80) setScanningStage(3);
        else if (newProgress <= 100) {
          setScanningStage(4);
          getLiveCount(onboardingData, true).then(result => {
            if (result.direct > 0) {
              setMatchedListings(result.direct);
              setFinalFiltersToSave(onboardingData);
            } else if (result.similar > 0) {
              setMatchedListings(result.similar);
              setUsedSimilarFilters(result.adjustedFilters || null);
              setFinalFiltersToSave(result.adjustedFilters || null);
            } else {
              setMatchedListings(0);
              setFinalFiltersToSave(onboardingData);
            }
          });
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setCurrentStep(8), 1500);
        }
        return Math.min(newProgress, 100);
      });
    }, 80);
    
    return () => clearInterval(interval);
  }
}, [currentStep, onboardingData]);

// YOUR EXISTING updateData, nextStep, prevStep functions stay exactly the same
const updateData = (key: keyof OnboardingData, value: any) => {
  const newData = { ...onboardingData, [key]: value };
  setOnboardingData(newData);
  setLastUpdatedFilter(key);
  
  // Update live count when relevant filters change
  if (['bedrooms', 'max_budget', 'preferred_neighborhoods', 'discount_threshold', 'must_haves'].includes(key)) {
    setIsCheckingSimilar(false);
    setSimilarListingsFound(0);
    setUsedSimilarFilters(null);
    
    getLiveCount(newData, false).then(result => {
      setCurrentLiveCount(result.direct);
      if (result.direct === 0) {
        setIsCheckingSimilar(true);
        getLiveCount(newData, true).then(similarResult => {
          setIsCheckingSimilar(false);
          setSimilarListingsFound(similarResult.similar);
          if (similarResult.adjustedFilters) {
            setUsedSimilarFilters(similarResult.adjustedFilters);
          }
        });
      }
    });
  }
};

const nextStep = () => {
  if (currentStep < totalSteps) {
    setCurrentStep(currentStep + 1);
  } else {
    onComplete(onboardingData, finalFiltersToSave);
  }
};

const prevStep = () => {
  if (currentStep > 1) {
    setCurrentStep(currentStep - 1);
  }
};

  const handleArrayToggle = (key: keyof OnboardingData, value: string) => {
    const currentArray = (onboardingData[key] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateData(key, newArray);
  };

  const ChoiceButton = ({ 
    children, 
    selected, 
    onClick, 
    delay = 0 
  }: { 
    children: React.ReactNode; 
    selected?: boolean; 
    onClick: () => void;
    delay?: number;
  }) => {
    const stepAnimated = hasInitiallyAnimated[currentStep];
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setHasInitiallyAnimated(prev => ({ ...prev, [currentStep]: true }));
      }, delay + 600); // 600ms is your animation duration
      
      return () => clearTimeout(timer);
    }, [currentStep, delay]);
  
    return (
      <button
        onClick={onClick}
        className={`w-full p-4 rounded-2xl border-2 hover:shadow-lg hover:shadow-white/10 ${
    stepAnimated ? 'opacity-100' : 'opacity-0 animate-slide-up'
  } ${
    selected
      ? 'border-white bg-white text-black'
      : 'border-gray-600 bg-transparent text-white hover:border-gray-400'
  }`}
  style={!stepAnimated ? { 
    animationDelay: `${delay}ms`,
    animationFillMode: 'forwards'
  } : {}}
      >
        {children}
      </button>
    );
  };

 const TagButton = ({ 
  children, 
  selected, 
  onClick, 
  delay = 0,
  noAnimation = false
}: { 
  children: React.ReactNode; 
  selected?: boolean; 
  onClick: () => void;
  delay?: number;
  noAnimation?: boolean;
}) => {
  const stepAnimated = hasInitiallyAnimated[currentStep];
  
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border transition-transform duration-200 ease-out hover:scale-105 ${
        (stepAnimated || noAnimation) ? 'opacity-100' : 'opacity-0 animate-slide-up'
      } ${
        selected
          ? 'border-white bg-white text-black'
          : 'border-gray-600 bg-transparent text-white hover:border-gray-400'
      }`}
      style={(!stepAnimated && !noAnimation) ? { 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      } : {}}
    >
      {children}
    </button>
  );
};

  const saveOnboardingData = async (userId: string) => {
    try {
      // Use the final filters that were determined during the scanning process
      const dataToSave = finalFiltersToSave || onboardingData;
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
        .eq('id', userId);

      if (error) {
        console.error('Error saving onboarding data:', error);
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
          
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await saveOnboardingData(user.id);
          }
          
          // Use window.location.href to force a full page navigation
          window.location.href = '/foryou';
        }
      } else {
        const { error } = await signUp(email, password, name);
        
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully.",
          });
          
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await saveOnboardingData(user.id);
          }
          
          // Use window.location.href to force a full page navigation
          window.location.href = '/foryou';
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await saveOnboardingData(user.id);
        }
        // Use window.location.href to force a full page navigation
        window.location.href = '/foryou';
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Helper function to get the live count display text
  const getLiveCountDisplay = (filterKey: string) => {
    if (lastUpdatedFilter !== filterKey) return '';
    
    if (isCheckingSimilar) {
      return '(checking similar...)';
    }
    
    if (currentLiveCount > 0) {
      return `(${currentLiveCount.toLocaleString()} perfect matches)`;
    } else if (similarListingsFound > 0) {
      return `(0 direct matches, ${similarListingsFound.toLocaleString()} similar found)`;
    } else {
      return '(0 listings found)';
    }
  };

  const renderStep = () => {
    switch (currentStep) {
case 0:
  return (
    <div className="min-h-screen bg-black text-white font-inter flex flex-col items-center justify-center px-6 py-4 overflow-hidden">
      {/* Back arrow */}
      <div className="fixed top-8 left-8 z-50">
        <button
          onClick={() => window.history.back()}
          className="p-3 rounded-full bg-transparent hover:bg-gray-800/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 max-w-4xl w-full pt-8">
        {/* Product mockup image - compact size */}
        <div className="w-full flex justify-center">
          <img 
            src="/lovable-uploads/marketing-image-3.jpg" 
            alt="Found your match interface showing property details and search" 
            className="max-w-xl md:max-w-2xl w-full h-auto rounded-2xl shadow-2xl opacity-0 animate-fade-in"
            style={{
              animationDelay: '0.3s',
              animationDuration: '1.2s',
              animationFillMode: 'forwards'
            }}
          />
        </div>
        
        {/* Text content - compact spacing */}
        <div className="text-center space-y-3 md:space-y-4 max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter">
            Describe the deals you want.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 tracking-tight px-4">
            We'll find you personalized listings in 15 seconds.
          </p>
          
          <div className="pt-4 md:pt-6">
            <button
              onClick={() => setCurrentStep(1)}
              className="bg-white text-black px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl tracking-tighter hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300 shadow-xl"
            >
              Start Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

case 1:
  return (
    <>
      {/* Back arrow for first step */}
      <div className="fixed top-8 left-8 z-50">
        <button
          onClick={() => window.history.back()}
          className="p-3 rounded-full bg-transparent hover:bg-gray-800/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <OnboardingStep
         key={`step-${currentStep}`}
        step={currentStep}
        totalSteps={totalSteps}
        title="How long have you been searching?"
      >
            <div className="space-y-4">
              {['Just started', '1–3 months', '3–6 months', 'Over 6 months'].map((option, index) => (
                <ChoiceButton
                  key={`${currentStep}-${option}`} 
                  selected={onboardingData.search_duration === option}
                  onClick={() => {
                    updateData('search_duration', option);
                    setTimeout(nextStep, 100); // ← Add this back!
                  }}
                  delay={index * 100}
                >
                  {option}
                </ChoiceButton>
              ))}
            </div>
          </OnboardingStep>
        </>
        );

      case 2:
  return (
    <OnboardingStep
       key={`step-${currentStep}`}
      step={currentStep}
      totalSteps={totalSteps}
      title="What's been the most frustrating part?"
      subtitle="Select all that apply"
    >
      <div className="space-y-4">
        {[
          'Every good listing is gone in 24 hours',
          'I can\'t find anything nice I can actually afford',
          'Broker\'s fees are way too high',
          'Rent keeps climbing year after year'
        ].map((option, index) => (
          <ChoiceButton
            key={`${currentStep}-${option}`}
            selected={onboardingData.frustrations?.includes(option)}
            onClick={() => handleArrayToggle('frustrations', option)}
            delay={index * 100}
          >
            {option}
          </ChoiceButton>
        ))}
      </div>
      <button
        onClick={nextStep}
        disabled={!onboardingData.frustrations?.length}
        className="mt-8 w-full p-4 bg-white text-black rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300"
      >
        Next
      </button>
    </OnboardingStep>
  );

      case 3:
        return (
          <OnboardingStep
             key={`step-${currentStep}`}
            step={currentStep}
            totalSteps={totalSteps}
            title="Who are you searching for?"
          >
            <div className="space-y-4">
              {['Just me', 'Me + partner', 'Me + family', 'Other'].map((option, index) => (
                <ChoiceButton
                  key={`${currentStep}-${option}`}
                  selected={onboardingData.searching_for === option}
                  onClick={() => {
                    updateData('searching_for', option);
                    setTimeout(nextStep, 100);
                  }}
                  delay={index * 100}
                >
                  {option}
                </ChoiceButton>
              ))}
            </div>
          </OnboardingStep>
        );

      case 4:
        return (
          <OnboardingStep
             key={`step-${currentStep}`}
            step={currentStep}
            totalSteps={totalSteps}
            title="Are you looking to buy or rent?"
          >
            <div className="flex gap-4">
              {['rent', 'buy'].map((option, index) => (
                <ChoiceButton
                  key={`${currentStep}-${option}`}
                  selected={onboardingData.property_type === option}
                  onClick={() => {
                    updateData('property_type', option);
                    setTimeout(nextStep, 100);
                  }}
                  delay={index * 200}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </ChoiceButton>
              ))}
            </div>
          </OnboardingStep>
        );

      case 5:
        const isRental = onboardingData.property_type === 'rent';
        const maxBudget = isRental ? 8000 : 8000000;
        const minBudget = isRental ? 1000 : 200000;
        const step = isRental ? 100 : 50000;
        const defaultBudget = isRental ? 3000 : 1000000;
        
        return (
          <div className="min-h-screen bg-black text-white">
            <div className="fixed top-8 left-8 z-50">
              <button
                onClick={prevStep}
                className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gray-800 rounded-full overflow-hidden z-40">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>

            <div className="pt-24 pb-32 px-4 max-h-screen overflow-y-auto">
              <div className="max-w-lg w-full mx-auto text-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Describe your dream deal
                  </h1>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Bedrooms {getLiveCountDisplay('bedrooms')}
                    </h3>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {[0, 1, 2, 3, 4, '5+'].map((bed, index) => (
                        <button
                          key={`${currentStep}-${bed}`}
                          onClick={() => updateData('bedrooms', bed === '5+' ? 5 : bed)}
                          className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                            onboardingData.bedrooms === (bed === '5+' ? 5 : bed)
                              ? 'border-white bg-white text-black'
                              : 'border-gray-600 bg-transparent text-white hover:border-gray-400'
                          }`}
                        >
                          {bed}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Max Budget {getLiveCountDisplay('max_budget')}
                    </h3>
                    <div className="space-y-6">
                     <Slider
  value={[onboardingData.max_budget || defaultBudget]}
  onValueChange={(value) => updateData('max_budget', value[0])}
  max={maxBudget}
  min={minBudget}
  step={step}
  className="w-full onboarding-slider"
/>
                      <div className="flex justify-between text-sm text-gray-400">
                        {isRental ? (
                          <>
                            <span>$1K</span>
                            <span>$3K</span>
                            <span>$5K</span>
                            <span>$8K+</span>
                          </>
                        ) : (
                          <>
                            <span>$200K</span>
                            <span>$2M</span>
                            <span>$4M</span>
                            <span>$8M+</span>
                          </>
                        )}
                      </div>
                      <p className="text-center text-xl font-semibold">
                        {isRental 
                          ? `$${(onboardingData.max_budget || defaultBudget).toLocaleString()}/month`
                          : `$${(onboardingData.max_budget || defaultBudget).toLocaleString()}`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Neighborhoods {getLiveCountDisplay('preferred_neighborhoods')}
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
  {neighborhoods.map((neighborhood, index) => (
    <TagButton
      key={`${currentStep}-${neighborhood}`}
      selected={onboardingData.preferred_neighborhoods?.includes(neighborhood)}
      onClick={() => handleArrayToggle('preferred_neighborhoods', neighborhood)}
      delay={index * 20}
      noAnimation={lastUpdatedFilter === 'preferred_neighborhoods' || lastUpdatedFilter === 'max_budget'}
    >
      {neighborhood}
    </TagButton>
  ))}
</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Must-haves {getLiveCountDisplay('must_haves')}
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
  {(isRental ? rentalMustHaveOptions : salesMustHaveOptions).map((option, index) => (
    <TagButton
      key={`${currentStep}-${option}`}
      selected={onboardingData.must_haves?.includes(option)}
      onClick={() => handleArrayToggle('must_haves', option)}
      delay={index * 50}
      noAnimation={lastUpdatedFilter === 'must_haves' || lastUpdatedFilter === 'max_budget'}
    >
      {option}
    </TagButton>
  ))}
</div>
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full p-4 bg-white text-black rounded-full font-semibold hover:scale-105 transition-all duration-300 animate-scale-in"
                  >
                    Find my deals →
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <OnboardingStep
             key={`step-${currentStep}`}
            step={currentStep}
            totalSteps={totalSteps}
            title="How good of a deal do you want?"
            subtitle="How far below market do you want to go?"
          >
            <div className="space-y-8">
              <div className="space-y-6">
                <Slider
  value={[onboardingData.discount_threshold || 20]}
  onValueChange={(value) => updateData('discount_threshold', value[0])}
  max={50}
  min={10}
  step={5}
  className="w-full animate-slide-in-left onboarding-slider"
/>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>10%</span>
                  <span>20%</span>
                  <span>30%</span>
                  <span>40%+</span>
                </div>
               <p className="text-center text-xl font-semibold">
  {onboardingData.discount_threshold || 20}% below market
  {getLiveCountDisplay('discount_threshold')}
</p>
              </div>

              <button
                onClick={nextStep}
                className="w-full p-4 bg-white text-black rounded-full font-semibold hover:scale-105 transition-all duration-300"
              >
                Continue
              </button>
            </div>
          </OnboardingStep>
        );

     case 7:
  return (
    <OnboardingStep
       key={`step-${currentStep}`}
      step={currentStep}
      totalSteps={totalSteps}
      title="Scanning NYC listings..."
    >
      <div className="space-y-8">
        {/* Custom Progress Bar */}
        <div className="w-full h-2 bg-black rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${scanningProgress}%` }}
          />
        </div>
        
        <div className="space-y-4">
          {scanningStages.map((stage, index) => (
            <div
              key={stage}
              className={`text-left transition-all duration-500 font-inter font-semibold tracking-tighter ${
                index <= scanningStage 
                  ? index === scanningStage 
                    ? 'text-white opacity-100' 
                    : 'text-green-400 opacity-100'
                  : 'text-gray-600 opacity-50'
              }`}
            >
              {index === 4 && scanningStage >= 4 
                ? `✅ Found ${matchedListings} matching listings` 
                : stage}
            </div>
          ))}
        </div>
      </div>
    </OnboardingStep>
  );

      case 8:
        const finalListingCount = matchedListings;
        const hasDirectMatches = currentLiveCount > 0 || !usedSimilarFilters;
        const listingText = hasDirectMatches 
          ? `We found ${finalListingCount} listings exactly like your dream home.`
          : `We found ${finalListingCount} listings similar to your dream home.`;
        
        return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {listingText}
                </h1>
                <p className="text-gray-400 text-lg">
                  Sign up to see your personalized list of deals
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full py-4 px-4 bg-black border-2 border-white text-white hover:bg-gray-900 rounded-full text-lg font-semibold tracking-tight transition-all flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>{isGoogleLoading ? "Signing in..." : `Continue with Google`}</span>
                </button>

                <div className="flex items-center space-x-4">
                  <div className="flex-1 h-px bg-gray-700"></div>
                  <span className="text-gray-400 text-sm tracking-tight">or</span>
                  <div className="flex-1 h-px bg-gray-700"></div>
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-4 bg-gray-900/50 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-tight text-lg"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your.email@domain.com"
                    className="w-full px-4 py-4 bg-gray-900/50 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-tight text-lg"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-4 pr-12 bg-gray-900/50 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-tight text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <HoverButton
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 text-lg font-semibold tracking-tight bg-white text-black hover:bg-gray-100"
                >
                  {isLoading ? (isLogin ? "Signing in..." : "Creating Account...") : (isLogin ? "Sign In" : "Join Now")}
                </HoverButton>

                <p className="text-center text-gray-500 text-sm tracking-tight">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-white underline"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {currentStep !== 5 && currentStep > 1 && currentStep < 8 && (
        <div className="fixed top-8 left-8 z-50">
          <button
            onClick={prevStep}
            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      )}
      {renderStep()}
    </div>
  );
};

export default PreSignupOnboarding;

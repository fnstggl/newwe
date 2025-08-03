import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, ChevronDown, ChevronUp, X, Filter } from "lucide-react";
import { Toggle, GooeyFilter } from "@/components/ui/liquid-toggle";
import { HoverButton } from "@/components/ui/hover-button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetail from "@/components/PropertyDetail";
import SoftGateModal from "@/components/SoftGateModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

type SupabaseUndervaluedRentals = Tables<'undervalued_rentals'>;
type SupabaseUndervaluedRentStabilized = Tables<'undervalued_rent_stabilized'>;

const Rent = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const { listingId } = useParams();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [maxPrice, setMaxPrice] = useState("3500");
  const [bedrooms, setBedrooms] = useState("");
  const [minGrade, setMinGrade] = useState("");
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [showNeighborhoodDropdown, setShowNeighborhoodDropdown] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [neighborhoodSearchTerm, setNeighborhoodSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Additional filters state
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);
  const [selectedBoroughs, setSelectedBoroughs] = useState<string[]>([]);
  const [minSqft, setMinSqft] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [minDiscount, setMinDiscount] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [showBoroughDropdown, setShowBoroughDropdown] = useState(false);
  const [rentStabilizedOnly, setRentStabilizedOnly] = useState(false);
  const boroughDropdownRef = useRef<HTMLDivElement>(null);

  // Mobile filters state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Soft-gate modal state
  const [softGateModal, setSoftGateModal] = useState<{
    isOpen: boolean;
    property: any;
    isLoggedOut: boolean;
  }>({
    isOpen: false,
    property: null,
    isLoggedOut: false
  });

  const ITEMS_PER_PAGE = 24;
  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];
  const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx'];
  const discountOptions = ['50%', '45%', '40%', '35%', '30%', '25%', '20%', '15%'];
  const sortOptions = [
    'Featured',
    'Price: Low to High',
    'Price: High to Low',
    'Sqft: Low to High',
    'Sqft: High to Low',
    'Score: Low to High',
    'Score: High to Low',
    'Newest Listed'
  ];

  // Determine visibility limits based on user status
  const getVisibilityLimit = () => {
    if (!user) return 6; // Signed out users see 6
    if (userProfile?.subscription_plan === 'unlimited' || userProfile?.subscription_plan === 'open_door_plan') return Infinity; // Unlimited and open_door_plan users see all
    return 24; // Free plan users see 24
  };

  useEffect(() => {
    if (listingId && properties.length > 0) {
      const property = properties.find(p => p.listing_id === listingId);
      if (property) {
        setSelectedProperty(property);
      }
    }
  }, [listingId, properties]);

  useEffect(() => {
    fetchNeighborhoods();
    fetchProperties(true);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProperties(true);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, zipCode, maxPrice, bedrooms, minGrade, selectedNeighborhoods, selectedBoroughs, minSqft, addressSearch, minDiscount, sortBy, rentStabilizedOnly]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNeighborhoodDropdown(false);
      }
      if (boroughDropdownRef.current && !boroughDropdownRef.current.contains(event.target as Node)) {
        setShowBoroughDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Update meta tags for SEO
    document.title = "Rent NYC Apartments - Find Undervalued Rentals | Realer Estate";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find undervalued NYC rental apartments with advanced algorithms. Rent smarter with real-time market analysis and transparent pricing data.');
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', 'Find undervalued NYC rental apartments with advanced algorithms. Rent smarter with real-time market analysis and transparent pricing data.');
      document.head.appendChild(metaDescription);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://realerestate.org/rent');
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', 'https://realerestate.org/rent');
      document.head.appendChild(canonical);
    }

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Rent NYC Apartments - Find Undervalued Rentals | Realer Estate');
    } else {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', 'Rent NYC Apartments - Find Undervalued Rentals | Realer Estate');
      document.head.appendChild(ogTitle);
    }
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Find undervalued NYC rental apartments with advanced algorithms. Your unfair advantage in rentals.');
    } else {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.setAttribute('content', 'Find undervalued NYC rental apartments with advanced algorithms. Your unfair advantage in rentals.');
      document.head.appendChild(ogDescription);
    }
    
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://realerestate.org/rent');
    } else {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      ogUrl.setAttribute('content', 'https://realerestate.org/rent');
      document.head.appendChild(ogUrl);
    }

    // Update Twitter tags
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', 'Rent NYC Apartments - Find Undervalued Rentals | Realer Estate');
    } else {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      twitterTitle.setAttribute('content', 'Rent NYC Apartments - Find Undervalued Rentals | Realer Estate');
      document.head.appendChild(twitterTitle);
    }
    
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Find undervalued NYC rental apartments with advanced algorithms. Your unfair advantage in rentals.');
    } else {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      twitterDescription.setAttribute('content', 'Find undervalued NYC rental apartments with advanced algorithms. Your unfair advantage in rentals.');
      document.head.appendChild(twitterDescription);
    }
    
    let twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute('content', 'https://realerestate.org/rent');
    } else {
      twitterUrl = document.createElement('meta');
      twitterUrl.setAttribute('name', 'twitter:url');
      twitterUrl.setAttribute('content', 'https://realerestate.org/rent');
      document.head.appendChild(twitterUrl);
    }
  }, []);

  const fetchNeighborhoods = async () => {
    try {
      const { data, error } = await supabase
        .from('undervalued_rentals')
        .select('neighborhood')
        .not('neighborhood', 'is', null)
        .order('neighborhood');

      if (error) {
        console.error('Error fetching neighborhoods:', error);
        return;
      }

      const dbNeighborhoods = [...new Set(data.map(item => item.neighborhood).filter(Boolean))];
      
      // Add missing neighborhoods that should be available
      const additionalNeighborhoods = [
        // Manhattan
        'west-village',
        'lower-east-side', 
        'little-italy',
        'nolita',
        'soho',
        'tribeca',
        'two-bridges',
        'murray-hill',
        // Brooklyn
        'williamsburg',
        'prospect-heights',
        'park-slope',
        // Queens
        'long-island-city',
        'sunnyside',
        'woodside',
        // Bronx
        'mott-haven',
        'melrose',
        'south-bronx'
      ];

      // Combine database neighborhoods with additional ones, removing duplicates
      const allNeighborhoods = [...new Set([...dbNeighborhoods, ...additionalNeighborhoods])].sort();
      setNeighborhoods(allNeighborhoods);
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    }
  };

  const fetchProperties = async (reset = false) => {
  setLoading(true);
  const currentOffset = reset ? 0 : offset;

  try {
    let allProperties: any[] = [];

    // Neighborhood priority mapping (same as Buy page)
    const neighborhoodPriority = {
      // Tier 1 - Premium neighborhoods
      'soho': 1,
      'tribeca': 1,
      'west-village': 1,
      'east-village': 1,
      'chelsea': 1,
      'park-slope': 1,
      'nolita': 1,
      
      // Tier 2 - Highly desirable
      'boerum-hill': 2,
      'cobble-hill': 2,
      'carroll-gardens': 2,
      'dumbo': 2,
      'fort-greene': 2,
      'gramercy-park': 2,
      'greenpoint': 2,
      'williamsburg': 2,
      'lower-east-side': 2,
      'financial-district': 2,
      'long-island-city': 2,
      'prospect-heights': 2,
      
      // Tier 3 - Good neighborhoods
      'crown-heights': 3,
      'bedford-stuyvesant': 3,
      'bushwick': 3,
      'astoria': 3,
      'sunnyside': 3,
      'woodside': 3,
      'jackson-heights': 3,
      'elmhurst': 3,
      'kips-bay': 3,
      'murray-hill': 3,
      'clinton-hill': 3,
      
      // Tier 4 - Emerging/other areas
      'chinatown': 4,
      'melrose': 4,
      'mott-haven': 4,
      'south-bronx': 4,
      'concourse': 4,
      'two-bridges': 4,
      'midtown': 4
    };

    // If rent-stabilized only is selected, fetch only from rent-stabilized table
    if (rentStabilizedOnly) {
      let query = supabase
        .from('undervalued_rent_stabilized')
        .select('*')
        .eq('display_status', 'active');

      // Apply all your existing filters (same as before)
      if (searchTerm.trim()) {
        query = query.ilike('address', `%${searchTerm.trim()}%`);
      }

      if (zipCode.trim()) {
        query = query.ilike('zip_code', `${zipCode.trim()}%`);
      }

      if (maxPrice.trim()) {
        const priceValue = parseInt(maxPrice.trim());
        if (!isNaN(priceValue) && priceValue > 0) {
          query = query.lte('monthly_rent', priceValue);
        }
      }

      if (bedrooms.trim()) {
        const bedroomValue = parseInt(bedrooms.trim());
        if (!isNaN(bedroomValue)) {
          if (bedroomValue === 0) {
            query = query.eq('bedrooms', 0);
          } else {
            query = query.gte('bedrooms', bedroomValue);
          }
        }
      }

      if (selectedNeighborhoods.length > 0) {
        query = query.in('neighborhood', selectedNeighborhoods);
      }

      if (selectedBoroughs.length > 0) {
        query = query.in('borough', selectedBoroughs);
      }

      if (minSqft.trim()) {
        const sqftValue = parseInt(minSqft.trim());
        if (!isNaN(sqftValue) && sqftValue > 0) {
          query = query.gte('sqft', sqftValue).not('sqft', 'is', null);
        }
      }

      if (addressSearch.trim()) {
        query = query.ilike('address', `%${addressSearch.trim()}%`);
      }

      if (minDiscount.trim()) {
        const discountValue = parseInt(minDiscount.replace('%', ''));
        if (!isNaN(discountValue) && discountValue > 0) {
          query = query.gte('undervaluation_percent', discountValue);
        }
      }

      // Apply sorting for non-Featured sorts
      if (sortBy !== 'Featured') {
        switch (sortBy) {
          case 'Price: Low to High':
            query = query.order('monthly_rent', { ascending: true });
            break;
          case 'Price: High to Low':
            query = query.order('monthly_rent', { ascending: false });
            break;
          case 'Sqft: Low to High':
            query = query.order('sqft', { ascending: true, nullsFirst: true });
            break;
          case 'Sqft: High to Low':
            query = query.order('sqft', { ascending: false, nullsFirst: false });
            break;
          case 'Score: Low to High':
            query = query.order('deal_quality_score', { ascending: true });
            break;
          case 'Score: High to Low':
            query = query.order('deal_quality_score', { ascending: false });
            break;
          case 'Newest Listed':
            query = query.order('discovered_at', { ascending: false });
            break;
        }
      } else {
        // For Featured, just order by score initially
        query = query.order('deal_quality_score', { ascending: false });
      }

      // Fetch data
      let fetchSize = ITEMS_PER_PAGE;
      if (sortBy === 'Featured') {
        fetchSize = Math.max(100, currentOffset + ITEMS_PER_PAGE * 2);
      }

      const { data: rentStabilizedData, error: rentStabilizedError } = await query.range(currentOffset, currentOffset + fetchSize - 1);

      if (rentStabilizedError) {
        console.error('❌ RENT-STABILIZED ERROR:', rentStabilizedError);
        setProperties([]);
        return;
      }

      // Map rent-stabilized data to consistent format
      allProperties = (rentStabilizedData || []).map(property => ({
        ...property,
        isRentStabilized: true,
        grade: 'A+', // Rent-stabilized properties get A+ grade
        score: property.deal_quality_score || 95,
        discount_percent: property.undervaluation_percent,
        images: property.images || [],
        zipcode: property.zip_code // Map zip_code to zipcode for consistency
      }));

    } else {
      // Fetch from both tables when not filtering for rent-stabilized only
      
      // Fetch regular rentals
      let regularQuery = supabase
        .from('undervalued_rentals')
        .select('*')
        .eq('status', 'active');

      // Apply all your existing filters for regular rentals
      if (searchTerm.trim()) {
        regularQuery = regularQuery.ilike('address', `%${searchTerm.trim()}%`);
      }

      if (zipCode.trim()) {
        regularQuery = regularQuery.ilike('zipcode', `${zipCode.trim()}%`);
      }

      if (maxPrice.trim()) {
        const priceValue = parseInt(maxPrice.trim());
        if (!isNaN(priceValue) && priceValue > 0) {
          regularQuery = regularQuery.lte('monthly_rent', priceValue);
        }
      }

      if (bedrooms.trim()) {
        const bedroomValue = parseInt(bedrooms.trim());
        if (!isNaN(bedroomValue)) {
          if (bedroomValue === 0) {
            regularQuery = regularQuery.eq('bedrooms', 0);
          } else {
            regularQuery = regularQuery.gte('bedrooms', bedroomValue);
          }
        }
      }

      if (minGrade.trim()) {
        const gradeIndex = gradeOptions.indexOf(minGrade);
        if (gradeIndex !== -1) {
          const allowedGrades = gradeOptions.slice(0, gradeIndex + 1);
          regularQuery = regularQuery.in('grade', allowedGrades);
        }
      }

      if (selectedNeighborhoods.length > 0) {
        regularQuery = regularQuery.in('neighborhood', selectedNeighborhoods);
      }

      if (selectedBoroughs.length > 0) {
        regularQuery = regularQuery.in('borough', selectedBoroughs);
      }

      if (minSqft.trim()) {
        const sqftValue = parseInt(minSqft.trim());
        if (!isNaN(sqftValue) && sqftValue > 0) {
          regularQuery = regularQuery.gte('sqft', sqftValue).not('sqft', 'is', null);
        }
      }

      if (addressSearch.trim()) {
        regularQuery = regularQuery.ilike('address', `%${addressSearch.trim()}%`);
      }

      if (minDiscount.trim()) {
        const discountValue = parseInt(minDiscount.replace('%', ''));
        if (!isNaN(discountValue) && discountValue > 0) {
          regularQuery = regularQuery.gte('discount_percent', discountValue);
        }
      }

      // Apply sorting for regular rentals (non-Featured)
      if (sortBy !== 'Featured') {
        switch (sortBy) {
          case 'Price: Low to High':
            regularQuery = regularQuery.order('monthly_rent', { ascending: true });
            break;
          case 'Price: High to Low':
            regularQuery = regularQuery.order('monthly_rent', { ascending: false });
            break;
          case 'Sqft: Low to High':
            regularQuery = regularQuery.order('sqft', { ascending: true, nullsFirst: true });
            break;
          case 'Sqft: High to Low':
            regularQuery = regularQuery.order('sqft', { ascending: false, nullsFirst: false });
            break;
          case 'Score: Low to High':
            regularQuery = regularQuery.order('score', { ascending: true });
            break;
          case 'Score: High to Low':
            regularQuery = regularQuery.order('score', { ascending: false });
            break;
          case 'Newest Listed':
            regularQuery = regularQuery.order('days_on_market', { ascending: true });
            break;
        }
      } else {
        // For Featured, just order by score initially
        regularQuery = regularQuery.order('score', { ascending: false });
      }

      // Fetch rent-stabilized properties
      let rentStabilizedQuery = supabase
        .from('undervalued_rent_stabilized')
        .select('*')
        .eq('display_status', 'active');

      // Apply same filters to rent-stabilized query
      if (searchTerm.trim()) {
        rentStabilizedQuery = rentStabilizedQuery.ilike('address', `%${searchTerm.trim()}%`);
      }

      if (zipCode.trim()) {
        rentStabilizedQuery = rentStabilizedQuery.ilike('zip_code', `${zipCode.trim()}%`);
      }

      if (maxPrice.trim()) {
        const priceValue = parseInt(maxPrice.trim());
        if (!isNaN(priceValue) && priceValue > 0) {
          rentStabilizedQuery = rentStabilizedQuery.lte('monthly_rent', priceValue);
        }
      }

      if (bedrooms.trim()) {
        const bedroomValue = parseInt(bedrooms.trim());
        if (!isNaN(bedroomValue)) {
          if (bedroomValue === 0) {
            rentStabilizedQuery = rentStabilizedQuery.eq('bedrooms', 0);
          } else {
            rentStabilizedQuery = rentStabilizedQuery.gte('bedrooms', bedroomValue);
          }
        }
      }

      if (selectedNeighborhoods.length > 0) {
        rentStabilizedQuery = rentStabilizedQuery.in('neighborhood', selectedNeighborhoods);
      }

      if (selectedBoroughs.length > 0) {
        rentStabilizedQuery = rentStabilizedQuery.in('borough', selectedBoroughs);
      }

      if (minSqft.trim()) {
        const sqftValue = parseInt(minSqft.trim());
        if (!isNaN(sqftValue) && sqftValue > 0) {
          rentStabilizedQuery = rentStabilizedQuery.gte('sqft', sqftValue).not('sqft', 'is', null);
        }
      }

      if (addressSearch.trim()) {
        rentStabilizedQuery = rentStabilizedQuery.ilike('address', `%${addressSearch.trim()}%`);
      }

      if (minDiscount.trim()) {
        const discountValue = parseInt(minDiscount.replace('%', ''));
        if (!isNaN(discountValue) && discountValue > 0) {
          rentStabilizedQuery = rentStabilizedQuery.gte('undervaluation_percent', discountValue);
        }
      }

      // Apply sorting for rent-stabilized (non-Featured)
      if (sortBy !== 'Featured') {
        switch (sortBy) {
          case 'Price: Low to High':
            rentStabilizedQuery = rentStabilizedQuery.order('monthly_rent', { ascending: true });
            break;
          case 'Price: High to Low':
            rentStabilizedQuery = rentStabilizedQuery.order('monthly_rent', { ascending: false });
            break;
          case 'Sqft: Low to High':
            rentStabilizedQuery = rentStabilizedQuery.order('sqft', { ascending: true, nullsFirst: true });
            break;
          case 'Sqft: High to Low':
            rentStabilizedQuery = rentStabilizedQuery.order('sqft', { ascending: false, nullsFirst: false });
            break;
          case 'Score: Low to High':
            rentStabilizedQuery = rentStabilizedQuery.order('deal_quality_score', { ascending: true });
            break;
          case 'Score: High to Low':
            rentStabilizedQuery = rentStabilizedQuery.order('deal_quality_score', { ascending: false });
            break;
          case 'Newest Listed':
            rentStabilizedQuery = rentStabilizedQuery.order('discovered_at', { ascending: false });
            break;
        }
      } else {
        // For Featured, just order by score initially
        rentStabilizedQuery = rentStabilizedQuery.order('deal_quality_score', { ascending: false });
      }

      // Determine fetch size
      let fetchSize = Math.floor(ITEMS_PER_PAGE / 2);
      if (sortBy === 'Featured') {
        fetchSize = Math.max(50, currentOffset + Math.floor(ITEMS_PER_PAGE / 2) * 2);
      }

      // Execute both queries
      const [regularResult, rentStabilizedResult] = await Promise.all([
        regularQuery.range(currentOffset, currentOffset + fetchSize - 1),
        rentStabilizedQuery.range(currentOffset, currentOffset + fetchSize - 1)
      ]);

      if (regularResult.error) {
        console.error('❌ REGULAR RENTALS ERROR:', regularResult.error);
      }

      if (rentStabilizedResult.error) {
        console.error('❌ RENT-STABILIZED ERROR:', rentStabilizedResult.error);
      }

      // Combine results
      const regularProperties = (regularResult.data || []).map(property => ({
        ...property,
        isRentStabilized: false
      }));

      const rentStabilizedProperties = (rentStabilizedResult.data || []).map(property => ({
        ...property,
        isRentStabilized: true,
        grade: 'A+', // Rent-stabilized properties get A+ grade
        score: property.deal_quality_score || 95,
        discount_percent: property.undervaluation_percent,
        images: property.images || [],
        zipcode: property.zip_code // Map zip_code to zipcode for consistency
      }));

      allProperties = [...regularProperties, ...rentStabilizedProperties];
    }

    // Apply neighborhood prioritization (same logic as Buy page)
    let resultData;
    if (sortBy === 'Featured') {
      // Group by neighborhood rank, shuffle within each tier
      const grouped = allProperties.reduce((acc, item) => {
        const rank = neighborhoodPriority[item.neighborhood] || 999;
        if (!acc[rank]) acc[rank] = [];
        acc[rank].push(item);
        return acc;
      }, {} as Record<number, any[]>);

      const shuffled = Object.keys(grouped)
        .sort((a, b) => Number(a) - Number(b)) // sort ranks ascending (best neighborhoods first)
        .flatMap(rank => grouped[Number(rank)].sort(() => Math.random() - 0.5)); // shuffle within each tier

      // Take only the items we need for this page
      resultData = shuffled.slice(0, ITEMS_PER_PAGE);
      
      // Set hasMore based on whether we got the full fetch size
      setHasMore(allProperties.length >= ITEMS_PER_PAGE);
    } else {
      // For other sorts, just use the data as-is
      resultData = allProperties;
      setHasMore(allProperties.length === ITEMS_PER_PAGE);
    }

    if (reset) {
      setProperties(resultData);
      setOffset(ITEMS_PER_PAGE);
    } else {
      setProperties(prev => [...prev, ...resultData]);
      setOffset(prev => prev + ITEMS_PER_PAGE);
    }

  } catch (error) {
    console.error('💥 CATCH ERROR:', error);
    setProperties([]);
  } finally {
    setLoading(false);
  }
};

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProperties(false);
    }
  };

  const toggleNeighborhood = (neighborhood: string) => {
    setSelectedNeighborhoods(prev => 
      prev.includes(neighborhood) 
        ? prev.filter(n => n !== neighborhood)
        : [...prev, neighborhood]
    );
  };

  const clearNeighborhoods = () => {
    setSelectedNeighborhoods([]);
  };

  const removeNeighborhood = (neighborhood: string) => {
    setSelectedNeighborhoods(prev => prev.filter(n => n !== neighborhood));
  };

  const toggleBorough = (borough: string) => {
    setSelectedBoroughs(prev => 
      prev.includes(borough) 
        ? prev.filter(b => b !== borough)
        : [...prev, borough]
    );
  };

  const clearBoroughs = () => {
    setSelectedBoroughs([]);
  };

  const removeBorough = (borough: string) => {
    setSelectedBoroughs(prev => prev.filter(b => b !== borough));
  };

  const getGradeColors = (grade: string) => {
    if (grade === 'A+') {
      return {
        badge: 'bg-white text-black border-gray-300',
        scoreText: 'text-yellow-400',
        scoreBorder: 'border-yellow-600',
        hover: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:border-yellow-400/40'
      };
    } else if (grade === 'A' || grade === 'A-') {
      return {
        badge: 'bg-white text-black border-gray-300',
        scoreText: 'text-purple-400',
        scoreBorder: 'border-purple-600',
        hover: 'hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:border-purple-400/40'
      };
    } else if (grade.startsWith('B')) {
      return {
        badge: 'bg-white text-black border-gray-300',
        scoreText: 'text-blue-400',
        scoreBorder: 'border-blue-600',
        hover: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/40'
      };
    } else {
      return {
        badge: 'bg-white text-black border-gray-300',
        scoreText: 'text-gray-300',
        scoreBorder: 'border-gray-600',
        hover: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:border-white/40'
      };
    }
  };

  const handlePropertyClick = (property: any, index: number) => {
    const visibilityLimit = getVisibilityLimit();
    
    // Only allow clicks on visible properties
    if (index >= visibilityLimit) {
      return;
    }

    // For logged out users clicking on blurred listings, show soft-gate modal
    if (!user && index >= 3) {
      setSoftGateModal({
        isOpen: true,
        property: property,
        isLoggedOut: true
      });
      return;
    }

    // For free plan users clicking on blurred listings, show soft-gate modal
    if (isFreeUser && index >= 9) {
      setSoftGateModal({
        isOpen: true,
        property: property,
        isLoggedOut: false
      });
      return;
    }
    
    // Update URL with listing ID
    navigate(`/rent/${property.listing_id}`, { replace: true });
    setSelectedProperty(property);
  };

  const handleClosePropertyDetail = () => {
    // Navigate back to main rent page
    navigate('/rent', { replace: true });
    setSelectedProperty(null);
  };

  const handleCloseSoftGate = () => {
    setSoftGateModal({
      isOpen: false,
      property: null,
      isLoggedOut: false
    });
  };

  // Filter neighborhoods based on search term
  const filteredNeighborhoods = neighborhoods.filter(neighborhood =>
    neighborhood.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase())
  );

  const visibilityLimit = getVisibilityLimit();
  const isUnlimitedUser = userProfile?.subscription_plan === 'unlimited' || userProfile?.subscription_plan === 'open_door_plan';
  const isFreeUser = user && userProfile?.subscription_plan !== 'unlimited' && userProfile?.subscription_plan !== 'open_door_plan';

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <GooeyFilter />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
            Find the best deals to rent. Actually.
          </h1>
          <p className="text-xl text-gray-400 tracking-tight">
            Stop wasting time on overpriced listings.
          </p>
        </div>

        {/* Mobile Filters Button */}
        {isMobile && (
          <div className="mb-6">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 text-white hover:border-blue-500/40 transition-all"
            >
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filters</span>
              {showMobileFilters ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        )}

        {/* Search Filters */}
        <div className={`bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 mb-8 relative z-10 ${isMobile && !showMobileFilters ? 'hidden' : ''}`}>
          <div className="grid md:grid-cols-6 gap-4">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Neighborhoods
              </label>
              <div className="relative">
                <div className="relative flex items-center">
                  <div className="flex items-center w-full pl-4 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl min-h-[48px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {selectedNeighborhoods.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mr-2">
                        {selectedNeighborhoods.map((neighborhood) => (
                          <div
                            key={neighborhood}
                            className="bg-white text-black px-3 py-1 rounded-full text-sm flex items-center cursor-pointer flex-shrink-0"
                            onClick={() => removeNeighborhood(neighborhood)}
                          >
                            {neighborhood}
                            <X className="ml-1 h-3 w-3" />
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      type="text"
                      value={neighborhoodSearchTerm}
                      onChange={(e) => setNeighborhoodSearchTerm(e.target.value)}
                      onFocus={() => setShowNeighborhoodDropdown(true)}
                      placeholder={selectedNeighborhoods.length === 0 ? "East Village" : ""}
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 min-w-0"
                    />
                  </div>
                </div>
                
                {showNeighborhoodDropdown && (
                  <div className="absolute top-full left-0 right-0 mb-1 bg-gray-900 border border-gray-700 rounded-xl p-4 z-[100] max-h-80 overflow-y-auto">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-300">Filter by Neighborhoods</span>
                      {selectedNeighborhoods.length > 0 && (
                        <button
                          onClick={clearNeighborhoods}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filteredNeighborhoods.map((neighborhood) => (
                        <button
                          key={neighborhood}
                          onClick={() => toggleNeighborhood(neighborhood)}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            selectedNeighborhoods.includes(neighborhood)
                              ? 'bg-white text-black'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {neighborhood}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Zip Code
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="10009"
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Max /month
              </label>
              <input
                type="text"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="$4,000"
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
              >
                <option value="" className="text-gray-500">Any</option>
                <option value="0" className="text-white">Studio</option>
                <option value="1" className="text-white">1+</option>
                <option value="2" className="text-white">2+</option>
                <option value="3" className="text-white">3+</option>
                <option value="4" className="text-white">4+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Min Grade
              </label>
              <select
                value={minGrade}
                onChange={(e) => setMinGrade(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
              >
                <option value="" className="text-gray-500">Any Grade</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade} className="text-white">{grade}</option>
                ))}
              </select>
            </div>
           <div>
  <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight text-center">
    Rent Stabilized
  </label>
  <div className="flex justify-center mt-4">
    <Toggle 
      checked={rentStabilizedOnly} 
      onCheckedChange={setRentStabilizedOnly} 
      variant="default"
    />
  </div>
</div>

          </div>

          {/* Additional Filters Dropdown Toggle */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              {showAdditionalFilters ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Additional Filters Section */}
          {showAdditionalFilters && (
          <div className="grid md:grid-cols-5 gap-4 mt-6 pt-4">
              <div className="relative" ref={boroughDropdownRef}>
                <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Borough
                </label>
                <div className="relative">
                  <div className="flex items-center w-full pl-4 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl min-h-[48px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {selectedBoroughs.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mr-2">
                        {selectedBoroughs.map((borough) => (
                          <div
                            key={borough}
                            className="bg-white text-black px-3 py-1 rounded-full text-sm flex items-center cursor-pointer flex-shrink-0"
                            onClick={() => removeBorough(borough)}
                          >
                            {borough}
                            <X className="ml-1 h-3 w-3" />
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      className="flex-1 cursor-pointer text-gray-500"
                      onClick={() => setShowBoroughDropdown(true)}
                    >
                      {selectedBoroughs.length === 0 ? "Manhattan" : ""}
                    </div>
                  </div>
                  
                  {showBoroughDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl p-4 z-[100] max-h-80 overflow-y-auto">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-300">Filter by Borough</span>
                        {selectedBoroughs.length > 0 && (
                          <button
                            onClick={clearBoroughs}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {boroughs.map((borough) => (
                          <button
                            key={borough}
                            onClick={() => toggleBorough(borough)}
                            className={`px-3 py-1 rounded-full text-sm transition-all ${
                              selectedBoroughs.includes(borough)
                                ? 'bg-white text-black'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {borough}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Min Sqft
                </label>
                <input
                  type="text"
                  value={minSqft}
                  onChange={(e) => setMinSqft(e.target.value)}
                  placeholder="1,100"
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Address
                </label>
                <input
                  type="text"
                  value={addressSearch}
                  onChange={(e) => setAddressSearch(e.target.value)}
                  placeholder="123 Carroll St"
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Min Discount
                </label>
                <select
                  value={minDiscount}
                  onChange={(e) => setMinDiscount(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
                >
                  <option value="" className="text-gray-500">Any</option>
                  {discountOptions.map((discount) => (
                    <option key={discount} value={discount} className="text-white">{discount}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-tight"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option} className="text-white">{option}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Properties Grid with Overlay for CTAs */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property, index) => {
              const gradeColors = getGradeColors(property.grade);
              const isBlurred = index >= visibilityLimit;
              
              return (
                <div
                  key={`${property.id}-${index}`}
                  className="relative"
                >
                  <div className={isBlurred ? 'filter blur-sm' : ''}>
                    <PropertyCard
                      property={property}
                      isRental={true}
                      onClick={() => handlePropertyClick(property, index)}
                      gradeColors={gradeColors}
                    />
                  </div>

                  {/* Make blurred listings clickable for logged out users */}
                  {!user && isBlurred && (
                    <div 
                      className="absolute inset-0 cursor-pointer"
                      onClick={() => {
                        setSoftGateModal({
                          isOpen: true,
                          property: property,
                          isLoggedOut: true
                        });
                      }}
                    />
                  )}

                  {/* Make blurred listings clickable for free plan users */}
                  {isFreeUser && isBlurred && (
                    <div 
                      className="absolute inset-0 cursor-pointer"
                      onClick={() => {
                        setSoftGateModal({
                          isOpen: true,
                          property: property,
                          isLoggedOut: false
                        });
                      }}
                    />
                  )}

                  {/* Overlay CTA for signed out users - positioned over the 4th property (index 3) */}
                  {!user && index === 7 && properties.length > 7 && (
                    <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
                      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 text-center max-w-xl w-full pointer-events-auto px-[3px]">
                        <h3 className="text-2xl font-bold text-white mb-4">
                          Want to see more of the best deals in NYC?
                        </h3>
                        <p className="text-white mb-4">
                          This is only 6 of 2,193 deals.
                        </p>
                        <button
                          onClick={() => navigate('/join')}
                          className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                        >
                          Create free account to see more
                        </button>
                        <p className="text-xs text-gray-400 mt-3">
                        6,000+ New Yorkers already beating the market
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Overlay CTA for free plan users - positioned over the 10th property (index 9) */}
                  {isFreeUser && index === 25 && properties.length > 25 && (
                    <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
                      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 text-center max-w-xl w-full pointer-events-auto px-[3px]">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Your next home could be just past this point.
                        </h3>
                        <p className="text-white font-bold mb-4">
                          You're only seeing 24 of 2,193 deals.
                        </p>
                        <button
                          onClick={() => navigate('/pricing')}
                          className="relative group bg-white text-black px-8 py-3 rounded-full font-semibold transition-all duration-300
                                     hover:shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                        >
                          <span className="inline-block mr-2 transition-transform duration-200 group-hover:scale-110">
                            🔥
                          </span>
                          Unlock the rest for just $3
                        </button>
                        <p className="text-xs text-gray-400 mt-3">
                          Save thousands on rent every month
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading properties...</div>
          </div>
        )}

        {/* Load More Button - only show for unlimited users or when there are visible properties */}
        {!loading && hasMore && properties.length > 0 && isUnlimitedUser && (
          <div className="text-center py-8">
            <HoverButton onClick={loadMore} textColor="text-white">
              Load More Properties
            </HoverButton>
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
              No properties found matching your search criteria
            </h3>
            <p className="text-gray-400 tracking-tight mb-6">
              Try adjusting your filters
            </p>
            
            {/* Red glow line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60 mb-12 relative">
              <div className="absolute inset-0 w-full h-px bg-gradient-to-r from-transparent via-red-400 to-transparent blur-sm"></div>
            </div>
            
            {/* Early Access Section - same as bottom section */}
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tighter font-inter">
                Want to be the first to know when new deals in {selectedNeighborhoods.length > 0 ? selectedNeighborhoods.join(', ') : 'NYC'} are listed?
              </h3>
              <p className="text-2xl text-gray-400 mb-12 tracking-tight font-inter">
                The best deals in the city get bought in days. Don't miss them.
              </p>
              <button 
                onClick={() => navigate('/pricing')}
                className="bg-white text-black px-12 py-5 rounded-full font-bold text-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:border hover:border-white shadow-lg font-inter tracking-tight"
              >
                Early Access
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          isRental={true}
          onClose={handleClosePropertyDetail}
        />
      )}

      {/* Soft-gate Modal */}
      <SoftGateModal
        isOpen={softGateModal.isOpen}
        onClose={handleCloseSoftGate}
        property={softGateModal.property}
        isRental={true}
        isLoggedOut={softGateModal.isLoggedOut}
      />
    </div>
  );
};

export default Rent;

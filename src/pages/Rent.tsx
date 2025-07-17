import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabaseClient";
import PropertyCard from "../components/PropertyCard";
import Filter from "../components/Filter";
import { BeatLoader } from "react-spinners";

const Rent = () => {
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [minGrade, setMinGrade] = useState<number | null>(null);
  const [selectedBoroughs, setSelectedBoroughs] = useState<string[]>([]);
  const [minSqft, setMinSqft] = useState<number | null>(null);
  const [addressSearch, setAddressSearch] = useState<string>('');
  const [minDiscount, setMinDiscount] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showRentStabilized, setShowRentStabilized] = useState<boolean>(false);

  useEffect(() => {
    document.title = "NYC Apartments for Rent: Real-Time Deal Finder | Realer Estate";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find your next NYC apartment for rent with Realer Estate. Discover real-time deals, rent-stabilized units, and undervalued homes in your favorite neighborhoods.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Find your next NYC apartment for rent with Realer Estate. Discover real-time deals, rent-stabilized units, and undervalued homes in your favorite neighborhoods.';
      document.head.appendChild(meta);
    }
  }, []);

  const applyFilters = (data: any[]) => {
    let filtered = data;

    if (selectedNeighborhoods.length > 0) {
      filtered = filtered.filter(item => selectedNeighborhoods.includes(item.neighborhood));
    }

    if (selectedZipCodes.length > 0) {
      filtered = filtered.filter(item => selectedZipCodes.includes(item.zip_code));
    }

    if (maxPrice !== null) {
      filtered = filtered.filter(item => item.monthly_rent <= maxPrice);
    }

    if (selectedBedrooms !== null) {
      filtered = filtered.filter(item => item.bedrooms === selectedBedrooms);
    }

    if (minGrade !== null) {
      filtered = filtered.filter(item => item.grade >= minGrade);
    }

    if (selectedBoroughs.length > 0) {
      filtered = filtered.filter(item => selectedBoroughs.includes(item.borough));
    }

    if (minSqft !== null) {
      filtered = filtered.filter(item => item.sqft >= minSqft);
    }

    if (addressSearch) {
      const searchTerm = addressSearch.toLowerCase();
      filtered = filtered.filter(item =>
        item.address.toLowerCase().includes(searchTerm) ||
        item.neighborhood.toLowerCase().includes(searchTerm) ||
        item.zip_code.toLowerCase().includes(searchTerm)
      );
    }

    if (minDiscount !== null) {
      filtered = filtered.filter(item => item.discount >= minDiscount);
    }

    // Apply sorting
    if (sortBy === 'price-low-high') {
      filtered.sort((a, b) => a.monthly_rent - b.monthly_rent);
    } else if (sortBy === 'price-high-low') {
      filtered.sort((a, b) => b.monthly_rent - a.monthly_rent);
    } else if (sortBy === 'sqft-low-high') {
      filtered.sort((a, b) => {
        const aValue = a.sqft || 0;
        const bValue = b.sqft || 0;
        return aValue - bValue;
      });
    } else if (sortBy === 'sqft-high-low') {
      filtered.sort((a, b) => {
        const aValue = a.sqft || 0;
        const bValue = b.sqft || 0;
        return bValue - aValue;
      });
    } else if (sortBy === 'score-low-high') {
      filtered.sort((a, b) => a.score - b.score);
    } else if (sortBy === 'score-high-low') {
      filtered.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'newest-listed') {
      filtered.sort((a, b) => {
        const aDays = a.days_on_market || 999;
        const bDays = b.days_on_market || 999;
        return aDays - bDays;
      });
    }

    return filtered;
  };

  const { data: rentalsData, isLoading: isLoadingRentals, error: rentalsError } = useQuery({
    queryKey: ['undervalued-rentals', selectedNeighborhoods, selectedZipCodes, maxPrice, selectedBedrooms, minGrade, selectedBoroughs, minSqft, addressSearch, minDiscount, sortBy],
    queryFn: async () => {
      console.log('Fetching rentals data');

      let query = supabase
        .from('undervalued_rentals')
        .select('*')
        .eq('likely_rented', false);

      // Apply base sorting for consistent results
      if (sortBy === 'price-low-high') {
        query = query.order('monthly_rent', { ascending: true });
      } else if (sortBy === 'price-high-low') {
        query = query.order('monthly_rent', { ascending: false });
      } else if (sortBy === 'score-low-high') {
        query = query.order('score', { ascending: true });
      } else if (sortBy === 'score-high-low') {
        query = query.order('score', { ascending: false });
      } else if (sortBy === 'newest-listed') {
        query = query.order('days_on_market', { ascending: true, nullsFirst: true });
      } else {
        // Default "Featured" sorting
        query = query.order('score', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching rentals data:', error);
        throw error;
      }

      return applyFilters(data || []);
    },
  });

  const { data: rentStabilizedData, isLoading: isLoadingRentStabilized, error: rentStabilizedError } = useQuery({
    queryKey: ['undervalued-rent-stabilized', selectedNeighborhoods, selectedZipCodes, maxPrice, selectedBedrooms, minGrade, selectedBoroughs, minSqft, addressSearch, minDiscount, sortBy],
    queryFn: async () => {
      console.log('Fetching rent stabilized data');

      let query = supabase
        .from('undervalued_rent_stabilized')
        .select('*')
        .eq('likely_rented', false);

      // Apply base sorting for consistent results
      if (sortBy === 'price-low-high') {
        query = query.order('monthly_rent', { ascending: true });
      } else if (sortBy === 'price-high-low') {
        query = query.order('monthly_rent', { ascending: false });
      } else if (sortBy === 'score-low-high') {
        query = query.order('opportunity_score', { ascending: true, nullsFirst: true });
      } else if (sortBy === 'score-high-low') {
        query = query.order('opportunity_score', { ascending: false, nullsFirst: true });
      } else if (sortBy === 'newest-listed') {
        query = query.order('discovered_at', { ascending: false });
      } else {
        // Default "Featured" sorting
        query = query.order('opportunity_score', { ascending: false, nullsFirst: true });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching rent stabilized data:', error);
        throw error;
      }

      return applyFilters(data || []);
    },
  });

  const isLoading = isLoadingRentals || isLoadingRentStabilized;
  const error = rentalsError || rentStabilizedError;
  const rentals = showRentStabilized ? rentStabilizedData : rentalsData;

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <Filter
        selectedNeighborhoods={selectedNeighborhoods}
        setSelectedNeighborhoods={setSelectedNeighborhoods}
        selectedZipCodes={selectedZipCodes}
        setSelectedZipCodes={setSelectedZipCodes}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        selectedBedrooms={selectedBedrooms}
        setSelectedBedrooms={setSelectedBedrooms}
        minGrade={minGrade}
        setMinGrade={setMinGrade}
        selectedBoroughs={selectedBoroughs}
        setSelectedBoroughs={setSelectedBoroughs}
        minSqft={minSqft}
        setMinSqft={setMinSqft}
        addressSearch={addressSearch}
        setAddressSearch={setAddressSearch}
        minDiscount={minDiscount}
        setMinDiscount={setMinDiscount}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showRentStabilized={showRentStabilized}
        setShowRentStabilized={setShowRentStabilized}
      />

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <BeatLoader color="#36D7B7" />
          </div>
        ) : error ? (
          <div className="text-red-500">Error: {error.message}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals && rentals.length > 0 ? (
              rentals.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div className="text-gray-500 col-span-full text-center">
                No properties found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rent;

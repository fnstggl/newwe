import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "@/components/PropertyCard";
import { Loader2, SlidersHorizontal, X, Home, DollarSign, MapPin, Calendar, Shield, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

type Property = {
  id: string;
  address: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  neighborhood: string;
  latitude: number;
  longitude: number;
  photos: string[];
  listing_url: string;
  potential_monthly_savings: number;
  discount_percent: number;
  rent_stabilized_confidence?: number;
  undervaluation_percent?: number;
};

const Rent = () => {
  const { toast } = useToast();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    neighborhood: "",
    bedrooms: "",
    bathrooms: "",
    rentRange: [0, 15000],
    minSavings: 0,
    sortBy: "monthly_rent",
  });

  const [stabilizedFilters, setStabilizedFilters] = useState({
    neighborhood: "",
    bedrooms: "",
    bathrooms: "",
    rentRange: [0, 15000],
    minSavings: 0,
    minConfidence: 0,
    sortBy: "monthly_rent",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRentRangeChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, rentRange: value }));
  };

  const handleMinSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilters(prev => ({ ...prev, minSavings: parseInt(value) || 0 }));
  };

  const handleSortByChange = (value: string) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
  };

    const handleStabilizedFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStabilizedFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleStabilizedRentRangeChange = (value: number[]) => {
    setStabilizedFilters(prev => ({ ...prev, rentRange: value }));
  };

  const handleStabilizedMinSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setStabilizedFilters(prev => ({ ...prev, minSavings: parseInt(value) || 0 }));
  };

    const handleMinConfidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setStabilizedFilters(prev => ({ ...prev, minConfidence: parseInt(value) || 0 }));
  };

  const handleStabilizedSortByChange = (value: string) => {
    setStabilizedFilters(prev => ({ ...prev, sortBy: value }));
  };

  const clearFilters = () => {
    setFilters({
      neighborhood: "",
      bedrooms: "",
      bathrooms: "",
      rentRange: [0, 15000],
      minSavings: 0,
      sortBy: "monthly_rent",
    });
  };

  const { data: regularProperties, isLoading: isLoadingRegular } = useQuery({
    queryKey: ["undervalued-rentals", filters],
    queryFn: async () => {
      console.log("Fetching undervalued rentals with filters:", filters);
      
      let query = supabase
        .from("undervalued_rentals")
        .select("*")
        .eq("likely_rented", false);

      // Apply filters
      if (filters.neighborhood) {
        query = query.ilike("neighborhood", `%${filters.neighborhood}%`);
      }
      
      if (filters.bedrooms) {
        query = query.eq("bedrooms", filters.bedrooms);
      }
      
      if (filters.bathrooms) {
        query = query.eq("bathrooms", filters.bathrooms);
      }
      
      if (filters.rentRange[0] > 0 || filters.rentRange[1] < 15000) {
        query = query.gte("monthly_rent", filters.rentRange[0]).lte("monthly_rent", filters.rentRange[1]);
      }
      
      if (filters.minSavings > 0) {
        query = query.gte("potential_monthly_savings", filters.minSavings);
      }

      // Apply sorting - removed nullsLast and handle sorting manually
      query = query.order(filters.sortBy, { ascending: filters.sortBy === "monthly_rent" });

      const { data, error } = await query.limit(50);
      
      if (error) {
        console.error("Error fetching properties:", error);
        throw error;
      }

      // Handle manual sorting for null values if needed
      let sortedData = data || [];
      if (filters.sortBy === "discount_percent") {
        sortedData = sortedData.sort((a, b) => {
          const aVal = a.discount_percent || 0;
          const bVal = b.discount_percent || 0;
          return bVal - aVal; // descending order
        });
      }

      console.log("Fetched regular properties:", sortedData);
      return sortedData;
    },
  });

  const { data: stabilizedProperties, isLoading: isLoadingStabilized } = useQuery({
    queryKey: ["undervalued-rent-stabilized", stabilizedFilters],
    queryFn: async () => {
      console.log("Fetching rent-stabilized properties with filters:", stabilizedFilters);
      
      let query = supabase
        .from("undervalued_rent_stabilized")
        .select("*")
        .eq("likely_rented", false);

      // Apply filters
      if (stabilizedFilters.neighborhood) {
        query = query.ilike("neighborhood", `%${stabilizedFilters.neighborhood}%`);
      }
      
      if (stabilizedFilters.bedrooms) {
        query = query.eq("bedrooms", stabilizedFilters.bedrooms);
      }
      
      if (stabilizedFilters.bathrooms) {
        query = query.eq("bathrooms", stabilizedFilters.bathrooms);
      }
      
      if (stabilizedFilters.rentRange[0] > 0 || stabilizedFilters.rentRange[1] < 15000) {
        query = query.gte("monthly_rent", stabilizedFilters.rentRange[0]).lte("monthly_rent", stabilizedFilters.rentRange[1]);
      }
      
      if (stabilizedFilters.minSavings > 0) {
        query = query.gte("potential_monthly_savings", stabilizedFilters.minSavings);
      }

      if (stabilizedFilters.minConfidence > 0) {
        query = query.gte("rent_stabilized_confidence", stabilizedFilters.minConfidence);
      }

      // Apply sorting - removed nullsLast and handle sorting manually
      query = query.order(stabilizedFilters.sortBy, { ascending: stabilizedFilters.sortBy === "monthly_rent" });

      const { data, error } = await query.limit(50);
      
      if (error) {
        console.error("Error fetching stabilized properties:", error);
        throw error;
      }

      // Handle manual sorting for null values if needed
      let sortedData = data || [];
      if (stabilizedFilters.sortBy === "undervaluation_percent") {
        sortedData = sortedData.sort((a, b) => {
          const aVal = a.undervaluation_percent || 0;
          const bVal = b.undervaluation_percent || 0;
          return bVal - aVal; // descending order
        });
      }

      console.log("Fetched stabilized properties:", sortedData);
      return sortedData;
    },
  });

  const isLoading = isLoadingRegular || isLoadingStabilized;
  const regularHasResults = regularProperties && regularProperties.length > 0;
  const stabilizedHasResults = stabilizedProperties && stabilizedProperties.length > 0;
  const hasResults = regularHasResults || stabilizedHasResults;

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tighter">
            Find Undervalued Apartments in NYC
          </h1>
          <p className="text-lg text-gray-400 tracking-tight">
            Discover hidden gems and save money on your next rental.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            {isFilterOpen ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Close Filters
              </>
            ) : (
              <>
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Open Filters
              </>
            )}
          </Button>
          {hasResults && (
            <Badge variant="secondary">
              {regularProperties?.length} Regular Deals, {stabilizedProperties?.length} Stabilized Deals
            </Badge>
          )}
        </div>

        {/* Filter Drawer */}
        {isFilterOpen && (
          <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Neighborhood Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Neighborhood</label>
              <Input
                type="text"
                name="neighborhood"
                value={filters.neighborhood}
                onChange={handleFilterChange}
                placeholder="e.g., SoHo"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Bedrooms Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bedrooms</label>
              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="0">Studio</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bathrooms</label>
              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, bathrooms: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="1.5">1.5</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rent Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Rent Range</label>
              <Slider
                defaultValue={filters.rentRange}
                max={15000}
                step={100}
                onValueChange={handleRentRangeChange}
                className="text-white"
              />
              <div className="text-xs text-gray-400 mt-1">
                ${filters.rentRange[0]} - ${filters.rentRange[1]}
              </div>
            </div>

            {/* Min Savings Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Savings</label>
              <Input
                type="number"
                name="minSavings"
                value={filters.minSavings}
                onChange={handleMinSavingsChange}
                placeholder="e.g., 500"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Sort By Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
              <Select onValueChange={handleSortByChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="monthly_rent">Price</SelectItem>
                  <SelectItem value="discount_percent">Discount %</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div className="md:col-span-4">
              <Button variant="secondary" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Rent Stabilized Toggle */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Rent Stabilized Deals</h2>
        </div>
      </section>

      {/* Stabilized Filter Section */}
      <section className="py-8 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            {isFilterOpen ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Close Filters
              </>
            ) : (
              <>
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Open Filters
              </>
            )}
          </Button>
          {hasResults && (
            <Badge variant="secondary">
              {regularProperties?.length} Regular Deals, {stabilizedProperties?.length} Stabilized Deals
            </Badge>
          )}
        </div>

        {/* Filter Drawer */}
        {isFilterOpen && (
          <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Neighborhood Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Neighborhood</label>
              <Input
                type="text"
                name="neighborhood"
                value={stabilizedFilters.neighborhood}
                onChange={handleStabilizedFilterChange}
                placeholder="e.g., SoHo"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Bedrooms Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bedrooms</label>
              <Select onValueChange={(value) => setStabilizedFilters(prev => ({ ...prev, bedrooms: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="0">Studio</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bathrooms</label>
              <Select onValueChange={(value) => setStabilizedFilters(prev => ({ ...prev, bathrooms: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="1.5">1.5</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rent Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Rent Range</label>
              <Slider
                defaultValue={stabilizedFilters.rentRange}
                max={15000}
                step={100}
                onValueChange={handleStabilizedRentRangeChange}
                className="text-white"
              />
              <div className="text-xs text-gray-400 mt-1">
                ${stabilizedFilters.rentRange[0]} - ${stabilizedFilters.rentRange[1]}
              </div>
            </div>

            {/* Min Savings Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Savings</label>
              <Input
                type="number"
                name="minSavings"
                value={stabilizedFilters.minSavings}
                onChange={handleStabilizedMinSavingsChange}
                placeholder="e.g., 500"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

              {/* Min Confidence Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Min Confidence</label>
                <Input
                  type="number"
                  name="minConfidence"
                  value={stabilizedFilters.minConfidence}
                  onChange={handleMinConfidenceChange}
                  placeholder="e.g., 75"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

            {/* Sort By Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
              <Select onValueChange={handleStabilizedSortByChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="monthly_rent">Price</SelectItem>
                  <SelectItem value="undervaluation_percent">Undervaluation %</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div className="md:col-span-4">
              <Button variant="secondary" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Property List Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading properties...
            </div>
          ) : hasResults ? (
            <>
              {regularHasResults && (
                <>
                  <h2 className="text-3xl font-semibold mb-6 tracking-tighter">
                    Undervalued Regular Rentals
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularProperties?.map((property) => (
                      <PropertyCard key={property.id} property={property} type="rent" />
                    ))}
                  </div>
                </>
              )}

              {stabilizedHasResults && (
                <>
                  <h2 className="text-3xl font-semibold mb-6 tracking-tighter mt-12">
                    Undervalued Rent-Stabilized Rentals
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stabilizedProperties?.map((property) => (
                      <PropertyCard key={property.id} property={property} type="rent" />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400">
              No properties found matching your criteria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Rent;

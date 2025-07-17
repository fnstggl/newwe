import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "@/components/PropertyCard";
import { Loader2, SlidersHorizontal, X, Home, DollarSign, MapPin, Calendar } from "lucide-react";
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

interface Property {
  id: number;
  address: string;
  neighborhood: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  potential_savings: number;
  discount_percent: number;
  image_url: string;
  listing_url: string;
  likely_sold: boolean;
}

const Buy = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    neighborhood: "",
    bedrooms: "",
    bathrooms: "",
    priceRange: [0, 10000000],
    minSavings: 0,
    sortBy: "discount_percent",
  });

  const { toast } = useToast();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: value,
    }));
  };

  const handleMinSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      minSavings: parseInt(value, 10) || 0,
    }));
  };

  const handleSortByChange = (value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sortBy: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      neighborhood: "",
      bedrooms: "",
      bathrooms: "",
      priceRange: [0, 10000000],
      minSavings: 0,
      sortBy: "discount_percent",
    });
  };

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ["undervalued-sales", filters],
    queryFn: async () => {
      console.log("Fetching undervalued sales with filters:", filters);
      
      let query = supabase
        .from("undervalued_sales")
        .select("*")
        .eq("likely_sold", false);

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
      
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000) {
        query = query.gte("price", filters.priceRange[0]).lte("price", filters.priceRange[1]);
      }
      
      if (filters.minSavings > 0) {
        query = query.gte("potential_savings", filters.minSavings);
      }

      // Apply sorting - removed nullsLast and handle sorting manually
      query = query.order(filters.sortBy, { ascending: filters.sortBy === "price" });

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

      console.log("Fetched properties:", sortedData);
      return sortedData;
    },
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch properties. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      {/* Filter Bar */}
      <div className="bg-gray-900/50 py-4 px-4 sticky top-16 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
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
          <div className="text-sm text-gray-400">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin inline-block" />
                Loading properties...
              </>
            ) : (
              <>
                <Home className="w-4 h-4 mr-2 inline-block" />
                {properties?.length || 0} properties found
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filters (Initially Hidden on Small Screens) */}
      <div
        className={`bg-gray-900/50 py-8 px-4 ${
          isFilterOpen ? "block" : "hidden"
        } md:block sticky top-[76px] z-30 backdrop-blur-md`}
      >
        <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-5">
          {/* Neighborhood Filter */}
          <div>
            <label
              htmlFor="neighborhood"
              className="block text-sm font-medium text-gray-300"
            >
              Neighborhood
            </label>
            <Input
              type="text"
              id="neighborhood"
              name="neighborhood"
              value={filters.neighborhood}
              onChange={handleFilterChange}
              className="mt-1"
              placeholder="e.g., SoHo"
            />
          </div>

          {/* Bedrooms Filter */}
          <div>
            <label
              htmlFor="bedrooms"
              className="block text-sm font-medium text-gray-300"
            >
              Bedrooms
            </label>
            <Select onValueChange={(value) => setFilters(prev => ({...prev, bedrooms: value}))}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bathrooms Filter */}
          <div>
            <label
              htmlFor="bathrooms"
              className="block text-sm font-medium text-gray-300"
            >
              Bathrooms
            </label>
            <Select onValueChange={(value) => setFilters(prev => ({...prev, bathrooms: value}))}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="1.5">1.5</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label
              htmlFor="priceRange"
              className="block text-sm font-medium text-gray-300"
            >
              Price Range (${filters.priceRange[0]} - ${filters.priceRange[1]})
            </label>
            <Slider
              defaultValue={filters.priceRange}
              max={10000000}
              step={100000}
              onValueChange={handlePriceRangeChange}
              className="mt-1"
            />
          </div>

          {/* Min Savings Filter */}
          <div>
            <label
              htmlFor="minSavings"
              className="block text-sm font-medium text-gray-300"
            >
              Min Savings (${filters.minSavings})
            </label>
            <Input
              type="number"
              id="minSavings"
              name="minSavings"
              value={filters.minSavings}
              onChange={handleMinSavingsChange}
              className="mt-1"
              placeholder="e.g., 50000"
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="max-w-6xl mx-auto mt-4 flex justify-end">
          <Button variant="ghost" onClick={clearFilters} className="mr-2">
            Clear Filters
          </Button>
          <Select onValueChange={handleSortByChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by Discount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discount_percent">Discount %</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Property List */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        {isLoading ? (
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading undervalued sales...</p>
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-400">No undervalued sales found with the current filters.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Buy;

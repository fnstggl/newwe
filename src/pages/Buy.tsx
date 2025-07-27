import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PropertyCard from '@/components/PropertyCard';
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SoftGateModal from '@/components/SoftGateModal';

interface Property {
  id: string;
  address: string;
  grade: string;
  score: number;
  price: number;
  price_per_sqft: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  neighborhood: string;
  discount_percent: number;
  reasoning: string;
  images: any;
}

const Buy = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [maxBedrooms, setMaxBedrooms] = useState<number>(5);
  const [minBathrooms, setMinBathrooms] = useState<number>(1);
  const [maxBathrooms, setMaxBathrooms] = useState<number>(5);
  const [minSqft, setMinSqft] = useState<number>(0);
  const [maxSqft, setMaxSqft] = useState<number>(5000);
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('price');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [isRentStabilized, setIsRentStabilized] = useState<boolean>(false);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  const [softGateModal, setSoftGateModal] = useState<{
    isOpen: boolean;
    property: any;
  }>({
    isOpen: false,
    property: null
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/properties-buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          min_price: minPrice,
          max_price: maxPrice,
          min_bedrooms: minBedrooms,
          max_bedrooms: maxBedrooms,
          min_bathrooms: minBathrooms,
          max_bathrooms: maxBathrooms,
          min_sqft: minSqft,
          max_sqft: maxSqft,
          neighborhood: neighborhood,
          grade: grade,
          sort_by: sortBy,
          sort_order: sortOrder,
          is_rent_stabilized: isRentStabilized,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProperties(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [minPrice, maxPrice, minBedrooms, maxBedrooms, minBathrooms, maxBathrooms, minSqft, maxSqft, neighborhood, grade, sortBy, sortOrder, isRentStabilized]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Apply blurring effect if user is not logged in or on free plan
    if (!user || userProfile?.subscription_plan === 'free') {
      setDisplayedProperties(
        properties.map((property) => ({
          ...property,
        }))
      );
    } else {
      // If user is logged in and on a paid plan, show all properties without blurring
      setDisplayedProperties(properties);
    }
  }, [properties, user, userProfile]);

  const handlePropertyClick = (property: any) => {
    console.log('Property clicked:', property.id);
    console.log('User profile:', userProfile);
    console.log('User:', user);
    
    // If user is not logged in, show soft-gate modal
    if (!user) {
      setSoftGateModal({
        isOpen: true,
        property: {
          bedrooms: property.bedrooms,
          neighborhood: property.neighborhood,
          price: property.price,
          discount_percent: property.discount_percent,
          isRentStabilized: false // Sales properties are typically not rent-stabilized
        }
      });
      return;
    }
    
    // If user is logged in but on free plan, show upgrade soft-gate modal
    if (userProfile?.subscription_plan === 'free') {
      setSoftGateModal({
        isOpen: true,
        property: {
          bedrooms: property.bedrooms,
          neighborhood: property.neighborhood,
          price: property.price,
          discount_percent: property.discount_percent,
          isRentStabilized: false // Sales properties are typically not rent-stabilized
        }
      });
      return;
    }
    
    // For paid users, navigate to property details
    navigate(`/buy/${property.id}`);
  };

  const renderProperty = (property: Property) => (
    <PropertyCard
      key={property.id}
      property={property}
      onClick={() => handlePropertyClick(property)}
    />
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 p-6">
        <h1 className="text-3xl font-bold">NYC Real Estate - Buy</h1>
        <p>Find your dream home in the city.</p>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Price Range */}
          <div>
            <Label>Price Range</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Min"
                className="w-24 text-black"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Max"
                className="w-24 text-black"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>
            <Slider
              defaultValue={[minPrice, maxPrice]}
              max={10000000}
              step={100000}
              onValueChange={(value) => {
                setMinPrice(value[0]);
                setMaxPrice(value[1]);
              }}
            />
          </div>

          {/* Bedrooms */}
          <div>
            <Label>Bedrooms</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Min"
                className="w-16 text-black"
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Max"
                className="w-16 text-black"
                value={maxBedrooms}
                onChange={(e) => setMaxBedrooms(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <Label>Bathrooms</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Min"
                className="w-16 text-black"
                value={minBathrooms}
                onChange={(e) => setMinBathrooms(Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Max"
                className="w-16 text-black"
                value={maxBathrooms}
                onChange={(e) => setMaxBathrooms(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Square Footage */}
          <div>
            <Label>Square Footage</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Min"
                className="w-24 text-black"
                value={minSqft}
                onChange={(e) => setMinSqft(Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Max"
                className="w-24 text-black"
                value={maxSqft}
                onChange={(e) => setMaxSqft(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Neighborhood */}
          <div>
            <Label>Neighborhood</Label>
            <Input
              type="text"
              placeholder="Enter neighborhood"
              className="text-black"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
            />
          </div>

          {/* Grade */}
          <div>
            <Label>Grade</Label>
            <Select onValueChange={(value) => setGrade(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <Label>Sort By</Label>
            <Select onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select sort option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="sqft">Square Footage</SelectItem>
                <SelectItem value="grade">Grade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div>
            <Label>Sort Order</Label>
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rent Stabilized */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rentStabilized"
              checked={isRentStabilized}
              onCheckedChange={(checked) => setIsRentStabilized(!!checked)}
            />
            <Label htmlFor="rentStabilized">Rent Stabilized</Label>
          </div>
        </div>

        <Separator className="my-4" />

        <Button onClick={fetchData}>Apply Filters</Button>
      </div>
      
      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {loading ? 'Loading...' : `Results (${properties.length})`}
          </h2>
          {error && <p className="text-red-500">Error: {error}</p>}
        </div>
        
        {loading ? (
          <p>Loading properties...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProperties.map((property) => renderProperty(property))}
          </div>
        )}
      </div>

      {/* Soft Gate Modal */}
      <SoftGateModal
        isOpen={softGateModal.isOpen}
        onClose={() => setSoftGateModal({ isOpen: false, property: null })}
        property={softGateModal.property || {}}
        isRental={false}
        isLoggedOut={!user}
      />
    </div>
  );
};

export default Buy;

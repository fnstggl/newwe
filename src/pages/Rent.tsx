import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast"

const Rent = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [borough, setBorough] = useState<string>('All');
  const [rentRange, setRentRange] = useState<number[]>([0, 10000]);
  const navigate = useNavigate();
  const { toast } = useToast()

  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('undervalued_rent_stabilized')
        .select('*')
        .order('potential_monthly_savings', { ascending: false });

      if (borough !== 'All') {
        query = query.eq('borough', borough);
      }

      query = query.gte('monthly_rent', rentRange[0]);
      query = query.lte('monthly_rent', rentRange[1]);

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to match expected interface
      const transformedData = data?.map((property: any) => ({
        ...property,
        images: Array.isArray(property.images) ? property.images : [],
        amenities: Array.isArray(property.amenities) ? property.amenities : [],
        isRentStabilized: true,
      })) || [];
      
      setProperties(transformedData);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [borough, rentRange]);

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 tracking-tight">NYC Rent-Stabilized Deals</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select onValueChange={setBorough}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a borough" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Boroughs</SelectItem>
              <SelectItem value="Manhattan">Manhattan</SelectItem>
              <SelectItem value="Brooklyn">Brooklyn</SelectItem>
              <SelectItem value="Queens">Queens</SelectItem>
              <SelectItem value="Bronx">Bronx</SelectItem>
              <SelectItem value="Staten Island">Staten Island</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex flex-col gap-2">
            <Label>Rent Range: ${rentRange[0]} - ${rentRange[1]}</Label>
            <Slider
              defaultValue={rentRange}
              max={10000}
              step={100}
              onValueChange={setRentRange}
            />
          </div>
        </div>

        {/* Property Grid */}
        {isLoading && <p>Loading properties...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isRental={true}
              onClick={() => handlePropertyClick(property.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rent;

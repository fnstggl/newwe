import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import SoftGateModal from '@/components/SoftGateModal';

interface Property {
  id: string;
  address: string;
  grade: string;
  score: number;
  price: number;
  monthly_rent: number;
  price_per_sqft: number;
  rent_per_sqft: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  neighborhood: string;
  discount_percent: number;
  reasoning: string;
  images: any;
  isRentStabilized: boolean;
  rent_stabilized_detected: boolean;
}

const Rent = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    neighborhood: '',
    bedrooms: '',
    price: '',
  });
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
	const { toast } = useToast();

  const [softGateModal, setSoftGateModal] = useState<{
    isOpen: boolean;
    property: any;
  }>({
    isOpen: false,
    property: null
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rentals')
        .select('*');

      if (error) {
        console.error('Error fetching rentals:', error);
				toast({
					title: "Error",
					description: "Failed to load rentals. Please try again.",
					variant: "destructive",
				});
      }

      if (data) {
        setProperties(data);
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    // Apply filters whenever properties or filters change
    applyFilters();
  }, [properties, filters]);

  const applyFilters = () => {
    let filtered = [...properties];

    if (filters.neighborhood) {
      filtered = filtered.filter(property =>
        property.neighborhood && property.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())
      );
    }

    if (filters.bedrooms) {
      const bedroomCount = parseInt(filters.bedrooms);
      filtered = filtered.filter(property => property.bedrooms === bedroomCount);
    }

    if (filters.price) {
      const priceRange = filters.price.split('-');
      const minPrice = parseInt(priceRange[0]);
      const maxPrice = parseInt(priceRange[1]);

      filtered = filtered.filter(property => property.monthly_rent >= minPrice && property.monthly_rent <= maxPrice);
    }

    setDisplayedProperties(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const renderProperty = (property: Property) => {
    // Determine if the property card should be blurred
    const shouldBlur = !user || userProfile?.subscription_plan === 'free';

    return (
      <div key={property.id} className={shouldBlur ? 'blur-md' : ''}>
        <PropertyCard
          property={property}
          isRental={true}
          onClick={() => handlePropertyClick(property)}
        />
      </div>
    );
  };

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
          monthly_rent: property.monthly_rent,
          discount_percent: property.discount_percent,
          isRentStabilized: property.isRentStabilized || property.rent_stabilized_detected
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
          monthly_rent: property.monthly_rent,
          discount_percent: property.discount_percent,
          isRentStabilized: property.isRentStabilized || property.rent_stabilized_detected
        }
      });
      return;
    }
    
    // For paid users, navigate to property details
    navigate(`/rent/${property.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-semibold">NYC Rentals</h1>
          <p className="text-gray-400">Find your next home in the city.</p>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-4">
          {/* Neighborhood Filter */}
          <div>
            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-300">Neighborhood:</label>
            <select
              id="neighborhood"
              name="neighborhood"
              value={filters.neighborhood}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white rounded-md shadow-sm"
            >
              <option value="">All Neighborhoods</option>
              <option value="Midtown">Midtown</option>
              <option value="Downtown">Downtown</option>
              {/* Add more neighborhoods as needed */}
            </select>
          </div>

          {/* Bedrooms Filter */}
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-300">Bedrooms:</label>
            <select
              id="bedrooms"
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white rounded-md shadow-sm"
            >
              <option value="">Any</option>
              <option value="0">Studio</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              {/* Add more bedroom options as needed */}
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price Range:</label>
            <select
              id="price"
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white rounded-md shadow-sm"
            >
              <option value="">Any</option>
              <option value="0-2000">$0 - $2000</option>
              <option value="2000-3000">$2000 - $3000</option>
              <option value="3000-4000">$3000 - $4000</option>
              {/* Add more price ranges as needed */}
            </select>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Available Rentals</h2>
        {loading ? (
          <p>Loading rentals...</p>
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
        isRental={true}
        isLoggedOut={!user}
      />
    </div>
  );
};

export default Rent;

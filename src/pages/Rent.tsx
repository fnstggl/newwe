import React, { useState, useEffect } from 'react';
import { UndervaluedRentals } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import PropertyCard from '@/components/PropertyCard';
import PropertyDetail from '@/components/PropertyDetail';
import { useToast } from "@/components/ui/use-toast"
import { Search, MapPin, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getBoroughs, getNeighborhoods } from '@/data/neighborhoodData';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HoverButton } from '@/components/ui/hover-button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const Rent = () => {
  const [properties, setProperties] = useState<UndervaluedRentals[]>([]);
  const [rentStabilized, setRentStabilized] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<UndervaluedRentals | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast()
  const { user, userProfile } = useAuth();

  // Filters
  const [borough, setBorough] = useState(searchParams.get('borough') || 'All');
  const [neighborhood, setNeighborhood] = useState(searchParams.get('neighborhood') || 'All');
  const [minPrice, setMinPrice] = useState(Number(searchParams.get('minPrice')) || 0);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 10000);
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'Any');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedProperties, setDisplayedProperties] = useState<UndervaluedRentals[]>([]);
  const [displayedRentStabilized, setDisplayedRentStabilized] = useState<any[]>([]);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  // Date picker state
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const formattedDate = date ? format(date, "PPP") : undefined

  const handleFilterChange = (newParams: { [key: string]: string | number | null }) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === 'All' || value === 'Any') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const rentUrl = `${import.meta.env.VITE_API_URL}/undervalued-rentals`;
        const rentResponse = await fetch(rentUrl);
        const rentData = await rentResponse.json();
        setProperties(rentData);

        const rentStabilizedUrl = `${import.meta.env.VITE_API_URL}/rent-stabilized`;
        const rentStabilizedResponse = await fetch(rentStabilizedUrl);
        const rentStabilizedData = await rentStabilizedResponse.json();
        setRentStabilized(rentStabilizedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem fetching the properties. Please try again.",
        })
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    // Apply filters
    let filteredProperties = properties;
    let filteredRentStabilized = rentStabilized;

    if (borough !== 'All') {
      filteredProperties = filteredProperties.filter(property => property.borough === borough);
      filteredRentStabilized = filteredRentStabilized.filter(property => property.borough === borough);
    }
    if (neighborhood !== 'All') {
      filteredProperties = filteredProperties.filter(property => property.neighborhood === neighborhood);
      filteredRentStabilized = filteredRentStabilized.filter(property => property.neighborhood === neighborhood);
    }
    filteredProperties = filteredProperties.filter(property => property.monthly_rent >= minPrice && property.monthly_rent <= maxPrice);
    filteredRentStabilized = filteredRentStabilized.filter(property => property.monthly_rent >= minPrice && property.monthly_rent <= maxPrice);

    if (bedrooms !== 'Any') {
      const bedroomValue = parseInt(bedrooms);
      filteredProperties = filteredProperties.filter(property => property.bedrooms === bedroomValue);
      filteredRentStabilized = filteredRentStabilized.filter(property => property.bedrooms === bedroomValue);
    }

    setDisplayedProperties(filteredProperties);
    setDisplayedRentStabilized(filteredRentStabilized);
  }, [properties, rentStabilized, borough, neighborhood, minPrice, maxPrice, bedrooms]);

  useEffect(() => {
    // Update filters from URL
    setBorough(searchParams.get('borough') || 'All');
    setNeighborhood(searchParams.get('neighborhood') || 'All');
    setMinPrice(Number(searchParams.get('minPrice')) || 0);
    setMaxPrice(Number(searchParams.get('maxPrice')) || 10000);
    setBedrooms(searchParams.get('bedrooms') || 'Any');
  }, [searchParams]);

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gray-900/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-white font-bold text-xl">RealerEstate</a>
            </div>
            <div className="flex items-center">
              <div className="mr-4">
                <Input
                  type="text"
                  placeholder="Search by address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 text-white rounded-full focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button onClick={handleSearch} className="rounded-full">
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-gray-900/90 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold leading-tight">
            Undervalued Rentals in New York City
          </h2>
          <Button onClick={() => setIsFilterDialogOpen(true)} className="rounded-full">
            <MapPin className="h-4 w-4 mr-2" /> Map View
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
          <DialogTrigger asChild>
            <HoverButton className="bg-gray-800 text-white hover:bg-gray-700 rounded-full font-semibold px-6 py-3 mb-4 w-full flex items-center justify-center">
              <Search className="h-4 w-4 mr-2" />
              Filters
            </HoverButton>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 text-white rounded-2xl">
            <DialogHeader>
              <DialogTitle>Filter Options</DialogTitle>
              <DialogDescription>
                Adjust the filters to find the perfect rental for you.
              </DialogDescription>
            </DialogHeader>
            <Accordion type="single" collapsible>
              <AccordionItem value="borough">
                <AccordionTrigger>Borough <ChevronDown className="w-4 h-4" /></AccordionTrigger>
                <AccordionContent>
                  <Select value={borough} onValueChange={(value) => {
                    setBorough(value);
                    handleFilterChange({ borough: value });
                  }}>
                    <SelectTrigger className="bg-gray-800 text-white rounded-full">
                      <SelectValue placeholder="Select a borough" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white rounded-2xl">
                      <SelectItem value="All">All</SelectItem>
                      {getBoroughs().map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="neighborhood">
                <AccordionTrigger>Neighborhood <ChevronDown className="w-4 h-4" /></AccordionTrigger>
                <AccordionContent>
                  <Select value={neighborhood} onValueChange={(value) => {
                    setNeighborhood(value);
                    handleFilterChange({ neighborhood: value });
                  }}>
                    <SelectTrigger className="bg-gray-800 text-white rounded-full">
                      <SelectValue placeholder="Select a neighborhood" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white rounded-2xl">
                      <SelectItem value="All">All</SelectItem>
                      {getNeighborhoods(borough).map(n => (
                        <SelectItem key={n} value={n}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="price">
                <AccordionTrigger>Price Range <ChevronDown className="w-4 h-4" /></AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="minPrice">Min Price: {minPrice}</Label>
                    <Label htmlFor="maxPrice">Max Price: {maxPrice}</Label>
                  </div>
                  <Slider
                    defaultValue={[minPrice, maxPrice]}
                    max={10000}
                    step={100}
                    onValueChange={(value) => {
                      setMinPrice(value[0]);
                      setMaxPrice(value[1]);
                    }}
                    onMouseUp={() => {
                      handleFilterChange({ minPrice: minPrice, maxPrice: maxPrice });
                    }}
                    className="mb-4"
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="bedrooms">
                <AccordionTrigger>Bedrooms <ChevronDown className="w-4 h-4" /></AccordionTrigger>
                <AccordionContent>
                  <Select value={bedrooms} onValueChange={(value) => {
                    setBedrooms(value);
                    handleFilterChange({ bedrooms: value });
                  }}>
                    <SelectTrigger className="bg-gray-800 text-white rounded-full">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white rounded-2xl">
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="0">Studio</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DialogContent>
        </Dialog>

        {loading ? (
          <div className="text-center text-gray-500">Loading properties...</div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-4">Available Rentals</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => setSelectedProperty(property)}
                />
              ))}
            </div>

            {displayedRentStabilized.length > 0 && (
              <>
                <h3 className="text-2xl font-bold mt-8 mb-4">Rent Stabilized</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedRentStabilized.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onClick={() => setSelectedProperty(property)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          isRental={true}
          onClose={() => setSelectedProperty(null)}
          allListings={[...displayedProperties, ...displayedRentStabilized]}
        />
      )}
    </div>
  );
};

export default Rent;

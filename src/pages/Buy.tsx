import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import PropertyCard from '../components/PropertyCard';
import { BeatLoader } from 'react-spinners';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const Buy = () => {
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [minGrade, setMinGrade] = useState<number>(0);
  const [selectedBoroughs, setSelectedBoroughs] = useState<string[]>([]);
  const [minSqft, setMinSqft] = useState<number>(0);
  const [addressSearch, setAddressSearch] = useState<string>('');
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFilters, setShowFilters] = useState(false);

  const neighborhoods = [
    "Midwood", "Sheepshead Bay", "Gravesend", "Brighton Beach", "Kensington",
    "Bensonhurst", "Borough Park", "Flatbush", "Sunset Park", "Bay Ridge",
    "Park Slope", "Greenwood Heights", "Windsor Terrace", "Kips Bay", "Murray Hill",
    "Gramercy Park", "Flatiron", "Chelsea", "West Village", "Tribeca",
    "Financial District", "Battery Park", "Upper East Side", "Lenox Hill", "Yorkville",
    "Upper West Side", "Lincoln Square", "Manhattan Valley", "Morningside Heights", "Harlem",
    "East Harlem", "Washington Heights", "Inwood", "Astoria", "Long Island City",
    "Sunnyside", "Woodside", "Jackson Heights", "Elmhurst", "Rego Park", "Forest Hills",
    "Kew Gardens", "Richmond Hill", "Woodhaven", "Ozone Park", "South Ozone Park",
    "Howard Beach", "Kew Gardens Hills", "Flushing", "Murray Hill (Queens)", "Whitestone",
    "Bayside", "Little Neck", "Douglaston", "Riverdale", "Fieldston",
    "Spuyten Duyvil", "Pelham Bay", "City Island", "Throgs Neck", "Country Club",
    "Parkchester", "Pelham Gardens", "Morris Park", "Fordham", "University Heights",
    "Kingsbridge Heights", "Bedford Park", "Norwood", "Eastchester", "Williamsbridge",
    "Wakefield", "Co-op City", "Soundview", "Clason Point", "Hunts Point",
    "Longwood", "Melrose", "Mott Haven", "Port Morris", "Highbridge",
    "Concourse", "Mount Eden", "Mount Hope", "Morrisania", "Crotona Park East",
    "Belmont", "East Tremont", "Bronxdale", "Allerton", "Van Nest",
    "Morris Heights", "Claremont Village", "Concourse Village", "Unionport", "West Farms",
    "Bath Beach", "Bergen Beach", "Boerum Hill", "Brooklyn Heights", "Bushwick",
    "Canarsie", "Carroll Gardens", "Clinton Hill", "Cobble Hill", "Columbia St Waterfront District",
    "Crown Heights", "Ditmas Park", "DUMBO", "East Flatbush", "Fort Greene",
    "Gowanus", "Greenpoint", "Manhattan Beach", "Marine Park", "Mill Basin",
    "Ocean Hill", "Ocean Parkway", "Prospect Heights", "Prospect Lefferts Gardens", "Red Hook",
    "Sea Gate", "South Slope", "Spring Creek", "Starrett City", "Stuyvesant Heights",
    "Sunset Park", "Vinegar Hill", "Weeksville", "Williamsburg", "Windsor Terrace",
    "Arden Heights", "Arrochar", "Bloomfield", "Brighton Heights", "Bull's Head",
    "Castleton Corners", "Charleston", "Chelsea (Staten Island)", "Clifton", "Dongan Hills",
    "Elm Park", "Emerson Hill", "Graniteville", "Grant City", "Grasmere",
    "Great Kills", "Greenridge", "Grymes Hill", "Hamilton Park", "Heartland Village",
    "Huguenot", "Livingston", "Manor Heights", "Mariners Harbor", "Midland Beach",
    "New Brighton", "New Dorp", "New Springville", "Oakwood", "Old Town",
    "Pleasant Plains", "Port Richmond", "Prince's Bay", "Randall Manor", "Richmond Town",
    "Rosebank", "Rossville", "Saint George", "Sandy Ground", "Shore Acres",
    "Silver Lake", "South Beach", "Stapleton", "Sunnyside (Staten Island)", "Todt Hill",
    "Tompkinsville", "Tottenville", "Travis", "West Brighton", "Westerleigh",
    "Willowbrook", "Woodrow"
  ];

  const zipCodes = [
    "10001", "10002", "10003", "10004", "10005", "10006", "10007", "10009", "10010", "10011",
    "10012", "10013", "10014", "10016", "10017", "10018", "10019", "10020", "10021", "10022",
    "10023", "10024", "10025", "10026", "10027", "10028", "10029", "10030", "10031", "10032",
    "10033", "10034", "10035", "10036", "10037", "10038", "10039", "10040", "10065", "10069",
    "10075", "10128", "10280", "10301", "10302", "10303", "10304", "10305", "10306", "10307",
    "10308", "10309", "10310", "10312", "10314", "11001", "11004", "11005", "11040", "11101",
    "11102", "11103", "11104", "11105", "11106", "11109", "11201", "11203", "11204", "11205",
    "11206", "11207", "11208", "11209", "11210", "11211", "11212", "11213", "11214", "11215",
    "11216", "11217", "11218", "11219", "11220", "11221", "11222", "11223", "11224", "11225",
    "11226", "11228", "11229", "11230", "11231", "11232", "11233", "11234", "11235", "11236",
    "11237", "11238", "11249", "11354", "11355", "11356", "11357", "11358", "11360", "11361",
    "11362", "11363", "11364", "11365", "11366", "11367", "11368", "11369", "11370", "11372",
    "11373", "11374", "11375", "11377", "11378", "11379", "11385", "11411", "11412", "11413",
    "11414", "11415", "11416", "11417", "11418", "11419", "11420", "11421", "11422", "11423",
    "11426", "11427", "11428", "11429", "11430", "11432", "11433", "11434", "11435", "11436",
    "11691", "11692", "11693", "11694"
  ];

  const boroughs = ["Brooklyn", "Manhattan", "Queens", "Bronx", "Staten Island"];

  const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const applyFilters = (data: any[]) => {
    let filtered = data;

    if (selectedNeighborhoods.length > 0) {
      filtered = filtered.filter(item => selectedNeighborhoods.includes(item.neighborhood));
    }

    if (selectedZipCodes.length > 0) {
      filtered = filtered.filter(item => selectedZipCodes.includes(item.zip_code));
    }

    if (maxPrice < 10000000) {
      filtered = filtered.filter(item => item.price <= maxPrice);
    }

    if (selectedBedrooms.length > 0) {
      filtered = filtered.filter(item => selectedBedrooms.includes(item.beds));
    }

    if (minGrade > 0) {
      filtered = filtered.filter(item => item.grade >= minGrade);
    }

    if (selectedBoroughs.length > 0) {
      filtered = filtered.filter(item => selectedBoroughs.includes(item.borough));
    }

    if (minSqft > 0) {
      filtered = filtered.filter(item => item.sqft >= minSqft);
    }

    if (addressSearch) {
      const searchTerm = addressSearch.toLowerCase();
      filtered = filtered.filter(item =>
        item.address.toLowerCase().includes(searchTerm) ||
        item.neighborhood.toLowerCase().includes(searchTerm) ||
        item.borough.toLowerCase().includes(searchTerm) ||
        item.zip_code.includes(searchTerm)
      );
    }

    if (minDiscount > 0) {
      filtered = filtered.filter(item => item.discount >= minDiscount);
    }

    // Apply sorting
    if (sortBy === 'price-low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      filtered.sort((a, b) => b.price - a.price);
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

  const { data: salesData, isLoading, error } = useQuery({
    queryKey: ['undervalued-sales', selectedNeighborhoods, selectedZipCodes, maxPrice, selectedBedrooms, minGrade, selectedBoroughs, minSqft, addressSearch, minDiscount, sortBy],
    queryFn: async () => {
      console.log('Fetching sales data with filters:', {
        selectedNeighborhoods,
        selectedZipCodes,
        maxPrice,
        selectedBedrooms,
        minGrade,
        selectedBoroughs,
        minSqft,
        addressSearch,
        minDiscount,
        sortBy
      });

      let query = supabase
        .from('undervalued_sales')
        .select('*')
        .eq('likely_sold', false);

      // Apply base sorting for consistent results
      if (sortBy === 'price-low-high') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price-high-low') {
        query = query.order('price', { ascending: false });
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
        console.error('Error fetching sales data:', error);
        throw error;
      }

      console.log('Raw sales data:', data);
      return applyFilters(data || []);
    },
  });

  const toggleFilterVisibility = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Buy Real Estate</h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <Input
              type="text"
              placeholder="Search by address, neighborhood, or zip code"
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              className="bg-gray-800 text-white border-gray-700 rounded-md py-2 px-3 w-full"
            />
          </div>
          <button
            onClick={toggleFilterVisibility}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters Accordion */}
        {showFilters && (
          <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="filters">
              <AccordionTrigger className="text-xl font-semibold">Filters</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Neighborhoods Filter */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Neighborhoods</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {neighborhoods.map((neighborhood) => (
                        <div key={neighborhood} className="flex items-center">
                          <Checkbox
                            id={`neighborhood-${neighborhood}`}
                            checked={selectedNeighborhoods.includes(neighborhood)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedNeighborhoods([...selectedNeighborhoods, neighborhood]);
                              } else {
                                setSelectedNeighborhoods(selectedNeighborhoods.filter((n) => n !== neighborhood));
                              }
                            }}
                            className="mr-2"
                          />
                          <Label htmlFor={`neighborhood-${neighborhood}`} className="text-gray-400">{neighborhood}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Zip Codes Filter */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Zip Codes</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {zipCodes.map((zipCode) => (
                        <div key={zipCode} className="flex items-center">
                          <Checkbox
                            id={`zipcode-${zipCode}`}
                            checked={selectedZipCodes.includes(zipCode)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedZipCodes([...selectedZipCodes, zipCode]);
                              } else {
                                setSelectedZipCodes(selectedZipCodes.filter((z) => z !== zipCode));
                              }
                            }}
                            className="mr-2"
                          />
                          <Label htmlFor={`zipcode-${zipCode}`} className="text-gray-400">{zipCode}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Max Price Filter */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Max Price: ${maxPrice.toLocaleString()}</Label>
                    <Slider
                      defaultValue={[maxPrice]}
                      max={10000000}
                      step={100000}
                      onValueChange={(value) => setMaxPrice(value[0])}
                      className="w-full"
                    />
                  </div>

                  {/* Bedrooms Filter */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Bedrooms</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['1', '2', '3', '4+'].map((bedroom) => (
                        <div key={bedroom} className="flex items-center">
                          <Checkbox
                            id={`bedroom-${bedroom}`}
                            checked={selectedBedrooms.includes(bedroom)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedBedrooms([...selectedBedrooms, bedroom]);
                              } else {
                                setSelectedBedrooms(selectedBedrooms.filter((b) => b !== bedroom));
                              }
                            }}
                            className="mr-2"
                          />
                          <Label htmlFor={`bedroom-${bedroom}`} className="text-gray-400">{bedroom}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Minimum Grade Filter */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Minimum Grade: {minGrade}</Label>
                    <Slider
                      defaultValue={[minGrade]}
                      max={10}
                      step={1}
                      onValueChange={(value) => setMinGrade(value[0])}
                      className="w-full"
                    />
                  </div>

                  {/* Boroughs Filter */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Boroughs</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {boroughs.map((borough) => (
                        <div key={borough} className="flex items-center">
                          <Checkbox
                            id={`borough-${borough}`}
                            checked={selectedBoroughs.includes(borough)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedBoroughs([...selectedBoroughs, borough]);
                              } else {
                                setSelectedBoroughs(selectedBoroughs.filter((b) => b !== borough));
                              }
                            }}
                            className="mr-2"
                          />
                          <Label htmlFor={`borough-${borough}`} className="text-gray-400">{borough}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Minimum Square Footage Filter */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Minimum Sqft: {minSqft}</Label>
                    <Slider
                      defaultValue={[minSqft]}
                      max={5000}
                      step={100}
                      onValueChange={(value) => setMinSqft(value[0])}
                      className="w-full"
                    />
                  </div>

                  {/* Minimum Discount Filter */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Minimum Discount: {minDiscount}%</Label>
                    <Slider
                      defaultValue={[minDiscount]}
                      max={50}
                      step={5}
                      onValueChange={(value) => setMinDiscount(value[0])}
                      className="w-full"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Sorting Select */}
        <div className="mb-4">
          <Select onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] bg-gray-800 text-white border-gray-700 rounded-md">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700 rounded-md">
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low-high">Price (Low to High)</SelectItem>
              <SelectItem value="price-high-low">Price (High to Low)</SelectItem>
              <SelectItem value="sqft-low-high">Sqft (Low to High)</SelectItem>
              <SelectItem value="sqft-high-low">Sqft (High to Low)</SelectItem>
              <SelectItem value="score-low-high">Score (Low to High)</SelectItem>
              <SelectItem value="score-high-low">Score (High to Low)</SelectItem>
              <SelectItem value="newest-listed">Newest Listed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Listings */}
        {isLoading ? (
          <div className="flex justify-center">
            <BeatLoader color="#ffffff" />
          </div>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salesData && salesData.length > 0 ? (
              salesData.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <p>No properties found matching your criteria.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Buy;

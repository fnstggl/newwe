
// Geocoding cache to avoid repeated API calls
const geocodeCache = new Map<string, { lat: number; lng: number }>();

// Rate limiting for Nominatim API (1 request per second)
let lastRequestTime = 0;
const RATE_LIMIT_MS = 1100; // Slightly more than 1 second to be safe

export interface Coordinates {
  lat: number;
  lng: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  if (!address || address.trim() === '') {
    console.log('🗺️ Empty address provided for geocoding');
    return null;
  }

  // Check cache first
  if (geocodeCache.has(address)) {
    console.log('🗺️ Using cached coordinates for:', address);
    return geocodeCache.get(address)!;
  }

  try {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_MS) {
      const waitTime = RATE_LIMIT_MS - timeSinceLastRequest;
      console.log(`🗺️ Rate limiting: waiting ${waitTime}ms before geocoding:`, address);
      await delay(waitTime);
    }

    lastRequestTime = Date.now();

    // Format address for NYC - be more specific
    const formattedAddress = `${address}, New York, NY, USA`;
    const encodedAddress = encodeURIComponent(formattedAddress);
    
    console.log('🗺️ Geocoding address:', formattedAddress);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=us&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'RealerEstate/1.0 (contact@realerestate.org)'
        }
      }
    );

    if (!response.ok) {
      console.error('🗺️ Geocoding API error:', response.status, response.statusText);
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('🗺️ Geocoding response for', address, ':', data);
    
    if (data && data.length > 0) {
      const result = data[0];
      const coords = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      };
      
      // Validate coordinates are reasonable for NYC area
      if (coords.lat >= 40.4 && coords.lat <= 41.0 && coords.lng >= -74.5 && coords.lng <= -73.5) {
        console.log('🗺️ Successfully geocoded:', address, 'to', coords);
        // Cache the result
        geocodeCache.set(address, coords);
        return coords;
      } else {
        console.warn('🗺️ Coordinates outside NYC area for:', address, coords);
      }
    } else {
      console.warn('🗺️ No results found for address:', address);
    }

    return null;
  } catch (error) {
    console.error('🗺️ Geocoding error for address:', address, error);
    return null;
  }
}

// Batch geocode multiple addresses with proper rate limiting
export async function geocodeAddresses(addresses: string[]): Promise<Map<string, Coordinates>> {
  console.log('🗺️ Starting batch geocoding for', addresses.length, 'addresses');
  const results = new Map<string, Coordinates>();
  
  for (const address of addresses) {
    if (address && address.trim() !== '') {
      const coords = await geocodeAddress(address);
      if (coords) {
        results.set(address, coords);
      }
    }
  }
  
  console.log('🗺️ Batch geocoding completed. Successfully geocoded', results.size, 'out of', addresses.length, 'addresses');
  return results;
}

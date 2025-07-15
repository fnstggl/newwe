
// Geocoding cache to avoid repeated API calls
const geocodeCache = new Map<string, { lat: number; lng: number }>();

// Rate limiting for Nominatim API (1 request per second)
let lastRequestTime = 0;
const RATE_LIMIT_MS = 1000;

export interface Coordinates {
  lat: number;
  lng: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  // Check cache first
  if (geocodeCache.has(address)) {
    return geocodeCache.get(address)!;
  }

  try {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_MS) {
      await delay(RATE_LIMIT_MS - timeSinceLastRequest);
    }

    lastRequestTime = Date.now();

    // Format address for NYC
    const formattedAddress = `${address}, New York, NY, USA`;
    const encodedAddress = encodeURIComponent(formattedAddress);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=us`,
      {
        headers: {
          'User-Agent': 'RealerEstate/1.0 (contact@realerestate.org)'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const coords = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      
      // Cache the result
      geocodeCache.set(address, coords);
      return coords;
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Batch geocode multiple addresses with proper rate limiting
export async function geocodeAddresses(addresses: string[]): Promise<Map<string, Coordinates>> {
  const results = new Map<string, Coordinates>();
  
  for (const address of addresses) {
    if (address) {
      const coords = await geocodeAddress(address);
      if (coords) {
        results.set(address, coords);
      }
    }
  }
  
  return results;
}

export interface NeighborhoodInfo {
  borough: string;
  coordinates: { lat: number; lng: number };
  description: string;
  averageRent: number;
  walkScore: number;
}

export const neighborhoodData: Record<string, NeighborhoodInfo> = {
  // Manhattan neighborhoods
  "Lower East Side": {
    borough: "Manhattan",
    coordinates: { lat: 40.7154, lng: -73.9857 },
    description: "Historic immigrant neighborhood with trendy restaurants and nightlife",
    averageRent: 3800,
    walkScore: 98
  },
  "East Village": {
    borough: "Manhattan",
    coordinates: { lat: 40.7264, lng: -73.9818 },
    description: "Bohemian enclave with art galleries, vintage shops, and diverse dining",
    averageRent: 4200,
    walkScore: 98
  },
  "West Village": {
    borough: "Manhattan",
    coordinates: { lat: 40.7357, lng: -74.0023 },
    description: "Charming cobblestone streets with upscale dining and historic brownstones",
    averageRent: 5500,
    walkScore: 98
  },
  "SoHo": {
    borough: "Manhattan",
    coordinates: { lat: 40.7233, lng: -74.0030 },
    description: "Shopping district with cast-iron architecture and art galleries",
    averageRent: 6000,
    walkScore: 96
  },
  "Tribeca": {
    borough: "Manhattan",
    coordinates: { lat: 40.7195, lng: -74.0137 },
    description: "Upscale residential area with converted warehouses and fine dining",
    averageRent: 6500,
    walkScore: 94
  },
  "NoLita": {
    borough: "Manhattan",
    coordinates: { lat: 40.7227, lng: -73.9955 },
    description: "Trendy boutiques and cafes in a compact, walkable area",
    averageRent: 4800,
    walkScore: 97
  },
  "Chelsea": {
    borough: "Manhattan",
    coordinates: { lat: 40.7465, lng: -73.9971 },
    description: "Art galleries, the High Line, and vibrant nightlife scene",
    averageRent: 4500,
    walkScore: 96
  },
  "Flatiron": {
    borough: "Manhattan",
    coordinates: { lat: 40.7411, lng: -73.9897 },
    description: "Business district with historic architecture and Madison Square Park",
    averageRent: 4800,
    walkScore: 98
  },
  "Gramercy": {
    borough: "Manhattan",
    coordinates: { lat: 40.7368, lng: -73.9841 },
    description: "Quiet residential area with private park and historic buildings",
    averageRent: 4600,
    walkScore: 95
  },
  "Murray Hill": {
    borough: "Manhattan",
    coordinates: { lat: 40.7505, lng: -73.9779 },
    description: "Residential neighborhood popular with young professionals",
    averageRent: 3900,
    walkScore: 94
  },
  "Midtown": {
    borough: "Manhattan",
    coordinates: { lat: 40.7549, lng: -73.9840 },
    description: "Commercial hub with Times Square, Broadway theaters, and skyscrapers",
    averageRent: 4200,
    walkScore: 98
  },
  "Hell's Kitchen": {
    borough: "Manhattan",
    coordinates: { lat: 40.7648, lng: -73.9882 },
    description: "Theater district proximity with diverse dining and nightlife",
    averageRent: 3800,
    walkScore: 98
  },
  "Upper East Side": {
    borough: "Manhattan",
    coordinates: { lat: 40.7736, lng: -73.9566 },
    description: "Upscale residential area with museums, boutiques, and Central Park access",
    averageRent: 4000,
    walkScore: 96
  },
  "Upper West Side": {
    borough: "Manhattan",
    coordinates: { lat: 40.7870, lng: -73.9754 },
    description: "Family-friendly with Lincoln Center, Central Park, and pre-war buildings",
    averageRent: 3700,
    walkScore: 98
  },
  "Morningside Heights": {
    borough: "Manhattan",
    coordinates: { lat: 40.8076, lng: -73.9626 },
    description: "College town atmosphere with Columbia University and affordable dining",
    averageRent: 2800,
    walkScore: 92
  },
  "Harlem": {
    borough: "Manhattan",
    coordinates: { lat: 40.8116, lng: -73.9442 },
    description: "Rich cultural history with jazz clubs, soul food, and historic brownstones",
    averageRent: 2200,
    walkScore: 88
  },
  "Washington Heights": {
    borough: "Manhattan",
    coordinates: { lat: 40.8518, lng: -73.9351 },
    description: "Diverse neighborhood with Fort Tryon Park and affordable housing",
    averageRent: 1800,
    walkScore: 85
  },
  "Inwood": {
    borough: "Manhattan",
    coordinates: { lat: 40.8677, lng: -73.9212 },
    description: "Northernmost Manhattan with parks, affordable rent, and Dominican culture",
    averageRent: 1600,
    walkScore: 82
  },

  // Brooklyn neighborhoods
  "Williamsburg": {
    borough: "Brooklyn",
    coordinates: { lat: 40.7081, lng: -73.9571 },
    description: "Hipster haven with artisanal everything, waterfront views, and trendy nightlife",
    averageRent: 3400,
    walkScore: 94
  },
  "DUMBO": {
    borough: "Brooklyn",
    coordinates: { lat: 40.7033, lng: -73.9903 },
    description: "Upscale waterfront area with cobblestone streets and Manhattan Bridge views",
    averageRent: 4200,
    walkScore: 89
  },
  "Brooklyn Heights": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6962, lng: -73.9929 },
    description: "Historic district with promenade overlooking Manhattan skyline",
    averageRent: 3800,
    walkScore: 91
  },
  "Park Slope": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6736, lng: -73.9796 },
    description: "Family-friendly with Victorian architecture and Prospect Park proximity",
    averageRent: 3200,
    walkScore: 95
  },
  "Carroll Gardens": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6783, lng: -73.9999 },
    description: "Italian-American heritage with tree-lined streets and local markets",
    averageRent: 3000,
    walkScore: 89
  },
  "Cobble Hill": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6861, lng: -73.9969 },
    description: "Charming brownstones with boutique shopping and cozy cafes",
    averageRent: 3300,
    walkScore: 90
  },
  "Red Hook": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6743, lng: -74.0120 },
    description: "Waterfront community with art studios, food vendors, and maritime history",
    averageRent: 2600,
    walkScore: 68
  },
  "Gowanus": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6733, lng: -73.9884 },
    description: "Industrial area undergoing gentrification with art galleries and new developments",
    averageRent: 2800,
    walkScore: 84
  },
  "Greenpoint": {
    borough: "Brooklyn",
    coordinates: { lat: 40.7306, lng: -73.9441 },
    description: "Polish heritage neighborhood with waterfront parks and trendy restaurants",
    averageRent: 2900,
    walkScore: 87
  },
  "Bushwick": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6944, lng: -73.9213 },
    description: "Arts district with street murals, music venues, and affordable living",
    averageRent: 2400,
    walkScore: 84
  },
  "Bedford-Stuyvesant": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6895, lng: -73.9441 },
    description: "Historic brownstones with rich African-American culture and emerging food scene",
    averageRent: 2200,
    walkScore: 86
  },
  "Crown Heights": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6677, lng: -73.9425 },
    description: "Diverse community with Caribbean culture and the Brooklyn Museum nearby",
    averageRent: 2000,
    walkScore: 83
  },
  "Prospect Heights": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6762, lng: -73.9664 },
    description: "Close to Prospect Park and Barclays Center with diverse dining options",
    averageRent: 2800,
    walkScore: 92
  },
  "Fort Greene": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6919, lng: -73.9753 },
    description: "Historic district with Fort Greene Park and vibrant arts scene",
    averageRent: 2700,
    walkScore: 89
  },
  "Clinton Hill": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6882, lng: -73.9680 },
    description: "Tree-lined streets with historic architecture and local cafes",
    averageRent: 2500,
    walkScore: 87
  },
  "Boerum Hill": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6888, lng: -73.9909 },
    description: "Quiet residential area with easy access to multiple neighborhoods",
    averageRent: 3100,
    walkScore: 91
  },
  "Downtown Brooklyn": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6927, lng: -73.9857 },
    description: "Business district with shopping, dining, and transportation hub",
    averageRent: 3000,
    walkScore: 95
  },
  "Sunset Park": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6553, lng: -74.0105 },
    description: "Diverse community with large park and Manhattan views",
    averageRent: 1900,
    walkScore: 79
  },
  "Bay Ridge": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6323, lng: -74.0269 },
    description: "Family-friendly with waterfront promenade and Norwegian heritage",
    averageRent: 2100,
    walkScore: 81
  },
  "Dyker Heights": {
    borough: "Brooklyn",
    coordinates: { lat: 40.6214, lng: -74.0134 },
    description: "Residential area known for elaborate Christmas light displays",
    averageRent: 1800,
    walkScore: 65
  },

  // Queens neighborhoods
  "Long Island City": {
    borough: "Queens",
    coordinates: { lat: 40.7505, lng: -73.9352 },
    description: "Rapidly developing with high-rises, art museums, and Manhattan skyline views",
    averageRent: 2800,
    walkScore: 85
  },
  "Astoria": {
    borough: "Queens",
    coordinates: { lat: 40.7698, lng: -73.9242 },
    description: "Greek heritage with diverse dining, parks, and affordable living",
    averageRent: 2300,
    walkScore: 87
  },
  "Sunnyside": {
    borough: "Queens",
    coordinates: { lat: 40.7434, lng: -73.9258 },
    description: "Garden city planning with tree-lined streets and Irish-American culture",
    averageRent: 2200,
    walkScore: 82
  },
  "Woodside": {
    borough: "Queens",
    coordinates: { lat: 40.7454, lng: -73.9057 },
    description: "Multi-ethnic community with authentic cuisine and affordable housing",
    averageRent: 2000,
    walkScore: 85
  },
  "Jackson Heights": {
    borough: "Queens",
    coordinates: { lat: 40.7556, lng: -73.8831 },
    description: "Culturally diverse with authentic international food and shopping",
    averageRent: 1900,
    walkScore: 88
  },
  "Elmhurst": {
    borough: "Queens",
    coordinates: { lat: 40.7362, lng: -73.8801 },
    description: "One of the most diverse areas in the world with authentic ethnic cuisine",
    averageRent: 1800,
    walkScore: 82
  },
  "Corona": {
    borough: "Queens",
    coordinates: { lat: 40.7498, lng: -73.8623 },
    description: "Latino community with Citi Field, Flushing Meadows Park nearby",
    averageRent: 1700,
    walkScore: 78
  },
  "Flushing": {
    borough: "Queens",
    coordinates: { lat: 40.7677, lng: -73.8331 },
    description: "Chinatown with authentic Asian cuisine, shopping, and cultural sites",
    averageRent: 1800,
    walkScore: 86
  },
  "Forest Hills": {
    borough: "Queens",
    coordinates: { lat: 40.7214, lng: -73.8448 },
    description: "Suburban feel with Tudor-style homes and the US Open tennis venue",
    averageRent: 2100,
    walkScore: 80
  },
  "Rego Park": {
    borough: "Queens",
    coordinates: { lat: 40.7264, lng: -73.8615 },
    description: "Shopping destination with diverse community and good transportation",
    averageRent: 2000,
    walkScore: 84
  },
  "Kew Gardens": {
    borough: "Queens",
    coordinates: { lat: 40.7071, lng: -73.8309 },
    description: "Quiet residential area with Tudor architecture and tree-lined streets",
    averageRent: 1900,
    walkScore: 75
  },
  "Ridgewood": {
    borough: "Queens",
    coordinates: { lat: 40.7006, lng: -73.9012 },
    description: "Affordable area with German heritage and growing arts scene",
    averageRent: 1800,
    walkScore: 81
  },

  // Bronx neighborhoods
  "Mott Haven": {
    borough: "Bronx",
    coordinates: { lat: 40.8089, lng: -73.9262 },
    description: "Waterfront views with growing arts district and affordable housing",
    averageRent: 1600,
    walkScore: 85
  },
  "South Bronx": {
    borough: "Bronx",
    coordinates: { lat: 40.8176, lng: -73.9182 },
    description: "Rich hip-hop history with cultural sites and community development",
    averageRent: 1500,
    walkScore: 80
  },
  "Concourse": {
    borough: "Bronx",
    coordinates: { lat: 40.8272, lng: -73.9196 },
    description: "Grand Concourse with Art Deco architecture and Yankee Stadium nearby",
    averageRent: 1400,
    walkScore: 84
  },
  "Fordham": {
    borough: "Bronx",
    coordinates: { lat: 40.8619, lng: -73.9016 },
    description: "University area with shopping district and diverse dining options",
    averageRent: 1500,
    walkScore: 86
  },
  "Riverdale": {
    borough: "Bronx",
    coordinates: { lat: 40.8988, lng: -73.9057 },
    description: "Upscale residential area with single-family homes and private schools",
    averageRent: 2000,
    walkScore: 65
  },

  // Staten Island neighborhoods
  "St. George": {
    borough: "Staten Island",
    coordinates: { lat: 40.6432, lng: -74.0776 },
    description: "Ferry terminal area with cultural attractions and harbor views",
    averageRent: 1600,
    walkScore: 78
  },
  "Stapleton": {
    borough: "Staten Island",
    coordinates: { lat: 40.6276, lng: -74.0776 },
    description: "Historic waterfront community with diverse population",
    averageRent: 1400,
    walkScore: 72
  },
  "New Brighton": {
    borough: "Staten Island",
    coordinates: { lat: 40.6412, lng: -74.0865 },
    description: "Historic district with Victorian architecture and cultural sites",
    averageRent: 1500,
    walkScore: 70
  }
};

export const boroughs = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];

export const getNeighborhoodsByBorough = (borough: string): string[] => {
  return Object.keys(neighborhoodData).filter(
    (neighborhood) => neighborhoodData[neighborhood].borough === borough
  );
};

export const getAllNeighborhoods = (): string[] => {
  return Object.keys(neighborhoodData);
};

export const getNeighborhoodInfo = (neighborhood: string): NeighborhoodInfo | undefined => {
  return neighborhoodData[neighborhood];
};

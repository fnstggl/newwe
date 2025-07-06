
export interface NeighborhoodInfo {
  description: string;
  pros: string[];
  cons: string[];
}

export const neighborhoodData: { [key: string]: NeighborhoodInfo } = {
  'upper east side': {
    description: 'A sophisticated and upscale neighborhood known for its luxury shopping, world-class museums, and elegant pre-war buildings. Home to Museum Mile and Central Park\'s eastern border.',
    pros: ['Great for families', 'Excellent schools', 'Beautiful architecture'],
    cons: ['Limited nightlife', 'More expensive', 'Less diverse dining']
  },
  'upper west side': {
    description: 'A cultural hub with a neighborhood feel, featuring tree-lined streets, historic brownstones, and proximity to Central Park and Lincoln Center.',
    pros: ['Family-friendly', 'Great culture scene', 'Good restaurants'],
    cons: ['Can be quiet at night', 'Limited shopping', 'Tourist crowds']
  },
  'lower east side': {
    description: 'A vibrant and eclectic neighborhood that blends historic immigrant culture with modern hipster appeal, known for its nightlife and diverse food scene.',
    pros: ['Great nightlife', 'Excellent food scene', 'Rich history'],
    cons: ['Can be noisy', 'Limited green space', 'Crowded on weekends']
  },
  'soho': {
    description: 'A trendy shopping district with cobblestone streets and cast-iron architecture, famous for high-end boutiques, art galleries, and loft-style living.',
    pros: ['Amazing shopping', 'Beautiful architecture', 'Great for art lovers'],
    cons: ['Very expensive', 'Tourist heavy', 'Limited local amenities']
  },
  'chelsea': {
    description: 'A dynamic neighborhood known for its art galleries, the High Line park, and vibrant nightlife scene, with a mix of modern and historic architecture.',
    pros: ['Great art scene', 'Excellent nightlife', 'Good transportation'],
    cons: ['Can be expensive', 'Crowded streets', 'Limited parking']
  },
  'greenwich village': {
    description: 'A charming bohemian neighborhood with tree-lined streets, historic townhouses, and a rich artistic heritage, known for its cozy cafes and intimate venues.',
    pros: ['Charming atmosphere', 'Great cafes', 'Rich history'],
    cons: ['Very expensive', 'Limited space', 'Tourist crowds']
  },
  'east village': {
    description: 'A gritty and artistic neighborhood with a punk rock heritage, known for its dive bars, experimental restaurants, and young creative community.',
    pros: ['Great nightlife', 'Diverse food scene', 'Artistic community'],
    cons: ['Can be noisy', 'Less family-friendly', 'Limited green space']
  },
  'tribeca': {
    description: 'An upscale neighborhood with cobblestone streets and converted industrial buildings, known for its celebrity residents and high-end dining scene.',
    pros: ['Luxury living', 'Excellent restaurants', 'Quiet streets'],
    cons: ['Very expensive', 'Limited nightlife', 'Can feel isolated']
  },
  'williamsburg': {
    description: 'A trendy Brooklyn neighborhood across the East River, known for its hipster culture, artisanal food scene, and stunning Manhattan skyline views.',
    pros: ['Great food scene', 'Vibrant nightlife', 'Beautiful waterfront'],
    cons: ['Can be pretentious', 'Expensive for Brooklyn', 'Limited subway access']
  },
  'park slope': {
    description: 'A family-friendly Brooklyn neighborhood with tree-lined streets, Victorian brownstones, and proximity to Prospect Park, known for its community feel.',
    pros: ['Very family-friendly', 'Beautiful architecture', 'Great parks'],
    cons: ['Can be quiet', 'Limited nightlife', 'Expensive for families']
  },
  'midtown': {
    description: 'The bustling heart of Manhattan, home to iconic landmarks like Times Square and the Empire State Building, with endless dining and entertainment options.',
    pros: ['Great transportation', 'Amazing dining', 'Tourist attractions'],
    cons: ['Very crowded', 'Expensive', 'Noisy']
  },
  'financial district': {
    description: 'The historic financial center of NYC with Wall Street at its core, featuring modern skyscrapers mixed with colonial-era buildings and waterfront views.',
    pros: ['Historic significance', 'Waterfront access', 'Good restaurants'],
    cons: ['Quiet on weekends', 'Limited nightlife', 'Tourist heavy']
  }
};

export const getNeighborhoodInfo = (neighborhood: string | null): NeighborhoodInfo | null => {
  if (!neighborhood) return null;
  
  // Convert to lowercase for lookup and handle the case matching
  const normalizedNeighborhood = neighborhood.toLowerCase().trim();
  
  return neighborhoodData[normalizedNeighborhood] || {
    description: `${neighborhood} is a distinctive New York neighborhood with its own unique character and charm, offering residents a blend of urban convenience and local community feel.`,
    pros: ['Good transportation', 'Local character', 'Urban convenience'],
    cons: ['Varies by location', 'City noise', 'Parking challenges']
  };
};

export const capitalizeNeighborhood = (neighborhood: string | null): string => {
  if (!neighborhood) return '';
  
  return neighborhood
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

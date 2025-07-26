
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
    description: 'An upscale shopping and arts district known for its cast-iron architecture, high-end boutiques, and art galleries.',
    pros: ['Great shopping', 'Beautiful architecture', 'Art scene'],
    cons: ['Very expensive', 'Tourist crowds', 'Limited nightlife']
  },
  'tribeca': {
    description: 'A trendy and affluent neighborhood with converted industrial buildings, upscale restaurants, and a family-friendly atmosphere.',
    pros: ['Family-friendly', 'Great restaurants', 'Beautiful lofts'],
    cons: ['Very expensive', 'Limited nightlife', 'Can be quiet']
  },
  'west village': {
    description: 'A charming, historic neighborhood with tree-lined streets, historic brownstones, and a bohemian atmosphere.',
    pros: ['Beautiful architecture', 'Great restaurants', 'Walkable streets'],
    cons: ['Very expensive', 'Limited parking', 'Tourist crowds']
  },
  'east village': {
    description: 'A vibrant and eclectic neighborhood known for its diverse dining scene, nightlife, and artistic community.',
    pros: ['Great nightlife', 'Diverse food scene', 'Cultural attractions'],
    cons: ['Can be noisy', 'Limited green space', 'Crowded']
  },
  'chelsea': {
    description: 'A trendy neighborhood known for art galleries, the High Line park, and a vibrant LGBTQ+ community.',
    pros: ['Great art scene', 'High Line park', 'Trendy restaurants'],
    cons: ['Expensive', 'Crowded', 'Limited green space']
  },
  'gramercy': {
    description: 'An elegant and quiet residential neighborhood centered around the private Gramercy Park, known for its historic charm.',
    pros: ['Quiet and residential', 'Beautiful architecture', 'Central location'],
    cons: ['Limited nightlife', 'Expensive', 'Less diverse dining']
  },
  'gramercy-park': {
    description: 'An elegant and quiet residential neighborhood centered around the private Gramercy Park, known for its historic charm.',
    pros: ['Quiet and residential', 'Beautiful architecture', 'Central location'],
    cons: ['Limited nightlife', 'Expensive', 'Less diverse dining']
  },
  'midtown-east': {
    description: 'The business heart of Manhattan, featuring skyscrapers, corporate headquarters, and convenient transportation hubs.',
    pros: ['Excellent transportation connections', 'Close to major business centers', 'Convenient for commuting professionals'],
    cons: ['Very expensive and crowded during business hours', 'Limited residential feel and community atmosphere']
  },
  'midtown-west': {
    description: 'Home to Times Square, Broadway theaters, and Hell\'s Kitchen. A bustling area with entertainment and dining options.',
    pros: ['Vibrant nightlife and entertainment scene', 'Excellent restaurants and Broadway shows', 'Great transportation access'],
    cons: ['Very touristy and crowded', 'Expensive with noise and congestion']
  },
  'hell\'s kitchen': {
    description: 'A diverse neighborhood known for its restaurants, proximity to Times Square, and growing residential appeal.',
    pros: ['Great restaurants', 'Good transportation', 'Growing arts scene'],
    cons: ['Can be crowded', 'Tourist overflow', 'Noisy']
  },
  'williamsburg': {
    description: 'A hip Brooklyn neighborhood known for its artisanal food scene, vintage shops, and waterfront views of Manhattan.',
    pros: ['Great food scene', 'Trendy shops', 'Waterfront views'],
    cons: ['Expensive', 'Crowded', 'Hipster saturation']
  },
  'brooklyn heights': {
    description: 'An elegant Brooklyn neighborhood with historic brownstones and stunning views of Manhattan from the Promenade.',
    pros: ['Beautiful architecture', 'Great views', 'Family-friendly'],
    cons: ['Very expensive', 'Limited nightlife', 'Tourist crowds']
  },
  'dumbo': {
    description: 'A trendy waterfront neighborhood in Brooklyn known for its cobblestone streets, art galleries, and Manhattan Bridge views.',
    pros: ['Waterfront location', 'Great views', 'Art scene'],
    cons: ['Very expensive', 'Limited restaurants', 'Touristy']
  },
  'park slope': {
    description: 'A family-friendly Brooklyn neighborhood known for its Victorian brownstones, Prospect Park proximity, and excellent schools.',
    pros: ['Family-friendly', 'Great schools', 'Beautiful architecture'],
    cons: ['Expensive', 'Can be crowded', 'Limited nightlife']
  },
  'prospect heights': {
    description: 'A diverse Brooklyn neighborhood adjacent to Prospect Park, known for its cultural attractions and tree-lined streets.',
    pros: ['Cultural attractions', 'Near Prospect Park', 'Diverse community'],
    cons: ['Expensive', 'Limited parking', 'Can be crowded']
  },
  'long island city': {
    description: 'A rapidly developing Queens neighborhood with modern high-rises, waterfront parks, and easy Manhattan access.',
    pros: ['Modern amenities', 'Great transportation', 'Waterfront views'],
    cons: ['Lacks character', 'Construction noise', 'Limited culture']
  },
  'astoria': {
    description: 'A diverse Queens neighborhood known for its Greek heritage, affordable dining, and growing arts scene.',
    pros: ['Diverse food scene', 'More affordable', 'Growing arts community'],
    cons: ['Further from Manhattan', 'Limited high-end shopping', 'Some areas less developed']
  },
  'mott haven': {
    description: 'An up-and-coming South Bronx neighborhood with growing arts scene, waterfront access, and more affordable housing.',
    pros: ['More affordable', 'Growing arts scene', 'Waterfront access'],
    cons: ['Still developing', 'Limited amenities', 'Longer commute']
  },
  'melrose': {
    description: 'A diverse Bronx neighborhood with rich Latin American culture, affordable housing, and growing community development.',
    pros: ['Affordable housing', 'Rich cultural diversity', 'Growing community'],
    cons: ['Limited amenities', 'Longer commute', 'Still developing']
  }
};

// Enhanced function to get neighborhood info with better matching
export const getNeighborhoodInfo = (neighborhood: string): NeighborhoodInfo | null => {
  if (!neighborhood) return null;
  
  const normalizedNeighborhood = neighborhood.toLowerCase().trim();
  
  // Direct match
  if (neighborhoodData[normalizedNeighborhood]) {
    return neighborhoodData[normalizedNeighborhood];
  }
  
  // Handle common variations
  const variations: { [key: string]: string } = {
    'gramercy-park': 'gramercy',
    'gramercypark': 'gramercy',
    'hells-kitchen': 'hell\'s kitchen',
    'hellskitchen': 'hell\'s kitchen',
    'midtown east': 'midtown-east',
    'midtown west': 'midtown-west',
    'upper-east-side': 'upper east side',
    'upper-west-side': 'upper west side',
    'lower-east-side': 'lower east side',
    'west-village': 'west village',
    'east-village': 'east village',
    'brooklyn-heights': 'brooklyn heights',
    'park-slope': 'park slope',
    'prospect-heights': 'prospect heights',
    'long-island-city': 'long island city',
    'mott-haven': 'mott haven'
  };
  
  // Check variations
  const variation = variations[normalizedNeighborhood];
  if (variation && neighborhoodData[variation]) {
    return neighborhoodData[variation];
  }
  
  // Fallback: try removing hyphens and checking
  const withoutHyphens = normalizedNeighborhood.replace(/-/g, ' ');
  if (neighborhoodData[withoutHyphens]) {
    return neighborhoodData[withoutHyphens];
  }
  
  // Fallback: try adding hyphens and checking
  const withHyphens = normalizedNeighborhood.replace(/ /g, '-');
  if (neighborhoodData[withHyphens]) {
    return neighborhoodData[withHyphens];
  }
  
  return null;
};

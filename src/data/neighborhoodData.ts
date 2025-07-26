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
  },
  'astoria': {
    description: 'A diverse Queens neighborhood known for its affordable housing, authentic Greek cuisine, and strong community feel with easy Manhattan access.',
    pros: ['Affordable living', 'Great Greek food', 'Family-friendly'],
    cons: ['Limited nightlife', 'Fewer amenities', 'Commute to Manhattan']
  },
  'bedford-stuyvesant': {
    description: 'A historic Brooklyn neighborhood experiencing rapid gentrification, known for its beautiful brownstones, rich African-American heritage, and emerging food scene.',
    pros: ['Beautiful architecture', 'Rich culture', 'More affordable'],
    cons: ['Gentrification issues', 'Safety concerns', 'Limited subway access']
  },
  'boerum hill': {
    description: 'A quiet residential Brooklyn neighborhood with tree-lined streets, historic brownstones, and a small-town feel within the city.',
    pros: ['Quiet residential', 'Beautiful homes', 'Family-friendly'],
    cons: ['Limited nightlife', 'Expensive', 'Few amenities']
  },
  'brooklyn heights': {
    description: 'An elegant Brooklyn neighborhood with stunning Manhattan views, historic architecture, and the famous Brooklyn Heights Promenade.',
    pros: ['Amazing views', 'Historic charm', 'Quiet streets'],
    cons: ['Very expensive', 'Limited nightlife', 'Tourist crowds']
  },
  'bushwick': {
    description: 'A rapidly gentrifying Brooklyn neighborhood known for its vibrant street art, industrial spaces converted to lofts, and thriving nightlife scene.',
    pros: ['Great nightlife', 'Artist community', 'More affordable'],
    cons: ['Safety concerns', 'Gentrification', 'Industrial feel']
  },
  'carroll gardens': {
    description: 'A charming Brooklyn neighborhood known for its Italian heritage, tree-lined streets, and strong community feel with excellent restaurants.',
    pros: ['Great restaurants', 'Community feel', 'Beautiful streets'],
    cons: ['Limited nightlife', 'Expensive', 'Few bars']
  },
  'chinatown': {
    description: 'A bustling Manhattan neighborhood with authentic Chinese culture, incredible dim sum, street markets, and affordable shopping.',
    pros: ['Amazing food', 'Cultural experience', 'Affordable dining'],
    cons: ['Very crowded', 'Language barriers', 'Tourist heavy']
  },
  'clinton hill': {
    description: 'A diverse Brooklyn neighborhood known for its historic architecture, tree-lined streets, and proximity to both Fort Greene and Bed-Stuy.',
    pros: ['Good architecture', 'Diverse community', 'Central location'],
    cons: ['Gentrification', 'Limited amenities', 'Safety varies']
  },
  'cobble hill': {
    description: 'A small, upscale Brooklyn neighborhood known for its cobblestone streets, historic charm, and family-friendly atmosphere.',
    pros: ['Family-friendly', 'Historic charm', 'Quiet streets'],
    cons: ['Very expensive', 'Limited nightlife', 'Small area']
  },
  'concourse': {
    description: 'A South Bronx neighborhood known for its proximity to Yankee Stadium, diverse Latino culture, and affordable housing options.',
    pros: ['Affordable housing', 'Cultural diversity', 'Sports access'],
    cons: ['Safety concerns', 'Limited amenities', 'Commute times']
  },
  'crown heights': {
    description: 'A diverse Brooklyn neighborhood with a rich Caribbean and Jewish heritage, beautiful architecture, and emerging food scene.',
    pros: ['Cultural diversity', 'Beautiful buildings', 'More affordable'],
    cons: ['Safety varies', 'Gentrification', 'Limited nightlife']
  },
  'dumbo': {
    description: 'A waterfront Brooklyn neighborhood with cobblestone streets, converted warehouses, and stunning views of Manhattan and the Brooklyn Bridge.',
    pros: ['Amazing views', 'Waterfront parks', 'Unique architecture'],
    cons: ['Very expensive', 'Tourist heavy', 'Limited housing']
  },
  'fort greene': {
    description: 'A historic Brooklyn neighborhood known for its cultural institutions, beautiful brownstones, and strong African-American heritage.',
    pros: ['Rich culture', 'Beautiful architecture', 'Good restaurants'],
    cons: ['Expensive', 'Limited nightlife', 'Gentrification']
  },
  'gowanus': {
    description: 'An industrial Brooklyn neighborhood undergoing rapid development, known for its creative spaces, emerging food scene, and the Gowanus Canal.',
    pros: ['Creative community', 'Emerging dining', 'More affordable'],
    cons: ['Industrial feel', 'Environmental concerns', 'Limited amenities']
  },
  'gramercy park': {
    description: 'An elegant Manhattan neighborhood centered around a private park, known for its historic buildings, quiet streets, and upscale living.',
    pros: ['Quiet elegance', 'Historic charm', 'Central location'],
    cons: ['Very expensive', 'Limited nightlife', 'Exclusive feel']
  },
  'greenpoint': {
    description: 'A Polish-influenced Brooklyn neighborhood known for its waterfront views, authentic pierogi, and growing arts scene along the East River.',
    pros: ['Great Polish food', 'Waterfront access', 'Artist community'],
    cons: ['Limited subway', 'Industrial areas', 'Gentrification']
  },
  'kips bay': {
    description: 'A Midtown East Manhattan neighborhood known for its high-rise buildings, medical facilities, and convenient location near major attractions.',
    pros: ['Great location', 'Good transportation', 'Modern buildings'],
    cons: ['Lacks character', 'Expensive', 'Tourist heavy']
  },
  'little italy': {
    description: 'A historic Manhattan neighborhood celebrating Italian-American heritage with authentic restaurants, festivals, and Old World charm.',
    pros: ['Great Italian food', 'Historic charm', 'Cultural events'],
    cons: ['Tourist trap', 'Expensive dining', 'Limited housing']
  },
  'long island city': {
    description: 'A rapidly developing Queens neighborhood with stunning Manhattan skyline views, modern high-rises, and excellent transportation connections.',
    pros: ['Amazing views', 'New developments', 'Great transportation'],
    cons: ['Lacks character', 'Construction noise', 'Expensive for Queens']
  },
  'melrose': {
    description: 'A South Bronx neighborhood known for its Latino culture, affordable housing, and proximity to Yankee Stadium and the Harlem River.',
    pros: ['Affordable living', 'Cultural diversity', 'River access'],
    cons: ['Safety concerns', 'Limited amenities', 'Economic challenges']
  },
  'mott haven': {
    description: 'An emerging South Bronx neighborhood experiencing gentrification, known for its art galleries, waterfront development, and affordable housing.',
    pros: ['Emerging arts scene', 'Affordable housing', 'Waterfront development'],
    cons: ['Safety concerns', 'Limited amenities', 'Gentrification']
  },
  'murray hill': {
    description: 'A Midtown Manhattan neighborhood popular with young professionals, known for its high-rise buildings, restaurant scene, and central location.',
    pros: ['Great for young professionals', 'Good restaurants', 'Central location'],
    cons: ['Expensive', 'Crowded', 'Lacks character']
  },
  'nolita': {
    description: 'A trendy Manhattan neighborhood with boutique shopping, upscale dining, and a mix of old-world Italian charm with modern sophistication.',
    pros: ['Great shopping', 'Excellent dining', 'Historic charm'],
    cons: ['Very expensive', 'Tourist crowds', 'Limited space']
  },
    'park slope': {
    description: 'A family-friendly Brooklyn neighborhood with tree-lined streets, Victorian brownstones, and proximity to Prospect Park, known for its community feel.',
    pros: ['Very family-friendly', 'Beautiful architecture', 'Great parks'],
    cons: ['Can be quiet', 'Limited nightlife', 'Expensive for families']
  },
  'prospect heights': {
    description: 'A diverse Brooklyn neighborhood adjacent to Prospect Park, known for its cultural institutions like the Brooklyn Museum and Botanic Garden.',
    pros: ['Great culture', 'Park access', 'Diverse community'],
    cons: ['Gentrification', 'Expensive', 'Limited parking']
  },
  'ridgewood': {
    description: 'A Queens neighborhood on the Brooklyn border, known for its affordable housing, German heritage, and authentic beer gardens.',
    pros: ['Affordable living', 'Great beer gardens', 'Authentic culture'],
    cons: ['Limited nightlife', 'Commute to Manhattan', 'Industrial areas']
  },
  'two bridges': {
    description: 'A small Lower East Side neighborhood between the Manhattan and Brooklyn Bridges, known for its public housing and waterfront views.',
    pros: ['Waterfront access', 'Affordable housing', 'Bridge views'],
    cons: ['Limited amenities', 'Public housing concentration', 'Small area']
  },
  'west village': {
    description: 'A picturesque Manhattan neighborhood with winding streets, historic townhouses, and a bohemian atmosphere perfect for strolling.',
    pros: ['Beautiful streets', 'Great nightlife', 'Historic charm'],
    cons: ['Very expensive', 'Tourist crowds', 'Limited parking']
  },
  'woodside': {
    description: 'A diverse Queens neighborhood known for its Irish heritage, authentic pubs, and affordable family-friendly living.',
    pros: ['Family-friendly', 'Affordable living', 'Great Irish pubs'],
    cons: ['Limited nightlife', 'Commute to Manhattan', 'Few amenities']
  },
  'corona': {
    description: 'A diverse Queens neighborhood known for its Latino culture, authentic cuisine, and proximity to Flushing Meadows Corona Park.',
    pros: ['Great Latino food', 'Cultural diversity', 'Park access'],
    cons: ['Language barriers', 'Limited amenities', 'Crowded']
  },
  'elmhurst': {
    description: 'One of the most diverse neighborhoods in the world, located in Queens, known for its incredible variety of authentic ethnic restaurants.',
    pros: ['Amazing ethnic food', 'Cultural diversity', 'Affordable dining'],
    cons: ['Very crowded', 'Language barriers', 'Limited parking']
  },
  'jackson heights': {
    description: 'A vibrant Queens neighborhood known as one of the most ethnically diverse areas in the world, with incredible South Asian and Latin American food.',
    pros: ['Incredible food diversity', 'Cultural richness', 'Affordable living'],
    cons: ['Very crowded', 'Noise levels', 'Limited parking']
  },
  'sunnyside': {
    description: 'A quiet Queens neighborhood known for its garden community, tree-lined streets, and strong Irish and Latino populations.',
    pros: ['Quiet residential', 'Garden community', 'Family-friendly'],
    cons: ['Limited nightlife', 'Commute to Manhattan', 'Few amenities']
  }
};

export const getNeighborhoodInfo = (neighborhood: string | null): NeighborhoodInfo | null => {
  if (!neighborhood) return null;
  
  // Convert to lowercase for lookup and handle the case matching
  const normalizedNeighborhood = neighborhood.toLowerCase().trim();
  
  // Try direct lookup first
  if (neighborhoodData[normalizedNeighborhood]) {
    return neighborhoodData[normalizedNeighborhood];
  }
  
  // Try with hyphens replaced by spaces
  const withSpaces = normalizedNeighborhood.replace(/-/g, ' ');
  if (neighborhoodData[withSpaces]) {
    return neighborhoodData[withSpaces];
  }
  
  // Try with spaces replaced by hyphens
  const withHyphens = normalizedNeighborhood.replace(/\s+/g, '-');
  if (neighborhoodData[withHyphens]) {
    return neighborhoodData[withHyphens];
  }
  
  // Try removing 'the' prefix if it exists
  const withoutThe = normalizedNeighborhood.replace(/^the\s+/, '');
  if (neighborhoodData[withoutThe]) {
    return neighborhoodData[withoutThe];
  }
  
  // Fallback to generic description
  return {
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

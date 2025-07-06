

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
  'west village': {
    description: 'An upscale and picturesque neighborhood with cobblestone streets, historic townhouses, and trendy restaurants, offering a village-like atmosphere in Manhattan.',
    pros: ['Beautiful architecture', 'Great dining', 'Walkable streets'],
    cons: ['Very expensive', 'Tourist crowds', 'Limited parking']
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
    description: 'A diverse Queens neighborhood known for its Greek heritage, affordable housing, and authentic international cuisine, with easy Manhattan access.',
    pros: ['Affordable living', 'Great food scene', 'Cultural diversity'],
    cons: ['Limited nightlife', 'Fewer amenities', 'Commute to Manhattan']
  },
  'bedford-stuyvesant': {
    description: 'A historic Brooklyn neighborhood with beautiful brownstones and rich African-American culture, undergoing rapid gentrification and development.',
    pros: ['Beautiful architecture', 'Rich history', 'Emerging food scene'],
    cons: ['Safety concerns', 'Gentrification issues', 'Limited subway access']
  },
  'boerum hill': {
    description: 'A charming Brooklyn neighborhood with tree-lined streets, historic brownstones, and a small-town feel, popular with young families.',
    pros: ['Family-friendly', 'Great restaurants', 'Beautiful streets'],
    cons: ['Limited nightlife', 'Can be expensive', 'Small area']
  },
  'brooklyn heights': {
    description: 'An elegant and historic Brooklyn neighborhood with stunning Manhattan views, featuring beautiful brownstones and the famous Promenade.',
    pros: ['Amazing views', 'Historic charm', 'Family-friendly'],
    cons: ['Very expensive', 'Limited nightlife', 'Tourist crowds']
  },
  'bushwick': {
    description: 'An edgy Brooklyn neighborhood known for its street art, warehouse venues, and thriving creative community, with affordable living options.',
    pros: ['Great nightlife', 'Artistic community', 'Affordable rent'],
    cons: ['Safety concerns', 'Industrial feel', 'Limited amenities']
  },
  'carroll gardens': {
    description: 'A picturesque Brooklyn neighborhood with Italian-American roots, featuring beautiful brownstones, tree-lined streets, and excellent restaurants.',
    pros: ['Family-friendly', 'Great food scene', 'Beautiful architecture'],
    cons: ['Limited nightlife', 'Can be expensive', 'Limited subway access']
  },
  'chinatown': {
    description: 'A vibrant and densely packed neighborhood with authentic Chinese culture, incredible dim sum, and bustling street markets.',
    pros: ['Amazing food', 'Cultural authenticity', 'Affordable dining'],
    cons: ['Very crowded', 'Language barriers', 'Limited green space']
  },
  'clinton hill': {
    description: 'A diverse Brooklyn neighborhood with beautiful architecture, tree-lined streets, and proximity to Fort Greene Park and Pratt Institute.',
    pros: ['Beautiful brownstones', 'Good transportation', 'Cultural diversity'],
    cons: ['Gentrification issues', 'Limited nightlife', 'Some safety concerns']
  },
  'cobble hill': {
    description: 'A quaint Brooklyn neighborhood with cobblestone streets, historic charm, and excellent restaurants, popular with young professionals and families.',
    pros: ['Charming atmosphere', 'Great restaurants', 'Family-friendly'],
    cons: ['Very expensive', 'Limited nightlife', 'Small area']
  },
  'concourse': {
    description: 'A Bronx neighborhood centered around Yankee Stadium, with affordable housing and easy access to Manhattan via multiple subway lines.',
    pros: ['Affordable housing', 'Great transportation', 'Sports culture'],
    cons: ['Limited dining options', 'Safety concerns', 'Fewer amenities']
  },
  'crown heights': {
    description: 'A diverse Brooklyn neighborhood with rich Caribbean and Jewish communities, affordable housing, and proximity to Prospect Park.',
    pros: ['Cultural diversity', 'Affordable rent', 'Good transportation'],
    cons: ['Safety concerns', 'Limited amenities', 'Gentrification tensions']
  },
  'dumbo': {
    description: 'A trendy Brooklyn neighborhood under the Manhattan and Brooklyn Bridges, featuring converted warehouses, tech companies, and stunning waterfront views.',
    pros: ['Amazing views', 'Great restaurants', 'Tech hub'],
    cons: ['Very expensive', 'Tourist heavy', 'Limited residential options']
  },
  'fort greene': {
    description: 'A historic Brooklyn neighborhood with beautiful brownstones, tree-lined streets, and proximity to Fort Greene Park and BAM cultural district.',
    pros: ['Beautiful architecture', 'Cultural attractions', 'Good transportation'],
    cons: ['Can be expensive', 'Limited parking', 'Gentrification issues']
  },
  'gowanus': {
    description: 'An industrial Brooklyn neighborhood undergoing rapid development, known for its warehouses, art spaces, and the famous Gowanus Canal.',
    pros: ['Affordable rent', 'Creative community', 'Emerging dining scene'],
    cons: ['Industrial feel', 'Limited amenities', 'Environmental concerns']
  },
  'gramercy park': {
    description: 'An exclusive Manhattan neighborhood centered around a private park, featuring elegant pre-war buildings, fine dining, and quiet tree-lined streets.',
    pros: ['Quiet atmosphere', 'Beautiful architecture', 'Central location'],
    cons: ['Very expensive', 'Limited nightlife', 'Exclusive feel']
  },
  'greenpoint': {
    description: 'A trendy Brooklyn neighborhood with Polish roots, featuring waterfront views, hip restaurants, and a growing arts scene.',
    pros: ['Great food scene', 'Waterfront access', 'Artistic community'],
    cons: ['Limited subway access', 'Can be expensive', 'Industrial areas']
  },
  'kips bay': {
    description: 'A residential Manhattan neighborhood near Gramercy and Murray Hill, offering convenient location with a mix of high-rises and pre-war buildings.',
    pros: ['Central location', 'Good transportation', 'Medical facilities nearby'],
    cons: ['Limited character', 'Can be busy', 'Less nightlife']
  },
  'little italy': {
    description: 'A historic Manhattan neighborhood with Italian-American heritage, featuring authentic restaurants, annual festivals, and old-world charm.',
    pros: ['Great Italian food', 'Historic charm', 'Tourist attractions'],
    cons: ['Very touristy', 'Limited residential options', 'Can be crowded']
  },
  'long island city': {
    description: 'A rapidly developing Queens neighborhood with stunning Manhattan skyline views, modern high-rises, and easy commute to Midtown.',
    pros: ['Amazing views', 'New developments', 'Great transportation'],
    cons: ['Still developing', 'Limited character', 'Can feel sterile']
  },
  'melrose': {
    description: 'A South Bronx neighborhood with affordable housing, diverse Latino community, and easy access to Manhattan via multiple subway lines.',
    pros: ['Affordable housing', 'Cultural diversity', 'Good transportation'],
    cons: ['Safety concerns', 'Limited amenities', 'Urban decay']
  },
  'mott haven': {
    description: 'A historic South Bronx neighborhood undergoing revitalization, with affordable housing, waterfront access, and growing arts scene.',
    pros: ['Affordable rent', 'Waterfront views', 'Emerging arts scene'],
    cons: ['Safety concerns', 'Limited amenities', 'Still developing']
  },
  'murray hill': {
    description: 'A convenient Manhattan neighborhood popular with young professionals, featuring easy transportation access and proximity to Midtown business district.',
    pros: ['Great transportation', 'Central location', 'Good restaurants'],
    cons: ['Can be busy', 'Limited character', 'Crowded bars']
  },
  'nolita': {
    description: 'A trendy Manhattan neighborhood north of Little Italy, known for its boutique shopping, upscale dining, and cobblestone streets.',
    pros: ['Great shopping', 'Excellent restaurants', 'Trendy atmosphere'],
    cons: ['Very expensive', 'Tourist crowds', 'Limited green space']
  },
  'prospect heights': {
    description: 'A diverse Brooklyn neighborhood bordering Prospect Park, featuring beautiful pre-war buildings, great restaurants, and cultural attractions.',
    pros: ['Near Prospect Park', 'Cultural diversity', 'Great dining'],
    cons: ['Can be expensive', 'Limited parking', 'Crowded on weekends']
  },
  'ridgewood': {
    description: 'A quiet Queens neighborhood on the Brooklyn border, known for its affordable housing, historic architecture, and growing food scene.',
    pros: ['Affordable rent', 'Beautiful architecture', 'Emerging food scene'],
    cons: ['Limited nightlife', 'Commute to Manhattan', 'Still developing']
  },
  'two bridges': {
    description: 'A small Lower East Side neighborhood between the Manhattan and Brooklyn Bridges, with affordable housing and proximity to downtown attractions.',
    pros: ['Affordable housing', 'Central location', 'Waterfront access'],
    cons: ['Limited amenities', 'Can feel isolated', 'Traffic noise']
  },
  'woodside': {
    description: 'A diverse Queens neighborhood with strong Irish and Filipino communities, affordable housing, and authentic international cuisine.',
    pros: ['Cultural diversity', 'Affordable rent', 'Great food scene'],
    cons: ['Limited nightlife', 'Commute to Manhattan', 'Less trendy']
  ],
  'corona': {
    description: 'A diverse Queens neighborhood known for its Latin American community, authentic food scene, and proximity to Flushing Meadows Corona Park.',
    pros: ['Cultural authenticity', 'Great food scene', 'Affordable living'],
    cons: ['Language barriers', 'Limited amenities', 'Commute to Manhattan']
  },
  'elmhurst': {
    description: 'One of the most diverse neighborhoods in the world, located in Queens with incredible international food and affordable housing options.',
    pros: ['Amazing diversity', 'Great food scene', 'Affordable rent'],
    cons: ['Very crowded', 'Limited English', 'Busy streets']
  },
  'jackson heights': {
    description: 'A vibrant Queens neighborhood known for its incredible diversity, authentic international cuisine, and historic garden apartments.',
    pros: ['Cultural diversity', 'Amazing food', 'Historic architecture'],
    cons: ['Very crowded', 'Limited parking', 'Busy commercial areas']
  },
  'sunnyside': {
    description: 'A family-friendly Queens neighborhood with tree-lined streets, historic garden apartments, and a strong sense of community.',
    pros: ['Family-friendly', 'Good transportation', 'Community feel'],
    cons: ['Limited nightlife', 'Fewer amenities', 'Can be quiet']
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

export const capitalizeBorough = (borough: string | null): string => {
  if (!borough) return '';
  
  return borough
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};



// Similar neighborhoods mapping for fallback when no listings are found
export const similarNeighborhoods: Record<string, string[]> = {
  // Brooklyn neighborhoods
  'carroll-gardens': ['cobble-hill', 'boerum-hill', 'red-hook', 'brooklyn-heights'],
  'cobble-hill': ['carroll-gardens', 'boerum-hill', 'brooklyn-heights', 'dumbo'],
  'boerum-hill': ['carroll-gardens', 'cobble-hill', 'fort-greene', 'downtown-brooklyn'],
  'brooklyn-heights': ['dumbo', 'cobble-hill', 'downtown-brooklyn', 'carroll-gardens'],
  'park-slope': ['prospect-heights', 'windsor-terrace', 'gowanus', 'carroll-gardens'],
  'prospect-heights': ['park-slope', 'crown-heights', 'fort-greene', 'clinton-hill'],
  'williamsburg': ['greenpoint', 'bushwick', 'dumbo', 'bed-stuy'],
  'greenpoint': ['williamsburg', 'long-island-city', 'bushwick', 'astoria'],
  'bushwick': ['williamsburg', 'bed-stuy', 'ridgewood', 'east-williamsburg'],
  'bed-stuy': ['crown-heights', 'fort-greene', 'clinton-hill', 'bushwick'],
  'crown-heights': ['bed-stuy', 'prospect-heights', 'park-slope', 'flatbush'],
  'fort-greene': ['bed-stuy', 'clinton-hill', 'downtown-brooklyn', 'boerum-hill'],
  'dumbo': ['brooklyn-heights', 'williamsburg', 'downtown-brooklyn', 'vinegar-hill'],
  'red-hook': ['carroll-gardens', 'sunset-park', 'gowanus', 'columbia-street-waterfront'],
  'sunset-park': ['park-slope', 'bay-ridge', 'red-hook', 'greenwood'],
  'gowanus': ['park-slope', 'carroll-gardens', 'red-hook', 'prospect-heights'],
  'clinton-hill': ['fort-greene', 'bed-stuy', 'prospect-heights', 'clinton-hill'],

  // Manhattan neighborhoods
  'east-village': ['lower-east-side', 'west-village', 'nolita', 'soho'],
  'west-village': ['east-village', 'soho', 'chelsea', 'tribeca'],
  'lower-east-side': ['east-village', 'chinatown', 'nolita', 'two-bridges'],
  'soho': ['tribeca', 'west-village', 'nolita', 'little-italy'],
  'tribeca': ['soho', 'financial-district', 'west-village', 'battery-park-city'],
  'nolita': ['soho', 'little-italy', 'east-village', 'lower-east-side'],
  'chelsea': ['west-village', 'flatiron', 'hells-kitchen', 'gramercy'],
  'gramercy': ['flatiron', 'murray-hill', 'chelsea', 'east-village'],
  'flatiron': ['gramercy', 'chelsea', 'union-square', 'nomad'],
  'upper-east-side': ['upper-west-side', 'midtown-east', 'yorkville', 'carnegie-hill'],
  'upper-west-side': ['upper-east-side', 'morningside-heights', 'hells-kitchen', 'lincoln-square'],
  'midtown': ['hells-kitchen', 'chelsea', 'murray-hill', 'midtown-east'],
  'hells-kitchen': ['midtown', 'chelsea', 'upper-west-side', 'theater-district'],
  'financial-district': ['tribeca', 'battery-park-city', 'south-street-seaport', 'stone-street'],
  'harlem': ['morningside-heights', 'washington-heights', 'east-harlem', 'central-harlem'],
  'washington-heights': ['harlem', 'inwood', 'morningside-heights', 'hamilton-heights'],

  // Queens neighborhoods
  'astoria': ['long-island-city', 'sunnyside', 'woodside', 'greenpoint'],
  'long-island-city': ['astoria', 'sunnyside', 'greenpoint', 'hunters-point'],
  'sunnyside': ['astoria', 'woodside', 'long-island-city', 'maspeth'],
  'woodside': ['sunnyside', 'jackson-heights', 'elmhurst', 'maspeth'],
  'jackson-heights': ['elmhurst', 'woodside', 'corona', 'east-elmhurst'],
  'elmhurst': ['jackson-heights', 'forest-hills', 'corona', 'rego-park'],
  'forest-hills': ['elmhurst', 'kew-gardens', 'rego-park', 'middle-village'],
  'flushing': ['bayside', 'whitestone', 'corona', 'college-point'],

  // Bronx neighborhoods
  'south-bronx': ['mott-haven', 'concourse', 'melrose', 'port-morris'],
  'mott-haven': ['south-bronx', 'melrose', 'port-morris', 'concourse'],
  'concourse': ['mott-haven', 'fordham', 'highbridge', 'melrose'],
  'fordham': ['concourse', 'belmont', 'tremont', 'university-heights'],
  'riverdale': ['kingsbridge', 'fieldston', 'spuyten-duyvil', 'marble-hill']
};

// Helper function to normalize neighborhood name for lookup
export const normalizeNeighborhoodForSimilar = (neighborhood: string): string => {
  return neighborhood.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/'/g, '')
    .replace(/[^a-z0-9-]/g, '');
};

// Get similar neighborhoods for a given neighborhood
export const getSimilarNeighborhoods = (neighborhood: string): string[] => {
  const normalized = normalizeNeighborhoodForSimilar(neighborhood);
  return similarNeighborhoods[normalized] || [];
};

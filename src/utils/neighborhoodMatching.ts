
// Utility functions for neighborhood name matching consistency between onboarding and For You page

// Helper function to normalize neighborhood name for lookup
export const normalizeNeighborhoodForSimilar = (neighborhood: string): string => {
  return neighborhood.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/'/g, '')
    .replace(/[^a-z0-9-]/g, '');
};

// Helper function to get neighborhood variations for flexible matching
export const getNeighborhoodVariations = (neighborhood: string): string[] => {
  const variations = [neighborhood.toLowerCase()];
  
  // Add hyphenated version
  variations.push(neighborhood.toLowerCase().replace(/\s+/g, '-'));
  
  // Add version without apostrophes and spaces replaced with hyphens
  variations.push(neighborhood.toLowerCase().replace(/['\s]/g, '').replace(/-+/g, '-'));
  
  // Add version with spaces replaced by hyphens and apostrophes removed
  variations.push(neighborhood.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-'));
  
  return variations;
};

// Function to check if a listing neighborhood matches any of the preferred neighborhoods
export const doesNeighborhoodMatch = (listingNeighborhood: string, preferredNeighborhoods: string[]): boolean => {
  if (!listingNeighborhood || !preferredNeighborhoods?.length) return false;
  
  const listingNormalized = listingNeighborhood.toLowerCase();
  
  return preferredNeighborhoods.some(preferred => {
    // Direct match
    if (preferred.toLowerCase() === listingNormalized) return true;
    
    // Get variations of the preferred neighborhood and check if listing matches any
    const variations = getNeighborhoodVariations(preferred);
    return variations.some(variation => 
      listingNormalized.includes(variation) || variation.includes(listingNormalized)
    );
  });
};

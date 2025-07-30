
// Neighborhood data for NYC boroughs and their respective neighborhoods

export interface NeighborhoodInfo {
  name: string;
  borough: string;
  description: string;
  averageRent: string;
  walkScore: number;
  transitScore: number;
  highlights: string[];
  pros: string[];
  cons: string[];
}

export const neighborhoods: Record<string, NeighborhoodInfo> = {
  'astoria': {
    name: 'Astoria',
    borough: 'Queens',
    description: 'A diverse neighborhood known for its authentic Greek food, waterfront parks, and growing arts scene.',
    averageRent: '$2,800',
    walkScore: 89,
    transitScore: 78,
    highlights: ['Museum of the Moving Image', 'Astoria Park', 'Greek food scene'],
    pros: ['Great restaurants', 'Waterfront access', 'Diverse community'],
    cons: ['Limited subway lines', 'Can be noisy']
  },
  'williamsburg': {
    name: 'Williamsburg',
    borough: 'Brooklyn',
    description: 'Hip neighborhood with trendy restaurants, boutique shopping, and stunning Manhattan skyline views.',
    averageRent: '$4,200',
    walkScore: 94,
    transitScore: 85,
    highlights: ['Brooklyn Bridge views', 'Trendy dining scene', 'Artisanal markets'],
    pros: ['Vibrant nightlife', 'Great views', 'Easy Manhattan access'],
    cons: ['Very expensive', 'Overcrowded weekends']
  },
  'east-village': {
    name: 'East Village',
    borough: 'Manhattan',
    description: 'Historic bohemian neighborhood with eclectic dining, vintage shops, and vibrant nightlife.',
    averageRent: '$4,500',
    walkScore: 98,
    transitScore: 92,
    highlights: ['St. Marks Place', 'Tompkins Square Park', 'Historic venues'],
    pros: ['Rich history', 'Great nightlife', 'Central location'],
    cons: ['Very expensive', 'Can be loud at night']
  }
};

export const capitalizeNeighborhood = (neighborhood: string): string => {
  return neighborhood
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getNeighborhoodInfo = (neighborhoodSlug: string): NeighborhoodInfo | null => {
  return neighborhoods[neighborhoodSlug] || null;
};

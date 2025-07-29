export interface NeighborhoodData {
  [key: string]: {
    name: string;
    borough: string;
    description: string;
    averageRent: number;
    walkScore: number;
    transitScore: number;
  };
}

// Example usage:
// import { neighborhoodData, NeighborhoodData } from './neighborhoodData';

export const neighborhoodData = {
  // Manhattan neighborhoods
  "financial-district": {
    name: "Financial District",
    borough: "Manhattan",
    description: "Historic downtown area with modern high-rises and waterfront views",
    averageRent: 4200,
    walkScore: 98,
    transitScore: 95
  },
  "tribeca": {
    name: "Tribeca",
    borough: "Manhattan", 
    description: "Trendy neighborhood with cobblestone streets and converted warehouses",
    averageRent: 6500,
    walkScore: 92,
    transitScore: 88
  },
  "soho": {
    name: "SoHo",
    borough: "Manhattan",
    description: "Shopping district known for cast-iron architecture and galleries",
    averageRent: 5800,
    walkScore: 95,
    transitScore: 90
  },
  "chinatown": {
    name: "Chinatown",
    borough: "Manhattan",
    description: "Vibrant cultural enclave with authentic cuisine and markets",
    averageRent: 3200,
    walkScore: 89,
    transitScore: 92
  },
  "little-italy": {
    name: "Little Italy",
    borough: "Manhattan",
    description: "Historic Italian-American neighborhood with traditional restaurants",
    averageRent: 3800,
    walkScore: 91,
    transitScore: 90
  },
  "lower-east-side": {
    name: "Lower East Side",
    borough: "Manhattan",
    description: "Historic immigrant neighborhood now trendy with nightlife and dining",
    averageRent: 3600,
    walkScore: 93,
    transitScore: 89
  },
  "east-village": {
    name: "East Village",
    borough: "Manhattan",
    description: "Bohemian neighborhood with diverse dining and nightlife",
    averageRent: 3900,
    walkScore: 96,
    transitScore: 91
  },
  "west-village": {
    name: "West Village",
    borough: "Manhattan",
    description: "Charming neighborhood with tree-lined streets and historic brownstones",
    averageRent: 5200,
    walkScore: 94,
    transitScore: 85
  },
  "greenwich-village": {
    name: "Greenwich Village",
    borough: "Manhattan",
    description: "Historic artistic community with Washington Square Park",
    averageRent: 4800,
    walkScore: 95,
    transitScore: 88
  },
  "nolita": {
    name: "Nolita",
    borough: "Manhattan",
    description: "Trendy area north of Little Italy with boutique shopping",
    averageRent: 4500,
    walkScore: 93,
    transitScore: 89
  }
};

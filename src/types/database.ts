
export interface UndervaluedSales {
  id: string;
  address: string;
  price: number;
  price_per_sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  neighborhood?: string;
  borough?: string;
  zipcode?: string;
  score: number;
  grade: string;
  discount_percent: number;
  reasoning?: string;
  images: string[] | any[];
  image_count?: number;
  videos: string[] | any[];
  floorplans: string[] | any[];
  description?: string;
  amenities: string[];
  property_type?: string;
  listed_at?: string;
  days_on_market?: number;
  built_in?: number;
  monthly_hoa?: number;
  monthly_tax?: number;
  agents: any[];
  building_info: any;
  status?: string;
  likely_sold: boolean;
  last_seen_in_search: string;
  analysis_date: string;
  created_at: string;
}

export interface UndervaluedRentals {
  id: string;
  address: string;
  monthly_rent: number;
  rent_per_sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  neighborhood?: string;
  borough?: string;
  zipcode?: string;
  score: number;
  grade: string;
  discount_percent: number;
  reasoning?: string;
  images: string[] | any[];
  image_count?: number;
  videos: string[] | any[];
  floorplans: string[] | any[];
  description?: string;
  amenities: string[];
  property_type?: string;
  listed_at?: string;
  days_on_market?: number;
  built_in?: number;
  no_fee: boolean;
  pet_friendly: boolean;
  laundry_available: boolean;
  gym_available: boolean;
  doorman_building: boolean;
  elevator_building: boolean;
  rooftop_access: boolean;
  agents: any[];
  building_info: any;
  status?: string;
  likely_rented: boolean;
  last_seen_in_search: string;
  analysis_date: string;
  created_at: string;
  potential_monthly_savings?: number;
  annual_savings?: number;
}

export interface UserProfile {
  id: string;
  name?: string;
  email_address?: string;
  subscription_plan: 'free' | 'unlimited';
  subscription_renewal: 'monthly' | 'annual';
  created_at: string;
}

export type PropertyListing = UndervaluedSales | UndervaluedRentals;

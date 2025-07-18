
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

export interface UndervaluedRentStabilized {
  id: string;
  listing_id: string;
  listing_url: string;
  address: string;
  neighborhood: string;
  borough?: string;
  zip_code?: string;
  monthly_rent: number;
  estimated_market_rent: number;
  undervaluation_percent: number;
  potential_monthly_savings: number;
  potential_annual_savings?: number;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  description?: string;
  amenities: any[];
  building_amenities: any[];
  building_type?: string;
  year_built?: number;
  total_units_in_building?: number;
  broker_fee?: string;
  available_date?: string;
  lease_term?: string;
  pet_policy?: string;
  broker_name?: string;
  broker_phone?: string;
  broker_email?: string;
  listing_agent?: string;
  street_easy_score?: number;
  walk_score?: number;
  transit_score?: number;
  images: any[];
  virtual_tour_url?: string;
  floor_plan_url?: string;
  rent_stabilized_confidence: number;
  rent_stabilized_method: string;
  rent_stabilization_analysis: any;
  undervaluation_method: string;
  undervaluation_confidence: number;
  comparables_used: number;
  undervaluation_analysis: any;
  deal_quality_score?: number;
  ranking_in_neighborhood?: number;
  neighborhood_median_rent?: number;
  comparable_properties_in_area?: number;
  risk_factors: any[];
  opportunity_score?: number;
  discovered_at: string;
  analyzed_at: string;
  last_verified: string;
  display_status?: string;
  featured_until?: string;
  admin_notes?: string;
  tags: any[];
  view_count?: number;
  last_viewed_at?: string;
  contact_requests?: number;
  created_at: string;
  updated_at: string;
  market_classification?: string;
  analysis_date?: string;
  deal_quality?: string;
}

export interface UserProfile {
  id: string;
  name?: string;
  email_address?: string;
  subscription_plan: 'free' | 'unlimited';
  subscription_renewal: 'monthly' | 'annual';
  created_at: string;
}

export interface SavedProperty {
  id: string;
  user_id: string;
  property_id: string;
  property_type: 'sale' | 'rental';
  saved_at: string;
}

export type PropertyListing = UndervaluedSales | UndervaluedRentals;

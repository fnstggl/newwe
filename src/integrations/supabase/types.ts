export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bi_weekly_analysis_runs: {
        Row: {
          analysis_type: string
          api_calls_saved: number | null
          api_calls_used: number | null
          cache_hit_rate: number | null
          completed: boolean
          created_at: string
          detailed_stats: Json
          duration_minutes: number | null
          errors: Json
          id: string
          listings_marked_rented: number | null
          listings_marked_sold: number | null
          neighborhoods_processed: number | null
          run_date: string
          saved_to_database: number | null
          total_active_listings: number | null
          total_details_attempted: number | null
          total_details_fetched: number | null
          undervalued_found: number | null
        }
        Insert: {
          analysis_type: string
          api_calls_saved?: number | null
          api_calls_used?: number | null
          cache_hit_rate?: number | null
          completed?: boolean
          created_at?: string
          detailed_stats?: Json
          duration_minutes?: number | null
          errors?: Json
          id?: string
          listings_marked_rented?: number | null
          listings_marked_sold?: number | null
          neighborhoods_processed?: number | null
          run_date?: string
          saved_to_database?: number | null
          total_active_listings?: number | null
          total_details_attempted?: number | null
          total_details_fetched?: number | null
          undervalued_found?: number | null
        }
        Update: {
          analysis_type?: string
          api_calls_saved?: number | null
          api_calls_used?: number | null
          cache_hit_rate?: number | null
          completed?: boolean
          created_at?: string
          detailed_stats?: Json
          duration_minutes?: number | null
          errors?: Json
          id?: string
          listings_marked_rented?: number | null
          listings_marked_sold?: number | null
          neighborhoods_processed?: number | null
          run_date?: string
          saved_to_database?: number | null
          total_active_listings?: number | null
          total_details_attempted?: number | null
          total_details_fetched?: number | null
          undervalued_found?: number | null
        }
        Relationships: []
      }
      rental_market_cache: {
        Row: {
          address: string | null
          bathrooms: number | null
          bedrooms: number | null
          borough: string | null
          created_at: string
          id: string
          last_analyzed: string | null
          last_checked: string
          last_seen_in_search: string
          listing_id: string
          market_status: string | null
          monthly_rent: number | null
          neighborhood: string | null
          property_type: string | null
          sqft: number | null
          times_seen: number | null
        }
        Insert: {
          address?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          created_at?: string
          id?: string
          last_analyzed?: string | null
          last_checked?: string
          last_seen_in_search?: string
          listing_id: string
          market_status?: string | null
          monthly_rent?: number | null
          neighborhood?: string | null
          property_type?: string | null
          sqft?: number | null
          times_seen?: number | null
        }
        Update: {
          address?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          created_at?: string
          id?: string
          last_analyzed?: string | null
          last_checked?: string
          last_seen_in_search?: string
          listing_id?: string
          market_status?: string | null
          monthly_rent?: number | null
          neighborhood?: string | null
          property_type?: string | null
          sqft?: number | null
          times_seen?: number | null
        }
        Relationships: []
      }
      sales_market_cache: {
        Row: {
          address: string | null
          bathrooms: number | null
          bedrooms: number | null
          borough: string | null
          created_at: string
          id: string
          last_analyzed: string | null
          last_checked: string
          last_seen_in_search: string
          listing_id: string
          market_status: string | null
          neighborhood: string | null
          price: number | null
          property_type: string | null
          sale_price: number | null
          sqft: number | null
          times_seen: number | null
        }
        Insert: {
          address?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          created_at?: string
          id?: string
          last_analyzed?: string | null
          last_checked?: string
          last_seen_in_search?: string
          listing_id: string
          market_status?: string | null
          neighborhood?: string | null
          price?: number | null
          property_type?: string | null
          sale_price?: number | null
          sqft?: number | null
          times_seen?: number | null
        }
        Update: {
          address?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          created_at?: string
          id?: string
          last_analyzed?: string | null
          last_checked?: string
          last_seen_in_search?: string
          listing_id?: string
          market_status?: string | null
          neighborhood?: string | null
          price?: number | null
          property_type?: string | null
          sale_price?: number | null
          sqft?: number | null
          times_seen?: number | null
        }
        Relationships: []
      }
      undervalued_rentals: {
        Row: {
          address: string
          agents: Json
          amenities: string[]
          amenity_count: number | null
          analysis_date: string
          annual_savings: number | null
          available_from: string | null
          bathrooms: number | null
          bedrooms: number | null
          borough: string | null
          building_info: Json
          built_in: number | null
          category_confidence: number | null
          closed_at: string | null
          comparison_group: string | null
          comparison_method: string
          created_at: string
          days_on_market: number | null
          description: string | null
          discount_percent: number
          doorman_building: boolean
          elevator_building: boolean
          floorplans: Json
          grade: string
          gym_available: boolean
          id: string
          image_count: number | null
          images: Json
          last_seen_in_search: string
          latitude: number | null
          laundry_available: boolean
          likely_rented: boolean
          listed_at: string | null
          listing_id: string
          listing_status: string | null
          longitude: number | null
          market_rent_per_sqft: number | null
          monthly_rent: number
          neighborhood: string | null
          no_fee: boolean
          pet_friendly: boolean
          potential_monthly_savings: number | null
          property_type: string | null
          reasoning: string | null
          reliability_score: number | null
          rent_per_sqft: number | null
          rental_type: string | null
          rented_detected_at: string | null
          rooftop_access: boolean
          score: number
          sqft: number | null
          status: string | null
          times_seen_in_search: number | null
          undervaluation_category: string | null
          undervaluation_phrases: string[] | null
          videos: Json
          zipcode: string | null
        }
        Insert: {
          address: string
          agents?: Json
          amenities?: string[]
          amenity_count?: number | null
          analysis_date?: string
          annual_savings?: number | null
          available_from?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          building_info?: Json
          built_in?: number | null
          category_confidence?: number | null
          closed_at?: string | null
          comparison_group?: string | null
          comparison_method: string
          created_at?: string
          days_on_market?: number | null
          description?: string | null
          discount_percent: number
          doorman_building?: boolean
          elevator_building?: boolean
          floorplans?: Json
          grade: string
          gym_available?: boolean
          id?: string
          image_count?: number | null
          images?: Json
          last_seen_in_search?: string
          latitude?: number | null
          laundry_available?: boolean
          likely_rented?: boolean
          listed_at?: string | null
          listing_id: string
          listing_status?: string | null
          longitude?: number | null
          market_rent_per_sqft?: number | null
          monthly_rent: number
          neighborhood?: string | null
          no_fee?: boolean
          pet_friendly?: boolean
          potential_monthly_savings?: number | null
          property_type?: string | null
          reasoning?: string | null
          reliability_score?: number | null
          rent_per_sqft?: number | null
          rental_type?: string | null
          rented_detected_at?: string | null
          rooftop_access?: boolean
          score: number
          sqft?: number | null
          status?: string | null
          times_seen_in_search?: number | null
          undervaluation_category?: string | null
          undervaluation_phrases?: string[] | null
          videos?: Json
          zipcode?: string | null
        }
        Update: {
          address?: string
          agents?: Json
          amenities?: string[]
          amenity_count?: number | null
          analysis_date?: string
          annual_savings?: number | null
          available_from?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          building_info?: Json
          built_in?: number | null
          category_confidence?: number | null
          closed_at?: string | null
          comparison_group?: string | null
          comparison_method?: string
          created_at?: string
          days_on_market?: number | null
          description?: string | null
          discount_percent?: number
          doorman_building?: boolean
          elevator_building?: boolean
          floorplans?: Json
          grade?: string
          gym_available?: boolean
          id?: string
          image_count?: number | null
          images?: Json
          last_seen_in_search?: string
          latitude?: number | null
          laundry_available?: boolean
          likely_rented?: boolean
          listed_at?: string | null
          listing_id?: string
          listing_status?: string | null
          longitude?: number | null
          market_rent_per_sqft?: number | null
          monthly_rent?: number
          neighborhood?: string | null
          no_fee?: boolean
          pet_friendly?: boolean
          potential_monthly_savings?: number | null
          property_type?: string | null
          reasoning?: string | null
          reliability_score?: number | null
          rent_per_sqft?: number | null
          rental_type?: string | null
          rented_detected_at?: string | null
          rooftop_access?: boolean
          score?: number
          sqft?: number | null
          status?: string | null
          times_seen_in_search?: number | null
          undervaluation_category?: string | null
          undervaluation_phrases?: string[] | null
          videos?: Json
          zipcode?: string | null
        }
        Relationships: []
      }
      undervalued_sales: {
        Row: {
          address: string
          agents: Json
          amenities: string[]
          amenity_count: number | null
          analysis_date: string
          bathrooms: number | null
          bedrooms: number | null
          borough: string | null
          building_info: Json
          built_in: number | null
          category_confidence: number | null
          comparison_group: string | null
          comparison_method: string
          created_at: string
          days_on_market: number | null
          description: string | null
          discount_percent: number
          floorplans: Json
          grade: string
          id: string
          image_count: number | null
          images: Json
          last_seen_in_search: string
          likely_sold: boolean
          listed_at: string | null
          listing_id: string
          market_price_per_sqft: number | null
          monthly_hoa: number | null
          monthly_tax: number | null
          neighborhood: string | null
          potential_savings: number | null
          price: number
          price_per_sqft: number | null
          property_type: string | null
          reasoning: string | null
          reliability_score: number | null
          score: number
          sold_detected_at: string | null
          sqft: number | null
          status: string | null
          times_seen_in_search: number | null
          undervaluation_category: string | null
          undervaluation_phrases: string[] | null
          videos: Json
          zipcode: string | null
        }
        Insert: {
          address: string
          agents?: Json
          amenities?: string[]
          amenity_count?: number | null
          analysis_date?: string
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          building_info?: Json
          built_in?: number | null
          category_confidence?: number | null
          comparison_group?: string | null
          comparison_method: string
          created_at?: string
          days_on_market?: number | null
          description?: string | null
          discount_percent: number
          floorplans?: Json
          grade: string
          id?: string
          image_count?: number | null
          images?: Json
          last_seen_in_search?: string
          likely_sold?: boolean
          listed_at?: string | null
          listing_id: string
          market_price_per_sqft?: number | null
          monthly_hoa?: number | null
          monthly_tax?: number | null
          neighborhood?: string | null
          potential_savings?: number | null
          price: number
          price_per_sqft?: number | null
          property_type?: string | null
          reasoning?: string | null
          reliability_score?: number | null
          score: number
          sold_detected_at?: string | null
          sqft?: number | null
          status?: string | null
          times_seen_in_search?: number | null
          undervaluation_category?: string | null
          undervaluation_phrases?: string[] | null
          videos?: Json
          zipcode?: string | null
        }
        Update: {
          address?: string
          agents?: Json
          amenities?: string[]
          amenity_count?: number | null
          analysis_date?: string
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          building_info?: Json
          built_in?: number | null
          category_confidence?: number | null
          comparison_group?: string | null
          comparison_method?: string
          created_at?: string
          days_on_market?: number | null
          description?: string | null
          discount_percent?: number
          floorplans?: Json
          grade?: string
          id?: string
          image_count?: number | null
          images?: Json
          last_seen_in_search?: string
          likely_sold?: boolean
          listed_at?: string | null
          listing_id?: string
          market_price_per_sqft?: number | null
          monthly_hoa?: number | null
          monthly_tax?: number | null
          neighborhood?: string | null
          potential_savings?: number | null
          price?: number
          price_per_sqft?: number | null
          property_type?: string | null
          reasoning?: string | null
          reliability_score?: number | null
          score?: number
          sold_detected_at?: string | null
          sqft?: number | null
          status?: string | null
          times_seen_in_search?: number | null
          undervaluation_category?: string | null
          undervaluation_phrases?: string[] | null
          videos?: Json
          zipcode?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      cache_performance_summary: {
        Row: {
          avg_times_seen: number | null
          market_rate_cached: number | null
          recently_seen: number | null
          table_type: string | null
          total_cached: number | null
          undervalued_cached: number | null
        }
        Relationships: []
      }
      sold_rented_detection_summary: {
        Row: {
          active_listings: number | null
          avg_days_since_seen: number | null
          likely_sold: number | null
          recently_marked_sold: number | null
          table_type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_old_cache_entries: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      mark_likely_rented_listings: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      mark_likely_sold_listings: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

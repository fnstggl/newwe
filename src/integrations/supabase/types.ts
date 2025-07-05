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
      comprehensive_listing_cache: {
        Row: {
          address: string | null
          amenities: Json | null
          bathrooms: number | null
          bedrooms: number | null
          broker_fee: string | null
          cached_at: string | null
          description: string | null
          listed_at: string | null
          listing_id: string
          listing_url: string | null
          monthly_rent: number | null
          neighborhood: string | null
          sqft: number | null
        }
        Insert: {
          address?: string | null
          amenities?: Json | null
          bathrooms?: number | null
          bedrooms?: number | null
          broker_fee?: string | null
          cached_at?: string | null
          description?: string | null
          listed_at?: string | null
          listing_id: string
          listing_url?: string | null
          monthly_rent?: number | null
          neighborhood?: string | null
          sqft?: number | null
        }
        Update: {
          address?: string | null
          amenities?: Json | null
          bathrooms?: number | null
          bedrooms?: number | null
          broker_fee?: string | null
          cached_at?: string | null
          description?: string | null
          listed_at?: string | null
          listing_id?: string
          listing_url?: string | null
          monthly_rent?: number | null
          neighborhood?: string | null
          sqft?: number | null
        }
        Relationships: []
      }
      listing_cache: {
        Row: {
          address: string
          amenities: Json
          available_date: string | null
          bathrooms: number | null
          bedrooms: number | null
          borough: string | null
          broker_email: string | null
          broker_fee: string | null
          broker_name: string | null
          broker_phone: string | null
          building_amenities: Json
          building_type: string | null
          cached_at: string
          created_at: string
          description: string | null
          fetch_source: string
          floor_plan_url: string | null
          id: string
          images: Json
          last_updated: string
          lease_term: string | null
          listed_at: string | null
          listing_agent: string | null
          listing_id: string
          listing_url: string
          monthly_rent: number
          neighborhood: string
          pet_policy: string | null
          security_deposit: string | null
          sqft: number | null
          status: string | null
          street_easy_score: number | null
          total_units_in_building: number | null
          transit_score: number | null
          virtual_tour_url: string | null
          walk_score: number | null
          year_built: number | null
          zip_code: string | null
        }
        Insert: {
          address: string
          amenities?: Json
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          broker_email?: string | null
          broker_fee?: string | null
          broker_name?: string | null
          broker_phone?: string | null
          building_amenities?: Json
          building_type?: string | null
          cached_at?: string
          created_at?: string
          description?: string | null
          fetch_source?: string
          floor_plan_url?: string | null
          id?: string
          images?: Json
          last_updated?: string
          lease_term?: string | null
          listed_at?: string | null
          listing_agent?: string | null
          listing_id: string
          listing_url: string
          monthly_rent: number
          neighborhood: string
          pet_policy?: string | null
          security_deposit?: string | null
          sqft?: number | null
          status?: string | null
          street_easy_score?: number | null
          total_units_in_building?: number | null
          transit_score?: number | null
          virtual_tour_url?: string | null
          walk_score?: number | null
          year_built?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          amenities?: Json
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          broker_email?: string | null
          broker_fee?: string | null
          broker_name?: string | null
          broker_phone?: string | null
          building_amenities?: Json
          building_type?: string | null
          cached_at?: string
          created_at?: string
          description?: string | null
          fetch_source?: string
          floor_plan_url?: string | null
          id?: string
          images?: Json
          last_updated?: string
          lease_term?: string | null
          listed_at?: string | null
          listing_agent?: string | null
          listing_id?: string
          listing_url?: string
          monthly_rent?: number
          neighborhood?: string
          pet_policy?: string | null
          security_deposit?: string | null
          sqft?: number | null
          status?: string | null
          street_easy_score?: number | null
          total_units_in_building?: number | null
          transit_score?: number | null
          virtual_tour_url?: string | null
          walk_score?: number | null
          year_built?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email_address: string | null
          id: string
          name: string | null
          neighborhood_preferences: string[] | null
          stripe_customer_id: string | null
          subscription_plan: string
          subscription_renewal: string | null
        }
        Insert: {
          created_at?: string
          email_address?: string | null
          id: string
          name?: string | null
          neighborhood_preferences?: string[] | null
          stripe_customer_id?: string | null
          subscription_plan?: string
          subscription_renewal?: string | null
        }
        Update: {
          created_at?: string
          email_address?: string | null
          id?: string
          name?: string | null
          neighborhood_preferences?: string[] | null
          stripe_customer_id?: string | null
          subscription_plan?: string
          subscription_renewal?: string | null
        }
        Relationships: []
      }
      rent_stabilized_analysis_runs: {
        Row: {
          api_calls_saved: number | null
          api_calls_used: number | null
          average_rent_stabilized_confidence: number | null
          average_savings_amount: number | null
          average_undervaluation_confidence: number | null
          bulk_load_mode: boolean
          cache_hit_rate: number | null
          completed: boolean
          created_at: string
          detailed_stats: Json
          dhcr_buildings_processed: number | null
          dhcr_files_parsed: number | null
          duration_minutes: number | null
          errors: Json
          id: string
          neighborhoods_targeted: string[]
          rent_stabilized_found: number | null
          run_date: string
          saved_to_database: number | null
          success: boolean
          test_mode: boolean
          total_listings_analyzed: number | null
          undervalued_found: number | null
        }
        Insert: {
          api_calls_saved?: number | null
          api_calls_used?: number | null
          average_rent_stabilized_confidence?: number | null
          average_savings_amount?: number | null
          average_undervaluation_confidence?: number | null
          bulk_load_mode?: boolean
          cache_hit_rate?: number | null
          completed?: boolean
          created_at?: string
          detailed_stats?: Json
          dhcr_buildings_processed?: number | null
          dhcr_files_parsed?: number | null
          duration_minutes?: number | null
          errors?: Json
          id?: string
          neighborhoods_targeted: string[]
          rent_stabilized_found?: number | null
          run_date?: string
          saved_to_database?: number | null
          success?: boolean
          test_mode?: boolean
          total_listings_analyzed?: number | null
          undervalued_found?: number | null
        }
        Update: {
          api_calls_saved?: number | null
          api_calls_used?: number | null
          average_rent_stabilized_confidence?: number | null
          average_savings_amount?: number | null
          average_undervaluation_confidence?: number | null
          bulk_load_mode?: boolean
          cache_hit_rate?: number | null
          completed?: boolean
          created_at?: string
          detailed_stats?: Json
          dhcr_buildings_processed?: number | null
          dhcr_files_parsed?: number | null
          duration_minutes?: number | null
          errors?: Json
          id?: string
          neighborhoods_targeted?: string[]
          rent_stabilized_found?: number | null
          run_date?: string
          saved_to_database?: number | null
          success?: boolean
          test_mode?: boolean
          total_listings_analyzed?: number | null
          undervalued_found?: number | null
        }
        Relationships: []
      }
      rent_stabilized_buildings: {
        Row: {
          address: string
          block: string | null
          borough: string | null
          building_id: string | null
          building_type: string | null
          city: string | null
          confidence_score: number | null
          county_code: string | null
          created_at: string
          dhcr_registered: boolean
          dhcr_source: string | null
          house_number: string | null
          id: string
          last_updated: string | null
          lot: string | null
          normalized_address: string | null
          parsed_at: string
          registration_id: string | null
          registration_year: number | null
          secondary_address: string | null
          secondary_house_number: string | null
          secondary_street_name: string | null
          source: string | null
          source_file: string | null
          status1: string | null
          status2: string | null
          status3: string | null
          street_name: string | null
          total_units: number | null
          unit_count: number | null
          updated_at: string
          verification_status: string | null
          year_built: number | null
          zip_code: string | null
          zipcode: string | null
        }
        Insert: {
          address: string
          block?: string | null
          borough?: string | null
          building_id?: string | null
          building_type?: string | null
          city?: string | null
          confidence_score?: number | null
          county_code?: string | null
          created_at?: string
          dhcr_registered?: boolean
          dhcr_source?: string | null
          house_number?: string | null
          id?: string
          last_updated?: string | null
          lot?: string | null
          normalized_address?: string | null
          parsed_at?: string
          registration_id?: string | null
          registration_year?: number | null
          secondary_address?: string | null
          secondary_house_number?: string | null
          secondary_street_name?: string | null
          source?: string | null
          source_file?: string | null
          status1?: string | null
          status2?: string | null
          status3?: string | null
          street_name?: string | null
          total_units?: number | null
          unit_count?: number | null
          updated_at?: string
          verification_status?: string | null
          year_built?: number | null
          zip_code?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string
          block?: string | null
          borough?: string | null
          building_id?: string | null
          building_type?: string | null
          city?: string | null
          confidence_score?: number | null
          county_code?: string | null
          created_at?: string
          dhcr_registered?: boolean
          dhcr_source?: string | null
          house_number?: string | null
          id?: string
          last_updated?: string | null
          lot?: string | null
          normalized_address?: string | null
          parsed_at?: string
          registration_id?: string | null
          registration_year?: number | null
          secondary_address?: string | null
          secondary_house_number?: string | null
          secondary_street_name?: string | null
          source?: string | null
          source_file?: string | null
          status1?: string | null
          status2?: string | null
          status3?: string | null
          street_name?: string | null
          total_units?: number | null
          unit_count?: number | null
          updated_at?: string
          verification_status?: string | null
          year_built?: number | null
          zip_code?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      rental_market_cache: {
        Row: {
          address: string | null
          amenities: Json | null
          bathrooms: number | null
          bedrooms: number | null
          borough: string | null
          created_at: string
          description: string | null
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
          amenities?: Json | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          created_at?: string
          description?: string | null
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
          amenities?: Json | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          created_at?: string
          description?: string | null
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
      requested_tours: {
        Row: {
          date_1: string | null
          date_2: string | null
          date_3: string | null
          email: string
          id: string
          name: string
          phone: string | null
          property_address: string | null
          property_id: string
          requested_at: string
          user_id: string | null
        }
        Insert: {
          date_1?: string | null
          date_2?: string | null
          date_3?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          property_address?: string | null
          property_id: string
          requested_at?: string
          user_id?: string | null
        }
        Update: {
          date_1?: string | null
          date_2?: string | null
          date_3?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          property_address?: string | null
          property_id?: string
          requested_at?: string
          user_id?: string | null
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
      saved_properties: {
        Row: {
          id: string
          property_id: string
          property_type: string
          saved_at: string
          user_id: string
        }
        Insert: {
          id?: string
          property_id: string
          property_type: string
          saved_at?: string
          user_id: string
        }
        Update: {
          id?: string
          property_id?: string
          property_type?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      undervalued_rent_stabilized: {
        Row: {
          address: string
          admin_notes: string | null
          amenities: Json
          analysis_date: string | null
          analyzed_at: string
          available_date: string | null
          bathrooms: number | null
          bedrooms: number | null
          borough: string | null
          broker_email: string | null
          broker_fee: string | null
          broker_name: string | null
          broker_phone: string | null
          building_amenities: Json
          building_type: string | null
          comparable_properties_in_area: number | null
          comparables_used: number
          contact_requests: number | null
          created_at: string
          deal_quality: string | null
          deal_quality_score: number | null
          description: string | null
          discovered_at: string
          display_status: string | null
          estimated_market_rent: number
          featured_until: string | null
          floor_plan_url: string | null
          id: string
          images: Json
          last_verified: string
          last_viewed_at: string | null
          lease_term: string | null
          listing_agent: string | null
          listing_id: string
          listing_url: string
          market_classification: string | null
          monthly_rent: number
          neighborhood: string
          neighborhood_median_rent: number | null
          opportunity_score: number | null
          pet_policy: string | null
          potential_annual_savings: number | null
          potential_monthly_savings: number
          ranking_in_neighborhood: number | null
          rent_stabilization_analysis: Json
          rent_stabilized_confidence: number
          rent_stabilized_method: string
          risk_factors: Json
          sqft: number | null
          street_easy_score: number | null
          tags: Json
          total_units_in_building: number | null
          transit_score: number | null
          undervaluation_analysis: Json
          undervaluation_confidence: number
          undervaluation_method: string | null
          undervaluation_percent: number
          updated_at: string
          view_count: number | null
          virtual_tour_url: string | null
          walk_score: number | null
          year_built: number | null
          zip_code: string | null
        }
        Insert: {
          address: string
          admin_notes?: string | null
          amenities?: Json
          analysis_date?: string | null
          analyzed_at?: string
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          broker_email?: string | null
          broker_fee?: string | null
          broker_name?: string | null
          broker_phone?: string | null
          building_amenities?: Json
          building_type?: string | null
          comparable_properties_in_area?: number | null
          comparables_used: number
          contact_requests?: number | null
          created_at?: string
          deal_quality?: string | null
          deal_quality_score?: number | null
          description?: string | null
          discovered_at?: string
          display_status?: string | null
          estimated_market_rent: number
          featured_until?: string | null
          floor_plan_url?: string | null
          id?: string
          images?: Json
          last_verified?: string
          last_viewed_at?: string | null
          lease_term?: string | null
          listing_agent?: string | null
          listing_id: string
          listing_url: string
          market_classification?: string | null
          monthly_rent: number
          neighborhood: string
          neighborhood_median_rent?: number | null
          opportunity_score?: number | null
          pet_policy?: string | null
          potential_annual_savings?: number | null
          potential_monthly_savings: number
          ranking_in_neighborhood?: number | null
          rent_stabilization_analysis?: Json
          rent_stabilized_confidence: number
          rent_stabilized_method: string
          risk_factors?: Json
          sqft?: number | null
          street_easy_score?: number | null
          tags?: Json
          total_units_in_building?: number | null
          transit_score?: number | null
          undervaluation_analysis?: Json
          undervaluation_confidence: number
          undervaluation_method?: string | null
          undervaluation_percent: number
          updated_at?: string
          view_count?: number | null
          virtual_tour_url?: string | null
          walk_score?: number | null
          year_built?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          admin_notes?: string | null
          amenities?: Json
          analysis_date?: string | null
          analyzed_at?: string
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          broker_email?: string | null
          broker_fee?: string | null
          broker_name?: string | null
          broker_phone?: string | null
          building_amenities?: Json
          building_type?: string | null
          comparable_properties_in_area?: number | null
          comparables_used?: number
          contact_requests?: number | null
          created_at?: string
          deal_quality?: string | null
          deal_quality_score?: number | null
          description?: string | null
          discovered_at?: string
          display_status?: string | null
          estimated_market_rent?: number
          featured_until?: string | null
          floor_plan_url?: string | null
          id?: string
          images?: Json
          last_verified?: string
          last_viewed_at?: string | null
          lease_term?: string | null
          listing_agent?: string | null
          listing_id?: string
          listing_url?: string
          market_classification?: string | null
          monthly_rent?: number
          neighborhood?: string
          neighborhood_median_rent?: number | null
          opportunity_score?: number | null
          pet_policy?: string | null
          potential_annual_savings?: number | null
          potential_monthly_savings?: number
          ranking_in_neighborhood?: number | null
          rent_stabilization_analysis?: Json
          rent_stabilized_confidence?: number
          rent_stabilized_method?: string
          risk_factors?: Json
          sqft?: number | null
          street_easy_score?: number | null
          tags?: Json
          total_units_in_building?: number | null
          transit_score?: number | null
          undervaluation_analysis?: Json
          undervaluation_confidence?: number
          undervaluation_method?: string | null
          undervaluation_percent?: number
          updated_at?: string
          view_count?: number | null
          virtual_tour_url?: string | null
          walk_score?: number | null
          year_built?: number | null
          zip_code?: string | null
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
          deal_quality: string | null
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
          listing_url: string | null
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
          deal_quality?: string | null
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
          listing_url?: string | null
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
          deal_quality?: string | null
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
          listing_url?: string | null
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
          deal_quality: string | null
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
          deal_quality?: string | null
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
          deal_quality?: string | null
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
      latest_undervalued_rent_stabilized: {
        Row: {
          address: string | null
          bathrooms: number | null
          bedrooms: number | null
          borough: string | null
          deal_quality_score: number | null
          discovered_at: string | null
          estimated_market_rent: number | null
          id: string | null
          images: Json | null
          key_factors: Json | null
          listing_id: string | null
          listing_url: string | null
          monthly_rent: number | null
          neighborhood: string | null
          potential_annual_savings: number | null
          potential_monthly_savings: number | null
          rent_stabilized_confidence: number | null
          sqft: number | null
          stabilization_explanation: string | null
          stabilization_probability: string | null
          undervaluation_percent: number | null
          valuation_methodology: string | null
          view_count: number | null
        }
        Insert: {
          address?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          deal_quality_score?: number | null
          discovered_at?: string | null
          estimated_market_rent?: number | null
          id?: string | null
          images?: Json | null
          key_factors?: never
          listing_id?: string | null
          listing_url?: string | null
          monthly_rent?: number | null
          neighborhood?: string | null
          potential_annual_savings?: number | null
          potential_monthly_savings?: number | null
          rent_stabilized_confidence?: number | null
          sqft?: number | null
          stabilization_explanation?: never
          stabilization_probability?: never
          undervaluation_percent?: number | null
          valuation_methodology?: never
          view_count?: number | null
        }
        Update: {
          address?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          deal_quality_score?: number | null
          discovered_at?: string | null
          estimated_market_rent?: number | null
          id?: string | null
          images?: Json | null
          key_factors?: never
          listing_id?: string | null
          listing_url?: string | null
          monthly_rent?: number | null
          neighborhood?: string | null
          potential_annual_savings?: number | null
          potential_monthly_savings?: number | null
          rent_stabilized_confidence?: number | null
          sqft?: number | null
          stabilization_explanation?: never
          stabilization_probability?: never
          undervaluation_percent?: number | null
          valuation_methodology?: never
          view_count?: number | null
        }
        Relationships: []
      }
      neighborhood_deal_summary: {
        Row: {
          avg_monthly_savings: number | null
          avg_rent: number | null
          avg_stabilization_confidence: number | null
          avg_undervaluation: number | null
          borough: string | null
          max_rent: number | null
          min_rent: number | null
          neighborhood: string | null
          total_deals: number | null
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
      top_deals_by_savings: {
        Row: {
          address: string | null
          bathrooms: number | null
          bedrooms: number | null
          borough: string | null
          deal_quality_score: number | null
          discovered_at: string | null
          estimated_market_rent: number | null
          id: string | null
          images: Json | null
          key_factors: Json | null
          listing_id: string | null
          listing_url: string | null
          monthly_rent: number | null
          neighborhood: string | null
          potential_annual_savings: number | null
          potential_monthly_savings: number | null
          rent_stabilized_confidence: number | null
          savings_rank: number | null
          sqft: number | null
          stabilization_explanation: string | null
          stabilization_probability: string | null
          undervaluation_percent: number | null
          valuation_methodology: string | null
          view_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_old_cache_entries: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_users_by_neighborhoods: {
        Args: { neighborhoods: string[] }
        Returns: {
          email: string
          neighborhood_preferences: string[]
        }[]
      }
      get_users_for_neighborhood: {
        Args: { neighborhood: string }
        Returns: {
          created_at: string
          email_address: string | null
          id: string
          name: string | null
          neighborhood_preferences: string[] | null
          stripe_customer_id: string | null
          subscription_plan: string
          subscription_renewal: string | null
        }[]
      }
      mark_likely_rented_listings: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      mark_likely_sold_listings: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      retry_send_property_emails: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_agent_fetches: {
        Row: {
          api_key_used: string | null
          bathrooms: number | null
          bedrooms: number | null
          cache_hits: number | null
          cache_properties_returned: number | null
          claude_api_calls: number | null
          claude_cost_usd: number | null
          claude_tokens_used: number | null
          completed_at: string | null
          created_at: string
          error_code: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          job_id: string
          max_listings: number
          max_price: number | null
          min_price: number | null
          neighborhood: string
          no_fee: boolean | null
          processing_duration_ms: number | null
          processing_log: string[] | null
          property_type: string
          qualifying_properties_saved: number | null
          requested_at: string
          response_summary: Json | null
          retry_count: number | null
          started_at: string | null
          status: string
          streeteasy_api_calls: number | null
          streeteasy_properties_analyzed: number | null
          streeteasy_properties_fetched: number | null
          threshold_lowered: boolean | null
          threshold_used: number | null
          total_properties_found: number | null
          undervaluation_threshold: number
          used_cache_only: boolean | null
          user_agent: string | null
        }
        Insert: {
          api_key_used?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          cache_hits?: number | null
          cache_properties_returned?: number | null
          claude_api_calls?: number | null
          claude_cost_usd?: number | null
          claude_tokens_used?: number | null
          completed_at?: string | null
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          job_id: string
          max_listings?: number
          max_price?: number | null
          min_price?: number | null
          neighborhood: string
          no_fee?: boolean | null
          processing_duration_ms?: number | null
          processing_log?: string[] | null
          property_type: string
          qualifying_properties_saved?: number | null
          requested_at?: string
          response_summary?: Json | null
          retry_count?: number | null
          started_at?: string | null
          status?: string
          streeteasy_api_calls?: number | null
          streeteasy_properties_analyzed?: number | null
          streeteasy_properties_fetched?: number | null
          threshold_lowered?: boolean | null
          threshold_used?: number | null
          total_properties_found?: number | null
          undervaluation_threshold?: number
          used_cache_only?: boolean | null
          user_agent?: string | null
        }
        Update: {
          api_key_used?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          cache_hits?: number | null
          cache_properties_returned?: number | null
          claude_api_calls?: number | null
          claude_cost_usd?: number | null
          claude_tokens_used?: number | null
          completed_at?: string | null
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          job_id?: string
          max_listings?: number
          max_price?: number | null
          min_price?: number | null
          neighborhood?: string
          no_fee?: boolean | null
          processing_duration_ms?: number | null
          processing_log?: string[] | null
          property_type?: string
          qualifying_properties_saved?: number | null
          requested_at?: string
          response_summary?: Json | null
          retry_count?: number | null
          started_at?: string | null
          status?: string
          streeteasy_api_calls?: number | null
          streeteasy_properties_analyzed?: number | null
          streeteasy_properties_fetched?: number | null
          threshold_lowered?: boolean | null
          threshold_used?: number | null
          total_properties_found?: number | null
          undervaluation_threshold?: number
          used_cache_only?: boolean | null
          user_agent?: string | null
        }
        Relationships: []
      }
      ai_agent_rentals: {
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
          fetch_job_id: string
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
          rent_stabilized_confidence: number | null
          rent_stabilized_detected: boolean | null
          rent_stabilized_probability: number | null
          rent_stabilized_reasoning: string | null
          rent_stabilized_sources: string[] | null
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
          fetch_job_id: string
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
          rent_stabilized_confidence?: number | null
          rent_stabilized_detected?: boolean | null
          rent_stabilized_probability?: number | null
          rent_stabilized_reasoning?: string | null
          rent_stabilized_sources?: string[] | null
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
          fetch_job_id?: string
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
          rent_stabilized_confidence?: number | null
          rent_stabilized_detected?: boolean | null
          rent_stabilized_probability?: number | null
          rent_stabilized_reasoning?: string | null
          rent_stabilized_sources?: string[] | null
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
      ai_agent_sales: {
        Row: {
          address: string
          agents: Json
          amenities: string[]
          amenity_count: number | null
          analysis_date: string
          bathrooms: number | null
          bedrooms: number | null
          borough: string | null
          building_id: string | null
          building_info: Json
          built_in: number | null
          category_confidence: number | null
          comparison_group: string | null
          comparison_method: string
          consumer_reasoning: string | null
          created_at: string
          days_on_market: number | null
          deal_quality: string | null
          description: string | null
          discount_percent: number
          estimated_market_price: number | null
          fetch_job_id: string
          floorplans: Json
          grade: string
          id: string
          image_count: number | null
          images: Json
          investment_reasoning: string | null
          last_seen_in_search: string
          latitude: number | null
          likely_sold: boolean
          listed_at: string | null
          listing_id: string
          listing_url: string | null
          longitude: number | null
          market_price_per_sqft: number | null
          monthly_hoa: number | null
          monthly_tax: number | null
          neighborhood: string | null
          potential_savings: number | null
          ppsqft: number | null
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
          building_id?: string | null
          building_info?: Json
          built_in?: number | null
          category_confidence?: number | null
          comparison_group?: string | null
          comparison_method: string
          consumer_reasoning?: string | null
          created_at?: string
          days_on_market?: number | null
          deal_quality?: string | null
          description?: string | null
          discount_percent: number
          estimated_market_price?: number | null
          fetch_job_id: string
          floorplans?: Json
          grade: string
          id?: string
          image_count?: number | null
          images?: Json
          investment_reasoning?: string | null
          last_seen_in_search?: string
          latitude?: number | null
          likely_sold?: boolean
          listed_at?: string | null
          listing_id: string
          listing_url?: string | null
          longitude?: number | null
          market_price_per_sqft?: number | null
          monthly_hoa?: number | null
          monthly_tax?: number | null
          neighborhood?: string | null
          potential_savings?: number | null
          ppsqft?: number | null
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
          building_id?: string | null
          building_info?: Json
          built_in?: number | null
          category_confidence?: number | null
          comparison_group?: string | null
          comparison_method?: string
          consumer_reasoning?: string | null
          created_at?: string
          days_on_market?: number | null
          deal_quality?: string | null
          description?: string | null
          discount_percent?: number
          estimated_market_price?: number | null
          fetch_job_id?: string
          floorplans?: Json
          grade?: string
          id?: string
          image_count?: number | null
          images?: Json
          investment_reasoning?: string | null
          last_seen_in_search?: string
          latitude?: number | null
          likely_sold?: boolean
          listed_at?: string | null
          listing_id?: string
          listing_url?: string | null
          longitude?: number | null
          market_price_per_sqft?: number | null
          monthly_hoa?: number | null
          monthly_tax?: number | null
          neighborhood?: string | null
          potential_savings?: number | null
          ppsqft?: number | null
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
      blog_posts: {
        Row: {
          author_email: string
          content: string
          created_at: string
          excerpt: string
          featured_image: string | null
          featured_image_alt: string | null
          id: string
          meta_description: string
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_email?: string
          content: string
          created_at?: string
          excerpt: string
          featured_image?: string | null
          featured_image_alt?: string | null
          id?: string
          meta_description: string
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_email?: string
          content?: string
          created_at?: string
          excerpt?: string
          featured_image?: string | null
          featured_image_alt?: string | null
          id?: string
          meta_description?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
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
          bedrooms: number | null
          created_at: string
          discount_threshold: number | null
          email_address: string | null
          frustrations: string[] | null
          id: string
          is_canceled: boolean | null
          manual_unlimited: boolean
          max_budget: number | null
          must_haves: string[] | null
          name: string | null
          neighborhood_preferences: string[] | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          preferred_neighborhoods: string[] | null
          property_type: string | null
          search_duration: string | null
          searching_for: string | null
          stripe_customer_id: string | null
          subscription_plan: string
          subscription_renewal: string | null
        }
        Insert: {
          bedrooms?: number | null
          created_at?: string
          discount_threshold?: number | null
          email_address?: string | null
          frustrations?: string[] | null
          id: string
          is_canceled?: boolean | null
          manual_unlimited?: boolean
          max_budget?: number | null
          must_haves?: string[] | null
          name?: string | null
          neighborhood_preferences?: string[] | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          preferred_neighborhoods?: string[] | null
          property_type?: string | null
          search_duration?: string | null
          searching_for?: string | null
          stripe_customer_id?: string | null
          subscription_plan?: string
          subscription_renewal?: string | null
        }
        Update: {
          bedrooms?: number | null
          created_at?: string
          discount_threshold?: number | null
          email_address?: string | null
          frustrations?: string[] | null
          id?: string
          is_canceled?: boolean | null
          manual_unlimited?: boolean
          max_budget?: number | null
          must_haves?: string[] | null
          name?: string | null
          neighborhood_preferences?: string[] | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          preferred_neighborhoods?: string[] | null
          property_type?: string | null
          search_duration?: string | null
          searching_for?: string | null
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
          message: string | null
          name: string
          notified_at: string | null
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
          message?: string | null
          name: string
          notified_at?: string | null
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
          message?: string | null
          name?: string
          notified_at?: string | null
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
          agents: Json | null
          amenities: string[] | null
          bathrooms: number | null
          bedrooms: number | null
          borough: string | null
          building_info: Json | null
          built_in: number | null
          created_at: string
          description: string | null
          id: string
          images: Json | null
          last_analyzed: string | null
          last_checked: string
          last_seen_in_search: string
          latitude: number | null
          listing_id: string
          longitude: number | null
          market_status: string | null
          monthly_hoa: number | null
          monthly_tax: number | null
          neighborhood: string | null
          ppsqft: number | null
          price: number | null
          property_type: string | null
          sale_price: number | null
          sqft: number | null
          times_seen: number | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          agents?: Json | null
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          building_info?: Json | null
          built_in?: number | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          last_analyzed?: string | null
          last_checked?: string
          last_seen_in_search?: string
          latitude?: number | null
          listing_id: string
          longitude?: number | null
          market_status?: string | null
          monthly_hoa?: number | null
          monthly_tax?: number | null
          neighborhood?: string | null
          ppsqft?: number | null
          price?: number | null
          property_type?: string | null
          sale_price?: number | null
          sqft?: number | null
          times_seen?: number | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          agents?: Json | null
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          building_info?: Json | null
          built_in?: number | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          last_analyzed?: string | null
          last_checked?: string
          last_seen_in_search?: string
          latitude?: number | null
          listing_id?: string
          longitude?: number | null
          market_status?: string | null
          monthly_hoa?: number | null
          monthly_tax?: number | null
          neighborhood?: string | null
          ppsqft?: number | null
          price?: number | null
          property_type?: string | null
          sale_price?: number | null
          sqft?: number | null
          times_seen?: number | null
          zipcode?: string | null
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
          last_seen_in_search: string
          last_verified: string
          last_viewed_at: string | null
          lease_term: string | null
          likely_rented: boolean
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
          rented_detected_at: string | null
          risk_factors: Json
          sqft: number | null
          street_easy_score: number | null
          tags: Json
          times_seen_in_search: number | null
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
          last_seen_in_search?: string
          last_verified?: string
          last_viewed_at?: string | null
          lease_term?: string | null
          likely_rented?: boolean
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
          rented_detected_at?: string | null
          risk_factors?: Json
          sqft?: number | null
          street_easy_score?: number | null
          tags?: Json
          times_seen_in_search?: number | null
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
          last_seen_in_search?: string
          last_verified?: string
          last_viewed_at?: string | null
          lease_term?: string | null
          likely_rented?: boolean
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
          rented_detected_at?: string | null
          risk_factors?: Json
          sqft?: number | null
          street_easy_score?: number | null
          tags?: Json
          times_seen_in_search?: number | null
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
          annual_savings: number | null
          available_date: string | null
          available_from: string | null
          bathrooms: number | null
          bedrooms: number | null
          borough: string | null
          broker_fee: string | null
          building_amenities: string[] | null
          building_id: string | null
          building_info: Json
          built_in: number | null
          category_confidence: number | null
          comparison_group: string | null
          comparison_method: string
          consumer_reasoning: string | null
          created_at: string
          days_on_market: number | null
          deal_quality: string | null
          description: string | null
          discount_percent: number
          estimated_market_price: number | null
          estimated_market_rent: number | null
          floorplans: Json
          grade: string
          id: string
          image_count: number | null
          images: Json
          investment_reasoning: string | null
          investor_plan_property: boolean | null
          last_seen_in_search: string
          latitude: number | null
          likely_sold: boolean
          listed_at: string | null
          listing_id: string
          listing_url: string | null
          longitude: number | null
          market_price_per_sqft: number | null
          monthly_hoa: number | null
          monthly_rent: number | null
          monthly_tax: number | null
          neighborhood: string | null
          no_fee: boolean | null
          potential_monthly_savings: number | null
          potential_savings: number | null
          ppsqft: number | null
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
          total_units_in_building: number | null
          undervaluation_category: string | null
          undervaluation_percent: number | null
          undervaluation_phrases: string[] | null
          videos: Json
          year_built: number | null
          zip_code: string | null
          zipcode: string | null
        }
        Insert: {
          address: string
          agents?: Json
          amenities?: string[]
          amenity_count?: number | null
          analysis_date?: string
          annual_savings?: number | null
          available_date?: string | null
          available_from?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          broker_fee?: string | null
          building_amenities?: string[] | null
          building_id?: string | null
          building_info?: Json
          built_in?: number | null
          category_confidence?: number | null
          comparison_group?: string | null
          comparison_method: string
          consumer_reasoning?: string | null
          created_at?: string
          days_on_market?: number | null
          deal_quality?: string | null
          description?: string | null
          discount_percent: number
          estimated_market_price?: number | null
          estimated_market_rent?: number | null
          floorplans?: Json
          grade: string
          id?: string
          image_count?: number | null
          images?: Json
          investment_reasoning?: string | null
          investor_plan_property?: boolean | null
          last_seen_in_search?: string
          latitude?: number | null
          likely_sold?: boolean
          listed_at?: string | null
          listing_id: string
          listing_url?: string | null
          longitude?: number | null
          market_price_per_sqft?: number | null
          monthly_hoa?: number | null
          monthly_rent?: number | null
          monthly_tax?: number | null
          neighborhood?: string | null
          no_fee?: boolean | null
          potential_monthly_savings?: number | null
          potential_savings?: number | null
          ppsqft?: number | null
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
          total_units_in_building?: number | null
          undervaluation_category?: string | null
          undervaluation_percent?: number | null
          undervaluation_phrases?: string[] | null
          videos?: Json
          year_built?: number | null
          zip_code?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string
          agents?: Json
          amenities?: string[]
          amenity_count?: number | null
          analysis_date?: string
          annual_savings?: number | null
          available_date?: string | null
          available_from?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          broker_fee?: string | null
          building_amenities?: string[] | null
          building_id?: string | null
          building_info?: Json
          built_in?: number | null
          category_confidence?: number | null
          comparison_group?: string | null
          comparison_method?: string
          consumer_reasoning?: string | null
          created_at?: string
          days_on_market?: number | null
          deal_quality?: string | null
          description?: string | null
          discount_percent?: number
          estimated_market_price?: number | null
          estimated_market_rent?: number | null
          floorplans?: Json
          grade?: string
          id?: string
          image_count?: number | null
          images?: Json
          investment_reasoning?: string | null
          investor_plan_property?: boolean | null
          last_seen_in_search?: string
          latitude?: number | null
          likely_sold?: boolean
          listed_at?: string | null
          listing_id?: string
          listing_url?: string | null
          longitude?: number | null
          market_price_per_sqft?: number | null
          monthly_hoa?: number | null
          monthly_rent?: number | null
          monthly_tax?: number | null
          neighborhood?: string | null
          no_fee?: boolean | null
          potential_monthly_savings?: number | null
          potential_savings?: number | null
          ppsqft?: number | null
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
          total_units_in_building?: number | null
          undervaluation_category?: string | null
          undervaluation_percent?: number | null
          undervaluation_phrases?: string[] | null
          videos?: Json
          year_built?: number | null
          zip_code?: string | null
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
      get_ai_agent_cache_stats: {
        Args: { days_back?: number }
        Returns: {
          total_requests: number
          cache_only_requests: number
          cache_hit_rate: number
          avg_processing_time_ms: number
        }[]
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
          bedrooms: number | null
          created_at: string
          discount_threshold: number | null
          email_address: string | null
          frustrations: string[] | null
          id: string
          is_canceled: boolean | null
          manual_unlimited: boolean
          max_budget: number | null
          must_haves: string[] | null
          name: string | null
          neighborhood_preferences: string[] | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          preferred_neighborhoods: string[] | null
          property_type: string | null
          search_duration: string | null
          searching_for: string | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

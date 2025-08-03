// /supabase/functions/ai-search/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the user query from the request
    const { query } = await req.json()

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get Claude API key from environment
    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY')
    if (!claudeApiKey) {
      return new Response(
        JSON.stringify({ error: 'Claude API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Define neighborhoods and boroughs
    const neighborhoods = [
      'Upper East Side', 'Upper West Side', 'Midtown', 'Chelsea', 'Greenwich Village',
      'SoHo', 'Tribeca', 'Lower East Side', 'East Village', 'Hell\'s Kitchen',
      'Financial District', 'Harlem', 'Washington Heights', 'Inwood',
      'Williamsburg', 'DUMBO', 'Brooklyn Heights', 'Park Slope', 'Prospect Heights',
      'Crown Heights', 'Bed-Stuy', 'Bushwick', 'Red Hook', 'Carroll Gardens',
      'Cobble Hill', 'Boerum Hill', 'Fort Greene', 'Clinton Hill', 'Greenpoint',
      'Bay Ridge', 'Sunset Park', 'Gowanus', 'Sheepshead Bay',
      'Long Island City', 'Astoria', 'Sunnyside', 'Woodside', 'Jackson Heights',
      'Elmhurst', 'Forest Hills', 'Kew Gardens', 'Flushing', 'Bayside',
      'South Bronx', 'Mott Haven', 'Concourse', 'Fordham', 'Riverdale',
      'St. George', 'Stapleton', 'New Brighton'
    ]

    const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']

    const systemPrompt = `You are an AI real estate assistant for NYC. Convert natural language search queries into structured filters for our property database.

AVAILABLE TABLES & COLUMNS:
1. undervalued_sales: price, bedrooms, bathrooms, sqft, neighborhood, borough, discount_percent, no_fee, pet_friendly, doorman_building, elevator_building, laundry_available, gym_available, rooftop_access
2. undervalued_rentals: monthly_rent, bedrooms, bathrooms, sqft, neighborhood, borough, discount_percent, no_fee, pet_friendly, doorman_building, elevator_building, laundry_available, gym_available, rooftop_access  
3. undervalued_rent_stabilized: monthly_rent, bedrooms, bathrooms, sqft, neighborhood, borough, undervaluation_percent, rent_stabilized_confidence

NYC NEIGHBORHOODS: ${neighborhoods.join(', ')}
NYC BOROUGHS: ${boroughs.join(', ')}

IMPORTANT: When users specify a price or budget (e.g., "3 bedroom for 5M", "2BR for 2.5k/month"), interpret this as the MAXIMUM budget (at or below that amount), not an exact price match. Use the max_budget field for filtering properties AT OR BELOW the specified amount.

RESPOND ONLY WITH VALID JSON (no markdown formatting):
{
  "property_type": "rent|buy",
  "max_budget": number,
  "bedrooms": number,
  "neighborhoods": ["neighborhood1", "neighborhood2"],
  "boroughs": ["borough1"],
  "must_haves": ["feature1", "feature2"],
  "discount_threshold": number,
  "interpretation": "Clear explanation of what you understood from the user's request"
}

EXAMPLES:
"2BR under $4k in Brooklyn" → {"property_type": "rent", "max_budget": 4000, "bedrooms": 2, "boroughs": ["Brooklyn"], "interpretation": "Looking for 2-bedroom rentals at or under $4,000/month in Brooklyn"}

"3 bedroom for 5M" → {"property_type": "buy", "max_budget": 5000000, "bedrooms": 3, "interpretation": "Looking for 3-bedroom properties at or under $5M"}

"2BR for 2.5k month" → {"property_type": "rent", "max_budget": 2500, "bedrooms": 2, "interpretation": "Looking for 2-bedroom rentals at or under $2,500/month"}

"Safe family neighborhood with good schools" → {"neighborhoods": ["Park Slope", "Carroll Gardens", "Brooklyn Heights"], "interpretation": "Looking for family-friendly neighborhoods known for safety and good schools"}

"Pet-friendly with gym and doorman" → {"must_haves": ["pet_friendly", "gym_available", "doorman_building"], "interpretation": "Looking for pet-friendly properties with gym and doorman"}

"Rent stabilized apartments" → {"must_haves": ["rent_stabilized"], "interpretation": "Looking specifically for rent-stabilized apartments"}

"Great deal at least 20% below market" → {"discount_threshold": 20, "interpretation": "Looking for properties with at least 20% discount from market value"}`

    // Call Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: query
          }
        ]
      })
    })

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text()
      console.error('Claude API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to process request with Claude API' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const claudeData = await claudeResponse.json()
    const aiResponse = claudeData.content[0].text

    // Clean the response to ensure it's valid JSON
    const cleanedResponse = aiResponse.replace(/```json\n?/, '').replace(/```\n?$/, '').trim()
    
    let parsedFilters
    try {
      parsedFilters = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse Claude response:', cleanedResponse)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse AI response',
          fallback: {
            interpretation: "I couldn't understand your request. Please try rephrasing it.",
            property_type: "rent",
            neighborhoods: [],
            boroughs: [],
            must_haves: [],
            max_budget: null,
            bedrooms: null,
            discount_threshold: null
          }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return the parsed filters
    return new Response(
      JSON.stringify({ success: true, filters: parsedFilters }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

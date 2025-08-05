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

const systemPrompt = `You are an AI real estate assistant for NYC. Convert natural language search queries into structured filters.

CRITICAL RULES:
- If NO budget/price mentioned → do NOT include max_budget field
- If NO bedrooms mentioned → do NOT include bedrooms field  
- If NO property type mentioned → search both rent and buy
- If budget under $100,000 → set property_type to "rent"
- If budget over $100,000 → set property_type to "buy"
- Always prioritize showing SOME results over NO results

WHEN USER SAYS:
- "good shopping" → SoHo, NoHo, Williamsburg, Upper East Side
- "great restaurants" → East Village, Astoria, Park Slope, Tribeca  
- "good transportation" → LIC, Union Square, Park Slope, Astoria
- "trendy/hip" → Williamsburg, Bushwick, East Village, LES
- "good nightlife" → East Village, LES, Williamsburg, Bushwick
- "quiet/peaceful" → Brooklyn Heights, Upper West Side, Forest Hills
- "safe area" → Upper East Side, Brooklyn Heights, Park Slope
- "good schools" → Park Slope, Brooklyn Heights, Upper West Side, Forest Hills, Upper East Side
- "by the water" → DUMBO, Brooklyn Heights, LIC, Williamsburg, Red Hook
- "young professionals" → Williamsburg, Park Slope, LIC, Hell's Kitchen, Upper East Side
- "up-and-coming" → Bushwick, Crown Heights, LIC, Sunset Park, Gowanus
- "family-friendly" → Park Slope, Brooklyn Heights, Upper West Side, Astoria, Forest Hills
- "dog-friendly" → Park Slope, Prospect Heights, LIC, Williamsburg
- "walkable" → Greenwich Village, SoHo, Park Slope, Astoria
- "good for students" → East Village, LES, Astoria, Crown Heights
- "close to work" → Financial District, Midtown, LIC, DUMBO
- "good coffee shops" → Williamsburg, East Village, Park Slope, Astoria

RESPOND ONLY WITH VALID JSON - NO EXPLANATIONS OR EXTRA TEXT:
{"property_type": "rent|buy", "max_budget": number, "bedrooms": number, "neighborhoods": ["..."], "boroughs": ["..."], "must_haves": ["..."], "interpretation": "..."}

CRITICAL: Response must end immediately after closing }. Any additional text causes system errors.`

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

// Extract just the JSON object, ignoring any explanatory text
let jsonString = cleanedResponse;
const jsonMatch = cleanedResponse.match(/\{[\s\S]*?\}/);
if (jsonMatch) {
  jsonString = jsonMatch[0];
}

let parsedFilters
try {
  parsedFilters = JSON.parse(jsonString)
} catch (parseError) {
  console.error('Failed to parse Claude response:', cleanedResponse)
  console.error('Original AI response:', aiResponse)
  console.error('Parse error:', parseError.message)
  
  return new Response(
    JSON.stringify({ 
      error: 'Failed to parse AI response',
      rawResponse: aiResponse,
      cleanedResponse: cleanedResponse,
      fallback: {
        interpretation: "Try a more specific prompt or adjust your criteria. Examples: \"2BR under $4k in Brooklyn\" or \"pet-friendly studio with gym\".",
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

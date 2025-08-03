
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Return 410 Gone for all requests to indicate the resource is permanently unavailable
  // This should help browsers understand to stop retrying these URLs
  return new Response(
    JSON.stringify({ 
      error: 'This proxy service has been permanently discontinued',
      message: 'Images are now served directly from their original sources'
    }),
    {
      status: 410,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400' // Cache the 410 response for 24 hours
      }
    }
  )
})

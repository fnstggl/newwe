
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests with minimal processing
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Return 503 Service Unavailable immediately with minimal processing
  // This should cause browsers to stop aggressive retrying
  return new Response(
    null, // No body to minimize response size
    {
      status: 503,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Retry-After': '86400' // Tell browsers to retry after 24 hours
      }
    }
  )
})

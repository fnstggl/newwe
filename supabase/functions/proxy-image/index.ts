
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get('url');

    if (!imageUrl) {
      return new Response('Missing URL parameter', { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Only allow Zillow image URLs for security
    if (!imageUrl.startsWith('https://photos.zillowstatic.com/')) {
      return new Response('Invalid image URL', { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Fetch the image from Zillow
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!imageResponse.ok) {
      return new Response('Failed to fetch image', { 
        status: imageResponse.status,
        headers: corsHeaders
      });
    }

    // Set aggressive caching headers
    const headers = new Headers(corsHeaders);
    headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    headers.set('Content-Type', imageResponse.headers.get('Content-Type') || 'image/jpeg');
    
    // Copy other relevant headers
    if (imageResponse.headers.get('Content-Length')) {
      headers.set('Content-Length', imageResponse.headers.get('Content-Length')!);
    }

    return new Response(imageResponse.body, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Proxy image error:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});

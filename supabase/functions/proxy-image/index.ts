
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

    // Fetch the image from Zillow with optimized headers
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/avif,image/apng,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache'
      }
    });

    if (!imageResponse.ok) {
      return new Response('Failed to fetch image', { 
        status: imageResponse.status,
        headers: corsHeaders
      });
    }

    // Set aggressive caching headers for CDN
    const headers = new Headers(corsHeaders);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year
    headers.set('Content-Type', imageResponse.headers.get('Content-Type') || 'image/jpeg');
    headers.set('ETag', imageResponse.headers.get('ETag') || `"${Date.now()}"`);
    headers.set('Last-Modified', imageResponse.headers.get('Last-Modified') || new Date().toUTCString());
    
    // Copy other relevant headers for better caching
    if (imageResponse.headers.get('Content-Length')) {
      headers.set('Content-Length', imageResponse.headers.get('Content-Length')!);
    }
    if (imageResponse.headers.get('Content-Encoding')) {
      headers.set('Content-Encoding', imageResponse.headers.get('Content-Encoding')!);
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

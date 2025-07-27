
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
    const width = url.searchParams.get('width') || '400'; // Default thumbnail width
    const quality = url.searchParams.get('quality') || '60'; // Lower quality for faster loading

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

    // Modify Zillow URL to request smaller, compressed images
    let optimizedUrl = imageUrl;
    
    // Replace common Zillow image size parameters with smaller ones
    optimizedUrl = optimizedUrl.replace(/cc_ft_\d+/, `cc_ft_${width}`);
    optimizedUrl = optimizedUrl.replace(/cc_\d+_\d+_\d+/, `cc_${width}_${Math.round(parseInt(width) * 0.75)}_${quality}`);
    optimizedUrl = optimizedUrl.replace(/-full\.jpg/, `-${width}.jpg`);
    optimizedUrl = optimizedUrl.replace(/-uncropped_scaled_within_\d+_\d+\./, `-uncropped_scaled_within_${width}_${Math.round(parseInt(width) * 0.75)}.`);
    
    // Add compression parameters if not already present
    if (!optimizedUrl.includes('quality=') && !optimizedUrl.includes('q=')) {
      const separator = optimizedUrl.includes('?') ? '&' : '?';
      optimizedUrl += `${separator}quality=${quality}`;
    }

    // Fetch the optimized image from Zillow with performance headers
    const imageResponse = await fetch(optimizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/avif,image/jpeg,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

    if (!imageResponse.ok) {
      // Fallback to original URL if optimized version fails
      const fallbackResponse = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'image/webp,image/avif,image/jpeg,image/*,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!fallbackResponse.ok) {
        return new Response('Failed to fetch image', { 
          status: fallbackResponse.status,
          headers: corsHeaders
        });
      }
      
      // Set aggressive caching headers for fallback
      const headers = new Headers(corsHeaders);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      headers.set('Content-Type', fallbackResponse.headers.get('Content-Type') || 'image/jpeg');
      headers.set('ETag', fallbackResponse.headers.get('ETag') || `"${Date.now()}"`);
      headers.set('Last-Modified', fallbackResponse.headers.get('Last-Modified') || new Date().toUTCString());
      
      return new Response(fallbackResponse.body, {
        status: 200,
        headers
      });
    }

    // Set aggressive caching headers for optimized image
    const headers = new Headers(corsHeaders);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Content-Type', imageResponse.headers.get('Content-Type') || 'image/jpeg');
    headers.set('ETag', imageResponse.headers.get('ETag') || `"${Date.now()}"`);
    headers.set('Last-Modified', imageResponse.headers.get('Last-Modified') || new Date().toUTCString());
    
    // Add compression indicator
    headers.set('X-Image-Optimized', 'true');
    
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

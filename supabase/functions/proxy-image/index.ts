
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// In-memory cache for recent requests
const responseCache = new Map<string, { data: ArrayBuffer; contentType: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache

// Exponential backoff for failed requests
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get('url');
    const width = url.searchParams.get('width') || '250';
    const quality = url.searchParams.get('quality') || '25';

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

    // Create cache key
    const cacheKey = `${imageUrl}_${width}_${quality}`;
    
    // Check cache first
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      const headers = new Headers(corsHeaders);
      headers.set('Cache-Control', 'public, max-age=3600, immutable');
      headers.set('Content-Type', cached.contentType);
      headers.set('X-Cache-Status', 'HIT');
      
      return new Response(cached.data, {
        status: 200,
        headers
      });
    }

    // Modify Zillow URL to request smaller, compressed images
    let optimizedUrl = imageUrl;
    
    // Replace common Zillow image size parameters
    optimizedUrl = optimizedUrl.replace(/cc_ft_\d+/, `cc_ft_${width}`);
    optimizedUrl = optimizedUrl.replace(/cc_\d+_\d+_\d+/, `cc_${width}_${Math.round(parseInt(width) * 0.6)}_${quality}`);
    optimizedUrl = optimizedUrl.replace(/-full\.jpg/, `-${width}.jpg`);
    optimizedUrl = optimizedUrl.replace(/-uncropped_scaled_within_\d+_\d+\./, `-uncropped_scaled_within_${width}_${Math.round(parseInt(width) * 0.6)}.`);
    
    // Force low quality by adding/replacing quality parameters
    if (optimizedUrl.includes('quality=') || optimizedUrl.includes('q=')) {
      optimizedUrl = optimizedUrl.replace(/quality=\d+/g, `quality=${quality}`);
      optimizedUrl = optimizedUrl.replace(/q=\d+/g, `q=${quality}`);
    } else {
      const separator = optimizedUrl.includes('?') ? '&' : '?';
      optimizedUrl += `${separator}quality=${quality}&q=${quality}`;
    }

    // Add compression parameters
    const separator2 = optimizedUrl.includes('?') ? '&' : '?';
    optimizedUrl += `${separator2}format=webp&compress=1`;

    // Exponential backoff retry logic
    let lastError: Error | null = null;
    let imageResponse: Response | null = null;
    
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        imageResponse = await fetch(optimizedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/webp,image/avif,image/jpeg,image/*,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (imageResponse.ok) {
          break; // Success, exit retry loop
        } else if (imageResponse.status === 429 || imageResponse.status >= 500) {
          // Rate limited or server error - retry with exponential backoff
          lastError = new Error(`HTTP ${imageResponse.status}`);
          if (attempt < 2) {
            await sleep(Math.pow(2, attempt) * 1000 + Math.random() * 1000); // 1s, 2s, etc. + jitter
          }
        } else {
          // Client error - don't retry
          break;
        }
      } catch (error) {
        lastError = error as Error;
        if (attempt < 2 && error.name !== 'AbortError') {
          await sleep(Math.pow(2, attempt) * 1000 + Math.random() * 1000);
        }
      }
    }

    if (!imageResponse || !imageResponse.ok) {
      // Fallback to original URL
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const fallbackResponse = await fetch(imageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/webp,image/avif,image/jpeg,image/*,*/*;q=0.8',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!fallbackResponse.ok) {
          return new Response('Failed to fetch image', { 
            status: fallbackResponse.status,
            headers: corsHeaders
          });
        }
        
        const arrayBuffer = await fallbackResponse.arrayBuffer();
        const contentType = fallbackResponse.headers.get('Content-Type') || 'image/jpeg';
        
        // Cache the response
        responseCache.set(cacheKey, {
          data: arrayBuffer,
          contentType,
          timestamp: Date.now()
        });
        
        const headers = new Headers(corsHeaders);
        headers.set('Cache-Control', 'public, max-age=3600, immutable');
        headers.set('Content-Type', contentType);
        headers.set('X-Cache-Status', 'MISS');
        headers.set('X-Fallback', 'true');
        
        return new Response(arrayBuffer, {
          status: 200,
          headers
        });
      } catch (fallbackError) {
        console.error('Fallback request failed:', fallbackError);
        return new Response('Failed to fetch image', { 
          status: 500,
          headers: corsHeaders
        });
      }
    }

    // Success - cache and return the optimized image
    const arrayBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('Content-Type') || 'image/jpeg';
    
    // Cache the successful response
    responseCache.set(cacheKey, {
      data: arrayBuffer,
      contentType,
      timestamp: Date.now()
    });

    const headers = new Headers(corsHeaders);
    headers.set('Cache-Control', 'public, max-age=3600, immutable');
    headers.set('Content-Type', contentType);
    headers.set('X-Cache-Status', 'MISS');
    headers.set('X-Image-Optimized', 'true');
    headers.set('X-Image-Quality', quality);
    headers.set('X-Image-Width', width);
    
    return new Response(arrayBuffer, {
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

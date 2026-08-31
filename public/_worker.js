const ALLOWED_MODEL_PREFIXES = ['Xenova/clipseg-rd64-refined/'];
const ALLOWED_EXTENSIONS = ['.json', '.onnx', '.txt', '.bin', '.wasm', '.safetensors', '.md'];

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

function applySecurityHeaders(response) {
  const newHeaders = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (!newHeaders.has(key)) {
      newHeaders.set(key, value);
    }
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle Hugging Face proxy endpoint
    if (url.pathname.startsWith('/hf/')) {
      // 1. Method restriction
      if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
        return new Response('Method Not Allowed', { status: 405 });
      }

      // 2. Preflight handling
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': url.origin,
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            ...SECURITY_HEADERS,
          },
        });
      }

      const hfPath = url.pathname.replace(/^\/hf\//, '');

      // 3. Path traversal & injection defense
      if (hfPath.includes('..') || hfPath.includes('\\') || hfPath.includes('%00')) {
        return new Response('Bad Request: Invalid Path', { status: 400 });
      }

      // 4. Strict Model Whitelist
      const isAllowedModel = ALLOWED_MODEL_PREFIXES.some((prefix) => hfPath.startsWith(prefix));
      if (!isAllowedModel) {
        return new Response('Forbidden: Model not in whitelist', { status: 403 });
      }

      // 5. File Extension Whitelist
      const cleanPath = hfPath.split('?')[0];
      const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => cleanPath.endsWith(ext));
      if (!hasValidExt) {
        return new Response('Forbidden: Invalid file type', { status: 403 });
      }

      const hfUrl = `https://huggingface.co/${hfPath}${url.search}`;

      try {
        // 6. Timeout protection (30 seconds max for large ONNX weights)
        const response = await fetch(hfUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; GeoLensEdge/1.0)',
            Accept: request.headers.get('Accept') || '*/*',
          },
          signal: AbortSignal.timeout(30000),
        });

        const headers = new Headers(response.headers);
        headers.set('Access-Control-Allow-Origin', url.origin);
        headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        headers.set('Access-Control-Expose-Headers', 'Content-Length, Accept-Ranges, ETag, Content-Range');
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');

        for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
          headers.set(key, value);
        }

        return new Response(response.body, {
          status: response.status,
          headers,
        });
      } catch {
        return new Response(JSON.stringify({ error: 'Failed to fetch model asset from Hugging Face' }), {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            ...SECURITY_HEADERS,
          },
        });
      }
    }

    // Serve static assets with security headers
    const assetResponse = await env.ASSETS.fetch(request);
    return applySecurityHeaders(assetResponse);
  },
};

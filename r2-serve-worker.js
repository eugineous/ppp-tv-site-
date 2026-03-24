// Cloudflare Worker — serves ppptv-assets R2 bucket publicly
// Deploy name: ppptv-assets

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Strip leading slash to get R2 key
    const key = decodeURIComponent(url.pathname.slice(1));

    if (!key) {
      return new Response('PPP TV Assets', { status: 200 });
    }

    const object = await env.BUCKET.get(key);

    if (!object) {
      return new Response('Not Found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    // Cache for 1 year — images don't change
    headers.set('cache-control', 'public, max-age=31536000, immutable');
    // Allow cross-origin (Next.js Image component needs this)
    headers.set('access-control-allow-origin', '*');

    return new Response(object.body, { headers });
  },
};

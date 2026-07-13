// sw.js — Stage 8 offline shell for the honeymoon app.
// Strategy:
//   • App shell (navigations + same-origin static) → network-first, self-healing cache (fresh when online).
//   • Private Supabase Storage images → cache-first by PATH (signed-URL tokens rotate; images are immutable),
//     caching opaque no-cors <img> responses too, with a tidy "photo offline" placeholder when an
//     uncached image is requested offline.
//   • Supabase auth/REST API → never intercepted (must hit the network; content is cached in localStorage by the app).
//   • Fonts + Supabase CDN → cache-first (versioned/immutable).
// Because the shell re-caches on every online load, the VERSION only needs bumping for changes to THIS file.

const VERSION      = 'v1';
const SHELL_CACHE  = 'hnymn-shell-' + VERSION;
const IMG_CACHE    = 'hnymn-img-' + VERSION;   // must match the caches.delete('hnymn-img-v1') in index.html signout
const PRECACHE     = ['./', 'index.html', 'data/supabase-client.js'];
const CDN_HOSTS    = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];

// Tidy placeholder shown for images that were never cached while online.
const PLACEHOLDER_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">' +
  '<rect width="200" height="150" fill="#EDE7DD"/>' +
  '<text x="100" y="79" font-family="Georgia, serif" font-size="13" fill="#8A8172" ' +
  'text-anchor="middle">photo offline</text></svg>';
function placeholderResponse() {
  return new Response(PLACEHOLDER_SVG, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' }
  });
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // Cache each shell asset individually so one failure can't abort the whole install.
    await Promise.all(PRECACHE.map(url => cache.add(url).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keep = [SHELL_CACHE, IMG_CACHE];
    const names = await caches.keys();
    await Promise.all(names.filter(n => !keep.includes(n)).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;                 // never intercept non-GET (uploads, upserts, etc.)

  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  const isSupabase = url.hostname.endsWith('.supabase.co');

  // Private Storage images (signed URLs) → path-keyed cache.
  if (isSupabase && url.pathname.includes('/storage/v1/object/')) {
    event.respondWith(imageStrategy(req, url));
    return;
  }
  // Any other Supabase call (auth / rest / realtime) → passthrough, never cache.
  if (isSupabase) return;

  // Full-page navigations → network-first, self-heal cached index.html, offline fallback.
  if (req.mode === 'navigate') {
    event.respondWith(navigationStrategy(req));
    return;
  }
  // Same-origin static assets → network-first, re-cache on success, offline fallback.
  if (url.origin === self.location.origin) {
    event.respondWith(shellNetworkFirst(req));
    return;
  }
  // Fonts + Supabase CDN (immutable) → cache-first.
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(req));
    return;
  }
  // Everything else → default (network).
});

async function navigationStrategy(req) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put('index.html', res.clone());   // self-updating shell
    return res;
  } catch (e) {
    return (await cache.match('index.html')) || (await cache.match('./')) || Response.error();
  }
}

async function shellNetworkFirst(req) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    return (await cache.match(req)) || Response.error();
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  } catch (e) {
    return Response.error();
  }
}

// Cache key = origin + pathname (drop the ?token/expires query so the rotating signed URL still matches).
function imageKey(url) { return url.origin + url.pathname; }
// Cache-first: media/gallery images are immutable once uploaded, so once cached they load instantly and
// work offline. Both CORS fetches (res.ok) and opaque no-cors <img> responses are cached.
async function imageStrategy(req, url) {
  const cache = await caches.open(IMG_CACHE);
  const key = imageKey(url);
  const cached = await cache.match(key);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')) {
      try { await cache.put(key, res.clone()); } catch (e) {}
    }
    return res;
  } catch (e) {
    return (await cache.match(key)) || placeholderResponse();  // offline: cached bytes or tidy placeholder
  }
}

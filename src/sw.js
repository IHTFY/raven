// Service worker template. The build (see vite.config.js) fills in VERSION and PRECACHE and writes it to dist/sw.js.
const VERSION = '__VERSION__';
const PRECACHE = __PRECACHE__;
const PREFIX = 'raven-';
const CACHE = `${PREFIX}${VERSION}`;

self.addEventListener('install', (event) => {
  // Fetch past the HTTP cache so a new version never precaches stale files.
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith(PREFIX) && key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

// A cache that can't be opened or read (storage blocked or full) counts as a miss.
async function cached(request) {
  try {
    return await (await caches.open(CACHE)).match(request);
  } catch {
    return undefined;
  }
}

// The cached copy is the one precached with this version's assets, so it is never replaced by a
// live response: a page from a newer deploy could reference assets this cache doesn't hold.
async function networkElseCache(request, fallback) {
  try {
    return await fetch(request);
  } catch (error) {
    const response = await cached(fallback);
    if (response) return response;
    throw error;
  }
}

// Build output with a hash in its name never changes.
async function cacheElseNetwork(event) {
  const hit = await cached(event.request);
  if (hit) return hit;
  const response = await fetch(event.request);
  if (response.ok) {
    const copy = response.clone();
    event.waitUntil(
      caches
        .open(CACHE)
        .then((cache) => cache.put(event.request, copy))
        .catch(() => {}),
    );
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Other sites' requests, including the ad loader and ad scripts, go straight to the network.
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate' && (url.pathname === '/' || url.pathname === '/index.html')) {
    // Online players always get the newest page; offline, the cached shell.
    event.respondWith(networkElseCache(request, '/'));
  } else if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheElseNetwork(event));
  } else if (PRECACHE.includes(url.pathname)) {
    event.respondWith(networkElseCache(request, url.pathname));
  }
});

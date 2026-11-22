// Service worker template. The build (see vite.config.js) fills in VERSION and PRECACHE and writes it to dist/sw.js.
const VERSION = '__VERSION__';
const PRECACHE = __PRECACHE__;
// SHA-256 of the built index.html, so install can tell when a CDN edge still serves the previous page.
const SHELL_HASH = '__SHELL_HASH__';
const PREFIX = 'raven-';
const CACHE = `${PREFIX}${VERSION}`;

async function install() {
  try {
    // Recreate the cache so creation order matches install order, even when a rollback reinstalls
    // a version whose cache was kept as the previous one.
    await caches.delete(CACHE);
    const cache = await caches.open(CACHE);
    // Fetch past the HTTP cache so a new version never precaches stale files.
    await cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' })));
    // A page from another deploy would point at bundles this cache doesn't hold.
    const shell = await (await cache.match('/')).arrayBuffer();
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', shell))]
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
    if (hash !== SHELL_HASH) throw new Error('Cached page is from another deploy');
  } catch (error) {
    // A failed install keeps the previous worker and its cache; the browser tries again on a later visit.
    await caches.delete(CACHE).catch(() => {});
    throw error;
  }
  await self.skipWaiting();
}

self.addEventListener('install', (event) => event.waitUntil(install()));

// The previous version's cache stays until the next deploy: a tab that loaded the previous page just
// before this worker took over still asks for that page's bundles, which the deploy removed from the site.
// caches.keys() lists caches in the order they were created; only a cache holding a page counts as a
// finished version (an install cut off before its cleanup can leave an empty one).
async function activate() {
  const older = (await caches.keys()).filter((key) => key.startsWith(PREFIX) && key !== CACHE);
  let previous;
  for (const key of [...older].reverse()) {
    if (await (await caches.open(key)).match('/')) {
      previous = key;
      break;
    }
  }
  await Promise.all(older.filter((key) => key !== previous).map((key) => caches.delete(key)));
  await self.clients.claim();
}

self.addEventListener('activate', (event) => event.waitUntil(activate()));

// A cache that can't be opened or read (storage blocked or full) counts as a miss. Pages and other
// unhashed files come from this version's cache only; hashed bundles may come from the previous one.
async function cached(request, anyVersion = false) {
  try {
    return anyVersion ? await caches.match(request) : await (await caches.open(CACHE)).match(request);
  } catch {
    return undefined;
  }
}

// How long a page or unhashed file waits for the network before the cached copy is served instead.
// A connection that never answers (a captive portal, a dead Wi-Fi) would otherwise leave a blank page.
const NETWORK_WAIT = 3000;
const SLOW = Symbol('slow');

// The cached copy is the one precached with this version's assets, so it is never replaced by a
// live response: a page from a newer deploy could reference assets this cache doesn't hold.
// With no cached copy, the request keeps waiting on the network.
async function networkElseCache(request, fallback) {
  const network = fetch(request);
  let timer;
  const slow = new Promise((resolve) => {
    timer = setTimeout(resolve, NETWORK_WAIT, SLOW);
  });
  let response;
  try {
    response = await Promise.race([network, slow]);
    if (response === SLOW) {
      const copy = await cached(fallback);
      if (copy) return copy;
      response = await network;
    }
  } catch (error) {
    const copy = await cached(fallback);
    if (copy) return copy;
    throw error;
  } finally {
    clearTimeout(timer);
  }
  // A server error gets the cached copy when there is one.
  if (response.status >= 500) return (await cached(fallback)) ?? response;
  return response;
}

// Build output with a hash in its name never changes.
async function cacheElseNetwork(event) {
  const hit = await cached(event.request, true);
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

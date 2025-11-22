const CACHE_NAME = 'vault-token-access-v4';
const urlsToCache = [
  './',
  './index.html',
  './tier.html',
  './payment.html',
  './token.html',
  './dashboard.html',
  './manifest.json',
  './pwa192a.png',
  './pwa512a.png'
];

// 1. INSTALL: Cache all core files immediately
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('>> SYSTEM: Caching Core Protocol Assets...');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. FETCH: Serve from Cache first, fall back to Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached file if found
        if (response) {
          return response;
        }
        // Otherwise try to fetch from network
        return fetch(event.request);
      })
  );
});

// 3. ACTIVATE: Delete old caches (Housekeeping)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old versions
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

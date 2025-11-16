
const CACHE_NAME = 'zone4reyes-social-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  'https://appdesignmex.com/Zone4Reyes.png',
  'https://appdesignmex.com/iconoreyes.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Let the browser handle requests for scripts, other resources that might change frequently,
  // and all requests to Supabase to prevent auth issues.
  if (
    event.request.url.includes('/@vite/') || 
    event.request.url.includes('index.tsx') ||
    event.request.url.includes('supabase.co')
  ) {
    return;
  }

  // For other GET requests, use a cache-first strategy.
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }

          // Clone the request to use it both for fetching and caching
          const fetchRequest = event.request.clone();

          return fetch(fetchRequest).then(
            response => {
              // Check if we received a valid response to cache
              if (!response || response.status !== 200) {
                return response;
              }

              // Clone the response to use it both for browser and cache
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          );
        })
    );
  }
});


self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


const CACHE_NAME = 'zone4reyes-v1.2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  'https://appdesignmex.com/Zone4Reyes.png',
  'https://appdesignmex.com/iconoreyes.png',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/client',
  'https://aistudiocdn.com/react@^19.2.0/jsx-runtime',
  'https://aistudiocdn.com/@google/genai@^1.29.1',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.44.4/+esm'
];

self.addEventListener('install', event => {
  console.log('SW Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching app shell');
        return cache.addAll(URLS_TO_CACHE).catch(err => {
          console.error('SW: Caching failed:', err);
        });
      })
  );
});

self.addEventListener('activate', event => {
  console.log('SW Activate event');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Claiming clients');
      return self.clients.claim();
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('SW: Received SKIP_WAITING message, activating new SW');
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  
  const url = new URL(event.request.url);

  // For Supabase API calls, always go to the network. This prevents caching stale API data.
  // If the network fails, provide a specific offline response.
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'Offline' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 503
        });
      })
    );
    return;
  }

  // Stale-While-Revalidate strategy for all other assets.
  // This serves content from cache immediately for speed, then updates the cache in the background.
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // If the network request is successful, update the cache.
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(err => {
            // The network request failed. If we have a cached response, it was already served.
            // This catch prevents an unhandled promise rejection in the console.
            if (!cachedResponse) {
              console.error('SW: Network request failed and no cache available for:', event.request.url);
            }
        });

        // Return the cached response immediately if it exists, otherwise wait for the network response.
        return cachedResponse || fetchPromise;
      });
    })
  );
});

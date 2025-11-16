
const CACHE_NAME = 'zone4reyes-social-v4'; // Bumping version to trigger update
const urlsToCache = [
  // Only cache static assets. The main HTML page will be fetched from the network.
  'https://appdesignmex.com/Zone4Reyes.png',
  'https://appdesignmex.com/iconoreyes.png'
];

self.addEventListener('install', event => {
  console.log('ServiceWorker: Installing...');
  self.skipWaiting(); // Activate new SW immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Always fetch the main HTML page from the network.
  // This prevents serving a stale app shell that points to old assets.
  if (event.request.mode === 'navigate') {
    return; // Let the browser handle the request.
  }

  // Let the browser handle requests for the main script and Supabase API calls.
  if (
    event.request.url.includes('index.tsx') ||
    event.request.url.includes('supabase.co')
  ) {
    return;
  }

  // For other GET requests (like images), use a cache-first strategy.
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
  console.log('ServiceWorker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('ServiceWorker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all open clients
      return self.clients.claim().then(() => {
        // Notify clients that a new version is available
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage({ type: 'NEW_VERSION_AVAILABLE' }));
        });
      });
    })
  );
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Zone4Reyes Social', body: 'Tienes una nueva notificación.'};
  console.log('Push received:', data);

  const title = data.title || 'Zone4Reyes Social';
  const options = {
    body: data.body || 'Tienes una nueva notificación.',
    icon: 'https://appdesignmex.com/iconoreyes.png',
    badge: 'https://appdesignmex.com/iconoreyes.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data.url || '/', self.location.origin).href;
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      for (let client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

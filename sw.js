const CACHE_NAME = 'syllabus-v1';

// Add core files to cache
const urlsToCache = [
  './index.html',
  './book_index.json',
  './manifest.json',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache first, falling back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response to put in cache and also return to browser
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Only cache json and static files, skip external non-GETs
                if (event.request.method === 'GET' && !event.request.url.startsWith('chrome-extension')) {
                    cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});

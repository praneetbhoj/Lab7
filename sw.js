// sw.js - Service Worker

// You will need 3 event listeners:
//   - One for installation
//   - One for activation ( check out MDN's clients.claim() for this step )
//   - One for fetch requests

const CACHE_NAME = 'journal_entries_cache';
let urlsToCache = [
    '/',
    '/components/entry-page.js',
    '/components/journal-entry.js',
    '/scripts/router.js',
    '/scripts/script.js'
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(response && response.status == 200 && response.type == 'basic') {
              
              // clone response for both browser and cache
              var responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
            }
              
            return response;
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
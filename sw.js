// sw.js - Service Worker

// You will need 3 event listeners:
//   - One for installation
//   - One for activation ( check out MDN's clients.claim() for this step )
//   - One for fetch requests

const CACHE_NAME = 'journal_entries_cache';
let urlsToCache = [
    './',
    './components/entry-page.js',
    './components/journal-entry.js',
    './scripts/router.js',
    './scripts/script.js',
    'https://cse110lab6.herokuapp.com/entries'
];

self.addEventListener('install', function (event) {
  // Perform install steps
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
      })
  );
});

// self.addEventListener('fetch', function(event) {
//   console.log('Handling fetch event for', event.request.url);
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         // Cache hit - return response
//         if (response) {
//           console.log('Found response in cache:', response);
//           return response;
//         }

//         return fetch(event.request).then( function(response) {
//           console.log('Response from network is:', response);
//           // Check if we received a valid response
//            if(response && response.status == 200 && response.type == 'basic') {
            
//             // clone response for both browser and cache
//             let responseToCache = response.clone();

//                 caches.open(CACHE_NAME)
//                   .then(function(cache) {
//                     cache.put(event.request, responseToCache);
//                   });
               
//             });
//           return response;
//         }).catch(function (error) {
//           console.error('Fetching failed:', error);
//           throw error;
//         });
//       })
//   );
// });

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
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            let responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
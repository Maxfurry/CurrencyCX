/**
* Author: Adeniran Mark Oluwafemi
* Version: 1.0.0
* Title: CurrencyCX
* Discription: To convert between currencies globally
**/

// register cache name
let cacheName = 'currnx-v1';
let CacheResources = [
	'https://maxfurry.github.io/CurrencyCX/',
	'https://maxfurry.github.io/CurrencyCX/converter.js',
	'https://maxfurry.github.io/CurrencyCX/index.html',
'https://maxfurry.github.io/CurrencyCX/js/indexed_db.js'
];


self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(contentToCache);
    })
  );
});


self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
          console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
                return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
          return Promise.all(keyList.map(function(key) {
        if(cacheName.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

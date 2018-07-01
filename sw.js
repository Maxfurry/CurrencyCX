/**
* Author: Adeniran Mark Oluwafemi
* Version: 1.0.0
* Title: CurrencyCX
* Discription: To convert between currencies globally
**/

// register cache name
var cacheName = 'currnx-v1';
var CacheResources = [
	'https://maxfurry.github.io/CurrencyCX/index.html',
	'https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css',
	'https://maxfurry.github.io/CurrencyCX/js/converter.js',
	'https://maxfurry.github.io/CurrencyCX/js/indexed_db.js',
	'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js',
	'https://free.currencyconverterapi.com/api/v5/currencies',
	'https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js'
];


self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(CacheResources);
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

/**
* Author: Adeniran Mark Oluwafemi
* Version: 1.0.0
* Title: CurrencyCX
* Discription: To convert between currencies globally
**/

// register cache name
var version = 'v1::';
var CacheResources = [
	'https://maxfurry.github.io/CurrencyCX/',
	'https://maxfurry.github.io/CurrencyCX/converter.js',
	'https://maxfurry.github.io/CurrencyCX/index.html',
	'https://maxfurry.github.io/CurrencyCX/js/indexed_db.js'
];

// Wait before activation until cache
self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open(version + 'fundamentals').then(function(cache){
			return cache.addAll(CacheResources);
		})
	);
});

// processing request offline first
self.addEventListener('fetch', function(event) {
if (event.request.method !='GET') {
	consle.log('ignore fetch', event.request.method, event.request.url);
	return;
}
event.respondWith(
	caches.match(event.request).then(function(cached) {
var networked = fetch(event.request)
.then(fetchedFromNetwork, unableToResolve)
.catch(unableToResolve);
return cached || networked;

function fetchedFromNetwork(response) {
	var cacheCopy = response.clone();
	caches.open(version + 'pages')
	.then(function add(cache) {
		cache.put(event.request, cacheCopy);
	})
	.then(function(){
			console.log('fetch response stored in cache', event.request.url);
	});
	return response;
}

function unableToResolve() {
	console.log('fetch request failed in both cache and network');
	return new Response('<h1> Service Unavailable</h1>', {
		status: 503,
		statusText: 'Service Unavailable',
		headers: new Headers({
		'content-Type': 'text/html'
		})
	});
}
})
);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(caches.keys().then(function(keys) {
			return Promise.all(
				keys.filter(function(key) {
			return !key.startsWith(version);
		})
		.map(function(key) {
			return caches.delete(key);
		})
	);
}).then(function() {
	console.log('service worker is activated completely');
})
);
});

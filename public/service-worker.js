// Minimal service worker for PWA installation requirements
// Bump CACHE_NAME when assets change to force clients to refresh cached icons
const CACHE_NAME = 'uwezo-pwa-v2';
const PRECACHE_URLS = [
	'/',
	'/index.html',
	'/logo.svg',
	'/logo-192.png',
	'/logo-512.png'
];

self.addEventListener('install', (event) => {
	console.log('[sw] install');
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	console.log('[sw] activate');
	event.waitUntil(
		caches.keys().then((keys) => Promise.all(
			keys.map((key) => {
				if (key !== CACHE_NAME) return caches.delete(key);
				return Promise.resolve();
			})
		))
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	// Serve cached resources first, then fallback to network
	event.respondWith(
		caches.match(event.request).then((resp) => resp || fetch(event.request))
	);
});

// Basic message handler
self.addEventListener('message', (event) => {
	console.log('[sw] message', event.data);
});

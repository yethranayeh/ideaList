/** @format */

const staticCacheName = "static-v1.1";
const assets = [
	"/",
	"./index.html",
	"./main.js",
	"./icons/favicon.ico",
	"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
	"https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
];

self.addEventListener("install", (event) => {
	// installing

	// Cache
	const preCache = async () => {
		const cache = await caches.open(staticCacheName);
		return cache.addAll(assets);
	};
	event.waitUntil(preCache());
});

self.addEventListener("activate", (event) => {
	// activating

	event.waitUntil(
		caches.keys().then((keys) => {
			// Cycle through every cache for this app, then delete anything that does not match current cache name
			return Promise.all(
				keys
					.filter((key) => {
						return key !== staticCacheName;
					})
					.map((key) => {
						caches.delete(key);
					})
			);
		})
	);
});

self.addEventListener("fetch", (event) => {
	// fetching -> event.request.url

	event.respondWith(
		caches.match(event.request).then((cacheResponse) => {
			return cacheResponse || fetch(event.request);
		})
	);
});

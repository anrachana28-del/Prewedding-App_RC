const CACHE_NAME = "pink-wedding-app-v1";
const ASSETS = [
  "/",                // main route
  "/index.html",      // main HTML
  "/manifest.json",   // manifest
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/sw.js",
];

// Install service worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching files");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate service worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("Service Worker: Deleting old cache", name);
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // serve from cache
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache new requests
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Offline fallback (optional custom page)
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});

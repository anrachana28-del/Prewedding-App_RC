self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("pinkapp-cache").then(cache => cache.addAll([
      "/", "/index.html", "/manifest.json",
      "/icons/icon-192.png", "/icons/icon-512.png"
    ]))
  );
  console.log("Service Worker Installed ✅");
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

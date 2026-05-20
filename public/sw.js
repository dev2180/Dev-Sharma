self.addEventListener('install', function () {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function (event) {
    if (event.request.destination === 'script' || event.request.destination === 'style') {
        event.respondWith(
            fetch(event.request, { cache: 'no-store' })
        );
    }
});
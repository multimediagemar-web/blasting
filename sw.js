const CACHE_NAME = 'crm-donatur-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 1. Install Service Worker & Simpan Cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. Aktivasi Service Worker & Bersihkan Cache Lama (jika ada update)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 3. Mode Pengambilan Jaringan (Network-First strategy)
self.addEventListener('fetch', event => {
    // Abaikan permintaan ke Google Script agar tidak bentrok dengan sistem Cache
    if (event.request.url.startsWith('https://script.google.com/')) {
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            // Jika tidak ada internet sama sekali, tampilkan dari Cache
            return caches.match(event.request);
        })
    );
});

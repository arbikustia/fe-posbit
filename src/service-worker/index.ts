// @ts-nocheck
import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [
    ...build, // app build files
    ...files  // static files
];

// Daftar route/API yang BOLEH di-cache (whitelist)
const CACHEABLE_PATHS = [
    '/static/',
    '/images/',
    '/fonts/',
    '/icons/',
    '/assets/',
    '/css/',
    '/js/'
];

// Daftar file yang boleh di-cache (static assets)
const CACHEABLE_EXTENSIONS = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.woff',
    '.woff2',
    '.ttf',
    '.ico',
    '.webp',
    '.avif'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE);
            // Hanya cache static assets (TIDAK termasuk offline page)
            for (const asset of ASSETS) {
                try {
                    await cache.add(asset);
                } catch (err) {
                    console.warn('Failed to cache:', asset, err);
                }
            }
        })()
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            for (const key of await caches.keys()) {
                if (key !== CACHE) {
                    await caches.delete(key);
                }
            }
        })()
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    
    // ⚠️ CRITICAL: JANGAN handle navigasi pages - biarkan browser handle redirect
    if (event.request.mode === 'navigate') {
        return; // Biarkan request ke server untuk redirect
    }
    
    // Cache hanya untuk routes tertentu dan static assets
    if (shouldCache(url)) {
        event.respondWith(cacheFirstStrategy(event));
        return;
    }

    // Default: no cache untuk request lainnya
    event.respondWith(fetchWithoutCache(event.request));
});

// Helper functions - Cek apakah URL boleh di-cache
function shouldCache(url) {
    // Cache jika termasuk dalam whitelist paths
    const isCacheablePath = CACHEABLE_PATHS.some(path => url.pathname.startsWith(path));
    
    // Cache jika termasuk dalam cacheable extensions
    const isCacheableExtension = CACHEABLE_EXTENSIONS.some(ext => url.pathname.endsWith(ext));
    
    // Cache jika termasuk dalam ASSETS
    const isBuildAsset = ASSETS.includes(url.pathname);
    
    // JANGAN cache jika ada parameter no-cache
    const hasNoCacheParam = url.search.includes('nocache=true') || url.search.includes('t=');
    
    return (isCacheablePath || isCacheableExtension || isBuildAsset) && !hasNoCacheParam;
}

async function fetchWithoutCache(request) {
    // Langsung fetch dari network tanpa fallback offline
    return fetch(request);
}

async function cacheFirstStrategy(event) {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(event.request);
    
    if (cached) {
        // Return cached version, tapi tetap update cache di background
        event.waitUntil(
            (async () => {
                try {
                    const response = await fetch(event.request);
                    if (response.ok) {
                        await cache.put(event.request, response);
                    }
                } catch (error) {
                    // Ignore error, gunakan cached version
                }
            })()
        );
        return cached;
    }
    
    // Jika tidak ada di cache, fetch dari network
    try {
        const response = await fetch(event.request);
        if (response.ok) {
            await cache.put(event.request, response.clone());
        }
        return response;
    } catch (error) {
        return new Response('Network error', { status: 408 });
    }
}

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// self.addEventListener('push', (event) => {
//     event.waitUntil(showNotification(event));
// });

// async function showNotification(event) {
//     const data = event.data?.json();
    
//     await self.registration.showNotification(data.title, {
//         body: data.body,
//         icon: "/images/Opsigo-icon-square-dense.png",
//         data: { url: data.url || "/" }
//     });
// }

// self.addEventListener("notificationclick", (event) => {
//     event.notification.close();
//     event.waitUntil(
//         clients.openWindow(event.notification.data.url)
//     );
// });
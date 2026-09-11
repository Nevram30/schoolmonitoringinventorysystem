// SPMS service worker: makes the app installable and shows an offline page when there is no
// connection. Only build assets that never change (and the app icons) are cached — pages, API
// and tRPC requests always go to the network, so nobody sees stale inventory or another
// person's session.
const VERSION = 'spms-v1'
const OFFLINE_URL = '/offline.html'
const PRECACHE = [OFFLINE_URL, '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Pages: always the live version; the offline page only when the network is unreachable.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)))
    return
  }

  // Hashed build output and icons never change under the same URL, so cache-first is safe.
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone()
              caches.open(VERSION).then((cache) => cache.put(request, copy))
            }
            return response
          })
      )
    )
  }
})

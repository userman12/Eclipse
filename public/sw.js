/**
 * Minimal offline-first service worker.
 *
 * The app is entirely static and local, so the goal is simple: once visited,
 * it must keep working on a cliff in O Portiño with no signal.
 *
 * Strategy:
 *  - navigations: network first, fall back to the cached shell
 *  - everything else (same-origin): cache first, refresh in the background
 *
 * Every URL below is built from `self.registration.scope` rather than
 * hardcoded as `/…`, so this file works unmodified whether it is served from
 * the site root (local dev) or a GitHub Pages project subpath (/Eclipse/).
 */

const CACHE = 'cen-v1';
const SCOPE = self.registration.scope;
const at = (path) => new URL(path, SCOPE).href;
const SHELL_URL = at('.');
const SHELL = [
  SHELL_URL,
  at('manifest.webmanifest'),
  at('icons/icon-192.png'),
  at('icons/icon-512.png'),
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(SHELL_URL, copy));
          return response;
        })
        .catch(() => caches.match(SHELL_URL).then((cached) => cached || caches.match(request))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});

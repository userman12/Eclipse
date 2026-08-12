'use client';

import { useEffect } from 'react';

/**
 * Registers the offline service worker. Registration is skipped in dev so the
 * cache never serves stale bundles while working on the app.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const register = () => {
      // Relative path: registers with a scope matching wherever the app is
      // hosted, root or a GitHub Pages subpath, without hardcoding either.
      navigator.serviceWorker.register('sw.js').catch(() => {
        /* offline support is a bonus; never break the page over it */
      });
    };

    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);

  return null;
}

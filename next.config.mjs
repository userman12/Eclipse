/**
 * `output: 'export'` produces a fully static build (an `out/` folder of plain
 * HTML/CSS/JS) that GitHub Pages can serve directly. It is only enabled when
 * GITHUB_PAGES=true (set by the deploy workflow), so a normal `next dev` /
 * `next start` still runs as a regular Next.js server locally, with the
 * custom headers() below intact — static hosts like GitHub Pages cannot set
 * custom response headers anyway, and `headers()` is not allowed at all when
 * `output: 'export'` is set (Next.js fails the build if it is present).
 */
const isGhPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isGhPages
    ? {
        output: 'export',
        // Project page served at https://<user>.github.io/Eclipse/
        basePath: '/Eclipse',
        assetPrefix: '/Eclipse/',
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        headers: async () => [
          {
            // The service worker must be able to control the whole origin.
            source: '/sw.js',
            headers: [
              { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
              { key: 'Service-Worker-Allowed', value: '/' },
            ],
          },
        ],
      }),
};

export default nextConfig;

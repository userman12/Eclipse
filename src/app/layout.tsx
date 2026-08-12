import type { Metadata, Viewport } from 'next';
import { Fraunces, Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { CityProvider } from '@/lib/CityProvider';
import { LanguageProvider } from '@/lib/LanguageProvider';
import { Toaster } from '@/components/ui/sonner';
import AuroraBackground from '@/components/AuroraBackground';
import ServiceWorkerRegistrar from './ServiceWorkerRegistrar';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '600'],
  display: 'swap',
});

// The app lives at one fixed, known URL — no per-environment base to derive.
// Used to build an absolute og:image URL: that field specifically requires a
// fully-qualified URL for external crawlers (Twitter, Facebook, Slack,
// iMessage, WhatsApp...) to be able to fetch it, unlike the relative
// `icons` paths below, which are deliberately left relative so favicons
// keep resolving correctly both in local dev and under the GitHub Pages
// project subpath.
const SITE_URL = 'https://userman12.github.io/Eclipse/';

const DESCRIPTION =
  'Live guide to the 12 August 2026 solar eclipse across 16 verified cities: where to go, where to look, how much time is left, and when it’s safe to remove your glasses.';

export const metadata: Metadata = {
  title: 'Eclipse',
  description: DESCRIPTION,
  applicationName: 'Eclipse',
  // Relative on purpose: the app has a single route, so these resolve
  // correctly both at the site root (local dev) and under a GitHub Pages
  // project subpath (/Eclipse/) without needing basePath-aware plumbing.
  manifest: 'manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Eclipse',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false, date: false, address: false },
  icons: {
    icon: [
      { url: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: 'icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    title: 'Eclipse',
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Eclipse',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}og-image.png`,
        width: 1200,
        height: 630,
        alt: 'A total solar eclipse — a black disk ringed by a golden corona above a dark sea horizon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eclipse',
    description: DESCRIPTION,
    images: [`${SITE_URL}og-image.png`],
  },
};

export const viewport: Viewport = {
  themeColor: '#071B2B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(geist.variable, fraunces.variable, 'dark')}>
      <body>
        <AuroraBackground />
        <LanguageProvider>
          <CityProvider>
            {children}
            <Toaster position="top-center" />
            <ServiceWorkerRegistrar />
          </CityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

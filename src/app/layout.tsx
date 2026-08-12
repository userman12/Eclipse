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

export const metadata: Metadata = {
  title: 'Coruña Eclipse Navigator',
  description:
    'A live guide to the 12 August 2026 solar eclipse across 16 verified cities, from totality in A Coruña and Reykjavík to the deep partial phases in London, Paris and Rome: where to go, where to look, how much time is left, and when it’s safe to remove your glasses.',
  applicationName: 'Coruña Eclipse Navigator',
  // Relative on purpose: the app has a single route, so these resolve
  // correctly both at the site root (local dev) and under a GitHub Pages
  // project subpath (/Eclipse/) without needing basePath-aware plumbing.
  manifest: 'manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Eclipse Navigator',
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
    <html lang="it" className={cn(geist.variable, fraunces.variable, 'dark')}>
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

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import ChatAssistant from '@/components/ChatAssistant';
import VoiceAssistant from '@/components/VoiceAssistant';
import ResponsiveTest from '@/components/ResponsiveTest';
import { ToastProvider } from '@/components/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import SkipToContent from '@/components/SkipToContent';
import WebVitals from '@/components/WebVitals';
import { generateLocalBusinessSchema } from '@/lib/seo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Improve font loading for CLS
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ace-electric-parts-system.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ace Electric Motor & Pump | Industrial Power Solutions | Stockton CA',
    template: '%s | Ace Electric',
  },
  description:
    'Premium electric motors, pumps, and gearboxes in Stockton, California. Expert repair services with 24/7 emergency support. Serving Central & Northern California since 1952.',
  keywords: [
    'electric motor repair Stockton',
    'pump repair Stockton California',
    'industrial motor repair',
    'motor rewinding service',
    '24/7 emergency motor repair',
    'electric motors for sale',
    'industrial pumps',
    'gearboxes',
    'VFD drives',
    'vibration analysis',
    'laser shaft alignment',
    'Stockton CA',
  ],
  authors: [{ name: 'Ace Electric Motor & Pump Company' }],
  creator: 'Ace Electric Motor & Pump Company',
  publisher: 'Ace Electric Motor & Pump Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Ace Electric Motor & Pump Company',
    title: 'Ace Electric Motor & Pump | Industrial Power Solutions',
    description:
      'Premium electric motors, pumps, and gearboxes. Expert repair services with 24/7 emergency support in Stockton, California.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Ace Electric Motor & Pump Company - Industrial Power Solutions',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ace Electric Motor & Pump | Industrial Power Solutions',
    description:
      'Premium electric motors, pumps, and gearboxes. Expert repair services with 24/7 emergency support.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: 'your-google-verification-code',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const organizationSchema = generateLocalBusinessSchema();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Structured Data - LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for external services */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <ToastProvider>
            <SkipToContent />
            <Navigation />
            <main id="main-content">{children}</main>
            <ChatAssistant />
            <VoiceAssistant />
            <WebVitals />
            {process.env.NODE_ENV === 'development' && <ResponsiveTest />}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

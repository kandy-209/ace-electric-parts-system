import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import ChatAssistant from '@/components/ChatAssistant';
import VoiceAssistant from '@/components/VoiceAssistant';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aceelectricparts.com'),
  title: {
    default: 'Ace Electric Motor & Pump | Industrial Power Solutions',
    template: '%s | Ace Electric',
  },
  description:
    'Premium electric motors, pumps, and gearboxes. Expert repair services with 24/7 emergency support in Stockton, California.',
  keywords: [
    'electric motors',
    'industrial pumps',
    'gearboxes',
    'motor repair',
    'pump repair',
    'Stockton CA',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Ace Electric Motor & Pump',
    title: 'Ace Electric Motor & Pump',
    description: 'Industrial power solutions. Motors, pumps, gearboxes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ace Electric Motor & Pump',
    description: 'Industrial power solutions.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Ace Electric Motor and Pump Company',
  telephone: '+1-209-555-1234',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Industrial Way',
    addressLocality: 'Stockton',
    addressRegion: 'CA',
    postalCode: '95205',
    addressCountry: 'US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="antialiased">
        <Navigation />
        <main>{children}</main>
        <ChatAssistant />
        <VoiceAssistant />
      </body>
    </html>
  );
}

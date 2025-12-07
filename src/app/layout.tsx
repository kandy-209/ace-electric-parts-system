import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import ChatAssistant from '@/components/ChatAssistant';
import VoiceAssistant from '@/components/VoiceAssistant';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aceelectricparts.com'),
  title: {
    default: 'Ace Electric Motor & Pump Company | Industrial Parts & Repair',
    template: '%s | Ace Electric Motor',
  },
  description:
    'Leading supplier of electric motors, pumps, and gearboxes in Stockton, CA. Fast quotes, expert repair services, and 24/7 emergency support for industrial equipment.',
  keywords: [
    'electric motors',
    'industrial pumps',
    'gearboxes',
    'motor repair',
    'pump repair',
    'Stockton CA',
    'industrial equipment',
    'NEMA motors',
    'centrifugal pumps',
    'VFD drives',
  ],
  authors: [{ name: 'Ace Electric Motor and Pump Company' }],
  creator: 'Ace Electric Motor and Pump Company',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Ace Electric Motor & Pump Company',
    title: 'Ace Electric Motor & Pump Company',
    description:
      'Industrial motors, pumps, gearboxes - Sales, repair, and 24/7 emergency service in Stockton, CA',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ace Electric Motor and Pump Company',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ace Electric Motor & Pump Company',
    description: 'Industrial motors, pumps, gearboxes - Sales & repair in Stockton, CA',
    images: ['/og-image.jpg'],
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
    // TODO: Add verification codes
    // google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
};

// JSON-LD Organization Schema
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Ace Electric Motor and Pump Company',
  image: '/logo.png',
  '@id': 'https://aceelectricparts.com',
  url: 'https://aceelectricparts.com',
  telephone: '+1-209-555-1234',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Industrial Way',
    addressLocality: 'Stockton',
    addressRegion: 'CA',
    postalCode: '95205',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 37.9577,
    longitude: -121.2908,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '17:00',
    },
  ],
  sameAs: [
    'https://www.facebook.com/aceelectricmotor',
    'https://www.linkedin.com/company/aceelectricmotor',
  ],
  priceRange: '$$',
  servedCuisine: 'Industrial Equipment',
  areaServed: {
    '@type': 'State',
    name: 'California',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-sans antialiased bg-slate-900 text-white">
        <Navigation />
        <main>{children}</main>
        <ChatAssistant />
        <VoiceAssistant />
      </body>
    </html>
  );
}

/**
 * Comprehensive SEO utilities for Ace Electric
 * Optimized for Google rankings, Core Web Vitals, and Lighthouse scores
 */

import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ace-electric-parts-system.vercel.app';
const siteName = 'Ace Electric Motor & Pump Company';

/**
 * Comprehensive keywords for industrial electric motor and pump services
 */
export const seoKeywords = [
  // Primary Services
  'electric motor repair Stockton',
  'pump repair Stockton California',
  'industrial motor repair',
  'motor rewinding service',
  'pump rebuild service',
  '24/7 emergency motor repair',
  
  // Products
  'electric motors for sale',
  'industrial pumps',
  'gearboxes',
  'VFD drives',
  'soft starters',
  'motor controls',
  
  // Locations
  'motor repair Stockton CA',
  'pump repair Sacramento',
  'electric motor Modesto',
  'industrial repair Central California',
  'motor service Northern California',
  
  // Specific Services
  'vibration analysis',
  'laser shaft alignment',
  'dynamic balancing',
  'thermography service',
  'predictive maintenance',
  'field service electric motors',
  'on-site motor repair',
  
  // Industry Terms
  'NEMA motors',
  'explosion proof motors',
  'hoist motors',
  'T-frame motors',
  'API pump standards',
  
  // Equipment Types
  'centrifugal pump repair',
  'submersible pump repair',
  'positive displacement pumps',
  'AC motor repair',
  'DC motor repair',
  'servo motor repair',
  
  // Industries Served
  'manufacturing motor repair',
  'agricultural pump repair',
  'water treatment pumps',
  'chemical processing motors',
];

/**
 * Generate comprehensive page metadata with SEO optimizations
 */
export function generatePageMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
  noindex = false,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article' | 'product';
}): Metadata {
  const fullTitle = `${title} | ${siteName}`;
  const url = `${siteUrl}${path}`;
  const ogImage = image || `${siteUrl}/og-image.jpg`;
  const allKeywords = [...seoKeywords, ...keywords];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: 'Ace Electric Motor & Pump Company' }],
    creator: siteName,
    publisher: siteName,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: 'en_US',
      url,
      siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
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
      // yandex: 'your-yandex-verification-code',
      // bing: 'your-bing-verification-code',
    },
  };
}

/**
 * Generate LocalBusiness structured data
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}#organization`,
    name: siteName,
    image: `${siteUrl}/logo.jpg`,
    telephone: '+1-209-464-6428',
    priceRange: '$$',
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
      latitude: '37.9577',
      longitude: '-121.2908',
    },
    url: siteUrl,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '17:00',
      },
    ],
    // Emergency service available 24/7
    areaServed: [
      'Stockton',
      'Sacramento',
      'Modesto',
      'Fresno',
      'San Francisco',
      'Oakland',
      'Central California',
      'Northern California',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Industrial Motors and Pumps',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Electric Motor Repair',
            description: 'Complete motor repair including rewinding, bearing replacement, and balancing',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pump Repair',
            description: 'Industrial and commercial pump repair services',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '24/7 Emergency Service',
            description: 'Round-the-clock emergency repair services',
          },
        },
      ],
    },
  };
}

/**
 * Generate Service structured data
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  provider: string;
  areaServed?: string[];
  serviceType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: service.provider,
      telephone: '+1-209-464-6428',
    },
    areaServed: service.areaServed || [
      'Stockton',
      'Sacramento',
      'Modesto',
      'Central California',
      'Northern California',
    ],
    serviceType: service.serviceType || 'Motor and Pump Repair',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: siteUrl,
      servicePhone: '+1-209-464-6428',
    },
  };
}

/**
 * Generate Product structured data
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  image?: string;
  brand?: string;
  sku?: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || `${siteUrl}/images/products/${product.sku}.jpg`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Ace Electric',
    },
    sku: product.sku,
    category: product.category || 'Industrial Equipment',
    offers: {
      '@type': 'AggregateOffer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      url: `${siteUrl}/parts/${product.sku}`,
    },
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Article structured data (for blog posts)
 */
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image || `${siteUrl}/og-image.jpg`,
    author: {
      '@type': 'Organization',
      name: article.author || siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.jpg`,
      },
    },
    datePublished: article.datePublished || new Date().toISOString(),
    dateModified: article.dateModified || new Date().toISOString(),
  };
}


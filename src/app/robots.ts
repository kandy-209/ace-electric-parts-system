import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ace-electric-parts-system.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/test/',
          '/.vercel/',
          '/node_modules/',
          // Allow common API endpoints that should be indexed
        ],
      },
      // Specific rules for search engine bots
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/private/', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/private/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

import { MetadataRoute } from 'next';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ace-electric-parts-system.vercel.app';

  // Static pages with optimized priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/parts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rfq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic part pages from database
  let partPages: MetadataRoute.Sitemap = [];
  
  try {
    const supabase = createSupabaseAdmin();
    const { data: parts, error } = await supabase
      .from('parts')
      .select('part_id, part_number, updated_at')
      .limit(1000); // Limit to prevent sitemap from being too large

    if (!error && parts) {
      partPages = parts.map((part) => ({
        url: `${baseUrl}/parts/${part.part_id}`,
        lastModified: part.updated_at ? new Date(part.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching parts for sitemap:', error);
    // Fallback to empty array if database query fails
  }

  // Category pages for SEO
  const categoryPages: MetadataRoute.Sitemap = [
    { category: 'motors', priority: 0.85 },
    { category: 'pumps', priority: 0.85 },
    { category: 'gearboxes', priority: 0.85 },
    { category: 'controls', priority: 0.85 },
    { category: 'bearings', priority: 0.8 },
    { category: 'vfds', priority: 0.8 },
  ].map(({ category, priority }) => ({
    url: `${baseUrl}/parts?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority,
  }));

  return [...staticPages, ...categoryPages, ...partPages];
}

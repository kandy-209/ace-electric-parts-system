import { Metadata } from 'next';
import Link from 'next/link';

// Generate SEO metadata for each part
export async function generateMetadata({ params }: { params: Promise<{ partId: string }> }): Promise<Metadata> {
  const { partId } = await params;
  // TODO: Fetch part from database
  return {
    title: `${partId.toUpperCase()} - Industrial Parts | Ace Electric Motor`,
    description: `View specifications, pricing, and availability for ${partId}. Request a quote from Ace Electric Motor and Pump Company in Stockton, CA.`,
    openGraph: {
      title: `${partId.toUpperCase()} | Ace Electric Motor`,
      description: `Industrial part specifications and pricing`,
      type: 'website',
    },
  };
}

// Static params for popular parts (for SEO pre-rendering)
export async function generateStaticParams() {
  // TODO: Fetch popular parts from database
  return [
    { partId: 'mtr-001' },
    { partId: 'pmp-001' },
    { partId: 'gbx-001' },
  ];
}

export default async function PartDetailPage({ params }: { params: Promise<{ partId: string }> }) {
  const { partId } = await params;
  
  // Demo part data - will be fetched from database
  const part = {
    id: partId,
    name: 'NEMA 215T Electric Motor',
    manufacturer: 'US Motors',
    category: 'Electric Motors',
    description: 'Premium efficiency three-phase induction motor designed for industrial applications. Features include cast iron frame, sealed bearings, and Class F insulation.',
    specs: [
      { label: 'Horsepower', value: '10 HP' },
      { label: 'Voltage', value: '230/460V' },
      { label: 'Phase', value: '3 Phase' },
      { label: 'Speed', value: '1800 RPM' },
      { label: 'Frame', value: 'NEMA 215T' },
      { label: 'Enclosure', value: 'TEFC' },
      { label: 'Efficiency', value: '91.7%' },
      { label: 'Service Factor', value: '1.15' },
    ],
    dimensions: [
      { label: 'Shaft Height (D)', value: '5.25"' },
      { label: 'Mounting Width (E)', value: '4.25"' },
      { label: 'Hole Spacing (2F)', value: '7.00"' },
      { label: 'Shaft Diameter (U)', value: '1.375"' },
    ],
    availability: 'In Stock',
    leadTime: '1-2 business days',
  };

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: part.name,
    description: part.description,
    brand: {
      '@type': 'Brand',
      name: part.manufacturer,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Ace Electric Motor and Pump Company',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Stockton',
          addressRegion: 'CA',
        },
      },
    },
  };

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <ol className="flex items-center space-x-2 text-sm text-slate-400">
            <li><Link href="/" className="hover:text-amber-400">Home</Link></li>
            <li>/</li>
            <li><Link href="/parts" className="hover:text-amber-400">Parts</Link></li>
            <li>/</li>
            <li className="text-white">{part.id.toUpperCase()}</li>
          </ol>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-white/5 rounded-3xl border border-white/10 aspect-square flex items-center justify-center">
              <span className="text-9xl opacity-30">⚙️</span>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full">
                  {part.category}
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                  {part.availability}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {part.name}
              </h1>
              <p className="text-slate-400 mb-6">
                By {part.manufacturer} • Part #{part.id.toUpperCase()}
              </p>

              <p className="text-slate-300 mb-8">
                {part.description}
              </p>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {part.specs.slice(0, 4).map((spec) => (
                  <div key={spec.label} className="bg-white/5 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">{spec.label}</p>
                    <p className="text-white font-semibold">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  href={`/rfq?part=${part.id}`}
                  className="flex-1 sm:flex-none px-8 py-4 bg-amber-500 text-slate-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors text-center"
                >
                  Request Quote
                </Link>
                <button className="flex-1 sm:flex-none px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors">
                  Add to Inquiry
                </button>
              </div>

              <p className="text-slate-400 text-sm">
                📦 Lead Time: {part.leadTime}
              </p>
            </div>
          </div>

          {/* Full Specifications */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Full Specifications</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">Electrical</h3>
                <dl className="space-y-3">
                  {part.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between">
                      <dt className="text-slate-400">{spec.label}</dt>
                      <dd className="text-white font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">Dimensions</h3>
                <dl className="space-y-3">
                  {part.dimensions.map((dim) => (
                    <div key={dim.label} className="flex justify-between">
                      <dt className="text-slate-400">{dim.label}</dt>
                      <dd className="text-white font-medium">{dim.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}


import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ partId: string }> }): Promise<Metadata> {
  const { partId } = await params;
  return {
    title: `${partId.toUpperCase()} - Parts`,
    description: `Specifications and pricing for ${partId}. Request a quote from Ace Electric Motor.`,
  };
}

export async function generateStaticParams() {
  return [
    { partId: 'mtr-215t-10hp' },
    { partId: 'mtr-324t-25hp' },
    { partId: 'pmp-cent-2x3' },
  ];
}

export default async function PartDetailPage({ params }: { params: Promise<{ partId: string }> }) {
  const { partId } = await params;
  
  const part = {
    id: partId,
    name: 'NEMA 215T Electric Motor',
    manufacturer: 'US Motors',
    category: 'Electric Motors',
    description: 'Premium efficiency three-phase induction motor for industrial applications.',
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: part.name,
    description: part.description,
    brand: { '@type': 'Brand', name: part.manufacturer },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-black pt-16">
        {/* Breadcrumb */}
        <nav className="max-w-6xl mx-auto px-6 py-4">
          <ol className="flex items-center gap-2 text-sm text-neutral-500">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/parts" className="hover:text-white transition-colors">Parts</Link></li>
            <li>/</li>
            <li className="text-white">{part.id.toUpperCase()}</li>
          </ol>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="card-vercel aspect-square flex items-center justify-center">
              <span className="text-9xl opacity-10">⚡</span>
            </div>

            {/* Info */}
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge">
                  {part.category}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400">
                  {part.availability}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {part.name}
              </h1>
              <p className="text-neutral-500 mb-6">
                By {part.manufacturer} • {part.id.toUpperCase()}
              </p>

              <p className="text-neutral-400 mb-8 leading-relaxed">
                {part.description}
              </p>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {part.specs.slice(0, 4).map((spec) => (
                  <div key={spec.label} className="card-vercel p-4">
                    <p className="text-xs text-neutral-500 mb-1">{spec.label}</p>
                    <p className="text-white font-medium">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  href={`/rfq?part=${part.id}`}
                  className="btn-primary flex-1 py-4 text-center"
                >
                  Request Quote
                </Link>
                <button className="btn-secondary flex-1 py-4">
                  Add to Inquiry
                </button>
              </div>

              <p className="text-sm text-neutral-500">
                📦 Lead Time: {part.leadTime}
              </p>
            </div>
          </div>

          {/* Full Specs */}
          <section className="mt-16 pt-16 border-t border-white/5">
            <h2 className="text-2xl font-bold text-white mb-8">Specifications</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-vercel p-6">
                <h3 className="text-sm font-semibold text-amber-400 mb-4 uppercase tracking-wider">Electrical</h3>
                <dl className="space-y-3">
                  {part.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between text-sm">
                      <dt className="text-neutral-500">{spec.label}</dt>
                      <dd className="text-white font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="card-vercel p-6">
                <h3 className="text-sm font-semibold text-amber-400 mb-4 uppercase tracking-wider">Dimensions</h3>
                <dl className="space-y-3">
                  {part.dimensions.map((dim) => (
                    <div key={dim.label} className="flex justify-between text-sm">
                      <dt className="text-neutral-500">{dim.label}</dt>
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

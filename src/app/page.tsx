import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Serving California Since 1985
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight">
              Industrial Power
              <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
              Electric motors, pumps, gearboxes, and expert repair services. 
              Fast quotes, quality parts, and 24/7 emergency support.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/parts"
                className="px-8 py-4 bg-amber-500 text-slate-900 font-semibold rounded-xl hover:bg-amber-400 transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
              >
                Browse Parts Catalog
              </Link>
              <Link
                href="/rfq"
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What We Offer
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Complete solutions for your industrial equipment needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Electric Motors',
                description: 'NEMA standard and custom motors from 1/4 HP to 5000+ HP. All enclosure types.',
                link: '/parts?category=motors',
              },
              {
                icon: '💧',
                title: 'Pumps',
                description: 'Centrifugal, positive displacement, submersible. Complete pump systems.',
                link: '/parts?category=pumps',
              },
              {
                icon: '⚙️',
                title: 'Gearboxes',
                description: 'Helical, worm, planetary gear reducers. All ratios and mounting styles.',
                link: '/parts?category=gearboxes',
              },
              {
                icon: '🔧',
                title: 'Repair Services',
                description: 'Expert motor rewinding, pump repair, and predictive maintenance services.',
                link: '/services',
              },
              {
                icon: '🎛️',
                title: 'Controls & Drives',
                description: 'VFDs, soft starters, motor controls. Programming and commissioning.',
                link: '/parts?category=controls',
              },
              {
                icon: '🚨',
                title: '24/7 Emergency',
                description: 'Round-the-clock support for critical equipment failures.',
                link: '/contact',
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.link}
                className="group p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/5"
              >
                <span className="text-4xl mb-4 block">{service.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-400">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-y border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '40+', label: 'Years Experience' },
              { value: '50K+', label: 'Parts in Stock' },
              { value: '24/7', label: 'Emergency Support' },
              { value: '98%', label: 'Customer Satisfaction' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-amber-400 mb-2">{stat.value}</p>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Need Parts Fast?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Our AI-powered system can help you find the right part in seconds.
            Or talk to our experts for custom solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+12095551234"
              className="px-8 py-4 bg-amber-500 text-slate-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call (209) 555-1234
            </a>
            <Link
              href="/rfq"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              Submit RFQ Online
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-slate-900">A</span>
                </div>
                <div>
                  <p className="font-bold text-white">Ace Electric</p>
                  <p className="text-xs text-slate-400">Motor & Pump Co.</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Serving California's industrial equipment needs since 1985.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/parts?category=motors" className="hover:text-amber-400">Electric Motors</Link></li>
                <li><Link href="/parts?category=pumps" className="hover:text-amber-400">Pumps</Link></li>
                <li><Link href="/parts?category=gearboxes" className="hover:text-amber-400">Gearboxes</Link></li>
                <li><Link href="/parts?category=controls" className="hover:text-amber-400">Controls & Drives</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/services" className="hover:text-amber-400">Motor Repair</Link></li>
                <li><Link href="/services" className="hover:text-amber-400">Pump Repair</Link></li>
                <li><Link href="/services" className="hover:text-amber-400">Field Service</Link></li>
                <li><Link href="/services" className="hover:text-amber-400">Predictive Maintenance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>123 Industrial Way</li>
                <li>Stockton, CA 95205</li>
                <li><a href="tel:+12095551234" className="hover:text-amber-400">(209) 555-1234</a></li>
                <li><a href="mailto:sales@aceelectricmotor.com" className="hover:text-amber-400">sales@aceelectricmotor.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Ace Electric Motor and Pump Company. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

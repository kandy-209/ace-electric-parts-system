import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-400 animate-fade-in">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Serving California Since 1985
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text">Industrial</span>
            <br />
            <span className="gradient-text-amber">Power Solutions</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Premium electric motors, pumps, and gearboxes.
            <br className="hidden sm:block" />
            Expert repair services with 24/7 emergency support.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/parts"
              className="btn-primary text-base px-8 py-4 flex items-center gap-2"
            >
              Browse Catalog
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/rfq"
              className="btn-secondary text-base px-8 py-4"
            >
              Request Quote
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-950" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-amber-500 font-medium mb-4">What We Offer</p>
            <h2 className="text-3xl sm:text-5xl font-bold gradient-text">
              Complete Industrial Solutions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {[
              {
                icon: '⚡',
                title: 'Electric Motors',
                description: 'NEMA standard and custom motors. All enclosure types, 1/4 HP to 5000+ HP.',
                href: '/parts?category=motors',
              },
              {
                icon: '💧',
                title: 'Pumps',
                description: 'Centrifugal, positive displacement, submersible. Complete pump systems.',
                href: '/parts?category=pumps',
              },
              {
                icon: '⚙️',
                title: 'Gearboxes',
                description: 'Helical, worm, planetary. All ratios and mounting configurations.',
                href: '/parts?category=gearboxes',
              },
              {
                icon: '🔧',
                title: 'Repair Services',
                description: 'Expert motor rewinding, pump rebuild, and predictive maintenance.',
                href: '/services',
              },
              {
                icon: '🎛️',
                title: 'Controls & Drives',
                description: 'VFDs, soft starters, motor controls. Full programming services.',
                href: '/parts?category=controls',
              },
              {
                icon: '🚨',
                title: '24/7 Emergency',
                description: 'Round-the-clock support for critical equipment failures.',
                href: '/contact',
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group card-vercel p-6 glow-amber-hover"
              >
                <span className="text-3xl mb-4 block">{service.icon}</span>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-4 text-amber-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-orange-500/5" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '40+', label: 'Years Experience' },
              { value: '50K+', label: 'Parts in Stock' },
              { value: '24/7', label: 'Emergency Support' },
              { value: '98%', label: 'Customer Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-amber-400 mb-2">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold gradient-text mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-neutral-400 mb-10">
            Our AI-powered system finds the right part in seconds.
            <br />Or talk to our experts for custom solutions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+12095551234"
              className="btn-primary text-base px-8 py-4 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (209) 555-1234
            </a>
            <Link
              href="/rfq"
              className="btn-secondary text-base px-8 py-4"
            >
              Submit RFQ Online
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-black">A</span>
                </div>
                <span className="font-semibold text-white">Ace Electric</span>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Industrial power solutions since 1985.
                Stockton, California.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Products</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><Link href="/parts?category=motors" className="hover:text-white transition-colors">Electric Motors</Link></li>
                <li><Link href="/parts?category=pumps" className="hover:text-white transition-colors">Pumps</Link></li>
                <li><Link href="/parts?category=gearboxes" className="hover:text-white transition-colors">Gearboxes</Link></li>
                <li><Link href="/parts?category=controls" className="hover:text-white transition-colors">Controls</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Services</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><Link href="/services" className="hover:text-white transition-colors">Motor Repair</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Pump Repair</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Field Service</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Maintenance</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li>123 Industrial Way</li>
                <li>Stockton, CA 95205</li>
                <li><a href="tel:+12095551234" className="hover:text-white transition-colors">(209) 555-1234</a></li>
                <li><a href="mailto:sales@aceelectricmotor.com" className="hover:text-white transition-colors">sales@aceelectricmotor.com</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-neutral-600">
              © {new Date().getFullYear()} Ace Electric Motor and Pump Company
            </p>
            <div className="flex items-center gap-6 text-xs text-neutral-600">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

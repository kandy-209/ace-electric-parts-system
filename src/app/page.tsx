import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import ParticleBackground from '@/components/ParticleBackground';
import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Industrial Power Solutions | Electric Motors, Pumps & Gearboxes',
  description:
    'Premium electric motors, pumps, and gearboxes in Stockton, California. Expert repair services with 24/7 emergency support. Serving Central & Northern California since 1952. NEMA motors, VFDs, soft starters, and complete industrial solutions.',
  path: '/',
  keywords: [
    'electric motors Stockton',
    'pump repair California',
    'motor repair 24/7',
    'industrial equipment',
    'gearbox repair',
  ],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
]);

export default function HomePage() {
  return (
    <>
      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="min-h-screen bg-black relative overflow-hidden">
        <ParticleBackground />
        
        {/* Hero Section - Improved Responsive */}
        <section className="relative min-h-[calc(100vh-4rem)] sm:min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-0">
          {/* Background Effects - Reduced on mobile */}
          <div className="absolute inset-0 bg-grid opacity-20 sm:opacity-30" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-amber-500/10 rounded-full blur-[64px] sm:blur-[100px] lg:blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] bg-orange-500/5 rounded-full blur-[50px] sm:blur-[80px] lg:blur-[100px]" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
            {/* Badge */}
            <ScrollReveal delay={0}>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-neutral-400 hover:bg-white/10 transition-all backdrop-blur-sm">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse" />
                Serving California Since 1952
              </div>
            </ScrollReveal>

            {/* Main Headline - Better Mobile Typography */}
            <ScrollReveal delay={100}>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6 px-2">
                <span className="gradient-text inline-block hover:scale-105 transition-transform">Industrial</span>
                <br className="sm:hidden" />
                <span className="block sm:inline"> </span>
                <span className="gradient-text-amber inline-block hover:scale-105 transition-transform mt-1 sm:mt-0">Power Solutions</span>
              </h1>
            </ScrollReveal>

            {/* Subtitle - Better Mobile Spacing */}
            <ScrollReveal delay={200}>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-400 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 leading-relaxed px-2">
                Premium electric motors, pumps, and gearboxes.
                <br className="hidden sm:block" />
                Expert repair services with 24/7 emergency support.
              </p>
            </ScrollReveal>

            {/* CTA Buttons - Improved Mobile */}
            <ScrollReveal delay={300}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0 max-w-md sm:max-w-none mx-auto">
                <Link
                  href="/parts"
                  className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Browse Catalog
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/rfq"
                  className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center"
                >
                  Request Quote
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Scroll Indicator - Hidden on mobile */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block" aria-hidden="true">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Services Section - Improved Grid */}
        <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
          <div className="absolute inset-0 bg-grid opacity-15 sm:opacity-20" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                <p className="text-amber-500 font-medium mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm uppercase tracking-wider">What We Offer</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text px-2">
                  Complete Industrial Solutions
                </h2>
              </div>
            </ScrollReveal>

            {/* Improved Grid - Better Mobile Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
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
                  href: 'tel:+12094646428',
                },
              ].map((service, index) => (
                <ScrollReveal key={service.title} delay={index * 50}>
                  <Link
                    href={service.href}
                    className="group card-vercel p-5 sm:p-6 glow-amber-hover hover-gradient-border block h-full"
                    aria-label={`Learn more about ${service.title}`}
                  >
                    <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 block transform group-hover:scale-110 transition-transform" aria-hidden="true">{service.icon}</span>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 group-hover:text-amber-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-3 sm:mb-4">
                      {service.description}
                    </p>
                    <div className="text-amber-500 text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 transform group-hover:translate-x-1">
                      Learn more
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Better Mobile */}
        <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden border-y border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-orange-500/5" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[
                { value: '70+', label: 'Years Experience' },
                { value: '50K+', label: 'Parts in Stock' },
                { value: '24/7', label: 'Emergency Support' },
                { value: '98%', label: 'Customer Satisfaction' },
              ].map((stat, index) => (
                <ScrollReveal key={stat.label} delay={index * 100}>
                  <div className="text-center group">
                    <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-1 sm:mb-2 transform group-hover:scale-110 transition-transform text-glow">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-500 font-medium px-2">{stat.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Improved Mobile */}
        <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] lg:w-[600px] h-[400px] sm:h-[500px] lg:h-[600px] bg-amber-500/10 rounded-full blur-[80px] sm:blur-[100px] animate-pulse" />
          
          <ScrollReveal>
            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-4 sm:mb-6 px-2">
                Ready to Get Started?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-neutral-400 mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2">
                Our AI-powered system finds the right part in seconds.
                <br className="hidden sm:block" />
                Or talk to our experts for custom solutions.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
                <a
                  href="tel:+12094646428"
                  className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2 w-full sm:w-auto"
                  aria-label="Call us at (209) 464-6428"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (209) 464-6428
                </a>
                <Link
                  href="/rfq"
                  className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center"
                >
                  Submit RFQ Online
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Footer - Improved Responsive */}
        <footer className="border-t border-white/5 py-12 sm:py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
              <div>
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-black">A</span>
                  </div>
                  <span className="font-semibold text-white text-sm sm:text-base">Ace Electric</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  Industrial power solutions since 1952.
                  <br />Stockton, California.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white text-xs sm:text-sm mb-3 sm:mb-4">Products</h4>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-neutral-500">
                  <li><Link href="/parts?category=motors" className="hover:text-white transition-colors">Electric Motors</Link></li>
                  <li><Link href="/parts?category=pumps" className="hover:text-white transition-colors">Pumps</Link></li>
                  <li><Link href="/parts?category=gearboxes" className="hover:text-white transition-colors">Gearboxes</Link></li>
                  <li><Link href="/parts?category=controls" className="hover:text-white transition-colors">Controls</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white text-xs sm:text-sm mb-3 sm:mb-4">Services</h4>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-neutral-500">
                  <li><Link href="/services" className="hover:text-white transition-colors">Motor Repair</Link></li>
                  <li><Link href="/services" className="hover:text-white transition-colors">Pump Repair</Link></li>
                  <li><Link href="/services" className="hover:text-white transition-colors">Field Service</Link></li>
                  <li><Link href="/services" className="hover:text-white transition-colors">Maintenance</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white text-xs sm:text-sm mb-3 sm:mb-4">Contact</h4>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-neutral-500">
                  <li>123 Industrial Way</li>
                  <li>Stockton, CA 95205</li>
                  <li><a href="tel:+12094646428" className="hover:text-white transition-colors">(209) 464-6428</a></li>
                  <li><a href="mailto:sales@aceelectricmotor.com" className="hover:text-white transition-colors">sales@aceelectricmotor.com</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <p className="text-xs text-neutral-600 text-center sm:text-left">
                © {new Date().getFullYear()} Ace Electric Motor and Pump Company
              </p>
              <div className="flex items-center gap-4 sm:gap-6 text-xs text-neutral-600">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

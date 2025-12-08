import { Metadata } from 'next';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { generatePageMetadata, generateServiceSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Sales & Services | Motor Repair, Pump Repair, 24/7 Field Service',
  description:
    'Expert electric motor repair, pump repair, field service, and predictive maintenance in Stockton, California. 24/7 emergency support. Vibration analysis, laser shaft alignment, dynamic balancing, thermography. Serving Central & Northern California since 1952.',
  path: '/services',
  keywords: [
    'motor repair Stockton',
    'pump repair California',
    '24/7 field service',
    'vibration analysis',
    'laser shaft alignment',
    'predictive maintenance',
    'emergency motor repair',
  ],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/services' },
]);

const serviceAreas = [
  'Brentwood', 'Davis', 'Discovery Bay', 'Elk Grove', 'Escalon', 'Folsom', 
  'Galt', 'Jackson', 'Linden', 'Lodi', 'Manteca', 'Modesto', 'Oakdale', 
  'Oakley', 'Patterson', 'Pleasanton', 'Roseville', 'Sacramento', 'Salida', 
  'Sonora', 'Stockton', 'Sutter Creek', 'Tracy', 'Turlock'
];

export default function ServicesPage() {
  const services = [
    {
      icon: '🔧',
      title: 'Electric Motor Repair',
      description: 'Complete AC/DC motor repair including rewinding, bearing replacement, shaft repair, and dynamic balancing.',
      features: ['Motor rewinding', 'Bearing replacement', 'Shaft repair', 'Dynamic balancing', 'Performance testing', 'Vibration analysis'],
      link: '/contact',
    },
    {
      icon: '💧',
      title: 'Industrial & Commercial Pump Repair',
      description: 'Full-service pump repair for centrifugal, positive displacement, submersible, and specialty pumps.',
      features: ['Impeller repair', 'Seal replacement', 'Wear ring service', 'Performance testing', 'Hydraulic balancing', 'Casing repair'],
      link: '/contact',
    },
    {
      icon: '🏭',
      title: 'On-Site Maintenance & Service',
      description: '24/7 field service bringing state-of-the-art tools and professional expertise directly to your facility.',
      features: ['Vibration Analysis', 'Thermography', 'Dynamic Balancing', 'Laser Shaft Alignment', 'Thermal Compensation', 'Corrective Footing'],
      link: '/contact',
      highlight: true,
    },
    {
      icon: '⚙️',
      title: 'Precision Machine Shop',
      description: 'In-house machining services for shafts, couplings, and custom parts with precision tolerances.',
      features: ['Shaft machining', 'Coupling repair', 'Custom parts', 'Balancing', 'Welding', 'Metal fabrication'],
      link: '/contact',
    },
    {
      icon: '🎛️',
      title: 'PLC Controls & Automation',
      description: 'Complete control system design, installation, and programming for industrial automation.',
      features: ['PLC programming', 'HMI development', 'Control panel design', 'System integration', 'Troubleshooting', 'Upgrades'],
      link: '/contact',
    },
    {
      icon: '⚡',
      title: 'Servo Motor Repair',
      description: 'Specialized repair services for servo motors, drives, and motion control systems.',
      features: ['Encoder repair', 'Drive repair', 'Feedback system service', 'Precision alignment', 'Performance tuning'],
      link: '/contact',
    },
    {
      icon: '📊',
      title: 'Predictive Maintenance',
      description: 'Prevent failures with comprehensive monitoring and analysis programs using advanced diagnostics.',
      features: ['Vibration monitoring', 'Thermography', 'Oil analysis', 'Motor current analysis', 'Condition-based maintenance', 'Maintenance scheduling'],
      link: '/contact',
    },
    {
      icon: '🛡️',
      title: 'Worry-Free Maintenance Programs',
      description: 'Comprehensive maintenance agreements that keep your equipment running optimally.',
      features: ['Scheduled inspections', 'Preventive maintenance', 'Priority service', 'Cost predictability', 'Equipment reliability'],
      link: '/contact',
    },
    {
      icon: '🎓',
      title: 'Training & Certification',
      description: 'Technical training programs for maintenance staff on motor, pump, and control system maintenance.',
      features: ['Motor maintenance', 'Pump basics', 'Vibration analysis', 'PLC programming', 'Custom training programs'],
      link: '/contact',
    },
  ];

  const onSiteServices = [
    {
      title: 'Vibration Analysis',
      description: 'Advanced vibration monitoring to detect bearing wear, misalignment, and imbalance before failure.',
    },
    {
      title: 'Thermography',
      description: 'Infrared imaging to identify hot spots in electrical connections and mechanical components.',
    },
    {
      title: 'Dynamic Balancing',
      description: 'On-site balancing services for rotors, impellers, and rotating equipment.',
    },
    {
      title: 'Laser Shaft Alignment',
      description: 'Precision alignment of motors, pumps, and driven equipment using laser technology.',
    },
    {
      title: 'Thermal Compensation',
      description: 'Accurate alignment accounting for thermal expansion during operation.',
    },
    {
      title: 'Corrective Footing',
      description: 'Foundation repair and leveling to ensure proper equipment installation.',
    },
  ];

  // Generate structured data for main service
  const mainServiceSchema = generateServiceSchema({
    name: 'Industrial Motor and Pump Repair Services',
    description: 'Complete electric motor and pump repair services with 24/7 emergency support in Stockton, California.',
    provider: 'Ace Electric Motor & Pump Company',
    areaServed: serviceAreas,
    serviceType: 'Motor and Pump Repair',
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainServiceSchema) }}
      />
      
      <div className="min-h-screen bg-black pt-16 sm:pt-0">
        {/* Hero Section - Improved Responsive */}
        <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-grid opacity-20 sm:opacity-30" />
          <div className="absolute top-0 left-1/4 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-amber-500/10 rounded-full blur-[80px] sm:blur-[100px]" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-400 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full animate-pulse" />
                  24/7 Service Available
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={100}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                  <span className="gradient-text">Sales &</span>
                  <br />
                  <span className="gradient-text-amber">Service Solutions</span>
                </h1>
              </ScrollReveal>
              
              <ScrollReveal delay={200}>
                <p className="text-sm sm:text-base md:text-lg text-neutral-400 mb-6 sm:mb-8 leading-relaxed">
                  From motor rewinding to predictive maintenance, our certified technicians keep your equipment running at peak performance. 
                  Serving Central & Northern California since 1952.
                </p>
              </ScrollReveal>
              
              <ScrollReveal delay={300}>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/contact" className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base text-center">
                    Schedule Service
                  </Link>
                  <a 
                    href="tel:+12094646428" 
                    className="btn-secondary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base text-center flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Emergency: (209) 464-6428
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* On-Site Services Section - Based on Actual Website */}
        <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden border-y border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
          <div className="absolute inset-0 bg-grid opacity-15 sm:opacity-20" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                <p className="text-amber-500 font-medium mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm uppercase tracking-wider">24/7 Field Service</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-3 sm:mb-4">
                  On-Site Maintenance & Service
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 max-w-3xl mx-auto">
                  State-of-the-art tools and professional in-the-field services directly to you on-site to keep your operations running 
                  cost-effectively and reliably 24 hours a day, 7 days a week, 365 days a year.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {onSiteServices.map((service, index) => (
                <ScrollReveal key={service.title} delay={index * 50}>
                  <div className="card-vercel p-5 sm:p-6 glow-amber-hover">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">{service.title}</h3>
                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{service.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* All Services Section */}
        <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                <p className="text-amber-500 font-medium mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm uppercase tracking-wider">Complete Solutions</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text">
                  Our Services
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {services.map((service, index) => (
                <ScrollReveal key={service.title} delay={index * 50}>
                  <Link
                    href={service.link}
                    className={`group card-vercel p-5 sm:p-6 glow-amber-hover hover-gradient-border block h-full ${
                      service.highlight ? 'border-amber-500/30 bg-amber-500/5' : ''
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 block transform group-hover:scale-110 transition-transform">
                      {service.icon}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 group-hover:text-amber-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 mb-3 sm:mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-400">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-amber-500 text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 transform group-hover:translate-x-1">
                      Learn more
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas Section */}
        <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden border-y border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-orange-500/5" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-3 sm:mb-4">
                  Areas We Service
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 mb-6 sm:mb-8">
                  Proud to serve Central & Northern California since 1952
                </p>
              </div>
            </ScrollReveal>

            <div className="max-w-4xl mx-auto">
              <div className="card-vercel p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                  {serviceAreas.map((area) => (
                    <span
                      key={area}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-full text-neutral-400 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency CTA Section */}
        <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] lg:w-[600px] h-[400px] sm:h-[500px] lg:h-[600px] bg-amber-500/10 rounded-full blur-[80px] sm:blur-[100px] animate-pulse" />
          
          <ScrollReveal>
            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-4 sm:mb-6">
                24/7 Emergency Service
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-neutral-400 mb-6 sm:mb-8 leading-relaxed">
                Equipment down? Our emergency team is available around the clock to get you back up and running.
              </p>
              <a
                href="tel:+12094646428"
                className="btn-primary px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call (209) 464-6428
              </a>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </>
  );
}

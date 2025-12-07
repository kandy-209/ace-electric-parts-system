import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Expert motor repair, pump repair, field service, and predictive maintenance.',
};

export default function ServicesPage() {
  const services = [
    {
      icon: '🔧',
      title: 'Motor Repair',
      description: 'Complete AC/DC motor repair including rewinding, bearing replacement, shaft repair, and balancing.',
      features: ['Rewinding', 'Bearing replacement', 'Shaft repair', 'Dynamic balancing', 'Testing'],
    },
    {
      icon: '💧',
      title: 'Pump Repair',
      description: 'Full-service pump repair for centrifugal, positive displacement, and submersible pumps.',
      features: ['Impeller repair', 'Seal replacement', 'Wear ring service', 'Performance testing'],
    },
    {
      icon: '⚙️',
      title: 'Gearbox Service',
      description: 'Inspection, repair, and rebuild services for all gear reducer types.',
      features: ['Gear inspection', 'Bearing service', 'Seal replacement', 'Oil analysis'],
    },
    {
      icon: '🚐',
      title: 'Field Service',
      description: 'On-site equipment installation, troubleshooting, and emergency repairs.',
      features: ['Installation', 'Laser alignment', 'Vibration analysis', 'Emergency response'],
    },
    {
      icon: '📊',
      title: 'Predictive Maintenance',
      description: 'Prevent failures with comprehensive monitoring and analysis programs.',
      features: ['Vibration monitoring', 'Thermography', 'Oil analysis', 'Motor current analysis'],
    },
    {
      icon: '🎓',
      title: 'Training',
      description: 'Technical training programs for maintenance staff.',
      features: ['Motor maintenance', 'Pump basics', 'Vibration analysis', 'Custom programs'],
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              <span className="gradient-text">Expert</span>
              <span className="text-white"> Services</span>
            </h1>
            <p className="text-lg text-neutral-400 mb-8">
              From motor rewinding to predictive maintenance, our certified technicians keep your equipment running at peak performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-primary px-8 py-4">
                Schedule Service
              </Link>
              <a href="tel:+12095559999" className="btn-secondary px-8 py-4">
                Emergency: (209) 555-9999
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="card-vercel p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-3xl mb-4 block">{service.icon}</span>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-neutral-500 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-neutral-400">
                      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold gradient-text mb-4">
            24/7 Emergency Service
          </h2>
          <p className="text-neutral-400 mb-8">
            Equipment down? Our emergency team is available around the clock.
          </p>
          <a
            href="tel:+12095559999"
            className="btn-primary px-8 py-4 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            (209) 555-9999
          </a>
        </div>
      </section>
    </div>
  );
}

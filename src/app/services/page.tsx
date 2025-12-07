import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Repair & Field Services',
  description: 'Expert motor repair, pump repair, field service, and predictive maintenance from Ace Electric Motor in Stockton, CA.',
};

export default function ServicesPage() {
  const services = [
    {
      icon: '🔧',
      title: 'Motor Repair & Rewinding',
      description: 'Complete motor repair services including rewinding, bearing replacement, shaft repair, and dynamic balancing.',
      features: [
        'AC & DC motor rewinding',
        'Bearing replacement',
        'Shaft repair & machining',
        'Dynamic balancing',
        'Insulation testing',
        'Core loss testing',
      ],
    },
    {
      icon: '💧',
      title: 'Pump Repair',
      description: 'Full-service pump repair for centrifugal, positive displacement, and submersible pumps.',
      features: [
        'Impeller replacement',
        'Mechanical seal repair',
        'Wear ring replacement',
        'Bearing replacement',
        'Alignment services',
        'Performance testing',
      ],
    },
    {
      icon: '⚙️',
      title: 'Gearbox Service',
      description: 'Gearbox inspection, repair, and rebuild services for all types of gear reducers.',
      features: [
        'Gear inspection',
        'Bearing replacement',
        'Seal replacement',
        'Oil analysis',
        'Alignment',
        'Performance testing',
      ],
    },
    {
      icon: '🚐',
      title: 'Field Service',
      description: 'On-site service for equipment installation, troubleshooting, and emergency repairs.',
      features: [
        'Equipment installation',
        'Laser alignment',
        'Vibration analysis',
        'Thermography',
        'Motor testing',
        'Emergency response',
      ],
    },
    {
      icon: '📊',
      title: 'Predictive Maintenance',
      description: 'Prevent failures before they happen with our comprehensive predictive maintenance programs.',
      features: [
        'Vibration monitoring',
        'Oil analysis',
        'Infrared thermography',
        'Motor current analysis',
        'Ultrasonic testing',
        'Trend analysis',
      ],
    },
    {
      icon: '🎓',
      title: 'Training',
      description: 'Technical training programs for your maintenance staff on motor and pump maintenance.',
      features: [
        'Motor maintenance',
        'Pump maintenance',
        'Vibration analysis',
        'Alignment procedures',
        'Electrical safety',
        'Custom programs',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Expert Repair &
              <span className="block text-amber-400">Field Services</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              From motor rewinding to predictive maintenance, our certified technicians 
              keep your equipment running at peak performance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-amber-500 text-slate-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors"
              >
                Schedule Service
              </Link>
              <a
                href="tel:+12095551234"
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                Emergency: (209) 555-1234
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white/5 rounded-2xl border border-white/10 p-8 hover:border-amber-500/50 transition-all"
              >
                <span className="text-4xl mb-4 block">{service.icon}</span>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                      <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-y border-amber-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Service Now?
          </h2>
          <p className="text-slate-300 mb-8">
            Our emergency response team is available 24/7 for critical equipment failures.
          </p>
          <a
            href="tel:+12095559999"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-slate-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            24/7 Emergency: (209) 555-9999
          </a>
        </div>
      </section>
    </div>
  );
}


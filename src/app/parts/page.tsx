'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PartsCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', count: 156 },
    { id: 'motors', name: 'Motors', count: 64 },
    { id: 'pumps', name: 'Pumps', count: 42 },
    { id: 'gearboxes', name: 'Gearboxes', count: 28 },
    { id: 'controls', name: 'Controls', count: 22 },
  ];

  const featuredParts = [
    {
      id: 'mtr-215t-10hp',
      name: 'NEMA 215T Motor',
      specs: '10 HP • 230/460V • 1800 RPM',
      category: 'motors',
      badge: 'In Stock',
      badgeColor: 'emerald',
    },
    {
      id: 'mtr-324t-25hp',
      name: 'NEMA 324T Motor',
      specs: '25 HP • 460V • 1800 RPM',
      category: 'motors',
      badge: 'Popular',
      badgeColor: 'amber',
    },
    {
      id: 'pmp-cent-2x3',
      name: 'Centrifugal Pump 2x3-10',
      specs: '200 GPM • 150 ft Head',
      category: 'pumps',
      badge: 'In Stock',
      badgeColor: 'emerald',
    },
    {
      id: 'pmp-sub-5hp',
      name: 'Submersible Pump',
      specs: '5 HP • Stainless Steel',
      category: 'pumps',
      badge: 'New',
      badgeColor: 'blue',
    },
    {
      id: 'gbx-helical-30',
      name: 'Helical Gearbox',
      specs: '30:1 Ratio • 5000 lb-in',
      category: 'gearboxes',
      badge: 'In Stock',
      badgeColor: 'emerald',
    },
    {
      id: 'vfd-10hp',
      name: 'Variable Frequency Drive',
      specs: '10 HP • 460V • NEMA 4X',
      category: 'controls',
      badge: 'In Stock',
      badgeColor: 'emerald',
    },
  ];

  const filteredParts = selectedCategory === 'all' 
    ? featuredParts 
    : featuredParts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              <span className="gradient-text">Parts</span>
              <span className="text-white"> Catalog</span>
            </h1>
            <p className="text-lg text-neutral-400 mb-8">
              Search our extensive inventory of motors, pumps, gearboxes, and controls.
            </p>
            
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by part number, name, or specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.name}
                <span className={`text-xs ${selectedCategory === cat.id ? 'text-neutral-600' : 'text-neutral-600'}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Parts Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParts.map((part, index) => (
              <Link
                key={part.id}
                href={`/parts/${part.id}`}
                className="group card-vercel p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Part Image Placeholder */}
                <div className="aspect-square bg-neutral-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <div className="text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                    {part.category === 'motors' && '⚡'}
                    {part.category === 'pumps' && '💧'}
                    {part.category === 'gearboxes' && '⚙️'}
                    {part.category === 'controls' && '🎛️'}
                  </div>
                </div>

                {/* Badge */}
                <div className="mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    part.badgeColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                    part.badgeColor === 'amber' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {part.badge}
                  </span>
                </div>

                {/* Info */}
                <h3 className="font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors">
                  {part.name}
                </h3>
                <p className="text-sm text-neutral-500">{part.specs}</p>

                {/* Action */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-amber-500 font-medium">Request Quote</span>
                  <svg className="w-4 h-4 text-neutral-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <button className="btn-secondary px-8 py-3">
              Load More Parts
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold gradient-text mb-4">
            Can't Find What You Need?
          </h2>
          <p className="text-neutral-400 mb-8">
            We source parts from hundreds of manufacturers. Submit an RFQ and we'll find it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/rfq" className="btn-primary px-8 py-3">
              Request a Quote
            </Link>
            <a href="tel:+12095551234" className="btn-secondary px-8 py-3">
              Call (209) 555-1234
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

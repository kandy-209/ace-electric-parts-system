'use client';

import { useState } from 'react';
import Link from 'next/link';

// Parts catalog with search and filtering
export default function PartsCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Parts', icon: '⚡' },
    { id: 'motors', name: 'Electric Motors', icon: '🔄' },
    { id: 'pumps', name: 'Pumps', icon: '💧' },
    { id: 'gearboxes', name: 'Gearboxes', icon: '⚙️' },
    { id: 'controls', name: 'Controls & Drives', icon: '🎛️' },
    { id: 'bearings', name: 'Bearings & Seals', icon: '🔩' },
  ];

  // Demo parts for display
  const featuredParts = [
    {
      id: 'mtr-001',
      name: 'NEMA 215T Electric Motor',
      category: 'motors',
      hp: '10 HP',
      voltage: '230/460V',
      rpm: '1800',
      price: 'Request Quote',
      image: '/parts/motor-215t.jpg',
    },
    {
      id: 'pmp-001',
      name: 'Centrifugal Pump 2x3-10',
      category: 'pumps',
      flow: '200 GPM',
      head: '150 ft',
      material: 'Cast Iron',
      price: 'Request Quote',
      image: '/parts/pump-centrifugal.jpg',
    },
    {
      id: 'gbx-001',
      name: 'Helical Gearbox 30:1',
      category: 'gearboxes',
      ratio: '30:1',
      torque: '5000 lb-in',
      mounting: 'Foot Mount',
      price: 'Request Quote',
      image: '/parts/gearbox-helical.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Industrial Parts
              <span className="block text-amber-400">Catalog</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Electric motors, pumps, gearboxes, and more. Search our extensive 
              inventory or request a quote for custom parts.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by part number, name, or specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 text-lg rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Parts Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Featured Parts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredParts.map((part) => (
            <Link
              key={part.id}
              href={`/parts/${part.id}`}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-amber-400/50 transition-all hover:shadow-xl hover:shadow-amber-500/10"
            >
              <div className="aspect-video bg-slate-700/50 flex items-center justify-center">
                <span className="text-6xl opacity-50">⚙️</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                  {part.name}
                </h3>
                <div className="mt-3 space-y-1 text-sm text-slate-400">
                  {'hp' in part && <p>Power: {part.hp}</p>}
                  {'voltage' in part && <p>Voltage: {part.voltage}</p>}
                  {'rpm' in part && <p>Speed: {part.rpm} RPM</p>}
                  {'flow' in part && <p>Flow: {part.flow}</p>}
                  {'head' in part && <p>Head: {part.head}</p>}
                  {'ratio' in part && <p>Ratio: {part.ratio}</p>}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-amber-400 font-semibold">{part.price}</span>
                  <span className="text-slate-500 group-hover:text-amber-400 transition-colors">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl border border-amber-500/30 p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can't Find What You Need?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            We source parts from hundreds of manufacturers. Submit an RFQ and our 
            team will find the best solution for your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/rfq"
              className="px-8 py-4 bg-amber-500 text-slate-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors"
            >
              Request a Quote
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


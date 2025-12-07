'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';
import { CardSkeleton } from '@/components/LoadingStates';
import { useToast } from '@/components/Toast';

export default function PartsMarketplacePage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [parts, setParts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const debouncedSearch = useDebounce(searchQuery, 500);

  const categories = [
    { id: 'all', name: 'All Parts' },
    { id: 'motors', name: 'Motors' },
    { id: 'pumps', name: 'Pumps' },
    { id: 'gearboxes', name: 'Gearboxes' },
    { id: 'controls', name: 'Controls' },
    { id: 'bearings', name: 'Bearings' },
    { id: 'seals', name: 'Seals' },
  ];

  useEffect(() => {
    if (debouncedSearch || selectedCategory !== 'all') {
      searchParts();
    } else {
      fetchParts();
    }
  }, [debouncedSearch, selectedCategory]);

  const fetchParts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/parts?limit=50');
      const data = await response.json();
      
      if (response.ok) {
        setParts(data.parts || []);
      }
    } catch (error) {
      showToast('Failed to load parts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const searchParts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      const response = await fetch(`/api/parts/search?${params.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setParts(data.parts || []);
      }
    } catch (error) {
      showToast('Failed to search parts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestQuote = async (part: any) => {
    // Navigate to RFQ page with part pre-filled
    window.location.href = `/sales/rfq?part_id=${part.part_id}&part_description=${encodeURIComponent(part.description)}`;
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Parts Marketplace
          </h1>
          <p className="text-neutral-400">
            Search our database of parts collected from vendors, requests, and web scraping.
            Request quotes for any part or add new parts to the database.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="card-vercel p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search parts by description, part number, manufacturer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-vercel w-full"
              />
            </div>
            <button
              onClick={searchParts}
              className="btn-primary px-6"
            >
              Search
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Parts Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : parts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-400 mb-4">No parts found</p>
            <button onClick={fetchParts} className="btn-secondary">
              Browse All Parts
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-neutral-400">
                Found {parts.length} {parts.length === 1 ? 'part' : 'parts'}
              </p>
              <Link href="/sales/rfq" className="btn-primary">
                Request Custom Part
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {parts.map((part) => (
                <div
                  key={part.part_id}
                  className="card-vercel p-6 hover-lift"
                >
                  {/* Part Number */}
                  <div className="mb-3">
                    <span className="text-xs text-neutral-500">Part #</span>
                    <h3 className="font-semibold text-white">{part.part_number}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                    {part.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {part.manufacturer && (
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span>Manufacturer:</span>
                        <span className="text-neutral-300">{part.manufacturer}</span>
                      </div>
                    )}
                    {part.category && (
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span>Category:</span>
                        <span className="text-neutral-300 capitalize">{part.category}</span>
                      </div>
                    )}
                    {part.unit_cost && (
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span>Est. Cost:</span>
                        <span className="text-amber-400 font-medium">
                          ${parseFloat(part.unit_cost).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequestQuote(part)}
                      className="btn-secondary flex-1 text-sm py-2"
                    >
                      Request Quote
                    </button>
                    <Link
                      href={`/parts/${part.part_id}`}
                      className="btn-primary flex-1 text-sm py-2 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


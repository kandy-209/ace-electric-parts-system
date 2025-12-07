'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { CardSkeleton } from '@/components/LoadingStates';

export default function SalesDashboardPage() {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    active_rfqs: 0,
    quotes_received: 0,
    vendors_contacted: 0,
    parts_in_database: 0,
  });
  const [recentRfqs, setRecentRfqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load stats
      const statsResponse = await fetch('/api/sales/stats');
      const statsData = await statsResponse.json();
      if (statsResponse.ok) {
        setStats(statsData);
      }

      // Load recent RFQs
      const rfqsResponse = await fetch('/api/rfq/recent?limit=5');
      const rfqsData = await rfqsResponse.json();
      if (rfqsResponse.ok) {
        setRecentRfqs(rfqsData.rfqs || []);
      }
    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Sales Dashboard
          </h1>
          <p className="text-neutral-400">
            Manage RFQs, vendor relationships, and parts sourcing from one place.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="card-vercel p-6">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {isLoading ? '...' : stats.active_rfqs}
            </div>
            <div className="text-sm text-neutral-400">Active RFQs</div>
          </div>
          <div className="card-vercel p-6">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {isLoading ? '...' : stats.quotes_received}
            </div>
            <div className="text-sm text-neutral-400">Quotes Received</div>
          </div>
          <div className="card-vercel p-6">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {isLoading ? '...' : stats.vendors_contacted}
            </div>
            <div className="text-sm text-neutral-400">Vendors Contacted</div>
          </div>
          <div className="card-vercel p-6">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {isLoading ? '...' : stats.parts_in_database}
            </div>
            <div className="text-sm text-neutral-400">Parts in Database</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/sales/rfq" className="card-vercel p-6 hover-lift block">
            <div className="text-amber-400 mb-2">📋</div>
            <h3 className="font-semibold text-white mb-1">Create RFQ</h3>
            <p className="text-sm text-neutral-400">
              Create and broadcast a new request for quote
            </p>
          </Link>

          <Link href="/sales/marketplace" className="card-vercel p-6 hover-lift block">
            <div className="text-amber-400 mb-2">🔍</div>
            <h3 className="font-semibold text-white mb-1">Parts Marketplace</h3>
            <p className="text-sm text-neutral-400">
              Search parts database and request quotes
            </p>
          </Link>

          <Link href="/sales/vendors" className="card-vercel p-6 hover-lift block">
            <div className="text-amber-400 mb-2">🏭</div>
            <h3 className="font-semibold text-white mb-1">Vendor Management</h3>
            <p className="text-sm text-neutral-400">
              View and manage vendors and contacts
            </p>
          </Link>

          <Link href="/sales/orders" className="card-vercel p-6 hover-lift block">
            <div className="text-amber-400 mb-2">📦</div>
            <h3 className="font-semibold text-white mb-1">Orders & Quotes</h3>
            <p className="text-sm text-neutral-400">
              View orders, quotes, and generate forms
            </p>
          </Link>
        </div>

        {/* Recent RFQs */}
        <div className="card-vercel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent RFQs</h2>
            <Link href="/sales/rfq" className="text-sm text-amber-400 hover:text-amber-300">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-white/5 rounded animate-pulse" />
              ))}
            </div>
          ) : recentRfqs.length === 0 ? (
            <p className="text-neutral-400 text-center py-4">
              No RFQs yet. <Link href="/sales/rfq" className="text-amber-400 hover:underline">Create one</Link>
            </p>
          ) : (
            <div className="space-y-3">
              {recentRfqs.map((rfq) => (
                <Link
                  key={rfq.rfq_id}
                  href={`/sales/rfq/${rfq.rfq_id}`}
                  className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{rfq.rfq_number}</div>
                      <div className="text-sm text-neutral-400">
                        {new Date(rfq.created_date).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rfq.status === 'sent'
                          ? 'bg-blue-500/20 text-blue-400'
                          : rfq.status === 'quotes_received'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-neutral-500/20 text-neutral-400'
                      }`}
                    >
                      {rfq.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


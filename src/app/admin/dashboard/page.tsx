// Admin Dashboard - Command Center

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    total_parts: 0,
    active_rfqs: 0,
    vendors: 0,
    pending_imports: 0,
  });

  useEffect(() => {
    // TODO: Fetch real metrics from API
    setMetrics({
      total_parts: 0,
      active_rfqs: 0,
      vendors: 0,
      pending_imports: 0,
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Total Parts</h3>
          <p className="text-3xl font-bold">{metrics.total_parts.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Active RFQs</h3>
          <p className="text-3xl font-bold">{metrics.active_rfqs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Vendors</h3>
          <p className="text-3xl font-bold">{metrics.vendors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Pending Imports</h3>
          <p className="text-3xl font-bold">{metrics.pending_imports}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/import"
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition text-center"
          >
            Import Data
          </Link>
          <Link
            href="/admin/rfq"
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition text-center"
          >
            Create RFQ
          </Link>
          <Link
            href="/admin/vendors"
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition text-center"
          >
            Manage Vendors
          </Link>
          <Link
            href="/admin/parts"
            className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition text-center"
          >
            Manage Parts
          </Link>
          <Link
            href="/admin/agents"
            className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition text-center"
          >
            AI Agents
          </Link>
          <Link
            href="/admin/reports"
            className="bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition text-center"
          >
            Reports & Analytics
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>
    </div>
  );
}


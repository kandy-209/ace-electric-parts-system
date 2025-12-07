export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Ace Electric Motor & Pump Co.
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Parts Database & Ordering System
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/parts"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Parts
            </a>
            <a
              href="/admin/dashboard"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Admin Dashboard
            </a>
            <a
              href="/admin/agents"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              AI Agents
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Parts Database</h2>
            <p className="text-gray-600">
              Comprehensive parts catalog with search, filters, and detailed specifications.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">AI-Powered Quoting</h2>
            <p className="text-gray-600">
              Automated quote generation with Good/Better/Best tiers for repairs and sales.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Vendor Management</h2>
            <p className="text-gray-600">
              Multi-channel vendor discovery and automated RFQ distribution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


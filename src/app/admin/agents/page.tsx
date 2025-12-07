// Admin Dashboard - Agents Management

'use client';

import { useEffect, useState } from 'react';

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  enabled: boolean;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'all',
    'shop',
    'field_service',
    'sales',
    'purchasing',
    'reliability',
    'training',
  ];

  const filteredAgents = selectedCategory === 'all'
    ? agents
    : agents.filter(agent => agent.category === selectedCategory);

  const agentsByCategory = {
    shop: agents.filter(a => a.category === 'shop').length,
    field_service: agents.filter(a => a.category === 'field_service').length,
    sales: agents.filter(a => a.category === 'sales').length,
    purchasing: agents.filter(a => a.category === 'purchasing').length,
    reliability: agents.filter(a => a.category === 'reliability').length,
    training: agents.filter(a => a.category === 'training').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Agents Management</h1>

      {/* Category Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {category === 'all' ? 'All' : category.replace('_', ' ')}
            {category !== 'all' && (
              <span className="ml-2 text-sm">
                ({agentsByCategory[category as keyof typeof agentsByCategory]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map(agent => (
          <div
            key={agent.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold">{agent.name}</h3>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  agent.enabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {agent.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-500 capitalize">
                {agent.category.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-500">v{agent.version}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No agents found in this category.
        </div>
      )}
    </div>
  );
}


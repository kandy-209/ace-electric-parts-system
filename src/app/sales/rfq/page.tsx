'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast';
import { ButtonLoader } from '@/components/LoadingStates';

export default function SalesRFQPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    parts_description: '',
    technical_requirements: '',
    quantity: '',
    urgency: 'standard',
    due_date: '',
    broadcast_channels: ['email', 'portal'],
    discover_vendors: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchingVendors, setMatchingVendors] = useState<any[]>([]);
  const [isFindingVendors, setIsFindingVendors] = useState(false);

  const handleFindVendors = async () => {
    if (!formData.parts_description.trim()) {
      showToast('Please enter a parts description', 'error');
      return;
    }

    setIsFindingVendors(true);
    try {
      const response = await fetch(
        `/api/rfq/broadcast?parts_description=${encodeURIComponent(formData.parts_description)}`
      );
      const data = await response.json();

      if (response.ok) {
        setMatchingVendors(data.matches || []);
        showToast(`Found ${data.count || 0} matching vendors`, 'success');
      } else {
        showToast(data.error || 'Failed to find vendors', 'error');
      }
    } catch (error) {
      showToast('Error finding vendors', 'error');
    } finally {
      setIsFindingVendors(false);
    }
  };

  const handleDiscoverVendors = async () => {
    if (!formData.parts_description.trim()) {
      showToast('Please enter a parts description', 'error');
      return;
    }

    setIsFindingVendors(true);
    try {
      const response = await fetch('/api/vendors/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          part_description: formData.parts_description,
          technical_requirements: formData.technical_requirements
            ? JSON.parse(formData.technical_requirements)
            : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(
          `Discovered ${data.vendors_discovered} vendors and saved ${data.vendors_saved} to database`,
          'success'
        );
        // Refresh vendor list
        await handleFindVendors();
      } else {
        showToast(data.error || 'Failed to discover vendors', 'error');
      }
    } catch (error) {
      showToast('Error discovering vendors', 'error');
    } finally {
      setIsFindingVendors(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.parts_description.trim()) {
      showToast('Please enter a parts description', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create RFQ
      const createResponse = await fetch('/api/rfq/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parts_description: formData.parts_description,
          technical_requirements: formData.technical_requirements
            ? JSON.parse(formData.technical_requirements)
            : undefined,
          quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
          urgency: formData.urgency,
          due_date: formData.due_date || undefined,
        }),
      });

      const createData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createData.error || 'Failed to create RFQ');
      }

      // 2. Discover vendors if requested
      if (formData.discover_vendors) {
        await handleDiscoverVendors();
      }

      // 3. Broadcast RFQ
      const broadcastResponse = await fetch('/api/rfq/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rfq_id: createData.rfq_id,
          parts_description: formData.parts_description,
          technical_requirements: formData.technical_requirements
            ? JSON.parse(formData.technical_requirements)
            : undefined,
          quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
          urgency: formData.urgency,
          due_date: formData.due_date || undefined,
          channels: formData.broadcast_channels,
        }),
      });

      const broadcastData = await broadcastResponse.json();

      if (broadcastResponse.ok) {
        showToast(
          `RFQ broadcasted to ${broadcastData.vendors_contacted} vendors via ${broadcastData.channels_used.join(', ')}`,
          'success'
        );
        // Reset form
        setFormData({
          parts_description: '',
          technical_requirements: '',
          quantity: '',
          urgency: 'standard',
          due_date: '',
          broadcast_channels: ['email', 'portal'],
          discover_vendors: true,
        });
      } else {
        throw new Error(broadcastData.error || 'Failed to broadcast RFQ');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to create and broadcast RFQ', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Create & Broadcast RFQ
          </h1>
          <p className="text-neutral-400">
            Create a request for quote and automatically send it to all matching vendors in your database,
            CRM, and discover new vendors via web search.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="card-vercel p-6">
                <h2 className="text-lg font-semibold text-white mb-4">RFQ Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Parts Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.parts_description}
                      onChange={(e) => setFormData({ ...formData, parts_description: e.target.value })}
                      placeholder="Describe the custom part you need: materials, dimensions, specifications, application..."
                      className="input-vercel w-full resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Technical Requirements (JSON)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.technical_requirements}
                      onChange={(e) => setFormData({ ...formData, technical_requirements: e.target.value })}
                      placeholder='{"material": "aluminum", "tolerance": "±0.001", "certification": "ISO 9001"}'
                      className="input-vercel w-full resize-none font-mono text-sm"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Quantity</label>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder="1"
                        className="input-vercel w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Urgency</label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="input-vercel w-full"
                      >
                        <option value="standard">Standard (5-7 days)</option>
                        <option value="rush">Rush (2-3 days)</option>
                        <option value="emergency">Emergency (Same day)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="input-vercel w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Broadcast Channels
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['email', 'linkedin', 'portal', 'sms'].map((channel) => (
                        <label key={channel} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.broadcast_channels.includes(channel)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  broadcast_channels: [...formData.broadcast_channels, channel],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  broadcast_channels: formData.broadcast_channels.filter((c) => c !== channel),
                                });
                              }
                            }}
                            className="w-4 h-4 rounded border-white/20 bg-white/5"
                          />
                          <span className="text-sm text-neutral-300 capitalize">{channel}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="discover_vendors"
                      checked={formData.discover_vendors}
                      onChange={(e) => setFormData({ ...formData, discover_vendors: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-white/5"
                    />
                    <label htmlFor="discover_vendors" className="text-sm text-neutral-300 cursor-pointer">
                      Discover new vendors via web search before broadcasting
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleFindVendors}
                    disabled={isFindingVendors}
                    className="btn-secondary flex-1"
                  >
                    {isFindingVendors ? 'Finding...' : 'Find Matching Vendors'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleDiscoverVendors}
                    disabled={isFindingVendors}
                    className="btn-secondary flex-1"
                  >
                    {isFindingVendors ? 'Discovering...' : 'Discover New Vendors'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary mt-4"
                >
                  {isSubmitting ? <ButtonLoader /> : 'Create & Broadcast RFQ'}
                </button>
              </div>
            </form>
          </div>

          {/* Matching Vendors Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-vercel p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">
                Matching Vendors ({matchingVendors.length})
              </h2>
              
              {matchingVendors.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Click "Find Matching Vendors" to see which vendors in your database can fulfill this RFQ.
                </p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {matchingVendors.map((vendor, index) => (
                    <div
                      key={vendor.vendor_id || index}
                      className="bg-black/50 rounded-lg p-3 border border-white/5"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-white text-sm">{vendor.vendor_name}</h3>
                        <span className="text-xs text-amber-400">
                          {Math.round(vendor.match_confidence * 100)}%
                        </span>
                      </div>
                      
                      <p className="text-xs text-neutral-500 mb-1 capitalize">
                        {vendor.discovered_via?.replace('_', ' ')}
                      </p>
                      
                      {vendor.match_reasons && vendor.match_reasons.length > 0 && (
                        <ul className="text-xs text-neutral-400 space-y-1">
                          {vendor.match_reasons.slice(0, 2).map((reason: string, i: number) => (
                            <li key={i} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


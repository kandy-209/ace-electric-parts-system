'use client';

import { useState } from 'react';
import Link from 'next/link';
import FormField from '@/components/FormField';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';

export default function RFQPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    partDescription: '',
    quantity: '',
    urgency: 'standard',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.partDescription.trim()) {
      newErrors.partDescription = 'Part description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Submit to API
      await new Promise(resolve => setTimeout(resolve, 1500));
      showToast('Quote request submitted successfully!', 'success');
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (error) {
      showToast('Failed to submit request. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Request Submitted</h1>
          <p className="text-neutral-400 mb-8 max-w-md">
            We'll review your request and respond within 24 hours with pricing and availability.
          </p>
          <Link href="/parts" className="btn-primary px-8 py-3">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-3xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Request</span>
            <span className="text-white"> a Quote</span>
          </h1>
          <p className="text-neutral-400 max-w-lg mx-auto">
            Tell us what you need and we'll get back to you with pricing within 24 hours.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card-vercel p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-6">Contact Information</h2>
            
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                label="Full Name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Smith"
                error={errors.name}
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@company.com"
                error={errors.email}
              />
              <FormField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(209) 555-0123"
                error={errors.phone}
              />
              <FormField
                label="Company"
                name="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="ABC Manufacturing"
                error={errors.company}
              />
            </div>
          </div>

          <div className="card-vercel p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-6">Part Details</h2>
            
            <div className="space-y-4 sm:space-y-6">
              <FormField
                label="Part Description / Requirements"
                name="partDescription"
                required
                textarea
                rows={5}
                value={formData.partDescription}
                onChange={(e) => setFormData({ ...formData, partDescription: e.target.value })}
                placeholder="Describe the part you need: manufacturer, part number, specs, application..."
                error={errors.partDescription}
              />

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  label="Quantity"
                  name="quantity"
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="1"
                  error={errors.quantity}
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Urgency
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="input-vercel appearance-none cursor-pointer"
                  >
                    <option value="standard" className="bg-black">Standard (5-7 days)</option>
                    <option value="rush" className="bg-black">Rush (2-3 days)</option>
                    <option value="emergency" className="bg-black">Emergency (Same day)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="border-amber-500" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Request</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Toast Notifications */}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}

        {/* Contact */}
        <div className="mt-12 text-center">
          <p className="text-neutral-500 mb-2">Need immediate help?</p>
          <a
            href="tel:+12095551234"
            className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            Call (209) 555-1234
          </a>
        </div>
      </div>
    </div>
  );
}

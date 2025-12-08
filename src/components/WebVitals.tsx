'use client';

import { useEffect } from 'react';

/**
 * Web Vitals tracking component
 * Measures Core Web Vitals for SEO and performance monitoring
 */
export default function WebVitals() {
  useEffect(() => {
    // Only run in production or when explicitly enabled
    if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_ENABLE_ANALYTICS) {
      return;
    }

    // Dynamically import web-vitals to reduce initial bundle size
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      // Largest Contentful Paint (LCP) - Target: < 2.5s
      onLCP((metric) => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', metric.name, {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_category: 'Web Vitals',
            event_label: metric.id,
            non_interaction: true,
          });
        }
        console.log('LCP:', metric.value);
      });

      // First Input Delay (FID) / Interaction to Next Paint (INP) - Target: < 200ms
      onINP((metric) => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', metric.name, {
            value: Math.round(metric.value),
            event_category: 'Web Vitals',
            event_label: metric.id,
            non_interaction: true,
          });
        }
        console.log('INP:', metric.value);
      });

      // Cumulative Layout Shift (CLS) - Target: < 0.1
      onCLS((metric) => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', metric.name, {
            value: Math.round(metric.value * 1000),
            event_category: 'Web Vitals',
            event_label: metric.id,
            non_interaction: true,
          });
        }
        console.log('CLS:', metric.value);
      });

      // First Contentful Paint (FCP) - Target: < 1.8s
      onFCP((metric) => {
        console.log('FCP:', metric.value);
      });

      // Time to First Byte (TTFB) - Target: < 800ms
      onTTFB((metric) => {
        console.log('TTFB:', metric.value);
      });

      // Legacy FID support (if INP not available)
      if (onFID) {
        onFID((metric) => {
          console.log('FID:', metric.value);
        });
      }
    });
  }, []);

  return null;
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}


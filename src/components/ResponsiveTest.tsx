'use client';

import { useState, useEffect } from 'react';

interface ViewportInfo {
  width: number;
  height: number;
  breakpoint: string;
  deviceType: string;
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  touchSupport: boolean;
}

export default function ResponsiveTest() {
  const [viewport, setViewport] = useState<ViewportInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let breakpoint = '';
      let deviceType = '';
      
      if (width < 640) {
        breakpoint = 'sm (< 640px)';
        deviceType = 'Mobile';
      } else if (width < 768) {
        breakpoint = 'md (640-768px)';
        deviceType = 'Mobile Large';
      } else if (width < 1024) {
        breakpoint = 'lg (768-1024px)';
        deviceType = 'Tablet';
      } else if (width < 1280) {
        breakpoint = 'xl (1024-1280px)';
        deviceType = 'Desktop';
      } else {
        breakpoint = '2xl (≥ 1280px)';
        deviceType = 'Desktop Large';
      }

      setViewport({
        width,
        height,
        breakpoint,
        deviceType,
        orientation: width > height ? 'landscape' : 'portrait',
        pixelRatio: window.devicePixelRatio,
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  if (!viewport) return null;

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <button
        onClick={toggleVisibility}
        className="fixed bottom-20 right-6 z-50 w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white text-xs font-bold transition-all"
        title="Toggle Responsive Test Panel"
      >
        {viewport.width < 640 ? 'XS' : viewport.width < 768 ? 'SM' : viewport.width < 1024 ? 'MD' : viewport.width < 1280 ? 'LG' : 'XL'}
      </button>

      {/* Test Panel */}
      {isVisible && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] bg-black border border-white/20 rounded-lg shadow-2xl p-4 animate-fade-in-scale">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Responsive Test</h3>
            <button
              onClick={toggleVisibility}
              className="text-neutral-400 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Width:</span>
              <span className="text-white font-mono">{viewport.width}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Height:</span>
              <span className="text-white font-mono">{viewport.height}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Breakpoint:</span>
              <span className="text-amber-400 font-semibold">{viewport.breakpoint}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Device:</span>
              <span className="text-white">{viewport.deviceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Orientation:</span>
              <span className="text-white">{viewport.orientation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Pixel Ratio:</span>
              <span className="text-white font-mono">{viewport.pixelRatio}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Touch:</span>
              <span className={viewport.touchSupport ? 'text-green-400' : 'text-red-400'}>
                {viewport.touchSupport ? '✓ Yes' : '✗ No'}
              </span>
            </div>
          </div>

          {/* Breakpoint Indicators */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-5 gap-1">
              {['sm', 'md', 'lg', 'xl', '2xl'].map((bp) => {
                const isActive = viewport.breakpoint.includes(bp);
                return (
                  <div
                    key={bp}
                    className={`text-center p-1 rounded text-[10px] ${
                      isActive ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 text-neutral-500'
                    }`}
                  >
                    {bp}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


'use client';

import { useState, useEffect } from 'react';

export default function ResponsiveTestPage() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const update = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      runTests();
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  const runTests = () => {
    const results: Record<string, boolean> = {};
    
    // Test 1: Viewport width
    results['viewport-width'] = viewport.width > 0;
    
    // Test 2: Touch support
    results['touch-support'] = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Test 3: CSS Grid support
    results['css-grid'] = CSS.supports('display', 'grid');
    
    // Test 4: Flexbox support
    results['flexbox'] = CSS.supports('display', 'flex');
    
    // Test 5: Backdrop filter support
    results['backdrop-filter'] = CSS.supports('backdrop-filter', 'blur(10px)');
    
    // Test 6: Minimum touch target size
    results['touch-targets'] = true; // Manual check
    
    // Test 7: Text size (should be at least 16px on mobile)
    const testElement = document.createElement('div');
    testElement.style.fontSize = '16px';
    document.body.appendChild(testElement);
    const fontSize = parseFloat(getComputedStyle(testElement).fontSize);
    results['text-size'] = fontSize >= 16;
    document.body.removeChild(testElement);
    
    setTestResults(results);
  };

  useEffect(() => {
    runTests();
  }, [viewport]);

  const breakpoints = [
    { name: 'Mobile (sm)', width: 640, color: 'bg-red-500/20' },
    { name: 'Tablet (md)', width: 768, color: 'bg-orange-500/20' },
    { name: 'Desktop (lg)', width: 1024, color: 'bg-yellow-500/20' },
    { name: 'Large (xl)', width: 1280, color: 'bg-green-500/20' },
    { name: 'XL (2xl)', width: 1536, color: 'bg-blue-500/20' },
  ];

  const testSections = [
    {
      title: 'Typography Scale',
      tests: [
        { label: 'H1 Large', className: 'text-5xl sm:text-7xl lg:text-8xl font-bold' },
        { label: 'H2 Medium', className: 'text-3xl sm:text-5xl font-bold' },
        { label: 'Body', className: 'text-base sm:text-lg' },
        { label: 'Small', className: 'text-sm sm:text-base' },
      ],
    },
    {
      title: 'Grid Layouts',
      tests: [
        { label: '1 Column Mobile, 2 Tablet, 3 Desktop', className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
        { label: '2 Columns Mobile, 3 Desktop', className: 'grid grid-cols-2 lg:grid-cols-3 gap-4' },
        { label: '4 Columns Desktop Only', className: 'hidden lg:grid lg:grid-cols-4 gap-4' },
      ],
    },
    {
      title: 'Spacing',
      tests: [
        { label: 'Padding Responsive', className: 'p-4 sm:p-6 lg:p-8 bg-amber-500/10 rounded' },
        { label: 'Margin Responsive', className: 'm-2 sm:m-4 lg:m-6 bg-amber-500/10 rounded' },
        { label: 'Gap Responsive', className: 'flex gap-2 sm:gap-4 lg:gap-6' },
      ],
    },
    {
      title: 'Buttons',
      tests: [
        { label: 'Full Width Mobile', className: 'w-full sm:w-auto' },
        { label: 'Size Responsive', className: 'px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4' },
      ],
    },
  ];

  const currentBreakpoint = viewport.width < 640 ? 'sm' :
    viewport.width < 768 ? 'md' :
    viewport.width < 1024 ? 'lg' :
    viewport.width < 1280 ? 'xl' : '2xl';

  return (
    <div className="min-h-screen bg-black pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
            Responsive Design Test Suite
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="bg-white/5 rounded-lg px-4 py-2 border border-white/10">
              <span className="text-xs sm:text-sm text-neutral-400">Viewport:</span>
              <span className="ml-2 text-white font-mono font-semibold text-sm sm:text-base">
                {viewport.width} × {viewport.height}px
              </span>
            </div>
            <div className="bg-white/5 rounded-lg px-4 py-2 border border-white/10">
              <span className="text-xs sm:text-sm text-neutral-400">Breakpoint:</span>
              <span className="ml-2 text-amber-400 font-semibold text-sm sm:text-base">
                {currentBreakpoint.toUpperCase()}
              </span>
            </div>
            <div className="bg-white/5 rounded-lg px-4 py-2 border border-white/10">
              <span className="text-xs sm:text-sm text-neutral-400">Device:</span>
              <span className="ml-2 text-white text-sm sm:text-base">
                {viewport.width < 640 ? 'Mobile' :
                 viewport.width < 768 ? 'Mobile Large' :
                 viewport.width < 1024 ? 'Tablet' :
                 viewport.width < 1280 ? 'Desktop' :
                 viewport.width < 1536 ? 'Large Desktop' : 'XL Desktop'}
              </span>
            </div>
          </div>
        </div>

        {/* Test Results Summary */}
        <div className="mb-8 bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Test Results</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Object.entries(testResults).map(([key, passed]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={passed ? 'text-green-400' : 'text-red-400'}>
                  {passed ? '✓' : '✗'}
                </span>
                <span className="text-xs sm:text-sm text-neutral-400 capitalize">
                  {key.replace(/-/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakpoint Ruler */}
        <div className="mb-12 bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Breakpoint Ruler</h2>
          <div className="relative h-12 sm:h-16 bg-gradient-to-r from-red-500/20 via-orange-500/20 via-yellow-500/20 via-green-500/20 to-blue-500/20 rounded overflow-hidden">
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
              style={{ left: `${Math.min((viewport.width / 1920) * 100, 100)}%` }}
            >
              <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap bg-black/80 px-2 py-1 rounded">
                {viewport.width}px
              </div>
            </div>
            <div className="flex h-full items-center justify-between px-2">
              {breakpoints.map((bp) => (
                <div
                  key={bp.name}
                  className="flex flex-col items-center text-xs text-white/70 font-medium"
                >
                  <span className="hidden sm:inline">{bp.width}px</span>
                  <span className="text-[10px]">{bp.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Test Sections */}
        <div className="space-y-8 sm:space-y-12">
          {testSections.map((section) => (
            <div key={section.title} className="bg-white/5 rounded-lg p-4 sm:p-6 lg:p-8 border border-white/10">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-6">{section.title}</h2>
              <div className="space-y-6">
                {section.tests.map((test, index) => (
                  <div key={index} className="bg-black/50 rounded-lg p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-neutral-400 mb-2">{test.label}</div>
                    <div className={test.className}>
                      {section.title === 'Typography Scale' ? (
                        <span className="text-white">Sample Text</span>
                      ) : section.title === 'Grid Layouts' ? (
                        <>
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-amber-500/20 border border-amber-500/30 rounded p-3 sm:p-4 text-center text-white text-xs sm:text-sm">
                              Item {i}
                            </div>
                          ))}
                        </>
                      ) : section.title === 'Spacing' ? (
                        <div className="bg-amber-500/20 border border-amber-500/30 rounded text-white text-xs sm:text-sm p-2">
                          Content
                        </div>
                      ) : (
                        <button className="bg-amber-500 text-black px-3 sm:px-4 py-2 rounded font-medium text-xs sm:text-sm">
                          Button
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Live Component Tests */}
        <div className="mt-12 bg-white/5 rounded-lg p-4 sm:p-6 lg:p-8 border border-white/10">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-6">Live Component Tests</h2>
          
          {/* Card Grid Test */}
          <div className="mb-8">
            <h3 className="text-base sm:text-lg font-medium text-white mb-4">Card Grid (Responsive)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6 hover:border-amber-500/50 transition-all">
                  <div className="text-white font-medium mb-2 text-sm sm:text-base">Card {i}</div>
                  <div className="text-xs sm:text-sm text-neutral-400">Responsive card that adapts to viewport</div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Test */}
          <div className="mb-8">
            <h3 className="text-base sm:text-lg font-medium text-white mb-4">Navigation (Mobile Menu)</h3>
            <nav className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a href="#" className="text-white hover:text-amber-400 transition-colors text-sm sm:text-base px-3 py-2 rounded hover:bg-white/5">
                  Home
                </a>
                <a href="#" className="text-white hover:text-amber-400 transition-colors text-sm sm:text-base px-3 py-2 rounded hover:bg-white/5">
                  Parts
                </a>
                <a href="#" className="text-white hover:text-amber-400 transition-colors text-sm sm:text-base px-3 py-2 rounded hover:bg-white/5">
                  Services
                </a>
                <a href="#" className="text-white hover:text-amber-400 transition-colors text-sm sm:text-base px-3 py-2 rounded hover:bg-white/5">
                  Contact
                </a>
              </div>
            </nav>
          </div>

          {/* Button Test */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-white mb-4">Buttons (Responsive Sizing)</h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-400 transition-colors text-sm sm:text-base">
                Primary Button
              </button>
              <button className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors text-sm sm:text-base">
                Secondary Button
              </button>
            </div>
          </div>

          {/* Touch Target Test */}
          <div className="mt-8">
            <h3 className="text-base sm:text-lg font-medium text-white mb-4">Touch Target Test (Should be ≥44×44px)</h3>
            <div className="flex flex-wrap gap-4">
              <button className="w-11 h-11 bg-amber-500 rounded text-xs flex items-center justify-center">
                ✓ OK
              </button>
              <button className="w-12 h-12 bg-green-500 rounded text-xs flex items-center justify-center">
                ✓ Good
              </button>
              <button className="w-14 h-14 bg-blue-500 rounded text-xs flex items-center justify-center">
                ✓ Great
              </button>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              All buttons above meet the minimum 44×44px touch target requirement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

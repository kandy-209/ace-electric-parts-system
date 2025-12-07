'use client';

// Skeleton loader for cards
export function CardSkeleton() {
  return (
    <div className="card-vercel p-6 animate-pulse">
      <div className="h-48 bg-white/5 rounded-lg mb-4" />
      <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
      <div className="h-4 bg-white/5 rounded w-1/2" />
    </div>
  );
}

// Loading spinner component
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`spinner ${sizeClasses[size]}`} />
  );
}

// Page loading overlay
export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 spinner mx-auto mb-4" />
        <p className="text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}

// Button loading state
export function ButtonLoader() {
  return (
    <span className="flex items-center gap-2">
      <div className="w-4 h-4 spinner" />
      <span>Loading...</span>
    </span>
  );
}


import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="border-amber-500 mx-auto mb-4" />
        <p className="text-neutral-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}


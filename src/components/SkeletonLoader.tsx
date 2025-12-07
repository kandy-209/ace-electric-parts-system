'use client';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
  lines?: number;
  variant?: 'text' | 'card' | 'avatar' | 'button';
}

export default function SkeletonLoader({
  width,
  height,
  className = '',
  lines = 1,
  variant = 'text',
}: SkeletonLoaderProps) {
  if (variant === 'card') {
    return (
      <div className={`skeleton rounded-lg ${height || 'h-64'} ${className}`} />
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={`skeleton rounded-full ${width || 'w-12'} ${height || 'w-12'} ${className}`} />
    );
  }

  if (variant === 'button') {
    return (
      <div className={`skeleton rounded-lg ${width || 'w-32'} ${height || 'h-10'} ${className}`} />
    );
  }

  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton rounded ${i < lines - 1 ? 'mb-2' : ''} ${height || 'h-4'}`}
          style={{ width: i === lines - 1 ? width || '100%' : width || '100%' }}
        />
      ))}
    </div>
  );
}


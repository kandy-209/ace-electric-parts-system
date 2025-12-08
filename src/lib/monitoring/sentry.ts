/**
 * Sentry Error Tracking
 * Enterprise-grade error monitoring and performance tracking
 */

let sentryInitialized = false;

export async function initSentry() {
  if (sentryInitialized || process.env.NODE_ENV === 'test') {
    return;
  }

  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  
  if (!dsn) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Sentry DSN not configured. Error tracking disabled in production.');
    }
    return;
  }

  try {
    // Dynamic import to avoid bundle size issues if not installed
    const Sentry = await import('@sentry/nextjs');
    
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV || 'development',
      
      // Performance monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Debug mode
      debug: process.env.NODE_ENV === 'development',
      
      // Release tracking
      release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      
      // Enhanced error filtering
      beforeSend(event, hint) {
        // Filter out non-critical errors in production
        if (process.env.NODE_ENV === 'production') {
          // Don't send client-side errors for 4xx status codes
          if (event.request?.headers?.['x-status-code']) {
            const statusCode = parseInt(event.request.headers['x-status-code'] as string);
            if (statusCode >= 400 && statusCode < 500) {
              return null; // Don't send client errors
            }
          }
          
          // Filter out known browser quirks
          if (event.exception) {
            const errorMessage = event.exception.values?.[0]?.value || '';
            const ignorePatterns = [
              'ResizeObserver',
              'Non-Error promise rejection',
              'NetworkError',
              'Failed to fetch',
              'ChunkLoadError',
            ];
            
            if (ignorePatterns.some((pattern) => errorMessage.includes(pattern))) {
              return null;
            }
          }
        }
        
        return event;
      },
      
      // Add custom tags
      initialScope: {
        tags: {
          service: 'ace-electric-parts-system',
        },
      },
      
      // Integration settings
      integrations: [
        // Add browser tracing for better performance monitoring
        ...(typeof window !== 'undefined'
          ? [
              new (await import('@sentry/nextjs')).BrowserTracing({
                // Performance monitoring
                tracePropagationTargets: ['localhost', /^\//],
              }),
            ]
          : []),
      ],
    });

    sentryInitialized = true;
    console.log('✅ Sentry initialized');
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
}

export function captureException(error: Error, context?: Record<string, any>): void {
  if (!sentryInitialized) return;
  
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.captureException(error, {
      extra: context,
    });
  });
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>): void {
  if (!sentryInitialized) return;
  
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.captureMessage(message, {
      level: level as any,
      extra: context,
    });
  });
}

export function setUser(user: { id: string; email?: string; username?: string }): void {
  if (!sentryInitialized) return;
  
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.setUser(user);
  });
}

export function addBreadcrumb(message: string, category: string, level: 'info' | 'warning' | 'error' = 'info', data?: Record<string, any>): void {
  if (!sentryInitialized) return;
  
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.addBreadcrumb({
      message,
      category,
      level: level as any,
      data,
    });
  });
}

// Initialize on module load (server-side only)
if (typeof window === 'undefined') {
  initSentry().catch(console.error);
}


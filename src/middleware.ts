import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRateLimitIdentifier, rateLimit, rateLimiters } from '@/lib/security/rate-limiter';
import { extractRequestMetadata, createAuditLog, auditActions, resourceTypes } from '@/lib/security/audit-log';
import { logger } from '@/lib/monitoring/logger';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const startTime = Date.now();

  // Skip rate limiting for static assets and API health checks
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/api/health'
  ) {
    return NextResponse.next();
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    try {
      const identifier = getRateLimitIdentifier(request);
      
      // Different rate limits based on endpoint
      let config = rateLimiters.standard;
      
      if (pathname.includes('/search') || pathname.includes('/discover')) {
        config = rateLimiters.search;
      } else if (pathname.includes('/upload') || pathname.includes('/import')) {
        config = rateLimiters.upload;
      } else if (pathname.includes('/admin')) {
        config = rateLimiters.strict;
      }

      const rateLimitResult = await rateLimit(identifier, config);

      // Log rate limit attempts
      if (!rateLimitResult.allowed) {
        const metadata = extractRequestMetadata(request);
        await createAuditLog({
          action: auditActions.rateLimitExceeded,
          resource_type: resourceTypes.api,
          ip_address: metadata.ip_address,
          user_agent: metadata.user_agent,
          metadata: {
            endpoint: pathname,
            identifier,
            total: rateLimitResult.total,
          },
          severity: 'medium',
          status: 'failure',
        });

        logger.security('Rate limit exceeded', {
          identifier,
          endpoint: pathname,
          total: rateLimitResult.total,
        });

        return NextResponse.json(
          {
            error: 'Too many requests',
            message: 'Rate limit exceeded. Please try again later.',
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': config.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimitResult.reset.getTime().toString(),
              'Retry-After': Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000).toString(),
            },
          }
        );
      }

      // Add rate limit headers to successful responses
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.getTime().toString());

      return response;
    } catch (error) {
      // Don't block request if rate limiting fails
      logger.error('Rate limiting error', error as Error);
      return NextResponse.next();
    }
  }

  // Security headers for all responses
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // Performance header
  const duration = Date.now() - startTime;
  response.headers.set('X-Response-Time', `${duration}ms`);

  // Log slow requests
  if (duration > 1000) {
    logger.warn('Slow request detected', {
      pathname,
      duration,
      method: request.method,
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};


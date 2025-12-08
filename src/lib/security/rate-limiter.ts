/**
 * Enterprise Rate Limiting
 * Distributed rate limiting with Redis fallback to in-memory
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: Date;
  total: number;
}

// In-memory fallback store
const memoryStore = new Map<string, { count: number; resetTime: number }>();

async function getRedisClient() {
  try {
    const { Redis } = await import('@upstash/redis');
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
      return new Redis({ url: redisUrl, token: redisToken });
    }
  } catch (error) {
    console.warn('Redis not available, using in-memory store');
  }
  return null;
}

function generateKey(identifier: string, windowMs: number): string {
  const window = Math.floor(Date.now() / windowMs);
  return `rate_limit:${identifier}:${window}`;
}

async function getMemoryCount(key: string, windowMs: number): Promise<number> {
  const entry = memoryStore.get(key);
  if (!entry) return 0;
  
  if (Date.now() > entry.resetTime) {
    memoryStore.delete(key);
    return 0;
  }
  
  return entry.count;
}

async function incrementMemoryCount(key: string, windowMs: number): Promise<number> {
  const entry = memoryStore.get(key);
  const resetTime = Date.now() + windowMs;
  
  if (!entry || Date.now() > entry.resetTime) {
    memoryStore.set(key, { count: 1, resetTime });
    return 1;
  }
  
  entry.count++;
  return entry.count;
}

/**
 * Rate limiter with Redis and in-memory fallback
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { windowMs, maxRequests } = config;
  const key = generateKey(identifier, windowMs);
  const reset = new Date(Date.now() + windowMs);

  try {
    const redis = await getRedisClient();
    
    if (redis) {
      // Redis implementation
      const pipeline = redis.pipeline();
      pipeline.incr(key);
      pipeline.expire(key, Math.ceil(windowMs / 1000));
      const results = await pipeline.exec();
      
      const count = results[0] as number;
      const total = count;
      const remaining = Math.max(0, maxRequests - count);
      const allowed = count <= maxRequests;
      
      return {
        allowed,
        remaining,
        reset,
        total,
      };
    }
  } catch (error) {
    console.error('Redis rate limit error:', error);
  }

  // Fallback to in-memory
  const count = await incrementMemoryCount(key, windowMs);
  const total = count;
  const remaining = Math.max(0, maxRequests - count);
  const allowed = count <= maxRequests;

  return {
    allowed,
    remaining,
    reset,
    total,
  };
}

/**
 * Get rate limit identifier from request
 */
export function getRateLimitIdentifier(req: Request): string {
  // Try to get user ID from headers (if authenticated)
  const userId = req.headers.get('x-user-id');
  if (userId) {
    return `user:${userId}`;
  }

  // Fallback to IP address
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  return `ip:${ip}`;
}

/**
 * Rate limit middleware for API routes
 */
export async function withRateLimit(
  req: Request,
  config: RateLimitConfig,
  handler: () => Promise<Response>
): Promise<Response> {
  const identifier = config.keyGenerator
    ? config.keyGenerator(req)
    : getRateLimitIdentifier(req);

  const result = await rateLimit(identifier, config);

  // Set rate limit headers
  const headers = new Headers({
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.getTime().toString(),
  });

  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again after ${result.reset.toISOString()}`,
      }),
      {
        status: 429,
        headers: {
          ...Object.fromEntries(headers),
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((result.reset.getTime() - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  try {
    const response = await handler();
    
    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.reset.getTime().toString());
    
    return response;
  } catch (error) {
    // Re-throw error but don't count failed requests if configured
    if (!config.skipFailedRequests) {
      // Could decrement here if needed
    }
    throw error;
  }
}

/**
 * Pre-configured rate limiters
 */
export const rateLimiters = {
  // Strict: 10 requests per minute
  strict: {
    windowMs: 60 * 1000,
    maxRequests: 10,
  },
  
  // Standard: 60 requests per minute
  standard: {
    windowMs: 60 * 1000,
    maxRequests: 60,
  },
  
  // Generous: 100 requests per minute
  generous: {
    windowMs: 60 * 1000,
    maxRequests: 100,
  },
  
  // API: 1000 requests per hour
  api: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 1000,
  },
  
  // Search: 20 requests per minute
  search: {
    windowMs: 60 * 1000,
    maxRequests: 20,
  },
  
  // File Upload: 5 requests per minute
  upload: {
    windowMs: 60 * 1000,
    maxRequests: 5,
  },
};


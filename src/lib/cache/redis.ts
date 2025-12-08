/**
 * Enterprise Caching Layer
 * Redis-based caching with in-memory fallback
 */

let redisClient: any = null;

async function getRedisClient() {
  if (redisClient) return redisClient;

  try {
    const { Redis } = await import('@upstash/redis');
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
      redisClient = new Redis({ url: redisUrl, token: redisToken });
      return redisClient;
    }
  } catch (error) {
    console.warn('Redis not available, using in-memory cache');
  }
  return null;
}

// In-memory fallback cache
const memoryCache = new Map<string, { value: any; expires: number }>();

function cleanupMemoryCache() {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expires < now) {
      memoryCache.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupMemoryCache, 5 * 60 * 1000);
}

/**
 * Get value from cache
 */
export async function get<T>(key: string): Promise<T | null> {
  try {
    const redis = await getRedisClient();
    
    if (redis) {
      const value = await redis.get(key);
      return value as T | null;
    }
  } catch (error) {
    console.error('Redis get error:', error);
  }

  // Fallback to memory
  const entry = memoryCache.get(key);
  if (!entry) return null;
  
  if (entry.expires < Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  
  return entry.value as T;
}

/**
 * Set value in cache
 */
export async function set(key: string, value: any, ttlSeconds?: number): Promise<void> {
  try {
    const redis = await getRedisClient();
    
    if (redis) {
      if (ttlSeconds) {
        await redis.setex(key, ttlSeconds, JSON.stringify(value));
      } else {
        await redis.set(key, JSON.stringify(value));
      }
      return;
    }
  } catch (error) {
    console.error('Redis set error:', error);
  }

  // Fallback to memory
  const expires = ttlSeconds ? Date.now() + ttlSeconds * 1000 : Number.MAX_SAFE_INTEGER;
  memoryCache.set(key, { value, expires });
}

/**
 * Delete value from cache
 */
export async function del(key: string): Promise<void> {
  try {
    const redis = await getRedisClient();
    
    if (redis) {
      await redis.del(key);
      return;
    }
  } catch (error) {
    console.error('Redis del error:', error);
  }

  // Fallback to memory
  memoryCache.delete(key);
}

/**
 * Check if key exists in cache
 */
export async function exists(key: string): Promise<boolean> {
  try {
    const redis = await getRedisClient();
    
    if (redis) {
      const result = await redis.exists(key);
      return result === 1;
    }
  } catch (error) {
    console.error('Redis exists error:', error);
  }

  // Fallback to memory
  const entry = memoryCache.get(key);
  return entry ? entry.expires >= Date.now() : false;
}

/**
 * Clear all cache (use with caution)
 */
export async function clear(): Promise<void> {
  try {
    const redis = await getRedisClient();
    
    if (redis) {
      await redis.flushdb();
      return;
    }
  } catch (error) {
    console.error('Redis clear error:', error);
  }

  // Fallback to memory
  memoryCache.clear();
}

/**
 * Cache wrapper for async functions
 */
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  const cached = await get<T>(key);
  if (cached !== null) {
    return cached;
  }

  const value = await fn();
  await set(key, value, ttlSeconds);
  return value;
}

/**
 * Generate cache key
 */
export function cacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`;
}


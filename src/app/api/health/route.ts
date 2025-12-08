/**
 * Comprehensive Health Check Endpoint
 * Enterprise-grade health monitoring
 */

import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';
import { logger } from '@/lib/monitoring/logger';

interface HealthCheck {
  status: 'ok' | 'degraded' | 'down';
  component: string;
  message?: string;
  latency?: number;
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('parts').select('count').limit(1);
    const latency = Date.now() - start;

    if (error) {
      return {
        status: 'down',
        component: 'database',
        message: error.message,
        latency,
      };
    }

    return {
      status: 'ok',
      component: 'database',
      latency,
    };
  } catch (error: any) {
    return {
      status: 'down',
      component: 'database',
      message: error.message,
      latency: Date.now() - start,
    };
  }
}

async function checkRedis(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // Try to use Redis if available
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) {
      return {
        status: 'degraded',
        component: 'redis',
        message: 'Redis not configured (using in-memory fallback)',
      };
    }

    // Simple ping test
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({ url: redisUrl, token: redisToken });
    await redis.ping();
    const latency = Date.now() - start;

    return {
      status: 'ok',
      component: 'redis',
      latency,
    };
  } catch (error: any) {
    return {
      status: 'degraded',
      component: 'redis',
      message: error.message,
      latency: Date.now() - start,
    };
  }
}

export async function GET() {
  const startTime = Date.now();
  const checks: HealthCheck[] = [];

  // Run all health checks in parallel
  const [dbCheck, redisCheck] = await Promise.all([
    checkDatabase(),
    checkRedis(),
  ]);

  checks.push(dbCheck, redisCheck);

  // Determine overall status
  const hasDown = checks.some((check) => check.status === 'down');
  const hasDegraded = checks.some((check) => check.status === 'degraded');

  const overallStatus = hasDown ? 'down' : hasDegraded ? 'degraded' : 'ok';
  const statusCode = hasDown ? 503 : hasDegraded ? 200 : 200;

  const response = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: dbCheck,
      redis: redisCheck,
    },
    responseTime: Date.now() - startTime,
  };

  // Log health check
  if (overallStatus !== 'ok') {
    logger.warn('Health check issues detected', {
      status: overallStatus,
      checks: checks.filter((c) => c.status !== 'ok'),
    });
  }

  return NextResponse.json(response, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

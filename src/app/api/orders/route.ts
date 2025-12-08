/**
 * API Route: Order Management (Enterprise Version)
 * GET: List orders with filters
 * POST: Create new order from quote
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';
import { withRateLimit, rateLimiters } from '@/lib/security/rate-limiter';
import { createAuditLog, auditActions, resourceTypes, extractRequestMetadata } from '@/lib/security/audit-log';
import { logger } from '@/lib/monitoring/logger';
import { get as cacheGet, set as cacheSet, del as cacheDel, cacheKey } from '@/lib/cache/redis';
import { captureException } from '@/lib/monitoring/sentry';

export async function GET(request: NextRequest) {
  return withRateLimit(
    request,
    rateLimiters.standard,
    async () => {
      const startTime = Date.now();
      const metadata = extractRequestMetadata(request);
      
      try {
        const { searchParams } = new URL(request.url);
        const customer_id = searchParams.get('customer_id');
        const vendor_id = searchParams.get('vendor_id');
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Generate cache key
        const cacheKeyStr = cacheKey(
          'orders',
          customer_id || 'all',
          vendor_id || 'all',
          status || 'all',
          limit,
          offset
        );

        // Try to get from cache
        const cachedResult = await cacheGet(cacheKeyStr);
        if (cachedResult) {
          logger.performance('orders_api_cache_hit', Date.now() - startTime);
          
          await createAuditLog({
            action: auditActions.dataView,
            resource_type: resourceTypes.order,
            ip_address: metadata.ip_address,
            user_agent: metadata.user_agent,
            status: 'success',
            metadata: { cached: true, limit, offset },
          });

          return NextResponse.json(cachedResult);
        }

        const supabase = createSupabaseAdmin();
        let query = supabase.from('orders').select('*');

        if (customer_id) {
          query = query.eq('customer_id', customer_id);
        }
        if (vendor_id) {
          query = query.eq('vendor_id', vendor_id);
        }
        if (status) {
          query = query.eq('status', status);
        }

        query = query.order('order_date', { ascending: false }).range(offset, offset + limit - 1);

        const { data: orders, error } = await query;

        if (error) {
          throw error;
        }

        const result = {
          orders: orders || [],
          count: orders?.length || 0,
        };

        // Cache for 5 minutes
        await cacheSet(cacheKeyStr, result, 300);

        logger.performance('orders_api_query', Date.now() - startTime, {
          count: result.count,
        });

        await createAuditLog({
          action: auditActions.dataView,
          resource_type: resourceTypes.order,
          ip_address: metadata.ip_address,
          user_agent: metadata.user_agent,
          status: 'success',
          metadata: { count: result.count, limit, offset },
        });

        return NextResponse.json(result);
      } catch (error: any) {
        logger.error('Get orders error', error, {
          endpoint: '/api/orders',
          ...metadata,
        });
        
        captureException(error as Error, {
          endpoint: '/api/orders',
          method: 'GET',
        });

        await createAuditLog({
          action: auditActions.apiError,
          resource_type: resourceTypes.api,
          ip_address: metadata.ip_address,
          user_agent: metadata.user_agent,
          status: 'error',
          error_message: error.message,
          severity: 'medium',
          metadata: { endpoint: '/api/orders' },
        });

        return NextResponse.json(
          { error: 'Failed to fetch orders', details: error.message },
          { status: 500 }
        );
      }
    }
  );
}

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    rateLimiters.standard,
    async () => {
      const metadata = extractRequestMetadata(request);
      
      try {
        const body = await request.json();
        const { customer_id, vendor_id, order_items, ...orderData } = body;

        if (!customer_id || !order_items || !Array.isArray(order_items) || order_items.length === 0) {
          return NextResponse.json(
            { error: 'Invalid request: customer_id and order_items required' },
            { status: 400 }
          );
        }

        const supabase = createSupabaseAdmin();

        // Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            ...orderData,
            customer_id,
            vendor_id,
            order_date: new Date().toISOString(),
            status: 'pending',
          })
          .select()
          .single();

        if (orderError) {
          throw orderError;
        }

        // Create order items (if order_items table exists)
        // This would require order_items table in database

        // Invalidate cache
        await cacheDel(cacheKey('orders'));

        logger.info('Order created', {
          order_id: order.id,
          customer_id,
          ...metadata,
        });

        await createAuditLog({
          action: auditActions.orderPlaced,
          resource_type: resourceTypes.order,
          resource_id: order.id,
          ip_address: metadata.ip_address,
          user_agent: metadata.user_agent,
          status: 'success',
          metadata: { customer_id, vendor_id },
        });

        return NextResponse.json({ order }, { status: 201 });
      } catch (error: any) {
        logger.error('Create order error', error, {
          endpoint: '/api/orders',
          ...metadata,
        });
        
        captureException(error as Error, {
          endpoint: '/api/orders',
          method: 'POST',
        });

        await createAuditLog({
          action: auditActions.orderPlaced,
          resource_type: resourceTypes.order,
          ip_address: metadata.ip_address,
          user_agent: metadata.user_agent,
          status: 'error',
          error_message: error.message,
          severity: 'high',
          metadata: { endpoint: '/api/orders' },
        });

        return NextResponse.json(
          { error: 'Failed to create order', details: error.message },
          { status: 500 }
        );
      }
    }
  );
}

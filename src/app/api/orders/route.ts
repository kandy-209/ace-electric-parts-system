/**
 * API Route: Order Management
 * GET: List orders with filters
 * POST: Create new order from quote
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customer_id = searchParams.get('customer_id');
    const vendor_id = searchParams.get('vendor_id');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

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

    return NextResponse.json({
      orders: orders || [],
      count: orders?.length || 0,
    });
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      quote_id,
      rfq_id,
      vendor_id,
      customer_id,
      customer_name,
      sales_rep_id,
      line_items,
      subtotal,
      tax,
      shipping,
      total,
      expected_delivery_date,
      shipping_address,
      payment_terms,
    } = body;

    if (!vendor_id || !customer_id || !customer_name || !line_items || !total) {
      return NextResponse.json(
        { error: 'Missing required fields: vendor_id, customer_id, customer_name, line_items, total' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        quote_id,
        rfq_id,
        vendor_id,
        customer_id,
        customer_name,
        sales_rep_id,
        line_items: Array.isArray(line_items) ? line_items : [line_items],
        subtotal: subtotal || total - (tax || 0) - (shipping || 0),
        tax: tax || 0,
        shipping: shipping || 0,
        total,
        status: 'pending',
        expected_delivery_date: expected_delivery_date ? new Date(expected_delivery_date).toISOString() : null,
        shipping_address: shipping_address || {},
        payment_terms: payment_terms || 'Net 30',
        payment_status: 'pending',
        created_by: 'system', // TODO: Get from auth
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    // Update RFQ status if linked
    if (rfq_id) {
      await supabase
        .from('rfqs')
        .update({
          status: 'awarded',
          awarded_vendor_id: vendor_id,
          awarded_quote_id: quote_id,
        })
        .eq('rfq_id', rfq_id);
    }

    return NextResponse.json({
      success: true,
      order_id: order.order_id,
      order_number: order.order_number,
      order,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}


/**
 * API Route: Individual Order Operations
 * GET: Get order details
 * PUT: Update order
 * POST: Order actions (cancel, ship, receive)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const supabase = createSupabaseAdmin();

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const supabase = createSupabaseAdmin();

    const { data: order, error } = await supabase
      .from('orders')
      .update(body)
      .eq('order_id', orderId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Failed to update order', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();
    let updateData: Record<string, any> = {};

    switch (action) {
      case 'cancel':
        updateData = { status: 'cancelled' };
        break;
      case 'confirm':
        updateData = { status: 'confirmed' };
        break;
      case 'ship':
        updateData = {
          status: 'shipped',
          tracking_number: body.tracking_number,
          shipping_carrier: body.shipping_carrier,
        };
        break;
      case 'receive':
        updateData = {
          status: 'delivered',
          actual_delivery_date: new Date().toISOString(),
        };
        break;
      case 'complete':
        updateData = { status: 'completed' };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('order_id', orderId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('Order action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform action', details: error.message },
      { status: 500 }
    );
  }
}


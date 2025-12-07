/**
 * API Route: Individual Vendor Operations
 * GET: Get vendor details
 * PUT: Update vendor
 * DELETE: Delete vendor (soft delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  try {
    const { vendorId } = await params;
    const supabase = createSupabaseAdmin();

    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('vendor_id', vendorId)
      .single();

    if (error || !vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Get vendor performance metrics
    const { data: quotes } = await supabase
      .from('vendor_quotes')
      .select('total, quote_date')
      .eq('vendor_id', vendorId);

    const { data: orders } = await supabase
      .from('orders')
      .select('total, order_date')
      .eq('vendor_id', vendorId);

    // Get recent RFQs
    const { data: rfqs } = await supabase
      .from('rfq_vendors')
      .select('rfq_id, response_received, sent_date')
      .eq('vendor_id', vendorId)
      .order('sent_date', { ascending: false })
      .limit(10);

    return NextResponse.json({
      vendor,
      metrics: {
        total_quotes: quotes?.length || 0,
        total_orders: orders?.length || 0,
        total_revenue: orders?.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0) || 0,
        recent_rfqs: rfqs || [],
      },
    });
  } catch (error: any) {
    console.error('Get vendor error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendor', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  try {
    const { vendorId } = await params;
    const body = await request.json();
    const supabase = createSupabaseAdmin();

    const { data: vendor, error } = await supabase
      .from('vendors')
      .update(body)
      .eq('vendor_id', vendorId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      vendor,
    });
  } catch (error: any) {
    console.error('Update vendor error:', error);
    return NextResponse.json(
      { error: 'Failed to update vendor', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  try {
    const { vendorId } = await params;
    const supabase = createSupabaseAdmin();

    // Soft delete - just mark as inactive
    const { error } = await supabase
      .from('vendors')
      .update({ is_verified: false, notes: 'Deleted' })
      .eq('vendor_id', vendorId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Vendor deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete vendor error:', error);
    return NextResponse.json(
      { error: 'Failed to delete vendor', details: error.message },
      { status: 500 }
    );
  }
}


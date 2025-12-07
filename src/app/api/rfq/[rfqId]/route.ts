/**
 * API Route: Individual RFQ Operations
 * GET: Get RFQ details with quotes
 * PUT: Update RFQ
 * DELETE: Cancel RFQ
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rfqId: string }> }
) {
  try {
    const { rfqId } = await params;
    const supabase = createSupabaseAdmin();

    // Get RFQ
    const { data: rfq, error: rfqError } = await supabase
      .from('rfqs')
      .select('*')
      .eq('rfq_id', rfqId)
      .single();

    if (rfqError || !rfq) {
      return NextResponse.json(
        { error: 'RFQ not found' },
        { status: 404 }
      );
    }

    // Get vendors contacted
    const { data: rfqVendors } = await supabase
      .from('rfq_vendors')
      .select(`
        *,
        vendors:vendor_id (
          vendor_id,
          vendor_name,
          contact_email,
          is_verified
        )
      `)
      .eq('rfq_id', rfqId);

    // Get quotes received
    const { data: quotes } = await supabase
      .from('vendor_quotes')
      .select(`
        *,
        vendors:vendor_id (
          vendor_id,
          vendor_name
        )
      `)
      .in('rfq_vendor_id', rfqVendors?.map((rv) => rv.rfq_vendor_id) || []);

    return NextResponse.json({
      rfq,
      vendors_contacted: rfqVendors || [],
      quotes_received: quotes || [],
      stats: {
        vendors_contacted: rfqVendors?.length || 0,
        quotes_received: quotes?.length || 0,
        lowest_quote: quotes?.length ? Math.min(...quotes.map((q) => parseFloat(q.total) || 0)) : null,
        highest_quote: quotes?.length ? Math.max(...quotes.map((q) => parseFloat(q.total) || 0)) : null,
      },
    });
  } catch (error: any) {
    console.error('Get RFQ error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RFQ', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ rfqId: string }> }
) {
  try {
    const { rfqId } = await params;
    const body = await request.json();
    const supabase = createSupabaseAdmin();

    const { data: rfq, error } = await supabase
      .from('rfqs')
      .update(body)
      .eq('rfq_id', rfqId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      rfq,
    });
  } catch (error: any) {
    console.error('Update RFQ error:', error);
    return NextResponse.json(
      { error: 'Failed to update RFQ', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ rfqId: string }> }
) {
  try {
    const { rfqId } = await params;
    const supabase = createSupabaseAdmin();

    // Update status to cancelled instead of deleting
    const { error } = await supabase
      .from('rfqs')
      .update({ status: 'expired' })
      .eq('rfq_id', rfqId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'RFQ cancelled successfully',
    });
  } catch (error: any) {
    console.error('Cancel RFQ error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel RFQ', details: error.message },
      { status: 500 }
    );
  }
}


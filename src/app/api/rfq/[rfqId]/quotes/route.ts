/**
 * API Route: Get quotes for an RFQ
 * GET: List all quotes received for an RFQ
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

    // Get RFQ vendor relationships
    const { data: rfqVendors } = await supabase
      .from('rfq_vendors')
      .select('rfq_vendor_id')
      .eq('rfq_id', rfqId);

    if (!rfqVendors || rfqVendors.length === 0) {
      return NextResponse.json({
        quotes: [],
        count: 0,
      });
    }

    const rfqVendorIds = rfqVendors.map((rv) => rv.rfq_vendor_id);

    // Get quotes
    const { data: quotes, error } = await supabase
      .from('vendor_quotes')
      .select(`
        *,
        vendors:vendor_id (
          vendor_id,
          vendor_name,
          contact_email,
          quality_rating,
          is_preferred
        )
      `)
      .in('rfq_vendor_id', rfqVendorIds)
      .order('total', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      quotes: quotes || [],
      count: quotes?.length || 0,
    });
  } catch (error: any) {
    console.error('Get RFQ quotes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes', details: error.message },
      { status: 500 }
    );
  }
}


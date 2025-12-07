/**
 * API Route: Sales dashboard statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin();

    // Active RFQs
    const { count: activeRfqs } = await supabase
      .from('rfqs')
      .select('*', { count: 'exact', head: true })
      .in('status', ['draft', 'sent', 'quotes_received', 'comparing']);

    // Quotes received
    const { count: quotesReceived } = await supabase
      .from('vendor_quotes')
      .select('*', { count: 'exact', head: true });

    // Vendors contacted
    const { count: vendorsContacted } = await supabase
      .from('rfq_vendors')
      .select('*', { count: 'exact', head: true })
      .not('sent_date', 'is', null);

    // Parts in database
    const { count: partsInDatabase } = await supabase
      .from('parts')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      active_rfqs: activeRfqs || 0,
      quotes_received: quotesReceived || 0,
      vendors_contacted: vendorsContacted || 0,
      parts_in_database: partsInDatabase || 0,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to load stats', details: error.message },
      { status: 500 }
    );
  }
}


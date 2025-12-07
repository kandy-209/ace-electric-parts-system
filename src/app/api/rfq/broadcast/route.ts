/**
 * API Route: Broadcast RFQ to all matching vendors
 */

import { NextRequest, NextResponse } from 'next/server';
import { rfqBroadcastService } from '@/lib/services/rfq-broadcast';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rfq_id, parts_description, technical_requirements, quantity, urgency, due_date, channels } = body;

    if (!rfq_id || !parts_description) {
      return NextResponse.json(
        { error: 'rfq_id and parts_description are required' },
        { status: 400 }
      );
    }

    // Verify RFQ exists
    const supabase = createSupabaseAdmin();
    const { data: rfq, error: rfqError } = await supabase
      .from('rfqs')
      .select('*')
      .eq('rfq_id', rfq_id)
      .single();

    if (rfqError || !rfq) {
      return NextResponse.json(
        { error: 'RFQ not found' },
        { status: 404 }
      );
    }

    // Broadcast RFQ
    const result = await rfqBroadcastService.broadcastRFQ({
      rfq_id,
      parts_description,
      technical_requirements,
      quantity,
      urgency,
      due_date: due_date ? new Date(due_date) : undefined,
      channels,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('RFQ broadcast error:', error);
    return NextResponse.json(
      { error: 'Failed to broadcast RFQ', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET: Find matching vendors for an RFQ (before broadcasting)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parts_description = searchParams.get('parts_description');
    const technical_requirements = searchParams.get('technical_requirements');

    if (!parts_description) {
      return NextResponse.json(
        { error: 'parts_description is required' },
        { status: 400 }
      );
    }

    const requirements = technical_requirements
      ? JSON.parse(technical_requirements)
      : undefined;

    const matches = await rfqBroadcastService.findMatchingVendors(
      parts_description,
      requirements
    );

    return NextResponse.json({ matches, count: matches.length });
  } catch (error: any) {
    console.error('Find vendors error:', error);
    return NextResponse.json(
      { error: 'Failed to find vendors', details: error.message },
      { status: 500 }
    );
  }
}


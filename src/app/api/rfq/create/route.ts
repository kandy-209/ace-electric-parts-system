/**
 * API Route: Create new RFQ
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      parts_description,
      technical_requirements,
      quantity,
      urgency,
      due_date,
    } = body;

    if (!parts_description) {
      return NextResponse.json(
        { error: 'parts_description is required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Generate RFQ number
    const rfqNumber = `RFQ-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create RFQ
    const { data: rfq, error } = await supabase
      .from('rfqs')
      .insert({
        rfq_number: rfqNumber,
        parts_requested: [
          {
            description: parts_description,
            technical_requirements: technical_requirements || {},
            quantity: quantity || 1,
          },
        ],
        due_date: due_date ? new Date(due_date).toISOString() : null,
        status: 'draft',
        created_by: 'system', // TODO: Get from auth
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating RFQ:', error);
      return NextResponse.json(
        { error: 'Failed to create RFQ', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rfq_id: rfq.rfq_id,
      rfq_number: rfq.rfq_number,
      rfq,
    });
  } catch (error: any) {
    console.error('Create RFQ error:', error);
    return NextResponse.json(
      { error: 'Failed to create RFQ', details: error.message },
      { status: 500 }
    );
  }
}


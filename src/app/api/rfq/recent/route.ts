/**
 * API Route: Get recent RFQs
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const supabase = createSupabaseAdmin();

    const { data: rfqs, error } = await supabase
      .from('rfqs')
      .select('*')
      .order('created_date', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      rfqs: rfqs || [],
      count: rfqs?.length || 0,
    });
  } catch (error: any) {
    console.error('Get recent RFQs error:', error);
    return NextResponse.json(
      { error: 'Failed to load RFQs', details: error.message },
      { status: 500 }
    );
  }
}


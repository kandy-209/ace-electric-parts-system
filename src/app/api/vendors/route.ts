/**
 * API Route: Vendor Management
 * GET: List vendors with filters and search
 * POST: Create vendor
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const is_verified = searchParams.get('is_verified');
    const is_preferred = searchParams.get('is_preferred');
    const discovered_via = searchParams.get('discovered_via');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createSupabaseAdmin();
    let query = supabase.from('vendors').select('*');

    if (search) {
      query = query.or(`vendor_name.ilike.%${search}%,contact_email.ilike.%${search}%`);
    }
    if (is_verified !== null) {
      query = query.eq('is_verified', is_verified === 'true');
    }
    if (is_preferred !== null) {
      query = query.eq('is_preferred', is_preferred === 'true');
    }
    if (discovered_via) {
      query = query.eq('discovered_via', discovered_via);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: vendors, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      vendors: vendors || [],
      count: vendors?.length || 0,
    });
  } catch (error: any) {
    console.error('Get vendors error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendors', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vendor_name,
      contact_email,
      contact_phone,
      website,
      address,
      capabilities,
      materials,
      processes,
      certifications,
      discovered_via,
    } = body;

    if (!vendor_name) {
      return NextResponse.json(
        { error: 'vendor_name is required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    const { data: vendor, error } = await supabase
      .from('vendors')
      .insert({
        vendor_name,
        contact_email,
        contact_phone,
        website,
        address: address || {},
        capabilities: capabilities || [],
        materials: materials || [],
        processes: processes || [],
        certifications: certifications || [],
        discovered_via: discovered_via || 'manual',
        is_verified: false,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      vendor_id: vendor.vendor_id,
      vendor,
    });
  } catch (error: any) {
    console.error('Create vendor error:', error);
    return NextResponse.json(
      { error: 'Failed to create vendor', details: error.message },
      { status: 500 }
    );
  }
}


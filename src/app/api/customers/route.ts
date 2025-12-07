/**
 * API Route: Customer Management
 * GET: List customers
 * POST: Create customer
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sales_rep_id = searchParams.get('sales_rep_id');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = createSupabaseAdmin();
    let query = supabase.from('customers').select('*');

    if (sales_rep_id) {
      query = query.eq('assigned_sales_rep_id', sales_rep_id);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`company_name.ilike.%${search}%,contact_name.ilike.%${search}%,contact_email.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false }).limit(limit);

    const { data: customers, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      customers: customers || [],
      count: customers?.length || 0,
    });
  } catch (error: any) {
    console.error('Get customers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_name,
      contact_name,
      contact_email,
      contact_phone,
      industry,
      assigned_sales_rep_id,
      billing_address,
      shipping_address,
    } = body;

    if (!company_name) {
      return NextResponse.json(
        { error: 'company_name is required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Generate customer number
    const customerNumber = `CUST-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const { data: customer, error } = await supabase
      .from('customers')
      .insert({
        customer_number: customerNumber,
        company_name,
        contact_name,
        contact_email,
        contact_phone,
        industry,
        assigned_sales_rep_id,
        billing_address: billing_address || {},
        shipping_address: shipping_address || {},
        status: 'active',
        payment_terms: 'Net 30',
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      customer_id: customer.customer_id,
      customer,
    });
  } catch (error: any) {
    console.error('Create customer error:', error);
    return NextResponse.json(
      { error: 'Failed to create customer', details: error.message },
      { status: 500 }
    );
  }
}


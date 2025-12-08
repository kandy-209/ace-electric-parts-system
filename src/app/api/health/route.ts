import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Missing Supabase environment variables',
          supabase_url_configured: !!supabaseUrl,
          supabase_key_configured: !!supabaseKey
        },
        { status: 500 }
      );
    }

    // Test database connection
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('parts')
      .select('count', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Database connection failed',
          error: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Application is healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: error.message || 'Unknown error' 
      },
      { status: 500 }
    );
  }
}


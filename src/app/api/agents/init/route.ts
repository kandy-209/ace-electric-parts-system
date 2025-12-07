// Initialize agents on server startup

import { NextResponse } from 'next/server';
import { registerAllAgents } from '@/lib/agents';

export async function POST() {
  try {
    registerAllAgents();
    return NextResponse.json({ 
      success: true, 
      message: 'Agents initialized successfully' 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


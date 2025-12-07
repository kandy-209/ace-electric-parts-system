// API Route for Agent Management

import { NextRequest, NextResponse } from 'next/server';
import { agentRegistry, orchestrator } from '@/lib/agents';
import { AgentRequest } from '@/lib/agents/base/AgentOrchestrator';

// List all agents
export async function GET(request: NextRequest) {
  try {
    const agents = agentRegistry.listAgents();
    return NextResponse.json({ agents });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Execute an agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent_id, input } = body;

    if (!agent_id || !input) {
      return NextResponse.json(
        { error: 'Missing agent_id or input' },
        { status: 400 }
      );
    }

    const agentRequest: AgentRequest = {
      agent_id,
      input,
    };

    const result = await orchestrator.execute(agentRequest);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


// API Route for Specific Agent

import { NextRequest, NextResponse } from 'next/server';
import { agentRegistry, orchestrator } from '@/lib/agents';
import { AgentRequest } from '@/lib/agents/base/AgentOrchestrator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const agent = agentRegistry.getAgent(agentId);

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: agent.getId(),
      name: agent.getName(),
      category: agent.getCategory(),
      enabled: agent.isEnabled(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const body = await request.json();
    const { input } = body;

    if (!input) {
      return NextResponse.json(
        { error: 'Missing input' },
        { status: 400 }
      );
    }

    const agentRequest: AgentRequest = {
      agent_id: agentId,
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


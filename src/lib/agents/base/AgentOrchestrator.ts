// Agent Orchestrator - Routes requests to correct agents

import { BaseAgent, AgentInput, AgentOutput } from './Agent';
import { agentRegistry } from './AgentRegistry';

export interface AgentRequest {
  agent_id: string;
  input: AgentInput;
  context?: Record<string, any>;
}

export interface AgentResponse extends AgentOutput {
  agent_id: string;
  agent_name: string;
}

export class AgentOrchestrator {
  async execute(request: AgentRequest): Promise<AgentResponse> {
    const agent = agentRegistry.getAgent(request.agent_id);

    if (!agent) {
      throw new Error(`Agent not found: ${request.agent_id}`);
    }

    if (!agent.isEnabled()) {
      throw new Error(`Agent is disabled: ${request.agent_id}`);
    }

    const startTime = Date.now();

    try {
      // Validate input
      if (!agent.validate(request.input)) {
        throw new Error(`Invalid input for agent: ${request.agent_id}`);
      }

      // Execute agent
      const output = await agent.execute(request.input);

      const executionTime = Date.now() - startTime;

      return {
        ...output,
        agent_id: agent.getId(),
        agent_name: agent.getName(),
        metadata: {
          ...output.metadata,
          agent_id: agent.getId(),
          execution_time_ms: executionTime,
        },
      };
    } catch (error: any) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        error: error.message || 'Agent execution failed',
        agent_id: agent.getId(),
        agent_name: agent.getName(),
        metadata: {
          agent_id: agent.getId(),
          execution_time_ms: executionTime,
        },
      };
    }
  }

  async executeMultiple(requests: AgentRequest[]): Promise<AgentResponse[]> {
    return Promise.all(requests.map(req => this.execute(req)));
  }

  findAgentByIntent(intent: string, category?: string): BaseAgent | null {
    // Simple intent matching - can be enhanced with AI
    const agents = category 
      ? agentRegistry.getAgentsByCategory(category)
      : agentRegistry.getAllAgents();

    // Match agent by name or description containing intent
    return agents.find(agent => 
      agent.getName().toLowerCase().includes(intent.toLowerCase()) ||
      agent.getId().toLowerCase().includes(intent.toLowerCase())
    ) || null;
  }
}

// Singleton instance
export const orchestrator = new AgentOrchestrator();


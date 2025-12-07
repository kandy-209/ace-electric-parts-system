// Agent Registry - Manages all agents

import { BaseAgent, AgentConfig } from './Agent';

export class AgentRegistry {
  private agents: Map<string, BaseAgent> = new Map();
  private agentsByCategory: Map<string, BaseAgent[]> = new Map();

  register(agent: BaseAgent): void {
    if (!agent.isEnabled()) {
      console.warn(`Agent ${agent.getId()} is disabled, skipping registration`);
      return;
    }

    this.agents.set(agent.getId(), agent);
    
    const category = agent.getCategory();
    if (!this.agentsByCategory.has(category)) {
      this.agentsByCategory.set(category, []);
    }
    this.agentsByCategory.get(category)!.push(agent);

    console.log(`Registered agent: ${agent.getName()} (${agent.getId()})`);
  }

  getAgent(id: string): BaseAgent | null {
    return this.agents.get(id) || null;
  }

  getAgentsByCategory(category: string): BaseAgent[] {
    return this.agentsByCategory.get(category) || [];
  }

  getAllAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  listAgents(): AgentConfig[] {
    return this.getAllAgents().map(agent => ({
      id: agent.getId(),
      name: agent.getName(),
      description: agent.constructor.name,
      category: agent.getCategory() as any,
      version: '1.0.0',
      enabled: agent.isEnabled(),
    }));
  }
}

// Singleton instance
export const agentRegistry = new AgentRegistry();


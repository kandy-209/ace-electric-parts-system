// Agent Index - Register all agents

import { agentRegistry } from './base/AgentRegistry';
import { ShopQuotingAgent } from './shop/ShopQuotingAgent';

// Register all agents
export function registerAllAgents() {
  // Shop & Repair Agents
  agentRegistry.register(new ShopQuotingAgent());
  
  // TODO: Register other agents as they're built
  // agentRegistry.register(new RepairWorkflowAgent());
  // agentRegistry.register(new WarrantyTrackerAgent());
  // agentRegistry.register(new PartsIDAgent());
  // ... etc
}

// Export agent registry and orchestrator
export { agentRegistry } from './base/AgentRegistry';
export { orchestrator } from './base/AgentOrchestrator';
export { BaseAgent, AgentInput, AgentOutput } from './base/Agent';


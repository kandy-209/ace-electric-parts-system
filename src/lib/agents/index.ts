// Agent Index - Register all agents

import { agentRegistry } from './base/AgentRegistry';
import { ShopQuotingAgent } from './shop/ShopQuotingAgent';
import { RepairWorkflowAgent } from './shop/RepairWorkflowAgent';
import { WarrantyTrackerAgent } from './shop/WarrantyTrackerAgent';
import { PartsIDAgent } from './shop/PartsIDAgent';
import { InventoryTrackerAgent } from './shop/InventoryTrackerAgent';

// Register all agents
export function registerAllAgents() {
  // Shop & Repair Agents
  agentRegistry.register(new ShopQuotingAgent());
  agentRegistry.register(new RepairWorkflowAgent());
  agentRegistry.register(new WarrantyTrackerAgent());
  agentRegistry.register(new PartsIDAgent());
  agentRegistry.register(new InventoryTrackerAgent());
  
  // TODO: Register remaining agents as they're built
  // Motor Reliability Testing Agent
  // Job Documentation Agent
  // Generator & Pump Report Agent
  // Safety Compliance Agent
  // Field Service Agents (6)
  // Sales & Customer Agents (8)
  // Purchasing & Vendor Agents (4)
  // Reliability & Predictive Agents (5)
  // Training & Internal Support Agents (5)
}

// Export agent registry and orchestrator
export { agentRegistry } from './base/AgentRegistry';
export { orchestrator } from './base/AgentOrchestrator';
export { BaseAgent, AgentInput, AgentOutput } from './base/Agent';


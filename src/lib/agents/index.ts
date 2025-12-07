// Agent Index - Register all agents

import { agentRegistry } from './base/AgentRegistry';
import { ShopQuotingAgent } from './shop/ShopQuotingAgent';
import { RepairWorkflowAgent } from './shop/RepairWorkflowAgent';
import { WarrantyTrackerAgent } from './shop/WarrantyTrackerAgent';
import { PartsIDAgent } from './shop/PartsIDAgent';
import { InventoryTrackerAgent } from './shop/InventoryTrackerAgent';
import { MotorReliabilityTestingAgent } from './shop/MotorReliabilityTestingAgent';
import { JobDocumentationAgent } from './shop/JobDocumentationAgent';
import { GeneratorPumpReportAgent } from './shop/GeneratorPumpReportAgent';
import { SafetyComplianceAgent } from './shop/SafetyComplianceAgent';

// Register all agents
export function registerAllAgents() {
  // Shop & Repair Agents (9 agents - ALL COMPLETE!)
  agentRegistry.register(new ShopQuotingAgent());
  agentRegistry.register(new RepairWorkflowAgent());
  agentRegistry.register(new WarrantyTrackerAgent());
  agentRegistry.register(new PartsIDAgent());
  agentRegistry.register(new InventoryTrackerAgent());
  agentRegistry.register(new MotorReliabilityTestingAgent());
  agentRegistry.register(new JobDocumentationAgent());
  agentRegistry.register(new GeneratorPumpReportAgent());
  agentRegistry.register(new SafetyComplianceAgent());
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


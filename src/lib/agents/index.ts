// Agent Index - Register all 37 AI agents

import { agentRegistry } from './base/AgentRegistry';

// Shop & Repair Agents (9)
import { ShopQuotingAgent } from './shop/ShopQuotingAgent';
import { RepairWorkflowAgent } from './shop/RepairWorkflowAgent';
import { WarrantyTrackerAgent } from './shop/WarrantyTrackerAgent';
import { PartsIDAgent } from './shop/PartsIDAgent';
import { InventoryTrackerAgent } from './shop/InventoryTrackerAgent';
import { MotorReliabilityTestingAgent } from './shop/MotorReliabilityTestingAgent';
import { JobDocumentationAgent } from './shop/JobDocumentationAgent';
import { GeneratorPumpReportAgent } from './shop/GeneratorPumpReportAgent';
import { SafetyComplianceAgent } from './shop/SafetyComplianceAgent';

// Field Service Agents (6)
import { FieldServiceQuotingAgent } from './field/FieldServiceQuotingAgent';
import { DispatchAgent } from './field/DispatchAgent';
import { SiteSafetyAgent } from './field/SiteSafetyAgent';
import { FieldDocumentationAgent } from './field/FieldDocumentationAgent';
import { AlignmentBalancingAgent } from './field/AlignmentBalancingAgent';
import { EmergencyResponseAgent } from './field/EmergencyResponseAgent';

// Sales & Customer Agents (8)
import { SalesQuotingAgent } from './sales/SalesQuotingAgent';
import { InstallationAddOnAgent } from './sales/InstallationAddOnAgent';
import { CustomerPortalAgent } from './sales/CustomerPortalAgent';
import { FollowUpAgent } from './sales/FollowUpAgent';
import { RenewalAgent } from './sales/RenewalAgent';
import { CustomerTrainingAgent } from './sales/CustomerTrainingAgent';
import { MarketingCampaignAgent } from './sales/MarketingCampaignAgent';
import { ResellerSupportAgent } from './sales/ResellerSupportAgent';

// Purchasing & Vendor Agents (4)
import { ProcurementAgent } from './purchasing/ProcurementAgent';
import { VendorTrackerAgent } from './purchasing/VendorTrackerAgent';
import { ObsolescenceAgent } from './purchasing/ObsolescenceAgent';
import { PurchaseApprovalAgent } from './purchasing/PurchaseApprovalAgent';

// Reliability & Predictive Agents (5)
import { PredictiveMaintenanceAgent } from './reliability/PredictiveMaintenanceAgent';
import { RootCauseAnalysisAgent } from './reliability/RootCauseAnalysisAgent';
import { ConditionMonitoringAgent } from './reliability/ConditionMonitoringAgent';
import { BaselineTrackingAgent } from './reliability/BaselineTrackingAgent';
import { FailurePatternAgent } from './reliability/FailurePatternAgent';

// Training & Internal Support Agents (5)
import { TrainingCurriculumAgent } from './training/TrainingCurriculumAgent';
import { TestingQuizAgent } from './training/TestingQuizAgent';
import { LabSetupAgent } from './training/LabSetupAgent';
import { EmployeeOnboardingAgent } from './training/EmployeeOnboardingAgent';
import { PerformanceCoachingAgent } from './training/PerformanceCoachingAgent';

// Register all 37 agents
export function registerAllAgents() {
  // Shop & Repair Agents (9)
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
  agentRegistry.register(new FieldServiceQuotingAgent());
  agentRegistry.register(new DispatchAgent());
  agentRegistry.register(new SiteSafetyAgent());
  agentRegistry.register(new FieldDocumentationAgent());
  agentRegistry.register(new AlignmentBalancingAgent());
  agentRegistry.register(new EmergencyResponseAgent());

  // Sales & Customer Agents (8)
  agentRegistry.register(new SalesQuotingAgent());
  agentRegistry.register(new InstallationAddOnAgent());
  agentRegistry.register(new CustomerPortalAgent());
  agentRegistry.register(new FollowUpAgent());
  agentRegistry.register(new RenewalAgent());
  agentRegistry.register(new CustomerTrainingAgent());
  agentRegistry.register(new MarketingCampaignAgent());
  agentRegistry.register(new ResellerSupportAgent());

  // Purchasing & Vendor Agents (4)
  agentRegistry.register(new ProcurementAgent());
  agentRegistry.register(new VendorTrackerAgent());
  agentRegistry.register(new ObsolescenceAgent());
  agentRegistry.register(new PurchaseApprovalAgent());

  // Reliability & Predictive Agents (5)
  agentRegistry.register(new PredictiveMaintenanceAgent());
  agentRegistry.register(new RootCauseAnalysisAgent());
  agentRegistry.register(new ConditionMonitoringAgent());
  agentRegistry.register(new BaselineTrackingAgent());
  agentRegistry.register(new FailurePatternAgent());

  // Training & Internal Support Agents (5)
  agentRegistry.register(new TrainingCurriculumAgent());
  agentRegistry.register(new TestingQuizAgent());
  agentRegistry.register(new LabSetupAgent());
  agentRegistry.register(new EmployeeOnboardingAgent());
  agentRegistry.register(new PerformanceCoachingAgent());

  console.log('All 37 agents registered successfully!');
}

// Export agent registry and orchestrator
export { agentRegistry } from './base/AgentRegistry';
export { orchestrator } from './base/AgentOrchestrator';
export { BaseAgent, AgentInput, AgentOutput } from './base/Agent';

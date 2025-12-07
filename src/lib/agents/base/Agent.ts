// Base Agent Interface and Implementation

export interface AgentInput {
  [key: string]: any;
}

export interface AgentOutput {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    agent_id: string;
    execution_time_ms: number;
    confidence?: number;
  };
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  category: 'shop' | 'field_service' | 'sales' | 'purchasing' | 'reliability' | 'training';
  version: string;
  enabled: boolean;
}

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected logger: any;

  constructor(config: AgentConfig) {
    this.config = config;
    this.logger = console; // Replace with proper logger
  }

  abstract execute(input: AgentInput): Promise<AgentOutput>;

  validate(input: AgentInput): boolean {
    // Base validation - override in subclasses
    return true;
  }

  getName(): string {
    return this.config.name;
  }

  getId(): string {
    return this.config.id;
  }

  getCategory(): string {
    return this.config.category;
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  protected log(message: string, data?: any): void {
    this.logger.log(`[${this.config.name}] ${message}`, data);
  }

  protected error(message: string, error?: any): void {
    this.logger.error(`[${this.config.name}] ${message}`, error);
  }
}


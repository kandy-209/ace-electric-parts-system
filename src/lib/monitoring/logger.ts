/**
 * Enterprise Structured Logging
 * Production-ready logging with multiple transports
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  service: string;
  environment: string;
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  requestId?: string;
  userId?: string;
}

class Logger {
  private serviceName = 'ace-electric-parts-system';
  private environment = process.env.NODE_ENV || 'development';
  private minLevel: LogLevel;

  constructor() {
    // Set minimum log level based on environment
    this.minLevel = this.environment === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatMessage(entry: Omit<LogEntry, 'timestamp' | 'service' | 'environment'>): string {
    if (this.environment === 'production') {
      // JSON format for production (for log aggregation)
      return JSON.stringify({
        ...entry,
        timestamp: new Date().toISOString(),
        service: this.serviceName,
        environment: this.environment,
      });
    } else {
      // Human-readable format for development
      const levelEmoji = {
        [LogLevel.DEBUG]: '🔍',
        [LogLevel.INFO]: 'ℹ️',
        [LogLevel.WARN]: '⚠️',
        [LogLevel.ERROR]: '❌',
      };
      
      const prefix = `${levelEmoji[entry.level]} [${entry.level.toUpperCase()}]`;
      let message = `${prefix} ${entry.message}`;
      
      if (entry.metadata) {
        message += `\n  Metadata: ${JSON.stringify(entry.metadata, null, 2)}`;
      }
      
      if (entry.error) {
        message += `\n  Error: ${entry.error.name}: ${entry.error.message}`;
        if (entry.error.stack) {
          message += `\n  Stack: ${entry.error.stack}`;
        }
      }
      
      return message;
    }
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: Omit<LogEntry, 'timestamp' | 'service' | 'environment'> = {
      level,
      message,
      metadata,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
      // Extract request ID and user ID from metadata if present
      requestId: metadata?.requestId,
      userId: metadata?.userId,
    };

    const formatted = this.formatMessage(entry);

    // Console output
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
        console.error(formatted);
        break;
    }

    // TODO: Send to log aggregation service (e.g., Datadog, LogRocket, etc.)
    // if (this.environment === 'production' && level >= LogLevel.WARN) {
    //   sendToLogService(entry);
    // }
  }

  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.WARN, message, metadata, error);
  }

  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, metadata, error);
  }

  // Performance logging
  performance(operation: string, durationMs: number, metadata?: Record<string, any>): void {
    this.info(`Performance: ${operation} took ${durationMs}ms`, {
      ...metadata,
      operation,
      durationMs,
      type: 'performance',
    });
  }

  // Security logging
  security(event: string, metadata?: Record<string, any>): void {
    this.warn(`Security Event: ${event}`, {
      ...metadata,
      event,
      type: 'security',
    });
  }
}

export const logger = new Logger();


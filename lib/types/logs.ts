export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  agentId?: string;
  sessionKey?: string;
  context?: Record<string, unknown>;
}

export interface LogsResponse {
  logs: LogEntry[];
  total: number;
  hasMore: boolean;
}

export interface LogsFilter {
  agentId?: string;
  level?: LogLevel;
  limit?: number;
  offset?: number;
}

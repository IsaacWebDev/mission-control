// Core domain types
export interface Agent {
  agentId: string;
  isDefault: boolean;
  status: 'idle' | 'busy' | 'spawned';
  sessionCount: number;
  activeSessions: number;
  lastActivityMs: number | null;
  heartbeat: {
    enabled: boolean;
    intervalMs: number;
  };
  workspace: string;
}

export interface Session {
  sessionId: string;
  sessionKey?: string;
  agentId: string;
  status: 'active' | 'idle';
  createdAt: number;
  updatedAt: number;
  ageMs: number;
}

// Gateway health types
export interface AgentHealthInfo {
  agentId: string;
  isDefault: boolean;
  sessions: {
    count: number;
    recent: Array<{
      updatedAt: number;
      age: number;
    }>;
    path: string;
  };
  heartbeat: {
    enabled: boolean;
    everyMs: number;
  };
}

export interface SystemHealth {
  ok: boolean;
  agents: AgentHealthInfo[];
  channels?: Record<string, { configured: boolean; running: boolean }>;
  heartbeatSeconds?: number;
  gateway?: {
    status: string;
  };
  durationMs?: number;
  timestamp: number;
}

// API response types
export interface AgentListResponse {
  agents: Agent[];
  total: number;
  timestamp: Date;
}

export interface SessionListResponse {
  sessions: Session[];
  total: number;
  active: number;
  timestamp: Date;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: Date;
}

// Filter types
export interface AgentFilter {
  status?: string;
  search?: string;
}

export interface SessionFilter {
  agentId?: string;
  active?: boolean | number;
}

// Logging types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  source?: string;
  context?: string;
  data?: unknown;
}

// WebSocket types
export interface WebSocketMessage {
  type: string;
  payload?: unknown;
  timestamp?: number;
}

// WebSocket types
export interface WebSocketMessage {
  type: string;
  data?: unknown;
  payload?: unknown;
  timestamp?: number;
}

// WebSocket types
export interface WebSocketMessage {
  type: string;
  payload?: unknown;
}

// Legacy error response (for backwards compatibility)
export interface ErrorResponse {
  ok: false;
  error: string;
  message: string;
}

import { Agent } from './agent';
import { Session } from './session';

export interface AgentHealthInfo {
  agentId: string;
  isDefault: boolean;
  sessions: {
    count: number;
    recent: Session[];
    path: string;
  };
  heartbeat: {
    enabled: boolean;
    everyMs: number;
  };
}

export interface SystemHealth {
  gateway: {
    status: 'online' | 'offline' | 'degraded';
    version?: string;
    uptime?: number;
  };
  agents: AgentHealthInfo[];
  channels?: {
    id: string;
    name: string;
    status: 'connected' | 'disconnected';
  }[];
  memory?: {
    used: number;
    total: number;
    percentage: number;
  };
  disk?: {
    used: number;
    total: number;
    percentage: number;
  };
}

export interface HealthResponse extends SystemHealth {
  timestamp?: Date;
}

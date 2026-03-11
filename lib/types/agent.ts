export type AgentStatus = 'idle' | 'busy' | 'spawned' | 'offline';

export interface Agent {
  agentId: string;
  isDefault: boolean;
  status: AgentStatus;
  sessionCount: number;
  activeSessions: number;
  lastActivityMs: number | null;
  heartbeat: {
    enabled: boolean;
    intervalMs: number;
  };
  workspace: string;
}

export interface AgentListResponse {
  count: number;
  agents: Agent[];
}

export interface AgentFilter {
  status?: string;
  search?: string;
}

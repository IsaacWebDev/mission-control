export type SessionStatus = 'active' | 'idle' | 'completed' | 'failed';

export interface Session {
  sessionKey: string;
  agentId: string;
  status?: SessionStatus;
  updatedAt?: number;
  createdAt?: number;
  age?: number;
  ageMs?: number;
  messageCount?: number;
  tokenUsage?: {
    input: number;
    output: number;
    total: number;
  };
  channel?: string;
}

export interface SessionListResponse {
  count: number;
  total: number;
  sessions: Session[];
}

export interface SessionFilter {
  agentId?: string;
  active?: boolean | number;
}

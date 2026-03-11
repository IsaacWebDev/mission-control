# Mission Control - Data Schemas & TypeScript Interfaces

**Version:** 1.0  
**Date:** March 11, 2026  
**Purpose:** Complete TypeScript interface definitions for OpenClaw backend integration

---

## Table of Contents

1. [Core Types](#core-types)
2. [Gateway Responses](#gateway-responses)
3. [Agent Types](#agent-types)
4. [Session Types](#session-types)
5. [Task Types](#task-types)
6. [Log Types](#log-types)
7. [Error Types](#error-types)
8. [Utility Types](#utility-types)

---

## Installation

```bash
# Type definitions file location
# mission-control/types/openclaw.ts
```

---

## Core Types

### Base Response

```typescript
/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: ApiError;
  timestamp: number;
}

/**
 * API error structure
 */
export interface ApiError {
  type: ErrorType;
  message: string;
  details?: Record<string, any>;
  timestamp: number;
  code?: string;
}

export enum ErrorType {
  GATEWAY_OFFLINE = 'GATEWAY_OFFLINE',
  AUTH_FAILED = 'AUTH_FAILED',
  TOOL_NOT_FOUND = 'TOOL_NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  TIMEOUT = 'TIMEOUT',
  PARSE_ERROR = 'PARSE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNKNOWN = 'UNKNOWN',
}
```

---

## Gateway Responses

### Health Response

```typescript
/**
 * Gateway health check response
 * Endpoint: GET /api/openclaw/health
 */
export interface HealthResponse {
  ok: boolean;
  ts: number;
  durationMs: number;
  channels: ChannelHealthMap;
  channelOrder: string[];
  channelLabels: Record<string, string>;
  heartbeatSeconds: number;
  defaultAgentId: string;
  agents: AgentHealthInfo[];
  sessions?: SessionsInfo;
}

/**
 * Channel health mapping
 */
export type ChannelHealthMap = {
  [channel: string]: ChannelHealth;
};

/**
 * Individual channel health status
 */
export interface ChannelHealth {
  configured: boolean;
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
  tokenSource: 'none' | 'env' | 'config';
  probe?: ChannelProbe;
  lastProbeAt: number | null;
  mode: string | null;
  accountId: string;
  accounts?: Record<string, ChannelAccount>;
  
  // WhatsApp specific
  linked?: boolean;
  authAgeMs?: number;
  self?: {
    e164: string;
    jid: string;
  };
  connected?: boolean;
  lastConnectedAt?: number | null;
  lastDisconnect?: any | null;
  lastMessageAt?: number | null;
  lastEventAt?: number | null;
}

/**
 * Channel probe result
 */
export interface ChannelProbe {
  ok: boolean;
  status: string | null;
  error: string | null;
  elapsedMs: number;
  bot?: {
    id: number | string;
    username: string;
    canJoinGroups?: boolean;
    canReadAllGroupMessages?: boolean;
    supportsInlineQueries?: boolean;
  };
  webhook?: {
    url: string;
    hasCustomCert: boolean;
  };
  application?: {
    id: string;
    flags: number;
    intents: Record<string, string>;
  };
}

/**
 * Channel account info
 */
export interface ChannelAccount extends ChannelHealth {
  accountId: string;
}

/**
 * Agent health info from gateway
 */
export interface AgentHealthInfo {
  agentId: string;
  isDefault: boolean;
  heartbeat: {
    enabled: boolean;
    every: string;
    everyMs: number | null;
    prompt?: string;
    target?: string;
    ackMaxChars?: number;
  };
  sessions: {
    path: string;
    count: number;
    recent: RecentSession[];
  };
}

/**
 * Recent session summary
 */
export interface RecentSession {
  key: string;
  updatedAt: number;
  age: number;
}

/**
 * Sessions info from health
 */
export interface SessionsInfo {
  path: string | null;
  count: number;
  recent: RecentSession[];
}
```

---

## Agent Types

### Agent

```typescript
/**
 * Agent configuration and status
 * Endpoint: GET /api/openclaw/agents
 */
export interface Agent {
  agentId: string;
  isDefault: boolean;
  status: AgentStatus;
  sessionCount: number;
  activeSessions: number;
  lastActivityMs: number | null;
  heartbeat: AgentHeartbeat;
  workspace: string;
  configPath?: string;
  metrics?: AgentMetrics;
}

/**
 * Agent status enum
 */
export enum AgentStatus {
  IDLE = 'idle',
  BUSY = 'busy',
  SPAWNED = 'spawned',
  ERROR = 'error',
}

/**
 * Agent heartbeat configuration
 */
export interface AgentHeartbeat {
  enabled: boolean;
  intervalMs: number | null;
  every?: string;
  prompt?: string;
  target?: string;
}

/**
 * Agent metrics aggregation
 */
export interface AgentMetrics {
  totalTokens: number;
  avgTokensPerSession: number;
  totalSessions: number;
  activeSessions: number;
  activeTimeMs: number;
  lastActivityMs: number | null;
}

/**
 * Agents list response
 * Endpoint: GET /api/openclaw/agents
 */
export interface AgentsResponse {
  count: number;
  agents: Agent[];
}

/**
 * Agent detail response
 * Endpoint: GET /api/openclaw/agents/:id
 */
export interface AgentDetailResponse extends Agent {
  sessions: {
    total: number;
    active: number;
    recent: Session[];
  };
  recentTasks?: Task[];
}
```

---

## Session Types

### Session

```typescript
/**
 * Session data structure
 * Endpoint: GET /api/openclaw/sessions
 */
export interface Session {
  key: string;
  sessionId: string;
  agentId: string;
  channel?: string;
  kind: SessionKind;
  
  // Timestamps
  createdAt: number;
  updatedAt: number;
  ageMs: number;
  
  // Status
  isActive: boolean;
  systemSent?: boolean;
  abortedLastRun?: boolean;
  
  // Token usage
  tokens: SessionTokens;
  
  // Model info
  model: string;
  modelProvider?: string;
  
  // Message info
  messages?: {
    count: number;
    lastMessageAt: number;
  };
}

/**
 * Session kind
 */
export enum SessionKind {
  DIRECT = 'direct',
  GROUP = 'group',
}

/**
 * Session token usage
 */
export interface SessionTokens {
  input: number;
  output: number;
  total: number;
  context: number;
  totalTokensFresh?: boolean;
  usage?: number; // Percentage: total / context
}

/**
 * Sessions list response
 * Endpoint: GET /api/openclaw/sessions
 */
export interface SessionsResponse {
  count: number;
  total: number;
  offset: number;
  limit: number;
  sessions: Session[];
  stores?: SessionStore[];
  allAgents?: boolean;
}

/**
 * Session store info
 */
export interface SessionStore {
  agentId: string;
  path: string;
}

/**
 * Session detail response
 * Endpoint: GET /api/openclaw/sessions/:id
 */
export interface SessionDetailResponse extends Session {
  messages: SessionMessage[];
  metadata?: Record<string, any>;
}

/**
 * Session message
 */
export interface SessionMessage {
  id: string;
  timestamp: string;
  role: MessageRole;
  content: string;
  tokens?: number;
  toolCalls?: ToolCall[];
  attachments?: Attachment[];
}

/**
 * Message role
 */
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
  TOOL = 'tool',
}

/**
 * Tool call in message
 */
export interface ToolCall {
  id?: string;
  tool: string;
  args: Record<string, any>;
  result?: any;
  error?: string;
  durationMs?: number;
}

/**
 * Message attachment
 */
export interface Attachment {
  id: string;
  type: AttachmentType;
  url?: string;
  filename?: string;
  size?: number;
  mimeType?: string;
}

export enum AttachmentType {
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
}

/**
 * Session transcript response
 * Endpoint: GET /api/openclaw/sessions/:id/transcript
 */
export interface SessionTranscriptResponse {
  sessionId: string;
  messages: SessionMessage[];
  totalTokens?: number;
  messageCount: number;
}
```

---

## Task Types

### Task

```typescript
/**
 * Task data structure
 * Endpoint: GET /api/openclaw/tasks
 * 
 * Note: Tasks are derived from sessions/logs as OpenClaw
 * doesn't have native task tracking
 */
export interface Task {
  id: string;
  agentId: string;
  status: TaskStatus;
  
  // Task info
  title: string;
  description?: string;
  type?: TaskType;
  
  // Timing
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  durationMs?: number;
  
  // Progress
  progress?: number; // 0-100
  
  // Relation
  sessionId?: string;
  parentTaskId?: string;
  subtasks?: string[];
  
  // Metadata
  metadata?: TaskMetadata;
  error?: string;
}

/**
 * Task status
 */
export enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Task type
 */
export enum TaskType {
  AGENT_RUN = 'agent_run',
  TOOL_EXECUTION = 'tool_execution',
  SUBAGENT_SPAWN = 'subagent_spawn',
  MESSAGE_HANDLING = 'message_handling',
  HEARTBEAT = 'heartbeat',
  CUSTOM = 'custom',
}

/**
 * Task metadata
 */
export interface TaskMetadata {
  tokens?: number;
  model?: string;
  channel?: string;
  kind?: string;
  toolCalls?: number;
  [key: string]: any;
}

/**
 * Tasks list response
 * Endpoint: GET /api/openclaw/tasks
 */
export interface TasksResponse {
  count: number;
  total: number;
  tasks: Task[];
  summary?: TasksSummary;
}

/**
 * Tasks summary stats
 */
export interface TasksSummary {
  pending: number;
  running: number;
  completed: number;
  failed: number;
  totalDurationMs: number;
  avgDurationMs: number;
}

/**
 * Task detail response
 * Endpoint: GET /api/openclaw/tasks/:id
 */
export interface TaskDetailResponse extends Task {
  logs?: LogEntry[];
  session?: Session;
  timeline?: TaskTimelineEvent[];
}

/**
 * Task timeline event
 */
export interface TaskTimelineEvent {
  timestamp: number;
  type: string;
  description: string;
  metadata?: Record<string, any>;
}
```

---

## Log Types

### Log Entry

```typescript
/**
 * Log entry structure
 * Endpoint: GET /api/openclaw/logs (SSE)
 */
export interface LogEntry {
  timestamp: string;
  timestampMs: number;
  level: LogLevel;
  message: string;
  agentId?: string;
  sessionKey?: string;
  metadata?: LogMetadata;
  source?: string;
  stack?: string;
}

/**
 * Log level
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Log metadata
 */
export interface LogMetadata {
  model?: string;
  tokens?: {
    input?: number;
    output?: number;
    total?: number;
  };
  tool?: string;
  durationMs?: number;
  error?: {
    type: string;
    message: string;
    stack?: string;
  };
  [key: string]: any;
}

/**
 * Logs response
 * Endpoint: GET /api/openclaw/logs
 */
export interface LogsResponse {
  count: number;
  logs: LogEntry[];
  hasMore: boolean;
}

/**
 * Log filter options
 */
export interface LogFilter {
  level?: LogLevel | LogLevel[];
  agentId?: string;
  search?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}
```

---

## Error Types

### Error Handling

```typescript
/**
 * OpenClaw-specific error
 */
export class OpenClawError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public details?: Record<string, any>,
    public timestamp = Date.now()
  ) {
    super(message);
    this.name = 'OpenClawError';
  }
  
  toJSON(): ApiError {
    return {
      type: this.type,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Gateway connection error
 */
export class GatewayOfflineError extends OpenClawError {
  constructor(gatewayUrl: string, cause?: string) {
    super(
      ErrorType.GATEWAY_OFFLINE,
      'OpenClaw Gateway is offline',
      { gatewayUrl, cause }
    );
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends OpenClawError {
  constructor(message = 'Authentication failed') {
    super(ErrorType.AUTH_FAILED, message);
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends OpenClawError {
  constructor(
    public retryAfter: number,
    message = 'Rate limit exceeded'
  ) {
    super(ErrorType.RATE_LIMITED, message, { retryAfter });
  }
}

/**
 * Tool not found error
 */
export class ToolNotFoundError extends OpenClawError {
  constructor(toolName: string) {
    super(
      ErrorType.TOOL_NOT_FOUND,
      `Tool not available: ${toolName}`,
      { toolName }
    );
  }
}
```

---

## Utility Types

### Pagination

```typescript
/**
 * Pagination parameters
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    count: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
}
```

### Filters

```typescript
/**
 * Agent filter options
 */
export interface AgentFilter {
  status?: AgentStatus | AgentStatus[];
  search?: string;
  isDefault?: boolean;
  hasActiveSessions?: boolean;
}

/**
 * Session filter options
 */
export interface SessionFilter {
  agentId?: string;
  channel?: string;
  kind?: SessionKind;
  isActive?: boolean;
  minAge?: number;
  maxAge?: number;
  search?: string;
}

/**
 * Task filter options
 */
export interface TaskFilter {
  status?: TaskStatus | TaskStatus[];
  agentId?: string;
  type?: TaskType;
  startedAfter?: number;
  startedBefore?: number;
  search?: string;
}
```

### Query Keys

```typescript
/**
 * React Query key factory
 */
export const queryKeys = {
  health: ['health'] as const,
  agents: {
    all: ['agents'] as const,
    list: (filter?: AgentFilter) => ['agents', 'list', filter] as const,
    detail: (id: string) => ['agents', 'detail', id] as const,
  },
  sessions: {
    all: ['sessions'] as const,
    list: (filter?: SessionFilter) => ['sessions', 'list', filter] as const,
    detail: (id: string) => ['sessions', 'detail', id] as const,
    transcript: (id: string) => ['sessions', 'transcript', id] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    list: (filter?: TaskFilter) => ['tasks', 'list', filter] as const,
    detail: (id: string) => ['tasks', 'detail', id] as const,
  },
  logs: {
    all: ['logs'] as const,
    list: (filter?: LogFilter) => ['logs', 'list', filter] as const,
  },
} as const;
```

---

## Type Guards

### Type Guard Functions

```typescript
/**
 * Check if value is an ApiError
 */
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    'message' in value
  );
}

/**
 * Check if agent is active
 */
export function isAgentActive(agent: Agent): boolean {
  return (
    agent.status === AgentStatus.BUSY ||
    (agent.lastActivityMs !== null && 
     Date.now() - agent.lastActivityMs < 5 * 60 * 1000)
  );
}

/**
 * Check if session is active
 */
export function isSessionActive(session: Session): boolean {
  return session.ageMs < 2 * 60 * 60 * 1000; // 2 hours
}

/**
 * Check if task is running
 */
export function isTaskRunning(task: Task): boolean {
  return task.status === TaskStatus.RUNNING;
}

/**
 * Check if task is completed
 */
export function isTaskCompleted(task: Task): boolean {
  return (
    task.status === TaskStatus.COMPLETED ||
    task.status === TaskStatus.FAILED ||
    task.status === TaskStatus.CANCELLED
  );
}
```

---

## Data Transformers

### Transform Functions

```typescript
/**
 * Transform AgentHealthInfo to Agent
 */
export function transformAgent(healthInfo: AgentHealthInfo): Agent {
  const lastActivity = healthInfo.sessions.recent[0]?.updatedAt || null;
  const ageMs = lastActivity ? Date.now() - lastActivity : Infinity;
  
  return {
    agentId: healthInfo.agentId,
    isDefault: healthInfo.isDefault,
    status: calculateAgentStatus(ageMs, healthInfo.agentId),
    sessionCount: healthInfo.sessions.count,
    activeSessions: healthInfo.sessions.recent.filter(
      s => s.age < 2 * 60 * 60 * 1000
    ).length,
    lastActivityMs: lastActivity,
    heartbeat: {
      enabled: healthInfo.heartbeat.enabled,
      intervalMs: healthInfo.heartbeat.everyMs,
      every: healthInfo.heartbeat.every,
      prompt: healthInfo.heartbeat.prompt,
      target: healthInfo.heartbeat.target,
    },
    workspace: healthInfo.sessions.path.replace('/sessions/sessions.json', ''),
  };
}

/**
 * Calculate agent status from activity
 */
export function calculateAgentStatus(
  ageMs: number,
  agentId: string
): AgentStatus {
  if (agentId.includes('subagent:')) return AgentStatus.SPAWNED;
  if (ageMs < 5 * 60 * 1000) return AgentStatus.BUSY; // 5 minutes
  return AgentStatus.IDLE;
}

/**
 * Calculate token usage percentage
 */
export function calculateTokenUsage(tokens: SessionTokens): number {
  if (!tokens.context || tokens.context === 0) return 0;
  return (tokens.total / tokens.context) * 100;
}

/**
 * Format duration in ms to human readable
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: number): string {
  const ageMs = Date.now() - timestamp;
  const minutes = Math.floor(ageMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}
```

---

## Validation Schemas

### Zod Schemas (Optional)

```typescript
import { z } from 'zod';

/**
 * Agent schema
 */
export const AgentSchema = z.object({
  agentId: z.string(),
  isDefault: z.boolean(),
  status: z.nativeEnum(AgentStatus),
  sessionCount: z.number(),
  activeSessions: z.number(),
  lastActivityMs: z.number().nullable(),
  heartbeat: z.object({
    enabled: z.boolean(),
    intervalMs: z.number().nullable(),
  }),
  workspace: z.string(),
});

/**
 * Session schema
 */
export const SessionSchema = z.object({
  key: z.string(),
  sessionId: z.string(),
  agentId: z.string(),
  kind: z.nativeEnum(SessionKind),
  updatedAt: z.number(),
  ageMs: z.number(),
  isActive: z.boolean(),
  tokens: z.object({
    input: z.number(),
    output: z.number(),
    total: z.number(),
    context: z.number(),
  }),
  model: z.string(),
});

/**
 * Task schema
 */
export const TaskSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  status: z.nativeEnum(TaskStatus),
  title: z.string(),
  description: z.string().optional(),
  createdAt: z.number(),
  durationMs: z.number().optional(),
  progress: z.number().min(0).max(100).optional(),
});

/**
 * Log entry schema
 */
export const LogEntrySchema = z.object({
  timestamp: z.string(),
  timestampMs: z.number(),
  level: z.nativeEnum(LogLevel),
  message: z.string(),
  agentId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});
```

---

## Constants

### Default Values

```typescript
/**
 * Default pagination limits
 */
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 200;

/**
 * Active thresholds (milliseconds)
 */
export const ACTIVE_THRESHOLDS = {
  AGENT: 5 * 60 * 1000,      // 5 minutes
  SESSION: 2 * 60 * 60 * 1000, // 2 hours
  TASK: 10 * 60 * 1000,      // 10 minutes
} as const;

/**
 * Polling intervals (milliseconds)
 */
export const POLL_INTERVALS = {
  HEALTH: 30 * 1000,   // 30 seconds
  AGENTS: 15 * 1000,   // 15 seconds
  SESSIONS: 10 * 1000, // 10 seconds
  TASKS: 5 * 1000,     // 5 seconds
} as const;

/**
 * Cache times (milliseconds)
 */
export const CACHE_TIMES = {
  STALE: 5 * 60 * 1000,   // 5 minutes
  GC: 10 * 60 * 1000,     // 10 minutes
} as const;
```

---

## Usage Examples

### Type-Safe API Calls

```typescript
// Health check with full typing
const health = await fetch('/api/openclaw/health')
  .then(r => r.json() as Promise<HealthResponse>);

console.log(`Total agents: ${health.agents.length}`);

// Agent list with filter
const agentsResponse = await fetch(
  '/api/openclaw/agents?status=busy'
).then(r => r.json() as Promise<AgentsResponse>);

const busyAgents: Agent[] = agentsResponse.agents;

// Session detail
const session = await fetch(`/api/openclaw/sessions/${sessionId}`)
  .then(r => r.json() as Promise<SessionDetailResponse>);

console.log(`Token usage: ${calculateTokenUsage(session.tokens)}%`);
```

---

## Export Bundle

### Complete Type Export

```typescript
// types/openclaw.ts
export * from './core';
export * from './gateway';
export * from './agents';
export * from './sessions';
export * from './tasks';
export * from './logs';
export * from './errors';
export * from './utils';
```

---

**Ready for Implementation** ✅

See: 
- `BACKEND_INTEGRATION_STRATEGY.md` for architecture
- `API_ENDPOINTS.md` for endpoint specs

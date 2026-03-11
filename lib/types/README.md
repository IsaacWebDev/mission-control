# TypeScript Types Reference

Central type definitions for Mission Control.

## Usage

```typescript
import type { Agent, Session, SystemHealth } from '@/lib/types';
```

## Type Files

### `agent.ts`
Core agent types and status enums.

```typescript
import type { Agent, AgentStatus, AgentListResponse } from '@/lib/types';

const agent: Agent = {
  agentId: 'main',
  isDefault: true,
  status: 'busy',
  sessionCount: 5,
  activeSessions: 2,
  lastActivityMs: Date.now(),
  heartbeat: {
    enabled: true,
    intervalMs: 30000
  },
  workspace: '/path/to/workspace'
};
```

### `session.ts`
Session/task tracking types.

```typescript
import type { Session, SessionListResponse } from '@/lib/types';

const session: Session = {
  sessionKey: 'agent:main:telegram:12345',
  agentId: 'main',
  status: 'active',
  updatedAt: Date.now(),
  ageMs: 5000,
  channel: 'telegram'
};
```

### `health.ts`
System health and monitoring types.

```typescript
import type { SystemHealth, AgentHealthInfo } from '@/lib/types';

const health: SystemHealth = {
  gateway: {
    status: 'online',
    version: '1.0.0',
    uptime: 86400
  },
  agents: [...],
  channels: [...]
};
```

### `api.ts`
Generic API response wrappers.

```typescript
import type { ApiResponse, ApiError } from '@/lib/types';

const response: ApiResponse<Agent[]> = {
  data: [...],
  timestamp: new Date()
};

const error: ApiError = {
  ok: false,
  error: 'NOT_FOUND',
  message: 'Agent not found'
};
```

### `logs.ts`
Log entry types.

```typescript
import type { LogEntry, LogLevel } from '@/lib/types';

const log: LogEntry = {
  timestamp: new Date().toISOString(),
  level: 'info',
  message: 'Task completed',
  agentId: 'main'
};
```

### `websocket.ts`
WebSocket message types.

```typescript
import type { WebSocketMessage, RealtimeNotification } from '@/lib/types';

const message: WebSocketMessage = {
  type: 'agent_update',
  payload: {...},
  timestamp: Date.now()
};
```

## Best Practices

### 1. Always Import Types
```typescript
// ✅ Good
import type { Agent } from '@/lib/types';

// ❌ Bad
import { Agent } from '@/lib/types';
```

### 2. Use Interfaces for Objects
```typescript
// ✅ Good
interface Props {
  agent: Agent;
  onUpdate: (agent: Agent) => void;
}

// ❌ Bad
interface Props {
  agent: any;
  onUpdate: (agent: any) => void;
}
```

### 3. Generic API Responses
```typescript
// ✅ Good
async function fetchAgents(): Promise<ApiResponse<AgentListResponse>> {
  const response = await fetch('/api/openclaw/agents');
  return response.json();
}

// ❌ Bad
async function fetchAgents(): Promise<any> {
  const response = await fetch('/api/openclaw/agents');
  return response.json();
}
```

### 4. Type Guards for Runtime Safety
```typescript
function isAgent(obj: unknown): obj is Agent {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'agentId' in obj &&
    'status' in obj
  );
}
```

## Type Hierarchy

```
types/
├── index.ts          # Re-exports all types
├── agent.ts          # Agent types
├── session.ts        # Session types
├── health.ts         # Health types (imports agent + session)
├── api.ts            # Generic API wrappers
├── logs.ts           # Log types
└── websocket.ts      # WebSocket types
```

## Adding New Types

1. Create file in `lib/types/`
2. Define interfaces/types
3. Export via `index.ts`
4. Document in this README

Example:
```typescript
// lib/types/metrics.ts
export interface Metrics {
  cpu: number;
  memory: number;
  disk: number;
}

// lib/types/index.ts
export * from './metrics';
```

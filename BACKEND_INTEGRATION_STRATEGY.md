# Mission Control - Backend Integration Strategy

**Document Version:** 1.0  
**Date:** March 11, 2026  
**Author:** Backend Integration Specialist  
**Status:** Ready for Implementation

---

## Executive Summary

This document defines the complete backend integration architecture for connecting the Mission Control dashboard to OpenClaw's Gateway APIs. It provides a comprehensive strategy for replacing mock data with live system data across all dashboard pages.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [OpenClaw Gateway API](#openclaw-gateway-api)
3. [Integration Endpoints](#integration-endpoints)
4. [Data Fetching Strategy](#data-fetching-strategy)
5. [Authentication & Security](#authentication--security)
6. [Real-Time Updates](#real-time-updates)
7. [Error Handling](#error-handling)
8. [Implementation Phases](#implementation-phases)

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mission Control UI                        │
│                      (Next.js 15)                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP/WS
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                  OpenClaw Gateway                            │
│              (WebSocket + HTTP Multiplex)                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Gateway RPC Methods                                  │  │
│  │  • health                                             │  │
│  │  • system.presence                                    │  │
│  │  • cron.*                                             │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  HTTP Endpoints                                       │  │
│  │  • /v1/chat/completions (OpenAI compatible)          │  │
│  │  • /tools/invoke (Direct tool execution)             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React Query (TanStack Query v5) - Data fetching & caching
- WebSocket native API - Real-time updates
- TypeScript - Type safety
- Next.js 15 App Router - Server components where beneficial

**Backend:**
- OpenClaw Gateway (v2026.3.8)
- Port: 18789 (default)
- Auth: Token-based (Bearer)
- Protocols: HTTP + WebSocket

---

## OpenClaw Gateway API

### Gateway Overview

**Default Configuration:**
- **Host:** `127.0.0.1` (localhost)
- **Port:** `18789`
- **Protocol:** WebSocket + HTTP multiplex
- **Auth Mode:** Token (Bearer)
- **Base URL:** `http://127.0.0.1:18789`
- **WebSocket URL:** `ws://127.0.0.1:18789`

### Available Endpoints

#### 1. Gateway RPC Methods (via WebSocket or CLI)

**Access via CLI:**
```bash
openclaw gateway call <method> --params '{}' --json
```

**Available Methods:**
- `health` - Full system health check
- `system.presence` - System presence/heartbeat info
- `cron.*` - Cron job management

**Example Health Response:**
```json
{
  "ok": true,
  "ts": 1773229305542,
  "durationMs": 742,
  "channels": {
    "telegram": { "configured": true, "running": false, ... },
    "whatsapp": { "configured": true, "linked": true, ... },
    "discord": { "configured": true, "running": false, ... }
  },
  "agents": [
    {
      "agentId": "main",
      "isDefault": true,
      "sessions": {
        "count": 9,
        "recent": [...]
      }
    },
    ...
  ]
}
```

#### 2. HTTP Endpoints

##### `/tools/invoke` - Direct Tool Execution

**POST** `http://127.0.0.1:18789/tools/invoke`

**Headers:**
```http
Authorization: Bearer <OPENCLAW_GATEWAY_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "tool": "sessions_list",
  "action": "json",
  "args": {},
  "sessionKey": "main"
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "result": {
    "count": 19,
    "sessions": [...]
  }
}
```

**Error Responses:**
- `401` - Unauthorized (invalid token)
- `404` - Tool not available
- `400` - Invalid request
- `500` - Server error

**Tool Policy:**
Some tools are blocked by default over HTTP:
- `sessions_spawn` (blocked)
- `sessions_send` (blocked)
- `gateway` (blocked)
- `whatsapp_login` (blocked)

##### `/v1/chat/completions` - OpenAI Compatible

**POST** `http://127.0.0.1:18789/v1/chat/completions`

**Headers:**
```http
Authorization: Bearer <OPENCLAW_GATEWAY_TOKEN>
Content-Type: application/json
x-openclaw-agent-id: main
```

**Request Body:**
```json
{
  "model": "openclaw:main",
  "messages": [
    {"role": "user", "content": "What is the system status?"}
  ],
  "stream": false
}
```

**Note:** This endpoint is **disabled by default**. Enable via config:
```json5
{
  gateway: {
    http: {
      endpoints: {
        chatCompletions: { enabled: true }
      }
    }
  }
}
```

---

## Integration Endpoints

### Data Sources by Page

#### 1. Overview Dashboard (`/`)

**Data Requirements:**
- Total agent count
- Active sessions count
- Completed tasks (last 24h)
- Error count (last 24h)
- System uptime
- Channel health status

**Primary Endpoint:**
```
Tool: health (via /tools/invoke or CLI)
Method: POST /tools/invoke
Body: { "tool": "health", "action": "json" }
```

**Data Mapping:**
```typescript
{
  agentCount: response.agents.length,
  sessionCount: sum(agents.*.sessions.count),
  activeSessionCount: filter(sessions, age < 2h).length,
  channelHealth: response.channels.*,
  uptimeMs: response.ts - gatewayStartTime
}
```

#### 2. Agent Management (`/agents`)

**Data Requirements:**
- All configured agents (main + specialists)
- Agent status (idle/busy/spawned)
- Current tasks per agent
- Session counts

**Primary Endpoint:**
```
Tool: health (contains agents array)
CLI: openclaw agents list
```

**Agent Status Detection:**
```typescript
interface AgentStatus {
  agentId: string;
  isDefault: boolean;
  status: 'idle' | 'busy' | 'spawned';
  sessionCount: number;
  lastActivityMs: number;
  heartbeat: {
    enabled: boolean;
    everyMs: number | null;
  };
}

// Status logic:
// - 'busy': recent session update < 5 minutes
// - 'spawned': agentId contains 'subagent:'
// - 'idle': default state
```

#### 3. Task Management (`/tasks`)

**Data Requirements:**
- Past tasks (completed)
- Current tasks (running)
- Queued tasks (pending)
- Task metadata (agent, duration, status)

**Challenge:** OpenClaw doesn't have a dedicated task tracking system.

**Workaround Strategy:**

**Option A: Parse Session Logs**
```
Tool: logs (stream recent logs)
Parse: Look for agent turn starts/completions
```

**Option B: Use Session History as Task Proxy**
```
Tool: sessions_list (all agents)
Mapping:
- Recent sessions (< 5 min) → Running tasks
- Completed sessions → Past tasks
- Subagent sessions → Task hierarchy
```

**Option C: Custom Task Store (Recommended)**
```
Create: mission-control/api/tasks/route.ts
Store: Track tasks in SQLite/JSON
Sync: Poll sessions + logs periodically
```

#### 4. Session Management (`/sessions`)

**Data Requirements:**
- Active sessions (all agents)
- Session history
- Messages/transcripts
- Session metrics (tokens, duration)

**Primary Endpoint:**
```
Tool: sessions_list
CLI: openclaw sessions --json --all-agents
```

**Response Schema:**
```typescript
{
  allAgents: true,
  count: 19,
  sessions: [
    {
      key: "agent:main:telegram:direct:5716413497",
      updatedAt: 1773229266505,
      ageMs: 53950,
      sessionId: "c542be94-11cd-4cbe-b04f-36f46187c922",
      inputTokens: 3,
      outputTokens: 7,
      totalTokens: 174761,
      model: "claude-sonnet-4-5",
      agentId: "main",
      kind: "direct" | "group"
    },
    ...
  ]
}
```

**Session Transcript Access:**
```
Path: C:\Users\isaac\.openclaw\agents\{agentId}\sessions\sessions.json
Format: JSON with message history
Access: Read via Node.js fs API (server-side route)
```

#### 5. Logs (`/logs`)

**Data Requirements:**
- Real-time log streaming
- Filter by level (info/warn/error)
- Search functionality
- Timestamp + source

**Primary Endpoint:**
```
Tool: logs (stream)
CLI: openclaw logs
```

**Implementation Strategy:**

**Option A: Server-Sent Events (SSE)**
```typescript
// mission-control/app/api/logs/route.ts
export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Spawn: openclaw logs --json
      // Stream output via SSE
    }
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    }
  });
}
```

**Option B: WebSocket Bridge**
```typescript
// Connect to gateway logs endpoint
// Forward to browser via WS
```

**Option C: File Tail (Fallback)**
```
Path: ~/.openclaw/logs/gateway.log
Method: tail -f equivalent in Node.js
```

---

## Data Fetching Strategy

### React Query Configuration

**Setup (`app/providers.tsx`):**
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Query Hooks

**Health Query (`hooks/useHealth.ts`):**
```typescript
import { useQuery } from '@tanstack/react-query';

interface HealthResponse {
  ok: boolean;
  ts: number;
  channels: Record<string, any>;
  agents: Agent[];
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async (): Promise<HealthResponse> => {
      const response = await fetch('/api/openclaw/health');
      if (!response.ok) throw new Error('Health check failed');
      return response.json();
    },
    refetchInterval: 30 * 1000, // Poll every 30s
  });
}
```

**Sessions Query (`hooks/useSessions.ts`):**
```typescript
export function useSessions(agentId?: string) {
  return useQuery({
    queryKey: ['sessions', agentId || 'all'],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (agentId) params.set('agentId', agentId);
      else params.set('allAgents', 'true');
      
      const response = await fetch(`/api/openclaw/sessions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch sessions');
      return response.json();
    },
    refetchInterval: 10 * 1000, // Poll every 10s
  });
}
```

**Agents Query (`hooks/useAgents.ts`):**
```typescript
export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch('/api/openclaw/agents');
      if (!response.ok) throw new Error('Failed to fetch agents');
      return response.json();
    },
    refetchInterval: 15 * 1000, // Poll every 15s
  });
}
```

### Server-Side API Routes

All OpenClaw integration should happen server-side for security.

**Route Structure:**
```
mission-control/app/api/openclaw/
├── health/
│   └── route.ts          # GET /api/openclaw/health
├── agents/
│   └── route.ts          # GET /api/openclaw/agents
├── sessions/
│   └── route.ts          # GET /api/openclaw/sessions
├── tasks/
│   └── route.ts          # GET /api/openclaw/tasks
└── logs/
    └── route.ts          # GET /api/openclaw/logs (SSE)
```

**Example Route (`api/openclaw/health/route.ts`):**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    const { stdout } = await execAsync(
      'openclaw gateway call health --json',
      { timeout: 10000 }
    );
    
    const data = JSON.parse(stdout);
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { ok: false, error: 'Gateway health check failed' },
      { status: 500 }
    );
  }
}
```

---

## Authentication & Security

### Environment Configuration

**`.env.local`:**
```bash
# OpenClaw Gateway
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_GATEWAY_TOKEN=your-gateway-token-here
OPENCLAW_GATEWAY_WS_URL=ws://127.0.0.1:18789

# Security
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Getting Gateway Token:**
```bash
# Token is stored in OpenClaw config
cat ~/.openclaw/config.json5 | grep -A 5 "gateway.auth.token"

# Or set custom token
openclaw config set gateway.auth.token "your-secure-token-here"
```

### Security Best Practices

1. **Never Expose Tokens Client-Side**
   - All OpenClaw API calls happen in Next.js API routes
   - Token stays server-side in `.env.local`

2. **API Route Protection**
   ```typescript
   // middleware.ts (optional)
   export function middleware(request: NextRequest) {
     // Add rate limiting
     // Add IP allowlist for /api/openclaw/*
     // Add CORS headers
   }
   ```

3. **Gateway Access Control**
   ```json5
   // ~/.openclaw/config.json5
   {
     gateway: {
       auth: {
         mode: "token",
         token: "secure-random-token",
         rateLimit: {
           enabled: true,
           maxAttempts: 5,
           windowMs: 60000
         }
       },
       bind: "loopback" // Only localhost
     }
   }
   ```

4. **HTTPS in Production**
   - Use Tailscale for remote access
   - Or reverse proxy (nginx) with SSL

---

## Real-Time Updates

### WebSocket Strategy

**Purpose:** Live updates for agents, sessions, and logs.

**Implementation:**

**1. WebSocket Connection (`lib/websocket.ts`):**
```typescript
class OpenClawWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  
  connect() {
    const wsUrl = process.env.OPENCLAW_GATEWAY_WS_URL || 'ws://127.0.0.1:18789';
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('OpenClaw WS connected');
      this.reconnectAttempts = 0;
      this.authenticate();
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
    
    this.ws.onclose = () => {
      console.log('OpenClaw WS disconnected');
      this.reconnect();
    };
  }
  
  private authenticate() {
    this.send({
      method: 'auth',
      params: {
        token: process.env.OPENCLAW_GATEWAY_TOKEN
      }
    });
  }
  
  private handleMessage(data: any) {
    // Emit events to React Query cache
    // Example: invalidate queries on updates
  }
}
```

**2. React Query Integration:**
```typescript
// When WS event received:
queryClient.invalidateQueries({ queryKey: ['sessions'] });
queryClient.invalidateQueries({ queryKey: ['agents'] });
```

### Polling Intervals

**Recommended Intervals:**
- **Health/System Status:** 30 seconds
- **Agents:** 15 seconds
- **Sessions:** 10 seconds
- **Tasks:** 5 seconds (active tasks only)
- **Logs:** Real-time (SSE or WS)

**Adaptive Polling:**
```typescript
export function useAdaptivePolling(baseInterval: number) {
  const isPageVisible = usePageVisibility();
  const isOnline = useOnlineStatus();
  
  return {
    refetchInterval: isPageVisible && isOnline ? baseInterval : false
  };
}
```

---

## Error Handling

### Error Types

```typescript
enum OpenClawErrorType {
  GATEWAY_OFFLINE = 'GATEWAY_OFFLINE',
  AUTH_FAILED = 'AUTH_FAILED',
  TOOL_NOT_FOUND = 'TOOL_NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  TIMEOUT = 'TIMEOUT',
  PARSE_ERROR = 'PARSE_ERROR',
  UNKNOWN = 'UNKNOWN'
}

interface OpenClawError {
  type: OpenClawErrorType;
  message: string;
  details?: any;
  timestamp: number;
}
```

### Error Handling Strategy

**1. React Query Error Boundaries:**
```typescript
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

<QueryErrorResetBoundary>
  {({ reset }) => (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} reset={resetErrorBoundary} />
      )}
    >
      <YourComponent />
    </ErrorBoundary>
  )}
</QueryErrorResetBoundary>
```

**2. Retry Logic:**
```typescript
retry: (failureCount, error) => {
  // Don't retry auth errors
  if (error.type === OpenClawErrorType.AUTH_FAILED) return false;
  
  // Retry up to 3 times for other errors
  return failureCount < 3;
},

retryDelay: (attemptIndex) => {
  // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
  return Math.min(1000 * 2 ** attemptIndex, 30000);
}
```

**3. Fallback UI:**
```typescript
export function ErrorFallback({ error, reset }: Props) {
  return (
    <div className="glass-panel p-6 text-center">
      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
      <h3 className="text-lg font-semibold mb-2">
        Connection Error
      </h3>
      <p className="text-gray-400 mb-4">
        {error.message || 'Failed to connect to OpenClaw Gateway'}
      </p>
      <button onClick={reset} className="glass-button">
        Retry Connection
      </button>
    </div>
  );
}
```

**4. Toast Notifications:**
```typescript
import { toast } from 'sonner';

onError: (error) => {
  if (error.type === OpenClawErrorType.GATEWAY_OFFLINE) {
    toast.error('Gateway offline', {
      description: 'Check if OpenClaw Gateway is running',
      action: {
        label: 'Docs',
        onClick: () => window.open('/docs/gateway-setup')
      }
    });
  }
}
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal:** Set up core infrastructure

**Tasks:**
1. Create API route structure (`/api/openclaw/*`)
2. Implement health endpoint
3. Set up React Query provider
4. Add environment configuration
5. Create base hooks (useHealth, useAgents, useSessions)
6. Test API routes locally

**Deliverables:**
- ✅ Health data flowing to Overview page
- ✅ Agent list populating /agents page
- ✅ Session data available

### Phase 2: Agent & Session Integration (Week 2)

**Goal:** Complete agent and session pages

**Tasks:**
1. Implement agent status detection logic
2. Create agent detail views
3. Build session list with filters
4. Add session transcript viewer (read from file system)
5. Implement session metrics (tokens, duration)
6. Add real-time polling

**Deliverables:**
- ✅ Agents page fully functional
- ✅ Sessions page with search/filter
- ✅ Session detail modal

### Phase 3: Tasks & Logs (Week 3)

**Goal:** Task tracking and log streaming

**Tasks:**
1. Implement task tracking strategy (Option C recommended)
2. Create task API routes
3. Build log streaming endpoint (SSE)
4. Implement log filtering (level, search)
5. Add task status indicators
6. Create task detail views

**Deliverables:**
- ✅ Tasks page operational
- ✅ Real-time log streaming
- ✅ Log search/filter working

### Phase 4: Real-Time & Polish (Week 4)

**Goal:** WebSocket integration and UX refinement

**Tasks:**
1. Implement WebSocket client
2. Connect WS events to React Query cache invalidation
3. Add optimistic updates
4. Implement error boundaries
5. Add loading skeletons
6. Performance optimization
7. Add toast notifications
8. Final testing

**Deliverables:**
- ✅ Live updates across all pages
- ✅ Polished error handling
- ✅ Production-ready UI

---

## Testing Strategy

### Local Testing

**1. Start OpenClaw Gateway:**
```bash
openclaw gateway run --verbose
```

**2. Verify Health:**
```bash
curl http://127.0.0.1:18789/tools/invoke \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tool":"health","action":"json"}'
```

**3. Start Mission Control:**
```bash
cd mission-control
npm run dev
```

### Integration Tests

**Health Endpoint Test:**
```typescript
// __tests__/api/health.test.ts
import { GET } from '@/app/api/openclaw/health/route';

describe('/api/openclaw/health', () => {
  it('returns health data', async () => {
    const request = new Request('http://localhost:3000/api/openclaw/health');
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.ok).toBe(true);
    expect(data.agents).toBeDefined();
    expect(data.channels).toBeDefined();
  });
});
```

---

## Next Steps

1. **Read Companion Documents:**
   - `API_ENDPOINTS.md` - Detailed endpoint specifications
   - `DATA_SCHEMAS.md` - TypeScript interface definitions
   - `WEBSOCKET_PLAN.md` - WebSocket implementation guide
   - `ERROR_HANDLING.md` - Comprehensive error strategy

2. **Environment Setup:**
   - Add `.env.local` with gateway credentials
   - Test gateway connectivity
   - Verify OpenClaw CLI access

3. **Begin Phase 1:**
   - Start with health endpoint
   - Validate data flow
   - Test with Overview page

4. **Coordinate with Frontend:**
   - Share API endpoint contracts
   - Align on data structures
   - Plan component integration

---

## Resources

- **OpenClaw Docs:** https://docs.openclaw.ai/
- **Gateway CLI:** `openclaw gateway --help`
- **Session Docs:** `openclaw sessions --help`
- **React Query:** https://tanstack.com/query/latest/docs/framework/react/overview
- **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

**Ready for Implementation** ✅

Contact: Backend Specialist Agent  
Questions: See detailed companion documents

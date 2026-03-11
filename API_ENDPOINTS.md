# Mission Control - API Endpoints Reference

**Version:** 1.0  
**Date:** March 11, 2026  
**Purpose:** Complete API endpoint specifications for Mission Control backend integration

---

## Table of Contents

1. [Gateway API Endpoints](#gateway-api-endpoints)
2. [Mission Control API Routes](#mission-control-api-routes)
3. [Request/Response Examples](#requestresponse-examples)
4. [Error Responses](#error-responses)
5. [Rate Limiting](#rate-limiting)

---

## Gateway API Endpoints

### Base Configuration

```typescript
const GATEWAY_CONFIG = {
  baseUrl: process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:18789',
  wsUrl: process.env.OPENCLAW_GATEWAY_WS_URL || 'ws://127.0.0.1:18789',
  token: process.env.OPENCLAW_GATEWAY_TOKEN,
  timeout: 10000, // 10 seconds
};
```

---

### 1. Health Check

**Endpoint:** `POST /tools/invoke`  
**Tool:** `health`

**Request:**
```http
POST /tools/invoke HTTP/1.1
Host: 127.0.0.1:18789
Authorization: Bearer <GATEWAY_TOKEN>
Content-Type: application/json

{
  "tool": "health",
  "action": "json",
  "args": {}
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "ts": 1773229305542,
  "durationMs": 742,
  "channels": {
    "telegram": {
      "configured": true,
      "running": false,
      "lastStartAt": null,
      "lastStopAt": null,
      "probe": {
        "ok": true,
        "bot": {
          "id": 8404959655,
          "username": "jarvis_terminator_bot"
        }
      },
      "accounts": { ... }
    },
    "whatsapp": { ... },
    "discord": { ... }
  },
  "defaultAgentId": "main",
  "agents": [
    {
      "agentId": "main",
      "isDefault": true,
      "heartbeat": {
        "enabled": true,
        "every": "60m",
        "everyMs": 3600000
      },
      "sessions": {
        "path": "C:\\Users\\isaac\\.openclaw\\agents\\main\\sessions\\sessions.json",
        "count": 9,
        "recent": [
          {
            "key": "agent:main:telegram:direct:5716413497",
            "updatedAt": 1773229266505,
            "age": 38264
          }
        ]
      }
    },
    {
      "agentId": "frontend",
      "isDefault": false,
      "sessions": { ... }
    }
    // ... 35 more agents
  ]
}
```

**Data Points:**
- Total agents: `agents.length`
- Active agents: `agents.filter(a => a.sessions.recent[0]?.age < 300000).length`
- Total sessions: `sum(agents.*.sessions.count)`
- Channel health: `channels.*`

---

### 2. Sessions List

**Endpoint:** Via CLI (wrap in API route)  
**Command:** `openclaw sessions --json --all-agents`

**Response:**
```json
{
  "path": null,
  "stores": [
    {
      "agentId": "main",
      "path": "C:\\Users\\isaac\\.openclaw\\agents\\main\\sessions\\sessions.json"
    }
    // ... all agents
  ],
  "allAgents": true,
  "count": 19,
  "sessions": [
    {
      "key": "agent:main:telegram:direct:5716413497",
      "updatedAt": 1773229266505,
      "ageMs": 53950,
      "sessionId": "c542be94-11cd-4cbe-b04f-36f46187c922",
      "systemSent": true,
      "abortedLastRun": false,
      "inputTokens": 3,
      "outputTokens": 7,
      "totalTokens": 174761,
      "totalTokensFresh": true,
      "model": "claude-sonnet-4-5",
      "modelProvider": "anthropic",
      "contextTokens": 200000,
      "agentId": "main",
      "kind": "direct"
    }
    // ... more sessions
  ]
}
```

**Filter Options:**
```bash
# Specific agent
openclaw sessions --agent main --json

# Active sessions only (last 2 hours)
openclaw sessions --active 120 --json

# All agents
openclaw sessions --all-agents --json
```

---

### 3. Agent List

**Endpoint:** Via CLI + health endpoint  
**Command:** `openclaw agents list` (or extract from health response)

**Response Structure:**
```json
[
  {
    "agentId": "main",
    "isDefault": true,
    "workspace": "C:\\Users\\isaac\\.openclaw\\agents\\main",
    "configPath": "C:\\Users\\isaac\\.openclaw\\agents\\main\\config.json5",
    "sessionCount": 9,
    "lastActivity": 1773229266505,
    "status": "busy"
  },
  {
    "agentId": "frontend",
    "isDefault": false,
    "sessionCount": 4,
    "lastActivity": 1773228956815,
    "status": "idle"
  }
  // ... 35 more agents
]
```

**Status Calculation Logic:**
```typescript
function calculateAgentStatus(agent: Agent): 'idle' | 'busy' | 'spawned' {
  const lastActivity = agent.sessions.recent[0]?.updatedAt;
  const ageMs = Date.now() - lastActivity;
  
  // Spawned: subagent detected
  if (agent.agentId.includes('subagent:')) return 'spawned';
  
  // Busy: activity within last 5 minutes
  if (ageMs < 5 * 60 * 1000) return 'busy';
  
  // Idle: default
  return 'idle';
}
```

---

### 4. Logs Stream

**Endpoint:** Via CLI stdout stream  
**Command:** `openclaw logs --json`

**Log Entry Format:**
```json
{
  "timestamp": "2026-03-11T12:40:15.123Z",
  "level": "info",
  "message": "Agent started",
  "agentId": "main",
  "sessionKey": "agent:main:telegram:direct:5716413497",
  "metadata": {
    "model": "claude-sonnet-4-5",
    "inputTokens": 123
  }
}
```

**Streaming Implementation:**
```typescript
// Server-Sent Events (SSE)
const logStream = spawn('openclaw', ['logs', '--json']);
logStream.stdout.on('data', (chunk) => {
  const lines = chunk.toString().split('\n');
  lines.forEach(line => {
    if (line.trim()) {
      const log = JSON.parse(line);
      sendSSE(log);
    }
  });
});
```

---

## Mission Control API Routes

### Route Structure

```
mission-control/app/api/openclaw/
├── health/
│   └── route.ts          # GET /api/openclaw/health
├── agents/
│   ├── route.ts          # GET /api/openclaw/agents
│   └── [id]/
│       └── route.ts      # GET /api/openclaw/agents/:id
├── sessions/
│   ├── route.ts          # GET /api/openclaw/sessions
│   └── [id]/
│       ├── route.ts      # GET /api/openclaw/sessions/:id
│       └── transcript/
│           └── route.ts  # GET /api/openclaw/sessions/:id/transcript
├── tasks/
│   ├── route.ts          # GET /api/openclaw/tasks
│   └── [id]/
│       └── route.ts      # GET /api/openclaw/tasks/:id
└── logs/
    └── route.ts          # GET /api/openclaw/logs (SSE)
```

---

### 1. Health Endpoint

**Endpoint:** `GET /api/openclaw/health`

**Implementation:**
```typescript
// app/api/openclaw/health/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { execAsync } from '@/lib/openclaw';

export async function GET(request: NextRequest) {
  try {
    const health = await execAsync('openclaw gateway call health --json');
    
    return NextResponse.json(health, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Gateway health check failed' },
      { status: 500 }
    );
  }
}
```

**Response:**
```json
{
  "ok": true,
  "ts": 1773229305542,
  "channels": { ... },
  "agents": [ ... ]
}
```

**Usage:**
```typescript
const { data } = useQuery({
  queryKey: ['health'],
  queryFn: () => fetch('/api/openclaw/health').then(r => r.json()),
  refetchInterval: 30000, // 30s
});
```

---

### 2. Agents Endpoint

**Endpoint:** `GET /api/openclaw/agents`

**Query Parameters:**
- `status` (optional): Filter by status (`idle`, `busy`, `spawned`)
- `search` (optional): Search by agent ID

**Example:** `/api/openclaw/agents?status=busy&search=front`

**Response:**
```json
{
  "count": 37,
  "agents": [
    {
      "agentId": "main",
      "isDefault": true,
      "status": "busy",
      "sessionCount": 9,
      "lastActivityMs": 1773229266505,
      "heartbeat": {
        "enabled": true,
        "intervalMs": 3600000
      },
      "workspace": "C:\\Users\\isaac\\.openclaw\\agents\\main"
    }
    // ... more agents
  ]
}
```

**Implementation:**
```typescript
// app/api/openclaw/agents/route.ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  
  const health = await fetchHealth();
  let agents = health.agents;
  
  // Filter by status
  if (status) {
    agents = agents.filter(a => calculateStatus(a) === status);
  }
  
  // Filter by search
  if (search) {
    agents = agents.filter(a => 
      a.agentId.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  return NextResponse.json({
    count: agents.length,
    agents: agents.map(enrichAgent)
  });
}
```

---

### 3. Agent Detail Endpoint

**Endpoint:** `GET /api/openclaw/agents/:id`

**Example:** `/api/openclaw/agents/frontend`

**Response:**
```json
{
  "agentId": "frontend",
  "isDefault": false,
  "status": "idle",
  "sessions": {
    "total": 4,
    "active": 1,
    "recent": [
      {
        "key": "agent:frontend:subagent:ac9b2433-1f3a-48eb-9f7b-024871ba3b1e",
        "updatedAt": 1773228956815,
        "ageMs": 363773,
        "totalTokens": 62423
      }
    ]
  },
  "heartbeat": {
    "enabled": true,
    "intervalMs": 0
  },
  "workspace": "C:\\Users\\isaac\\.openclaw\\agents\\frontend",
  "metrics": {
    "totalTokens": 171708,
    "avgTokensPerSession": 42927,
    "activeTime": 1850000
  }
}
```

---

### 4. Sessions Endpoint

**Endpoint:** `GET /api/openclaw/sessions`

**Query Parameters:**
- `agentId` (optional): Filter by agent
- `kind` (optional): `direct` or `group`
- `active` (optional): Only active sessions (ageMs < value)
- `limit` (optional): Limit results (default: 50)
- `offset` (optional): Pagination offset

**Example:** `/api/openclaw/sessions?agentId=main&active=300000&limit=20`

**Response:**
```json
{
  "count": 19,
  "total": 150,
  "offset": 0,
  "limit": 20,
  "sessions": [
    {
      "key": "agent:main:telegram:direct:5716413497",
      "sessionId": "c542be94-11cd-4cbe-b04f-36f46187c922",
      "agentId": "main",
      "channel": "telegram",
      "kind": "direct",
      "updatedAt": 1773229266505,
      "ageMs": 53950,
      "isActive": true,
      "tokens": {
        "input": 3,
        "output": 7,
        "total": 174761,
        "context": 200000,
        "usage": 0.87
      },
      "model": "claude-sonnet-4-5"
    }
  ]
}
```

**Implementation:**
```typescript
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const agentId = params.get('agentId');
  const active = params.get('active');
  const limit = parseInt(params.get('limit') || '50');
  const offset = parseInt(params.get('offset') || '0');
  
  const sessions = await fetchSessions(agentId);
  
  // Filter active
  let filtered = sessions;
  if (active) {
    const maxAge = parseInt(active);
    filtered = sessions.filter(s => s.ageMs < maxAge);
  }
  
  // Paginate
  const paginated = filtered.slice(offset, offset + limit);
  
  return NextResponse.json({
    count: paginated.length,
    total: filtered.length,
    offset,
    limit,
    sessions: paginated
  });
}
```

---

### 5. Session Detail Endpoint

**Endpoint:** `GET /api/openclaw/sessions/:id`

**Example:** `/api/openclaw/sessions/c542be94-11cd-4cbe-b04f-36f46187c922`

**Response:**
```json
{
  "sessionId": "c542be94-11cd-4cbe-b04f-36f46187c922",
  "key": "agent:main:telegram:direct:5716413497",
  "agentId": "main",
  "channel": "telegram",
  "kind": "direct",
  "created": 1773229266505,
  "updated": 1773229266505,
  "isActive": true,
  "tokens": {
    "input": 3,
    "output": 7,
    "total": 174761,
    "context": 200000
  },
  "model": "claude-sonnet-4-5",
  "messages": {
    "count": 10,
    "lastMessageAt": 1773229266505
  }
}
```

---

### 6. Session Transcript Endpoint

**Endpoint:** `GET /api/openclaw/sessions/:id/transcript`

**Example:** `/api/openclaw/sessions/c542be94-11cd-4cbe-b04f-36f46187c922/transcript`

**Response:**
```json
{
  "sessionId": "c542be94-11cd-4cbe-b04f-36f46187c922",
  "messages": [
    {
      "id": "msg_001",
      "timestamp": "2026-03-11T12:40:15.123Z",
      "role": "user",
      "content": "Hello, build a landing page",
      "tokens": 123
    },
    {
      "id": "msg_002",
      "timestamp": "2026-03-11T12:40:18.456Z",
      "role": "assistant",
      "content": "I'll create a landing page...",
      "tokens": 456,
      "toolCalls": [
        {
          "tool": "write",
          "args": { "path": "index.html", "content": "..." }
        }
      ]
    }
  ]
}
```

**Implementation:**
```typescript
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionId = params.id;
  
  // Find session in health data
  const health = await fetchHealth();
  const session = findSessionById(health, sessionId);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    );
  }
  
  // Read session file
  const agentPath = path.join(
    process.env.HOME!,
    '.openclaw',
    'agents',
    session.agentId,
    'sessions',
    'sessions.json'
  );
  
  const content = await fs.readFile(agentPath, 'utf-8');
  const data = JSON.parse(content);
  
  // Find this session's messages
  const transcript = data[session.key];
  
  return NextResponse.json({
    sessionId,
    messages: transcript.messages || []
  });
}
```

---

### 7. Tasks Endpoint

**Endpoint:** `GET /api/openclaw/tasks`

**Query Parameters:**
- `status` (optional): `running`, `completed`, `pending`
- `agentId` (optional): Filter by agent
- `limit` (optional): Limit results

**Example:** `/api/openclaw/tasks?status=running`

**Response:**
```json
{
  "count": 12,
  "tasks": [
    {
      "id": "task_001",
      "agentId": "frontend",
      "status": "running",
      "title": "Build landing page",
      "description": "Create responsive landing page with Next.js",
      "startedAt": 1773228956815,
      "duration": 363773,
      "sessionId": "ac9b2433-1f3a-48eb-9f7b-024871ba3b1e",
      "progress": 65
    }
  ]
}
```

**Implementation Strategy:**

**Option A: Map from Sessions**
```typescript
// Running task = recent session (< 5 min)
// Completed task = older session
// Use session as task proxy
```

**Option B: Custom Task Store**
```typescript
// Store tasks in SQLite or JSON
// Track via webhook or polling
// Best accuracy, more complexity
```

---

### 8. Logs Endpoint (SSE)

**Endpoint:** `GET /api/openclaw/logs`

**Query Parameters:**
- `level` (optional): `info`, `warn`, `error`
- `search` (optional): Filter by message text
- `agentId` (optional): Filter by agent

**Example:** `/api/openclaw/logs?level=error&agentId=main`

**Implementation (Server-Sent Events):**
```typescript
// app/api/openclaw/logs/route.ts
import { spawn } from 'child_process';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const level = searchParams.get('level');
  const search = searchParams.get('search');
  
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      const logProcess = spawn('openclaw', ['logs', '--json']);
      
      logProcess.stdout.on('data', (chunk) => {
        const lines = chunk.toString().split('\n');
        
        lines.forEach(line => {
          if (!line.trim()) return;
          
          try {
            const log = JSON.parse(line);
            
            // Filter by level
            if (level && log.level !== level) return;
            
            // Filter by search
            if (search && !log.message.includes(search)) return;
            
            // Send SSE
            const data = `data: ${JSON.stringify(log)}\n\n`;
            controller.enqueue(encoder.encode(data));
          } catch (e) {
            console.error('Log parse error:', e);
          }
        });
      });
      
      logProcess.on('close', () => {
        controller.close();
      });
    },
    
    cancel() {
      logProcess.kill();
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

**Client Usage:**
```typescript
useEffect(() => {
  const eventSource = new EventSource('/api/openclaw/logs?level=error');
  
  eventSource.onmessage = (event) => {
    const log = JSON.parse(event.data);
    setLogs(prev => [...prev, log]);
  };
  
  return () => eventSource.close();
}, []);
```

---

## Error Responses

### Standard Error Format

```json
{
  "ok": false,
  "error": {
    "type": "GATEWAY_OFFLINE",
    "message": "Failed to connect to OpenClaw Gateway",
    "details": {
      "gatewayUrl": "http://127.0.0.1:18789",
      "cause": "ECONNREFUSED"
    },
    "timestamp": 1773229305542
  }
}
```

### HTTP Status Codes

| Status | Type | Description |
|--------|------|-------------|
| 200 | Success | Request successful |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid gateway token |
| 404 | Not Found | Resource not found |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Gateway error |
| 503 | Service Unavailable | Gateway offline |

---

## Rate Limiting

### Gateway Rate Limits

```json5
// ~/.openclaw/config.json5
{
  gateway: {
    auth: {
      rateLimit: {
        enabled: true,
        maxAttempts: 100,
        windowMs: 60000  // 1 minute
      }
    }
  }
}
```

### Client-Side Rate Limiting

```typescript
// lib/rate-limiter.ts
import pLimit from 'p-limit';

const limit = pLimit(10); // Max 10 concurrent requests

export async function rateLimitedFetch(url: string, options?: RequestInit) {
  return limit(() => fetch(url, options));
}
```

---

## Utility Functions

### Helper Library (`lib/openclaw.ts`)

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function callGateway(method: string, params: any = {}) {
  const cmd = `openclaw gateway call ${method} --params '${JSON.stringify(params)}' --json`;
  const { stdout } = await execAsync(cmd, { timeout: 10000 });
  return JSON.parse(stdout);
}

export async function invokeTool(tool: string, args: any = {}) {
  const response = await fetch(`${GATEWAY_URL}/tools/invoke`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tool, args }),
  });
  
  if (!response.ok) {
    throw new Error(`Tool invocation failed: ${tool}`);
  }
  
  return response.json();
}

export async function fetchHealth() {
  return callGateway('health');
}

export async function fetchSessions(agentId?: string) {
  const cmd = agentId
    ? `openclaw sessions --agent ${agentId} --json`
    : `openclaw sessions --all-agents --json`;
    
  const { stdout } = await execAsync(cmd);
  return JSON.parse(stdout);
}
```

---

## Next Steps

1. **Implement API Routes:** Start with health endpoint
2. **Test with Thunder Client / Postman:** Verify responses
3. **Create React Query Hooks:** Consume API routes
4. **Add Error Handling:** Implement error boundaries
5. **Monitor Performance:** Track response times

---

**Ready for Implementation** ✅

See: `BACKEND_INTEGRATION_STRATEGY.md` for context

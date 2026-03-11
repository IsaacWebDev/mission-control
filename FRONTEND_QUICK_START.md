# Frontend Quick Start - Backend Integration

**For:** Frontend Agent  
**Goal:** Rapid implementation of backend integration  
**Time:** Start immediately with this guide

---

## 🚀 30-Minute Quick Start

### Step 1: Environment Setup (5 min)

```bash
cd C:\Users\isaac\.openclaw\workspace\mission-control

# Create .env.local
echo "OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789" > .env.local
echo "OPENCLAW_GATEWAY_WS_URL=ws://127.0.0.1:18789" >> .env.local

# Get gateway token
type %USERPROFILE%\.openclaw\config.json5 | findstr token

# Add to .env.local
echo "OPENCLAW_GATEWAY_TOKEN=YOUR_TOKEN_HERE" >> .env.local
```

**Verify Gateway:**
```bash
openclaw gateway call health --json
```

---

### Step 2: Create Health API Route (10 min)

```bash
# Create directory
mkdir -p app\api\openclaw\health
```

**Create `app/api/openclaw/health/route.ts`:**
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

**Test:**
```bash
npm run dev
curl http://localhost:3000/api/openclaw/health
```

---

### Step 3: Create Health Hook (5 min)

```bash
# Create hooks directory
mkdir -p hooks
```

**Create `hooks/useHealth.ts`:**
```typescript
import { useQuery } from '@tanstack/react-query';

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await fetch('/api/openclaw/health');
      if (!response.ok) throw new Error('Health check failed');
      return response.json();
    },
    refetchInterval: 30 * 1000, // 30 seconds
  });
}
```

---

### Step 4: Update Overview Page (10 min)

**Replace mock data in `app/page.tsx`:**

```typescript
'use client';

import { useHealth } from '@/hooks/useHealth';
import { Card } from '@/components/ui/card';

export default function Dashboard() {
  const { data: health, isLoading, error } = useHealth();
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="glass-panel p-6 animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-2"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <Card className="glass-panel p-6 border-red-500/20">
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Connection Error
          </h3>
          <p className="text-gray-400">
            Failed to connect to OpenClaw Gateway. 
            Check if the gateway is running.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 glass-button"
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }
  
  // Calculate metrics
  const agentCount = health?.agents?.length || 0;
  const totalSessions = health?.agents?.reduce(
    (sum: number, agent: any) => sum + (agent.sessions?.count || 0), 
    0
  ) || 0;
  
  const activeSessions = health?.agents?.reduce(
    (sum: number, agent: any) => {
      const recent = agent.sessions?.recent || [];
      const active = recent.filter((s: any) => s.age < 2 * 60 * 60 * 1000);
      return sum + active.length;
    },
    0
  ) || 0;
  
  const channelCount = Object.keys(health?.channels || {}).length;
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mission Control</h1>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        {/* Agent Count */}
        <Card className="glass-panel p-6">
          <div className="text-sm text-gray-400 mb-2">Total Agents</div>
          <div className="text-4xl font-bold">{agentCount}</div>
        </Card>
        
        {/* Active Sessions */}
        <Card className="glass-panel p-6">
          <div className="text-sm text-gray-400 mb-2">Active Sessions</div>
          <div className="text-4xl font-bold">{activeSessions}</div>
          <div className="text-xs text-gray-500 mt-1">
            of {totalSessions} total
          </div>
        </Card>
        
        {/* Channels */}
        <Card className="glass-panel p-6">
          <div className="text-sm text-gray-400 mb-2">Channels</div>
          <div className="text-4xl font-bold">{channelCount}</div>
        </Card>
        
        {/* Health Status */}
        <Card className="glass-panel p-6">
          <div className="text-sm text-gray-400 mb-2">System Health</div>
          <div className={`text-2xl font-bold ${health?.ok ? 'text-green-400' : 'text-red-400'}`}>
            {health?.ok ? '✓ Healthy' : '✗ Degraded'}
          </div>
        </Card>
      </div>
      
      {/* Channel Status */}
      <Card className="glass-panel p-6">
        <h2 className="text-xl font-semibold mb-4">Channel Status</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(health?.channels || {}).map(([channel, status]: [string, any]) => (
            <div key={channel} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div>
                <div className="font-medium capitalize">{channel}</div>
                <div className="text-xs text-gray-400">
                  {status.configured ? 'Configured' : 'Not configured'}
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                status.running ? 'bg-green-400' : 'bg-gray-600'
              }`}></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
```

**Result:** Real data on Overview page! 🎉

---

## 📋 Complete Implementation Checklist

### Phase 1: Core API Routes (Day 1-2)

**Create These Files:**
```
app/api/openclaw/
├── health/route.ts          ✅ DONE
├── agents/route.ts          ⏳ TODO
├── sessions/route.ts        ⏳ TODO
├── tasks/route.ts           ⏳ TODO
└── logs/route.ts            ⏳ TODO
```

**Templates:**

**`app/api/openclaw/agents/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    const { stdout } = await execAsync('openclaw gateway call health --json');
    const health = JSON.parse(stdout);
    
    // Transform agents
    const agents = health.agents.map((agent: any) => {
      const lastActivity = agent.sessions.recent[0]?.updatedAt || null;
      const ageMs = lastActivity ? Date.now() - lastActivity : Infinity;
      
      return {
        agentId: agent.agentId,
        isDefault: agent.isDefault,
        status: calculateStatus(ageMs, agent.agentId),
        sessionCount: agent.sessions.count,
        lastActivityMs: lastActivity,
      };
    });
    
    return NextResponse.json({ count: agents.length, agents });
  } catch (error) {
    console.error('Agents fetch error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

function calculateStatus(ageMs: number, agentId: string): string {
  if (agentId.includes('subagent:')) return 'spawned';
  if (ageMs < 5 * 60 * 1000) return 'busy';
  return 'idle';
}
```

**`app/api/openclaw/sessions/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const agentId = searchParams.get('agentId');
    
    const cmd = agentId
      ? `openclaw sessions --agent ${agentId} --json`
      : 'openclaw sessions --all-agents --json';
    
    const { stdout } = await execAsync(cmd);
    const data = JSON.parse(stdout);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Sessions fetch error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
```

---

### Phase 2: React Query Hooks (Day 2-3)

**Create These Files:**
```
hooks/
├── useHealth.ts             ✅ DONE
├── useAgents.ts             ⏳ TODO
├── useSessions.ts           ⏳ TODO
├── useTasks.ts              ⏳ TODO
└── useLogs.ts               ⏳ TODO
```

**Templates:**

**`hooks/useAgents.ts`:**
```typescript
import { useQuery } from '@tanstack/react-query';

export function useAgents(filter?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['agents', filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter?.status) params.set('status', filter.status);
      if (filter?.search) params.set('search', filter.search);
      
      const response = await fetch(`/api/openclaw/agents?${params}`);
      if (!response.ok) throw new Error('Failed to fetch agents');
      return response.json();
    },
    refetchInterval: 15 * 1000, // 15 seconds
  });
}
```

**`hooks/useSessions.ts`:**
```typescript
import { useQuery } from '@tanstack/react-query';

export function useSessions(filter?: { 
  agentId?: string; 
  active?: boolean;
}) {
  return useQuery({
    queryKey: ['sessions', filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter?.agentId) params.set('agentId', filter.agentId);
      if (filter?.active) params.set('active', '7200000'); // 2 hours
      
      const response = await fetch(`/api/openclaw/sessions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch sessions');
      return response.json();
    },
    refetchInterval: 10 * 1000, // 10 seconds
  });
}
```

---

### Phase 3: Update Pages (Day 3-5)

**Update These Pages:**
```
app/
├── page.tsx                 ✅ DONE (Overview)
├── agents/page.tsx          ⏳ TODO
├── sessions/page.tsx        ⏳ TODO
├── tasks/page.tsx           ⏳ TODO
└── logs/page.tsx            ⏳ TODO
```

**Template for Agents Page:**

**`app/agents/page.tsx`:**
```typescript
'use client';

import { useState } from 'react';
import { useAgents } from '@/hooks/useAgents';
import { Card } from '@/components/ui/card';

export default function AgentsPage() {
  const [filter, setFilter] = useState({ status: '', search: '' });
  const { data, isLoading, error } = useAgents(filter);
  
  if (isLoading) return <div>Loading agents...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agents</h1>
        <div className="flex gap-4">
          {/* Filter by status */}
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="glass-input"
          >
            <option value="">All Status</option>
            <option value="idle">Idle</option>
            <option value="busy">Busy</option>
            <option value="spawned">Spawned</option>
          </select>
          
          {/* Search */}
          <input
            type="text"
            placeholder="Search agents..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="glass-input"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {data.agents.map((agent: any) => (
          <Card key={agent.agentId} className="glass-panel p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{agent.agentId}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                agent.status === 'busy' ? 'bg-green-500/20 text-green-400' :
                agent.status === 'spawned' ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {agent.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Sessions:</span>
                <span className="font-medium">{agent.sessionCount}</span>
              </div>
              
              {agent.lastActivityMs && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Last active:</span>
                  <span className="font-medium">
                    {formatRelativeTime(agent.lastActivityMs)}
                  </span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function formatRelativeTime(timestamp: number): string {
  const ageMs = Date.now() - timestamp;
  const minutes = Math.floor(ageMs / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}
```

---

### Phase 4: WebSocket (Day 5-7)

**Files to Create:**
```
lib/
└── websocket.ts             ⏳ TODO

app/providers/
└── websocket.tsx            ⏳ TODO
```

**Copy from:** `WEBSOCKET_INTEGRATION.md`

---

## 🎯 Priority Order

**Day 1:**
1. ✅ Health API route
2. ✅ Health hook
3. ✅ Update Overview page
4. ⏳ Agents API route
5. ⏳ Agents hook

**Day 2:**
6. ⏳ Update Agents page
7. ⏳ Sessions API route
8. ⏳ Sessions hook

**Day 3:**
9. ⏳ Update Sessions page
10. ⏳ Tasks API route (use session proxy)
11. ⏳ Tasks hook

**Day 4:**
12. ⏳ Update Tasks page
13. ⏳ Logs API route (SSE)
14. ⏳ Logs hook

**Day 5:**
15. ⏳ Update Logs page
16. ⏳ WebSocket client

**Day 6-7:**
17. ⏳ WebSocket provider
18. ⏳ Real-time updates
19. ⏳ Error boundaries
20. ⏳ Testing

---

## 📚 Reference Documents

1. **BACKEND_INTEGRATION_STRATEGY.md** - Architecture
2. **API_ENDPOINTS.md** - Endpoint specs
3. **DATA_SCHEMAS.md** - TypeScript types
4. **WEBSOCKET_INTEGRATION.md** - Real-time updates
5. **AUTHENTICATION_STRATEGY.md** - Security

---

## 🆘 Troubleshooting

### Gateway Not Responding
```bash
# Check if gateway is running
openclaw gateway status

# Start gateway
openclaw gateway run

# Check logs
openclaw logs
```

### Token Issues
```bash
# Get token
cat ~/.openclaw/config.json5 | grep token

# Set new token
openclaw config set gateway.auth.token "your-token"
```

### CORS Errors
```typescript
// API routes run server-side, no CORS needed
// Never call gateway directly from browser
```

### WebSocket Connection Failed
```bash
# Check gateway supports WebSocket
openclaw gateway call health --json

# Verify WS URL
echo %OPENCLAW_GATEWAY_WS_URL%
```

---

## ✅ Success Criteria

**You know it's working when:**
- ✅ Overview shows real agent count
- ✅ Agents page lists all agents
- ✅ Sessions page shows active sessions
- ✅ Logs stream in real-time
- ✅ No mock data anywhere
- ✅ Live updates (WebSocket)

---

**Start now:** Follow Day 1 tasks above! 🚀

**Questions?** Check the 5 reference documents or ask the backend specialist.

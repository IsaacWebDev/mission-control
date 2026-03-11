# Mission Control - WebSocket Integration Plan

**Version:** 1.0  
**Date:** March 11, 2026  
**Purpose:** Real-time updates via WebSocket connection to OpenClaw Gateway

---

## Table of Contents

1. [Overview](#overview)
2. [WebSocket Architecture](#websocket-architecture)
3. [Connection Management](#connection-management)
4. [Event Handling](#event-handling)
5. [React Query Integration](#react-query-integration)
6. [Implementation Guide](#implementation-guide)
7. [Testing Strategy](#testing-strategy)

---

## Overview

### Why WebSocket?

Real-time updates for:
- ✅ Agent status changes (idle ↔ busy)
- ✅ New sessions created
- ✅ Session updates (messages, tokens)
- ✅ Task status changes
- ✅ System health changes
- ✅ Live log streaming

### Gateway WebSocket Endpoint

```typescript
const WS_URL = process.env.OPENCLAW_GATEWAY_WS_URL || 'ws://127.0.0.1:18789';
const WS_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;
```

---

## WebSocket Architecture

### Connection Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Mission Control UI                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  WebSocket Client (lib/websocket.ts)               │    │
│  │  • Auto-reconnect                                  │    │
│  │  • Heartbeat                                        │    │
│  │  • Event dispatch                                   │    │
│  └──────────────────┬─────────────────────────────────┘    │
│                     │                                        │
│  ┌──────────────────▼─────────────────────────────────┐    │
│  │  WebSocket Provider (app/providers/websocket.tsx)  │    │
│  │  • React Context                                    │    │
│  │  • Connection state                                 │    │
│  │  • Event hooks                                      │    │
│  └──────────────────┬─────────────────────────────────┘    │
│                     │                                        │
│  ┌──────────────────▼─────────────────────────────────┐    │
│  │  React Query Integration                            │    │
│  │  • Cache invalidation                               │    │
│  │  • Optimistic updates                               │    │
│  │  • Real-time sync                                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              │ WebSocket (ws://)
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                  OpenClaw Gateway                            │
│                    Port 18789                                │
│                                                              │
│  • Authentication (Bearer token)                             │
│  • Event broadcasting                                        │
│  • Health monitoring                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Connection Management

### WebSocket Client (`lib/websocket.ts`)

```typescript
import EventEmitter from 'events';

export enum WSConnectionState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

export interface WSMessage {
  type: string;
  data: any;
  timestamp: number;
}

export interface WSConfig {
  url: string;
  token: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

export class OpenClawWebSocket extends EventEmitter {
  private ws: WebSocket | null = null;
  private state: WSConnectionState = WSConnectionState.DISCONNECTED;
  private reconnectAttempts = 0;
  private heartbeatTimer?: NodeJS.Timeout;
  private reconnectTimer?: NodeJS.Timeout;
  
  constructor(private config: WSConfig) {
    super();
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config,
    };
  }
  
  /**
   * Connect to OpenClaw Gateway WebSocket
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket already connected');
      return;
    }
    
    this.setState(WSConnectionState.CONNECTING);
    
    try {
      this.ws = new WebSocket(this.config.url);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.setState(WSConnectionState.ERROR);
      this.scheduleReconnect();
    }
  }
  
  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    this.clearTimers();
    this.reconnectAttempts = 0;
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.setState(WSConnectionState.DISCONNECTED);
  }
  
  /**
   * Send message to gateway
   */
  send(message: any): void {
    if (this.state !== WSConnectionState.CONNECTED) {
      console.warn('WebSocket not connected, message not sent');
      return;
    }
    
    try {
      this.ws?.send(JSON.stringify(message));
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
    }
  }
  
  /**
   * Get current connection state
   */
  getState(): WSConnectionState {
    return this.state;
  }
  
  /**
   * Handle WebSocket open
   */
  private handleOpen(): void {
    console.log('OpenClaw WebSocket connected');
    this.setState(WSConnectionState.CONNECTED);
    this.reconnectAttempts = 0;
    
    // Authenticate
    this.authenticate();
    
    // Start heartbeat
    this.startHeartbeat();
    
    this.emit('connected');
  }
  
  /**
   * Handle WebSocket message
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WSMessage = JSON.parse(event.data);
      
      // Emit specific event type
      this.emit(message.type, message.data);
      
      // Emit general message event
      this.emit('message', message);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }
  
  /**
   * Handle WebSocket error
   */
  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    this.setState(WSConnectionState.ERROR);
    this.emit('error', event);
  }
  
  /**
   * Handle WebSocket close
   */
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket closed:', event.code, event.reason);
    this.setState(WSConnectionState.DISCONNECTED);
    this.clearTimers();
    
    this.emit('disconnected', {
      code: event.code,
      reason: event.reason,
    });
    
    // Attempt reconnect
    this.scheduleReconnect();
  }
  
  /**
   * Authenticate with gateway
   */
  private authenticate(): void {
    this.send({
      type: 'auth',
      data: {
        token: this.config.token,
      },
    });
  }
  
  /**
   * Start heartbeat timer
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.state === WSConnectionState.CONNECTED) {
        this.send({ type: 'ping' });
      }
    }, this.config.heartbeatInterval);
  }
  
  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 10)) {
      console.error('Max reconnection attempts reached');
      this.emit('max_reconnect_attempts');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.config.reconnectInterval! * this.reconnectAttempts;
    
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    this.reconnectTimer = setTimeout(() => {
      console.log(`Reconnecting (attempt ${this.reconnectAttempts})...`);
      this.connect();
    }, delay);
  }
  
  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
  }
  
  /**
   * Set connection state
   */
  private setState(state: WSConnectionState): void {
    this.state = state;
    this.emit('state_change', state);
  }
}
```

---

## Event Handling

### Event Types

```typescript
/**
 * WebSocket event types from OpenClaw Gateway
 */
export enum WSEventType {
  // Connection
  AUTH_SUCCESS = 'auth:success',
  AUTH_FAILED = 'auth:failed',
  
  // Health
  HEALTH_UPDATE = 'health:update',
  CHANNEL_STATUS = 'channel:status',
  
  // Agents
  AGENT_STATUS = 'agent:status',
  AGENT_STARTED = 'agent:started',
  AGENT_STOPPED = 'agent:stopped',
  
  // Sessions
  SESSION_CREATED = 'session:created',
  SESSION_UPDATED = 'session:updated',
  SESSION_MESSAGE = 'session:message',
  SESSION_ENDED = 'session:ended',
  
  // Tasks (derived)
  TASK_STARTED = 'task:started',
  TASK_UPDATED = 'task:updated',
  TASK_COMPLETED = 'task:completed',
  
  // Logs
  LOG_ENTRY = 'log:entry',
  
  // System
  SYSTEM_STATUS = 'system:status',
  ERROR = 'error',
}

/**
 * Event payload interfaces
 */
export interface AgentStatusEvent {
  agentId: string;
  status: 'idle' | 'busy' | 'spawned';
  timestamp: number;
}

export interface SessionCreatedEvent {
  sessionId: string;
  sessionKey: string;
  agentId: string;
  channel: string;
  kind: 'direct' | 'group';
  timestamp: number;
}

export interface SessionUpdatedEvent {
  sessionId: string;
  agentId: string;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  timestamp: number;
}

export interface LogEntryEvent {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  agentId?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}
```

### Event Dispatcher

```typescript
/**
 * Event dispatcher for WebSocket events
 */
export class WSEventDispatcher {
  constructor(private ws: OpenClawWebSocket) {
    this.registerHandlers();
  }
  
  private registerHandlers(): void {
    // Agent events
    this.ws.on(WSEventType.AGENT_STATUS, this.handleAgentStatus.bind(this));
    
    // Session events
    this.ws.on(WSEventType.SESSION_CREATED, this.handleSessionCreated.bind(this));
    this.ws.on(WSEventType.SESSION_UPDATED, this.handleSessionUpdated.bind(this));
    
    // Log events
    this.ws.on(WSEventType.LOG_ENTRY, this.handleLogEntry.bind(this));
    
    // Health events
    this.ws.on(WSEventType.HEALTH_UPDATE, this.handleHealthUpdate.bind(this));
  }
  
  private handleAgentStatus(event: AgentStatusEvent): void {
    console.log('Agent status changed:', event);
    // Trigger React Query cache invalidation
    this.invalidateQuery(['agents', 'detail', event.agentId]);
    this.invalidateQuery(['agents', 'list']);
  }
  
  private handleSessionCreated(event: SessionCreatedEvent): void {
    console.log('Session created:', event);
    this.invalidateQuery(['sessions', 'list']);
    this.invalidateQuery(['agents', 'detail', event.agentId]);
  }
  
  private handleSessionUpdated(event: SessionUpdatedEvent): void {
    console.log('Session updated:', event);
    this.invalidateQuery(['sessions', 'detail', event.sessionId]);
  }
  
  private handleLogEntry(event: LogEntryEvent): void {
    // Real-time log streaming handled by component
    console.log('Log entry:', event);
  }
  
  private handleHealthUpdate(event: any): void {
    console.log('Health update:', event);
    this.invalidateQuery(['health']);
  }
  
  private invalidateQuery(queryKey: any[]): void {
    // Implemented by React Query integration
    // See React Query Integration section
  }
}
```

---

## React Query Integration

### WebSocket Provider (`app/providers/websocket.tsx`)

```typescript
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { OpenClawWebSocket, WSConnectionState } from '@/lib/websocket';

interface WebSocketContextValue {
  ws: OpenClawWebSocket | null;
  state: WSConnectionState;
  connect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  ws: null,
  state: WSConnectionState.DISCONNECTED,
  connect: () => {},
  disconnect: () => {},
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [ws, setWs] = useState<OpenClawWebSocket | null>(null);
  const [state, setState] = useState<WSConnectionState>(WSConnectionState.DISCONNECTED);
  
  useEffect(() => {
    // Initialize WebSocket
    const wsInstance = new OpenClawWebSocket({
      url: process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:18789',
      token: process.env.NEXT_PUBLIC_WS_TOKEN || '',
    });
    
    // State change handler
    wsInstance.on('state_change', (newState: WSConnectionState) => {
      setState(newState);
    });
    
    // Agent events
    wsInstance.on('agent:status', (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    });
    
    // Session events
    wsInstance.on('session:created', (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['agents', 'detail', data.agentId] });
    });
    
    wsInstance.on('session:updated', (data: any) => {
      queryClient.invalidateQueries({ 
        queryKey: ['sessions', 'detail', data.sessionId] 
      });
    });
    
    // Health events
    wsInstance.on('health:update', () => {
      queryClient.invalidateQueries({ queryKey: ['health'] });
    });
    
    setWs(wsInstance);
    
    // Auto-connect
    wsInstance.connect();
    
    // Cleanup
    return () => {
      wsInstance.disconnect();
    };
  }, [queryClient]);
  
  const connect = () => ws?.connect();
  const disconnect = () => ws?.disconnect();
  
  return (
    <WebSocketContext.Provider value={{ ws, state, connect, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
```

### Custom Hooks

```typescript
/**
 * Hook to subscribe to WebSocket events
 */
export function useWebSocketEvent<T = any>(
  eventType: WSEventType,
  handler: (data: T) => void
) {
  const { ws } = useWebSocket();
  
  useEffect(() => {
    if (!ws) return;
    
    ws.on(eventType, handler);
    
    return () => {
      ws.off(eventType, handler);
    };
  }, [ws, eventType, handler]);
}

/**
 * Hook for WebSocket connection state
 */
export function useWebSocketState() {
  const { state } = useWebSocket();
  
  return {
    state,
    isConnecting: state === WSConnectionState.CONNECTING,
    isConnected: state === WSConnectionState.CONNECTED,
    isDisconnected: state === WSConnectionState.DISCONNECTED,
    isError: state === WSConnectionState.ERROR,
  };
}

/**
 * Hook for real-time logs
 */
export function useRealtimeLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  useWebSocketEvent(WSEventType.LOG_ENTRY, (log: LogEntry) => {
    setLogs(prev => [...prev, log].slice(-100)); // Keep last 100
  });
  
  return logs;
}

/**
 * Hook for agent status updates
 */
export function useAgentStatusUpdates(agentId: string) {
  const [status, setStatus] = useState<string | null>(null);
  
  useWebSocketEvent(WSEventType.AGENT_STATUS, (data: AgentStatusEvent) => {
    if (data.agentId === agentId) {
      setStatus(data.status);
    }
  });
  
  return status;
}
```

---

## Implementation Guide

### Step 1: Install Dependencies

```bash
cd mission-control
npm install --save-dev @types/node
```

### Step 2: Create WebSocket Client

```bash
# Create lib/websocket.ts
touch lib/websocket.ts
```

Copy the `OpenClawWebSocket` class implementation.

### Step 3: Create WebSocket Provider

```bash
# Create app/providers/websocket.tsx
mkdir -p app/providers
touch app/providers/websocket.tsx
```

Copy the `WebSocketProvider` implementation.

### Step 4: Wrap App with Provider

```typescript
// app/layout.tsx
import { WebSocketProvider } from './providers/websocket';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          <WebSocketProvider>
            {children}
          </WebSocketProvider>
        </Providers>
      </body>
    </html>
  );
}
```

### Step 5: Use in Components

```typescript
// components/agents/agent-status.tsx
'use client';

import { useWebSocketState, useAgentStatusUpdates } from '@/lib/hooks/websocket';

export function AgentStatus({ agentId }: { agentId: string }) {
  const { isConnected } = useWebSocketState();
  const realtimeStatus = useAgentStatusUpdates(agentId);
  
  return (
    <div>
      {isConnected && <span className="text-green-400">● Live</span>}
      {realtimeStatus && <span>Status: {realtimeStatus}</span>}
    </div>
  );
}
```

### Step 6: Connection Status Indicator

```typescript
// components/layout/connection-status.tsx
'use client';

import { useWebSocketState } from '@/lib/hooks/websocket';

export function ConnectionStatus() {
  const { state, isConnected, isConnecting, isError } = useWebSocketState();
  
  return (
    <div className="flex items-center gap-2">
      {isConnected && (
        <>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400">Live</span>
        </>
      )}
      {isConnecting && (
        <>
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-xs text-gray-400">Connecting...</span>
        </>
      )}
      {isError && (
        <>
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-xs text-red-400">Disconnected</span>
        </>
      )}
    </div>
  );
}
```

---

## Testing Strategy

### Local Testing

```typescript
// __tests__/websocket.test.ts
import { OpenClawWebSocket } from '@/lib/websocket';

describe('OpenClawWebSocket', () => {
  let ws: OpenClawWebSocket;
  
  beforeEach(() => {
    ws = new OpenClawWebSocket({
      url: 'ws://127.0.0.1:18789',
      token: 'test-token',
    });
  });
  
  afterEach(() => {
    ws.disconnect();
  });
  
  it('should connect successfully', (done) => {
    ws.on('connected', () => {
      expect(ws.getState()).toBe('connected');
      done();
    });
    
    ws.connect();
  });
  
  it('should handle authentication', (done) => {
    ws.on('auth:success', () => {
      done();
    });
    
    ws.connect();
  });
  
  it('should receive events', (done) => {
    ws.on('agent:status', (data) => {
      expect(data).toBeDefined();
      done();
    });
    
    ws.connect();
  });
});
```

### Manual Testing Checklist

- [ ] WebSocket connects on app load
- [ ] Authentication succeeds
- [ ] Heartbeat keeps connection alive
- [ ] Events trigger cache invalidation
- [ ] Reconnects after disconnect
- [ ] Max reconnect attempts respected
- [ ] UI shows connection status
- [ ] Real-time logs streaming
- [ ] Agent status updates immediately
- [ ] Session updates reflected

---

## Performance Considerations

### Throttling Events

```typescript
import { throttle } from 'lodash';

// Throttle frequent events
const throttledInvalidate = throttle((queryKey) => {
  queryClient.invalidateQueries({ queryKey });
}, 1000); // Max once per second

wsInstance.on('session:updated', (data) => {
  throttledInvalidate(['sessions', 'list']);
});
```

### Selective Invalidation

```typescript
// Only invalidate affected queries
wsInstance.on('agent:status', (data: AgentStatusEvent) => {
  // Specific agent
  queryClient.invalidateQueries({ 
    queryKey: ['agents', 'detail', data.agentId] 
  });
  
  // Only if agent list is visible
  if (isAgentListVisible) {
    queryClient.invalidateQueries({ queryKey: ['agents', 'list'] });
  }
});
```

### Optimistic Updates

```typescript
// Update cache immediately before server confirms
wsInstance.on('session:message', (data) => {
  queryClient.setQueryData(
    ['sessions', 'detail', data.sessionId],
    (old: any) => ({
      ...old,
      messages: [...old.messages, data.message]
    })
  );
});
```

---

## Fallback Strategy

### Polling Fallback

```typescript
// If WebSocket fails, fall back to polling
const { isConnected } = useWebSocketState();

useQuery({
  queryKey: ['agents'],
  queryFn: fetchAgents,
  refetchInterval: isConnected ? false : 15000, // Poll only if WS down
});
```

---

## Next Steps

1. **Implement WebSocket Client:** Create `lib/websocket.ts`
2. **Add Provider:** Wrap app with `WebSocketProvider`
3. **Test Connection:** Verify connectivity with gateway
4. **Add Event Handlers:** Implement cache invalidation
5. **Add UI Indicators:** Show connection status
6. **Test Real-Time Updates:** Verify data flows
7. **Add Fallback:** Implement polling for resilience

---

**Ready for Implementation** ✅

See:
- `BACKEND_INTEGRATION_STRATEGY.md` for context
- `API_ENDPOINTS.md` for HTTP endpoints
- `DATA_SCHEMAS.md` for type definitions

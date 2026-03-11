# Production Blockers - Priority Action Plan

**Status:** 🚨 **4 CRITICAL ISSUES MUST BE RESOLVED**

---

## P0: Must Fix Before Deployment (4.5 hours)

### 1. Hydration Warning Fix (30 min)
**Current:** `suppressHydrationWarning` on header elements  
**Root Cause:** Server renders empty strings, client renders dynamic data  
**Impact:** Console warnings, potential rendering bugs  

**Fix:**
```tsx
// components/HeaderStatus.tsx (NEW FILE)
'use client';
export default function HeaderStatus() {
  const [time, setTime] = useState(new Date().toLocaleTimeString(...));
  useEffect(() => {
    const i = setInterval(() => setTime(new Date().toLocaleTimeString(...)), 1000);
    return () => clearInterval(i);
  }, []);
  return <>{time}</>;
}

// components/header.tsx
import dynamic from 'next/dynamic';
const DynamicStatus = dynamic(() => import('./HeaderStatus'), { ssr: false });

export default function Header() {
  return (
    <header>
      {/* ... */}
      <DynamicStatus />
      {/* ... */}
    </header>
  );
}
```

**Remove all instances of `suppressHydrationWarning`**

---

### 2. Error Boundaries (1 hour)
**Current:** No error boundaries, crashes break entire app  
**Impact:** One component error = whole app down  

**Fix:**
```tsx
// components/ErrorBoundary.tsx (NEW FILE)
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    // TODO: Log to Sentry
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card p-8">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// app/layout.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

### 3. TypeScript Types (2 hours)
**Current:** 47 instances of `any` type, no interface definitions  
**Impact:** No type safety, hard to maintain, bugs slip through  

**Fix:**
```typescript
// lib/types/session.ts (NEW FILE)
export interface Session {
  key: string;
  sessionId: string;
  agentId: string;
  startedAt: number;
  updatedAt: number;
  ageMs: number;
  createdAt?: number;
}

// lib/types/agent.ts (NEW FILE)
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

// lib/types/task.ts (NEW FILE)
export interface Task {
  id: string;
  sessionKey: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  description: string;
  startedAt: number;
  completedAt?: number;
}
```

**Replace all `any` types in:**
- `app/tasks/page.tsx` (8 instances)
- `app/agents/page.tsx` (6 instances)
- `app/sessions/page.tsx` (6 instances)
- `app/page.tsx` (12 instances)
- API routes (15 instances)

---

### 4. API Error Handling (1 hour)
**Current:** Generic error catching, exposes internal errors to client  
**Impact:** Poor user experience, potential security issue  

**Fix:**
```typescript
// lib/errors.ts (NEW FILE)
export class OpenClawError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'OpenClawError';
  }
}

export class NetworkError extends OpenClawError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR', 503, true);
  }
}

export function normalizeError(error: unknown): OpenClawError {
  if (error instanceof OpenClawError) return error;
  if (error instanceof Error) {
    if (error.message.includes('fetch')) return new NetworkError(error.message);
    return new OpenClawError(error.message, 'UNKNOWN', 500);
  }
  return new OpenClawError('An unexpected error occurred', 'UNKNOWN', 500);
}

// app/api/openclaw/sessions/route.ts
export async function GET(req: NextRequest) {
  try {
    const data = await fetchSessions();
    return NextResponse.json(data);
  } catch (error) {
    const appError = normalizeError(error);
    console.error('API Error:', appError);
    
    return NextResponse.json(
      {
        ok: false,
        error: appError.code,
        message: appError.statusCode < 500 
          ? appError.message 
          : 'Internal server error',
      },
      { status: appError.statusCode }
    );
  }
}
```

**Update all API routes:**
- `app/api/openclaw/sessions/route.ts`
- `app/api/openclaw/agents/route.ts`
- `app/api/openclaw/health/route.ts`

---

## P1: Recommended Improvements (6 hours)

### 5. Component Extraction (2 hours)
Extract reusable components from monolithic pages:
- `TaskCard.tsx`
- `TaskList.tsx`
- `TaskStats.tsx`

### 6. Dedicated Tasks API (3 hours)
Stop deriving tasks from sessions:
- Create `/api/openclaw/tasks` endpoint
- Proper task lifecycle tracking
- Real-time task updates

### 7. Query Optimization (1 hour)
- Dynamic refetch intervals
- Exponential backoff on errors
- Memoize filter calculations

---

## Deployment Checklist

**Before deploying to production:**

- [ ] Hydration warnings fixed (no `suppressHydrationWarning`)
- [ ] Error boundaries added to layout
- [ ] All `any` types replaced with proper types
- [ ] API error handling improved
- [ ] Production build succeeds (`npm run build`)
- [ ] No console errors in production build
- [ ] Manual smoke test: Agents, Sessions, Tasks, Logs pages
- [ ] Network tab: No 5xx errors
- [ ] Console: No React warnings

---

## Estimated Timeline

**P0 Only (minimum viable):** 4.5 hours  
**P0 + P1 (recommended):** 10.5 hours  

**Recommendation:** Allocate 2 full work days to complete P0 + P1 before production deployment.

---

## Risk Assessment

**Deploying WITHOUT P0 fixes:**

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Hydration flicker | High | Low | Users see UI jump, not broken |
| Unhandled errors crash app | Medium | **Critical** | One error = whole app down |
| Type bugs slip through | High | Medium | Runtime errors, hard to debug |
| Poor error messages | High | Low | Users confused but functional |

**Overall Risk:** 🚨 **HIGH - DO NOT DEPLOY WITHOUT P0 FIXES**

---

**Created:** 2026-03-11  
**Reviewer:** senior-dev subagent  
**Status:** ⚠️ Blocking production deployment

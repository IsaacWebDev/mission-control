# Mission Control - Authentication & Security Strategy

**Version:** 1.0  
**Date:** March 11, 2026  
**Purpose:** Secure authentication and authorization for Mission Control

---

## Table of Contents

1. [Overview](#overview)
2. [Environment Configuration](#environment-configuration)
3. [Gateway Authentication](#gateway-authentication)
4. [API Route Security](#api-route-security)
5. [Client-Side Security](#client-side-security)
6. [Production Deployment](#production-deployment)
7. [Security Checklist](#security-checklist)

---

## Overview

### Security Model

Mission Control runs **server-side** authentication:
- ✅ OpenClaw Gateway token stays server-side
- ✅ No client-side exposure of credentials
- ✅ API routes act as secure proxy
- ✅ Token-based gateway authentication
- ✅ Optional UI authentication layer

### Threat Model

**Mitigations:**
1. **Token Exposure:** Server-side only, env vars
2. **MITM Attacks:** HTTPS in production
3. **Unauthorized Access:** IP allowlist, rate limiting
4. **Token Theft:** Secure storage, rotation policy
5. **Session Hijacking:** HTTPOnly cookies (if UI auth added)

---

## Environment Configuration

### Environment Variables

**`.env.local` (NEVER commit to git):**
```bash
# OpenClaw Gateway
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_GATEWAY_TOKEN=your-secure-token-here
OPENCLAW_GATEWAY_WS_URL=ws://127.0.0.1:18789

# Mission Control (optional UI auth)
MISSION_CONTROL_AUTH_ENABLED=false
MISSION_CONTROL_SECRET=your-secret-key-here
MISSION_CONTROL_ALLOWED_IPS=127.0.0.1,192.168.1.0/24

# Environment
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**`.env.example` (commit this template):**
```bash
# OpenClaw Gateway
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_GATEWAY_TOKEN=<get-from-openclaw-config>
OPENCLAW_GATEWAY_WS_URL=ws://127.0.0.1:18789

# Mission Control
MISSION_CONTROL_AUTH_ENABLED=false
MISSION_CONTROL_SECRET=<generate-random-secret>
MISSION_CONTROL_ALLOWED_IPS=127.0.0.1

# Environment
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Getting the Gateway Token

**Option 1: From OpenClaw Config**
```bash
# Windows
type %USERPROFILE%\.openclaw\config.json5

# macOS/Linux
cat ~/.openclaw/config.json5
```

Look for:
```json5
{
  gateway: {
    auth: {
      mode: "token",
      token: "abc123..." // Copy this
    }
  }
}
```

**Option 2: Generate New Token**
```bash
# Set custom token
openclaw config set gateway.auth.token "your-secure-random-token"

# Verify
openclaw config get gateway.auth.token
```

**Option 3: Use Environment Variable**
```bash
# Set in shell
export OPENCLAW_GATEWAY_TOKEN="your-token"

# Gateway will use this
openclaw gateway run
```

### Token Security Best Practices

```typescript
// lib/config.ts
export const config = {
  gateway: {
    url: process.env.OPENCLAW_GATEWAY_URL!,
    token: process.env.OPENCLAW_GATEWAY_TOKEN!,
    wsUrl: process.env.OPENCLAW_GATEWAY_WS_URL!,
  },
  
  // Validate on startup
  validate() {
    if (!this.gateway.token) {
      throw new Error('OPENCLAW_GATEWAY_TOKEN is required');
    }
    if (this.gateway.token.length < 32) {
      console.warn('Gateway token is short, consider using a longer token');
    }
  }
};

// Validate in app startup
config.validate();
```

---

## Gateway Authentication

### Gateway Auth Configuration

**OpenClaw Config (`~/.openclaw/config.json5`):**
```json5
{
  gateway: {
    // Auth mode
    auth: {
      mode: "token",           // Use token auth
      token: "secure-random-token-here",
      
      // Rate limiting
      rateLimit: {
        enabled: true,
        maxAttempts: 100,      // Max requests per window
        windowMs: 60000        // 1 minute window
      }
    },
    
    // Network binding
    bind: "loopback",          // Only localhost (127.0.0.1)
    port: 18789,
    
    // HTTP endpoints
    http: {
      endpoints: {
        chatCompletions: {
          enabled: false       // Disable OpenAI endpoint
        }
      }
    }
  }
}
```

### Server-Side Auth Headers

**Gateway API Call (`lib/openclaw.ts`):**
```typescript
import { config } from './config';

export async function callGatewayHTTP(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${config.gateway.url}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${config.gateway.token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  // Handle auth errors
  if (response.status === 401) {
    throw new AuthenticationError('Invalid gateway token');
  }
  
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    throw new RateLimitError(
      retryAfter ? parseInt(retryAfter) : 60,
      'Gateway rate limit exceeded'
    );
  }
  
  return response;
}

/**
 * Invoke OpenClaw tool via /tools/invoke
 */
export async function invokeTool(
  tool: string,
  args: any = {},
  sessionKey?: string
): Promise<any> {
  const response = await callGatewayHTTP('/tools/invoke', {
    method: 'POST',
    body: JSON.stringify({
      tool,
      args,
      action: 'json',
      sessionKey: sessionKey || 'main',
    }),
  });
  
  const data = await response.json();
  
  if (!data.ok) {
    throw new Error(data.error?.message || 'Tool invocation failed');
  }
  
  return data.result;
}
```

### WebSocket Authentication

**WebSocket Auth Flow:**
```typescript
// lib/websocket.ts
class OpenClawWebSocket {
  private authenticate(): void {
    // Send auth message after connection
    this.send({
      type: 'auth',
      data: {
        token: this.config.token,
      },
    });
    
    // Listen for auth response
    this.once('auth:success', () => {
      console.log('WebSocket authenticated');
    });
    
    this.once('auth:failed', (error) => {
      console.error('WebSocket auth failed:', error);
      this.disconnect();
    });
  }
}
```

---

## API Route Security

### Middleware Protection

**`middleware.ts` (Optional):**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { config } from './lib/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Protect /api/openclaw/* routes
  if (pathname.startsWith('/api/openclaw')) {
    // IP allowlist check
    if (config.missionControl.allowedIPs) {
      const clientIP = request.ip || request.headers.get('x-forwarded-for');
      
      if (!isIPAllowed(clientIP, config.missionControl.allowedIPs)) {
        return NextResponse.json(
          { error: 'Forbidden: IP not allowed' },
          { status: 403 }
        );
      }
    }
    
    // Rate limiting (simple in-memory)
    if (!checkRateLimit(request)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/openclaw/:path*',
};

/**
 * Check if IP is in allowlist
 */
function isIPAllowed(clientIP: string | null, allowlist: string): boolean {
  if (!clientIP) return false;
  
  const allowed = allowlist.split(',').map(ip => ip.trim());
  
  // Check exact match
  if (allowed.includes(clientIP)) return true;
  
  // Check CIDR ranges (simplified)
  // TODO: Implement proper CIDR matching
  
  return false;
}

/**
 * Simple rate limiter (in-memory)
 */
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(request: NextRequest): boolean {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 100;
  
  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}
```

### API Route Template

**Secure API Route Pattern:**
```typescript
// app/api/openclaw/health/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { invokeTool } from '@/lib/openclaw';
import { handleAPIError } from '@/lib/errors';

/**
 * GET /api/openclaw/health
 * 
 * Returns OpenClaw Gateway health status
 */
export async function GET(request: NextRequest) {
  try {
    // Validate environment
    if (!process.env.OPENCLAW_GATEWAY_TOKEN) {
      return NextResponse.json(
        { error: 'Gateway token not configured' },
        { status: 500 }
      );
    }
    
    // Call gateway (server-side)
    const health = await invokeTool('health');
    
    // Return data
    return NextResponse.json(health, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Other HTTP methods not allowed
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
```

**Error Handler (`lib/errors.ts`):**
```typescript
import { NextResponse } from 'next/server';
import { OpenClawError, ErrorType } from '@/types/openclaw';

export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  // OpenClaw-specific errors
  if (error instanceof OpenClawError) {
    const status = getStatusCode(error.type);
    return NextResponse.json(
      {
        ok: false,
        error: error.toJSON(),
      },
      { status }
    );
  }
  
  // Generic errors
  return NextResponse.json(
    {
      ok: false,
      error: {
        type: ErrorType.UNKNOWN,
        message: 'Internal server error',
        timestamp: Date.now(),
      },
    },
    { status: 500 }
  );
}

function getStatusCode(errorType: ErrorType): number {
  switch (errorType) {
    case ErrorType.AUTH_FAILED:
      return 401;
    case ErrorType.NOT_FOUND:
    case ErrorType.TOOL_NOT_FOUND:
      return 404;
    case ErrorType.RATE_LIMITED:
      return 429;
    case ErrorType.GATEWAY_OFFLINE:
      return 503;
    case ErrorType.VALIDATION_ERROR:
      return 400;
    default:
      return 500;
  }
}
```

---

## Client-Side Security

### No Token Exposure

**❌ NEVER do this:**
```typescript
// WRONG: Token exposed to client
const GATEWAY_TOKEN = 'abc123'; // Visible in browser DevTools
fetch('http://127.0.0.1:18789/tools/invoke', {
  headers: { 'Authorization': `Bearer ${GATEWAY_TOKEN}` }
});
```

**✅ Correct approach:**
```typescript
// RIGHT: Token stays on server
// Client calls Next.js API route
const response = await fetch('/api/openclaw/health');
const data = await response.json();

// Server-side route handles gateway auth
// See app/api/openclaw/health/route.ts
```

### HTTPS Enforcement (Production)

**`next.config.ts`:**
```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};
```

### Content Security Policy

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // Next.js requires unsafe-inline
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' ws://127.0.0.1:18789", // WebSocket
      "font-src 'self'",
    ].join('; ')
  );
  
  return response;
}
```

---

## Production Deployment

### Deployment Checklist

**Pre-Deployment:**
- [ ] Generate strong gateway token (32+ chars)
- [ ] Set all environment variables
- [ ] Enable HTTPS
- [ ] Configure IP allowlist
- [ ] Enable rate limiting
- [ ] Review security headers
- [ ] Test authentication flow

### Environment-Specific Configs

**Development (`.env.local`):**
```bash
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_GATEWAY_WS_URL=ws://127.0.0.1:18789
MISSION_CONTROL_ALLOWED_IPS=127.0.0.1
NODE_ENV=development
```

**Production (`.env.production`):**
```bash
OPENCLAW_GATEWAY_URL=https://openclaw.yourdomain.com
OPENCLAW_GATEWAY_WS_URL=wss://openclaw.yourdomain.com
MISSION_CONTROL_ALLOWED_IPS=10.0.0.0/24,192.168.1.100
NODE_ENV=production
```

### Remote Access (Tailscale Recommended)

**Why Tailscale:**
- ✅ Zero-trust network
- ✅ Encrypted point-to-point
- ✅ No port forwarding
- ✅ Simple authentication

**Setup:**
```bash
# Install Tailscale
# https://tailscale.com/download

# Start Tailscale
tailscale up

# Get Tailscale IP
tailscale ip -4
# Example: 100.101.102.103

# Configure OpenClaw
openclaw config set gateway.bind "tailscale"
openclaw config set gateway.tailscaleIP "100.101.102.103"

# Restart gateway
openclaw gateway restart
```

**Access Mission Control:**
```
http://100.101.102.103:3000
```

### Reverse Proxy (Alternative)

**nginx Config:**
```nginx
server {
  listen 443 ssl http2;
  server_name openclaw.yourdomain.com;
  
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;
  
  # Mission Control UI
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  
  # WebSocket
  location /ws {
    proxy_pass http://127.0.0.1:18789;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
  }
}
```

---

## Security Checklist

### Development

- [ ] Token not committed to git
- [ ] `.env.local` in `.gitignore`
- [ ] Strong random token (32+ chars)
- [ ] Gateway bound to localhost
- [ ] No client-side token exposure
- [ ] HTTPS in production plan

### Production

- [ ] HTTPS enabled
- [ ] Secure token rotation policy
- [ ] IP allowlist configured
- [ ] Rate limiting enabled
- [ ] Security headers set
- [ ] CSP configured
- [ ] Logs monitored
- [ ] Intrusion detection
- [ ] Backup authentication method
- [ ] Token stored in secrets manager

### Monitoring

- [ ] Failed auth attempts logged
- [ ] Rate limit violations tracked
- [ ] WebSocket disconnects monitored
- [ ] Gateway health checked
- [ ] Alerts for suspicious activity

---

## Token Rotation Strategy

### Rotation Process

**1. Generate New Token:**
```bash
# Generate secure random token
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**2. Update Gateway Config:**
```bash
openclaw config set gateway.auth.token "new-token-here"
```

**3. Restart Gateway:**
```bash
openclaw gateway restart
```

**4. Update Mission Control:**
```bash
# Update .env.local
OPENCLAW_GATEWAY_TOKEN=new-token-here

# Restart Mission Control
npm run dev  # or pm2 restart mission-control
```

**5. Verify:**
```bash
curl http://127.0.0.1:3000/api/openclaw/health
# Should return health data
```

### Automated Rotation (Optional)

```typescript
// scripts/rotate-token.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';

const execAsync = promisify(exec);

async function rotateToken() {
  // Generate new token
  const newToken = crypto.randomBytes(32).toString('hex');
  
  // Update OpenClaw config
  await execAsync(`openclaw config set gateway.auth.token "${newToken}"`);
  
  // Update .env.local
  const envPath = '.env.local';
  let envContent = await fs.readFile(envPath, 'utf-8');
  envContent = envContent.replace(
    /OPENCLAW_GATEWAY_TOKEN=.*/,
    `OPENCLAW_GATEWAY_TOKEN=${newToken}`
  );
  await fs.writeFile(envPath, envContent);
  
  // Restart services
  await execAsync('openclaw gateway restart');
  await execAsync('pm2 restart mission-control');
  
  console.log('Token rotated successfully');
}

rotateToken().catch(console.error);
```

---

## Next Steps

1. **Set Environment Variables:** Configure `.env.local`
2. **Verify Token:** Test gateway connectivity
3. **Test API Routes:** Ensure authentication works
4. **Enable HTTPS:** Production deployment
5. **Configure Monitoring:** Track auth failures
6. **Document Rotation:** Plan token rotation schedule

---

**Ready for Implementation** ✅

See:
- `BACKEND_INTEGRATION_STRATEGY.md` for context
- `API_ENDPOINTS.md` for endpoint specs
- `WEBSOCKET_INTEGRATION.md` for WebSocket auth

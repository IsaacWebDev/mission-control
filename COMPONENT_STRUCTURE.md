# Mission Control - Component Structure Recommendations

**Date:** 2026-03-11  
**Architect:** ux-architect  
**Purpose:** Component hierarchy and implementation guide

---

## 🏗️ Component Tree

```
app/
├── layout.tsx (ROOT - unchanged)
│   ├── <Sidebar /> (fixed left, 240px)
│   ├── <Header /> (fixed top)
│   ├── <main>
│   │   └── page.tsx (DASHBOARD - see below)
│   └── <LiveFeed /> (fixed right, 320px)
│
└── page.tsx (DASHBOARD - major refactor)
    ├── <AlertBanner /> ← NEW
    │
    ├── <PrimaryStats> ← Refactored
    │   ├── <PrimaryStatCard title="System Health" />
    │   ├── <PrimaryStatCard title="Active Workload" />
    │   └── <PrimaryStatCard title="Security Status" />
    │
    ├── <SplitView> ← NEW container
    │   ├── <SystemOverview> ← NEW (left 60%)
    │   │   ├── <CollapsibleSection title="System Health">
    │   │   │   ├── <MetricRow label="Gateway" />
    │   │   │   ├── <MetricRow label="Memory" progress={30} />
    │   │   │   ├── <MetricRow label="Disk" progress={9} />
    │   │   │   └── <MetricRow label="Uptime" />
    │   │   │   
    │   │   ├── <CollapsibleSection title="Security & Audit">
    │   │   │   ├── <MetricRow label="Audit Events" />
    │   │   │   ├── <MetricRow label="Login Failures" />
    │   │   │   └── <MetricRow label="Webhooks" />
    │   │   │   
    │   │   └── <CollapsibleSection title="Backup & Pipelines">
    │   │       ├── <MetricRow label="Latest Backup" />
    │   │       └── <MetricRow label="Active Pipelines" />
    │   │
    │   └── <ActivityStream> ← Refactored (right 40%)
    │       ├── <SessionList items={sessions} />
    │       └── <LogEntryList items={logs} />
    │
    └── <ActionBar> ← Enhanced
        ├── <ActionButton icon="spawn" label="Spawn Agent" />
        ├── <ActionButton icon="logs" label="Logs" />
        ├── <ActionButton icon="tasks" label="Tasks" />
        ├── <ActionButton icon="memory" label="Memory" />
        └── <ActionButton icon="flows" label="Flows" />
```

---

## 📦 New Components to Create

### 1. `<AlertBanner />` (NEW)

**Location:** `components/AlertBanner.tsx`

```tsx
'use client';

import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useState } from 'react';

interface AlertBannerProps {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export default function AlertBanner({
  severity,
  title,
  message,
  actionLabel,
  onAction,
  dismissible = true,
  onDismiss
}: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const config = {
    critical: {
      icon: AlertCircle,
      bg: 'bg-red-500/10',
      border: 'border-red-500',
      text: 'text-red-400'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-500/10',
      border: 'border-amber-500',
      text: 'text-amber-400'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500',
      text: 'text-blue-400'
    }
  };

  const { icon: Icon, bg, border, text } = config[severity];

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div 
      className={`${bg} border-l-4 ${border} p-3 mb-5 rounded-r-lg transition-all duration-300`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${text} mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${text}`}>
            {title}
          </p>
          {message && (
            <p className="text-sm text-white/70 mt-1">
              {message}
            </p>
          )}
          {actionLabel && onAction && (
            <button 
              onClick={onAction}
              className={`text-xs ${text} underline hover:no-underline mt-2 transition-colors`}
            >
              {actionLabel} →
            </button>
          )}
        </div>
        {dismissible && (
          <button 
            onClick={handleDismiss}
            className={`${text} hover:opacity-70 transition-opacity flex-shrink-0`}
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
```

**Usage:**
```tsx
// In page.tsx
{failedLogins > 0 && (
  <AlertBanner 
    severity="critical"
    title={`CRITICAL: ${failedLogins} failed login attempts detected`}
    actionLabel="View security logs"
    onAction={() => router.push('/security')}
  />
)}
```

---

### 2. `<PrimaryStatCard />` (Enhanced)

**Location:** `components/PrimaryStatCard.tsx`

```tsx
'use client';

import { LucideIcon } from 'lucide-react';

interface PrimaryStatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  metric?: string;
  icon: LucideIcon;
  status: 'healthy' | 'warning' | 'critical' | 'normal';
  onClick?: () => void;
}

export default function PrimaryStatCard({
  title,
  value,
  subtitle,
  metric,
  icon: Icon,
  status,
  onClick
}: PrimaryStatCardProps) {
  const statusConfig = {
    healthy: {
      border: 'border-t-green-500',
      text: 'text-green-400',
      bg: 'bg-green-500/5'
    },
    warning: {
      border: 'border-t-amber-500',
      text: 'text-amber-400',
      bg: 'bg-amber-500/5'
    },
    critical: {
      border: 'border-t-red-500',
      text: 'text-red-400',
      bg: 'bg-red-500/5'
    },
    normal: {
      border: 'border-t-blue-500',
      text: 'text-blue-400',
      bg: 'bg-blue-500/5'
    }
  };

  const { border, text, bg } = statusConfig[status];

  return (
    <div 
      className={`
        glass-stat-card rounded-xl border-t-[3px] ${border} p-6 h-[140px]
        ${onClick ? 'cursor-pointer hover:scale-[1.01] transition-transform' : ''}
        ${bg}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-6 h-6 ${text}`} />
        <span className="text-[10px] uppercase tracking-wider text-white/50 font-medium">
          {title}
        </span>
      </div>
      
      <div className={`text-3xl font-semibold ${text} mb-1`}>
        {value}
      </div>
      
      <p className="text-sm text-white/70 mb-1">
        {subtitle}
      </p>
      
      {metric && (
        <p className="text-xs text-white/50">
          {metric}
        </p>
      )}
    </div>
  );
}
```

**Usage:**
```tsx
<PrimaryStatCard 
  title="System Health"
  value="Healthy"
  subtitle="All services operational"
  metric="42ms gateway latency"
  icon={Server}
  status="healthy"
  onClick={() => expandSystemDetails()}
/>
```

---

### 3. `<CollapsibleSection />` (NEW)

**Location:** `components/CollapsibleSection.tsx`

```tsx
'use client';

import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';
import { useState, ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  icon: LucideIcon;
  defaultOpen?: boolean;
  children: ReactNode;
  badge?: string | number;
}

export default function CollapsibleSection({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
  badge
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-white/70" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white/70" />
          )}
          <Icon className="w-4 h-4 text-white/70" />
          <h3 className="text-sm font-semibold text-white/95">
            {title}
          </h3>
        </div>
        {badge && (
          <span className="text-xs px-2 py-1 bg-white/[0.06] rounded-full text-white/70">
            {badge}
          </span>
        )}
      </button>
      
      <div 
        className={`
          transition-all duration-200 ease-out overflow-hidden
          ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-5 pb-5 space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}
```

**Usage:**
```tsx
<CollapsibleSection 
  title="System Health" 
  icon={Server}
  defaultOpen={true}
  badge="6 metrics"
>
  <MetricRow label="Gateway" value="online (42ms)" status="healthy" />
  <MetricRow label="Memory" value="2.4GB / 8GB" progress={30} />
</CollapsibleSection>
```

---

### 4. `<MetricRow />` (NEW)

**Location:** `components/MetricRow.tsx`

```tsx
'use client';

import { LucideIcon } from 'lucide-react';

interface MetricRowProps {
  label: string;
  value: string;
  status?: 'healthy' | 'warning' | 'critical';
  progress?: number; // 0-100 for progress bar
  icon?: LucideIcon;
  sublabel?: string;
}

export default function MetricRow({
  label,
  value,
  status,
  progress,
  icon: Icon,
  sublabel
}: MetricRowProps) {
  const statusConfig = {
    healthy: { dot: 'bg-green-500', text: 'text-green-400', bar: 'bg-green-500' },
    warning: { dot: 'bg-amber-500', text: 'text-amber-400', bar: 'bg-amber-500' },
    critical: { dot: 'bg-red-500', text: 'text-red-400', bar: 'bg-red-500' }
  };

  const statusStyle = status ? statusConfig[status] : null;

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-white/50" />}
          <span className="text-white/70">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {status && (
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle?.dot}`}></span>
          )}
          <span className={statusStyle?.text || 'text-white/95'}>
            {value}
          </span>
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
          <div 
            className={`h-full ${statusStyle?.bar || 'bg-blue-500'} rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {sublabel && (
        <p className="text-xs text-white/40 mt-1">
          {sublabel}
        </p>
      )}
    </div>
  );
}
```

**Usage:**
```tsx
<MetricRow 
  label="Gateway" 
  value="online (42ms)" 
  status="healthy" 
/>

<MetricRow 
  label="Memory" 
  value="30% used" 
  progress={30} 
  status="healthy"
  sublabel="2.4GB / 8GB"
/>
```

---

### 5. `<ActionButton />` (Enhanced)

**Location:** `components/ActionButton.tsx`

```tsx
'use client';

import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  sublabel?: string; // keyboard shortcut
  primary?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function ActionButton({
  icon: Icon,
  label,
  sublabel,
  primary = false,
  onClick,
  disabled = false
}: ActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        glass-button flex flex-col items-center justify-center gap-2 h-[72px] rounded-xl
        transition-all duration-150
        ${primary ? 'border-blue-500/50 bg-blue-500/5' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
      `}
    >
      <div className={`
        w-10 h-10 rounded-lg flex items-center justify-center
        transition-colors
        ${primary ? 'bg-blue-500/20' : 'bg-white/[0.06]'}
        ${!disabled && 'group-hover:bg-white/[0.1]'}
      `}>
        <Icon className={`w-5 h-5 ${primary ? 'text-blue-400' : 'text-white/90'}`} />
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-white/95">{label}</p>
        {sublabel && (
          <p className="text-[10px] text-white/40 mt-0.5 font-mono">{sublabel}</p>
        )}
      </div>
    </button>
  );
}
```

**Usage:**
```tsx
<ActionButton 
  icon={Zap} 
  label="Spawn Agent" 
  sublabel="⌘N"
  primary={true}
  onClick={() => spawnAgent()}
/>
```

---

### 6. `<SessionList />` & `<LogEntryList />` (Enhanced)

**Location:** `components/ActivityLists.tsx`

```tsx
'use client';

interface SessionItem {
  id: string;
  status: 'active' | 'idle';
  type: string;
  time: string;
}

interface LogEntry {
  time: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: string;
}

export function SessionList({ items, limit = 3 }: { items: SessionItem[], limit?: number }) {
  const displayItems = items.slice(0, limit);

  const statusConfig = {
    active: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    idle: { bg: 'bg-white/[0.06]', border: 'border-white/[0.08]', text: 'text-white/50' }
  };

  return (
    <div className="space-y-2">
      {displayItems.map(session => {
        const { bg, border, text } = statusConfig[session.status];
        return (
          <div key={session.id} className="flex items-center justify-between py-2">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-mono text-white/50 truncate">
                {session.id}
              </div>
              <div className="text-sm text-white/95 mt-1">
                {session.type}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              <span className={`text-xs px-2 py-1 rounded-full ${bg} border ${border} ${text}`}>
                {session.status}
              </span>
              <span className="text-xs text-white/50">
                {session.time}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LogEntryList({ items, limit = 4 }: { items: LogEntry[], limit?: number }) {
  const displayItems = items.slice(0, limit);

  const levelConfig = {
    error: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
    warn: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
    info: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' }
  };

  return (
    <div className="space-y-2 font-mono">
      {displayItems.map((log, i) => {
        const { bg, text, dot } = levelConfig[log.level];
        return (
          <div key={i} className="grid grid-cols-[auto_1fr] gap-3 items-start text-xs">
            <time className="text-white/50 tabular-nums">
              {log.time}
            </time>
            <div className="flex items-start gap-2 min-w-0">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ${bg} ${text} font-medium uppercase flex-shrink-0`}>
                <span className={`w-1 h-1 ${dot} rounded-full`}></span>
                {log.level}
              </span>
              <p className="text-white/90 leading-relaxed min-w-0">
                {log.message}
                {log.context && (
                  <span className="text-white/40 ml-2">
                    {log.context}
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

**Usage:**
```tsx
<SessionList 
  items={sessions} 
  limit={3} 
/>

<LogEntryList 
  items={logs} 
  limit={4} 
/>
```

---

## 🔄 Refactored page.tsx Structure

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Server, Activity, Shield, Archive, Users, Terminal } from 'lucide-react';
import AlertBanner from '@/components/AlertBanner';
import PrimaryStatCard from '@/components/PrimaryStatCard';
import CollapsibleSection from '@/components/CollapsibleSection';
import MetricRow from '@/components/MetricRow';
import ActionButton from '@/components/ActionButton';
import { SessionList, LogEntryList } from '@/components/ActivityLists';

export default function Dashboard() {
  // State management
  const [failedLogins, setFailedLogins] = useState(3);
  const [sessions, setSessions] = useState<SessionItem[]>([...]);
  const [logs, setLogs] = useState<LogEntry[]>([...]);
  
  // Real-time updates
  useEffect(() => {
    // WebSocket or polling logic
  }, []);

  return (
    <div className="p-5 space-y-5">
      {/* ZONE 1: Critical Alerts */}
      {failedLogins > 0 && (
        <AlertBanner 
          severity="critical"
          title={`CRITICAL: ${failedLogins} failed login attempts detected`}
          actionLabel="View security logs"
          onAction={() => handleSecurityAction()}
        />
      )}

      {/* ZONE 2: Primary Stats */}
      <div className="grid grid-cols-3 gap-5">
        <PrimaryStatCard 
          title="System Health"
          value="Healthy"
          subtitle="All services operational"
          metric="42ms gateway latency"
          icon={Server}
          status="healthy"
        />
        <PrimaryStatCard 
          title="Active Workload"
          value="16"
          subtitle="4 sessions • 0 agents • 12 tasks"
          metric="68 capacity available"
          icon={Activity}
          status="normal"
        />
        <PrimaryStatCard 
          title="Security Status"
          value="Warning"
          subtitle="3 failed login attempts"
          metric="0 errors today"
          icon={Shield}
          status="warning"
        />
      </div>

      {/* ZONE 3: Split View */}
      <div className="grid grid-cols-[60%_40%] gap-5">
        {/* Left: System Overview */}
        <div className="space-y-4">
          <CollapsibleSection 
            title="System Health" 
            icon={Server}
            defaultOpen={true}
            badge="6 metrics"
          >
            <MetricRow label="Gateway" value="online (42ms)" status="healthy" />
            <MetricRow label="Memory" value="30% used" progress={30} status="healthy" sublabel="2.4GB / 8GB" />
            <MetricRow label="Disk" value="9% used" progress={9} status="healthy" sublabel="45GB / 500GB" />
            <MetricRow label="Uptime" value="7d 4h 23m" />
          </CollapsibleSection>

          <CollapsibleSection 
            title="Security & Audit" 
            icon={Shield}
            badge="5 metrics"
          >
            <MetricRow label="Audit Events" value="247" />
            <MetricRow label="Login Failures" value="3" status="warning" />
            <MetricRow label="Activities" value="1,423" />
          </CollapsibleSection>

          <CollapsibleSection 
            title="Backup & Pipelines" 
            icon={Archive}
          >
            <MetricRow label="Latest Backup" value="2 hours ago" />
            <MetricRow label="Active Pipelines" value="3" />
          </CollapsibleSection>
        </div>

        {/* Right: Activity Stream */}
        <div className="glass-card rounded-2xl p-5 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                Active Sessions
              </h3>
              <span className="text-xs text-white/50">3 active</span>
            </div>
            <SessionList items={sessions} limit={3} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Recent Activity
              </h3>
              <button className="text-xs text-blue-400 hover:text-blue-300">
                View all →
              </button>
            </div>
            <LogEntryList items={logs} limit={4} />
          </div>
        </div>
      </div>

      {/* ZONE 4: Action Bar */}
      <div className="glass-card rounded-2xl p-4">
        <div className="grid grid-cols-5 gap-4">
          <ActionButton icon={Zap} label="Spawn Agent" sublabel="⌘N" primary onClick={() => {}} />
          <ActionButton icon={Terminal} label="Logs" sublabel="⌘L" onClick={() => {}} />
          <ActionButton icon={Kanban} label="Tasks" sublabel="⌘T" onClick={() => {}} />
          <ActionButton icon={Database} label="Memory" sublabel="⌘M" onClick={() => {}} />
          <ActionButton icon={GitBranch} label="Flows" sublabel="⌘F" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}
```

---

## 📂 File Organization

### New Structure
```
mission-control/
├── app/
│   ├── layout.tsx (unchanged)
│   ├── page.tsx (refactored - see above)
│   └── globals.css (add status colors)
│
├── components/
│   ├── AlertBanner.tsx ← NEW
│   ├── PrimaryStatCard.tsx ← NEW (enhanced)
│   ├── CollapsibleSection.tsx ← NEW
│   ├── MetricRow.tsx ← NEW
│   ├── ActionButton.tsx ← NEW
│   ├── ActivityLists.tsx ← NEW (SessionList + LogEntryList)
│   ├── header.tsx (unchanged)
│   ├── sidebar.tsx (unchanged)
│   └── livefeed.tsx (unchanged - already fixed)
│
└── docs/
    ├── LAYOUT_ARCHITECTURE.md ← Created
    ├── WIREFRAME.md ← Created
    └── COMPONENT_STRUCTURE.md ← This file
```

---

## 🎨 CSS Additions Required

Add to `app/globals.css`:

```css
/* Status Color Utilities */
.status-critical {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.status-warning {
  color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.1);
}

.status-healthy {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.status-info {
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}

/* Progress Bar Animations */
@keyframes progress-fill {
  from { width: 0; }
  to { width: var(--progress-width); }
}

.progress-bar-animated {
  animation: progress-fill 500ms ease-out forwards;
}

/* Collapse Transition */
.collapse-enter {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-active {
  max-height: 1000px;
  opacity: 1;
  transition: max-height 200ms ease-out, opacity 150ms ease-in;
}

.collapse-exit {
  max-height: 1000px;
  opacity: 1;
}

.collapse-exit-active {
  max-height: 0;
  opacity: 0;
  transition: max-height 200ms ease-in, opacity 150ms ease-out;
}
```

---

## ✅ Implementation Checklist

### Phase 1: Component Creation (frontend)
- [ ] Create `AlertBanner.tsx`
- [ ] Create `PrimaryStatCard.tsx` (enhanced)
- [ ] Create `CollapsibleSection.tsx`
- [ ] Create `MetricRow.tsx`
- [ ] Create `ActionButton.tsx`
- [ ] Create `ActivityLists.tsx` (SessionList + LogEntryList)

### Phase 2: Page Refactor (frontend)
- [ ] Refactor `page.tsx` with new 4-zone layout
- [ ] Integrate all new components
- [ ] Add state management for real-time updates
- [ ] Implement alert logic (show/hide based on conditions)

### Phase 3: Styling (frontend + ui-designer)
- [ ] Add status color utilities to `globals.css`
- [ ] Verify spacing matches wireframe specs
- [ ] Test collapse animations
- [ ] Ensure WCAG AA contrast ratios

### Phase 4: Testing (senior-dev)
- [ ] Component isolation tests
- [ ] Integration tests (all zones render)
- [ ] Responsive breakpoint tests
- [ ] Accessibility audit (keyboard navigation, screen readers)
- [ ] Performance check (Lighthouse score >90)

### Phase 5: Verification (reality-checker)
- [ ] Visual regression test
- [ ] Before/after screenshots
- [ ] Z-pattern scan flow verification
- [ ] Final sign-off

---

## 🚀 Migration Strategy

### Step-by-Step Implementation

**Step 1:** Create new components (don't touch page.tsx yet)
- Build and test each component in isolation
- Use Storybook or dedicated test pages

**Step 2:** Add CSS utilities
- Add status colors to `globals.css`
- Test color contrast ratios

**Step 3:** Refactor page.tsx incrementally
- Comment out old code (don't delete yet)
- Add Zone 1 (AlertBanner)
- Test → Add Zone 2 (PrimaryStats)
- Test → Add Zone 3 (SplitView)
- Test → Add Zone 4 (ActionBar)

**Step 4:** Remove old code
- Once all zones work, delete old commented code
- Clean up unused
# Mission Control - Frontend Implementation Guide

**For:** frontend agent  
**From:** ux-architect agent  
**Date:** 2026-03-11

---

## 🚀 Quick Start

**Read these files first:**
1. `LAYOUT_ARCHITECTURE.md` - Overall structure and hierarchy
2. `COMPONENT_STRUCTURE.md` - Component code and interfaces
3. `WIREFRAME.md` - Exact measurements

**Then implement in this order:**

---

## 📋 Implementation Checklist

### Phase 1: Component Creation (60 minutes)

#### Step 1: Create `components/AlertBanner.tsx` (10 min)
```bash
# Copy code from COMPONENT_STRUCTURE.md section "AlertBanner"
# Test with:
- severity="critical"
- severity="warning"
- severity="info"
- dismissible={true}
- dismissible={false}
```

**Acceptance:**
- [ ] Renders correct color based on severity
- [ ] Dismiss button works (component disappears)
- [ ] Action button triggers onClick
- [ ] Smooth fade-out animation

---

#### Step 2: Create `components/PrimaryStatCard.tsx` (15 min)
```bash
# Copy code from COMPONENT_STRUCTURE.md section "PrimaryStatCard"
# Test with all 4 status types:
- status="healthy" (green)
- status="warning" (amber)
- status="critical" (red)
- status="normal" (blue)
```

**Acceptance:**
- [ ] Border-top color matches status
- [ ] Icon color matches status
- [ ] Height is exactly 140px
- [ ] Hover effect works (scale 1.01)
- [ ] onClick triggers if provided

---

#### Step 3: Create `components/CollapsibleSection.tsx` (15 min)
```bash
# Copy code from COMPONENT_STRUCTURE.md section "CollapsibleSection"
# Test:
- defaultOpen={true}
- defaultOpen={false}
- With badge prop
- Without badge prop
```

**Acceptance:**
- [ ] Chevron rotates on expand/collapse
- [ ] Smooth height transition (200ms)
- [ ] Content fades in/out smoothly
- [ ] Header is clickable (hover cursor: pointer)
- [ ] Badge displays correctly

---

#### Step 4: Create `components/MetricRow.tsx` (10 min)
```bash
# Copy code from COMPONENT_STRUCTURE.md section "MetricRow"
# Test:
- With progress bar (progress={30})
- Without progress bar
- With status indicator (status="healthy")
- With icon (icon={Server})
```

**Acceptance:**
- [ ] Progress bar animates from 0 to value
- [ ] Status dot color matches status
- [ ] Label and value align properly
- [ ] Sublabel displays below progress bar

---

#### Step 5: Create `components/ActionButton.tsx` (5 min)
```bash
# Copy code from COMPONENT_STRUCTURE.md section "ActionButton"
# Test:
- primary={true}
- primary={false}
- disabled={true}
- With sublabel (keyboard shortcut)
```

**Acceptance:**
- [ ] Icon renders at 24x24px
- [ ] Label is readable (13px)
- [ ] Sublabel is muted (11px, 40% opacity)
- [ ] Hover effect works (scale 1.02)
- [ ] Primary button has blue accent
- [ ] Disabled state grays out

---

#### Step 6: Create `components/ActivityLists.tsx` (5 min)
```bash
# Copy code from COMPONENT_STRUCTURE.md section "SessionList & LogEntryList"
# Test:
- SessionList with 3 items
- LogEntryList with 4 items
- Different log levels (info/warn/error)
- Different session statuses (active/idle)
```

**Acceptance:**
- [ ] Sessions display with correct status badge
- [ ] Logs display with correct level badge
- [ ] Timestamps are monospace and aligned
- [ ] Truncation works for long messages
- [ ] Badge colors match level (info=blue, warn=amber, error=red)

---

### Phase 2: CSS Additions (10 minutes)

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

/* Spacing Scale (use these instead of arbitrary values) */
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
}
```

**Verification:**
- [ ] Status classes work on test elements
- [ ] CSS variables are defined
- [ ] No console errors

---

### Phase 3: Page Refactor (30 minutes)

#### Step 1: Comment Out Old Code
```tsx
// In app/page.tsx
export default function Dashboard() {
  /* OLD CODE - TO BE REMOVED
  return (
    <div className="p-5">
      ... existing JSX ...
    </div>
  );
  */
  
  // NEW CODE - Start here
  return (
    <div className="p-5 space-y-5">
      {/* TODO: Add zones */}
    </div>
  );
}
```

---

#### Step 2: Add Zone 1 (Alert Banner) (5 min)
```tsx
import AlertBanner from '@/components/AlertBanner';

export default function Dashboard() {
  const [failedLogins, setFailedLogins] = useState(3);
  
  return (
    <div className="p-5 space-y-5">
      {/* ZONE 1: Critical Alerts */}
      {failedLogins > 0 && (
        <AlertBanner 
          severity="critical"
          title={`CRITICAL: ${failedLogins} failed login attempts detected`}
          actionLabel="View security logs"
          onAction={() => console.log('View security logs')}
        />
      )}
    </div>
  );
}
```

**Test:**
- [ ] Alert shows when failedLogins > 0
- [ ] Alert hides when failedLogins = 0
- [ ] Dismiss button works
- [ ] Action link triggers onClick

---

#### Step 3: Add Zone 2 (Primary Stats) (10 min)
```tsx
import { Server, Activity, Shield } from 'lucide-react';
import PrimaryStatCard from '@/components/PrimaryStatCard';

// Inside return, after Zone 1:
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
```

**Test:**
- [ ] 3 cards render side-by-side
- [ ] Each card is 140px tall
- [ ] Gap between cards is 20px
- [ ] Border-top colors match status
- [ ] Hover effect works

---

#### Step 4: Add Zone 3 (Split View) (10 min)
```tsx
import CollapsibleSection from '@/components/CollapsibleSection';
import MetricRow from '@/components/MetricRow';
import { SessionList, LogEntryList } from '@/components/ActivityLists';
import { Users, Terminal, Archive } from 'lucide-react';

// Mock data (replace with real data later)
const sessions = [
  { id: 'sess_abc123', status: 'active', type: 'agent:frontend', time: '2 min ago' },
  { id: 'sess_def456', status: 'idle', type: 'agent:ux-researcher', time: '15 min ago' }
];

const logs = [
  { time: '05:32', level: 'info', msg: 'Frontend agent completed task' },
  { time: '05:18', level: 'warn', msg: 'High memory usage detected' }
];

// Inside return, after Zone 2:
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
```

**Test:**
- [ ] Left column is 60% width
- [ ] Right column is 40% width
- [ ] Gap between columns is 20px
- [ ] Collapsible sections expand/collapse smoothly
- [ ] First section (System Health) is open by default
- [ ] Other sections are collapsed by default
- [ ] Sessions and logs render correctly

---

#### Step 5: Add Zone 4 (Action Bar) (5 min)
```tsx
import ActionButton from '@/components/ActionButton';
import { Zap, Terminal, Kanban, Database, GitBranch } from 'lucide-react';

// Inside return, after Zone 3:
{/* ZONE 4: Action Bar */}
<div className="glass-card rounded-2xl p-4">
  <div className="grid grid-cols-5 gap-4">
    <ActionButton 
      icon={Zap} 
      label="Spawn Agent" 
      sublabel="⌘N"
      primary={true}
      onClick={() => console.log('Spawn agent')}
    />
    <ActionButton 
      icon={Terminal} 
      label="Logs" 
      sublabel="⌘L"
      onClick={() => console.log('Logs')}
    />
    <ActionButton 
      icon={Kanban} 
      label="Tasks" 
      sublabel="⌘T"
      onClick={() => console.log('Tasks')}
    />
    <ActionButton 
      icon={Database} 
      label="Memory" 
      sublabel="⌘M"
      onClick={() => console.log('Memory')}
    />
    <ActionButton 
      icon={GitBranch} 
      label="Flows" 
      sublabel="⌘F"
      onClick={() => console.log('Flows')}
    />
  </div>
</div>
```

**Test:**
- [ ] 5 buttons render side-by-side
- [ ] Each button is 72px tall
- [ ] Gap between buttons is 16px
- [ ] First button (Spawn Agent) has blue accent
- [ ] Hover effects work (scale 1.02)
- [ ] Click handlers fire

---

### Phase 4: Cleanup (10 minutes)

#### Step 1: Remove Old Code
```tsx
// Delete all commented-out old code
// Remove unused components (StatCard, SystemHealthCard, etc.)
// Remove unused imports
```

#### Step 2: Add TypeScript Types
```tsx
// At top of page.tsx
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
```

#### Step 3: Replace Mock Data
```tsx
// Replace hardcoded arrays with real data fetching
useEffect(() => {
  // Fetch sessions
  // Fetch logs
  // Set state
}, []);
```

---

## 🧪 Testing Checklist

### Visual Tests
- [ ] All 4 zones render correctly
- [ ] Spacing matches wireframe (use DevTools to measure)
- [ ] Z-pattern scan path is obvious
- [ ] Hierarchy is clear (primary elements largest)
- [ ] No text truncation
- [ ] All colors match design system

### Interaction Tests
- [ ] Alert banner dismisses smoothly
- [ ] Collapsible sections expand/collapse smoothly
- [ ] Action buttons respond to hover/click
- [ ] Stat cards have hover effect
- [ ] All buttons trigger console.log (or real actions)

### Responsive Tests
- [ ] Desktop (1280px+): All zones visible
- [ ] Laptop (1024px): Slightly narrower but same layout
- [ ] Tablet (768px): Zones stack vertically
- [ ] Mobile (<768px): Single column, all collapsed

### Accessibility Tests
- [ ] Keyboard navigation works (Tab through elements)
- [ ] Focus states visible
- [ ] ARIA labels for icon-only buttons
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)

### Performance Tests
- [ ] No console errors or warnings
- [ ] Smooth animations (60fps)
- [ ] Fast initial render (<500ms)
- [ ] Lighthouse score >90

---

## 🐛 Common Issues & Fixes

### Issue 1: Collapsible section doesn't animate
**Fix:** Ensure `transition-all duration-200` is on the content div, not the button

### Issue 2: Progress bar doesn't animate
**Fix:** Add inline style `style={{ width: `${progress}%` }}` and CSS transition

### Issue 3: Alert banner leaves gap after dismissing
**Fix:** Use conditional rendering `{condition && <AlertBanner />}` not `display: none`

### Issue 4: Action buttons too wide or narrow
**Fix:** Use `grid-cols-5 gap-4`, buttons should auto-size to equal width

### Issue 5: Spacing doesn't match wireframe
**Fix:** Use CSS variables (`var(--space-5)`) instead of Tailwind classes when exact values matter

---

## 📐 Measurement Verification

Use browser DevTools to verify these measurements:

```
Zone 1 (Alert):
- Height: 48px (if present)
- Padding: 12px top/bottom, 20px left/right
- Margin-bottom: 20px

Zone 2 (Primary Stats):
- Card height: 140px
- Card padding: 24px all sides
- Gap between cards: 20px
- Margin-bottom: 24px

Zone 3 (Split View):
- Left column: 60% width
- Right column: 40% width
- Gap: 20px
- Section spacing: 16px
- Margin-bottom: 24px

Zone 4 (Action Bar):
- Button height: 72px
- Button gap: 16px
- Card padding: 16px
- Total height: 104px (72 + 16*2)
```

If any measurement is off by more than 2px, adjust CSS.

---

## 🎯 Final Acceptance Criteria

Before handing off to senior-dev:

- [ ] All 6 new components created and working
- [ ] page.tsx refactored with 4-zone layout
- [ ] CSS utilities added to globals.css
- [ ] No console errors or warnings
- [ ] Visual hierarchy is obvious
- [ ] Spacing matches wireframe (±2px)
- [ ] All interactions work (hover, click, collapse)
- [ ] Responsive breakpoints functional
- [ ] TypeScript types defined
- [ ] Mock data replaced with real data (or TODO comments)

---

## 📞 Need Help?

**Read:**
- `LAYOUT_ARCHITECTURE.md` - Why decisions were made
- `COMPONENT_STRUCTURE.md` - Full component code
- `WIREFRAME.md` - Exact measurements

**Common Questions:**

**Q: Why 60/40 split instead of 50/50?**  
A: Left side (system details) has more dense info, needs more width. Right side (activity) is more scannable, needs less width. Ratio creates visual balance.

**Q: Why collapsible sections?**  
A: Progressive disclosure. Users see critical info first, expand details only when needed. Reduces cognitive load.

**Q: Why Z-pattern instead of F-pattern?**  
A: F-pattern is for text-heavy content (articles). Z-pattern is for dashboards with visual hierarchy. Matches how users scan data interfaces.

**Q: Can I change the spacing?**  
A: Only if you have a good reason and it doesn't break the hierarchy. Spacing is designed to create clear separation between priority levels.

---

**Good luck! The design is solid, now bring it to life. 🚀**

---

*Implementation guide by ux-architect agent*  
*Date: 2026-03-11 12:29 GMT+1*

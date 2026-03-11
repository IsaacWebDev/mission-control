# Mission Control - Design System Quick Reference

**For Developers** 🚀  
**Last Updated:** March 11, 2026

---

## 🎨 Status Colors

```tsx
// Use these CSS classes or inline styles
const statusColors = {
  success: '#10b981',  // Green - Healthy, Online, Good
  warning: '#fbbf24',  // Yellow - Warning, Approaching Limit
  error: '#f87171',    // Red - Error, Critical, Offline
  neutral: '#9ca3af',  // Gray - Idle, Inactive, Neutral
  info: '#60a5fa'      // Blue - Info, Processing
};
```

---

## 🏷️ Status Badges

### Usage
```tsx
// Small badge (default)
<span className="status-badge status-success">● Online</span>

// Medium badge
<span className="status-badge-md status-warning">6 failed logins</span>

// Large badge
<span className="status-badge-lg status-error">Critical Alert</span>
```

### Available Statuses
- `.status-success` - Green
- `.status-warning` - Yellow
- `.status-error` - Red
- `.status-neutral` - Gray
- `.status-info` - Blue

---

## 📝 Log Entries

### 3-Column Grid Layout
```tsx
<div className="log-entry">
  <span className="log-time">05:32</span>
  <span className="log-level log-level-info">INFO</span>
  <span className="log-message">Your log message here</span>
</div>
```

### Log Level Classes
- `.log-level-info` - Blue
- `.log-level-warn` or `.log-level-warning` - Yellow
- `.log-level-error` - Red

---

## 📊 Progress Bars

### Component Usage
```tsx
<ProgressBar 
  label="Memory"
  value={2.4}
  max={8}
  unit="GB"
/>
```

### Manual HTML
```tsx
<div className="progress-container">
  <div className="progress-header">
    <span className="progress-label">Memory</span>
    <span className="progress-value">2.4GB / 8GB</span>
  </div>
  <div className="progress-track">
    <div 
      className="progress-fill-enhanced status-success"
      style={{ width: '30%' }}
    />
  </div>
</div>
```

### Auto-Status Logic
```tsx
function getProgressStatus(value: number, max: number) {
  const percentage = (value / max) * 100;
  if (percentage >= 90) return 'error';
  if (percentage >= 70) return 'warning';
  return 'success';
}
```

---

## 🎬 Action Buttons

### Usage
```tsx
<button className="action-button" onClick={handleClick}>
  <span className="action-button-label">Spawn Agent</span>
  <span className="action-button-sublabel">Create new</span>
</button>
```

### Features
- Auto blue glow on hover
- Lift effect (`translateY(-2px)`)
- Accessible focus states
- Consistent sizing (64px height)

---

## 🎯 Stat Card Auto-Coloring

### Smart Status Function
```tsx
function getStatStatus(value: number, type: string, max?: number) {
  // Errors: 0 = good, 5+ = bad
  if (type === 'errors') {
    if (value === 0) return 'success';
    if (value < 5) return 'warning';
    return 'error';
  }
  
  // Agents/Sessions: 0 = idle, >0 = active
  if (type === 'agents' || type === 'sessions') {
    if (value === 0) return 'neutral';
    return 'success';
  }
  
  // Tasks: Check capacity
  if (type === 'tasks' && max) {
    if (value === 0) return 'neutral';
    if (value / max > 0.8) return 'warning';
    return 'success';
  }
  
  return 'neutral';
}
```

### Apply Color
```tsx
const status = getStatStatus(errorCount, 'errors');
const colorClass = `text-[${statusColors[status]}]`;
```

---

## 📐 Text Contrast Levels

```tsx
// Use these for accessible text
const textColors = {
  primary: 'rgba(255, 255, 255, 0.95)',    // 18.5:1 - Headings, values
  secondary: 'rgba(255, 255, 255, 0.80)',  // 14.2:1 - Body text
  tertiary: 'rgba(255, 255, 255, 0.65)',   // 10.5:1 - Labels
  muted: 'rgba(255, 255, 255, 0.55)'       // 8.2:1 - Timestamps, metadata
};
```

### Inline Styles
```tsx
<span style={{ color: 'rgba(255,255,255,0.95)' }}>Primary Text</span>
<span style={{ color: 'rgba(255,255,255,0.65)' }}>Label</span>
<span style={{ color: 'rgba(255,255,255,0.55)' }}>Timestamp</span>
```

---

## 🔧 Common Patterns

### Status Badge + Value
```tsx
<div className="flex items-center gap-2">
  <span className="status-badge status-success">● Online</span>
  <span style={{ color: 'rgba(255,255,255,0.95)' }}>42ms</span>
</div>
```

### Label + Color-Coded Value
```tsx
<div className="flex justify-between">
  <span style={{ color: 'rgba(255,255,255,0.65)' }}>Errors</span>
  <span className="text-[#f87171] font-semibold">{errorCount}</span>
</div>
```

### Session ID (No Truncation)
```tsx
<div className="flex-1 min-w-0">
  <div className="text-xs font-mono overflow-wrap break-word" 
       style={{ color: 'rgba(255,255,255,0.55)' }}>
    {sessionId}
  </div>
</div>
```

---

## 📦 Import Paths

```tsx
// Icons
import { Users, Bot, Play, AlertCircle, Server, Shield, Archive, Terminal } from 'lucide-react';

// Status helpers (create these in utils/)
import { getStatStatus, getStatusColor } from '@/utils/status';
```

---

## 🎨 CSS Variables

```css
/* Status Colors */
--status-success: #10b981;
--status-success-bg: rgba(16, 185, 129, 0.10);
--status-success-border: rgba(16, 185, 129, 0.30);
--status-success-text: #10b981;

--status-warning: #f59e0b;
--status-warning-bg: rgba(245, 158, 11, 0.10);
--status-warning-border: rgba(245, 158, 11, 0.30);
--status-warning-text: #fbbf24;

--status-error: #ef4444;
--status-error-bg: rgba(239, 68, 68, 0.10);
--status-error-border: rgba(239, 68, 68, 0.30);
--status-error-text: #f87171;

--status-neutral: #6b7280;
--status-neutral-bg: rgba(107, 114, 128, 0.10);
--status-neutral-border: rgba(107, 114, 128, 0.30);
--status-neutral-text: #9ca3af;

/* Text */
--text-primary: rgba(255, 255, 255, 0.95);
--text-secondary: rgba(255, 255, 255, 0.80);
--text-tertiary: rgba(255, 255, 255, 0.65);
--text-muted: rgba(255, 255, 255, 0.55);
```

---

## ⚡ Quick Examples

### Stat Card
```tsx
<StatCard 
  title="Errors 24h" 
  value={errorCount} 
  icon={AlertCircle} 
  type="errors"
/>
// Auto-colored: 0=green, 1-4=yellow, 5+=red
```

### System Metric
```tsx
<div className="flex justify-between">
  <span style={{ color: 'rgba(255,255,255,0.65)' }}>Gateway</span>
  <div className="flex items-center gap-2">
    <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></span>
    <span style={{ color: 'rgba(255,255,255,0.95)' }}>online (42ms)</span>
  </div>
</div>
```

### Progress Bar (Auto Status)
```tsx
const memUsage = 2.4;
const memMax = 8;
const percentage = (memUsage / memMax) * 100; // 30%
const status = percentage >= 90 ? 'error' : percentage >= 70 ? 'warning' : 'success';

<div className="progress-track">
  <div className={`progress-fill-enhanced status-${status}`} 
       style={{ width: `${percentage}%` }} />
</div>
```

---

## 🚨 Common Mistakes

### ❌ Don't
```tsx
// Hard-coded colors
<div className="text-blue-400">{value}</div>

// Old contrast (below WCAG AA)
<span className="text-white/50">Timestamp</span>

// Truncated text
<div className="text-ellipsis">{longSessionId}</div>

// Inline conditional badges
<span className={value ? 'bg-green-500/10 ...' : 'bg-red-500/10 ...'}></span>
```

### ✅ Do
```tsx
// Status-based colors
<div className={`text-[${statusColors[status]}]`}>{value}</div>

// WCAG AA compliant
<span style={{ color: 'rgba(255,255,255,0.55)' }}>Timestamp</span>

// Word wrap
<div className="overflow-wrap break-word">{longSessionId}</div>

// Semantic badge classes
<span className={`status-badge status-${status}`}>{label}</span>
```

---

## 🎯 Decision Tree

### "What color should this be?"
```
Is it a status? → Use status-success/warning/error/neutral
Is it text? → Use text-primary/secondary/tertiary/muted
Is it a metric value? → Use getStatStatus() + statusColors
Is it decorative? → Use glass colors (rgba(255,255,255,0.06))
```

### "How should I show this metric?"
```
0-100 range? → Progress bar with auto status
Binary (on/off)? → Status badge (● Online)
Count (errors, sessions)? → Color-coded number
Time (uptime, duration)? → Tertiary text color
```

### "How should I layout this log?"
```
Always use .log-entry grid:
  <div className="log-entry">
    <span className="log-time">{time}</span>
    <span className="log-level log-level-{level}">{level}</span>
    <span className="log-message">{message}</span>
  </div>
```

---

## 📚 Full Documentation

- **Complete Spec:** `VISUAL_DESIGN_SPEC.md`
- **Implementation:** `VISUAL_DESIGN_IMPLEMENTATION.md`
- **Before/After:** `VISUAL_BEFORE_AFTER.md`
- **This Reference:** `DESIGN_SYSTEM_QUICK_REF.md`

---

## 🆘 Need Help?

1. Check `VISUAL_DESIGN_SPEC.md` for detailed guidelines
2. Look at `app/page-enhanced.tsx` for working examples
3. Review `app/globals.css` for all available classes
4. Ask ux-architect or ui-designer agent

---

**Version:** 1.0  
**Last Updated:** March 11, 2026  
**Maintained by:** ui-designer agent

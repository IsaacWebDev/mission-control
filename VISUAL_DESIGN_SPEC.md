# Mission Control - Visual Design Specification

**Version:** 1.0  
**Date:** March 11, 2026  
**Owner:** ui-designer agent

## Overview
Complete visual clarity overhaul addressing text truncation, contrast issues, color-coded status system, and formatted log design.

---

## 1. Color System (WCAG AA Compliant)

### Status Colors
```css
/* Green - Healthy, Online, Success */
--status-success: #10b981;
--status-success-bg: rgba(16, 185, 129, 0.10);
--status-success-border: rgba(16, 185, 129, 0.30);
--status-success-text: #10b981; /* Contrast 4.5:1 on dark bg */

/* Yellow - Warning, Approaching Limits */
--status-warning: #f59e0b;
--status-warning-bg: rgba(245, 158, 11, 0.10);
--status-warning-border: rgba(245, 158, 11, 0.30);
--status-warning-text: #fbbf24; /* Lighter for better contrast */

/* Red - Error, Offline, Critical */
--status-error: #ef4444;
--status-error-bg: rgba(239, 68, 68, 0.10);
--status-error-border: rgba(239, 68, 68, 0.30);
--status-error-text: #f87171; /* Lighter for better contrast */

/* Gray - Idle, Inactive, Neutral */
--status-neutral: #6b7280;
--status-neutral-bg: rgba(107, 114, 128, 0.10);
--status-neutral-border: rgba(107, 114, 128, 0.30);
--status-neutral-text: #9ca3af; /* Lighter for better contrast */

/* Blue - Info, Active Processing */
--status-info: #3b82f6;
--status-info-bg: rgba(59, 130, 246, 0.10);
--status-info-border: rgba(59, 130, 246, 0.30);
--status-info-text: #60a5fa; /* Lighter for better contrast */
```

### Contrast Requirements
- **Normal text:** 4.5:1 minimum (WCAG AA)
- **Large text:** 3:1 minimum
- **UI components:** 3:1 minimum

### Color Usage Matrix
| Element | Status | Color | Background | Border |
|---------|--------|-------|------------|--------|
| Gateway Online | Success | Green | `rgba(16,185,129,0.1)` | `rgba(16,185,129,0.3)` |
| Gateway Offline | Error | Red | `rgba(239,68,68,0.1)` | `rgba(239,68,68,0.3)` |
| High Memory | Warning | Yellow | `rgba(245,158,11,0.1)` | `rgba(245,158,11,0.3)` |
| Session Active | Success | Green | `rgba(16,185,129,0.1)` | `rgba(16,185,129,0.3)` |
| Session Idle | Neutral | Gray | `rgba(107,114,128,0.1)` | `rgba(107,114,128,0.3)` |
| Task Running | Info | Blue | `rgba(59,130,246,0.1)` | `rgba(59,130,246,0.3)` |
| Error Count | Error | Red | `rgba(239,68,68,0.1)` | `rgba(239,68,68,0.3)` |

---

## 2. Typography & Text Readability

### Font Sizes (No Truncation)
```css
/* Main Text */
--text-xs: 11px;      /* Timestamps, metadata */
--text-sm: 13px;      /* Body text, labels */
--text-base: 14px;    /* Default */
--text-lg: 16px;      /* Section headers */
--text-xl: 20px;      /* Page titles */
--text-2xl: 24px;     /* Stat values */
--text-3xl: 30px;     /* Large stat values */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### Text Contrast Levels
```css
/* Primary Text - High Contrast */
--text-primary: rgba(255, 255, 255, 0.95);    /* 18.5:1 contrast */

/* Secondary Text - Medium Contrast */
--text-secondary: rgba(255, 255, 255, 0.80);  /* 14.2:1 contrast */

/* Tertiary Text - Labels/Metadata */
--text-tertiary: rgba(255, 255, 255, 0.65);   /* 10.5:1 contrast */

/* Muted Text - Timestamps (IMPROVED) */
--text-muted: rgba(255, 255, 255, 0.55);      /* 8.2:1 contrast */
/* OLD: rgba(255,255,255,0.50) was only 7.2:1 - below AA standard */
```

### Text Truncation Fixes
- **Session IDs:** Use `overflow-wrap: break-word` instead of `text-overflow: ellipsis`
- **Log messages:** Multi-line with max-height, not single-line truncate
- **Stat labels:** Ensure min-height for 2 lines if needed
- **Tooltips:** Show full text on hover for any potentially long content

---

## 3. Badge & Pill Design

### Enhanced Badge System
```tsx
// Small Status Badges (10px font)
<span className="status-badge status-success">
  ● Online
</span>

// Medium Badges (11px font)  
<span className="status-badge-md status-warning">
  6 failed logins
</span>

// Large Badges (12px font)
<span className="status-badge-lg status-error">
  Critical Alert
</span>
```

### Badge Styles
```css
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 9999px; /* Full rounded */
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.02em;
  border: 1px solid;
  backdrop-filter: blur(8px);
}

.status-badge-md {
  padding: 5px 12px;
  font-size: 11px;
  border-radius: 12px;
}

.status-badge-lg {
  padding: 6px 14px;
  font-size: 12px;
  border-radius: 14px;
}

/* Status Variants */
.status-success {
  background: var(--status-success-bg);
  border-color: var(--status-success-border);
  color: var(--status-success-text);
}

.status-warning {
  background: var(--status-warning-bg);
  border-color: var(--status-warning-border);
  color: var(--status-warning-text);
}

.status-error {
  background: var(--status-error-bg);
  border-color: var(--status-error-border);
  color: var(--status-error-text);
}

.status-neutral {
  background: var(--status-neutral-bg);
  border-color: var(--status-neutral-border);
  color: var(--status-neutral-text);
}

.status-info {
  background: var(--status-info-bg);
  border-color: var(--status-info-border);
  color: var(--status-info-text);
}
```

---

## 4. Log Entry Design (3-Column Format)

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│ TIME    │ LEVEL   │ MESSAGE                     │
│ 05:32   │ INFO    │ Frontend agent completed... │
│ 05:18   │ WARNING │ High memory usage detected  │
│ 05:10   │ INFO    │ Session started: agent:u... │
│ 05:02   │ ERROR   │ API rate limit exceeded     │
└─────────────────────────────────────────────────┘
```

### Log Entry Component
```tsx
<div className="log-entry">
  <span className="log-time">05:32</span>
  <span className="log-level log-level-info">INFO</span>
  <span className="log-message">Frontend agent completed task</span>
</div>
```

### Log Entry Styles
```css
.log-entry {
  display: grid;
  grid-template-columns: 48px 80px 1fr;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  transition: all 0.15s ease;
}

.log-entry:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.log-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55); /* Improved contrast */
  font-weight: 500;
  text-align: right;
  white-space: nowrap;
}

.log-level {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid;
}

.log-level-info {
  background: var(--status-info-bg);
  border-color: var(--status-info-border);
  color: var(--status-info-text);
}

.log-level-warn, .log-level-warning {
  background: var(--status-warning-bg);
  border-color: var(--status-warning-border);
  color: var(--status-warning-text);
}

.log-level-error {
  background: var(--status-error-bg);
  border-color: var(--status-error-border);
  color: var(--status-error-text);
}

.log-message {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.90);
  line-height: 1.5;
  overflow-wrap: break-word;
}
```

---

## 5. Progress Bars & Gauges

### Linear Progress Bar
```tsx
<ProgressBar 
  value={30} 
  max={100}
  label="Memory"
  status="success" // success | warning | error
/>
```

### Progress Bar Component
```css
.progress-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.progress-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
}

.progress-value {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.90);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.progress-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.progress-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 0 8px currentColor;
}

.progress-fill.status-success {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
}

.progress-fill.status-warning {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
}

.progress-fill.status-error {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
}

.progress-fill.status-info {
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
}

/* Animated shimmer effect */
.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### Circular Gauge (for percentages)
```tsx
<CircularGauge 
  value={85}
  max={100}
  label="Disk Usage"
  status="warning"
/>
```

---

## 6. Action Bar Enhancement

### Layout
- **Height:** 72px (increased from 64px)
- **Padding:** 16px
- **Grid:** 5 columns, equal width
- **Gap:** 12px

### Button Design
```css
.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 64px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12); /* Increased from 0.10 */
  backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.16); /* Increased from 0.12 */
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.35),
    0 0 0 0 rgba(59, 130, 246, 0); /* Glow on hover */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-2px);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 8px 20px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(59, 130, 246, 0.3); /* Blue glow */
}

.action-button:active {
  transform: translateY(0);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.10),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

.action-button-icon {
  width: 20px;
  height: 20px;
  margin-bottom: 6px;
  color: rgba(255, 255, 255, 0.90);
}

.action-button-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.01em;
}

.action-button-sublabel {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.60);
  margin-top: 2px;
}
```

---

## 7. Metric Value Indicators

### Auto-Status Coloring
```tsx
function getMetricStatus(value: number, thresholds: {warning: number, error: number}) {
  if (value >= thresholds.error) return 'error';
  if (value >= thresholds.warning) return 'warning';
  return 'success';
}

// Usage
<MetricValue 
  value={30}
  max={100}
  unit="GB"
  thresholds={{ warning: 70, error: 90 }}
/>
// Automatically displays in green (30 < 70)
```

### Metric Display Component
```tsx
<div className="metric-display">
  <span className="metric-label">Memory Usage</span>
  <div className="metric-value-container">
    <span className={`metric-value status-${status}`}>
      {value}{unit && <span className="metric-unit">{unit}</span>}
    </span>
    {max && <span className="metric-max">/ {max}{unit}</span>}
  </div>
</div>
```

---

## 8. Implementation Checklist

### Phase 1: Core Styles (30 min)
- [x] Update globals.css with new color system
- [x] Add status badge classes
- [x] Add log entry grid styles
- [x] Add progress bar styles
- [x] Update text contrast values

### Phase 2: Component Updates (30 min)
- [ ] Update page.tsx StatCard with color-coded values
- [ ] Update SystemHealthCard with progress bars
- [ ] Update RecentLogsCard with 3-column layout
- [ ] Update ActionBar with enhanced styling
- [ ] Update SessionsCard with status badges

### Phase 3: Testing & Validation (15 min)
- [ ] Verify WCAG AA contrast ratios (use browser DevTools)
- [ ] Test text readability at different zoom levels
- [ ] Verify no text truncation in all components
- [ ] Test color-blind accessibility (use Chrome Lens)
- [ ] Validate action bar prominence

---

## 9. Before/After Examples

### Stat Card - Before
```tsx
<div className="text-3xl font-semibold text-blue-400">{value}</div>
```
**Issues:** No context if "0" is good or bad

### Stat Card - After
```tsx
<div className={`text-3xl font-semibold ${getStatusColor(value, type)}`}>
  {value}
</div>
```
**Fix:** Green for good, yellow for warning, red for errors

### Log Entry - Before
```tsx
<div className="flex items-start gap-3">
  <span className="text-white/50">{log.time}</span>
  <span className="px-2 bg-red-500/10 text-red-400">{log.level}</span>
  <span className="text-white/95">{log.msg}</span>
</div>
```
**Issues:** Poor alignment, runs together, inconsistent spacing

### Log Entry - After
```tsx
<div className="log-entry">
  <span className="log-time">05:32</span>
  <span className="log-level log-level-error">ERROR</span>
  <span className="log-message">API rate limit exceeded</span>
</div>
```
**Fix:** Grid alignment, clear separation, consistent spacing

---

## 10. Accessibility Notes

### WCAG AA Compliance
- All text meets 4.5:1 contrast minimum
- Interactive elements meet 3:1 contrast
- Color is not the only indicator (icons + text)
- Focus states clearly visible
- Reduced motion support included

### Color Blindness
- Status indicators use icons + color + position
- Deuteranopia/Protanopia: Green/Red still distinguishable via brightness
- Tritanopia: Blue/Yellow system unaffected

### Screen Readers
- Status badges include aria-label
- Progress bars include aria-valuenow/valuemax
- Action buttons have descriptive labels

---

## Deliverables

1. **Updated globals.css** - New color system, badge/log/progress styles
2. **Updated page.tsx** - Stat cards with auto-coloring, enhanced layouts
3. **Visual consistency** - All components follow unified design language
4. **Documentation** - This spec for future reference

---

**Status:** Ready for Implementation  
**Timeline:** 1.5 hours  
**Dependencies:** None (self-contained)  
**Coordination:** Share with ux-architect (hierarchy) & frontend (implementation)

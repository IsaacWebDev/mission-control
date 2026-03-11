# Mission Control - Glass Effect Visual Examples

**Quick reference with before/after code comparisons**

---

## Before & After Examples

### Example 1: Stat Card

**BEFORE (Flat):**
```tsx
<div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5 h-[110px]">
  <Activity className="w-5 h-5 text-blue-400 mb-3" />
  <div className="flex items-baseline gap-1">
    <div className="text-3xl font-semibold text-blue-400">42</div>
    <div className="text-sm text-[#94a3b8]">/ 100</div>
  </div>
  <div className="text-xs text-[#94a3b8] mt-1">Active Sessions</div>
</div>
```

**AFTER (Glass):**
```tsx
<div className="relative h-[90px] rounded-xl backdrop-blur-xl glass-blue p-4">
  <Activity className="absolute top-4 right-4 w-4 h-4 text-blue-400/30" />
  <div className="flex items-baseline gap-1 mt-6">
    <div className="text-4xl font-bold text-blue-400">42</div>
    <div className="text-sm text-glass-subtle">/ 100</div>
  </div>
  <div className="text-xs text-glass-muted mt-1">Active Sessions</div>
</div>
```

**Visual Difference:**
- ✨ Translucent blue background instead of solid
- ✨ Icon repositioned to top-right at 30% opacity (decorative)
- ✨ Backdrop blur creates frosted effect
- ✨ Number larger and bolder (36px → 40px)
- ✨ Inner highlight creates glass reflection

---

### Example 2: System Health Card

**BEFORE (Flat):**
```tsx
<div className="rounded-xl border border-[#1f2937] bg-[#0f172a] p-5">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-semibold text-[#e2e8f0] flex items-center gap-2">
      <Server className="w-4 h-4" />
      System Health
    </h3>
    <span className="text-[10px] px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400">
      ● Online
    </span>
  </div>
  <div className="space-y-3 text-sm">
    <div className="flex justify-between">
      <span className="text-[#94a3b8]">Gateway</span>
      <span className="text-[#e2e8f0]">online (42ms)</span>
    </div>
  </div>
</div>
```

**AFTER (Glass):**
```tsx
<div className="glass-card rounded-xl p-5">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-semibold text-glass-primary flex items-center gap-2">
      <Server className="w-4 h-4" />
      System Health
    </h3>
    <span className="text-[11px] px-2 py-0.5 glass-green rounded-full text-green-400">
      ● Online
    </span>
  </div>
  <div className="space-y-3 text-sm">
    <div className="flex justify-between">
      <span className="text-glass-muted">Gateway</span>
      <span className="text-glass-primary">online (42ms)</span>
    </div>
  </div>
</div>
```

**Visual Difference:**
- ✨ Translucent white background with blur instead of solid dark
- ✨ Subtle inner highlight on top edge
- ✨ Green status badge also has glass effect
- ✨ Text uses opacity-based hierarchy
- ✨ Can see gradient background through card

---

### Example 3: Sidebar Navigation

**BEFORE (Flat):**
```tsx
<div className="w-[240px] bg-[#020617] border-r border-[#1f2937] flex flex-col">
  <div className="p-5 border-b border-[#1f2937]">
    <h1 className="text-lg font-semibold">Mission Control</h1>
  </div>
  <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
    {/* Active nav item */}
    <Link className="flex items-center gap-3 px-3 h-9 rounded-lg mb-1 text-sm bg-[#0f172a] text-[#e2e8f0] border-l-2 border-blue-500">
      <Home className="w-4 h-4" />
      Overview
    </Link>
    
    {/* Inactive nav item */}
    <Link className="flex items-center gap-3 px-3 h-9 rounded-lg mb-1 text-sm text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#0f172a]/50">
      <Users className="w-4 h-4" />
      Agents
    </Link>
  </nav>
</div>
```

**AFTER (Glass):**
```tsx
<div className="w-[240px] glass-panel border-r border-white/5 flex flex-col">
  <div className="p-5 border-b border-white/5">
    <h1 className="text-lg font-semibold">Mission Control</h1>
  </div>
  <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
    {/* Active nav item */}
    <Link className="flex items-center gap-3 px-3 h-9 rounded-lg mb-1 text-sm glass-blue text-blue-400 border-l-2 border-blue-500">
      <Home className="w-4 h-4" />
      Overview
    </Link>
    
    {/* Inactive nav item */}
    <Link className="flex items-center gap-3 px-3 h-9 rounded-lg mb-1 text-sm text-glass-muted hover:text-glass-primary hover:bg-white/5">
      <Users className="w-4 h-4" />
      Agents
    </Link>
  </nav>
</div>
```

**Visual Difference:**
- ✨ Sidebar has frosted glass panel effect (blur 30px)
- ✨ Borders ultra-subtle (white/5 instead of hard gray)
- ✨ Active nav item has blue glass background
- ✨ Hover state adds subtle white overlay
- ✨ Text hierarchy uses opacity levels

---

### Example 4: Action Bar Button

**BEFORE (Flat):**
```tsx
<button className="flex flex-col items-center justify-center h-16 rounded-lg border border-[#1f2937] hover:border-[#94a3b8]/30 hover:bg-[#020617] transition-all">
  <span className="text-xs font-medium text-[#e2e8f0]">Spawn Agent</span>
  <span className="text-[10px] text-[#94a3b8] mt-0.5">Create new</span>
</button>
```

**AFTER (Glass):**
```tsx
<button className="flex flex-col items-center justify-center h-16 rounded-lg border border-white/10 hover:border-white/20 glass-card hover:bg-white/[0.08] transition-all">
  <span className="text-xs font-medium text-glass-secondary">Spawn Agent</span>
  <span className="text-[10px] text-glass-subtle mt-0.5">Create new</span>
</button>
```

**Visual Difference:**
- ✨ Button has glass card background
- ✨ Border subtle and brightens on hover
- ✨ Hover increases background opacity
- ✨ Text uses opacity hierarchy
- ✨ Smooth transition between states

---

## CSS Utility Classes Reference

### Glass Backgrounds

```css
/* Standard glass card */
.glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Colored glass variants */
.glass-green   { /* Green glass for success states */ }
.glass-purple  { /* Purple glass for info/events */ }
.glass-orange  { /* Orange glass for warnings */ }
.glass-red     { /* Red glass for errors */ }
.glass-blue    { /* Blue glass for active/selected */ }

/* Layout panels (sidebar, header, feed) */
.glass-panel {
  background: rgba(10, 14, 22, 0.95);
  backdrop-filter: blur(30px);
}
```

### Text Hierarchy

```css
.text-glass-primary    /* rgba(255, 255, 255, 1.0) - Main content */
.text-glass-secondary  /* rgba(255, 255, 255, 0.9) - Subheadings */
.text-glass-tertiary   /* rgba(255, 255, 255, 0.7) - Labels */
.text-glass-muted      /* rgba(255, 255, 255, 0.6) - Metadata */
.text-glass-disabled   /* rgba(255, 255, 255, 0.5) - Disabled */
.text-glass-subtle     /* rgba(255, 255, 255, 0.4) - Placeholders */
```

### Borders

```css
border-white/5   /* Ultra-subtle divider (layout panels) */
border-white/8   /* Standard glass border */
border-white/10  /* Button/input border */
border-white/20  /* Hover/active border */
```

### Common Combinations

```css
/* Standard card */
.glass-card rounded-xl p-5

/* Colored stat card */
.glass-blue rounded-xl p-4 h-[90px]

/* Panel container */
.glass-panel border-r border-white/5

/* Interactive button */
.glass-card rounded-lg hover:bg-white/[0.08]

/* Badge */
.glass-green rounded-full px-2 py-0.5 text-[11px]
```

---

## Visual State Progression

### Glass Card States

**1. Default State:**
```css
background: rgba(255, 255, 255, 0.04);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.08);
```

**2. Hover State:**
```css
background: rgba(255, 255, 255, 0.08);  /* ↑ Brighter */
border: 1px solid rgba(255, 255, 255, 0.20);  /* ↑ More defined */
box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);  /* ↑ Deeper shadow */
```

**3. Active/Pressed State:**
```css
background: rgba(255, 255, 255, 0.06);  /* Slightly dimmer */
transform: scale(0.99);  /* Optional: subtle press effect */
```

**4. Focus State (accessibility):**
```css
outline: 2px solid rgba(59, 130, 246, 0.5);
outline-offset: 2px;
```

---

## Icon Opacity Patterns

### Functional Icons (Interactive)
```tsx
{/* Navigation icon */}
<Home className="w-4 h-4" />  // Inherits text color

{/* Status icon */}
<Activity className="w-4 h-4 text-green-400" />
```

### Decorative Icons (Background)
```tsx
{/* Stat card background icon */}
<Activity className="absolute top-4 right-4 w-4 h-4 text-blue-400/30" />
                                                             ↑ 30% opacity
```

### Semantic Icons (Status)
```tsx
{/* Online status */}
<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />

{/* Error indicator */}
<AlertCircle className="w-4 h-4 text-red-400" />
```

---

## Color Usage Matrix

| Component | Color | Usage | Class |
|-----------|-------|-------|-------|
| Stat card: Active Sessions | Blue | Active/selected | `glass-blue` |
| Stat card: Agents Online | Purple | Info/status | `glass-purple` |
| Stat card: Tasks Running | Orange | Warning/running | `glass-orange` |
| Stat card: Errors | Red | Error/critical | `glass-red` |
| System Health: Online badge | Green | Success/online | `glass-green` |
| System Health: Card | Neutral | Standard | `glass-card` |
| Header: Gateway badge | Green | Online/success | `glass-green text-green-400` |
| Header: Events badge | Purple | Live/info | `glass-purple text-purple-400` |
| Active nav item | Blue | Selected | `glass-blue text-blue-400` |
| Inactive nav item | Neutral | Default | `text-glass-muted` |

---

## Layout Hierarchy

### Z-Index & Depth Layers

```
Layer 0: Body background (gradient)
         ↓
Layer 1: Glass panels (sidebar, header, feed)
         backdrop-blur: blur(30px)
         ↓
Layer 2: Glass cards (dashboard components)
         backdrop-blur: blur(20px)
         ↓
Layer 3: Interactive elements (buttons, inputs)
         backdrop-blur: blur(20px) + hover effects
         ↓
Layer 4: Modals/overlays (future)
         backdrop-blur: blur(40px)
```

### Shadow Depth Guide

```css
/* Flat - sits on surface */
box-shadow: none;

/* Card - standard elevation */
box-shadow: 
  inset 0 1px 0 rgba(255, 255, 255, 0.05),
  0 8px 32px rgba(0, 0, 0, 0.3);

/* Elevated - hover state */
box-shadow: 
  inset 0 1px 0 rgba(255, 255, 255, 0.08),
  0 12px 48px rgba(0, 0, 0, 0.4);

/* Floating - modals */
box-shadow: 
  inset 0 1px 0 rgba(255, 255, 255, 0.10),
  0 20px 60px rgba(0, 0, 0, 0.5);
```

---

## Responsive Adjustments

### Desktop (Default)
```css
.glass-card {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.04);
}
```

### Tablet (Optional Optimization)
```css
@media (max-width: 1024px) {
  .glass-card {
    backdrop-filter: blur(16px);  /* Slightly less blur */
  }
}
```

### Mobile (Performance Mode)
```css
@media (max-width: 640px) {
  .glass-card {
    backdrop-filter: blur(12px);  /* Reduced blur for performance */
    background: rgba(255, 255, 255, 0.06);  /* Slightly more opaque */
  }
}
```

---

## Testing Checklist

### Visual Tests

- [ ] **Open dashboard in browser**
- [ ] **Check glass translucency:**
  - Can you see the gradient background through cards?
  - Is the blur effect visible?
  - Are inner highlights visible on top edge of cards?

- [ ] **Check colored glass:**
  - Do stat cards have colored glass backgrounds?
  - Are borders color-matched?
  - Do shadows have color tint?

- [ ] **Check text hierarchy:**
  - Primary text (100%) clearly readable
  - Muted text (60%) still legible
  - Subtle text (40%) visible but secondary

- [ ] **Check interactive states:**
  - Hover on cards brightens background
  - Hover on buttons changes border
  - Active nav item has blue glass

### Browser Tests

- [ ] **Chrome/Edge** (primary)
- [ ] **Safari** (test `-webkit-backdrop-filter`)
- [ ] **Firefox** (test `backdrop-filter` support)

### Performance Tests

- [ ] Page loads in < 2 seconds
- [ ] Scrolling is smooth (60 FPS)
- [ ] No frame drops during animations

---

## Troubleshooting Quick Fixes

### Problem: Glass effect not visible

**Fix 1:** Check browser support
```javascript
// In browser console:
CSS.supports('backdrop-filter', 'blur(20px)')
// Should return true
```

**Fix 2:** Increase opacity
```css
/* Change from: */
background: rgba(255, 255, 255, 0.04);

/* To: */
background: rgba(255, 255, 255, 0.06);
```

---

### Problem: Text hard to read

**Fix 1:** Increase text opacity
```css
/* Change from: */
.text-glass-muted { color: rgba(255, 255, 255, 0.6); }

/* To: */
.text-glass-muted { color: rgba(255, 255, 255, 0.7); }
```

**Fix 2:** Add text shadow (subtle)
```css
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
```

---

### Problem: Colors too subtle

**Fix:** Increase colored glass opacity
```css
/* Change from: */
.glass-blue {
  background: rgba(59, 130, 246, 0.10);
}

/* To: */
.glass-blue {
  background: rgba(59, 130, 246, 0.15);
}
```

---

### Problem: Performance lag

**Fix 1:** Reduce blur amount
```css
backdrop-filter: blur(12px);  /* Instead of 20px */
```

**Fix 2:** Simplify shadows
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);  /* Remove inset */
```

---

## Final Visual Comparison

### Current Design (Flat)
- Solid dark backgrounds
- Hard gray borders
- No translucency
- Flat, 2D appearance
- Corporate/technical feel

### New Design (Glass)
- Translucent frosted backgrounds
- Subtle light borders
- Backdrop blur effect
- Layered depth
- Premium Apple aesthetic

**Visual Impact:** Transforms from "developer tool" to "premium product"

---

**End of Visual Examples**

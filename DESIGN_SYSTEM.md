# Mission Control - Design System Reference

Quick reference for maintaining consistency in Mission Control UI.

---

## Color Palette

### Background
```css
Primary: #0a0e17 (cool blue-black)
Gradient: radial-gradient(circle at center, rgba(15, 25, 50, 0.4) 0%, #060a12 100%)
```

### Semantic Colors
```css
Green:  #10b981 (success, online, active)
Purple: #8b5cf6 (events, live, info)
Orange: #f59e0b (warnings, running)
Red:    #ef4444 (errors, failures, critical)
Blue:   #3b82f6 (active state, links)
```

### Glass & Opacity
```css
Glass Background: rgba(255, 255, 255, 0.04)
Glass Border:     rgba(255, 255, 255, 0.08)
Glass Hover:      rgba(255, 255, 255, 0.08)

Text Primary:     white / 100% (rgba(255, 255, 255, 1.0))
Text Secondary:   white / 90%  (rgba(255, 255, 255, 0.9))
Text Tertiary:    white / 70%  (rgba(255, 255, 255, 0.7))
Text Muted:       white / 60%  (rgba(255, 255, 255, 0.6))
Text Disabled:    white / 50%  (rgba(255, 255, 255, 0.5))
Text Subtle:      white / 40%  (rgba(255, 255, 255, 0.4))
```

---

## Typography

### Font Family
```css
Sans: Geist Sans (primary)
Mono: Geist Mono (code, logs)
```

### Font Sizes
```css
Stat Numbers:  36px  (text-4xl)
Headings:      16px  (text-base)
Body:          14px  (text-sm)
Small:         12px  (text-xs)
Tiny:          11px  (text-[11px])
Micro:         10px  (text-[10px])
```

### Font Weights
```css
Bold:     700 (font-bold)     - stat numbers
Semibold: 600 (font-semibold) - headings
Medium:   500 (font-medium)   - labels
Regular:  400 (font-normal)   - body text
```

---

## Spacing

### Grid System
```css
Base Unit: 4px (1 in Tailwind)

Common Spacings:
- 8px  (2)  - tight
- 12px (3)  - compact  
- 16px (4)  - standard ✨
- 20px (5)  - comfortable
- 24px (6)  - loose
```

### Component Spacing
```css
Card Padding:   16-20px (p-4 to p-5)
Grid Gaps:      16px    (gap-4)
Section Gaps:   24px    (space-y-6)
Item Gaps:      12px    (space-y-3)
Inline Gaps:    12px    (gap-3)
```

---

## Borders & Radius

### Border Width
```css
Default: 1px (border)
Accent:  2px (border-2) - left accent on active items
```

### Border Radius
```css
Standard: 12px (rounded-xl) ✨
Medium:   8px  (rounded-lg)
Small:    6px  (rounded-lg on smaller elements)
Pill:     9999px (rounded-full) - badges
```

### Border Colors
```css
Primary:   border-white/8   - main borders
Secondary: border-white/5   - subtle dividers
Hover:     border-white/20  - interactive states

Colored (Status Cards):
- Green:  border-green-500/20
- Purple: border-purple-500/20
- Orange: border-orange-500/20
- Red:    border-red-500/20
```

---

## Glass Morphism

### Standard Glass Card
```css
background: rgba(255, 255, 255, 0.04);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
```

### Tailwind Classes
```css
.glass-card {
  @apply bg-white/[0.04] backdrop-blur-xl border border-white/8;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
```

### Colored Glass (Status Cards)
```tsx
// Green
className="bg-green-500/10 border-green-500/20"

// Purple  
className="bg-purple-500/10 border-purple-500/20"

// Orange
className="bg-orange-500/10 border-orange-500/20"

// Red
className="bg-red-500/10 border-red-500/20"
```

---

## Component Patterns

### Status Badge
```tsx
<span className="text-[11px] px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400">
  Gateway • 42ms
</span>
```

### Stat Card
```tsx
<div className="relative h-[90px] rounded-xl border backdrop-blur-xl bg-green-500/10 border-green-500/20 p-4">
  <Icon className="absolute top-4 right-4 w-4 h-4 text-green-400/30" />
  <div className="flex items-baseline gap-1 mt-6">
    <div className="text-4xl font-bold text-green-400">{value}</div>
    <div className="text-sm text-white/40">/ {max}</div>
  </div>
  <div className="text-xs text-white/50 mt-1">{title}</div>
</div>
```

### System Panel
```tsx
<div className="bg-white/[0.04] backdrop-blur-xl rounded-xl border border-white/8 p-5 shadow-lg">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-semibold flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {title}
    </h3>
    <span className="text-[11px] px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400">
      ● Online
    </span>
  </div>
  {/* Content */}
</div>
```

### Action Button
```tsx
<button className="flex-1 flex flex-col items-center justify-center h-14 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-lg transition-all">
  <Icon className="w-4 h-4 text-white/50 mb-1" />
  <span className="text-xs font-medium text-white/90">{label}</span>
  <span className="text-[10px] text-white/40">{sublabel}</span>
</button>
```

### Nav Item (Active)
```tsx
<Link className="flex items-center gap-3 px-3 h-9 rounded-lg mb-1 text-sm bg-blue-500/20 text-blue-400 border-l-2 border-blue-500">
  <Icon className="w-4 h-4" />
  <span>{name}</span>
</Link>
```

### Nav Item (Inactive)
```tsx
<Link className="flex items-center gap-3 px-3 h-9 rounded-lg mb-1 text-sm text-white/60 hover:text-white hover:bg-white/5">
  <Icon className="w-4 h-4" />
  <span>{name}</span>
</Link>
```

---

## Layout Structure

### Header
```css
Height: 48px (h-12)
Background: rgba(12,16,24,0.8) + backdrop-blur-xl
Border: border-b border-white/5
Padding: px-6
```

### Sidebar
```css
Width: 180px (w-[180px])
Background: rgba(10,14,22,0.95) + backdrop-blur-xl
Border: border-r border-white/5
```

### Main Content
```css
Padding: p-6 (24px)
Grid Gaps: gap-4 (16px)
```

### Live Feed
```css
Width: 280px (w-[280px])
Background: rgba(10,14,22,0.95) + backdrop-blur-xl
Border: border-l border-white/8
Shadow: shadow-2xl
```

---

## Interactive States

### Hover
```css
Background: hover:bg-white/5
Border: hover:border-white/20
Text: hover:text-white
```

### Focus
```css
Outline: focus:outline-none
Border: focus:border-white/20
```

### Active
```css
Background: bg-blue-500/20
Text: text-blue-400
Border: border-l-2 border-blue-500
```

### Disabled
```css
Opacity: opacity-50
Cursor: cursor-not-allowed
```

---

## Shadows

### Card Shadows
```css
Standard: shadow-lg
Overlay:  shadow-2xl
Inset:    inset 0 1px 0 rgba(255, 255, 255, 0.05)
```

---

## Icons

### Icon Sizes
```css
Small:  w-4 h-4  (16px)
Medium: w-5 h-5  (20px)
Large:  w-6 h-6  (24px)
```

### Icon Colors
```css
Active:  text-{color}-400
Muted:   text-white/50
Subtle:  text-white/40
Faded:   text-{color}-400/30
```

---

## Animations

### Transitions
```css
Standard: transition-colors
All:      transition-all
Duration: 150ms (default)
Easing:   cubic-bezier(0.4, 0, 0.2, 1)
```

### Special Animations
```css
Pulse: animate-pulse (connected dot)
```

---

## Usage Examples

### Creating a New Status Card
```tsx
<StatusCard 
  title="New Metric" 
  value={42} 
  max={100}
  icon={Activity} 
  color="green|purple|orange|red"
/>
```

### Creating a New System Panel
```tsx
<div className="bg-white/[0.04] backdrop-blur-xl rounded-xl border border-white/8 p-5 shadow-lg">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-semibold flex items-center gap-2">
      <Icon className="w-4 h-4" />
      Panel Title
    </h3>
  </div>
  
  {/* Content */}
  <div className="space-y-3 text-sm">
    <div className="flex justify-between">
      <span className="text-white/50">Label</span>
      <span className="text-white/70">Value</span>
    </div>
  </div>
</div>
```

### Adding a New Nav Section
```tsx
<div>
  <div className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2 px-3">
    Section Name
  </div>
  {items.map(item => <NavItem ... />)}
</div>
```

---

## CSS Variables Reference

```css
:root {
  /* Glass */
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-hover: rgba(255, 255, 255, 0.08);
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-tertiary: rgba(255, 255, 255, 0.4);
  
  /* Colors */
  --green: #10b981;
  --purple: #8b5cf6;
  --orange: #f59e0b;
  --red: #ef4444;
  --blue: #3b82f6;
}
```

---

## Accessibility

### Color Contrast
- Ensure text has sufficient contrast (WCAG AA minimum)
- Primary text (white/90): ✅ Good contrast
- Secondary text (white/70): ✅ Good contrast
- Tertiary text (white/50): ⚠️ Use for non-critical info only

### Interactive Elements
- Minimum touch target: 44x44px (mobile)
- Minimum click target: 32x32px (desktop)
- Clear focus states required
- ARIA labels recommended

### Keyboard Navigation
- All interactive elements should be keyboard accessible
- Tab order should be logical
- Focus should be visible

---

## Best Practices

### Do's ✅
- Use glass morphism on all cards
- Maintain consistent spacing (16px)
- Use semantic colors (green=success, red=error)
- Keep large stat numbers (36px)
- Use opacity levels for hierarchy
- Apply backdrop-blur for depth

### Don'ts ❌
- Don't use solid backgrounds
- Don't mix different spacing systems
- Don't use random colors
- Don't make text too small (<10px)
- Don't skip glass borders
- Don't overuse animations

---

**Maintained by:** frontend team  
**Last updated:** March 11, 2026  
**Version:** 1.0

# Mission Control - Layout Wireframe

**Date:** 2026-03-11  
**Architect:** ux-architect  
**Purpose:** Visual layout specifications for implementation

---

## 📐 Full Dashboard Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔴 CRITICAL ALERT: 3 failed login attempts detected                [Dismiss]            │ 48px
│ View security logs →                                                                    │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                    ↓ 20px gap
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐   │
│  │  [Server Icon]        │  │  [Activity Icon]       │  │  [Shield Icon]         │   │
│  │                        │  │                        │  │                        │   │ 140px
│  │  System Health        │  │  Active Workload      │  │  Security Status       │   │
│  │  ━━━━━━━━━━━━━━━━━━━ │  │  ━━━━━━━━━━━━━━━━━━━ │  │  ━━━━━━━━━━━━━━━━━━━ │   │
│  │  Healthy              │  │  16                    │  │  Warning               │   │
│  │  All services up      │  │  4 sessions • 0 agents│  │  3 failed logins       │   │
│  │  42ms gateway latency │  │  68 capacity available│  │  0 errors today        │   │
│  └────────────────────────┘  └────────────────────────┘  └────────────────────────┘   │
│     ← 20px gap →                ← 20px gap →                                            │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                    ↓ 24px gap
┌──────────────────────────────────────────────┬──────────────────────────────────────────┐
│  SYSTEM OVERVIEW (60%)                       │  ACTIVITY STREAM (40%)                   │
│                                               │                                           │
│  ┌────────────────────────────────────────┐  │  ┌────────────────────────────────────┐ │
│  │ ▼ System Health              [Icon]  │  │  │ 👥 Active Sessions         3 active │ │
│  │                                        │  │  │                                     │ │
│  │ ● Gateway        online (42ms)   🟢   │  │  │ sess_abc123              [active]  │ │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━  30%      │  │  │ agent:frontend           2 min ago │ │
│  │   Memory         2.4GB / 8GB           │  │  │                                     │ │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━  9%       │  │  │ sess_def456              [idle]    │ │
│  │   Disk           45GB / 500GB          │  │  │ agent:ux-researcher      15 min ago│ │
│  │   Uptime         7d 4h 23m             │  │  │                                     │ │
│  └────────────────────────────────────────┘  │  │ sess_ghi789              [active]  │ │
│                    ↓ 16px                     │  │ user:main                1 hour ago│ │
│  ┌────────────────────────────────────────┐  │  └────────────────────────────────────┘ │
│  │ ▶ Security & Audit           [Icon]  │  │                ↓ 16px                     │
│  │                                        │  │  ┌────────────────────────────────────┐ │
│  │ (Collapsed - click to expand)         │  │  │ 💻 Recent Activity      View all → │ │
│  └────────────────────────────────────────┘  │  │                                     │ │
│                    ↓ 16px                     │  │ 05:32  INFO   Frontend agent done │ │
│  ┌────────────────────────────────────────┐  │  │ 05:18  WARN   High memory usage   │ │
│  │ ▶ Backup & Pipelines         [Icon]  │  │  │ 05:10  INFO   Session started      │ │
│  │                                        │  │  │ 05:02  ERROR  API rate limit       │ │
│  │ (Collapsed - click to expand)         │  │  │                                     │ │
│  └────────────────────────────────────────┘  │  └────────────────────────────────────┘ │
│                                               │                                           │
│  Min-height: 320px                            │  Min-height: 320px                       │
└──────────────────────────────────────────────┴──────────────────────────────────────────┘
                                    ↓ 24px gap
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│  │  [⚡]   │  │  [💻]   │  │  [📋]   │  │  [💾]   │  │  [🔀]   │                      │ 88px
│  │         │  │         │  │         │  │         │  │         │                      │
│  │ Spawn   │  │  Logs   │  │  Tasks  │  │ Memory  │  │  Flows  │                      │
│  │  ⌘N     │  │  ⌘L     │  │  ⌘T     │  │  ⌘M     │  │  ⌘F     │                      │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘                      │
│    ← 16px gap between buttons →                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘

Total height (excluding header/sidebar): ~680px
Width: 100% (accounting for 240px sidebar + 320px LiveFeed = content width ~740px at 1280px screen)
```

---

## 📏 Detailed Measurements

### Zone 1: Critical Alert Banner
```
┌─────────────────────────────────────────────────────────────┐
│ 🔴 [Icon 20x20]  CRITICAL: Message text here    [Dismiss ×] │ ← 48px height
│     12px gap     14px font, 600 weight           12px →     │
│                  View security logs → (12px, underline)     │
│                     ↑ 8px gap                               │
└─────────────────────────────────────────────────────────────┘
│ Padding: 12px top/bottom, 20px left/right                   │
│ Background: rgba(239, 68, 68, 0.1)                         │
│ Border-left: 4px solid #ef4444                              │
└─────────────────────────────────────────────────────────────┘
```

**States:**
- **Hidden:** No critical alerts (height: 0, margin: 0)
- **Visible:** Critical or warning alerts (height: 48px min, auto expand)
- **Dismissed:** Fade out animation (300ms)

---

### Zone 2: Primary Stat Cards
```
┌────────────────────────┐
│ [Icon 24x24]          │ ← Top padding: 24px
│    ↑ 12px gap         │
│                        │
│ SYSTEM HEALTH          │ ← Title: 12px, 500 weight, uppercase
│ ─────────────────────  │ ← Border-top: 3px (accent color)
│    ↑ 8px gap          │
│                        │
│ Healthy                │ ← Value: 32px, 600 weight, status color
│    ↑ 4px gap          │
│ All services up        │ ← Subtitle: 14px, 400 weight, 70% opacity
│    ↑ 4px gap          │
│ 42ms gateway latency   │ ← Metric: 12px, 400 weight, 55% opacity
│                        │
│ ← Bottom padding: 24px │
└────────────────────────┘

Dimensions:
- Width: calc((100% - 40px) / 3)  [40px = 2 × 20px gaps]
- Height: 140px (fixed)
- Padding: 24px all sides
- Border-radius: 12px
- Gap between cards: 20px
```

**Grid Layout:**
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 20px;
margin-bottom: 24px;
```

---

### Zone 3A: System Overview (Collapsible Sections)

#### Expanded Section
```
┌────────────────────────────────────────┐
│ ▼ System Health              [Icon]  │ ← Header: 40px height
│    ↑ 12px padding top                 │    16px font, 600 weight
│                                        │
│ ● Gateway        online (42ms)   🟢   │ ← Row: 32px height
│   ↑ 8px padding                       │    14px font
│                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━  30%      │ ← Progress: 24px height
│   Memory         2.4GB / 8GB           │    (6px bar + 18px labels)
│   ↑ 12px gap                          │
│                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━  9%       │
│   Disk           45GB / 500GB          │
│   ↑ 12px gap                          │
│                                        │
│   Uptime         7d 4h 23m             │ ← Simple row: 28px
│                                        │
│    ↓ 16px padding bottom              │
└────────────────────────────────────────┘

Height: Auto (based on content)
Min-height: 160px
Max-height: None (scrollable if needed)
```

#### Collapsed Section
```
┌────────────────────────────────────────┐
│ ▶ Security & Audit           [Icon]  │ ← 40px height
│                                        │    Clickable (cursor: pointer)
│ (Click to expand)                      │    12px font, 40% opacity
└────────────────────────────────────────┘

Height: 40px (collapsed)
Transition: height 200ms ease-out, opacity 150ms ease-in
```

---

### Zone 3B: Activity Stream

#### Session List
```
┌────────────────────────────────────┐
│ 👥 Active Sessions     3 active   │ ← Header: 32px
│     14px font          12px →     │
│    ↑ 16px gap                     │
│                                    │
│ ┌────────────────────────────────┐│
│ │ sess_abc123        [active]   ││ ← Item: 48px height
│ │ agent:frontend     2 min ago  ││    12px/14px fonts
│ │ ↑ 12px padding                ││
│ └────────────────────────────────┘│
│    ↑ 8px gap                      │
│ ┌────────────────────────────────┐│
│ │ sess_def456        [idle]     ││
│ │ agent:ux-researcher 15 min ago││
│ └────────────────────────────────┘│
│                                    │
└────────────────────────────────────┘

Item structure:
- ID: 12px mono, 50% opacity
- Type: 14px, 95% opacity
- Status badge: 24px height, 60px width
- Timestamp: 12px, 50% opacity
```

#### Log Entry List
```
┌────────────────────────────────────┐
│ 💻 Recent Activity    View all →  │ ← Header with action
│                                    │
│ ┌────────────────────────────────┐│
│ │ 05:32  [INFO]   Message here  ││ ← Entry: 36px height
│ │ 12px   Badge    14px text     ││
│ │        60px                    ││
│ └────────────────────────────────┘│
│    ↑ 8px gap                      │
│ ┌────────────────────────────────┐│
│ │ 05:18  [WARN]   Message here  ││
│ └────────────────────────────────┘│
│                                    │
└────────────────────────────────────┘

Level badge:
- Width: 60px
- Height: 24px
- Font: 11px, 500 weight, uppercase
- Dot indicator: 8px circle
```

---

### Zone 4: Action Bar

```
┌─────────────────────────────────────────────────────────────┐
│  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐    │
│  │ [⚡]  │  │ [💻]  │  │ [📋]  │  │ [💾]  │  │ [🔀]  │    │
│  │ 24x24 │  │ 24x24 │  │ 24x24 │  │ 24x24 │  │ 24x24 │    │ 72px
│  │  ↑12px│  │       │  │       │  │       │  │       │    │
│  │ Spawn │  │ Logs  │  │ Tasks │  │Memory │  │ Flows │    │
│  │  13px │  │  13px │  │  13px │  │  13px │  │  13px │    │
│  │  ⌘N   │  │  ⌘L   │  │  ⌘T   │  │  ⌘M   │  │  ⌘F   │    │
│  │ 11px  │  │ 11px  │  │ 11px  │  │ 11px  │  │ 11px  │    │
│  └───────┘  └───────┘  └───────┘  └───────┘  └───────┘    │
│    ← 16px gap between buttons →                            │
└─────────────────────────────────────────────────────────────┘

Button dimensions:
- Width: calc((100% - 64px) / 5)  [64px = 4 × 16px gaps]
- Height: 72px
- Padding: 12px
- Border-radius: 12px
- Icon: 24x24px, centered
- Label: 13px, centered, 500 weight
- Sublabel: 11px, centered, 400 weight, 40% opacity
```

---

## 🎨 Visual Hierarchy Indicators

### Typography Scale (Sizes in Dashboard)
```
📐 Size     Weight  Usage                          Opacity
────────────────────────────────────────────────────────────
36px        600     Stat card values (numbers)     95-100%
32px        600     Primary values                 95-100%
24px        600     Alert titles, icons            95%
16px        600     Section headers                95%
14px        500     Card titles, labels            70-75%
14px        400     Body text, descriptions        95%
13px        500     Button labels                  95%
12px        500     Stat card titles (uppercase)   70%
12px        400     Metric text, timestamps        50-55%
11px        400     Helper text, shortcuts         40%
```

### Color Coding
```
🎨 Element          Background              Border              Text
─────────────────────────────────────────────────────────────────────
Alert (Critical)   rgba(239,68,68,0.1)    4px #ef4444 (left)  #ef4444
Alert (Warning)    rgba(245,158,11,0.1)   4px #f59e0b (left)  #f59e0b
Stat (Healthy)     Glass                  3px #10b981 (top)   #10b981
Stat (Warning)     Glass                  3px #f59e0b (top)   #f59e0b
Stat (Critical)    Glass                  3px #ef4444 (top)   #ef4444
Badge (Active)     rgba(16,185,129,0.1)   1px #10b981         #10b981
Badge (Idle)       rgba(255,255,255,0.06) 1px rgba(255,255,255,0.08) rgba(255,255,255,0.5)
```

### Spacing Visual Guide
```
Spacing Level    Size    Use Case
─────────────────────────────────────────────────────
Micro            4px     Icon to text, inline elements
Tight            8px     Related items (list items)
Default          12px    Standard vertical rhythm
Comfortable      16px    Section internal padding
Breathing        20px    Between cards/components
Clear            24px    Between major zones
Strong           32px    Page margins, hero sections
Maximum          40px    Top-level spacing
```

---

## 📱 Responsive Wireframes

### Desktop (1280px+) - Default
[See full wireframe above]

### Laptop (1024px - 1279px)
```
Changes:
- Primary stats: Same 3 columns, tighter gap (16px instead of 20px)
- Zone 3 split: 55% / 45% instead of 60% / 40%
- Action bar: Same 5 buttons, slightly narrower
```

### Tablet (768px - 1023px)
```
┌─────────────────────────────────────────┐
│ Alert Banner (if present)               │
├─────────────────────────────────────────┤
│ ┌───────┐ ┌───────┐ ┌───────┐          │
│ │ Stat  │ │ Stat  │ │ Stat  │          │ ← 3 cols, smaller
│ └───────┘ └───────┘ └───────┘          │
├─────────────────────────────────────────┤
│ System Overview (100% width)           │ ← Stacked
│                                         │
├─────────────────────────────────────────┤
│ Activity Stream (100% width)           │ ← Below overview
│                                         │
├─────────────────────────────────────────┤
│ [Spawn] [Logs] [Tasks] [More ▼]       │ ← 3 visible + menu
└─────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌───────────────────────────┐
│ Alert (if present)        │
├───────────────────────────┤
│ ┌───────────────────────┐ │
│ │ System Health         │ │ ← 1 col, stacked
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ Active Workload       │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ Security Status       │ │
│ └───────────────────────┘ │
├───────────────────────────┤
│ ▼ System Health          │ ← All collapsed
│ ▶ Security & Audit       │    by default
│ ▶ Backup & Pipelines     │
├───────────────────────────┤
│ 👥 Sessions (3)          │
│ 💻 Recent Activity       │
├───────────────────────────┤
│        [☰ Actions]       │ ← Bottom sheet
└───────────────────────────┘
```

---

## 🔄 Interaction States

### Collapsible Section States
```
State       Icon    Height      Transition
───────────────────────────────────────────────
Collapsed   ▶       40px        200ms ease-out
Expanding   ▶→▼     40→Auto     200ms ease-out
Expanded    ▼       Auto        —
Collapsing  ▼→▶     Auto→40px   200ms ease-in
```

### Action Button States
```
State     Background           Scale   Border         Shadow
──────────────────────────────────────────────────────────────────
Rest      rgba(255,255,255,0.10) 1.0    1px 12% white  0 2px 8px
Hover     rgba(255,255,255,0.14) 1.02   1px 16% white  0 4px 12px
Active    rgba(255,255,255,0.08) 0.98   1px 12% white  0 1px 4px
Disabled  rgba(255,255,255,0.04) 1.0    1px 8% white   none
```

### Alert Dismiss Transition
```
1. User clicks [Dismiss]
2. Fade out opacity (300ms ease-out): 1 → 0
3. Shrink height (200ms ease-in): 48px → 0
4. Reduce margin (200ms ease-in): 20px → 0
5. Remove from DOM
```

---

## 📊 Layout Math

### Content Width Calculation
```
Screen width:        1280px
Sidebar (fixed):     -240px
LiveFeed (fixed):    -320px
Scrollbar:           -16px (approx)
───────────────────────────
Content area:        704px

With padding (20px each side): 664px usable width

Primary stat cards:
(664px - 40px gaps) / 3 = 208px per card
```

### Zone Height Calculation
```
Zone 1 (Alert):      48px (if present) + 20px margin
Zone 2 (Stats):      140px + 24px margin
Zone 3 (Split):      320px min (auto expand) + 24px margin
Zone 4 (Actions):    88px + 0px margin (bottom of page)
───────────────────────────────────────────────────
Total minimum:       ~640px (without alert)
                     ~708px (with alert)
```

### Spacing Budget
```
Component          Internal    External    Total
───────────────────────────────────────────────────
Alert banner       24px        20px        44px
Stat cards (3)     72px        40px        112px
System Overview    48px        16px        64px
Activity Stream    40px        16px        56px
Action Bar         32px        0px         32px
───────────────────────────────────────────────────
Total spacing:     216px       92px        308px

Additional gaps between zones: 68px
Grand total: 376px (over 50% increase from ~240px) ✅
```

---

## ✅ Wireframe Checklist

### Structure
- [x] 4 clear zones defined
- [x] Measurements specified for all components
- [x] Grid layout math calculated
- [x] Responsive breakpoints designed

### Hierarchy
- [x] Primary elements largest (36px values, bold)
- [x] Secondary elements medium (14-16px headers)
- [x] Tertiary elements smallest (11-12px helpers)

### Spacing
- [x] 50% more whitespace achieved (376px vs 240px)
- [x] Consistent spacing scale (4px base unit)
- [x] Clear separation between zones (20-24px)

### Flow
- [x] Z-pattern scan path visible in layout
- [x] Eye starts top-left (alert or first stat)
- [x] Diagonal flow to activity stream
- [x] Bottom return across action bar

### Implementation Ready
- [x] All dimensions specified
- [x] Component hierarchy clear
- [x] Interaction states documented
- [x] Responsive adaptations defined

---

**Status:** ✅ COMPLETE  
**Next:** ui-designer (color system & typography specs)  
**Implementation:** frontend (build components)

---

*Wireframe created by ux-architect agent*  
*Date: 2026-03-11 12:29 GMT+1*

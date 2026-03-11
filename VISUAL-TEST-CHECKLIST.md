# Mission Control - Visual Test Checklist

**Open:** http://localhost:3003

---

## ✅ Glass Effect Verification

### Sidebar (Left)
- [ ] Translucent background visible (can see through to background)
- [ ] Blur effect visible (content behind is blurred)
- [ ] White border on right edge (subtle)
- [ ] Navigation items have glass hover effect
- [ ] "Connected" status at bottom visible

### Header (Top)
- [ ] Translucent bar across top
- [ ] Blur effect visible
- [ ] Search input has glass effect
- [ ] Input placeholder visible (white/40%)
- [ ] Badge pills have glass treatment (Sessions, Gateway, Events)
- [ ] Icon buttons have glass hover effect
- [ ] Time display shows (no hydration error)

### Stat Cards Row (Top 4 Cards)
- [ ] **Active Sessions** - Blue 3px top border visible
- [ ] **Agents Online** - Purple 3px top border visible
- [ ] **Tasks Running** - Amber 3px top border visible
- [ ] **Errors 24h** - Red 3px top border visible
- [ ] All cards have translucent glass background
- [ ] All cards have blur effect
- [ ] Hover effect: slight lift + opacity increase

### Main Content Cards (Middle Row)
- [ ] **System Health** - Glass card with translucent background
- [ ] **Security & Audit** - Glass card with blur visible
- [ ] **Backup & Pipelines** - Glass card with depth
- [ ] All cards have inner highlight (white glow at top)
- [ ] All text readable (white/95% for values, white/50% for labels)
- [ ] Progress bar visible in System Health

### Activity Cards (Bottom Row)
- [ ] **Sessions** - Glass card with session list
- [ ] **Recent Logs** - Glass card with log entries
- [ ] Status badges have colored backgrounds
- [ ] Font-mono logs readable

### Action Bar (Bottom)
- [ ] Container has glass effect
- [ ] Each of 5 buttons has glass treatment
- [ ] Buttons have hover effect (lift + glow)
- [ ] Text readable (labels white/95%, subtitles white/50%)

### LiveFeed Panel (Right)
- [ ] Translucent panel on right side
- [ ] Blur effect visible (deepest blur - 60px)
- [ ] Event cards inside have glass treatment
- [ ] Individual events have subtle glass background
- [ ] Close button (X) has glass hover effect
- [ ] Purple badge showing "35" visible

---

## 🎨 Color & Depth Check

### Blur Depth
- [ ] Sidebar/LiveFeed: Deepest blur (most frosted)
- [ ] Header/Cards: Medium blur (visible depth)
- [ ] Buttons/Inputs: Subtle blur (light frosting)

### Translucency
- [ ] Can see background gradient through all panels
- [ ] Layered glass effect visible (cards over background)
- [ ] No fully opaque elements (all have transparency)

### Shadows
- [ ] Cards have soft drop shadows
- [ ] Inner highlights visible at top of cards
- [ ] No harsh edges (all soft and blurred)

### Text Contrast
- [ ] All headings readable (white/95%)
- [ ] All body text readable (white/70%)
- [ ] All labels readable (white/50%)
- [ ] All placeholders subtle but visible (white/40%)

---

## 🖱️ Interaction Check

### Hover States
- [ ] Sidebar nav items: Background lightens on hover
- [ ] Stat cards: Slight lift + shadow increase
- [ ] Main cards: Opacity increases slightly
- [ ] Buttons: Lift + border brightens
- [ ] Input: Border brightens on hover
- [ ] All transitions smooth (no jank)

### Focus States
- [ ] Search input: Blue glow ring on focus
- [ ] Input border brightens on focus
- [ ] Background lightens slightly on focus

### Active States
- [ ] Buttons: Press down (translateY(0)) on click
- [ ] Active nav item: Blue left border visible
- [ ] Click handlers work (alert shows for action buttons)

---

## 📱 Responsive Check

### Desktop (1920x1080)
- [ ] Sidebar visible and fixed (240px)
- [ ] LiveFeed visible and fixed (300px)
- [ ] Main content centered between sidebars
- [ ] All cards visible without horizontal scroll
- [ ] Grid layouts intact (4 cols stats, 3 cols systems, etc.)

### Layout
- [ ] Sidebar fixed to left edge
- [ ] LiveFeed fixed to right edge
- [ ] Header spans full width
- [ ] Main content has proper margins
- [ ] No overlap between sidebars and content

---

## 🔍 Browser Compatibility

### Chrome/Edge (Primary)
- [ ] All blur effects visible
- [ ] All transitions smooth
- [ ] No console errors
- [ ] DevTools shows backdrop-filter applied

### Safari (if available)
- [ ] Blur effects visible (with -webkit- prefix)
- [ ] All features working

### Firefox 103+ (if available)
- [ ] Blur effects visible
- [ ] All features working

---

## 🐛 Error Check

### Console (F12)
- [ ] No React hydration errors
- [ ] No TypeScript errors
- [ ] No missing module errors
- [ ] Only expected warnings (workspace root inference - harmless)

### Visual Bugs
- [ ] No text cut off
- [ ] No overlapping elements
- [ ] No z-index issues (modals would appear above all)
- [ ] No color contrast issues

---

## ✨ Apple Glass Aesthetic

### Overall Feel
- [ ] Feels like macOS Big Sur / Monterey design
- [ ] Depth and layering visible
- [ ] Soft, premium aesthetic
- [ ] Not flat or boring
- [ ] Not garish or over-designed

### Material Quality
- [ ] Glass looks realistic (not just transparency)
- [ ] Blur feels natural (not artificial)
- [ ] Shadows create depth (not harsh)
- [ ] Colors are vibrant but not oversaturated

---

## 🎯 Final Sign-Off

- [ ] **All checklist items pass**
- [ ] **Visual matches Apple glass aesthetic**
- [ ] **Performance is smooth (60fps)**
- [ ] **No errors in console**
- [ ] **Ready for production**

---

**Tested By:** _____________  
**Date:** _____________  
**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**

---

## 📸 Screenshot Locations

**For documentation:**
1. Full dashboard view
2. Stat cards close-up (showing colored borders)
3. Sidebar navigation
4. Header with search
5. Hover state example
6. Dark background showing blur effect

---

**Next:** If all items checked, proceed to production deployment ✅

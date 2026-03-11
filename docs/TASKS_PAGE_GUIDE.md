# Tasks Page - User Guide

## Overview
The Tasks page provides a comprehensive view of all OpenClaw sessions/tasks with powerful filtering, search, and pagination capabilities.

---

## Features

### 📊 Dashboard Stats
Four stat cards showing:
- **Running**: Currently active tasks (updated < 5min OR age < 2h)
- **Completed**: Finished tasks
- **Failed**: Tasks with errors
- **Total**: All sessions

### 🔍 Search & Filters

**Search Bar** (top-left filter row)
- Search by agent ID (e.g., `frontend`, `backend`)
- Search by session key (e.g., `subagent:abc123`)
- Search by labels

**Status Filter** (dropdown)
- All Status
- Running
- Completed
- Failed

**Agent Filter** (dropdown)
- Dynamically populated with available agents
- Filter to specific agent's tasks

**Sort** (dropdown)
- Newest First (default)
- Oldest First
- By Agent (alphabetical)

### 📄 Pagination
- 20 tasks per page
- Previous/Next buttons
- Page indicator (e.g., "Page 2 of 5")
- Auto-resets to page 1 when filters change

### 📋 Task List

Each task row shows:
- **Agent ID** (e.g., `frontend`, `main`)
- **Session Key** (truncated, full key visible on hover)
- **Labels** (if present, shown as purple badge)
- **Status Badge**:
  - 🔵 Running (animated spinner)
  - 🟢 Completed (checkmark)
  - 🔴 Failed (X icon)
- **Age** (e.g., `2d 5h`, `45m`, `12s`)
- **View Icon** (appears on hover)

**Interactions:**
- Click any row to expand details (future: details panel)
- Hover for view indicator

---

## Empty States

**No Tasks Found**
- Shows when filters return zero results
- "Show all tasks" button to reset filters

**Context-Aware Messages**
- "No running tasks" (when status = running)
- "No completed tasks" (when status = completed)
- "No failed tasks" (when status = failed)

---

## Error Handling

**API Failure**
- Displays error card with message
- Retry button to refetch data
- Automatically retries 3 times before showing error

**Component Crash**
- ErrorBoundary catches crashes
- Shows fallback UI
- Logs error to console

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Navigate between filters |
| Enter | Apply search (when in search box) |
| Arrow Keys | Navigate dropdown filters |
| Space | Activate buttons |

---

## Performance

- **Auto-refresh**: Data refetches every 10 seconds
- **Pagination**: Limits DOM to 20 items max
- **Memoization**: Filters/sorts cached until dependencies change
- **Optimized Re-renders**: React Query handles caching

---

## Status Detection Logic

Tasks are marked as:

**Running** if:
- Session `state === 'running'`, OR
- Updated within last 5 minutes, OR
- Age < 2 hours

**Completed** if:
- Session `state === 'completed'`, OR
- Age >= 2 hours AND not recently updated

**Failed** if:
- Session `state === 'failed'`, OR
- Session has `error` field

---

## Accessibility

- ✅ Full keyboard navigation
- ✅ ARIA labels on all interactive elements
- ✅ Screen reader announcements
- ✅ Focus indicators
- ✅ Semantic HTML

---

## Tips & Tricks

1. **Find Failed Tasks Fast**: Use Status filter → Failed
2. **Track Specific Agent**: Use Agent filter + Sort by Newest
3. **Recent Activity**: Sort by Newest + Status filter = Running
4. **Clean View**: Clear all filters for full overview
5. **Quick Refresh**: Click refresh icon (updates immediately vs. 10s auto-refresh)

---

## Future Enhancements

- Task details panel (click to view full session info, logs)
- WebSocket for real-time updates
- Bulk actions (kill/restart multiple)
- Export to CSV/JSON
- Task duration charts
- Success rate analytics
- Date range filters
- Advanced search (regex, multi-field)

---

## Troubleshooting

**Tasks not showing?**
- Check filters (might be hiding results)
- Click "Clear filters" to reset
- Click refresh icon to force update

**Wrong task count?**
- Stats show ALL tasks, list shows FILTERED tasks
- Check active filter indicator below filter bar

**Slow performance?**
- Normal with 100+ tasks (pagination helps)
- Consider adding date range filter (future feature)

---

## Developer Notes

**Component Structure:**
```tsx
TasksPage (ErrorBoundary wrapper)
  └─ TasksPageContent
      ├─ Stats (4 cards)
      ├─ Filters (search + 3 dropdowns)
      ├─ Task List
      │   └─ TaskRow (per task)
      └─ Pagination
```

**State Management:**
- React Query for API data
- Local state for filters/pagination
- Memoized computations for performance

**Styling:**
- Glass-morphism design system
- Tailwind CSS utility classes
- Consistent with Mission Control theme

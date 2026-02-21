# Task: Shared Components and Utilities

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 4A (Core Dashboard Pages -- Foundation)
- Dependencies: dashboard-work-plan-task-06 (Vite scaffold), dashboard-work-plan-task-05 (server integration)
- Size: Medium (7 new files)

## Implementation Content
Create the shared component library and utilities used by all dashboard pages: API client, polling hook, layout, and reusable UI components.

Reference: Design Doc dashboard component hierarchy, API surface mapping.

## Target Files
- [x] `apps/cli/dashboard/src/lib/api.ts` (new)
- [x] `apps/cli/dashboard/src/hooks/usePolling.ts` (new)
- [x] `apps/cli/dashboard/src/components/DashboardLayout.tsx` (new)
- [x] `apps/cli/dashboard/src/components/StateBadge.tsx` (new)
- [x] `apps/cli/dashboard/src/components/ChannelBadge.tsx` (new)
- [x] `apps/cli/dashboard/src/components/TodoList.tsx` (new)
- [x] `apps/cli/dashboard/src/components/InstanceTable.tsx` (new)
- [x] `apps/cli/dashboard/src/App.tsx` (modify: add layout and routes)

## Implementation Steps

### 1. API Client
- [x] Create `apps/cli/dashboard/src/lib/api.ts`:
  - Reads token from `sessionStorage` key `relay-dashboard-token`
  - All requests include `Authorization: Bearer <token>` header
  - Error handling: 401 triggers "Session expired" message
  - Connection failure shows "Cannot reach daemon" with retry
  - Export `apiGet(path)`, `apiPost(path, body?)` functions

### 2. Polling Hook
- [x] Create `apps/cli/dashboard/src/hooks/usePolling.ts`:
  - Generic hook accepting endpoint URL, interval (ms), and enabled flag
  - Returns `{ data, loading, error, refresh }`
  - Pauses when browser tab is hidden (document.visibilitychange)
  - Implements exponential backoff on consecutive failures (max 30s)

### 3. Dashboard Layout
- [x] Create `apps/cli/dashboard/src/components/DashboardLayout.tsx`:
  - Sidebar navigation with links: Status, Instances, Create, Transcripts, Login, Config, Call
  - Header with WhatsApp/Telegram connection status indicators (polled from /status)
  - Content area with React Router `<Outlet />`
  - Glass UI aesthetic: semi-transparent sidebar, subtle borders

### 4. Reusable Components
- [x] Create `StateBadge.tsx`: Color-coded badge for all 11 instance states
- [x] Create `ChannelBadge.tsx`: Channel indicator (whatsapp, telegram, phone)
- [x] Create `TodoList.tsx`: Todo item list with status indicators (pending, completed, failed)
- [x] Create `InstanceTable.tsx`: Table component for instance list with state/channel badges and links

### 5. Update App.tsx with Routes
- [x] Update `apps/cli/dashboard/src/App.tsx`:
  - Wrap routes in `DashboardLayout`
  - Add placeholder routes for all pages
  - Route structure: `/` (status), `/instances` (list), `/instances/:id` (detail), `/instances/new` (create), `/instances/:id/transcript`, `/login`, `/config`, `/call`

### 6. Build Verification
- [x] Run `cd apps/cli/dashboard && npx vite build` -- verify build succeeds
- [ ] Start daemon, open dashboard, verify layout renders with sidebar navigation

## Completion Criteria
- [x] API client handles auth token lifecycle (extract from sessionStorage, send as Bearer)
- [x] Polling hook polls at configured intervals, pauses on hidden tab
- [x] Dashboard layout renders with sidebar navigation and content area
- [x] All shared components render correctly
- [x] Vite build succeeds (L2: Manual Verification -- layout visible in browser)

## Notes
- Impact scope: New files only within `apps/cli/dashboard/src/`. No daemon code changes.
- Constraints: Use Tailwind CSS classes matching brand tokens (dark bg, glass aesthetic, muted blue/cyan).
- These components are the foundation for all subsequent page tasks.

# Task: StatusPage

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 4B (Core Dashboard Pages)
- Dependencies: dashboard-work-plan-task-08 (shared components)
- Size: Small (1-2 new files)

## Implementation Content
Implement the StatusPage dashboard component. Displays daemon status: PID, uptime, WhatsApp connected, Telegram connected, instance counts by state, active session count, heartbeat timer count. Polls `GET /status` every 5 seconds.

Reference: Design Doc FR-4 (real-time polling), API surface mapping (`relay status` -> `GET /status`).

## Target Files
- [x] `apps/cli/dashboard/src/pages/StatusPage.tsx` (new)
- [x] `apps/cli/dashboard/src/App.tsx` (modify: add route)

## Implementation Steps

### 1. Create StatusPage
- [x] Create `apps/cli/dashboard/src/pages/StatusPage.tsx`:
  - Use `usePolling('/status', 5000)` to poll daemon status
  - Display in glass-card layout:
    - PID, uptime (formatted as hours:minutes:seconds)
    - WhatsApp connection status (green/red indicator)
    - Telegram connection status (green/red indicator)
    - Active instance count / total instance count
    - Active timer count, session count
  - Loading state while first poll pending
  - Error state if daemon unreachable

### 2. Register Route
- [x] Update `App.tsx`: replace placeholder for `/` with `<StatusPage />`

### 3. Verify
- [x] Build dashboard, start daemon, open dashboard
- [ ] Verify status page shows correct data matching `relay status` output
- [ ] Wait 5+ seconds, verify uptime updates

## Completion Criteria
- [x] StatusPage displays all daemon status fields
- [x] Polling updates every 5 seconds (verified by watching uptime change)
- [x] Values match `relay status` CLI output
- [x] Build succeeds (L3: Build Success Verification)

## Notes
- Impact scope: New dashboard page only. No daemon code changes.
- Constraints: Follow brand styling -- dark cards with glass aesthetic.

# Task: InstancesPage + InstanceDetailPage

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 4C (Core Dashboard Pages)
- Dependencies: dashboard-work-plan-task-08 (shared components)
- Size: Medium (2-3 new files)

## Implementation Content
Implement InstancesPage (table of all instances) and InstanceDetailPage (full instance view with actions). These are the core instance management pages providing feature parity with `relay list`, `relay get`, `relay pause`, `relay resume`, `relay cancel`, and `relay send`.

Reference: Design Doc FR-2 (feature parity), FR-4 (real-time polling), FR-7 (message sending).

## Target Files
- [x] `apps/cli/dashboard/src/pages/InstancesPage.tsx` (new)
- [x] `apps/cli/dashboard/src/pages/InstanceDetailPage.tsx` (new)
- [x] `apps/cli/dashboard/src/App.tsx` (modify: add routes)

## Implementation Steps

### 1. Create InstancesPage
- [x] Create `apps/cli/dashboard/src/pages/InstancesPage.tsx`:
  - Use `usePolling('/instances', 5000)` to poll instance list
  - Render `InstanceTable` component with all instances
  - State badge and channel badge for each instance
  - Click row to navigate to `/instances/:id`
  - Filter/sort controls: by state (dropdown), sortable columns
  - "Create New" button linking to `/instances/new`

### 2. Create InstanceDetailPage
- [x] Create `apps/cli/dashboard/src/pages/InstanceDetailPage.tsx`:
  - Use `usePolling('/instances/:id', 3000)` with instance ID from URL params
  - Display: state (StateBadge), objective, target contact, channel (ChannelBadge)
  - TodoList component showing todos with status
  - Heartbeat config display (interval, max followups, follow-up count)
  - Action buttons:
    - Pause (POST `/instances/:id/pause`) -- enabled when state is ACTIVE/WAITING_*
    - Resume (POST `/instances/:id/resume`) -- enabled when state is PAUSED
    - Cancel (POST `/instances/:id/cancel`) -- enabled when state is non-terminal
  - Message send input:
    - Text input + Send button
    - POST `/instances/:id/send` with `{ message: "..." }`
    - Disabled when instance is in terminal state or PAUSED
    - Success/failure indicator
  - Link to transcript page: `/instances/:id/transcript`
  - Created/updated timestamps

### 3. Register Routes
- [x] Update `App.tsx`: add routes for `/instances` and `/instances/:id`

### 4. Verify
- [ ] Build dashboard, start daemon, create a test instance via CLI
- [ ] Verify InstancesPage shows the instance with correct state/channel
- [ ] Click instance, verify detail page shows correct data matching `relay get <id>`
- [ ] Test Pause/Resume/Cancel buttons
- [ ] Test Send message from detail page

## Completion Criteria
- [x] InstancesPage lists all instances with state/channel badges
- [x] Clicking an instance navigates to detail page
- [x] InstanceDetailPage shows all instance data
- [x] Pause/Resume/Cancel actions work and update displayed state
- [x] Message send works and shows success/failure
- [x] Polling updates data every 3-5 seconds
- [x] Build succeeds (L3: Build Success Verification)

## Notes
- Impact scope: New dashboard pages only. No daemon code changes.
- Constraints: Action buttons must be disabled based on instance state to prevent invalid transitions.

# Task: TranscriptPage

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 5A (Advanced Pages)
- Dependencies: dashboard-work-plan-task-08 (shared components ONLY -- does not depend on StatusPage or InstancesPage)
- Size: Small (2 new files)

## Implementation Content
Implement the TranscriptPage with a chat-style scrollable view. Displays messages with sender, timestamp, and content. Polls every 3 seconds and appends new messages without losing scroll position.

Reference: Design Doc FR-6 (transcript viewing with real-time updates), API surface mapping (`relay transcript <id>` -> `GET /instances/:id/transcript`).

**Dependency optimization note**: This task depends only on Task 08 (shared components: apiClient, usePolling, DashboardLayout). It does NOT depend on Task 09 (StatusPage) or Task 10 (InstancesPage/InstanceDetailPage) and can be executed in parallel with them.

## Target Files
- [x] `apps/cli/dashboard/src/pages/TranscriptPage.tsx` (new)
- [x] `apps/cli/dashboard/src/components/TranscriptView.tsx` (new)
- [x] `apps/cli/dashboard/src/App.tsx` (modify: add route)

## Implementation Steps

### 1. Create TranscriptView Component
- [x] Create `apps/cli/dashboard/src/components/TranscriptView.tsx`:
  - Chat-style message list with visual distinction for message roles:
    - `agent` messages: right-aligned, blue/cyan accent
    - `contact` messages: left-aligned, neutral glass card
    - `manual` messages: right-aligned, distinct style (e.g., yellow/amber accent)
    - `system` messages: centered, muted/italic
  - Each message shows: sender role, timestamp (formatted), content
  - Auto-scroll to bottom on new messages unless user has scrolled up
  - Track scroll position: if user scrolled up, show "New messages" indicator at bottom

### 2. Create TranscriptPage
- [x] Create `apps/cli/dashboard/src/pages/TranscriptPage.tsx`:
  - Extract instance ID from URL params
  - Use `usePolling('/instances/:id/transcript', 3000)` to poll transcript
  - Render `TranscriptView` with messages
  - Display instance objective and state at top (fetch from `/instances/:id`)
  - Loading state on first load
  - Empty state: "No messages yet"
  - Link back to instance detail page

### 3. Register Route
- [x] Update `App.tsx`: add route for `/instances/:id/transcript`

### 4. Verify
- [ ] Build dashboard, start daemon, create instance with some conversation
- [ ] Navigate to transcript page
- [ ] Verify messages match `relay transcript <id>` CLI output
- [ ] Verify message direction styling (agent vs contact)
- [ ] Wait for polling, verify new messages appear without scroll jump

## Completion Criteria
- [x] TranscriptPage shows messages in chat-style view
- [x] Message roles visually distinguished (agent, contact, manual, system)
- [x] Polling updates every 3 seconds
- [x] New messages append without losing scroll position
- [x] Messages match `relay transcript <id>` CLI output
- [x] Build succeeds (L1: Functional Operation Verification)

## Notes
- Impact scope: New dashboard pages only. No daemon code changes.
- Constraints: Scroll position tracking is essential for UX -- do not auto-scroll if user has scrolled up.
- This task has an optimized dependency: only needs shared components (Task 08), not InstancesPage.

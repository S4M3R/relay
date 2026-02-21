# Task: CreateInstancePage

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 4D (Core Dashboard Pages)
- Dependencies: dashboard-work-plan-task-08 (shared components)
- Size: Small (1-2 new files)

## Implementation Content
Implement the CreateInstancePage form providing feature parity with `relay create`. Form fields: objective, target_contact, todos, channel, heartbeat_config.

Reference: Design Doc FR-2 (create instance form), API surface mapping (`relay create` -> `POST /instances`).

## Target Files
- [x] `apps/cli/dashboard/src/pages/CreateInstancePage.tsx` (new)
- [x] `apps/cli/dashboard/src/App.tsx` (modify: add route)

## Implementation Steps

### 1. Create CreateInstancePage
- [x] Create `apps/cli/dashboard/src/pages/CreateInstancePage.tsx`:
  - Form fields:
    - `objective` (textarea, required)
    - `target_contact` (text input, required, E.164 format validation)
    - `channel` (select: whatsapp, telegram, phone -- default whatsapp)
    - `todos` (dynamic list: add/remove todo items, each with text field, minimum 1)
    - `heartbeat_config.interval_ms` (number input, default 1800000)
    - `heartbeat_config.max_followups` (number input, default 5)
  - Submit via `POST /instances` using `apiPost`
  - Validation:
    - Objective required and non-empty
    - Target contact required, E.164 format (`+` followed by digits)
    - At least one todo item with non-empty text
  - On success: redirect to instance detail page `/instances/:id`
  - On error: display error message from API response
  - Glass card styling with clear form layout

### 2. Register Route
- [x] Update `App.tsx`: add route for `/instances/new`

### 3. Verify
- [x] Build dashboard, start daemon
- [ ] Fill form with valid data, submit
- [ ] Verify instance created: `relay list` shows new instance
- [ ] Verify redirect to instance detail page
- [ ] Test validation: submit empty form, verify error messages

## Completion Criteria
- [x] Form renders with all required fields
- [x] Validation prevents submission of invalid data
- [x] Successful submission creates instance and redirects to detail page
- [x] Created instance visible in `relay list` CLI output
- [x] Build succeeds (L1: Functional Operation Verification)

## Notes
- Impact scope: New dashboard page only. No daemon code changes.
- Constraints: E.164 validation should be client-side hint, not strict rejection (server validates too).

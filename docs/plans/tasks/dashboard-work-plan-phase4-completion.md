# Phase 4 Completion: Core Dashboard Pages

Plan: dashboard-work-plan.md
Tasks in Phase: dashboard-work-plan-task-08, dashboard-work-plan-task-09, dashboard-work-plan-task-10, dashboard-work-plan-task-11

## Task Completion Checklist
- [ ] Task 08: Shared components and utilities
- [ ] Task 09: StatusPage
- [ ] Task 10: InstancesPage + InstanceDetailPage
- [ ] Task 11: CreateInstancePage

## Phase Completion Criteria
- [ ] API client handles auth token lifecycle (extract from URL, store in sessionStorage, send as Bearer)
- [ ] Polling hook correctly polls at configured intervals, pauses on hidden tab
- [ ] StatusPage displays daemon status with 5-second polling
- [ ] InstancesPage lists all instances with state/channel badges
- [ ] InstanceDetailPage shows full instance data with working Pause/Resume/Cancel/Send actions
- [ ] CreateInstancePage form submits and creates instances
- [ ] Navigation sidebar links to all pages
- [ ] Build succeeds: `npm run build` from `apps/cli/`

## E2E Verification Procedures
1. Build and start daemon: `cd apps/cli && npm run build && relay start`
2. Open dashboard: `relay dashboard`
3. Verify StatusPage: compare displayed values with `relay status` output
4. Create an instance via dashboard form, verify it appears in `relay list`
5. Navigate to instance detail, verify state badge and data match `relay get <id>`
6. Click Pause on an active instance, verify state changes to PAUSED
7. Click Resume, verify state returns to previous
8. Send a message from the detail page, verify it appears in `relay transcript <id>`
9. Verify polling: wait 5+ seconds on status page, confirm uptime updates

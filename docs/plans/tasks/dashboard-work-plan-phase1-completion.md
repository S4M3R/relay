# Phase 1 Completion: Server Foundation Refactoring

Plan: dashboard-work-plan.md
Tasks in Phase: dashboard-work-plan-task-01, dashboard-work-plan-task-02

## Task Completion Checklist
- [ ] Task 01: Remove hardcoded Content-Type from server.ts
- [ ] Task 02: Baseline verification of existing API endpoints

## Phase Completion Criteria
- [ ] `server.ts` no longer sets a global Content-Type header
- [ ] All 16 existing CLI commands work identically (verified via manual testing)
- [ ] All API responses still return `Content-Type: application/json`
- [ ] `tsc` builds without errors

## E2E Verification Procedures
1. Start daemon: `relay start`
2. Run: `curl -v http://127.0.0.1:3214/status` -- verify `Content-Type: application/json` header present, JSON body returned
3. Run: `curl -v -X POST -H "Content-Type: application/json" -d '{}' http://127.0.0.1:3214/instances` -- verify error response has correct Content-Type
4. Run: `relay list` -- verify JSON output
5. Run: `relay status` -- verify daemon status output unchanged

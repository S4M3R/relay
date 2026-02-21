# Task: Baseline Verification of Existing API Endpoints

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 1 (Server Foundation)
- Dependencies: dashboard-work-plan-task-01
- Size: Small (0 files -- verification only)

## Implementation Content
Run baseline verification of all existing API endpoints after the Content-Type removal in Task 01. This confirms zero behavioral regression before proceeding with auth and static serving work.

## Target Files
- No files modified (verification-only task)

## Implementation Steps

### 1. Start Daemon
- [ ] Build: `cd apps/cli && npx tsc`
- [ ] Start daemon: `node dist/index.js start` (or `relay start` if linked)

### 2. Verify JSON Content-Type on All Endpoints
- [ ] `curl -v http://127.0.0.1:3214/status` -- verify `Content-Type: application/json` header present, JSON body returned
- [ ] `curl -v http://127.0.0.1:3214/instances` -- verify Content-Type and JSON array
- [ ] `curl -v -X POST -H "Content-Type: application/json" -d '{}' http://127.0.0.1:3214/instances` -- verify error response has Content-Type
- [ ] `curl -v http://127.0.0.1:3214/config` -- verify Content-Type and JSON
- [ ] `curl -v -X POST http://127.0.0.1:3214/nonexistent` -- verify 404 has Content-Type: application/json

### 3. Verify CLI Commands
- [ ] `relay status` -- verify daemon status output
- [ ] `relay list` -- verify instance list output

### 4. Commit
- [ ] Commit Task 01 + Task 02 together as a single atomic commit: "refactor: remove hardcoded Content-Type from server.ts"

## Completion Criteria
- [ ] All API responses still return `Content-Type: application/json` (L2: Manual Verification)
- [ ] All CLI commands work identically to before the change
- [ ] No behavioral regression detected

## Notes
- Impact scope: This verifies the change from Task 01 is safe
- Constraints: Do not modify any files. This is a verification-only task.
- Tasks 01 and 02 are committed together as a single commit since 02 is verification of 01.

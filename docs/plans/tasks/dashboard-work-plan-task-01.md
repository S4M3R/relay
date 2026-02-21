# Task: Remove Hardcoded Content-Type from server.ts

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 1 (Server Foundation)
- Dependencies: None
- Size: Small (1 file)

## Implementation Content
Remove the hardcoded `res.setHeader('Content-Type', 'application/json')` from `server.ts` line 69 so the server can serve non-JSON responses. This is the single prerequisite for all dashboard work.

Before removing, verify that `sendJson()` in `routes.ts` (lines 43-49) already sets `Content-Type: application/json` via `res.writeHead()`, and that `sendError()` delegates to `sendJson()`. Also verify that the error handlers in server.ts catch blocks already set Content-Type via `res.writeHead()`.

## Target Files
- [x] `apps/cli/src/daemon/server.ts` (modify: remove line 69)

## Implementation Steps

### 1. Verify Safety
- [x] Confirm `sendJson()` in `routes.ts` sets `Content-Type: application/json` via `res.writeHead()` (line 45-48)
- [x] Confirm `sendError()` calls `sendJson()` (line 52-58)
- [x] Confirm server.ts error handlers (lines 79-80, 85-86) set Content-Type via `res.writeHead()`

### 2. Implementation
- [x] Remove line 69 from `server.ts`: `res.setHeader('Content-Type', 'application/json');`
- [x] Remove the comment on line 68: `// Set JSON content type for all responses`

### 3. Build Verification
- [x] Run `cd apps/cli && npx tsc --noEmit` -- verify zero TypeScript errors

## Completion Criteria
- [x] `server.ts` no longer sets a global Content-Type header
- [x] TypeScript builds without errors (L3: Build Success Verification)
- [x] The `sendJson`, `sendError`, and catch block handlers all independently set Content-Type

## Notes
- Impact scope: All HTTP responses from the daemon. This is safe because every response path already sets Content-Type independently.
- Constraints: Do NOT modify `routes.ts` or any other file in this task.
- This is a minimal, atomic change designed for easy rollback via `git revert`.

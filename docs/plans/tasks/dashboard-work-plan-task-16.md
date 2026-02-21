# Task: Full E2E Verification + Quality Assurance

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 6 (Quality Assurance)
- Dependencies: All previous tasks (dashboard-work-plan-task-01 through dashboard-work-plan-task-15)
- Size: Small (0-2 files -- fixes only)

## Implementation Content
Full end-to-end verification, acceptance criteria audit, bundle size check, security verification, and final quality pass. Fix any issues discovered during verification.

Reference: Design Doc acceptance criteria FR-1 through FR-11, test strategy.

## Target Files
- No new files expected (fix files as needed if issues found)

## Implementation Steps

### 1. Acceptance Criteria Audit
- [ ] FR-1: `relay dashboard` generates token, prints URL, opens browser
- [ ] FR-2: Dashboard sidebar lists all operations; create/get/list/pause/resume/cancel/send all work
- [ ] FR-3: QR code renders as scannable image in browser, refreshes on new QR
- [ ] FR-4: Status polls every 5s, detail/transcript polls every 3s
- [ ] FR-5: Dashboard requires token (401 without), API backward compat (no header = pass through), invalid header = 401
- [ ] FR-6: Transcript page shows chat-style view with real-time polling
- [ ] FR-7: Message send from detail page works, disabled when state doesn't accept
- [ ] FR-8: Config page displays and saves configuration
- [ ] FR-9: Call page form submits to POST /call
- [ ] FR-10: Telegram login page triggers auth flow
- [ ] FR-11: SPA served under /dashboard/*, static assets with correct MIME types, API still returns JSON

### 2. Full E2E Workflow Test
- [ ] `relay start` -- daemon starts
- [ ] `relay dashboard` -- browser opens with token, dashboard loads
- [ ] StatusPage shows correct daemon info
- [ ] Create instance via dashboard form
- [ ] View instance in list, click to detail
- [ ] View transcript in real-time
- [ ] Pause instance, verify state change
- [ ] Resume instance, verify state change
- [ ] Send message from detail page
- [ ] Cancel instance, verify terminal state
- [ ] All existing CLI commands still work identically

### 3. Bundle Size Check
- [ ] Run `cd apps/cli/dashboard && npx vite build`
- [ ] Verify total gzipped output < 2MB (ADR kill criterion)
- [ ] Record actual bundle size

### 4. Quality Checks
- [ ] TypeScript strict mode passes for daemon: `cd apps/cli && npx tsc --noEmit`
- [ ] TypeScript strict mode passes for dashboard: `cd apps/cli/dashboard && npx tsc --noEmit`
- [ ] `npm run build` from `apps/cli/` succeeds cleanly
- [ ] No console errors in browser during dashboard usage (check DevTools)

### 5. Backward Compatibility Verification
- [ ] `relay status` -- works without auth headers
- [ ] `relay list` -- returns correct data
- [ ] `relay create` -- creates instance correctly
- [ ] `relay get <id>` -- returns instance data
- [ ] `relay transcript <id>` -- returns transcript
- [ ] `relay send <id> <msg>` -- sends message
- [ ] `relay pause <id>` -- pauses instance
- [ ] `relay resume <id>` -- resumes instance
- [ ] `relay cancel <id>` -- cancels instance
- [ ] `relay config` -- displays config
- [ ] Existing API responses have unchanged structure and Content-Type headers

### 6. Security Verification
- [ ] Dashboard rejected without token: `curl http://127.0.0.1:3214/dashboard/` returns 401
- [ ] Path traversal blocked: `curl -H "Authorization: Bearer <token>" "http://127.0.0.1:3214/dashboard/../../package.json"` returns 403
- [ ] API with invalid Authorization header: `curl -H "Authorization: Bearer invalid" http://127.0.0.1:3214/status` returns 401
- [ ] API without Authorization header: `curl http://127.0.0.1:3214/status` returns 200
- [ ] Content-Security-Policy header present on HTML responses
- [ ] Token not logged in daemon output

### 7. Fix Issues
- [ ] Fix any issues discovered during verification
- [ ] Re-run failed checks after fixes

## Completion Criteria
- [ ] All FR-1 through FR-11 acceptance criteria verified
- [ ] Full E2E workflow passes without errors
- [ ] Bundle size under 2MB gzipped
- [ ] TypeScript compiles with zero errors (strict mode) for both daemon and dashboard
- [ ] No regressions in existing CLI commands
- [ ] Security checks all pass (L1: Functional Operation Verification)

## Notes
- Impact scope: This is a verification task. Fixes should be minimal and targeted.
- Constraints: Do not introduce new features. Only fix regressions or missing requirements.
- If bundle size exceeds 2MB, investigate code splitting or dependency removal before proceeding.

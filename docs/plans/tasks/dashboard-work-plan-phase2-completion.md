# Phase 2 Completion: Auth Module + Static File Handler

Plan: dashboard-work-plan.md
Tasks in Phase: dashboard-work-plan-task-03, dashboard-work-plan-task-04, dashboard-work-plan-task-05

## Task Completion Checklist
- [ ] Task 03: Auth module (daemon/auth.ts)
- [ ] Task 04: Static file handler (daemon/static.ts)
- [ ] Task 05: Integrate auth + static into server.ts

## Phase Completion Criteria
- [ ] Auth module generates and validates tokens correctly
- [ ] Static file handler serves files with correct MIME types
- [ ] Path traversal attempts are blocked (403 response)
- [ ] SPA fallback routing works (non-file paths return index.html)
- [ ] Existing CLI commands continue to work without auth headers
- [ ] API requests with invalid Authorization header receive 401
- [ ] `tsc` builds without errors

## E2E Verification Procedures
1. Start daemon: `relay start`
2. Verify token endpoint: `curl http://127.0.0.1:3214/dashboard/token` -- returns `{"token":"...","expires":null}`
3. Verify auth required: `curl http://127.0.0.1:3214/dashboard/` -- returns 401
4. Verify auth works: `curl -H "Authorization: Bearer <token>" http://127.0.0.1:3214/dashboard/` -- returns HTML (or 500 if not built yet)
5. Verify backward compat: `curl http://127.0.0.1:3214/status` -- returns 200 (no auth required)
6. Verify invalid auth rejected: `curl -H "Authorization: Bearer invalid" http://127.0.0.1:3214/status` -- returns 401
7. Verify path traversal blocked: `curl -H "Authorization: Bearer <token>" "http://127.0.0.1:3214/dashboard/../../package.json"` -- returns 403

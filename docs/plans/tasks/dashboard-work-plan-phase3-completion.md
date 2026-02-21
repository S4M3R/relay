# Phase 3 Completion: Dashboard Build Pipeline + CLI Command

Plan: dashboard-work-plan.md
Tasks in Phase: dashboard-work-plan-task-06, dashboard-work-plan-task-07

## Task Completion Checklist
- [ ] Task 06: Vite + React scaffold (dashboard/)
- [ ] Task 07: Build pipeline integration + Dashboard CLI command

## Phase Completion Criteria
- [ ] `cd apps/cli/dashboard && npx vite build` produces static files in `apps/cli/dist/dashboard/`
- [ ] `npm run build` from `apps/cli/` runs both Vite and tsc successfully
- [ ] `relay dashboard` checks daemon liveness, retrieves token, prints URL, opens browser
- [ ] Dashboard loads in browser showing a minimal placeholder page
- [ ] `relay --help` lists the `dashboard` command
- [ ] `tsc` builds without errors

## E2E Verification Procedures
1. Build: `cd apps/cli && npm run build` -- verify both dashboard and tsc succeed
2. Check output: `ls apps/cli/dist/dashboard/` -- verify `index.html` and `assets/` directory exist
3. Start daemon: `relay start`
4. Run: `relay dashboard` -- verify URL printed, browser opens, dashboard loads
5. Verify dashboard page in browser shows at `http://127.0.0.1:3214/dashboard/`
6. Run: `relay --help` -- verify `dashboard` command listed

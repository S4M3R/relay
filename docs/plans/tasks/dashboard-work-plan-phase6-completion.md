# Phase 6 Completion: Quality Assurance

Plan: dashboard-work-plan.md
Tasks in Phase: dashboard-work-plan-task-16

## Task Completion Checklist
- [ ] Task 16: Full E2E verification + quality checks

## Phase Completion Criteria
- [ ] All FR-1 through FR-11 acceptance criteria checked off
- [ ] Full E2E workflow passes without errors
- [ ] Bundle size under 2MB gzipped
- [ ] TypeScript compiles with zero errors (strict mode)
- [ ] No regressions in existing CLI commands
- [ ] Security checks all pass

## E2E Verification Procedures
(Full E2E verification from Design Doc test strategy)

1. **Foundation**: `relay start` succeeds, `curl -v http://127.0.0.1:3214/status` returns JSON with correct Content-Type
2. **Auth + Static**: `curl http://127.0.0.1:3214/dashboard/` returns 401; `curl -H "Authorization: Bearer <token>" http://127.0.0.1:3214/dashboard/` returns HTML
3. **Feature Parity**: Each dashboard page verified against equivalent CLI command output
4. **Full Workflow**: Start daemon -> `relay dashboard` -> create instance -> view transcript -> pause/resume -> cancel; all via dashboard UI
5. **Backward Compat**: Run all 16 CLI commands, verify identical behavior to pre-dashboard baseline
6. **Security**: Token required for dashboard, path traversal blocked, CSP headers present, invalid auth rejected
7. **Bundle Size**: Total gzipped output < 2MB

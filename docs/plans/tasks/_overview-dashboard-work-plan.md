# Overall Design Document: Dashboard Command Implementation

Generation Date: 2026-02-21
Target Plan Document: dashboard-work-plan.md

## Project Overview

### Purpose and Goals
Add a `relay dashboard` CLI command that serves an embedded React-based web dashboard from the daemon's HTTP server at `127.0.0.1:3214/dashboard/*`. The dashboard provides visual feature parity with all 16 CLI commands, including interactive flows like WhatsApp QR code login, real-time transcript viewing, and instance lifecycle management.

### Background and Context
The relay-agent CLI currently requires memorizing 16 commands with their arguments. Monitoring conversations, reading transcripts, and managing instance lifecycle requires repeated CLI invocations with no visual overview. The daemon already runs an HTTP server on port 3214 using raw `node:http`, which provides a natural mounting point for an embedded web dashboard.

Key existing constraints:
- `server.ts` hardcodes `Content-Type: application/json` for ALL responses (line 69) -- must be refactored
- No authentication exists on the daemon API
- No bundler exists -- `tsc` is the only build tool
- No test framework configured -- all verification is manual

## Task Division Design

### Division Policy
Tasks are divided by vertical slice where possible, with horizontal foundation layers as prerequisites. Each task represents a single logical commit.

- **Phases 1-2** (Tasks 01-04): Horizontal foundation -- server refactoring, auth, static serving must be in place before any dashboard work
- **Phase 3** (Tasks 05-07): Vertical slice -- Vite scaffold, build pipeline, and CLI command are independently buildable but depend on Phase 2 for integration
- **Phase 4** (Tasks 08-11): Vertical slice per page -- each page is a self-contained commit after shared components
- **Phase 5** (Tasks 12-15): Vertical slice per page -- advanced pages building on shared components
- **Phase 6** (Task 16): Quality assurance

Verifiability level distribution:
- L1 (Functional Operation): Tasks 07, 11, 12, 13, 14, 15, 16
- L2 (Test/Manual Verification): Tasks 03, 04, 05, 08
- L3 (Build Success): Tasks 01, 02, 06, 09, 10

### Review Conditions Incorporated
1. **FR reference fix**: Phase 3 (Task 07) references FR-11 for serving architecture, not FR-6
2. **`relay init` (POST /init) coverage**: Task 15 (ConfigPage) explicitly includes `relay init` form triggering POST /init
3. **Optimized dependencies**: Task 12 (TranscriptPage) depends only on Task 08 (shared components), not on StatusPage/InstancesPage

### Inter-task Relationship Map
```
Task 01: Remove hardcoded Content-Type from server.ts
  |
Task 02: Baseline verification of existing endpoints
  |
  +---> Task 03: Auth module (daemon/auth.ts)
  +---> Task 04: Static file handler (daemon/static.ts)
  |       |
  +-------+
  |
Task 05: Integrate auth + static into server.ts
  |
  +---> Task 07: Dashboard CLI command (commands/dashboard.ts)
  |
Task 06: Vite + React scaffold (dashboard/) [parallel with Tasks 03-05]
  |
Task 08: Shared components and utilities (apiClient, usePolling, layout)
  |
  +---> Task 09: StatusPage
  +---> Task 10: InstancesPage + InstanceDetailPage
  +---> Task 11: CreateInstancePage
  +---> Task 12: TranscriptPage [depends on Task 08 only]
  |
Task 13: QR Code API endpoint + LoginPage
  |
Task 14: CallPage + TelegramLoginPage
  |
Task 15: ConfigPage (includes relay init / POST /init)
  |
Task 16: Phase 6 -- Full E2E verification + quality assurance
```

### Interface Change Impact Analysis
| Existing Interface | New Interface | Conversion Required | Corresponding Task |
|-------------------|---------------|-------------------|-------------------|
| `server.ts` global Content-Type | Per-handler Content-Type | Yes | Task 01 |
| No auth on any endpoint | Token validation middleware | Yes | Task 03, 05 |
| `parseJsonBody` for all requests | Skip for `/dashboard/*` GET | Yes | Task 05 |
| QR only in terminal | QR also via GET /api/login/qr | Additive | Task 13 |
| 16 CLI commands | 17 commands (+dashboard) | Additive | Task 07 |

### Common Processing Points
- **API client** (`dashboard/src/lib/api.ts`): Shared by all dashboard pages -- implemented in Task 08
- **usePolling hook** (`dashboard/src/hooks/usePolling.ts`): Shared by StatusPage, InstancesPage, InstanceDetailPage, TranscriptPage, LoginPage -- implemented in Task 08
- **StateBadge, ChannelBadge** components: Shared by InstancesPage and InstanceDetailPage -- implemented in Task 08
- **DashboardLayout**: Shared by all pages -- implemented in Task 08
- **Auth token lifecycle**: Implemented once in auth.ts (Task 03), consumed by server.ts (Task 05), dashboard.ts (Task 07), and api.ts (Task 08)

## Implementation Considerations

### Principles to Maintain Throughout
1. **Backward compatibility**: All 16 existing CLI commands must work identically at every phase
2. **No test framework**: All verification is manual (curl, CLI commands, browser inspection)
3. **Brand styling**: Dark #0a0a0a background, glass UI, JetBrains Mono, muted blue/cyan accents
4. **ESM + TypeScript strict mode**: Both daemon and dashboard code
5. **Implementation-first (Strategy B)**: No TDD cycle since no test framework exists

### Risks and Countermeasures
- Risk: Server refactoring breaks existing CLI commands
  Countermeasure: Minimal change (remove one line); verify `sendJson`/`sendError` already set Content-Type independently. Task 02 provides baseline verification.
- Risk: Dashboard bundle size exceeds 2MB gzipped
  Countermeasure: Monitor `vite build` output size. Verified in Task 16.
- Risk: Vite build conflicts with tsc build
  Countermeasure: Dashboard directory is self-contained with own package.json. `tsconfig.json` `rootDir: ./src` already excludes `dashboard/`.

### Impact Scope Management
- Allowed change scope: `apps/cli/src/daemon/server.ts`, `apps/cli/src/daemon/routes.ts`, `apps/cli/src/index.ts`, `apps/cli/package.json`, `apps/cli/src/whatsapp/connection.ts` (additive only), `apps/cli/src/daemon/entry.ts` (additive only)
- New directories: `apps/cli/dashboard/`, `apps/cli/src/commands/dashboard.ts`, `apps/cli/src/daemon/auth.ts`, `apps/cli/src/daemon/static.ts`
- No-change areas: State machine, agent session, storage layer, existing CLI commands, `apps/web/`, Telegram/ElevenLabs modules (except additive QR getter)

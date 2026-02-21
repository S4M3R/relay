# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

This is an npm workspaces monorepo with two apps: `apps/cli` (relay-agent) and `apps/web` (Next.js site).

```bash
# Development
npm run dev:cli          # Run CLI in dev mode (tsx)
npm run dev:web          # Run web in dev mode (next dev)

# Building
npm run build            # Build both apps (CLI + dashboard)
npm run build:cli        # Build CLI only (dashboard Vite build + tsc → dist/)
npm run build:web        # Build web only (next build)

# Dashboard
cd apps/cli && npm run build && node dist/index.js stop && node dist/index.js start
node dist/index.js dashboard   # Opens dashboard in browser

# Linting (web only)
cd apps/web && npx eslint .
```

There is no test framework configured. No shared packages exist between apps.

**IMPORTANT**: The daemon runs as a detached process. After ANY change to backend code (`apps/cli/src/`) or dashboard code (`apps/cli/dashboard/`), you MUST rebuild and restart the daemon for changes to take effect:
1. `cd apps/cli && npm run build`
2. `node dist/index.js stop`
3. `node dist/index.js start`

## Architecture

**relay-agent CLI** (`apps/cli/`) — A Node.js daemon that manages autonomous WhatsApp conversations via LLM agents.

- **Entry**: `src/index.ts` — Commander.js CLI with 17 commands (init, start, stop, create, list, get, send, transcript, pause, resume, cancel, status, login, call, telegram-login, config, dashboard)
- **Daemon**: HTTP server on `127.0.0.1:3214`. Routes in `src/daemon/routes.ts`, lifecycle in `src/daemon/entry.ts`
- **State Machine**: `src/engine/state-machine.ts` — Finite state machine governing conversation instance lifecycle. 11 states (CREATED → QUEUED → ACTIVE → WAITING_FOR_REPLY/WAITING_FOR_AGENT → COMPLETED/FAILED/ABANDONED). Terminal states trigger cleanup callbacks
- **Agent Session**: `src/agent/session.ts` — Dual-provider support (Anthropic + OpenAI). Tools: `send_message`, `mark_todo_item`, `end_conversation`, `request_human_intervention`. Uses dependency injection via `SessionDependencies` interface
- **WhatsApp**: `src/whatsapp/connection.ts` — Baileys library for WhatsApp Web. QR code auth flow, message send/receive
- **Dashboard**: `dashboard/` — Self-contained Vite + React app served by the daemon at `http://127.0.0.1:3214/dashboard/`. Ephemeral token auth (generated on daemon start). Pages: Status, Instances, Instance Detail, Create, Transcript, Login (QR), Config, Call, Telegram Login
- **Auth**: `src/daemon/auth.ts` — Token generation (crypto.randomBytes), timing-safe validation; `src/daemon/static.ts` — Static file serving with CSP headers and path traversal prevention
- **Storage**: lowdb JSON file stores in `.relay-agent/` directory — config, instances, transcripts
- **Types**: `src/types.ts` — Core data models (`ConversationInstance`, `StateEvent`, `InstanceState`, etc.)

**Web App** (`apps/web/`) — Next.js 16 landing page + fumadocs documentation site.

- **Landing Page**: `src/app/page.tsx` assembles sections from `src/components/landing/` (hero, features, security-model, summon, faq, cta, code-example)
- **Docs**: fumadocs-mdx integration. Content in `content/docs/`, source config in `source.config.ts`, path aliases `@/.source/*`
- **UI Components**: `src/components/ui/` — `glass-card.tsx` (backdrop-blur panels), `terminal-block.tsx` (code display)
- **Styling**: Tailwind CSS v4, dark-first design. Brand tokens in `src/app/globals.css`

## Key Conventions

- ESM modules throughout (NodeNext for CLI, Next.js for web)
- TypeScript strict mode in both apps
- CLI uses pino for logging
- Phone numbers in E.164 format
- Brand: dark theme (#0a0a0a bg), glass UI aesthetic, JetBrains Mono font, muted blue/cyan accents only

# Task: Create Auth Module (daemon/auth.ts)

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 2 (Auth + Static Serving)
- Dependencies: dashboard-work-plan-task-01
- Size: Small (1 new file)

## Implementation Content
Create `apps/cli/src/daemon/auth.ts` -- the ephemeral token authentication module. This module generates, stores, and validates tokens for dashboard access. The token is stored in a module-level variable (never persisted to disk) and regenerated on each daemon start.

Reference: Design Doc component 1 (Auth Module), FR-5 (Authentication), Auth Token API contract.

## Target Files
- [x] `apps/cli/src/daemon/auth.ts` (new file)

## Implementation Steps

### 1. Create Auth Module
- [x] Create `apps/cli/src/daemon/auth.ts` with the following exports:
  ```typescript
  import crypto from 'node:crypto';
  import type http from 'node:http';

  let token: string | null = null;

  export function generateToken(): string {
    token = crypto.randomBytes(32).toString('hex');
    return token;
  }

  export function getToken(): string | null {
    return token;
  }

  export function validateToken(candidate: string | null): boolean {
    if (!token || !candidate) return false;
    // Use timing-safe comparison to prevent timing attacks
    try {
      return crypto.timingSafeEqual(
        Buffer.from(candidate, 'utf-8'),
        Buffer.from(token, 'utf-8'),
      );
    } catch {
      return false;
    }
  }

  export function extractToken(req: http.IncomingMessage): string | null {
    // Try Authorization: Bearer <token> header first
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    // Try ?token= query parameter
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    return url.searchParams.get('token');
  }
  ```

### 2. Build Verification
- [x] Run `cd apps/cli && npx tsc --noEmit` -- verify zero TypeScript errors

## Completion Criteria
- [x] `auth.ts` exports `generateToken`, `getToken`, `validateToken`, `extractToken`
- [x] Token generation uses `crypto.randomBytes(32)` for 256-bit entropy
- [x] Token comparison uses `crypto.timingSafeEqual` to prevent timing attacks
- [x] Token extraction supports both `Authorization: Bearer` header and `?token=` query param
- [x] TypeScript builds without errors (L3: Build Success Verification)

## Notes
- Impact scope: New isolated module with no imports from existing code except Node.js builtins
- Constraints: Do NOT modify `server.ts` or any other existing file. Integration happens in Task 05.
- The token is ephemeral (memory-only, never persisted) -- valid only until daemon restart.

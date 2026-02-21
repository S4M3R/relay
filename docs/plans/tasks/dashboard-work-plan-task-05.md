# Task: Integrate Auth + Static Serving into server.ts

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 2 (Auth + Static Serving)
- Dependencies: dashboard-work-plan-task-03 (auth.ts), dashboard-work-plan-task-04 (static.ts)
- Size: Small (2 files modified)

## Implementation Content
Integrate the auth module and static file handler into the server.ts request chain. This wires up:
1. Token generation on daemon startup
2. `GET /dashboard/token` endpoint (auth-exempt)
3. `/dashboard/*` routing with token validation and static serving
4. Auth validation for API requests that include an Authorization header (backward compat: requests without header pass through)
5. Skip `parseJsonBody` for `/dashboard/*` GET requests

Reference: Design Doc server.ts refactoring plan, FR-5 (Authentication), FR-11 (Serving Architecture).

## Target Files
- [x] `apps/cli/src/daemon/server.ts` (modify: refactor createServer callback)
- [x] `apps/cli/src/daemon/entry.ts` (modify: generate token on startup)

## Implementation Steps

### 1. Modify server.ts
- [x] Add imports: `import { generateToken, getToken, validateToken, extractToken } from './auth.js';`
- [x] Add import: `import { handleDashboardRequest } from './static.js';`
- [x] In `startServer()`, after `setServerStartTime(startTime)`, add: `generateToken(); logger.info('Dashboard auth token generated');`
- [x] Refactor the `http.createServer` callback to match the Design Doc pattern:
  ```typescript
  const server = http.createServer(async (req, res) => {
    const urlPath = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`).pathname;

    // 1. Token retrieval endpoint -- auth-exempt (localhost-only is security boundary)
    if (urlPath === '/dashboard/token' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token: getToken(), expires: null }));
      return;
    }

    // 2. Dashboard static files -- auth required, no JSON body parsing
    if (urlPath.startsWith('/dashboard')) {
      const token = extractToken(req);
      if (!validateToken(token)) {
        logger.warn({ url: req.url }, 'Dashboard auth failed');
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const handled = await handleDashboardRequest(req, res, urlPath);
      if (handled) return;
    }

    // 3. API routes -- auth check for requests WITH Authorization header (backward compat)
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = extractToken(req);
      if (!validateToken(token)) {
        logger.warn({ url: req.url }, 'API auth failed');
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
    }

    // 4. Existing API routes (Content-Type set by sendJson/sendError in routes.ts)
    try {
      const body = await parseJsonBody(req);
      await handleRequest(req, res, body);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (message === 'Invalid JSON in request body') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON in request body' }));
        return;
      }
      logger.error({ error: message, url: req.url, method: req.method }, 'Unhandled server error');
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error', details: message }));
    }
  });
  ```

### 2. Build Verification
- [x] Run `cd apps/cli && npx tsc --noEmit` -- verify zero TypeScript errors

### 3. Manual Verification
- [ ] Start daemon, verify token endpoint: `curl http://127.0.0.1:3214/dashboard/token` returns `{"token":"...","expires":null}`
- [ ] Verify auth required: `curl http://127.0.0.1:3214/dashboard/` returns 401
- [ ] Verify backward compat: `curl http://127.0.0.1:3214/status` returns 200 (no auth required)
- [ ] Verify invalid auth rejected: `curl -H "Authorization: Bearer invalid" http://127.0.0.1:3214/status` returns 401
- [ ] Verify path traversal blocked: `curl -H "Authorization: Bearer <token>" "http://127.0.0.1:3214/dashboard/../../package.json"` returns 403

## Completion Criteria
- [x] Token generated on daemon startup
- [x] `GET /dashboard/token` returns token without auth
- [x] `/dashboard/*` requires valid token (401 without)
- [x] API requests without Authorization header pass through (backward compat)
- [x] API requests with invalid Authorization header get 401
- [x] Path traversal attempts blocked
- [x] TypeScript builds without errors (L2: Manual Verification)

## Notes
- Impact scope: `server.ts` request chain is the most critical integration point. All existing CLI commands must continue to work.
- Constraints: Do not modify `routes.ts`. The auth + static handling goes BEFORE the existing `handleRequest` call.
- `entry.ts` modification is optional -- token can be generated in `startServer()` directly.

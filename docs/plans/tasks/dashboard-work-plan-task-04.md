# Task: Create Static File Handler (daemon/static.ts)

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 2 (Auth + Static Serving)
- Dependencies: dashboard-work-plan-task-01
- Size: Small (1 new file)

## Implementation Content
Create `apps/cli/src/daemon/static.ts` -- the static file serving handler for the dashboard SPA. This module serves pre-built dashboard files from `dist/dashboard/` with correct MIME types, SPA fallback routing, path traversal prevention, CSP headers, and cache control.

Reference: Design Doc component 2 (Static File Handler), FR-11 (Serving Architecture), Static File Handler data contract.

## Target Files
- [x] `apps/cli/src/daemon/static.ts` (new file)

## Implementation Steps

### 1. Create Static File Handler
- [x] Create `apps/cli/src/daemon/static.ts` with the following:
  ```typescript
  import fs from 'node:fs';
  import path from 'node:path';
  import type http from 'node:http';
  import logger from '../utils/logger.js';

  const MIME_TYPES: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  };

  const CSP_HEADER = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';";

  function getDashboardDir(): string {
    // dist/dashboard/ is sibling to dist/daemon/ where this compiled file lives
    return path.resolve(import.meta.dirname, '..', 'dashboard');
  }

  export async function handleDashboardRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    urlPath: string,
  ): Promise<boolean> {
    const dashboardDir = getDashboardDir();

    // Strip /dashboard prefix to get the file path
    let filePath = urlPath.replace(/^\/dashboard\/?/, '/') || '/';
    if (filePath === '/') filePath = '/index.html';

    const resolvedPath = path.resolve(dashboardDir, '.' + filePath);

    // Path traversal prevention
    if (!resolvedPath.startsWith(dashboardDir)) {
      logger.warn({ urlPath, resolvedPath }, 'Path traversal attempt blocked');
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Forbidden' }));
      return true;
    }

    // Check if file exists
    const ext = path.extname(resolvedPath);
    let targetPath = resolvedPath;

    if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
      // SPA fallback: non-file paths serve index.html
      if (!ext || !MIME_TYPES[ext]) {
        targetPath = path.join(dashboardDir, 'index.html');
      } else {
        // Known extension but file doesn't exist -- 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
        return true;
      }
    }

    // Verify index.html exists (dashboard may not be built)
    if (!fs.existsSync(targetPath)) {
      logger.error({ dashboardDir }, 'Dashboard files not found. Run `npm run build:dashboard` first.');
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Dashboard not built. Run `npm run build` from apps/cli/' }));
      return true;
    }

    const targetExt = path.extname(targetPath);
    const mimeType = MIME_TYPES[targetExt] || 'application/octet-stream';
    const headers: Record<string, string> = { 'Content-Type': mimeType };

    // CSP header on HTML responses
    if (targetExt === '.html') {
      headers['Content-Security-Policy'] = CSP_HEADER;
      headers['Cache-Control'] = 'no-cache';
    }

    // Cache headers for content-hashed assets
    if (urlPath.includes('/assets/')) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    }

    const content = fs.readFileSync(targetPath);
    headers['Content-Length'] = String(content.length);
    res.writeHead(200, headers);
    res.end(content);

    logger.debug({ urlPath, mimeType }, 'Served dashboard file');
    return true;
  }
  ```

### 2. Build Verification
- [x] Run `cd apps/cli && npx tsc --noEmit` -- verify zero TypeScript errors

## Completion Criteria
- [x] `static.ts` exports `handleDashboardRequest`
- [x] MIME type map covers: `.html`, `.js`, `.css`, `.json`, `.svg`, `.png`, `.ico`, `.woff`, `.woff2`
- [x] SPA fallback: non-file paths serve `index.html`
- [x] Path traversal prevention: resolved path must be within dashboard build directory
- [x] CSP header set on HTML responses
- [x] Cache headers: assets/ get immutable, index.html gets no-cache
- [x] TypeScript builds without errors (L3: Build Success Verification)

## Notes
- Impact scope: New isolated module. Only imports `logger` from existing code.
- Constraints: Do NOT modify `server.ts` or any other existing file. Integration happens in Task 05.
- `import.meta.dirname` works in Node.js 20+ with ESM, which this project uses.

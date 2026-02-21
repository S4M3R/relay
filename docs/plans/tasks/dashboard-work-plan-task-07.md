# Task: Build Pipeline Integration + Dashboard CLI Command

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 3 (Dashboard Build Pipeline + CLI Command)
- Dependencies: dashboard-work-plan-task-05 (server integration), dashboard-work-plan-task-06 (Vite scaffold)
- Size: Small (3 files: 1 new, 2 modified)

## Implementation Content
1. Update `apps/cli/package.json` build scripts to include dashboard build before tsc.
2. Create `apps/cli/src/commands/dashboard.ts` -- the CLI command that checks daemon liveness, retrieves auth token, prints URL, and opens browser.
3. Register the command in `apps/cli/src/index.ts`.

Reference: Design Doc component 3 (Dashboard CLI Command), FR-1 (Dashboard Command), FR-11 (Serving Architecture -- NOT FR-6 as originally stated in the work plan).

## Target Files
- [x] `apps/cli/src/commands/dashboard.ts` (new)
- [x] `apps/cli/package.json` (modify: build scripts)
- [x] `apps/cli/src/index.ts` (modify: register command)

## Implementation Steps

### 1. Create Dashboard Command
- [x] Create `apps/cli/src/commands/dashboard.ts`:
  ```typescript
  import { Command } from 'commander';
  import { exec } from 'node:child_process';
  import { daemonRequest } from './client.js';

  export function registerDashboardCommand(program: Command): void {
    program
      .command('dashboard')
      .description('Open the web dashboard in your browser')
      .action(async () => {
        // 1. Check daemon liveness
        try {
          await daemonRequest('GET', '/status');
        } catch {
          console.error('Daemon not running. Run `relay start` first.');
          process.exit(1);
        }

        // 2. Retrieve auth token
        let token: string;
        try {
          const result = await daemonRequest('GET', '/dashboard/token') as { token: string };
          token = result.token;
        } catch (err) {
          console.error('Failed to retrieve dashboard token:', err);
          process.exit(1);
        }

        // 3. Build URL and open browser
        const url = `http://127.0.0.1:3214/dashboard/?token=${token}`;
        console.log(`Dashboard: ${url}`);

        // Platform-appropriate browser open
        const platform = process.platform;
        const cmd = platform === 'darwin' ? 'open' :
                     platform === 'win32' ? 'start' : 'xdg-open';
        exec(`${cmd} "${url}"`, (err) => {
          if (err) {
            console.log('Could not open browser automatically. Open the URL above manually.');
          }
        });
      });
  }
  ```

### 2. Update Package.json Build Scripts
- [x] In `apps/cli/package.json`, update scripts:
  ```json
  "scripts": {
    "dev": "tsx src/index.ts",
    "build:dashboard": "cd dashboard && npm install && npx vite build",
    "build": "npm run build:dashboard && tsc",
    "prepublishOnly": "npm run build",
    "start": "node dist/index.js"
  }
  ```

### 3. Register Command in index.ts
- [x] Add import: `import { registerDashboardCommand } from './commands/dashboard.js';`
- [x] Add registration: `registerDashboardCommand(program);` after `registerConfigCommand(program);`

### 4. Build and Verify
- [x] Run `cd apps/cli && npm run build` -- verify both dashboard and tsc succeed
- [x] Verify `apps/cli/dist/dashboard/index.html` exists
- [ ] Start daemon: `relay start`
- [ ] Run: `relay dashboard` -- verify URL printed, browser opens, dashboard loads
- [x] Run: `relay --help` -- verify `dashboard` command listed

## Completion Criteria
- [x] `relay dashboard` checks daemon liveness, retrieves token, prints URL, opens browser
- [x] `npm run build` from `apps/cli/` runs both Vite build and tsc successfully
- [ ] Dashboard loads in browser showing placeholder page at `http://127.0.0.1:3214/dashboard/`
- [x] `relay --help` lists the `dashboard` command
- [x] All existing CLI commands still work (L1: Functional Operation Verification)

## Notes
- Impact scope: Adds a new command to the CLI and modifies the build pipeline. Existing commands unchanged.
- Constraints: The `daemonRequest` function in `client.ts` is reused as-is. Do not modify `client.ts`.
- FR reference correction: The work plan incorrectly cited FR-6 for serving architecture. The correct reference is FR-11.

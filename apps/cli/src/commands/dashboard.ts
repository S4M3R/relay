import { Command } from 'commander';
import { exec } from 'node:child_process';
import { daemonRequest, handleDaemonError } from './client.js';

export function registerDashboardCommand(program: Command): void {
  program
    .command('dashboard')
    .description('Open the web dashboard in your browser')
    .action(async () => {
      // 1. Check daemon liveness
      try {
        await daemonRequest('GET', '/status');
      } catch (err) {
        handleDaemonError(err);
      }

      // 2. Retrieve auth token
      let token: string;
      try {
        const result = await daemonRequest<{ token: string }>('GET', '/dashboard/token');
        token = result.data.token;
      } catch (err) {
        handleDaemonError(err);
      }

      // 3. Build URL and open browser
      const url = `http://127.0.0.1:3214/dashboard/?token=${token!}`;
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

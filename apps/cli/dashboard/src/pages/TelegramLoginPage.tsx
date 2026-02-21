/**
 * Telegram bot connection status and setup instructions page.
 * Provides feature parity with `relay telegram login` CLI command.
 *
 * The Telegram login flow is token-based (BotFather token), not interactive
 * like the WhatsApp QR flow. The daemon does not expose a POST /telegram/login
 * endpoint -- bot tokens are configured via the CLI command directly.
 * This page shows current connection status and provides setup instructions.
 */

import { usePolling } from '../hooks/usePolling';

interface DaemonStatus {
  pid: number;
  uptime_seconds: number;
  whatsapp_connected: boolean;
  telegram_connected: boolean;
  active_instance_count: number;
  total_instance_count: number;
}

export default function TelegramLoginPage() {
  const { data: status, error: statusError } = usePolling<DaemonStatus>({
    endpoint: '/status',
    interval: 5000,
  });

  const connected = status?.telegram_connected ?? false;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-lg font-mono font-bold text-white/90 mb-6">
        Telegram Login
      </h1>

      {statusError && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm font-mono text-red-400">{statusError}</p>
        </div>
      )}

      {/* Connection Status */}
      <div className="rounded-lg border border-glass-border bg-glass p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`h-3 w-3 rounded-full ${
              connected
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                : 'bg-red-400/60'
            }`}
          />
          <span className="text-sm font-mono text-white/80">
            {connected ? 'Telegram Bot Connected' : 'Telegram Bot Not Connected'}
          </span>
        </div>

        {connected && (
          <p className="text-xs font-mono text-white/40">
            The Telegram bot is running and accepting messages. Users can message
            the bot directly to start interacting with relay instances configured
            for the Telegram channel.
          </p>
        )}

        {!connected && (
          <p className="text-xs font-mono text-white/40">
            No Telegram bot is currently connected. Follow the setup instructions
            below to connect a bot.
          </p>
        )}
      </div>

      {/* Setup Instructions */}
      <div className="rounded-lg border border-glass-border bg-glass p-6 space-y-5">
        <h2 className="text-sm font-mono font-medium text-white/70">
          Setup Instructions
        </h2>

        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="flex-shrink-0 h-5 w-5 rounded-full border border-glass-border bg-white/[0.05] flex items-center justify-center text-[10px] font-mono font-bold text-white/40">
              1
            </span>
            <div>
              <p className="text-xs font-mono text-white/70">
                Open Telegram and search for <span className="text-accent-cyan">@BotFather</span>
              </p>
              <p className="text-xs font-mono text-white/30 mt-1">
                BotFather is the official Telegram bot for creating and managing bots.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex-shrink-0 h-5 w-5 rounded-full border border-glass-border bg-white/[0.05] flex items-center justify-center text-[10px] font-mono font-bold text-white/40">
              2
            </span>
            <div>
              <p className="text-xs font-mono text-white/70">
                Send <span className="text-accent-cyan">/newbot</span> to create a new bot,
                or <span className="text-accent-cyan">/token</span> to get an existing bot's token
              </p>
              <p className="text-xs font-mono text-white/30 mt-1">
                Follow the prompts to set a name and username for your bot.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex-shrink-0 h-5 w-5 rounded-full border border-glass-border bg-white/[0.05] flex items-center justify-center text-[10px] font-mono font-bold text-white/40">
              3
            </span>
            <div>
              <p className="text-xs font-mono text-white/70">
                Copy the bot token and run the following CLI command:
              </p>
              <div className="mt-2 rounded-md border border-glass-border bg-white/[0.02] px-3 py-2">
                <code className="text-xs font-mono text-accent-cyan">
                  relay-agent telegram login --token &lt;YOUR_BOT_TOKEN&gt;
                </code>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex-shrink-0 h-5 w-5 rounded-full border border-glass-border bg-white/[0.05] flex items-center justify-center text-[10px] font-mono font-bold text-white/40">
              4
            </span>
            <div>
              <p className="text-xs font-mono text-white/70">
                Restart the daemon for the bot to connect
              </p>
              <div className="mt-2 rounded-md border border-glass-border bg-white/[0.02] px-3 py-2 space-y-1">
                <code className="block text-xs font-mono text-accent-cyan">
                  relay-agent stop
                </code>
                <code className="block text-xs font-mono text-accent-cyan">
                  relay-agent start
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-glass-border">
          <p className="text-xs font-mono text-white/30">
            The Telegram login flow requires CLI access because bot tokens are
            sensitive credentials that should not be transmitted through the browser.
            Once configured, the connection status will update automatically on this page.
          </p>
        </div>
      </div>
    </div>
  );
}

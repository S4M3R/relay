/**
 * StatusPage -- daemon health overview.
 * Polls GET /status every 5 seconds and renders daemon info,
 * connection indicators, instance summary, and system counters.
 */

import { usePolling } from '../hooks/usePolling';

interface DaemonStatus {
  pid: number;
  uptime_seconds: number;
  whatsapp_connected: boolean;
  telegram_connected: boolean;
  active_instance_count: number;
  total_instance_count: number;
  active_timer_count: number;
  session_count: number;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function ConnectionDot({ connected }: { connected: boolean }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        connected
          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
          : 'bg-red-400/60'
      }`}
    />
  );
}

function GlassCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-glass-border bg-glass backdrop-blur-xl p-5">
      <h2 className="text-xs font-mono font-semibold tracking-wider text-white/40 uppercase mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-glass-border last:border-b-0">
      <span className="text-xs font-mono text-white/50">{label}</span>
      <span className="text-sm font-mono text-white/90">{value}</span>
    </div>
  );
}

export default function StatusPage() {
  const { data, loading, error, refresh } = usePolling<DaemonStatus>({
    endpoint: '/status',
    interval: 5000,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm font-mono text-white/40 animate-pulse">
          Connecting to daemon...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-sm font-mono text-red-400">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="text-xs font-mono text-accent-cyan hover:text-accent-cyan/80 transition-colors underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-lg font-mono font-bold text-white/90">
        Daemon Status
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daemon info */}
        <GlassCard title="Daemon">
          <StatRow label="PID" value={data.pid} />
          <StatRow label="Uptime" value={formatUptime(data.uptime_seconds)} />
        </GlassCard>

        {/* Connections */}
        <GlassCard title="Connections">
          <StatRow
            label="WhatsApp"
            value={
              <span className="flex items-center gap-2">
                <ConnectionDot connected={data.whatsapp_connected} />
                <span className={data.whatsapp_connected ? 'text-emerald-400' : 'text-red-400/70'}>
                  {data.whatsapp_connected ? 'Connected' : 'Disconnected'}
                </span>
              </span>
            }
          />
          <StatRow
            label="Telegram"
            value={
              <span className="flex items-center gap-2">
                <ConnectionDot connected={data.telegram_connected} />
                <span className={data.telegram_connected ? 'text-emerald-400' : 'text-red-400/70'}>
                  {data.telegram_connected ? 'Connected' : 'Disconnected'}
                </span>
              </span>
            }
          />
        </GlassCard>

        {/* Instance summary */}
        <GlassCard title="Instances">
          <StatRow label="Active" value={data.active_instance_count} />
          <StatRow label="Total" value={data.total_instance_count} />
        </GlassCard>

        {/* System info */}
        <GlassCard title="System">
          <StatRow label="Active Timers" value={data.active_timer_count} />
          <StatRow label="Sessions" value={data.session_count} />
        </GlassCard>
      </div>
    </div>
  );
}
